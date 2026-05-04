'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/dashboard/Header';
import { LoadingState, ErrorState } from '@/components/dashboard/DataStates';
import {
  TrendingUp,
  CreditCard,
  AlertTriangle,
  Percent,
  Database,
  AlertCircle,
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { financeService } from '@/lib/services/finance.service';

const STATUS_LABELS = {
  active: 'نشط',
  closed: 'مغلق',
  cancelled: 'ملغى',
  on_hold: 'معلق',
};

const STATUS_COLORS = {
  active: '#10b981',
  closed: '#3b82f6',
  on_hold: '#f59e0b',
  cancelled: '#ef4444',
};

const TX_STATUS_BADGE = {
  confirmed: 'bg-emerald-100/50 text-emerald-600',
  pending: 'bg-amber-100/50 text-amber-600',
  voided: 'bg-rose-100/50 text-rose-600',
};

const TX_STATUS_LABEL = {
  confirmed: 'مؤكد',
  pending: 'معلق',
  voided: 'ملغى',
};

const formatMoney = (n) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Number(n) || 0);

const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-CA') : '—');

export default function FinancialOverviewPage() {
  const statsQuery = useApi(() => financeService.getStats(), []);
  const revenueQuery = useApi(() => financeService.getRevenueChart(), []);
  const paidVsDueQuery = useApi(() => financeService.getPaidVsDueChart(), []);
  const statusDistQuery = useApi(() => financeService.getStatusDistribution(), []);
  const recentQuery = useApi(() => financeService.getRecentTransactions(), []);
  const commissionQuery = useApi(() => financeService.getCommissionTracking({ page: 1, limit: 5 }), []);

  const statCards = useMemo(() => {
    const s = statsQuery.data;
    if (!s) return [];
    return [
      { id: 1, title: 'إجمالي الإيرادات', value: s.totalRevenue, icon: TrendingUp, iconColor: 'text-emerald-500', iconBg: 'bg-emerald-100/60', textColor: 'text-emerald-500' },
      { id: 2, title: 'إجمالي المدفوع', value: s.totalPaid, icon: CreditCard, iconColor: 'text-teal-500', iconBg: 'bg-teal-100/60', textColor: 'text-teal-500' },
      { id: 3, title: 'إجمالي المستحق', value: s.totalDue, icon: AlertTriangle, iconColor: 'text-rose-500', iconBg: 'bg-rose-100/60', textColor: 'text-rose-500' },
      { id: 4, title: 'العمولات المولدة', value: s.commissionsGenerated, icon: Percent, iconColor: 'text-amber-500', iconBg: 'bg-amber-100/60', textColor: 'text-amber-500' },
      { id: 5, title: 'العمولة المستلمة', value: s.commissionsReceived, icon: Database, iconColor: 'text-purple-500', iconBg: 'bg-purple-100/60', textColor: 'text-purple-500' },
      { id: 6, title: 'العمولة المعلقة', value: s.commissionsPending, icon: AlertCircle, iconColor: 'text-amber-500', iconBg: 'bg-amber-100/60', textColor: 'text-amber-500' },
    ];
  }, [statsQuery.data]);

  return (
    <>
      <Header title="" subtitle="" variant="transparent" />

      <div className="flex items-center justify-between mb-8 mt-[-1rem]">
        <h1 className="text-2xl font-black text-[#040814]">النظرة المالية</h1>
      </div>

      {statsQuery.loading ? (
        <LoadingState />
      ) : statsQuery.error ? (
        <ErrorState error={statsQuery.error} onRetry={statsQuery.refetch} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.id} className="bg-white rounded-[24px] p-5 border border-gray-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center mb-4 ${stat.iconBg}`}>
                  <Icon size={24} className={stat.iconColor} />
                </div>
                <h3 className="text-gray-500 font-bold text-[11px] mb-2">{stat.title}</h3>
                <p className={`text-base font-black ${stat.textColor}`} dir="ltr">EGP {formatMoney(stat.value)}</p>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <ChartCard title="توزيع حالات الطلبات">
          <StatusDistChart query={statusDistQuery} />
        </ChartCard>
        <ChartCard title="المدفوع مقابل المستحق (شهرياً)">
          <PaidVsDueChart query={paidVsDueQuery} />
        </ChartCard>
        <ChartCard title="الإيرادات الشهرية">
          <RevenueChart query={revenueQuery} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
        <Card title="تتبع العمولات" link="/dashboard/commissions">
          {commissionQuery.loading ? <LoadingState /> :
            commissionQuery.error ? <ErrorState error={commissionQuery.error} onRetry={commissionQuery.refetch} /> :
            (commissionQuery.data?.data?.length === 0 ? <EmptyRow message="لا توجد عمولات" /> : (
              <table className="w-full text-right">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-4 text-[13px] text-gray-500 font-bold">رقم الطلب</th>
                    <th className="pb-4 text-[13px] text-gray-500 font-bold">العميل</th>
                    <th className="pb-4 text-[13px] text-gray-500 font-bold">العمولة</th>
                    <th className="pb-4 text-[13px] text-gray-500 font-bold">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {(commissionQuery.data?.data || []).map((order) => {
                    const remaining = order.commissionRemaining || 0;
                    const total = parseFloat(order.commissionAmount) || 0;
                    let label = 'غير مستلمة', cls = 'bg-rose-100/50 text-rose-600';
                    if (remaining <= 0) { label = 'مكتملة'; cls = 'bg-emerald-100/50 text-emerald-600'; }
                    else if (remaining < total) { label = 'مستلمة جزئياً'; cls = 'bg-amber-100/50 text-amber-600'; }
                    return (
                      <tr key={order.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                        <td className="py-4 text-[13px] font-bold text-[#040814]" dir="ltr">{order.displayId}</td>
                        <td className="py-4 text-[13px] font-bold text-[#040814]">{order.customer?.name || '—'}</td>
                        <td className="py-4 text-[13px] font-bold text-[#040814]" dir="ltr">{formatMoney(order.commissionAmount)}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold inline-block ${cls}`}>{label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ))}
        </Card>

        <Card title="المعاملات الأخيرة" link="/dashboard/transactions">
          {recentQuery.loading ? <LoadingState /> :
            recentQuery.error ? <ErrorState error={recentQuery.error} onRetry={recentQuery.refetch} /> :
            ((recentQuery.data || []).length === 0 ? <EmptyRow message="لا توجد معاملات" /> : (
              <table className="w-full text-right">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-4 text-[13px] text-gray-500 font-bold">المعرف</th>
                    <th className="pb-4 text-[13px] text-gray-500 font-bold">المبلغ</th>
                    <th className="pb-4 text-[13px] text-gray-500 font-bold">التاريخ</th>
                    <th className="pb-4 text-[13px] text-gray-500 font-bold">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {(recentQuery.data || []).slice(0, 5).map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                      <td className="py-4 text-[13px] font-bold text-[#040814]" dir="ltr">{tx.displayId}</td>
                      <td className="py-4 text-[13px] font-bold text-[#040814]" dir="ltr">{tx.currency} {formatMoney(tx.amount)}</td>
                      <td className="py-4 text-[13px] font-bold text-gray-500" dir="ltr">{formatDate(tx.paymentDate)}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold inline-block ${TX_STATUS_BADGE[tx.status] || 'bg-gray-100 text-gray-600'}`}>
                          {TX_STATUS_LABEL[tx.status] || tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
        </Card>
      </div>
    </>
  );
}

// =============== Helpers ===============

const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col">
    <h3 className="text-lg font-black text-[#040814] mb-6 text-right">{title}</h3>
    <div className="w-full flex-grow min-h-[200px]">{children}</div>
  </div>
);

const Card = ({ title, link, children }) => (
  <div className="bg-white rounded-[24px] p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col">
    <div className="flex justify-between items-center mb-8">
      <h3 className="text-xl font-black text-[#040814]">{title}</h3>
      {link && <Link href={link} className="text-[#B08B3A] font-bold text-sm hover:underline">عرض الكل</Link>}
    </div>
    <div className="overflow-x-auto flex-grow">{children}</div>
  </div>
);

const EmptyRow = ({ message }) => (
  <p className="text-center text-gray-400 font-bold text-sm py-8">{message}</p>
);

function StatusDistChart({ query }) {
  if (query.loading) return <LoadingState />;
  if (query.error) return <ErrorState error={query.error} onRetry={query.refetch} />;
  const data = query.data || [];
  const total = data.reduce((sum, d) => sum + d.count, 0);
  if (total === 0) return <EmptyRow message="لا توجد بيانات" />;

  let cumulative = 0;
  const circumference = 157.08;

  return (
    <div className="flex flex-col items-center justify-center h-full py-4" dir="ltr">
      <div className="relative w-44 h-44 mb-8">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-sm">
          {data.map((d, i) => {
            const length = (d.count / total) * circumference;
            const offset = -cumulative;
            cumulative += length;
            return (
              <circle key={i} cx="50" cy="50" r="25" fill="none"
                stroke={STATUS_COLORS[d.status] || '#94a3b8'} strokeWidth="50"
                strokeDasharray={`${length} ${circumference}`} strokeDashoffset={offset} />
            );
          })}
        </svg>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-4 h-1.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[d.status] || '#94a3b8' }} />
            <span className="text-xs font-bold text-gray-600">{STATUS_LABELS[d.status] || d.status} ({d.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaidVsDueChart({ query }) {
  if (query.loading) return <LoadingState />;
  if (query.error) return <ErrorState error={query.error} onRetry={query.refetch} />;
  const data = (query.data || []).slice(-7);
  if (data.length === 0) return <EmptyRow message="لا توجد بيانات" />;
  const max = Math.max(1, ...data.map((d) => Math.max(d.paid, d.due)));

  return (
    <div className="w-full h-full flex flex-col" dir="ltr">
      <div className="flex justify-center gap-6 mb-4">
        <Legend color="#10b981" label="مدفوع" />
        <Legend color="#f59e0b" label="مستحق" />
      </div>
      <div className="flex-grow flex items-end justify-between px-2 pt-6">
        {data.map((d, i) => (
          <div key={i} className="flex gap-1.5 items-end h-[160px]">
            <div className="flex flex-col justify-end h-full w-3">
              <div className="bg-[#10b981] w-full rounded-t-sm" style={{ height: `${(d.paid / max) * 100}%` }} title={`paid: ${formatMoney(d.paid)}`} />
            </div>
            <div className="flex flex-col justify-end h-full w-3">
              <div className="bg-[#f59e0b] w-full rounded-t-sm" style={{ height: `${(d.due / max) * 100}%` }} title={`due: ${formatMoney(d.due)}`} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between px-2 mt-3 text-[10px] text-gray-400">
        {data.map((d) => <span key={d.month}>{d.month.slice(5)}</span>)}
      </div>
    </div>
  );
}

function RevenueChart({ query }) {
  if (query.loading) return <LoadingState />;
  if (query.error) return <ErrorState error={query.error} onRetry={query.refetch} />;
  const data = query.data || [];
  if (data.length === 0) return <EmptyRow message="لا توجد بيانات" />;

  const max = Math.max(1, ...data.map((d) => d.revenue));
  const points = data.map((d, i) => {
    const x = (i / Math.max(1, data.length - 1)) * 380 + 10;
    const y = 180 - (d.revenue / max) * 150;
    return `${x},${y}`;
  });

  return (
    <div className="w-full h-full" dir="ltr">
      <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline points={`10,180 ${points.join(' ')} 390,180`} fill="url(#revFill)" />
        <polyline points={points.join(' ')} fill="none" stroke="#10b981" strokeWidth="2.5" />
        {data.map((d, i) => {
          const [x, y] = points[i].split(',').map(Number);
          return <circle key={i} cx={x} cy={y} r="3" fill="#10b981" />;
        })}
      </svg>
      <div className="flex justify-between mt-2 text-[10px] text-gray-400 px-2">
        {data.map((d) => <span key={d.month}>{d.month.slice(5)}</span>)}
      </div>
    </div>
  );
}

const Legend = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className="w-4 h-1.5 rounded-full" style={{ backgroundColor: color }} />
    <span className="text-xs font-bold text-gray-600">{label}</span>
  </div>
);
