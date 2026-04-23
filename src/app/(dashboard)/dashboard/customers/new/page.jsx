'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../../../components/dashboard/Header';
import { 
  Plus, 
  ChevronDown, 
  User, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  DollarSign, 
  Info, 
  CheckCircle2, 
  XCircle,
  AlertCircle
} from 'lucide-react';

export default function NewCustomerPage() {
  const router = useRouter();
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    countryCode: '+20 EG',
    email: '',
    country: '',
    address: '',
    currency: 'EGP - Egyptian Pound',
    creditLimit: '0',
    allowCredit: true,
    status: 'active' // 'active' or 'inactive'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting Customer Data:', formData);
    // TODO: Send data to /api/customers
    // router.push('/dashboard/customers');
  };

  return (
    <div dir="rtl" className="pb-20">
      {/* Header */}
      <Header title="إضافة عميل جديد" subtitle="Create a new client profile in the system" variant="card" />

      {/* Main Action (matching Figma's redundant button for pixel accuracy) */}
      <div className="mt-6 flex justify-start">
        <button className="flex items-center gap-2 bg-[#B08B3A] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-amber-500/10">
          <Plus size={18} strokeWidth={3} />
          إضافة عميل جديد
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8 max-w-5xl mx-auto">
        
        {/* ================= SECTION 1: BASIC INFO ================= */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
          <h3 className="text-xl font-black text-[#040814] mb-8 border-b border-gray-50 pb-4">المعلومات الأساسية</h3>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#040814] pr-1">اسم العميل *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="أحمد محمد علي" 
                  className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] transition-all outline-none font-bold text-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#040814] pr-1">اسم الشركة *</label>
                <input 
                  type="text" 
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="شركة النور للتجارة" 
                  className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] transition-all outline-none font-bold text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#040814] pr-1">رقم الهاتف *</label>
                <div className="flex gap-3">
                  <div className="relative w-32 shrink-0">
                    <select 
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] transition-all outline-none font-bold text-sm appearance-none cursor-pointer"
                    >
                      <option>+20 EG</option>
                      <option>+971 UAE</option>
                      <option>+966 SA</option>
                    </select>
                    <ChevronDown size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="100 123 4567" 
                    className="flex-1 px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] transition-all outline-none font-bold text-sm text-left"
                    dir="ltr"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#040814] pr-1 text-right">البريد الإلكتروني *</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="ahmed@company.com" 
                  className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] transition-all outline-none font-bold text-sm text-left"
                  dir="ltr"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#040814] pr-1">الدولة *</label>
              <div className="relative">
                <select 
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] transition-all outline-none font-bold text-sm appearance-none cursor-pointer"
                  required
                >
                  <option value="" disabled>اختر الدولة</option>
                  <option>مصر</option>
                  <option>الإمارات</option>
                  <option>السعودية</option>
                </select>
                <ChevronDown size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#040814] pr-1">العنوان الكامل *</label>
              <textarea 
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows="4" 
                placeholder="الشارع، المدينة، الرمز البريدي..." 
                className="w-full px-5 py-4 rounded-3xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] transition-all outline-none font-bold text-sm resize-none"
                required
              ></textarea>
            </div>
          </div>
        </div>

        {/* ================= SECTION 2: FINANCIAL SETTINGS ================= */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
          <h3 className="text-xl font-black text-[#040814] mb-8 border-b border-gray-50 pb-4">الإعدادات المالية</h3>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#040814] pr-1">العملة الافتراضية</label>
                <div className="relative">
                  <select 
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] transition-all outline-none font-bold text-sm appearance-none cursor-pointer"
                  >
                    <option>EGP - Egyptian Pound</option>
                    <option>USD - US Dollar</option>
                    <option>SAR - Saudi Riyal</option>
                  </select>
                  <ChevronDown size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#040814] pr-1 text-right">حد الائتمان</label>
                <input 
                  type="number" 
                  name="creditLimit"
                  value={formData.creditLimit}
                  onChange={handleInputChange}
                  placeholder="0" 
                  className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] transition-all outline-none font-bold text-sm text-left"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 group transition-all">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-[#040814]">السماح بالائتمان</h4>
                <p className="text-gray-400 text-xs font-bold leading-relaxed">السماح للعميل بتأجيل الدفع حسب شروط الائتمان</p>
              </div>
              <button 
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, allowCredit: !prev.allowCredit }))}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${formData.allowCredit ? 'bg-[#34C759]' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${formData.allowCredit ? '-translate-x-1' : '-translate-x-7'}`} />
              </button>
            </div>

            <div className="flex items-center gap-3 px-2">
              <div className="w-5 h-5 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                <Info size={14} />
              </div>
              <p className="text-gray-400 text-[11px] font-bold italic tracking-wide">سيتم استخدام هذه الإعدادات الافتراضية في الطلبات الجديدة</p>
            </div>
          </div>
        </div>

        {/* ================= SECTION 3: CLIENT STATUS ================= */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
          <h3 className="text-xl font-black text-[#040814] mb-8 border-b border-gray-50 pb-4">حالة العميل</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Active Card */}
            <div 
              onClick={() => setFormData(prev => ({ ...prev, status: 'active' }))}
              className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-2 group ${formData.status === 'active' ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-50 bg-gray-50/50 hover:border-gray-200'}`}
            >
              <CheckCircle2 size={32} className={`${formData.status === 'active' ? 'text-emerald-500' : 'text-gray-200 group-hover:text-gray-300'} transition-colors mb-2`} />
              <h4 className="text-lg font-black text-[#040814]">نشط</h4>
              <p className="text-gray-400 text-sm font-bold">يمكن إنشاء طلبات جديدة</p>
            </div>

            {/* Inactive Card */}
            <div 
              onClick={() => setFormData(prev => ({ ...prev, status: 'inactive' }))}
              className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-2 group ${formData.status === 'inactive' ? 'border-rose-500 bg-rose-50/30' : 'border-gray-50 bg-gray-50/50 hover:border-gray-200'}`}
            >
              <XCircle size={32} className={`${formData.status === 'inactive' ? 'text-rose-500' : 'text-gray-200 group-hover:text-gray-300'} transition-colors mb-2`} />
              <h4 className="text-lg font-black text-[#040814]">غير نشط</h4>
              <p className="text-gray-400 text-sm font-bold">لا يمكن إنشاء طلبات جديدة</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <button 
            type="button"
            onClick={() => router.back()}
            className="flex-1 max-w-[320px] py-4 rounded-2xl border border-gray-200 text-gray-500 font-bold hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
          >
            إلغاء
          </button>
          <button 
            type="submit"
            className="flex-1 max-w-[320px] py-4 rounded-2xl bg-[#B08B3A] text-white font-black hover:bg-[#906c27] transition-all active:scale-95 shadow-lg shadow-amber-500/20"
          >
            حفظ العميل
          </button>
        </div>

      </form>
    </div>
  );
}
