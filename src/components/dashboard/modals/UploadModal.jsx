import React from 'react';
import Modal from '../../ui/Modal';
import { Upload } from 'lucide-react';

export default function UploadModal({ isOpen, onClose, onSubmit }) {
  const footer = (
    <>
      <button onClick={onSubmit} className="flex-[2] bg-[#B08B3A] hover:bg-[#906c27] text-white px-6 py-4 rounded-[20px] font-black text-sm transition-colors shadow-lg shadow-amber-500/20 text-center">
        إضافة الملف
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
      title="رفع ملف جديد" 
      className="max-w-lg"
      footer={footer}
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-[#040814] mb-3">اسم الملف</label>
          <input type="text" placeholder="Product_Specifications.jpg" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/30 text-right font-medium text-gray-500" />
        </div>

        <div>
          <label className="block text-sm font-bold text-[#040814] mb-3">المرفقات</label>
          <button type="button" className="w-full border border-dashed border-amber-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-amber-50/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/30">
            <Upload className="text-amber-500 mb-4" size={36} strokeWidth={2.5} />
            <p className="font-bold text-[#B08B3A] mb-2 text-lg">اسحب الملفات هنا أو اضغط للاختيار</p>
            <p className="text-sm font-medium text-gray-400" dir="ltr">(PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (10 MB حتى</p>
          </button>
        </div>
      </div>
    </Modal>
  );
}
