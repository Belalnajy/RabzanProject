'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/dashboard/Header';
import { Save, ChevronDown, AlertCircle } from 'lucide-react';
import { useApi, useMutation } from '@/hooks/useApi';
import { usersService } from '@/lib/services/users.service';
import { rolesService } from '@/lib/services/roles.service';

export default function AddUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    roleId: '',
  });
  const [formError, setFormError] = useState(null);

  const { data: rolesData, loading: rolesLoading } = useApi(() => rolesService.list(), []);
  const roles = Array.isArray(rolesData) ? rolesData : [];

  const { mutate: createUser, loading: saving } = useMutation((data) => usersService.create(data));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (formData.password !== formData.confirmPassword) {
      setFormError('كلمتا المرور غير متطابقتين');
      return;
    }

    try {
      await createUser({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
        password: formData.password,
        roleId: formData.roleId,
      });
      router.push('/dashboard/users');
    } catch (err) {
      setFormError(err?.message || 'تعذر حفظ المستخدم');
    }
  };

  return (
    <>
      <Header title="" subtitle="" variant="transparent" />

      <form onSubmit={handleSubmit} className="flex flex-col mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 mt-[-1rem]">
          <div>
            <h1 className="text-2xl font-black text-[#040814] mb-1">إضافة مستخدم جديد</h1>
            <p className="text-sm font-bold text-gray-500">إنشاء حساب مستخدم جديد للنظام</p>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#B08B3A] text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-sm focus:outline-none disabled:opacity-60"
          >
            <Save size={18} strokeWidth={2.5} />
            {saving ? 'جاري الحفظ...' : 'حفظ المستخدم'}
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
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#040814]">
                الاسم الكامل <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="أحمد محمد علي"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-right"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#040814]">
                البريد الإلكتروني <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="ahmed@company.com"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-left"
                dir="ltr"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#040814]">رقم الهاتف</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="0100 123 4567"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-left"
                dir="ltr"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#040814]">
                الدور <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="roleId"
                  value={formData.roleId}
                  onChange={handleInputChange}
                  required
                  className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none cursor-pointer focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                >
                  <option value="">{rolesLoading ? 'جاري التحميل...' : 'اختر الدور'}</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#040814]">
                كلمة المرور <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                minLength={8}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-left"
                dir="ltr"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#040814]">
                تأكيد كلمة المرور <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                minLength={8}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-left"
                dir="ltr"
                required
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
