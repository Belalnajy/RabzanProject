'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Users,
  MapPin,
  CheckCircle2,
  ArrowUpLeft,
  Box,
  Globe2,
  Zap,
  FileCheck,
  TrendingUp,
  Award,
  Clock,
  Mail,
  MessageCircle,
  Sparkles,
  Star,
  ArrowRight,
  User,
  Phone,
  SendHorizontal,
  Building2,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/ui/Hero';
import Logo from '../components/ui/Logo';
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  ScaleIn,
  HoverScale,
  FloatIn,
  BlurFade,
} from '../components/ui/Animations';
import {
  SERVICES,
  PORTFOLIO_PROJECTS,
  COMMERCIAL_SERVICES,
  ARTICLES,
  PRODUCTS,
  CONTACT_INFO,
} from '../constants/content';

const Home = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const { scrollYProgress } = useScroll();
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const stats = [
    {
      label: 'home_page.stats.certified_factory',
      value: '+250',
      icon: <CheckCircle2 className="text-secondary-green" />,
    },
    {
      label: 'home_page.stats.global_office',
      value: '12',
      icon: <MapPin className="text-secondary-green" />,
    },
    {
      label: 'home_page.stats.trading_volume',
      value: '$45M+',
      icon: <TrendingUp className="text-secondary-green" />,
    },
    {
      label: 'home_page.stats.active_country',
      value: '+35',
      icon: <Users className="text-secondary-green" />,
    },
  ];

  return (
    <div className="bg-white overflow-x-hidden">
      <Navbar />
      <Hero />

      {/* Stats Bar - High-End Glassmorphism */}
      <div className="container relative z-30 -mt-20">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card rounded-[2.5rem] p-8 lg:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 border-white/60 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)]">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-5 px-4 group cursor-default">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-secondary-green/5 flex items-center justify-center group-hover:bg-secondary-green/10 transition-all duration-500">
                {React.cloneElement(stat.icon, { size: 28 })}
              </motion.div>
              <div>
                <h3 className="text-3xl lg:text-4xl font-black text-primary-navy">
                  {stat.value}
                </h3>
                <p className="text-xs font-black text-slate-500 uppercase tracking-[0.1em]">
                  {t(stat.label)}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Services Section - Architectural Design */}
      <section className="py-32 lg:py-40 bg-slate-950 overflow-hidden relative">
        {/* Animated Background Blobs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 right-0 w-1/2 h-1/3 bg-secondary-green/5 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute bottom-0 left-0 w-1/3 h-1/4 bg-primary-blue/10 blur-[100px] rounded-full"
        />

        <div className="container relative z-10">
          <div className="max-w-4xl mb-20 lg:mb-24">
            <FadeIn>
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="section-label-gold inline-flex cursor-default">
                <Sparkles size={14} className="animate-pulse" />
                {t('home_page.services_section.label')}
              </motion.span>
              <h2 className="text-5xl md:text-7xl lg:text-8xl text-white leading-tight mb-10 font-black">
                {t('home_page.services_section.title_prefix')} <br />
                <span className="text-gold-gradient italic">
                  {t('home_page.services_section.title_suffix')}
                </span>
              </h2>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className={`w-24 h-1 bg-accent-gold/40 rounded-full ${isRTL ? 'origin-right' : 'origin-left'}`}
              />
            </FadeIn>
          </div>

          <StaggerContainer staggerBy={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {SERVICES.map((service, idx) => (
                <StaggerItem key={service.id}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="group p-10 lg:p-12 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-accent-gold/30 transition-all duration-700 relative overflow-hidden h-full">
                    {/* Hover Glow */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute top-0 right-0 w-40 h-40 bg-accent-gold/10 blur-3xl"
                    />

                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      className="text-accent-gold mb-10 lg:mb-12">
                      {idx === 0 && <Globe2 size={44} strokeWidth={1.5} />}
                      {idx === 1 && <FileCheck size={44} strokeWidth={1.5} />}
                      {idx === 2 && <Box size={44} strokeWidth={1.5} />}
                      {idx >= 3 && <Zap size={44} strokeWidth={1.5} />}
                    </motion.div>

                    <h3 className="text-2xl lg:text-3xl text-white mb-6 lg:mb-8 font-black leading-tight">
                      {t(service.title)}
                    </h3>
                    <p className="text-slate-400 text-base lg:text-lg leading-relaxed mb-8 lg:mb-10 font-medium opacity-80">
                      {t(service.description)}
                    </p>

                    <motion.div
                      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 text-accent-gold font-black text-sm uppercase tracking-[0.2em]">
                      <span>{t('home_page.services_section.discover')}</span>
                      <ArrowUpLeft
                        size={18}
                        className={isRTL ? '' : 'rotate-90'}
                      />
                    </motion.div>
                  </motion.div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* الخدمات التجارية - كروت صور بريميوم */}
      <section className="py-32 lg:py-40 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(212,175,55,0.15),transparent_70%)]" />
        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <FadeIn
              className={`max-w-2xl ${isRTL ? 'text-right' : 'text-left'}`}>
              <span className="section-label-gold inline-flex mb-6">
                <Box size={14} className="animate-pulse" />
                {t('home_page.commercial_section.label')}
              </span>
              <h2 className="text-5xl md:text-7xl font-black text-white leading-tight">
                {t('home_page.commercial_section.title_prefix')}{' '}
                <span className="text-gold-gradient">
                  {t('home_page.commercial_section.title_suffix')}
                </span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-slate-400 text-xl max-w-md font-medium">
                {t('home_page.commercial_section.description')}
              </p>
            </FadeIn>
          </div>

          <StaggerContainer staggerBy={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {COMMERCIAL_SERVICES.map((item) => (
                <StaggerItem key={item.id}>
                  <motion.div
                    whileHover={{ y: -15 }}
                    className="group relative h-[500px] rounded-[3rem] overflow-hidden bg-slate-900 border border-white/10 shadow-2xl transition-all duration-700">
                    {/* Background Image */}
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.8 }}
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 p-10 lg:p-12 flex flex-col justify-end">
                      <div className="mb-6 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="text-3xl font-black text-white mb-4">
                          {t(item.title)}
                        </h3>
                        <p className="text-slate-300 text-lg leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                          {t(item.description)}
                        </p>
                      </div>

                      <a
                        href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(
                          `${t('home_page.commercial_section.cta')}: ${t(item.title)}`,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-3 w-full py-5 px-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-black text-lg hover:bg-accent-gold hover:text-primary-navy hover:border-accent-gold transition-all duration-300">
                        <span>{t('home_page.commercial_section.cta')}</span>
                        <ArrowUpLeft
                          size={20}
                          className={isRTL ? '' : 'rotate-90'}
                        />
                      </a>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* About Section - Overlapping Cinematic Layout */}
      <section className="py-32 lg:py-56 bg-white relative overflow-hidden">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-primary-blue/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-[20%] left-[-100px] w-64 h-64 border border-slate-100 rounded-full opacity-50" />
        </div>

        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            {/* Visual Column - Overlapping Elements */}
            <div className="lg:col-span-6 relative">
              <FadeIn direction="right">
                <div className="relative">
                  {/* Primary Large Image */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="aspect-4/5 w-[85%] rounded-[3rem] overflow-hidden shadow-2xl relative z-10">
                    <img
                      src="https://images.unsplash.com/photo-1634638024484-1b83581271bf?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="Logistics Port"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-tr from-primary-navy/40 to-transparent" />
                  </motion.div>

                  {/* Secondary Overlapping Image */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    whileHover={{ y: -10, scale: 1.05 }}
                    className="absolute bottom-[-10%] right-0 w-[60%] aspect-square rounded-[2.5rem] overflow-hidden shadow-[-20px_20px_60px_rgba(0,0,0,0.15)] border-8 border-white z-20">
                    <img
                      src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"
                      alt="Factory Production"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  {/* Floating Experience Badge - Integrated */}
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute top-[15%] right-[-5%] z-30 bg-accent-gold p-6 lg:p-8 rounded-3xl shadow-xl border-4 border-white">
                    <div className="text-primary-navy">
                      <div className="text-4xl lg:text-5xl font-black leading-none">
                        +15
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] mt-1 opacity-80">
                        {t('home_page.about_section.years_experience')}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </FadeIn>
            </div>

            {/* Content Column */}
            <div
              className={`lg:col-span-6 ${isRTL ? 'text-right' : 'text-left'}`}>
              <FadeIn direction={isRTL ? 'left' : 'right'}>
                <span className="section-label-gold mb-10">
                  {t('home_page.about_section.label')}
                </span>
                <h2 className="text-5xl md:text-7xl font-black text-primary-navy mb-12 leading-[1.1]">
                  {t('home_page.about_section.title_prefix')} <br />
                  <span className="text-gold-gradient italic">
                    {t('home_page.about_section.title_suffix')}
                  </span>
                </h2>
                <p className="text-xl lg:text-2xl text-slate-600 mb-16 leading-relaxed font-medium">
                  {t('home_page.about_section.description')}
                </p>

                {/* Integrated Features/Stats */}
                <div className="grid grid-cols-2 gap-10 mb-16">
                  <div className="space-y-4">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-secondary-green/10 flex items-center justify-center text-secondary-green ${isRTL ? 'ml-auto' : 'mr-auto'}`}>
                      <Zap size={28} />
                    </div>
                    <h3 className="text-xl font-black text-primary-navy">
                      {t('home_page.about_section.speed_title')}
                    </h3>
                    <p className="text-slate-500 text-sm font-medium">
                      {t('home_page.about_section.speed_desc')}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-primary-blue/10 flex items-center justify-center text-primary-blue ${isRTL ? 'ml-auto' : 'mr-auto'}`}>
                      <Globe2 size={28} />
                    </div>
                    <h3 className="text-xl font-black text-primary-navy">
                      {t('home_page.about_section.global_title')}
                    </h3>
                    <p className="text-slate-500 text-sm font-medium">
                      {t('home_page.about_section.global_desc')}
                    </p>
                  </div>
                </div>

                <div
                  className={`flex flex-col ${isRTL ? 'sm:flex-row-reverse' : 'sm:flex-row'} gap-6 items-center`}>
                  <Link href="/about" className="w-full sm:w-auto">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-premium py-6 px-12 group shadow-xl w-full">
                      <span>{t('home_page.about_section.cta_more')}</span>
                      <ArrowUpLeft
                        size={20}
                        className={isRTL ? '' : 'rotate-90'}
                      />
                    </motion.button>
                  </Link>

                  <Link
                    href="/about"
                    className="flex items-center gap-4 text-slate-400 group cursor-pointer hover:text-primary-navy transition-colors">
                    <span className="text-sm font-black uppercase tracking-widest leading-none border-b border-transparent group-hover:border-primary-navy transition-all pb-1">
                      {t('home_page.about_section.cta_story')}
                    </span>
                    <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-50 transition-colors">
                      <ArrowRight size={16} />
                    </div>
                  </Link>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products - Shopping via WhatsApp */}
      <section className="py-32 lg:py-40 bg-white relative overflow-hidden">
        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <FadeIn
              className={`max-w-2xl ${isRTL ? 'text-right' : 'text-left'}`}>
              <span className="section-label-gold inline-flex mb-6">
                <Sparkles size={14} className="animate-pulse" />
                {t('home_page.featured_products.label')}
              </span>
              <h2 className="text-5xl md:text-7xl font-black text-primary-navy leading-tight">
                {t('home_page.featured_products.title_prefix')}{' '}
                <span className="text-gold-gradient">
                  {t('home_page.featured_products.title_suffix')}
                </span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.2} className={isRTL ? 'text-right' : 'text-left'}>
              <p className="text-slate-500 text-xl max-w-md font-medium">
                {t('home_page.featured_products.description')}
              </p>
            </FadeIn>
          </div>

          <StaggerContainer staggerBy={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {PRODUCTS.map((product) => (
                <StaggerItem key={product.id}>
                  <motion.div
                    whileHover={{ y: -10 }}
                    className="group bg-slate-50 rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                    {/* Product Image */}
                    <Link
                      href={`/products/${product.id}`}
                      className="h-72 overflow-hidden relative block">
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.8 }}
                        src={product.image}
                        alt={t(product.name)}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-6 right-6">
                        <span className="bg-white/90 backdrop-blur-md text-primary-navy px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
                          {t(product.category)}
                        </span>
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-10 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <Link href={`/products/${product.id}`}>
                          <h3 className="text-2xl font-black text-primary-navy leading-tight hover:text-accent-gold transition-colors">
                            {t(product.name)}
                          </h3>
                        </Link>
                      </div>
                      <p className="text-slate-600 text-lg mb-8 line-clamp-2 font-medium">
                        {t(product.description)}
                      </p>

                      <div className="mt-auto space-y-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-accent-gold font-black text-xl">
                            {t(product.price)}
                          </span>
                          <Link
                            href={`/products/${product.id}`}
                            className="text-primary-navy font-black text-sm hover:text-accent-gold transition-all flex items-center gap-2">
                            {t('products.view_details')}
                            <ArrowUpLeft
                              size={16}
                              className={isRTL ? '' : 'rotate-90'}
                            />
                          </Link>
                        </div>

                        <a
                          href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(
                            `${t('home_page.featured_products.whatsapp_msg_prefix')}: ${t(product.name)}`,
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl bg-secondary-green text-white font-black text-lg hover:bg-secondary-green/90 transition-all duration-300 shadow-lg shadow-secondary-green/20">
                          <span>
                            {t('home_page.featured_products.whatsapp_cta')}
                          </span>
                          <MessageCircle size={22} />
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

      {/* Portfolio - Cinematic Grid */}
      <section className="py-32 lg:py-40 bg-slate-50 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 lg:mb-24 gap-8">
            <FadeIn>
              <div className="max-w-3xl">
                <span className="section-label-gold">
                  <Star size={14} />
                  {t('home_page.portfolio_section.label')}
                </span>
                <h2 className="text-5xl lg:text-6xl font-black text-primary-navy">
                  {t('home_page.portfolio_section.title')}
                </h2>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <Link href="/portfolio">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 lg:px-10 py-4 rounded-full border-2 border-primary-navy text-primary-navy font-black hover:bg-primary-navy hover:text-white transition-all duration-300 text-sm tracking-widest uppercase flex items-center gap-3 group">
                  <span>{t('home_page.portfolio_section.cta')}</span>
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </motion.button>
              </Link>
            </FadeIn>
          </div>

          <StaggerContainer staggerBy={0.15}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {PORTFOLIO_PROJECTS.map((project, idx) => (
                <StaggerItem key={project.id}>
                  <Link href="/portfolio">
                    <motion.div
                      whileHover={{ y: -12 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 20,
                      }}
                      className="group relative overflow-hidden rounded-[2.5rem] bg-white shadow-xl hover:shadow-[0_48px_80px_-16px_rgba(0,0,0,0.12)] transition-all duration-700">
                      <div className="aspect-[4/5] overflow-hidden">
                        <motion.img
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.7 }}
                          src={project.image}
                          alt={t(project.title)}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-linear-to-t from-primary-navy via-primary-navy/30 to-transparent opacity-80" />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="absolute top-8 lg:top-10 right-8 lg:right-10">
                        <span className="bg-white/10 backdrop-blur-xl text-white px-5 lg:px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/20">
                          {t(project.category)}
                        </span>
                      </motion.div>
                      <div className="absolute bottom-0 right-0 left-0 p-8 lg:p-12 text-white">
                        <h3 className="text-2xl lg:text-3xl font-black mb-4">
                          {t(project.title)}
                        </h3>
                        <p className="text-sm lg:text-base text-slate-300 opacity-0 group-hover:opacity-100 transform translate-y-6 group-hover:translate-y-0 transition-all duration-500 font-medium">
                          {t(project.description)}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* أخبار ومقالات - تصميم عصري */}
      <section
        id="articles"
        className="py-32 lg:py-40 bg-white relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-blue/5 rounded-full blur-3xl" />

        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-8">
            <FadeIn className={isRTL ? 'text-right' : 'text-left'}>
              <span className="section-label-gold mb-6">
                {t('home_page.articles_section.label')}
              </span>
              <h2 className="text-5xl lg:text-6xl font-black text-primary-navy">
                {t('home_page.articles_section.title_prefix')}{' '}
                <span className="text-gold-gradient">
                  {t('home_page.articles_section.title_suffix')}
                </span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <Link
                href="/contact"
                className="hidden md:flex items-center gap-3 text-primary-navy font-black hover:text-accent-gold transition-colors group">
                <span className="border-b-2 border-primary-navy group-hover:border-accent-gold transition-colors pb-1">
                  {t('home_page.articles_section.view_all')}
                </span>
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </FadeIn>
          </div>

          <StaggerContainer staggerBy={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 mb-20">
              {ARTICLES.map((article) => (
                <StaggerItem key={article.id}>
                  <motion.article
                    whileHover={{ y: -10 }}
                    className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all duration-500">
                    <div className="aspect-16/10 overflow-hidden relative">
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.8 }}
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-10 lg:p-12">
                      <div className="flex items-center gap-4 mb-6">
                        <span className="w-8 h-px bg-accent-gold" />
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                          {t('home_page.articles_section.exclusive')}
                        </span>
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-black text-primary-navy mb-6 group-hover:text-primary-blue transition-colors leading-tight">
                        {t(article.title)}
                      </h3>
                      <p className="text-slate-600 text-lg leading-relaxed mb-8 line-clamp-3 font-medium">
                        {t(article.snippet)}
                      </p>
                      <Link
                        href="/contact"
                        className="flex items-center gap-2 text-primary-navy font-black text-sm group/btn group-hover:text-accent-gold transition-colors">
                        <span>{t('home_page.articles_section.read_more')}</span>
                        <ArrowUpLeft
                          size={16}
                          className={`transition-transform ${isRTL ? 'group-hover/btn:-translate-x-1 group-hover/btn:-translate-y-1' : 'group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 rotate-90'}`}
                        />
                      </Link>
                    </div>
                  </motion.article>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>

          <FadeIn className="text-center md:hidden">
            <Link href="/contact">
              <button className="btn-premium w-full py-6">
                <span>{t('home_page.articles_section.mobile_view_all')}</span>
                <ArrowRight />
              </button>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Contact Section - Re-designed */}
      <section className="py-24 lg:py-32 bg-slate-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto bg-white rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col lg:flex-row-reverse">
            {/* Right Column - Contact Info with Background Image */}
            <div className="lg:w-5/12 relative min-h-[400px] lg:min-h-[500px] flex items-center p-10 lg:p-16">
              <div className="absolute inset-0 z-0">
                <img
                  src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80"
                  alt="Contact Background"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary-navy/85 backdrop-blur-sm" />
              </div>

              <div className="relative z-10 text-white space-y-10 lg:space-y-12">
                <p className="text-base lg:text-lg leading-relaxed text-slate-200 font-medium">
                  {t('home_page.contact_section.description')}
                </p>

                <div className="space-y-6 lg:space-y-8">
                  {[
                    {
                      icon: Zap,
                      value: CONTACT_INFO.phone,
                      label: t(
                        'home_page.contact_section.contact_methods.phone',
                      ),
                      color: 'text-accent-gold',
                    },
                    {
                      icon: MessageCircle,
                      value: CONTACT_INFO.phone,
                      label: t(
                        'home_page.contact_section.contact_methods.whatsapp',
                      ),
                      color: 'text-secondary-green',
                    },
                    {
                      icon: Mail,
                      value: CONTACT_INFO.email,
                      label: t(
                        'home_page.contact_section.contact_methods.email',
                      ),
                      color: 'text-accent-gold-light',
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      whileHover={{ x: -5 }}
                      className="flex items-center justify-end gap-5 lg:gap-6 text-right cursor-default">
                      <div>
                        <div className="text-lg lg:text-xl font-black">
                          {item.value}
                        </div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {item.label}
                        </div>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                        <item.icon className={item.color} size={22} />
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Left Column - The Form */}
            <div className="lg:w-7/12 p-10 lg:p-16 xl:p-20 flex flex-col justify-center bg-slate-50/50">
              <div className="mb-12 flex items-center gap-5 justify-end">
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h2 className="text-3xl lg:text-4xl font-black text-primary-navy mb-2">
                    {t('home_page.contact_section.form.title')}
                  </h2>
                  <p className="text-slate-500 font-medium">
                    {t('home_page.contact_section.form.subtitle')}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-primary-navy flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary-navy/20">
                  <SendHorizontal size={28} />
                </div>
              </div>

              <form className="space-y-6">
                <div className="relative group">
                  <User
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary-navy transition-colors"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder={t(
                      'home_page.contact_section.form.name_placeholder',
                    )}
                    className="input-enhanced pr-14"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <Phone
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary-navy transition-colors"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder={t(
                        'home_page.contact_section.form.phone_placeholder',
                      )}
                      className="input-enhanced pr-14"
                    />
                  </div>
                  <div className="relative group">
                    <Mail
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary-navy transition-colors"
                      size={20}
                    />
                    <input
                      type="email"
                      placeholder={t(
                        'home_page.contact_section.form.email_placeholder',
                      )}
                      className="input-enhanced pr-14"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <MapPin
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary-navy transition-colors"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder={t(
                        'home_page.contact_section.form.city_placeholder',
                      )}
                      className="input-enhanced pr-14"
                    />
                  </div>
                  <div className="relative group">
                    <Globe2
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary-navy transition-colors"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder={t(
                        'home_page.contact_section.form.country_placeholder',
                      )}
                      className="input-enhanced pr-14"
                    />
                  </div>
                </div>

                <div className="relative group">
                  <MessageCircle
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary-navy transition-colors"
                    size={20}
                  />
                  <select className="input-enhanced pr-14 appearance-none cursor-pointer">
                    <option value="">
                      {t('home_page.contact_section.form.method_placeholder')}
                    </option>
                    <option value="whatsapp">
                      {t(
                        'home_page.contact_section.form.method_options.whatsapp',
                      )}
                    </option>
                    <option value="phone">
                      {t('home_page.contact_section.form.method_options.phone')}
                    </option>
                    <option value="email">
                      {t('home_page.contact_section.form.method_options.email')}
                    </option>
                  </select>
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ArrowUpLeft size={16} className="rotate-90" />
                  </div>
                </div>

                <div className="relative group">
                  <Building2
                    className="absolute right-6 top-6 text-slate-400 group-hover:text-primary-navy transition-colors"
                    size={20}
                  />
                  <textarea
                    rows="4"
                    placeholder={t(
                      'home_page.contact_section.form.message_placeholder',
                    )}
                    className="input-enhanced pr-14 pt-5 resize-none"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01, y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-primary-navy hover:bg-primary-blue text-white font-black py-6 rounded-3xl text-xl shadow-xl shadow-primary-navy/20 transition-all duration-500 relative overflow-hidden group/btn">
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                  <span className="relative flex items-center justify-center gap-3">
                    {t('home_page.contact_section.form.submit')}
                    <SendHorizontal size={20} />
                  </span>
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
