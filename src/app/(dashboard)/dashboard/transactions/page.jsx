'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/dashboard/Header';
import { LoadingState, ErrorState, EmptyState } from '@/components/dashboard/DataStates';
import {
  ChevronDown,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  XCircle,
  AlertCircle,
  Loader2,
  Receipt,
  X,
} from 'lucide-react';
import { useApi, useMutation } from '@/hooks/useApi';
import { transactionsService } from '@/lib/services/transactions.service';
import { customersService } from '@/lib/services/customers.service';

const PAYMENT_TYPES = [
  { value: '', label: 'الكل' },
  { value: 'first_payment', label: 'دفعة أولى' },
  { value: 'final_payment', label: 'دفعة نهائية' },
  { value: 'commission', label: 'عمولة' },
  { value: 'partial_payment', label: 'دفعة جزئية' },
];

const PAYMENT_TYPE_LABELS = {
  first_payment: 'دفعة أولى',
  final_payment: 'دفعة نهائية',
  commission: 'عمولة',
  partial_payment: 'دفعة جزئية',
};

const PAYMENT_TYPE_COLOR = {
  first_payment: 'text-amber-500',
  final_payment: 'text-emerald-500',
  commission: 'text-purple-500',
  partial_payment: 'text-blue-500',
};

const STATUS_OPTIONS = [
  { value: '', label: 'الكل' },
  { value: 'confirmed', label: 'مؤكد' },
  { value: 'pending', label: 'معلق' },
  { value: 'voided', label: 'ملغى' },
];

const STATUS_LABEL = { confirmed: 'مؤكد', pending: 'معلق', voided: 'ملغى' };
const STATUS_COLOR = {
  confirmed: 'bg-emerald-100/60 text-emerald-600',
  pending: 'bg-amber-100/60 text-amber-600',
  voided: 'bg-rose-100/60 text-rose-600',
};

const ACTION_LABEL = {
  create: { text: 'إنشاء', color: 'bg-emerald-100/60 text-emerald-600' },
  update: { text: 'تعديل', color: 'bg-amber-100/60 text-amber-600' },
  void: { text: 'إلغاء', color: 'bg-rose-100/60 text-rose-600' },
};

const formatMoney = (n) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(Number(n) || 0);

