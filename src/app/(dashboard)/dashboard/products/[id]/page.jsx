'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../../../components/dashboard/Header';
import {
  ArrowRight,
  ArrowLeft,
  Plus,
  Package,
  Tag,
  User,
  DollarSign,
  TrendingUp,
  Zap,
  ShieldCheck,
  FileEdit,
  Trash2,
  Archive,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  History,
  Image as ImageIcon,
} from 'lucide-react';

// Mock Data for a single product (matches the list page data)
const PRODUCT_DETAILS = {
  id: 'PROD-00123',
  name: 'قماش قطني عالي الجودة',
  client: 'شركة النصر للتجارة',
  category: 'أقمشة',
  price: 150,
  currency: 'EGP',
  commission: '8%',
  totalOrders: 45,
  status: 'نشط',
  statusStyle: 'bg-emerald-50 text-emerald-600',
  description:
    'قماش قطني ممتاز 100% طبيعي، يتميز بنعومة الملمس والمتانة العالية. مناسب لجميع أنواع الملابس والمفروشات الفاخرة.',
  image:
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
  features: [
    'قطن طبيعي 100%',
    'مقاوم للانكماش',
    'ألوان ثابتة وحيوية',
    'سهل الكي والعناية',
  ],
  specs: {
    الخامة: 'قطن طويل التيلة',
    الوزن: '220 جرام/متر',
    العرض: '150 سم',
    'بلد المنشأ': 'مصر',
  },
};

export default function DashboardProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'orders', 'history'

  // TODO: Fetch real product data from API using the 'id'
  const product = PRODUCT_DETAILS; // Placeholder

  return (
    <div dir="rtl">
      {/* Header */}
      <Header
        title={`تفاصيل المنتج #${product.id}`}
        subtitle=""
        variant="card"
      />

      {/* Navigation & Actions */}
      <div className="flex flex-wrap items-center justify-between mb-10 gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/products"
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-gray-100 text-gray-500 hover:text-[#040814] hover:border-gray-300 transition-all shadow-sm group">
            <ArrowRight
              size={22}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
          <div>
            <h2 className="text-[32px] font-black text-[#040814] leading-none mb-2">
              {product.name}
            </h2>
            <div className="flex items-center gap-3 text-gray-400 font-bold text-sm">
              <span className="flex items-center gap-1.5">
                <Tag size={16} /> {product.category}
              </span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span className="flex items-center gap-1.5">
                <User size={16} /> {product.client}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-100 text-gray-700 px-5 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all shadow-sm">
            <Archive size={18} className="text-gray-400" />
            أرشفة
          </button>
          <button className="flex items-center gap-2 bg-[#B08B3A] hover:bg-[#906c27] text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-amber-500/10">
            <FileEdit size={18} strokeWidth={2.5} />
            تعديل المنتج
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Visuals & Stats */}
        <div className="lg:col-span-1 space-y-8">
          {/* Product Image Card */}
          <div className="bg-white rounded-[32px] border border-gray-100 p-4 shadow-sm overflow-hidden group">
            <div className="relative aspect-square rounded-[24px] overflow-hidden mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 right-4">
                <span
                  className={`px-4 py-2 rounded-full text-xs font-black shadow-lg backdrop-blur-md ${product.statusStyle}`}>
                  {product.status}
                </span>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-4 text-gray-500 font-bold text-sm hover:bg-gray-50 rounded-2xl transition-all">
              <ImageIcon size={18} />
              عرض المعرض (3 صور)
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="bg-[#040814] rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8 opacity-60">
                <TrendingUp size={20} />
                <span className="font-bold text-sm">أداء المنتج</span>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-gray-400 text-xs font-bold mb-1 uppercase tracking-wider">
                    إجمالي الإيرادات
                  </p>
                  <p className="text-3xl font-black text-amber-400">
                    {(product.price * product.totalOrders).toLocaleString()}{' '}
                    <span className="text-sm font-medium opacity-60">
                      {product.currency}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-bold mb-1 uppercase tracking-wider">
                    إجمالي الطلبات
                  </p>
                  <p className="text-2xl font-black">
                    {product.totalOrders}{' '}
                    <span className="text-sm font-medium opacity-60">طلب</span>
                  </p>
                </div>
              </div>
            </div>
            {/* Background Accent */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Info Card */}
          <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-8 border-b border-gray-50 pb-6">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                <Zap size={24} />
              </div>
              <h3 className="text-2xl font-black text-[#040814]">
                نظرة عامة على المنتج
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Description Section */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-[#B08B3A] font-black text-sm mb-3 uppercase tracking-widest">
                    الوصف التفصيلي
                  </h4>
                  <p className="text-gray-600 font-medium leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-[#B08B3A] font-black text-sm mb-4 uppercase tracking-widest">
                    الميزات الأساسية
                  </h4>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-3 text-gray-700 font-bold text-[13px]">
                        <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                          <CheckCircle2 size={12} strokeWidth={3} />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Financials & Specs */}
              <div className="space-y-8">
                <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                  <h4 className="text-[#040814] font-black text-[15px] mb-6">
                    المعلومات المالية
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200/50">
                      <span className="text-gray-500 font-bold text-sm">
                        السعر الافتراضي
                      </span>
                      <span className="text-[#040814] font-black">
                        {product.price} {product.currency}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-500 font-bold text-sm">
                        نسبة العمولة
                      </span>
                      <span className="text-amber-600 font-black">
                        {product.commission}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[#040814] font-black text-[15px] px-2">
                    المواصفات التقنية
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div
                        key={key}
                        className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                        <p className="text-gray-400 text-[10px] font-black mb-1 uppercase">
                          {key}
                        </p>
                        <p className="text-[#040814] font-bold text-sm">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-rose-50/30 rounded-[32px] border border-rose-100 p-8 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-500">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-rose-600 mb-1">
                  منطقة الخطر
                </h3>
                <p className="text-rose-400 font-bold text-sm">
                  حذف المنتج سيؤدي إلى إزالته نهائياً من قاعدة البيانات
                </p>
              </div>
            </div>
            <button className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-4 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-rose-500/20 active:scale-95">
              حذف المنتج نهائياً
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
