"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Phone, ArrowRight, Loader2 } from "lucide-react"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import Link from "next/link"
import { socialMedia } from "@/config/social-media"
import { ImageLightbox } from "@/components/image-lightbox"
import { parseHelpers, GalleryImageData } from "@/lib/parse"

const categories = ["All", "Framed", "Premium", "Special"]

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryImageData[]>([])
  const [loading, setLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activeCategory, setActiveCategory] = useState("All")

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

  const filteredItems = activeCategory === "All"
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory)

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
    <div className="min-h-screen bg-[#fafafa]">
      <Navigation />

      {/* Hero Header */}
      <section className="pt-20 md:pt-24">
        <div className="container max-w-6xl">
          <div className="text-center py-12 md:py-16">
            <p className="text-primary text-sm font-medium tracking-wider uppercase mb-3">Portfolio</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Our Gallery
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Every impression captures a precious moment. Browse our collection of handcrafted keepsakes.
            </p>
          </div>

          {/* Category Pills */}
          <div className="flex justify-center gap-2 pb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-foreground text-background shadow-lg"
                    : "bg-white text-muted-foreground hover:text-foreground hover:shadow-md border border-border/50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-20 md:pb-28">
        <div className="container max-w-6xl">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {filteredItems.map((item, i) => (
                <div
                  key={item.id || `${item.title}-${i}`}
                  onClick={() => openLightbox(i)}
                  className="group relative aspect-[4/5] overflow-hidden rounded-2xl cursor-pointer bg-white shadow-sm hover:shadow-xl transition-all duration-500"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                    <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <p className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1">{item.category}</p>
                      <p className="text-white font-semibold">{item.title}</p>
                    </div>
                  </div>

                  {/* Corner accent */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/0 group-hover:bg-white/90 flex items-center justify-center transition-all duration-300 scale-0 group-hover:scale-100">
                    <ArrowRight className="h-4 w-4 text-foreground -rotate-45" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredItems.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No impressions in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-20 md:pb-28">
        <div className="container max-w-5xl px-4">
          <div className="relative overflow-hidden rounded-3xl bg-foreground p-10 md:p-16">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            </div>

            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to create yours?
              </h2>
              <p className="text-white/60 mb-10 max-w-md mx-auto text-lg">
                Let us capture your baby&apos;s precious moments in a beautiful, lasting impression.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-foreground hover:bg-white/90 rounded-full px-8 h-14 text-base font-semibold shadow-2xl">
                  <a href={socialMedia.phone.url}>
                    <Phone className="h-5 w-5 mr-2" />
                    Book Appointment
                  </a>
                </Button>
                <Button asChild size="lg" className="bg-[#25D366] hover:bg-[#22c55e] text-white rounded-full px-8 h-14 text-base font-semibold shadow-2xl">
                  <a href={socialMedia.whatsapp.url} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon className="h-5 w-5 mr-2" />
                    WhatsApp Us
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/10 bg-white">
        <div className="container max-w-7xl py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link href="/" className="text-foreground font-semibold">
              Raju&apos;s Impressions
            </Link>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <Link href="/gallery" className="hover:text-foreground transition-colors">Gallery</Link>
              <span>&copy; 2025</span>
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
