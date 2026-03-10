import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, ArrowLeft, Globe, Sparkles } from 'lucide-react';
import Logo from '../ui/Logo';
import { NAV_LINKS, CONTACT_INFO } from '../../constants/content';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeHover, setActiveHover] = useState(null);
  const location = useLocation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  useEffect(() => {
    // Set initial dir
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
        isScrolled ? 'py-3' : 'py-6'
      }`}>
      <div className="container">
        <motion.div
          layout
          className={`relative flex items-center justify-between px-6 lg:px-8 py-3 lg:py-4 transition-all duration-500 rounded-2xl ${
            isScrolled
              ? 'bg-white/85 backdrop-blur-2xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.08)]'
              : 'bg-transparent border-transparent'
          }`}>
          {/* Logo */}
          <Link to="/" className="relative z-50">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
              <Logo light={!isScrolled} size={40} />
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link, idx) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                onHoverStart={() => setActiveHover(link.name)}
                onHoverEnd={() => setActiveHover(null)}
                className="relative">
                <Link
                  to={link.path}
                  className={`text-sm font-black transition-all duration-300 block py-2 px-1 ${
                    isScrolled ? 'text-slate-900' : 'text-white'
                  }`}>
                  {t(link.name)}
                </Link>

                {/* Animated Underline */}
                <motion.span
                  className={`absolute bottom-0 right-0 h-0.5 rounded-full ${
                    isScrolled ? 'bg-secondary-green' : 'bg-accent-gold'
                  }`}
                  initial={{ width: 0 }}
                  animate={{
                    width:
                      location.pathname === link.path
                        ? '100%'
                        : activeHover === link.name
                          ? '50%'
                          : 0,
                  }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.div>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-5">
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={toggleLanguage}
              className={`flex items-center gap-2 text-sm font-bold cursor-pointer transition-all duration-300 px-3 py-2 rounded-lg hover:bg-white/10 ${
                isScrolled
                  ? 'text-slate-500 hover:bg-slate-100'
                  : 'text-slate-300 hover:bg-white/10'
              }`}>
              <Globe size={16} />
              <span>{i18n.language === 'ar' ? 'EN' : 'عربي'}</span>
            </motion.div>

            <Link to="/contact">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`relative px-7 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 overflow-hidden group ${
                  isScrolled
                    ? 'bg-primary-blue text-white shadow-lg shadow-primary-blue/20'
                    : 'bg-white text-primary-blue hover:bg-slate-50'
                }`}>
                {/* Shimmer Effect */}
                <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative">{t('nav.contact')}</span>
                <ArrowLeft
                  size={16}
                  className="relative group-hover:-translate-x-1 transition-transform"
                />
              </motion.div>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`lg:hidden relative z-50 w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 ${
              isScrolled || isMenuOpen
                ? 'bg-primary-blue text-white shadow-lg'
                : 'bg-white/10 backdrop-blur-md text-white border border-white/20'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}>
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}>
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-3xl z-40 flex items-center justify-center p-8">
            {/* Decorative Elements */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute top-1/4 -right-32 w-[400px] h-[400px] bg-secondary-green blur-[150px] rounded-full"
            />
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.08 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute bottom-1/4 -left-32 w-[300px] h-[300px] bg-accent-gold blur-[120px] rounded-full"
            />

            <div className="flex flex-col items-center gap-6">
              {NAV_LINKS.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    delay: idx * 0.08,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}>
                  <Link
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-4xl sm:text-5xl font-black transition-all duration-300 block ${
                      location.pathname === link.path
                        ? 'text-accent-gold'
                        : 'text-white hover:text-secondary-green-light'
                    }`}>
                    <motion.span
                      whileHover={{ x: -10 }}
                      className="inline-block">
                      {t(link.name)}
                    </motion.span>
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="mt-8">
                <Link
                  to="/contact"
                  className="relative bg-linear-to-r from-secondary-green to-secondary-green-light text-white px-10 py-5 rounded-2xl text-xl font-black shadow-[0_20px_40px_rgba(16,185,129,0.3)] flex items-center gap-3 overflow-hidden group">
                  <motion.span
                    className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  />
                  <Sparkles size={20} className="relative" />
                  <span className="relative">اطلب عرض سعر</span>
                  <ArrowLeft
                    size={22}
                    className="relative group-hover:-translate-x-2 transition-transform"
                  />
                </Link>
              </motion.div>

              {/* Bottom Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-12 text-center text-white/40 text-sm">
                <p className="font-bold">{CONTACT_INFO.email}</p>
                <p className="mt-1">{CONTACT_INFO.phone}</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
