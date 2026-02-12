"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { InstagramIcon } from "@/components/icons/instagram"
import { FacebookIcon } from "@/components/icons/facebook"
import { GoogleIcon } from "@/components/icons/google"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Phone, MapPin, Star, Loader2, ArrowRight, ChevronDown, Heart, Shield, Award, Truck, CheckCircle2, Send } from "lucide-react"
import { socialMedia } from "@/config/social-media"
import { parseHelpers, GalleryImageData, ServiceData, TestimonialData } from "@/lib/parse"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useTranslations } from "next-intl"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Custom hook for scroll reveal with GSAP
function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            end: "top 60%",
            toggleActions: "play none none reverse",
            onEnter: () => setIsVisible(true),
          },
        }
      )
    }, element)

    return () => ctx.revert()
  }, [threshold])

  return { ref, isVisible }
}

// Custom hook for full-width carousel with dots
function useCarousel(itemCount: number, autoPlay: boolean = false, autoPlayDelay: number = 5000) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const prevItemCountRef = useRef(itemCount)
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const container = scrollRef.current
    if (!container || itemCount === 0) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const itemWidth = container.offsetWidth
      const index = Math.round(scrollLeft / itemWidth)
      setActiveIndex(Math.min(Math.max(index, 0), itemCount - 1))
    }

    if (prevItemCountRef.current !== itemCount) {
      prevItemCountRef.current = itemCount
      container.scrollTo({ left: 0, behavior: 'auto' })
      requestAnimationFrame(handleScroll)
    } else {
      const timeoutId = setTimeout(handleScroll, 100)

      container.addEventListener('scroll', handleScroll, { passive: true })
      return () => {
        container.removeEventListener('scroll', handleScroll)
        clearTimeout(timeoutId)
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [itemCount])

  useEffect(() => {
    if (!autoPlay || itemCount === 0) return

    const startAutoPlay = () => {
      autoPlayTimerRef.current = setInterval(() => {
        setActiveIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % itemCount
          const container = scrollRef.current
          if (container) {
            const itemWidth = container.offsetWidth
            container.scrollTo({
              left: nextIndex * itemWidth,
              behavior: 'smooth'
            })
          }
          return nextIndex
        })
      }, autoPlayDelay)
    }

    startAutoPlay()

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current)
      }
    }
  }, [autoPlay, autoPlayDelay, itemCount])

  const scrollToIndex = (index: number) => {
    const container = scrollRef.current
    if (!container) return
    const itemWidth = container.offsetWidth
    container.scrollTo({
      left: index * itemWidth,
      behavior: 'smooth'
    })

    if (autoPlay && autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current)
      autoPlayTimerRef.current = setInterval(() => {
        setActiveIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % itemCount
          const container = scrollRef.current
          if (container) {
            const itemWidth = container.offsetWidth
            container.scrollTo({
              left: nextIndex * itemWidth,
              behavior: 'smooth'
            })
          }
          return nextIndex
        })
      }, autoPlayDelay)
    }
  }

  return { scrollRef, activeIndex, scrollToIndex }
}

