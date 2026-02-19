import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  ArrowUpLeft,
  ShieldCheck,
  Globe,
  Zap,
  Box,
  FileCheck,
  Briefcase,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/layout/Navbar';
import { SERVICES } from '../constants/content';
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from '../components/ui/Animations';

const Services = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const serviceIcons = [
    <Globe className="w-12 h-12" />,
    <FileCheck className="w-12 h-12" />,
    <Zap className="w-12 h-12" />,
    <Box className="w-12 h-12" />,
    <Briefcase className="w-12 h-12" />,
  ];

  const commonPerks = t('services_page.common_perks', { returnObjects: true });

  return (
    <div className="bg-white">
      <Navbar />

      {/* Header */}
      <section className="relative pt-60 pb-32 bg-slate-950 overflow-hidden text-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-slate-950 z-10" />
          <img
            src="https://images.unsplash.com/photo-1494412574795-a4206020868a?auto=format&fit=crop&w=1920&q=80"
            className="w-full h-full object-cover opacity-20"
            alt="Services"
          />
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-accent-gold/10 blur-[120px] rounded-full" />
        </div>
        <div className="container relative z-20">
          <FadeIn>
            <span className="section-label-gold mb-8">
              {t('services_page.hero.label')}
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-white mt-8 leading-[1.1]">
              {t('services_page.hero.title_prefix')} <br />
              <span className="text-gold-gradient italic">
                {t('services_page.hero.title_suffix')}
              </span>
            </h1>
            <p className="text-xl text-slate-400 mt-12 max-w-3xl mx-auto font-medium leading-relaxed">
              {t('services_page.hero.description')}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Services List - Premium Alternating Layout */}
      <section className="py-40 bg-white">
        <div className="container">
          <div className="space-y-48 lg:space-y-64">
            {SERVICES.map((service, index) => (
              <FadeIn
                key={service.id}
                direction={
                  index % 2 === 0
                    ? isRTL
                      ? 'right'
                      : 'left'
                    : isRTL
                      ? 'left'
                      : 'right'
                }>
                <div
                  className={`flex flex-col lg:flex-row gap-24 lg:gap-32 items-center ${
                    index % 2 !== 0
                      ? isRTL
                        ? 'lg:flex-row-reverse'
                        : ''
                      : isRTL
                        ? ''
                        : 'lg:flex-row-reverse'
                  }`}>
                  {/* 
                     Layout Logic:
                     RTL: 
                       Index 0 (even): Image Right (default flex-row puts img first? No, default is flex-row which is Left-to-Right in code order, but visually?)
                       Wait, flex-direction follows direction.
                       In RTL, flex-row means First item is Right, Second is Left.
                       Code: Img div first, Text div second.
                       So RTL: Img Right, Text Left.
                       LTR: Img Left, Text Right.
                     
                     We want Alternating.
                     Row 1 (Index 0): Img Right (RTL) / Img Left (LTR) ?
                     Let's say we want Img first in flow.
                     Code has Img First.
                     
                     If index is odd, we want REVERSE.
                     RTL Odd: Text Right, Img Left.
                     LTR Odd: Text Left, Img Right.
                     
                     So `lg:flex-row-reverse` swaps them.
                     It works for both directions logically if we want visual alternation relative to start.
                  */}

                  <div className="lg:w-1/2 w-full">
                    <div className="relative group">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="aspect-16/10 rounded-[3rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] bg-slate-100">
                        <motion.img
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 1.2 }}
                          src={`https://images.unsplash.com/photo-${
                            index === 0
                              ? '1553413077-190dd305871c'
                              : index === 1
                                ? '1581091226825-a6a2a5aee158'
                                : index === 2
                                  ? '1578575437130-527eed3abbec'
                                  : index === 3
                                    ? '1557804506-669a67965ba0'
                                    : '1454165833222-d1d2265f770b'
                          }?auto=format&fit=crop&w=1200&q=80`}
                          alt={t(service.title)}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className={`absolute -bottom-10 ${
                          isRTL
                            ? index % 2 === 0
                              ? '-left-10'
                              : '-right-10'
                            : index % 2 === 0
                              ? '-right-10'
                              : '-left-10'
                          // Logic: If Img is Right (Even RTL), badge should be Left (inner).
                          // If Img is Left (Odd RTL), badge should be Right (inner).
                        } w-28 h-28 lg:w-32 lg:h-32 bg-primary-navy rounded-3xl shadow-2xl flex items-center justify-center text-accent-gold border-4 border-white`}>
                        {serviceIcons[index] || (
                          <Briefcase className="w-12 h-12" />
                        )}
                      </motion.div>
                    </div>
                  </div>

                  <div
                    className={`lg:w-1/2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      className="text-8xl lg:text-9xl font-black text-slate-100 mb-8 block leading-none select-none">
                      0{index + 1}
                    </motion.span>
                    <h2 className="text-4xl md:text-6xl font-black text-primary-navy mb-10 leading-tight">
                      {t(service.title)}
                    </h2>
                    <p className="text-xl lg:text-2xl text-slate-600 mb-12 leading-relaxed font-medium">
                      {t(service.description)}
                    </p>

                    <ul className={`space-y-8 mb-16 px-4`}>
                      {Array.isArray(commonPerks) &&
                        commonPerks.map((perk, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * i }}
                            className={`flex items-center gap-6 text-slate-800 font-bold text-lg ${isRTL ? 'justify-end' : 'justify-start'}`}>
                            <span className={isRTL ? 'order-1' : 'order-2'}>
                              {perk}
                            </span>
                            <div
                              className={`w-10 h-10 rounded-full bg-secondary-green/10 flex items-center justify-center text-secondary-green shrink-0 ${isRTL ? 'order-2' : 'order-1'}`}>
                              <CheckCircle2 size={20} />
                            </div>
                          </motion.li>
                        ))}
                    </ul>

                    <button className="btn-premium py-6 px-12 group shadow-[0_20px_50px_rgba(0,51,102,0.15)]">
                      <span>{t('services_page.cta')}</span>
                      <ArrowUpLeft
                        className={`transition-transform ${isRTL ? 'group-hover:-translate-x-1 group-hover:-translate-y-1' : 'group-hover:translate-x-1 group-hover:-translate-y-1 rotate-90'}`}
                      />
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-24 bg-slate-950">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-20">
            <div className="text-center group">
              <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-8 group-hover:bg-secondary-green transition-all duration-500">
                <ShieldCheck
                  size={40}
                  className="text-secondary-green-light group-hover:text-white"
                />
              </div>
              <h3 className="text-2xl font-black text-white mb-4">
                {t('services_page.trust.security.title')}
              </h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                {t('services_page.trust.security.desc')}
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-8 group-hover:bg-secondary-green transition-all duration-500">
                <Globe
                  size={40}
                  className="text-secondary-green-light group-hover:text-white"
                />
              </div>
              <h3 className="text-2xl font-black text-white mb-4">
                {t('services_page.trust.global.title')}
              </h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                {t('services_page.trust.global.desc')}
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-8 group-hover:bg-secondary-green transition-all duration-500">
                <Zap
                  size={40}
                  className="text-secondary-green-light group-hover:text-white"
                />
              </div>
              <h3 className="text-2xl font-black text-white mb-4">
                {t('services_page.trust.smart.title')}
              </h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                {t('services_page.trust.smart.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
