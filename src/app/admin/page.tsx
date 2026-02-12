'use client';

import { useEffect, useState } from 'react';
import { parseHelpers } from '@/lib/parse';
import { Images, Mail, Star, FileText, Loader2, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  galleryCount: number;
  inquiryCount: number;
  newInquiries: number;
  testimonialCount: number;
  serviceCount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    galleryCount: 0,
    inquiryCount: 0,
    newInquiries: 0,
    testimonialCount: 0,
    serviceCount: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [gallery, inquiries, testimonials, services] = await Promise.all([
          parseHelpers.getGalleryImages(),
          parseHelpers.getInquiries(),
          parseHelpers.getTestimonials(),
          parseHelpers.getServices(),
        ]);

        setStats({
          galleryCount: gallery.length,
          inquiryCount: inquiries.length,
          newInquiries: inquiries.filter((i) => i.status === 'new').length,
          testimonialCount: testimonials.length,
          serviceCount: services.length,
        });

        setRecentInquiries(inquiries.slice(0, 5));
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--admin-gold))]" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Gallery',
      value: stats.galleryCount,
      icon: Images,
      href: '/admin/gallery',
      accent: 'hsl(var(--admin-gold))',
      accentDim: 'hsl(var(--admin-gold)_/_0.1)',
    },
    {
      title: 'New Enquiries',
      value: stats.newInquiries,
      subtitle: `${stats.inquiryCount} total`,
      icon: Mail,
      href: '/admin/inquiries',
      accent: 'hsl(200 60% 55%)',
      accentDim: 'hsl(200 60% 55%_/_0.1)',
    },
    {
      title: 'Testimonials',
      value: stats.testimonialCount,
      icon: Star,
      href: '/admin/content/testimonials',
      accent: 'hsl(38 55% 55%)',
      accentDim: 'hsl(38 55% 55%_/_0.1)',
    },
    {
      title: 'Services',
      value: stats.serviceCount,
      icon: FileText,
      href: '/admin/content/services',
      accent: 'hsl(160 45% 45%)',
      accentDim: 'hsl(160 45% 45%_/_0.1)',
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <p className="text-[11px] tracking-[0.2em] uppercase text-[hsl(var(--admin-gold-dim))]">
          {getGreeting()}
        </p>
        <h1 className="font-serif text-2xl text-[hsl(var(--admin-text))] mt-1">
          Welcome back
        </h1>
        <p className="text-sm text-[hsl(var(--admin-text-faint))] mt-1">
          Here&apos;s an overview of your studio.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href} className="block h-full">
            <div className="admin-card p-6 h-full flex flex-col group cursor-pointer hover:border-[hsl(var(--admin-gold)_/_0.15)] transition-all duration-300">
              <div className="flex items-center justify-between">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: stat.accentDim }}
                >
                  <stat.icon className="h-[18px] w-[18px]" style={{ color: stat.accent }} />
                </div>
                <ArrowRight className="h-4 w-4 text-[hsl(var(--admin-text-faint))] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
              </div>
              <div className="mt-5 flex-grow">
                <p className="text-3xl font-bold tracking-tight text-[hsl(var(--admin-text))]">
                  {stat.value}
                </p>
                <p className="text-[11px] tracking-[0.1em] uppercase text-[hsl(var(--admin-text-muted))] mt-1.5">
                  {stat.title}
                </p>
                <p className="text-[10px] text-[hsl(var(--admin-text-faint))] h-4 mt-0.5">
                  {stat.subtitle || ''}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Enquiries */}
      <div className="admin-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--admin-border-subtle))]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[hsl(var(--admin-gold)_/_0.1)] flex items-center justify-center">
              <Clock className="h-4 w-4 text-[hsl(var(--admin-gold))]" />
            </div>
            <h2 className="text-sm font-medium text-[hsl(var(--admin-text))]">
              Recent Enquiries
            </h2>
          </div>
          <Link
            href="/admin/inquiries"
            className="flex items-center gap-1.5 text-[11px] text-[hsl(var(--admin-gold-dim))] hover:text-[hsl(var(--admin-gold))] transition-colors"
          >
            View all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {recentInquiries.length === 0 ? (
          <div className="text-center py-12 px-6">
            <div className="w-14 h-14 rounded-xl bg-[hsl(var(--admin-surface-2))] flex items-center justify-center mx-auto mb-3">
              <Mail className="h-6 w-6 text-[hsl(var(--admin-text-faint))]" />
            </div>
            <p className="text-sm text-[hsl(var(--admin-text-muted))]">No enquiries yet</p>
            <p className="text-xs text-[hsl(var(--admin-text-faint))] mt-1">
              Enquiries from your website will appear here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[hsl(var(--admin-border-subtle)_/_0.5)]">
            {recentInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="flex items-center justify-between px-6 py-3.5 hover:bg-[hsl(var(--admin-surface-2)_/_0.3)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[hsl(var(--admin-rose-dim))] flex items-center justify-center text-[hsl(var(--admin-gold))] font-semibold text-xs">
                    {inquiry.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-[hsl(var(--admin-text))]">
                      {inquiry.name}
                    </p>
                    <p className="text-xs text-[hsl(var(--admin-text-faint))] mt-0.5">
                      {inquiry.phone}
                    </p>
                  </div>
                </div>
                <span className={`admin-status-pill admin-status-${inquiry.status}`}>
                  {inquiry.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
