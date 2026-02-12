'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { parseHelpers } from '@/lib/parse';
import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminHeader } from '@/components/admin/header';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkAuth = async () => {
      // Skip auth check for login page
      if (pathname === '/admin/login') {
        setLoading(false);
        return;
      }

      try {
        const isAuthenticated = await parseHelpers.isAuthenticated();

        if (!isAuthenticated) {
          router.push('/admin/login');
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/admin/login');
      }
    };

    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loading && pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    }, 5000);

    checkAuth();

    return () => clearTimeout(timeout);
  }, [pathname, router, loading]);

  // Show login page without layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="admin-dark min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--admin-gold))]" />
      </div>
    );
  }

  return (
    <div className="admin-dark admin-grain min-h-screen relative">
      <AdminSidebar />
      <div className="lg:pl-64 relative z-10 min-h-screen">
        <AdminHeader />
        <main
          className="admin-content px-6 lg:px-10 py-8 min-h-[calc(100vh-90px)]"
          style={{
            '--admin-bg': '0 0% 97%',
            '--admin-surface': '0 0% 100%',
            '--admin-surface-2': '30 10% 96%',
            '--admin-surface-3': '30 8% 93%',
            '--admin-border': '30 8% 88%',
            '--admin-border-subtle': '30 8% 92%',
            '--admin-text': '25 20% 13%',
            '--admin-text-muted': '25 10% 45%',
            '--admin-text-faint': '25 8% 62%',
            '--admin-gold': '38 55% 45%',
            '--admin-gold-dim': '38 35% 35%',
            '--admin-rose-dim': '340 15% 92%',
            background: 'hsl(0 0% 97%)',
            color: 'hsl(25 20% 13%)',
            colorScheme: 'light',
          } as React.CSSProperties}
        >
          <div className="max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
