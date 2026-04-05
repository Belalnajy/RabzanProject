'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Search,
  ChevronDown,
  User,
  Settings,
  LogOut,
  CheckCircle2,
  Package,
  Menu,
} from 'lucide-react';
import { useSidebar } from './SidebarContext';
import Link from 'next/link';

export default function Header({
  title = 'لوحة التحكم الرئيسية',
  subtitle = 'مرحباً بك! إليك نظرة عامة على عملياتك اللوجستية',
  variant = 'transparent',
}) {
  const { toggleSidebar } = useSidebar();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Refs for clicking outside
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
            <span className="absolute top-2 left-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
          </button>

          {/* Notifications Dropdown */}
          <div
            className={`absolute top-14 left-0 w-80 sm:w-96 bg-white rounded-2xl shadow-lg border border-gray-200 z-50 overflow-hidden transition-all duration-200 origin-top-left ${
              isNotificationsOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
            }`}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-[#040814] text-sm">التنبيهات</h3>
              <button className="text-[11px] text-[#B08B3A] font-bold hover:underline">
                تحديد الكل كمقروء
              </button>
            </div>
            <div className="flex flex-col max-h-[320px] overflow-y-auto no-scrollbar">
              <div className="flex gap-4 p-4 border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer transition-colors relative">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                  <CheckCircle2 size={18} />
                </div>
                <div className="pt-0.5 min-w-0">
                  <p className="text-sm font-bold text-[#040814] truncate">تم تسليم الشحنة #ORD-1284</p>
                  <p className="text-xs font-medium text-gray-500 truncate">العميل استلم الشحنة بنجاح</p>
                  <span className="text-[10px] font-bold text-gray-400">منذ 5 دقائق</span>
                </div>
              </div>
            </div>
            <div className="p-3 border-t border-gray-100 bg-gray-50/50 text-center">
              <Link
                href="/notifications"
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
              <span>أ.م</span>
            </div>
            <span className="font-bold text-[13px] text-[#040814] whitespace-nowrap hidden sm:block">
              أحمد محمد
            </span>
            <ChevronDown
              size={14}
              className={`mr-1 hidden sm:block transition-all duration-300 ${isProfileOpen ? 'rotate-180 text-[#040814]' : 'text-gray-400'}`}
            />
          </button>

          {/* Profile Dropdown */}
          <div
            className={`absolute top-14 left-0 w-60 bg-white rounded-2xl shadow-lg border border-gray-200 z-50 overflow-hidden transition-all duration-200 origin-top-left ${
              isProfileOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
            }`}>
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <p className="font-black text-[#040814]">أحمد محمد</p>
              <p className="text-xs font-medium text-gray-500 mt-1">مدير النظام</p>
            </div>
            <div className="flex flex-col py-2">
              <Link href="/profile" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 text-[13px] font-bold text-gray-700 transition-colors">
                <User size={18} className="text-gray-400" />
                الملف الشخصي
              </Link>
              <Link href="/settings" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 text-[13px] font-bold text-gray-700 transition-colors">
                <Settings size={18} className="text-gray-400" />
                إعدادات الحساب
              </Link>
            </div>
            <div className="border-t border-gray-100 py-2 bg-rose-50/30">
              <button className="w-full flex items-center gap-3 px-5 py-3 hover:bg-rose-50 text-[13px] font-bold text-rose-600 transition-colors text-right">
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
