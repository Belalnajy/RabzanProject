'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/dashboard/Header';
import {
  Package,
  FileEdit,
  Archive,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Upload,
  Link as LinkIcon,
  Plus,
  Trash2,
  Zap,
  Eye,
  Download,
  FileText,
  MapPin,
  ChevronDown,
  X,
} from 'lucide-react';
import { useApi, useMutation } from '@/hooks/useApi';
import { productsService } from '@/lib/services/products.service';
import { categoriesService } from '@/lib/services/categories.service';
import { customersService } from '@/lib/services/customers.service';
import { ordersService } from '@/lib/services/orders.service';

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

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const productQuery = useApi(() => productsService.getById(id), [id]);
  const categoriesQuery = useApi(() => categoriesService.list(), []);
  const customersQuery = useApi(
    () => customersService.list({ limit: 100 }),
    [],
  );
  const relatedOrdersQuery = useApi(
    () => ordersService.list({ product: id }),
    [id],
  );
  const updateMut = useMutation((dto) => productsService.update(id, dto));

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [specForm, setSpecForm] = useState({});
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedImg, setSelectedImg] = useState(0);

  const product = productQuery.data;
  const categories = categoriesQuery.data || [];
  const customers = customersQuery.data?.data || [];

  const startEditing = () => {
    if (!product) return;
    let initialParentId = '';
    let initialSubId = '';
    if (product.categoryId) {
      const isTopLevel = categories.find((c) => c.id === product.categoryId);
      if (isTopLevel) {
        initialParentId = product.categoryId;
      } else {
        const parent = categories.find((c) =>
          c.children?.some((child) => child.id === product.categoryId),
        );
        if (parent) {
          initialParentId = parent.id;
          initialSubId = product.categoryId;
        } else {
          initialParentId = product.categoryId;
        }
      }
    }

    setForm({
      name: product.name || '',
      nameAr: product.nameAr || '',
      defaultPrice: product.defaultPrice || '',
      currency: product.currency || 'EGP',
      commissionRate: product.commissionRate || '',
      description: product.description || '',
      longDescription: product.longDescription || '',
      categoryId: initialParentId,
      subCategoryId: initialSubId,
      customerId: product.customerId || '',
    });
    const sf = {};
    SPEC_FIELDS.forEach(({ key }) => {
      sf[key] = product.specs?.[key] || '';
    });
    setSpecForm(sf);

    const initialImages = [];
    if (product.image) {
      initialImages.push({
        id: 'main',
        url: product.image,
        file: null,
        isMain: true,
      });
    }
    if (product.gallery && product.gallery.length > 0) {
      product.gallery.forEach((g, i) => {
        initialImages.push({
          id: `gal-${i}`,
          url: g,
          file: null,
          isMain: false,
        });
      });
    }
    setImages(initialImages);

    setEditing(true);
    setError('');
    setSuccess('');
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSpecChange = (key, val) =>
    setSpecForm({ ...specForm, [key]: val });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newImages = files.map((f, i) => ({
      id: `new-${Date.now()}-${i}`,
      url: URL.createObjectURL(f),
      file: f,
      isMain: false,
      isNew: true,
    }));

    setImages((prev) => {
      const combined = [...prev, ...newImages];
      if (!combined.some((img) => img.isMain) && combined.length > 0) {
        combined[0].isMain = true;
      }
      return combined;
    });
  };

  const removeImage = (id) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      if (prev.find((img) => img.id === id)?.isMain && filtered.length > 0) {
        filtered[0].isMain = true;
      }
      return filtered;
    });
  };

  const setMainImage = (id) => {
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        isMain: img.id === id,
      })),
    );
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
      let existingMain = null;
      let existingGallery = [];
      let newMainFile = null;
      let newGalleryFiles = [];

      images.forEach((img) => {
        if (img.isMain) {
          if (img.file) newMainFile = img.file;
          else existingMain = img.url;
        } else {
          if (img.file) newGalleryFiles.push(img.file);
          else existingGallery.push(img.url);
        }
      });

      await updateMut.mutate({
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
        image: existingMain || '',
        gallery: existingGallery,
      });

      if (newMainFile) {
        try {
          await productsService.uploadImage(id, newMainFile);
        } catch (e) {
          console.warn(e);
        }
      }

      if (newGalleryFiles.length > 0) {
        try {
          await productsService.uploadGallery(id, newGalleryFiles);
        } catch (e) {
          console.warn(e);
        }
      }
      await productQuery.refetch();
      setSuccess('تم التعديل بنجاح');
      setEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (productQuery.loading)
    return (
      <div className="flex items-center justify-center py-40">
        <Loader2 size={40} className="animate-spin text-[#B08B3A]" />
      </div>
    );
  if (!product)
    return (
      <div className="text-center py-40 text-gray-400 font-bold">
        المنتج غير موجود
      </div>
    );

  const allImages = [product.image, ...(product.gallery || [])].filter(Boolean);

  const selectedCategory = form
    ? categories.find((c) => c.id === form.categoryId)
    : null;
  const subCategories = selectedCategory?.children || [];

  // ============= EDIT MODE =============
  if (editing) {
    return (
      <div dir="rtl" className="pb-20">
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
                      onChange={(e) =>
                        setForm({
                          ...form,
                          categoryId: e.target.value,
                          subCategoryId: '',
                        })
                      }
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
                    <div className="absolute left-[-20px] top-1 bottom-1 flex items-center bg-white border border-gray-200 rounded-[12px] px-2 shadow-sm">
                      <select
                        name="currency"
                        value={form.currency || 'EGP'}
                        onChange={handleChange}
                        className="appearance-none bg-transparent text-xs font-bold text-gray-600 outline-none pr-2 rtl:pl-6 rtl:pr-2 ltr:pl-2 ltr:pr-6 cursor-pointer">
                        <option value="EGP">جنيه مصري</option>
                        <option value="USD">دولار أمريكي</option>
                        <option value="SAR">ريال سعودي</option>
                        <option value="AED">درهم إماراتي</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="text-gray-400 absolute left-2 pointer-events-none"
                      />
                    </div>
                    <input
                      name="defaultPrice"
                      value={form.defaultPrice}
                      onChange={handleChange}
                      placeholder="0.00"
                      type="number"
                      step="0.01"
                      className="field-input !pl-28"
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
              <h2 className="text-[16px] font-black text-gray-900">
                المواصفات
              </h2>
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
                صور المنتج (سيتم دمج الصور الجديدة مع الصور الحالية)
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

              {images.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-4 p-4 border border-gray-100 rounded-[20px] bg-gray-50">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className={`relative group w-32 h-32 rounded-xl overflow-hidden shadow-sm transition-all ${img.isMain ? 'border-2 border-amber-500' : 'border border-gray-200 hover:border-amber-300'}`}>
                      <span
                        className={`absolute top-1 right-1 text-white text-[10px] font-bold px-2 py-0.5 rounded-md z-10 ${img.isMain ? 'bg-amber-500' : 'bg-gray-800'}`}>
                        {img.isMain ? 'الرئيسية' : img.isNew ? 'جديد' : 'حالية'}
                      </span>
                      <img
                        src={
                          img.url.startsWith('http') ||
                          img.url.startsWith('blob')
                            ? img.url
                            : `http://localhost:3001${img.url}`
                        }
                        className="w-full h-full object-cover"
                        alt="Image"
                      />

                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        {!img.isMain && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setMainImage(img.id);
                            }}
                            className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors">
                            تعيين كرئيسية
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            removeImage(img.id);
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg transition-colors">
                          <X size={16} />
                        </button>
                      </div>
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
              disabled={updateMut.loading}
              className="flex-1 flex items-center justify-center gap-2 bg-[#B08B3A] hover:bg-[#906c27] text-white py-4 rounded-[16px] font-black text-[15px] shadow-lg shadow-amber-500/20 disabled:opacity-60 transition-all">
              {updateMut.loading && (
                <Loader2 size={18} className="animate-spin" />
              )}{' '}
              حفظ التغييرات
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="flex-1 py-4 rounded-[16px] border border-gray-200 text-[#B08B3A] font-black text-[15px] hover:bg-gray-50 transition-colors">
              إلغاء
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ============= VIEW MODE =============
  return (
    <div dir="rtl" className="pb-20">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-start mb-8">
        <div className="text-right">
          <h1 className="text-2xl font-black text-gray-900">تفاصيل المنتج</h1>
          <p className="text-sm font-medium text-gray-400 mt-1 uppercase">
            {product.displayId}
          </p>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-6 py-4 rounded-2xl border border-emerald-100 mb-6 max-w-5xl mx-auto">
          <CheckCircle2 size={18} />{' '}
          <span className="font-bold text-sm">{success}</span>
        </div>
      )}

      <div className="max-w-full mx-auto space-y-6">
        {/* ===== 1. نظرة عامة ===== */}
        <div className="bg-white rounded-[24px] p-12 shadow-sm border border-gray-100 relative">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-[13px] font-bold text-gray-900 pb-2 border-b border-gray-100 inline-block">
              نظرة عامة على المنتج
            </h2>
            <button
              onClick={startEditing}
              className="flex items-center gap-2 bg-[#B08B3A] text-white px-6 py-2 rounded-full font-bold text-[13px] hover:bg-[#906c27] transition-all shadow-md shadow-[#B08B3A]/20">
              <FileEdit size={14} /> تعديل
            </button>
          </div>
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Info Side (Right in RTL) */}
            <div className="lg:w-3/5 relative">
              <h3 className="text-[28px] font-black text-gray-900 mb-3">
                {product.nameAr || product.name}
              </h3>

              {product.customer && (
                <div className="flex items-center gap-2 text-sm text-[#B08B3A] mb-8">
                  <MapPin size={16} />
                  <span className="font-bold">{product.customer.fullName}</span>
                </div>
              )}

              {/* Stats Grid */}
              <div className="flex gap-12 mt-8">
                <div>
                  <div className="text-xs font-bold text-gray-400 mb-2">
                    الفئة
                  </div>
                  <div className="text-sm font-black text-gray-800">
                    {product.category?.nameAr ||
                      product.category?.nameEn ||
                      '—'}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 mb-2">
                    السعر الافتراضي
                  </div>
                  <div className="text-sm font-black text-gray-800">
                    {product.defaultPrice} EGP
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 mb-2">
                    نسبة العمولة
                  </div>
                  <div className="text-sm font-black text-gray-800">
                    {product.commissionRate || 0}%
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 mb-2">
                    الحالة
                  </div>
                  <div
                    className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-black ${product.status === 'active' ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-100 text-gray-500'}`}>
                    {product.status === 'active' ? 'نشط' : 'مؤرشف'}
                  </div>
                </div>
              </div>
            </div>

            {/* Images Side (Left in RTL) */}
            <div className="lg:w-3/5 flex flex-col items-center">
              <div className="w-full flex flex-col items-center">
                <div className="rounded-[16px] overflow-hidden border border-gray-100 bg-gray-50 h-[400px] mb-3 w-full max-w-[400px]">
                  {allImages.length > 0 ? (
                    <img
                      src={allImages[selectedImg] || allImages[0]}
                      alt={product.nameAr || product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Package size={40} />
                    </div>
                  )}
                </div>
                {allImages.length > 1 && (
                  <div className="flex gap-3 justify-center w-full max-w-[400px]">
                    {allImages.map((src, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImg(i)}
                        className={`flex-1 h-32 rounded-[12px] overflow-hidden transition-all ${selectedImg === i ? 'ring-2 ring-[#B08B3A] ring-offset-2' : 'opacity-70 hover:opacity-100'}`}>
                        <img
                          src={src}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ===== 2. سجل تغييرات السعر ===== */}
        <div>
          <h2 className="text-[13px] font-bold text-gray-900 mb-3 px-2">
            سجل تغييرات السعر
          </h2>
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-[13px]">
              <thead className="bg-white border-b border-gray-100">
                <tr className="text-[#B08B3A]">
                  <th className="text-right font-black py-4 px-6 w-1/3">
                    السعر السابق
                  </th>
                  <th className="text-right font-black py-4 px-6 w-1/3">
                    تاريخ التعديل
                  </th>
                  <th className="text-right font-black py-4 px-6 w-1/3">
                    تم التعديل بواسطة
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-50 text-gray-800">
                  <td className="py-4 px-6 font-bold">
                    {product.defaultPrice} EGP
                  </td>
                  <td className="py-4 px-6 font-bold" dir="ltr">
                    {new Date(product.updatedAt)
                      .toISOString()
                      .replace('T', ' ')
                      .substring(0, 16)}
                  </td>
                  <td className="py-4 px-6 font-bold">أحمد محمد</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== 3. الطلبات المرتبطة ===== */}
        <div>
          <h2 className="text-[13px] font-bold text-gray-900 mb-3 px-2">
            الطلبات المرتبطة
          </h2>
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-[13px]">
              <thead className="bg-white border-b border-gray-100">
                <tr className="text-[#B08B3A]">
                  <th className="text-right font-black py-4 px-6">رقم الطلب</th>
                  <th className="text-right font-black py-4 px-6">العميل</th>
                  <th className="text-right font-black py-4 px-6">الكمية</th>
                  <th className="text-right font-black py-4 px-6">
                    المبلغ الإجمالي
                  </th>
                  <th className="text-right font-black py-4 px-6">الحالة</th>
                  <th className="text-right font-black py-4 px-6">التاريخ</th>
                  <th className="text-right font-black py-4 px-6">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {relatedOrdersQuery.loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="py-8 text-center text-gray-400 font-bold text-[13px]">
                      جاري تحميل الطلبات...
                    </td>
                  </tr>
                ) : relatedOrdersQuery.data?.data?.length > 0 ? (
                  relatedOrdersQuery.data.data.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-gray-900 font-bold">
                        {order.displayId}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {order.customer?.companyName || 'عميل غير معروف'}
                      </td>
                      <td className="py-4 px-6 text-gray-900 font-bold">
                        {order.quantity || 1}
                      </td>
                      <td
                        className="py-4 px-6 text-[#B08B3A] font-bold"
                        dir="ltr">
                        {Number(order.totalPrice || 0).toLocaleString()}{' '}
                        {order.currency || 'EGP'}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-[12px] text-xs font-bold ${
                            order.currentStage === 'مغلق' ||
                            order.currentStage === 'ملغي'
                              ? 'bg-gray-200 text-gray-600'
                              : order.currentStage === 'التعميد' ||
                                  order.currentStage === 'انتظار الدفع'
                                ? 'bg-amber-100 text-amber-600'
                                : 'bg-green-100 text-green-600'
                          }`}>
                          {order.currentStage || 'مكتمل'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('en-GB')}
                      </td>
                      <td className="py-4 px-6">
                        <Link
                          href={`/dashboard/orders/${order.id}`}
                          className="inline-flex items-center justify-center bg-[#B08B3A] text-white px-5 py-1.5 rounded-full text-[11px] font-bold hover:bg-[#906c27] transition-all shadow-sm">
                          عرض الطلب
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="py-8 text-center text-gray-400 font-bold text-[13px]">
                      لا توجد طلبات مرتبطة بهذا المنتج حتى الآن
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== 4. مواصفات المنتج ===== */}
        <div>
          <h2 className="text-[13px] font-bold text-gray-900 mb-3 px-2">
            مواصفات المنتج
          </h2>
          <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100 space-y-8">
            {/* وصف المنتج */}
            <div>
              <h3 className="text-[13px] font-black text-gray-900 mb-3">
                وصف المنتج
              </h3>
              <p className="text-gray-700 font-bold text-[13px] leading-relaxed border border-gray-200 rounded-[16px] p-5">
                {product.longDescription ||
                  product.description ||
                  'لا يوجد وصف متاح.'}
              </p>
            </div>

            {/* المواصفات الفنية */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div>
                <h3 className="text-[13px] font-black text-gray-900 mb-4">
                  المواصفات الفنية
                </h3>
                <div className="flex flex-wrap gap-x-16 gap-y-6">
                  {Object.entries(product.specs).map(([key, val]) => {
                    const sf = SPEC_FIELDS.find((s) => s.key === key);
                    return (
                      <div key={key} className="flex flex-col items-center">
                        <div className="text-[12px] font-bold text-gray-400 mb-2">
                          {sf?.label || key}
                        </div>
                        <div className="text-[13px] font-black text-gray-800">
                          {val}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* المرفقات */}
            <div>
              <h3 className="text-[13px] font-black text-gray-900 mb-4">
                المرفقات
              </h3>
              <div className="border border-gray-100 rounded-[16px] p-5 w-48 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-amber-500 rounded-[12px] flex items-center justify-center text-white mb-3 shadow-md shadow-amber-500/20">
                  <span className="font-black text-xs">PDF</span>
                </div>
                <div className="font-black text-[13px] text-gray-900 mb-4">
                  كتيب المواصفات
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
                    <Download size={14} />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
                    <Eye size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
