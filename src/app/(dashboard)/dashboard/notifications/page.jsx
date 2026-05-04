'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/dashboard/Header';
import {
  ChevronRight, ChevronLeft, BellOff, Check, CheckCheck,
  Package, CreditCard, ArrowRightCircle, FileText,
} from 'lucide-react';
import { useApi, useMutation } from '@/hooks/useApi';
import { LoadingState, ErrorState, EmptyState } from '@/components/dashboard/DataStates';
import { notificationsService } from '@/lib/services/notifications.service';

const TYPE_ICON = {
  order_created: Package,
  payment_added: CreditCard,
  stage_updated: ArrowRightCircle,
  default: FileText,
};

function getTypeIcon(type) {
  return TYPE_ICON[type] || TYPE_ICON.default;
}

function buildReferenceHref(notif) {
  if (!notif.referenceId) return null;
  switch (notif.referenceType) {
    case 'order':
      return `/orders/${notif.referenceId}`;
    case 'transaction':
      return `/dashboard/transactions/${notif.referenceId}`;
    default:
      return null;
  }
}

function formatTimestamp(value) {
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

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [feedback, setFeedback] = useState(null);

  const fetchList = useMemo(() => () => notificationsService.list({ page, limit }), [page]);
  const { data, loading, error, refetch } = useApi(fetchList, [fetchList]);
  const { data: unreadData, refetch: refetchUnread } = useApi(() => notificationsService.getUnreadCount(), []);

  const { mutate: markAsRead } = useMutation((id) => notificationsService.markAsRead(id));
  const { mutate: markAllAsRead, loading: markingAll } = useMutation(() => notificationsService.markAllAsRead());

  const list = data?.data ?? [];
  const meta = data?.meta ?? { total: 0, page: 1, totalPages: 1, limit };
  const unreadCount = unreadData?.count ?? 0;

  const flash = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 3000);
  };

  const refreshAll = () => {
    refetch();
    refetchUnread();
  };

  const handleItemClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await markAsRead(notif.id);
        refreshAll();
      } catch {
        // silent — UI navigation still works
      }
    }
  };

  const handleMarkAll = async () => {
    try {
      const res = await markAllAsRead();
      flash('success', `تم تحديث ${res?.affected ?? 0} إشعار`);
      refreshAll();
    } catch (err) {
      flash('error', err?.message || 'تعذر تحديث الإشعارات');
    }
  };

  const start = list.length === 0 ? 0 : (page - 1) * limit + 1;
  const end = (page - 1) * limit + list.length;

  return (
    <>
      <Header title="" subtitle="" variant="transparent" />

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 mt-[-1rem]">
        <div>
          <h1 className="text-2xl font-black text-[#040814] mb-1 flex items-center gap-3">
            الإشعارات
            {unreadCount > 0 && (
              <span className="bg-amber-500 text-white text-sm px-3 py-0.5 rounded-full" dir="ltr">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-sm font-bold text-gray-500">
            {unreadCount > 0 ? `لديك ${unreadCount} إشعار غير مقروء` : 'جميع الإشعارات تمت قراءتها'}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAll}
            disabled={markingAll}
            className="flex items-center justify-center gap-2 bg-[#040814] hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-sm focus:outline-none disabled:opacity-60"
          >
            <CheckCheck size={18} strokeWidth={2.5} />
            {markingAll ? 'جاري التحديث...' : 'تحديد الكل كمقروء'}
          </button>
        )}
      </div>

      {feedback && (
        <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-bold border ${
          feedback.type === 'success'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
            : 'bg-rose-50 text-rose-700 border-rose-100'
        }`}>
          {feedback.text}
        </div>
      )}

      {loading ? (
        <LoadingState message="جاري تحميل الإشعارات..." />
      ) : error ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : list.length === 0 ? (
        <EmptyState
          icon={BellOff}
          title="لا توجد إشعارات"
          description="ستظهر الإشعارات هنا عند حدوث تحديثات في النظام"
        />
      ) : (
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 mb-12 flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            {list.map((notif) => {
              const Icon = getTypeIcon(notif.type);
              const href = buildReferenceHref(notif);
              const Wrapper = href ? Link : 'div';
              const wrapperProps = href ? { href } : {};
              return (
                <Wrapper
                  key={notif.id}
                  {...wrapperProps}
                  onClick={() => handleItemClick(notif)}
                  className={`border rounded-2xl px-6 py-5 flex items-start gap-4 bg-white hover:shadow-sm transition-all cursor-pointer ${
                    notif.isRead
                      ? 'border-gray-100 hover:border-gray-200'
                      : 'border-amber-200 bg-amber-50/30 hover:border-[#D4AF37]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    notif.isRead ? 'bg-gray-100 text-gray-500' : 'bg-amber-100 text-amber-600'
                  }`}>
                    <Icon size={20} strokeWidth={2.2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {!notif.isRead && (
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                      )}
                      <span className={`text-[15px] ${notif.isRead ? 'font-bold text-gray-700' : 'font-black text-[#040814]'}`}>
                        {notif.message}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-gray-400" dir="ltr">
                      {formatTimestamp(notif.createdAt)}
                    </span>
                  </div>
                  {!notif.isRead && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleItemClick(notif);
                      }}
                      className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors focus:outline-none"
                      title="تحديد كمقروء"
                    >
                      <Check size={18} />
                    </button>
                  )}
                </Wrapper>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center pt-6 mt-2 border-t border-gray-50 gap-4">
            <span className="text-[13px] font-black text-[#040814]" dir="ltr">
              Showing {start}-{end} of {meta.total} notifications
            </span>
            {meta.totalPages > 1 && (
              <div className="flex items-center gap-4 bg-gray-50 rounded-xl px-4 py-2 border border-gray-100">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1 text-gray-400 hover:text-[#040814] disabled:opacity-30 disabled:hover:text-gray-400 transition-colors focus:outline-none"
                >
                  <ChevronRight size={18} strokeWidth={3} />
                </button>
                <span className="text-[13px] font-black text-[#040814]" dir="ltr">
                  Page {page}/{meta.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={page >= meta.totalPages}
                  className="p-1 text-gray-400 hover:text-[#040814] disabled:opacity-30 disabled:hover:text-gray-400 transition-colors focus:outline-none"
                >
                  <ChevronLeft size={18} strokeWidth={3} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
