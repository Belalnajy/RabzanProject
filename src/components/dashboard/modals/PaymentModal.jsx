import React from 'react';
import Modal from '../../ui/Modal';
import { ChevronDown, Calendar, Upload } from 'lucide-react';

export default function PaymentModal({ isOpen, onClose, onSubmit }) {
  const footer = (
    <>
      <button onClick={onSubmit} className="flex-[2] bg-[#B08B3A] hover:bg-[#906c27] text-white px-6 py-4 rounded-[20px] font-black text-sm transition-colors shadow-lg shadow-amber-500/20 text-center">
        تأكيد الدفع
      </button>
      <button onClick={onClose} className="flex-1 bg-white border border-[#B08B3A] text-[#B08B3A] hover:bg-amber-50 px-6 py-4 rounded-[20px] font-black text-sm transition-colors text-center shadow-sm">
        إلغاء
      </button>
    </>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="إضافة دفعة مالية جديدة" 
      subtitle="أدخل تفاصيل الدفعة لتسجيلها في النظام"
      className="max-w-xl"
      footer={footer}
    >
      <div className="space-y-6">
        {/* Order Select */}
        <div>
          <label className="block text-sm font-bold text-[#040814] mb-3">اختر الطلب</label>
          <div className="relative">
            <select className="w-full bg-white border border-gray-200 text-gray-400 font-medium text-sm rounded-xl px-4 py-3.5 appearance-none focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/30">
              <option>اختر طلبًا من القائمة</option>
            </select>
            <ChevronDown size={16} className="absolute left-4 top-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Payment Type */}
        <div>
          <label className="block text-sm font-bold text-[#040814] mb-3">نوع الدفعة</label>
          <div className="flex flex-row-reverse gap-6 items-center flex-wrap">
            {['دفعة أولى', 'دفعة نهائية', 'عمولة', 'دفعة جزئية'].map(type => (
              <label key={type} className="flex flex-row-reverse items-center gap-2 cursor-pointer group">
                <span className="text-sm font-bold text-gray-400 group-hover:text-gray-600 transition-colors">{type}</span>
                <input type="radio" name="paymentType" className="w-4 h-4 text-[#B08B3A] border-gray-300 focus:ring-[#B08B3A]" />
              </label>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-bold text-[#040814] mb-3">المبلغ</label>
          <div className="flex">
            <div className="relative w-32 shrink-0">
              <select className="w-full h-full bg-gray-50 border border-gray-200 border-l-0 rounded-r-xl px-4 py-3.5 appearance-none text-[#040814] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/30">
                <option>EGP</option>
              </select>
              <ChevronDown size={14} className="absolute left-3 top-4 text-gray-400 pointer-events-none" />
            </div>
            <input type="number" placeholder="0.00" className="w-full bg-white border border-gray-200 rounded-l-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/30 text-right font-medium" />
          </div>
        </div>

        {/* Payment Date */}
        <div>
          <label className="block text-sm font-bold text-[#040814] mb-3">تاريخ الدفع</label>
          <div className="relative">
            <input type="text" placeholder="dd/mm/yy" className="w-full bg-white border border-gray-200 rounded-xl px-4 pl-10 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/30 text-right font-medium" />
            <Calendar size={18} className="absolute left-4 top-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Proof of Payment */}
        <div>
          <label className="block text-sm font-bold text-[#040814] mb-3">رفع إثبات الدفع (صورة حوالة/إيصال)</label>
          <button type="button" className="w-full border border-dashed border-amber-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-amber-50/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/30">
            <Upload className="text-amber-500 mb-3" size={28} strokeWidth={2.5} />
            <p className="font-bold text-[#B08B3A] mb-1 text-sm">اسحب وأفلت الملفات هنا أو انقر للاختيار</p>
            <p className="text-xs font-medium text-gray-400" dir="ltr">(PDF, JPG, PNG (10 MB حتى </p>
          </button>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-bold text-[#040814] mb-3">ملاحظات / رقم المرجع</label>
          <textarea rows="3" placeholder="اكتب تفاصيل إضافية أو رقم الحوالة..." className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/30 text-right resize-none text-sm font-medium"></textarea>
        </div>

        {/* Summary */}
        <div className="bg-[#f2fadc] border border-[#e4f5b5] rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="font-black text-[#040814]">0 EGP</span>
            <span className="font-bold text-[#040814]">المبلغ المضاف:</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-black text-[#040814]">0 EGP</span>
            <span className="font-bold text-[#040814]">المدفوع الجديد:</span>
          </div>
          <div className="flex justify-between items-center text-sm pt-4 border-t border-[#e4f5b5]">
            <span className="font-black text-[#040814]">150,000 EGP</span>
            <span className="font-bold text-[#040814]">المتبقي بعد الدفع:</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
