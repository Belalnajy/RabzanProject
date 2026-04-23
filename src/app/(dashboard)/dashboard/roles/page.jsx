'use client';

import React, { useState } from 'react';
import Header from '../../../../components/dashboard/Header';
import { Plus, Shield, Edit2, CheckSquare } from 'lucide-react';
import AddRoleModal from '../../../../components/dashboard/modals/AddRoleModal';

// ==========================================
// MOCK DATA (API Ready)
// ==========================================
// TODO: Fetch roles and permissions from API (e.g. GET /api/roles)
const MOCK_ROLES = [
  { 
    id: 1, 
    title: 'عمليات', 
    titleEn: 'Transaction', 
    perms: ['اداره الطلبات', 'إدارة المستخدمين', 'اداره المنتجات', 'اداره التقارير', 'اداره العملاء'] 
  },
  { 
    id: 2, 
    title: 'مسؤول', 
    titleEn: 'Super Admin', 
    perms: ['اداره الطلبات', 'اداره المالية', 'اداره المنتجات', 'اداره التقارير', 'اداره العملاء', 'إدارة المستخدمين'] 
  },
  { 
    id: 3, 
    title: 'محاسب', 
    titleEn: 'Accountant', 
    perms: ['اداره المالية', 'اداره العملاء', 'اداره التقارير'] 
  }
];

const PERMISSIONS_OVERVIEW = [
  { 
    category: 'الطلبات', 
    items: ['عرض الطلبات', 'إنشاء طلب جديد', 'تعديل الطلبات', 'إغلاق الطلبات'] 
  },
  { 
    category: 'المالية', 
    items: ['عرض المعاملات', 'إضافة دفعة', 'تعديل المعاملات'] 
  },
  { 
    category: 'المنتجات', 
    items: ['عرض المنتجات', 'إنشاء منتج', 'تعديل المنتجات'] 
  },
  { 
    category: 'العملاء', 
    items: ['عرض العملاء', 'إنشاء عميل', 'تعديل العملاء'] 
  },
  { 
    category: 'التقارير', 
    items: ['عرض التقارير'] 
  },
  { 
    category: 'إدارة المستخدمين', 
    items: ['إدارة المستخدمين'] 
  }
];

export default function RolesPage() {
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);

  return (
    <>
      <Header title="" subtitle="" variant="transparent" />

      {/* Page Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 mt-[-1rem]">
        <div>
          <h1 className="text-2xl font-black text-[#040814] mb-1">الادوار والصلاحيات</h1>
          <p className="text-sm font-bold text-gray-500">إدارة صلاحيات الوصول لمستخدمي النظام</p>
        </div>
        <button 
          onClick={() => setIsAddRoleModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#B08B3A] text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-sm focus:outline-none"
        >
          <Plus size={18} strokeWidth={2.5} />
          إنشاء دور جديد
        </button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {MOCK_ROLES.map((role) => (
          <div key={role.id} className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-8 transition-shadow hover:shadow-md relative">
            
            {/* Edit Button */}
            <button className="absolute top-8 left-8 text-gray-400 hover:text-[#040814] transition-colors focus:outline-none">
              <Edit2 size={20} />
            </button>

            {/* Role Header */}
            <div className="flex flex-col items-center justify-center mb-8 mt-2">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 text-[#040814]">
                <Shield size={32} strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-black text-[#040814]">{role.title}</h2>
              <span className="text-sm font-bold text-gray-400 mt-1" dir="ltr">{role.titleEn}</span>
            </div>

            {/* Permissions List */}
            <div>
              <h3 className="text-sm font-black text-[#040814] mb-4">الصلاحيات المتقدمة:</h3>
              <div className="flex flex-wrap gap-3">
                {role.perms.map((perm, idx) => (
                  <span 
                    key={idx} 
                    className="bg-[#fefce8] text-[#D4AF37] px-4 py-2 rounded-xl text-[13px] font-bold"
                  >
                    {perm}
                  </span>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Permissions Overview */}
      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden mb-12">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-black text-[#040814]">نظرة عامة على الصلاحيات</h2>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PERMISSIONS_OVERVIEW.map((group, idx) => (
              <div key={idx} className="border border-gray-100 rounded-2xl p-6">
                <h3 className="text-lg font-black text-[#040814] mb-4 text-center pb-4 border-b border-gray-50">
                  {group.category}
                </h3>
                <ul className="flex flex-col gap-4 mt-4">
                  {group.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-center justify-between">
                      <span className="text-[13px] font-bold text-[#040814]">{item}</span>
                      <CheckSquare size={18} className="text-emerald-500" strokeWidth={2.5} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Role Modal */}
      <AddRoleModal 
        isOpen={isAddRoleModalOpen} 
        onClose={() => setIsAddRoleModalOpen(false)} 
      />
    </>
  );
}
