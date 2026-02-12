'use client';

import { usePathname } from 'next/navigation';
import {
  ExternalLink,
  LayoutDashboard,
  Images,
  FileText,
  MessageSquare,
  Mail,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

const pageConfig: Record<string, { title: string; icon: typeof LayoutDashboard; breadcrumb?: string[] }> = {
  '/admin': { title: 'Dashboard', icon: LayoutDashboard },
  '/admin/gallery': { title: 'Gallery', icon: Images },
  '/admin/content/services': { title: 'Services', icon: FileText, breadcrumb: ['Content'] },
  '/admin/content/testimonials': { title: 'Testimonials', icon: MessageSquare, breadcrumb: ['Content'] },
  '/admin/inquiries': { title: 'Enquiries', icon: Mail },
  '/admin/content': { title: 'Content', icon: FileText },
};

export function AdminHeader() {
  const pathname = usePathname();
  const config = pageConfig[pathname] || { title: 'Admin', icon: LayoutDashboard };
  const PageIcon = config.icon;

  return (
    <header className="sticky top-0 z-30 flex h-[90px] items-center justify-between px-6 lg:px-10 bg-[hsl(var(--admin-bg)_/_0.85)] backdrop-blur-xl border-b border-[hsl(var(--admin-border-subtle)_/_0.4)]">
      {/* Left: Admin badge + breadcrumb + page title */}
      <div className="flex items-center gap-3 lg:pl-0 pl-12">
        {/* Admin badge */}
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[hsl(var(--admin-gold)_/_0.1)] border border-[hsl(var(--admin-gold)_/_0.15)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--admin-gold))] animate-pulse" />
          <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-[hsl(var(--admin-gold))]">
            Admin
          </span>
        </span>

        {/* Separator */}
        <div className="hidden sm:block w-px h-5 bg-[hsl(var(--admin-border)_/_0.5)]" />

        {/* Breadcrumb + title */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[hsl(var(--admin-surface-2)_/_0.5)]">
            <PageIcon className="h-3.5 w-3.5 text-[hsl(var(--admin-text-muted))]" />
          </div>
          <div className="flex items-center gap-1.5">
            {config.breadcrumb?.map((crumb) => (
              <span key={crumb} className="flex items-center gap-1.5">
                <span className="text-[11px] text-[hsl(var(--admin-text-faint))]">{crumb}</span>
                <ChevronRight className="h-3 w-3 text-[hsl(var(--admin-text-faint)_/_0.5)]" />
              </span>
            ))}
            <h1 className="text-sm font-medium text-[hsl(var(--admin-text))]">
              {config.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Right: View site link */}
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-[hsl(var(--admin-border)_/_0.4)] text-[11px] tracking-wide text-[hsl(var(--admin-text-faint))] hover:text-[hsl(var(--admin-text))] hover:border-[hsl(var(--admin-border))] hover:bg-[hsl(var(--admin-surface)_/_0.5)] transition-all duration-200"
      >
        <ExternalLink className="h-3 w-3" />
        <span className="hidden sm:inline">View Site</span>
      </Link>
    </header>
  );
}
