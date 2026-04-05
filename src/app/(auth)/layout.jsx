'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Globe, ArrowRight, ArrowLeft } from 'lucide-react';
import Logo from '../../components/ui/Logo';

export default function AuthLayout({ children }) {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isRTL = i18n.dir() === 'rtl';

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative bg-[#242522]"
      dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Top Nav for Home & Language */}
      <div className="absolute top-6 left-0 w-full z-50 flex items-center justify-between px-6 md:px-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-white/70 hover:text-white bg-white/5 hover:bg-white/15 backdrop-blur-md border border-white/10 py-2.5 px-4 rounded-xl transition-all shadow-lg"
          dir={isRTL ? 'rtl' : 'ltr'}>
          {isRTL ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
          <span className="text-sm font-medium pt-0.5">
            {mounted ? (isRTL ? 'العودة للرئيسية' : 'Home') : 'العودة للرئيسية'}
          </span>
        </Link>

        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 text-white/70 hover:text-white bg-white/5 hover:bg-white/15 backdrop-blur-md border border-white/10 py-2.5 px-4 rounded-xl transition-all shadow-lg cursor-pointer"
          dir={isRTL ? 'rtl' : 'ltr'}>
          <Globe size={18} />
          <span className="text-sm font-medium pt-0.5 uppercase">
            {mounted ? (isRTL ? 'En' : 'عربي') : 'En'}
          </span>
        </button>
      </div>

      {/* Background Image Setup */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/login-bg.png')" }}
      />

      {/* Dark overlay gradients matching the Figma aesthetic */}
      <div className="absolute inset-0 z-0 bg-[#010409]/85" />
      <div className="absolute inset-0 z-0 bg-linear-to-t from-[#06080C] via-transparent to-transparent opacity-90" />

      {/* Auth Card Content */}
      <div className="z-10 w-full max-w-[440px] px-4 md:px-8 py-10 bg-[#090A11]/95 backdrop-blur-md rounded-[20px] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/[0.03] relative mx-4 mt-8">
        {/* Logo wrapped in Link */}
        <div className="flex justify-center mb-10 w-full">
          <Link
            href="/"
            className="scale-75 origin-top relative right-4 block hover:opacity-80 transition-opacity">
            <Logo size={140} />
          </Link>
        </div>

        {children}
      </div>
    </div>
  );
}
