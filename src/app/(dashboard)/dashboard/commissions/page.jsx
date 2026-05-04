'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/dashboard/Header';
import { LoadingState, ErrorState, EmptyState } from '@/components/dashboard/DataStates';
import {
  TrendingUp,
  CreditCard,
  AlertTriangle,
  Eye,
  ArrowLeft,
  ArrowRight,
  Receipt,
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { commissionsService } from '@/lib/services/commissions.service';

const formatMoney = (n) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Number(n) || 0);

const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-CA') : '—');

export default function CommissionTrackingPage() {
  const [page, setPage] = useState(1);
  const statsQuery = useApi(() => commissionsService.getStats(), []);
  const listQuery = useApi(() => commissionsService.list({ page, limit: 10 }), [page]);

  const stats = statsQuery.data;
  const items = listQuery.data?.data || [];
  const pagination = listQuery.data?.pagination || { currentPage: 1, totalPages: 1 };

  const statCards = useMemo(() => {
    if (!stats) return [];
    return [
      { id: 1, title: 'إجمالي العمولات', value: stats.totalCommissions, icon: TrendingUp, iconColor: 'text-emerald-500', iconBg: 'bg-emerald-100/60', textColor: 'text-emerald-500' },
      { id: 2, title: 'العمولات المستلمة', value: stats.receivedCommissions, icon: CreditCard, iconColor: 'text-teal-500', iconBg: 'bg-teal-100/60', textColor: 'text-teal-500' },
      { id: 3, title: 'العمولات المتبقية', value: stats.remainingCommissions, icon: AlertTriangle, iconColor: 'text-rose-500', iconBg: 'bg-rose-100/60', textColor: 'text-rose-500' },
    ];
  }, [stats]);

  const pages = useMemo(() => {
    const total = pagination.totalPages;
    const current = pagination.currentPage;
    const range = [];
    for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) range.push(i);
    return range;
  }, [pagination]);

  return (
    <>
      <Header title="تتبع العمولات" subtitle="إدارة وتتبع جميع العمولات المتعلقة بالطلبات" variant="transparent" />

      {statsQuery.loading ? <LoadingState /> :
        statsQuery.error ? <ErrorState error={statsQuery.error} onRetry={statsQuery.refetch} /> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.id} className="bg-white rounded-[24px] p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center mb-5 ${stat.iconBg}`}>
                  <Icon size={24} className={stat.iconColor} />
                </div>
                <h3 className="text-[#040814] font-black text-sm mb-3">{stat.title}</h3>
                <p className={`text-2xl font-black ${stat.textColor}`} dir="ltr">EGP {formatMoney(stat.value)}</p>
              </div>
            );
          })}
        </div>
      )}

      {stats && stats.remainingCommissions > 0 && (
        <div className="bg-amber-50/80 border border-amber-100 rounded-[20px] p-4 flex items-center gap-3 mb-8">
          <AlertTriangle size={20} className="text-[#B08B3A]" />
          <p className="text-[#B08B3A] font-bold text-sm">
            يوجد عمولات غير مستلمة بقيمة <span dir="ltr">EGP {formatMoney(stats.remainingCommissions)}</span>
          </p>
        </div>
      )}

      <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm mb-12 flex flex-col">
        {listQuery.loading ? <LoadingState /> :
          listQuery.error ? <ErrorState error={listQuery.error} onRetry={listQuery.refetch} /> :
          items.length === 0 ? <EmptyState title="لا توجد عمولات" description="لم تتم إضافة عمولات بعد" icon={Receipt} /> : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-right border-separate border-spacing-y-4">
                <thead>
                  <tr>
                    {['رقم الطلب', 'العميل', 'إجمالي العمولة', 'المستلم', 'المتبقي', 'الحالة', 'آخر تحديث', 'الإجراءات'].map((h) => (
                      <th key={h} className="pb-2 text-[14px] text-[#B08B3A] font-black whitespace-nowrap px-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const total = parseFloat(item.commissionAmount) || 0;
                    const received = parseFloat(item.commissionReceived) || 0;
                    const remaining = parseFloat(item.commissionRemaining) || 0;
                    let label = 'غير مستلمة', cls = 'bg-rose-100/50 text-rose-600';
                    if (remaining <= 0) { label = 'مكتملة'; cls = 'bg-emerald-100/50 text-emerald-600'; }
                    else if (received > 0) { label = 'مستلمة جزئياً'; cls = 'bg-amber-100/50 text-amber-600'; }
                    return (
                      <tr key={item.id} className="bg-white border border-gray-100 shadow-sm rounded-[16px] hover:shadow-md transition-shadow group">
                        <td className="py-4 px-4 text-[13px] font-bold text-[#040814] rounded-r-[16px] border-t border-b border-r border-gray-100" dir="ltr">{item.displayId}</td>
                        <td className="py-4 px-4 text-[13px] font-bold text-[#040814] border-t border-b border-gray-100">{item.customer?.name || '—'}</td>
                        <td className="py-4 px-4 text-[13px] font-bold text-[#040814] border-t border-b border-gray-100" dir="ltr">EGP {formatMoney(total)}</td>
                        <td className="py-4 px-4 text-[13px] font-bold text-[#B08B3A] border-t border-b border-gray-100" dir="ltr">EGP {formatMoney(received)}</td>
                        <td className="py-4 px-4 text-[13px] font-bold text-[#040814] border-t border-b border-gray-100" dir="ltr">EGP {formatMoney(remaining)}</td>
                        <td className="py-4 px-4 border-t border-b border-gray-100">
                          <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold inline-block whitespace-nowrap ${cls}`}>{label}</span>
                        </td>
                        <td className="py-4 px-4 text-[13px] font-bold text-[#040814] whitespace-nowrap border-t border-b border-gray-100">{formatDate(item.updatedAt)}</td>
                        <td className="py-4 px-4 border-t border-b border-l border-gray-100 rounded-l-[16px]">
                          <Link href={`/orders/${item.id}`}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-[#040814]">
                            <Eye size={16} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={pagination.currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[#040814] text-white hover:bg-gray-800 disabled:opacity-30">
                  <ArrowRight size={16} />
                </button>
                {pages.map((p) => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm transition-colors ${
                      p === pagination.currentPage ? 'bg-white shadow-sm border border-gray-100 text-[#040814] font-black' : 'text-gray-700 hover:bg-gray-50'
                    }`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={pagination.currentPage === pagination.totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[#040814] text-white hover:bg-gray-800 disabled:opacity-30">
                  <ArrowLeft size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
