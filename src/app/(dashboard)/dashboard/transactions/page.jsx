'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../../components/dashboard/Header';
import AddPaymentModal from '../../../../components/dashboard/modals/AddPaymentModal';
import { 
  ChevronDown, 
  Calendar, 
  Plus, 
  Eye, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Edit2,
  XCircle,
  Download
} from 'lucide-react';

// ==========================================
// MOCK DATA & CONSTANTS (Ready for Backend)
// ==========================================

const MOCK_TRANSACTIONS = [
  {
    id: 'TRX-001234',
    orderId: 'ORD-567890',
    client: 'شركة النقل السريع',
    paymentType: 'دفعة أولى',
    paymentTypeColor: 'text-amber-500',
    amount: '125,400',
    currency: 'EGP',
    dateTime: '2026-01-15 14:30',
    addedBy: 'أحمد محمد',
    status: 'معلق',
    statusColor: 'bg-amber-100/60 text-amber-600',
  },
  {
    id: 'TRX-001235',
    orderId: 'ORD-567891',
    client: 'المستوردون المتحدة',
    paymentType: 'دفعة نهائية',
    paymentTypeColor: 'text-emerald-500',
    amount: '98,750',
    currency: 'USD',
    dateTime: '2026-01-14 10:15',
    addedBy: 'مريم أحمد',
    status: 'مؤكد',
    statusColor: 'bg-emerald-100/60 text-emerald-600',
  },
  {
    id: 'TRX-001236',
    orderId: 'ORD-567892',
    client: 'شركة الشحن العالمية',
    paymentType: 'عمولة',
    paymentTypeColor: 'text-amber-500',
    amount: '76,320',
    currency: 'EGP',
    dateTime: '2026-01-13 09:45',
    addedBy: 'خالد علي',
    status: 'متأخر',
    statusColor: 'bg-rose-100/60 text-rose-600',
  },
  {
    id: 'TRX-001237',
    orderId: 'ORD-567893',
    client: 'الخدمات اللوجستية المتقدمة',
    paymentType: 'دفعة أولى',
    paymentTypeColor: 'text-amber-500',
    amount: '54,200',
    currency: 'USD',
    dateTime: '2026-01-12 16:20',
    addedBy: 'أحمد محمد',
    status: 'مؤكد',
    statusColor: 'bg-emerald-100/60 text-emerald-600',
  }
];

const MOCK_ACTIVITIES = [
  {
    id: 1,
    action: 'إضافة',
    actionColor: 'bg-emerald-100/60 text-emerald-600',
    title: 'تم إضافة دفعة EGP 30,000 على الطلب ORD-12345',
    transactionId: 'TRX-00123',
    orderId: 'ORD-12345',
    date: '2026-03-02 14:35:22',
    userInitials: 'AH',
    userName: 'أحمد',
    userRole: 'محاسب',
    userColor: 'bg-[#f59e0b] text-white',
    reason: null
  },
  {
    id: 2,
    action: 'تعديل',
    actionColor: 'bg-amber-100/60 text-amber-600',
    title: 'تم تعديل مبلغ الدفعة من 25,000 إلى EGP 30,000',
    transactionId: 'TRX-00122',
    orderId: 'ORD-12344',
    date: '2026-03-02 13:20:15',
    userInitials: 'MO',
    userName: 'محمد',
    userRole: 'مدير مالي',
    userColor: 'bg-[#f59e0b] text-white',
    reason: null
  },
  {
    id: 3,
    action: 'Void',
    actionColor: 'bg-rose-100/60 text-rose-600',
    title: 'تم Void دفعة TRX-00123 بسبب خطأ في الحوالة',
    transactionId: 'TRX-00121',
    orderId: 'ORD-12343',
    date: '2026-03-02 11:45:30',
    userInitials: 'AH',
    userName: 'سارة',
    userRole: 'مدقق مالي',
    userColor: 'bg-[#f59e0b] text-white',
    reason: 'السبب: خطأ في الحوالة البنكية'
  },
  {
    id: 4,
    action: 'أغلق ماليًا',
    actionColor: 'bg-emerald-100/60 text-emerald-600',
    title: 'تم تأكيد دفعة نهائية وإغلاق الطلب ماليًا',
    transactionId: 'TRX-00120',
    orderId: 'ORD-12342',
    date: '2026-03-01 16:10:45',
    userInitials: 'AH',
    userName: 'علي',
    userRole: 'مدير مالي',
    userColor: 'bg-[#f59e0b] text-white',
    reason: null
  }
];

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================

