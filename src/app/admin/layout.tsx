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
  const [username, setUsername] = useState('Admin');

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
          const user = parseHelpers.getCurrentUser();
          if (user) {
            setUsername(user.get('username') || 'Admin');
          }
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
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <AdminSidebar />
      <div className="lg:pl-72">
        <AdminHeader username={username} />
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
