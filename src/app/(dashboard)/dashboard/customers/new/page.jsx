'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, AlertCircle, Lightbulb } from 'lucide-react';
import { useMutation } from '@/hooks/useApi';
import { customersService } from '@/lib/services/customers.service';

const EMPTY_FORM = {
  name: '',
  companyName: '',
  phone: '',
  email: '',
  country: '',
  address: '',
  defaultCurrency: 'EGP',
  creditLimit: 0,
  allowCredit: false,
  status: 'active',
};

const COUNTRIES = ['الإمارات العربية المتحدة', 'المملكة العربية السعودية', 'مصر', 'قطر', 'الكويت'];
const CURRENCIES = [
  { value: 'EGP', label: 'EGP - Egyptian Pound' },
  { value: 'SAR', label: 'SAR - Saudi Riyal' },
  { value: 'AED', label: 'AED - UAE Dirham' },
  { value: 'USD', label: 'USD - US Dollar' },
];

export default function NewCustomerPage() {
  const router = useRouter();
  const createMut = useMutation((payload) => customersService.create(payload));
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.companyName.trim()) {
      setError('يرجى ملء الحقول الإجبارية (الاسم، اسم الشركة)');
      return;
    }

    try {
      const payload = {
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
      };

      const customer = await createMut.mutate(payload);
      router.push(`/customers/${customer.id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div dir="rtl" className="pb-20 max-w-4xl mx-auto px-4 lg:px-0">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#040814] mb-2">إضافة عميل جديد</h1>
          <p className="text-sm font-bold text-gray-400">Create a new client profile in the system</p>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={createMut.loading}
          className="flex items-center gap-2 bg-[#B08B3A] hover:bg-[#906c27] text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20 disabled:opacity-60"
        >
          {createMut.loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          إضافة عميل جديد
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-bold">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
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
                <select
                  className="px-3 py-3.5 bg-white border border-gray-200 rounded-l-xl focus:border-[#B08B3A] outline-none font-bold text-sm text-gray-500 border-r-0"
                >
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

          <p className="text-xs font-bold text-gray-400 flex items-center gap-2">
            <Lightbulb size={14} className="text-amber-500" /> سيتم استخدام هذه الإعدادات الافتراضية في الطلبات الجديدة
          </p>
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

        {/* Footer Actions */}
        <div className="flex items-center gap-4">
          <button
            type="button" onClick={() => router.back()}
            className="flex-1 py-3.5 rounded-xl border border-[#B08B3A] text-[#B08B3A] font-bold hover:bg-amber-50 transition-colors">
            إلغاء
          </button>
          <button
            type="submit" disabled={createMut.loading}
            className="flex-1 py-3.5 rounded-xl bg-[#B08B3A] hover:bg-[#906c27] text-white font-bold shadow-lg shadow-amber-500/20 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
            {createMut.loading && <Loader2 size={16} className="animate-spin" />}
            حفظ العميل
          </button>
        </div>

      </form>
    </div>
  );
}

const Field = ({ label, children }) => (
  <div className="space-y-2">
    <label className="block text-sm font-bold text-[#040814]">{label}</label>
    {children}
  </div>
);
