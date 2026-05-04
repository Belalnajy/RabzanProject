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
  Users,
  ArrowRight,
  ArrowLeft,
  FileText,
  Power,
  Loader2,
} from 'lucide-react';
import { useApi, useMutation } from '@/hooks/useApi';
import { customersService } from '@/lib/services/customers.service';

const STATUS_LABELS = {
  active: { label: 'نشط', style: 'bg-emerald-50 text-emerald-600' },
  inactive: { label: 'غير نشط', style: 'bg-slate-100 text-slate-500' },
};

const formatCurrency = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(n) || 0);

export default function CustomersPage() {
  const [filters, setFilters] = useState({ country: '', status: '', debt: '' });
  const [page, setPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const customersQuery = useApi(
    () => customersService.list({ page, limit: 10, ...filters }),
    [page, filters.country, filters.status, filters.debt],
  );
  const statusMut = useMutation(({ id, status }) => customersService.updateStatus(id, status));

  const customers = customersQuery.data?.data || [];
  const pagination = customersQuery.data?.pagination || { currentPage: 1, totalPages: 1 };

  const countries = useMemo(() => {
    const set = new Set();
    customers.forEach((c) => c.country && set.add(c.country));
    return Array.from(set);
  }, [customers]);

  const handleFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleToggleStatus = async (customer) => {
    try {
      const newStatus = customer.status === 'active' ? 'inactive' : 'active';
      await statusMut.mutate({ id: customer.id, status: newStatus });
      setOpenDropdownId(null);
      customersQuery.refetch();
    } catch {}
  };

  const pages = useMemo(() => {
    const total = pagination.totalPages;
    const current = pagination.currentPage;
    const range = [];
    for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) range.push(i);
    return range;
  }, [pagination]);

  return (
    <div dir="rtl" className="pb-10">
      <Header title="العملاء" subtitle="" variant="card" />

      <div className="flex flex-wrap items-center justify-between mb-8 mt-2">
        <h2 className="text-[32px] font-black text-[#040814]">العملاء</h2>
        <Link
          href="/dashboard/customers/new"
          className="flex items-center gap-2 bg-[#B08B3A] hover:bg-[#906c27] text-white px-6 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-amber-500/10 active:scale-95">
          <Plus size={20} strokeWidth={3} />
          إضافة عميل جديد
        </Link>
      </div>

      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-8 flex flex-wrap gap-8 shadow-sm">
          <Filter label="الدولة">
            <select value={filters.country} onChange={(e) => handleFilter('country', e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] outline-none font-bold text-sm appearance-none cursor-pointer text-center">
              <option value="">جميع الدول</option>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Filter>
          <Filter label="الحالة">
            <select value={filters.status} onChange={(e) => handleFilter('status', e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] outline-none font-bold text-sm appearance-none cursor-pointer text-center">
              <option value="">الكل</option>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
            </select>
          </Filter>
          <Filter label="مديونية معلقة">
            <select value={filters.debt} onChange={(e) => handleFilter('debt', e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] outline-none font-bold text-sm appearance-none cursor-pointer text-center">
              <option value="">الكل</option>
              <option value="has_debt">لديه مديونية</option>
              <option value="no_debt">بدون مديونية</option>
            </select>
          </Filter>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden p-4">
          {customersQuery.loading ? (
            <LoadingState />
          ) : customersQuery.error ? (
            <ErrorState error={customersQuery.error} onRetry={customersQuery.refetch} />
          ) : customers.length === 0 ? (
            <EmptyState
              title="لا يوجد عملاء"
              description="ابدأ بإضافة عميلك الأول لمتابعة تعاملاتهم"
              icon={Users}
              action={
                <Link href="/dashboard/customers/new" className="flex items-center gap-2 bg-[#B08B3A] hover:bg-[#906c27] text-white px-6 py-3 rounded-xl font-bold text-sm">
                  <Plus size={18} /> إضافة عميل
                </Link>
              }
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-right border-separate border-spacing-y-4 px-2">
                  <thead>
                    <tr className="text-gray-400 font-black text-xs uppercase tracking-widest">
                      <th className="py-4 px-6 text-center">رقم العميل</th>
                      <th className="py-4 px-6 text-center">الاسم</th>
                      <th className="py-4 px-6 text-center">الهاتف</th>
                      <th className="py-4 px-6 text-center">الدولة</th>
                      <th className="py-4 px-6 text-center">عدد الطلبات</th>
                      <th className="py-4 px-6 text-center">الحالة</th>
                      <th className="py-4 px-6 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => {
                      const status = STATUS_LABELS[customer.status] || STATUS_LABELS.active;
                      return (
                        <tr key={customer.id} className="bg-white border border-gray-50 rounded-3xl shadow-sm hover:shadow-md transition-all group">
                          <td className="py-6 px-6 font-bold text-[13px] text-[#040814] text-center border-y border-r border-gray-50 first:rounded-r-[24px] bg-white group-hover:bg-gray-50/50">
                            {customer.displayId}
                          </td>
                          <td className="py-6 px-6 text-center font-bold text-[13px] text-[#040814] border-y border-gray-50 bg-white group-hover:bg-gray-50/50">
                            <Link href={`/dashboard/customers/${customer.id}`} className="hover:text-[#B08B3A]">
                              {customer.name}
                            </Link>
                          </td>
                          <td className="py-6 px-6 text-center font-bold text-[13px] text-[#040814] border-y border-gray-50 bg-white group-hover:bg-gray-50/50" dir="ltr">
                            {customer.phone || '—'}
                          </td>
                          <td className="py-6 px-6 text-center font-bold text-[13px] text-[#040814] border-y border-gray-50 bg-white group-hover:bg-gray-50/50">
                            {customer.country || '—'}
                          </td>
                          <td className="py-6 px-6 text-center font-bold text-[13px] text-[#040814] border-y border-gray-50 bg-white group-hover:bg-gray-50/50">
                            {customer.ordersCount ?? 0}
                          </td>
                          <td className="py-6 px-6 text-center border-y border-gray-50 bg-white group-hover:bg-gray-50/50">
                            <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold ${status.style}`}>{status.label}</span>
                          </td>
                          <td className="py-6 px-6 text-center border-y border-l border-gray-50 bg-white group-hover:bg-gray-50/50 last:rounded-l-[24px]">
                            <div className="relative flex items-center justify-center gap-4 text-gray-400">
                              <Link href={`/dashboard/customers/${customer.id}`} className="hover:text-[#040814] p-1">
                                <Eye size={18} />
                              </Link>
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === customer.id ? null : customer.id); }}
                                  className={`hover:text-[#040814] p-1.5 rounded-full hover:bg-gray-100 ${openDropdownId === customer.id ? 'bg-gray-100 text-[#040814]' : ''}`}>
                                  <MoreHorizontal size={20} />
                                </button>
                                {openDropdownId === customer.id && (
                                  <div className="absolute left-0 top-10 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden text-right">
                                    <Link href={`/dashboard/customers/${customer.id}`} className="w-full px-5 py-3 text-[13px] font-bold text-gray-700 hover:bg-gray-50 hover:text-[#B08B3A] flex items-center gap-3">
                                      <FileText size={16} /> عرض الملف
                                    </Link>
                                    <button
                                      onClick={() => handleToggleStatus(customer)}
                                      disabled={statusMut.loading}
                                      className="w-full px-5 py-3 text-[13px] font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-3 border-t border-gray-50 text-right disabled:opacity-60">
                                      <Power size={16} />
                                      {customer.status === 'active' ? 'إيقاف الحساب' : 'تفعيل الحساب'}
                                    </button>
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

              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8 mb-6">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={pagination.currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center bg-[#040814] text-white rounded-full shadow-lg disabled:opacity-30">
                    <ArrowRight size={18} />
                  </button>
                  <div className="flex items-center bg-gray-50 rounded-full px-2 py-1 border border-gray-100">
                    {pages.map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm transition-all ${
                          p === pagination.currentPage ? 'bg-white text-[#040814] shadow-sm' : 'text-gray-400 hover:text-[#040814]'
                        }`}>
                        {p}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full disabled:opacity-30">
                    <ArrowLeft size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const Filter = ({ label, children }) => (
  <div className="flex-1 min-w-[200px]">
    <label className="block text-[#B08B3A] font-black text-sm mb-3 text-center">{label}</label>
    <div className="relative">
      {children}
      <ChevronDown size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  </div>
);
