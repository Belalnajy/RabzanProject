'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/dashboard/Header';
import { LoadingState, ErrorState, EmptyState } from '@/components/dashboard/DataStates';
import { useApi, useMutation } from '@/hooks/useApi';
import { usersService } from '@/lib/services/users.service';
import { rolesService } from '@/lib/services/roles.service';
import {
  Plus, ChevronDown, Calendar, Eye,
  MoreHorizontal, ChevronLeft, ChevronRight,
  Edit2, Trash2, Lock, Users as UsersIcon
} from 'lucide-react';

const ROLE_COLORS = {
  'مسؤول': 'text-rose-500',
  'super_admin': 'text-rose-500',
  'عمليات': 'text-blue-500',
  'operations': 'text-blue-500',
  'محاسب': 'text-purple-500',
  'محاسبة': 'text-purple-500',
  'accountant': 'text-purple-500',
};

function formatDate(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

function formatDateOnly(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString('en-GB');
  } catch {
    return '—';
  }
}

export default function UsersPage() {
  const [filters, setFilters] = useState({ role: '', status: '', date: '' });
  const [page, setPage] = useState(1);
  const limit = 10;
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const { data: rolesData } = useApi(() => rolesService.list(), []);
  const roles = Array.isArray(rolesData) ? rolesData : [];

  const fetchUsers = useMemo(
    () => () =>
      usersService.list({
        ...filters,
        page,
        limit,
      }),
    [filters, page],
  );

  const { data, loading, error, refetch } = useApi(fetchUsers, [fetchUsers]);
  const { mutate: deleteUser } = useMutation((id) => usersService.remove(id));
  const { mutate: resetPwd } = useMutation((id) => usersService.resetPassword(id));

  const users = data?.data ?? [];
  const pagination = data?.pagination ?? { currentPage: 1, totalPages: 1, totalItems: 0 };

  const updateFilter = (key, value) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleDelete = async (user) => {
    if (!confirm(`هل أنت متأكد من تعطيل المستخدم "${user.fullName}"؟`)) return;
    try {
      await deleteUser(user.id);
      setFeedback({ type: 'success', text: 'تم تعطيل المستخدم بنجاح' });
      refetch();
    } catch (err) {
      setFeedback({ type: 'error', text: err?.message || 'تعذر تعطيل المستخدم' });
    } finally {
      setOpenDropdownId(null);
    }
  };

  const handleResetPassword = async (user) => {
    if (!confirm(`إعادة تعيين كلمة المرور للمستخدم "${user.fullName}"؟`)) return;
    try {
      const res = await resetPwd(user.id);
      setFeedback({
        type: 'success',
        text: `كلمة المرور الجديدة: ${res?.newPassword || ''}`,
      });
    } catch (err) {
      setFeedback({ type: 'error', text: err?.message || 'تعذر إعادة تعيين كلمة المرور' });
    } finally {
      setOpenDropdownId(null);
    }
  };

  const toggleDropdown = (id) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <Header title="" subtitle="" variant="transparent" />

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 mt-[-1rem]">
        <div>
          <h1 className="text-2xl font-black text-[#040814] mb-1">إدارة المستخدمين والصلاحيات</h1>
          <p className="text-sm font-bold text-gray-500">إدارة مستخدمي النظام وصلاحياتهم</p>
        </div>
        <Link
          href="/dashboard/users/new"
          className="flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#B08B3A] text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-sm focus:outline-none"
        >
          <Plus size={18} strokeWidth={2.5} />
          إضافة مستخدم
        </Link>
      </div>

      {feedback && (
        <div
          className={`mb-6 px-4 py-3 rounded-xl text-sm font-bold border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
              : 'bg-rose-50 text-rose-700 border-rose-100'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <span>{feedback.text}</span>
            <button onClick={() => setFeedback(null)} className="text-xs">إغلاق</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-black text-[#D4AF37] px-1">الدور</label>
            <div className="relative">
              <select
                value={filters.role}
                onChange={(e) => updateFilter('role', e.target.value)}
                className="w-full appearance-none bg-gray-50/80 border border-gray-100 rounded-xl px-4 py-3 pr-10 text-sm font-bold text-[#040814] outline-none cursor-pointer focus:ring-2 focus:ring-amber-500/20 transition-all"
              >
                <option value="">جميع الأدوار</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-black text-[#D4AF37] px-1">الحالة</label>
            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) => updateFilter('status', e.target.value)}
                className="w-full appearance-none bg-gray-50/80 border border-gray-100 rounded-xl px-4 py-3 pr-10 text-sm font-bold text-[#040814] outline-none cursor-pointer focus:ring-2 focus:ring-amber-500/20 transition-all"
              >
                <option value="">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-black text-[#D4AF37] px-1">تاريخ الإنشاء</label>
            <div className="relative">
              <input
                type="date"
                value={filters.date}
                onChange={(e) => updateFilter('date', e.target.value)}
                className="w-full bg-gray-50/80 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#040814] outline-none cursor-pointer focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingState message="جاري تحميل المستخدمين..." />
      ) : error ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : users.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title="لا يوجد مستخدمون"
          description="لم يتم العثور على مستخدمين مطابقين للفلاتر المحددة"
        />
      ) : (
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm flex flex-col mb-12">
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-right border-separate border-spacing-y-3">
              <thead>
                <tr>
                  <th className="pb-2 text-[13px] text-[#D4AF37] font-black whitespace-nowrap px-4">رقم المستخدم</th>
                  <th className="pb-2 text-[13px] text-[#D4AF37] font-black whitespace-nowrap px-4">الاسم الكامل</th>
                  <th className="pb-2 text-[13px] text-[#D4AF37] font-black whitespace-nowrap px-4">البريد الإلكتروني</th>
                  <th className="pb-2 text-[13px] text-[#D4AF37] font-black whitespace-nowrap px-4">الدور</th>
                  <th className="pb-2 text-[13px] text-[#D4AF37] font-black whitespace-nowrap px-4">الحالة</th>
                  <th className="pb-2 text-[13px] text-[#D4AF37] font-black whitespace-nowrap px-4">آخر تسجيل دخول</th>
                  <th className="pb-2 text-[13px] text-[#D4AF37] font-black whitespace-nowrap px-4">تاريخ الإنشاء</th>
                  <th className="pb-2 text-[13px] text-[#D4AF37] font-black whitespace-nowrap px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const roleName = user.role?.name ?? '—';
                  const roleColor = ROLE_COLORS[user.role?.nameEn] || ROLE_COLORS[roleName] || 'text-[#040814]';
                  const isActive = user.status === 'active';
                  const shortId = `#${(user.id || '').slice(0, 8).toUpperCase()}`;
                  return (
                    <tr key={user.id} className="bg-white border border-gray-100 shadow-xs rounded-[16px] hover:shadow-md transition-all group">
                      <td className="py-4 px-4 text-[13px] font-bold text-gray-600 rounded-r-[16px] border-t border-b border-r border-gray-100 group-hover:border-gray-200" dir="ltr">{shortId}</td>
                      <td className="py-4 px-4 text-[13px] font-bold text-[#040814] border-t border-b border-gray-100 group-hover:border-gray-200">{user.fullName}</td>
                      <td className="py-4 px-4 text-[12px] font-bold text-gray-500 border-t border-b border-gray-100 group-hover:border-gray-200 max-w-[200px] break-words leading-tight" dir="ltr">{user.email}</td>
                      <td className={`py-4 px-4 text-[13px] font-bold border-t border-b border-gray-100 group-hover:border-gray-200 ${roleColor}`}>{roleName}</td>
                      <td className="py-4 px-4 border-t border-b border-gray-100 group-hover:border-gray-200">
                        <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold inline-block whitespace-nowrap ${isActive ? 'bg-emerald-100/60 text-emerald-600' : 'bg-gray-200 text-gray-500'}`}>
                          {isActive ? 'نشط' : 'غير نشط'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-[12px] font-bold text-[#040814] border-t border-b border-gray-100 group-hover:border-gray-200 whitespace-nowrap" dir="ltr">{formatDate(user.lastLoginAt)}</td>
                      <td className="py-4 px-4 text-[12px] font-bold text-[#040814] border-t border-b border-gray-100 group-hover:border-gray-200 whitespace-nowrap" dir="ltr">{formatDateOnly(user.createdAt)}</td>
                      <td className="py-4 px-4 border-t border-b border-l border-gray-100 rounded-l-[16px] group-hover:border-gray-200">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/dashboard/users/${user.id}`}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-[#040814] transition-colors focus:outline-none"
                          >
                            <Eye size={16} strokeWidth={2.5} />
                          </Link>
                          <div className="relative">
                            <button
                              onClick={() => toggleDropdown(user.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-[#040814] transition-colors focus:outline-none"
                            >
                              <MoreHorizontal size={16} strokeWidth={2.5} />
                            </button>

                            {openDropdownId === user.id && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setOpenDropdownId(null)} />
                                <div className="absolute left-0 top-full mt-2 w-56 bg-white border border-gray-100 shadow-xl rounded-xl py-2 z-50 flex flex-col">
                                  <Link
                                    href={`/dashboard/users/${user.id}/edit`}
                                    onClick={() => setOpenDropdownId(null)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-gray-600 hover:bg-gray-50 hover:text-[#040814] w-full text-right transition-colors"
                                  >
                                    <Edit2 size={16} />
                                    تعديل المستخدم
                                  </Link>
                                  <button
                                    onClick={() => handleResetPassword(user)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-gray-600 hover:bg-gray-50 hover:text-[#040814] w-full text-right transition-colors"
                                  >
                                    <Lock size={16} />
                                    إعادة تعيين كلمة المرور
                                  </button>
                                  <div className="h-px w-full bg-gray-50 my-1" />
                                  <button
                                    onClick={() => handleDelete(user)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-rose-500 hover:bg-rose-50 w-full text-right transition-colors"
                                  >
                                    <Trash2 size={16} />
                                    تعطيل المستخدم
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 p-6 border-t border-gray-50">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors focus:outline-none disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
              <span className="text-sm font-bold text-[#040814] px-2" dir="ltr">
                {page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#040814] text-white hover:bg-gray-800 transition-colors focus:outline-none disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
