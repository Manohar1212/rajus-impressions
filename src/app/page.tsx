"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { GoogleIcon } from "@/components/icons/google"
import { InstagramIcon } from "@/components/icons/instagram"
import { FacebookIcon } from "@/components/icons/facebook"
import { Heart, Phone, MapPin, Star, Loader2 } from "lucide-react"
import { socialMedia } from "@/config/social-media"
import { parseHelpers, GalleryImageData, ServiceData, TestimonialData } from "@/lib/parse"

export default function Home() {
  const [galleryImages, setGalleryImages] = useState<GalleryImageData[]>([])
  const [services, setServices] = useState<ServiceData[]>([])
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [gallery, servicesData, testimonialsData] = await Promise.all([
          parseHelpers.getGalleryImages(),
          parseHelpers.getServices(),
          parseHelpers.getTestimonials(),
        ])
        setGalleryImages(gallery.slice(0, 8)) // First 8 for homepage
        setServices(servicesData.filter(s => s.active))
        setTestimonials(testimonialsData.filter(t => t.active))
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Gallery grid layout mapping
  const galleryLayout = [
    { span: "col-span-2 row-span-2" },
    { span: "" },
    { span: "" },
    { span: "" },
    { span: "" },
    { span: "row-span-2" },
    { span: "col-span-2" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/hero.jpg"
            alt="Baby impressions showcase"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 container max-w-4xl px-6 text-center">
          <div className="flex flex-col items-center space-y-8">
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] animate-fade-in-up">
              Memories You Can{" "}
              <span className="text-primary">Touch</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-white/70 max-w-2xl animate-fade-in-up delay-100">
              Handcrafted baby hand & foot impressions, delivered across India
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 animate-fade-in-up delay-200">
              <Button asChild size="lg" className="bg-white text-foreground hover:bg-white/90 px-8 h-12 rounded-full font-medium transition-all duration-300 hover:scale-105">
                <a href={socialMedia.phone.url}>
                  <Phone className="mr-2 h-4 w-4 text-primary" />
                  Book Appointment
                </a>
              </Button>
              <Button asChild size="lg" className="bg-[#25D366] hover:bg-[#22c55e] text-white px-8 h-12 rounded-full font-medium transition-all duration-300 hover:scale-105">
                <a href={socialMedia.whatsapp.url} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="mr-2 h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-8 text-white/60 text-sm animate-fade-in-up delay-300">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary fill-primary" />
                <span>500+ Happy Parents</span>
              </div>
              <span className="hidden sm:block w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>All India Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section id="gallery" className="relative py-16 md:py-24">
        <div className="container max-w-7xl">
          {/* Section Header */}
          <div className="flex items-end justify-between mb-8 md:mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Our Work</h2>
              <p className="text-muted-foreground mt-1">Handcrafted with love</p>
            </div>
            <a href="/gallery" className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
              View all &rarr;
            </a>
          </div>

          {/* Gallery Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 auto-rows-[200px] md:auto-rows-[280px] lg:auto-rows-[320px]">
              {galleryImages.slice(0, 7).map((item, i) => (
                <a
                  key={item.id || i}
                  href="/gallery"
                  className={`group relative overflow-hidden rounded-xl md:rounded-2xl bg-muted ${galleryLayout[i]?.span || ''}`}
                >
                  <Image
                    src={item.imagePath}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes={galleryLayout[i]?.span.includes("col-span-2") || galleryLayout[i]?.span.includes("row-span-2") ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 33vw"}
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative py-16 md:py-24">
        <div className="container max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-10 text-foreground">Services</h2>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services.map((service, i) => (
                <div key={service.id || i} className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                  <Image
                    src={service.imagePath}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-white font-semibold text-lg">{service.title}</h3>
                    {service.description && (
                      <p className="text-white/70 text-sm mt-1">{service.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-16 md:py-24">
        <div className="container max-w-5xl">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
              What Parents Say
            </h3>
            <p className="text-muted-foreground">
              Trusted by families across India
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((testimonial, i) => (
                <div key={testimonial.id || i} className="p-6 rounded-2xl bg-card border border-border/30 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {testimonial.location}
                      </p>
                    </div>
                    <div className="flex gap-0.5 ml-auto">
                      {Array.from({ length: testimonial.rating }).map((_, j) => (
                        <Star key={j} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    &ldquo;{testimonial.message}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Google Reviews Link */}
          <div className="text-center mt-8">
            <a
              href="https://www.google.com/maps/place/Raju's+impressions/@16.96459,82.2223536,17z/data=!4m14!1m5!8m4!1e2!2s117035476350201717718!3m1!1e1!3m7!1s0x3a3829a1b758add7:0x89d98b189ae06c56!8m2!3d16.96459!4d82.2249285!9m1!1b1!16s%2Fg%2F11r21vl9qs?hl=en&entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <GoogleIcon className="h-4 w-4" />
              <span>View all reviews on Google</span>
              <span className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                ))}
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-16 md:py-24">
        <div className="container max-w-5xl">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
              Get In Touch
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Ready to preserve your precious moments? Contact us today
            </p>
          </div>

          {/* Contact Options - Inline Style */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              href={socialMedia.phone.url}
              className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-card border border-border/30 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group w-full sm:w-auto"
            >
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <Phone className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Call Us</p>
                <p className="font-semibold text-foreground">{socialMedia.phone.displayNumber}</p>
              </div>
            </a>

            <a
              href={socialMedia.whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-card border border-border/30 hover:border-[#25D366]/30 hover:shadow-lg transition-all duration-300 group w-full sm:w-auto"
            >
              <div className="p-2.5 rounded-xl bg-[#25D366]/10 text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-all duration-300">
                <WhatsAppIcon className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground">WhatsApp</p>
                <p className="font-semibold text-foreground">Chat with us</p>
              </div>
            </a>

            <a
              href={socialMedia.google.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-card border border-border/30 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group w-full sm:w-auto"
            >
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-semibold text-foreground">{socialMedia.google.location}</p>
              </div>
            </a>
          </div>

          {/* Social Links - Simple Row */}
          <div className="flex items-center justify-center gap-3">
            <span className="text-sm text-muted-foreground">Follow us:</span>
            <a
              href={socialMedia.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-card border border-border/30 text-muted-foreground hover:text-[#E4405F] hover:border-[#E4405F]/30 transition-all duration-300"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a
              href={socialMedia.facebook.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-card border border-border/30 text-muted-foreground hover:text-[#1877F2] hover:border-[#1877F2]/30 transition-all duration-300"
            >
              <FacebookIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20">
        <div className="container max-w-7xl py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="relative h-5 w-5 flex-shrink-0">
                <Image
                  src="/rajus-impressions-icon.png"
                  alt="Raju's Impressions"
                  fill
                  className="object-contain"
                />
              </div>
              <span>Raju&apos;s Impressions</span>
            </div>
            <p>© 2025 All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
