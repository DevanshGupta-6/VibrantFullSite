/**
 * CENTRAL SITE CONFIGURATION
 * Organizers: edit this file to update the information that appears
 * across the entire website. Nothing in /components needs to change
 * for routine content updates.
 */

export const siteConfig = {
  eventName: "VIBRANT 2K26",
  tagline: "INNOVATE. IMPACT. IDEAS.",
  brandStory: "TWO WORLDS. ONE VIBE.",

  eventDateLabel: "16 & 17 October 2026",
  // ISO start/end used by the live countdown. Update once the exact
  // reporting time is confirmed by the organizing committee.
  eventStart: "2026-10-16T09:00:00+05:30",
  eventEnd: "2026-10-17T22:00:00+05:30",

  venue: "G.L. Bajaj Institute of Technology & Management",

  prizePool: "₹4,00,000+",
  prizePoolSupport: "Worth of prizes & rewards",

  // Replace with the live external registration link when available.
  // Every "Register Now" CTA across the site reads from this single value.
  registrationUrl: "", // e.g. "https://forms.gle/xxxxxxxx"
  registrationFallbackLabel: "Registration Opening Soon",

  organizers: {
    vibeesta: {
      name: "Vibeesta Creative Society",
      short: "VIBEESTA",
      description: "Driving the creative & cultural programming of VIBRANT 2K26.",
      color: "vibeesta",
      logoMark: "/logos/vibeesta-mark.png",
      logoWordmark: "/logos/vibeesta-mark.png",
    },
    shrinik: {
      name: "Shrinik Club",
      short: "SHRINIK",
      description: "Driving the technology & innovation programming of VIBRANT 2K26.",
      color: "shrinik",
      logo: "/logos/shrinik.png",
    },
  },

  contact: {
    email: null as string | null, // "hello@vibrant2k26.in"
    phone: null as string | null,
    instagram: null as string | null, // full URL
    linkedin: null as string | null,
    location: "G.L. Bajaj Institute of Technology & Management, Greater Noida",
    coordinators: null as string | null,
  },

  socialLinks: {
    instagram: null as string | null,
    linkedin: null as string | null,
    youtube: null as string | null,
  },

  seo: {
    title: "VIBRANT 2K26 | G.L. Bajaj Tech & Cultural Fest",
    description:
      "VIBRANT 2K26 — a two-day Tech & Cultural Fest bringing innovation, creativity, competition and performance together at G.L. Bajaj Institute of Technology & Management on 16–17 October 2026.",
    galleryTitle: "Gallery | VIBRANT 2K26",
    galleryDescription:
      "Photographs from VIBRANT 2K26 — hackathon nights, performances, fashion, music and behind-the-scenes moments from the fest.",
  },
};

export type SiteConfig = typeof siteConfig;

/** Helper: returns the registration URL, or null if not yet configured. */
export function getRegistrationUrl(): string | null {
  return siteConfig.registrationUrl?.trim() ? siteConfig.registrationUrl : null;
}