"use client"

import { useState, useEffect } from "react"
import { Menu, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { socialMedia } from "@/config/social-media"

const navItems = [
  { name: "Home", href: "/", path: "/", section: "home" },
  { name: "Gallery", href: "/gallery", path: "/gallery", section: "gallery" },
  { name: "Services", href: "/#services", path: "/", section: "services" },
  { name: "Testimonials", href: "/#testimonials", path: "/", section: "testimonials" },
  { name: "Contact", href: "/#contact", path: "/", section: "contact" },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const pathname = usePathname()

  // On gallery page, always use scrolled (dark text) style since there's no hero image
  const isGalleryPage = pathname === "/gallery"
  const useScrolledStyle = isScrolled || isGalleryPage

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)

      // Only detect sections on home page
      if (pathname === "/") {
        const sections = ["home", "gallery", "services", "testimonials", "contact"]

        // Check if at bottom of page - activate contact
        const isAtBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 100
        if (isAtBottom) {
          setActiveSection("contact")
          return
        }

        // Find the section that's currently most in view
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
    handleScroll() // Call once on mount
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        useScrolledStyle
          ? "py-2 bg-background/95 backdrop-blur-xl border-b border-border/20 shadow-sm"
          : "py-3 md:py-4 bg-transparent"
      }`}
    >
      <div className="container max-w-7xl px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group transition-all duration-300 flex-shrink-0"
          >
            <div className={`relative transition-all duration-300 ${useScrolledStyle ? 'h-8 md:h-10' : 'h-9 md:h-12'}`}>
              <Image
                src="/rajus-impressions.png"
                alt="Raju's Impressions Logo"
                width={200}
                height={48}
                className={`object-contain w-auto transition-all duration-300 ${useScrolledStyle ? 'h-8 md:h-10' : 'h-9 md:h-12'}`}
                priority
                quality={90}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className={`hidden lg:flex items-center gap-0.5 p-1 rounded-full transition-all duration-300 ${
            useScrolledStyle ? 'bg-muted/50' : 'bg-white/10 backdrop-blur-md'
          }`}>
            {navItems.map((item) => {
              const isActive =
                pathname === "/gallery"
                  ? item.name === "Gallery"
                  : item.section === activeSection

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full ${
                    isActive
                      ? useScrolledStyle
                        ? "text-primary bg-background shadow-sm"
                        : "text-white bg-white/20"
                      : useScrolledStyle
                        ? "text-muted-foreground hover:text-foreground hover:bg-background/50"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            <Button
              asChild
              size="sm"
              className="bg-[#25D366] hover:bg-[#20BA5A] text-white border-0 h-9 rounded-full px-4"
            >
              <a
                href={socialMedia.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon className="h-4 w-4" />
                <span className="font-medium">WhatsApp</span>
              </a>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-full px-4"
            >
              <a href={socialMedia.phone.url}>
                <Phone className="h-4 w-4" />
                <span className="font-medium">Book Now</span>
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-10 w-10 rounded-full transition-all duration-300 ${
                    useScrolledStyle
                      ? 'hover:bg-muted/50 text-foreground'
                      : 'hover:bg-white/10 text-white'
                  }`}
                  aria-label="Toggle menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] p-0 border-l border-border/20 bg-background">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between p-4 border-b border-border/10">
                    <Image
                      src="/rajus-impressions.png"
                      alt="Raju's Impressions Logo"
                      width={140}
                      height={32}
                      className="object-contain h-8 w-auto"
                      quality={90}
                    />
                  </div>

                  {/* Mobile Navigation Links */}
                  <nav className="flex flex-col p-2 flex-1">
                    {navItems.map((item) => {
                      const isActive =
                        pathname === "/gallery"
                          ? item.name === "Gallery"
                          : item.section === activeSection

                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                            isActive
                              ? "text-primary bg-primary/5"
                              : "text-foreground hover:bg-muted/50"
                          }`}
                        >
                          {item.name}
                        </Link>
                      )
                    })}
                  </nav>

                  {/* Mobile CTA Buttons */}
                  <div className="p-4 border-t border-border/10 space-y-2">
                    <Button
                      asChild
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-full"
                    >
                      <a href={socialMedia.phone.url} onClick={() => setMobileMenuOpen(false)}>
                        <Phone className="h-4 w-4 mr-2" />
                        Book Now
                      </a>
                    </Button>
                    <Button
                      asChild
                      className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white h-11 rounded-full"
                    >
                      <a
                        href={socialMedia.whatsapp.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <WhatsAppIcon className="h-4 w-4 mr-2" />
                        WhatsApp
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
