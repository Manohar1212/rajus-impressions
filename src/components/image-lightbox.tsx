"use client"

import { useCallback, useEffect } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface ImageLightboxProps {
  images: { src: string; alt: string; title?: string }[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
}

export function ImageLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious,
}: ImageLightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") onNext()
      if (e.key === "ArrowLeft") onPrevious()
    },
    [isOpen, onClose, onNext, onPrevious]
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    if (isOpen) {
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [handleKeyDown, isOpen])

  if (!isOpen) return null

  const currentImage = images[currentIndex]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Image viewer: ${currentImage.alt}`}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/95 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Close lightbox"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Navigation - Previous */}
      {images.length > 1 && (
        <button
          onClick={onPrevious}
          className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Main Image */}
      <div className="relative w-full h-full max-w-6xl max-h-[85vh] mx-4 md:mx-16">
        <Image
          src={currentImage.src}
          alt={currentImage.alt}
          fill
          className="object-contain"
          quality={90}
          priority
          sizes="100vw"
        />
      </div>

      {/* Navigation - Next */}
      {images.length > 1 && (
        <button
          onClick={onNext}
          className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Image info & counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-center">
        {currentImage.title && (
          <p className="text-white font-medium mb-2">{currentImage.title}</p>
        )}
        <p className="text-white/60 text-sm">
          {currentIndex + 1} / {images.length}
        </p>
      </div>
    </div>
  )
}
