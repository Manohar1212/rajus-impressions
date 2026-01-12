/**
 * Social Media Configuration
 *
 * UPDATE YOUR SOCIAL MEDIA HANDLES HERE
 * All social media links across the website will use these values
 */

export const socialMedia = {
  // Instagram
  instagram: {
    username: "rajus_impressions",
    url: "https://www.instagram.com/rajus_impressions",
    displayName: "@rajus_impressions",
  },

  // Facebook
  facebook: {
    username: "rajus.impressions",
    url: "https://www.facebook.com/rajus.impressions",
    displayName: "rajus.impressions",
  },

  // WhatsApp (already configured)
  whatsapp: {
    phone: "+919246699839",
    url: "https://wa.me/919246699839",
    displayNumber: "+91 92466 99839",
  },

  // Phone (already configured)
  phone: {
    number: "+919246699839",
    url: "tel:+919246699839",
    displayNumber: "+91 92466 99839",
  },

  // Google Maps & Reviews
  google: {
    mapsUrl: "https://www.google.com/maps/place/Raju's+impressions/@16.96459,82.2223536,17z/data=!4m14!1m7!3m6!1s0x3a3829a1b758add7:0x89d98b189ae06c56!2sRaju's+impressions!8m2!3d16.96459!4d82.2249285!16s%2Fg%2F11r21vl9qs!3m5!1s0x3a3829a1b758add7:0x89d98b189ae06c56!8m2!3d16.96459!4d82.2249285!16s%2Fg%2F11r21vl9qs?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D",
    reviewsUrl: "https://www.google.com/maps/place/Raju's+impressions/@16.96459,82.2223536,17z/data=!4m14!1m5!8m4!1e2!2s117035476350201717718!3m1!1e1!3m7!1s0x3a3829a1b758add7:0x89d98b189ae06c56!8m2!3d16.96459!4d82.2249285!9m1!1b1!16s%2Fg%2F11r21vl9qs?hl=en&entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D",
    location: "Kakinada, India",
  },
} as const;

// Helper function to get all social media links as an array
export const getSocialMediaLinks = () => [
  {
    name: "Instagram",
    icon: "instagram",
    url: socialMedia.instagram.url,
    handle: socialMedia.instagram.displayName,
    color: "#E4405F",
  },
  {
    name: "Facebook",
    icon: "facebook",
    url: socialMedia.facebook.url,
    handle: socialMedia.facebook.displayName,
    color: "#1877F2",
  },
];
