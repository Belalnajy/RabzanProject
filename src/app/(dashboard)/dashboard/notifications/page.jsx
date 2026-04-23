'use client';

import React, { useState } from 'react';
import Header from '../../../../components/dashboard/Header';
import { ChevronRight, ChevronLeft } from 'lucide-react';

// ==========================================
// MOCK DATA (API Ready)
// ==========================================
// TODO: Fetch notifications from API (e.g. GET /api/notifications?page=1)
const MOCK_NOTIFICATIONS = [
  { id: 1, message: 'أحمد محمد أضاف طلب ORD-12456', timestamp: '2026-02-20 10:30 AM', isUnread: true },
  { id: 2, message: 'أحمد محمد أضاف طلب ORD-12456', timestamp: '2026-02-20 10:30 AM', isUnread: true },
  { id: 3, message: 'أحمد محمد أضاف طلب ORD-12456', timestamp: '2026-02-20 10:30 AM', isUnread: true },
  { id: 4, message: 'أحمد محمد أضاف طلب ORD-12456', timestamp: '2026-02-20 10:30 AM', isUnread: true },
  { id: 5, message: 'أحمد محمد أضاف طلب ORD-12456', timestamp: '2026-02-20 10:30 AM', isUnread: true },
  { id: 6, message: 'أحمد محمد أضاف طلب ORD-12456', timestamp: '2026-02-20 10:30 AM', isUnread: true },
];

export default function NotificationsPage() {
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 6;
  const totalItems = 20;
  
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    // TODO: Fetch next page from API
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
    // TODO: Fetch previous page from API
  };

  return (
    <>
      <Header title="" subtitle="" variant="transparent" />

      {/* Page Header */}
      <div className="flex flex-col mb-8 mt-[-1rem]">
        <h1 className="text-2xl font-black text-[#040814] mb-1">الإشعارات</h1>
        <p className="text-sm font-bold text-gray-500">إعدادات الإشعارات</p>
      </div>

      {/* Notifications Container */}
      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 mb-12 flex flex-col gap-4">
        
        {/* List */}
        <div className="flex flex-col gap-4">
          {MOCK_NOTIFICATIONS.map((notif) => (
            <div 
              key={notif.id} 
              className="border border-gray-100 rounded-2xl px-6 py-5 flex flex-col bg-white hover:border-[#D4AF37]/30 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-1.5">
                {notif.isUnread && (
                  <div className="w-3 h-3 rounded-full bg-amber-500 shrink-0 shadow-sm" />
                )}
                <span className="text-[15px] font-black text-[#040814]">{notif.message}</span>
              </div>
              <span className="text-sm font-bold text-gray-400/80 mr-6" dir="ltr">
                {notif.timestamp}
              </span>
            </div>
          ))}
        </div>

        {/* Footer & Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 mt-2 border-t border-gray-50 gap-4">
          
          {/* Items Count */}
          <span className="text-[13px] font-black text-[#040814]" dir="ltr">
            Showing 1-6 of {totalItems} notifications
          </span>
          
          {/* Pagination Controls */}
          <div className="flex items-center gap-4 bg-gray-50 rounded-xl px-4 py-2 border border-gray-100">
            <button 
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-1 text-gray-400 hover:text-[#040814] disabled:opacity-30 disabled:hover:text-gray-400 transition-colors focus:outline-none"
            >
              <ChevronLeft size={18} strokeWidth={3} />
            </button>
            
            <span className="text-[13px] font-black text-[#040814]" dir="ltr">
              Page {currentPage}/{totalPages}
            </span>
            
            <button 
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-1 text-gray-400 hover:text-[#040814] disabled:opacity-30 disabled:hover:text-gray-400 transition-colors focus:outline-none"
            >
              <ChevronRight size={18} strokeWidth={3} />
            </button>
          </div>

        </div>

      </div>
    </>
  );
}
