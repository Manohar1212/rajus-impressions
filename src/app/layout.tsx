import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rajus-impressions.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Raju's Impressions - Baby Hand & Foot Impressions | All India Delivery",
    template: "%s | Raju's Impressions",
  },
  description: "India's most trusted baby hand & foot impression studio. Handcrafted keepsakes delivered across India. Preserve your precious moments forever with 100% handmade impressions.",
  keywords: [
    "baby impressions",
    "hand impressions",
    "foot impressions",
    "baby keepsakes",
    "newborn memories",
    "baby casting",
    "baby molds",
    "infant impressions",
    "pregnancy belly casting",
    "pet paw prints",
    "India delivery",
    "handcrafted keepsakes",
  ],
  authors: [{ name: "Raju's Impressions" }],
  creator: "Raju's Impressions",
  publisher: "Raju's Impressions",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
    shortcut: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Raju's Impressions",
    title: "Raju's Impressions - Baby Hand & Foot Impressions",
    description: "India's most trusted baby hand & foot impression studio. Handcrafted keepsakes delivered across India.",
    images: [
      {
        url: "/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Raju's Impressions - Beautiful baby hand and foot impressions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Raju's Impressions - Baby Hand & Foot Impressions",
    description: "India's most trusted baby hand & foot impression studio. Handcrafted keepsakes delivered across India.",
    images: ["/hero.jpg"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "Baby Products & Services",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Raju's Impressions",
  image: `${siteUrl}/hero.jpg`,
  description: "India's most trusted baby hand & foot impression studio. Handcrafted keepsakes delivered across India.",
  url: siteUrl,
  telephone: "+91-9876543210",
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "20.5937",
    longitude: "78.9629",
  },
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  priceRange: "$$",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "09:00",
    closes: "18:00",
  },
  sameAs: [
    "https://www.instagram.com/rajusimpressions",
    "https://www.facebook.com/rajusimpressions",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
