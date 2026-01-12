'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, MessageSquare, Settings, ArrowRight } from 'lucide-react';

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
        <h1 className="text-3xl font-bold">Content Management</h1>
        <p className="text-muted-foreground">
          Manage all content displayed on your website.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {contentSections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="h-full transition-colors hover:bg-muted/50 cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <section.icon className="h-8 w-8 text-primary" />
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardTitle className="mt-4">{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
