'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '../../../../../components/dashboard/Header';
import { 
  ArrowRight, 
  Paperclip, 
  Download, 
  FileText, 
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';

// ==========================================
// MOCK DATA (Ready for API Integration)
// ==========================================

const MOCK_TRANSACTION_DETAILS = {
  id: 'TRX-001234',
  status: 'مؤكد',
  statusColor: 'bg-emerald-100/60 text-emerald-600',
  basicInfo: {
    orderId: 'ORD-2023-0456',
    clientName: 'شركة النقل السريع',
    paymentType: 'الدفعة النهائية',
    amount: 'EGP 45,000',
    currency: 'جنيه مصري',
    paymentDateTime: '15 أكتوبر 2023، 02:30 م',
    addedBy: 'أحمد محمد',
    creationDate: '15 أكتوبر 2023، 02:25 م',
    lastUpdate: '15 أكتوبر 2023، 02:35 م',
    referenceNumber: 'REF-789456123'
  },
  financialImpact: {
    totalOrder: '120,000 EGP',
    paidBefore: '75,000 EGP',
    thisPayment: '45,000 EGP',
    paidAfter: '120,000 EGP',
    isFullyPaid: true,
    fullyPaidMessage: 'هذه الدفعة أغلقت الطلب مالياً'
  },
  attachments: [
    {
      id: 1,
      name: 'إيصال الدفع.pdf',
      size: '2.4 MB',
      type: 'pdf'
    },
    {
      id: 2,
      name: 'كشف حساب بنكي.jpg',
      size: '1.8 MB',
      type: 'image'
    }
  ],
  notes: 'تم استلام الدفعة النهائية من العميل عبر التحويل البنكي. تم التحقق من الإيصال وكشف الحساب البنكي وتأكيد مطابقة المبلغ. تم إغلاق الطلب مالياً بنجاح.',
  timeline: [
    {
      id: 1,
      title: 'تم إنشاء المعاملة',
      subtitle: 'بواسطة أحمد محمد - 15 أكتوبر 2023، 02:25 م',
      isLast: false
    },
    {
      id: 2,
      title: 'تم تحرير المعاملة',
      subtitle: 'بواسطة أحمد محمد - 15 أكتوبر 2023، 02:30 م',
      isLast: false
    },
    {
      id: 3,
      title: 'تم تغيير الحالة إلى "مؤكدة"',
      subtitle: 'بواسطة مدير المالية - 15 أكتوبر 2023، 02:35 م',
      isLast: true
    }
  ]
};

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================

export default function TransactionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [details, setDetails] = useState(MOCK_TRANSACTION_DETAILS);
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Fetch details from API using params.id
  // useEffect(() => { 
  //   fetchTransactionDetails(params.id).then(data => setDetails(data));
  // }, [params.id]);

  if (isLoading) {
    return <div className="p-8 text-center text-[#B08B3A] font-bold">جاري التحميل...</div>;
  }

  return (
    <>
      <Header title="" subtitle="" variant="transparent" />

      {/* Top Action Bar */}
      <div className="flex flex-col-reverse md:flex-row md:items-center justify-between mb-8 gap-4 mt-[-1rem]">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center justify-center gap-2 bg-[#B08B3A] hover:bg-[#906c27] text-white px-5 py-2.5 rounded-xl font-bold transition-colors shadow-sm w-fit focus:outline-none"
        >
          <ArrowRight size={18} strokeWidth={2.5} />
          رجوع
        </button>

        {/* Title & Status */}
        <div className="flex items-center gap-4 self-end md:self-auto">
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${details.statusColor}`}>
            {details.status}
          </span>
          <h1 className="text-2xl font-black text-[#040814] tracking-tight" dir="ltr">
            {details.id}
          </h1>
        </div>
      </div>

      <div className="flex flex-col gap-6 pb-12">
        
        {/* Basic Information */}
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 md:p-8">
          <h2 className="text-lg font-black text-[#040814] mb-6">المعلومات الأساسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            
            {/* Right Column (RTL visual) */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5 text-right border-b border-gray-50 pb-3">
                <span className="text-xs font-bold text-[#B08B3A]/80">رقم الطلب</span>
                <span className="text-[13px] font-black text-[#040814]" dir="ltr">{details.basicInfo.orderId}</span>
              </div>
              <div className="flex flex-col gap-1.5 text-right border-b border-gray-50 pb-3">
                <span className="text-xs font-bold text-[#B08B3A]/80">اسم العميل</span>
                <span className="text-[13px] font-black text-[#040814]">{details.basicInfo.clientName}</span>
              </div>
              <div className="flex flex-col gap-1.5 text-right border-b border-gray-50 pb-3">
                <span className="text-xs font-bold text-[#B08B3A]/80">نوع الدفع</span>
                <span className="text-[13px] font-black text-[#040814]">{details.basicInfo.paymentType}</span>
              </div>
              <div className="flex flex-col gap-1.5 text-right border-b border-gray-50 pb-3">
                <span className="text-xs font-bold text-[#B08B3A]/80">المبلغ</span>
                <span className="text-[13px] font-black text-[#040814]" dir="ltr">{details.basicInfo.amount}</span>
              </div>
              <div className="flex flex-col gap-1.5 text-right pb-3">
                <span className="text-xs font-bold text-[#B08B3A]/80">العملة</span>
                <span className="text-[13px] font-black text-[#040814]">{details.basicInfo.currency}</span>
              </div>
            </div>

            {/* Left Column (RTL visual) */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5 text-right border-b border-gray-50 pb-3">
                <span className="text-xs font-bold text-[#B08B3A]/80">تاريخ ووقت الدفع</span>
                <span className="text-[13px] font-black text-[#040814]" dir="ltr">{details.basicInfo.paymentDateTime}</span>
              </div>
              <div className="flex flex-col gap-1.5 text-right border-b border-gray-50 pb-3">
                <span className="text-xs font-bold text-[#B08B3A]/80">أضيف بواسطة</span>
                <span className="text-[13px] font-black text-[#040814]">{details.basicInfo.addedBy}</span>
              </div>
              <div className="flex flex-col gap-1.5 text-right border-b border-gray-50 pb-3">
                <span className="text-xs font-bold text-[#B08B3A]/80">تاريخ الإنشاء</span>
                <span className="text-[13px] font-black text-[#040814]" dir="ltr">{details.basicInfo.creationDate}</span>
              </div>
              <div className="flex flex-col gap-1.5 text-right border-b border-gray-50 pb-3">
                <span className="text-xs font-bold text-[#B08B3A]/80">آخر تحديث</span>
                <span className="text-[13px] font-black text-[#040814]" dir="ltr">{details.basicInfo.lastUpdate}</span>
              </div>
              <div className="flex flex-col gap-1.5 text-right pb-3">
                <span className="text-xs font-bold text-[#B08B3A]/80">الرقم المرجعي</span>
                <span className="text-[13px] font-black text-[#040814]" dir="ltr">{details.basicInfo.referenceNumber}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Financial Impact */}
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 md:p-8">
          <h2 className="text-lg font-black text-[#040814] mb-6">التأثير المالي على الطلب</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex justify-between items-center border border-gray-100 rounded-2xl p-4 hover:border-gray-200 transition-colors">
              <span className="text-[13px] font-bold text-gray-600">إجمالي الطلب</span>
              <span className="text-sm font-black text-[#040814]" dir="ltr">{details.financialImpact.totalOrder}</span>
            </div>
            <div className="flex justify-between items-center border border-gray-100 rounded-2xl p-4 hover:border-gray-200 transition-colors">
              <span className="text-[13px] font-bold text-gray-600">إجمالي المدفوع قبل هذه المعاملة</span>
              <span className="text-sm font-black text-[#040814]" dir="ltr">{details.financialImpact.paidBefore}</span>
            </div>
            <div className="flex justify-between items-center border border-gray-100 rounded-2xl p-4 hover:border-gray-200 transition-colors">
              <span className="text-[13px] font-bold text-gray-600">مبلغ هذه الدفعة</span>
              <span className="text-sm font-black text-[#040814]" dir="ltr">{details.financialImpact.thisPayment}</span>
            </div>
            <div className="flex justify-between items-center border border-gray-100 rounded-2xl p-4 hover:border-gray-200 transition-colors">
              <span className="text-[13px] font-bold text-gray-600">إجمالي المدفوع بعد</span>
              <span className="text-sm font-black text-[#040814]" dir="ltr">{details.financialImpact.paidAfter}</span>
            </div>
          </div>

          {details.financialImpact.isFullyPaid && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-2 text-emerald-600">
              <CheckCircle2 size={18} strokeWidth={2.5} />
              <p className="font-bold text-sm">{details.financialImpact.fullyPaidMessage}</p>
            </div>
          )}
        </div>

        {/* Attachments */}
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-lg font-black text-[#040814]">المرفقات</h2>
            <Paperclip size={18} className="text-[#B08B3A]" strokeWidth={2.5} />
          </div>
          
          <div className="flex flex-col gap-4">
            {details.attachments.map((file) => (
              <div key={file.id} className="flex items-center justify-between border border-gray-100 rounded-2xl p-4 hover:shadow-sm transition-shadow group">
                
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center text-white ${file.type === 'pdf' ? 'bg-[#f59e0b]' : 'bg-[#f59e0b]'}`}>
                    {file.type === 'pdf' ? <FileText size={22} /> : <ImageIcon size={22} />}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-[#040814] text-sm mb-1" dir="ltr">{file.name}</span>
                    <span className="text-xs font-bold text-gray-400" dir="ltr">{file.size}</span>
                  </div>
                </div>

                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-[#040814] transition-colors focus:outline-none">
                  <Download size={18} strokeWidth={2.5} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 md:p-8">
          <h2 className="text-lg font-black text-[#040814] mb-4">الملاحظات</h2>
          <p className="text-[13px] font-bold text-gray-500 leading-relaxed">
            {details.notes}
          </p>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 md:p-8">
          <h2 className="text-lg font-black text-[#040814] mb-8">الخط الزمني للأنشطة</h2>
          
          <div className="flex flex-col relative px-2">
            {/* Vertical Line Connector */}
            <div className="absolute right-4 top-2 bottom-2 w-0.5 bg-gray-100 z-0 rounded-full" />
            
            {details.timeline.map((item, index) => (
              <div key={item.id} className={`flex gap-6 relative z-10 ${item.isLast ? '' : 'mb-8'}`}>
                {/* Timeline Dot */}
                <div className="w-4 h-4 rounded-full bg-[#040814] shrink-0 mt-1 ring-4 ring-white" />
                
                {/* Timeline Content */}
                <div className="flex flex-col border border-gray-100 rounded-2xl p-4 w-full bg-white hover:shadow-sm transition-shadow">
                  <span className="font-black text-[#040814] text-sm mb-2">{item.title}</span>
                  <span className="text-xs font-bold text-gray-400">{item.subtitle}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
