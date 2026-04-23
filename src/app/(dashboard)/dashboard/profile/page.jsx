'use client';

import React, { useState } from 'react';
import Header from '../../../../components/dashboard/Header';
import { Save, User, Mail, Phone, Lock, Camera } from 'lucide-react';

// ==========================================
// MOCK DATA (API Ready)
// ==========================================
// TODO: Fetch user profile data from API (e.g. GET /api/profile)
const MOCK_PROFILE_DATA = {
  fullName: 'أحمد محمد',
  email: 'ahmed.mohamed@example.com',
  phone: '0501234567',
  username: 'ahmed_m',
  role: 'مدير النظام',
  initials: 'أ.م'
};

export default function ProfilePage() {
  // Form State
  const [profileData, setProfileData] = useState(MOCK_PROFILE_DATA);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // TODO: Send data to API: PUT /api/profile
    console.log('Saving profile info...', profileData);
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    // TODO: Send data to API: PUT /api/profile/password
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('كلمات المرور الجديدة غير متطابقة!');
      return;
    }
    console.log('Changing password...', passwordData);
  };

  return (
    <>
      <Header title="" subtitle="" variant="transparent" />

      {/* Page Header Area */}
      <div className="flex flex-col mb-8 mt-[-1rem]">
        <h1 className="text-2xl font-black text-[#040814] mb-1">الملف الشخصي</h1>
        <p className="text-sm font-bold text-gray-500">إدارة معلومات حسابك الشخصي وكلمة المرور</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        
        {/* Left Column: Personal Info */}
        <div className="flex-1 flex flex-col gap-8">
          
          <form onSubmit={handleSaveProfile} className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-black text-[#040814] mb-8">المعلومات الشخصية</h2>
            
            {/* Avatar Section */}
            <div className="flex items-center gap-6 mb-8 border-b border-gray-50 pb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-linear-to-tr from-[#B08B3A] to-[#F1D792] flex items-center justify-center text-[#040814] font-black text-3xl overflow-hidden shadow-sm">
                  <span>{profileData.initials}</span>
                </div>
                <button 
                  type="button"
                  className="absolute bottom-0 right-0 bg-white border border-gray-200 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors focus:outline-none"
                >
                  <Camera size={14} strokeWidth={2.5} />
                </button>
              </div>
              <div>
                <h3 className="text-lg font-black text-[#040814] mb-1">{profileData.fullName}</h3>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
                  {profileData.role}
                </span>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-black text-[#040814]">الاسم الكامل</label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleProfileChange}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 pr-11 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    required
                  />
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-black text-[#040814]">اسم المستخدم</label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="username"
                    value={profileData.username}
                    onChange={handleProfileChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 pr-11 text-sm font-bold text-gray-500 outline-none cursor-not-allowed"
                    disabled
                    dir="ltr"
                  />
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-black text-[#040814]">البريد الإلكتروني</label>
                <div className="relative">
                  <input 
                    type="email" 
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 pl-11 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-left"
                    dir="ltr"
                    required
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-black text-[#040814]">رقم الهاتف</label>
                <div className="relative">
                  <input 
                    type="tel" 
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 pl-11 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-left"
                    dir="ltr"
                    required
                  />
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                type="submit"
                className="flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#B08B3A] text-white px-8 py-3.5 rounded-xl font-bold transition-colors shadow-sm focus:outline-none"
              >
                <Save size={18} strokeWidth={2.5} />
                حفظ التغييرات
              </button>
            </div>
          </form>

        </div>

        {/* Right Column: Password & Security */}
        <div className="w-full lg:w-96 shrink-0 flex flex-col gap-8">
          
          <form onSubmit={handleSavePassword} className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-black text-[#040814] mb-8">تغيير كلمة المرور</h2>
            
            <div className="flex flex-col gap-5 mb-8">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-black text-[#040814]">كلمة المرور الحالية</label>
                <div className="relative">
                  <input 
                    type="password" 
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 pl-11 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-left"
                    dir="ltr"
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-black text-[#040814]">كلمة المرور الجديدة</label>
                <div className="relative">
                  <input 
                    type="password" 
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 pl-11 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-left"
                    dir="ltr"
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-black text-[#040814]">تأكيد كلمة المرور الجديدة</label>
                <div className="relative">
                  <input 
                    type="password" 
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 pl-11 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-left"
                    dir="ltr"
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#040814] hover:bg-gray-800 text-white px-8 py-3.5 rounded-xl font-bold transition-colors shadow-sm focus:outline-none"
            >
              تحديث كلمة المرور
            </button>
          </form>

        </div>

      </div>
    </>
  );
}
