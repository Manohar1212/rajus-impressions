'use client';

import Link from 'next/link';
import { FileText, MessageSquare, ArrowRight } from 'lucide-react';

const contentSections = [
  {
    title: 'Services',
    description: 'Manage the services displayed on your homepage',
    href: '/admin/content/services',
    icon: FileText,
  },
  {
    title: 'Testimonials',
    description: 'Manage customer testimonials and reviews',
    href: '/admin/content/testimonials',
    icon: MessageSquare,
  },
];

export default function ContentOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] tracking-[0.2em] uppercase text-[hsl(var(--admin-gold-dim))]">
          Manage
        </p>
        <h1 className="font-serif text-2xl text-[hsl(var(--admin-text))] mt-1">
          Content
        </h1>
        <p className="text-sm text-[hsl(var(--admin-text-faint))] mt-1">
          Manage all content displayed on your website.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {contentSections.map((section) => (
          <Link key={section.href} href={section.href}>
            <div className="admin-card p-6 h-full group cursor-pointer hover:border-[hsl(var(--admin-gold)_/_0.15)] transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[hsl(var(--admin-gold)_/_0.08)] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <section.icon className="h-5 w-5 text-[hsl(var(--admin-gold))]" />
                </div>
                <ArrowRight className="h-5 w-5 text-[hsl(var(--admin-text-faint))] group-hover:text-[hsl(var(--admin-gold))] group-hover:translate-x-0.5 transition-all duration-300" />
              </div>
              <h2 className="mt-5 text-base font-medium text-[hsl(var(--admin-text))]">
                {section.title}
              </h2>
              <p className="text-sm text-[hsl(var(--admin-text-faint))] mt-1">
                {section.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
