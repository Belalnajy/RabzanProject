'use client';

import React, { useState } from 'react';
import Header from '../../../../components/dashboard/Header';
import { 
  Plus, History, Wallet, CreditCard, Receipt, PiggyBank, DollarSign,
  FileText, FileImage, FileSpreadsheet, Download, Trash2, Eye,
  CheckCircle2, AlertTriangle, Truck, Package, Box, Settings, Lock, RefreshCw, Check
} from 'lucide-react';

import PaymentModal from '../../../../components/dashboard/modals/PaymentModal';
import UploadModal from '../../../../components/dashboard/modals/UploadModal';
import StageUpdateModal from '../../../../components/dashboard/modals/StageUpdateModal';
import ConfirmDangerModal from '../../../../components/dashboard/modals/ConfirmDangerModal';

// ==========================================
// PLACEHOLDER STATE & CONSTANTS
// TODO: Replace these with API data fetched via useEffect/React Query
// ==========================================

const ORDER_INFO = {
  id: 'ORD-2024-1284',
  clientName: 'شركة النخبة',
  productName: 'إلكترونيات',
};

const FINANCIALS = {
  totalOrderValue: 150000,
  amountPaid: 80000,
  amountRemaining: 70000,
  totalCommission: 12500,
  commissionReceived: 8000,
  currency: 'EGP'
};

const PAYMENTS_HISTORY = [
  { id: 1, status: 'مكتمل', date: '10 ديسمبر 2024', amount: 25000, type: 'من الطلب الرئيسي', ref: '#TRX-2024-001 - تحويل بنكي', user: 'سارة أحمد' },
  { id: 2, status: 'مكتمل', date: '15 ديسمبر 2024', amount: 30000, type: 'من العمولة', ref: '#TRX-2024-002 - تحويل بنكي', user: 'سارة أحمد' },
  { id: 3, status: 'مكتمل', date: '16 ديسمبر 2024', amount: 25000, type: 'من الطلب الرئيسي', ref: '#TRX-2024-003 - تحويل بنكي', user: 'سارة أحمد' },
];

const ORDER_STAGES = [
  { id: 1, name: 'عرض السعر', status: 'completed', icon: FileText },
  { id: 2, name: 'التعميد', status: 'completed', icon: CheckCircle2 },
  { id: 3, name: 'وصول الحوالة', status: 'completed', icon: CreditCard },
  { id: 4, name: 'التصنيع', status: 'completed', icon: Settings },
  { id: 5, name: 'تشييك', status: 'current', icon: AlertTriangle },
  { id: 6, name: 'شحن', status: 'pending', icon: Truck },
  { id: 7, name: 'سابر', status: 'pending', icon: Box },
  { id: 8, name: 'وصول الشحنة', status: 'pending', icon: Package },
  { id: 9, name: 'استلام العمولة', status: 'pending', icon: DollarSign },
  { id: 10, name: 'إغلاق', status: 'pending', icon: Lock },
];

const ATTACHMENTS = [
  { id: 1, name: 'Purchase_Order.pdf', size: '2.4 MB', timeAgo: 'منذ 3 أيام', user: 'محمد أحمد', type: 'pdf' },
  { id: 2, name: 'Product_Specifications.jpg', size: '1.8 MB', timeAgo: 'منذ 3 أيام', user: 'محمد أحمد', type: 'image' },
  { id: 3, name: 'Shipping_Details.xlsx', size: '856 KB', timeAgo: 'منذ 3 أيام', user: 'محمد أحمد', type: 'excel' },
];

// Helper to format currency
const formatMoney = (amount) => amount.toLocaleString();

