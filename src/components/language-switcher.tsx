'use client';

import { useLocale } from '@/providers/i18n-provider';
import { locales, localeShortNames, type Locale } from '@/i18n/config';
import { Button } from '@/components/ui/button';

interface LanguageSwitcherProps {
  variant?: 'desktop' | 'mobile';
  useScrolledStyle?: boolean;
}

export function LanguageSwitcher({ variant = 'desktop', useScrolledStyle = false }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLocale();

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale !== locale) {
      setLocale(newLocale);
    }
  };

  if (variant === 'mobile') {
    return (
      <div className="flex flex-col gap-1 px-5 py-3 border-b border-border/20">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Language</p>
        <div className="flex gap-2">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleLocaleChange(loc)}
              className={`flex-1 py-2 text-sm font-medium transition-all duration-300 ${
                locale === loc
                  ? 'bg-foreground text-background'
                  : 'bg-transparent text-muted-foreground hover:text-foreground border border-border/30 hover:border-foreground'
              }`}
              aria-label={`Switch to ${localeShortNames[loc]}`}
            >
              {localeShortNames[loc]}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Desktop variant - minimalist toggle
  return (
    <div className="flex items-center border border-border/30 divide-x divide-border/30">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleLocaleChange(loc)}
          className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-medium transition-all duration-300 ${
            locale === loc
              ? useScrolledStyle
                ? 'bg-foreground text-background'
                : 'bg-white text-foreground'
              : useScrolledStyle
                ? 'text-muted-foreground hover:text-foreground'
                : 'text-white/60 hover:text-white'
          }`}
          aria-label={`Switch to ${localeShortNames[loc]}`}
          aria-pressed={locale === loc}
        >
          {localeShortNames[loc]}
        </button>
      ))}
    </div>
  );
}
