#!/usr/bin/env node

/**
 * Image Rename Helper for Gallery Setup
 *
 * This script helps you batch rename your Instagram images
 * to match the gallery naming convention.
 *
 * Usage:
 *   node scripts/rename-images.js <source-folder>
 *
 * Example:
 *   node scripts/rename-images.js ~/Downloads/instagram-images
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

console.log(`${colors.cyan}📸 Instagram Image Rename Helper${colors.reset}`);
console.log('=====================================\n');

// Get source folder from command line argument
const sourceFolder = process.argv[2];

if (!sourceFolder) {
  console.log(`${colors.yellow}Usage:${colors.reset}`);
  console.log('  node scripts/rename-images.js <source-folder>\n');
  console.log(`${colors.yellow}Example:${colors.reset}`);
  console.log('  node scripts/rename-images.js ~/Downloads/instagram-images\n');
  process.exit(1);
}

// Check if source folder exists
if (!fs.existsSync(sourceFolder)) {
  console.log(`${colors.red}❌ Error: Folder not found: ${sourceFolder}${colors.reset}\n`);
  process.exit(1);
}

// Get all image files from source folder
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
const files = fs.readdirSync(sourceFolder)
  .filter(file => {
    const ext = path.extname(file).toLowerCase();
    return imageExtensions.includes(ext);
  })
  .sort();

if (files.length === 0) {
  console.log(`${colors.yellow}⚠️  No image files found in ${sourceFolder}${colors.reset}\n`);
  console.log('Looking for: .jpg, .jpeg, .png, .webp files\n');
  process.exit(1);
}

console.log(`${colors.green}Found ${files.length} image(s)${colors.reset}\n`);

// Create output folders
const outputBase = path.join(sourceFolder, 'renamed-for-gallery');
const galleryFolder = path.join(outputBase, 'gallery');
const servicesFolder = path.join(outputBase, 'services');

if (!fs.existsSync(outputBase)) {
  fs.mkdirSync(outputBase);
}
if (!fs.existsSync(galleryFolder)) {
  fs.mkdirSync(galleryFolder);
}
if (!fs.existsSync(servicesFolder)) {
  fs.mkdirSync(servicesFolder);
}

console.log('📋 Renaming instructions:\n');
console.log('Select images for each category:');
console.log(`  ${colors.cyan}Gallery:${colors.reset} 12 images for your gallery`);
console.log(`  ${colors.cyan}Services:${colors.reset} 3 images (hand, foot, framed)`);
console.log(`  ${colors.cyan}Hero:${colors.reset} 1 best image for homepage\n`);

// Interactive mode would require readline, so we'll do automatic naming
console.log('Auto-renaming mode:\n');

let galleryCount = 0;
let serviceCount = 0;
let heroSet = false;

files.forEach((file, index) => {
  const ext = path.extname(file);
  const sourcePath = path.join(sourceFolder, file);

  if (index === 0 && !heroSet) {
    // First image becomes hero
    const destPath = path.join(outputBase, `hero-impression${ext}`);
    fs.copyFileSync(sourcePath, destPath);
    console.log(`${colors.green}✓${colors.reset} ${file} → hero-impression${ext} (Hero image)`);
    heroSet = true;
  } else if (serviceCount < 3) {
    // Next 3 become service images
    const serviceNames = ['hand-impression', 'foot-impression', 'framed-keepsake'];
    const destPath = path.join(servicesFolder, `${serviceNames[serviceCount]}${ext}`);
    fs.copyFileSync(sourcePath, destPath);
    console.log(`${colors.green}✓${colors.reset} ${file} → services/${serviceNames[serviceCount]}${ext}`);
    serviceCount++;
  } else if (galleryCount < 12) {
    // Next 12 become gallery images
    galleryCount++;
    const destPath = path.join(galleryFolder, `impression-${galleryCount}${ext}`);
    fs.copyFileSync(sourcePath, destPath);
    console.log(`${colors.green}✓${colors.reset} ${file} → gallery/impression-${galleryCount}${ext}`);
  } else {
    console.log(`${colors.yellow}⊘${colors.reset} ${file} (extra - not used)`);
  }
});

console.log('\n=====================================');
console.log(`${colors.green}✅ Renaming complete!${colors.reset}\n`);
console.log('Renamed files saved to:');
console.log(`  ${outputBase}\n`);
console.log('Next steps:');
console.log(`  1. Review the renamed files`);
console.log(`  2. Copy them to your project:`);
console.log(`     ${colors.cyan}cp ${outputBase}/hero-impression.* public/${colors.reset}`);
console.log(`     ${colors.cyan}cp ${galleryFolder}/* public/gallery/${colors.reset}`);
console.log(`     ${colors.cyan}cp ${servicesFolder}/* public/services/${colors.reset}`);
console.log(`  3. Run: ${colors.cyan}npm run dev${colors.reset} to see your gallery!\n`);
