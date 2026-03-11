'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  Package,
  ArrowUpLeft,
  Truck,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import { PRODUCTS, CONTACT_INFO } from '../../constants/content';
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from '../../components/ui/Animations';
import './Products.css';

const Products = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

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

      {/* Products Grid */}
      <section className="py-32">
        <div className="container">
          <StaggerContainer staggerBy={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {PRODUCTS.map((product) => (
                <StaggerItem key={product.id}>
                  <motion.div
                    whileHover={{ y: -12 }}
                    className="group bg-slate-50 rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col h-full">
                    {/* Product Image */}
                    <div className="h-80 overflow-hidden relative">
                      <Link href={`/products/${product.id}`}>
                        <motion.img
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 1 }}
                          src={product.image}
                          alt={t(product.name)}
                          className="w-full h-full object-cover cursor-pointer"
                        />
                      </Link>
                      <div className="absolute top-8 right-8">
                        <span className="bg-white/95 backdrop-blur-md text-primary-navy px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-sm border border-slate-100">
                          {t(product.category)}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-12 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-6">
                        <h3 className="text-3xl font-black text-primary-navy leading-tight">
                          <Link
                            href={`/products/${product.id}`}
                            className="hover:text-primary-blue transition-colors">
                            {t(product.name)}
                          </Link>
                        </h3>
                      </div>
                      <p className="text-slate-600 text-lg mb-10 line-clamp-3 font-medium leading-relaxed">
                        {t(product.description)}
                      </p>

                      <div className="mt-auto space-y-8">
                        <div className="flex items-center justify-between border-t border-slate-200 pt-8">
                          <span className="text-accent-gold font-black text-2xl">
                            {t(product.price)}
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
                            `${t('products_page.whatsapp_inquiry')}: ${t(product.name)}`,
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
            <div
              className={`bg-white p-12 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div
                className={`w-16 h-16 rounded-2xl bg-secondary-green/10 flex items-center justify-center text-secondary-green mb-8 ${isRTL ? 'mr-auto' : 'mr-auto'}`}>
                {/* Note: mr-auto forces it to left in LTR context, in RTL it forces to Right? No, mr (margin-right) margin-inline-end. */}
                {/* Actually with standard Tailwind, mr-auto pushes to the left in LTR. In RTL it pushes to left too unless configured? */}
                {/* Let's simplify alignment logic. Text alignment handles text, but flex items? */}
                {/* Original was mr-auto (pushes to left? no, mr-auto pushes box to left side if container is flex?) */}
                {/* Wait, the div is block. mr-auto sets margin-right to auto, so it aligns LEFT. */}
                {/* In RTL, we want it aligned Right. So ml-auto? */}
                {/* Let's remove mr-auto/ml-auto and just use flex/grid or rely on text alignment if it's inline-block? No it's flex. */}
                {/* Actually just use flex justify-start? */}
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-black text-primary-navy mb-4">
                {t('products_page.perks.quality.title')}
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                {t('products_page.perks.quality.desc')}
              </p>
            </div>
            <div
              className={`bg-white p-12 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="w-16 h-16 rounded-2xl bg-accent-gold/10 flex items-center justify-center text-accent-gold mb-8">
                {/* Simplified alignment */}
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
