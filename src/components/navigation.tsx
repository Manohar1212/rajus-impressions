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
          ? "py-3 border-b"
          : "py-4 md:py-5 bg-transparent"
      }`}
      style={{
        backgroundColor: useScrolledStyle ? 'hsl(var(--cream) / 0.97)' : 'transparent',
        borderColor: useScrolledStyle ? 'hsl(var(--border))' : 'transparent',
        backdropFilter: useScrolledStyle ? 'blur(20px) saturate(1.3)' : 'none',
        WebkitBackdropFilter: useScrolledStyle ? 'blur(20px) saturate(1.3)' : 'none',
        boxShadow: useScrolledStyle
          ? '0 1px 2px rgba(0, 0, 0, 0.03), 0 8px 32px -8px rgba(0, 0, 0, 0.08)'
          : 'none',
        transitionProperty: 'padding, background-color, border-color, box-shadow, backdrop-filter',
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        willChange: isScrolling ? 'transform, background-color, border-color' : 'auto'
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
            className="hidden lg:flex items-center gap-10"
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
                  className={`relative text-[13px] uppercase tracking-wider font-medium transition-all duration-300 ease-out py-2 ${
                    isActive
                      ? useScrolledStyle
                        ? "text-primary"
                        : "text-white"
                      : useScrolledStyle
                        ? "text-muted-foreground hover:text-primary"
                        : "text-white/70 hover:text-white"
                  }`}
                  style={{ transitionProperty: 'color, opacity' }}
                >
                  {item.name}
                  {/* Gold underline indicator */}
                  <span
                    className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-[3px] rounded-full transition-all duration-500 ease-out ${
                      isActive ? "w-5 opacity-100" : "w-0 opacity-0"
                    }`}
                    style={{
                      background: 'hsl(var(--gold))',
                      transitionProperty: 'width, opacity',
                      transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)'
                    }}
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
              variant="clay"
              size="sm"
              className="h-10 px-6 text-[12px] uppercase tracking-wider"
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
              <SheetContent side="right" className="w-[300px] p-0 border-l border-border/10 bg-background">
                <SheetTitle className="sr-only">{t('navigation.navigationMenu')}</SheetTitle>
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between px-6 py-6 border-b border-border/10">
                    <Image
                      src="/rajus-impressions.png"
                      alt={t('brand.logoAlt')}
                      width={130}
                      height={32}
                      className="object-contain h-8 w-auto"
                      quality={90}
                    />
                  </div>

                  {/* Language Switcher */}
                  <LanguageSwitcher variant="mobile" />

                  {/* Mobile Navigation Links */}
                  <nav aria-label="Mobile navigation" className="flex flex-col px-6 py-6 flex-1 gap-0.5">
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
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[hsl(var(--gold))] rounded-r-full" />
                          )}
                          {item.name}
                        </Link>
                      )
                    })}
                  </nav>

                  {/* Mobile CTA Buttons */}
                  <div className="px-6 py-6 border-t border-border/10 space-y-3">
                    <Button
                      asChild
                      variant="clay"
                      className="w-full h-12 text-sm uppercase tracking-wider"
                    >
                      <a href={socialMedia.phone.url} onClick={() => setMobileMenuOpen(false)}>
                        <Phone className="h-4 w-4 mr-2" />
                        {t('navigation.bookNow')}
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="clay-outline"
                      className="w-full h-12 text-sm uppercase tracking-wider hover:bg-[hsl(var(--whatsapp))]/10 hover:border-[hsl(var(--whatsapp))] hover:text-[hsl(var(--whatsapp))]"
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
