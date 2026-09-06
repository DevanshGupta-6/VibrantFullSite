"use client";

import { motion } from "framer-motion";
import Atmosphere from "@/components/Atmosphere";
import Laurel from "@/components/Laurel";
import { siteConfig } from "@/config/siteConfig";

export default function PrizePool() {
  return (
    <section className="py-24 sm:py-28 md:py-40 text-center relative overflow-hidden">
      <Atmosphere variant="fusion" className="opacity-60" />
      <motion.div
        className="container-content relative"
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 0.84, 0.44, 1] }}
      >
        <p className="micro-label mb-6 justify-center flex">The Stakes Are High</p>

        <div className="flex items-center justify-center gap-3 sm:gap-5 md:gap-8">
          {/* Laurel visible on all screens — shrinks on mobile */}
          <Laurel className="w-6 sm:w-10 md:w-14 h-auto shrink-0" />
          <div className="gold-text font-display font-black text-[13vw] sm:text-6xl md:text-7xl leading-[0.92]">
            {siteConfig.prizePool}
          </div>
          <Laurel flip className="w-6 sm:w-10 md:w-14 h-auto shrink-0" />
        </div>

        <p className="mt-6 text-[12px] sm:text-[13px] md:text-base font-semibold tracking-[0.22em] sm:tracking-[0.24em] uppercase text-ink-300">
          {siteConfig.prizePoolSupport}
        </p>
        <p className="mt-5 max-w-sm sm:max-w-md mx-auto text-[13.5px] sm:text-[14.5px] text-ink-500">
          Compete. Create. Innovate. Win big. Event-wise breakdowns will be
          published closer to the fest.
        </p>
      </motion.div>
    </section>
  );
}