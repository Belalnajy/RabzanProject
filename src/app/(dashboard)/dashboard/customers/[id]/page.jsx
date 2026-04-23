'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../../../components/dashboard/Header';
import { 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  Eye, 
  FileEdit, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  PieChart, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  History,
  CheckCircle2,
  Package,
  MessageSquare,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Mock Data for a single client
const CLIENT_DETAILS = {
  id: 'CLI-00123',
  name: 'سارة عبدالرحمن',
  company: 'المستقبل للاستيراد',
  phone: '+971 52 678 9012',
  email: 'sara.abdulrahman@futureimport.ae',
  country: 'UAE',
  address: 'Dubai Silicon Oasis, DDP Building A2, Office 405, Dubai, United Arab Emirates',
  avatar: 'SA',
  financials: [
    { label: 'إجمالي الإيرادات', value: '4,120,000 USD', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'المبلغ المدفوع', value: '3,875,000 USD', icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'المديونية المعلقة', value: '245,000 USD', icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: 'إجمالي العمولات', value: '206,000 USD', icon: DollarSign, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'العمولة المستلمة', value: '193,750 USD', icon: PieChart, color: 'text-purple-500', bg: 'bg-purple-50' },
  ],
  orders: [
    { id: 'ORD-12456', products: 'Industrial Valves, Steel Pipes', quantity: 350, total: '125,000 USD', status: 'مكتمل', priority: 'عالية', date: '2024-02-20' },
    { id: 'ORD-12456', products: 'Industrial Valves, Steel Pipes', quantity: 350, total: '125,000 USD', status: 'مكتمل', priority: 'عالية', date: '2024-02-20' },
  ],
  topProducts: [
    { name: 'صمامات صناعية', category: 'Industrial Valves', avg: 150, orders: '24x', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80' },
    { name: 'صمامات صناعية', category: 'Industrial Valves', avg: 150, orders: '24x', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80' },
    { name: 'صمامات صناعية', category: 'Industrial Valves', avg: 150, orders: '24x', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80' },
    { name: 'صمامات صناعية', category: 'Industrial Valves', avg: 150, orders: '24x', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80' },
  ],
  payments: [
    { id: 'ORD-12456', amount: '125,000 USD', method: 'Bank Transfer', status: 'مكتمل', date: '2024-02-22' },
    { id: 'ORD-12245', amount: '210,000 USD', method: 'Letter of Credit', status: 'مكتمل', date: '2024-02-12' },
  ],
  activities: [
    { user: 'أحمد محمد', action: 'أضاف طلب', target: 'ORD-12456', date: '2024-02-20 10:30 AM' }
  ]
};

export default function ClientDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const client = CLIENT_DETAILS;

  return (
    <div dir="rtl" className="pb-10">
      {/* Header */}
      <Header title="تفاصيل العميل" subtitle="بيانات العميل المالية والتجارية" variant="card" />

      {/* Main Container */}
      <div className="mt-8 space-y-8 max-w-[1400px] mx-auto">
        
        {/* ================= SECTION 1: CLIENT OVERVIEW ================= */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col lg:flex-row">
          {/* Quick Actions Sidebar */}
          <div className="lg:w-[300px] bg-gray-50/50 p-8 border-l border-gray-100">
            <h3 className="text-xl font-black text-[#040814] mb-8">إجراءات سريعة</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center gap-3 bg-amber-50 text-[#B08B3A] p-4 rounded-2xl font-bold text-sm hover:bg-amber-100 transition-all border border-amber-100 shadow-sm group">
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                إضافة طلب جديد
              </button>
              <button className="w-full flex items-center gap-3 bg-blue-50 text-blue-600 p-4 rounded-2xl font-bold text-sm hover:bg-blue-100 transition-all border border-blue-100 shadow-sm">
                <Eye size={20} />
                عرض جميع الطلبات
              </button>
              <button className="w-full flex items-center gap-3 bg-emerald-50 text-emerald-600 p-4 rounded-2xl font-bold text-sm hover:bg-emerald-100 transition-all border border-emerald-100 shadow-sm">
                <Plus size={20} />
                إضافة دفعة
              </button>
            </div>
            <button className="mt-12 w-full flex items-center justify-center gap-2 bg-[#B08B3A] text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all">
              <FileEdit size={18} />
              تعديل بيانات العميل
            </button>
          </div>

          {/* Client Main Info */}
          <div className="flex-1 p-10 relative">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 bg-amber-500 rounded-[32px] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-amber-500/10">
                  {client.avatar}
                </div>
                <div>
                  <h2 className="text-4xl font-black text-[#040814] mb-2">{client.name}</h2>
                  <p className="text-[#B08B3A] font-black text-lg tracking-wider uppercase">{client.company}</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-y-10 gap-x-20 mt-16">
              <div className="space-y-1">
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">رقم الهاتف</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                    <Phone size={18} />
                  </div>
                  <p className="text-[#040814] font-black text-lg" dir="ltr">{client.phone}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">الدولة</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                    <MapPin size={18} />
                  </div>
                  <p className="text-[#040814] font-black text-lg">{client.country}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">البريد الإلكتروني</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                    <Mail size={18} />
                  </div>
                  <p className="text-[#040814] font-black text-lg">{client.email}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">العنوان</p>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                    <MapPin size={18} />
                  </div>
                  <p className="text-[#040814] font-bold text-sm leading-relaxed max-w-xs">{client.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SECTION 2: FINANCIAL SUMMARY ================= */}
        <div className="space-y-6">
          <h3 className="text-2xl font-black text-[#040814] pr-2">الملخص المالي</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {client.financials.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                  </div>
                  <p className="text-gray-400 font-bold text-[11px] mb-1 uppercase tracking-widest leading-tight">{item.label}</p>
                  <p className={`text-xl font-black ${item.color}`}>{item.value}</p>
                  <div className={`absolute bottom-0 right-0 w-20 h-1 bg-gradient-to-l from-transparent via-${item.color.split('-')[1]}-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= SECTION 3: ORDER HISTORY ================= */}
        <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-[#040814]">سجل الطلبات</h3>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 font-bold text-xs">Showing 1-6 of 20 Order</span>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100"><ChevronRight size={16} /></button>
                <span className="text-[11px] font-black px-2">Page 1/6</span>
                <button className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100"><ChevronLeft size={16} /></button>
              </div>
            </div>
          </div>

          <table className="w-full text-right border-separate border-spacing-y-4 px-2">
            <thead>
              <tr className="text-gray-400 font-black text-[10px] uppercase tracking-widest">
                <th className="pb-2 px-6">رقم الطلب</th>
                <th className="pb-2 px-6 text-center">المنتجات</th>
                <th className="pb-2 px-6 text-center">الكمية</th>
                <th className="pb-2 px-6 text-center">المبلغ الإجمالي</th>
                <th className="pb-2 px-6 text-center">الحالة</th>
                <th className="pb-2 px-6 text-center">الأولوية</th>
                <th className="pb-2 px-6 text-center">التاريخ</th>
                <th className="pb-2 px-6 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {client.orders.map((order, idx) => (
                <tr key={idx} className="group">
                  <td className="py-5 px-6 font-bold text-[13px] text-[#040814] border border-gray-50 rounded-r-3xl bg-white shadow-sm group-hover:bg-gray-50/50 transition-colors">{order.id}</td>
                  <td className="py-5 px-6 text-center font-bold text-[13px] text-gray-600 border-y border-gray-50 bg-white group-hover:bg-gray-50/50 transition-colors">{order.products}</td>
                  <td className="py-5 px-6 text-center font-bold text-[13px] text-[#040814] border-y border-gray-50 bg-white group-hover:bg-gray-50/50 transition-colors">{order.quantity}</td>
                  <td className="py-5 px-6 text-center font-black text-[13px] text-[#040814] border-y border-gray-50 bg-white group-hover:bg-gray-50/50 transition-colors">{order.total}</td>
                  <td className="py-5 px-6 text-center border-y border-gray-50 bg-white group-hover:bg-gray-50/50 transition-colors">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[11px] font-black">{order.status}</span>
                  </td>
                  <td className="py-5 px-6 text-center border-y border-gray-50 bg-white group-hover:bg-gray-50/50 transition-colors">
                    <span className="text-rose-500 font-black text-[11px]">{order.priority}</span>
                  </td>
                  <td className="py-5 px-6 text-center font-bold text-[13px] text-gray-400 border-y border-gray-50 bg-white group-hover:bg-gray-50/50 transition-colors">{order.date}</td>
                  <td className="py-5 px-6 text-center border border-gray-50 rounded-l-3xl bg-white shadow-sm group-hover:bg-gray-50/50 transition-colors">
                    <button className="text-gray-300 hover:text-[#040814] transition-colors"><Eye size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= SECTION 4: TOP PRODUCTS ================= */}
        <div className="space-y-6">
          <h3 className="text-2xl font-black text-[#040814] pr-2">المنتجات الأكثر طلبًا</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {client.topProducts.map((prod, idx) => (
              <div key={idx} className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                <div className="relative aspect-video overflow-hidden">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur shadow-sm rounded-full text-[10px] font-black text-amber-600">{prod.orders}</span>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h4 className="text-xl font-black text-[#040814] mb-1">{prod.name}</h4>
                  <p className="text-gray-400 font-bold text-xs mb-4 uppercase tracking-wider">{prod.category}</p>
                  <div className="inline-block px-4 py-1.5 bg-gray-50 rounded-xl text-gray-400 text-[11px] font-bold mb-6">متوسط: {prod.avg}</div>
                  <button className="w-full py-4 rounded-2xl bg-[#B08B3A] text-white font-black text-sm hover:bg-[#906c27] transition-all shadow-lg shadow-amber-500/10 active:scale-95">عرض المنتج</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= SECTION 5: ACTIVITY & PAYMENTS ================= */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Activity Log */}
          <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm">
            <h3 className="text-2xl font-black text-[#040814] mb-8">سجل النشاط</h3>
            <div className="space-y-6">
              <div className="relative">
                <textarea 
                  rows="3" 
                  placeholder="إضافة ملاحظة داخلية..." 
                  className="w-full bg-gray-50 border border-gray-100 rounded-3xl p-6 font-bold text-sm outline-none focus:bg-white focus:border-[#B08B3A] transition-all resize-none shadow-inner"
                ></textarea>
                <button className="absolute bottom-4 left-4 bg-[#B08B3A] text-white px-6 py-2 rounded-xl font-black text-xs hover:bg-[#906c27] transition-all shadow-md">إضافة</button>
              </div>
              
              <div className="space-y-4 pt-4">
                {client.activities.map((act, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-5 bg-gray-50 rounded-3xl border border-gray-100 group hover:bg-white transition-all">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-amber-500 shadow-sm border border-gray-50 group-hover:scale-110 transition-transform">
                      <History size={18} />
                    </div>
                    <div>
                      <p className="text-[#040814] font-bold text-sm mb-1 leading-relaxed">
                        <span className="font-black text-amber-600">{act.user}</span> {act.action} طلب <span className="font-black underline">{act.target}</span>
                      </p>
                      <p className="text-gray-400 font-bold text-[10px] uppercase">{act.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Record */}
          <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-[#040814]">سجل الدفعات</h3>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100"><ChevronRight size={16} /></button>
                <span className="text-[11px] font-black px-2">Page 1/6</span>
                <button className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100"><ChevronLeft size={16} /></button>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              {client.payments.map((pay, idx) => (
                <div key={idx} className="p-6 bg-white border border-gray-100 rounded-[32px] shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-amber-50 group-hover:text-amber-500 transition-colors">
                        <Package size={18} />
                      </div>
                      <span className="font-black text-sm text-[#040814]">{pay.id}</span>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black">{pay.status}</span>
                  </div>
                  
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-black text-[#040814] mb-1">{pay.amount}</p>
                      <p className="text-gray-400 font-bold text-[11px] uppercase tracking-wider">{pay.method}</p>
                    </div>
                    <p className="text-gray-400 font-bold text-xs">{pay.date}</p>
                  </div>
                  {/* Decorative bar */}
                  <div className="absolute left-0 top-0 h-full w-1.5 bg-emerald-500/20"></div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-50 text-center">
              <span className="text-gray-300 font-black text-[10px] uppercase tracking-widest">Showing 1-6 of 20 payment</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