export default function OrderDetailsPage() {
  // Local states for modals/actions
  // TODO: Bind these to respective handlers and API POST requests
  const [activeModal, setActiveModal] = useState(null); // 'payment', 'upload', 'stageUpdate', 'confirmDanger'

  return (
    <>
      {/* Top Header Card */}
      <Header title={`طلب #${ORDER_INFO.id}`} subtitle="" variant="card" />

      {/* Page Identifiers */}
      <div className="mb-10">
        <h2 className="text-[32px] font-black text-[#040814] mb-2">طلب #{ORDER_INFO.id}</h2>
        <p className="text-gray-400 font-bold text-lg">{ORDER_INFO.clientName} - {ORDER_INFO.productName}</p>
      </div>

      <div className="space-y-12">
        
        {/* ================= SECTION 1: FINANCIAL OVERVIEW ================= */}
        <section>
          <div className="flex flex-wrap items-end justify-between mb-6 gap-4">
            <div>
              <h3 className="text-2xl font-black text-[#040814] mb-1">نظرة مالية شاملة</h3>
              <p className="text-gray-500 font-medium text-sm">ملخص تفصيلي للمعاملات المالية للطلب</p>
            </div>
            <button 
              onClick={() => setActiveModal('payment')}
              className="flex items-center gap-2 bg-[#B08B3A] hover:bg-[#906c27] text-white px-5 py-3 rounded-xl font-bold text-sm transition-colors shadow-sm"
            >
              <Plus size={18} strokeWidth={2.5} />
              إضافة دفعة جديدة
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* 1. Total Order */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 text-center shadow-sm">
              <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center bg-orange-100 text-orange-500">
                <Wallet size={20} />
              </div>
              <p className="font-bold text-sm text-[#040814] mb-1">إجمالي قيمة الطلب</p>
              <p className="font-black text-xl text-orange-500">
                {formatMoney(FINANCIALS.totalOrderValue)} <span className="text-xs text-gray-400">{FINANCIALS.currency}</span>
              </p>
            </div>
            
            {/* 2. Paid */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 text-center shadow-sm relative overflow-hidden">
              <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center bg-emerald-100 text-emerald-500 relative z-10">
                <CheckCircle2 size={20} />
              </div>
              <p className="font-bold text-sm text-[#040814] mb-1 relative z-10">المبلغ المدفوع</p>
              <p className="font-black text-xl text-emerald-500 relative z-10">
                {formatMoney(FINANCIALS.amountPaid)} <span className="text-xs text-gray-400">{FINANCIALS.currency}</span>
              </p>
              {/* Decorative accent */}
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-emerald-50 rounded-full border border-emerald-100/50 z-0 pointer-events-none"></div>
            </div>

            {/* 3. Remaining */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 text-center shadow-sm">
              <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center bg-rose-100 text-rose-500">
                <AlertTriangle size={20} />
              </div>
              <p className="font-bold text-sm text-[#040814] mb-1">المبلغ المتبقي</p>
              <p className="font-black text-xl text-rose-500">
                {formatMoney(FINANCIALS.amountRemaining)} <span className="text-xs text-gray-400">{FINANCIALS.currency}</span>
              </p>
            </div>

            {/* 4. Total Comm */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 text-center shadow-sm">
              <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center bg-amber-100 text-amber-500">
                <DollarSign size={20} />
              </div>
              <p className="font-bold text-sm text-[#040814] mb-1">إجمالي العمولة</p>
              <p className="font-black text-xl text-amber-500">
                {formatMoney(FINANCIALS.totalCommission)} <span className="text-xs text-gray-400">{FINANCIALS.currency}</span>
              </p>
            </div>

            {/* 5. Received Comm */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 text-center shadow-sm">
              <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center bg-purple-100 text-purple-600">
                <PiggyBank size={20} />
              </div>
              <p className="font-bold text-sm text-[#040814] mb-1">العمولة المستلمة</p>
              <p className="font-black text-xl text-purple-600">
                {formatMoney(FINANCIALS.commissionReceived)} <span className="text-xs text-gray-400">{FINANCIALS.currency}</span>
              </p>
            </div>
          </div>
        </section>

        {/* ================= SECTION 2: PAYMENT HISTORY ================= */}
        <section className="bg-white rounded-[32px] p-6 md:p-8 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <History className="text-[#B08B3A]" size={24} />
            <h3 className="text-2xl font-black text-[#040814]">سجل الدفعات</h3>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
            {PAYMENTS_HISTORY.map((payment) => (
              <div key={payment.id} className="min-w-[320px] bg-white border border-gray-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full">
                    {payment.status}
                  </span>
                  <span className="text-gray-400 text-xs font-bold">{payment.date}</span>
                </div>

                {/* Amount & Doc Icon */}
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h4 className="text-2xl font-black text-emerald-500 mb-1 leading-none">{formatMoney(payment.amount)} EGP</h4>
                    <p className="text-xs font-bold text-gray-400 border border-gray-200 rounded-full inline-block px-3 py-1 bg-gray-50">
                      {payment.type}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/30 transform group-hover:scale-105 transition-transform">
                    <FileText size={28} />
                  </div>
                </div>

                {/* Meta details */}
                <div className="flex justify-between items-center border-t border-gray-100 pt-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center"><UserIcon /></div>
                    <span className="text-[11px] font-bold text-gray-500">{payment.user}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 block max-w-[130px] truncate" title={payment.ref}>{payment.ref}</span>
                </div>

                {/* Actions */}
                <div className="flex justify-between gap-3">
                  <button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-3 rounded-xl transition-colors text-center shadow-sm">
                    عرض الإيصال
                  </button>
                  <button className="flex-1 bg-white border border-amber-500 text-amber-500 hover:bg-amber-50 font-bold text-xs py-3 rounded-xl transition-colors text-center">
                    تحميل PDF
                  </button>
                </div>

              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6 text-sm font-bold border-t border-gray-100 pt-6">
            <span className="text-[#040814]">Showing 1-3 of 20 payments</span>
            <div className="flex items-center gap-4 bg-gray-50 rounded-full px-2 py-1 border border-gray-200">
              <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all text-gray-400">
                <ChevronRightIcon />
              </button>
              <span className="text-gray-800">Page 1/6</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm transition-all text-[#040814]">
                <ChevronLeftIcon />
              </button>
            </div>
          </div>
        </section>

        {/* ================= SECTION 3: ORDER STAGES ================= */}
        <section className="bg-white rounded-[32px] p-6 md:p-8 border border-gray-200 shadow-sm">
          <div className="flex flex-wrap items-center justify-between mb-12 gap-4 border-b border-gray-100 pb-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-[#B08B3A]" size={24} />
              <h3 className="text-2xl font-black text-[#040814]">مراحل تنفيذ الطلب</h3>
            </div>
            
            {/* TODO: Add logic to update the current stage */}
            <button 
              onClick={() => setActiveModal('stageUpdate')}
              className="flex items-center gap-2 bg-[#B08B3A] hover:bg-[#906c27] text-white px-5 py-3 rounded-xl font-bold text-sm transition-colors shadow-sm"
            >
              <RefreshCw size={18} strokeWidth={2.5} />
              تحديث المرحلة
            </button>
          </div>

          {/* Stepper Container */}
          <div className="relative flex justify-between items-start w-full px-4 overflow-x-auto pb-6 custom-scrollbar">
            {/* Background connecting line */}
            <div className="absolute top-7 left-10 right-10 h-1 bg-gray-100 z-0"></div>

            {ORDER_STAGES.map((stage, idx) => {
              const SystemIcon = stage.icon;
              const isCompleted = stage.status === 'completed';
              const isCurrent = stage.status === 'current';
              const isPending = stage.status === 'pending';

              let circleClasses = "w-14 h-14 rounded-full flex items-center justify-center z-10 transition-all border-[3px] border-white shadow-sm ring-2 ";
              let activeLine = null;

              if (isCompleted) {
                circleClasses += "bg-emerald-500 text-white ring-emerald-100";
              } else if (isCurrent) {
                circleClasses += "bg-amber-500 text-white ring-amber-100 scale-110 shadow-md";
              } else {
                circleClasses += "bg-gray-400 text-white ring-transparent shadow-none";
              }

              // Draw active line connecting up to the current stage
              if (idx < ORDER_STAGES.length - 1 && (isCompleted || isCurrent)) {
                 activeLine = <div className={`absolute top-7 h-1 z-0 ${isCompleted ? 'bg-emerald-500' : 'bg-gray-100'}`} style={{ width: '100%', right: '50%' }}></div>;
              }

              return (
                <div key={stage.id} className="relative flex flex-col items-center flex-1 min-w-[90px]">
                  {activeLine}
                  <div className={circleClasses}>
                    <SystemIcon size={22} />
                  </div>
                  <p className={`mt-4 text-xs font-bold text-center ${isCompleted ? 'text-emerald-600' : isCurrent ? 'text-amber-600' : 'text-gray-500'}`}>
                    {stage.name}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= SECTION 4: ATTACHMENTS ================= */}
        <section className="bg-white rounded-[32px] p-6 md:p-8 border border-gray-200 shadow-sm">
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4 border-b border-gray-100 pb-6">
            <div className="flex items-center gap-3">
              <div className="text-[#B08B3A] rotate-45"><Check size={24} /></div> {/* Used as paperclip substitute for UI context */}
              <h3 className="text-2xl font-black text-[#040814]">المرفقات</h3>
            </div>
            
            {/* TODO: Connect to file upload handler */}
            <button 
              onClick={() => setActiveModal('upload')}
              className="flex items-center gap-2 bg-[#B08B3A] hover:bg-[#906c27] text-white px-5 py-3 rounded-xl font-bold text-sm transition-colors shadow-sm"
            >
              <Download size={18} className="rotate-180" strokeWidth={2.5} />
              رفع ملف جديد
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {ATTACHMENTS.map((file) => {
              // Map types to icons & colors
              let FileIcon = FileText;
              let iconBg = 'bg-amber-100';
              let iconColor = 'text-amber-500';

              if (file.type === 'pdf') {
                FileIcon = FileText;
                iconBg = 'bg-orange-500';
                iconColor = 'text-white';
              } else if (file.type === 'image') {
                FileIcon = FileImage;
                iconBg = 'bg-amber-400';
                iconColor = 'text-white';
              } else if (file.type === 'excel') {
                FileIcon = FileSpreadsheet;
                iconBg = 'bg-amber-500';
                iconColor = 'text-white';
              }

              return (
                <div key={file.id} className="flex justify-between items-center border border-gray-200 rounded-2xl p-4 md:p-6 hover:shadow-md transition-shadow bg-white group">
                  
                  {/* File Info (Right Side) */}
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 ${iconBg} ${iconColor}`}>
                      <FileIcon size={28} />
                    </div>
                    <div>
                      <h4 className="text-[#040814] font-black text-[15px] mb-2">{file.name}</h4>
                      <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                        <span className="flex items-center gap-1"><UserIcon size={14} className="text-gray-400"/> {file.user}</span>
                        <span className="flex items-center gap-1"><History size={14} className="text-gray-400"/> {file.timeAgo}</span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200">{file.size}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions (Left Side) */}
                  <div className="flex items-center gap-3">
                    <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#040814] hover:text-white transition-colors">
                      <Eye size={18} />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#B08B3A] hover:text-white transition-colors">
                      <Download size={18} />
                    </button>
                    {/* TODO: Connect delete handler */}
                    <button onClick={() => setActiveModal('confirmDanger')} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-rose-500 hover:text-white transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>

      {/* ================= MODALS ================= */}
      
      <PaymentModal 
        isOpen={activeModal === 'payment'} 
        onClose={() => setActiveModal(null)}
        onSubmit={() => {
          console.log("Payment Confirmed");
          setActiveModal(null);
        }}
      />

      <UploadModal 
        isOpen={activeModal === 'upload'} 
        onClose={() => setActiveModal(null)}
        onSubmit={() => {
          console.log("File Uploaded");
          setActiveModal(null);
        }}
      />

      <StageUpdateModal 
        isOpen={activeModal === 'stageUpdate'} 
        onClose={() => setActiveModal(null)}
        onSubmit={() => {
          console.log("Stage Updated");
          setActiveModal(null);
        }}
      />

      <ConfirmDangerModal 
        isOpen={activeModal === 'confirmDanger'} 
        onClose={() => setActiveModal(null)}
        onConfirm={() => {
          console.log("Action Confirmed");
          setActiveModal(null);
        }}
        title="أنت على وشك نقل الطلب من مرحلة الي اخري"
        subtitle="قد يؤثر هذا التغيير على سير تنفيذ الطلب."
      />

    </>
  );
}

// Inline helper Icons
function UserIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 10} height={props.size || 10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  );
}

function ChevronRightIcon(props) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 18 6-6-6-6"/></svg>
}

function ChevronLeftIcon(props) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m15 18-6-6 6-6"/></svg>
}
