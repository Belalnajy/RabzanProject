'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useApi, useMutation } from '@/hooks/useApi';
import { ordersService } from '@/lib/services/orders.service';
import {
  FileText,
  Clock,
  Download,
  Eye,
  Trash2,
  Upload,
  Plus,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  X,
  CreditCard,
  Percent,
  Wallet,
  Building,
  Image as ImageIcon,
  FileSpreadsheet,
  Coins,
  ShieldCheck,
  Settings,
  Truck,
  Search,
  Package,
  Info,
  ClipboardCheck,
  ChevronDown,
  User,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const ORDER_STAGES = [
  { name: 'عرض السعر', icon: FileText },
  { name: 'التعميد', icon: ShieldCheck },
  { name: 'وصول الحوالة', icon: Wallet },
  { name: 'التصنيع', icon: Settings },
  { name: 'تشييك', icon: ClipboardCheck },
  { name: 'شحن', icon: Truck },
  { name: 'سابر', icon: Search },
  { name: 'وصول الشحنة', icon: Package },
  { name: 'استلام العمولة', icon: Coins },
  { name: 'إغلاق', icon: CheckCircle },
];

/* ─── Stage requirements (shown in stage update modal) ─── */
const STAGE_REQUIREMENTS = {
  'التعميد': ['تم اعتماد عرض السعر', 'تم توقيع العقد'],
  'وصول الحوالة': ['تم تأكيد التعميد', 'تم إرسال الحوالة'],
  'التصنيع': ['تم استلام الحوالة', 'تم تأكيد المواصفات'],
  'تشييك': ['تم الانتهاء من التصنيع', 'تم تحديد شركة الشحن', 'تم إدخال رقم التتبع'],
  'شحن': ['تم اجتياز التشييك', 'تم تجهيز البضاعة للشحن'],
  'سابر': ['تم شحن البضاعة', 'تم استلام بوليصة الشحن'],
  'وصول الشحنة': ['تم اجتياز فحص سابر', 'تم التخليص الجمركي'],
  'استلام العمولة': ['تم تسليم البضاعة للعميل', 'تم تأكيد الاستلام'],
  'إغلاق': ['تم استلام العمولة بالكامل', 'تم إغلاق جميع المعاملات المالية'],
};

export default function OrderDetailsPage() {
  const { id } = useParams();
  const orderQuery = useApi(() => ordersService.getById(id), [id]);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [stageModalOpen, setStageModalOpen] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Forms
  const [paymentForm, setPaymentForm] = useState({
    type: 'دفعة أولى',
    amount: '',
    currency: 'EGP',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [stageForm, setStageForm] = useState({
    stage: '',
    reason: '',
  });

  const [fileToUpload, setFileToUpload] = useState(null);
  const [fileName, setFileName] = useState('');
  const [paymentProofFile, setPaymentProofFile] = useState(null);
  const [paymentPage, setPaymentPage] = useState(1);

  // Mutators
  const paymentMut = useMutation((data) => ordersService.addPayment(id, data));
  const stageMut = useMutation((data) => ordersService.updateStage(id, data));
  const fileMut = useMutation((file) =>
    ordersService.uploadAttachment(id, file),
  );

  useEffect(() => {
    if (orderQuery.data?.currentStage) {
      setStageForm((prev) => ({
        ...prev,
        stage: orderQuery.data.currentStage,
      }));
    }
  }, [orderQuery.data]);

  if (orderQuery.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B08B3A]"></div>
      </div>
    );
  }

  if (orderQuery.error || !orderQuery.data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">
        {orderQuery.error?.message || 'الطلب غير موجود'}
      </div>
    );
  }

  const order = orderQuery.data;
  const currentStageIndex = ORDER_STAGES.findIndex(
    (s) => s.name === order.currentStage,
  );

  // Stats
  const commissionReceived =
    order.transactions
      ?.filter((t) => t.paymentType === 'commission')
      ?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  // Handlers
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setActionError('');
    const typeMap = {
      'دفعة أولى': 'first_payment',
      'دفعة نهائية': 'final_payment',
      'عمولة': 'commission',
      'دفعة جزئية': 'partial_payment',
    };
    try {
      // Step 1: Create payment (JSON)
      const result = await paymentMut.mutate({
        amount: Number(paymentForm.amount),
        paymentType: typeMap[paymentForm.type] || 'first_payment',
        paymentDate: paymentForm.date,
        currency: order.currency,
        notes: paymentForm.notes || undefined,
      });

      // Step 2: Upload proof file if attached
      if (paymentProofFile && result?.newTransactionId) {
        await ordersService.uploadProof(id, result.newTransactionId, paymentProofFile);
      }

      setPaymentModalOpen(false);
      setPaymentForm({ type: 'دفعة أولى', amount: '', currency: 'EGP', date: new Date().toISOString().split('T')[0], notes: '' });
      setPaymentProofFile(null);
      setActionSuccess('تم إضافة الدفعة بنجاح');
      setTimeout(() => setActionSuccess(''), 4000);
      orderQuery.refetch();
    } catch (err) {
      setActionError(err?.message || 'حدث خطأ أثناء إضافة الدفعة');
    }
  };

  const handleStageSubmit = async (e) => {
    e.preventDefault();
    setActionError('');
    try {
      await stageMut.mutate({
        newStage: stageForm.stage,
        reason: stageForm.reason,
      });
      setStageModalOpen(false);
      setActionSuccess('تم تحديث المرحلة بنجاح');
      setTimeout(() => setActionSuccess(''), 4000);
      orderQuery.refetch();
    } catch (err) {
      setActionError(err?.response?.data?.message || err?.message || 'حدث خطأ أثناء تحديث المرحلة');
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!fileToUpload) return;
    setActionError('');
    try {
      await fileMut.mutate(fileToUpload);
      setFileModalOpen(false);
      setFileToUpload(null);
      setFileName('');
      setActionSuccess('تم رفع الملف بنجاح');
      setTimeout(() => setActionSuccess(''), 4000);
      orderQuery.refetch();
    } catch (err) {
      setActionError(err?.response?.data?.message || err?.message || 'حدث خطأ أثناء رفع الملف');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-10" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">
              طلب #{order.displayId}
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              {order.customer?.name || '—'}
              {order.product && ` - ${order.product.nameAr || order.product.name}`}
            </p>
          </div>
          <Link
            href={`/orders/${id}/edit`}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-[12px] font-bold text-sm hover:bg-gray-50 transition-colors shadow-sm">
            <Settings size={16} />
            تعديل الطلب
          </Link>
        </div>

        {/* Success / Error Banners */}
        {actionSuccess && (
          <div className="mb-6 flex items-center gap-3 bg-emerald-50 text-emerald-700 px-6 py-4 rounded-[16px] border border-emerald-100">
            <CheckCircle size={18} />
            <span className="font-bold text-sm">{actionSuccess}</span>
          </div>
        )}
        {actionError && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 text-red-700 px-6 py-4 rounded-[16px] border border-red-100">
            <AlertTriangle size={18} />
            <span className="font-bold text-sm">{actionError}</span>
            <button onClick={() => setActionError('')} className="mr-auto text-red-400 hover:text-red-600"><X size={16} /></button>
          </div>
        )}

        {/* Financial Overview */}
        <div className="mb-8 relative">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-black text-gray-900 mb-1">
                نظرة مالية شاملة
              </h2>
              <p className="text-xs text-gray-500">
                ملخص تفصيلي للمعاملات المالية للطلب
              </p>
            </div>
            <button
              onClick={() => setPaymentModalOpen(true)}
              className="flex items-center gap-2 bg-[#B08B3A] text-white px-5 py-2.5 rounded-[12px] font-bold text-sm hover:bg-[#9a7933] transition-colors shadow-sm">
              <Plus size={16} />
              إضافة دفعة جديدة
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <StatCard
              icon={<Wallet className="text-amber-500" size={24} />}
              title="إجمالي قيمة الطلب"
              value={Number(order.totalPrice).toLocaleString()}
              currency={order.currency}
              iconBg="bg-amber-50"
            />
            <StatCard
              icon={<CheckCircle className="text-green-500" size={24} />}
              title="المبلغ المدفوع"
              value={Number(order.totalPaid).toLocaleString()}
              currency={order.currency}
              iconBg="bg-green-50"
              valueColor="text-green-600"
            />
            <StatCard
              icon={<AlertTriangle className="text-red-500" size={24} />}
              title="المبلغ المتبقي"
              value={Number(order.remainingBalance).toLocaleString()}
              currency={order.currency}
              iconBg="bg-red-50"
              valueColor="text-red-600"
            />
            <StatCard
              icon={<Percent className="text-amber-500" size={24} />}
              title="إجمالي العمولة"
              value={Number(order.commissionAmount).toLocaleString()}
              currency={order.currency}
              iconBg="bg-amber-50"
              valueColor="text-amber-600"
            />
            <StatCard
              icon={<Coins className="text-purple-500" size={24} />}
              title="العمولة المستلمة"
              value={commissionReceived.toLocaleString()}
              currency={order.currency}
              iconBg="bg-purple-50"
              valueColor="text-purple-600"
            />
          </div>
        </div>

        {/* Payments Record */}
        <div className="mb-8 bg-white rounded-[24px] border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <Clock className="text-[#B08B3A]" size={20} />
            <h2 className="text-lg font-black text-gray-900">سجل الدفعات</h2>
          </div>
          <div className="p-6">
            {order.transactions?.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {order.transactions
                    .slice((paymentPage - 1) * 3, paymentPage * 3)
                    .map((tx) => (
                      <PaymentCard key={tx.id} tx={tx} currency={order.currency} />
                    ))}
                </div>
                {order.transactions.length > 3 && (
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                    <span className="text-xs font-bold text-gray-500">
                      عرض {(paymentPage - 1) * 3 + 1}-{Math.min(paymentPage * 3, order.transactions.length)} من {order.transactions.length} دفعة
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPaymentPage(p => Math.max(1, p - 1))}
                        disabled={paymentPage === 1}
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                        &lt;
                      </button>
                      <span className="text-xs font-bold text-gray-700 min-w-[60px] text-center">
                        {paymentPage} / {Math.ceil(order.transactions.length / 3)}
                      </span>
                      <button
                        onClick={() => setPaymentPage(p => Math.min(Math.ceil(order.transactions.length / 3), p + 1))}
                        disabled={paymentPage >= Math.ceil(order.transactions.length / 3)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                        &gt;
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm text-gray-400 font-bold py-4">
                لا توجد دفعات مسجلة حتى الآن
              </div>
            )}
          </div>
        </div>

        {/* Order Stages */}
        <div className="mb-8 bg-white rounded-[24px] border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <RefreshCw className="text-[#B08B3A]" size={20} />
              <h2 className="text-lg font-black text-gray-900">
                مراحل تنفيذ الطلب
              </h2>
            </div>
            <button
              onClick={() => setStageModalOpen(true)}
              className="flex items-center gap-2 bg-[#B08B3A] text-white px-4 py-2 rounded-[10px] font-bold text-xs hover:bg-[#9a7933] transition-colors shadow-sm">
              <RefreshCw size={14} />
              تحديث المرحلة
            </button>
          </div>
          <div className="p-10 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[800px] relative">
              <div className="absolute top-6 left-10 right-10 h-[2px] bg-gray-100 -z-10" />
              {ORDER_STAGES.map((stageObj, idx) => {
                const isPassed = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                const StageIcon = stageObj.icon;
                return (
                  <div
                    key={stageObj.name}
                    className="flex flex-col items-center gap-3 relative bg-white px-2">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-sm
                        ${
                          isPassed
                            ? 'bg-green-500'
                            : isCurrent
                              ? 'bg-[#B08B3A]'
                              : 'bg-gray-200 text-gray-400'
                        }
                      `}>
                      <StageIcon size={20} />
                    </div>
                    <span
                      className={`text-xs font-bold ${
                        isPassed
                          ? 'text-green-600'
                          : isCurrent
                            ? 'text-[#B08B3A]'
                            : 'text-gray-400'
                      }`}>
                      {stageObj.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Attachments */}
        <div className="mb-8 bg-white rounded-[24px] border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FileText className="text-[#B08B3A]" size={20} />
              <h2 className="text-lg font-black text-gray-900">المرفقات</h2>
            </div>
            <button
              onClick={() => setFileModalOpen(true)}
              className="flex items-center gap-2 bg-[#B08B3A] text-white px-4 py-2 rounded-[10px] font-bold text-xs hover:bg-[#9a7933] transition-colors shadow-sm">
              <Upload size={14} />
              رفع ملف جديد
            </button>
          </div>
          <div className="p-6 space-y-4">
            {order.attachments?.length > 0 ? (
              order.attachments.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-[16px] hover:border-[#B08B3A] transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[12px] bg-amber-50 flex items-center justify-center text-amber-500">
                      {file.fileName.endsWith('.pdf') ? (
                        <FileText size={24} />
                      ) : file.fileName.match(/\.(jpeg|jpg|png)$/) ? (
                        <ImageIcon size={24} />
                      ) : (
                        <FileSpreadsheet size={24} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-1">
                        {file.originalName || file.fileName}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                        <span>
                          {(file.fileSize / 1024 / 1024).toFixed(1)} MB
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>
                          منذ{' '}
                          {((new Date() - new Date(file.createdAt)) /
                            86400000) |
                            0}{' '}
                          أيام
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={`${API_URL.replace('/api', '')}/uploads/attachments/${file.fileName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100">
                      <Eye size={16} />
                    </a>
                    <a
                      href={`${API_URL.replace('/api', '')}/uploads/attachments/${file.fileName}`}
                      download={file.originalName || file.fileName}
                      className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100">
                      <Download size={16} />
                    </a>
                    <button className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 hover:text-white hover:bg-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-sm text-gray-400 font-bold">
                لا توجد مرفقات
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}

      {/* Payment Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[24px] shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-black text-gray-900">
                إضافة دفعة مالية جديدة
              </h3>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handlePaymentSubmit} className="p-6 space-y-5">
              <p className="text-xs text-gray-500 mb-2">
                أدخل تفاصيل الدفعة لتسجيلها في النظام
              </p>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  اختر الطلب
                </label>
                <div className="field-input text-gray-500 bg-gray-50 cursor-not-allowed select-none">
                  طلب #{order.displayId}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  نوع الدفعة
                </label>
                <div className="flex items-center gap-6">
                  {['دفعة أولى', 'دفعة نهائية', 'عمولة', 'دفعة جزئية'].map(
                    (type) => (
                      <label
                        key={type}
                        className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentType"
                          value={type}
                          checked={paymentForm.type === type}
                          onChange={(e) =>
                            setPaymentForm({
                              ...paymentForm,
                              type: e.target.value,
                            })
                          }
                          className="text-[#B08B3A] focus:ring-[#B08B3A]"
                        />
                        <span className="text-xs font-bold text-gray-600">
                          {type}
                        </span>
                      </label>
                    ),
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  المبلغ
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-1 top-1 bottom-1 flex items-center bg-gray-50 border-r border-gray-200 px-3 rounded-l-[11px]">
                    <span className="text-xs font-bold text-gray-600">
                      {order.currency}
                    </span>
                  </div>
                  <input
                    type="number"
                    value={paymentForm.amount}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, amount: e.target.value })
                    }
                    className="field-input !pl-16"
                    placeholder="0.00"
                    dir="ltr"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  تاريخ الدفع
                </label>
                <input
                  type="date"
                  value={paymentForm.date}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, date: e.target.value })
                  }
                  className="field-input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  رفع إثبات الدفع (صورة حوالة/إيصال)
                </label>
                <div className="border-2 border-dashed border-[#B08B3A]/30 rounded-[16px] p-6 flex flex-col items-center justify-center bg-[#B08B3A]/5 cursor-pointer hover:bg-[#B08B3A]/10 transition-colors">
                  <label className="cursor-pointer flex flex-col items-center w-full">
                    <Upload className="text-[#B08B3A] mb-3" size={28} />
                    {paymentProofFile ? (
                      <span className="text-sm font-bold text-green-600 mb-1">
                        {paymentProofFile.name}
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-[#B08B3A] mb-1">
                        اسحب وأفلت الملفات هنا أو انقر للاختيار
                      </span>
                    )}
                    <span className="text-xs text-gray-500 font-medium">
                      (PDF, JPG, PNG حتى 10MB)
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setPaymentProofFile(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  ملاحظات / رقم المرجع
                </label>
                <input
                  type="text"
                  value={paymentForm.notes}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, notes: e.target.value })
                  }
                  className="field-input"
                  placeholder="اكتب تفاصيل إضافية أو رقم الحوالة..."
                />
              </div>

              <div className="bg-green-50 rounded-[12px] p-4 text-xs font-bold text-gray-800 space-y-2">
                <div className="flex justify-between">
                  <span>المبلغ المضاف:</span>
                  <span>
                    {Number(paymentForm.amount || 0).toLocaleString()}{' '}
                    {order.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>المدفوع الجديد:</span>
                  <span>
                    {(
                      Number(order.totalPaid) + Number(paymentForm.amount || 0)
                    ).toLocaleString()}{' '}
                    {order.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>المتبقي بعد الدفع:</span>
                  <span>
                    {Math.max(
                      0,
                      Number(order.remainingBalance) -
                        Number(paymentForm.amount || 0),
                    ).toLocaleString()}{' '}
                    {order.currency}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  disabled={paymentMut.loading}
                  className="flex-1 bg-[#B08B3A] text-white py-3 rounded-[12px] font-bold text-sm hover:bg-[#9a7933] transition-colors disabled:opacity-50">
                  {paymentMut.loading ? 'جاري الحفظ...' : 'تأكيد الدفع'}
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="flex-1 bg-white border border-[#B08B3A] text-[#B08B3A] py-3 rounded-[12px] font-bold text-sm hover:bg-amber-50 transition-colors">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stage Modal */}
      {stageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[24px] shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-black text-gray-900">
                تحديث مرحلة الطلب
              </h3>
              <button
                onClick={() => setStageModalOpen(false)}
                className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleStageSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">المرحلة الحالية</label>
                <div className="flex justify-end">
                  <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                    {order.currentStage}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">اختيار المرحلة الجديدة</label>
                <div className="relative">
                  <select
                    value={stageForm.stage}
                    onChange={(e) => setStageForm({ ...stageForm, stage: e.target.value })}
                    className="field-input appearance-none cursor-pointer"
                    required>
                    <option value="" disabled>اختر المرحلة</option>
                    {ORDER_STAGES
                      .filter((s) => {
                        const sIdx = ORDER_STAGES.findIndex(st => st.name === s.name);
                        return sIdx > currentStageIndex;
                      })
                      .map((s) => (
                        <option key={s.name} value={s.name}>{s.name}</option>
                      ))}
                  </select>
                  <ChevronDown className="absolute left-4 top-3.5 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">سبب تغيير المرحلة</label>
                <textarea
                  value={stageForm.reason}
                  onChange={(e) => setStageForm({ ...stageForm, reason: e.target.value })}
                  className="field-input min-h-[100px] resize-none"
                  placeholder="اكتب سبب نقل الطلب إلى هذه المرحلة..."
                  required
                />
              </div>

              {/* Stage Requirements Checklist */}
              {stageForm.stage && STAGE_REQUIREMENTS[stageForm.stage] && (
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">متطلبات المرحلة</label>
                  <div className="space-y-2.5">
                    {STAGE_REQUIREMENTS[stageForm.stage].map((req, i) => (
                      <div key={i} className="flex items-center gap-2.5 justify-end">
                        <span className="text-sm font-bold text-gray-700">{req}</span>
                        <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  disabled={stageMut.loading}
                  className="flex-1 bg-[#B08B3A] text-white py-3 rounded-[12px] font-bold text-sm hover:bg-[#9a7933] transition-colors disabled:opacity-50">
                  {stageMut.loading ? 'جاري التحديث...' : 'تأكيد التحديث'}
                </button>
                <button
                  type="button"
                  onClick={() => setStageModalOpen(false)}
                  className="flex-1 bg-white border border-[#B08B3A] text-[#B08B3A] py-3 rounded-[12px] font-bold text-sm hover:bg-amber-50 transition-colors">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* File Modal */}
      {fileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[24px] shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-black text-gray-900">رفع ملف جديد</h3>
              <button
                onClick={() => setFileModalOpen(false)}
                className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleFileUpload} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">اسم الملف</label>
                <input
                  type="text"
                  value={fileName || (fileToUpload?.name || '')}
                  onChange={(e) => setFileName(e.target.value)}
                  className="field-input"
                  placeholder="Product_Specifications.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">المرفقات</label>
                <label className="border-2 border-dashed border-[#B08B3A]/30 rounded-[16px] p-8 flex flex-col items-center justify-center bg-[#B08B3A]/5 cursor-pointer hover:bg-[#B08B3A]/10 transition-colors">
                  <Upload className="text-[#B08B3A] mb-4" size={32} />
                  <span className="text-sm font-bold text-[#B08B3A] mb-1">
                    اسحب الملفات هنا أو اضغط للاختيار
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    (PDF, DOC, DOCX, XLS, XLSX, JPG, PNG حتى 10MB)
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files[0];
                      setFileToUpload(f);
                      if (f && !fileName) setFileName(f.name);
                    }}
                  />
                </label>
                {fileToUpload && (
                  <div className="mt-3 text-sm font-bold text-gray-700 bg-gray-50 p-3 rounded-[8px] flex justify-between">
                    <span>{fileToUpload.name}</span>
                    <button
                      type="button"
                      onClick={() => { setFileToUpload(null); setFileName(''); }}
                      className="text-red-500 hover:text-red-700">
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  disabled={fileMut.loading || !fileToUpload}
                  className="flex-1 bg-[#B08B3A] text-white py-3 rounded-[12px] font-bold text-sm hover:bg-[#9a7933] transition-colors disabled:opacity-50">
                  {fileMut.loading ? 'جاري الرفع...' : 'إضافة الملف'}
                </button>
                <button
                  type="button"
                  onClick={() => setFileModalOpen(false)}
                  className="flex-1 bg-white border border-[#B08B3A] text-[#B08B3A] py-3 rounded-[12px] font-bold text-sm hover:bg-amber-50 transition-colors">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  currency,
  iconBg,
  valueColor = 'text-gray-900',
}) {
  return (
    <div className="bg-white p-5 rounded-[20px] border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${iconBg}`}>
        {icon}
      </div>
      <h3 className="text-xs font-bold text-gray-500 mb-1">{title}</h3>
      <div className={`text-xl font-black ${valueColor}`} dir="ltr">
        {value}{' '}
        <span className="text-xs font-bold text-gray-400 ml-1">{currency}</span>
      </div>
    </div>
  );
}

function PaymentCard({ tx, currency }) {
  return (
    <div className="min-w-[320px] bg-white border border-gray-100 rounded-[20px] p-5 shadow-sm flex flex-col justify-between">
      {/* Top Row: Status and Date */}
      <div className="flex justify-between items-center mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          tx.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
        }`}>
          {tx.status === 'pending' ? 'قيد الانتظار' : 'مكتمل'}
        </span>
        <span className="text-xs font-bold text-gray-400">
          {new Date(tx.createdAt).toLocaleDateString('ar-EG', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </span>
      </div>

      {/* Middle Row: Amount, Type, and PDF Icon */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-2xl font-black text-green-500 mb-2" dir="ltr">
            {Number(tx.amount).toLocaleString()} {currency}
          </div>
          <span className="inline-block px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-[10px] font-bold border border-gray-100">
            {tx.paymentType === 'commission' ? 'من العمولة' : 'من الطلب الرئيسي'}
          </span>
        </div>
        <div className="w-14 h-14 bg-amber-500 rounded-[14px] flex flex-col items-center justify-center text-white shadow-sm">
          <FileText size={24} className="mb-0.5" />
          <span className="text-[10px] font-black">PDF</span>
        </div>
      </div>

      {/* Bottom Row: User and TRX */}
      <div className="flex justify-between items-center text-xs font-bold text-gray-400 mb-5">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
            <User size={12} className="text-gray-400" />
          </span>
          {tx.addedBy?.fullName || tx.addedBy?.name || '—'}
        </div>
        <div className="font-mono text-[10px]">
          {tx.displayId || tx.referenceNumber || `TRX-${tx.id.slice(0, 8)}`} - تحويل بنكي
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        {tx.proofFile ? (
          <>
            <a
              href={`${API_URL.replace('/api', '')}/uploads/proofs/${tx.proofFile}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#B08B3A] text-white py-2.5 rounded-[12px] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#9a7933] transition-colors">
              عرض الإيصال
            </a>
            <a
              href={`${API_URL.replace('/api', '')}/uploads/proofs/${tx.proofFile}`}
              download
              className="flex-1 border border-[#B08B3A] text-[#B08B3A] py-2.5 rounded-[12px] text-xs font-bold hover:bg-amber-50 transition-colors flex items-center justify-center">
              تحميل PDF
            </a>
          </>
        ) : (
          <>
            <button disabled className="flex-1 bg-gray-200 text-gray-400 py-2.5 rounded-[12px] text-xs font-bold cursor-not-allowed">
              لا يوجد إيصال
            </button>
            <button disabled className="flex-1 border border-gray-200 text-gray-400 py-2.5 rounded-[12px] text-xs font-bold cursor-not-allowed">
              تحميل PDF
            </button>
          </>
        )}
      </div>
    </div>
  );
}