export default function Home() {
  const tCommon = useTranslations('common')
  const tHome = useTranslations('home')
  const [galleryImages, setGalleryImages] = useState<GalleryImageData[]>([])
  const [services, setServices] = useState<ServiceData[]>([])
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([])
  const [loading, setLoading] = useState(true)

  // Enquiry form state
  const [formName, setFormName] = useState("")
  const [formPhone, setFormPhone] = useState("")
  const [formEmail, setFormEmail] = useState("")
  const [formService, setFormService] = useState("")
  const [formMessage, setFormMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState("")

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")
    setSubmitting(true)

    try {
      await parseHelpers.createInquiry({
        name: formName,
        phone: formPhone,
        email: formEmail || undefined,
        message: formMessage,
        service: formService || undefined,
        status: 'new',
      })
      setSubmitted(true)
      setFormName("")
      setFormPhone("")
      setFormEmail("")
      setFormService("")
      setFormMessage("")
    } catch {
      setFormError(tHome('enquiryForm.errorMessage'))
    } finally {
      setSubmitting(false)
    }
  }

  const features = [
    {
      icon: Award,
      title: tHome('features.items.0.title'),
      description: tHome('features.items.0.description')
    },
    {
      icon: Shield,
      title: tHome('features.items.1.title'),
      description: tHome('features.items.1.description')
    },
    {
      icon: Heart,
      title: tHome('features.items.2.title'),
      description: tHome('features.items.2.description')
    },
    {
      icon: Truck,
      title: tHome('features.items.3.title'),
      description: tHome('features.items.3.description')
    }
  ]

  const processSteps = [
    {
      step: tHome('process.steps.0.number'),
      title: tHome('process.steps.0.title'),
      description: tHome('process.steps.0.description')
    },
    {
      step: tHome('process.steps.1.number'),
      title: tHome('process.steps.1.title'),
      description: tHome('process.steps.1.description')
    },
    {
      step: tHome('process.steps.2.number'),
      title: tHome('process.steps.2.title'),
      description: tHome('process.steps.2.description')
    },
    {
      step: tHome('process.steps.3.number'),
      title: tHome('process.steps.3.title'),
      description: tHome('process.steps.3.description')
    }
  ]

  // Scroll reveal refs
  const aboutReveal = useScrollReveal()
  const featuresReveal = useScrollReveal()
  const galleryReveal = useScrollReveal()
  const servicesReveal = useScrollReveal()
  const processReveal = useScrollReveal()
  const testimonialsReveal = useScrollReveal()
  const contactReveal = useScrollReveal()
  const ctaReveal = useScrollReveal()

  // Carousel hooks
  const featuresCarousel = useCarousel(features.length)
  const processCarousel = useCarousel(processSteps.length)
  const servicesCarousel = useCarousel(services.length)
  const testimonialsCarousel = useCarousel(testimonials.length, true, 5000)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [gallery, servicesData, testimonialsData] = await Promise.all([
          parseHelpers.getGalleryImages(),
          parseHelpers.getServices(),
          parseHelpers.getTestimonials(),
        ])
        setGalleryImages(gallery.slice(0, 6))
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

  // Hero GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } })

      tl.fromTo(
        ".hero-label",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1 }
      )
      .fromTo(
        ".hero-title",
        { opacity: 0, y: 60, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 1.4 },
        "-=0.7"
      )
      .fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1 },
        "-=1"
      )
      .fromTo(
        ".hero-cta",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1 },
        "-=0.8"
      )
      .fromTo(
        ".hero-trust",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.6"
      )
      .fromTo(
        ".scroll-indicator",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, repeat: -1, yoyo: true, ease: "power1.inOut" },
        "-=0.4"
      )

      gsap.to(".hero-bg", {
        yPercent: 25,
        ease: "none",
        scrollTrigger: {
          trigger: "#home",
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      })

      gsap.to(".float-gentle", {
        y: -15,
        duration: 4,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true
      })
    })

    return () => ctx.revert()
  }, [])

  // Gallery bento stagger
  useEffect(() => {
    if (!loading && galleryImages.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".gallery-bento-item",
          { opacity: 0, y: 50, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            stagger: { each: 0.1, from: "start" },
            ease: "power3.out",
            scrollTrigger: {
              trigger: "#gallery",
              start: "top 75%",
            }
          }
        )

        const items = document.querySelectorAll(".gallery-bento-item")
        items.forEach((item) => {
          const handleMouseMove = (e: MouseEvent) => {
            const el = e.currentTarget as HTMLElement
            const rect = el.getBoundingClientRect()
            const x = e.clientX - rect.left - rect.width / 2
            const y = e.clientY - rect.top - rect.height / 2
            gsap.to(el, {
              rotateY: x * 0.015,
              rotateX: -y * 0.015,
              duration: 0.5,
              ease: "power2.out"
            })
          }

          const handleMouseLeave = (e: MouseEvent) => {
            const el = e.currentTarget as HTMLElement
            gsap.to(el, {
              rotateY: 0,
              rotateX: 0,
              duration: 0.5,
              ease: "power2.out"
            })
          }

          item.addEventListener("mousemove", handleMouseMove as EventListener)
          item.addEventListener("mouseleave", handleMouseLeave as EventListener)
        })
      })

      return () => ctx.revert()
    }
  }, [loading, galleryImages])

  // Features stagger
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".feature-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features-grid",
            start: "top 85%",
          }
        }
      )
    })

    return () => ctx.revert()
  }, [])

  // Service hover
  useEffect(() => {
    if (!loading && services.length > 0) {
      const ctx = gsap.context(() => {
        const cards = document.querySelectorAll(".service-card")
        cards.forEach((card) => {
          const handleMouseEnter = () => {
            gsap.to(card, { scale: 1.03, y: -8, duration: 0.4, ease: "power2.out" })
          }
          const handleMouseLeave = () => {
            gsap.to(card, { scale: 1, y: 0, duration: 0.4, ease: "power2.out" })
          }
          card.addEventListener("mouseenter", handleMouseEnter)
          card.addEventListener("mouseleave", handleMouseLeave)
        })
      })

      return () => ctx.revert()
    }
  }, [loading, services])

  // Magnetic buttons
  useEffect(() => {
    const ctx = gsap.context(() => {
      const buttons = document.querySelectorAll(".magnetic-btn")
      buttons.forEach((button) => {
        const handleMouseMove = (e: MouseEvent) => {
          const btn = e.currentTarget as HTMLElement
          const rect = btn.getBoundingClientRect()
          const x = e.clientX - rect.left - rect.width / 2
          const y = e.clientY - rect.top - rect.height / 2
          gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: "power2.out" })
        }
        const handleMouseLeave = (e: MouseEvent) => {
          const btn = e.currentTarget as HTMLElement
          gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" })
        }
        button.addEventListener("mousemove", handleMouseMove as EventListener)
        button.addEventListener("mouseleave", handleMouseLeave as EventListener)
      })
    })

    return () => ctx.revert()
  }, [])

  // Process steps stagger
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".process-step",
        { opacity: 0, scale: 0.6, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: ".process-grid",
            start: "top 85%",
          }
        }
      )
    })

    return () => ctx.revert()
  }, [])

  // Testimonials
  useEffect(() => {
    if (!loading && testimonials.length > 0) {
      const ctx = gsap.context(() => {
        const cards = document.querySelectorAll(".testimonial-card")
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, x: 60 },
            {
              opacity: 1,
              x: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
              }
            }
          )
        })
      })

      return () => ctx.revert()
    }
  }, [loading, testimonials])

  // CTA corners
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top 80%",
        }
      })

      tl.fromTo(
        ".cta-corner-line",
        { scaleX: 0, scaleY: 0 },
        { scaleX: 1, scaleY: 1, duration: 0.8, stagger: 0.08, ease: "power2.out" }
      )
    })

    return () => ctx.revert()
  }, [])

  // Social icons
  useEffect(() => {
    const ctx = gsap.context(() => {
      const icons = document.querySelectorAll(".social-icon")
      icons.forEach((icon) => {
        const handleMouseEnter = () => {
          gsap.to(icon, { scale: 1.15, rotation: 10, duration: 0.4, ease: "back.out(2)" })
        }
        const handleMouseLeave = () => {
          gsap.to(icon, { scale: 1, rotation: 0, duration: 0.3, ease: "power2.out" })
        }
        icon.addEventListener("mouseenter", handleMouseEnter)
        icon.addEventListener("mouseleave", handleMouseLeave)
      })
    })

    return () => ctx.revert()
  }, [])

  // About reveal
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-quote",
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: ".about-quote", start: "top 85%" }
        }
      )

      gsap.fromTo(
        ".about-text",
        { opacity: 0, x: 60 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".about-text", start: "top 85%" }
        }
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />

      {/* =============================================
          HERO — Immersive Full Bleed
          ============================================= */}
      <section id="home" className="relative min-h-screen overflow-hidden">
        {/* Desktop */}
        <div className="hidden lg:flex min-h-screen relative">
          {/* Full-bleed background image */}
          <div className="absolute inset-0 hero-bg">
            <Image
              src="/hero.jpg"
              alt={tHome('hero.imageAlt')}
              fill
              className="object-cover"
              priority
              quality={90}
            />
            {/* Rich cinematic overlay */}
            <div className="absolute inset-0 hero-desktop-overlay" />
          </div>

          {/* Decorative elements */}
          <div className="absolute top-20 right-12 xl:right-20 w-px h-32 bg-gradient-to-b from-transparent via-[hsl(var(--gold))]/30 to-transparent hero-accent-line" />
          <div className="absolute bottom-32 right-[48%] w-24 h-24 border border-[hsl(var(--gold))]/15 rounded-full hero-accent-circle" />
          <div className="absolute top-1/3 right-[52%] w-1.5 h-1.5 bg-[hsl(var(--gold))]/40 rounded-full hero-accent-dot" />
          <div className="absolute bottom-1/4 right-[56%] w-1 h-1 bg-[hsl(var(--gold))]/25 rounded-full hero-accent-dot" style={{ animationDelay: '2s' }} />

          {/* Content — Centered-right over the image */}
          <div className="relative z-10 w-full flex items-center justify-end">
            <div className="w-[55%] pr-12 xl:pr-20 2xl:pr-28 py-20">
              <div className="space-y-8">
                <div className="hero-label">
                  <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-luxury text-[hsl(var(--primary))] font-medium">
                    <span className="w-10 h-px bg-[hsl(var(--primary))]/70" />
                    {tHome('hero.label')}
                  </span>
                </div>

                <h1 className="hero-title font-serif text-5xl xl:text-6xl 2xl:text-7xl text-white leading-[1.05] tracking-tight drop-shadow-sm">
                  {tHome('hero.title')} <span className="text-gold-gradient">{tHome('hero.titleHighlight')}</span>
                </h1>

                <p className="hero-subtitle text-lg xl:text-xl text-white/65 max-w-md font-light leading-relaxed">
                  {tHome('hero.subtitle')}
                </p>

                <p className="font-handwritten text-xl text-[hsl(var(--primary))]">Made with love, preserved forever</p>

                <div className="hero-cta flex flex-col sm:flex-row gap-4 pt-2">
                  <Button
                    asChild
                    variant="clay"
                    size="lg"
                    className="magnetic-btn h-14 px-8"
                  >
                    <a href={socialMedia.phone.url}>
                      <Phone className="mr-3 h-4 w-4" />
                      {tCommon('buttons.bookNow')}
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    className="magnetic-btn bg-[hsl(var(--whatsapp))] border border-[hsl(var(--whatsapp))]/50 text-white hover:bg-[hsl(var(--whatsapp))]/90 h-14 px-8 rounded-full font-semibold text-sm tracking-wide transition-all duration-500 shadow-lg shadow-[hsl(var(--whatsapp))]/25"
                  >
                    <a href={socialMedia.whatsapp.url} target="_blank" rel="noopener noreferrer">
                      <WhatsAppIcon className="mr-3 h-4 w-4" />
                      {tCommon('buttons.whatsapp')}
                    </a>
                  </Button>
                </div>

                <div className="hero-trust flex flex-wrap items-center gap-6 text-white/40 text-[10px] uppercase tracking-wider pt-6">
                  <span>{tCommon('trust.families')}</span>
                  <span className="w-1 h-1 bg-[hsl(var(--gold))]/40 rounded-full" />
                  <span>{tCommon('trust.rating')}</span>
                  <span className="w-1 h-1 bg-[hsl(var(--gold))]/40 rounded-full" />
                  <span>{tCommon('trust.allIndiaService')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet — Full Bleed */}
        <div className="lg:hidden relative min-h-screen flex items-center justify-center">
          <div className="absolute inset-0 hero-bg">
            <Image
              src="/hero.jpg"
              alt={tHome('hero.imageAlt')}
              fill
              className="object-cover"
              priority
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
          </div>

          <div className="relative z-10 container max-w-lg px-6 text-center py-24">
            <div className="space-y-6">
              <div className="hero-label">
                <span className="inline-flex items-center justify-center gap-3 text-[11px] uppercase tracking-luxury text-[hsl(var(--primary))] font-medium">
                  <span className="w-6 h-px bg-[hsl(var(--primary))]/70" />
                  {tHome('hero.label')}
                  <span className="w-6 h-px bg-[hsl(var(--primary))]/70" />
                </span>
              </div>

              <h1 className="hero-title font-serif text-4xl sm:text-5xl text-white leading-[1.08] tracking-tight">
                {tHome('hero.title')} <span className="text-gold-gradient">{tHome('hero.titleHighlight')}</span>
              </h1>

              <p className="hero-subtitle text-base sm:text-lg text-white/65 max-w-md mx-auto font-light">
                {tHome('hero.subtitle')}
              </p>

              <div className="hero-cta flex flex-col gap-3 pt-4">
                <Button
                  asChild
                  variant="clay"
                  size="lg"
                  className="magnetic-btn h-14 w-full"
                >
                  <a href={socialMedia.phone.url}>
                    <Phone className="mr-3 h-4 w-4" />
                    {tCommon('buttons.bookNow')}
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="magnetic-btn bg-[hsl(var(--whatsapp))] border border-[hsl(var(--whatsapp))]/50 text-white hover:bg-[hsl(var(--whatsapp))]/90 h-14 w-full rounded-full font-medium text-sm tracking-wide transition-all duration-500 shadow-lg shadow-[hsl(var(--whatsapp))]/25"
                >
                  <a href={socialMedia.whatsapp.url} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon className="mr-3 h-4 w-4" />
                    {tCommon('buttons.whatsapp')}
                  </a>
                </Button>
              </div>

              <div className="hero-trust flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-white/40 text-[10px] sm:text-xs uppercase tracking-wider pt-8">
                <span>{tCommon('trust.families')}</span>
                <span className="w-1 h-1 bg-white/25 rounded-full" />
                <span>{tCommon('trust.rating')}</span>
                <span className="w-1 h-1 bg-white/25 rounded-full" />
                <span>{tCommon('trust.allIndiaService')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <a
          href="#about"
          className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/30 hover:text-white/60 transition-colors"
          aria-label={tHome('hero.scrollToAbout')}
        >
          <ChevronDown className="h-6 w-6 animate-scroll" />
        </a>
      </section>

      {/* =============================================
          ABOUT — Story & Craft
          ============================================= */}
      <section id="about" className="py-24 md:py-36 bg-ivory relative pb-32 md:pb-40">
        <div className="container max-w-6xl relative">
          <div
            ref={aboutReveal.ref}
            className={`transition-all duration-1000 ${
              aboutReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-3 text-xs uppercase tracking-luxury text-[hsl(var(--gold))] font-medium">
                <span className="w-10 h-px bg-[hsl(var(--gold))]/40" />
                {tHome('about.label')}
                <span className="w-10 h-px bg-[hsl(var(--gold))]/40" />
              </span>
              <h2 className="font-serif text-4xl md:text-6xl text-foreground mt-5 leading-luxury">
                {tHome('about.title')}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
              {/* Quote Block — Framed Card */}
              <div className="about-quote relative">
                <div className="quote-frame relative bg-primary rounded-2xl p-10 md:p-12 overflow-hidden">
                  {/* Corner accents */}
                  <div className="absolute top-5 left-5 w-8 h-8">
                    <div className="absolute top-0 left-0 w-full h-px bg-[hsl(var(--gold))]/40" />
                    <div className="absolute top-0 left-0 h-full w-px bg-[hsl(var(--gold))]/40" />
                  </div>
                  <div className="absolute bottom-5 right-5 w-8 h-8">
                    <div className="absolute bottom-0 right-0 w-full h-px bg-[hsl(var(--gold))]/40" />
                    <div className="absolute bottom-0 right-0 h-full w-px bg-[hsl(var(--gold))]/40" />
                  </div>
                  {/* Subtle glow */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[hsl(var(--gold))]/5 rounded-full blur-[60px] pointer-events-none" />

                  <span className="text-7xl md:text-8xl font-serif text-[hsl(var(--gold))]/20 leading-none block -mb-8 md:-mb-10">&ldquo;</span>
                  <blockquote className="font-serif text-2xl md:text-3xl lg:text-4xl text-primary-foreground leading-snug italic relative z-10">
                    {tHome('about.quote')} <span className="text-gold-gradient not-italic">{tHome('about.quoteHighlight')}</span> {tHome('about.quoteSuffix')}
                  </blockquote>
                  <div className="mt-8 flex items-center gap-4 relative z-10">
                    <div className="w-12 h-px bg-[hsl(var(--gold))]/50" />
                    <p className="text-primary-foreground/50 text-sm uppercase tracking-wider">{tHome('about.quoteAuthor')}</p>
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div className="about-text space-y-6 pt-4">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {tHome('about.paragraph1')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {tHome('about.paragraph2')} <strong className="text-primary">{tHome('about.paragraph2Bold')}</strong> {tHome('about.paragraph2Suffix')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {tHome('about.paragraph3')}
                </p>
                <p className="font-handwritten text-xl text-[hsl(var(--gold))] pt-4">Every impression tells a story</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =============================================
          FEATURES — Why Choose Us
          ============================================= */}
      <section className="py-24 md:py-36 bg-cream relative pt-32 md:pt-40 pb-32 md:pb-40">
        <div className="container max-w-6xl relative">
          <div
            ref={featuresReveal.ref}
            className={`text-center mb-16 transition-all duration-1000 ${
              featuresReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <span className="inline-flex items-center gap-3 text-xs uppercase tracking-luxury text-[hsl(var(--gold))] font-medium">
              <span className="w-10 h-px bg-[hsl(var(--gold))]/40" />
              {tHome('features.label')}
              <span className="w-10 h-px bg-[hsl(var(--gold))]/40" />
            </span>
            <h2 className="font-serif text-4xl md:text-6xl text-foreground mt-5 leading-luxury">
              {tHome('features.title')}
            </h2>
          </div>

          {/* Mobile carousel */}
          <div className={`sm:hidden transition-all duration-1000 delay-200 ${
            featuresReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div
              ref={featuresCarousel.scrollRef}
              className="overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            >
              <div className="flex">
                {features.map((feature) => (
                  <div key={feature.title} className="w-full flex-shrink-0 snap-center px-4">
                    <div className="feature-card-enhanced p-8 bg-card shadow-sculptural rounded-2xl group text-center">
                      <div className="feature-icon-ring relative w-16 h-16 mx-auto mb-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--blush))] to-[hsl(var(--sand))] rounded-full group-hover:from-primary group-hover:to-primary transition-all duration-500" />
                        <div className="relative w-full h-full flex items-center justify-center">
                          <feature.icon className="h-7 w-7 text-primary group-hover:text-white transition-colors duration-500" />
                        </div>
                      </div>
                      <h3 className="font-serif text-xl text-foreground mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-6" suppressHydrationWarning>
              {features.map((_, i) => (
                <button
                  key={i}
                  onClick={() => featuresCarousel.scrollToIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    featuresCarousel.activeIndex === i
                      ? 'bg-primary w-6'
                      : 'bg-border w-1.5 hover:bg-muted-foreground'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Desktop grid */}
          <div className="features-grid hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="feature-card feature-card-enhanced p-8 bg-card shadow-sculptural rounded-2xl group text-center hover:shadow-sculptural-lg transition-all duration-500 hover:-translate-y-2"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="feature-icon-ring relative w-16 h-16 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--blush))] to-[hsl(var(--sand))] rounded-full group-hover:from-primary group-hover:to-primary transition-all duration-500" />
                  <div className="relative w-full h-full flex items-center justify-center">
                    <feature.icon className="h-7 w-7 text-primary group-hover:text-white transition-colors duration-500" />
                  </div>
                </div>
                <h3 className="font-serif text-xl text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          GALLERY — Clean Bento Layout
          ============================================= */}
      <section id="gallery" className="py-24 md:py-36 bg-sand relative pt-32 md:pt-40 pb-32 md:pb-40">
        <div className="container max-w-7xl relative">
          <div
            ref={galleryReveal.ref}
            className={`flex flex-col md:flex-row md:items-end md:justify-between mb-16 transition-all duration-1000 ${
              galleryReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="text-center md:text-left">
              <span className="inline-flex items-center gap-3 text-xs uppercase tracking-luxury text-[hsl(var(--gold))] font-medium">
                <span className="w-10 h-px bg-[hsl(var(--gold))]/40 hidden md:block" />
                {tHome('gallery.label')}
              </span>
              <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground mt-4 leading-luxury">
                {tHome('gallery.title')}
              </h2>
            </div>
            <Link
              href="/gallery"
              className="hidden md:inline-flex items-center gap-3 text-sm font-medium text-primary hover:text-primary/80 transition-all group mt-6 md:mt-0"
            >
              <span className="relative">
                {tCommon('buttons.viewFullCollection')}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
              </span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-12 gap-3 md:gap-5 auto-rows-[140px] md:auto-rows-[180px]">
                {galleryImages[0] && (
                  <Link
                    href="/gallery"
                    className="gallery-bento-item gallery-bento-featured group col-span-12 md:col-span-7 row-span-3 md:row-span-3"
                  >
                    <div className="gallery-bento-image">
                      <Image
                        src={galleryImages[0].imagePath}
                        alt={galleryImages[0].title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 58vw"
                        quality={90}
                        priority
                      />
                      <div className="gallery-bento-overlay">
                        <div className="gallery-bento-content">
                          <p className="text-[11px] uppercase tracking-luxury text-[hsl(var(--gold))] mb-2">{galleryImages[0].category}</p>
                          <p className="text-white font-serif text-2xl md:text-3xl leading-tight">{galleryImages[0].title}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                {galleryImages[1] && (
                  <Link href="/gallery" className="gallery-bento-item group col-span-6 md:col-span-5 row-span-2">
                    <div className="gallery-bento-image">
                      <Image
                        src={galleryImages[1].imagePath}
                        alt={galleryImages[1].title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 42vw"
                        quality={85}
                      />
                      <div className="gallery-bento-overlay">
                        <div className="gallery-bento-content">
                          <p className="text-[10px] uppercase tracking-luxury text-[hsl(var(--gold))] mb-1">{galleryImages[1].category}</p>
                          <p className="text-white font-serif text-lg md:text-xl">{galleryImages[1].title}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                {galleryImages[2] && (
                  <Link href="/gallery" className="gallery-bento-item group col-span-6 md:col-span-5 row-span-1">
                    <div className="gallery-bento-image">
                      <Image
                        src={galleryImages[2].imagePath}
                        alt={galleryImages[2].title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 42vw"
                        quality={85}
                      />
                      <div className="gallery-bento-overlay">
                        <div className="gallery-bento-content">
                          <p className="text-[10px] uppercase tracking-luxury text-[hsl(var(--gold))] mb-1">{galleryImages[2].category}</p>
                          <p className="text-white font-serif text-base md:text-lg">{galleryImages[2].title}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                {galleryImages[3] && (
                  <Link href="/gallery" className="gallery-bento-item group col-span-6 md:col-span-4 row-span-2">
                    <div className="gallery-bento-image">
                      <Image
                        src={galleryImages[3].imagePath}
                        alt={galleryImages[3].title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 33vw"
                        quality={85}
                      />
                      <div className="gallery-bento-overlay">
                        <div className="gallery-bento-content">
                          <p className="text-[10px] uppercase tracking-luxury text-[hsl(var(--gold))] mb-1">{galleryImages[3].category}</p>
                          <p className="text-white font-serif text-base md:text-lg">{galleryImages[3].title}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                {galleryImages[4] && (
                  <Link href="/gallery" className="gallery-bento-item group col-span-6 md:col-span-4 row-span-2">
                    <div className="gallery-bento-image">
                      <Image
                        src={galleryImages[4].imagePath}
                        alt={galleryImages[4].title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 33vw"
                        quality={85}
                      />
                      <div className="gallery-bento-overlay">
                        <div className="gallery-bento-content">
                          <p className="text-[10px] uppercase tracking-luxury text-[hsl(var(--gold))] mb-1">{galleryImages[4].category}</p>
                          <p className="text-white font-serif text-base md:text-lg">{galleryImages[4].title}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                {galleryImages[5] && (
                  <Link href="/gallery" className="gallery-bento-item group col-span-12 md:col-span-4 row-span-2">
                    <div className="gallery-bento-image">
                      <Image
                        src={galleryImages[5].imagePath}
                        alt={galleryImages[5].title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        quality={85}
                      />
                      <div className="gallery-bento-overlay">
                        <div className="gallery-bento-content">
                          <p className="text-[10px] uppercase tracking-luxury text-[hsl(var(--gold))] mb-1">{galleryImages[5].category}</p>
                          <p className="text-white font-serif text-base md:text-lg">{galleryImages[5].title}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}
              </div>

              <div className={`flex md:hidden justify-center mt-10 transition-all duration-1000 delay-400 ${
                galleryReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <Link
                  href="/gallery"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium text-sm shadow-sculptural hover:shadow-sculptural-lg transition-all group"
                >
                  <span>{tCommon('buttons.viewFullCollection')}</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* =============================================
          SERVICES — Staggered Grid
          ============================================= */}
      <section id="services" className="py-24 md:py-36 bg-ivory relative pt-32 md:pt-40 pb-32 md:pb-40">
        <div className="container max-w-6xl relative">
          <div
            ref={servicesReveal.ref}
            className={`text-center mb-16 transition-all duration-1000 ${
              servicesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <span className="inline-flex items-center gap-3 text-xs uppercase tracking-luxury text-[hsl(var(--gold))] font-medium">
              <span className="w-10 h-px bg-[hsl(var(--gold))]/40" />
              {tHome('services.label')}
              <span className="w-10 h-px bg-[hsl(var(--gold))]/40" />
            </span>
            <h2 className="font-serif text-4xl md:text-6xl text-foreground mt-5 leading-luxury">
              {tHome('services.title')}
            </h2>
            <p className="text-muted-foreground mt-5 max-w-lg mx-auto text-lg">
              {tHome('services.subtitle')}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Mobile carousel */}
              <div className={`md:hidden transition-all duration-1000 delay-200 ${
                servicesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <div
                  ref={servicesCarousel.scrollRef}
                  className="overflow-x-auto scrollbar-hide snap-x snap-mandatory"
                >
                  <div className="flex">
                    {services.map((service, i) => (
                      <div key={service.id || i} className="w-full flex-shrink-0 snap-center px-4">
                        <div className="group relative aspect-[3/4] overflow-hidden bg-card shadow-sculptural rounded-2xl cursor-pointer">
                          <Image
                            src={service.imagePath}
                            alt={service.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="100vw"
                            quality={85}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-8">
                            <span className="text-[10px] uppercase tracking-luxury text-[hsl(var(--gold))]">
                              0{i + 1}
                            </span>
                            <h3 className="text-white font-serif text-2xl mt-2">{service.title}</h3>
                            {service.description && (
                              <p className="text-white/55 text-sm mt-3 leading-relaxed line-clamp-2">
                                {service.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {services.length > 0 && (
                  <div className="flex justify-center gap-2 mt-6" suppressHydrationWarning>
                    {services.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => servicesCarousel.scrollToIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          servicesCarousel.activeIndex === i
                            ? 'bg-primary w-6'
                            : 'bg-border w-1.5 hover:bg-muted-foreground'
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop grid */}
              <div className="hidden md:grid md:grid-cols-3 gap-8 pb-16">
                {services.map((service, i) => (
                  <div
                    key={service.id || i}
                    className={`service-card group relative aspect-[3/4] overflow-hidden bg-card shadow-sculptural rounded-2xl cursor-pointer transition-all duration-500 hover:shadow-sculptural-lg ${
                      i % 2 === 1 ? 'md:translate-y-12' : ''
                    }`}
                  >
                    <Image
                      src={service.imagePath}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="33vw"
                      quality={85}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <span className="text-[10px] uppercase tracking-luxury text-[hsl(var(--gold))] opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                        0{i + 1}
                      </span>
                      <h3 className="text-white font-serif text-2xl mt-2 transform group-hover:-translate-y-1 transition-transform duration-500">{service.title}</h3>
                      {service.description && (
                        <p className="text-white/55 text-sm mt-3 leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                          {service.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* =============================================
          PROCESS — How It Works
          ============================================= */}
      <section className="py-24 md:py-36 bg-cream relative pt-32 md:pt-40">
        <div className="container max-w-5xl px-4 sm:px-6">
          <div
            ref={processReveal.ref}
            className={`text-center mb-16 transition-all duration-1000 ${
              processReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <span className="inline-flex items-center gap-3 text-xs uppercase tracking-luxury text-[hsl(var(--gold))] font-medium">
              <span className="w-10 h-px bg-[hsl(var(--gold))]/40" />
              {tHome('process.label')}
              <span className="w-10 h-px bg-[hsl(var(--gold))]/40" />
            </span>
            <h2 className="font-serif text-4xl md:text-6xl text-foreground mt-5 leading-luxury">
              {tHome('process.title')}
            </h2>
          </div>

          <div className={`relative transition-all duration-1000 delay-200 ${
            processReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {/* Mobile carousel */}
            <div className="md:hidden">
              <div
                ref={processCarousel.scrollRef}
                className="overflow-x-auto scrollbar-hide snap-x snap-mandatory"
              >
                <div className="flex">
                  {processSteps.map((item) => (
                    <div key={item.step} className="w-full flex-shrink-0 snap-center px-4">
                      <div className="text-center group relative py-4">
                        <div className="process-badge relative inline-flex items-center justify-center w-24 h-24 mb-6 mx-auto">
                          <div className="absolute inset-0 bg-card rounded-full shadow-sculptural" />
                          <div className="absolute inset-2 border border-[hsl(var(--gold))]/25 rounded-full" />
                          <span className="text-3xl font-serif text-primary relative z-10">{item.step}</span>
                        </div>
                        <h3 className="font-serif text-xl text-foreground mb-3">{item.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-6" suppressHydrationWarning>
                {processSteps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => processCarousel.scrollToIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      processCarousel.activeIndex === i
                        ? 'bg-primary w-6'
                        : 'bg-border w-1.5 hover:bg-muted-foreground'
                    }`}
                    aria-label={`Go to step ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Desktop grid */}
            <div className="process-grid hidden md:grid md:grid-cols-4 gap-0 relative z-10">
              {/* Connecting line across all steps */}
              <div className="absolute top-14 left-[12%] right-[12%] h-[2px] z-0">
                <div className="w-full h-full bg-gradient-to-r from-transparent via-[hsl(var(--gold))]/20 to-transparent rounded-full" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[hsl(var(--gold))]/10 to-transparent blur-[2px]" />
              </div>
              {processSteps.map((item, i) => (
                <div key={item.step} className="process-step text-center group relative px-4">
                  <div className="process-badge relative inline-flex items-center justify-center w-28 h-28 mb-8 mx-auto">
                    <div className="absolute inset-0 bg-card rounded-full shadow-sculptural group-hover:shadow-sculptural-lg transition-all duration-500" />
                    <div className="absolute inset-3 border border-[hsl(var(--gold))]/15 group-hover:border-[hsl(var(--gold))]/40 rounded-full transition-colors duration-500" />
                    <div className="absolute inset-1 border border-[hsl(var(--gold))]/5 rounded-full" />
                    <span className="text-3xl font-serif text-primary group-hover:scale-110 transition-transform duration-300 relative z-10">
                      {item.step}
                    </span>
                  </div>
                  {/* Arrow indicator between steps */}
                  {i < processSteps.length - 1 && (
                    <div className="absolute top-14 -right-2 z-10 text-[hsl(var(--gold))]/30 hidden lg:block">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                  <h3 className="font-serif text-xl text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =============================================
          WHY SECTION — Trust & Emotion
          ============================================= */}
      <section className="why-section-bg py-28 md:py-40 bg-primary text-primary-foreground relative overflow-hidden">

        {/* Decorative baby handprint & footprint at corners */}
        <img
          src="/baby-hands.png"
          alt=""
          aria-hidden="true"
          className="absolute left-4 md:left-12 top-8 md:top-12 w-32 md:w-48 opacity-[0.12] rotate-[-8deg] pointer-events-none select-none mix-blend-screen"
        />
        <img
          src="/feet.png"
          alt=""
          aria-hidden="true"
          className="absolute right-4 md:right-12 bottom-8 md:bottom-12 w-28 md:w-44 opacity-[0.12] rotate-[15deg] pointer-events-none select-none mix-blend-screen"
        />

        <div className="container max-w-4xl text-center relative z-10">
          <div className="section-divider mb-10">
            <div className="w-2 h-2 border border-[hsl(var(--gold))]/50 rotate-45" />
          </div>

          <span className="text-xs uppercase tracking-luxury text-[hsl(var(--gold))] font-medium">{tHome('why.label')}</span>
          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl mt-6 mb-12 leading-luxury">
            {tHome('why.title')}
          </h2>
          <p className="text-primary-foreground/80 text-xl md:text-2xl leading-relaxed mb-8 font-light max-w-2xl mx-auto">
            {tHome('why.subtitle')}
          </p>
          <p className="text-primary-foreground/55 leading-relaxed max-w-2xl mx-auto text-base md:text-lg">
            {tHome('why.description')} <strong className="text-primary-foreground/90 font-medium">{tHome('why.descriptionBold')}</strong>{tHome('why.descriptionSuffix')}
          </p>

          <p className="font-handwritten text-2xl md:text-3xl text-[hsl(var(--gold))] mt-14">Because every moment deserves to last</p>

          <div className="section-divider mt-14">
            <div className="w-2 h-2 border border-[hsl(var(--gold))]/50 rotate-45" />
          </div>
        </div>
      </section>

      {/* =============================================
          TESTIMONIALS — Carousel
          ============================================= */}
      <section id="testimonials" className="py-24 md:py-36 bg-ivory relative">
        <div className="container max-w-5xl">
          <div
            ref={testimonialsReveal.ref}
            className={`text-center mb-14 transition-all duration-1000 ${
              testimonialsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <span className="inline-flex items-center gap-3 text-xs uppercase tracking-luxury text-[hsl(var(--gold))] font-medium">
              <span className="w-10 h-px bg-[hsl(var(--gold))]/40" />
              {tHome('testimonials.label')}
              <span className="w-10 h-px bg-[hsl(var(--gold))]/40" />
            </span>
            <h2 className="font-serif text-4xl md:text-6xl text-foreground mt-5 leading-luxury">
              {tHome('testimonials.title')}
            </h2>
            <p className="text-muted-foreground mt-5 max-w-2xl mx-auto text-lg">
              {tHome('testimonials.subtitle')}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className={`transition-all duration-1000 delay-200 ${
                testimonialsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <div
                  ref={testimonialsCarousel.scrollRef}
                  className="overflow-x-auto scrollbar-hide snap-x snap-mandatory mt-8 cursor-grab active:cursor-grabbing"
                >
                  <div className="flex">
                    {testimonials.map((testimonial, i) => (
                      <div key={testimonial.id || i} className="w-full flex-shrink-0 snap-center px-4 md:px-6">
                        <div className="testimonial-card testimonial-card-enhanced relative p-10 md:p-14 bg-card shadow-sculptural rounded-2xl border border-border/20 group max-w-3xl mx-auto hover:shadow-luxury-lg transition-all duration-500">
                          {/* Decorative quote mark */}
                          <span className="testimonial-quote-mark" aria-hidden="true">&rdquo;</span>
                          <div className="flex gap-1 mb-8">
                            {Array.from({ length: testimonial.rating }).map((_, j) => (
                              <Star
                                key={j}
                                className="h-4 w-4 fill-[hsl(var(--gold))] text-[hsl(var(--gold))]"
                              />
                            ))}
                          </div>
                          <p className="text-foreground/80 text-lg md:text-xl leading-relaxed font-light italic line-clamp-4 md:line-clamp-none font-serif relative z-10">
                            &ldquo;{testimonial.message}&rdquo;
                          </p>
                          <div className="flex items-center gap-4 mt-10 pt-8 border-t border-border/10">
                            <div className="w-12 h-12 bg-[hsl(var(--blush))] rounded-full flex items-center justify-center text-primary font-serif text-lg ring-2 ring-[hsl(var(--gold))]/10 group-hover:ring-[hsl(var(--gold))]/30 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                              {testimonial.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-foreground text-sm">{testimonial.name}</p>
                              <p className="text-xs text-muted-foreground/60 flex items-center gap-1.5 mt-0.5 tracking-wide">
                                <MapPin className="h-3 w-3" />
                                {testimonial.location}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center gap-2.5 mt-10" suppressHydrationWarning>
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => testimonialsCarousel.scrollToIndex(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        testimonialsCarousel.activeIndex === i
                          ? 'bg-primary w-8'
                          : 'bg-border w-1.5 hover:bg-muted-foreground'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          <div className={`flex items-center justify-center mt-12 transition-all duration-1000 delay-400 ${
            testimonialsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <a
              href={socialMedia.google.reviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors group"
            >
              <GoogleIcon className="h-4 w-4" />
              <span className="text-sm font-medium">{tCommon('buttons.readReviews')}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>

      {/* =============================================
          CONTACT — Enquiry Form + CTA
          ============================================= */}
      <section id="contact" className="py-24 md:py-36 bg-cream relative">
        <div className="container max-w-6xl px-4 sm:px-6">
          {/* Section header */}
          <div
            ref={contactReveal.ref}
            className={`text-center mb-16 transition-all duration-1000 ${
              contactReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <span className="inline-flex items-center gap-3 text-xs uppercase tracking-luxury text-[hsl(var(--gold))] font-medium">
              <span className="w-10 h-px bg-[hsl(var(--gold))]/40" />
              {tHome('cta.label')}
              <span className="w-10 h-px bg-[hsl(var(--gold))]/40" />
            </span>
            <h2 className="font-serif text-4xl md:text-6xl text-foreground mt-5 leading-luxury">
              {tHome('cta.title')}
            </h2>
            <p className="text-muted-foreground mt-5 max-w-lg mx-auto text-lg">
              {tHome('cta.subtitle')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Enquiry Form */}
            <div
              ref={ctaReveal.ref}
              className={`transition-all duration-1000 delay-200 ${
                ctaReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="bg-card/60 backdrop-blur-sm border border-border/20 rounded-2xl p-10 md:p-14 shadow-luxury relative overflow-hidden">
                {/* Subtle top accent */}
                <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))]/30 to-transparent" />

                <h3 className="font-serif text-3xl md:text-[2rem] text-foreground mb-1.5 leading-luxury">{tHome('enquiryForm.title')}</h3>
                <p className="text-muted-foreground/70 text-sm mb-10 tracking-wide">{tHome('enquiryForm.subtitle')}</p>

                {submitted ? (
                  <div className="text-center py-16">
                    <div className="w-14 h-14 border border-[hsl(var(--gold))]/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="h-6 w-6 text-[hsl(var(--gold))]" />
                    </div>
                    <h4 className="font-serif text-2xl text-foreground mb-3">{tHome('enquiryForm.successTitle')}</h4>
                    <p className="text-muted-foreground/70 text-sm max-w-xs mx-auto">{tHome('enquiryForm.successMessage')}</p>
                    <Button
                      variant="outline"
                      className="mt-8 rounded-full h-11 px-8 text-xs uppercase tracking-luxury border-border/30 hover:border-[hsl(var(--gold))]/40 hover:bg-transparent"
                      onClick={() => setSubmitted(false)}
                    >
                      {tHome('enquiryForm.submit')}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleEnquirySubmit} className="space-y-8">
                    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
                      <div className="luxury-field group">
                        <Label htmlFor="enquiry-name" className="text-[10px] uppercase tracking-luxury text-muted-foreground/60 font-medium mb-3">{tHome('enquiryForm.name')} *</Label>
                        <Input
                          id="enquiry-name"
                          type="text"
                          required
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder={tHome('enquiryForm.namePlaceholder')}
                          className="luxury-input border-0 border-b border-border/30 rounded-none bg-transparent px-0 h-11 text-sm shadow-none focus-visible:ring-0 focus-visible:border-[hsl(var(--gold))]/60 transition-colors duration-500 placeholder:text-muted-foreground/30"
                        />
                      </div>
                      <div className="luxury-field group">
                        <Label htmlFor="enquiry-phone" className="text-[10px] uppercase tracking-luxury text-muted-foreground/60 font-medium mb-3">{tHome('enquiryForm.phone')} *</Label>
                        <Input
                          id="enquiry-phone"
                          type="tel"
                          required
                          value={formPhone}
                          onChange={(e) => setFormPhone(e.target.value)}
                          placeholder={tHome('enquiryForm.phonePlaceholder')}
                          className="luxury-input border-0 border-b border-border/30 rounded-none bg-transparent px-0 h-11 text-sm shadow-none focus-visible:ring-0 focus-visible:border-[hsl(var(--gold))]/60 transition-colors duration-500 placeholder:text-muted-foreground/30"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
                      <div className="luxury-field group">
                        <Label htmlFor="enquiry-email" className="text-[10px] uppercase tracking-luxury text-muted-foreground/60 font-medium mb-3">{tHome('enquiryForm.email')}</Label>
                        <Input
                          id="enquiry-email"
                          type="email"
                          value={formEmail}
                          onChange={(e) => setFormEmail(e.target.value)}
                          placeholder={tHome('enquiryForm.emailPlaceholder')}
                          className="luxury-input border-0 border-b border-border/30 rounded-none bg-transparent px-0 h-11 text-sm shadow-none focus-visible:ring-0 focus-visible:border-[hsl(var(--gold))]/60 transition-colors duration-500 placeholder:text-muted-foreground/30"
                        />
                      </div>
                      <div className="luxury-field group">
                        <Label htmlFor="enquiry-service" className="text-[10px] uppercase tracking-luxury text-muted-foreground/60 font-medium mb-3">{tHome('enquiryForm.service')}</Label>
                        <Select value={formService} onValueChange={setFormService}>
                          <SelectTrigger id="enquiry-service" className="luxury-input border-0 border-b border-border/30 rounded-none bg-transparent px-0 h-11 text-sm shadow-none focus-visible:ring-0 focus-visible:border-[hsl(var(--gold))]/60 transition-colors duration-500 w-full">
                            <SelectValue placeholder={tHome('enquiryForm.servicePlaceholder')} />
                          </SelectTrigger>
                          <SelectContent>
                            {services.map((s) => (
                              <SelectItem key={s.id || s.title} value={s.title}>
                                {s.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="luxury-field group">
                      <Label htmlFor="enquiry-message" className="text-[10px] uppercase tracking-luxury text-muted-foreground/60 font-medium mb-3">{tHome('enquiryForm.message')} *</Label>
                      <Textarea
                        id="enquiry-message"
                        required
                        value={formMessage}
                        onChange={(e) => setFormMessage(e.target.value)}
                        placeholder={tHome('enquiryForm.messagePlaceholder')}
                        rows={3}
                        className="luxury-input border-0 border-b border-border/30 rounded-none bg-transparent px-0 text-sm shadow-none focus-visible:ring-0 focus-visible:border-[hsl(var(--gold))]/60 transition-colors duration-500 resize-none placeholder:text-muted-foreground/30 min-h-[80px]"
                      />
                    </div>

                    {formError && (
                      <p className="text-xs text-red-500/80 tracking-wide">{formError}</p>
                    )}

                    <div className="pt-2">
                      <Button
                        type="submit"
                        variant="clay"
                        size="lg"
                        disabled={submitting}
                        className="w-full h-14 text-xs uppercase tracking-luxury"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2.5 h-3.5 w-3.5 animate-spin" />
                            {tHome('enquiryForm.submitting')}
                          </>
                        ) : (
                          <>
                            <Send className="mr-2.5 h-3.5 w-3.5" />
                            {tHome('enquiryForm.submit')}
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* CTA Card */}
            <div className={`transition-all duration-1000 delay-400 ${
              ctaReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <div className="cta-section relative overflow-hidden bg-primary p-10 md:p-14 text-center rounded-2xl shadow-luxury-lg h-full flex flex-col justify-center">
                {/* Minimal corner accents */}
                <div className="absolute top-8 left-8 w-8 h-8">
                  <div className="absolute top-0 left-0 w-full h-px bg-[hsl(var(--gold))]/25" />
                  <div className="absolute top-0 left-0 h-full w-px bg-[hsl(var(--gold))]/25" />
                </div>
                <div className="absolute bottom-8 right-8 w-8 h-8">
                  <div className="absolute bottom-0 right-0 w-full h-px bg-[hsl(var(--gold))]/25" />
                  <div className="absolute bottom-0 right-0 h-full w-px bg-[hsl(var(--gold))]/25" />
                </div>
                {/* Soft ambient glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[hsl(var(--gold))]/5 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative">
                  <p className="text-[10px] uppercase tracking-luxury text-[hsl(var(--gold))]/70 font-medium mb-6">
                    {tHome('enquiryForm.or')}
                  </p>
                  <h3 className="font-serif text-2xl md:text-3xl text-primary-foreground leading-luxury mb-10">
                    {tHome('cta.title')}
                  </h3>

                  <div className="flex flex-col gap-3 max-w-xs mx-auto">
                    <Button
                      asChild
                      size="lg"
                      className="magnetic-btn bg-card/95 text-foreground hover:bg-card h-14 px-8 rounded-full text-xs uppercase tracking-luxury shadow-luxury-lg transition-all duration-500"
                    >
                      <a href={socialMedia.phone.url}>
                        <Phone className="mr-3 h-3.5 w-3.5" />
                        {socialMedia.phone.displayNumber}
                      </a>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      className="magnetic-btn bg-[hsl(var(--whatsapp))]/90 hover:bg-[hsl(var(--whatsapp))] text-white h-14 px-8 rounded-full text-xs uppercase tracking-luxury shadow-luxury-lg transition-all duration-500"
                    >
                      <a href={socialMedia.whatsapp.url} target="_blank" rel="noopener noreferrer">
                        <WhatsAppIcon className="mr-3 h-3.5 w-3.5" />
                        {tCommon('buttons.whatsappUs')}
                      </a>
                    </Button>
                  </div>

                  {/* Minimal divider */}
                  <div className="w-8 h-px bg-[hsl(var(--gold))]/20 mx-auto mt-10 mb-8" />

                  <div className="flex flex-col items-center gap-3 text-primary-foreground/40 text-xs tracking-wide">
                    <span className="flex items-center gap-2.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {tCommon('location.fullLocation')}
                    </span>
                    <span className="flex items-center gap-2.5">
                      <Truck className="h-3.5 w-3.5" />
                      {tCommon('location.serviceArea')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =============================================
          FOOTER — Minimal & Refined
          ============================================= */}
      <footer className="relative bg-sand pt-16 pb-10">

        <div className="container max-w-7xl px-4">
          {/* Main footer content */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Logo */}
            <Link href="/" className="group">
              <Image
                src="/rajus-impressions.png"
                alt="Raju's Impressions"
                width={160}
                height={40}
                className="object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Social */}
            <div className="flex items-center gap-3">
              <a
                href={socialMedia.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={tCommon('contact.followInstagram')}
                className="social-icon w-10 h-10 bg-card/80 rounded-full shadow-sculptural flex items-center justify-center text-muted-foreground hover:text-[#E4405F] hover:shadow-sculptural-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <InstagramIcon className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={socialMedia.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={tCommon('contact.followFacebook')}
                className="social-icon w-10 h-10 bg-card/80 rounded-full shadow-sculptural flex items-center justify-center text-muted-foreground hover:text-[#1877F2] hover:shadow-sculptural-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <FacebookIcon className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={socialMedia.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={tCommon('contact.chatWhatsApp')}
                className="social-icon w-10 h-10 bg-card/80 rounded-full shadow-sculptural flex items-center justify-center text-muted-foreground hover:text-[hsl(var(--whatsapp))] hover:shadow-sculptural-lg hover:-translate-y-0.5 transition-all duration-300"
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

          {/* Subtle footer divider */}
          <div className="footer-enhanced mt-10 pt-0" />
        </div>
      </footer>
    </div>
  )
}
