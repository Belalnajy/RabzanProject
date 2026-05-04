'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  FileEdit,
  Loader2,
  Package,
  Plus,
  Eye,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useApi, useMutation } from '@/hooks/useApi';
import { customersService } from '@/lib/services/customers.service';
import { LoadingState, ErrorState } from '@/components/dashboard/DataStates';

const STATUS_LABELS = {
  active: { label: 'نشط', style: 'bg-emerald-50 text-emerald-600' },
  inactive: { label: 'غير نشط', style: 'bg-slate-100 text-slate-500' },
};

const formatCurrency = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(n) || 0);

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const customerQuery = useApi(() => customersService.getById(id), [id], { enabled: !!id });
  const updateMut = useMutation((payload) => customersService.update(id, payload));
  const addNoteMut = useMutation((note) => customersService.addNote(id, note));

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [note, setNote] = useState('');

  const COUNTRIES = ['الإمارات العربية المتحدة', 'المملكة العربية السعودية', 'مصر', 'قطر', 'الكويت'];
  const CURRENCIES = [
    { value: 'EGP', label: 'EGP - Egyptian Pound' },
    { value: 'SAR', label: 'SAR - Saudi Riyal' },
    { value: 'AED', label: 'AED - UAE Dirham' },
    { value: 'USD', label: 'USD - US Dollar' },
  ];

  useEffect(() => {
    if (customerQuery.data) {
      setForm({
        name: customerQuery.data.name || '',
        companyName: customerQuery.data.companyName || '',
        phone: customerQuery.data.phone || '',
        email: customerQuery.data.email || '',
        country: customerQuery.data.country || '',
        address: customerQuery.data.address || '',
        defaultCurrency: customerQuery.data.defaultCurrency || 'EGP',
        creditLimit: customerQuery.data.creditLimit || 0,
        allowCredit: customerQuery.data.allowCredit || false,
        status: customerQuery.data.status || 'active',
      });
    }
  }, [customerQuery.data]);

  if (customerQuery.loading) {
    return (
      <div dir="rtl" className="p-8">
        <LoadingState />
      </div>
    );
  }

  if (customerQuery.error || !customerQuery.data) {
    return (
      <div dir="rtl" className="p-8">
        <ErrorState error={customerQuery.error || { message: 'العميل غير موجود' }} onRetry={customerQuery.refetch} />
      </div>
    );
  }

  const customer = customerQuery.data;
  const fin = customer.financials || {};
  const recentOrders = customer.recentOrders || [];
  const topProducts = customer.topProducts || [];
  const recentPayments = customer.recentPayments || [];
  const activityLogs = customer.activityLogs || [];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.name.trim() || !form.companyName.trim()) {
      setError('يرجى ملء الحقول الإجبارية (الاسم، اسم الشركة)');
      return;
    }

    try {
      await updateMut.mutate({
        name: form.name.trim(),
        companyName: form.companyName.trim(),
        phone: form.phone.trim() || undefined,
        email: form.email.trim() || undefined,
        country: form.country.trim() || undefined,
        address: form.address.trim() || undefined,
        defaultCurrency: form.defaultCurrency,
        creditLimit: Number(form.creditLimit) || 0,
        allowCredit: form.allowCredit,
        status: form.status,
      });
      setSuccess('تم حفظ التغييرات');
      setEditing(false);
      customerQuery.refetch();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    try {
      await addNoteMut.mutate(note);
      setNote('');
      customerQuery.refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const getInitials = (name) => {
    return name ? name.split(' ').slice(0, 2).map(n => n[0]).join('') : 'C';
  };

  return (
    <div dir="rtl" className="pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#040814] mb-1">تفاصيل العميل</h1>
          <p className="text-sm font-bold text-gray-400">إدارة تفاصيل وبيانات العميل</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 bg-[#B08B3A] hover:bg-[#906c27] text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20">
            <FileEdit size={16} /> تعديل
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* RIGHT COLUMN (Main Content) */}
        <div className="flex-1 w-full space-y-6">
          
          {/* Customer Main Info Card */}
          {editing ? (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm">
                <h3 className="text-xl font-black text-[#040814] mb-6">المعلومات الأساسية</h3>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <Field label="اسم العميل *">
                    <input
                      name="name" value={form.name} onChange={handleChange} required
                      placeholder="أحمد محمد علي"
                      className="w-full px-5 py-3.5 rounded-xl bg-white border border-gray-200 focus:border-[#B08B3A] outline-none font-bold text-sm"
                    />
                  </Field>
                  <Field label="اسم الشركة *">
                    <input
                      name="companyName" value={form.companyName} onChange={handleChange} required
                      placeholder="شركة النور للتجارة"
                      className="w-full px-5 py-3.5 rounded-xl bg-white border border-gray-200 focus:border-[#B08B3A] outline-none font-bold text-sm"
                    />
                  </Field>
                  <Field label="رقم الهاتف *">
                    <div className="flex" dir="ltr">
                      <select className="px-3 py-3.5 bg-white border border-gray-200 rounded-l-xl focus:border-[#B08B3A] outline-none font-bold text-sm text-gray-500 border-r-0">
                        <option>+20 EG</option>
                        <option>+966 SA</option>
                        <option>+971 AE</option>
                      </select>
                      <input
                        name="phone" value={form.phone} onChange={handleChange} required
                        placeholder="100 123 4567"
                        className="w-full px-5 py-3.5 rounded-r-xl bg-white border border-gray-200 focus:border-[#B08B3A] outline-none font-bold text-sm text-right"
                      />
                    </div>
                  </Field>
                  <Field label="البريد الإلكتروني *">
                    <input
                      type="email" name="email" value={form.email} onChange={handleChange} required dir="ltr"
                      placeholder="ahmed@company.com"
                      className="w-full px-5 py-3.5 rounded-xl bg-white border border-gray-200 focus:border-[#B08B3A] outline-none font-bold text-sm text-right"
                    />
                  </Field>
                </div>

                <Field label="الدولة *">
                  <select
                    name="country" value={form.country} onChange={handleChange} required
                    className="w-full px-5 py-3.5 rounded-xl bg-white border border-gray-200 focus:border-[#B08B3A] outline-none font-bold text-sm text-gray-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:left_1rem_center] bg-[length:1em]"
                  >
                    <option value="">اختر الدولة</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>

                <div className="mt-6">
                  <Field label="العنوان الكامل *">
                    <textarea
                      name="address" value={form.address} onChange={handleChange} required rows={2}
                      placeholder="الشارع، المدينة، الرمز البريدي..."
                      className="w-full px-5 py-3.5 rounded-xl bg-white border border-gray-200 focus:border-[#B08B3A] outline-none font-bold text-sm resize-none"
                    />
                  </Field>
                </div>
              </div>

              {/* Financial Settings */}
              <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm">
                <h3 className="text-xl font-black text-[#040814] mb-6">الإعدادات المالية</h3>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <Field label="العملة الافتراضية">
                    <select
                      name="defaultCurrency" value={form.defaultCurrency} onChange={handleChange}
                      className="w-full px-5 py-3.5 rounded-xl bg-white border border-gray-200 focus:border-[#B08B3A] outline-none font-bold text-sm text-gray-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:left_1rem_center] bg-[length:1em]"
                    >
                      {CURRENCIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </Field>
                  <Field label="حد الائتمان">
                    <input
                      type="number" name="creditLimit" value={form.creditLimit} onChange={handleChange} dir="ltr"
                      className="w-full px-5 py-3.5 rounded-xl bg-white border border-gray-200 focus:border-[#B08B3A] outline-none font-bold text-sm text-right"
                    />
                  </Field>
                </div>

                <div className="border border-gray-200 rounded-xl p-5 mb-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-[#040814] text-sm mb-1">السماح بالائتمان</h4>
                    <p className="text-xs font-bold text-gray-400">السماح للعميل بتأجيل الدفع حسب شروط الائتمان</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={form.allowCredit}
                      onChange={(e) => setForm({ ...form, allowCredit: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>

              {/* Client Status */}
              <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm">
                <h3 className="text-xl font-black text-[#040814] mb-6">حالة العميل</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, status: 'inactive' })}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      form.status === 'inactive' 
                      ? 'border-[#B08B3A] bg-amber-50/30' 
                      : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <h4 className="font-black text-[#040814] mb-2">غير نشط</h4>
                    <p className="text-xs font-bold text-gray-400">لا يمكن إنشاء طلبات جديدة</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, status: 'active' })}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      form.status === 'active' 
                      ? 'border-[#B08B3A] bg-amber-50/30' 
                      : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <h4 className="font-black text-[#040814] mb-2">نشط</h4>
                    <p className="text-xs font-bold text-gray-400">يمكن إنشاء طلبات جديدة</p>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button type="button" onClick={() => setEditing(false)}
                  className="flex-1 py-3.5 rounded-xl border border-[#B08B3A] text-[#B08B3A] font-bold hover:bg-amber-50 transition-colors">
                  إلغاء
                </button>
                <button type="submit" disabled={updateMut.loading}
                  className="flex-1 py-3.5 rounded-xl bg-[#B08B3A] hover:bg-[#906c27] text-white font-bold shadow-lg shadow-amber-500/20 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                  {updateMut.loading && <Loader2 size={16} className="animate-spin" />}
                  حفظ التعديلات
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm flex items-start gap-6">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-amber-500 text-white flex items-center justify-center text-xl font-black shrink-0 shadow-md">
                {getInitials(customer.name)}
              </div>
              
              {/* Info Grid */}
              <div className="flex-1">
                <div className="mb-6">
                  <h2 className="text-xl font-black text-[#040814] mb-1">{customer.name}</h2>
                  <p className="text-sm font-bold text-amber-500">{customer.companyName || 'العميل'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 mb-1">رقم الهاتف</p>
                    <p className="text-sm font-black text-[#040814]" dir="ltr">{customer.phone || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 mb-1">الدولة</p>
                    <p className="text-sm font-black text-[#040814]">{customer.country || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 mb-1">البريد الإلكتروني</p>
                    <p className="text-sm font-black text-[#040814]">{customer.email || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 mb-1">العنوان</p>
                    <p className="text-sm font-black text-[#040814]">{customer.address || '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Financial Summary */}
          <div>
            <h3 className="text-lg font-black text-[#040814] mb-4">الملخص المالي</h3>
            <div className="grid grid-cols-5 gap-4">
              <StatCard title="إجمالي الإيرادات" amount={fin.totalRevenue} color="text-emerald-500" iconBg="bg-emerald-100" />
              <StatCard title="المبلغ المدفوع" amount={fin.totalPaid} color="text-emerald-500" iconBg="bg-emerald-100" />
              <StatCard title="المديونية المعلقة" amount={fin.outstandingDebt} color="text-rose-500" iconBg="bg-rose-100" />
              <StatCard title="إجمالي العمولات" amount={fin.totalCommissions} color="text-amber-500" iconBg="bg-amber-100" />
              <StatCard title="العمولة المستلمة" amount={fin.receivedCommissions} color="text-purple-500" iconBg="bg-purple-100" />
            </div>
          </div>

          {/* Orders History */}
          <div>
            <h3 className="text-lg font-black text-[#040814] mb-4">سجل الطلبات</h3>
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold text-[11px]">
                    <tr>
                      <th className="px-6 py-4 rounded-tr-[24px]">رقم الطلب</th>
                      <th className="px-6 py-4">المنتجات</th>
                      <th className="px-6 py-4">الكمية</th>
                      <th className="px-6 py-4">المبلغ الإجمالي</th>
                      <th className="px-6 py-4">الحالة</th>
                      <th className="px-6 py-4">الأولوية</th>
                      <th className="px-6 py-4">التاريخ</th>
                      <th className="px-6 py-4 rounded-tl-[24px] text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-8 text-center text-gray-400 font-bold text-xs">لا توجد طلبات</td>
                      </tr>
                    ) : (
                      recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-black text-[#040814]">{order.displayId}</td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-[#040814]">{order.product?.nameAr || order.product?.name || '—'}</p>
                          </td>
                          <td className="px-6 py-4 font-bold text-[#040814]">{order.quantity || 1}</td>
                          <td className="px-6 py-4 font-black text-[#040814]" dir="ltr">{formatCurrency(order.totalPrice)}</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-600">
                              {order.currentStage || 'مكتمل'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-bold ${order.priority === 'urgent' || order.priority === 'high' ? 'text-rose-500' : 'text-gray-500'}`}>
                              {order.priority === 'urgent' ? 'عاجل جدًا' : order.priority === 'high' ? 'عاليه' : 'عادية'}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-500" dir="ltr">
                            {new Date(order.createdAt).toISOString().split('T')[0]}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Link href={`/orders/${order.id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-[#B08B3A] hover:bg-amber-50 transition-colors">
                              <Eye size={16} />
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination footer stub */}
              <div className="px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-400">Showing {recentOrders.length > 0 ? 1 : 0}-{recentOrders.length} of {fin.totalOrders} Orders</span>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50"><ChevronRight size={14} /></button>
                  <button className="w-8 h-8 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50"><ChevronLeft size={14} /></button>
                </div>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div>
            <h3 className="text-lg font-black text-[#040814] mb-4">المنتجات الأكثر طلبًا</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {topProducts.length === 0 ? (
                <div className="col-span-4 py-8 text-center bg-white rounded-[24px] border border-gray-100 shadow-sm text-gray-400 font-bold text-xs">
                  لا توجد منتجات مباعة
                </div>
              ) : (
                topProducts.map((p, i) => (
                  <div key={i} className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="h-32 bg-gray-50 relative">
                      {p.productImage ? (
                        <img src={p.productImage} alt={p.productName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Package size={32} />
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h4 className="font-black text-[#040814] text-sm mb-1 truncate">{p.productNameAr || p.productName}</h4>
                      <p className="font-bold text-gray-400 text-[10px] mb-3 truncate" dir="ltr">{p.productName}</p>
                      <div className="flex items-center justify-between mb-4 mt-auto">
                        <span className="text-[10px] font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">{p.orderCount}x</span>
                        <span className="text-[10px] font-bold text-gray-500">متوسط: {Math.round(p.avgQuantity || 1)}</span>
                      </div>
                      <Link href={`/dashboard/products/${p.productId}`} className="w-full py-2 bg-[#B08B3A] hover:bg-[#906c27] text-white text-xs font-bold rounded-xl text-center transition-colors">
                        عرض المنتج
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* LEFT COLUMN (Sidebar) */}
        <div className="w-full lg:w-[320px] flex-shrink-0 space-y-6">
          
          {/* Quick Actions */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-black text-[#040814] mb-4">إجراءات سريعة</h3>
            <div className="space-y-3">
              <Link href={`/orders/new?customer=${id}`} className="flex items-center justify-between px-4 py-3 bg-amber-50 text-amber-700 rounded-xl font-bold text-sm hover:bg-amber-100 transition-colors">
                <span>إضافة طلب جديد</span>
                <Plus size={16} />
              </Link>
              <Link href={`/orders?customer=${id}`} className="flex items-center justify-between px-4 py-3 bg-gray-50 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">
                <span>عرض جميع الطلبات</span>
                <Eye size={16} />
              </Link>
              <Link href={`/orders?customer=${id}`} className="flex items-center justify-between px-4 py-3 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-colors">
                <span>إضافة دفعة</span>
                <Plus size={16} />
              </Link>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm flex flex-col h-[400px]">
            <h3 className="text-lg font-black text-[#040814] mb-4 shrink-0">سجل النشاط</h3>
            
            <form onSubmit={handleAddNote} className="mb-4 shrink-0">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="إضافة ملاحظة داخلية..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold resize-none h-20 focus:bg-white focus:border-[#B08B3A] outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!note.trim() || addNoteMut.loading}
                className="w-full mt-2 bg-[#B08B3A] hover:bg-[#906c27] text-white py-2.5 rounded-xl font-bold text-sm shadow-md shadow-amber-500/20 transition-colors disabled:opacity-60">
                إضافة
              </button>
            </form>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
              {activityLogs.length === 0 ? (
                <p className="text-center text-xs font-bold text-gray-400 py-4">لا توجد أنشطة</p>
              ) : (
                activityLogs.map((log) => (
                  <div key={log.id} className="relative pl-4 border-r-2 border-amber-200 pr-3">
                    <div className="absolute w-2 h-2 bg-amber-400 rounded-full -right-[5px] top-1.5 ring-4 ring-white"></div>
                    <p className="text-xs font-bold text-[#040814] mb-1 leading-relaxed">
                      {log.user?.name ? `${log.user.name} ` : ''}
                      <span className="text-gray-500">{log.details || log.title}</span>
                    </p>
                    <p className="text-[10px] font-bold text-gray-400" dir="ltr">
                      {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Payments History */}
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden flex flex-col max-h-[400px]">
            <div className="p-6 border-b border-gray-50 shrink-0">
              <h3 className="text-lg font-black text-[#040814]">سجل الدفعات</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
              {recentPayments.length === 0 ? (
                <p className="text-center text-xs font-bold text-gray-400 py-8">لا توجد دفعات مسجلة</p>
              ) : (
                <div className="space-y-1">
                  {recentPayments.map((payment) => (
                    <div key={payment.id} className="p-4 hover:bg-gray-50 rounded-xl transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-gray-400">{payment.orderDisplayId}</span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-600">
                          {payment.status === 'confirmed' ? 'مكتمل' : payment.status}
                        </span>
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-sm font-black text-[#040814]" dir="ltr">{formatCurrency(payment.amount)}</p>
                          <p className="text-[10px] font-bold text-gray-400 mt-1 capitalize">
                            {payment.type === 'commission' ? 'عمولة' : payment.type.replace('_', ' ')}
                          </p>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400" dir="ltr">
                          {new Date(payment.date).toISOString().split('T')[0]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
              <span className="text-[10px] font-bold text-gray-400">Showing {recentPayments.length > 0 ? 1 : 0}-{recentPayments.length} payments</span>
              <div className="flex gap-1">
                <button className="w-6 h-6 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:bg-gray-50"><ChevronRight size={12} /></button>
                <button className="w-6 h-6 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:bg-gray-50"><ChevronLeft size={12} /></button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const Field = ({ label, children }) => (
  <div className="space-y-2">
    <label className="block text-sm font-bold text-[#040814]">{label}</label>
    {children}
  </div>
);

const StatCard = ({ title, amount, color, iconBg }) => (
  <div className="bg-white rounded-[20px] border border-gray-100 p-5 shadow-sm flex flex-col items-center justify-center text-center">
    <div className={`w-10 h-10 rounded-full ${iconBg} ${color} flex items-center justify-center mb-3`}>
      <CreditCard size={18} />
    </div>
    <p className="text-[11px] font-bold text-gray-400 mb-1">{title}</p>
    <p className={`text-sm font-black ${color}`} dir="ltr">{formatCurrency(amount)}</p>
  </div>
);
