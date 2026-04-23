'use client';

import React from 'react';
import { X } from 'lucide-react';

export default function CommissionDetailsModal({ isOpen, onClose, data }) {
  if (!isOpen) return null;

  // TODO: Use actual data from props
  const orderId = data?.orderId || 'ORD-2023-001';
  const status = data?.status || 'مؤكد';
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#040814]/40 backdrop-blur-sm">
      <div 
        className="bg-white rounded-[24px] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-black text-[#040814]">
              تفاصيل العمولة - <span dir="ltr">{orderId}</span>
            </h2>
            <span className="px-3 py-1 bg-emerald-100/50 text-emerald-600 text-xs font-bold rounded-full">
              {status}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-6 md:p-8 flex flex-col gap-8">
          
          {/* Summary Section */}
          <div>
            <h3 className="text-lg font-black text-[#040814] mb-5">ملخص العمولة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Row 1 */}
              <div className="flex justify-between items-center bg-white border border-gray-100 rounded-2xl p-4">
                <span className="text-[13px] font-bold text-gray-500">إجمالي العمولة</span>
                <span className="text-base font-black text-[#040814]" dir="ltr">EGP 62,500</span>
              </div>
              <div className="flex justify-between items-center bg-white border border-gray-100 rounded-2xl p-4">
                <span className="text-[13px] font-bold text-gray-500">المستلم حتى الآن</span>
                <span className="text-base font-black text-[#040814]" dir="ltr">EGP 37,500</span>
              </div>

              {/* Row 2 */}
              <div className="flex justify-between items-center bg-white border border-gray-100 rounded-2xl p-4">
                <span className="text-[13px] font-bold text-gray-500">المتبقي</span>
                <span className="text-base font-black text-rose-500" dir="ltr">EGP 25,000</span>
              </div>
              <div className="flex justify-between items-center bg-white border border-gray-100 rounded-2xl p-4">
                <span className="text-[13px] font-bold text-gray-500">نسبة العمولة</span>
                <span className="text-base font-black text-[#040814]" dir="ltr">5%</span>
              </div>

              {/* Row 3 */}
              <div className="flex justify-between items-center bg-white border border-gray-100 rounded-2xl p-4">
                <span className="text-[13px] font-bold text-gray-500">محسوبة من</span>
                <span className="text-base font-black text-[#040814]" dir="ltr">EGP 1,250,000</span>
              </div>
              <div className="flex justify-between items-center bg-white border border-gray-100 rounded-2xl p-4">
                <span className="text-[13px] font-bold text-gray-500">تاريخ الطلب</span>
                <span className="text-base font-black text-[#040814]">15 أكتوبر 2023</span>
              </div>
            </div>
          </div>

          {/* Payments History Section */}
          <div className="bg-white border border-gray-100 rounded-[24px] p-6">
            <h3 className="text-lg font-black text-[#040814] mb-6">سجل الدفعات</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-4 text-[13px] text-[#040814] font-black px-2">رقم الدفعة</th>
                    <th className="pb-4 text-[13px] text-[#040814] font-black px-2">التاريخ</th>
                    <th className="pb-4 text-[13px] text-[#040814] font-black px-2">المبلغ</th>
                    <th className="pb-4 text-[13px] text-[#040814] font-black px-2">أضيف بواسطة</th>
                    <th className="pb-4 text-[13px] text-[#040814] font-black px-2">ملاحظات</th>
                  </tr>
                </thead>
                <tbody>
                  {/* TODO: Map actual payment history */}
                  <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-2 text-[13px] font-bold text-gray-600" dir="ltr">PAY-001</td>
                    <td className="py-4 px-2 text-[13px] font-bold text-[#040814]">18 أكتوبر 2023</td>
                    <td className="py-4 px-2 text-[13px] font-bold text-[#040814]" dir="ltr">EGP 25,000</td>
                    <td className="py-4 px-2 text-[13px] font-bold text-[#040814]">أحمد محمد</td>
                    <td className="py-4 px-2 text-[13px] font-bold text-[#040814]">الدفعة الأولى</td>
                  </tr>
                  <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-2 text-[13px] font-bold text-gray-600" dir="ltr">PAY-002</td>
                    <td className="py-4 px-2 text-[13px] font-bold text-[#040814]">20 أكتوبر 2023</td>
                    <td className="py-4 px-2 text-[13px] font-bold text-[#040814]" dir="ltr">EGP 12,500</td>
                    <td className="py-4 px-2 text-[13px] font-bold text-[#040814]">مدير المالية</td>
                    <td className="py-4 px-2 text-[13px] font-bold text-[#040814]">الدفعة الثانية</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
