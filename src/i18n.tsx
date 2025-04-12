import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector'; 

import translationEnglish from "./Translation/English/translation.json";
import translationSpanish from "./Translation/Spanish/translation.json";

const resources = {
  en: {
    translation: translationEnglish,
  },
  es: {
    translation: translationSpanish,
  },
};

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en", 
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'], 
      caches: ['localStorage'], 
    },
    interpolation: {
      escapeValue: false 
    }
  });

export default i18next;
