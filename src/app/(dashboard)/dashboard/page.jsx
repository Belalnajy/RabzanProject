'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight, Box, DollarSign, Percent, AlertTriangle, ArrowLeft, Archive, UserCheck, Settings, FileText, Clock } from 'lucide-react';
import Header from '../../../components/dashboard/Header';

// ----------------------
// Reusable Sub-components
// ----------------------

const Sparkline = ({ color, gradientId }) => {
  return (
    <div className="mt-4 w-full h-12 relative">
      <svg viewBox="0 0 100 30" className="w-full h-full preserve-3d" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d="M 0 25 C 20 20, 30 10, 50 15 C 70 20, 80 5, 100 10 L 100 30 L 0 30 Z" fill={`url(#${gradientId})`} />
        <path d="M 0 25 C 20 20, 30 10, 50 15 C 70 20, 80 5, 100 10" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        
        {/* Data points */}
        <circle cx="50" cy="15" r="2.5" fill="white" stroke={color} strokeWidth="2" />
        <circle cx="100" cy="10" r="2.5" fill="white" stroke={color} strokeWidth="2" />
      </svg>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, iconColor, iconBg, trend, trendText, trendUp, sparklineColor, gradientId }) => (
  <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      
      {/* Right Column (Title & Value) */}
      <div className="flex flex-col text-right">
        <h3 className="text-[#040814] font-bold text-[13px] mb-5">{title}</h3>
        <p className="text-[28px] font-black text-[#040814]">{value}</p>
      </div>

      {/* Left Column (Icon & Trend) */}
      <div className="flex flex-col items-end">
        <div className="w-11 h-11 rounded-[14px] flex items-center justify-center opacity-90 mb-6" style={{ backgroundColor: iconBg, color: iconColor }}>
          <Icon size={20} />
        </div>
        <div className={`flex items-center gap-1.5 text-[11px] font-bold ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
          {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          <span className="whitespace-nowrap" dir="ltr">{trend}</span>
          <span className="whitespace-nowrap">{trendText}</span>
        </div>
      </div>
    </div>
    <Sparkline color={sparklineColor} gradientId={gradientId} />
  </div>
);

const PipelineCard = ({ title, value, percentage, icon: Icon, color, bg }) => (
  <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center">
    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: bg, color: color }}>
      <Icon size={18} />
    </div>
    <h3 className="text-[#040814] font-bold text-[13px] mb-2 whitespace-nowrap">{title}</h3>
    <p className="text-2xl font-black text-[#040814] mb-1">{value}</p>
    <span className="text-gray-500 text-[11px] font-bold">{percentage}</span>
  </div>
);

// ----------------------
// Main Page Component
// ----------------------

export default function DashboardPage() {
  return (
    <>
      <Header />

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="الطلبات النشطة" 
          value="1,284" 
          icon={Box}
          iconColor="#F59E0B" // Amber
          iconBg="#FEF3C7"
          trend="12%"
          trendText="من الشهر الماضي"
          trendUp={true}
          sparklineColor="#10B981"
          gradientId="grad-1"
        />
        <StatCard 
          title="الإيرادات الشهرية" 
          value="$847,392" 
          icon={DollarSign}
          iconColor="#3B82F6" // Blue
          iconBg="#DBEAFE"
          trend="8.2%"
          trendText="من الشهر الماضي"
          trendUp={true}
          sparklineColor="#10B981"
          gradientId="grad-2"
        />
        <StatCard 
          title="العمولات المعلقة" 
          value="$42,186" 
          icon={Percent}
          iconColor="#10B981" // Emerald
          iconBg="#D1FAE5"
          trend="3.1%"
          trendText="من الشهر الماضي"
          trendUp={false}
          sparklineColor="#10B981"
          gradientId="grad-3"
        />
        <StatCard 
          title="الشحنات المتأخرة" 
          value="28" 
          icon={AlertTriangle}
          iconColor="#E11D48" // Rose
          iconBg="#FFE4E6"
          trend="2"
          trendText="شحنات جديدة"
          trendUp={false} // Rising delayed shipments is marked as negative/red structurally
          sparklineColor="#10B981"
          gradientId="grad-4"
        />
      </div>

      {/* Order Pipeline Stages Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <PipelineCard title="الطلبات النشطة" value="142" percentage="11.1%" icon={FileText} color="#ffffff" bg="#94A3B8" />
        <PipelineCard title="الموافقة" value="89" percentage="6.9%" icon={UserCheck} color="#ffffff" bg="#10B981" />
        <PipelineCard title="التصنيع" value="234" percentage="18.2%" icon={Settings} color="#ffffff" bg="#F59E0B" />
        <PipelineCard title="الشحن" value="456" percentage="30.3%" icon={Box} color="#ffffff" bg="#D97706" />
        <PipelineCard title="الوصول" value="312" percentage="24.3%" icon={ArrowDownRight} color="#ffffff" bg="#059669" />
        <PipelineCard title="مغلق" value="51" percentage="4.1%" icon={Archive} color="#ffffff" bg="#EF4444" />
      </div>

      {/* Recent Orders Table / List */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-black text-[#040814]">آخر الطلبات</h2>
          <button className="text-[#B08B3A] font-bold text-sm flex items-center gap-1.5 hover:text-[#906c27] transition-colors">
            <ArrowLeft size={16} />
            عرض الكل
          </button>
        </div>

        <div className="flex flex-col gap-6">
          
          {/* Order Row 1 */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors px-3 rounded-xl">
            <div className="flex items-center gap-5">
              <div className="w-9 h-9 flex-shrink-0 rounded-full bg-emerald-100/60"></div>
              <div>
                <h4 className="text-[13px] font-bold text-[#040814] mb-2">#ORD-2024-1284</h4>
                <p className="text-[#040814] font-medium text-xs mb-3">شحنة إلكترونيات من الصين إلى جدة</p>
                <div className="flex items-center gap-4 mt-2 text-gray-500 text-[11px] font-bold">
                  <span className="flex items-center gap-1.5 ml-2">
                    <UserCheck size={14} />
                    شركة النخبة
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} />
                    قبل 2 ساعة
                  </span>
                </div>
              </div>
            </div>
            <div className="text-xl font-black text-[#040814]">
              $24,500
            </div>
          </div>

          {/* Order Row 2 */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors px-3 rounded-xl">
            <div className="flex items-center gap-5">
              <div className="w-9 h-9 flex-shrink-0 rounded-full bg-amber-200/60"></div>
              <div>
                <h4 className="text-[13px] font-bold text-[#040814] mb-2">#ORD-2024-1284</h4>
                <p className="text-[#040814] font-medium text-xs mb-3">شحنة إلكترونيات من الصين إلى جدة</p>
                <div className="flex items-center gap-4 mt-2 text-gray-500 text-[11px] font-bold">
                  <span className="flex items-center gap-1.5 ml-2">
                    <UserCheck size={14} />
                    شركة النخبة
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} />
                    قبل 2 ساعة
                  </span>
                </div>
              </div>
            </div>
            <div className="text-xl font-black text-[#040814]">
              $24,500
            </div>
          </div>

        </div>
      </div>

    </>
  );
}
