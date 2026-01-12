'use client';

import { useEffect, useState } from 'react';
import { parseHelpers } from '@/lib/parse';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Images, MessageSquare, Star, FileText, Loader2 } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your website.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gallery Images</CardTitle>
            <Images className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.galleryCount}</div>
            <Link href="/admin/gallery">
              <Button variant="link" className="px-0 text-xs">
                Manage gallery &rarr;
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Inquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newInquiries}</div>
            <p className="text-xs text-muted-foreground">
              {stats.inquiryCount} total inquiries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Testimonials</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.testimonialCount}</div>
            <Link href="/admin/content/testimonials">
              <Button variant="link" className="px-0 text-xs">
                Manage testimonials &rarr;
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.serviceCount}</div>
            <Link href="/admin/content/services">
              <Button variant="link" className="px-0 text-xs">
                Manage services &rarr;
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Inquiries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          {recentInquiries.length === 0 ? (
            <p className="text-muted-foreground text-sm">No inquiries yet.</p>
          ) : (
            <div className="space-y-4">
              {recentInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{inquiry.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {inquiry.phone} {inquiry.email && `• ${inquiry.email}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
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
                </div>
              ))}
            </div>
          )}
          <Link href="/admin/inquiries" className="block mt-4">
            <Button variant="outline" className="w-full">
              View all inquiries
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
