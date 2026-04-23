'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AddRoleModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: []
  });

  if (!isOpen) return null;

  const availablePermissions = [
    'اداره الطلبات',
    'اداره المالية',
    'اداره المنتجات',
    'اداره العملاء',
    'اداره التقارير',
    'إدارة المستخدمين'
  ];

  const handleTogglePermission = (perm) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Send data to API /api/roles
    console.log('Submitting new role:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#040814]/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-2xl font-black text-[#040814] mb-1">إضافة دور جديد</h2>
            <p className="text-sm font-bold text-gray-500">أدخل تفاصيل الدور لتسجيلها في النظام</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors focus:outline-none"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          <form id="add-role-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Role Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-black text-[#040814]">اسم الدور</label>
              <input 
                type="text" 
                placeholder="ادخل اسم الدور"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-right"
                required
              />
            </div>

            {/* Role Description */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-black text-[#040814]">وصف الدور</label>
              <textarea 
                placeholder="اكتب وصف مختصر للدور..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-right resize-none h-28"
                required
              />
            </div>

            {/* Permissions */}
            <div className="flex flex-col gap-4 mt-2">
              <label className="text-sm font-black text-[#040814]">الصلاحيات المتاحه</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {availablePermissions.map((perm, idx) => {
                  const isSelected = formData.permissions.includes(perm);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleTogglePermission(perm)}
                      className={`py-3 px-4 rounded-xl text-sm font-bold text-center transition-all ${
                        isSelected 
                        ? 'bg-[#D4AF37] text-white shadow-sm' 
                        : 'bg-[#fefce8] text-[#D4AF37] hover:bg-[#fefce8]/80'
                      }`}
                    >
                      {perm}
                    </button>
                  );
                })}
              </div>
            </div>

          </form>
        </div>

        {/* Footer Actions */}
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
            className="flex-[2] bg-[#D4AF37] hover:bg-[#B08B3A] text-white py-3.5 rounded-xl font-bold transition-colors shadow-sm focus:outline-none"
          >
            انشاء دور جديد
          </button>
        </div>

      </div>
    </div>
  );
}
