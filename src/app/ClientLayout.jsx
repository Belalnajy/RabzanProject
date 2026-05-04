'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
import Footer from '../components/layout/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import '../i18n';

export default function ClientLayout({ children }) {
  const { i18n } = useTranslation();
  const pathname = usePathname() || '';

  const hideFooterPaths = [
    '/login', '/register', '/forgot-password', '/reset-password',
    '/dashboard', '/orders', '/categories', '/customers', '/inventory', 
    '/analytics', '/reports', '/roles', '/security', '/settings'
  ];
  
  const hideFooter = hideFooterPaths.includes(pathname) || pathname.startsWith('/dashboard');

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <AuthProvider>
      <div className="App">{children}</div>
      {!hideFooter && <Footer />}
    </AuthProvider>
  );
}