export default function TransactionsPage() {
  const router = useRouter();
  // TODO: Setup proper state for filters, tabs, and pagination
  const [activeTab, setActiveTab] = useState('transactions');
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const toggleDropdown = (id) => {
    if (openDropdownId === id) setOpenDropdownId(null);
    else setOpenDropdownId(id);
  };

  const handleOpenDetails = (trx) => {
    router.push(`/dashboard/transactions/${trx.id}`);
  };

  return (
    <>
      <Header title="" subtitle="" variant="transparent" />

      {/* Page Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 mt-[-1rem]">
        <h1 className="text-2xl font-black text-[#040814]">العمليات المالية</h1>
        <button 
          onClick={() => setIsAddPaymentModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#B08B3A] hover:bg-[#906c27] text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-sm focus:outline-none"
        >
          <Plus size={18} strokeWidth={2.5} />
          إضافة دفعة مالية
        </button>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Payment Type */}
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-[#B08B3A] px-1">نوع الدفعة</label>
          <div className="relative">
            <select className="w-full appearance-none bg-gray-50/80 border border-gray-100 rounded-xl px-4 py-3 pr-10 text-sm font-bold text-[#040814] outline-none cursor-pointer focus:ring-2 focus:ring-amber-500/20 transition-all">
              <option>الكل</option>
              <option>دفعة أولى</option>
              <option>دفعة نهائية</option>
              <option>عمولة</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-[#B08B3A] px-1">الحالة</label>
          <div className="relative">
            <select className="w-full appearance-none bg-gray-50/80 border border-gray-100 rounded-xl px-4 py-3 pr-10 text-sm font-bold text-[#040814] outline-none cursor-pointer focus:ring-2 focus:ring-amber-500/20 transition-all">
              <option>الكل</option>
              <option>مؤكد</option>
              <option>معلق</option>
              <option>متأخر</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        {/* Client */}
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-[#B08B3A] px-1">العميل</label>
          <div className="relative">
            <select className="w-full appearance-none bg-gray-50/80 border border-gray-100 rounded-xl px-4 py-3 pr-10 text-sm font-bold text-[#040814] outline-none cursor-pointer focus:ring-2 focus:ring-amber-500/20 transition-all">
              <option>الكل</option>
              <option>شركة النقل السريع</option>
              <option>المستوردون المتحدة</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        {/* Date Range */}
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-bold text-[#B08B3A] px-1">الفترة الزمنية</label>
          <button className="w-full flex items-center gap-2 bg-gray-50/80 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#040814] outline-none cursor-pointer hover:bg-gray-100 transition-all focus:ring-2 focus:ring-amber-500/20">
            <Calendar size={16} className="text-gray-400" />
            <span dir="ltr">dd/mm/yy</span>
          </button>
        </div>

      </div>

      {/* Main Content Container */}
      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm flex flex-col mb-12">
        
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button 
            className={`flex-1 py-4 text-center font-bold text-[15px] transition-colors rounded-tr-[24px] ${activeTab === 'transactions' ? 'bg-[#fefce8] text-[#040814]' : 'bg-transparent text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('transactions')}
          >
            العمليات المالية
          </button>
          <button 
            className={`flex-1 py-4 text-center font-bold text-[15px] transition-colors rounded-tl-[24px] ${activeTab === 'activity' ? 'bg-[#fefce8] text-[#040814]' : 'bg-transparent text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('activity')}
          >
            سجل الفعاليات
          </button>
        </div>

        {/* Tab Content: Transactions Table */}
        {activeTab === 'transactions' && (
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-right border-separate border-spacing-y-3">
              <thead>
                <tr>
                  <th className="pb-2 text-[13px] text-[#B08B3A] font-black whitespace-nowrap px-4">رقم العملية</th>
                  <th className="pb-2 text-[13px] text-[#B08B3A] font-black whitespace-nowrap px-4">رقم الطلب</th>
                  <th className="pb-2 text-[13px] text-[#B08B3A] font-black whitespace-nowrap px-4">العميل</th>
                  <th className="pb-2 text-[13px] text-[#B08B3A] font-black whitespace-nowrap px-4">نوع الدفع</th>
                  <th className="pb-2 text-[13px] text-[#B08B3A] font-black whitespace-nowrap px-4">المبلغ</th>
                  <th className="pb-2 text-[13px] text-[#B08B3A] font-black whitespace-nowrap px-4">العملة</th>
                  <th className="pb-2 text-[13px] text-[#B08B3A] font-black whitespace-nowrap px-4">التاريخ والوقت</th>
                  <th className="pb-2 text-[13px] text-[#B08B3A] font-black whitespace-nowrap px-4">أضيف بواسطة</th>
                  <th className="pb-2 text-[13px] text-[#B08B3A] font-black whitespace-nowrap px-4">الحالة</th>
                  <th className="pb-2 text-[13px] text-[#B08B3A] font-black whitespace-nowrap px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_TRANSACTIONS.map((trx, idx) => (
                  <tr key={idx} className="bg-white border border-gray-100 shadow-xs rounded-[16px] hover:shadow-md transition-all group">
                    <td className="py-4 px-4 text-[13px] font-bold text-gray-600 rounded-r-[16px] border-t border-b border-r border-gray-100 group-hover:border-gray-200" dir="ltr">{trx.id}</td>
                    <td className="py-4 px-4 text-[13px] font-bold text-[#040814] border-t border-b border-gray-100 group-hover:border-gray-200" dir="ltr">{trx.orderId}</td>
                    <td className="py-4 px-4 text-[13px] font-bold text-[#040814] border-t border-b border-gray-100 group-hover:border-gray-200 max-w-[150px] truncate leading-tight whitespace-normal">
                      {trx.client}
                    </td>
                    <td className={`py-4 px-4 text-[13px] font-bold border-t border-b border-gray-100 group-hover:border-gray-200 whitespace-nowrap ${trx.paymentTypeColor}`}>{trx.paymentType}</td>
                    <td className="py-4 px-4 text-[13px] font-bold text-[#040814] border-t border-b border-gray-100 group-hover:border-gray-200" dir="ltr">{trx.amount}</td>
                    <td className="py-4 px-4 text-[13px] font-bold text-[#040814] border-t border-b border-gray-100 group-hover:border-gray-200">{trx.currency}</td>
                    <td className="py-4 px-4 text-[12px] font-bold text-[#B08B3A] border-t border-b border-gray-100 group-hover:border-gray-200 whitespace-nowrap" dir="ltr">{trx.dateTime}</td>
                    <td className="py-4 px-4 text-[13px] font-bold text-[#B08B3A] border-t border-b border-gray-100 group-hover:border-gray-200 whitespace-nowrap">{trx.addedBy}</td>
                    <td className="py-4 px-4 border-t border-b border-gray-100 group-hover:border-gray-200">
                      <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold inline-block whitespace-nowrap ${trx.statusColor}`}>
                        {trx.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 border-t border-b border-l border-gray-100 rounded-l-[16px] group-hover:border-gray-200">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleOpenDetails(trx)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-[#040814] transition-colors focus:outline-none"
                        >
                          <Eye size={16} strokeWidth={2.5} />
                        </button>
                        <div className="relative">
                          <button 
                            onClick={() => toggleDropdown(trx.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-[#040814] transition-colors focus:outline-none"
                          >
                            <MoreHorizontal size={16} strokeWidth={2.5} />
                          </button>

                          {openDropdownId === trx.id && (
                            <>
                              {/* Overlay to close dropdown */}
                              <div className="fixed inset-0 z-40" onClick={() => setOpenDropdownId(null)} />
                              
                              {/* Dropdown Menu */}
                              <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-xl py-2 z-50 flex flex-col">
                                <button 
                                  onClick={() => setOpenDropdownId(null)}
                                  className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-gray-600 hover:bg-gray-50 hover:text-[#040814] w-full text-right transition-colors"
                                >
                                  <Edit2 size={16} />
                                  تعديل الدفعة
                                </button>
                                <button 
                                  onClick={() => setOpenDropdownId(null)}
                                  className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-gray-600 hover:bg-gray-50 hover:text-[#040814] w-full text-right transition-colors"
                                >
                                  <Download size={16} />
                                  تحميل الإيصال
                                </button>
                                <div className="h-px w-full bg-gray-50 my-1" />
                                <button 
                                  onClick={() => setOpenDropdownId(null)}
                                  className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-rose-500 hover:bg-rose-50 w-full text-right transition-colors"
                                >
                                  <XCircle size={16} />
                                  إلغاء الدفعة (Void)
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab Content: Activity Log */}
        {activeTab === 'activity' && (
          <div className="p-6 flex flex-col gap-4">
            {MOCK_ACTIVITIES.map((activity) => (
              <div key={activity.id} className="bg-white border border-gray-100 shadow-xs rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-all">
                
                {/* Content (Right Side) */}
                <div className="flex-1 flex flex-col items-start w-full text-right">
                  <div className="flex items-center justify-end w-full gap-3 mb-2">
                    <span className="text-[11px] font-bold text-gray-400" dir="ltr">{activity.date}</span>
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${activity.actionColor}`}>
                      {activity.action}
                    </span>
                  </div>
                  <h4 className="text-base font-black text-[#040814] w-full text-right mb-1">{activity.title}</h4>
                  <p className="text-[13px] font-bold text-gray-400 w-full text-right">
                    رقم المعاملة <span dir="ltr">{activity.transactionId}</span> • الطلب <span dir="ltr">{activity.orderId}</span>
                  </p>
                  {activity.reason && (
                    <p className="text-[13px] font-bold text-rose-500 mt-2 w-full text-right">{activity.reason}</p>
                  )}
                </div>

                {/* User Block (Left Side) */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex flex-col text-left md:text-right">
                    <span className="font-black text-[#040814] text-sm">{activity.userName}</span>
                    <span className="text-xs font-bold text-gray-400">{activity.userRole}</span>
                  </div>
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center font-black text-[15px] ${activity.userColor}`}>
                    {activity.userInitials}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Universal Pagination */}
        <div className="flex items-center justify-between p-6 pt-2 border-t border-gray-50 mt-2">
          <span className="text-xs font-bold text-[#040814]">
            Showing 1-6 of 20 {activeTab === 'activity' ? 'activities' : 'transactions'}
          </span>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors focus:outline-none">
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold text-[#040814]">Page 1/6</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors focus:outline-none">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>
      
      <AddPaymentModal 
        isOpen={isAddPaymentModalOpen} 
        onClose={() => setIsAddPaymentModalOpen(false)} 
      />
    </>
  );
}
