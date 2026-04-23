'use client';

import React from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import {
  SidebarProvider,
  useSidebar,
} from '../../components/dashboard/SidebarContext';

function DashboardContent({ children }) {
  const { isSidebarOpen, closeSidebar } = useSidebar();

  return (
    <div
      className="min-h-screen bg-[#F4F6F9] text-slate-900 overflow-x-hidden"
      dir="rtl">
      {/* Sidebar - no more direct props needed */}
      <Sidebar />

      {/* Main Content Area */}
      <main
        className={`min-h-screen transition-all duration-300 md:pr-[100px] w-full`}>
        <div className="max-w-[1600px] mx-auto p-4 md:p-8 lg:p-10">
          {children}
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}
