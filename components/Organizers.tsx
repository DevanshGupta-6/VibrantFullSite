"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/siteConfig";

export default function Organizers() {
  return (
    <section className="py-24 sm:py-28 md:py-36 text-center">
      <div className="container-content">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 0.84, 0.44, 1] }}
        >
          <p className="text-[12px] font-semibold tracking-[0.28em] uppercase text-ink-500 mb-6">
            Presented By
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-14 mb-14 md:mb-16">
            {/* Vibeesta */}
            <div className="flex flex-col items-center gap-4 max-w-[200px] sm:max-w-[220px]">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border border-vibeesta-400/30">
                <Image
                  src={siteConfig.organizers.vibeesta.logoMark}
                  alt="Vibeesta Creative Society"
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="font-display font-bold text-sm tracking-[0.06em] text-ink-0">
                {siteConfig.organizers.vibeesta.name.toUpperCase()}
              </div>
              <p className="text-[12px] sm:text-[12.5px] text-ink-500">{siteConfig.organizers.vibeesta.description}</p>
            </div>

            {/* Divider */}
            <span className="font-display text-xl text-ink-700 self-center">×</span>

            {/* Shrinik */}
            <div className="flex flex-col items-center gap-4 max-w-[200px] sm:max-w-[220px]">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border border-shrinik-600/30">
                <Image
                  src={siteConfig.organizers.shrinik.logo}
                  alt="Shrinik Club"
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="font-display font-bold text-sm tracking-[0.06em] text-ink-0">
                {siteConfig.organizers.shrinik.name.toUpperCase()}
              </div>
              <p className="text-[12px] sm:text-[12.5px] text-ink-500">{siteConfig.organizers.shrinik.description}</p>
            </div>
          </div>

          <div className="pt-10 md:pt-12 border-t border-ink-700/20">
            <p className="text-[10.5px] font-semibold tracking-[0.24em] uppercase text-ink-500 mb-3">
              Hosted At
            </p>
            <div className="font-display text-xl sm:text-2xl md:text-3xl text-ink-0">{siteConfig.venue}</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}