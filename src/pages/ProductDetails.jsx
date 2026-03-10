import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
  Package,
  ShieldCheck,
  Tag,
  Truck,
  Zap,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/layout/Navbar';
import { PRODUCTS, CONTACT_INFO } from '../constants/content';
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from '../components/ui/Animations';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const product = PRODUCTS.find((p) => p.id === parseInt(id));
  const relatedProducts = PRODUCTS.filter((p) => p.id !== parseInt(id)).slice(
    0,
    3,
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-900 mb-4">
            {t('products.not_found')}
          </h2>
          <button
            onClick={() => navigate('/products')}
            className="text-primary-blue underline font-bold">
            {t('products.back_to_products')}
          </button>
        </div>
      </div>
    );
  }

  // Handle Features which might be an array of keys or strings
  // In content.js it is mapped to keys: "products.items.1.features.0", etc.
  const features = product.features;

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section
        className={`relative pt-48 pb-20 bg-slate-950 overflow-hidden text-center ${isRTL ? 'lg:text-right' : 'lg:text-left'}`}>
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-b from-slate-950/50 via-slate-950/80 to-slate-950 z-10" />
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src={product.image}
            alt={t(product.name)}
            className="w-full h-full object-cover opacity-30 grayscale"
          />
        </div>

        <div className="container relative z-20">
          <FadeIn>
            <div
              className={`inline-flex items-center gap-2 mb-6 text-secondary-green font-bold bg-secondary-green/10 px-4 py-2 rounded-full border border-secondary-green/20 backdrop-blur-md ${isRTL ? '' : 'flex-row-reverse'}`}>
              <Tag size={16} />
              <span>{t(product.category)}</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-8">
              {t(product.name)}
            </h1>
            <div
              className={`flex flex-wrap gap-4 justify-center ${isRTL ? 'lg:justify-start' : 'lg:justify-start'}`}>
              <div className="flex items-center gap-2 text-slate-300 bg-white/5 px-6 py-3 rounded-2xl backdrop-blur-sm border border-white/10">
                <ShieldCheck size={20} className="text-accent-gold" />
                <span>{t('services.inspection.title')}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 bg-white/5 px-6 py-3 rounded-2xl backdrop-blur-sm border border-white/10">
                <Truck size={20} className="text-accent-gold" />
                <span>{t('services.logistics.title')}</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Right Column - Images/Visuals */}
            <FadeIn direction={isRTL ? 'left' : 'right'} className="lg:order-2">
              <div className="sticky top-24 space-y-8">
                <div className="rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 group">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.7 }}
                    src={product.image}
                    alt={t(product.name)}
                    className="w-full h-auto object-cover"
                  />
                </div>

                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 text-center">
                  <h3 className="text-xl font-black text-primary-navy mb-4">
                    {t('products.have_question')}
                  </h3>
                  <p className="text-slate-500 mb-6">
                    {t('products.consultant_ready')}
                  </p>
                  <a
                    href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(
                      `${t('products.whatsapp_inquiry')}: ${t(product.name)}`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20">
                    <MessageCircle size={20} />
                    <span>{t('products.chat_whatsapp')}</span>
                  </a>
                </div>
              </div>
            </FadeIn>

            {/* Left Column - Details */}
            <div className="space-y-12 lg:order-1">
              <FadeIn direction={isRTL ? 'right' : 'left'}>
                {/* Description */}
                <div>
                  <h2 className="text-3xl font-black text-primary-navy mb-6">
                    {t('products.overview')}
                  </h2>
                  <p className="text-lg text-slate-600 leading-relaxed font-medium">
                    {t(product.longDescription || product.description)}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between bg-primary-blue text-white p-8 rounded-3xl shadow-xl shadow-primary-blue/20">
                  <div>
                    <span className="block text-slate-300 text-sm font-bold mb-1">
                      {t('products.estimated_price')}
                    </span>
                    <span className="text-3xl font-black text-accent-gold">
                      {t(product.price)}
                    </span>
                  </div>
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <Tag size={24} />
                  </div>
                </div>

                {/* Features */}
                {features && (
                  <div className="mt-12">
                    <h3 className="text-2xl font-black text-primary-navy mb-6 flex items-center gap-3">
                      <Zap className="text-secondary-green" />
                      <span>{t('products.key_features')}</span>
                    </h3>
                    <ul className="space-y-4">
                      {features.map((featureKey, idx) => (
                        <li key={idx} className="flex items-start gap-4">
                          <div className="mt-1 w-6 h-6 rounded-full bg-secondary-green/10 flex items-center justify-center text-secondary-green shrink-0">
                            <CheckCircle2 size={14} />
                          </div>
                          <span className="text-slate-700 font-bold">
                            {t(featureKey)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Specs */}
                {product.specs && (
                  <div className="mt-12">
                    <h3 className="text-2xl font-black text-primary-navy mb-6 flex items-center gap-3">
                      <Package className="text-secondary-green" />
                      <span>{t('products.technical_specs')}</span>
                    </h3>
                    <div className="border border-slate-200 rounded-3xl overflow-hidden">
                      {Object.entries(product.specs).map(
                        ([key, valueKey], idx) => {
                          return (
                            <div
                              key={key}
                              className={`flex justify-between p-5 ${
                                idx !== Object.keys(product.specs).length - 1
                                  ? 'border-b border-slate-100'
                                  : ''
                              } ${idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
                              <span className="font-bold text-primary-navy">
                                {t(`products.specs_labels.${key}`)}
                              </span>
                              <span
                                className="text-slate-600 font-medium text-left"
                                dir="ltr">
                                {t(valueKey)}
                              </span>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>
                )}
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="container">
          <h2 className="text-3xl md:text-5xl font-black text-primary-navy mb-16 text-center">
            {t('products.related_products')}
          </h2>
          <StaggerContainer>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedProducts.map((p) => (
                <StaggerItem key={p.id}>
                  <motion.div
                    whileHover={{ y: -10 }}
                    className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all cursor-pointer"
                    onClick={() => navigate(`/products/${p.id}`)}>
                    <div className="h-48 rounded-2xl overflow-hidden mb-6 relative">
                      <img
                        src={p.image}
                        alt={t(p.name)}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black text-primary-navy">
                        {t(p.category)}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-primary-navy mb-2 line-clamp-1">
                      {t(p.name)}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                      {t(p.description)}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className="text-accent-gold font-bold text-sm">
                        {t(p.price)}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <ArrowLeft
                          size={16}
                          className={isRTL ? '' : 'rotate-180'}
                        />
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
