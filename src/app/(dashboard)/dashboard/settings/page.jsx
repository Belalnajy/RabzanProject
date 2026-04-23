'use client';

import React, { useState } from 'react';
import Header from '../../../../components/dashboard/Header';
import { 
  Save, Image as ImageIcon, Plus, AlertCircle, Edit2, ChevronDown 
} from 'lucide-react';

// ==========================================
// MOCK DATA (API Ready)
// ==========================================
const TABS = [
  { id: 'general', label: 'الإعدادات العامة' },
  { id: 'workflow', label: 'سير العمل' },
  { id: 'financial', label: 'مالي' },
  { id: 'currency', label: 'عملة' },
  { id: 'preferences', label: 'تفضيلات النظام' },
];

const WORKFLOW_STAGES = [
  { id: 1, title: 'استلام الطلب', mandatory: true, needsConfirm: false },
  { id: 2, title: 'مراجعة الطلب', mandatory: true, needsConfirm: true },
  { id: 3, title: 'الموافقة', mandatory: true, needsConfirm: false },
  { id: 4, title: 'التنفيذ', mandatory: true, needsConfirm: false },
  { id: 5, title: 'التسليم', mandatory: true, needsConfirm: false },
];

const ACTIVE_CURRENCIES = [
  { id: 'SAR', name: 'ريال سعودي', code: 'SAR', rate: '1.00 (مرجع)', isDefault: true, lastUpdate: '15 مايو 2023, 09:00 ص' },
  { id: 'USD', name: 'دولار أمريكي', code: 'USD', rate: '3.75', isDefault: false, lastUpdate: '5 مايو 2023, 10:30 ص' },
  { id: 'AED', name: 'درهم إماراتي', code: 'AED', rate: '1.02', isDefault: false, lastUpdate: '14 مايو 2023, 08:45 ص' },
  { id: 'EUR', name: 'يورو', code: 'EUR', rate: '4.05', isDefault: false, lastUpdate: '15 مايو 2023, 09:00 ص' },
];

