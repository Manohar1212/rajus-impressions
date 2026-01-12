// Use browser-specific Parse import
const Parse = typeof window !== 'undefined'
  ? require('parse/dist/parse.min.js')
  : require('parse/node');

// Back4App configuration
const PARSE_CONFIG = {
  appId: 'UqKDfZOiOMHoWLJU304hzy09lPpvvIQzAeMRPf7Y',
  jsKey: 'ZLKK52IEVjWoP4TO3NqGvRUcVH549UDQhvNP0IoH',
  serverURL: 'https://parseapi.back4app.com',
};

// Initialize Parse
const initializeParse = () => {
  if (!Parse.applicationId) {
    Parse.initialize(PARSE_CONFIG.appId, PARSE_CONFIG.jsKey);
    Parse.serverURL = PARSE_CONFIG.serverURL;
  }
};

// Initialize immediately
initializeParse();

export { Parse, initializeParse };

// Type definitions for our Parse classes
export interface GalleryImageData {
  id?: string;
  title: string;
  category: string;
  imagePath: string;
  imageFile?: Parse.File;
  featured: boolean;
  order: number;
}

export interface ServiceData {
  id?: string;
  title: string;
  description?: string;
  imagePath: string;
  imageFile?: Parse.File;
  order: number;
  active: boolean;
}

export interface TestimonialData {
  id?: string;
  name: string;
  location: string;
  message: string;
  rating: number;
  active: boolean;
  order: number;
}

export interface InquiryData {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  service?: string;
  status: 'new' | 'contacted' | 'booked' | 'completed';
  notes?: string;
  createdAt?: Date;
}

// Helper functions for Parse operations
export const parseHelpers = {
  // Gallery operations
  async getGalleryImages(): Promise<GalleryImageData[]> {
    initializeParse();
    const query = new Parse.Query('GalleryImage');
    query.ascending('order');
    const results = await query.find();
    return results.map((item) => ({
      id: item.id,
      title: item.get('title'),
      category: item.get('category'),
      imagePath: item.get('imagePath') || item.get('imageFile')?.url(),
      featured: item.get('featured') || false,
      order: item.get('order') || 0,
    }));
  },

  async saveGalleryImage(data: GalleryImageData): Promise<string> {
    initializeParse();
    const GalleryImage = Parse.Object.extend('GalleryImage');
    const image = data.id ? new GalleryImage({ id: data.id }) : new GalleryImage();

    image.set('title', data.title);
    image.set('category', data.category);
    image.set('imagePath', data.imagePath);
    image.set('featured', data.featured);
    image.set('order', data.order);

    const result = await image.save();
    return result.id;
  },

  async deleteGalleryImage(id: string): Promise<void> {
    initializeParse();
    const GalleryImage = Parse.Object.extend('GalleryImage');
    const image = new GalleryImage({ id });
    await image.destroy();
  },

  // Services operations
  async getServices(): Promise<ServiceData[]> {
    initializeParse();
    const query = new Parse.Query('Service');
    query.ascending('order');
    const results = await query.find();
    return results.map((item) => ({
      id: item.id,
      title: item.get('title'),
      description: item.get('description'),
      imagePath: item.get('imagePath') || item.get('imageFile')?.url(),
      order: item.get('order') || 0,
      active: item.get('active') !== false,
    }));
  },

  async saveService(data: ServiceData): Promise<string> {
    initializeParse();
    const Service = Parse.Object.extend('Service');
    const service = data.id ? new Service({ id: data.id }) : new Service();

    service.set('title', data.title);
    service.set('description', data.description);
    service.set('imagePath', data.imagePath);
    service.set('order', data.order);
    service.set('active', data.active);

    const result = await service.save();
    return result.id;
  },

  // Testimonials operations
  async getTestimonials(): Promise<TestimonialData[]> {
    initializeParse();
    const query = new Parse.Query('Testimonial');
    query.ascending('order');
    const results = await query.find();
    return results.map((item) => ({
      id: item.id,
      name: item.get('name'),
      location: item.get('location'),
      message: item.get('message'),
      rating: item.get('rating') || 5,
      active: item.get('active') !== false,
      order: item.get('order') || 0,
    }));
  },

  async saveTestimonial(data: TestimonialData): Promise<string> {
    initializeParse();
    const Testimonial = Parse.Object.extend('Testimonial');
    const testimonial = data.id ? new Testimonial({ id: data.id }) : new Testimonial();

    testimonial.set('name', data.name);
    testimonial.set('location', data.location);
    testimonial.set('message', data.message);
    testimonial.set('rating', data.rating);
    testimonial.set('active', data.active);
    testimonial.set('order', data.order);

    const result = await testimonial.save();
    return result.id;
  },

  async deleteTestimonial(id: string): Promise<void> {
    initializeParse();
    const Testimonial = Parse.Object.extend('Testimonial');
    const testimonial = new Testimonial({ id });
    await testimonial.destroy();
  },

  // Inquiries operations
  async getInquiries(): Promise<InquiryData[]> {
    initializeParse();
    const query = new Parse.Query('Inquiry');
    query.descending('createdAt');
    const results = await query.find();
    return results.map((item) => ({
      id: item.id,
      name: item.get('name'),
      phone: item.get('phone'),
      email: item.get('email'),
      message: item.get('message'),
      service: item.get('service'),
      status: item.get('status') || 'new',
      notes: item.get('notes'),
      createdAt: item.get('createdAt'),
    }));
  },

  async updateInquiryStatus(id: string, status: string, notes?: string): Promise<void> {
    initializeParse();
    const Inquiry = Parse.Object.extend('Inquiry');
    const inquiry = new Inquiry({ id });
    inquiry.set('status', status);
    if (notes !== undefined) {
      inquiry.set('notes', notes);
    }
    await inquiry.save();
  },

  async createInquiry(data: Omit<InquiryData, 'id' | 'createdAt'>): Promise<string> {
    initializeParse();
    const Inquiry = Parse.Object.extend('Inquiry');
    const inquiry = new Inquiry();

    inquiry.set('name', data.name);
    inquiry.set('phone', data.phone);
    inquiry.set('email', data.email);
    inquiry.set('message', data.message);
    inquiry.set('service', data.service);
    inquiry.set('status', 'new');

    const result = await inquiry.save();
    return result.id;
  },

  // File upload
  async uploadFile(file: File, filename: string): Promise<string> {
    initializeParse();
    const parseFile = new Parse.File(filename, file);
    await parseFile.save();
    const url = parseFile.url();
    if (!url) throw new Error('Failed to get uploaded file URL');
    return url;
  },

  // Auth operations
  async login(username: string, password: string): Promise<Parse.User> {
    initializeParse();
    return Parse.User.logIn(username, password);
  },

  async logout(): Promise<void> {
    initializeParse();
    await Parse.User.logOut();
  },

  getCurrentUser(): Parse.User | null {
    initializeParse();
    return Parse.User.current() || null;
  },

  async isAuthenticated(): Promise<boolean> {
    initializeParse();
    const user = Parse.User.current();
    if (!user) return false;

    try {
      await user.fetch();
      return true;
    } catch {
      return false;
    }
  },
};
