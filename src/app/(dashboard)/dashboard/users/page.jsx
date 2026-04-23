'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../../components/dashboard/Header';
import { 
  Plus, ChevronDown, Calendar, Eye, 
  MoreHorizontal, ChevronLeft, ChevronRight, 
  Edit2, Trash2, Lock 
} from 'lucide-react';

// ==========================================
// MOCK DATA (API Ready)
// ==========================================
// TODO: Replace with API fetching logic (e.g., fetch from /api/users)
const MOCK_USERS = [
  {
    id: '#USR001',
    name: 'أحمد محمد علي',
    email: 'ahmed.ali@company.com',
    role: 'مسؤول',
    roleColor: 'text-rose-500',
    status: 'نشط',
    statusColor: 'bg-emerald-100/60 text-emerald-600',
    lastLogin: '2024-03-15 14:30',
    createdAt: '2023-01-10'
  },
  {
    id: '#USR002',
    name: 'فاطمة عبدالله سالم',
    email: 'fatima.salem@company.com',
    role: 'عمليات',
    roleColor: 'text-blue-500',
    status: 'نشط',
    statusColor: 'bg-emerald-100/60 text-emerald-600',
    lastLogin: '2024-03-15 10:15',
    createdAt: '2023-02-15'
  },
  {
    id: '#USR003',
    name: 'محمد خالد أحمد',
    email: 'mohammed.ahmed@company.com',
    role: 'محاسبة',
    roleColor: 'text-purple-500',
    status: 'غير نشط',
    statusColor: 'bg-gray-200 text-gray-500',
    lastLogin: '2024-02-28 16:45',
    createdAt: '2023-03-20'
  },
  {
    id: '#USR004',
    name: 'نورا حسن علي',
    email: 'nora.ali@company.com',
    role: 'عمليات',
    roleColor: 'text-blue-500',
    status: 'نشط',
    statusColor: 'bg-emerald-100/60 text-emerald-600',
    lastLogin: '2024-03-14 09:20',
    createdAt: '2023-04-10'
  }
];

