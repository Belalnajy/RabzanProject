'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../../../components/dashboard/Header';
import {
  Plus,
  ChevronDown,
  Upload,
  Search,
  X,
  Check,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    client: '',
    category: '',
    description: '',
    price: '',
    currency: 'EGP',
    commission: '',
    specsAr: '',
    specsEn: '',
    mainCategory: '',
    subCategory: '',
    material: '',
    weight: '',
    width: '',
    origin: '',
    dimensions: '',
    rollerDiameter: '',
    minOrderQuantity: '',
    productUnit: '',
  });

  const [files, setFiles] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting Product Data:', formData);
    console.log('Attached Files:', files);
    // TODO: Send data to /api/products
    // router.push('/dashboard/products');
  };

  return (
    <div dir="rtl" className="pb-20">
      {/* Header */}
      <Header
        title="إضافة/تعديل منتج"
        subtitle="أدخل معلومات المنتج الجديد أو قم بتحديث المنتج الحالي"
        variant="card"
      />

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-8 max-w-5xl mx-auto">
        {/* ================= SECTION 1: BASIC INFO ================= */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
          <h3 className="text-xl font-black text-[#040814] mb-8 border-b border-gray-50 pb-4">
            المعلومات الأساسية
          </h3>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#040814] pr-1">
                  اسم المنتج
                </label>
                <input
                  type="text"
                  name="nameAr"
                  value={formData.nameAr}
                  onChange={handleInputChange}
                  placeholder="أدخل اسم المنتج"
                  className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] focus:ring-4 focus:ring-amber-500/5 transition-all outline-none font-bold text-sm"
                />
              </div>
              <div className="space-y-2" dir="ltr">
                <label className="block text-sm font-bold text-[#040814] pl-1 text-left">
                  اسم المنتج (English)
                </label>
                <input
                  type="text"
                  name="nameEn"
                  value={formData.nameEn}
                  onChange={handleInputChange}
                  placeholder="Enter Product name"
                  className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] focus:ring-4 focus:ring-amber-500/5 transition-all outline-none font-bold text-sm text-left"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#040814] pr-1">
                اختر العميل
              </label>
              <div className="relative">
                <select
                  name="client"
                  value={formData.client}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] focus:ring-4 focus:ring-amber-500/5 transition-all outline-none font-bold text-sm appearance-none cursor-pointer">
                  <option value="" disabled>
                    ابحث عن العميل
                  </option>
                  <option value="client1">شركة النصر للتجارة</option>
                  <option value="client2">مؤسسة الأمل للصناعة</option>
                </select>
                <ChevronDown
                  size={20}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#040814] pr-1">
                الفئة / النوع
              </label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] focus:ring-4 focus:ring-amber-500/5 transition-all outline-none font-bold text-sm appearance-none cursor-pointer">
                  <option value="" disabled>
                    اختر الفئة
                  </option>
                  <option value="fabrics">أقمشة</option>
                  <option value="electronics">إلكترونيات</option>
                  <option value="machinery">آلات ومعدات</option>
                </select>
                <ChevronDown
                  size={20}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#040814] pr-1">
                الوصف
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                placeholder="اكتب وصف المنتج هنا..."
                className="w-full px-5 py-4 rounded-3xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] focus:ring-4 focus:ring-amber-500/5 transition-all outline-none font-bold text-sm resize-none"></textarea>
            </div>
          </div>
        </div>

        {/* ================= SECTION 2: PRICING ================= */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
          <h3 className="text-xl font-black text-[#040814] mb-8 border-b border-gray-50 pb-4">
            إعداد الأسعار
          </h3>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#040814] pr-1">
                السعر الافتراضي للوحدة
              </label>
              <div className="flex gap-4">
                <div className="relative w-40">
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] transition-all outline-none font-bold text-sm appearance-none cursor-pointer">
                    <option value="EGP">جنيه مصري</option>
                    <option value="USD">دولار أمريكي</option>
                    <option value="SAR">ريال سعودي</option>
                  </select>
                  <ChevronDown
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="flex-1 px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] focus:ring-4 focus:ring-amber-500/5 transition-all outline-none font-black text-xl text-left"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#040814] pr-1">
                نسبة العمولة (%)
              </label>
              <input
                type="number"
                name="commission"
                value={formData.commission}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] focus:ring-4 focus:ring-amber-500/5 transition-all outline-none font-bold text-sm"
              />
              <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
                <HelpCircle size={18} className="text-emerald-500" />
                <p className="text-emerald-700 text-xs font-bold">
                  مثال: لو السعر 100 والعمولة 5%، العمولة 5
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SECTION 3: SPECS ================= */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
          <h3 className="text-xl font-black text-[#040814] mb-8 border-b border-gray-50 pb-4">
            المواصفات
          </h3>

          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#040814] pr-1 text-right">
                  المواصفات بالعربية
                </label>
                <textarea
                  name="specsAr"
                  value={formData.specsAr}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="أدخل المواصفات التفصيلية للمنتج..."
                  className="w-full px-5 py-4 rounded-3xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] transition-all outline-none font-bold text-sm resize-none"></textarea>
              </div>
              <div className="space-y-2" dir="ltr">
                <label className="block text-sm font-bold text-[#040814] pl-1 text-left">
                  المواصفات بالإنجليزية
                </label>
                <textarea
                  name="specsEn"
                  value={formData.specsEn}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Enter the product description..."
                  className="w-full px-5 py-4 rounded-3xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] transition-all outline-none font-bold text-sm resize-none text-left"></textarea>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-base font-black text-[#040814]">التصنيف</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-400 pr-1 uppercase tracking-wider">
                    الفئة
                  </label>
                  <div className="relative">
                    <select
                      name="mainCategory"
                      value={formData.mainCategory}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] transition-all outline-none font-bold text-sm appearance-none cursor-pointer">
                      <option value="">Select Category...</option>
                      <option value="cat1">Category 1</option>
                    </select>
                    <ChevronDown
                      size={18}
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-400 pr-1 uppercase tracking-wider">
                    الفئة الفرعية
                  </label>
                  <div className="relative">
                    <select
                      name="subCategory"
                      value={formData.subCategory}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] transition-all outline-none font-bold text-sm appearance-none cursor-pointer">
                      <option value="">اختر الفئة الفرعية</option>
                      <option value="sub1">Sub-Category 1</option>
                    </select>
                    <ChevronDown
                      size={18}
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-base font-black text-[#040814]">
                المواصفات المنظمة
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                {[
                  { label: 'المادة', name: 'material', placeholder: 'المادة' },
                  { label: 'الوزن', name: 'weight', placeholder: 'الوزن' },
                  { label: 'العرض', name: 'width', placeholder: 'العرض' },
                  {
                    label: 'بلد المنشأ',
                    name: 'origin',
                    placeholder: 'بلد المنشأ',
                  },
                  {
                    label: 'الأبعاد',
                    name: 'dimensions',
                    placeholder: 'الأبعاد',
                  },
                  {
                    label: 'قطر البكرة',
                    name: 'rollerDiameter',
                    placeholder: 'قطر البكرة',
                  },
                  {
                    label: 'الحد الأدنى لكمية الطلب',
                    name: 'minOrderQuantity',
                    placeholder: 'الحد الأدنى لكمية الطلب',
                  },
                  {
                    label: 'وحدة المنتج',
                    name: 'productUnit',
                    placeholder: 'وحدة المنتج',
                  },
                ].map((field) => (
                  <div key={field.name} className="relative">
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      className="w-full px-5 py-3.5 rounded-2xl bg-white border border-gray-100 focus:bg-white focus:border-[#B08B3A] transition-all outline-none font-bold text-[13px] text-right placeholder-gray-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= SECTION 4: ATTACHMENTS ================= */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
          <h3 className="text-xl font-black text-[#040814] mb-8 border-b border-gray-50 pb-4">
            المرفقات
          </h3>

          <div className="space-y-4">
            <p className="text-sm font-bold text-[#040814] pr-1">
              صور التصميم، ورقة المواصفات، إلخ
            </p>
            <div className="relative group">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="border-2 border-dashed border-gray-200 rounded-[32px] p-12 flex flex-col items-center justify-center text-center transition-all group-hover:border-amber-400 group-hover:bg-amber-50/30">
                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform">
                  <Upload size={32} />
                </div>
                <div className="w-48 h-0.5 bg-gray-100 mb-6"></div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  PDF, DOC, DOCX, JPG, PNG (10 —— MB)
                </p>
              </div>
            </div>

            {/* Display selected files */}
            {files.length > 0 && (
              <div className="grid grid-cols-1 gap-3 mt-4">
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400">
                        <Upload size={18} />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-[#040814] truncate max-w-[200px]">
                          {file.name}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFiles((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="w-8 h-8 rounded-full hover:bg-rose-50 text-gray-400 hover:text-rose-500 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 max-w-[320px] py-4 rounded-2xl border border-gray-200 text-gray-500 font-bold hover:bg-gray-50 transition-all active:scale-95 shadow-sm">
            إلغاء
          </button>
          <button
            type="submit"
            className="flex-1 max-w-[320px] py-4 rounded-2xl bg-[#B08B3A] text-white font-black hover:bg-[#906c27] transition-all active:scale-95 shadow-lg shadow-amber-500/20">
            حفظ المنتج
          </button>
        </div>
      </form>
    </div>
  );
}
