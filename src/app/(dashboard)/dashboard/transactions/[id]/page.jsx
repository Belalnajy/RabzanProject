'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/dashboard/Header';
import { LoadingState, ErrorState } from '@/components/dashboard/DataStates';
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  Receipt,
  AlertCircle,
  Loader2,
  X,
  User as UserIcon,
  Wallet,
  CreditCard,
  Clock,
} from 'lucide-react';
import { useApi, useMutation } from '@/hooks/useApi';
import { transactionsService } from '@/lib/services/transactions.service';

const PAYMENT_TYPE_LABELS = {
  first_payment: 'دفعة أولى',
  final_payment: 'دفعة نهائية',
  commission: 'عمولة',
  partial_payment: 'دفعة جزئية',
};

const STATUS_INFO = {
  confirmed: { label: 'مؤكد', icon: CheckCircle2, color: 'bg-emerald-100/60 text-emerald-600' },
  pending: { label: 'معلق', icon: Clock, color: 'bg-amber-100/60 text-amber-600' },
  voided: { label: 'ملغى', icon: XCircle, color: 'bg-rose-100/60 text-rose-600' },
};

const formatMoney = (n) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(Number(n) || 0);

const formatDateTime = (d) => {
  if (!d) return '—';
  const date = new Date(d);
  return `${date.toLocaleDateString('ar-EG')} ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
};

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const txQuery = useApi(() => transactionsService.getById(id), [id], { enabled: !!id });
  const [showVoid, setShowVoid] = useState(false);

  if (txQuery.loading) {
    return (
      <>
        <Header title="" subtitle="" variant="transparent" />
        <div className="mt-8"><LoadingState /></div>
      </>
    );
  }

  if (txQuery.error || !txQuery.data) {
    return (
      <>
        <Header title="" subtitle="" variant="transparent" />
        <div className="mt-8">
          <ErrorState error={txQuery.error || { message: 'المعاملة غير موجودة' }} onRetry={txQuery.refetch} />
        </div>
      </>
    );
  }

  const tx = txQuery.data;
  const order = tx.order;
  const statusInfo = STATUS_INFO[tx.status] || { label: tx.status, icon: Receipt, color: 'bg-gray-100 text-gray-600' };
  const StatusIcon = statusInfo.icon;

  const totalPrice = parseFloat(order?.totalPrice) || 0;
  const totalPaid = parseFloat(order?.totalPaid) || 0;
  const thisAmount = parseFloat(tx.amount) || 0;
  const paidBefore = totalPaid - thisAmount;
  const isClosed = totalPrice > 0 && totalPaid >= totalPrice;

  return (
    <>
      <Header title="" subtitle="" variant="transparent" />

      <div className="flex items-center justify-between mb-8 mt-[-1rem]">
        <button onClick={() => router.push('/dashboard/transactions')}
          className="flex items-center gap-2 text-gray-500 hover:text-[#040814] font-bold text-sm">
          <ArrowRight size={18} /> الرجوع للقائمة
        </button>
        <div className="flex items-center gap-3">
          {tx.status !== 'voided' && (
            <button onClick={() => setShowVoid(true)}
              className="flex items-center gap-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 px-5 py-3 rounded-xl font-bold text-sm">
              <XCircle size={16} /> إلغاء المعاملة
            </button>
          )}
        </div>
      </div>

      {/* Header card */}
      <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4 pb-6 border-b border-gray-50">
          <div>
            <p className="text-xs font-bold text-gray-400 mb-1">معرف العملية</p>
            <h2 className="text-3xl font-black text-[#040814]" dir="ltr">{tx.displayId}</h2>
            <p className="text-sm font-bold text-gray-500 mt-2">{PAYMENT_TYPE_LABELS[tx.paymentType] || tx.paymentType}</p>
          </div>
          <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${statusInfo.color}`}>
            <StatusIcon size={16} /> {statusInfo.label}
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <InfoItem icon={Wallet} label="المبلغ" value={`${tx.currency} ${formatMoney(tx.amount)}`} dir="ltr" />
          <InfoItem icon={Clock} label="تاريخ الدفع" value={formatDateTime(tx.paymentDate)} />
          <InfoItem icon={UserIcon} label="أُضيف بواسطة" value={tx.addedBy?.fullName || '—'} />
          <InfoItem icon={Clock} label="تاريخ الإنشاء" value={formatDateTime(tx.createdAt)} />
          {order && (
            <InfoItem icon={Receipt} label="رقم الطلب"
              value={<Link href={`/orders/${order.id}`} className="text-[#B08B3A] hover:underline" dir="ltr">{order.displayId}</Link>}
            />
          )}
          {tx.status === 'voided' && tx.voidReason && (
            <InfoItem icon={XCircle} label="سبب الإلغاء" value={tx.voidReason} />
          )}
        </div>

        {tx.notes && (
          <div className="mt-6 pt-6 border-t border-gray-50">
            <h4 className="text-sm font-bold text-gray-500 mb-2">ملاحظات</h4>
            <p className="text-[#040814] leading-relaxed">{tx.notes}</p>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-12">
        {/* Financial impact */}
        <Section title="التأثير المالي على الطلب">
          {!order ? <p className="text-gray-400 text-sm font-bold">لا يوجد طلب مرتبط</p> : (
            <div className="space-y-4">
              <SummaryRow label="إجمالي الطلب" value={`${order.currency} ${formatMoney(totalPrice)}`} />
              <SummaryRow label="المدفوع قبل" value={`${order.currency} ${formatMoney(paidBefore)}`} />
              <SummaryRow label="هذه الدفعة" value={`+${order.currency} ${formatMoney(thisAmount)}`} positive />
              <div className="pt-4 border-t border-gray-100">
                <SummaryRow label="المدفوع بعد" value={`${order.currency} ${formatMoney(totalPaid)}`} highlight />
              </div>
              {tx.paymentType === 'commission' && (
                <p className="text-xs text-purple-600 font-bold mt-2">⓵ دفعات العمولة لا تؤثر على رصيد الطلب الأساسي</p>
              )}
              {isClosed && tx.paymentType !== 'commission' && (
                <div className="flex items-center gap-2 mt-2 text-emerald-600">
                  <CheckCircle2 size={18} />
                  <span className="text-sm font-bold">هذه الدفعة أغلقت الطلب مالياً</span>
                </div>
              )}
            </div>
          )}
        </Section>

        {/* Customer & product */}
        <Section title="بيانات الطلب">
          {!order ? <p className="text-gray-400 text-sm font-bold">لا يوجد طلب مرتبط</p> : (
            <div className="space-y-3 text-sm">
              <Row label="رقم الطلب" value={order.displayId} dir="ltr" />
              {order.customer && (
                <>
                  <Row label="العميل" value={order.customer.name} />
                  <Row label="رقم العميل" value={order.customer.displayId || '—'} dir="ltr" />
                  <Row label="الدولة" value={order.customer.country || '—'} />
                </>
              )}
              {order.product && (
                <Row label="المنتج" value={order.product.nameAr || order.product.name} />
              )}
            </div>
          )}
        </Section>
      </div>

      {showVoid && (
        <VoidModal transaction={tx} onClose={() => setShowVoid(false)} onSuccess={() => { setShowVoid(false); txQuery.refetch(); }} />
      )}
    </>
  );
}

