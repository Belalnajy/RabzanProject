'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '../../../../components/dashboard/Header';
import { 
  Plus, 
  ChevronDown, 
  Eye, 
  MoreHorizontal, 
  Users, 
  Search, 
  ArrowRight, 
  ArrowLeft,
  FileText,
  UserPlus
} from 'lucide-react';

// Mock Data for Customers
const CUSTOMERS_DATA = [
  {
    id: 'CLI-00123',
    name: 'أحمد محمد علي',
    phone: '+20 100 123 4567',
    country: 'Egypt',
    totalOrders: 45,
    totalRevenue: '1,250,000 EGP',
    debt: '85,000 EGP',
    status: 'نشط',
    statusStyle: 'bg-emerald-50 text-emerald-600'
  },
  {
    id: 'CLI-00124',
    name: 'فاطمة أحمد',
    phone: '+971 50 234 5678',
    country: 'UAE',
    totalOrders: 67,
    totalRevenue: '2,340,000 USD',
    debt: '0 USD',
    status: 'نشط',
    statusStyle: 'bg-emerald-50 text-emerald-600'
  },
  {
    id: 'CLI-00125',
    name: 'خالد سعيد',
    phone: '+966 55 345 6789',
    country: 'Saudi Arabia',
    totalOrders: 89,
    totalRevenue: '3,450,000 USD',
    debt: '125,000 USD',
    status: 'نشط',
    statusStyle: 'bg-emerald-50 text-emerald-600'
  },
  {
    id: 'CLI-00126',
    name: 'أحمد محمد علي',
    phone: '+20 100 123 4567',
    country: 'Egypt',
    totalOrders: 45,
    totalRevenue: '1,250,000 EGP',
    debt: '85,000 EGP',
    status: 'نشط',
    statusStyle: 'bg-emerald-50 text-emerald-600'
  }
];

