'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../../components/dashboard/Header';
import { Plus, ChevronDown, Calendar, Eye, MoreHorizontal, ArrowRight, ArrowLeft, FileEdit, Trash2, FileText } from 'lucide-react';

// Fake Data for Orders
const ORDERS_DATA = [
  { 
    id: '#ORD-2024-1284', client: 'شركة النخبة', product: 'إلكترونيات', quantity: '150 وحدة', 
    total: '$24,500', comm: '$2,450', status: 'الشحن', 
    statusStyle: 'bg-blue-50 text-blue-600', 
    priorityCodes: ['#10B981', '#F59E0B', '#EF4444', '#94A3B8'], // Green, Orange, Red, Gray
    updateTime: 'قبل 2 ساعة' 
  },
  { 
    id: '#ORD-2024-1283', client: 'مصنع الأمل', product: 'مواد خام', quantity: '500 كجم', 
    total: '$18,200', comm: '$1,820', status: 'التصنيع', 
    statusStyle: 'bg-amber-100 text-amber-600', 
    priorityCodes: ['#10B981', '#F59E0B', '#EF4444', '#94A3B8'],
    updateTime: 'قبل 5 ساعة' 
  },
  { 
    id: '#ORD-2024-1282', client: 'متجر الأزياء', product: 'أثاث', quantity: '80 قطعة', 
    total: '$12,800', comm: '$1,280', status: 'الوصول', 
    statusStyle: 'bg-emerald-100 text-emerald-600', 
    priorityCodes: ['#10B981', '#F59E0B', '#EF4444', '#94A3B8'],
    updateTime: 'قبل 8 ساعة' 
  },
  { 
    id: '#ORD-2024-1281', client: 'المستشفى الوطني', product: 'أدوية', quantity: '200 صندوق', 
    total: '$45,600', comm: '$4,560', status: 'طلب عرض سعر', 
    statusStyle: 'bg-[#F2E7BA]/50 text-[#906c27]', 
    priorityCodes: ['#10B981', '#F59E0B', '#EF4444', '#94A3B8'],
    updateTime: 'قبل يوم' 
  },
];

