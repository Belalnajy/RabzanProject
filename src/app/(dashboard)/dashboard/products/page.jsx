'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../../../components/dashboard/Header';
import { 
  Plus, 
  ChevronDown, 
  Eye, 
  MoreHorizontal, 
  ArrowRight, 
  ArrowLeft, 
  FileEdit, 
  Trash2, 
  FileText 
} from 'lucide-react';

// Mock Data for Products
const PRODUCTS_DATA = [
  { 
    id: 'PROD-00123', 
    name: 'قماش قطني عالي الجودة', 
    client: 'شركة النصر للتجارة', 
    category: 'أقمشة', 
    price: '150 EGP', 
    commission: '8%', 
    totalOrders: '45', 
    status: 'نشط',
    statusStyle: 'bg-emerald-50 text-emerald-600'
  },
  { 
    id: 'PROD-00124', 
    name: 'محرك سيارة تويوتا', 
    client: 'مؤسسة الأمل الصناعية', 
    category: 'قطع غيار', 
    price: '12,500 EGP', 
    commission: '5%', 
    totalOrders: '12', 
    status: 'نشط',
    statusStyle: 'bg-emerald-50 text-emerald-600'
  },
  { 
    id: 'PROD-00125', 
    name: 'شاشة LED 55 بوصة', 
    client: 'شركة النخيل للواردات', 
    category: 'إلكترونيات', 
    price: '3,200 EGP', 
    commission: '7%', 
    totalOrders: '28', 
    status: 'مؤرشف',
    statusStyle: 'bg-slate-100 text-slate-500'
  },
  { 
    id: 'PROD-00126', 
    name: 'طقم أثاث مكتبي', 
    client: 'شركة النصر للتجارة', 
    category: 'أثاث', 
    price: '4,800 EGP', 
    commission: '10%', 
    totalOrders: '34', 
    status: 'نشط',
    statusStyle: 'bg-emerald-50 text-emerald-600'
  },
];