export default function CustomersPage() {
  const [isEmptyState, setIsEmptyState] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  return (
    <div dir="rtl" className="pb-10">
      {/* Header */}
      <Header title="العملاء" subtitle="" variant="card" />

      {/* Page Title & Main Action */}
      <div className="flex flex-wrap items-center justify-between mb-8 mt-2">
        <div className="flex items-center gap-4">
          <h2 className="text-[32px] font-black text-[#040814]">العملاء</h2>
          <button 
            onClick={() => setIsEmptyState(!isEmptyState)}
            className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors border border-gray-200 px-2 py-1 rounded-md"
          >
            تبديل الحالة الفارغة
          </button>
        </div>
        <Link href="/dashboard/customers/new" className="flex items-center gap-2 bg-[#B08B3A] hover:bg-[#906c27] text-white px-6 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-amber-500/10 active:scale-95">
          <Plus size={20} strokeWidth={3} />
          إضافة عميل جديد
        </Link>
      </div>

      {isEmptyState ? (
        /* ================= EMPTY STATE ================= */
        <div className="bg-white rounded-[40px] border border-gray-100 p-20 flex flex-col items-center justify-center text-center shadow-sm min-h-[500px]">
          <div className="w-32 h-32 bg-gray-50 rounded-[40px] flex items-center justify-center text-gray-200 mb-10">
            <Users size={64} />
          </div>
          <h3 className="text-3xl font-black text-[#040814] mb-4">لا يوجد عملاء حاليًا</h3>
          <p className="text-gray-400 font-medium text-[15px] mb-10 max-w-sm mx-auto leading-relaxed">
            أضف عميلك الأول الآن لبدء إدارة طلباته ومتابعة تعاملاته المالية.
          </p>
          <Link href="/dashboard/customers/new" className="flex items-center gap-3 bg-[#B08B3A] hover:bg-[#906c27] text-white px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-xl shadow-amber-500/20 active:scale-95">
            <Plus size={22} strokeWidth={3} />
            إضافة عميل جديد
          </Link>
        </div>
      ) : (
        /* ================= CONTENT STATE ================= */
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white rounded-[32px] border border-gray-100 p-8 flex flex-wrap gap-8 shadow-sm">
            
            {/* Filter: Country */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[#B08B3A] font-black text-sm mb-3 pr-1 text-center">الدولة</label>
              <div className="relative">
                <select className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] transition-all outline-none font-bold text-sm appearance-none cursor-pointer text-center">
                  <option>جميع الدول</option>
                  <option>مصر</option>
                  <option>الإمارات</option>
                  <option>السعودية</option>
                </select>
                <ChevronDown size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Filter: Status */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[#B08B3A] font-black text-sm mb-3 pr-1 text-center">الحالة</label>
              <div className="relative">
                <select className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] transition-all outline-none font-bold text-sm appearance-none cursor-pointer text-center">
                  <option>الكل</option>
                  <option>نشط</option>
                  <option>غير نشط</option>
                </select>
                <ChevronDown size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Filter: Debt */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[#B08B3A] font-black text-sm mb-3 pr-1 text-center">مديونية معلقة</label>
              <div className="relative">
                <select className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] transition-all outline-none font-bold text-sm appearance-none cursor-pointer text-center">
                  <option>الكل</option>
                  <option>لديه مديونية</option>
                  <option>بدون مديونية</option>
                </select>
                <ChevronDown size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Customers Table */}
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden p-4">
            <table className="w-full text-right border-separate border-spacing-y-4 px-2">
              <thead>
                <tr className="text-gray-400 font-black text-xs uppercase tracking-widest">
                  <th className="py-4 px-6 text-center">رقم العميل</th>
                  <th className="py-4 px-6 text-center">اسم العميل</th>
                  <th className="py-4 px-6 text-center">رقم الهاتف</th>
                  <th className="py-4 px-6 text-center">الدولة</th>
                  <th className="py-4 px-6 text-center">إجمالي الطلبات</th>
                  <th className="py-4 px-6 text-center">إجمالي الإيرادات</th>
                  <th className="py-4 px-6 text-center">المديونية</th>
                  <th className="py-4 px-6 text-center">الحالة</th>
                  <th className="py-4 px-6 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {CUSTOMERS_DATA.map((customer) => (
                  <tr key={customer.id} className="bg-white border border-gray-50 rounded-3xl shadow-sm hover:shadow-md transition-all group">
                    <td className="py-6 px-6 font-bold text-[13px] text-[#040814] text-center border-y border-r border-gray-50 first:rounded-r-[24px] last:rounded-l-[24px] bg-white group-hover:bg-gray-50/50">
                      {customer.id}
                    </td>
                    <td className="py-6 px-6 text-center font-bold text-[13px] text-[#040814] border-y border-gray-50 bg-white group-hover:bg-gray-50/50">
                      {customer.name}
                    </td>
                    <td className="py-6 px-6 text-center font-bold text-[13px] text-[#040814] border-y border-gray-50 bg-white group-hover:bg-gray-50/50" dir="ltr">
                      {customer.phone}
                    </td>
                    <td className="py-6 px-6 text-center font-bold text-[13px] text-[#040814] border-y border-gray-50 bg-white group-hover:bg-gray-50/50">
                      {customer.country}
                    </td>
                    <td className="py-6 px-6 text-center font-bold text-[13px] text-[#040814] border-y border-gray-50 bg-white group-hover:bg-gray-50/50">
                      {customer.totalOrders}
                    </td>
                    <td className="py-6 px-6 text-center font-bold text-[13px] text-[#040814] border-y border-gray-50 bg-white group-hover:bg-gray-50/50">
                      {customer.totalRevenue}
                    </td>
                    <td className={`py-6 px-6 text-center font-bold text-[13px] border-y border-gray-50 bg-white group-hover:bg-gray-50/50 ${customer.debt !== '0 USD' && customer.debt !== '0 EGP' ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {customer.debt}
                    </td>
                    <td className="py-6 px-6 text-center border-y border-gray-50 bg-white group-hover:bg-gray-50/50">
                      <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold ${customer.statusStyle}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="py-6 px-6 text-center border-y border-l border-gray-50 bg-white group-hover:bg-gray-50/50 last:rounded-l-[24px]">
                      <div className="relative flex items-center justify-center gap-4 text-gray-400">
                        <Link href={`/dashboard/customers/${customer.id}`} className="hover:text-[#040814] transition-colors p-1" title="عرض التفاصيل">
                          <Eye size={18} />
                        </Link>
                        
                        <div className="relative">
                          <button 
                            type="button"
                            onClick={() => setOpenDropdownId(openDropdownId === customer.id ? null : customer.id)}
                            className={`hover:text-[#040814] transition-colors p-1.5 rounded-full hover:bg-gray-100 ${openDropdownId === customer.id ? 'bg-gray-100 text-[#040814]' : ''}`}
                          >
                            <MoreHorizontal size={20} />
                          </button>

                          {openDropdownId === customer.id && (
                            <div className="absolute left-0 top-10 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden text-right animate-in fade-in zoom-in-95 duration-150">
                              <Link href={`/dashboard/customers/${customer.id}`} className="w-full px-5 py-3 text-[13px] font-bold text-gray-700 hover:bg-gray-50 hover:text-[#B08B3A] transition-colors flex items-center gap-3">
                                <FileText size={16}/> عرض الملف
                              </Link>
                              <button className="w-full px-5 py-3 text-[13px] font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors flex items-center gap-3 border-t border-gray-50">
                                <Eye size={16}/> إيقاف الحساب
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-8 mb-6">
              <button className="w-10 h-10 flex items-center justify-center bg-[#040814] text-white rounded-full shadow-lg shadow-gray-200 active:scale-90 transition-all">
                <ArrowRight size={18} />
              </button>
              <div className="flex items-center bg-gray-50 rounded-full px-2 py-1 border border-gray-100">
                {[8, 7, 6, '...', 2, 1].map((page, idx) => (
                  <button 
                    key={idx}
                    className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm transition-all ${page === 1 ? 'bg-white text-[#040814] shadow-sm' : 'text-gray-400 hover:text-[#040814]'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full transition-all active:scale-90">
                <ArrowLeft size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
