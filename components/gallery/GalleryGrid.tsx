"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import GalleryFilters from "@/components/gallery/GalleryFilters";
import ImageLightbox from "@/components/gallery/ImageLightbox";
import { GalleryImage } from "@/lib/types";

const ASPECT_CLASS: Record<GalleryImage["aspectRatio"], string> = {
  portrait: "aspect-[4/5]", landscape: "aspect-[3/2]", square: "aspect-square", wide: "aspect-[16/9]",
};

export default function GalleryGrid({ galleryImages }: { galleryImages: GalleryImage[] }) {
  const [filter, setFilter] = useState<GalleryImage["category"] | "all">("all");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const filtered = useMemo(() => filter === "all" ? galleryImages : galleryImages.filter((g) => g.category === filter), [galleryImages, filter]);

  if (galleryImages.length === 0) return <div className="text-center py-24"><p className="text-ink-500 text-sm font-medium tracking-[0.08em] uppercase">Gallery Coming Soon</p><p className="text-ink-700 text-[13px] mt-3 max-w-sm mx-auto">Photographs from VIBRANT 2K26 will appear here once the fest begins.</p></div>;
  return <div><div className="mb-12"><GalleryFilters active={filter} onChange={setFilter} /></div><div className="columns-1 sm:columns-2 lg:columns-3 gap-3.5 [column-fill:_balance]">
    {filtered.map((img, i) => <button key={img.id} onClick={() => setActiveIndex(i)} className={`relative w-full mb-3.5 break-inside-avoid overflow-hidden border border-ink-700/20 block ${ASPECT_CLASS[img.aspectRatio]}`}>
      {img.src ? <Image src={img.src} alt={img.alt} fill loading="lazy" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 hover:scale-[1.03]" /> : <div className="w-full h-full flex items-center justify-center bg-base-850 text-ink-700 text-[11px] tracking-[0.1em] uppercase">{img.alt}</div>}
    </button>)}
  </div><ImageLightbox images={filtered} index={activeIndex} onClose={() => setActiveIndex(null)} onNavigate={setActiveIndex} /></div>;
}
