"use client"

import { useState, useEffect } from "react"
import { Menu, Phone, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { socialMedia } from "@/config/social-media"
import { useTranslations } from "next-intl"
import { LanguageSwitcher } from "@/components/language-switcher"

export function Navigation() {
  const t = useTranslations('common')
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const pathname = usePathname()

  const navItems = [
    { name: t('navigation.home'), href: "/", path: "/", section: "home", isPage: true },
    { name: t('navigation.gallery'), href: "/gallery", path: "/gallery", section: "gallery", isPage: false },
    { name: t('navigation.services'), href: "/#services", path: "/", section: "services", isPage: false },
    { name: t('navigation.testimonials'), href: "/#testimonials", path: "/", section: "testimonials", isPage: false },
    { name: t('navigation.contact'), href: "/#contact", path: "/", section: "contact", isPage: false },
  ]

  const isGalleryPage = pathname === "/gallery"
  const useScrolledStyle = isScrolled || isGalleryPage
  const [isScrolling, setIsScrolling] = useState(false)

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout

    const handleScrollStart = () => {
      setIsScrolling(true)
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    }

    window.addEventListener('scroll', handleScrollStart, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScrollStart)
      clearTimeout(scrollTimeout)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)

      if (pathname === "/") {
        const sections = ["home", "gallery", "services", "testimonials", "contact"]

        const isAtBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 100
        if (isAtBottom) {
          setActiveSection("contact")
          return
        }

        const viewportMiddle = window.scrollY + window.innerHeight / 3

        for (let i = sections.length - 1; i >= 0; i--) {
          const element = document.getElementById(sections[i])
          if (element && element.offsetTop <= viewportMiddle) {
            setActiveSection(sections[i])
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    // Delay initial call to prevent hydration mismatch
    const timeoutId = setTimeout(handleScroll, 0)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timeoutId)
    }
  }, [pathname])

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ease-out ${
        useScrolledStyle
          ? "py-3 backdrop-blur-2xl border-b shadow-lg"
          : "py-4 md:py-5 bg-transparent"
      }`}
      style={{
        backgroundColor: useScrolledStyle ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
        borderColor: useScrolledStyle ? 'rgba(255, 255, 255, 0.18)' : 'transparent',
        boxShadow: useScrolledStyle
          ? '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 -1px 0 0 rgba(255, 255, 255, 0.3)'
          : 'none',
        transitionProperty: 'padding, background-color, border-color, box-shadow, backdrop-filter',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: isScrolling ? 'transform, background-color, border-color, backdrop-filter' : 'auto'
      }}
    >
      <div className="container max-w-7xl px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group transition-all duration-500 ease-out flex-shrink-0"
          >
            <div
              className={`relative transition-all duration-500 ease-out ${useScrolledStyle ? 'h-8 md:h-9' : 'h-9 md:h-11'}`}
              style={{ transitionProperty: 'height, transform' }}
            >
              <Image
                src="/rajus-impressions.png"
                alt={t('brand.logoAlt')}
                width={200}
                height={48}
                className={`object-contain w-auto transition-all duration-500 ease-out ${useScrolledStyle ? 'h-8 md:h-9' : 'h-9 md:h-11'}`}
                style={{ transitionProperty: 'height, transform' }}
                priority
                quality={90}
              />
            </div>
          </Link>

          {/* Desktop Navigation - Minimal & Elegant */}
          <nav
            aria-label="Main navigation"
            className="hidden lg:flex items-center gap-8"
          >
            {navItems.map((item) => {
              const isActive =
                pathname === "/gallery"
                  ? item.section === "gallery"
                  : item.section === activeSection

              const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                // Special handling for Home - scroll to top when on home page
                if (pathname === "/" && item.section === "home") {
                  e.preventDefault()
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                  })
                  return
                }

                // Only handle hash navigation for section scrolls, not page navigations
                if (pathname === "/" && !item.isPage && item.section) {
                  e.preventDefault()
                  const element = document.getElementById(item.section)
                  if (element) {
                    const offset = 80 // Account for fixed header
                    const elementPosition = element.getBoundingClientRect().top
                    const offsetPosition = elementPosition + window.pageYOffset - offset

                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    })
                  }
                }
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleClick}
                  className={`relative text-[13px] uppercase tracking-wider font-medium transition-all duration-300 ease-out py-1 ${
                    isActive
                      ? useScrolledStyle
                        ? "text-foreground"
                        : "text-white"
                      : useScrolledStyle
                        ? "text-muted-foreground hover:text-foreground"
                        : "text-white/60 hover:text-white"
                  }`}
                  style={{ transitionProperty: 'color, opacity' }}
                >
                  {item.name}
                  {/* Underline indicator */}
                  <span
                    className={`absolute bottom-0 left-0 h-px bg-current transition-all duration-500 ease-out ${
                      isActive ? "w-full" : "w-0"
                    }`}
                    style={{ transitionProperty: 'width, opacity', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
                  />
                </Link>
              )
            })}
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitcher variant="desktop" useScrolledStyle={useScrolledStyle} />
            <Button
              asChild
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 rounded-none text-[13px] uppercase tracking-wider font-medium btn-luxury"
            >
              <a href={socialMedia.phone.url}>
                {t('navigation.bookNow')}
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-10 w-10 rounded-none transition-all duration-300 ${
                    useScrolledStyle
                      ? 'hover:bg-muted/50 text-foreground'
                      : 'hover:bg-white/10 text-white'
                  }`}
                  aria-label={t('navigation.menuLabel')}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] p-0 border-l border-border/20 bg-background">
                <SheetTitle className="sr-only">{t('navigation.navigationMenu')}</SheetTitle>
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between px-5 py-5 border-b border-border/20">
                    <Image
                      src="/rajus-impressions.png"
                      alt={t('brand.logoAlt')}
                      width={120}
                      height={28}
                      className="object-contain h-7 w-auto"
                      quality={90}
                    />
                  </div>

                  {/* Language Switcher */}
                  <LanguageSwitcher variant="mobile" />

                  {/* Mobile Navigation Links */}
                  <nav aria-label="Mobile navigation" className="flex flex-col px-5 py-4 flex-1 gap-1">
                    {navItems.map((item) => {
                      const isActive =
                        pathname === "/gallery"
                          ? item.section === "gallery"
                          : item.section === activeSection

                      const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                        setMobileMenuOpen(false)

                        // Special handling for Home - scroll to top when on home page
                        if (pathname === "/" && item.section === "home") {
                          e.preventDefault()
                          window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                          })
                          return
                        }

                        // Only handle hash navigation for section scrolls, not page navigations
                        if (pathname === "/" && !item.isPage && item.section) {
                          e.preventDefault()
                          const element = document.getElementById(item.section)
                          if (element) {
                            const offset = 80 // Account for fixed header
                            const elementPosition = element.getBoundingClientRect().top
                            const offsetPosition = elementPosition + window.pageYOffset - offset

                            window.scrollTo({
                              top: offsetPosition,
                              behavior: 'smooth'
                            })
                          }
                        }
                      }

                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={handleClick}
                          className={`relative py-3 text-base font-serif transition-all duration-300 border-b border-border/10 ${
                            isActive
                              ? "text-foreground font-semibold pl-4"
                              : "text-muted-foreground hover:text-foreground hover:pl-2"
                          }`}
                        >
                          {/* Active indicator */}
                          {isActive && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                          )}
                          {item.name}
                        </Link>
                      )
                    })}
                  </nav>

                  {/* Mobile CTA Buttons */}
                  <div className="px-5 py-5 border-t border-border/20 space-y-3">
                    <Button
                      asChild
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-none text-sm uppercase tracking-wider font-medium"
                    >
                      <a href={socialMedia.phone.url} onClick={() => setMobileMenuOpen(false)}>
                        <Phone className="h-4 w-4 mr-2" />
                        {t('navigation.bookNow')}
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-border h-12 rounded-none text-sm uppercase tracking-wider font-medium hover:bg-[hsl(var(--whatsapp))]/10 hover:border-[hsl(var(--whatsapp))] hover:text-[hsl(var(--whatsapp))]"
                    >
                      <a
                        href={socialMedia.whatsapp.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <WhatsAppIcon className="h-4 w-4 mr-2" />
                        {t('buttons.whatsapp')}
                      </a>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
