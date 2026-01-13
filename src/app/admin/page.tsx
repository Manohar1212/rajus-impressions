'use client';

import { useEffect, useState } from 'react';
import { parseHelpers } from '@/lib/parse';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Images, Mail, Star, FileText, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Gallery Images',
      value: stats.galleryCount,
      icon: Images,
      href: '/admin/gallery',
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'New Enquiries',
      value: stats.newInquiries,
      subtitle: `${stats.inquiryCount} total`,
      icon: Mail,
      href: '/admin/inquiries',
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      title: 'Testimonials',
      value: stats.testimonialCount,
      icon: Star,
      href: '/admin/content/testimonials',
      color: 'bg-yellow-500/10 text-yellow-600',
    },
    {
      title: 'Services',
      value: stats.serviceCount,
      icon: FileText,
      href: '/admin/content/services',
      color: 'bg-green-500/10 text-green-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s an overview of your website.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/30 cursor-pointer rounded-2xl border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
                  {stat.subtitle && (
                    <p className="text-xs text-muted-foreground/70">{stat.subtitle}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Enquiries */}
      <Card className="rounded-2xl border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Recent Enquiries</CardTitle>
            <Link href="/admin/inquiries">
              <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary hover:bg-primary/10 rounded-full">
                View all
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentInquiries.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">No enquiries yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {inquiry.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{inquiry.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {inquiry.phone}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                      inquiry.status === 'new'
                        ? 'bg-blue-100 text-blue-700'
                        : inquiry.status === 'contacted'
                        ? 'bg-yellow-100 text-yellow-700'
                        : inquiry.status === 'booked'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {inquiry.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
