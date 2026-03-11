'use client';

import React, { useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import {
  ArrowLeft,
  Globe,
  ShieldCheck,
  Zap,
  MousePointer2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import Link from 'next/link';

const Hero = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const { scrollY } = useScroll();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.05]);

  // مجموعة صور الهيرو المتبدلة
  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1920&q=80',
      alt: 'home_page.hero.images.sea_shipping',
    },
    {
      url: 'https://images.unsplash.com/photo-1586528116311-ad86768e708f?auto=format&fit=crop&w=1920&q=80',
      alt: 'home_page.hero.images.logistics_ports',
    },
    {
      url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80',
      alt: 'home_page.hero.images.air_shipping',
    },
    {
      url: 'https://images.unsplash.com/photo-1586155638764-bf045442fcc3?auto=format&fit=crop&w=1920&q=80',
      alt: 'home_page.hero.images.land_shipping',
    },
    {
      url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1920&q=80',
      alt: 'home_page.hero.images.digital_solutions',
    },
  ];

  // حالة الصورة الحالية
  const [currentImage, setCurrentImage] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // تغيير الصور تلقائياً
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000); // تبديل كل 5 ثواني

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // أزرار التنقل
  const goToNext = () => {
    setCurrentImage((prev) => (prev + 1) % heroImages.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrev = () => {
    setCurrentImage(
      (prev) => (prev - 1 + heroImages.length) % heroImages.length,
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToImage = (index) => {
    setCurrentImage(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="relative min-h-screen sm:min-h-[850px] flex items-center overflow-hidden mesh-bg-dark">
      {/* Cinematic Background with Image Slider */}
      <motion.div
        style={{
          y: isMobile ? 0 : y1,
          scale: isMobile ? 1 : scale,
          willChange: isMobile ? 'auto' : 'transform',
        }}
        className="absolute inset-0 z-0">
        {/* Overlay Gradients - Made Lighter */}
        <div className="absolute inset-0 bg-linear-to-l from-bg-dark/90 via-transparent to-bg-dark/90 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,_rgba(0,51,102,0.1),transparent_60%)] z-10" />

        {/* Animated Image Carousel */}
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage}
            src={heroImages[currentImage].url}
            alt={t(heroImages[currentImage].alt)}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.8, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full object-cover filter brightness-90 contrast-110"
          />
        </AnimatePresence>
      </motion.div>

      {/* Luxury Animated Blobs - Optimized for Mobile */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.08, 0.15, 0.08],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          style={{ willChange: 'transform, opacity' }}
          className="absolute top-1/4 -right-20 w-[300px] sm:w-[700px] h-[300px] sm:h-[700px] bg-secondary-green/10 blur-[80px] sm:blur-[180px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.08, 0.05],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
          style={{ willChange: 'transform, opacity' }}
          className="absolute bottom-1/4 -left-40 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-accent-gold/10 blur-[60px] sm:blur-[150px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.03, 0.06, 0.03],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
          style={{ willChange: 'transform, opacity' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] bg-primary-blue/5 blur-[100px] sm:blur-[200px] rounded-full"
        />
      </div>

      {/* Image Navigation Controls */}
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-30 flex justify-between px-4 md:px-8 pointer-events-none"
        dir="ltr">
        {/* Force LTR for controls so Left is always Left? Or adapt? 
          If I leave it, in RTL, Prev button moves to Right side. Next button moves to Left side.
          Prev (Right side) should point Right (>).
          Next (Left side) should point Left (<).
      */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={goToPrev}
          className="pointer-events-auto w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white transition-all duration-300 group">
          <ChevronLeft // Changed to Left for Prev
            size={24}
            className={`transition-transform ${isRTL ? 'rotate-180' : ''}`}
          />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={goToNext}
          className="pointer-events-auto w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white transition-all duration-300 group">
          <ChevronRight // Changed to Right for Next
            size={24}
            className={`transition-transform ${isRTL ? 'rotate-180' : ''}`}
          />
        </motion.button>
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {heroImages.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToImage(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`transition-all duration-500 ${
              index === currentImage
                ? 'w-10 h-2 bg-accent-gold rounded-full'
                : 'w-2 h-2 bg-white/30 hover:bg-white/60 rounded-full'
            }`}
          />
        ))}
      </div>

      <div className="container relative z-20">
        <div className="max-w-5xl mt-20 sm:mt-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/90 text-sm font-bold mb-12 shadow-glow">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
                <Globe className="text-secondary-green" size={16} />
              </motion.div>
              <span className="tracking-[0.1em] uppercase text-xs sm:text-sm">
                {t('home_page.hero.badge')}
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white leading-[1.2] mb-10 sm:mb-20">
              <span className="block mb-4 overflow-hidden">
                <motion.span
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="block text-luxury-gradient">
                  {t('home_page.hero.title_primary')}
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="block text-gold-gradient">
                  {t('home_page.hero.title_secondary')}
                </motion.span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-lg sm:text-xl md:text-3xl text-slate-300/80 max-w-3xl leading-relaxed sm:leading-10 mb-10 sm:mb-16 font-medium">
              {t('home_page.hero.description')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="flex flex-col sm:flex-row gap-8">
              <Link href="/contact" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-gold px-8 sm:px-12 py-4 sm:py-6 group shadow-[0_10px_40px_rgba(212,175,55,0.3)] w-full justify-center">
                  <span className="text-lg sm:text-xl">
                    {t('home_page.hero.cta_contact')}
                  </span>
                  <ArrowLeft
                    size={20}
                    className={`transition-transform ${isRTL ? 'group-hover:-translate-x-2' : 'group-hover:translate-x-2 rotate-180'}`}
                  />
                </motion.button>
              </Link>

              <Link href="/how-it-works" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-premium bg-white/5 hover:bg-white/10 text-white border border-white/20 px-8 sm:px-12 py-4 sm:py-6 backdrop-blur-md group w-full justify-center">
                  <span className="text-lg sm:text-xl">
                    {t('home_page.hero.cta_methodology')}
                  </span>
                  <Zap
                    size={20}
                    className="text-accent-gold group-hover:scale-125 transition-transform"
                  />
                </motion.button>
              </Link>
            </motion.div>

            {/* Premium Trust Badges with Enhanced Animation */}
            <div className="mt-16 sm:mt-28 flex flex-wrap gap-6 sm:gap-12 border-t border-white/5 pt-8 sm:pt-12">
              {[
                {
                  icon: ShieldCheck,
                  text: 'home_page.hero.badges.quality',
                  color: 'text-secondary-green',
                },
                {
                  icon: Zap,
                  text: 'home_page.hero.badges.supply',
                  color: 'text-accent-gold',
                },
                {
                  icon: MousePointer2,
                  text: 'home_page.hero.badges.digital',
                  color: 'text-primary-blue-light',
                },
              ].map((badge, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + i * 0.15, duration: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  key={i}
                  className="flex items-center gap-4 text-white/40 group hover:text-white/80 transition-all cursor-default">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: 'easeInOut',
                    }}>
                    <badge.icon
                      className={`${badge.color} opacity-60 group-hover:opacity-100 transition-all`}
                      size={22}
                    />
                  </motion.div>
                  <span className="font-black text-xs tracking-[0.2em] uppercase">
                    {t(badge.text)}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Scroll Decor with Enhanced Animation */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-12 left-12 flex flex-col items-center gap-6 z-20">
        <motion.div
          animate={{ scaleY: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-px h-24 bg-linear-to-b from-accent-gold/60 to-transparent"
        />
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
          <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] [writing-mode:vertical-lr] rotate-180">
            {t('home_page.hero.scroll')}
          </span>
        </motion.div>
      </motion.div>

      {/* Animated Border Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-accent-gold/30 to-transparent z-20"
      />
    </section>
  );
};

export default Hero;
