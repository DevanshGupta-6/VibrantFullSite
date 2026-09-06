export type EventCategory = "tech" | "creative";

export interface FestEvent {
  id: string;
  number: string; // "01", "02" ... used as the large editorial index
  name: string;
  category: EventCategory;
  tagline: string; // short poster-style line, e.g. "BUILD. BREAK. INNOVATE."
  description: string | null;
  date: string | null;
  time: string | null;
  venue: string | null;
  teamSize: string | null;
  eligibility: string | null;
  rules: string[] | null;
  prize: string | null;
  fee: string | null;
  coordinators: string | null;
  contact: string | null;
  image: string | null;
}

export interface ScheduleItem {
  time: string;
  title: string;
  note?: string | null;
}

export interface ScheduleDay {
  day: number;
  dateLabel: string; // "16 October"
  items: ScheduleItem[] | null; // null => "Schedule Coming Soon"
}

export type SponsorTier =
  | "Title Sponsor"
  | "Powered By"
  | "Co-Sponsors"
  | "Partners";

export interface Sponsor {
  id: string;
  name: string;
  tier: SponsorTier;
  logo: string | null; // path in /public/sponsors, null => text placeholder
}

export interface FaqItem {
  question: string;
  answer: string | null; // null => "Coming Soon"
}

export type GalleryCategory = "tech" | "cultural" | "performances" | "bts";

export interface GalleryImage {
  id: string;
  src: string | null; // path in /public/gallery, null => placeholder tile
  alt: string;
  category: GalleryCategory;
  caption: string | null;
  aspectRatio: "portrait" | "landscape" | "square" | "wide";
}