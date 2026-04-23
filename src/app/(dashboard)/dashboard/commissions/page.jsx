'use client';

import React, { useState } from 'react';
import Header from '../../../../components/dashboard/Header';
import CommissionDetailsModal from '../../../../components/dashboard/modals/CommissionDetailsModal';
import { 
  TrendingUp, 
  CreditCard, 
  AlertTriangle, 
  Eye,
  ArrowLeft
} from 'lucide-react';

// ==========================================
// MOCK DATA & CONSTANTS (Ready for Backend)
// ==========================================

const MOCK_COMMISSION_STATS = [
  {
    id: 1,
    title: 'إجمالي العمولات',
    value: 'EGP 285,750',
    icon: TrendingUp,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-100/60',
    textColor: 'text-emerald-500'
  },
  {
    id: 2,
    title: 'العمولات المستلمة',
    value: 'EGP 198,500',
    icon: CreditCard,
    iconColor: 'text-teal-500',
    iconBg: 'bg-teal-100/60',
    textColor: 'text-teal-500'
  },
  {
    id: 3,
    title: 'العمولات المتبقية',
    value: 'EGP 87,250',
    icon: AlertTriangle,
    iconColor: 'text-rose-500',
    iconBg: 'bg-rose-100/60',
    textColor: 'text-rose-500'
  }
];

const MOCK_COMMISSION_LIST = [
  {
    id: 'ORD-2023-001',
    client: 'شركة النقل السريع',
    total: 'EGP 45,000',
    received: 'EGP 45,000',
    remaining: 'EGP 0',
    status: 'مكتملة',
    statusColor: 'bg-emerald-100/50 text-emerald-600',
    lastUpdate: '15 أكتوبر 2023',
  },
  {
    id: 'ORD-2023-002',
    client: 'مؤسسة الأعمال المتقدمة',
    total: 'EGP 62,500',
    received: 'EGP 37,500',
    remaining: 'EGP 25,000',
    status: 'مستلمة جزئياً',
    statusColor: 'bg-amber-100/50 text-amber-600',
    lastUpdate: '18 أكتوبر 2023',
  },
  {
    id: 'ORD-2023-003',
    client: 'شركة التداول العالمية',
    total: 'EGP 38,750',
    received: 'EGP 0',
    remaining: 'EGP 38,750',
    status: 'غير مستلمة',
    statusColor: 'bg-rose-100/50 text-rose-600',
    lastUpdate: '20 أكتوبر 2023',
  },
  {
    id: 'ORD-2023-004',
    client: 'مجموعة الاستثمار الذكي',
    total: 'EGP 55,000',
    received: 'EGP 55,000',
    remaining: 'EGP 0',
    status: 'مكتملة',
    statusColor: 'bg-emerald-100/50 text-emerald-600',
    lastUpdate: '22 أكتوبر 2023',
  }
];

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================

