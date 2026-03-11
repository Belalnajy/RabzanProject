'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Footer from '../components/layout/Footer';
import '../i18n';

export default function ClientLayout({ children }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <>
      <div className="App">{children}</div>
      <Footer />
    </>
  );
}
