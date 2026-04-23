'use client';

import React, { useState } from 'react';
import Header from '../../../../components/dashboard/Header';
import {
  Plus,
  ChevronDown,
  Edit2,
  Trash2,
  LayoutGrid,
  Shirt,
  Zap,
  MoreHorizontal,
  Image as ImageIcon,
  Upload,
  X,
} from 'lucide-react';

// Mock Data for Categories
const CATEGORIES_DATA = [
  {
    id: 1,
    nameAr: 'المنسوجات الصناعية',
    nameEn: 'Industrial Textiles',
    productCount: 45,
    icon: Shirt,
    iconBg: 'bg-[#E8F0FE]',
    iconColor: 'text-[#1A73E8]',
  },
  {
    id: 2,
    nameAr: 'المعدات الكهربائية',
    nameEn: 'Electrical Equipment',
    productCount: 67,
    icon: Zap,
    iconBg: 'bg-[#FFF4E5]',
    iconColor: 'text-[#FB8C00]',
  },
];

export default function CategoriesPage() {
  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    parent: '',
    image: null,
  });

  const [categories, setCategories] = useState(CATEGORIES_DATA);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openEditModal = (cat) => {
    setSelectedCategory(cat);
    setFormData({
      nameAr: cat.nameAr,
      nameEn: cat.nameEn,
      parent: '', // Mocking parent
      image: null,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (cat) => {
    setSelectedCategory(cat);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Adding Category:', formData);
    // TODO: Connect to API
  };

  return (
    <div dir="rtl" className="pb-10 relative">
      {/* Header */}
      <Header
        title="إدارة الفئات"
        subtitle="إدارة فئات المنتجات والتصنيفات"
        variant="card"
      />

      <div className="mt-8 space-y-8 max-w-[1500px] mx-auto">
        {/* ================= SECTION 1: ADD NEW CATEGORY ================= */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-10 border-b border-gray-50 pb-6">
            <h3 className="text-2xl font-black text-[#040814]">
              إضافة فئة جديدة
            </h3>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-[#B08B3A] hover:bg-[#906c27] text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-amber-500/10 active:scale-95">
              <Plus size={18} strokeWidth={3} />
              إضافة فئة
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Form Inputs */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#040814] pr-1 text-right">
                    الاسم بالعربية
                  </label>
                  <input
                    type="text"
                    name="nameAr"
                    value={formData.nameAr}
                    onChange={handleInputChange}
                    placeholder="مثال: الآلات الصناعية"
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] transition-all outline-none font-bold text-sm"
                  />
                </div>
                <div className="space-y-2" dir="ltr">
                  <label className="block text-sm font-bold text-[#040814] pl-1 text-left">
                    الاسم بالإنجليزية
                  </label>
                  <input
                    type="text"
                    name="nameEn"
                    value={formData.nameEn}
                    onChange={handleInputChange}
                    placeholder="e.g. Industrial Machinery"
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] transition-all outline-none font-bold text-sm text-left"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#040814] pr-1">
                  الفئة الأب (Parent)
                </label>
                <div className="relative">
                  <select
                    name="parent"
                    value={formData.parent}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] transition-all outline-none font-bold text-sm appearance-none cursor-pointer">
                    <option value="">اختر الفئة الأب</option>
                    <option value="1">التصنيفات الكبيرة</option>
                    <option value="2">التصنيفات الفرعية</option>
                  </select>
                  <ChevronDown
                    size={20}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="flex flex-col items-center justify-center space-y-4 pt-2">
              <label className="block text-sm font-bold text-[#040814] w-full text-right pr-2">
                صورة الفئة
              </label>
              <div className="flex items-center gap-6 w-full justify-end">
                <button className="bg-[#B08B3A] hover:bg-[#906c27] text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-md">
                  رفع ملف
                </button>
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-[10px] font-black tracking-widest bg-gray-50 uppercase">
                  PREVIEW
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SECTION 2: CATEGORIES LIST ================= */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-[#040814]">قائمة الفئات</h3>
            <span className="px-4 py-1.5 bg-amber-50 text-[#B08B3A] text-xs font-black rounded-full border border-amber-100 uppercase tracking-widest">
              TOTAL {categories.length + 12}
            </span>
          </div>

          <div className="space-y-4">
            {categories.map((cat) => {
              const CatIcon = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-3xl hover:shadow-md transition-all group">
                  <div className="flex items-center gap-6">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${cat.iconBg} ${cat.iconColor} shadow-inner`}>
                      <CatIcon size={28} />
                    </div>
                    <div>
                      <h4 className="text-[#040814] font-black text-lg leading-tight mb-1">
                        {cat.nameAr}
                      </h4>
                      <p className="text-gray-400 font-bold text-sm">
                        {cat.nameEn}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-12">
                    <div className="px-5 py-2.5 bg-amber-50 rounded-2xl border border-amber-100">
                      <span className="text-[#B08B3A] font-black text-sm">
                        {cat.productCount} منتج
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#B08B3A] hover:text-white transition-all">
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(cat)}
                        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-rose-500 hover:text-white transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= EDIT MODAL ================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-[#040814]/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] w-full max-w-2xl p-10 shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between mb-10">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-[#040814] transition-all">
                <X size={20} />
              </button>
              <div className="text-right">
                <h3 className="text-2xl font-black text-[#040814] mb-2">
                  تعديل
                </h3>
                <p className="text-gray-400 font-bold text-sm">
                  update category details and appearance
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#040814] pr-1">
                    الاسم بالعربية
                  </label>
                  <input
                    type="text"
                    name="nameAr"
                    value={formData.nameAr}
                    onChange={handleInputChange}
                    placeholder="مثال: الآلات الصناعية"
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] transition-all outline-none font-bold text-sm"
                  />
                </div>
                <div className="space-y-2" dir="ltr">
                  <label className="block text-sm font-bold text-[#040814] pl-1 text-left">
                    الاسم بالإنجليزية
                  </label>
                  <input
                    type="text"
                    name="nameEn"
                    value={formData.nameEn}
                    onChange={handleInputChange}
                    placeholder="e.g. Industrial Machinery"
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] transition-all outline-none font-bold text-sm text-left"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#040814] pr-1">
                  الفئة الأب (Parent)
                </label>
                <div className="relative">
                  <select
                    name="parent"
                    value={formData.parent}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] transition-all outline-none font-bold text-sm appearance-none cursor-pointer">
                    <option value="">اختر الفئة الأب</option>
                    <option value="1">التصنيفات الكبيرة</option>
                    <option value="2">التصنيفات الفرعية</option>
                  </select>
                  <ChevronDown
                    size={20}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center justify-center space-y-4 pt-2">
                <label className="block text-sm font-bold text-[#040814] w-full text-right pr-2">
                  صورة الفئة
                </label>
                <div className="flex items-center gap-6 w-full justify-end">
                  <button className="bg-[#B08B3A] hover:bg-[#906c27] text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-md">
                    رفع ملف
                  </button>
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-[10px] font-black tracking-widest bg-gray-50 uppercase">
                    PREVIEW
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-6">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-4 rounded-2xl border border-gray-100 text-gray-400 font-bold hover:bg-gray-50 transition-all">
                  إلغاء
                </button>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-[2] py-4 rounded-2xl bg-[#B08B3A] text-white font-black hover:bg-[#906c27] transition-all shadow-xl shadow-amber-500/20">
                  حفظ التغييرات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE MODAL ================= */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-[#040814]/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 mx-auto mb-6">
              <Trash2 size={40} />
            </div>
            <h3 className="text-2xl font-black text-[#040814] mb-3">
              حذف هذه الفئة
            </h3>
            <p className="text-gray-400 font-bold text-[15px] mb-10 leading-relaxed">
              هل انت متأكد من حذف هذه الفئة؟
              <br />
              <span className="text-rose-500 text-xs mt-1 block">
                سيؤدي هذا إلى فك ارتباط المنتجات المرتبطة بها
              </span>
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-full py-4 rounded-2xl bg-rose-600 text-white font-black hover:bg-rose-700 transition-all shadow-xl shadow-rose-500/20">
                تأكيد الحذف
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-full py-4 rounded-2xl border border-gray-100 text-gray-400 font-bold hover:bg-gray-50 transition-all">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