export default function CommissionTrackingPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [commissions, setCommissions] = useState(MOCK_COMMISSION_LIST);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState(null);

  const handleViewCommission = (item) => {
    setSelectedCommission(item);
    setIsModalOpen(true);
  };

  // TODO: Fetch data on mount or page change
  // useEffect(() => { fetchCommissions(currentPage); }, [currentPage]);

  return (
    <>
      {/* Page Header */}
      <Header 
        title="تتبع العمولات" 
        subtitle="إدارة وتتبع جميع العمولات المتعلقة بالطلبات" 
        variant="transparent" 
      />

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {MOCK_COMMISSION_STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className="bg-white rounded-[24px] p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center transition-all hover:shadow-md">
              <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center mb-5 ${stat.iconBg}`}>
                <Icon size={24} className={stat.iconColor} />
              </div>
              <h3 className="text-[#040814] font-black text-sm mb-3">{stat.title}</h3>
              <p className={`text-2xl font-black ${stat.textColor}`} dir="ltr">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Warning Banner */}
      <div className="bg-amber-50/80 border border-amber-100 rounded-[20px] p-4 flex items-center gap-3 mb-8">
        <AlertTriangle size={20} className="text-[#B08B3A]" />
        <p className="text-[#B08B3A] font-bold text-sm">
          يوجد عمولات غير مستلمة بقيمة <span dir="ltr">EGP 87,250</span>
        </p>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm mb-12 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-separate border-spacing-y-4">
            <thead>
              <tr className="px-4">
                <th className="pb-2 text-[14px] text-[#B08B3A] font-black whitespace-nowrap px-4">رقم الطلب</th>
                <th className="pb-2 text-[14px] text-[#B08B3A] font-black whitespace-nowrap px-4">العميل</th>
                <th className="pb-2 text-[14px] text-[#B08B3A] font-black whitespace-nowrap px-4">إجمالي العمولة</th>
                <th className="pb-2 text-[14px] text-[#B08B3A] font-black whitespace-nowrap px-4">المستلم</th>
                <th className="pb-2 text-[14px] text-[#B08B3A] font-black whitespace-nowrap px-4">المتبقي</th>
                <th className="pb-2 text-[14px] text-[#B08B3A] font-black whitespace-nowrap px-4">الحالة</th>
                <th className="pb-2 text-[14px] text-[#B08B3A] font-black whitespace-nowrap px-4">آخر تحديث</th>
                <th className="pb-2 text-[14px] text-[#B08B3A] font-black whitespace-nowrap px-4">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {/* TODO: Map actual data here from API response */}
              {MOCK_COMMISSION_LIST.map((item, idx) => (
                <tr key={idx} className="bg-white border border-gray-100 shadow-sm rounded-[16px] hover:shadow-md transition-shadow group">
                  <td className="py-4 px-4 text-[13px] font-bold text-[#040814] rounded-r-[16px] border-t border-b border-r border-gray-100 group-hover:border-gray-200" dir="ltr">{item.id}</td>
                  <td className="py-4 px-4 text-[13px] font-bold text-[#040814] border-t border-b border-gray-100 group-hover:border-gray-200">{item.client}</td>
                  <td className="py-4 px-4 text-[13px] font-bold text-[#040814] border-t border-b border-gray-100 group-hover:border-gray-200" dir="ltr">{item.total}</td>
                  <td className="py-4 px-4 text-[13px] font-bold text-[#B08B3A] border-t border-b border-gray-100 group-hover:border-gray-200" dir="ltr">{item.received}</td>
                  <td className="py-4 px-4 text-[13px] font-bold text-[#040814] border-t border-b border-gray-100 group-hover:border-gray-200" dir="ltr">{item.remaining}</td>
                  <td className="py-4 px-4 border-t border-b border-gray-100 group-hover:border-gray-200">
                    <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold inline-block whitespace-nowrap ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[13px] font-bold text-[#040814] whitespace-nowrap border-t border-b border-gray-100 group-hover:border-gray-200">{item.lastUpdate}</td>
                  <td className="py-4 px-4 border-t border-b border-l border-gray-100 rounded-l-[16px] group-hover:border-gray-200">
                    <button 
                      onClick={() => handleViewCommission(item)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-[#040814] transition-colors focus:outline-none"
                    >
                      <Eye size={16} strokeWidth={2.5} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#040814] text-white hover:bg-gray-800 transition-colors shadow-sm focus:outline-none">
            <ArrowLeft size={16} />
          </button>
          
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-700 hover:bg-gray-50 font-bold text-sm transition-colors focus:outline-none">8</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-700 hover:bg-gray-50 font-bold text-sm transition-colors focus:outline-none">7</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-700 hover:bg-gray-50 font-bold text-sm transition-colors focus:outline-none">6</button>
          
          <span className="text-gray-400 font-bold px-1">...</span>
          
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-700 hover:bg-gray-50 font-bold text-sm transition-colors focus:outline-none">2</button>
          
          {/* Active Page */}
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 text-[#040814] font-black text-sm focus:outline-none">1</button>
        </div>
      </div>

      <CommissionDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        data={selectedCommission}
      />
    </>
  );
}
