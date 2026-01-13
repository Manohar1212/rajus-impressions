#!/usr/bin/env node

/**
 * Back4App Setup Script
 * Creates all necessary classes and an admin user
 */

import Parse from 'parse/node.js';

// Configuration - using environment variables or defaults
const APP_ID = process.env.NEXT_PUBLIC_PARSE_APP_ID || 'UqKDfZOiOMHoWLJU304hzy09lPpvvIQzAeMRPf7Y';
const JS_KEY = process.env.NEXT_PUBLIC_PARSE_JS_KEY || 'ZLKK52IEVjWoP4TO3NqGvRUcVH549UDQhvNP0IoH';
const SERVER_URL = process.env.NEXT_PUBLIC_PARSE_SERVER_URL || 'https://parseapi.back4app.com';

// Initialize Parse
Parse.initialize(APP_ID, JS_KEY);
Parse.serverURL = SERVER_URL;

console.log('🚀 Starting Back4App setup...\n');

async function createAdminUser() {
  console.log('👤 Creating admin user...');

  // Check if admin user already exists
  const query = new Parse.Query(Parse.User);
  query.equalTo('username', 'admin');
  const existingUser = await query.first({ useMasterKey: false }).catch(() => null);

  if (existingUser) {
    console.log('   ✓ Admin user already exists');
    return;
  }

  const user = new Parse.User();
  user.set('username', 'admin');
  user.set('password', 'rajus@admin123'); // Change this!
  user.set('email', 'admin@rajusimpressions.com');

  try {
    await user.signUp();
    console.log('   ✓ Admin user created');
    console.log('   📧 Username: admin');
    console.log('   🔑 Password: rajus@admin123');
    console.log('   ⚠️  Please change this password after first login!');
  } catch (error) {
    if (error.code === 202) {
      console.log('   ✓ Admin user already exists');
    } else {
      console.error('   ✗ Failed to create admin user:', error.message);
    }
  }
}

async function createGalleryImages() {
  console.log('\n🖼️  Creating GalleryImage class with sample data...');

  const GalleryImage = Parse.Object.extend('GalleryImage');

  const galleryItems = [
    { title: 'Newborn Hand & Foot', category: 'Framed', imagePath: '/gallery/impression-1.jpg', featured: true, order: 0 },
    { title: 'Tiny Feet Impression', category: 'Premium', imagePath: '/gallery/impression-2.jpg', featured: false, order: 1 },
    { title: 'Baby Hand Print', category: 'Framed', imagePath: '/gallery/impression-3.jpg', featured: false, order: 2 },
    { title: 'Twin Impressions', category: 'Special', imagePath: '/gallery/impression-4.jpg', featured: false, order: 3 },
    { title: 'Family Keepsake', category: 'Premium', imagePath: '/gallery/impression-5.jpg', featured: true, order: 4 },
    { title: 'Deluxe Frame Set', category: 'Premium', imagePath: '/gallery/impression-6.jpg', featured: false, order: 5 },
    { title: 'First Month Memories', category: 'Special', imagePath: '/gallery/impression-7.jpg', featured: false, order: 6 },
    { title: 'Sibling Impressions', category: 'Framed', imagePath: '/gallery/impression-8.jpg', featured: true, order: 7 },
    { title: 'Golden Frame Edition', category: 'Premium', imagePath: '/gallery/impression-9.jpg', featured: false, order: 8 },
    { title: '3D Clay Impression', category: 'Special', imagePath: '/gallery/impression-10.jpg', featured: false, order: 9 },
    { title: 'Heart Shape Frame', category: 'Framed', imagePath: '/gallery/impression-11.jpg', featured: false, order: 10 },
    { title: 'Wall Display Set', category: 'Premium', imagePath: '/gallery/impression-12.jpg', featured: false, order: 11 },
  ];

  let created = 0;
  for (const item of galleryItems) {
    const image = new GalleryImage();
    image.set('title', item.title);
    image.set('category', item.category);
    image.set('imagePath', item.imagePath);
    image.set('featured', item.featured);
    image.set('order', item.order);

    try {
      await image.save();
      created++;
    } catch (error) {
      console.error(`   ✗ Failed to create "${item.title}":`, error.message);
    }
  }

  console.log(`   ✓ Created ${created} gallery images`);
}

