import { createI18n } from 'vue-i18n';
import en from './locales/en';
import id from './locales/id';

// Get saved language from localStorage or default to 'en'
const savedLanguage = localStorage.getItem('language') || 'en';

const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: savedLanguage, // Set locale from localStorage
  fallbackLocale: 'en', // Fallback to English if translation is missing
  messages: {
    en,
    id,
  },
});

export default i18n;

export const availableLanguages = [
  { code: 'en', name: 'English' },
  { code: 'id', name: 'Indonesia' },
];
