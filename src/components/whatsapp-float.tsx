"use client"

import { usePathname } from "next/navigation"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { socialMedia } from "@/config/social-media"

export function WhatsAppFloat() {
  const pathname = usePathname()

  if (pathname.startsWith("/admin")) return null

  return (
    <a
      href={socialMedia.whatsapp.url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 group"
      aria-label="Chat on WhatsApp"
    >
      <div className="relative">
        {/* Pulse animation ring */}
        <div className="absolute inset-0 bg-[hsl(var(--whatsapp))] rounded-full animate-ping opacity-75" />

        {/* Main button */}
        <div className="relative bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp))]/90 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
          <WhatsAppIcon className="h-5 w-5" />
        </div>
      </div>
    </a>
  )
}