export default function UsersPage() {
  const router = useRouter();
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const toggleDropdown = (id) => {
    if (openDropdownId === id) setOpenDropdownId(null);
    else setOpenDropdownId(id);
  };

  return (
    <>
      <Header title="" subtitle="" variant="transparent" />

      {/* Page Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 mt-[-1rem]">
        <div>
          <h1 className="text-2xl font-black text-[#040814] mb-1">إدارة المستخدمين والصلاحيات</h1>
          <p className="text-sm font-bold text-gray-500">إدارة مستخدمي النظام وصلاحياتهم</p>
        </div>
        <Link 
          href="/dashboard/users/new"
          className="flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#B08B3A] text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-sm focus:outline-none"
        >
          <Plus size={18} strokeWidth={2.5} />
          إضافة مستخدم
        </Link>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Role Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-black text-[#D4AF37] px-1">الدور</label>
            <div className="relative">
              <select className="w-full appearance-none bg-gray-50/80 border border-gray-100 rounded-xl px-4 py-3 pr-10 text-sm font-bold text-[#040814] outline-none cursor-pointer focus:ring-2 focus:ring-amber-500/20 transition-all">
                <option>جميع الأدوار</option>
                <option>مسؤول</option>
                <option>عمليات</option>
                <option>محاسبة</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-black text-[#D4AF37] px-1">الحالة</label>
            <div className="relative">
              <select className="w-full appearance-none bg-gray-50/80 border border-gray-100 rounded-xl px-4 py-3 pr-10 text-sm font-bold text-[#040814] outline-none cursor-pointer focus:ring-2 focus:ring-amber-500/20 transition-all">
                <option>جميع الحالات</option>
                <option>نشط</option>
                <option>غير نشط</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>

          {/* Date Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-black text-[#D4AF37] px-1">تاريخ الإنشاء</label>
            <button className="w-full flex items-center gap-2 bg-gray-50/80 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#040814] outline-none cursor-pointer hover:bg-gray-100 transition-all focus:ring-2 focus:ring-amber-500/20">
              <Calendar size={16} className="text-gray-400" />
              <span dir="ltr" className="text-gray-500">dd/mm/yy</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container (Table) */}
      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm flex flex-col mb-12">
        <div className="p-6 overflow-x-auto">
          <table className="w-full text-right border-separate border-spacing-y-3">
            <thead>
              <tr>
                <th className="pb-2 text-[13px] text-[#D4AF37] font-black whitespace-nowrap px-4">رقم المستخدم</th>
                <th className="pb-2 text-[13px] text-[#D4AF37] font-black whitespace-nowrap px-4">الاسم الكامل</th>
                <th className="pb-2 text-[13px] text-[#D4AF37] font-black whitespace-nowrap px-4">البريد الإلكتروني /<br/>اسم المستخدم</th>
                <th className="pb-2 text-[13px] text-[#D4AF37] font-black whitespace-nowrap px-4">الدور</th>
                <th className="pb-2 text-[13px] text-[#D4AF37] font-black whitespace-nowrap px-4">الحالة</th>
                <th className="pb-2 text-[13px] text-[#D4AF37] font-black whitespace-nowrap px-4">آخر تسجيل دخول</th>
                <th className="pb-2 text-[13px] text-[#D4AF37] font-black whitespace-nowrap px-4">تاريخ الإنشاء</th>
                <th className="pb-2 text-[13px] text-[#D4AF37] font-black whitespace-nowrap px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_USERS.map((user, idx) => (
                <tr key={idx} className="bg-white border border-gray-100 shadow-xs rounded-[16px] hover:shadow-md transition-all group">
                  <td className="py-4 px-4 text-[13px] font-bold text-gray-600 rounded-r-[16px] border-t border-b border-r border-gray-100 group-hover:border-gray-200" dir="ltr">{user.id}</td>
                  <td className="py-4 px-4 text-[13px] font-bold text-[#040814] border-t border-b border-gray-100 group-hover:border-gray-200">{user.name}</td>
                  <td className="py-4 px-4 text-[12px] font-bold text-gray-500 border-t border-b border-gray-100 group-hover:border-gray-200 max-w-[200px] break-words leading-tight" dir="ltr">
                    {user.email}
                  </td>
                  <td className={`py-4 px-4 text-[13px] font-bold border-t border-b border-gray-100 group-hover:border-gray-200 ${user.roleColor}`}>{user.role}</td>
                  <td className="py-4 px-4 border-t border-b border-gray-100 group-hover:border-gray-200">
                    <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold inline-block whitespace-nowrap ${user.statusColor}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[12px] font-bold text-[#040814] border-t border-b border-gray-100 group-hover:border-gray-200 whitespace-nowrap" dir="ltr">{user.lastLogin}</td>
                  <td className="py-4 px-4 text-[12px] font-bold text-[#040814] border-t border-b border-gray-100 group-hover:border-gray-200 whitespace-nowrap" dir="ltr">{user.createdAt}</td>
                  <td className="py-4 px-4 border-t border-b border-l border-gray-100 rounded-l-[16px] group-hover:border-gray-200">
                    <div className="flex items-center justify-center gap-2">
                      <Link 
                        href={`/dashboard/users/${user.id.replace('#', '')}`}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-[#040814] transition-colors focus:outline-none"
                      >
                        <Eye size={16} strokeWidth={2.5} />
                      </Link>
                      <div className="relative">
                        <button 
                          onClick={() => toggleDropdown(user.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-[#040814] transition-colors focus:outline-none"
                        >
                          <MoreHorizontal size={16} strokeWidth={2.5} />
                        </button>

                        {openDropdownId === user.id && (
                          <>
                            {/* Overlay to close dropdown */}
                            <div className="fixed inset-0 z-40" onClick={() => setOpenDropdownId(null)} />
                            
                            {/* Dropdown Menu */}
                            <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-xl py-2 z-50 flex flex-col">
                              <Link 
                                href={`/dashboard/users/${user.id.replace('#', '')}/edit`}
                                onClick={() => setOpenDropdownId(null)}
                                className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-gray-600 hover:bg-gray-50 hover:text-[#040814] w-full text-right transition-colors"
                              >
                                <Edit2 size={16} />
                                تعديل المستخدم
                              </Link>
                              <button 
                                onClick={() => {/* TODO: Reset Password API */ setOpenDropdownId(null);}}
                                className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-gray-600 hover:bg-gray-50 hover:text-[#040814] w-full text-right transition-colors"
                              >
                                <Lock size={16} />
                                إعادة تعيين كلمة المرور
                              </button>
                              <div className="h-px w-full bg-gray-50 my-1" />
                              <button 
                                onClick={() => {/* TODO: Delete API */ setOpenDropdownId(null);}}
                                className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-rose-500 hover:bg-rose-50 w-full text-right transition-colors"
                              >
                                <Trash2 size={16} />
                                حذف المستخدم
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
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
