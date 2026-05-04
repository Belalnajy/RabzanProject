'use client';

import React, { useState } from 'react';
import Header from '@/components/dashboard/Header';
import {
  Percent,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Download,
  Eye,
  Search,
  Calendar,
  ChevronDown,
  ArrowUpDown
} from 'lucide-react';

const COMMISSION_STATUSES = {
  pending: { label: 'معلق', color: 'bg-amber-100/50 text-amber-600', icon: Clock },
  partial: { label: 'مستلم جزئياً', color: 'bg-blue-100/50 text-blue-600', icon: AlertCircle },
  completed: { label: 'مكتمل', color: 'bg-emerald-100/50 text-emerald-600', icon: CheckCircle },
  rejected: { label: 'مرفوض', color: 'bg-rose-100/50 text-rose-600', icon: XCircle },
};

const MOCK_COMMISSIONS = [
  {
    id: 'ORD-2026-001',
    client: 'شركة النقل السريع',
    amount: 'EGP 45,230',
    generatedDate: '2026-01-15',
    dueDate: '2026-02-15',
    status: 'completed',
    orderValue: 'EGP 452,300',
    commissionRate: '10%',
    received: 'EGP 45,230'
  },
  {
    id: 'ORD-2026-002',
    client: 'مؤسسة أعمال المتقدمة',
    amount: 'EGP 78,950',
    generatedDate: '2026-01-14',
    dueDate: '2026-02-14',
    status: 'partial',
    orderValue: 'EGP 789,500',
    commissionRate: '10%',
    received: 'EGP 39,475'
  },
  {
    id: 'ORD-2026-003',
    client: 'شركة التداول العالمية',
    amount: 'EGP 23,400',
    generatedDate: '2026-01-13',
    dueDate: '2026-02-13',
    status: 'pending',
    orderValue: 'EGP 234,000',
    commissionRate: '10%',
    received: 'EGP 0'
  },
  {
    id: 'ORD-2026-004',
    client: 'متجر الإلكترونيات',
    amount: 'EGP 156,780',
    generatedDate: '2026-01-12',
    dueDate: '2026-02-12',
    status: 'completed',
    orderValue: 'EGP 1,567,800',
    commissionRate: '10%',
    received: 'EGP 156,780'
  },
  {
    id: 'ORD-2026-005',
    client: 'شركة الخدمات اللوجستية',
    amount: 'EGP 12,500',
    generatedDate: '2026-01-11',
    dueDate: '2026-02-11',
    status: 'rejected',
    orderValue: 'EGP 125,000',
    commissionRate: '10%',
    received: 'EGP 0'
  },
  {
    id: 'ORD-2026-006',
    client: 'مجموعة المتحدة التجارية',
    amount: 'EGP 34,200',
    generatedDate: '2026-01-10',
    dueDate: '2026-02-10',
    status: 'completed',
    orderValue: 'EGP 342,000',
    commissionRate: '10%',
    received: 'EGP 34,200'
  },
];

const STATS = [
  {
    id: 1,
    title: 'إجمالي العمولات',
    value: 'EGP 245,678',
    icon: Percent,
    color: 'text-amber-500',
    bg: 'bg-amber-100/60'
  },
  {
    id: 2,
    title: 'المستلمة',
    value: 'EGP 198,234',
    icon: CheckCircle,
    color: 'text-emerald-500',
    bg: 'bg-emerald-100/60'
  },
  {
    id: 3,
    title: 'المستحقة',
    value: 'EGP 47,444',
    icon: Clock,
    color: 'text-amber-500',
    bg: 'bg-amber-100/60'
  },
  {
    id: 4,
    title: 'العمولات المكتملة',
    value: 'EGP 89,430',
    icon: TrendingUp,
    color: 'text-teal-500',
    bg: 'bg-teal-100/60'
  }
];