// Helper Toggle Component
const ToggleSwitch = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`w-12 h-6 rounded-full p-1 flex items-center transition-colors focus:outline-none ${
      checked ? 'bg-emerald-500 justify-end' : 'bg-gray-600 justify-start'
    }`}
  >
    <div className="w-4 h-4 bg-white rounded-full shadow-md" />
  </button>
);

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  // Form States (TODO: Bind to API fetch/update)
  const [generalState, setGeneralState] = useState({
    systemName: 'نظام إدارة العمولات',
    companyName: 'شركة النموذجية',
    lang: 'العربية',
    timezone: 'توقيت السعودية (GMT+3)',
    dateFormat: 'يوم/شهر/سنة (DD/MM/YYYY)',
  });

  const [workflowStages, setWorkflowStages] = useState(WORKFLOW_STAGES);

  const [financialState, setFinancialState] = useState({
    defaultCommission: '10',
    allowOverride: true,
    creditLimit: false,
    paymentTerms: '30 يوم',
    delayAlertLimit: '30 يوم'
  });

  const [preferencesState, setPreferencesState] = useState({
    darkMode: false,
    autoLogout: '30 دقيقة',
    auditLog: true
  });

  const handleSave = (e) => {
    e.preventDefault();
    // TODO: Send data to API PUT /api/settings
    console.log(`Saving ${activeTab} settings...`);
  };

  const renderFooter = () => (
    <div className="mt-8">
      <p className="text-xs font-bold text-gray-400 text-center mb-6">آخر تعديل بواسطة: أحمد محمد - 15 مايو 2023، 10:30 ص</p>
      <div className="flex gap-4">
        <button 
          type="button"
          className="flex-[1] bg-white border border-[#D4AF37] text-[#D4AF37] py-3.5 rounded-xl font-bold transition-colors hover:bg-gray-50 focus:outline-none"
        >
          إلغاء
        </button>
        <button 
          type="submit"
          className="flex-[2] bg-[#D4AF37] hover:bg-[#B08B3A] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm focus:outline-none"
        >
          <Save size={18} strokeWidth={2.5} />
          حفظ المتغيرات
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Header title="" subtitle="" variant="transparent" />

      {/* Main Layout Container */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12 mt-[-1rem]">
        
        {/* Right Sidebar (Tabs) */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white border border-gray-100 rounded-3xl p-4 flex flex-col gap-2 shadow-sm sticky top-6">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 rounded-2xl text-base font-black text-right transition-all focus:outline-none ${
                  activeTab === tab.id 
                  ? 'bg-[#D4AF37] text-white shadow-md' 
                  : 'bg-transparent text-[#040814] hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          
          {/* 1. GENERAL SETTINGS */}
          {activeTab === 'general' && (
            <form onSubmit={handleSave} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col">
              <div className="mb-8 border-b border-gray-50 pb-6">
                <h1 className="text-2xl font-black text-[#040814] mb-1">إعدادات النظام</h1>
                <p className="text-sm font-bold text-gray-500">إدارة وضبط سلوك النظام العام</p>
              </div>

              <div className="flex flex-col gap-6 max-w-2xl">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-black text-[#040814]">
                    اسم النظام <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={generalState.systemName}
                    onChange={(e) => setGeneralState(prev => ({...prev, systemName: e.target.value}))}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-right"
                    required
                  />
                  <span className="text-[11px] font-bold text-gray-400">هذا هو الاسم الذي سيظهر في جميع أنحاء النظام</span>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-black text-[#040814]">
                    اسم الشركة <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={generalState.companyName}
                    onChange={(e) => setGeneralState(prev => ({...prev, companyName: e.target.value}))}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-right"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-black text-[#040814]">شعار الشركة</label>
                  <div className="flex items-center gap-4 border border-gray-100 p-4 rounded-2xl bg-gray-50/50">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
                      <ImageIcon size={24} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <button type="button" className="bg-[#D4AF37] text-white px-6 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-[#B08B3A] transition-colors focus:outline-none">
                        رفع شعار
                      </button>
                      <span className="text-[11px] font-bold text-gray-400" dir="ltr">PNG, JPG 2 MB حتى</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-black text-[#040814]">اللغة الافتراضية</label>
                  <div className="relative">
                    <select 
                      value={generalState.lang}
                      onChange={(e) => setGeneralState(prev => ({...prev, lang: e.target.value}))}
                      className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-gray-600 outline-none cursor-pointer focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    >
                      <option>العربية</option>
                      <option>English</option>
                    </select>
                    <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-black text-[#040814]">المنطقة الزمنية الافتراضية</label>
                  <div className="relative">
                    <select 
                      value={generalState.timezone}
                      onChange={(e) => setGeneralState(prev => ({...prev, timezone: e.target.value}))}
                      className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-gray-600 outline-none cursor-pointer focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    >
                      <option>توقيت السعودية (GMT+3)</option>
                    </select>
                    <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-black text-[#040814]">تنسيق التاريخ الافتراضي</label>
                  <div className="relative">
                    <select 
                      value={generalState.dateFormat}
                      onChange={(e) => setGeneralState(prev => ({...prev, dateFormat: e.target.value}))}
                      className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-gray-600 outline-none cursor-pointer focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    >
                      <option>يوم/شهر/سنة (DD/MM/YYYY)</option>
                    </select>
                    <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

              </div>
              
              {renderFooter()}
            </form>
          )}

          {/* 2. WORKFLOW SETTINGS */}
          {activeTab === 'workflow' && (
            <form onSubmit={handleSave} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-gray-50 gap-4">
                <div>
                  <h1 className="text-2xl font-black text-[#040814] mb-1">إعدادات النظام</h1>
                  <p className="text-sm font-bold text-gray-500">إدارة سير العمل</p>
                </div>
                <button type="button" className="flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#B08B3A] text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-sm focus:outline-none">
                  <Plus size={16} strokeWidth={2.5} />
                  إضافة مرحلة جديدة
                </button>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-xl font-black text-[#040814]">إدارة سير العمل</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {workflowStages.map(stage => (
                  <div key={stage.id} className="border border-gray-100 rounded-2xl p-6 relative bg-white shadow-sm hover:shadow-md transition-shadow">
                    <button type="button" className="absolute top-4 left-4 text-gray-400 hover:text-[#040814] focus:outline-none transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <h3 className="text-lg font-black text-[#040814] mb-6">{stage.title}</h3>
                    
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-500">إلزامي</span>
                        <ToggleSwitch 
                          checked={stage.mandatory} 
                          onChange={() => setWorkflowStages(prev => prev.map(s => s.id === stage.id ? {...s, mandatory: !s.mandatory} : s))} 
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-500">هل تحتاج تأكيد خاص؟</span>
                        <ToggleSwitch 
                          checked={stage.needsConfirm} 
                          onChange={() => setWorkflowStages(prev => prev.map(s => s.id === stage.id ? {...s, needsConfirm: !s.needsConfirm} : s))} 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#fefce8] border border-[#fef08a] rounded-xl p-4 flex gap-3 items-start mb-6">
                <AlertCircle className="text-amber-500 shrink-0" size={20} />
                <p className="text-xs font-bold text-amber-700">ملاحظة هامة: أي تغيير في سير العمل سيؤثر على جميع الطلبات الحالية والمستقبلية، يرجى التوخي بالحذر عند تعديل المراحل.</p>
              </div>

              {renderFooter()}
            </form>
          )}

          {/* 3. FINANCIAL SETTINGS */}
          {activeTab === 'financial' && (
            <form onSubmit={handleSave} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col">
              <div className="mb-8 border-b border-gray-50 pb-6">
                <h1 className="text-2xl font-black text-[#040814] mb-1">إعدادات النظام</h1>
                <p className="text-sm font-bold text-gray-500">الإعدادات المالية</p>
              </div>

              <div className="flex flex-col gap-6 max-w-2xl">
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-black text-[#040814]">نسبة العمولة الافتراضية (%)</label>
                  <input 
                    type="number" 
                    value={financialState.defaultCommission}
                    onChange={(e) => setFinancialState(prev => ({...prev, defaultCommission: e.target.value}))}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-left"
                    dir="ltr"
                  />
                  <span className="text-[11px] font-bold text-gray-400">النسبة المئوية للعمولة التي سيتم تطبيقها على جميع الطلبات الجديدة</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-black text-[#040814]">السماح بتجاوز العمولة يدوياً</span>
                    <span className="text-[11px] font-bold text-gray-400">السماح للموظفين المصرح لهم بتعديل نسب العمولة لكل طلب على حدة</span>
                  </div>
                  <ToggleSwitch 
                    checked={financialState.allowOverride} 
                    onChange={() => setFinancialState(prev => ({...prev, allowOverride: !prev.allowOverride}))} 
                  />
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-black text-[#040814]">تفعيل حد الائتمان</span>
                    <span className="text-[11px] font-bold text-gray-400">تقييد الطلبات بناءً على حد الائتمان المحدد للعملاء</span>
                  </div>
                  <ToggleSwitch 
                    checked={financialState.creditLimit} 
                    onChange={() => setFinancialState(prev => ({...prev, creditLimit: !prev.creditLimit}))} 
                  />
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <label className="text-sm font-black text-[#040814]">شروط الدفع الافتراضية</label>
                  <input 
                    type="text" 
                    value={financialState.paymentTerms}
                    onChange={(e) => setFinancialState(prev => ({...prev, paymentTerms: e.target.value}))}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-right"
                  />
                  <span className="text-[11px] font-bold text-gray-400">المدة الافتراضية لسداد الفواتير، ويتم تطبيقها تلقائياً على الطلبات الجديدة.</span>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-black text-[#040814]">حد التنبيه للتأخير</label>
                  <input 
                    type="text" 
                    value={financialState.delayAlertLimit}
                    onChange={(e) => setFinancialState(prev => ({...prev, delayAlertLimit: e.target.value}))}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-right"
                  />
                  <span className="text-[11px] font-bold text-gray-400">تحديد عدد الأيام بعد تاريخ الاستحقاق التي يتم بعدها اعتبار الفاتورة متأخرة وإظهار تنبيه في النظام.</span>
                </div>

              </div>
              
              {renderFooter()}
            </form>
          )}

          {/* 4. CURRENCY SETTINGS */}
          {activeTab === 'currency' && (
            <form onSubmit={handleSave} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-gray-50 gap-4">
                <div>
                  <h1 className="text-2xl font-black text-[#040814] mb-1">إعدادات النظام</h1>
                  <p className="text-sm font-bold text-gray-500">الإعدادات المالية</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h2 className="text-xl font-black text-[#040814]">إعدادات العملة وأسعار الصرف</h2>
                <button type="button" className="flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#B08B3A] text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-sm focus:outline-none self-start md:self-auto">
                  <Plus size={16} strokeWidth={2.5} />
                  إضافة عملة جديدة
                </button>
              </div>

              <div className="flex flex-col gap-2 max-w-2xl mb-10">
                <label className="text-sm font-black text-[#040814]">العملة الافتراضية</label>
                <div className="relative">
                  <select 
                    className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-gray-600 outline-none cursor-pointer focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  >
                    <option>ريال سعودي (SAR)</option>
                  </select>
                  <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
                <span className="text-[11px] font-bold text-gray-400">العملة التي سيتم استخدامها في التقارير المالية</span>
              </div>

              <h3 className="text-base font-black text-[#040814] mb-4">العملات النشطة</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {ACTIVE_CURRENCIES.map(currency => (
                  <div key={currency.id} className="border border-gray-100 rounded-2xl p-5 relative bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    {currency.isDefault && (
                      <span className="absolute top-4 left-4 text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">افتراضي</span>
                    )}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex flex-col">
                        <span className="text-base font-black text-[#040814]">{currency.name}</span>
                        <span className="text-[10px] font-bold text-gray-400" dir="ltr">{currency.code}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 mb-6">
                      <span className="text-xs font-bold text-[#040814]">سعر الصرف: <span dir="ltr">{currency.rate}</span></span>
                      <span className="text-[9px] font-bold text-gray-400">آخر تحديث: {currency.lastUpdate}</span>
                    </div>
                    <button type="button" className="w-full bg-[#D4AF37] hover:bg-[#B08B3A] text-white py-2.5 rounded-xl text-sm font-bold transition-colors focus:outline-none">
                      تحديث السعر
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-[#fefce8] border border-[#fef08a] rounded-xl p-4 flex gap-3 items-start mb-6">
                <AlertCircle className="text-amber-500 shrink-0" size={20} />
                <p className="text-xs font-bold text-amber-700">ملاحظة: لا يمكن حذف العملات المستخدمة في الطلبات النشطة. يتم تحديث أسعار الصرف يدوياً في هذا النظام.</p>
              </div>

              {renderFooter()}
            </form>
          )}

          {/* 5. SYSTEM PREFERENCES */}
          {activeTab === 'preferences' && (
            <form onSubmit={handleSave} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col">
              <div className="mb-8 border-b border-gray-50 pb-6">
                <h1 className="text-2xl font-black text-[#040814] mb-1">إعدادات النظام</h1>
                <p className="text-sm font-bold text-gray-500">تفضيلات النظام</p>
              </div>

              <div className="flex flex-col gap-6 max-w-2xl">
                
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-black text-[#040814]">تفعيل الوضع الداكن</span>
                    <span className="text-[11px] font-bold text-gray-400">استخدام الوضع الداكن في جميع أنحاء النظام</span>
                  </div>
                  <ToggleSwitch 
                    checked={preferencesState.darkMode} 
                    onChange={() => setPreferencesState(prev => ({...prev, darkMode: !prev.darkMode}))} 
                  />
                </div>

                <div className="flex flex-col gap-2 pt-2 border-b border-gray-50 pb-6">
                  <label className="text-sm font-black text-[#040814]">وقت تسجيل الخروج التلقائي</label>
                  <input 
                    type="text" 
                    value={preferencesState.autoLogout}
                    onChange={(e) => setPreferencesState(prev => ({...prev, autoLogout: e.target.value}))}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-right"
                  />
                  <span className="text-[11px] font-bold text-gray-400">بعد فترة من عدم النشاط، سيتم تسجيل خروج المستخدم تلقائياً</span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-black text-[#040814]">تفعيل سجل التدقيق</span>
                    <span className="text-[11px] font-bold text-gray-400">تسجيل جميع الإجراءات المهمة في النظام لأغراض التدقيق</span>
                  </div>
                  <ToggleSwitch 
                    checked={preferencesState.auditLog} 
                    onChange={() => setPreferencesState(prev => ({...prev, auditLog: !prev.auditLog}))} 
                  />
                </div>

              </div>
              
              {renderFooter()}
            </form>
          )}

        </div>
      </div>
    </>
  );
}
