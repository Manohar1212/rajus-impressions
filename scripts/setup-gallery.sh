#!/bin/bash

# Gallery Setup Helper Script
# This script helps you set up your gallery images from Instagram

echo "🎨 Raju's Impressions - Gallery Setup Helper"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if public directory exists
if [ ! -d "public" ]; then
    echo -e "${RED}❌ Error: public directory not found${NC}"
    echo "Make sure you're running this from the project root directory"
    exit 1
fi

echo "📁 Creating necessary directories..."
mkdir -p public/gallery
mkdir -p public/services

echo -e "${GREEN}✅ Directories created${NC}"
echo ""

# Check for images in gallery
echo "🔍 Checking gallery images..."
gallery_count=$(ls -1 public/gallery/impression-*.jpg 2>/dev/null | wc -l)
echo "Found $gallery_count gallery images"

if [ $gallery_count -eq 0 ]; then
    echo -e "${YELLOW}⚠️  No gallery images found${NC}"
    echo "Please add images named impression-1.jpg through impression-12.jpg"
elif [ $gallery_count -lt 12 ]; then
    echo -e "${YELLOW}⚠️  Only $gallery_count/12 gallery images found${NC}"
    echo "Missing images:"
    for i in {1..12}; do
        if [ ! -f "public/gallery/impression-$i.jpg" ]; then
            echo "  - impression-$i.jpg"
        fi
    done
else
    echo -e "${GREEN}✅ All 12 gallery images found${NC}"
fi

echo ""

# Check for service images
echo "🔍 Checking service images..."
service_images=("hand-impression.jpg" "foot-impression.jpg" "framed-keepsake.jpg")
service_count=0

for img in "${service_images[@]}"; do
    if [ -f "public/services/$img" ]; then
        ((service_count++))
    else
        echo -e "${YELLOW}⚠️  Missing: $img${NC}"
    fi
done

if [ $service_count -eq 3 ]; then
    echo -e "${GREEN}✅ All 3 service images found${NC}"
else
    echo -e "${YELLOW}⚠️  Only $service_count/3 service images found${NC}"
fi

echo ""

# Check for hero image
echo "🔍 Checking hero image..."
if [ -f "public/hero-impression.jpg" ]; then
    echo -e "${GREEN}✅ Hero image found${NC}"
else
    echo -e "${YELLOW}⚠️  Hero image not found (hero-impression.jpg)${NC}"
fi

echo ""
echo "=============================================="

# Summary
total_required=16
total_found=$((gallery_count + service_count))
if [ -f "public/hero-impression.jpg" ]; then
    ((total_found++))
fi

echo "📊 Summary: $total_found/$total_required images ready"
echo ""

if [ $total_found -eq $total_required ]; then
    echo -e "${GREEN}🎉 Perfect! Your gallery is ready!${NC}"
    echo "Run 'npm run dev' to see your beautiful gallery"
else
    echo -e "${YELLOW}📋 Next steps:${NC}"
    echo "1. Download images from Instagram (see INSTAGRAM_TO_GALLERY_GUIDE.md)"
    echo "2. Optimize and resize images"
    echo "3. Rename and place them in the correct folders"
    echo "4. Run this script again to verify"
fi

echo ""
