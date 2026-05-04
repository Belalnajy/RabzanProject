'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Header from '@/components/dashboard/Header';
import { LoadingState, ErrorState, EmptyState } from '@/components/dashboard/DataStates';
import {
  Plus,
  ChevronDown,
  Calendar,
  Eye,
  MoreHorizontal,
  ArrowRight,
  ArrowLeft,
  FileEdit,
  FileText,
  Package,
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { ordersService } from '@/lib/services/orders.service';
import { workflowService } from '@/lib/services/workflow.service';

/* ─── Stage badge styles ─── */
const STAGE_STYLES = {
  'عرض السعر':      'bg-amber-50 text-amber-700 border border-amber-200',
  'التعميد':         'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'وصول الحوالة':    'bg-violet-50 text-violet-700 border border-violet-200',
  'التصنيع':         'bg-orange-50 text-orange-700 border border-orange-200',
  'تشييك':          'bg-cyan-50 text-cyan-700 border border-cyan-200',
  'شحن':            'bg-blue-50 text-blue-700 border border-blue-200',
  'سابر':           'bg-pink-50 text-pink-700 border border-pink-200',
  'وصول الشحنة':    'bg-teal-50 text-teal-700 border border-teal-200',
  'استلام العمولة':  'bg-purple-50 text-purple-700 border border-purple-200',
  'إغلاق':          'bg-gray-100 text-gray-600 border border-gray-200',
  // Legacy/fallback
  'استلام الطلب':    'bg-slate-50 text-slate-600 border border-slate-200',
  'الموافقة':        'bg-emerald-50 text-emerald-600 border border-emerald-200',
  'الشحن':           'bg-blue-50 text-blue-600 border border-blue-200',
  'الوصول':          'bg-teal-50 text-teal-700 border border-teal-200',
  'تأخير الشحن':     'bg-rose-50 text-rose-600 border border-rose-200',
  'مغلق':            'bg-gray-100 text-gray-600 border border-gray-200',
};

/* ─── Priority config ─── */
const PRIORITY_OPTIONS = [
  { value: 'urgent',  label: 'عاجل',  color: '#EF4444' },
  { value: 'high',    label: 'مرتفع', color: '#F97316' },
  { value: 'medium',  label: 'متوسط', color: '#F59E0B' },
  { value: 'low',     label: 'منخفض', color: '#22C55E' },
];

const PriorityDots = ({ priority }) => {
  const levels = ['low', 'medium', 'high', 'urgent'];
  const idx = levels.indexOf(priority || 'medium');
  const colors = ['#22C55E', '#F59E0B', '#F97316', '#EF4444'];
  return (
    <div className="flex items-center gap-1" dir="ltr">
      {colors.map((c, i) => (
        <span
          key={i}
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: i <= idx ? c : '#E5E7EB' }}
        />
      ))}
    </div>
  );
};

