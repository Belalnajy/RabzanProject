'use client';

import { Loader2, AlertCircle, Inbox, RefreshCw } from 'lucide-react';

export function LoadingState({ message = 'جاري التحميل...', minHeight = '300px' }) {
  return (
    <div
      className="flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 p-12 shadow-sm gap-4"
      style={{ minHeight }}>
      <Loader2 size={40} className="animate-spin text-[#B08B3A]" />
      <p className="text-gray-500 font-bold text-sm">{message}</p>
    </div>
  );
}

export function ErrorState({ error, onRetry, minHeight = '300px' }) {
  const message = error?.message || 'حدث خطأ غير متوقع';
  return (
    <div
      className="flex flex-col items-center justify-center bg-white rounded-3xl border border-rose-100 p-12 shadow-sm gap-4 text-center"
      style={{ minHeight }}>
      <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
        <AlertCircle size={32} />
      </div>
      <h3 className="text-lg font-black text-[#040814]">تعذر تحميل البيانات</h3>
      <p className="text-gray-500 font-bold text-sm max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 bg-[#B08B3A] hover:bg-[#906c27] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors">
          <RefreshCw size={16} />
          إعادة المحاولة
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title = 'لا توجد بيانات', description, icon: Icon = Inbox, action, minHeight = '300px' }) {
  return (
    <div
      className="flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 p-12 shadow-sm gap-4 text-center"
      style={{ minHeight }}>
      <div className="w-20 h-20 rounded-3xl bg-amber-50 flex items-center justify-center text-amber-500">
        <Icon size={40} strokeWidth={1.5} />
      </div>
      <h3 className="text-2xl font-black text-[#040814]">{title}</h3>
      {description && (
        <p className="text-gray-500 font-medium text-sm max-w-md leading-relaxed">{description}</p>
      )}
      {action}
    </div>
  );
}
