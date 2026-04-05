'use client';

import React, { useState } from 'react';
import Header from '../../../components/dashboard/Header';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Clock,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react';
import Link from 'next/link';

// Mock Data
const initialCustomers = [
  { id: 1, name: 'أحمد محمد علي', email: 'ahmed@nukhba.com', phone: '+966 50 123 4567', company: 'شركة النخبة للتجارة', status: 'نشط', joinDate: '2023-10-12', logo: 'أ.ع', color: '#10B981' },
  { id: 2, name: 'سارة خالد', email: 'sara@amal-factory.sa', phone: '+966 55 987 6543', company: 'مصنع الأمل للصناعات', status: 'نشط', joinDate: '2023-11-05', logo: 'س.خ', color: '#3B82F6' },
  { id: 3, name: 'محمد حسن', email: 'mhassan@fastlogistics.com', phone: '+966 53 456 7890', company: 'النقل السريع', status: 'غير نشط', joinDate: '2024-01-20', logo: 'م.ح', color: '#6366F1' },
  { id: 4, name: 'ليلى هاني', email: 'laila@global-import.com', phone: '+966 54 321 0987', company: 'جلوبال إمبورت', status: 'نشط', joinDate: '2024-02-15', logo: 'ل.ه', color: '#F59E0B' },
  { id: 5, name: 'عمر فؤاد', email: 'omar@redsea-trading.com', phone: '+966 56 654 3210', company: 'تجارة البحر الأحمر', status: 'نشط', joinDate: '2024-03-01', logo: 'ع.ف', color: '#EC4899' },
];

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('الكل');

  const filteredCustomers = initialCustomers.filter(customer => {
    const matchesSearch = customer.name.includes(searchTerm) || customer.company.includes(searchTerm) || customer.email.includes(searchTerm);
    const matchesStatus = statusFilter === 'الكل' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <Header title="العملاء والشركات" subtitle="إدارة سجل العارضين والعملاء وتفاصيل التواصل" variant="transparent" />

      {/* Stats Summary Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         <div className="bg-white p-6 rounded-[32px] border border-gray-200 shadow-sm flex items-center gap-5 group hover:border-amber-300 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
              <Users size={28} />
            </div>
            <div>
              <p className="text-gray-400 font-bold text-xs mb-1">إجمالي العملاء</p>
              <p className="text-2xl font-black text-[#040814]">1,284</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[32px] border border-gray-200 shadow-sm flex items-center gap-5 group hover:border-emerald-300 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
              <ShieldCheck size={28} />
            </div>
            <div>
              <p className="text-gray-400 font-bold text-xs mb-1">العملاء النشطين</p>
              <p className="text-2xl font-black text-[#040814]">1,150</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[32px] border border-gray-200 shadow-sm flex items-center gap-5 group hover:border-blue-300 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
              <UserPlus size={28} />
            </div>
            <div>
              <p className="text-gray-400 font-bold text-xs mb-1">انضمام جديد (هذا الشهر)</p>
              <p className="text-2xl font-black text-[#040814]">42</p>
            </div>
         </div>
      </div>

      {/* Filters & Actions Panel */}
      <div className="bg-white rounded-[32px] border border-gray-200 shadow-sm p-6 mb-8 flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[280px]">
             <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input 
               type="text" 
               placeholder="ابحث عن عميل، شركة، أو بريد إلكتروني..."
               className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pr-12 pl-4 text-sm font-medium focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          
          {/* Status Select */}
          <div className="relative min-w-[160px]">
             <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
             <select 
               className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pr-10 pl-4 text-sm font-bold text-[#040814] appearance-none outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value)}
             >
               <option value="الكل">جميع الحالات</option>
               <option value="نشط">نشط فقط</option>
               <option value="غير نشط">غير نشط</option>
             </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-3.5 bg-gray-50 text-gray-700 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-colors">
            <Download size={18} />
            تصدير PDF
          </button>
          <button className="flex items-center gap-2 px-6 py-3.5 bg-[#B08B3A] text-white rounded-2xl font-bold text-sm hover:bg-[#906c27] transition-all shadow-lg shadow-amber-500/20">
            <UserPlus size={18} />
            إضافة عميل جديد
          </button>
        </div>
      </div>

      {/* Customers Table / Grid */}
      <div className="bg-white rounded-[40px] border border-gray-200 shadow-premium overflow-hidden">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-[13px] font-black text-gray-400 uppercase tracking-wider">العميل والشركة</th>
                <th className="px-8 py-6 text-[13px] font-black text-gray-400 uppercase tracking-wider">بيانات التواصل</th>
                <th className="px-8 py-6 text-[13px] font-black text-gray-400 uppercase tracking-wider">تاريخ الانضمام</th>
                <th className="px-8 py-6 text-[13px] font-black text-gray-400 uppercase tracking-wider text-center">الحالة</th>
                <th className="px-8 py-6 text-[13px] font-black text-gray-400 uppercase tracking-wider text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg text-white shrink-0 shadow-sm" style={{ backgroundColor: customer.color }}>
                        {customer.logo}
                      </div>
                      <div>
                        <h4 className="text-base font-black text-[#040814] group-hover:text-[#B08B3A] transition-colors">{customer.name}</h4>
                        <p className="text-gray-400 font-bold text-xs mt-1">{customer.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2">
                       <span className="flex items-center gap-2 text-sm font-bold text-[#040814]/80">
                         <Mail size={14} className="text-gray-400" />
                         {customer.email}
                       </span>
                       <span className="flex items-center gap-2 text-[11px] font-bold text-gray-400">
                         <Phone size={14} className="text-gray-400" />
                         {customer.phone}
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                       <Clock size={16} className="text-gray-400" />
                       {customer.joinDate}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black ${
                      customer.status === 'نشط' ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100' : 'bg-gray-100 text-gray-500 ring-1 ring-gray-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ml-1.5 ${customer.status === 'نشط' ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-amber-50 hover:text-amber-600 transition-all focus:outline-none">
                        <MoreHorizontal size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs font-bold text-gray-500">عرض 1-5 من أصل 128 عميل</p>
            <div className="flex items-center gap-2">
               <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-gray-200 text-gray-400 hover:text-[#040814] disabled:opacity-50 transition-all" disabled>
                 <ChevronRight size={20} />
               </button>
               <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#B08B3A] text-white font-bold text-sm shadow-sm transition-all scale-105">1</button>
               <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 transition-all">2</button>
               <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 transition-all">3</button>
               <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-gray-200 text-gray-500 hover:text-[#040814] transition-all">
                 <ChevronLeft size={20} />
               </button>
            </div>
        </div>
      </div>
    </>
  );
}
