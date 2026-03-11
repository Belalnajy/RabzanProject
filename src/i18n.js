import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationAR from './locales/ar.json';
import translationEN from './locales/en.json';

const resources = {
  ar: {
    translation: translationAR,
  },
  en: {
    translation: translationEN,
  },
};

const isServer = typeof window === 'undefined';

if (!i18n.isInitialized) {
  i18n.use(initReactI18next);

  if (!isServer) {
    // Dynamically require the browser language detector only on the client
    const LanguageDetector =
      require('i18next-browser-languagedetector').default;
    i18n.use(LanguageDetector);
  }

  i18n.init({
    resources,
    fallbackLng: 'ar',
    supportedLngs: ['ar', 'en'],
    lng: isServer ? 'ar' : undefined,
    debug: false,

    interpolation: {
      escapeValue: false,
    },
    ...(isServer
      ? {}
      : {
          detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
          },
        }),
  });
}

export default i18n;
