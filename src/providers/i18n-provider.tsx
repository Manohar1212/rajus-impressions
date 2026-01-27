'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { Locale, defaultLocale, locales } from '@/i18n/config';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function useLocale() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useLocale must be used within I18nProvider');
  }
  return context;
}

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [messages, setMessages] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial locale from localStorage or URL parameter
    const getInitialLocale = (): Locale => {
      if (typeof window === 'undefined') return defaultLocale;

      // Check URL parameter first
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get('lang');
      if (urlLang && locales.includes(urlLang as Locale)) {
        return urlLang as Locale;
      }

      // Check localStorage
      const stored = localStorage.getItem('locale');
      if (stored && locales.includes(stored as Locale)) {
        return stored as Locale;
      }

      return defaultLocale;
    };

    const initialLocale = getInitialLocale();
    loadMessages(initialLocale);
  }, []);

  const loadMessages = async (newLocale: Locale) => {
    setIsLoading(true);
    try {
      const [common, home, gallery, metadata] = await Promise.all([
        import(`@/i18n/locales/${newLocale}/common.json`),
        import(`@/i18n/locales/${newLocale}/home.json`),
        import(`@/i18n/locales/${newLocale}/gallery.json`),
        import(`@/i18n/locales/${newLocale}/metadata.json`),
      ]);

      setMessages({
        common: common.default,
        home: home.default,
        gallery: gallery.default,
        metadata: metadata.default,
      });

      setLocaleState(newLocale);

      // Update HTML lang attribute
      if (typeof window !== 'undefined') {
        document.documentElement.lang = newLocale;
      }
    } catch (error) {
      console.error(`Failed to load messages for locale: ${newLocale}`, error);
      // Fallback to default locale if loading fails
      if (newLocale !== defaultLocale) {
        loadMessages(defaultLocale);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const setLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;

    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
    }

    // Load new messages
    loadMessages(newLocale);
  };

  if (isLoading || !messages) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--primary))]"></div>
      </div>
    );
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </I18nContext.Provider>
  );
}
