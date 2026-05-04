'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Package,
  ArrowUpLeft,
  Truck,
  ShieldCheck,
  Zap,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import { CONTACT_INFO } from '../../constants/content';
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from '../../components/ui/Animations';
import './Products.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const ITEMS_PER_PAGE = 9;

const Products = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  // --- State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Fetch categories ---
  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  // --- Fetch products ---
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(currentPage));
      params.set('limit', String(ITEMS_PER_PAGE));
      params.set('status', 'active');
      if (searchTerm.trim()) params.set('search', searchTerm.trim());
      if (activeCategory !== 'all') params.set('category', activeCategory);

      const res = await fetch(`${API_URL}/products?${params.toString()}`);
      const json = await res.json();
      setProducts(json.data || []);
      setPagination(json.pagination || null);
    } catch {
      setProducts([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, activeCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // --- Debounced search ---
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleCategory = (catId) => {
    setActiveCategory(catId);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchTerm('');
    setActiveCategory('all');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || activeCategory !== 'all';
  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.totalItems || 0;

  const formatPrice = (n) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(Number(n) || 0);

  return (
    <div className="bg-white">
      <Navbar />

      {/* Products Hero */}
      <section className="relative pt-48 pb-32 bg-slate-950 overflow-hidden text-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-slate-950 z-10" />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-30 grayscale"
          />
        </div>
        <div className="container relative z-20">
          <FadeIn>
            <span className="section-label-gold inline-flex mb-6 text-white border-white/20 bg-white/5 backdrop-blur-md">
              <Package size={14} className="animate-pulse" />
              {t('products_page.hero.label')}
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[1.1]">
              {t('products_page.hero.title')}{' '}
              <span className="text-gold-gradient italic">
                {t('products_page.hero.title_suffix')}
              </span>
            </h1>
            <p className="text-xl text-slate-400 mt-10 max-w-2xl mx-auto leading-relaxed">
              {t('products_page.hero.description')}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Search & Filters Section */}
      <section className="py-12 bg-slate-50 border-b border-slate-200 sticky top-0 z-30 backdrop-blur-xl bg-slate-50/95">
        <div className="container">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <Search
              size={22}
              className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-6' : 'left-6'}`}
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t('products_page.search_placeholder') || 'ابحث عن منتج...'}
              className={`w-full py-5 rounded-2xl bg-white border border-slate-200 text-lg font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue shadow-sm transition-all ${isRTL ? 'pr-14 pl-6' : 'pl-14 pr-6'}`}
            />
            {searchInput && (
              <button
                onClick={() => { setSearchInput(''); }}
                className={`absolute top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors ${isRTL ? 'left-4' : 'right-4'}`}>
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => handleCategory('all')}
              className={`px-6 py-3 rounded-2xl font-black text-sm transition-all duration-300 ${
                activeCategory === 'all'
                  ? 'bg-primary-navy text-white shadow-lg shadow-primary-navy/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}>
              {t('products_page.all_categories') || 'جميع الفئات'}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategory(cat.id)}
                className={`px-6 py-3 rounded-2xl font-black text-sm transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-primary-blue text-white shadow-lg shadow-primary-blue/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}>
                {cat.nameAr || cat.nameEn}
              </button>
            ))}
          </div>

          {/* Active filter summary */}
          {hasActiveFilters && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <span className="text-sm font-bold text-slate-500">
                {totalItems} {t('products_page.results') || 'نتيجة'}
              </span>
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 text-rose-600 text-sm font-bold hover:bg-rose-100 transition-colors">
                <X size={14} />
                {t('products_page.clear_filters') || 'مسح الفلاتر'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-24">
        <div className="container">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 size={48} className="animate-spin text-primary-blue" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {products.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-32">
                  <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300 mx-auto mb-8">
                    <Package size={48} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">
                    {t('products_page.no_results') || 'لا توجد منتجات مطابقة'}
                  </h3>
                  <p className="text-lg text-slate-500 mb-8 max-w-md mx-auto">
                    {t('products_page.no_results_desc') || 'جرب تغيير كلمة البحث أو الفئة'}
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-8 py-4 bg-primary-blue text-white rounded-2xl font-bold text-lg hover:bg-primary-blue-dark transition-colors shadow-lg shadow-primary-blue/20">
                    {t('products_page.show_all') || 'عرض جميع المنتجات'}
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={`page-${currentPage}-${activeCategory}-${searchTerm}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}>
                  <StaggerContainer staggerBy={0.08}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                      {products.map((product) => (
                        <StaggerItem key={product.id}>
                          <motion.div
                            whileHover={{ y: -12 }}
                            className="group bg-slate-50 rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col h-full">
                            {/* Product Image */}
                            <div className="h-80 overflow-hidden relative">
                              <Link href={`/products/${product.id}`}>
                                {product.image ? (
                                  <motion.img
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 1 }}
                                    src={product.image}
                                    alt={product.nameAr || product.name}
                                    className="w-full h-full object-cover cursor-pointer"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-slate-100 flex items-center justify-center cursor-pointer">
                                    <Package size={64} className="text-slate-300" />
                                  </div>
                                )}
                              </Link>
                              {product.category && (
                                <div className="absolute top-8 right-8">
                                  <span className="bg-white/95 backdrop-blur-md text-primary-navy px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-sm border border-slate-100">
                                    {product.category.nameAr || product.category.nameEn}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="p-12 flex flex-col flex-1">
                              <div className="flex justify-between items-start mb-6">
                                <h3 className="text-3xl font-black text-primary-navy leading-tight">
                                  <Link
                                    href={`/products/${product.id}`}
                                    className="hover:text-primary-blue transition-colors">
                                    {product.nameAr || product.name}
                                  </Link>
                                </h3>
                              </div>
                              {product.description && (
                                <p className="text-slate-600 text-lg mb-10 line-clamp-3 font-medium leading-relaxed">
                                  {product.description}
                                </p>
                              )}

                              <div className="mt-auto space-y-8">
                                <div className="flex items-center justify-between border-t border-slate-200 pt-8">
                                  <span className="text-accent-gold font-black text-2xl">
                                    {formatPrice(product.defaultPrice)}
                                  </span>
                                  <div className="flex gap-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                      <Zap size={14} />
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                      <ShieldCheck size={14} />
                                    </div>
                                  </div>
                                </div>

                                <a
                                  href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(
                                    `${t('products_page.whatsapp_inquiry')}: ${product.nameAr || product.name}`,
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center gap-4 w-full py-6 rounded-4xl bg-secondary-green text-white font-black text-xl hover:bg-secondary-green/90 transition-all duration-300 shadow-xl shadow-secondary-green/20 group/btn">
                                  <span>{t('products_page.whatsapp_btn')}</span>
                                  <MessageCircle
                                    size={24}
                                    className={`transition-transform ${isRTL ? 'group-hover:-rotate-12' : 'group-hover:rotate-12'}`}
                                  />
                                </a>
                              </div>
                            </div>
                          </motion.div>
                        </StaggerItem>
                      ))}
                    </div>
                  </StaggerContainer>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Pagination */}
          {totalPages > 1 && !loading && (
            <div className="flex items-center justify-center gap-3 mt-20">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm">
                <ChevronRight size={22} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-14 h-14 rounded-2xl font-black text-lg transition-all duration-300 ${
                    page === currentPage
                      ? 'bg-primary-navy text-white shadow-xl shadow-primary-navy/20 scale-110'
                      : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'
                  }`}>
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm">
                <ChevronLeft size={22} />
              </button>
            </div>
          )}

          {/* Results count */}
          {totalItems > 0 && !loading && (
            <p className="text-center text-sm font-bold text-slate-400 mt-8">
              {t('products_page.showing') || 'عرض'}{' '}
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}{' '}
              {t('products_page.of') || 'من'}{' '}
              {totalItems}{' '}
              {t('products_page.product') || 'منتج'}
            </p>
          )}
        </div>
      </section>

      {/* Why Trade with Us */}
      <section className="py-32 bg-slate-50">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-16">
            <div className="bg-white p-12 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="w-16 h-16 rounded-2xl bg-primary-blue/10 flex items-center justify-center text-primary-blue mb-8">
                <Truck size={32} />
              </div>
              <h3 className="text-2xl font-black text-primary-navy mb-4">
                {t('products_page.perks.global_shipping.title')}
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                {t('products_page.perks.global_shipping.desc')}
              </p>
            </div>
            <div className="bg-white p-12 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="w-16 h-16 rounded-2xl bg-secondary-green/10 flex items-center justify-center text-secondary-green mb-8">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-black text-primary-navy mb-4">
                {t('products_page.perks.quality.title')}
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                {t('products_page.perks.quality.desc')}
              </p>
            </div>
            <div className="bg-white p-12 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="w-16 h-16 rounded-2xl bg-accent-gold/10 flex items-center justify-center text-accent-gold mb-8">
                <Zap size={32} />
              </div>
              <h3 className="text-2xl font-black text-primary-navy mb-4">
                {t('products_page.perks.sourcing.title')}
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                {t('products_page.perks.sourcing.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-white relative overflow-hidden">
        <div className="container relative z-10 text-center">
          <FadeIn>
            <h2 className="text-5xl md:text-7xl font-black text-primary-navy mb-10 leading-tight">
              {t('products_page.cta.title')}{' '}
              <span className="text-gold-gradient italic">
                {t('products_page.cta.title_highlight')}
              </span>
            </h2>
            <p className="text-2xl text-slate-500 mb-16 max-w-2xl mx-auto leading-relaxed font-medium">
              {t('products_page.cta.description')}
            </p>
            <motion.a
              href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary-navy text-white px-20 py-7 rounded-4xl font-black text-2xl shadow-2xl shadow-primary-navy/20 transition-all hover:bg-primary-blue flex items-center gap-6 mx-auto w-fit">
              <span>{t('products_page.cta.button')}</span>
              <ArrowUpLeft size={28} className={isRTL ? 'rotate-90' : ''} />
            </motion.a>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};

export default Products;
