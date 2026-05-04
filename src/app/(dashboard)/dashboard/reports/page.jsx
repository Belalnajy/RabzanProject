'use client';

import React, { useMemo, useState } from 'react';
import Header from '@/components/dashboard/Header';
import { LoadingState, ErrorState, EmptyState } from '@/components/dashboard/DataStates';
import {
  FileText, TrendingUp, ShoppingCart, DollarSign, Percent,
  CheckCircle, Download, ChevronDown, BarChart2, AlertTriangle,
  Calendar,
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { reportsService } from '@/lib/services/reports.service';
import { customersService } from '@/lib/services/customers.service';
import { productsService } from '@/lib/services/products.service';

const TABS = [
  { id: 'overview', label: 'نظرة عامة' },
  { id: 'sales', label: 'تقارير المبيعات' },
  { id: 'financial', label: 'التقارير المالية' },
  { id: 'commissions', label: 'تقارير العمولات' },
];

const PERIODS = [
  { value: '', label: 'كل الفترات' },
  { value: '7d', label: 'آخر 7 أيام' },
  { value: '30d', label: 'آخر 30 يوم' },
  { value: '90d', label: 'آخر 90 يوم' },
  { value: '6m', label: 'آخر 6 شهور' },
  { value: '1y', label: 'آخر سنة' },
];

const STATUSES = [
  { value: '', label: 'كل الحالات' },
  { value: 'active', label: 'نشط' },
  { value: 'closed', label: 'مغلق' },
  { value: 'on_hold', label: 'معلق' },
  { value: 'cancelled', label: 'ملغى' },
];

const STATUS_LABEL = { active: 'نشط', closed: 'مغلق', on_hold: 'معلق', cancelled: 'ملغى' };
const STATUS_COLOR = {
  active: 'bg-amber-100/60 text-amber-600',
  closed: 'bg-emerald-100/60 text-emerald-600',
  on_hold: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-rose-100/60 text-rose-600',
};
const STATUS_HEX = { active: '#f59e0b', closed: '#10b981', on_hold: '#6b7280', cancelled: '#ef4444' };

const formatMoney = (n) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Number(n) || 0);
const formatPercent = (n) => `${(Number(n) || 0).toFixed(1)}%`;
const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-CA') : '—');

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({ period: '', client: '', product: '', status: '' });

  const overviewQuery = useApi(
    () => reportsService.getOverview(filters),
    [filters.period, filters.client, filters.product, filters.status],
    { enabled: activeTab === 'overview' },
  );

  const salesQuery = useApi(() => reportsService.getSales(filters), [filters.period, filters.client, filters.product, filters.status], { enabled: activeTab === 'sales' });
  const financialQuery = useApi(() => reportsService.getFinancial(filters), [filters.period, filters.client, filters.product, filters.status], { enabled: activeTab === 'financial' });
  const commissionsQuery = useApi(() => reportsService.getCommissions(filters), [filters.period, filters.client, filters.product, filters.status], { enabled: activeTab === 'commissions' });

  const customersQuery = useApi(() => customersService.list({ limit: 100 }), []);
  const productsQuery = useApi(() => productsService.list({ limit: 100 }), []);

  return (
    <>
      <Header title="" subtitle="" variant="transparent" />

      <div className="flex flex-col mb-8 -mt-4">
        <h1 className="text-3xl font-black text-[#040814] mb-2">لوحة التقارير</h1>
        <p className="text-sm font-bold text-gray-500">نظرة شاملة على مؤشرات الأداء الرئيسية والتحليلات</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col mb-12 overflow-hidden p-6">
        <div className="flex border-b border-gray-100 mb-6 bg-gray-50/50 rounded-xl overflow-hidden p-1">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-center font-bold text-[14px] transition-all rounded-lg ${
                activeTab === tab.id ? 'bg-[#fefce8] text-[#040814] shadow-sm' : 'text-gray-500 hover:bg-white/50'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100 mb-6">
          <FilterField label="الفترة الزمنية">
            <Select value={filters.period} onChange={(v) => setFilters({ ...filters, period: v })}>
              {PERIODS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </Select>
          </FilterField>
          <FilterField label="العميل">
            <Select value={filters.client} onChange={(v) => setFilters({ ...filters, client: v })}>
              <option value="">كل العملاء</option>
              {(customersQuery.data?.data || []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </FilterField>
          <FilterField label="المنتج">
            <Select value={filters.product} onChange={(v) => setFilters({ ...filters, product: v })}>
              <option value="">كل المنتجات</option>
              {(productsQuery.data?.data || []).map((p) => <option key={p.id} value={p.id}>{p.nameAr || p.name}</option>)}
            </Select>
          </FilterField>
          <FilterField label="الحالة">
            <Select value={filters.status} onChange={(v) => setFilters({ ...filters, status: v })}>
              {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </Select>
          </FilterField>
        </div>

        {activeTab === 'overview' && <OverviewTab query={overviewQuery} />}
        {activeTab === 'sales' && <SalesTab query={salesQuery} />}
        {activeTab === 'financial' && <FinancialTab query={financialQuery} />}
        {activeTab === 'commissions' && <CommissionsTab query={commissionsQuery} />}
      </div>
    </>
  );
}

// ================= OVERVIEW =================

function OverviewTab({ query }) {
  if (query.loading) return <LoadingState />;
  if (query.error) return <ErrorState error={query.error} onRetry={query.refetch} />;
  const data = query.data;
  if (!data) return null;

  const { kpis, charts } = data;
  const completedCount = charts.statusBreakdown.find((s) => s.status === 'closed')?.count || 0;
  const completionRate = kpis.totalOrders > 0 ? (completedCount / kpis.totalOrders) * 100 : 0;

  const kpiCards = [
    { id: 1, label: 'إجمالي الإيرادات', value: `EGP ${formatMoney(kpis.totalRevenue)}`, icon: DollarSign, color: 'text-[#003366]', bg: 'bg-blue-50', valColor: 'text-[#003366]' },
    { id: 2, label: 'إجمالي الطلبات', value: kpis.totalOrders, icon: ShoppingCart, color: 'text-amber-500', bg: 'bg-amber-50', valColor: 'text-amber-500' },
    { id: 3, label: 'متوسط قيمة الطلب', value: `EGP ${formatMoney(kpis.avgOrderValue)}`, icon: BarChart2, color: 'text-amber-500', bg: 'bg-amber-50', valColor: 'text-amber-500' },
    { id: 4, label: 'إجمالي العمولات', value: `EGP ${formatMoney(kpis.totalCommission)}`, icon: Percent, color: 'text-purple-500', bg: 'bg-purple-50', valColor: 'text-purple-500' },
    { id: 5, label: 'الطلبات المكتملة', value: completedCount, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', valColor: 'text-emerald-500' },
    { id: 6, label: 'نسبة الإكمال', value: formatPercent(completionRate), icon: TrendingUp, color: 'text-gray-500', bg: 'bg-gray-100', valColor: 'text-[#040814]' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiCards.map((kpi) => (
          <div key={kpi.id} className="border border-gray-100 shadow-sm rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-center hover:shadow-md transition-all">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
              <kpi.icon size={22} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] font-bold text-gray-500">{kpi.label}</span>
            <span className={`text-xl font-black ${kpi.valColor}`} dir="ltr">{kpi.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartBox title="الطلبات حسب الحالة">
          <StatusBars data={charts.statusBreakdown} />
        </ChartBox>
        <ChartBox title="الإيرادات الشهرية">
          <RevenueLine data={charts.monthlyTrend} />
        </ChartBox>
      </div>

      <ExportActions disableExcel={true} />
    </div>
  );
}

// ================= SALES =================

function SalesTab({ query }) {
  if (query.loading) return <LoadingState />;
  if (query.error) return <ErrorState error={query.error} onRetry={query.refetch} />;
  const data = query.data;
  if (!data) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartBox title="المبيعات الشهرية">
          <SalesMonthlyChart data={data.charts.monthlySales} />
        </ChartBox>
        <ChartBox title="أعلى المنتجات (طلبات)">
          <TopProductsBars data={data.charts.topProducts} />
        </ChartBox>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg font-black text-[#040814]">آخر الطلبات</h3>
          <ExportActions pdfOnly={false} data={data} tabName="sales" />
        </div>
        {data.orders?.length === 0 ? (
          <EmptyState title="لا توجد طلبات" description="" icon={ShoppingCart} />
        ) : (
          <div className="overflow-x-auto border border-gray-100 rounded-2xl">
            <table className="w-full text-right text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['رقم الطلب', 'العميل', 'المنتج', 'الإجمالي', 'الحالة', 'التاريخ'].map((h) => (
                    <th key={h} className="py-4 px-4 text-[#D4AF37] font-black">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(data.orders || []).map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-4 px-4 font-bold text-gray-600" dir="ltr">{order.displayId}</td>
                    <td className="py-4 px-4 font-bold text-[#040814]">{order.customer?.name || '—'}</td>
                    <td className="py-4 px-4 font-bold text-gray-600">{order.product?.name || '—'}</td>
                    <td className="py-4 px-4 font-black text-[#040814]" dir="ltr">EGP {formatMoney(order.totalPrice)}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${STATUS_COLOR[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {STATUS_LABEL[order.status] || order.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-gray-500" dir="ltr">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ================= FINANCIAL =================

function FinancialTab({ query }) {
  if (query.loading) return <LoadingState />;
  if (query.error) return <ErrorState error={query.error} onRetry={query.refetch} />;
  const data = query.data;
  if (!data) return null;

  const totalValue = data.clientFinancials?.reduce((s, c) => s + (c.totalValue || 0), 0) || 0;
  const totalPaid = data.clientFinancials?.reduce((s, c) => s + (c.totalPaid || 0), 0) || 0;
  const totalRemaining = data.clientFinancials?.reduce((s, c) => s + (c.remainingBalance || 0), 0) || 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard label="إجمالي القيمة" value={`EGP ${formatMoney(totalValue)}`} icon={DollarSign} color="text-[#003366]" bg="bg-blue-50" />
        <KpiCard label="إجمالي المدفوع" value={`EGP ${formatMoney(totalPaid)}`} icon={CheckCircle} color="text-emerald-500" bg="bg-emerald-50" />
        <KpiCard label="إجمالي المستحق" value={`EGP ${formatMoney(totalRemaining)}`} icon={AlertTriangle} color="text-rose-500" bg="bg-rose-50" />
      </div>

      <ChartBox title="التدفق النقدي الشهري (Confirmed)">
        <CashFlowChart data={data.charts.monthlyFinancials} />
      </ChartBox>

      <div className="mt-4">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg font-black text-[#040814]">البيانات المالية للعملاء</h3>
          <ExportActions pdfOnly={false} data={data} tabName="financial" />
        </div>
        {data.clientFinancials?.length === 0 ? (
          <EmptyState title="لا توجد بيانات" description="" icon={DollarSign} />
        ) : (
          <div className="overflow-x-auto border border-gray-100 rounded-2xl">
            <table className="w-full text-right text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['العميل', 'عدد الطلبات', 'إجمالي القيمة', 'المدفوع', 'المستحق', 'حالة الدفع'].map((h) => (
                    <th key={h} className="py-4 px-4 text-[#D4AF37] font-black">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(data.clientFinancials || []).map((row, i) => {
                  let label = 'مدفوع جزئياً', cls = 'bg-amber-100/60 text-amber-600';
                  if (row.remainingBalance <= 0 && row.totalPaid > 0) { label = 'مدفوع بالكامل'; cls = 'bg-emerald-100/60 text-emerald-600'; }
                  else if (row.totalPaid === 0) { label = 'لم يدفع'; cls = 'bg-rose-100/60 text-rose-600'; }
                  return (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-4 px-4 font-bold text-[#040814]">{row.clientName}</td>
                      <td className="py-4 px-4 font-bold text-gray-600">{row.orderCount}</td>
                      <td className="py-4 px-4 font-black text-[#040814]" dir="ltr">EGP {formatMoney(row.totalValue)}</td>
                      <td className="py-4 px-4 font-bold text-emerald-500" dir="ltr">EGP {formatMoney(row.totalPaid)}</td>
                      <td className="py-4 px-4 font-bold text-amber-500" dir="ltr">EGP {formatMoney(row.remainingBalance)}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${cls}`}>{label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ================= COMMISSIONS =================

function CommissionsTab({ query }) {
  if (query.loading) return <LoadingState />;
  if (query.error) return <ErrorState error={query.error} onRetry={query.refetch} />;
  const data = query.data;
  if (!data) return null;

  const { kpis, charts, commissions } = data;

  const kpiCards = [
    { label: 'إجمالي العمولات', value: `EGP ${formatMoney(kpis.totalCommission)}`, icon: TrendingUp, color: 'text-[#003366]', bg: 'bg-blue-50' },
    { label: 'متوسط نسبة العمولة', value: formatPercent(kpis.avgCommissionRate), icon: Percent, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'إجمالي الطلبات', value: kpis.totalOrders, icon: ShoppingCart, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'متوسط لكل طلب', value: kpis.totalOrders > 0 ? `EGP ${formatMoney(kpis.totalCommission / kpis.totalOrders)}` : 'EGP 0', icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, i) => (
          <KpiCard key={i} label={kpi.label} value={kpi.value} icon={kpi.icon} color={kpi.color} bg={kpi.bg} />
        ))}
      </div>

      <ChartBox title="العمولات الشهرية">
        <CommissionsLine data={charts.monthlyCommissions} />
      </ChartBox>

      <div className="mt-4">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg font-black text-[#040814]">أعلى الطلبات بالعمولة</h3>
          <ExportActions pdfOnly={false} data={data} tabName="commissions" />
        </div>
        {commissions?.length === 0 ? (
          <EmptyState title="لا توجد عمولات" description="" icon={Percent} />
        ) : (
          <div className="overflow-x-auto border border-gray-100 rounded-2xl">
            <table className="w-full text-right text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['رقم الطلب', 'العميل', 'المنتج', 'إجمالي الطلب', 'النسبة', 'مبلغ العمولة', 'التاريخ'].map((h) => (
                    <th key={h} className="py-4 px-4 text-[#D4AF37] font-black">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(commissions || []).map((row) => (
                  <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-4 px-4 font-bold text-gray-600" dir="ltr">{row.displayId}</td>
                    <td className="py-4 px-4 font-bold text-[#040814]">{row.customer?.name || '—'}</td>
                    <td className="py-4 px-4 font-bold text-gray-600">{row.product?.name || '—'}</td>
                    <td className="py-4 px-4 font-bold text-[#040814]" dir="ltr">EGP {formatMoney(row.totalPrice)}</td>
                    <td className="py-4 px-4 font-bold text-amber-500" dir="ltr">{formatPercent(row.commissionRate)}</td>
                    <td className="py-4 px-4 font-black text-emerald-500" dir="ltr">EGP {formatMoney(row.commissionAmount)}</td>
                    <td className="py-4 px-4 font-bold text-gray-500" dir="ltr">{formatDate(row.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ================= Reusables =================

const FilterField = ({ label, children }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[12px] font-black text-[#D4AF37] px-1">{label}</label>
    {children}
  </div>
);

const Select = ({ value, onChange, children }) => (
  <div className="relative">
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-xs font-bold text-[#040814] outline-none cursor-pointer focus:ring-2 focus:ring-amber-500/20">
      {children}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
  </div>
);

const KpiCard = ({ label, value, icon: Icon, color, bg }) => (
  <div className="border border-gray-100 shadow-sm rounded-2xl p-5 flex flex-col items-center justify-center gap-3 text-center hover:shadow-md transition-all">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bg} ${color}`}>
      <Icon size={20} strokeWidth={2.5} />
    </div>
    <span className="text-[11px] font-bold text-gray-500">{label}</span>
    <span className={`text-lg font-black ${color}`} dir="ltr">{value}</span>
  </div>
);

const ChartBox = ({ title, children }) => (
  <div className="border border-gray-100 rounded-2xl p-6 shadow-sm">
    <h3 className="text-base font-black text-[#040814] mb-4">{title}</h3>
    {children}
  </div>
);

const ExportActions = ({ pdfOnly = false, disableExcel = false, data = null, tabName = 'report' }) => {
  const handleExport = (kind) => {
    if (kind === 'pdf') {
      window.print();
      return;
    }
    
    if (kind === 'excel' && data) {
      try {
        let csvContent = '\uFEFF'; // BOM for Arabic support in Excel
        if (tabName === 'sales' && data.orders) {
          csvContent += 'رقم الطلب,العميل,المنتج,الإجمالي,الحالة,التاريخ\n';
          data.orders.forEach(o => {
            csvContent += `${o.displayId},${o.customer?.name || ''},${o.product?.name || ''},${o.totalPrice},${STATUS_LABEL[o.status] || o.status},${formatDate(o.createdAt)}\n`;
          });
        } else if (tabName === 'financial' && data.clientFinancials) {
          csvContent += 'العميل,عدد الطلبات,إجمالي القيمة,المدفوع,المستحق\n';
          data.clientFinancials.forEach(c => {
            csvContent += `${c.clientName},${c.orderCount},${c.totalValue},${c.totalPaid},${c.remainingBalance}\n`;
          });
        } else if (tabName === 'commissions' && data.commissions) {
          csvContent += 'رقم الطلب,العميل,المنتج,إجمالي الطلب,النسبة,مبلغ العمولة,التاريخ\n';
          data.commissions.forEach(c => {
            csvContent += `${c.displayId},${c.customer?.name || ''},${c.product?.name || ''},${c.totalPrice},${c.commissionRate}%,${c.commissionAmount},${formatDate(c.createdAt)}\n`;
          });
        } else {
          alert('تصدير هذه الصفحة غير مدعوم حالياً');
          return;
        }

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rabzan_${tabName}_export_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        alert('فشل التصدير');
      }
    }
  };

  return (
    <div className={`flex gap-3 ${pdfOnly ? '' : 'mt-6'}`}>
      {!pdfOnly && !disableExcel && (
        <button onClick={() => handleExport('excel')}
          className="flex-1 bg-[#D4AF37] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#B08B3A]">
          <FileText size={18} /> تصدير Excel
        </button>
      )}
      <button onClick={() => handleExport('pdf')}
        className={`bg-[#003366] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#002244] ${pdfOnly ? 'px-6' : 'flex-1'}`}>
        <Download size={18} /> {pdfOnly ? 'تصدير PDF' : 'تصدير ملخص PDF'}
      </button>
    </div>
  );
};

// ================= Charts =================

function StatusBars({ data }) {
  if (!data || data.length === 0) return <EmptyChart />;
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="h-48 flex items-end justify-around px-4 gap-3">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-2 flex-1">
          <span className="text-xs font-black text-[#040814]">{d.count}</span>
          <div className="w-full max-w-12 rounded-t-md transition-all hover:opacity-80"
            style={{ height: `${(d.count / max) * 80}%`, backgroundColor: STATUS_HEX[d.status] || '#6b7280', minHeight: '4px' }} />
          <span className="text-[10px] text-gray-500 font-bold">{STATUS_LABEL[d.status] || d.status}</span>
        </div>
      ))}
    </div>
  );
}

function RevenueLine({ data }) {
  if (!data || data.length === 0) return <EmptyChart />;
  const max = Math.max(1, ...data.map((d) => d.revenue));
  const points = data.map((d, i) => {
    const x = (i / Math.max(1, data.length - 1)) * 380 + 10;
    const y = 180 - (d.revenue / max) * 150;
    return `${x},${y}`;
  });
  return (
    <div className="h-48" dir="ltr">
      <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline points={`10,180 ${points.join(' ')} 390,180`} fill="url(#revGradient)" />
        <polyline points={points.join(' ')} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
        {data.map((d, i) => {
          const [x, y] = points[i].split(',').map(Number);
          return <circle key={i} cx={x} cy={y} r="3" fill="#3b82f6" />;
        })}
      </svg>
      <div className="flex justify-between mt-2 text-[10px] text-gray-400 px-2">
        {data.map((d) => <span key={d.month}>{d.month.slice(5)}</span>)}
      </div>
    </div>
  );
}

function SalesMonthlyChart({ data }) {
  if (!data || data.length === 0) return <EmptyChart />;
  const sorted = [...data].sort((a, b) => a.month.localeCompare(b.month));
  const max = Math.max(1, ...sorted.map((d) => d.revenue));
  return (
    <div className="h-48 flex items-end justify-between px-2 gap-2" dir="ltr">
      {sorted.map((d, i) => (
        <div key={i} className="flex flex-col items-center flex-1 gap-2">
          <span className="text-[10px] font-black text-[#040814]">{formatMoney(d.revenue)}</span>
          <div className="w-full bg-[#003366] rounded-t-md transition-all hover:opacity-80"
            style={{ height: `${(d.revenue / max) * 70}%`, minHeight: '4px' }} />
          <span className="text-[10px] text-gray-500 font-bold">{d.month.slice(5)}</span>
        </div>
      ))}
    </div>
  );
}

function TopProductsBars({ data }) {
  if (!data || data.length === 0) return <EmptyChart />;
  const max = Math.max(1, ...data.map((d) => d.orderCount));
  return (
    <div className="h-48 flex flex-col gap-2 overflow-y-auto pr-2">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-600 w-32 truncate" title={d.productName}>{d.productName}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(d.orderCount / max) * 100}%` }} />
          </div>
          <span className="text-xs font-black text-[#040814] w-8 text-left" dir="ltr">{d.orderCount}</span>
        </div>
      ))}
    </div>
  );
}

function CashFlowChart({ data }) {
  if (!data || data.length === 0) return <EmptyChart />;
  const sorted = [...data].sort((a, b) => a.month.localeCompare(b.month));
  const max = Math.max(1, ...sorted.map((d) => d.totalPaid));
  const points = sorted.map((d, i) => {
    const x = (i / Math.max(1, sorted.length - 1)) * 380 + 10;
    const y = 180 - (d.totalPaid / max) * 150;
    return `${x},${y}`;
  });
  return (
    <div className="h-48" dir="ltr">
      <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible">
        <polyline points={points.join(' ')} fill="none" stroke="#10b981" strokeWidth="2.5" />
        {sorted.map((d, i) => {
          const [x, y] = points[i].split(',').map(Number);
          return <g key={i}><circle cx={x} cy={y} r="4" fill="#10b981" /></g>;
        })}
      </svg>
      <div className="flex justify-between mt-2 text-[10px] text-gray-400 px-2">
        {sorted.map((d) => <span key={d.month}>{d.month.slice(5)}</span>)}
      </div>
    </div>
  );
}

function CommissionsLine({ data }) {
  if (!data || data.length === 0) return <EmptyChart />;
  const sorted = [...data].sort((a, b) => a.month.localeCompare(b.month));
  const max = Math.max(1, ...sorted.map((d) => d.commission));
  return (
    <div className="h-48 flex items-end justify-between px-2 gap-2" dir="ltr">
      {sorted.map((d, i) => (
        <div key={i} className="flex flex-col items-center flex-1 gap-2">
          <span className="text-[10px] font-black text-purple-600">{formatMoney(d.commission)}</span>
          <div className="w-full bg-purple-500 rounded-t-md transition-all hover:opacity-80"
            style={{ height: `${(d.commission / max) * 70}%`, minHeight: '4px' }} />
          <span className="text-[10px] text-gray-500 font-bold">{d.month.slice(5)}</span>
        </div>
      ))}
    </div>
  );
}

const EmptyChart = () => (
  <div className="h-48 flex items-center justify-center text-gray-400 font-bold text-sm">لا توجد بيانات</div>
);
