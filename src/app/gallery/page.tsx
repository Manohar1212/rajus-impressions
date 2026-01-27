"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Phone, ArrowRight, ArrowLeft, Loader2 } from "lucide-react"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
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
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />

      {/* Hero Header */}
      <section className="pt-24 md:pt-32">
        <div className="container max-w-6xl px-4 sm:px-6">
          <div className="text-center py-6 md:py-12">
            <span className="text-xs uppercase tracking-luxury text-[hsl(var(--gold))] font-medium">{tGallery('hero.label')}</span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mt-4 mb-4 md:mb-6 leading-luxury">
              {tGallery('hero.title')}
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">
              {tGallery('hero.subtitle')}
            </p>
          </div>

          {/* Category Pills - Elegant style */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 pb-8 md:pb-12" role="group" aria-label={tGallery('categories.filterLabel')}>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 text-[11px] sm:text-[13px] uppercase tracking-wider font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-foreground text-background"
                    : "bg-transparent text-muted-foreground hover:text-foreground border-b border-transparent hover:border-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-20 md:pb-36">
        <div className="container max-w-6xl px-4 sm:px-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {filteredItems.map((item, i) => (
                <button
                  type="button"
                  key={item.id || `${item.title}-${i}`}
                  onClick={() => openLightbox(i)}
                  aria-label={`View ${item.title} in lightbox`}
                  className="group relative aspect-[3/4] overflow-hidden cursor-pointer bg-muted text-left hover-lift"
                >
                  <Image
                    src={item.imagePath}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 33vw"
                    quality={85}
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                  {/* Gold accent */}
                  <div className="absolute top-4 left-4 w-6 h-px bg-[hsl(var(--gold))] opacity-0 group-hover:opacity-100 transition-all duration-500" />

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                    <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <p className="text-[10px] uppercase tracking-luxury text-[hsl(var(--gold))] mb-1">{item.category}</p>
                      <p className="text-white font-serif text-lg">{item.title}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!loading && filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{tGallery('empty.message')}</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - Premium style */}
      <section className="pb-12 md:pb-20">
        <div className="container max-w-5xl px-4 sm:px-6">
          <div className="relative overflow-hidden bg-foreground p-8 sm:p-10 md:p-16 text-center">
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-16 sm:w-24 h-16 sm:h-24">
              <div className="absolute top-4 sm:top-6 left-4 sm:left-6 w-full h-px bg-gradient-to-r from-[hsl(var(--gold))]/50 to-transparent" />
              <div className="absolute top-4 sm:top-6 left-4 sm:left-6 h-full w-px bg-gradient-to-b from-[hsl(var(--gold))]/50 to-transparent" />
            </div>
            <div className="absolute bottom-0 right-0 w-16 sm:w-24 h-16 sm:h-24">
              <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 w-full h-px bg-gradient-to-l from-[hsl(var(--gold))]/50 to-transparent" />
              <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 h-full w-px bg-gradient-to-t from-[hsl(var(--gold))]/50 to-transparent" />
            </div>

            <div className="relative">
              <span className="text-xs uppercase tracking-luxury text-[hsl(var(--gold))] font-medium">{tGallery('cta.label')}</span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-background mt-4 mb-4 md:mb-6 leading-luxury">
                {tGallery('cta.title')}
              </h2>
              <p className="text-background/50 max-w-md mx-auto mb-8 md:mb-10 text-sm sm:text-base">
                {tGallery('cta.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-background text-foreground hover:bg-background/95 h-12 sm:h-14 px-6 sm:px-10 rounded-none text-sm uppercase tracking-wider font-medium btn-luxury"
                >
                  <a href={socialMedia.phone.url}>
                    <Phone className="h-4 w-4 mr-2 sm:mr-3" />
                    {tCommon('buttons.bookAppointment')}
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp))]/90 text-white h-12 sm:h-14 px-6 sm:px-10 rounded-none text-sm uppercase tracking-wider font-medium btn-luxury"
                >
                  <a href={socialMedia.whatsapp.url} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon className="h-4 w-4 mr-2 sm:mr-3" />
                    {tCommon('buttons.whatsappUs')}
                  </a>
                </Button>
              </div>

              {/* Back to Home Link */}
              <div className="mt-6 sm:mt-8">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm text-background/60 hover:text-background transition-colors group"
                >
                  <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
                  <span>{tCommon('buttons.backToHome')}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="border-t border-border/30 bg-background">
        <div className="container max-w-7xl py-6 sm:py-10 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-6">
            <Link href="/" className="font-serif text-base sm:text-xl text-foreground hover:text-primary transition-colors">
              {tCommon('brand.name')}
            </Link>
            <div className="flex items-center gap-3 sm:gap-8 text-xs sm:text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors uppercase tracking-wider">{tCommon('footer.home')}</Link>
              <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
              <Link href="/gallery" className="hover:text-foreground transition-colors uppercase tracking-wider">{tCommon('footer.gallery')}</Link>
              <span className="w-1 h-1 bg-muted-foreground/30 rounded-full hidden sm:block" />
              <span className="text-muted-foreground/60 hidden sm:inline" suppressHydrationWarning>{tCommon('footer.copyright', { year: new Date().getFullYear() })}</span>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground/60 mt-3 sm:hidden" suppressHydrationWarning>
            {tCommon('footer.copyright', { year: new Date().getFullYear() })}
          </p>
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
