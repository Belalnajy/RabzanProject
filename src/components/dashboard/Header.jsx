'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Search,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Package,
  CreditCard,
  ArrowRightCircle,
  FileText,
  Menu,
} from 'lucide-react';
import { useSidebar } from './SidebarContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { notificationsService } from '@/lib/services/notifications.service';

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '؟';
  if (parts.length === 1) return parts[0].slice(0, 2);
  return `${parts[0][0]}.${parts[1][0]}`;
}

const NOTIF_ICON_MAP = {
  order_created: { icon: Package, color: 'bg-blue-100 text-blue-600' },
  payment_added: { icon: CreditCard, color: 'bg-emerald-100 text-emerald-600' },
  stage_updated: { icon: ArrowRightCircle, color: 'bg-amber-100 text-amber-600' },
};
const DEFAULT_ICON = { icon: FileText, color: 'bg-gray-100 text-gray-600' };

function relativeTime(value) {
  if (!value) return '';
  const diff = (Date.now() - new Date(value).getTime()) / 1000;
  if (diff < 60) return 'الآن';
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
  return `منذ ${Math.floor(diff / 86400)} يوم`;
}

export default function Header({
  title = 'لوحة التحكم الرئيسية',
  subtitle = 'مرحباً بك! إليك نظرة عامة على عملياتك اللوجستية',
  variant = 'transparent',
}) {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  const { user, logout, isAuthenticated } = useAuth();
  const displayName = user?.fullName || 'مستخدم';
  const roleName = user?.role?.nameAr || user?.role?.name || '';
  const initials = getInitials(displayName);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [recentNotifs, setRecentNotifs] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifs = async () => {
    if (!isAuthenticated) return;
    try {
      const [list, unread] = await Promise.all([
        notificationsService.list({ page: 1, limit: 5 }),
        notificationsService.getUnreadCount(),
      ]);
      setRecentNotifs(list?.data ?? []);
      setUnreadCount(unread?.count ?? 0);
    } catch {
      // ignore — header should fail silently
    }
  };

  useEffect(() => {
    loadNotifs();
    if (!isAuthenticated) return;
    const interval = setInterval(loadNotifs, 60000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleMarkAll = async (e) => {
    e.stopPropagation();
    try {
      await notificationsService.markAllAsRead();
      await loadNotifs();
    } catch {
      // ignore
    }
  };

  const handleNotifClick = async (notif) => {
    setIsNotificationsOpen(false);
    if (!notif.isRead) {
      try {
        await notificationsService.markAsRead(notif.id);
        loadNotifs();
      } catch {
        // ignore
      }
    }
    if (notif.referenceId) {
      if (notif.referenceType === 'order') router.push(`/orders/${notif.referenceId}`);
      if (notif.referenceType === 'transaction') router.push(`/dashboard/transactions/${notif.referenceId}`);
    }
  };

  return (
    <header
      className={`w-full flex md:items-center justify-between gap-4 mb-6 md:mb-8 ${
        variant === 'card'
          ? 'bg-white rounded-[32px] border border-gray-200 p-3 md:p-6 shadow-sm'
          : 'pb-4 border-b border-gray-200'
      }`}>
      {/* Title & Mobile Toggle */}
      <div className="flex items-center gap-3 overflow-hidden">
        <button
          onClick={toggleSidebar}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-[#040814] shadow-sm hover:bg-gray-50 focus:outline-none shrink-0">
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          <h1 className="text-lg md:text-3xl font-black text-[#040814] truncate leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-500 text-[10px] md:text-sm font-medium truncate hidden md:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Actions Area */}
      <div className="flex items-center justify-end gap-2 md:gap-4 shrink-0">
        {/* Interactive Search */}
        <div className="relative flex items-center">
          <div
            className={`flex items-center bg-white border ${
              isSearchActive
                ? 'border-amber-400 ring-4 ring-amber-50 w-40 sm:w-64 md:w-72 shadow-md'
                : 'border-gray-200 w-10 md:w-11 shadow-sm hover:border-gray-300 hover:bg-gray-50'
            } h-10 md:h-11 rounded-full transition-all duration-300 ease-in-out`}>
            <button
              onClick={() => setIsSearchActive(!isSearchActive)}
              className="w-10 md:w-11 h-10 md:h-11 flex-shrink-0 flex items-center justify-center text-[#040814] focus:outline-none rounded-full">
              <Search
                size={18}
                className={`transition-colors ${isSearchActive ? 'text-amber-500' : 'text-[#040814]'}`}
              />
            </button>
            <input
              type="text"
              placeholder="بحث..."
              autoFocus={isSearchActive}
              className={`w-full h-full bg-transparent outline-none text-xs md:text-sm pr-1 pl-4 transition-all duration-300 font-medium ${
                isSearchActive ? 'opacity-100' : 'opacity-0 hidden'
              }`}
            />
          </div>
        </div>

        {/* Interactive Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsProfileOpen(false);
            }}
            className={`w-10 md:w-11 h-10 md:h-11 flex items-center justify-center rounded-full bg-white border text-[#040814] shadow-sm transition-all focus:outline-none relative ${
              isNotificationsOpen
                ? 'border-amber-400 ring-4 ring-amber-50 scale-105'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}>
            <Bell
              size={18}
              className={isNotificationsOpen ? 'text-amber-500' : ''}
            />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -left-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-black border-2 border-white rounded-full flex items-center justify-center" dir="ltr">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          <div
            className={`absolute top-14 left-0 w-80 sm:w-96 bg-white rounded-2xl shadow-lg border border-gray-200 z-50 overflow-hidden transition-all duration-200 origin-top-left ${
              isNotificationsOpen
                ? 'opacity-100 scale-100 visible'
                : 'opacity-0 scale-95 invisible'
            }`}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-[#040814] text-sm">
                التنبيهات
                {unreadCount > 0 && (
                  <span className="ms-2 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full" dir="ltr">
                    {unreadCount}
                  </span>
                )}
              </h3>
              {unreadCount > 0 && (
                <button onClick={handleMarkAll} className="text-[11px] text-[#B08B3A] font-bold hover:underline focus:outline-none">
                  تحديد الكل كمقروء
                </button>
              )}
            </div>
            <div className="flex flex-col max-h-[320px] overflow-y-auto no-scrollbar">
              {recentNotifs.length === 0 ? (
                <div className="px-5 py-10 text-center text-xs font-bold text-gray-400">
                  لا توجد إشعارات حالياً
                </div>
              ) : (
                recentNotifs.map((n) => {
                  const meta = NOTIF_ICON_MAP[n.type] || DEFAULT_ICON;
                  const Icon = meta.icon;
                  return (
                    <div
                      key={n.id}
                      onClick={() => handleNotifClick(n)}
                      className={`flex gap-4 p-4 border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer transition-colors relative ${
                        !n.isRead ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${meta.color}`}>
                        <Icon size={18} />
                      </div>
                      <div className="pt-0.5 min-w-0 flex-1">
                        <p className={`text-sm truncate ${n.isRead ? 'font-bold text-gray-700' : 'font-black text-[#040814]'}`}>
                          {n.message}
                        </p>
                        <span className="text-[10px] font-bold text-gray-400">
                          {relativeTime(n.createdAt)}
                        </span>
                      </div>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
            <div className="p-3 border-t border-gray-100 bg-gray-50/50 text-center">
              <Link
                href="/dashboard/notifications"
                className="text-xs font-bold text-gray-600 hover:text-[#040814] py-1 px-4 rounded-full transition-colors inline-block hover:bg-gray-100">
                عرض كل التنبيهات
              </Link>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationsOpen(false);
            }}
            className={`flex items-center gap-2 md:gap-3 p-1 md:py-1.5 md:pr-2 md:pl-4 border rounded-full shadow-sm cursor-pointer transition-all focus:outline-none ${
              isProfileOpen
                ? 'bg-gray-50 border-gray-300'
                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}>
            <div className="w-8 md:w-9 h-8 md:h-9 rounded-full bg-linear-to-tr from-[#B08B3A] to-[#F1D792] flex items-center justify-center text-[#040814] font-black text-[10px] md:text-xs overflow-hidden border border-white shrink-0">
              <span>{initials}</span>
            </div>
            <span className="font-bold text-[13px] text-[#040814] whitespace-nowrap hidden sm:block">
              {displayName}
            </span>
            <ChevronDown
              size={14}
              className={`mr-1 hidden sm:block transition-all duration-300 ${isProfileOpen ? 'rotate-180 text-[#040814]' : 'text-gray-400'}`}
            />
          </button>

          {/* Profile Dropdown */}
          <div
            className={`absolute top-14 left-0 w-60 bg-white rounded-2xl shadow-lg border border-gray-200 z-50 overflow-hidden transition-all duration-200 origin-top-left ${
              isProfileOpen
                ? 'opacity-100 scale-100 visible'
                : 'opacity-0 scale-95 invisible'
            }`}>
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <p className="font-black text-[#040814]">{displayName}</p>
              {roleName && (
                <p className="text-xs font-medium text-gray-500 mt-1">
                  {roleName}
                </p>
              )}
            </div>
            <div className="flex flex-col py-2">
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 text-[13px] font-bold text-gray-700 transition-colors">
                <User size={18} className="text-gray-400" />
                الملف الشخصي
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 text-[13px] font-bold text-gray-700 transition-colors">
                <Settings size={18} className="text-gray-400" />
                إعدادات الحساب
              </Link>
            </div>
            <div className="border-t border-gray-100 py-2 bg-rose-50/30">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-rose-50 text-[13px] font-bold text-rose-600 transition-colors text-right cursor-pointer">
                <LogOut size={18} />
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
