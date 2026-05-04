'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '@/components/dashboard/Header';
import { Edit2, UserX } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { LoadingState, ErrorState, EmptyState } from '@/components/dashboard/DataStates';
import { usersService } from '@/lib/services/users.service';

function formatDate(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString('en-GB', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

export default function UserDetailsPage() {
  const params = useParams();
  const userId = params.id;

  const { data: user, loading, error, refetch } = useApi(
    () => usersService.getById(userId),
    [userId],
  );

  if (loading) return <LoadingState message="جاري تحميل بيانات المستخدم..." />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (!user) return <EmptyState icon={UserX} title="المستخدم غير موجود" />;

  const isActive = user.status === 'active';
  const roleName = user.role?.name ?? '—';

  return (
    <>
      <Header title="" subtitle="" variant="transparent" />

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 mt-[-1rem]">
        <div>
          <h1 className="text-2xl font-black text-[#040814] mb-1">تفاصيل المستخدم</h1>
          <p className="text-sm font-bold text-gray-500">عرض معلومات وصلاحيات المستخدم</p>
        </div>
        <Link
          href={`/dashboard/users/${userId}/edit`}
          className="flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#B08B3A] text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-sm focus:outline-none"
        >
          <Edit2 size={16} strokeWidth={2.5} />
          تعديل
        </Link>
      </div>

      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-8 mb-8">
        <h2 className="text-xl font-black text-[#040814] mb-8">معلومات المستخدم</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
          <Row label="الاسم الكامل" value={user.fullName} />
          <Row label="البريد الإلكتروني" value={user.email} ltr />
          <Row label="رقم الهاتف" value={user.phone || '—'} ltr />
          <Row label="آخر تسجيل دخول" value={formatDate(user.lastLoginAt)} ltr />
          <Row label="تاريخ الإنشاء" value={formatDate(user.createdAt)} ltr />
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-500">الدور</span>
            <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-amber-100/60 text-amber-700">{roleName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-500">الحالة</span>
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${isActive ? 'bg-emerald-100/60 text-emerald-600' : 'bg-gray-200 text-gray-500'}`}>
              {isActive ? 'نشط' : 'غير نشط'}
            </span>
          </div>
        </div>
      </div>

      {Array.isArray(user.role?.permissions) && user.role.permissions.length > 0 && (
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-8 mb-12">
          <h2 className="text-xl font-black text-[#040814] mb-6">الصلاحيات</h2>
          <div className="flex flex-wrap gap-2">
            {user.role.permissions.map((p) => (
              <span key={p.id} className="px-4 py-2 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100">
                {p.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function Row({ label, value, ltr }) {
  return (
    <div className="flex justify-between items-center border-b border-gray-50 pb-4">
      <span className="text-sm font-bold text-gray-500">{label}</span>
      <span className="text-sm font-black text-[#040814]" dir={ltr ? 'ltr' : undefined}>{value}</span>
    </div>
  );
}