function VoidModal({ transaction, onClose, onSuccess }) {
  const mut = useMutation(({ id, reason }) => transactionsService.void(id, reason));
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!reason.trim()) return setError('سبب الإلغاء مطلوب');
    try {
      await mut.mutate({ id: transaction.id, reason: reason.trim() });
      onSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#040814]/60 backdrop-blur-sm z-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-[32px] w-full max-w-xl p-8 shadow-2xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-black text-[#040814]">إلغاء معاملة</h3>
            <p className="text-sm font-bold text-gray-400 mt-1" dir="ltr">{transaction.displayId}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-bold">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm font-bold">
            سيتم عكس المبلغ ({formatMoney(transaction.amount)} {transaction.currency}) من الطلب.
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#040814]">سبب الإلغاء</label>
            <textarea required rows={3}
              value={reason} onChange={(e) => setReason(e.target.value)}
              placeholder="اكتب سبب الإلغاء"
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] outline-none font-bold text-sm resize-none" />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-500 font-bold hover:bg-gray-50">
              إلغاء
            </button>
            <button type="submit" disabled={mut.loading}
              className="flex-[2] py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black shadow-lg shadow-rose-500/20 disabled:opacity-60 flex items-center justify-center gap-2">
              {mut.loading && <Loader2 size={18} className="animate-spin" />}
              تأكيد الإلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const Section = ({ title, children }) => (
  <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
    <h3 className="text-xl font-black text-[#040814] mb-6 pb-4 border-b border-gray-50">{title}</h3>
    {children}
  </div>
);

const InfoItem = ({ icon: Icon, label, value, dir }) => (
  <div className="flex items-start gap-3">
    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#B08B3A] shrink-0">
      <Icon size={18} />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-bold text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-black text-[#040814] truncate" dir={dir}>{value}</p>
    </div>
  </div>
);

const SummaryRow = ({ label, value, highlight, positive }) => (
  <div className="flex items-center justify-between">
    <span className={`font-bold text-sm ${highlight ? 'text-[#B08B3A]' : 'text-gray-500'}`}>{label}</span>
    <span className={`font-black ${highlight ? 'text-2xl text-[#B08B3A]' : positive ? 'text-base text-emerald-600' : 'text-base text-[#040814]'}`} dir="ltr">{value}</span>
  </div>
);

const Row = ({ label, value, dir }) => (
  <div className="flex items-center justify-between">
    <span className="text-gray-400 font-bold">{label}</span>
    <span className="text-[#040814] font-black" dir={dir}>{value}</span>
  </div>
);
