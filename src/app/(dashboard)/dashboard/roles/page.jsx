'use client';

import React, { useMemo, useState } from 'react';
import Header from '@/components/dashboard/Header';
import { Plus, Shield, Edit2, Trash2, CheckSquare, Users as UsersIcon, ShieldCheck } from 'lucide-react';
import AddRoleModal from '../../../../components/dashboard/modals/AddRoleModal';
import { useApi, useMutation } from '@/hooks/useApi';
import { LoadingState, ErrorState, EmptyState } from '@/components/dashboard/DataStates';
import { rolesService } from '@/lib/services/roles.service';

export default function RolesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const { data: rolesData, loading, error, refetch } = useApi(() => rolesService.list(), []);
  const { data: permsData } = useApi(() => rolesService.listPermissions(), []);
  const { mutate: deleteRole } = useMutation((id) => rolesService.remove(id));

  const roles = Array.isArray(rolesData) ? rolesData : [];
  const allPermissions = useMemo(() => (Array.isArray(permsData) ? permsData : []), [permsData]);

  const openCreate = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const openEdit = (role) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const handleDelete = async (role) => {
    if (!confirm(`هل أنت متأكد من حذف الدور "${role.name}"؟`)) return;
    try {
      await deleteRole(role.id);
      setFeedback({ type: 'success', text: 'تم حذف الدور بنجاح' });
      refetch();
    } catch (err) {
      setFeedback({ type: 'error', text: err?.message || 'تعذر حذف الدور' });
    }
  };

  return (
    <>
      <Header title="" subtitle="" variant="transparent" />

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 mt-[-1rem]">
        <div>
          <h1 className="text-2xl font-black text-[#040814] mb-1">الأدوار والصلاحيات</h1>
          <p className="text-sm font-bold text-gray-500">إدارة صلاحيات الوصول لمستخدمي النظام</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#B08B3A] text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-sm focus:outline-none"
        >
          <Plus size={18} strokeWidth={2.5} />
          إنشاء دور جديد
        </button>
      </div>

      {feedback && (
        <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-bold border ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
          <div className="flex items-start justify-between gap-4">
            <span>{feedback.text}</span>
            <button onClick={() => setFeedback(null)} className="text-xs">إغلاق</button>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingState message="جاري تحميل الأدوار..." />
      ) : error ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : roles.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="لا توجد أدوار"
          description="ابدأ بإنشاء دور جديد وتعيين صلاحياته"
          action={(
            <button onClick={openCreate} className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#B08B3A] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors">
              <Plus size={16} /> إنشاء دور جديد
            </button>
          )}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {roles.map((role) => (
            <div key={role.id} className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-8 transition-shadow hover:shadow-md relative">
              <div className="absolute top-6 left-6 flex items-center gap-1">
                <button
                  onClick={() => openEdit(role)}
                  className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-[#040814] hover:bg-gray-50 transition-colors focus:outline-none"
                  title="تعديل"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(role)}
                  className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors focus:outline-none"
                  title="حذف"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex flex-col items-center justify-center mb-6 mt-2">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 text-[#040814]">
                  <Shield size={32} strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-black text-[#040814]">{role.name}</h2>
                {role.nameEn && (
                  <span className="text-sm font-bold text-gray-400 mt-1" dir="ltr">{role.nameEn}</span>
                )}
                <div className="flex items-center gap-2 mt-3 text-xs font-bold text-gray-500">
                  <UsersIcon size={14} />
                  <span dir="ltr">{role.userCount ?? 0} مستخدم</span>
                </div>
              </div>

              {role.description && (
                <p className="text-sm font-bold text-gray-500 text-center mb-6">{role.description}</p>
              )}

              <div>
                <h3 className="text-sm font-black text-[#040814] mb-4">الصلاحيات الممنوحة:</h3>
                {(role.permissions || []).length === 0 ? (
                  <p className="text-sm text-gray-400 font-bold">لا توجد صلاحيات معينة</p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {role.permissions.map((perm) => (
                      <span key={perm.id} className="bg-[#fefce8] text-[#D4AF37] px-4 py-2 rounded-xl text-[13px] font-bold">
                        {perm.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {allPermissions.length > 0 && (
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden mb-12">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-xl font-black text-[#040814]">نظرة عامة على الصلاحيات</h2>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allPermissions.map((perm) => (
                <div key={perm.id} className="border border-gray-100 rounded-2xl p-5 flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-black text-[#040814] mb-1">{perm.name}</h3>
                    {perm.description && (
                      <p className="text-xs font-bold text-gray-500 leading-relaxed">{perm.description}</p>
                    )}
                    <span className="inline-block mt-2 text-[11px] font-bold text-gray-400" dir="ltr">{perm.key}</span>
                  </div>
                  <CheckSquare size={18} className="text-emerald-500 flex-shrink-0" strokeWidth={2.5} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <AddRoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={() => {
          setFeedback({ type: 'success', text: editingRole ? 'تم تحديث الدور' : 'تم إنشاء الدور' });
          refetch();
        }}
        role={editingRole}
      />
    </>
  );
}
