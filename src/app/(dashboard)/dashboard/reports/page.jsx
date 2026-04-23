'use client';

import React, { useState } from 'react';
import Header from '../../../../components/dashboard/Header';
import {
  FileText, TrendingUp, ShoppingCart, DollarSign, Percent, 
  CheckCircle, Download, AlertTriangle, Calendar, BarChart2,
  ChevronDown, ChevronLeft, ChevronRight, ArrowLeft
} from 'lucide-react';

// ==========================================
// MOCK DATA & CONSTANTS (API Ready)
// ==========================================
const TABS = [
  { id: 'overview', label: 'نظرة عامة' },
  { id: 'sales', label: 'تقارير المبيعات' },
  { id: 'financial', label: 'التقارير المالية' },
  { id: 'commissions', label: 'تقارير العمولات' },
];

const MOCK_OVERVIEW_KPIS = [
  { id: 1, label: 'إجمالي المبيعات', value: '3,500,000 EGP', icon: DollarSign, color: 'text-[#003366]', bg: 'bg-blue-50', valColor: 'text-[#003366]' },
  { id: 2, label: 'إجمالي الطلبات', value: '270', icon: ShoppingCart, color: 'text-amber-500', bg: 'bg-amber-50', valColor: 'text-amber-500' },
  { id: 3, label: 'متوسط قيمة الطلب', value: '12,963 EGP', icon: BarChart2, color: 'text-amber-500', bg: 'bg-amber-50', valColor: 'text-amber-500' },
  { id: 4, label: 'إجمالي الأرباح', value: '1,050,000 EGP', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50', valColor: 'text-emerald-500' },
  { id: 5, label: 'إجمالي العمولات', value: '3,500,000 EGP', icon: Percent, color: 'text-purple-500', bg: 'bg-purple-50', valColor: 'text-purple-500' },
  { id: 6, label: 'نسبة الطلبات المكتملة', value: '53.7%', icon: CheckCircle, color: 'text-gray-500', bg: 'bg-gray-100', valColor: 'text-[#040814]' },
];

const MOCK_COMMISSION_KPIS = [
  { id: 1, label: 'إجمالي العمولات المتولدة', value: '458,750 ريال', icon: TrendingUp, color: 'text-[#003366]', bg: 'bg-blue-50', valColor: 'text-[#003366]' },
  { id: 2, label: 'العمولات المستلمة', value: '382,500 ريال', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', valColor: 'text-emerald-500' },
  { id: 3, label: 'العمولات المتبقية', value: '76,250 ريال', icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50', valColor: 'text-rose-500' },
  { id: 4, label: 'عمولات حسب الفترة', value: '152,187 ريال', icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-50', valColor: 'text-amber-500' },
];

const MOCK_SALES_TABLE = [
  { id: 'ORD-12456', client: 'سارة عبدالرحمن', product: 'صمامات صناعية', qty: 350, total: '125,000 EGP', comm: '6,250 EGP', status: 'مكتملة', statusColor: 'bg-emerald-100/60 text-emerald-600', date: '2026-03-01' },
  { id: 'ORD-12457', client: 'سارة عبدالرحمن', product: 'صمامات صناعية', qty: 350, total: '125,000 EGP', comm: '6,250 EGP', status: 'معلقة', statusColor: 'bg-amber-100/60 text-amber-600', date: '2026-03-01' },
  { id: 'ORD-12458', client: 'سارة عبدالرحمن', product: 'صمامات صناعية', qty: 350, total: '125,000 EGP', comm: '6,250 EGP', status: 'ملغية', statusColor: 'bg-rose-100/60 text-rose-600', date: '2026-03-01' },
];

const MOCK_FINANCIAL_TABLE = [
  { client: 'سارة عبدالرحمن', rev: '450,000 EGP', paid: '405,000 EGP', due: '45,000 EGP', over: '---', status: 'مدفوع جزئياً', statusColor: 'bg-amber-100/60 text-amber-600' },
  { client: 'سارة عبدالرحمن', rev: '450,000 EGP', paid: '450,000 EGP', due: '0 EGP', over: '---', status: 'مدفوع بالكامل', statusColor: 'bg-emerald-100/60 text-emerald-600' },
  { client: 'سارة عبدالرحمن', rev: '450,000 EGP', paid: '405,000 EGP', due: '45,000 EGP', over: '35,000 EGP', status: 'متأخر', statusColor: 'bg-rose-100/60 text-rose-600' },
];

const MOCK_COMMISSION_TABLE = [
  { id: 'ORD-003', client: 'العميل ج', amount: '18,500 ريال', received: '10,000 ريال', rem: '8,500 ريال', remColor: 'text-rose-500', date: '2024-01-22' },
  { id: 'ORD-004', client: 'العميل ج', amount: '18,500 ريال', received: '10,000 ريال', rem: '8,500 ريال', remColor: 'text-rose-500', date: '2024-01-22' },
  { id: 'ORD-005', client: 'العميل ج', amount: '18,500 ريال', received: '10,000 ريال', rem: '8,500 ريال', remColor: 'text-rose-500', date: '2024-01-22' },
];

// ==========================================
// VISUAL COMPONENTS
// ==========================================

const BarChart = ({ labels, data, colors, dual = false, dualLegend }) => (
  <div className="w-full h-48 flex flex-col relative mt-8">
    {dual && (
      <div className="absolute -top-8 left-0 right-0 flex justify-center gap-4">
        {dualLegend.map((lg, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-4 h-1.5 rounded-sm ${colors[i]}`} />
            <span className="text-[10px] font-bold text-gray-500">{lg}</span>
          </div>
        ))}
      </div>
    )}
    <div className="absolute inset-0 flex flex-col justify-between z-0 pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-full border-b border-dashed border-gray-200 h-0 flex items-end">
          <span className="absolute -left-4 text-[9px] text-gray-400 font-bold -translate-y-1.5">
            {i === 4 ? '0' : (4 - i) * 50}
          </span>
        </div>
      ))}
    </div>
    <div className="flex-1 flex items-end justify-around z-10 px-4 ml-6 pb-2">
      {data.map((val, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          {!dual ? (
            <div className={`w-8 md:w-10 rounded-t-md ${colors[0]} transition-all duration-500 hover:opacity-80`} style={{ height: `${val}%` }} />
          ) : (
            <div className="flex items-end gap-1.5">
              <div className={`w-4 md:w-5 rounded-t-md ${colors[0]} transition-all duration-500 hover:opacity-80`} style={{ height: `${val[0]}%` }} />
              <div className={`w-4 md:w-5 rounded-t-md ${colors[1]} transition-all duration-500 hover:opacity-80`} style={{ height: `${val[1]}%` }} />
            </div>
          )}
          <span className="text-[10px] md:text-xs text-gray-500 font-bold -mb-6">{labels[i]}</span>
        </div>
      ))}
    </div>
  </div>
);

const PieChart = ({ gradient, legend }) => (
  <div className="flex flex-col items-center justify-center gap-6 py-4">
    <div className="w-40 h-40 rounded-full shadow-inner transition-transform hover:scale-105 duration-300" style={{ background: gradient }} />
    <div className="flex flex-wrap justify-center gap-4">
      {legend.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`w-4 h-1.5 rounded-sm ${item.color}`} />
          <span className="text-xs font-bold text-gray-600">{item.label}</span>
        </div>
      ))}
    </div>
  </div>
);

const AreaChart = ({ strokeColor, fillColor, isSmooth = true }) => {
  const pathData = isSmooth 
    ? "M0,70 Q15,40 30,80 T60,30 T80,80 T100,20 L100,100 L0,100 Z" 
    : "M0,70 L15,40 L30,80 L60,30 L80,80 L100,20 L100,100 L0,100 Z";
  const linePathData = isSmooth 
    ? "M0,70 Q15,40 30,80 T60,30 T80,80 T100,20" 
    : "M0,70 L15,40 L30,80 L60,30 L80,80 L100,20";
    
  return (
    <div className="relative w-full h-48 mt-4 ml-6 pr-6">
      <div className="absolute inset-0 flex flex-col justify-between z-0 pointer-events-none pb-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-full border-b border-dashed border-gray-200 h-0 flex items-end">
            <span className="absolute -left-6 text-[9px] text-gray-400 font-bold -translate-y-1.5">
              {i === 4 ? '0' : (4 - i) * 2}
            </span>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 pb-6">
        <svg className="w-full h-full z-10" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d={pathData} fill={fillColor} />
          <path d={linePathData} fill="none" stroke={strokeColor} strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <circle cx="0" cy="70" r="1.5" fill={strokeColor} />
          <circle cx="15" cy="40" r="1.5" fill={strokeColor} />
          <circle cx="30" cy="80" r="1.5" fill={strokeColor} />
          <circle cx="60" cy="30" r="1.5" fill={strokeColor} />
          <circle cx="80" cy="80" r="1.5" fill={strokeColor} />
          <circle cx="100" cy="20" r="1.5" fill={strokeColor} />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[10px] text-gray-400 font-bold" dir="ltr">
        <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
      </div>
    </div>
  );
};

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================
export default function ReportsPage() {
  // TODO: Add API fetching hooks here based on activeTab
  const [activeTab, setActiveTab] = useState('overview');

  // Common Header Actions
  const renderActions = (isPdfOnly = true) => (
    <div className="flex gap-4 mt-6">
      {!isPdfOnly && (
        <button 
          onClick={() => {/* TODO: Handle Excel Export */}}
          className="flex-1 bg-[#D4AF37] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#B08B3A] transition-colors focus:outline-none"
        >
          <FileText size={18} />
          تصدير تقرير تفصيلي (Excel)
        </button>
      )}
      <button 
        onClick={() => {/* TODO: Handle PDF Export */}}
        className={`bg-[#003366] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#002244] transition-colors focus:outline-none ${isPdfOnly ? 'w-auto px-6 bg-[#D4AF37] hover:bg-[#B08B3A]' : 'flex-1'}`}
      >
        <Download size={18} />
        {isPdfOnly ? 'تصدير (PDF)' : 'تصدير ملخص التقرير (PDF)'}
      </button>
    </div>
  );

  return (
    <>
      <Header title="" subtitle="" variant="transparent" />

      {/* Page Header Area */}
      <div className="flex flex-col mb-8 mt-[-1rem]">
        <h1 className="text-3xl font-black text-[#040814] mb-2">لوحة التقارير</h1>
        <p className="text-sm font-bold text-gray-500">نظرة شاملة على مؤشرات الأداء الرئيسية والتحليلات</p>
      </div>

      {/* Main Tabs Wrapper */}
      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm flex flex-col mb-12 overflow-hidden p-6">
        
        {/* Tabs Row */}
        <div className="flex border-b border-gray-100 mb-6 bg-gray-50/50 rounded-xl overflow-hidden p-1">
          {TABS.map(tab => (
            <button 
              key={tab.id}
              className={`flex-1 py-3 text-center font-bold text-[14px] transition-all rounded-lg ${activeTab === tab.id ? 'bg-[#fefce8] text-[#040814] shadow-sm' : 'bg-transparent text-gray-500 hover:text-gray-800 hover:bg-white/50'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ============================================================== */}
        {/* OVERVIEW TAB */}
        {/* ============================================================== */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-6">
            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              {['الفترة الزمنية', 'العميل', 'المنتج', 'الحالة'].map((label, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <label className="text-[12px] font-black text-[#D4AF37] px-1">{label}</label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-xs font-bold text-[#040814] outline-none cursor-pointer focus:ring-2 focus:ring-amber-500/20">
                      <option>الكل</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  </div>
                </div>
              ))}
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_OVERVIEW_KPIS.map(kpi => (
                <div key={kpi.id} className="border border-gray-100 shadow-sm rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-center transition-all hover:shadow-md hover:border-gray-200">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
                    <kpi.icon size={22} strokeWidth={2.5} />
                  </div>
                  <span className="text-[11px] font-bold text-gray-500">{kpi.label}</span>
                  <span className={`text-xl font-black ${kpi.valColor}`} dir="ltr">{kpi.value}</span>
                </div>
              ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-black text-[#040814] mb-4">الطلبات حسب الحالة</h3>
                <BarChart 
                  labels={['مكتملة', 'قيد المعالجة', 'معلقة', 'ملغية']} 
                  data={[80, 40, 30, 20]} 
                  colors={['bg-[#f59e0b]']} 
                />
              </div>
              <div className="border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-black text-[#040814] mb-4 text-center md:text-right">توزيع الإيرادات</h3>
                <PieChart 
                  gradient="conic-gradient(#1e3a8a 0% 25%, #3b82f6 25% 55%, #60a5fa 55% 85%, #93c5fd 85% 100%)"
                  legend={[
                    { label: 'أخرى', color: 'bg-[#93c5fd]' },
                    { label: 'أثاث', color: 'bg-[#60a5fa]' },
                    { label: 'مواد بناء', color: 'bg-[#3b82f6]' },
                    { label: 'معدات كهربائية', color: 'bg-[#1e3a8a]' }
                  ]}
                />
              </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-black text-[#040814] mb-4">توزيع الإيرادات (شهري)</h3>
                <AreaChart strokeColor="#003366" fillColor="transparent" />
              </div>
              <div className="border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-black text-[#040814] mb-4">اتجاه الأرباح</h3>
                <AreaChart strokeColor="#10b981" fillColor="rgba(16, 185, 129, 0.1)" />
              </div>
            </div>

            {renderActions(false)}
          </div>
        )}

        {/* ============================================================== */}
        {/* SALES TAB */}
        {/* ============================================================== */}
        {activeTab === 'sales' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-black text-[#040814] mb-4">المبيعات عبر الزمن</h3>
                <AreaChart strokeColor="#003366" fillColor="transparent" />
              </div>
              <div className="border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-black text-[#040814] mb-4">توزيع الطلبات حسب الحالة</h3>
                <PieChart 
                  gradient="conic-gradient(#1e3a8a 0% 30%, #3b82f6 30% 60%, #60a5fa 60% 85%, #93c5fd 85% 100%)"
                  legend={[
                    { label: 'مكتملة', color: 'bg-[#1e3a8a]' },
                    { label: 'قيد المعالجة', color: 'bg-[#3b82f6]' },
                    { label: 'معلقة', color: 'bg-[#60a5fa]' },
                    { label: 'ملغية', color: 'bg-[#93c5fd]' }
                  ]}
                />
              </div>
              <div className="border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-black text-[#040814] mb-4">المبيعات حسب العميل</h3>
                <BarChart 
                  labels={['فاطمة أحمد', 'أحمد محمد', 'خالد سعيد', 'سارة عبدالرحمن']} 
                  data={[90, 50, 40, 35]} 
                  colors={['bg-[#3b82f6]']} 
                />
              </div>
              <div className="border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-black text-[#040814] mb-4">المبيعات حسب المنتج</h3>
                <BarChart 
                  labels={['صمامات صناعية', 'معدات كهربائية', 'مواد بناء', 'أنابيب فولاذية']} 
                  data={[85, 45, 35, 30]} 
                  colors={['bg-[#f59e0b]']} 
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-lg font-black text-[#040814]">تفاصيل الطلبات</h3>
                {renderActions(true)}
              </div>
              <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                <table className="w-full text-right text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="py-4 px-4 text-[#D4AF37] font-black">رقم الطلب</th>
                      <th className="py-4 px-4 text-[#D4AF37] font-black">العميل</th>
                      <th className="py-4 px-4 text-[#D4AF37] font-black">المنتج</th>
                      <th className="py-4 px-4 text-[#D4AF37] font-black">الكمية</th>
                      <th className="py-4 px-4 text-[#D4AF37] font-black">الإجمالي</th>
                      <th className="py-4 px-4 text-[#D4AF37] font-black">العمولة</th>
                      <th className="py-4 px-4 text-[#D4AF37] font-black">الحالة</th>
                      <th className="py-4 px-4 text-[#D4AF37] font-black">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_SALES_TABLE.map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-4 font-bold text-gray-600" dir="ltr">{row.id}</td>
                        <td className="py-4 px-4 font-bold text-[#040814]">{row.client}</td>
                        <td className="py-4 px-4 font-bold text-gray-600">{row.product}</td>
                        <td className="py-4 px-4 font-bold text-amber-500">{row.qty}</td>
                        <td className="py-4 px-4 font-black text-[#040814]" dir="ltr">{row.total}</td>
                        <td className="py-4 px-4 font-bold text-gray-600" dir="ltr">{row.comm}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${row.statusColor}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-bold text-gray-500" dir="ltr">{row.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* FINANCIAL TAB */}
        {/* ============================================================== */}
        {activeTab === 'financial' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-black text-[#040814] mb-4">توزيع أنواع الدفعات</h3>
                <PieChart 
                  gradient="conic-gradient(#1e3a8a 0% 45%, #3b82f6 45% 75%, #60a5fa 75% 90%, #93c5fd 90% 100%)"
                  legend={[
                    { label: 'دفعة أولى', color: 'bg-[#1e3a8a]' },
                    { label: 'دفعة نهائية', color: 'bg-[#3b82f6]' },
                    { label: 'عمولة', color: 'bg-[#60a5fa]' },
                    { label: 'دفعات جزئية', color: 'bg-[#93c5fd]' }
                  ]}
                />
              </div>
              <div className="border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-black text-[#040814] mb-4">المدفوع مقابل المستحق</h3>
                <BarChart 
                  labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']} 
                  data={[[30, 40], [60, 20], [50, 40], [45, 60], [70, 30], [80, 20], [40, 50]]} 
                  colors={['bg-emerald-500', 'bg-amber-500']} 
                  dual={true}
                  dualLegend={['مدفوع', 'مستحق']}
                />
              </div>
              <div className="border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-black text-[#040814] mb-4">التدفق النقدي الشهري</h3>
                <AreaChart strokeColor="#003366" fillColor="transparent" isSmooth={true} />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-lg font-black text-[#040814]">البيانات المالية للعملاء</h3>
                {renderActions(true)}
              </div>
              <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                <table className="w-full text-right text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="py-4 px-4 text-[#D4AF37] font-black">العميل</th>
                      <th className="py-4 px-4 text-[#D4AF37] font-black">إجمالي الإيرادات</th>
                      <th className="py-4 px-4 text-[#D4AF37] font-black">إجمالي المدفوع</th>
                      <th className="py-4 px-4 text-[#D4AF37] font-black">المستحق</th>
                      <th className="py-4 px-4 text-[#D4AF37] font-black">المتأخرات</th>
                      <th className="py-4 px-4 text-[#D4AF37] font-black">حالة الدفع</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_FINANCIAL_TABLE.map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-4 font-bold text-[#040814]">{row.client}</td>
                        <td className="py-4 px-4 font-black text-[#040814]" dir="ltr">{row.rev}</td>
                        <td className="py-4 px-4 font-bold text-emerald-500" dir="ltr">{row.paid}</td>
                        <td className="py-4 px-4 font-bold text-amber-500" dir="ltr">{row.due}</td>
                        <td className={`py-4 px-4 font-bold ${row.over !== '---' ? 'text-rose-500' : 'text-gray-400'}`} dir="ltr">{row.over}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${row.statusColor}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* COMMISSIONS TAB */}
        {/* ============================================================== */}
        {activeTab === 'commissions' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {MOCK_COMMISSION_KPIS.map(kpi => (
                <div key={kpi.id} className="border border-gray-100 shadow-sm rounded-2xl p-5 flex flex-col items-center justify-center gap-3 text-center transition-all hover:shadow-md">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
                    <kpi.icon size={20} strokeWidth={2.5} />
                  </div>
                  <span className="text-[11px] font-bold text-gray-500">{kpi.label}</span>
                  <span className={`text-lg font-black ${kpi.valColor}`} dir="ltr">{kpi.value}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-black text-[#040814] mb-4">توزيع حالة العمولات</h3>
                <PieChart 
                  gradient="conic-gradient(#1e3a8a 0% 40%, #3b82f6 40% 80%, #60a5fa 80% 100%)"
                  legend={[
                    { label: 'مستلمة', color: 'bg-[#1e3a8a]' },
                    { label: 'غير مستلمة', color: 'bg-[#3b82f6]' },
                    { label: 'جزئي', color: 'bg-[#60a5fa]' }
                  ]}
                />
              </div>
              <div className="border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-black text-[#040814] mb-4">العمولات حسب العميل</h3>
                <BarChart 
                  labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']} 
                  data={[[40, 20], [70, 30], [60, 40], [50, 60], [80, 20], [90, 10], [50, 40]]} 
                  colors={['bg-emerald-500', 'bg-amber-500']} 
                  dual={true}
                  dualLegend={['مدفوع', 'مستحق']}
                />
              </div>
              <div className="border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-black text-[#040814] mb-4">اتجاه العمولات عبر الزمن</h3>
                <AreaChart strokeColor="#003366" fillColor="transparent" isSmooth={true} />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-lg font-black text-[#040814]">تفاصيل العمولات</h3>
                {renderActions(true)}
              </div>
              <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                <table className="w-full text-right text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="py-4 px-4 text-[#D4AF37] font-black">رقم الطلب</th>
                      <th className="py-4 px-4 text-[#D4AF37] font-black">العميل</th>
                      <th className="py-4 px-4 text-[#D4AF37] font-black">مبلغ العمولة</th>
                      <th className="py-4 px-4 text-[#D4AF37] font-black">المستلم</th>
                      <th className="py-4 px-4 text-[#D4AF37] font-black">المتبقي</th>
                      <th className="py-4 px-4 text-[#D4AF37] font-black">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_COMMISSION_TABLE.map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-4 font-bold text-gray-600" dir="ltr">{row.id}</td>
                        <td className="py-4 px-4 font-bold text-[#040814]">{row.client}</td>
                        <td className="py-4 px-4 font-black text-[#040814]" dir="ltr">{row.amount}</td>
                        <td className="py-4 px-4 font-bold text-gray-600" dir="ltr">{row.received}</td>
                        <td className={`py-4 px-4 font-bold ${row.remColor}`} dir="ltr">{row.rem}</td>
                        <td className="py-4 px-4 font-bold text-gray-500" dir="ltr">{row.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
