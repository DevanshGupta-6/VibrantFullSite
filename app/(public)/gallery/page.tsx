import type { Metadata } from "next";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import { siteConfig } from "@/config/siteConfig";
import { listPublicGallery } from "@/lib/services/gallery";

export const metadata: Metadata = { title: siteConfig.seo.galleryTitle, description: siteConfig.seo.galleryDescription, openGraph: { title: siteConfig.seo.galleryTitle, description: siteConfig.seo.galleryDescription, type: "website" } };

export default async function GalleryPage() {
  const galleryImages = await listPublicGallery();
  return <main id="main" className="pt-36 pb-28"><div className="container-content text-center mb-16"><p className="text-[12px] font-semibold tracking-[0.28em] uppercase text-ink-500 mb-4">{siteConfig.eventName}</p><h1 className="text-5xl md:text-7xl">THE EXPERIENCE</h1></div><div className="container-content"><GalleryGrid galleryImages={galleryImages} /></div></main>;
}
