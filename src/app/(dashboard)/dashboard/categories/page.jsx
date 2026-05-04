'use client';

import React, { useState } from 'react';
import Header from '@/components/dashboard/Header';
import { LoadingState, ErrorState, EmptyState } from '@/components/dashboard/DataStates';
import {
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  X,
  Loader2,
  Layers,
  AlertCircle,
  Upload,
  ChevronUp,
} from 'lucide-react';
import { useApi, useMutation } from '@/hooks/useApi';
import { categoriesService } from '@/lib/services/categories.service';

const EMPTY_FORM = { nameAr: '', nameEn: '', parentId: '' };

function CategoryForm({ value, onChange, parentOptions = [], formId }) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#040814] pr-1 text-right">الاسم بالعربية *</label>
            <input
              type="text" name="nameAr" form={formId} required
              value={value.nameAr}
              onChange={(e) => onChange({ ...value, nameAr: e.target.value })}
              placeholder="مثال: الآلات الصناعية"
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] transition-all outline-none font-bold text-sm"
            />
          </div>
          <div className="space-y-2" dir="ltr">
            <label className="block text-sm font-bold text-[#040814] pl-1 text-left">الاسم بالإنجليزية</label>
            <input
              type="text" name="nameEn" form={formId}
              value={value.nameEn}
              onChange={(e) => onChange({ ...value, nameEn: e.target.value })}
              placeholder="e.g. Industrial Machinery"
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] transition-all outline-none font-bold text-sm text-left"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#040814] pr-1">الفئة الأب</label>
          <div className="relative">
            <select
              name="parentId" form={formId}
              value={value.parentId}
              onChange={(e) => onChange({ ...value, parentId: e.target.value })}
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] transition-all outline-none font-bold text-sm appearance-none cursor-pointer">
              <option value="">بدون فئة أب</option>
              {parentOptions.map((p) => (
                <option key={p.id} value={p.id}>{p.nameAr}</option>
              ))}
            </select>
            <ChevronDown size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-bold text-[#040814] pr-1 text-right">صورة الفئة</label>
        <label className="flex flex-col items-center justify-center w-full h-[180px] rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onChange({ ...value, imageFile: file, imagePreview: URL.createObjectURL(file) });
              }
            }}
            className="hidden"
          />
          {value.imagePreview ? (
            <img
              src={value.imagePreview}
              alt="معاينة"
              className="h-full object-contain rounded-xl p-2"
            />
          ) : (
            <div className="text-center">
              <Upload size={32} className="mx-auto text-gray-400 mb-3" />
              <p className="text-sm font-bold text-gray-500">
                اسحب الصورة هنا أو اضغط للاختيار
              </p>
              <p className="text-[11px] font-bold text-gray-400 mt-1">
                JPG, PNG, WEBP (حتى 5 MB)
              </p>
            </div>
          )}
        </label>
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const { data, loading, error, refetch } = useApi(() => categoriesService.list(), []);
  const createMut = useMutation((payload) => categoriesService.create(payload));
  const updateMut = useMutation(({ id, ...payload }) => categoriesService.update(id, payload));
  const deleteMut = useMutation((id) => categoriesService.remove(id));

  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [deleting, setDeleting] = useState(null);
  const [formError, setFormError] = useState('');
  const [expandedCats, setExpandedCats] = useState({});

  const toggleExpand = (id) => {
    setExpandedCats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = data || [];
  const parentOptions = categories.filter((c) => !editing || c.id !== editing.id);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.nameAr.trim()) {
      setFormError('اسم التصنيف بالعربية مطلوب');
      return;
    }
    try {
      const created = await createMut.mutate({
        nameAr: form.nameAr.trim(),
        nameEn: form.nameEn.trim() || undefined,
        parentId: form.parentId || undefined,
      });

      if (form.imageFile) {
        try {
          await categoriesService.uploadImage(created.id, form.imageFile);
        } catch (imgErr) {
          console.warn('Failed to upload category image', imgErr);
        }
      }

      setForm(EMPTY_FORM);
      refetch();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const openEdit = (cat) => {
    setEditing(cat);
    const imageUrl = cat.image ? (cat.image.startsWith('http') ? cat.image : `http://localhost:3001${cat.image}`) : '';
    setEditForm({ nameAr: cat.nameAr, nameEn: cat.nameEn || '', parentId: cat.parentId || '', imagePreview: imageUrl, imageFile: null });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editForm.nameAr.trim()) return;
    try {
      await updateMut.mutate({
        id: editing.id,
        nameAr: editForm.nameAr.trim(),
        nameEn: editForm.nameEn.trim() || undefined,
        parentId: editForm.parentId || undefined,
      });

      if (editForm.imageFile) {
        try {
          await categoriesService.uploadImage(editing.id, editForm.imageFile);
        } catch (imgErr) {
          console.warn('Failed to upload category image', imgErr);
        }
      }

      setEditing(null);
      refetch();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMut.mutate(deleting.id);
      setDeleting(null);
      refetch();
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <div dir="rtl" className="pb-10 relative">
      <Header title="إدارة الفئات" subtitle="إدارة فئات المنتجات والتصنيفات" variant="card" />

      <div className="mt-8 space-y-8 max-w-[1500px] mx-auto">
        {/* Add new */}
        <form id="create-cat-form" onSubmit={handleCreate} className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-10 border-b border-gray-50 pb-6">
            <h3 className="text-2xl font-black text-[#040814]">إضافة فئة جديدة</h3>
            <button
              type="submit" disabled={createMut.loading}
              className="flex items-center gap-2 bg-[#B08B3A] hover:bg-[#906c27] text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-amber-500/10 active:scale-95 disabled:opacity-60">
              {createMut.loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} strokeWidth={3} />}
              إضافة فئة
            </button>
          </div>

          {formError && (
            <div className="mb-6 flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-bold">
              <AlertCircle size={18} />
              {formError}
            </div>
          )}

          <CategoryForm value={form} onChange={setForm} parentOptions={categories} formId="create-cat-form" />
        </form>

        {/* List */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-[#040814]">قائمة الفئات</h3>
            <span className="px-4 py-1.5 bg-amber-50 text-[#B08B3A] text-xs font-black rounded-full border border-amber-100 uppercase tracking-widest">
              TOTAL {categories.length}
            </span>
          </div>

          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState error={error} onRetry={refetch} />
          ) : categories.length === 0 ? (
            <EmptyState
              title="لا توجد تصنيفات"
              description="ابدأ بإضافة تصنيف جديد لتنظيم منتجاتك"
              icon={Layers}
            />
          ) : (
            <div className="space-y-4">
              {categories.map((cat) => (
                <React.Fragment key={cat.id}>
                  <div className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-3xl hover:shadow-md transition-all group">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-amber-50 text-[#B08B3A] shadow-inner overflow-hidden">
                        {cat.image ? (
                          <img src={cat.image.startsWith('http') ? cat.image : `http://localhost:3001${cat.image}`} alt={cat.nameAr} className="w-full h-full object-cover" />
                        ) : (
                          <Layers size={28} />
                        )}
                      </div>
                      <div>
                        <h4 className="text-[#040814] font-black text-lg leading-tight mb-1">{cat.nameAr}</h4>
                        <p className="text-gray-400 font-bold text-sm">{cat.nameEn || '—'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-12">
                      <div className="px-5 py-2.5 bg-amber-50 rounded-2xl border border-amber-100">
                        <span className="text-[#B08B3A] font-black text-sm">{cat.productCount ?? 0} منتج</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {cat.children && cat.children.length > 0 && (
                          <button
                            onClick={() => toggleExpand(cat.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all border ${expandedCats[cat.id] ? 'bg-[#B08B3A] text-white border-[#B08B3A]' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'}`}>
                            {expandedCats[cat.id] ? (
                              <>
                                إخفاء الفئات
                                <ChevronUp size={16} />
                              </>
                            ) : (
                              <>
                                عرض {cat.children.length} فئات فرعية
                                <ChevronDown size={16} />
                              </>
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => openEdit(cat)}
                          className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#B08B3A] hover:text-white transition-all">
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => setDeleting(cat)}
                          className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-rose-500 hover:text-white transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Subcategories */}
                  {cat.children && cat.children.length > 0 && expandedCats[cat.id] && (
                    <div className="pr-12 space-y-3 mt-3 mb-5 border-r-2 border-amber-100 mr-6">
                      {cat.children.map(child => (
                        <div key={child.id} className="flex items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-2xl hover:bg-white hover:shadow-sm transition-all group">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-gray-100 text-gray-400 overflow-hidden">
                              {child.image ? (
                                <img src={child.image.startsWith('http') ? child.image : `http://localhost:3001${child.image}`} alt={child.nameAr} className="w-full h-full object-cover" />
                              ) : (
                                <Layers size={20} />
                              )}
                            </div>
                            <div>
                              <h4 className="text-[#040814] font-bold text-md leading-tight mb-0.5">{child.nameAr}</h4>
                              <p className="text-gray-400 font-bold text-xs">{child.nameEn || '—'}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-8">
                            <div className="px-4 py-1.5 bg-white rounded-xl border border-gray-100">
                              <span className="text-gray-500 font-bold text-xs">{child.productCount ?? 0} منتج</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEdit(child)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#B08B3A] hover:text-white transition-all">
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => setDeleting(child)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-rose-500 hover:text-white transition-all">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-[#040814]/60 backdrop-blur-sm z-100 flex items-center justify-center p-6">
          <form id="edit-cat-form" onSubmit={handleUpdate} className="bg-white rounded-[40px] w-full max-w-2xl p-10 shadow-2xl relative">
            <div className="flex items-start justify-between mb-10">
              <button type="button" onClick={() => setEditing(null)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-[#040814] transition-all">
                <X size={20} />
              </button>
              <div className="text-right">
                <h3 className="text-2xl font-black text-[#040814] mb-2">تعديل التصنيف</h3>
                <p className="text-gray-400 font-bold text-sm">{editing.nameAr}</p>
              </div>
            </div>

            <CategoryForm value={editForm} onChange={setEditForm} parentOptions={parentOptions} formId="edit-cat-form" />

            <div className="flex items-center gap-4 pt-8 mt-8 border-t border-gray-50">
              <button type="button" onClick={() => setEditing(null)} className="flex-1 py-4 rounded-2xl border border-gray-100 text-gray-400 font-bold hover:bg-gray-50 transition-all">
                إلغاء
              </button>
              <button type="submit" disabled={updateMut.loading} className="flex-[2] py-4 rounded-2xl bg-[#B08B3A] text-white font-black hover:bg-[#906c27] transition-all shadow-xl shadow-amber-500/20 disabled:opacity-60 flex items-center justify-center gap-2">
                {updateMut.loading && <Loader2 size={18} className="animate-spin" />}
                حفظ التغييرات
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete modal */}
      {deleting && (
        <div className="fixed inset-0 bg-[#040814]/60 backdrop-blur-sm z-100 flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] w-full max-w-md p-10 shadow-2xl text-center">
            <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 mx-auto mb-6">
              <Trash2 size={40} />
            </div>
            <h3 className="text-2xl font-black text-[#040814] mb-3">حذف تصنيف</h3>
            <p className="text-gray-400 font-bold text-[15px] mb-2">
              هل أنت متأكد من حذف <span className="text-[#040814]">{deleting.nameAr}</span>؟
            </p>
            <p className="text-rose-500 text-xs mb-8">سيؤدي هذا إلى فك ارتباط المنتجات المرتبطة بها</p>

            {deleteMut.error && (
              <p className="text-rose-600 text-sm font-bold mb-4">{deleteMut.error.message}</p>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={handleDelete} disabled={deleteMut.loading}
                className="w-full py-4 rounded-2xl bg-rose-600 text-white font-black hover:bg-rose-700 transition-all shadow-xl shadow-rose-500/20 disabled:opacity-60 flex items-center justify-center gap-2">
                {deleteMut.loading && <Loader2 size={18} className="animate-spin" />}
                تأكيد الحذف
              </button>
              <button onClick={() => setDeleting(null)} className="w-full py-4 rounded-2xl border border-gray-100 text-gray-400 font-bold hover:bg-gray-50 transition-all">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
