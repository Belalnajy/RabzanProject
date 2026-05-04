'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Instagram,
  Linkedin,
  Twitter,
  MessageSquare,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/layout/Navbar';
import { CONTACT_INFO } from '../../constants/content';
import { FadeIn } from '../../components/ui/Animations';
import { contactService } from '@/lib/services/contact.service';

const Contact = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const [activeTab, setActiveTab] = useState('form');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', service: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);
    try {
      await contactService.submit({
        name: form.name,
        email: form.email,
        type: activeTab === 'form' ? 'quote' : 'support',
        service: form.service || undefined,
        message: form.message,
      });
      setIsSubmitted(true);
      setForm({ name: '', email: '', service: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 8000);
    } catch (err) {
      setSubmitError(err?.message || 'حدث خطأ أثناء الإرسال. حاول مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 bg-slate-950 overflow-hidden text-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/80 to-slate-950 z-10" />
          <img
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1920&q=80"
            className="w-full h-full object-cover opacity-40 blur-sm"
            alt="Office context"
          />
        </div>

        <div className="container relative z-20">
          <FadeIn>
            <span className="section-label-v3 text-white border-white/20 bg-white/5 backdrop-blur-md">
              {t('contact_page.hero.label')}
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-white mt-8 leading-[1.1]">
              {t('contact_page.hero.title')}{' '}
              <span className="text-gradient">
                {t('contact_page.hero.title_highlight')}
              </span>{' '}
              {t('contact_page.hero.title_suffix')}
            </h1>
            <p className="text-xl text-slate-400 mt-10 max-w-2xl mx-auto leading-relaxed">
              {t('contact_page.hero.description')}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Contact Main Interface */}
      <section className="py-24">
        <div className="container">
          <div className="lg:flex gap-16 items-start">
            {/* Info Side */}
            <div className="lg:w-1/3 mb-20 lg:mb-0">
              <FadeIn direction={isRTL ? 'left' : 'right'}>
                <div className="bg-slate-950 rounded-[40px] p-12 text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-full bg-secondary-green/5 group-hover:bg-secondary-green/10 transition-colors duration-500" />

                  <div className="relative z-10">
                    <h2 className="text-4xl font-black mb-10">
                      {t('contact_page.info.title')}
                    </h2>

                    <div className="space-y-12">
                      <div className="flex gap-6 items-start">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-secondary-green-light shrink-0">
                          <MapPin size={26} />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                            {t('contact_page.info.hq')}
                          </h4>
                          <p className="text-lg leading-relaxed">
                            {CONTACT_INFO.address}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-6 items-start">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-secondary-green-light shrink-0">
                          <Phone size={26} />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                            {t('contact_page.info.support')}
                          </h4>
                          <p className="text-lg leading-relaxed" dir="ltr">
                            {CONTACT_INFO.phone}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-6 items-start">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-secondary-green-light shrink-0">
                          <Mail size={26} />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                            {t('contact_page.info.official')}
                          </h4>
                          <p className="text-lg leading-relaxed">
                            {CONTACT_INFO.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-16 pt-10 border-t border-white/10 flex gap-6">
                      <a
                        href="#"
                        className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <Linkedin size={20} />
                      </a>
                      <a
                        href="#"
                        className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <Twitter size={20} />
                      </a>
                      <a
                        href="#"
                        className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <Instagram size={20} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Quick Chat Bubble */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="mt-10 bg-secondary-green rounded-3xl p-8 text-white flex items-center gap-6 shadow-xl shadow-secondary-green/20 cursor-pointer"
                  onClick={() =>
                    window.open(
                      `https://wa.me/${CONTACT_INFO.whatsapp}`,
                      '_blank',
                    )
                  }>
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 animate-pulse">
                    <MessageSquare size={32} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black">
                      {t('contact_page.chat.title')}
                    </h4>
                    <p className="text-sm opacity-80">
                      {t('contact_page.chat.description')}
                    </p>
                  </div>
                </motion.div>
              </FadeIn>
            </div>

            {/* Form Side */}
            <div className="lg:w-2/3">
              <FadeIn direction={isRTL ? 'right' : 'left'}>
                <div className="bg-white border border-slate-100 rounded-[40px] p-12 lg:p-20 shadow-premium">
                  <div className="flex bg-slate-100 p-2 rounded-2xl mb-12 max-w-sm">
                    <button
                      className={`flex-1 py-3 px-6 rounded-xl font-black text-sm transition-all ${
                        activeTab === 'form'
                          ? 'bg-white text-primary-blue shadow-md'
                          : 'text-slate-500'
                      }`}
                      onClick={() => setActiveTab('form')}>
                      {t('contact_page.form.tabs.quote')}
                    </button>
                    <button
                      className={`flex-1 py-3 px-6 rounded-xl font-black text-sm transition-all ${
                        activeTab === 'support'
                          ? 'bg-white text-primary-blue shadow-md'
                          : 'text-slate-500'
                      }`}
                      onClick={() => setActiveTab('support')}>
                      {t('contact_page.form.tabs.support')}
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {!isSubmitted ? (
                      <motion.form
                        key={isSubmitted ? 'submitted' : 'form'}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onSubmit={handleSubmit}
                        className="space-y-8">
                        {submitError && (
                          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-bold">
                            {submitError}
                          </div>
                        )}
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                              {t('contact_page.form.fields.name_label')}
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={form.name}
                              onChange={handleChange}
                              placeholder={t(
                                'contact_page.form.fields.name_placeholder',
                              )}
                              className="w-full px-6 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:bg-white focus:border-secondary-green transition-all"
                              required
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                              {t('contact_page.form.fields.email_label')}
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={form.email}
                              onChange={handleChange}
                              placeholder="work@company.com"
                              className="w-full px-6 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:bg-white focus:border-secondary-green transition-all"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                            {t('contact_page.form.fields.service_label')}
                          </label>
                          <select name="service" value={form.service} onChange={handleChange} className="w-full px-6 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:bg-white focus:border-secondary-green transition-all appearance-none cursor-pointer">
                            <option value="">
                              {t('contact_page.form.options.strategic')}
                            </option>
                            <option value="supply_chain">
                              {t('contact_page.form.options.supply_chain')}
                            </option>
                            <option value="inspection">
                              {t('contact_page.form.options.inspection')}
                            </option>
                            <option value="consulting">
                              {t('contact_page.form.options.consulting')}
                            </option>
                          </select>
                        </div>

                        <div className="space-y-3">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                            {t('contact_page.form.fields.details_label')}
                          </label>
                          <textarea
                            rows="5"
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            placeholder={t(
                              'contact_page.form.fields.details_placeholder',
                            )}
                            className="w-full px-6 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:bg-white focus:border-secondary-green transition-all resize-none"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-primary-blue hover:bg-primary-blue-dark text-white p-7 rounded-2xl font-black text-xl shadow-2xl transition-all flex items-center justify-center gap-4 group disabled:opacity-60">
                          <span>{isSubmitting ? 'جاري الإرسال...' : t('contact_page.form.submit_btn')}</span>
                          <Send
                            size={24}
                            className={`transition-transform ${isRTL ? 'group-hover:-translate-x-2 group-hover:-translate-y-1' : 'group-hover:translate-x-2 group-hover:-translate-y-1'}`}
                          />
                        </button>
                      </motion.form>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-20 text-center">
                        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-green-500/30">
                          <CheckCircle size={48} />
                        </div>
                        <h3 className="text-4xl font-black text-slate-900 mb-4">
                          {t('contact_page.success.title')}
                        </h3>
                        <p className="text-xl text-slate-400">
                          {t('contact_page.success.description')}
                        </p>
                        <button
                          onClick={() => setIsSubmitted(false)}
                          className="mt-10 text-primary-blue font-black underline underline-offset-8">
                          {t('contact_page.success.retry')}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