export default function ProductsPage() {
  const [isEmptyState, setIsEmptyState] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [filters, setFilters] = useState({
    client: 'جميع العملاء',
    category: 'جميع الفئات',
    status: 'جميع الحالات'
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.action-dropdown-wrapper')) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    // TODO: Trigger API fetch with new filters
  };

  return (
    <div dir="rtl">
      {/* Header */}
      <Header title="قائمة المنتجات" subtitle="" variant="card" />

      {/* Page Title & Main Action */}
      <div className="flex flex-wrap items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h2 className="text-[32px] font-black text-[#040814]">المنتجات</h2>
          {/* Debug Toggle for Empty State */}
          <button 
            onClick={() => setIsEmptyState(!isEmptyState)}
            className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors border border-gray-200 px-2 py-1 rounded-md"
          >
            تبديل الحالة الفارغة
          </button>
        </div>
        <Link 
          href="/dashboard/products/new"
          className="flex items-center gap-2 bg-[#B08B3A] hover:bg-[#906c27] text-white px-6 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-amber-500/10 active:scale-95"
        >
          <Plus size={20} strokeWidth={3} />
          إضافة منتج جديد
        </Link>
      </div>

      {isEmptyState ? (
        /* Empty State View */
        <div className="flex flex-col items-center justify-center bg-white rounded-[32px] border border-gray-100 py-32 shadow-sm text-center">
          <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-8 animate-bounce">
            <Plus size={48} strokeWidth={1.5} />
          </div>
          <h3 className="text-[32px] font-black text-[#040814] mb-3">لا توجد منتجات حالياً</h3>
          <p className="text-gray-400 font-medium text-[15px] mb-10 max-w-sm mx-auto leading-relaxed">
            ابدأ بإضافة أول منتج لمتجرك لتبدأ في إدارة مخزونك وعملياتك اللوجستية بكل سهولة
          </p>
          <Link 
            href="/dashboard/products/new"
            className="flex items-center gap-3 bg-[#B08B3A] hover:bg-[#906c27] text-white px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-xl shadow-amber-500/20 active:scale-95"
          >
            <Plus size={22} strokeWidth={3} />
            إضافة أول منتج
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
        {/* Filters Bar */}
        <div className="bg-white rounded-[24px] border border-gray-100 p-6 flex flex-wrap gap-6 shadow-sm">
          
          {/* Filter: Client */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <select 
                name="client"
                value={filters.client}
                onChange={handleFilterChange}
                className="w-full bg-gray-50 border border-gray-100 text-gray-700 font-bold text-sm rounded-2xl px-5 py-4 appearance-none focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/20 transition-all cursor-pointer"
              >
                <option>جميع العملاء</option>
                <option>شركة النصر للتجارة</option>
                <option>مؤسسة الأمل الصناعية</option>
                <option>شركة النخيل للواردات</option>
              </select>
              <ChevronDown className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 select-none pointer-events-none" size={18} />
            </div>
          </div>

          {/* Filter: Category */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <select 
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full bg-gray-50 border border-gray-100 text-gray-700 font-bold text-sm rounded-2xl px-5 py-4 appearance-none focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/20 transition-all cursor-pointer"
              >
                <option>جميع الفئات</option>
                <option>أقمشة</option>
                <option>قطع غيار</option>
                <option>إلكترونيات</option>
                <option>أثاث</option>
              </select>
              <ChevronDown className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 select-none pointer-events-none" size={18} />
            </div>
          </div>

          {/* Filter: Status */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <select 
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full bg-gray-50 border border-gray-100 text-gray-700 font-bold text-sm rounded-2xl px-5 py-4 appearance-none focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/20 transition-all cursor-pointer"
              >
                <option>جميع الحالات</option>
                <option>نشط</option>
                <option>مؤرشف</option>
              </select>
              <ChevronDown className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 select-none pointer-events-none" size={18} />
            </div>
          </div>

        </div>

        {/* Products Table */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden pb-6">
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-right whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="py-7 px-6 text-[#B08B3A] font-bold text-sm">رقم المنتج</th>
                  <th className="py-7 px-6 text-[#B08B3A] font-bold text-sm text-center">اسم المنتج</th>
                  <th className="py-7 px-6 text-[#B08B3A] font-bold text-sm text-center">العميل</th>
                  <th className="py-7 px-6 text-[#B08B3A] font-bold text-sm text-center">الفئة / النوع</th>
                  <th className="py-7 px-6 text-[#B08B3A] font-bold text-sm text-center">السعر الافتراضي</th>
                  <th className="py-7 px-6 text-[#B08B3A] font-bold text-sm text-center">نسبة العمولة</th>
                  <th className="py-7 px-6 text-[#B08B3A] font-bold text-sm text-center">إجمالي الطلبات</th>
                  <th className="py-7 px-6 text-[#B08B3A] font-bold text-sm text-center">الحالة</th>
                  <th className="py-7 px-6 text-[#B08B3A] font-bold text-sm text-left pl-10">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {PRODUCTS_DATA.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/40 transition-colors group">
                    <td className="py-6 px-6 font-bold text-[13px] text-[#040814]">{product.id}</td>
                    <td className="py-6 px-6 text-center">
                      <Link href={`/dashboard/products/${product.id}`} className="font-bold text-[13px] text-[#040814] group-hover:text-amber-700 transition-colors cursor-pointer">
                        {product.name}
                      </Link>
                    </td>
                    <td className="py-6 px-6 text-center font-bold text-[13px] text-[#040814]">{product.client}</td>
                    <td className="py-6 px-6 text-center font-bold text-[13px] text-[#040814]">{product.category}</td>
                    <td className="py-6 px-6 text-center font-bold text-[13px] text-[#040814]">{product.price}</td>
                    <td className="py-6 px-6 text-center font-bold text-[13px] text-[#040814]">{product.commission}</td>
                    <td className="py-6 px-6 text-center font-bold text-[13px] text-[#040814]">{product.totalOrders}</td>
                    <td className="py-6 px-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold ${product.statusStyle}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="py-6 px-6 text-left pl-10">
                      <div className="relative flex items-center justify-end gap-4 text-gray-400 action-dropdown-wrapper">
                        <Link href={`/dashboard/products/${product.id}`} className="hover:text-[#040814] transition-colors p-1" title="عرض التفاصيل">
                          <Eye size={18} />
                        </Link>
                        
                        <div className="relative">
                          <button 
                            type="button"
                            onClick={() => setOpenDropdownId(openDropdownId === product.id ? null : product.id)}
                            className={`hover:text-[#040814] transition-colors p-1.5 rounded-full hover:bg-gray-100 ${openDropdownId === product.id ? 'bg-gray-100 text-[#040814]' : ''}`}
                          >
                            <MoreHorizontal size={20} />
                          </button>

                          {openDropdownId === product.id && (
                            <div className="absolute left-0 top-10 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden text-right animate-in fade-in zoom-in-95 duration-150">
                              <Link href={`/dashboard/products/${product.id}`} className="w-full px-5 py-3 text-[13px] font-bold text-gray-700 hover:bg-gray-50 hover:text-[#B08B3A] transition-colors flex items-center gap-3">
                                <FileText size={16}/> عرض التفاصيل
                              </Link>
                              <button className="w-full px-5 py-3 text-[13px] font-bold text-gray-700 hover:bg-gray-50 hover:text-amber-600 transition-colors flex items-center gap-3 border-t border-gray-50">
                                <FileEdit size={16}/> تعديل المنتج
                              </button>
                              <button className="w-full px-5 py-3 text-[13px] font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors flex items-center gap-3 border-t border-gray-50">
                                <Trash2 size={16}/> حذف المنتج
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
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-gray-50 px-6">
            <button className="w-10 h-10 flex items-center justify-center text-white bg-[#040814] hover:bg-black rounded-full transition-all active:scale-90 shadow-md">
              <ArrowLeft size={18} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full font-bold text-sm transition-colors">
              8
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full font-bold text-sm transition-colors">
              7
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full font-bold text-sm transition-colors">
              6
            </button>
            <span className="text-gray-300 font-bold mx-2">...</span>
            <button className="w-12 h-12 flex items-center justify-center text-[#B08B3A] font-black text-sm bg-amber-50 border-2 border-amber-200 rounded-full shadow-inner">
              2
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full font-bold text-sm transition-colors">
              1
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full transition-all active:scale-90">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