/* ─── Formatters ─── */
const formatCurrency = (n, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(Number(n) || 0);

const formatRelativeTime = (date) => {
  if (!date) return '';
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 60) return 'الآن';
  if (diff < 3600) return `قبل ${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `قبل ${Math.floor(diff / 3600)} ساعة`;
  return `قبل ${Math.floor(diff / 86400)} يوم`;
};

const formatQuantity = (qty) => {
  if (!qty) return '—';
  return `${Number(qty).toLocaleString('ar-EG')} وحدة`;
};

export default function OrdersPage() {
  const [filters, setFilters] = useState({ client: '', product: '', stage: '', priority: '', date: '' });
  const [page, setPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const ordersQuery = useApi(
    () => ordersService.list({ page, limit: 10, ...filters }),
    [page, filters.client, filters.product, filters.stage, filters.priority, filters.date],
  );
  const stagesQuery = useApi(() => workflowService.getStages(), []);

  const orders = ordersQuery.data?.data || [];
  const pagination = ordersQuery.data?.pagination || { currentPage: 1, totalPages: 1 };
  const stages = stagesQuery.data || [];

  const handleFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const pages = useMemo(() => {
    const total = pagination.totalPages;
    const current = pagination.currentPage;
    const result = [];
    // Always show first page
    if (total <= 7) {
      for (let i = 1; i <= total; i++) result.push(i);
    } else {
      result.push(1);
      if (current > 3) result.push('...');
      for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) result.push(i);
      if (current < total - 2) result.push('...');
      result.push(total);
    }
    return result;
  }, [pagination]);

  return (
    <>
      <Header title="قائمة الطلبات" subtitle="" variant="card" />

      <div className="flex flex-wrap items-center justify-between mb-6">
        <h2 className="text-[32px] font-black text-[#040814]">الطلبات</h2>
        <Link
          href="/orders/new"
          className="flex items-center gap-2 bg-[#B08B3A] hover:bg-[#906c27] text-white px-5 py-3 rounded-full font-bold text-sm transition-colors shadow-sm">
          <Plus size={18} strokeWidth={2.5} />
          إنشاء طلب جديد
        </Link>
      </div>

      <div className="space-y-6">
        {/* ─── Filters ─── */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 flex flex-wrap gap-6 shadow-sm">
          <Filter label="العميل">
            <div className="relative">
              <select
                value={filters.client}
                onChange={(e) => handleFilter('client', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-[#040814] font-medium text-sm rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/30 cursor-pointer">
                <option value="">الكل</option>
              </select>
              <ChevronDown className="absolute left-4 top-3.5 text-gray-400 pointer-events-none" size={16} />
            </div>
          </Filter>
          <Filter label="المنتج">
            <div className="relative">
              <select
                value={filters.product}
                onChange={(e) => handleFilter('product', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-[#040814] font-medium text-sm rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/30 cursor-pointer">
                <option value="">الكل</option>
              </select>
              <ChevronDown className="absolute left-4 top-3.5 text-gray-400 pointer-events-none" size={16} />
            </div>
          </Filter>
          <Filter label="المرحلة">
            <div className="relative">
              <select
                value={filters.stage}
                onChange={(e) => handleFilter('stage', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-[#040814] font-medium text-sm rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/30 cursor-pointer">
                <option value="">الكل</option>
                {stages.map((s) => <option key={s.id} value={s.title}>{s.title}</option>)}
              </select>
              <ChevronDown className="absolute left-4 top-3.5 text-gray-400 pointer-events-none" size={16} />
            </div>
          </Filter>
          <Filter label="الأولوية">
            <div className="relative">
              <select
                value={filters.priority}
                onChange={(e) => handleFilter('priority', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-[#040814] font-medium text-sm rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/30 cursor-pointer">
                <option value="">الكل</option>
                {PRIORITY_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
              <ChevronDown className="absolute left-4 top-3.5 text-gray-400 pointer-events-none" size={16} />
            </div>
          </Filter>
          <Filter label="التاريخ">
            <div className="relative">
              <input
                type="date"
                value={filters.date}
                onChange={(e) => handleFilter('date', e.target.value)}
                placeholder="dd/mm/yy"
                className="w-full bg-gray-50 border border-gray-200 text-[#040814] font-medium text-sm rounded-xl pr-4 pl-10 py-3 focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/30"
              />
              <Calendar className="absolute left-4 top-3.5 text-gray-400 pointer-events-none" size={16} />
            </div>
          </Filter>
        </div>

        {/* ─── Table ─── */}
        <div className="bg-white rounded-[32px] border border-gray-200 shadow-sm overflow-hidden pb-4" ref={dropdownRef}>
          {ordersQuery.loading ? (
            <LoadingState />
          ) : ordersQuery.error ? (
            <ErrorState error={ordersQuery.error} onRetry={ordersQuery.refetch} />
          ) : orders.length === 0 ? (
            <EmptyState
              title="لا توجد طلبات"
              description="ابدأ بإنشاء طلب جديد لعملائك"
              icon={Package}
              action={
                <Link href="/orders/new" className="flex items-center gap-2 bg-[#B08B3A] hover:bg-[#906c27] text-white px-6 py-3 rounded-xl font-bold text-sm">
                  <Plus size={18} /> طلب جديد
                </Link>
              }
            />
          ) : (
            <>
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
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((order) => {
                      const stageStyle = STAGE_STYLES[order.currentStage] || 'bg-gray-100 text-gray-600 border border-gray-200';
                      return (
                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-5 px-4 font-bold text-[13px] text-[#040814]" dir="ltr">#{order.displayId}</td>
                          <td className="py-5 px-4 font-bold text-[13px] text-[#040814]">{order.customer?.name || '—'}</td>
                          <td className="py-5 px-4 font-bold text-[13px] text-[#040814]">{order.product?.nameAr || order.product?.name || '—'}</td>
                          <td className="py-5 px-4 font-bold text-[13px] text-[#040814]">{formatQuantity(order.quantity)}</td>
                          <td className="py-5 px-4 font-bold text-[13px] text-[#040814]" dir="ltr">{formatCurrency(order.totalPrice, order.currency)}</td>
                          <td className="py-5 px-4 font-bold text-[13px] text-[#040814]" dir="ltr">{formatCurrency(order.commissionAmount, order.currency)}</td>
                          <td className="py-5 px-4">
                            <span className={`inline-block px-4 py-1.5 rounded-full text-[11px] font-bold ${stageStyle}`}>
                              {order.currentStage}
                            </span>
                          </td>
                          <td className="py-5 px-4">
                            <PriorityDots priority={order.priority || 'medium'} />
                          </td>
                          <td className="py-5 px-4 font-medium text-[13px] text-gray-500">{formatRelativeTime(order.updatedAt)}</td>
                          <td className="py-5 px-4 text-left pl-8">
                            <div className="relative flex items-center justify-end gap-3 text-gray-400">
                              <Link href={`/orders/${order.id}`} className="hover:text-[#040814] p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                                <Eye size={18} />
                              </Link>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === order.id ? null : order.id); }}
                                className="hover:text-[#040814] p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                                <MoreHorizontal size={18} />
                              </button>
                              {openDropdownId === order.id && (
                                <div className="absolute left-5 top-10 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden text-right">
                                  <Link href={`/orders/${order.id}`} className="w-full px-4 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-blue-600 flex items-center gap-2">
                                    <FileText size={16} /> عرض التفاصيل
                                  </Link>
                                  <Link href={`/orders/${order.id}/edit`} className="w-full px-4 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-amber-600 flex items-center gap-2 border-t border-gray-100">
                                    <FileEdit size={16} /> تعديل الطلب
                                  </Link>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* ─── Pagination ─── */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4 pt-6 border-t border-gray-50">
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="w-10 h-10 flex items-center justify-center text-white bg-[#040814] hover:bg-black rounded-full disabled:opacity-30 transition-colors">
                    <ArrowLeft size={18} />
                  </button>
                  {[...pages].reverse().map((p, i) =>
                    p === '...' ? (
                      <span key={`dot-${i}`} className="w-10 h-10 flex items-center justify-center text-gray-400 font-bold text-sm">...</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm transition-colors ${
                          p === pagination.currentPage ? 'text-[#040814] bg-gray-100' : 'text-gray-500 hover:bg-gray-100'
                        }`}>
                        {p}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={pagination.currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full disabled:opacity-30 transition-colors">
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

const Filter = ({ label, children }) => (
  <div className="flex-1 min-w-[150px]">
    <label className="block text-[#B08B3A] font-bold text-sm mb-3">{label}</label>
    {children}
  </div>
);
