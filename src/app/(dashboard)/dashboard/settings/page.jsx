'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Header from '@/components/dashboard/Header';
import {
  Save, Image as ImageIcon, Plus, AlertCircle, Edit2, ChevronDown,
} from 'lucide-react';
import { useApi, useMutation } from '@/hooks/useApi';
import { LoadingState, ErrorState } from '@/components/dashboard/DataStates';
import { settingsService } from '@/lib/services/settings.service';

const TABS = [
  { id: 'general', label: 'الإعدادات العامة' },
  { id: 'workflow', label: 'سير العمل' },
  { id: 'financial', label: 'مالي' },
  { id: 'currency', label: 'عملة' },
  { id: 'preferences', label: 'تفضيلات النظام' },
];

const ToggleSwitch = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`w-12 h-6 rounded-full p-1 flex items-center transition-colors focus:outline-none ${
      checked ? 'bg-emerald-500 justify-end' : 'bg-gray-300 justify-start'
    }`}
  >
    <div className="w-4 h-4 bg-white rounded-full shadow-md" />
  </button>
);

function parseStages(json) {
  try { return JSON.parse(json || '[]'); } catch { return []; }
}

function parseCurrencies(json) {
  try { return JSON.parse(json || '[]'); } catch { return []; }
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [feedback, setFeedback] = useState(null);

  const { data: settings, loading, error, refetch } = useApi(() => settingsService.getAll(), []);

  const general = settings?.general || {};
  const financial = settings?.financial || {};
  const preferences = settings?.preferences || {};
  const workflowGroup = settings?.workflow || {};
  const currencyGroup = settings?.currency || {};
  const stages = useMemo(() => parseStages(workflowGroup.stages), [workflowGroup.stages]);
  const currencies = useMemo(() => parseCurrencies(currencyGroup.currencies), [currencyGroup.currencies]);

  const [generalState, setGeneralState] = useState({
    systemName: '', companyName: '', lang: '', timezone: '', dateFormat: '',
  });
  const [workflowStages, setWorkflowStages] = useState([]);
  const [financialState, setFinancialState] = useState({
    defaultCommission: '', allowOverride: false, creditLimit: '', paymentTerms: '', delayAlertLimit: '',
  });
  const [preferencesState, setPreferencesState] = useState({
    darkMode: false, autoLogout: true, auditLog: true,
  });
  const [defaultCurrency, setDefaultCurrency] = useState('');
  const [newStageTitle, setNewStageTitle] = useState('');
  const [newCurrency, setNewCurrency] = useState({ code: '', name: '', exchangeRate: '' });

  useEffect(() => {
    if (!settings) return;
    setGeneralState({
      systemName: general.system_name ?? '',
      companyName: general.company_name ?? '',
      lang: general.lang ?? 'ar',
      timezone: general.timezone ?? 'GMT+3',
      dateFormat: general.date_format ?? 'DD/MM/YYYY',
    });
    setFinancialState({
      defaultCommission: financial.default_commission ?? '',
      allowOverride: financial.allow_override === 'true',
      creditLimit: financial.credit_limit ?? '',
      paymentTerms: financial.payment_terms ?? '',
      delayAlertLimit: financial.delay_alert_limit ?? '',
    });
    setPreferencesState({
      darkMode: preferences.dark_mode === 'true',
      autoLogout: preferences.auto_logout !== 'false',
      auditLog: preferences.audit_log !== 'false',
    });
    setWorkflowStages(stages);
    setDefaultCurrency(
      currencyGroup.default_currency || currencies.find((c) => c.isDefault)?.code || '',
    );
  }, [settings]); // eslint-disable-line react-hooks/exhaustive-deps

  const { mutate: saveGeneral, loading: savingGeneral } = useMutation((data) => settingsService.updateGeneral(data));
  const { mutate: saveWorkflow, loading: savingWorkflow } = useMutation((data) => settingsService.updateWorkflow(data));
  const { mutate: addStage } = useMutation((data) => settingsService.createWorkflowStage(data));
  const { mutate: saveFinancial, loading: savingFinancial } = useMutation((data) => settingsService.updateFinancial(data));
  const { mutate: savePreferences, loading: savingPrefs } = useMutation((data) => settingsService.updatePreferences(data));
  const { mutate: saveDefaultCurrency, loading: savingCurrency } = useMutation((data) => settingsService.updateDefaultCurrency(data));
  const { mutate: createCurrencyMut } = useMutation((data) => settingsService.createCurrency(data));
  const { mutate: updateRate } = useMutation(({ id, data }) => settingsService.updateExchangeRate(id, data));

  const flash = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleSaveGeneral = async (e) => {
    e.preventDefault();
    try {
      await saveGeneral(generalState);
      flash('success', 'تم حفظ الإعدادات العامة');
      refetch();
    } catch (err) {
      flash('error', err?.message || 'تعذر الحفظ');
    }
  };

  const handleSaveWorkflow = async (e) => {
    e.preventDefault();
    try {
      await saveWorkflow({
        stages: workflowStages.map((s) => ({
          id: s.id,
          title: s.title,
          isMandatory: s.isMandatory,
          needsConfirmation: s.needsConfirmation,
        })),
      });
      flash('success', 'تم حفظ مراحل سير العمل');
      refetch();
    } catch (err) {
      flash('error', err?.message || 'تعذر الحفظ');
    }
  };

  const handleAddStage = async () => {
    if (!newStageTitle.trim()) return;
    try {
      await addStage({ title: newStageTitle, isMandatory: true, needsConfirmation: false });
      setNewStageTitle('');
      flash('success', 'تمت إضافة المرحلة');
      refetch();
    } catch (err) {
      flash('error', err?.message || 'تعذر إضافة المرحلة');
    }
  };

  const handleSaveFinancial = async (e) => {
    e.preventDefault();
    try {
      await saveFinancial({
        defaultCommission: financialState.defaultCommission ? Number(financialState.defaultCommission) : undefined,
        allowOverride: financialState.allowOverride,
        creditLimit: financialState.creditLimit ? Number(financialState.creditLimit) : undefined,
        paymentTerms: financialState.paymentTerms || undefined,
        delayAlertLimit: financialState.delayAlertLimit ? Number(financialState.delayAlertLimit) : undefined,
      });
      flash('success', 'تم حفظ الإعدادات المالية');
      refetch();
    } catch (err) {
      flash('error', err?.message || 'تعذر الحفظ');
    }
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    try {
      await savePreferences(preferencesState);
      flash('success', 'تم حفظ التفضيلات');
      refetch();
    } catch (err) {
      flash('error', err?.message || 'تعذر الحفظ');
    }
  };

  const handleSaveCurrency = async (e) => {
    e.preventDefault();
    if (!defaultCurrency) return;
    try {
      await saveDefaultCurrency({ defaultCurrency });
      flash('success', 'تم تحديث العملة الافتراضية');
      refetch();
    } catch (err) {
      flash('error', err?.message || 'تعذر الحفظ');
    }
  };

  const handleCreateCurrency = async () => {
    if (!newCurrency.code || !newCurrency.name || !newCurrency.exchangeRate) {
      flash('error', 'الرجاء تعبئة جميع حقول العملة');
      return;
    }
    try {
      await createCurrencyMut({
        code: newCurrency.code,
        name: newCurrency.name,
        exchangeRate: Number(newCurrency.exchangeRate),
      });
      setNewCurrency({ code: '', name: '', exchangeRate: '' });
      flash('success', 'تمت إضافة العملة');
      refetch();
    } catch (err) {
      flash('error', err?.message || 'تعذر إضافة العملة');
    }
  };

  const handleUpdateRate = async (currency) => {
    const value = prompt(`أدخل سعر الصرف الجديد لـ ${currency.code}:`, currency.exchangeRate);
    if (!value) return;
    try {
      await updateRate({ id: currency.id, data: { exchangeRate: Number(value) } });
      flash('success', 'تم تحديث سعر الصرف');
      refetch();
    } catch (err) {
      flash('error', err?.message || 'تعذر التحديث');
    }
  };

  if (loading) return <LoadingState message="جاري تحميل الإعدادات..." />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  const FormFooter = ({ saving, onCancel }) => (
    <div className="mt-8">
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-white border border-[#D4AF37] text-[#D4AF37] py-3.5 rounded-xl font-bold transition-colors hover:bg-gray-50 focus:outline-none"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-[2] bg-[#D4AF37] hover:bg-[#B08B3A] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm focus:outline-none disabled:opacity-60"
        >
          <Save size={18} strokeWidth={2.5} />
          {saving ? 'جاري الحفظ...' : 'حفظ المتغيرات'}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Header title="" subtitle="" variant="transparent" />

      {feedback && (
        <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-bold border ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
          {feedback.text}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 mb-12 mt-[-1rem]">
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white border border-gray-100 rounded-3xl p-4 flex flex-col gap-2 shadow-sm sticky top-6">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 rounded-2xl text-base font-black text-right transition-all focus:outline-none ${
                  activeTab === tab.id ? 'bg-[#D4AF37] text-white shadow-md' : 'bg-transparent text-[#040814] hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {activeTab === 'general' && (
            <form onSubmit={handleSaveGeneral} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col">
              <div className="mb-8 border-b border-gray-50 pb-6">
                <h1 className="text-2xl font-black text-[#040814] mb-1">إعدادات النظام</h1>
                <p className="text-sm font-bold text-gray-500">إدارة وضبط سلوك النظام العام</p>
              </div>

              <div className="flex flex-col gap-6 max-w-2xl">
                <Field label="اسم النظام" required>
                  <input type="text" value={generalState.systemName}
                    onChange={(e) => setGeneralState((p) => ({ ...p, systemName: e.target.value }))}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-right" required />
                </Field>
                <Field label="اسم الشركة" required>
                  <input type="text" value={generalState.companyName}
                    onChange={(e) => setGeneralState((p) => ({ ...p, companyName: e.target.value }))}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-right" required />
                </Field>
                <Field label="اللغة الافتراضية">
                  <SelectInput value={generalState.lang}
                    onChange={(e) => setGeneralState((p) => ({ ...p, lang: e.target.value }))}
                    options={[{ value: 'ar', label: 'العربية' }, { value: 'en', label: 'English' }]} />
                </Field>
                <Field label="المنطقة الزمنية">
                  <SelectInput value={generalState.timezone}
                    onChange={(e) => setGeneralState((p) => ({ ...p, timezone: e.target.value }))}
                    options={[
                      { value: 'GMT+3', label: 'توقيت السعودية (GMT+3)' },
                      { value: 'GMT+2', label: 'توقيت مصر (GMT+2)' },
                      { value: 'GMT+4', label: 'توقيت الإمارات (GMT+4)' },
                    ]} />
                </Field>
                <Field label="تنسيق التاريخ">
                  <SelectInput value={generalState.dateFormat}
                    onChange={(e) => setGeneralState((p) => ({ ...p, dateFormat: e.target.value }))}
                    options={[
                      { value: 'DD/MM/YYYY', label: 'يوم/شهر/سنة' },
                      { value: 'MM/DD/YYYY', label: 'شهر/يوم/سنة' },
                      { value: 'YYYY-MM-DD', label: 'سنة-شهر-يوم' },
                    ]} />
                </Field>
              </div>

              <FormFooter saving={savingGeneral} onCancel={refetch} />
            </form>
          )}

          {activeTab === 'workflow' && (
            <form onSubmit={handleSaveWorkflow} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-gray-50 gap-4">
                <div>
                  <h1 className="text-2xl font-black text-[#040814] mb-1">إعدادات النظام</h1>
                  <p className="text-sm font-bold text-gray-500">إدارة سير العمل</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <input
                  type="text"
                  value={newStageTitle}
                  onChange={(e) => setNewStageTitle(e.target.value)}
                  placeholder="عنوان المرحلة الجديدة"
                  className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-right"
                />
                <button type="button" onClick={handleAddStage}
                  className="flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#B08B3A] text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-sm focus:outline-none">
                  <Plus size={16} strokeWidth={2.5} />
                  إضافة مرحلة
                </button>
              </div>

              <h2 className="text-xl font-black text-[#040814] mb-6">المراحل الحالية</h2>
              {workflowStages.length === 0 ? (
                <p className="text-sm text-gray-500 font-bold mb-6">لا توجد مراحل معرفة</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {workflowStages.map((stage) => (
                    <div key={stage.id} className="border border-gray-100 rounded-2xl p-6 relative bg-white shadow-sm">
                      <input
                        type="text" value={stage.title}
                        onChange={(e) => setWorkflowStages((prev) => prev.map((s) => s.id === stage.id ? { ...s, title: e.target.value } : s))}
                        className="w-full text-lg font-black text-[#040814] mb-6 bg-transparent outline-none focus:ring-2 focus:ring-amber-500/20 rounded-lg px-2 py-1 -mx-2 text-right"
                      />
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-gray-500">إلزامي</span>
                          <ToggleSwitch
                            checked={stage.isMandatory}
                            onChange={() => setWorkflowStages((prev) => prev.map((s) => s.id === stage.id ? { ...s, isMandatory: !s.isMandatory } : s))}
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-gray-500">يحتاج تأكيداً خاصاً</span>
                          <ToggleSwitch
                            checked={stage.needsConfirmation}
                            onChange={() => setWorkflowStages((prev) => prev.map((s) => s.id === stage.id ? { ...s, needsConfirmation: !s.needsConfirmation } : s))}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-[#fefce8] border border-[#fef08a] rounded-xl p-4 flex gap-3 items-start mb-6">
                <AlertCircle className="text-amber-500 shrink-0" size={20} />
                <p className="text-xs font-bold text-amber-700">أي تغيير في سير العمل سيؤثر على جميع الطلبات الحالية والمستقبلية، يرجى التوخي بالحذر.</p>
              </div>

              <FormFooter saving={savingWorkflow} onCancel={refetch} />
            </form>
          )}

          {activeTab === 'financial' && (
            <form onSubmit={handleSaveFinancial} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col">
              <div className="mb-8 border-b border-gray-50 pb-6">
                <h1 className="text-2xl font-black text-[#040814] mb-1">إعدادات النظام</h1>
                <p className="text-sm font-bold text-gray-500">الإعدادات المالية</p>
              </div>

              <div className="flex flex-col gap-6 max-w-2xl">
                <Field label="نسبة العمولة الافتراضية (%)">
                  <input type="number" value={financialState.defaultCommission}
                    onChange={(e) => setFinancialState((p) => ({ ...p, defaultCommission: e.target.value }))}
                    dir="ltr" min={0} step={0.01}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-left" />
                </Field>

                <ToggleRow
                  title="السماح بتجاوز العمولة يدوياً"
                  description="السماح للمصرّح لهم بتعديل نسب العمولة لكل طلب"
                  checked={financialState.allowOverride}
                  onChange={() => setFinancialState((p) => ({ ...p, allowOverride: !p.allowOverride }))}
                />

                <Field label="حد الائتمان">
                  <input type="number" value={financialState.creditLimit}
                    onChange={(e) => setFinancialState((p) => ({ ...p, creditLimit: e.target.value }))}
                    dir="ltr" min={0}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-left" />
                </Field>

                <Field label="شروط الدفع الافتراضية">
                  <input type="text" value={financialState.paymentTerms}
                    onChange={(e) => setFinancialState((p) => ({ ...p, paymentTerms: e.target.value }))}
                    placeholder="30 يوم"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-right" />
                </Field>

                <Field label="حد التنبيه للتأخير (أيام)">
                  <input type="number" value={financialState.delayAlertLimit}
                    onChange={(e) => setFinancialState((p) => ({ ...p, delayAlertLimit: e.target.value }))}
                    dir="ltr" min={0}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-left" />
                </Field>
              </div>

              <FormFooter saving={savingFinancial} onCancel={refetch} />
            </form>
          )}

          {activeTab === 'currency' && (
            <form onSubmit={handleSaveCurrency} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col">
              <div className="mb-8 border-b border-gray-50 pb-6">
                <h1 className="text-2xl font-black text-[#040814] mb-1">إعدادات النظام</h1>
                <p className="text-sm font-bold text-gray-500">إدارة العملات وأسعار الصرف</p>
              </div>

              <Field label="العملة الافتراضية">
                <SelectInput value={defaultCurrency}
                  onChange={(e) => setDefaultCurrency(e.target.value)}
                  options={currencies.map((c) => ({ value: c.code, label: `${c.name} (${c.code})` }))}
                />
              </Field>

              <h3 className="text-base font-black text-[#040814] mt-8 mb-4">العملات النشطة</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {currencies.map((c) => (
                  <div key={c.id} className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm flex flex-col justify-between">
                    {c.isDefault && (
                      <span className="self-end text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md mb-2">افتراضي</span>
                    )}
                    <div className="mb-4">
                      <span className="block text-base font-black text-[#040814]">{c.name}</span>
                      <span className="block text-[11px] font-bold text-gray-400" dir="ltr">{c.code}</span>
                    </div>
                    <div className="text-xs font-bold text-[#040814] mb-4">
                      سعر الصرف: <span dir="ltr">{Number(c.exchangeRate).toFixed(4)}</span>
                    </div>
                    <button type="button" onClick={() => handleUpdateRate(c)}
                      className="w-full bg-[#D4AF37] hover:bg-[#B08B3A] text-white py-2.5 rounded-xl text-sm font-bold transition-colors focus:outline-none">
                      تحديث السعر
                    </button>
                  </div>
                ))}
              </div>

              <h3 className="text-base font-black text-[#040814] mb-3">إضافة عملة جديدة</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-2">
                <input type="text" placeholder="الرمز (USD)" value={newCurrency.code}
                  onChange={(e) => setNewCurrency((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                  dir="ltr"
                  className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 text-left" />
                <input type="text" placeholder="الاسم" value={newCurrency.name}
                  onChange={(e) => setNewCurrency((p) => ({ ...p, name: e.target.value }))}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 text-right" />
                <input type="number" placeholder="سعر الصرف" value={newCurrency.exchangeRate}
                  onChange={(e) => setNewCurrency((p) => ({ ...p, exchangeRate: e.target.value }))}
                  step="0.0001" dir="ltr"
                  className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20 text-left" />
                <button type="button" onClick={handleCreateCurrency}
                  className="bg-[#040814] hover:bg-gray-800 text-white py-3 rounded-xl font-bold transition-colors focus:outline-none">
                  إضافة
                </button>
              </div>

              <FormFooter saving={savingCurrency} onCancel={refetch} />
            </form>
          )}

          {activeTab === 'preferences' && (
            <form onSubmit={handleSavePreferences} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col">
              <div className="mb-8 border-b border-gray-50 pb-6">
                <h1 className="text-2xl font-black text-[#040814] mb-1">إعدادات النظام</h1>
                <p className="text-sm font-bold text-gray-500">تفضيلات النظام</p>
              </div>

              <div className="flex flex-col gap-6 max-w-2xl">
                <ToggleRow
                  title="تفعيل الوضع الداكن"
                  description="استخدام الوضع الداكن في جميع أنحاء النظام"
                  checked={preferencesState.darkMode}
                  onChange={() => setPreferencesState((p) => ({ ...p, darkMode: !p.darkMode }))}
                />
                <ToggleRow
                  title="تسجيل الخروج التلقائي"
                  description="تسجيل خروج المستخدم تلقائياً بعد فترة عدم نشاط"
                  checked={preferencesState.autoLogout}
                  onChange={() => setPreferencesState((p) => ({ ...p, autoLogout: !p.autoLogout }))}
                />
                <ToggleRow
                  title="تفعيل سجل التدقيق"
                  description="تسجيل جميع الإجراءات المهمة في النظام"
                  checked={preferencesState.auditLog}
                  onChange={() => setPreferencesState((p) => ({ ...p, auditLog: !p.auditLog }))}
                />
              </div>

              <FormFooter saving={savingPrefs} onCancel={refetch} />
            </form>
          )}
        </div>
      </div>
    </>
  );
}

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-black text-[#040814]">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function SelectInput({ value, onChange, options }) {
  return (
    <div className="relative">
      <select value={value} onChange={onChange}
        className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#040814] outline-none cursor-pointer focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all">
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
    </div>
  );
}

function ToggleRow({ title, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-b-0">
      <div className="flex flex-col gap-1 flex-1 ml-4">
        <span className="text-sm font-black text-[#040814]">{title}</span>
        {description && <span className="text-[11px] font-bold text-gray-400">{description}</span>}
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} />
    </div>
  );
}
