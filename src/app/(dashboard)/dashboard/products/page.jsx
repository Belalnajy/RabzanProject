'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/dashboard/Header';
import { LoadingState, ErrorState, EmptyState } from '@/components/dashboard/DataStates';
import {
  Plus,
  ChevronDown,
  Eye,
  MoreHorizontal,
  ArrowRight,
  ArrowLeft,
  FileEdit,
  Trash2,
  FileText,
  Package,
  Loader2,
} from 'lucide-react';
import { useApi, useMutation } from '@/hooks/useApi';
import { productsService } from '@/lib/services/products.service';
import { categoriesService } from '@/lib/services/categories.service';
import { customersService } from '@/lib/services/customers.service';

const STATUS_LABELS = {
  active: { label: 'نشط', style: 'bg-emerald-50 text-emerald-600' },
  archived: { label: 'مؤرشف', style: 'bg-slate-100 text-slate-500' },
};

const formatPrice = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(n) || 0);

export default function ProductsPage() {
  const [filters, setFilters] = useState({ category: '', client: '', status: '' });
  const [page, setPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const productsQuery = useApi(
    () => productsService.list({ page, limit: 10, ...filters }),
    [page, filters.category, filters.client, filters.status],
  );
  const categoriesQuery = useApi(() => categoriesService.list(), []);
  const customersQuery = useApi(() => customersService.list({ limit: 100 }), []);
  const deleteMut = useMutation((id) => productsService.remove(id));

  const products = productsQuery.data?.data || [];
  const pagination = productsQuery.data?.pagination || { currentPage: 1, totalPages: 1 };
  const categories = categoriesQuery.data || [];
  const customers = customersQuery.data?.data || [];

  const handleFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleDelete = async () => {
    try {
      await deleteMut.mutate(deleting.id);
      setDeleting(null);
      productsQuery.refetch();
    } catch {
      // error shown in modal
    }
  };

  const pages = useMemo(() => {
    const total = pagination.totalPages;
    const current = pagination.currentPage;
    const range = [];
    for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) range.push(i);
    return range;
  }, [pagination]);

  return (
    <div dir="rtl">
      <Header title="قائمة المنتجات" subtitle="" variant="card" />

      <div className="flex flex-wrap items-center justify-between mb-8">
        <h2 className="text-[32px] font-black text-[#040814]">المنتجات</h2>
        <Link
          href="/dashboard/products/new"
          className="flex items-center gap-2 bg-[#B08B3A] hover:bg-[#906c27] text-white px-6 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-amber-500/10 active:scale-95">
          <Plus size={20} strokeWidth={3} />
          إضافة منتج جديد
        </Link>
      </div>

      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-[24px] border border-gray-100 p-6 flex flex-wrap gap-6 shadow-sm">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <select
                value={filters.client}
                onChange={(e) => handleFilter('client', e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 text-gray-700 font-bold text-sm rounded-2xl px-5 py-4 appearance-none focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/20 cursor-pointer">
                <option value="">جميع العملاء</option>
                {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <ChevronDown className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <select
                value={filters.category}
                onChange={(e) => handleFilter('category', e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 text-gray-700 font-bold text-sm rounded-2xl px-5 py-4 appearance-none focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/20 cursor-pointer">
                <option value="">جميع الفئات</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
              </select>
              <ChevronDown className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) => handleFilter('status', e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 text-gray-700 font-bold text-sm rounded-2xl px-5 py-4 appearance-none focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/20 cursor-pointer">
                <option value="">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="archived">مؤرشف</option>
              </select>
              <ChevronDown className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden pb-6">
          {productsQuery.loading ? (
            <LoadingState />
          ) : productsQuery.error ? (
            <ErrorState error={productsQuery.error} onRetry={productsQuery.refetch} />
          ) : products.length === 0 ? (
            <EmptyState
              title="لا توجد منتجات"
              description="ابدأ بإضافة أول منتج لمتجرك"
              icon={Package}
              action={
                <Link href="/dashboard/products/new" className="flex items-center gap-2 bg-[#B08B3A] hover:bg-[#906c27] text-white px-6 py-3 rounded-xl font-bold text-sm transition-all">
                  <Plus size={18} /> إضافة منتج
                </Link>
              }
            />
          ) : (
            <>
              <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-right whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-gray-50">
                      <th className="py-7 px-6 text-[#B08B3A] font-bold text-sm">رقم المنتج</th>
                      <th className="py-7 px-4 text-[#B08B3A] font-bold text-sm text-center">الصورة</th>
                      <th className="py-7 px-6 text-[#B08B3A] font-bold text-sm text-center">اسم المنتج</th>
                      <th className="py-7 px-6 text-[#B08B3A] font-bold text-sm text-center">العميل</th>
                      <th className="py-7 px-6 text-[#B08B3A] font-bold text-sm text-center">الفئة</th>
                      <th className="py-7 px-6 text-[#B08B3A] font-bold text-sm text-center">السعر</th>
                      <th className="py-7 px-6 text-[#B08B3A] font-bold text-sm text-center">العمولة</th>
                      <th className="py-7 px-6 text-[#B08B3A] font-bold text-sm text-center">الحالة</th>
                      <th className="py-7 px-6 text-[#B08B3A] font-bold text-sm text-left pl-10">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map((product) => {
                      const status = STATUS_LABELS[product.status] || STATUS_LABELS.active;
                      return (
                        <tr key={product.id} className="hover:bg-gray-50/40 transition-colors group">
                          <td className="py-6 px-6 font-bold text-[13px] text-[#040814]">{product.displayId}</td>
                          <td className="py-4 px-4 text-center">
                            {product.image ? (
                              <img src={product.image} alt={product.nameAr || product.name} className="w-12 h-12 rounded-xl object-cover border border-gray-100 mx-auto" />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 mx-auto border border-gray-100">
                                <Package size={20} />
                              </div>
                            )}
                          </td>
                          <td className="py-6 px-6 text-center">
                            <Link href={`/dashboard/products/${product.id}`} className="font-bold text-[13px] text-[#040814] group-hover:text-amber-700">
                              {product.nameAr || product.name}
                            </Link>
                          </td>
                          <td className="py-6 px-6 text-center font-bold text-[13px] text-[#040814]">{product.customer?.name || '—'}</td>
                          <td className="py-6 px-6 text-center font-bold text-[13px] text-[#040814]">{product.category?.nameAr || '—'}</td>
                          <td className="py-6 px-6 text-center font-bold text-[13px] text-[#040814]" dir="ltr">{formatPrice(product.defaultPrice)}</td>
                          <td className="py-6 px-6 text-center font-bold text-[13px] text-[#040814]">{Number(product.commissionRate || 0)}%</td>
                          <td className="py-6 px-6 text-center">
                            <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold ${status.style}`}>{status.label}</span>
                          </td>
                          <td className="py-6 px-6 text-left pl-10">
                            <div className="relative flex items-center justify-end gap-4 text-gray-400 action-dropdown-wrapper">
                              <Link href={`/dashboard/products/${product.id}`} className="hover:text-[#040814] transition-colors p-1">
                                <Eye size={18} />
                              </Link>
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === product.id ? null : product.id); }}
                                  className={`hover:text-[#040814] transition-colors p-1.5 rounded-full hover:bg-gray-100 ${openDropdownId === product.id ? 'bg-gray-100 text-[#040814]' : ''}`}>
                                  <MoreHorizontal size={20} />
                                </button>
                                {openDropdownId === product.id && (
                                  <div className="absolute left-0 top-10 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden text-right">
                                    <Link href={`/dashboard/products/${product.id}`} className="w-full px-5 py-3 text-[13px] font-bold text-gray-700 hover:bg-gray-50 hover:text-[#B08B3A] flex items-center gap-3">
                                      <FileText size={16} /> عرض التفاصيل
                                    </Link>
                                    <Link href={`/dashboard/products/${product.id}?edit=1`} className="w-full px-5 py-3 text-[13px] font-bold text-gray-700 hover:bg-gray-50 hover:text-amber-600 flex items-center gap-3 border-t border-gray-50">
                                      <FileEdit size={16} /> تعديل
                                    </Link>
                                    {product.status === 'active' && (
                                      <button
                                        onClick={() => { setOpenDropdownId(null); setDeleting(product); }}
                                        className="w-full px-5 py-3 text-[13px] font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-3 border-t border-gray-50 text-right">
                                        <Trash2 size={16} /> أرشفة
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-gray-50 px-6">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={pagination.currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center text-white bg-[#040814] hover:bg-black rounded-full disabled:opacity-30">
                    <ArrowRight size={18} />
                  </button>
                  {pages.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm transition-colors ${
                        p === pagination.currentPage ? 'text-[#B08B3A] bg-amber-50 border-2 border-amber-200' : 'text-gray-500 hover:bg-gray-100'
                      }`}>
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="w-10 h-10 flex items-center justify-center text-white bg-[#040814] hover:bg-black rounded-full disabled:opacity-30">
                    <ArrowLeft size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete confirm */}
      {deleting && (
        <div className="fixed inset-0 bg-[#040814]/60 backdrop-blur-sm z-100 flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] w-full max-w-md p-10 shadow-2xl text-center">
            <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 mx-auto mb-6">
              <Trash2 size={40} />
            </div>
            <h3 className="text-2xl font-black text-[#040814] mb-3">أرشفة المنتج</h3>
            <p className="text-gray-400 font-bold text-[15px] mb-8">
              هل تريد أرشفة <span className="text-[#040814]">{deleting.nameAr || deleting.name}</span>؟
            </p>
            {deleteMut.error && <p className="text-rose-600 text-sm font-bold mb-4">{deleteMut.error.message}</p>}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDelete} disabled={deleteMut.loading}
                className="w-full py-4 rounded-2xl bg-rose-600 text-white font-black hover:bg-rose-700 disabled:opacity-60 flex items-center justify-center gap-2">
                {deleteMut.loading && <Loader2 size={18} className="animate-spin" />}
                تأكيد الأرشفة
              </button>
              <button onClick={() => setDeleting(null)} className="w-full py-4 rounded-2xl border border-gray-100 text-gray-400 font-bold hover:bg-gray-50">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
