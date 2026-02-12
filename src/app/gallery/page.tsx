"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Phone, ArrowLeft, Loader2, MapPin } from "lucide-react"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { InstagramIcon } from "@/components/icons/instagram"
import { FacebookIcon } from "@/components/icons/facebook"
import Link from "next/link"
import { socialMedia } from "@/config/social-media"
import { ImageLightbox } from "@/components/image-lightbox"
import { parseHelpers, GalleryImageData } from "@/lib/parse"
import { useTranslations } from "next-intl"

export default function GalleryPage() {
  const tCommon = useTranslations('common')
  const tGallery = useTranslations('gallery')
  const [galleryItems, setGalleryItems] = useState<GalleryImageData[]>([])
  const [loading, setLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activeCategory, setActiveCategory] = useState("All")

  const categories = [
    tGallery('categories.all'),
    tGallery('categories.framed'),
    tGallery('categories.premium'),
    tGallery('categories.special')
  ]

  const categoryMap: Record<string, string> = {
    [tGallery('categories.all')]: "All",
    [tGallery('categories.framed')]: "Framed",
    [tGallery('categories.premium')]: "Premium",
    [tGallery('categories.special')]: "Special"
  }

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const images = await parseHelpers.getGalleryImages()
        setGalleryItems(images)
      } catch (error) {
        console.error('Failed to load gallery:', error)
      } finally {
        setLoading(false)
      }
    }
    loadGallery()
  }, [])

  const activeCategoryEnglish = categoryMap[activeCategory] || "All"
  const filteredItems = activeCategoryEnglish === "All"
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategoryEnglish)

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  const lightboxImages = filteredItems.map((item) => ({
    src: item.imagePath,
    alt: item.title,
    title: item.title,
  }))

  return (
    <div className="min-h-screen bg-cream overflow-x-hidden">
      <Navigation />

      {/* Hero Header */}
      <section className="pt-28 md:pt-36 pb-6 md:pb-10 bg-ivory">
        <div className="container max-w-6xl px-4 sm:px-6">
          <div className="text-center py-10 md:py-20">
            <span className="inline-flex items-center gap-3 text-xs uppercase tracking-luxury text-[hsl(var(--gold))] font-medium">
              <span className="w-10 h-px bg-[hsl(var(--gold))]/40" />
              {tGallery('hero.label')}
              <span className="w-10 h-px bg-[hsl(var(--gold))]/40" />
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground mt-6 mb-5 md:mb-8 leading-luxury">
              {tGallery('hero.title')}
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base leading-relaxed">
              {tGallery('hero.subtitle')}
            </p>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 pb-10 md:pb-14" role="group" aria-label={tGallery('categories.filterLabel')}>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
                className={`px-5 py-2.5 text-[11px] sm:text-[12px] uppercase tracking-wider font-medium rounded-full border transition-all duration-400 ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-muted-foreground border-border/40 hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 md:py-28 bg-sand">
        <div className="container max-w-6xl px-4 sm:px-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-7 w-7 animate-spin text-[hsl(var(--gold))]" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {filteredItems.map((item, i) => (
                <button
                  type="button"
                  key={item.id || `${item.title}-${i}`}
                  onClick={() => openLightbox(i)}
                  aria-label={`View ${item.title} in lightbox`}
                  className="gallery-frame gold-accent-line group relative aspect-[3/4] overflow-hidden cursor-pointer text-left rounded-2xl"
                >
                  <div className="relative w-full h-full overflow-hidden rounded-2xl">
                    <Image
                      src={item.imagePath}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      sizes="(max-width: 640px) 50vw, 33vw"
                      quality={85}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Content */}
                    <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                      <div className="translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                        <p className="text-[10px] uppercase tracking-luxury text-[hsl(var(--gold))] mb-1.5">{item.category}</p>
                        <p className="text-white font-serif text-sm md:text-lg leading-snug">{item.title}</p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!loading && filteredItems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-sm">{tGallery('empty.message')}</p>
            </div>
          )}

          {/* Back to Home */}
          {!loading && (
            <div className="flex justify-center mt-14">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 group"
              >
                <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform duration-300" />
                <span>{tCommon('buttons.backToHome')}</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-36 bg-cream">
        <div className="container max-w-4xl px-4 sm:px-6">
          <div className="relative overflow-hidden bg-primary p-10 sm:p-16 md:p-24 text-center rounded-3xl">

            <div className="relative">
              <span className="inline-flex items-center gap-3 text-xs uppercase tracking-luxury text-[hsl(var(--gold))] font-medium">
                <span className="w-10 h-px bg-[hsl(var(--gold))]/40" />
                {tGallery('cta.label')}
                <span className="w-10 h-px bg-[hsl(var(--gold))]/40" />
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-primary-foreground mt-6 mb-5 md:mb-8 leading-luxury">
                {tGallery('cta.title')}
              </h2>
              <p className="text-primary-foreground/60 max-w-sm mx-auto mb-12 text-sm sm:text-base leading-relaxed">
                {tGallery('cta.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-card text-foreground hover:bg-card/95 h-14 px-8 rounded-full font-semibold text-sm tracking-wide"
                >
                  <a href={socialMedia.phone.url}>
                    <Phone className="h-4 w-4 mr-3" />
                    {tCommon('buttons.bookAppointment')}
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp))]/90 text-white h-14 px-8 rounded-full font-semibold text-sm tracking-wide"
                >
                  <a href={socialMedia.whatsapp.url} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon className="h-4 w-4 mr-3" />
                    {tCommon('buttons.whatsappUs')}
                  </a>
                </Button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-14 md:py-16 bg-sand">
        <div className="container max-w-7xl px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/rajus-impressions-icon.png"
                alt="Raju's Impressions"
                width={36}
                height={36}
                className="object-contain transition-transform duration-300 group-hover:scale-110"
              />
              <div>
                <p className="font-serif text-lg text-foreground">{tCommon('brand.name')}</p>
                <p className="font-handwritten text-sm text-primary/50 hidden md:block">{tCommon('brand.tagline')}</p>
              </div>
            </Link>

            {/* Social */}
            <div className="flex items-center gap-4">
              <a
                href={socialMedia.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={tCommon('contact.followInstagram')}
                className="social-icon w-10 h-10 bg-card rounded-full shadow-sculptural flex items-center justify-center text-muted-foreground hover:text-[#E4405F] hover:shadow-sculptural-lg transition-all duration-300"
              >
                <InstagramIcon className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={socialMedia.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={tCommon('contact.followFacebook')}
                className="social-icon w-10 h-10 bg-card rounded-full shadow-sculptural flex items-center justify-center text-muted-foreground hover:text-[#1877F2] hover:shadow-sculptural-lg transition-all duration-300"
              >
                <FacebookIcon className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={socialMedia.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={tCommon('contact.chatWhatsApp')}
                className="social-icon w-10 h-10 bg-card rounded-full shadow-sculptural flex items-center justify-center text-muted-foreground hover:text-[hsl(var(--whatsapp))] hover:shadow-sculptural-lg transition-all duration-300"
              >
                <WhatsAppIcon className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            {/* Info */}
            <div className="text-center md:text-right">
              <a
                href={socialMedia.google.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <MapPin className="h-3.5 w-3.5" />
                {tCommon('location.city')}, {tCommon('location.state')}
              </a>
              <p className="text-xs text-muted-foreground/40 mt-1" suppressHydrationWarning>
                {tCommon('footer.copyright', { year: new Date().getFullYear() })}
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Lightbox */}
      <ImageLightbox
        images={lightboxImages}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={() => setCurrentImageIndex((prev) => (prev + 1) % filteredItems.length)}
        onPrevious={() => setCurrentImageIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)}
      />
    </div>
  )
}