export default function OrdersPage() {
  // TODO: Fetch orders from API, manage pagination state, handle filter changes
  // Using a local toggle to demonstrate the empty state for the review
  const [isEmptyState, setIsEmptyState] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Don't close if clicked inside the dropdown logic container
      if (!e.target.closest('.action-dropdown-wrapper')) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      {/* Header specifically tailored for Orders as a Card */}
      <Header title="قائمة الطلبات" subtitle="" variant="card" />

      {/* Page Title & Main Action */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h2 className="text-[32px] font-black text-[#040814]">الطلبات</h2>
        <Link 
          href="/orders/new"
          className="flex items-center gap-2 bg-[#B08B3A] hover:bg-[#906c27] text-white px-5 py-3 rounded-full font-bold text-sm transition-colors shadow-sm"
        >
          <Plus size={18} strokeWidth={2.5} />
          إنشاء طلب جديد
        </Link>
      </div>

      {isEmptyState ? (
        /* Empty State View */
        <div className="flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-200 py-32 shadow-sm text-center">
          <h3 className="text-[32px] font-black text-[#040814] mb-3">لا توجد طلبات حالياً</h3>
          <p className="text-gray-400 font-medium text-[15px] mb-8 max-w-sm">
            ابدأ بإضافة طلب جديد لعملائك أو استيراد منتجات جديدة
          </p>
            <Link 
              href="/orders/new"
              className="flex-1 md:flex-none justify-center flex items-center gap-2 bg-[#B08B3A] hover:bg-[#906c27] text-white px-5 py-3.5 rounded-[20px] font-bold text-sm transition-colors shadow-lg shadow-amber-500/20"
            >
              <Plus size={18} strokeWidth={2.5} />
              طلب جديد
            </Link>
        </div>
      ) : (
        /* Data View */
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white rounded-[24px] border border-gray-200 p-6 flex flex-wrap gap-6 shadow-sm">
            
            {/* Filter: Client */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-[#B08B3A] font-bold text-sm mb-3">العميل</label>
              <div className="relative">
                <select className="w-full bg-gray-50 border border-gray-200 text-[#040814] font-medium text-sm rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/30">
                  <option>الكل</option>
                  <option>شركة النخبة</option>
                  <option>مصنع الأمل</option>
                </select>
                <ChevronDown className="absolute left-4 top-3.5 text-gray-400 select-none pointer-events-none" size={16} />
              </div>
            </div>

            {/* Filter: Product */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-[#B08B3A] font-bold text-sm mb-3">المنتج</label>
              <div className="relative">
                <select className="w-full bg-gray-50 border border-gray-200 text-[#040814] font-medium text-sm rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/30">
                  <option>الكل</option>
                  <option>إلكترونيات</option>
                  <option>مواد خام</option>
                </select>
                <ChevronDown className="absolute left-4 top-3.5 text-gray-400 select-none pointer-events-none" size={16} />
              </div>
            </div>

            {/* Filter: Stage */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-[#B08B3A] font-bold text-sm mb-3">المرحلة</label>
              <div className="relative">
                <select className="w-full bg-gray-50 border border-gray-200 text-[#040814] font-medium text-sm rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/30">
                  <option>الكل</option>
                  <option>الشحن</option>
                  <option>التصنيع</option>
                </select>
                <ChevronDown className="absolute left-4 top-3.5 text-gray-400 select-none pointer-events-none" size={16} />
              </div>
            </div>

            {/* Filter: Priority */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-[#B08B3A] font-bold text-sm mb-3">الأولوية</label>
              <div className="relative">
                <select className="w-full bg-gray-50 border border-gray-200 text-[#040814] font-medium text-sm rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/30">
                  <option>الكل</option>
                  <option>عالية</option>
                  <option>متوسطة</option>
                </select>
                <ChevronDown className="absolute left-4 top-3.5 text-gray-400 select-none pointer-events-none" size={16} />
              </div>
            </div>

            {/* Filter: Date */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-[#B08B3A] font-bold text-sm mb-3">التاريخ</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="dd/mm/yy" 
                  className="w-full bg-gray-50 border border-gray-200 text-[#040814] font-medium text-sm rounded-xl pr-4 pl-10 py-3 focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/30"
                />
                <Calendar className="absolute left-4 top-3.5 text-gray-400 select-none pointer-events-none" size={16} />
              </div>
            </div>

          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-[32px] border border-gray-200 shadow-sm overflow-hidden pb-4">
            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-right whitespace-nowrap">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-6 px-4 text-[#B08B3A] font-bold text-sm">رقم الطلب</th>
                    <th className="py-6 px-4 text-[#B08B3A] font-bold text-sm">العميل</th>
                    <th className="py-6 px-4 text-[#B08B3A] font-bold text-sm">المنتج</th>
                    <th className="py-6 px-4 text-[#B08B3A] font-bold text-sm">الكمية</th>
                    <th className="py-6 px-4 text-[#B08B3A] font-bold text-sm">الإجمالي</th>
                    <th className="py-6 px-4 text-[#B08B3A] font-bold text-sm">العمولة</th>
                    <th className="py-6 px-4 text-[#B08B3A] font-bold text-sm">الحالة</th>
                    <th className="py-6 px-4 text-[#B08B3A] font-bold text-sm">الأولوية</th>
                    <th className="py-6 px-4 text-[#B08B3A] font-bold text-sm">آخر تحديث</th>
                    <th className="py-6 px-4 text-[#B08B3A] font-bold text-sm text-left pl-8">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ORDERS_DATA.map((order, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-5 px-4 font-bold text-xs text-[#040814]">{order.id}</td>
                      <td className="py-5 px-4 font-bold text-xs text-[#040814]">{order.client}</td>
                      <td className="py-5 px-4 font-bold text-xs text-[#040814]">{order.product}</td>
                      <td className="py-5 px-4 font-bold text-xs text-[#040814]">{order.quantity}</td>
                      <td className="py-5 px-4 font-bold text-xs text-[#040814]">{order.total}</td>
                      <td className="py-5 px-4 font-bold text-xs text-[#040814]">{order.comm}</td>
                      <td className="py-5 px-4">
                        <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold ${order.statusStyle}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-5 px-4">
                        <div className="flex gap-1.5">
                          {order.priorityCodes.map((color, cIdx) => (
                            <div key={cIdx} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></div>
                          ))}
                        </div>
                      </td>
                      <td className="py-5 px-4 font-medium text-xs text-gray-500">{order.updateTime}</td>
                      <td className="py-5 px-4 text-left pl-8">
                        <div className="relative flex items-center justify-end gap-3 text-gray-400 action-dropdown-wrapper">
                          <Link href={`/orders/${order.id.replace('#', '')}`} className="hover:text-[#040814] transition-colors p-1" title="عرض التفاصيل">
                            <Eye size={18} />
                          </Link>
                          
                          {/* Three Dots Button for Dropdown */}
                          <button 
                            type="button"
                            onClick={(e) => {
                              setOpenDropdownId(openDropdownId === order.id ? null : order.id);
                            }}
                            className="hover:text-[#040814] transition-colors p-1 rounded-full hover:bg-gray-100"
                          >
                            <MoreHorizontal size={18} />
                          </button>

                          {/* Action Dropdown Menu */}
                          {openDropdownId === order.id && (
                            <div 
                              onClick={(e) => e.stopPropagation()}
                              className="absolute left-5 top-8 w-44 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden text-right animate-in fade-in zoom-in-95 duration-100"
                            >
                              <Link href={`/orders/${order.id.replace('#', '')}`} className="w-full px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors flex items-center gap-2">
                                <FileText size={16}/> عرض التفاصيل
                              </Link>
                              <Link href={`/orders/${order.id.replace('#', '')}/edit`} className="w-full px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-amber-600 transition-colors flex items-center gap-2 border-t border-gray-100">
                                <FileEdit size={16}/> تعديل الطلب
                              </Link>
                              <button className="w-full px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors flex items-center gap-2 border-t border-gray-100">
                                <Trash2 size={16}/> إلغاء الطلب
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Placeholder */}
            {/* TODO: Connect to backend pagination logic */}
            <div className="flex items-center justify-center gap-2 mt-4 pt-6 border-t border-gray-50">
              <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowRight size={18} />
              </button>
              <button className="w-10 h-10 flex items-center justify-center text-[#040814] font-bold text-sm bg-gray-100 rounded-full">
                1
              </button>
              <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full font-bold text-sm transition-colors">
                2
              </button>
              <span className="text-gray-400 font-bold mx-1">...</span>
              <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full font-bold text-sm transition-colors">
                6
              </button>
              <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full font-bold text-sm transition-colors">
                7
              </button>
              <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full font-bold text-sm transition-colors">
                8
              </button>
              <button className="w-10 h-10 flex items-center justify-center text-white bg-[#040814] hover:bg-black rounded-full transition-colors">
                <ArrowLeft size={18} />
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