const formatDateTime = (d) => {
  if (!d) return '—';
  const date = new Date(d);
  return `${date.toLocaleDateString('en-CA')} ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
};

const initials = (name) => (name || '؟').split(' ').slice(0, 2).map((p) => p[0]).join('');

export default function TransactionsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('transactions');
  const [filters, setFilters] = useState({ paymentType: '', status: '', client: '', startDate: '', endDate: '' });
  const [page, setPage] = useState(1);
  const [activityPage, setActivityPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [voidTarget, setVoidTarget] = useState(null);

  const txQuery = useApi(
    () => {
      const dateRange = (filters.startDate && filters.endDate) ? `${filters.startDate},${filters.endDate}` : '';
      return transactionsService.list({ page, limit: 10, paymentType: filters.paymentType, status: filters.status, client: filters.client, dateRange });
    },
    [page, filters.paymentType, filters.status, filters.client, filters.startDate, filters.endDate],
    { enabled: activeTab === 'transactions' },
  );

  const activityQuery = useApi(
    () => transactionsService.getActivityLog({ page: activityPage, limit: 10 }),
    [activityPage],
    { enabled: activeTab === 'activity' },
  );

  const customersQuery = useApi(() => customersService.list({ limit: 100 }), []);

  const customers = customersQuery.data?.data || [];
  const transactions = txQuery.data?.data || [];
  const txPagination = txQuery.data?.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 };
  const activities = activityQuery.data?.data || [];
  const actPagination = activityQuery.data?.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 };

  const handleFilter = (key, value) => {
    setFilters((p) => ({ ...p, [key]: value }));
    setPage(1);
  };

  return (
    <>
      <Header title="" subtitle="" variant="transparent" />

      <div className="flex items-center justify-between mb-8 mt-[-1rem]">
        <h1 className="text-2xl font-black text-[#040814]">العمليات المالية</h1>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <FilterField label="نوع الدفعة">
          <SelectInput value={filters.paymentType} onChange={(e) => handleFilter('paymentType', e.target.value)}>
            {PAYMENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </SelectInput>
        </FilterField>
        <FilterField label="الحالة">
          <SelectInput value={filters.status} onChange={(e) => handleFilter('status', e.target.value)}>
            {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </SelectInput>
        </FilterField>
        <FilterField label="العميل">
          <SelectInput value={filters.client} onChange={(e) => handleFilter('client', e.target.value)}>
            <option value="">الكل</option>
            {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </SelectInput>
        </FilterField>
        <FilterField label="التاريخ (من)">
          <input
            type="date"
            value={filters.startDate} onChange={(e) => handleFilter('startDate', e.target.value)}
            className="w-full bg-gray-50/80 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </FilterField>
        <FilterField label="التاريخ (إلى)">
          <input
            type="date"
            value={filters.endDate} onChange={(e) => handleFilter('endDate', e.target.value)}
            className="w-full bg-gray-50/80 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#040814] outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </FilterField>
      </div>

      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm flex flex-col mb-12">
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            className={`flex-1 py-4 text-center font-bold text-[15px] rounded-tr-[24px] ${activeTab === 'transactions' ? 'bg-[#fefce8] text-[#040814]' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('transactions')}>
            العمليات المالية ({txPagination.totalItems})
          </button>
          <button
            className={`flex-1 py-4 text-center font-bold text-[15px] rounded-tl-[24px] ${activeTab === 'activity' ? 'bg-[#fefce8] text-[#040814]' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('activity')}>
            سجل الفعاليات ({actPagination.totalItems})
          </button>
        </div>

        {activeTab === 'transactions' && (
          <div className="p-6">
            {txQuery.loading ? <LoadingState /> :
              txQuery.error ? <ErrorState error={txQuery.error} onRetry={txQuery.refetch} /> :
              transactions.length === 0 ? <EmptyState title="لا توجد معاملات" description="لا توجد معاملات تطابق الفلاتر" icon={Receipt} /> : (
              <div className="overflow-x-auto">
                <table className="w-full text-right border-separate border-spacing-y-3">
                  <thead>
                    <tr>
                      {['رقم العملية', 'رقم الطلب', 'العميل', 'نوع الدفع', 'المبلغ', 'العملة', 'التاريخ', 'أضيف بواسطة', 'الحالة', 'الإجراءات'].map((h) => (
                        <th key={h} className="pb-2 text-[13px] text-[#B08B3A] font-black whitespace-nowrap px-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((trx) => (
                      <tr key={trx.id} className="bg-white border border-gray-100 rounded-[16px] hover:shadow-md transition-all group">
                        <td className="py-4 px-4 text-[13px] font-bold text-gray-600 rounded-r-[16px] border-t border-b border-r border-gray-100" dir="ltr">{trx.displayId}</td>
                        <td className="py-4 px-4 text-[13px] font-bold text-[#040814] border-t border-b border-gray-100" dir="ltr">{trx.order?.displayId || '—'}</td>
                        <td className="py-4 px-4 text-[13px] font-bold text-[#040814] border-t border-b border-gray-100 max-w-[150px] truncate">{trx.order?.customer?.name || '—'}</td>
                        <td className={`py-4 px-4 text-[13px] font-bold border-t border-b border-gray-100 whitespace-nowrap ${PAYMENT_TYPE_COLOR[trx.paymentType] || 'text-gray-500'}`}>
                          {PAYMENT_TYPE_LABELS[trx.paymentType] || trx.paymentType}
                        </td>
                        <td className="py-4 px-4 text-[13px] font-bold text-[#040814] border-t border-b border-gray-100" dir="ltr">{formatMoney(trx.amount)}</td>
                        <td className="py-4 px-4 text-[13px] font-bold text-[#040814] border-t border-b border-gray-100">{trx.currency}</td>
                        <td className="py-4 px-4 text-[12px] font-bold text-[#B08B3A] border-t border-b border-gray-100 whitespace-nowrap" dir="ltr">{formatDateTime(trx.paymentDate)}</td>
                        <td className="py-4 px-4 text-[13px] font-bold text-[#B08B3A] border-t border-b border-gray-100 whitespace-nowrap">{trx.addedBy?.fullName || '—'}</td>
                        <td className="py-4 px-4 border-t border-b border-gray-100">
                          <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap ${STATUS_COLOR[trx.status]}`}>
                            {STATUS_LABEL[trx.status] || trx.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 border-t border-b border-l border-gray-100 rounded-l-[16px]">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => router.push(`/dashboard/transactions/${trx.id}`)}
                              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-[#040814]">
                              <Eye size={16} />
                            </button>
                            {trx.status !== 'voided' && (
                              <div className="relative">
                                <button onClick={() => setOpenDropdownId(openDropdownId === trx.id ? null : trx.id)}
                                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-[#040814]">
                                  <MoreHorizontal size={16} />
                                </button>
                                {openDropdownId === trx.id && (
                                  <>
                                    <div className="fixed inset-0 z-40" onClick={() => setOpenDropdownId(null)} />
                                    <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-xl py-2 z-50">
                                      <button onClick={() => { setOpenDropdownId(null); setVoidTarget(trx); }}
                                        className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-rose-500 hover:bg-rose-50 w-full text-right">
                                        <XCircle size={16} /> إلغاء الدفعة (Void)
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {txPagination.totalPages > 1 && (
              <Pagination current={txPagination.currentPage} total={txPagination.totalPages} onChange={setPage} label="معاملة" totalItems={txPagination.totalItems} />
            )}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="p-6 flex flex-col gap-4">
            {activityQuery.loading ? <LoadingState /> :
              activityQuery.error ? <ErrorState error={activityQuery.error} onRetry={activityQuery.refetch} /> :
              activities.length === 0 ? <EmptyState title="لا توجد فعاليات" description="" icon={Receipt} /> : (
              <>
                {activities.map((act) => {
                  const action = ACTION_LABEL[act.action] || { text: act.action, color: 'bg-gray-100 text-gray-600' };
                  return (
                    <div key={act.id} className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-all">
                      <div className="flex-1 text-right">
                        <div className="flex items-center justify-end gap-3 mb-2">
                          <span className="text-[11px] font-bold text-gray-400" dir="ltr">{formatDateTime(act.createdAt)}</span>
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${action.color}`}>{action.text}</span>
                        </div>
                        <h4 className="text-base font-black text-[#040814] mb-1">{act.title}</h4>
                        {act.details && <p className="text-[13px] font-bold text-gray-400">{act.details}</p>}
                      </div>
                      {act.user && (
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="flex flex-col text-right">
                            <span className="font-black text-[#040814] text-sm">{act.user.fullName}</span>
                            {act.user.role?.name && <span className="text-xs font-bold text-gray-400">{act.user.role.name}</span>}
                          </div>
                          <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-[15px] bg-[#B08B3A] text-white">
                            {initials(act.user.fullName)}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {actPagination.totalPages > 1 && (
                  <Pagination current={actPagination.currentPage} total={actPagination.totalPages} onChange={setActivityPage} label="فعالية" totalItems={actPagination.totalItems} />
                )}
              </>
            )}
          </div>
        )}
      </div>

      {voidTarget && (
        <VoidModal transaction={voidTarget} onClose={() => setVoidTarget(null)} onSuccess={() => { setVoidTarget(null); txQuery.refetch(); }} />
      )}
    </>
  );
}

// ============== Sub Components ==============

function VoidModal({ transaction, onClose, onSuccess }) {
  const mut = useMutation(({ id, reason }) => transactionsService.void(id, reason));
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!reason.trim()) return setError('سبب الإلغاء مطلوب');
    try {
      await mut.mutate({ id: transaction.id, reason: reason.trim() });
      onSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#040814]/60 backdrop-blur-sm z-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-[32px] w-full max-w-xl p-8 shadow-2xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-black text-[#040814]">إلغاء معاملة</h3>
            <p className="text-sm font-bold text-gray-400 mt-1" dir="ltr">{transaction.displayId}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-bold">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm font-bold">
            سيتم عكس المبلغ ({formatMoney(transaction.amount)} {transaction.currency}) من الطلب وتسجيل المعاملة كملغاة.
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#040814]">سبب الإلغاء</label>
            <textarea required rows={3}
              value={reason} onChange={(e) => setReason(e.target.value)}
              placeholder="اكتب سبب الإلغاء"
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#B08B3A] outline-none font-bold text-sm resize-none" />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-500 font-bold hover:bg-gray-50">
              إلغاء
            </button>
            <button type="submit" disabled={mut.loading}
              className="flex-[2] py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black shadow-lg shadow-rose-500/20 disabled:opacity-60 flex items-center justify-center gap-2">
              {mut.loading && <Loader2 size={18} className="animate-spin" />}
              تأكيد الإلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const FilterField = ({ label, children }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[13px] font-bold text-[#B08B3A] px-1">{label}</label>
    {children}
  </div>
);

const SelectInput = ({ children, ...props }) => (
  <div className="relative">
    <select {...props}
      className="w-full appearance-none bg-gray-50/80 border border-gray-100 rounded-xl px-4 py-3 pr-10 text-sm font-bold text-[#040814] outline-none cursor-pointer focus:ring-2 focus:ring-amber-500/20">
      {children}
    </select>
    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
  </div>
);

const Pagination = ({ current, total, onChange, label, totalItems }) => (
  <div className="flex items-center justify-between p-6 pt-2 border-t border-gray-50 mt-2">
    <span className="text-xs font-bold text-[#040814]">عرض {totalItems} {label}</span>
    <div className="flex items-center gap-2">
      <button disabled={current === 1} onClick={() => onChange(current - 1)}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-30">
        <ChevronRight size={16} />
      </button>
      <span className="text-xs font-bold text-[#040814]">{current} / {total}</span>
      <button disabled={current === total} onClick={() => onChange(current + 1)}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-30">
        <ChevronLeft size={16} />
      </button>
    </div>
  </div>
);