async function createServices() {
  console.log('\n📋 Creating Service class with sample data...');

  const Service = Parse.Object.extend('Service');

  const services = [
    { title: 'Hand Impressions', description: 'Beautiful hand impressions of your little one', imagePath: '/services/hand-impression.jpg', order: 0, active: true },
    { title: 'Foot Impressions', description: 'Capture those tiny feet forever', imagePath: '/services/foot-impression.jpg', order: 1, active: true },
    { title: 'Framed Keepsakes', description: 'Premium framed impressions for your home', imagePath: '/services/framed-keepsake.jpg', order: 2, active: true },
  ];

  let created = 0;
  for (const item of services) {
    const service = new Service();
    service.set('title', item.title);
    service.set('description', item.description);
    service.set('imagePath', item.imagePath);
    service.set('order', item.order);
    service.set('active', item.active);

    try {
      await service.save();
      created++;
    } catch (error) {
      console.error(`   ✗ Failed to create "${item.title}":`, error.message);
    }
  }

  console.log(`   ✓ Created ${created} services`);
}

async function createTestimonials() {
  console.log('\n⭐ Creating Testimonial class with sample data...');

  const Testimonial = Parse.Object.extend('Testimonial');

  const testimonials = [
    {
      name: 'Priya & Rajesh',
      location: 'Kakinada',
      message: 'The impression turned out absolutely beautiful. A perfect keepsake of our little one!',
      rating: 5,
      active: true,
      order: 0
    },
    {
      name: 'Lakshmi',
      location: 'Rajahmundry',
      message: "Raju's work is incredible. The attention to detail and care shown was exceptional.",
      rating: 5,
      active: true,
      order: 1
    },
    {
      name: 'Sravani & Kiran',
      location: 'Visakhapatnam',
      message: 'We ordered for our twins and the result exceeded our expectations. Highly recommend!',
      rating: 5,
      active: true,
      order: 2
    },
  ];

  let created = 0;
  for (const item of testimonials) {
    const testimonial = new Testimonial();
    testimonial.set('name', item.name);
    testimonial.set('location', item.location);
    testimonial.set('message', item.message);
    testimonial.set('rating', item.rating);
    testimonial.set('active', item.active);
    testimonial.set('order', item.order);

    try {
      await testimonial.save();
      created++;
    } catch (error) {
      console.error(`   ✗ Failed to create testimonial from "${item.name}":`, error.message);
    }
  }

  console.log(`   ✓ Created ${created} testimonials`);
}

async function createInquiryClass() {
  console.log('\n📬 Creating Inquiry class...');

  const Inquiry = Parse.Object.extend('Inquiry');

  // Create a sample enquiry to establish the class schema
  const inquiry = new Inquiry();
  inquiry.set('name', 'Sample Enquiry');
  inquiry.set('phone', '9876543210');
  inquiry.set('email', 'sample@example.com');
  inquiry.set('message', 'This is a sample enquiry to set up the class schema.');
  inquiry.set('service', 'Hand Impressions');
  inquiry.set('status', 'completed');
  inquiry.set('notes', 'This is a sample - you can delete this entry.');

  try {
    await inquiry.save();
    console.log('   ✓ Inquiry class created with sample entry');
  } catch (error) {
    console.error('   ✗ Failed to create Inquiry class:', error.message);
  }
}

async function main() {
  try {
    await createAdminUser();
    await createGalleryImages();
    await createServices();
    await createTestimonials();
    await createInquiryClass();

    console.log('\n✅ Back4App setup completed successfully!\n');
    console.log('📌 Next steps:');
    console.log('   1. Visit http://localhost:3000/admin');
    console.log('   2. Login with username: admin, password: rajus@admin123');
    console.log('   3. Change your password in Back4App dashboard');
    console.log('   4. Start managing your content!\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

main();
