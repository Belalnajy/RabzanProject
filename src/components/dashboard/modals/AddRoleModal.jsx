'use client';

import React, { useEffect, useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useApi, useMutation } from '@/hooks/useApi';
import { rolesService } from '@/lib/services/roles.service';

export default function AddRoleModal({ isOpen, onClose, onSaved, role }) {
  const isEdit = !!role;
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    description: '',
    permissionIds: [],
  });
  const [error, setError] = useState(null);

  const { data: permissions } = useApi(
    () => rolesService.listPermissions(),
    [isOpen],
    { enabled: isOpen },
  );
  const permList = Array.isArray(permissions) ? permissions : [];

  const { mutate: createRole, loading: creating } = useMutation((data) =>
    rolesService.create(data),
  );
  const { mutate: updateRole, loading: updating } = useMutation((data) =>
    rolesService.update(role?.id, data),
  );
  const saving = creating || updating;

  useEffect(() => {
    if (isOpen) {
      if (role) {
        setFormData({
          name: role.name ?? '',
          nameEn: role.nameEn ?? '',
          description: role.description ?? '',
          permissionIds: (role.permissions || []).map((p) => p.id),
        });
      } else {
        setFormData({ name: '', nameEn: '', description: '', permissionIds: [] });
      }
      setError(null);
    }
  }, [isOpen, role]);

  if (!isOpen) return null;

  const togglePermission = (id) => {
    setFormData((prev) => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(id)
        ? prev.permissionIds.filter((p) => p !== id)
        : [...prev.permissionIds, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        name: formData.name,
        nameEn: formData.nameEn || undefined,
        description: formData.description || undefined,
        permissionIds: formData.permissionIds,
      };
      if (isEdit) await updateRole(payload);
      else await createRole(payload);
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err?.message || 'تعذر حفظ الدور');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#040814]/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-2xl font-black text-[#040814] mb-1">
              {isEdit ? 'تعديل الدور' : 'إضافة دور جديد'}
            </h2>
            <p className="text-sm font-bold text-gray-500">أدخل تفاصيل الدور لتسجيلها في النظام</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors focus:outline-none"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar">
          {error && (
            <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 font-bold text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}
          <form id="add-role-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-black text-[#040814]">اسم الدور</label>
                <input
                  type="text"
                  placeholder="ادخل اسم الدور"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-right"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-black text-[#040814]">الاسم بالإنجليزية</label>
                <input
                  type="text"
                  placeholder="Operations"
                  dir="ltr"
                  value={formData.nameEn}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nameEn: e.target.value }))}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-left"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-black text-[#040814]">وصف الدور</label>
              <textarea
                placeholder="اكتب وصف مختصر للدور..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-right resize-none h-28"
              />
            </div>

            <div className="flex flex-col gap-4 mt-2">
              <label className="text-sm font-black text-[#040814]">الصلاحيات المتاحة</label>
              {permList.length === 0 ? (
                <p className="text-sm text-gray-500 font-bold">لا توجد صلاحيات معرّفة في النظام</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {permList.map((perm) => {
                    const isSelected = formData.permissionIds.includes(perm.id);
                    return (
                      <button
                        key={perm.id}
                        type="button"
                        onClick={() => togglePermission(perm.id)}
                        className={`py-3 px-4 rounded-xl text-sm font-bold text-center transition-all ${
                          isSelected
                            ? 'bg-[#D4AF37] text-white shadow-sm'
                            : 'bg-[#fefce8] text-[#D4AF37] hover:bg-[#fefce8]/80'
                        }`}
                      >
                        {perm.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-4 shrink-0 bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-white border border-[#D4AF37] text-[#D4AF37] hover:bg-gray-50 py-3.5 rounded-xl font-bold transition-colors focus:outline-none"
          >
            إلغاء
          </button>
          <button
            type="submit"
            form="add-role-form"
            disabled={saving}
            className="flex-[2] bg-[#D4AF37] hover:bg-[#B08B3A] text-white py-3.5 rounded-xl font-bold transition-colors shadow-sm focus:outline-none disabled:opacity-60"
          >
            {saving ? 'جاري الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إنشاء دور جديد'}
          </button>
        </div>
      </div>
    </div>
  );
}
