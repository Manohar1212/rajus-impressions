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
import { Phone, MapPin, Star, Loader2, ArrowRight, ChevronDown, Heart, Shield, Award, Truck } from "lucide-react"
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

    // GSAP ScrollTrigger animation
    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
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

    // Reset scroll position if itemCount changed (data loaded)
    if (prevItemCountRef.current !== itemCount) {
      prevItemCountRef.current = itemCount
      container.scrollTo({ left: 0, behavior: 'auto' })
      // Trigger handleScroll after reset to update active index
      requestAnimationFrame(handleScroll)
    } else {
      // Initial check to set correct active index with a small delay to ensure layout is ready
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

  // Auto-play functionality
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

    // Reset auto-play timer when user manually navigates
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

  // Scroll reveal refs for each section
  const aboutReveal = useScrollReveal()
  const featuresReveal = useScrollReveal()
  const galleryReveal = useScrollReveal()
  const servicesReveal = useScrollReveal()
  const processReveal = useScrollReveal()
  const testimonialsReveal = useScrollReveal()
  const ctaReveal = useScrollReveal()

  // Carousel hooks for mobile
  const featuresCarousel = useCarousel(features.length)
  const processCarousel = useCarousel(processSteps.length)
  const servicesCarousel = useCarousel(services.length)
  const testimonialsCarousel = useCarousel(testimonials.length, true, 5000) // Auto-play enabled with 5s delay

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

  // Hero section GSAP animations with parallax
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance timeline
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } })

      tl.fromTo(
        ".hero-label",
        { opacity: 0, y: 60, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2 }
      )
      .fromTo(
        ".hero-title",
        { opacity: 0, y: 80, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1.4 },
        "-=0.8"
      )
      .fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1 },
        "-=1"
      )
      .fromTo(
        ".hero-cta",
        { opacity: 0, y: 50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1 },
        "-=0.8"
      )
      .fromTo(
        ".hero-trust",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.6"
      )
      .fromTo(
        ".scroll-indicator",
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, repeat: -1, yoyo: true, ease: "power1.inOut" },
        "-=0.4"
      )

      // Parallax effect on hero background
      gsap.to(".hero-bg", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: "#home",
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      })

      // Floating animation for decorative elements
      gsap.to(".float-gentle", {
        y: -20,
        duration: 3,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true
      })
    })

    return () => ctx.revert()
  }, [])

  // Gallery grid stagger animation
  useEffect(() => {
    if (!loading && galleryImages.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".gallery-item",
          {
            opacity: 0,
            scale: 0.8,
            y: 50
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: "#gallery",
              start: "top 80%",
            }
          }
        )
      })

      return () => ctx.revert()
    }
  }, [loading, galleryImages])

  // Features stagger animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".feature-card",
        {
          opacity: 0,
          y: 60,
          rotateY: -15
        },
        {
          opacity: 1,
          y: 0,
          rotateY: 0,
          duration: 0.8,
          stagger: 0.15,
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

  // Services cards hover effect
  useEffect(() => {
    if (!loading && services.length > 0) {
      const ctx = gsap.context(() => {
        const cards = document.querySelectorAll(".service-card")

        cards.forEach((card) => {
          const handleMouseEnter = () => {
            gsap.to(card, {
              scale: 1.05,
              y: -10,
              duration: 0.4,
              ease: "power2.out"
            })
          }

          const handleMouseLeave = () => {
            gsap.to(card, {
              scale: 1,
              y: 0,
              duration: 0.4,
              ease: "power2.out"
            })
          }

          card.addEventListener("mouseenter", handleMouseEnter)
          card.addEventListener("mouseleave", handleMouseLeave)
        })
      })

      return () => ctx.revert()
    }
  }, [loading, services])

  // Magnetic buttons effect
  useEffect(() => {
    const ctx = gsap.context(() => {
      const buttons = document.querySelectorAll(".magnetic-btn")

      buttons.forEach((button) => {
        const handleMouseMove = (e: MouseEvent) => {
          const btn = e.currentTarget as HTMLElement
          const rect = btn.getBoundingClientRect()
          const x = e.clientX - rect.left - rect.width / 2
          const y = e.clientY - rect.top - rect.height / 2

          gsap.to(btn, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: "power2.out"
          })
        }

        const handleMouseLeave = (e: MouseEvent) => {
          const btn = e.currentTarget as HTMLElement
          gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.5)"
          })
        }

        button.addEventListener("mousemove", handleMouseMove as EventListener)
        button.addEventListener("mouseleave", handleMouseLeave as EventListener)
      })
    })

    return () => ctx.revert()
  }, [])

  // Process steps stagger animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".process-step",
        {
          opacity: 0,
          scale: 0.5,
          y: 50
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
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

  // Testimonials cards animation
  useEffect(() => {
    if (!loading && testimonials.length > 0) {
      const ctx = gsap.context(() => {
        const cards = document.querySelectorAll(".testimonial-card")

        cards.forEach((card) => {
          gsap.fromTo(
            card,
            {
              opacity: 0,
              x: 100,
              rotateY: 20
            },
            {
              opacity: 1,
              x: 0,
              rotateY: 0,
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

  // CTA section animated corners
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
        {
          scaleX: 1,
          scaleY: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out"
        }
      )
    })

    return () => ctx.revert()
  }, [])

  // Social icons hover effect
  useEffect(() => {
    const ctx = gsap.context(() => {
      const icons = document.querySelectorAll(".social-icon")

      icons.forEach((icon) => {
        const handleMouseEnter = () => {
          gsap.to(icon, {
            scale: 1.2,
            rotation: 360,
            duration: 0.6,
            ease: "back.out(2)"
          })
        }

        const handleMouseLeave = () => {
          gsap.to(icon, {
            scale: 1,
            rotation: 0,
            duration: 0.4,
            ease: "power2.out"
          })
        }

        icon.addEventListener("mouseenter", handleMouseEnter)
        icon.addEventListener("mouseleave", handleMouseLeave)
      })
    })

    return () => ctx.revert()
  }, [])

  // About section quote reveal
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-quote",
        {
          opacity: 0,
          x: -100,
          rotateY: -30
        },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-quote",
            start: "top 85%",
          }
        }
      )

      gsap.fromTo(
        ".about-text",
        {
          opacity: 0,
          x: 100
        },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-text",
            start: "top 85%",
          }
        }
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
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

        {/* Content */}
        <div className="relative z-10 container max-w-4xl px-6 text-center">
          <div className="space-y-6">
            {/* Elegant Label */}
            <div className="hero-label">
              <span className="inline-block text-[11px] uppercase tracking-luxury text-[hsl(var(--gold))] font-medium">
                {tHome('hero.label')}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-title font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight sm:whitespace-nowrap">
              {tHome('hero.title')} <span className="text-gold-gradient">{tHome('hero.titleHighlight')}</span>
            </h1>

            {/* Subheadline */}
            <p className="hero-subtitle text-lg md:text-xl text-white/60 max-w-xl mx-auto font-light">
              {tHome('hero.subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button
                asChild
                size="lg"
                className="magnetic-btn bg-white text-foreground hover:bg-white/95 h-14 px-10 rounded-none font-medium text-sm tracking-wide shadow-2xl transition-all duration-500 hover:shadow-white/20 btn-shine"
              >
                <a href={socialMedia.phone.url}>
                  <Phone className="mr-3 h-4 w-4" />
                  {tCommon('buttons.bookNow')}
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                className="magnetic-btn bg-transparent border border-white/30 text-white hover:bg-white/10 h-14 px-10 rounded-none font-medium text-sm tracking-wide transition-all duration-500"
              >
                <a href={socialMedia.whatsapp.url} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="mr-3 h-4 w-4" />
                  {tCommon('buttons.whatsapp')}
                </a>
              </Button>
            </div>

            {/* Trust Indicators - Simple */}
            <div className="hero-trust flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-white/50 text-[10px] sm:text-xs uppercase tracking-wider pt-12 sm:pt-20">
              <span>{tCommon('trust.families')}</span>
              <span className="w-1 h-1 bg-white/30 rounded-full" />
              <span>{tCommon('trust.rating')}</span>
              <span className="w-1 h-1 bg-white/30 rounded-full" />
              <span>{tCommon('trust.allIndiaService')}</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <a
          href="#about"
          className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white/40 hover:text-white/70 transition-colors"
          aria-label={tHome('hero.scrollToAbout')}
        >
          <ChevronDown className="h-6 w-6 animate-scroll" />
        </a>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 bg-ivory relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-[hsl(var(--gold))]/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-[100px]" />
        </div>

        <div className="container max-w-6xl relative">
          <div
            ref={aboutReveal.ref}
            className={`transition-all duration-1000 ${
              aboutReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {/* Header */}
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-luxury text-[hsl(var(--gold))] font-medium">{tHome('about.label')}</span>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground mt-3 leading-luxury">
                {tHome('about.title')}
              </h2>
            </div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left - Quote Block */}
              <div className="about-quote relative p-10 md:p-12 bg-foreground text-background">
                {/* Decorative corner */}
                <div className="absolute top-0 left-0 w-16 h-16">
                  <div className="absolute top-4 left-4 w-full h-px bg-[hsl(var(--gold))]/50" />
                  <div className="absolute top-4 left-4 h-full w-px bg-[hsl(var(--gold))]/50" />
                </div>
                <div className="absolute bottom-0 right-0 w-16 h-16">
                  <div className="absolute bottom-4 right-4 w-full h-px bg-[hsl(var(--gold))]/50" />
                  <div className="absolute bottom-4 right-4 h-full w-px bg-[hsl(var(--gold))]/50" />
                </div>

                <span className="text-6xl font-serif text-[hsl(var(--gold))]/30 leading-none">&ldquo;</span>
                <blockquote className="font-serif text-2xl md:text-3xl text-background leading-relaxed -mt-4">
                  {tHome('about.quote')} <span className="text-[hsl(var(--gold))]">{tHome('about.quoteHighlight')}</span> {tHome('about.quoteSuffix')}
                </blockquote>
                <p className="text-background/50 text-sm uppercase tracking-wider mt-6">{tHome('about.quoteAuthor')}</p>
              </div>

              {/* Right - Text Content */}
              <div className="about-text space-y-6">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {tHome('about.paragraph1')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {tHome('about.paragraph2')} <strong className="text-foreground">{tHome('about.paragraph2Bold')}</strong> {tHome('about.paragraph2Suffix')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {tHome('about.paragraph3')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-ivory relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[hsl(var(--gold))] rounded-full blur-[150px] float-gentle" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />
        </div>

        <div className="container max-w-6xl relative">
          <div
            ref={featuresReveal.ref}
            className={`text-center mb-10 transition-all duration-1000 ${
              featuresReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <span className="text-xs uppercase tracking-luxury text-[hsl(var(--gold))] font-medium">{tHome('features.label')}</span>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mt-3 leading-luxury">
              {tHome('features.title')}
            </h2>
          </div>

          {/* Mobile: Full-width swipe carousel */}
          <div className={`sm:hidden transition-all duration-1000 delay-200 ${
            featuresReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div
              ref={featuresCarousel.scrollRef}
              className="overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            >
              <div className="flex">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="w-full flex-shrink-0 snap-center px-4"
                  >
                    <div className="p-8 bg-background border border-border/50 card-premium group text-center">
                      <div className="w-14 h-14 bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary transition-colors duration-300 mx-auto">
                        <feature.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors duration-300" />
                      </div>
                      <h3 className="font-serif text-lg text-foreground mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mt-6" suppressHydrationWarning>
              {features.map((_, i) => (
                <button
                  key={i}
                  onClick={() => featuresCarousel.scrollToIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    featuresCarousel.activeIndex === i
                      ? 'bg-primary w-6'
                      : 'bg-border w-2 hover:bg-muted-foreground'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Tablet/Desktop: Grid layout */}
          <div className="features-grid hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="feature-card p-8 bg-background border border-border/50 card-premium group text-center"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="w-14 h-14 bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300 mx-auto">
                  <feature.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-serif text-lg text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-16 md:py-24 bg-background">
        <div className="container max-w-7xl">
          <div
            ref={galleryReveal.ref}
            className={`text-center mb-10 transition-all duration-1000 ${
              galleryReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <span className="text-xs uppercase tracking-luxury text-[hsl(var(--gold))] font-medium">{tHome('gallery.label')}</span>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mt-3 leading-luxury">
              {tHome('gallery.title')}
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {galleryImages.slice(0, 6).map((item, i) => (
                  <Link
                    key={item.id || i}
                    href="/gallery"
                    className={`gallery-item group relative overflow-hidden bg-muted image-hover-zoom ${
                      i === 0 ? 'col-span-2 row-span-2 aspect-[4/3] md:aspect-auto' : 'aspect-[3/4]'
                    }`}
                  >
                    <Image
                      src={item.imagePath}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes={i === 0 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 50vw, 33vw"}
                      quality={85}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      <p className="text-white font-serif text-lg">{item.title}</p>
                      <p className="text-white/60 text-sm mt-1">{item.category}</p>
                    </div>
                    <div className="absolute top-4 left-4 w-8 h-px bg-[hsl(var(--gold))] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    <div className="absolute top-4 left-4 h-8 w-px bg-[hsl(var(--gold))] scale-y-0 group-hover:scale-y-100 transition-transform duration-500 delay-100 origin-top" />
                  </Link>
                ))}
              </div>

              {/* View Full Collection Link */}
              <div className={`flex justify-center mt-8 md:mt-10 transition-all duration-1000 delay-400 ${
                galleryReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <Link
                  href="/gallery"
                  className="inline-flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <span>{tCommon('buttons.viewFullCollection')}</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 md:py-24 bg-ivory relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[hsl(var(--gold))] rounded-full blur-[150px]" />
        </div>

        <div className="container max-w-6xl relative">
          <div
            ref={servicesReveal.ref}
            className={`text-center mb-12 transition-all duration-1000 ${
              servicesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <span className="text-xs uppercase tracking-luxury text-[hsl(var(--gold))] font-medium">{tHome('services.label')}</span>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mt-3 leading-luxury">
              {tHome('services.title')}
            </h2>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
              {tHome('services.subtitle')}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Mobile: Full-width swipe carousel */}
              <div className={`md:hidden transition-all duration-1000 delay-200 ${
                servicesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <div
                  ref={servicesCarousel.scrollRef}
                  className="overflow-x-auto scrollbar-hide snap-x snap-mandatory"
                >
                  <div className="flex">
                    {services.map((service, i) => (
                      <div
                        key={service.id || i}
                        className="w-full flex-shrink-0 snap-center px-4"
                      >
                        <div className="group relative aspect-[3/4] overflow-hidden bg-muted card-premium cursor-pointer">
                          <Image
                            src={service.imagePath}
                            alt={service.title}
                            fill
                            className="object-cover"
                            sizes="100vw"
                            quality={85}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute top-6 left-6 w-8 h-px bg-[hsl(var(--gold))]" />
                          <div className="absolute bottom-0 left-0 right-0 p-8">
                            <span className="text-[10px] uppercase tracking-luxury text-[hsl(var(--gold))]">
                              0{i + 1}
                            </span>
                            <h3 className="text-white font-serif text-2xl mt-2">{service.title}</h3>
                            {service.description && (
                              <p className="text-white/60 text-sm mt-3 leading-relaxed line-clamp-2">
                                {service.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Dot indicators */}
                {services.length > 0 && (
                  <div className="flex justify-center gap-2 mt-6" suppressHydrationWarning>
                    {services.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => servicesCarousel.scrollToIndex(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          servicesCarousel.activeIndex === i
                            ? 'bg-primary w-6'
                            : 'bg-border w-2 hover:bg-muted-foreground'
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop: Grid layout */}
              <div className="hidden md:grid md:grid-cols-3 gap-8">
                {services.map((service, i) => (
                  <div
                    key={service.id || i}
                    className="service-card group relative aspect-[3/4] overflow-hidden bg-muted card-premium cursor-pointer image-hover-zoom"
                  >
                    <Image
                      src={service.imagePath}
                      alt={service.title}
                      fill
                      className="object-cover"
                      sizes="33vw"
                      quality={85}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-6 left-6 w-0 group-hover:w-8 h-px bg-[hsl(var(--gold))] transition-all duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <span className="text-[10px] uppercase tracking-luxury text-[hsl(var(--gold))] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        0{i + 1}
                      </span>
                      <h3 className="text-white font-serif text-2xl mt-2 transform group-hover:-translate-y-1 transition-transform duration-500">{service.title}</h3>
                      {service.description && (
                        <p className="text-white/60 text-sm mt-3 leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
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

      {/* Process Section */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container max-w-5xl px-4 sm:px-6">
          <div
            ref={processReveal.ref}
            className={`text-center mb-10 transition-all duration-1000 ${
              processReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <span className="text-xs uppercase tracking-luxury text-[hsl(var(--gold))] font-medium">{tHome('process.label')}</span>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mt-3 leading-luxury">
              {tHome('process.title')}
            </h2>
          </div>

          <div className={`relative transition-all duration-1000 delay-200 ${
            processReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-border to-transparent z-0" />

            {/* Mobile: Full-width swipe carousel */}
            <div className="md:hidden">
              <div
                ref={processCarousel.scrollRef}
                className="overflow-x-auto scrollbar-hide snap-x snap-mandatory"
              >
                <div className="flex">
                  {processSteps.map((item) => (
                    <div
                      key={item.step}
                      className="w-full flex-shrink-0 snap-center px-4"
                    >
                      <div className="text-center group relative py-4">
                        {/* Step number circle */}
                        <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6 mx-auto bg-background">
                          <div className="absolute inset-0 border border-[hsl(var(--gold))]/30" />
                          <div className="absolute inset-2 border border-[hsl(var(--gold))]/20" />
                          <span className="text-2xl font-serif text-[hsl(var(--gold))]">
                            {item.step}
                          </span>
                        </div>
                        <h3 className="font-serif text-xl text-foreground mb-3">{item.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Dot indicators */}
              <div className="flex justify-center gap-2 mt-6" suppressHydrationWarning>
                {processSteps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => processCarousel.scrollToIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      processCarousel.activeIndex === i
                        ? 'bg-primary w-6'
                        : 'bg-border w-2 hover:bg-muted-foreground'
                    }`}
                    aria-label={`Go to step ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Desktop: Grid layout */}
            <div className="process-grid hidden md:grid md:grid-cols-4 gap-8 relative z-10">
              {processSteps.map((item, i) => (
                <div
                  key={item.step}
                  className="process-step text-center group relative"
                >
                  {/* Step number circle */}
                  <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6 mx-auto bg-background">
                    <div className="absolute inset-0 border border-[hsl(var(--gold))]/20 group-hover:border-[hsl(var(--gold))]/50 transition-colors duration-500" />
                    <div className="absolute inset-2 border border-[hsl(var(--gold))]/10 group-hover:border-[hsl(var(--gold))]/30 transition-colors duration-500" />
                    <span className="text-2xl font-serif text-[hsl(var(--gold))] group-hover:scale-110 transition-transform duration-300">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-16 md:py-24 bg-foreground text-background relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-[hsl(var(--gold))]/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[hsl(var(--gold))]/5 rounded-full blur-[100px]" />
        </div>

        <div className="container max-w-4xl text-center relative">
          {/* Decorative corners */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
            <div className="w-12 h-px bg-gradient-to-l from-[hsl(var(--gold))]/40 to-transparent" />
            <div className="w-2 h-2 border border-[hsl(var(--gold))]/40 rotate-45" />
            <div className="w-12 h-px bg-gradient-to-r from-[hsl(var(--gold))]/40 to-transparent" />
          </div>

          <span className="text-xs uppercase tracking-luxury text-[hsl(var(--gold))] font-medium">{tHome('why.label')}</span>
          <h2 className="font-serif text-4xl md:text-5xl mt-3 mb-8 leading-luxury">
            {tHome('why.title')}
          </h2>
          <p className="text-background/70 text-xl leading-relaxed mb-6 font-light">
            {tHome('why.subtitle')}
          </p>
          <p className="text-background/60 leading-relaxed max-w-2xl mx-auto">
            {tHome('why.description')} <strong className="text-background font-medium">{tHome('why.descriptionBold')}</strong>{tHome('why.descriptionSuffix')}
          </p>

          {/* Bottom decorative element */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
            <div className="w-12 h-px bg-gradient-to-l from-[hsl(var(--gold))]/40 to-transparent" />
            <div className="w-2 h-2 border border-[hsl(var(--gold))]/40 rotate-45" />
            <div className="w-12 h-px bg-gradient-to-r from-[hsl(var(--gold))]/40 to-transparent" />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24 bg-background">
        <div className="container max-w-5xl">
          <div
            ref={testimonialsReveal.ref}
            className={`text-center mb-8 transition-all duration-1000 ${
              testimonialsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <span className="text-xs uppercase tracking-luxury text-[hsl(var(--gold))] font-medium">{tHome('testimonials.label')}</span>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mt-3 leading-luxury">
              {tHome('testimonials.title')}
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              {tHome('testimonials.subtitle')}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Full-width swipe carousel for all screen sizes */}
              <div className={`transition-all duration-1000 delay-200 ${
                testimonialsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <div
                  ref={testimonialsCarousel.scrollRef}
                  className="overflow-x-auto scrollbar-hide snap-x snap-mandatory mt-12 cursor-grab active:cursor-grabbing"
                >
                  <div className="flex">
                    {testimonials.map((testimonial, i) => (
                      <div
                        key={testimonial.id || i}
                        className="w-full flex-shrink-0 snap-center px-4 md:px-6"
                      >
                        <div className="testimonial-card relative p-6 md:p-8 bg-card border border-border/50 card-premium group max-w-3xl mx-auto">
                          <div className="absolute top-0 left-0 w-12 md:w-14 h-12 md:h-14 overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-[hsl(var(--gold))] to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-[hsl(var(--gold))] to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500 delay-100" />
                          </div>
                          <div className="flex gap-1 mb-4 md:mb-5">
                            {Array.from({ length: testimonial.rating }).map((_, j) => (
                              <Star
                                key={j}
                                className="h-4 w-4 md:h-5 md:w-5 fill-[hsl(var(--gold))] text-[hsl(var(--gold))] transition-transform duration-300 group-hover:scale-110"
                                style={{ transitionDelay: `${j * 50}ms` }}
                              />
                            ))}
                          </div>
                          <p className="text-foreground/80 text-base md:text-lg leading-relaxed font-light italic line-clamp-4 md:line-clamp-none">
                            &ldquo;{testimonial.message}&rdquo;
                          </p>
                          <div className="flex items-center gap-3 md:gap-4 mt-6 md:mt-8 pt-5 md:pt-6 border-t border-border/50">
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 flex items-center justify-center text-primary font-serif text-lg md:text-xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                              {testimonial.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-foreground text-sm md:text-base">{testimonial.name}</p>
                              <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
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
                {/* Dot indicators */}
                <div className="flex justify-center gap-2 md:gap-3 mt-8" suppressHydrationWarning>
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => testimonialsCarousel.scrollToIndex(i)}
                      className={`h-2 md:h-2.5 rounded-full transition-all duration-300 ${
                        testimonialsCarousel.activeIndex === i
                          ? 'bg-primary w-8 md:w-10'
                          : 'bg-border w-2 md:w-2.5 hover:bg-muted-foreground'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Google Reviews CTA */}
          <div className={`flex items-center justify-center mt-12 md:mt-14 transition-all duration-1000 delay-400 ${
            testimonialsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <a
              href={socialMedia.google.reviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
            >
              <GoogleIcon className="h-4 w-4" />
              <span className="text-sm">{tCommon('buttons.readReviews')}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-12 md:py-20">
        <div className="container max-w-5xl px-4 sm:px-6">
          <div
            ref={ctaReveal.ref}
            className="cta-section relative overflow-hidden bg-foreground p-8 sm:p-10 md:p-16 text-center"
          >
            <div className="absolute top-0 left-0 w-32 h-32">
              <div className="cta-corner-line absolute top-8 left-8 w-full h-px bg-gradient-to-r from-[hsl(var(--gold))]/50 to-transparent origin-left" />
              <div className="cta-corner-line absolute top-8 left-8 h-full w-px bg-gradient-to-b from-[hsl(var(--gold))]/50 to-transparent origin-top" />
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32">
              <div className="cta-corner-line absolute bottom-8 right-8 w-full h-px bg-gradient-to-l from-[hsl(var(--gold))]/50 to-transparent origin-right" />
              <div className="cta-corner-line absolute bottom-8 right-8 h-full w-px bg-gradient-to-t from-[hsl(var(--gold))]/50 to-transparent origin-bottom" />
            </div>
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[hsl(var(--gold))]/5 rounded-full blur-[100px] transition-all duration-1000 ${
              ctaReveal.isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`} />

            <div className="relative">
              <span className={`inline-block text-xs uppercase tracking-luxury text-[hsl(var(--gold))] font-medium transition-all duration-700 delay-300 ${
                ctaReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>{tHome('cta.label')}</span>
              <h2 className={`font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-background mt-4 leading-luxury transition-all duration-700 delay-400 ${
                ctaReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                {tHome('cta.title')}
              </h2>
              <p className={`text-background/60 mt-4 max-w-lg mx-auto transition-all duration-700 delay-500 ${
                ctaReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                {tHome('cta.subtitle')}
              </p>

              <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8 sm:mt-10 transition-all duration-700 delay-600 ${
                ctaReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <Button
                  asChild
                  size="lg"
                  className="magnetic-btn bg-background text-foreground hover:bg-background/95 h-12 sm:h-14 px-6 sm:px-10 rounded-none font-medium text-sm tracking-wide shadow-2xl btn-shine"
                >
                  <a href={socialMedia.phone.url}>
                    <Phone className="mr-2 sm:mr-3 h-4 w-4" />
                    {socialMedia.phone.displayNumber}
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="magnetic-btn bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp))]/90 text-white h-12 sm:h-14 px-6 sm:px-10 rounded-none font-medium text-sm tracking-wide shadow-2xl btn-shine"
                >
                  <a href={socialMedia.whatsapp.url} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon className="mr-2 sm:mr-3 h-4 w-4" />
                    {tCommon('buttons.whatsappUs')}
                  </a>
                </Button>
              </div>

              <div className={`flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 text-background/50 text-sm transition-all duration-700 delay-700 ${
                ctaReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {tCommon('location.fullLocation')}
                </span>
                <span className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  {tCommon('location.serviceArea')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 md:py-16 border-t border-border/50">
        <div className="container max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 items-center">
            {/* Logo Section - Simplified for mobile */}
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 md:gap-3 justify-center md:justify-start group">
                <Image
                  src="/rajus-impressions-icon.png"
                  alt="Raju's Impressions"
                  width={32}
                  height={32}
                  className="md:w-10 md:h-10 object-contain transition-transform duration-300 group-hover:scale-110"
                />
                <div>
                  <p className="font-serif text-base md:text-xl text-foreground">{tCommon('brand.name')}</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground hidden md:block">{tCommon('brand.tagline')}</p>
                </div>
              </div>
            </div>

            {/* Social Links - Compact on mobile */}
            <div className="flex items-center justify-center gap-4 md:gap-6">
              <a
                href={socialMedia.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={tCommon('contact.followInstagram')}
                className="social-icon w-9 h-9 md:w-11 md:h-11 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-[#E4405F] hover:border-[#E4405F] transition-all duration-300"
              >
                <InstagramIcon className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
              </a>
              <a
                href={socialMedia.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={tCommon('contact.followFacebook')}
                className="social-icon w-9 h-9 md:w-11 md:h-11 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-[#1877F2] hover:border-[#1877F2] transition-all duration-300"
              >
                <FacebookIcon className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
              </a>
              <a
                href={socialMedia.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={tCommon('contact.chatWhatsApp')}
                className="social-icon w-9 h-9 md:w-11 md:h-11 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-[hsl(var(--whatsapp))] hover:border-[hsl(var(--whatsapp))] transition-all duration-300"
              >
                <WhatsAppIcon className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
              </a>
            </div>

            {/* Location & Copyright - Minimal on mobile */}
            <div className="text-center md:text-right space-y-2">
              <a
                href={socialMedia.google.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <MapPin className="h-3 w-3 md:h-4 md:w-4" />
                {tCommon('location.city')}, {tCommon('location.state')}
              </a>
              <p className="text-xs md:text-sm text-muted-foreground/60" suppressHydrationWarning>
                {tCommon('footer.copyright', { year: new Date().getFullYear() })}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
