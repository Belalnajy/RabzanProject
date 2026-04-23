'use client';

import React, { useState } from 'react';
import { X, Upload, Calendar, ChevronDown } from 'lucide-react';

export default function AddPaymentModal({ isOpen, onClose }) {
  const [paymentType, setPaymentType] = useState('دفعة أولى');

  if (!isOpen) return null;

  // TODO: Add form state and submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API call to save payment
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#040814]/40 backdrop-blur-sm">
      <div
        className="bg-white rounded-[24px] w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100 bg-white shrink-0 z-10">
          <div>
            <h2 className="text-xl font-black text-[#040814] mb-1">
              إضافة دفعة مالية جديدة
            </h2>
            <p className="text-sm font-bold text-gray-500">
              أدخل تفاصيل الدفعة لتسجيلها في النظام
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#040814] transition-colors">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 md:p-8 flex flex-col gap-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Select Order */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#040814]">
              اختر الطلب
            </label>
            <div className="relative">
              <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-500 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer">
                <option value="">اختر طلباً من القائمة</option>
                {/* TODO: Map orders here */}
                <option value="ORD-12345">ORD-12345 - شركة النقل السريع</option>
              </select>
              <ChevronDown
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
            </div>
          </div>

          {/* Payment Type */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-[#040814]">
              نوع الدفعة
            </label>
            <div className="flex flex-wrap items-center gap-6">
              {['دفعة أولى', 'دفعة نهائية', 'عمولة', 'دفعة جزئية'].map(
                (type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 cursor-pointer group">
                    <div
                      className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-colors ${paymentType === type ? 'border-[#B08B3A]' : 'border-gray-300 group-hover:border-gray-400'}`}>
                      {paymentType === type && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#B08B3A]" />
                      )}
                    </div>
                    <span className="text-sm font-bold text-gray-600">
                      {type}
                    </span>
                  </label>
                ),
              )}
            </div>
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#040814]">المبلغ</label>
            <div className="flex w-full">
              <div className="relative w-28 shrink-0">
                <select className="w-full h-full appearance-none bg-gray-50 border border-gray-200 border-l-0 rounded-r-xl px-4 py-3 text-sm font-bold text-[#040814] outline-none cursor-pointer">
                  <option>EGP</option>
                  <option>USD</option>
                </select>
                <ChevronDown
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
              </div>
              <input
                type="number"
                placeholder="0.00"
                className="w-full bg-white border border-gray-200 rounded-l-xl px-4 py-3 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-left"
                dir="ltr"
              />
            </div>
          </div>

          {/* Payment Date */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#040814]">
              تاريخ الدفع
            </label>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="dd/mm/yy"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-500 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-left"
                dir="ltr"
              />
              <Calendar
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
          </div>

          {/* Upload Proof */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#040814]">
              رفع إثبات الدفع (صورة حوالة/إيصال)
            </label>
            <div className="border-2 border-dashed border-[#E3C989] rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-amber-50/30 transition-colors">
              <Upload size={32} className="text-[#B08B3A] mb-3" />
              <p className="text-sm font-bold text-[#B08B3A] mb-1">
                اسحب وأفلت الملفات هنا أو انقر للاختيار
              </p>
              <p className="text-xs font-bold text-gray-400" dir="ltr">
                PDF, JPG, PNG (حتى 10MB)
              </p>
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#040814]">
              ملاحظات / رقم المرجع
            </label>
            <textarea
              rows={3}
              placeholder="اكتب تفاصيل إضافية أو رقم الحوالة..."
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-500 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none"
            />
          </div>

          {/* Summary Box */}
          <div className="bg-[#f2fce6] rounded-xl p-5 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-[#040814]">
                المبلغ المضاف:
              </span>
              <span className="text-sm font-black text-[#040814]" dir="ltr">
                0 EGP
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-[#040814]">
                المدفوع الجديد:
              </span>
              <span className="text-sm font-black text-[#040814]" dir="ltr">
                0 EGP
              </span>
            </div>
            <div className="h-px w-full bg-emerald-200/50 my-1"></div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-[#040814]">
                المتبقي بعد الدفع:
              </span>
              <span className="text-sm font-black text-[#040814]" dir="ltr">
                150,000 EGP
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl border border-[#B08B3A] text-[#B08B3A] font-bold text-sm hover:bg-amber-50 transition-colors focus:outline-none">
              إلغاء
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 rounded-xl bg-[#B08B3A] text-white font-bold text-sm hover:bg-[#906c27] transition-colors shadow-sm focus:outline-none">
              تأكيد الدفع
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
