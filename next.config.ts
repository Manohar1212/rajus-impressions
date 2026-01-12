import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Enable modern image formats
    formats: ['image/avif', 'image/webp'],
    // Configure quality levels
    qualities: [75, 85, 90, 100],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // Image sizes for different layouts
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
  },
};

export default nextConfig;
