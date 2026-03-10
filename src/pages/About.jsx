import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Target,
  Eye,
  Gem,
  ArrowLeft,
  Award,
  Users,
  Globe,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/layout/Navbar';
import Logo from '../components/ui/Logo';
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from '../components/ui/Animations';
import { CONTACT_INFO } from '../constants/content';

const About = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const values = [
    {
      title: 'about_page.values.mission.title',
      icon: <Target className="w-10 h-10" />,
      text: 'about_page.values.mission.text',
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      title: 'about_page.values.vision.title',
      icon: <Eye className="w-10 h-10" />,
      text: 'about_page.values.vision.text',
      color: 'bg-green-500/10 text-green-500',
    },
    {
      title: 'about_page.values.values.title',
      icon: <Gem className="w-10 h-10" />,
      text: 'about_page.values.values.text',
      color: 'bg-amber-500/10 text-amber-500',
    },
  ];

  const highlights = [
    {
      label: 'about_page.highlights.partner.label',
      value: 'about_page.highlights.partner.value',
      icon: <Users />,
    },
    {
      label: 'about_page.highlights.certificate.label',
      value: 'about_page.highlights.certificate.value',
      icon: <Award />,
    },
    {
      label: 'about_page.highlights.market.label',
      value: 'about_page.highlights.market.value',
      icon: <Globe />,
    },
  ];

  return (
    <div className="bg-white">
      <Navbar />

      {/* Dynamic Header */}
      <section className="relative pt-48 pb-32 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 to-slate-950 z-10" />
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80"
            className="w-full h-full object-cover opacity-30 grayscale"
            alt="Corporate"
          />
        </div>

        <div className="container relative z-20 text-center">
          <FadeIn>
            <span className="section-label-v3 border-white/10 text-white/60">
              {t('about_page.hero.label')}
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-white mt-8 leading-[1.1]">
              {t('about_page.hero.title_prefix')}{' '}
              <span className="text-gradient">
                {t('about_page.hero.title_highlight')}
              </span>{' '}
              {t('about_page.hero.title_suffix')}
            </h1>
            <p className="text-xl text-slate-400 mt-10 max-w-3xl mx-auto leading-relaxed">
              {t('about_page.hero.description')}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Modern Story Section */}
      <section className="py-32 overflow-hidden">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <FadeIn direction={isRTL ? 'left' : 'right'}>
              <div className="relative group">
                <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    alt="Our office"
                  />
                </div>

                {/* Floating Meta Card */}
                <motion.div
                  animate={{ x: [0, 20, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className={`absolute top-20 ${isRTL ? '-right-12' : '-left-12'} dark-glass p-8 rounded-3xl max-w-xs z-20`}>
                  <Logo size={80} light />
                  <h3 className="text-white text-xl font-bold mt-6 mb-2">
                    {t('about_page.story.legacy_title')}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed uppercase tracking-widest font-bold">
                    {t('about_page.story.legacy_text')}
                  </p>
                </motion.div>

                <div
                  className={`absolute -bottom-10 ${isRTL ? '-left-10' : '-right-10'} bg-secondary-green p-10 rounded-full shadow-2xl border-8 border-white`}>
                  <Target size={40} className="text-white" />
                </div>
              </div>
            </FadeIn>

            <FadeIn direction={isRTL ? 'right' : 'left'}>
              <div>
                <span className="section-label-v3">
                  {t('about_page.story.label')}
                </span>
                <h2 className="text-5xl font-black text-primary-blue mb-10 leading-tight">
                  {t('about_page.story.title_prefix')}{' '}
                  <span className="text-secondary-green">
                    {t('about_page.story.title_highlight')}
                  </span>{' '}
                  {t('about_page.story.title_suffix')}
                </h2>
                <div className="space-y-8 text-lg text-slate-600 leading-relaxed">
                  <p>{t('about_page.story.p1')}</p>
                  <p>{t('about_page.story.p2')}</p>
                </div>

                <div className="grid grid-cols-2 gap-8 mt-12 bg-slate-50 p-10 rounded-[32px] border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-blue/5 flex items-center justify-center text-primary-blue">
                      <CheckCircle size={24} />
                    </div>
                    <span className="font-black text-slate-800">
                      {t('about_page.story.perks.licenses')}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary-green/5 flex items-center justify-center text-secondary-green">
                      <CheckCircle size={24} />
                    </div>
                    <span className="font-black text-slate-800">
                      {t('about_page.story.perks.compliance')}
                    </span>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(
                    t('about_page.story.cta'),
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-premium mt-12 group">
                  <span>{t('about_page.story.cta')}</span>
                  <ArrowLeft
                    className={`transition-transform ${isRTL ? 'group-hover:translate-x-2 rotate-180' : 'group-hover:-translate-x-2'}`}
                  />
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Values Grid - Clean & Impactful */}
      <section className="py-32 bg-slate-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <FadeIn>
              <span className="section-label-v3">
                {t('about_page.values_section.label')}
              </span>
              <h2 className="text-5xl font-black text-primary-blue">
                {t('about_page.values_section.title')}
              </h2>
            </FadeIn>
          </div>

          <StaggerContainer>
            <div className="grid md:grid-cols-3 gap-10">
              {values.map((v, i) => (
                <StaggerItem key={i}>
                  <div className="bg-white p-12 rounded-[40px] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 group">
                    <div
                      className={`w-20 h-20 rounded-3xl ${v.color} flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500`}>
                      {v.icon}
                    </div>
                    <h3 className="text-3xl font-black text-primary-blue mb-6">
                      {t(v.title)}
                    </h3>
                    <p className="text-slate-500 text-lg leading-relaxed">
                      {t(v.text)}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* Quick Stats Background Blur */}
      <section className="py-32 bg-primary-blue relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 blur-3xl pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-secondary-green rounded-full translate-x-[-50%] translate-y-[-50%]" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-[50%] translate-y-[50%]" />
        </div>

        <div className="container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            {highlights.map((h, i) => (
              <FadeIn key={i} delay={i * 0.2}>
                <div className="text-center group">
                  <div className="text-white/20 mb-6 flex justify-center group-hover:text-secondary-green-light transition-colors duration-500">
                    {React.cloneElement(h.icon, { size: 64 })}
                  </div>
                  <div className="text-7xl font-black text-white mb-2">
                    {t(h.value)}
                  </div>
                  <div className="text-slate-300 font-bold uppercase tracking-[0.3em] text-sm">
                    {t(h.label)}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
