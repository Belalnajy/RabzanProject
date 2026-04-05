import React from 'react';
import Modal from '../../ui/Modal';
import { ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';

export default function StageUpdateModal({ isOpen, onClose, onSubmit, currentStage = "التصنيع" }) {
  const footer = (
    <>
      <button onClick={onSubmit} className="flex-[2] bg-gray-400 text-white px-6 py-4 rounded-[20px] font-black text-sm cursor-not-allowed text-center">
        تأكيد التحديث
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
      title="تحديث مرحلة الطلب" 
      className="max-w-lg"
      footer={footer}
    >
      <div className="space-y-6">
        {/* Current Stage */}
        <div className="flex items-center justify-between">
          <span className="px-5 py-2 rounded-full text-xs font-bold bg-emerald-50 text-emerald-500">{currentStage}</span>
          <span className="text-sm font-bold text-[#040814]">المرحلة الحالية</span>
        </div>

        {/* Select New Stage */}
        <div>
          <label className="block text-sm font-bold text-[#040814] mb-3">اختيار المرحلة الجديدة</label>
          <div className="relative">
            <select className="w-full bg-white border border-gray-200 text-gray-400 font-medium text-sm rounded-xl px-4 py-4 appearance-none focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/30">
              <option>{currentStage}</option>
            </select>
            <ChevronDown size={16} className="absolute left-4 top-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Stage Reason */}
        <div>
          <label className="block text-sm font-bold text-[#040814] mb-3">سبب تغيير المرحلة</label>
          <textarea rows="3" placeholder="اكتب سبب نقل الطلب إلى هذه المرحلة" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/30 text-right resize-none font-medium text-sm text-gray-500"></textarea>
        </div>

        {/* Stage Requirements */}
        <div>
          <label className="block text-sm font-bold text-[#040814] mb-4">متطلبات المرحلة</label>
          <div className="space-y-4">
            <div className="flex items-center gap-3 justify-end">
               <span className="text-sm font-medium text-gray-500">تم الانتهاء من التصنيع</span>
               <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
            </div>
            <div className="flex items-center gap-3 justify-end">
               <span className="text-sm font-medium text-gray-500">تم تحديد شركة الشحن</span>
               <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
            </div>
            <div className="flex items-center gap-3 justify-end">
               <span className="text-sm font-medium text-gray-400">تم إدخال رقم التتبع</span>
               <AlertCircle className="text-amber-500 shrink-0" size={18} />
            </div>
          </div>
        </div>

        {/* Error Box */}
        <div className="bg-[#FAF0E6] rounded-xl p-4 text-center border border-amber-100">
          <p className="text-amber-600 font-bold text-sm">لا يمكن الانتقال إلى هذه المرحلة قبل استكمال المتطلبات.</p>
        </div>
      </div>
    </Modal>
  );
}
