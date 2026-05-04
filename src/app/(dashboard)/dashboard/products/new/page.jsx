'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/dashboard/Header';
import { ChevronDown, AlertCircle, Loader2, Upload } from 'lucide-react';
import { useApi, useMutation } from '@/hooks/useApi';
import { productsService } from '@/lib/services/products.service';
import { categoriesService } from '@/lib/services/categories.service';
import { customersService } from '@/lib/services/customers.service';
import { X } from 'lucide-react';

const SPEC_FIELDS = [
  { key: 'Material', label: 'المادة', labelEn: 'Material' },
  { key: 'Weight', label: 'الوزن', labelEn: 'Weight' },
  { key: 'Width', label: 'العرض', labelEn: 'Width' },
  {
    key: 'Country of Origin',
    label: 'بلد المنشأ',
    labelEn: 'Country of Origin',
  },
  { key: 'Dimensions', label: 'الأبعاد', labelEn: 'Dimensions' },
  { key: 'Roll Diameter', label: 'قطر البكرة', labelEn: 'Roll Diameter' },
  { key: 'Product Unit', label: 'وحدة المنتج', labelEn: 'Product Unit' },
  { key: 'MOQ', label: 'الحد الأدنى لكمية الطلب', labelEn: 'MOQ' },
];

export default function NewProductPage() {
  const router = useRouter();
  const categoriesQuery = useApi(() => categoriesService.list(), []);
  const customersQuery = useApi(
    () => customersService.list({ limit: 100 }),
    [],
  );
  const createMut = useMutation((payload) => productsService.create(payload));

  const [form, setForm] = useState({
    nameAr: '',
    name: '',
    customerId: '',
    categoryId: '',
    subCategoryId: '',
    description: '',
    defaultPrice: '',
    commissionRate: '',
    longDescription: '',
    image: '',
  });
  const [specForm, setSpecForm] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSpecChange = (key, val) =>
    setSpecForm({ ...specForm, [key]: val });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (!imageFile && files.length > 0) {
      setImageFile(files[0]);
      setImagePreview(URL.createObjectURL(files[0]));
      
      const rest = files.slice(1);
      if (rest.length > 0) {
        setGalleryFiles((prev) => [...prev, ...rest]);
        setGalleryPreviews((prev) => [...prev, ...rest.map((f) => URL.createObjectURL(f))]);
      }
    } else {
      setGalleryFiles((prev) => [...prev, ...files]);
      setGalleryPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    }
  };

  const removeMainImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const removeGalleryImage = (index) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() && !form.nameAr.trim()) {
      setError('اسم المنتج مطلوب');
      return;
    }
    if (!form.defaultPrice) {
      setError('السعر مطلوب');
      return;
    }

    const specs = {};
    SPEC_FIELDS.forEach(({ key }) => {
      if (specForm[key]?.trim()) specs[key] = specForm[key].trim();
    });

    try {
      const product = await createMut.mutate({
        name: form.name.trim() || form.nameAr.trim(),
        nameAr: form.nameAr.trim() || undefined,
        defaultPrice: Number(form.defaultPrice),
        currency: form.currency || 'EGP',
        commissionRate: form.commissionRate
          ? Number(form.commissionRate)
          : undefined,
        description: form.description.trim() || undefined,
        longDescription: form.longDescription.trim() || undefined,
        specs: Object.keys(specs).length ? specs : undefined,
        categoryId: form.subCategoryId || form.categoryId || undefined,
        customerId: form.customerId || undefined,
      });

      if (imageFile) {
        try {
          await productsService.uploadImage(product.id, imageFile);
        } catch (e) {
          console.warn(e);
        }
      }
      
      if (galleryFiles.length > 0) {
        try {
          await productsService.uploadGallery(product.id, galleryFiles);
        } catch (e) {
          console.warn(e);
        }
      }
      router.push(`/dashboard/products/${product.id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const categories = categoriesQuery.data || [];
  const customers = customersQuery.data?.data || [];

  const selectedCategory = categories.find(c => c.id === form.categoryId);
  const subCategories = selectedCategory?.children || [];

  return (
    <div dir="rtl" className="pb-20">
      {/* Header section matches design */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 mb-1">
          إضافة/تعديل منتج
        </h1>
        <p className="text-sm font-bold text-gray-400">
          أدخل معلومات المنتج الجديد أو قم بتحديث المنتج الحالي
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-8xl">
        {error && (
          <div className="bg-red-50 text-red-700 px-6 py-4 rounded-[16px] border border-red-100 font-bold text-sm flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* ========== المعلومات الأساسية ========== */}
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-[16px] font-black text-gray-900">
              المعلومات الأساسية
            </h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <Field label="اسم المنتج">
                <input
                  name="nameAr"
                  value={form.nameAr}
                  onChange={handleChange}
                  placeholder="أدخل اسم المنتج"
                  className="field-input"
                />
              </Field>
              <Field label="اسم المنتج (English)">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter Product name"
                  className="field-input"
                  dir="ltr"
                />
              </Field>
            </div>
            <Field label="اختر العميل">
              <div className="relative">
                <select
                  name="customerId"
                  value={form.customerId}
                  onChange={handleChange}
                  className="field-input appearance-none text-gray-600">
                  <option value="">ابحث عن العميل</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </Field>
            <div className="grid grid-cols-2 gap-5">
              <Field label="الفئة الرئيسية">
                <div className="relative">
                  <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value, subCategoryId: '' })}
                    className="field-input appearance-none text-gray-600">
                    <option value="">اختر الفئة</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameAr || c.nameEn}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </Field>
              <Field label="الفئة الفرعية">
                <div className="relative">
                  <select
                    name="subCategoryId"
                    value={form.subCategoryId}
                    onChange={handleChange}
                    disabled={!form.categoryId || subCategories.length === 0}
                    className="field-input appearance-none text-gray-600 disabled:bg-gray-100 disabled:opacity-70 disabled:cursor-not-allowed">
                    <option value="">اختر الفئة الفرعية</option>
                    {subCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameAr || c.nameEn}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </Field>
            </div>
            <Field label="الوصف">
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="اكتب وصف المنتج هنا..."
                className="field-input resize-none"
              />
            </Field>
          </div>
        </div>

        {/* ========== إعداد الأسعار ========== */}
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-[16px] font-black text-gray-900">
              إعداد الأسعار
            </h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <Field label="نسبة العمولة (%)">
                <input
                  name="commissionRate"
                  value={form.commissionRate}
                  onChange={handleChange}
                  placeholder="0"
                  type="number"
                  step="0.1"
                  className="field-input"
                  dir="ltr"
                />
              </Field>
              <Field label="السعر الافتراضي للوحدة">
                <div className="relative flex items-center">
                  <div className="absolute left-1 top-1 bottom-1 flex items-center bg-white border border-gray-200 rounded-[12px] px-2 shadow-sm">
                    <select name="currency" value={form.currency || 'EGP'} onChange={handleChange} className="appearance-none bg-transparent text-xs font-bold text-gray-600 outline-none pr-2 rtl:pl-6 rtl:pr-2 ltr:pl-2 ltr:pr-6 cursor-pointer">
                      <option value="EGP">جنيه مصري</option>
                      <option value="USD">دولار أمريكي</option>
                      <option value="SAR">ريال سعودي</option>
                      <option value="AED">درهم إماراتي</option>
                    </select>
                    <ChevronDown size={14} className="text-gray-400 absolute left-2 pointer-events-none"/>
                  </div>
                  <input
                    name="defaultPrice"
                    value={form.defaultPrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    className="field-input !pl-[115px]"
                    dir="ltr"
                  />
                </div>
              </Field>
            </div>
            <div className="bg-emerald-50 text-emerald-600 px-5 py-3 rounded-[12px] text-xs font-bold w-full">
              مثال: لو السعر {form.defaultPrice || '100'} والعمولة{' '}
              {form.commissionRate || '5'}% — العمولة{' '}
              {(
                (Number(form.defaultPrice || 100) *
                  Number(form.commissionRate || 5)) /
                100
              ).toFixed(2)}
            </div>
          </div>
        </div>

        {/* ========== المواصفات ========== */}
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-[16px] font-black text-gray-900">المواصفات</h2>
          </div>
          <div className="p-6 space-y-8">
            <div className="grid grid-cols-2 gap-5">
              <Field label="المواصفات بالعربية">
                <textarea
                  name="longDescription"
                  value={form.longDescription}
                  onChange={handleChange}
                  rows={4}
                  placeholder="أدخل المواصفات التفصيلية للمنتج..."
                  className="field-input resize-none"
                />
              </Field>
              <Field label="المواصفات بالإنجليزية">
                <textarea
                  placeholder="Enter the product description..."
                  rows={4}
                  className="field-input resize-none"
                  dir="ltr"
                />
              </Field>
            </div>


            <div>
              <h3 className="text-sm font-black text-gray-900 mb-4">
                المواصفات المنظمة
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {SPEC_FIELDS.map(({ key, label }) => (
                  <input
                    key={key}
                    value={specForm[key] || ''}
                    onChange={(e) => handleSpecChange(key, e.target.value)}
                    placeholder={label}
                    className="field-input"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========== المرفقات ========== */}
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-[16px] font-black text-gray-900">المرفقات</h2>
          </div>
          <div className="p-6">
            <p className="text-xs font-bold text-gray-900 mb-3">
              صور المنتج (الصورة الأولى ستكون الرئيسية)
            </p>
            <label className="flex flex-col items-center justify-center w-full h-40 rounded-[20px] border-2 border-dashed border-amber-200 bg-amber-50/30 hover:bg-amber-50 cursor-pointer transition-all mb-4">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="text-center">
                <Upload size={32} className="mx-auto text-[#B08B3A] mb-3" />
                <p className="text-sm font-bold text-[#B08B3A]">
                  اسحب الصور هنا أو اضغط للاختيار
                </p>
                <p className="text-[11px] font-bold text-gray-400 mt-1">
                  JPG, PNG, WEBP (حتى 5 MB للصورة)
                </p>
              </div>
            </label>

            {(imagePreview || galleryPreviews.length > 0) && (
              <div className="flex flex-wrap gap-4 mt-4">
                {imagePreview && (
                  <div className="relative group w-32 h-32 rounded-xl overflow-hidden border border-amber-200">
                    <span className="absolute top-1 right-1 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md z-10">
                      الرئيسية
                    </span>
                    <img src={imagePreview} className="w-full h-full object-cover" alt="Main" />
                    <button
                      type="button"
                      onClick={removeMainImage}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
                      <X size={20} />
                    </button>
                  </div>
                )}
                {galleryPreviews.map((src, i) => (
                  <div key={i} className="relative group w-32 h-32 rounded-xl overflow-hidden border border-gray-200">
                    <img src={src} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(i)}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ========== Submit Buttons ========== */}
        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={createMut.loading}
            className="flex-1 flex items-center justify-center gap-2 bg-[#B08B3A] hover:bg-[#906c27] text-white py-4 rounded-[16px] font-black text-[15px] shadow-lg shadow-amber-500/20 disabled:opacity-60 transition-all">
            {createMut.loading && (
              <Loader2 size={18} className="animate-spin" />
            )}{' '}
            حفظ المنتج
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-4 rounded-[16px] border border-gray-200 text-[#B08B3A] font-black text-[15px] hover:bg-gray-50 transition-colors">
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="block text-[13px] font-black text-gray-900">
        {label}
      </label>
      {children}
    </div>
  );
}