function StatusBadge({ status }) {
  const config = COMMISSION_STATUSES[status] || COMMISSION_STATUSES.pending;
  const Icon = config.icon;
  return (
    <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 ${config.color}`}>
      <Icon size={12} />
      {config.label}
    </span>
  );
}

function CommissionRow({ commission, onView }) {
  return (
    <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors group">
      <td className="py-4 text-[13px] font-bold text-[#040814]" dir="ltr">
        {commission.id}
      </td>
      <td className="py-4 text-[13px] font-bold text-[#040814]">
        {commission.client}
      </td>
      <td className="py-4 text-[13px] font-bold text-[#040814]" dir="ltr">
        {commission.amount}
      </td>
      <td className="py-4 text-[13px] font-bold text-gray-500" dir="ltr">
        {commission.generatedDate}
      </td>
      <td className="py-4 text-[13px] font-bold text-gray-500" dir="ltr">
        {commission.dueDate}
      </td>
      <td className="py-4">
        <StatusBadge status={commission.status} />
      </td>
      <td className="py-4">
        <button
          onClick={() => onView(commission)}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="View details"
        >
          <Eye size={16} />
        </button>
      </td>
    </tr>
  );
}

function LoadingState() {
  return (
    <tr>
      <td colSpan={7} className="py-12 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-gray-400">جاري التحميل...</span>
        </div>
      </td>
    </tr>
  );
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={7} className="py-12 text-center">
        <div className="flex flex-col items-center gap-3">
          <Percent size={40} className="text-gray-200" />
          <span className="text-sm text-gray-400">لا توجد عمولات</span>
        </div>
      </td>
    </tr>
  );
}

function ErrorState({ onRetry }) {
  return (
    <tr>
      <td colSpan={7} className="py-12 text-center">
        <div className="flex flex-col items-center gap-3">
          <XCircle size={40} className="text-rose-400" />
          <span className="text-sm text-rose-500">فشل تحميل البيانات</span>
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-bold hover:bg-amber-600 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function CommissionTrackingPage() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('generatedDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState(null);

  // TODO: Replace with actual API fetch
  // const fetchCommissions = async (filters) => {
  //   const params = new URLSearchParams(filters);
  //   const response = await fetch(`/api/commissions?${params}`);
  //   if (!response.ok) throw new Error('Failed to fetch');
  //   return response.json();
  // };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleViewCommission = (commission) => {
    setSelectedCommission(commission);
    // TODO: Open modal or navigate to detail page
    console.log('View commission:', commission);
  };

  const filteredCommissions = MOCK_COMMISSIONS.filter(c => {
    if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
    if (searchQuery && !c.client.includes(searchQuery) && !c.id.includes(searchQuery)) return false;
    return true;
  });

  const handleExport = () => {
    // TODO: Implement CSV export or API call for download
    console.log('Export commissions');
  };

  return (
    <>
      <Header title="" subtitle="" variant="transparent" />

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4 mt-[-1rem]">
        <h1 className="text-2xl font-black text-[#040814]">تتبع العمولات</h1>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="بحث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-50 border border-gray-100 rounded-[14px] pr-10 pl-4 py-2.5 text-[13px] font-bold text-gray-600 outline-none w-40 cursor-pointer hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-100 rounded-[14px] px-4 py-2.5 pr-10 text-[13px] font-bold text-gray-600 outline-none w-36 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <option value="all">الحالة</option>
              <option value="pending">معلق</option>
              <option value="partial">مستلم جزئياً</option>
              <option value="completed">مكتمل</option>
              <option value="rejected">مرفوض</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="bg-gray-50 border border-gray-100 rounded-[14px] px-4 py-2.5 text-[13px] font-bold text-gray-600 outline-none w-32 cursor-pointer hover:bg-gray-100 transition-colors"
                aria-label="Start date"
              />
            </div>
            <span className="text-gray-400">-</span>
            <div className="relative">
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="bg-gray-50 border border-gray-100 rounded-[14px] px-4 py-2.5 text-[13px] font-bold text-gray-600 outline-none w-32 cursor-pointer hover:bg-gray-100 transition-colors"
                aria-label="End date"
              />
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-[#B08B3A] text-white rounded-[14px] px-4 py-2.5 text-[13px] font-bold hover:bg-[#8B6B2A] transition-colors"
          >
            <Download size={16} />
            تصدير
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className="bg-white rounded-[24px] p-5 border border-gray-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center mb-4 ${stat.bg}`}>
                <Icon size={24} className={stat.color} />
              </div>
              <h3 className="text-gray-500 font-bold text-[11px] mb-2">{stat.title}</h3>
              <p className={`text-base font-black ${stat.color}`} dir="ltr">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Commissions Table */}
      <div className="bg-white rounded-[24px] p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-black text-[#040814]">قائمة العمولات</h3>
          <span className="text-sm text-gray-400 font-bold">
            {filteredCommissions.length} طلب
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-4 text-[13px] text-gray-500 font-bold w-28">
                  <button
                    onClick={() => handleSort('id')}
                    className="inline-flex items-center gap-1 hover:text-gray-700"
                  >
                    رقم الطلب
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="pb-4 text-[13px] text-gray-500 font-bold w-44">العميل</th>
                <th className="pb-4 text-[13px] text-gray-500 font-bold w-32">المبلغ</th>
                <th className="pb-4 text-[13px] text-gray-500 font-bold w-28">
                  <button
                    onClick={() => handleSort('generatedDate')}
                    className="inline-flex items-center gap-1 hover:text-gray-700"
                  >
                    تاريخ الإنشاء
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="pb-4 text-[13px] text-gray-500 font-bold w-28">تاريخ الاستحقاق</th>
                <th className="pb-4 text-[13px] text-gray-500 font-bold w-28">الحالة</th>
                <th className="pb-4 text-[13px] text-gray-500 font-bold w-20">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <LoadingState />
              ) : error ? (
                <ErrorState onRetry={() => setError(false)} />
              ) : filteredCommissions.length === 0 ? (
                <EmptyState />
              ) : (
                filteredCommissions.map((commission) => (
                  <CommissionRow
                    key={commission.id}
                    commission={commission}
                    onView={handleViewCommission}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-400">
            عرض 1-{filteredCommissions.length} من {filteredCommissions.length}
          </span>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50" disabled>
              <ChevronDown size={16} className="rotate-90" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50" disabled>
              <ChevronDown size={16} className="-rotate-90" />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal - TODO: Connect to API */}
      {selectedCommission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[24px] p-8 max-w-lg w-full shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-[#040814]">تفاصيل العمولة</h3>
              <button
                onClick={() => setSelectedCommission(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-500 font-bold">رقم الطلب</span>
                <span className="font-bold text-[#040814]" dir="ltr">{selectedCommission.id}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-500 font-bold">العميل</span>
                <span className="font-bold text-[#040814]">{selectedCommission.client}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-500 font-bold">قيمة الطلب</span>
                <span className="font-bold text-[#040814]" dir="ltr">{selectedCommission.orderValue}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-500 font-bold">نسبة العمولة</span>
                <span className="font-bold text-[#040814]" dir="ltr">{selectedCommission.commissionRate}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-500 font-bold">مبلغ العمولة</span>
                <span className="font-bold text-amber-500" dir="ltr">{selectedCommission.amount}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-500 font-bold">المستلم</span>
                <span className="font-bold text-emerald-500" dir="ltr">{selectedCommission.received}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-500 font-bold">تاريخ الإنشاء</span>
                <span className="font-bold text-gray-600" dir="ltr">{selectedCommission.generatedDate}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-500 font-bold">تاريخ الاستحقاق</span>
                <span className="font-bold text-gray-600" dir="ltr">{selectedCommission.dueDate}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-500 font-bold">الحالة</span>
                <StatusBadge status={selectedCommission.status} />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setSelectedCommission(null)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-[14px] font-bold hover:bg-gray-200 transition-colors"
              >
                إغلاق
              </button>
              {/* TODO: Connect to payment API */}
              <button className="flex-1 py-3 bg-amber-500 text-white rounded-[14px] font-bold hover:bg-amber-600 transition-colors">
                دفع العمولة
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}