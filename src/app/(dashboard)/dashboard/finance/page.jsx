'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '../../../../components/dashboard/Header';
import { 
  TrendingUp, 
  CreditCard, 
  AlertTriangle, 
  Percent, 
  Database, 
  AlertCircle,
  Calendar,
  ChevronDown
} from 'lucide-react';

// ==========================================
// MOCK DATA & CONSTANTS (Ready for Backend)
// ==========================================

const MOCK_STATS = [
  {
    id: 1,
    title: 'إجمالي الإيرادات',
    value: 'EGP 2,456,789',
    icon: TrendingUp,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-100/60',
    textColor: 'text-emerald-500'
  },
  {
    id: 2,
    title: 'إجمالي المدفوع',
    value: 'EGP 1,845,234',
    icon: CreditCard,
    iconColor: 'text-teal-500',
    iconBg: 'bg-teal-100/60',
    textColor: 'text-teal-500'
  },
  {
    id: 3,
    title: 'إجمالي المستحق',
    value: 'EGP 611,555',
    icon: AlertTriangle,
    iconColor: 'text-rose-500',
    iconBg: 'bg-rose-100/60',
    textColor: 'text-rose-500'
  },
  {
    id: 4,
    title: 'إجمالي العمولات المولدة',
    value: 'EGP 245,678',
    icon: Percent,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-100/60',
    textColor: 'text-amber-500'
  },
  {
    id: 5,
    title: 'العمولة المستلمة',
    value: 'EGP 198,234',
    icon: Database,
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-100/60',
    textColor: 'text-purple-500'
  },
  {
    id: 6,
    title: 'العمولة المعلقة',
    value: 'EGP 47,444',
    icon: AlertCircle,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-100/60',
    textColor: 'text-amber-500'
  }
];

const RECENT_TRANSACTIONS = [
  { id: '#TRX001', amount: 'EGP 45,230', date: '2026-01-15', status: 'مدفوع', statusColor: 'bg-emerald-100/50 text-emerald-600' },
  { id: '#TRX002', amount: 'EGP 78,950', date: '2026-01-14', status: 'معلق', statusColor: 'bg-amber-100/50 text-amber-600' },
  { id: '#TRX003', amount: 'EGP 23,400', date: '2026-01-13', status: 'مستحق', statusColor: 'bg-rose-100/50 text-rose-600' }
];

const COMMISSION_TRACKING = [
  { orderId: 'ORD-2023-001', client: 'شركة النقل السريع', status: 'مكتملة', statusColor: 'bg-emerald-100/50 text-emerald-600' },
  { orderId: 'ORD-2023-002', client: 'مؤسسة الأعمال المتقدمة', status: 'مستلمة جزئياً', statusColor: 'bg-amber-100/50 text-amber-600' },
  { orderId: 'ORD-2023-003', client: 'شركة التداول العالمية', status: 'غير مستلمة', statusColor: 'bg-rose-100/50 text-rose-600' }
];

// ==========================================
// CHART COMPONENTS
// ==========================================

