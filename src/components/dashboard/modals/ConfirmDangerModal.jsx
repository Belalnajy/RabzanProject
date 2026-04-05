import React from 'react';
import Modal from '../../ui/Modal';

export default function ConfirmDangerModal({ isOpen, onClose, onConfirm, title, subtitle }) {
  if (!isOpen) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      hideHeader={true}
      className="max-w-md"
    >
      <div className="text-center pt-8 pb-4">
        <h2 className="text-[24px] font-black text-[#040814] mb-3">
          {title || "أنت على وشك إضافة تعديل ذو خطورة عالية"}
        </h2>
        <p className="text-gray-400 text-sm font-bold mb-10">
          {subtitle || "هل أنت متأكد من رغبتك في الاستمرار؟"}
        </p>
        
        <div className="flex gap-4 flex-row-reverse">
          <button onClick={onConfirm} className="flex-[2] bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-[20px] font-black text-sm transition-colors shadow-lg shadow-red-600/20">
            تأكيد
          </button>
          <button onClick={onClose} className="flex-1 bg-white border border-red-600 text-red-600 hover:bg-red-50 px-6 py-4 rounded-[20px] font-black text-sm transition-colors shadow-sm">
            إلغاء
          </button>
        </div>
      </div>
    </Modal>
  );
}
