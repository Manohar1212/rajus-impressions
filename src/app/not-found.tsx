'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('metadata.notFound');
  const tCommon = useTranslations('common');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-primary/20">{t('heading')}</h1>
        <h2 className="text-3xl font-semibold mt-4 mb-2">{t('subheading')}</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          {t('message')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              {tCommon('buttons.goHome')}
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/gallery">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {tCommon('buttons.viewGallery')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
