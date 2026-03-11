'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpLeft,
  ExternalLink,
  Globe,
  Target,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/layout/Navbar';
import { PORTFOLIO_PROJECTS, CONTACT_INFO } from '../../constants/content';
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from '../../components/ui/Animations';

const Portfolio = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  return (
    <div className="bg-white">
      <Navbar />

      {/* Portfolio Hero */}
      <section className="relative pt-48 pb-32 bg-slate-950 overflow-hidden text-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950 z-10" />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-30 grayscale"
          />
        </div>
        <div className="container relative z-20">
          <FadeIn>
            <span className="section-label-v3 text-white border-white/20 bg-white/5 backdrop-blur-md">
              {t('portfolio_page.hero.label')}
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-white mt-8 leading-[1.1]">
              {t('portfolio_page.hero.title')}{' '}
              <span className="text-gradient">
                {t('portfolio_page.hero.title_highlight')}
              </span>
            </h1>
            <p className="text-xl text-slate-400 mt-10 max-w-2xl mx-auto leading-relaxed">
              {t('portfolio_page.hero.description')}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Modern Masonry Portfolio Grid */}
      <section className="py-32">
        <div className="container">
          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {PORTFOLIO_PROJECTS.map((project, idx) => (
                <StaggerItem key={project.id}>
                  <div className="group relative overflow-hidden rounded-[40px] bg-white shadow-xl hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] transition-all duration-700 active:scale-[0.98]">
                    {/* Image Perspective Trick */}
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={project.image}
                        alt={t(project.title)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                    </div>

                    {/* Cinematic Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-blue via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-500" />

                    {/* Top Right Label */}
                    <div className="absolute top-8 right-8">
                      <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.3em] px-5 py-2 rounded-full border border-white/20">
                        {t(project.category)}
                      </span>
                    </div>

                    {/* Content Revealed on Hover */}
                    <div className="absolute inset-0 flex flex-col justify-end p-12 text-white transform translate-y-20 group-hover:translate-y-0 transition-transform duration-500 pointer-events-none group-hover:pointer-events-auto">
                      <div className="mb-6 w-12 h-12 rounded-xl bg-secondary-green flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                        <ExternalLink size={20} />
                      </div>
                      <h3 className="text-3xl font-black mb-4 leading-tight">
                        {t(project.title)}
                      </h3>
                      <p className="text-slate-200 leading-relaxed mb-8 opacity-0 group-hover:opacity-100 transition-opacity delay-200">
                        {t(project.description)}
                      </p>
                      <div className="flex items-center gap-3 text-secondary-green-light font-black text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity delay-300">
                        <span>{t('portfolio_page.cta.view_case')}</span>
                        <ArrowUpLeft
                          size={18}
                          className={isRTL ? 'rotate-90' : ''}
                        />
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>

          {/* Impact Metrics Section */}
          <div className="mt-32 grid md:grid-cols-3 gap-12 border-t border-slate-100 pt-32">
            <div className="text-center">
              <div className="text-primary-blue mb-6 flex justify-center">
                <Globe size={48} />
              </div>
              <div className="text-6xl font-black text-primary-blue mb-4">
                {t('portfolio_page.metrics.shipments.value')}
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                {t('portfolio_page.metrics.shipments.label')}
              </p>
            </div>
            <div className="text-center">
              <div className="text-secondary-green mb-6 flex justify-center">
                <Target size={48} />
              </div>
              <div className="text-6xl font-black text-primary-blue mb-4">
                {t('portfolio_page.metrics.countries.value')}
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                {t('portfolio_page.metrics.countries.label')}
              </p>
            </div>
            <div className="text-center">
              <div className="text-accent-gold mb-6 flex justify-center">
                <ShieldCheck size={48} />
              </div>
              <div className="text-6xl font-black text-primary-blue mb-4">
                {t('portfolio_page.metrics.precision.value')}
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                {t('portfolio_page.metrics.precision.label')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cinematic CTA */}
      <section className="py-40 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent blur-3xl scale-150" />
        </div>
        <div className="container relative z-10 text-center">
          <FadeIn>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-10 leading-tight max-w-4xl mx-auto">
              {t('portfolio_page.cta.title')}{' '}
              <span className="text-secondary-green-light">
                {t('portfolio_page.cta.title_highlight')}
              </span>{' '}
              {t('portfolio_page.cta.title_suffix')}
            </h2>
            <p className="text-xl text-slate-400 mb-16 max-w-2xl mx-auto leading-relaxed">
              {t('portfolio_page.cta.description')}
            </p>
            <a
              href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(
                t('portfolio_page.cta.title'),
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-secondary-green hover:bg-secondary-green-light text-white px-20 py-6 rounded-2xl font-black text-2xl shadow-2xl shadow-secondary-green/20 transition-all hover:-translate-y-2 active:scale-95 flex items-center justify-center gap-6 mx-auto group w-fit">
              <span>{t('portfolio_page.cta.button')}</span>
              <ArrowUpLeft
                size={32}
                className={`transition-transform ${isRTL ? 'group-hover:translate-x-2 group-hover:-translate-y-2 rotate-90' : 'group-hover:-translate-x-2 group-hover:-translate-y-2'}`}
              />
            </a>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
