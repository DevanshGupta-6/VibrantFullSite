"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GalleryImage } from "@/lib/types";

export default function ImageLightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: GalleryImage[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  useEffect(() => {
    if (index === null) return;
    document.body.classList.add("locked");
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && index !== null) onNavigate((index + 1) % images.length);
      if (e.key === "ArrowLeft" && index !== null) onNavigate((index - 1 + images.length) % images.length);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("locked");
    };
  }, [index, images.length, onClose, onNavigate]);

  const active = index !== null ? images[index] : null;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[400] bg-black/92 backdrop-blur-sm flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-6 right-6 w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          <button
            onClick={() => onNavigate((index! - 1 + images.length) % images.length)}
            aria-label="Previous image"
            className="absolute left-4 md:left-8 w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => onNavigate((index! + 1) % images.length)}
            aria-label="Next image"
            className="absolute right-4 md:right-8 w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
          >
            <ChevronRight size={20} />
          </button>

          <div className="relative w-full max-w-4xl max-h-[80vh] aspect-[4/3]">
            {active.src && (
              <Image
                src={active.src}
                alt={active.alt}
                fill
                sizes="90vw"
                className="object-contain"
              />
            )}
          </div>
          {active.caption && (
            <p className="absolute bottom-8 text-white/70 text-[13px]">{active.caption}</p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}