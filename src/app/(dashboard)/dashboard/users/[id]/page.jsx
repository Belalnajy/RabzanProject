'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '../../../../../components/dashboard/Header';
import { Edit2, ChevronLeft, ChevronRight } from 'lucide-react';

// ==========================================
// MOCK DATA (API Ready)
// ==========================================
// TODO: Fetch user details from API using the `id` from URL params
const MOCK_USER_DETAILS = {
  id: '#USR001',
  name: 'أحمد محمد علي',
  email: 'ahmed.ali@company.com',
  username: 'ahmed.ali',
  phone: '+966 50 123 4567',
  lastLogin: '2024-03-15 14:30',
  createdAt: '2023-01-10',
  role: 'مسؤول',
  roleColor: 'bg-rose-100/60 text-rose-500',
  status: 'نشط',
  statusColor: 'bg-emerald-100/60 text-emerald-600'
};

const MOCK_ACTIVITY_LOG = [
  { id: 1, type: 'تسجيل الدخول', typeColor: 'text-emerald-500', entity: 'النظام', desc: 'تسجيل الدخول إلى النظام', time: '2024-03-15 14:30' },
  { id: 2, type: 'تعديل', typeColor: 'text-rose-500', entity: 'طلب #ORD-001', desc: 'تعديل حالة الطلب', time: '2024-03-15 14:25' },
  { id: 3, type: 'إنشاء', typeColor: 'text-[#003366]', entity: 'عميل #CLI-005', desc: 'إنشاء عميل جديد', time: '2024-03-15 13:45' },
  { id: 4, type: 'تسجيل الدخول', typeColor: 'text-emerald-500', entity: 'النظام', desc: 'تسجيل الدخول إلى النظام', time: '2024-03-15 11:20' },
];

export default function UserDetailsPage() {
  const params = useParams();
  const userId = params.id;
  
  // TODO: Add useEffect to fetch user details using userId

  return (
    <>
      <Header title="" subtitle="" variant="transparent" />

      {/* Page Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 mt-[-1rem]">
        <div>
          <h1 className="text-2xl font-black text-[#040814] mb-1">تفاصيل المستخدم</h1>
          <p className="text-sm font-bold text-gray-500">عرض معلومات وصلاحيات المستخدم</p>
        </div>
        <Link 
          href={`/dashboard/users/${userId}/edit`}
          className="flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#B08B3A] text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-sm focus:outline-none"
        >
          <Edit2 size={16} strokeWidth={2.5} />
          تعديل
        </Link>
      </div>

      {/* User Information Block */}
      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-8 mb-8">
        <h2 className="text-xl font-black text-[#040814] mb-8">معلومات المستخدم</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
          {/* Info Rows */}
          <div className="flex justify-between items-center border-b border-gray-50 pb-4">
            <span className="text-sm font-bold text-gray-500">الاسم الكامل</span>
            <span className="text-sm font-black text-[#040814]">{MOCK_USER_DETAILS.name}</span>
          </div>
          
          <div className="flex justify-between items-center border-b border-gray-50 pb-4">
            <span className="text-sm font-bold text-gray-500">البريد الإلكتروني</span>
            <span className="text-sm font-black text-[#040814]" dir="ltr">{MOCK_USER_DETAILS.email}</span>
          </div>

          <div className="flex justify-between items-center border-b border-gray-50 pb-4">
            <span className="text-sm font-bold text-gray-500">اسم المستخدم</span>
            <span className="text-sm font-black text-[#040814]" dir="ltr">{MOCK_USER_DETAILS.username}</span>
          </div>

          <div className="flex justify-between items-center border-b border-gray-50 pb-4">
            <span className="text-sm font-bold text-gray-500">رقم الهاتف</span>
            <span className="text-sm font-black text-[#040814]" dir="ltr">{MOCK_USER_DETAILS.phone}</span>
          </div>

          <div className="flex justify-between items-center border-b border-gray-50 pb-4">
            <span className="text-sm font-bold text-gray-500">آخر تسجيل دخول</span>
            <span className="text-sm font-black text-[#040814]" dir="ltr">{MOCK_USER_DETAILS.lastLogin}</span>
          </div>

          <div className="flex justify-between items-center border-b border-gray-50 pb-4">
            <span className="text-sm font-bold text-gray-500">تاريخ الإنشاء</span>
            <span className="text-sm font-black text-[#040814]" dir="ltr">{MOCK_USER_DETAILS.createdAt}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-500">الدور</span>
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${MOCK_USER_DETAILS.roleColor}`}>
              {MOCK_USER_DETAILS.role}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-500">الحالة</span>
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${MOCK_USER_DETAILS.statusColor}`}>
              {MOCK_USER_DETAILS.status}
            </span>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <h2 className="text-xl font-black text-[#040814] mb-4">سجل النشاط</h2>
      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm flex flex-col mb-12">
        <div className="p-6 overflow-x-auto">
          <table className="w-full text-right border-separate border-spacing-y-3">
            <thead>
              <tr>
                <th className="pb-2 text-[13px] text-[#D4AF37] font-black whitespace-nowrap px-4">الوصف</th>
                <th className="pb-2 text-[13px] text-[#D4AF37] font-black whitespace-nowrap px-4 text-center">الكيان المرتبط</th>
                <th className="pb-2 text-[13px] text-[#D4AF37] font-black whitespace-nowrap px-4 text-center">نوع الإجراء</th>
                <th className="pb-2 text-[13px] text-[#D4AF37] font-black whitespace-nowrap px-4 text-left">الوقت</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ACTIVITY_LOG.map((log, idx) => (
                <tr key={idx} className="bg-white border border-gray-100 shadow-xs rounded-[16px] hover:shadow-md transition-all">
                  <td className="py-4 px-4 text-[13px] font-bold text-gray-600 rounded-r-[16px] border-t border-b border-r border-gray-100">{log.desc}</td>
                  <td className="py-4 px-4 text-[13px] font-bold text-[#040814] text-center border-t border-b border-gray-100" dir="ltr">{log.entity}</td>
                  <td className={`py-4 px-4 text-[13px] font-bold text-center border-t border-b border-gray-100 ${log.typeColor}`}>{log.type}</td>
                  <td className="py-4 px-4 text-[13px] font-bold text-gray-500 text-left rounded-l-[16px] border-t border-b border-l border-gray-100 whitespace-nowrap" dir="ltr">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 p-6 border-t border-gray-50">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors focus:outline-none">
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-bold text-[#040814] px-2 flex gap-2" dir="ltr">
            <span>1</span>
            <span>2</span>
            <span>...</span>
            <span className="text-gray-400">6</span>
            <span className="text-gray-400">7</span>
            <span className="text-gray-400">8</span>
          </span>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#040814] text-white hover:bg-gray-800 transition-colors focus:outline-none">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