const MonthlyRevenueChart = () => (
  <div className="w-full h-full relative" dir="ltr">
    <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible">
      {/* Grid lines */}
      {[0, 2, 4, 6, 8, 10].map((val, i) => (
        <g key={i}>
          <text x="0" y={180 - i * 30} fill="#9ca3af" fontSize="10" dx="-15" dy="4">{val}</text>
          <line x1="0" y1={180 - i * 30} x2="400" y2={180 - i * 30} stroke="#f3f4f6" strokeDasharray="4 4" />
        </g>
      ))}
      
      {/* Green Line (Bottom) */}
      <defs>
        <linearGradient id="greenFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d="M 0 160 C 50 150, 80 170, 130 160 C 180 150, 220 170, 270 160 C 320 150, 360 145, 400 145 L 400 180 L 0 180 Z" fill="url(#greenFill)" />
      <path d="M 0 160 C 50 150, 80 170, 130 160 C 180 150, 220 170, 270 160 C 320 150, 360 145, 400 145" fill="none" stroke="#10b981" strokeWidth="2" />

      {/* Blue Line (Top) */}
      <defs>
        <linearGradient id="blueFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d="M 0 120 C 50 115, 80 140, 130 130 C 180 120, 220 80, 270 80 C 320 80, 360 50, 400 50 L 400 180 L 0 180 Z" fill="url(#blueFill)" />
      <path d="M 0 120 C 50 115, 80 140, 130 130 C 180 120, 220 80, 270 80 C 320 80, 360 50, 400 50" fill="none" stroke="#3b82f6" strokeWidth="2" />
      
      {/* X axis labels */}
      <g transform="translate(0, 195)" fill="#9ca3af" fontSize="10" textAnchor="middle">
        <text x="20">Mon</text>
        <text x="80">Tue</text>
        <text x="140">Wed</text>
        <text x="200">Thu</text>
        <text x="260">Fri</text>
        <text x="320">Sat</text>
        <text x="380">Sun</text>
      </g>
    </svg>
  </div>
);

const PaidVsDueChart = () => {
  // TODO: Replace with API data
  const data = [
    { label: 'Mo', paid: 15, due: 6 },
    { label: 'Tu', paid: 18, due: 8 },
    { label: 'We', paid: 15, due: 4 },
    { label: 'Th', paid: 17, due: 10 },
    { label: 'Fr', paid: 18, due: 9 },
    { label: 'Sa', paid: 20, due: 18 },
    { label: 'Su', paid: 16, due: 3 },
  ];
  return (
    <div className="w-full h-full flex flex-col" dir="ltr">
      <div className="flex justify-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1.5 bg-[#10b981] rounded-full"></div>
          <span className="text-xs font-bold text-gray-600">مدفوع</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1.5 bg-[#f59e0b] rounded-full"></div>
          <span className="text-xs font-bold text-gray-600">مستحق</span>
        </div>
      </div>
      <div className="flex-grow relative flex items-end justify-between px-2 pt-6">
        {data.map((d, i) => (
          <div key={i} className="flex gap-1.5 items-end h-[160px]">
            <div className="relative group flex flex-col justify-end h-full w-2.5 sm:w-3.5">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">{d.paid}</div>
              <div className="bg-[#10b981] w-full rounded-t-sm transition-all" style={{ height: `${(d.paid/20)*100}%` }}></div>
            </div>
            <div className="relative group flex flex-col justify-end h-full w-2.5 sm:w-3.5">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">{d.due}</div>
              <div className="bg-[#f59e0b] w-full rounded-t-sm transition-all" style={{ height: `${(d.due/20)*100}%` }}></div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between px-2 mt-3 text-[10px] text-gray-400">
        {data.map(d => <span key={d.label}>{d.label}</span>)}
      </div>
    </div>
  );
}

const FinancialStatusPieChart = () => (
  <div className="flex flex-col items-center justify-center w-full h-full py-4">
    <div className="relative w-44 h-44 mb-8">
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-sm">
        {/* Paid (Green) 60% */}
        <circle cx="50" cy="50" r="25" fill="none" stroke="#10b981" strokeWidth="50" strokeDasharray="94.25 157.08" />
        {/* Due (Amber) 25% */}
        <circle cx="50" cy="50" r="25" fill="none" stroke="#f59e0b" strokeWidth="50" strokeDasharray="39.27 157.08" strokeDashoffset="-94.25" />
        {/* Pending (Yellow-Gold) 15% */}
        <circle cx="50" cy="50" r="25" fill="none" stroke="#ca8a04" strokeWidth="50" strokeDasharray="23.56 157.08" strokeDashoffset="-133.52" />
        
        {/* White separators for clean visual */}
        <circle cx="50" cy="50" r="25" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="1.5 155.58" />
        <circle cx="50" cy="50" r="25" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="1.5 155.58" strokeDashoffset="-94.25" />
        <circle cx="50" cy="50" r="25" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="1.5 155.58" strokeDashoffset="-133.52" />
      </svg>
    </div>
    <div className="flex justify-center gap-6 w-full">
      <div className="flex items-center gap-2">
        <div className="w-4 h-1.5 bg-[#ca8a04] rounded-full"></div>
        <span className="text-xs font-bold text-gray-600">معلق</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-1.5 bg-[#f59e0b] rounded-full"></div>
        <span className="text-xs font-bold text-gray-600">مستحق</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-1.5 bg-[#10b981] rounded-full"></div>
        <span className="text-xs font-bold text-gray-600">مدفوع</span>
      </div>
    </div>
  </div>
);

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================

export default function FinancialOverviewPage() {
  // TODO: Add actual state management for filters
  // const [filters, setFilters] = useState({ date: null, client: null, product: null, status: null });
  
  // TODO: Add API data fetching logic
  // useEffect(() => { fetchFinancialOverview(filters); }, [filters]);

  return (
    <>
      {/* 
        Using existing Header from the codebase.
        The search, notifications, and profile are integrated within it.
      */}
      <Header title="" subtitle="" variant="transparent" />

      {/* Top Section: Title & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4 mt-[-1rem]">
        {/* Title */}
        <h1 className="text-2xl font-black text-[#040814]">النظرة المالية</h1>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="relative">
            <select className="appearance-none bg-gray-50 border border-gray-100 rounded-[14px] px-4 py-2.5 pr-10 text-[13px] font-bold text-gray-600 outline-none w-32 cursor-pointer hover:bg-gray-100 transition-colors">
              <option>الحالة</option>
              <option>مدفوع</option>
              <option>معلق</option>
              <option>مستحق</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>

          {/* Product Filter */}
          <div className="relative">
            <select className="appearance-none bg-gray-50 border border-gray-100 rounded-[14px] px-4 py-2.5 pr-10 text-[13px] font-bold text-gray-600 outline-none w-32 cursor-pointer hover:bg-gray-100 transition-colors">
              <option>المنتج</option>
              <option>إلكترونيات</option>
              <option>ملابس</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>

          {/* Client Filter */}
          <div className="relative">
            <select className="appearance-none bg-gray-50 border border-gray-100 rounded-[14px] px-4 py-2.5 pr-10 text-[13px] font-bold text-gray-600 outline-none w-32 cursor-pointer hover:bg-gray-100 transition-colors">
              <option>العميل</option>
              <option>شركة النقل السريع</option>
              <option>شركة التداول</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>

          {/* Date Picker */}
          <button className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-[14px] px-4 py-2.5 text-[13px] font-bold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors outline-none focus:ring-2 ring-amber-500/20">
            <Calendar size={16} className="text-gray-500" />
            <span dir="ltr">dd/mm/yy</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {MOCK_STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className="bg-white rounded-[24px] p-5 border border-gray-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center mb-4 ${stat.iconBg}`}>
                <Icon size={24} className={stat.iconColor} />
              </div>
              <h3 className="text-gray-500 font-bold text-[11px] mb-2">{stat.title}</h3>
              <p className={`text-base font-black ${stat.textColor}`} dir="ltr">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Financial Status Distribution Pie */}
        <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-black text-[#040814] mb-6 text-right">توزيع الحالات المالية</h3>
          <div className="w-full flex-grow min-h-[200px]">
            <FinancialStatusPieChart />
          </div>
        </div>

        {/* Paid vs Due Bar Chart */}
        <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-black text-[#040814] mb-6 text-right">المدفوع مقابل المستحق</h3>
          <div className="w-full flex-grow min-h-[200px]">
            <PaidVsDueChart />
          </div>
        </div>

        {/* Monthly Revenues Line Chart */}
        <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-black text-[#040814] mb-6 text-right">الإيرادات الشهرية</h3>
          <div className="w-full flex-grow min-h-[200px]">
            <MonthlyRevenueChart />
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
        {/* Commission Tracking Table */}
        <div className="bg-white rounded-[24px] p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-[#040814]">تتبع العمولات</h3>
            <Link href="/dashboard/commissions" className="text-[#B08B3A] font-bold text-sm hover:underline">عرض الكل</Link>
          </div>
          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-4 text-[13px] text-gray-500 font-bold w-1/3">رقم الطلب</th>
                  <th className="pb-4 text-[13px] text-gray-500 font-bold w-1/3">العميل</th>
                  <th className="pb-4 text-[13px] text-gray-500 font-bold w-1/3">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {/* TODO: Map actual data here */}
                {COMMISSION_TRACKING.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 text-[13px] font-bold text-[#040814]" dir="ltr">{item.orderId}</td>
                    <td className="py-4 text-[13px] font-bold text-[#040814]">{item.client}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold inline-block ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-white rounded-[24px] p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-[#040814]">المعاملات الأخيرة</h3>
            <Link href="/dashboard/transactions" className="text-[#B08B3A] font-bold text-sm hover:underline">عرض الكل</Link>
          </div>
          <div className="overflow-x-auto flex-grow">
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
                {/* TODO: Map actual data here */}
                {RECENT_TRANSACTIONS.map((tx, idx) => (
                  <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 text-[13px] font-bold text-[#040814]">{tx.id}</td>
                    <td className="py-4 text-[13px] font-bold text-[#040814]" dir="ltr">{tx.amount}</td>
                    <td className="py-4 text-[13px] font-bold text-gray-500" dir="ltr">{tx.date}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold inline-block ${tx.statusColor}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
