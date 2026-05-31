'use client';

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { translations, languages, type Language, type Translation } from './translations';

interface I18nContextType {
  lang: Language;
  t: (typeof translations)[Language];
  setLanguage: (lang: Language) => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY = 'mindguard_lang';

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en';

  // Check URL param first
  const params = new URLSearchParams(window.location.search);
  const urlLang = params.get('lang') as Language | null;
  if (urlLang && languages.includes(urlLang)) {
    localStorage.setItem(STORAGE_KEY, urlLang);
    return urlLang;
  }

  // Then localStorage
  const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
  if (stored && languages.includes(stored)) return stored;

  // Browser preference detection (very light)
  const browser = navigator.language.toLowerCase();
  if (browser.startsWith('de')) return 'de';
  if (browser.startsWith('ru')) return 'ru';

  // Default to English for international audience
  return 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('ru');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const initial = getInitialLanguage();
    setLang(initial);
    setIsHydrated(true);
  }, []);

  const setLanguage = useCallback((newLang: Language) => {
    setLang(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newLang);
      // Optional: update URL without reload
      const url = new URL(window.location.href);
      url.searchParams.set('lang', newLang);
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  const t = translations[lang];

  // Prevent hydration mismatch
  if (!isHydrated) {
    return null;
  }

  return (
    <I18nContext.Provider value={{ lang, t, setLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    // Fallback for components outside provider (should not happen in our app)
    return {
      lang: 'ru' as Language,
      t: translations.ru,
      setLanguage: () => {},
    };
  }
  return context;
}

// Helper for dynamic strings (like "X of Y selected")
export function useT() {
  const { t } = useTranslation();
  return t;
}
