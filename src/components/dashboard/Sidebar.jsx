'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Archive,
  Boxes,
  LayoutGrid,
  Users,
  TrendingUp,
  ArrowLeftRight,
  Files,
  UserCog,
  ShieldCheck,
  Bell,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import Logo from '../ui/Logo';
import { useSidebar } from './SidebarContext';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  {
    icon: LayoutDashboard,
    path: '/dashboard',
    label: 'لوحة التحكم',
    permissionKey: 'view_dashboard',
  },
  {
    icon: Archive,
    path: '/orders',
    label: 'الطلبات',
    permissionKey: 'view_orders',
  },
  {
    icon: Boxes,
    path: '/dashboard/categories',
    label: 'التصنيفات',
    permissionKey: 'view_categories',
  },
  {
    icon: LayoutGrid,
    path: '/dashboard/products',
    label: 'المنتجات',
    permissionKey: 'view_products',
  },
  {
    icon: Users,
    path: '/dashboard/customers',
    label: 'العملاء',
    permissionKey: 'view_customers',
  },
  {
    icon: TrendingUp,
    path: '/dashboard/finance',
    label: 'النظرة المالية',
    permissionKey: 'view_dashboard',
  },
  {
    icon: ArrowLeftRight,
    path: '/dashboard/transactions',
    label: 'العمليات المالية',
    permissionKey: 'view_dashboard',
  },
  {
    icon: Bell,
    path: '/dashboard/notifications',
    label: 'الإشعارات',
    permissionKey: 'view_dashboard',
  },
  {
    icon: Files,
    path: '/dashboard/reports',
    label: 'التقارير',
    permissionKey: 'view_reports',
  },
  {
    icon: UserCog,
    path: '/dashboard/users',
    label: 'المستخدمين',
    permissionKey: 'manage_users',
  },
  {
    icon: ShieldCheck,
    path: '/dashboard/roles',
    label: 'الأدوار',
    permissionKey: 'manage_roles',
  },
  {
    icon: Settings,
    path: '/dashboard/settings',
    label: 'الإعدادات',
    permissionKey: 'manage_settings',
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const { hasPermission, logout } = useAuth();

  const authorizedNavItems = navItems.filter((item) =>
    hasPermission(item.permissionKey),
  );

  const handleLogout = () => {
    if (window.innerWidth < 768) closeSidebar();
    logout();
  };

  return (
    <>
      <aside
        className={`
        group bg-[#040814]/95 backdrop-blur-xl h-screen fixed right-0 top-0 flex flex-col py-8 z-50 isolate
        transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        md:rounded-l-[40px]  overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
        ${
          isSidebarOpen
            ? 'w-[280px] md:w-[260px] translate-x-0 opacity-100 flex'
            : 'hidden md:flex w-[100px] md:hover:w-[260px] md:opacity-100 md:translate-x-0'
        }
      `}>
        {/* Mobile Header */}
        <div
          className={`md:hidden flex justify-between items-center px-6 mb-8 shrink-0 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-white font-black text-xl">القائمة</span>
          <button
            onClick={closeSidebar}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:text-rose-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Logo Section */}
        <div className="mb-10 md:mb-12 flex items-center shrink-0 w-full overflow-hidden">
          <Link
            href="/"
            className="flex items-center w-[280px] md:w-[260px] shrink-0">
            <div className="w-[100px] flex items-center justify-center shrink-0">
              <div className="scale-75 md:scale-90">
                <Logo size={60} light />
              </div>
            </div>
            <span
              className={`text-white font-black text-2xl transition-all duration-300 whitespace-nowrap ${
                isSidebarOpen
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-4 md:group-hover:opacity-100 md:group-hover:translate-x-0'
              }`}>
              ربزان
            </span>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 w-full flex flex-col gap-1.5 md:gap-2 relative overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-3 md:px-0">
          {authorizedNavItems.map((item) => {
            const isActive =
              pathname === item.path ||
              (pathname === '/' && item.path === '/dashboard') ||
              (pathname.startsWith(item.path + '/') &&
                item.path !== '/dashboard');

            return (
              <div
                key={item.path}
                className="relative w-full h-[54px] md:h-[60px] flex items-center shrink-0">
                {isActive && (
                  <>
                    <div className="absolute top-0 right-0 md:right-4 left-0 bottom-0 bg-linear-to-l from-white/10 to-white/5 md:bg-[#FAFBFC] rounded-r-2xl md:rounded-r-full z-0 transition-all duration-300" />
                    {/* Inverted Radius (Notches) - Always visible when active */}
                    <div className="hidden md:block absolute -top-6 left-0 w-6 h-6 bg-[#FAFBFC] z-0 transition-opacity duration-300 opacity-100">
                      <div className="w-full h-full bg-[#040814] rounded-bl-[24px]" />
                    </div>
                    <div className="hidden md:block absolute -bottom-6 left-0 w-6 h-6 bg-[#FAFBFC] z-0 transition-opacity duration-300 opacity-100">
                      <div className="w-full h-full bg-[#040814] rounded-tl-[24px]" />
                    </div>
                  </>
                )}

                <Link
                  href={item.path}
                  onClick={() => {
                    if (window.innerWidth < 768) closeSidebar();
                  }}
                  className={`relative z-10 flex items-center h-full transition-all w-[280px] md:w-[260px] shrink-0 duration-300 ${
                    isActive
                      ? 'text-amber-400 md:text-[#040814]'
                      : 'text-white/60 hover:text-white'
                  }`}>
                  <div className="w-[100px] h-full flex items-center justify-center shrink-0">
                    <item.icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
                  </div>

                  <span
                    className={`font-bold text-sm md:text-[15px] transition-all duration-300 whitespace-nowrap ${
                      isSidebarOpen
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 translate-x-4 md:group-hover:opacity-100 md:group-hover:translate-x-0'
                    }`}>
                    {item.label}
                  </span>
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="mt-auto w-full pt-4 shrink-0 border-t border-white/5 px-3 md:px-0 overflow-hidden">
          <button
            onClick={handleLogout}
            className="relative w-[280px] md:w-[260px] h-[54px] md:h-[60px] flex items-center text-white/50 hover:text-rose-500 transition-colors group/logout shrink-0 cursor-pointer">
            <div className="w-[100px] h-full flex items-center justify-center shrink-0">
              <LogOut size={22} strokeWidth={1.5} className="rotate-180" />
            </div>

            <span
              className={`font-bold text-sm md:text-[15px] transition-all duration-300 whitespace-nowrap ${
                isSidebarOpen
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-4 md:group-hover:opacity-100 md:group-hover:translate-x-0'
              }`}>
              تسجيل الخروج
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
