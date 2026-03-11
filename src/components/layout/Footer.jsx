'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  ArrowRight,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Sparkles,
  Heart,
} from 'lucide-react';
import Logo from '../ui/Logo';
import { NAV_LINKS, CONTACT_INFO, COMPANY_NAME } from '../../constants/content';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();
  const isRTL = i18n.dir() === 'rtl';

  return (
    <footer className="bg-slate-950 text-white pt-20 pb-10 overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-non z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-blue/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary-green/5 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Logo light={true} size={60} />
            </Link>
            <p className="text-slate-400 leading-relaxed mb-8">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex gap-4">
              {CONTACT_INFO.socials.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary-green hover:text-white transition-all duration-300 group">
                  {social.icon === 'linkedin' && <Linkedin size={18} />}
                  {social.icon === 'twitter' && <Twitter size={18} />}
                  {social.icon === 'instagram' && <Instagram size={18} />}
                  {social.icon === 'facebook' && <Facebook size={18} />}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className={`text-lg font-bold mb-6 flex items-center gap-2 ${
                isRTL ? 'flex-row' : 'flex-row-reverse justify-end'
              }`}>
              {t('nav.home')}
            </h4>
            <ul className="space-y-4">
              {NAV_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-slate-400 hover:text-secondary-green transition-colors flex items-center gap-2 group">
                    <span
                      className={`w-1.5 h-1.5 rounded-full bg-secondary-green/50 group-hover:bg-secondary-green transition-colors ${
                        isRTL ? '' : 'order-1'
                      }`}
                    />
                    <span>{t(link.name)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services - We can hardcode top 4 services or map them if exported */}
          <div>
            <h4
              className={`text-lg font-bold mb-6 ${
                isRTL ? 'text-right' : 'text-left'
              }`}>
              {t('nav.services')}
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/services"
                  className="text-slate-400 hover:text-secondary-green transition-colors">
                  {t('services.sourcing.title')}
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-slate-400 hover:text-secondary-green transition-colors">
                  {t('services.inspection.title')}
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-slate-400 hover:text-secondary-green transition-colors">
                  {t('services.logistics.title')}
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-slate-400 hover:text-secondary-green transition-colors">
                  {t('services.customs.title')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}>
            <h4 className="text-lg lg:text-xl font-black mb-8 lg:mb-10 flex items-center gap-3">
              {t('contact_page.info.title')}
            </h4>
            <div className="space-y-6 lg:space-y-8">
              {[
                { Icon: MapPin, content: CONTACT_INFO.address, dir: 'rtl' },
                { Icon: Phone, content: CONTACT_INFO.phone, dir: 'ltr' },
                { Icon: Mail, content: CONTACT_INFO.email, dir: 'ltr' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ x: -5 }}
                  className="flex gap-4 lg:gap-5 group cursor-default">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl bg-white/5 flex items-center justify-center text-secondary-green-light shrink-0 group-hover:bg-white/10 transition-all border border-white/5">
                    <item.Icon size={20} />
                  </motion.div>
                  <p
                    className="text-slate-400 leading-relaxed text-sm lg:text-base"
                    dir={item.dir}>
                    {item.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/[0.03] p-8 lg:p-10 rounded-[2rem] lg:rounded-[2.5rem] border border-white/5 backdrop-blur-md relative overflow-hidden">
            {/* Decorative Glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-gold/10 blur-3xl rounded-full" />

            <h4 className="text-lg lg:text-xl font-black mb-4 lg:mb-6 flex items-center gap-2 relative">
              <Sparkles size={18} className="text-accent-gold" />
              النشرة الاستراتيجية
            </h4>
            <p className="text-slate-400 text-sm mb-6 lg:mb-8 leading-relaxed relative">
              اشترك للحصول على آخر تحليلات السوق وتقارير سلاسل الإمداد العالمية.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 lg:px-6 py-4 lg:py-5 focus:outline-none focus:border-secondary-green-light focus:ring-1 focus:ring-secondary-green/30 transition-all duration-300 text-sm placeholder:text-slate-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute left-2 top-2 bottom-2 w-11 h-11 lg:w-12 lg:h-12 bg-secondary-green text-white rounded-xl flex items-center justify-center hover:bg-secondary-green-light transition-all duration-300 shadow-lg hover:shadow-[0_10px_30px_rgba(16,185,129,0.3)]">
                <Send size={16} />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="pt-10 lg:pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 lg:gap-8 text-xs lg:text-sm text-slate-500 font-bold tracking-wider uppercase">
          <p className="flex items-center gap-2">
            © {new Date().getFullYear()} {COMPANY_NAME}. كافة الحقوق محفوظة
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}>
              <Heart size={14} className="text-accent-gold fill-accent-gold" />
            </motion.span>
          </p>
          <div className="flex gap-6 lg:gap-10">
            <motion.a
              whileHover={{ color: '#ffffff' }}
              href="#"
              className="hover:text-white transition-colors">
              سياسة الخصوصية
            </motion.a>
            <motion.a
              whileHover={{ color: '#ffffff' }}
              href="#"
              className="hover:text-white transition-colors">
              شروط الخدمة
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
