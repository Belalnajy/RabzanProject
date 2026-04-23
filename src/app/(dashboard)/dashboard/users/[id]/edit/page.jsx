'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '../../../../../../components/dashboard/Header';
import { Save, ChevronDown } from 'lucide-react';

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id;
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: '',
    status: 'active'
  });

  useEffect(() => {
    // TODO: Fetch existing user data using userId from /api/users/[id]
    // Mocking API response:
    setFormData({
      fullName: 'أحمد محمد علي',
      email: 'ahmed@company.com',
      username: 'ahmed.ali',
      phone: '100 123 4567',
      password: 'mypassword', // Normally passwords are not fetched, but kept empty unless changing
      confirmPassword: 'mypassword',
      role: 'admin',
      status: 'active'
    });
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Connect to backend API: PUT/PATCH /api/users/[id]
    console.log('Saving user changes...', formData);
    router.push('/dashboard/users');
  };

  return (
    <>
      <Header title="" subtitle="" variant="transparent" />

      <form onSubmit={handleSubmit} className="flex flex-col mb-12">
        {/* Page Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 mt-[-1rem]">
          <div>
            <h1 className="text-2xl font-black text-[#040814] mb-1">تعديل المستخدم</h1>
            <p className="text-sm font-bold text-gray-500">تعديل معلومات المستخدم</p>
          </div>
          <button 
            type="submit"
            className="flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#B08B3A] text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-sm focus:outline-none"
          >
            <Save size={18} strokeWidth={2.5} />
            حفظ التغييرات
          </button>
        </div>

        {/* Basic Info Section */}
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-8 mb-8">
          <h2 className="text-xl font-black text-[#040814] mb-8">المعلومات الأساسية</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#040814]">
                الاسم الكامل <span className="text-rose-500">*</span>
              </label>
              <input 
                type="text" 
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-right"
                required
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#040814]">
                البريد الإلكتروني <span className="text-rose-500">*</span>
              </label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-left"
                dir="ltr"
                required
              />
            </div>

            {/* Username */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#040814]">
                اسم المستخدم <span className="text-rose-500">*</span>
              </label>
              <input 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-left"
                dir="ltr"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#040814]">
                رقم الهاتف <span className="text-rose-500">*</span>
              </label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-left"
                dir="ltr"
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#040814]">
                كلمة المرور <span className="text-rose-500">*</span>
              </label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-left"
                dir="ltr"
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#040814]">
                تأكيد كلمة المرور <span className="text-rose-500">*</span>
              </label>
              <input 
                type="password" 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-left"
                dir="ltr"
              />
            </div>

            {/* Role Allocation */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-bold text-[#040814]">تخصيص الدور</label>
              <div className="relative">
                <select 
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-gray-500 outline-none cursor-pointer focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                >
                  <option value="">اختر الدور</option>
                  <option value="admin">مسؤول</option>
                  <option value="operations">عمليات</option>
                  <option value="accounting">محاسبة</option>
                </select>
                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

          </div>
        </div>

        {/* Status Control Section */}
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-8">
          <h2 className="text-xl font-black text-[#040814] mb-8">التحكم في الحالة</h2>
          
          <h3 className="text-base font-bold text-[#040814] mb-4">حالة المستخدم</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <label 
              className={`flex flex-col items-center justify-center p-6 rounded-2xl cursor-pointer border-2 transition-all ${
                formData.status === 'active' 
                ? 'border-emerald-500 bg-emerald-50/30' 
                : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <input 
                type="radio" 
                name="status" 
                value="active" 
                checked={formData.status === 'active'}
                onChange={handleInputChange}
                className="hidden"
              />
              <span className={`text-base font-black mb-1 ${formData.status === 'active' ? 'text-emerald-600' : 'text-[#040814]'}`}>
                نشط
              </span>
              <span className="text-xs font-bold text-gray-400">يمكنه الدخول للنظام واستخدام صلاحياته</span>
            </label>

            <label 
              className={`flex flex-col items-center justify-center p-6 rounded-2xl cursor-pointer border-2 transition-all ${
                formData.status === 'inactive' 
                ? 'border-[#040814] bg-gray-50' 
                : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <input 
                type="radio" 
                name="status" 
                value="inactive" 
                checked={formData.status === 'inactive'}
                onChange={handleInputChange}
                className="hidden"
              />
              <span className={`text-base font-black mb-1 ${formData.status === 'inactive' ? 'text-[#040814]' : 'text-[#040814]'}`}>
                غير نشط
              </span>
              <span className="text-xs font-bold text-gray-400">لا يمكنه الدخول للنظام</span>
            </label>

          </div>
        </div>

      </form>
    </>
  );
}
