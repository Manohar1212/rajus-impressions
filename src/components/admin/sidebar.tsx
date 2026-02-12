'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Images,
  FileText,
  MessageSquare,
  Mail,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Gallery', href: '/admin/gallery', icon: Images },
  { name: 'Services', href: '/admin/content/services', icon: FileText },
  { name: 'Testimonials', href: '/admin/content/testimonials', icon: MessageSquare },
  { name: 'Enquiries', href: '/admin/inquiries', icon: Mail },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-3">
          <img
            src="/rajus-impressions-icon.png"
            alt="Raju's Impressions"
            className="h-8 w-8 object-contain"
          />
          <div>
            <p className="font-serif text-[hsl(var(--admin-text))] text-sm leading-tight">
              Raju&apos;s Impressions
            </p>
            <p className="font-handwritten text-[11px] text-[hsl(var(--admin-gold-dim))] mt-0.5">
              Memories You Can Touch
            </p>
          </div>
        </div>
      </div>

      {/* Gold divider */}
      <div className="mx-6 admin-gold-line" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 relative',
                isActive
                  ? 'text-[hsl(var(--admin-gold))] bg-[hsl(var(--admin-gold)_/_0.15)] shadow-[0_0_12px_hsl(var(--admin-gold)_/_0.1)]'
                  : 'text-[hsl(var(--admin-text-muted))] hover:text-[hsl(var(--admin-text))] hover:bg-[hsl(var(--admin-surface-2))]'
              )}
            >
              {/* Active indicator - vertical gold bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-full bg-[hsl(var(--admin-gold))]" />
              )}
              <item.icon className={cn(
                'h-[18px] w-[18px] transition-colors duration-300',
                isActive ? 'text-[hsl(var(--admin-gold))]' : 'text-[hsl(var(--admin-text-muted))] group-hover:text-[hsl(var(--admin-text))]'
              )} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-5">
        <div className="admin-gold-line mb-4" />
        <button
          onClick={() => {
            import('@/lib/parse').then(({ parseHelpers }) => {
              parseHelpers.logout();
              window.location.href = '/admin/login';
            });
          }}
          className="group w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium text-[hsl(var(--admin-text-faint))] hover:text-[hsl(var(--admin-text))] hover:bg-[hsl(var(--admin-surface-2)_/_0.5)] transition-all duration-300"
        >
          <LogOut className="h-[17px] w-[17px] text-[hsl(var(--admin-text-faint))] group-hover:text-[hsl(var(--admin-text-muted))] transition-colors duration-300" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 rounded-xl bg-[hsl(var(--admin-surface))] border border-[hsl(var(--admin-border))] flex items-center justify-center text-[hsl(var(--admin-text-muted))] hover:text-[hsl(var(--admin-text))] transition-colors"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-[hsl(var(--admin-bg))] transform transition-transform duration-300 ease-out lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <NavContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-[hsl(var(--admin-bg))] lg:block">
        <NavContent />
      </aside>
    </>
  );
}
