'use client';

import React, { useState } from 'react';
import Header from '../../../../components/dashboard/Header';
import { Upload, Info, ChevronDown, Calendar, Plus } from 'lucide-react';

export default function CreateOrderPage() {
  // Form State
  const [formData, setFormData] = useState({
    product: '',
    client: '',
    orderType: 'استيراد',
    unitPrice: '',
    quantity: '',
    currency: 'جنيه مصري (EGP)',
    dollarRate: '30.90',
    priority: '',
    advancePayment: '',
    transferDate: '',
    quoteStatus: 'مسودة',
    isApproved: false,
    initialStage: '',
  });

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Calculations for Order Summary
  const qty = parseFloat(formData.quantity) || 0;
  const price = parseFloat(formData.unitPrice) || 0;
  const advance = parseFloat(formData.advancePayment) || 0;

  const total = qty * price;
  const commission = total * 0.05; // 5% mock commission
  const remaining = total - advance;

  // Handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Connect to backend API to save the new order
    console.log('Order Data Submitted:', formData);
  };

  return (
    <>
      <Header title="قائمة الطلبات" subtitle="" variant="card" />

      <div className="mb-10">
        <h2 className="text-[32px] font-black text-[#040814] mb-2">
          إنشاء طلب جديد
        </h2>
        <p className="text-gray-400 font-bold text-lg">
          أدخل تفاصيل الطلب الجديد لبدء عملية الاستيراد والخدمات اللوجستية
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row gap-8 items-start">
        {/* RIGHT COLUMN: MAIN FORM */}
        <div className="w-full lg:w-[70%] space-y-6">
          {/* SECTION 1: Client & Product */}
          <div className="bg-white rounded-[32px] border border-gray-200 p-6 md:p-8 shadow-sm">
            <h3 className="text-[#B08B3A] font-black text-xl mb-8">
              العميل والمنتج
            </h3>

            {/* Row 1 */}
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex-1">
                <label className="block font-bold text-sm text-[#040814] mb-3">
                  اختر المنتج
                </label>
                <div className="relative">
                  <select
                    name="product"
                    value={formData.product}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-200 text-[#040814] font-medium text-sm rounded-xl px-4 py-3.5 appearance-none focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/30">
                    <option value="">-- اختر منتج --</option>
                    <option value="إلكترونيات">إلكترونيات</option>
                    <option value="مواد خام">مواد خام</option>
                  </select>
                  <ChevronDown
                    className="absolute left-4 top-4 text-gray-400 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>

              <div className="flex-1">
                <label className="block font-bold text-sm text-[#040814] mb-3">
                  اختر العميل
                </label>
                <div className="relative">
                  <select
                    name="client"
                    value={formData.client}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-200 text-gray-400 font-medium text-sm rounded-xl px-4 py-3.5 appearance-none focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/30">
                    <option value="">ابحث عن العميل...</option>
                    <option
                      value="شركة النقل السريع"
                      className="text-[#040814]">
                      شركة النقل السريع
                    </option>
                    <option value="مصنع الأمل" className="text-[#040814]">
                      مصنع الأمل
                    </option>
                  </select>
                  <ChevronDown
                    className="absolute left-4 top-4 text-gray-400 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="flex-1">
                <label className="block font-bold text-sm text-[#040814] mb-3">
                  نوع الطلب
                </label>
                <div className="relative">
                  <select
                    name="orderType"
                    value={formData.orderType}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-200 text-[#040814] font-medium text-sm rounded-xl px-4 py-3.5 appearance-none focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/30">
                    <option value="استيراد">استيراد</option>
                    <option value="تصدير">تصدير</option>
                  </select>
                  <ChevronDown
                    className="absolute left-4 top-4 text-gray-400 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>

              <div className="flex-1">
                <label className="block font-bold text-sm text-[#040814] mb-3">
                  سعر الوحدة
                </label>
                <input
                  type="number"
                  name="unitPrice"
                  value={formData.unitPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full bg-white border border-gray-200 text-[#040814] font-medium text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/30 text-right"
                  dir="ltr"
                />
              </div>
            </div>

            <button
              type="button"
              className="bg-[#B08B3A] hover:bg-[#906c27] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-sm flex items-center gap-1.5">
              <Plus size={16} strokeWidth={3} /> إضافة منتج جديد
            </button>
          </div>

          {/* SECTION 2: Pricing */}
          <div className="bg-white rounded-[32px] border border-gray-200 p-6 md:p-8 shadow-sm">
            <h3 className="text-[#B08B3A] font-black text-xl mb-8">التسعير</h3>

            {/* Row 1 */}
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex-1">
                <label className="block font-bold text-sm text-[#040814] mb-3">
                  الكمية
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full bg-white border border-gray-200 text-[#040814] font-medium text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/30 text-right"
                  dir="ltr"
                />
              </div>

              <div className="flex-1">
                <label className="block font-bold text-sm text-[#040814] mb-3">
                  العملة
                </label>
                <div className="relative">
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-200 text-[#040814] font-medium text-sm rounded-xl px-4 py-3.5 appearance-none focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/30">
                    <option value="جنيه مصري (EGP)">جنيه مصري (EGP)</option>
                    <option value="دولار أمريكي (USD)">
                      دولار أمريكي (USD)
                    </option>
                  </select>
                  <ChevronDown
                    className="absolute left-4 top-4 text-gray-400 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label className="block font-bold text-sm text-[#040814] mb-3">
                  سعر الدولار
                </label>
                <input
                  type="number"
                  name="dollarRate"
                  value={formData.dollarRate}
                  onChange={handleChange}
                  placeholder="30.90"
                  className="w-full bg-white border border-gray-200 text-[#040814] font-medium text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/30 text-right"
                  dir="ltr"
                />
              </div>

              <div className="flex-1">
                <label className="block font-bold text-sm text-[#040814] mb-3">
                  الأولوية
                </label>
                <div className="relative">
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-200 text-[#040814] font-medium text-sm rounded-xl px-4 py-3.5 appearance-none focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/30">
                    <option value="">عادية</option>
                    <option value="عالية">عالية</option>
                  </select>
                  <ChevronDown
                    className="absolute left-4 top-4 text-gray-400 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Financial Settings */}
          <div className="bg-white rounded-[32px] border border-gray-200 p-6 md:p-8 shadow-sm">
            <h3 className="text-[#B08B3A] font-black text-xl mb-8">
              الإعدادات المالية
            </h3>

            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex-1">
                <label className="block font-bold text-sm text-[#040814] mb-3">
                  الدفعة المقدمة
                </label>
                <input
                  type="number"
                  name="advancePayment"
                  value={formData.advancePayment}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full bg-white border border-gray-200 text-[#040814] font-medium text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/30 text-right"
                  dir="ltr"
                />
              </div>

              <div className="flex-1">
                <label className="block font-bold text-sm text-[#040814] mb-3">
                  تاريخ الحوالة
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="transferDate"
                    value={formData.transferDate}
                    onChange={handleChange}
                    placeholder="dd/mm/yy"
                    // Optionally integrate a proper date picker library here
                    className="w-full bg-white border border-gray-200 text-[#040814] font-medium text-sm rounded-xl px-4 pl-10 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/30 text-right"
                    dir="ltr"
                  />
                  <Calendar
                    className="absolute left-4 top-4 text-gray-400 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-end">
              <div className="flex-1">
                <label className="block font-bold text-sm text-[#040814] mb-3">
                  حالة العرض
                </label>
                <div className="relative">
                  <select
                    name="quoteStatus"
                    value={formData.quoteStatus}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-200 text-[#040814] font-medium text-sm rounded-xl px-4 py-3.5 appearance-none focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/30">
                    <option value="مسودة">مسودة</option>
                    <option value="معتمد">معتمد</option>
                  </select>
                  <ChevronDown
                    className="absolute left-4 top-4 text-gray-400 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>

              <div className="flex-1 pb-3 pr-2">
                <div className="flex items-center gap-4">
                  <label className="font-bold text-sm text-[#040814]">
                    معتمد؟
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        isApproved: !prev.isApproved,
                      }))
                    }
                    className={`relative w-12 h-6 rounded-full flex items-center p-1 transition-colors duration-300 focus:outline-none ${formData.isApproved ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ${formData.isApproved ? '-translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: Workflow */}
          <div className="bg-white rounded-[32px] border border-gray-200 p-6 md:p-8 shadow-sm">
            <h3 className="text-[#B08B3A] font-black text-xl mb-8">
              بدء سير العمل
            </h3>

            <div className="mb-4">
              <label className="block font-bold text-sm text-[#040814] mb-3">
                اختر المرحلة الأولى
              </label>
              <div className="relative">
                <select
                  name="initialStage"
                  value={formData.initialStage}
                  onChange={handleChange}
                  className={`w-full bg-white border border-gray-200 font-medium text-sm rounded-xl px-4 py-3.5 appearance-none focus:outline-none focus:ring-2 focus:ring-[#B08B3A]/30 ${formData.initialStage ? 'text-[#040814]' : 'text-gray-400'}`}>
                  <option value="">تخصيص تلقائي بناءً على نوع الطلب</option>
                  <option value="تثبيت" className="text-[#040814]">
                    تثبيت
                  </option>
                  <option value="توثيق" className="text-[#040814]">
                    توثيق
                  </option>
                </select>
                <ChevronDown
                  className="absolute left-4 top-4 text-gray-400 pointer-events-none"
                  size={16}
                />
              </div>
            </div>

            <div className="flex items-start gap-2 text-gray-400">
              <Info size={16} className="mt-0.5 flex-shrink-0" />
              <p className="text-xs font-bold leading-relaxed">
                سيتم تخصيص المرحلة الأولى تلقائياً بناءً على نوع الطلب إذا لم
                تقم بالاختيار.
              </p>
            </div>
          </div>

          {/* SECTION 5: Attachments */}
          <div className="bg-white rounded-[32px] border border-gray-200 p-6 md:p-8 shadow-sm">
            <h3 className="text-[#B08B3A] font-black text-xl mb-8">المرفقات</h3>

            {/* Dropzone */}
            {/* TODO: Connect file upload logic/dropzone handler */}
            <button
              type="button"
              className="w-full border-[1.5px] border-dashed border-amber-300 rounded-[28px] p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-amber-50/50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-2">
              <Upload
                className="text-amber-500 mb-4 drop-shadow-sm"
                size={36}
                strokeWidth={2.5}
              />
              <p className="font-bold text-[#B08B3A] mb-2 text-lg">
                اسحب الملفات هنا أو اضغط للاختيار
              </p>
              <p className="text-sm font-medium text-gray-400" dir="ltr">
                (PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (up to 10 MB
              </p>
            </button>
          </div>

          {/* Primary Form Actions hidden on mobile flex, visible on large */}
          <div className="hidden lg:flex gap-4 mt-8">
            <button
              type="button"
              className="flex-1 bg-white border border-[#B08B3A] text-[#B08B3A] hover:bg-amber-50 px-6 py-4 rounded-[20px] font-black text-sm transition-colors text-center focus:outline-none shadow-sm">
              إلغاء
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#B08B3A] hover:bg-[#906c27] text-white px-6 py-4 rounded-[20px] font-black text-sm transition-colors shadow-lg shadow-amber-500/20 text-center focus:outline-none">
              حفظ وبدء سير العمل
            </button>
          </div>
        </div>

        {/* LEFT COLUMN: SUMMARY */}
        <div className="w-full lg:w-[30%] bg-white rounded-[32px] border border-gray-200 shadow-sm sticky top-6">
          <h3 className="text-[#B08B3A] font-black text-xl p-8 border-b border-gray-50 text-center">
            ملخص الطلب
          </h3>

          <div className="px-8 py-6 space-y-6">
            <div className="flex justify-between items-center pb-6 border-b border-gray-50 border-dashed">
              <span className="text-slate-400 font-bold text-xs">العميل:</span>
              <span className="font-black text-[#040814] text-xs">
                {formData.client || 'غير محدد'}
              </span>
            </div>

            <div className="flex justify-between items-center pb-6 border-b border-gray-50 border-dashed">
              <span className="text-slate-400 font-bold text-xs">المنتج:</span>
              <span className="font-black text-[#040814] text-xs">
                {formData.product || 'غير محدد'}
              </span>
            </div>

            <div className="flex justify-between items-center pb-6 border-b border-gray-50 border-dashed">
              <span className="text-slate-400 font-bold text-xs">
                الكمية × سعر الوحدة:
              </span>
              <span className="font-black text-[#040814] text-xs" dir="ltr">
                {qty} × {price} = {total}
              </span>
            </div>

            <div className="flex justify-between items-center pb-6 border-b border-gray-50 border-dashed">
              <span className="text-slate-400 font-bold text-xs">العملة:</span>
              <span className="font-black text-[#040814] text-xs" dir="ltr">
                {formData.currency.includes('USD') ? 'USD' : 'EGP'}
              </span>
            </div>

            <div className="flex justify-between items-center pb-6 border-b border-gray-50 border-dashed">
              <span className="text-slate-400 font-bold text-xs">
                الأولوية:
              </span>
              {formData.priority === 'عالية' ? (
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-500 ring-1 ring-rose-100">
                  عالية
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-500 ring-1 ring-emerald-100">
                  غير محدد
                </span>
              )}
            </div>

            <div className="flex justify-between items-center pb-6 border-b border-gray-100">
              <span className="text-slate-400 font-bold text-xs">
                المرحلة الحالية:
              </span>
              <span className="font-black text-[#040814] text-xs">
                {formData.initialStage || 'بدء'}
              </span>
            </div>

            {/* Financials Totals */}
            <div className="pt-2 pb-6 border-b border-gray-50 border-dashed flex justify-between items-center">
              <span className="text-slate-400 font-bold text-xs">
                الإجمالي:
              </span>
              <span className="font-black text-amber-500 text-sm">
                {total > 0 ? total.toFixed(0) : '0.00'}
              </span>
            </div>

            <div className="flex justify-between items-center pb-6 border-b border-gray-50 border-dashed">
              <span className="text-slate-400 font-bold text-xs">العمولة:</span>
              <span className="font-black text-amber-500 text-sm">
                {total > 0 ? commission.toFixed(2) : '0.00'}
              </span>
            </div>

            <div className="flex justify-between items-center pb-6 border-b border-gray-50 border-dashed">
              <span className="text-slate-400 font-bold text-xs">
                الدفعة المقدمة:
              </span>
              <span className="font-black text-amber-500 text-sm">
                {advance > 0 ? advance.toFixed(2) : '0.00'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold text-xs">المتبقي:</span>
              <span className="font-black text-amber-500 text-sm">
                {remaining > 0 ? remaining.toFixed(2) : '0.00'}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Actions (Visible only on smaller screens) */}
        <div className="flex lg:hidden gap-4 mt-4 w-full">
          <button
            type="button"
            className="flex-1 bg-white border border-[#B08B3A] text-[#B08B3A] hover:bg-amber-50 px-6 py-4 rounded-[20px] font-black text-sm transition-colors text-center focus:outline-none shadow-sm">
            إلغاء
          </button>
          <button
            type="submit"
            className="flex-1 bg-[#B08B3A] hover:bg-[#906c27] text-white px-6 py-4 rounded-[20px] font-black text-sm transition-colors shadow-lg shadow-amber-500/20 text-center focus:outline-none">
            حفظ
          </button>
        </div>
      </form>
    </>
  );
}
