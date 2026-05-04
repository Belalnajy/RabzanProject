'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/dashboard/Header';
import { Save, ChevronDown, AlertCircle } from 'lucide-react';
import { useApi, useMutation } from '@/hooks/useApi';
import { LoadingState, ErrorState } from '@/components/dashboard/DataStates';
import { usersService } from '@/lib/services/users.service';
import { rolesService } from '@/lib/services/roles.service';

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id;

  const { data: user, loading, error, refetch } = useApi(
    () => usersService.getById(userId),
    [userId],
  );
  const { data: rolesData } = useApi(() => rolesService.list(), []);
  const roles = Array.isArray(rolesData) ? rolesData : [];

  const { mutate: updateUser, loading: saving } = useMutation((data) =>
    usersService.update(userId, data),
  );

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    roleId: '',
  });
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        password: '',
        confirmPassword: '',
        roleId: user.roleId ?? user.role?.id ?? '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (formData.password && formData.password !== formData.confirmPassword) {
      setFormError('كلمتا المرور غير متطابقتين');
      return;
    }

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone || undefined,
      roleId: formData.roleId,
    };
    if (formData.password) payload.password = formData.password;

    try {
      await updateUser(payload);
      router.push(`/dashboard/users/${userId}`);
    } catch (err) {
      setFormError(err?.message || 'تعذر حفظ التغييرات');
    }
  };

  if (loading) return <LoadingState message="جاري تحميل المستخدم..." />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <>
      <Header title="" subtitle="" variant="transparent" />

      <form onSubmit={handleSubmit} className="flex flex-col mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 mt-[-1rem]">
          <div>
            <h1 className="text-2xl font-black text-[#040814] mb-1">تعديل المستخدم</h1>
            <p className="text-sm font-bold text-gray-500">تعديل معلومات المستخدم</p>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#B08B3A] text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-sm focus:outline-none disabled:opacity-60"
          >
            <Save size={18} strokeWidth={2.5} />
            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
        </div>

        {formError && (
          <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 font-bold text-sm">
            <AlertCircle size={18} />
            {formError}
          </div>
        )}

        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-8 mb-8">
          <h2 className="text-xl font-black text-[#040814] mb-8">المعلومات الأساسية</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="الاسم الكامل" required>
              <input
                type="text" name="fullName" value={formData.fullName}
                onChange={handleInputChange} required
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-right"
              />
            </Field>
            <Field label="البريد الإلكتروني" required>
              <input
                type="email" name="email" value={formData.email}
                onChange={handleInputChange} required dir="ltr"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-left"
              />
            </Field>
            <Field label="رقم الهاتف">
              <input
                type="tel" name="phone" value={formData.phone}
                onChange={handleInputChange} dir="ltr"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-left"
              />
            </Field>
            <Field label="الدور" required>
              <div className="relative">
                <select
                  name="roleId" value={formData.roleId} onChange={handleInputChange} required
                  className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none cursor-pointer focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                >
                  <option value="">اختر الدور</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
            </Field>
            <Field label="كلمة المرور الجديدة (اختياري)">
              <input
                type="password" name="password" value={formData.password}
                onChange={handleInputChange} placeholder="••••••••" dir="ltr" minLength={8}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-left"
              />
            </Field>
            <Field label="تأكيد كلمة المرور">
              <input
                type="password" name="confirmPassword" value={formData.confirmPassword}
                onChange={handleInputChange} placeholder="••••••••" dir="ltr" minLength={8}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-left"
              />
            </Field>
          </div>
        </div>
      </form>
    </>
  );
}

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-[#040814]">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}
