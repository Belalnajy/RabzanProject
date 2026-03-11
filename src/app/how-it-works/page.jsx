'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  ArrowLeft,
  Search,
  ShieldCheck,
  Truck,
  PackageCheck,
  HelpCircle,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/layout/Navbar';
import { PROCESS_STEPS, CONTACT_INFO } from '../../constants/content';
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from '../../components/ui/Animations';

const HowItWorks = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const stepIcons = [
    <Search size={32} />,
    <ShieldCheck size={32} />,
    <PackageCheck size={32} />,
    <Truck size={32} />,
  ];

  const faqs = t('how_it_works.faq.items', { returnObjects: true });

  return (
    <div className="bg-white">
      <Navbar />

      {/* Dynamic Header */}
      <section className="relative pt-48 pb-32 bg-slate-950 overflow-hidden text-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary-green/10 via-slate-950 to-slate-950 z-10" />
          <motion.div
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"
          />
        </div>
        <div className="container relative z-20">
          <FadeIn>
            <span className="section-label-v3 text-white border-white/20 bg-white/5 backdrop-blur-md">
              {t('how_it_works.hero.label')}
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-white mt-8 leading-[1.1]">
              {t('how_it_works.hero.title')}{' '}
              <span className="text-secondary-green-light italic">
                {t('how_it_works.hero.title_suffix')}
              </span>
            </h1>
            <p className="text-xl text-slate-400 mt-10 max-w-2xl mx-auto leading-relaxed">
              {t('how_it_works.hero.description')}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Visual Timeline - Ultra Modern */}
      <section className="py-32 relative overflow-hidden">
        {/* Background line for timeline */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-slate-100 hidden lg:block" />

        <div className="container relative z-10">
          <div className="space-y-32">
            {PROCESS_STEPS.map((step, index) => (
              <div key={step.id} className="relative">
                <div
                  className={`flex flex-col lg:flex-row gap-20 items-center ${
                    index % 2 !== 0
                      ? isRTL
                        ? 'lg:flex-row-reverse'
                        : 'lg:flex-row-reverse'
                      : ''
                  }`}>
                  {/* Note: logic for alternating in RTL might need check. 
                      Original: index%2!=0 -> lg:flex-row-reverse.
                      If LTR: Even (0) -> Row (Img Left?), Odd (1) -> Row-Rev (Img Right).
                      If RTL: Even (0) -> Row (Img Right?), Odd (1) -> Row-Rev (Img Left).
                      Wait, previous flex code in HowItWorks seems to put Content on lg:w-1/2 and Empty on other half?
                      Line 71: Content Side.
                      Line 103: Empty space.
                      So `lg:flex-row-reverse` puts Content on Right?
                      In LTR: Default is Left. Rev is Right.
                      In RTL: Default is Right. Rev is Left.
                      So we want Alternating. 
                      Even: Content Left (LTR) / Right (RTL).
                      Odd: Content Right (LTR) / Left (RTL).
                      So `lg:flex-row-reverse` is correct for both to flip placement.
                  */}

                  {/* Content Side */}
                  <div
                    className={`lg:w-1/2 ${isRTL ? 'lg:text-right' : 'lg:text-left'}`}>
                    <FadeIn
                      direction={
                        // Direction depending on side
                        index % 2 === 0
                          ? isRTL
                            ? 'left'
                            : 'right' // If content is "start", fade from ?
                          : // Let's stick to simple logic
                            isRTL
                            ? 'right'
                            : 'left'
                      }>
                      <div className="bg-white p-12 lg:p-16 rounded-[40px] shadow-premium border border-slate-50 relative group hover:shadow-2xl transition-all duration-500">
                        <div className="flex items-center gap-6 mb-10">
                          <div className="w-16 h-16 rounded-2xl bg-primary-blue text-white flex items-center justify-center font-black text-2xl shadow-lg">
                            {index + 1}
                          </div>
                          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                            {t('how_it_works.execution_phase_label')}
                          </span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black text-primary-blue mb-6 leading-tight">
                          {t(step.title)}
                        </h3>
                        <p className="text-lg text-slate-500 leading-relaxed mb-8">
                          {t(step.description)}
                        </p>

                        <div className="flex items-center gap-3 text-secondary-green font-bold group-hover:gap-5 transition-all">
                          <span>{t('how_it_works.discover_details')}</span>
                          <ArrowLeft
                            size={20}
                            className={isRTL ? '' : 'rotate-180'}
                          />
                        </div>
                      </div>
                    </FadeIn>
                  </div>

                  {/* Icon/Visual Center */}
                  <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex w-24 h-24 rounded-full bg-white border-8 border-slate-50 shadow-xl items-center justify-center text-secondary-green z-20">
                    {stepIcons[index] || <CheckCircle2 size={32} />}
                  </div>

                  {/* Empty space for alternative layout */}
                  <div className="lg:w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern FAQ for Engagement */}
      <section className="py-32 bg-slate-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <FadeIn>
              <HelpCircle
                className="mx-auto mb-8 text-secondary-green"
                size={64}
              />
              <h2 className="text-5xl font-black text-primary-blue">
                {t('how_it_works.faq.title')}
              </h2>
              <p className="text-xl text-slate-500 mt-6">
                {t('how_it_works.faq.description')}
              </p>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {Array.isArray(faqs) &&
              faqs.map((faq, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="bg-white p-10 rounded-3xl border border-slate-100 hover:border-secondary-green-light transition-colors group">
                    <h3 className="text-xl font-black text-primary-blue mb-4 flex gap-4">
                      <span className="text-secondary-green-light">؟</span>
                      {faq.q}
                    </h3>
                    <p
                      className={`text-slate-500 leading-relaxed ${isRTL ? 'mr-7' : 'ml-7'}`}>
                      {faq.a}
                    </p>
                  </div>
                </FadeIn>
              ))}
          </div>

          <div className="mt-20 text-center">
            <a
              href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(
                t('how_it_works.cta'),
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium py-5 px-16 group inline-flex items-center">
              <span>{t('how_it_works.cta')}</span>
              <ArrowLeft
                className={`transition-transform ${isRTL ? 'group-hover:-translate-x-2' : 'group-hover:translate-x-2 rotate-180'}`}
              />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
