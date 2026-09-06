"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Atmosphere from "@/components/Atmosphere";
import OrbitRing from "@/components/OrbitRing";
import { siteConfig } from "@/config/siteConfig";

export default function About() {
  return (
    <section id="about" className="py-24 sm:py-28 md:py-40 relative overflow-hidden">
      <Atmosphere variant="fusion" className="opacity-30" />
      <OrbitRing
        size={480}
        color="neutral"
        className="absolute right-[-10%] top-[-10%] pointer-events-none hidden lg:block"
      />

      <div className="container-content relative grid md:grid-cols-12 gap-12 md:gap-8 items-start">
        {/* Heading — left column */}
        <motion.div
          className="md:col-span-7"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 0.84, 0.44, 1] }}
        >
          <p className="micro-label mb-5">{siteConfig.brandStory}</p>
          <h2 className="text-[11vw] sm:text-6xl md:text-7xl xl:text-8xl leading-[1.0]">
            TWO WORLDS.
            <br />
            ONE <span className="accent-rule">VIBRANT</span>
            <br />
            EXPERIENCE.
          </h2>
          <p className="mt-8 md:mt-9 max-w-md text-[14px] sm:text-[15px] leading-relaxed text-ink-300">
            VIBRANT 2K26 brings technology, innovation, creativity, music,
            film, fashion, performing arts and ideas together on one stage —
            two days, two identities, one festival.
          </p>
        </motion.div>

        {/* Brand diagram — offset right column */}
        <motion.div
          className="md:col-span-5 md:pt-16 flex flex-col items-start md:items-end gap-0"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 0.84, 0.44, 1] }}
        >
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-vibeesta-400/30">
              <Image
                src={siteConfig.organizers.vibeesta.logoMark}
                alt="Vibeesta Creative Society"
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <span className="font-display font-semibold text-xs tracking-[0.1em] text-vibeesta-300">
              VIBEESTA
            </span>
          </div>

          <span className="font-display text-lg text-ink-700 my-2 ml-6">+</span>

          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-shrinik-600/30">
              <Image
                src={siteConfig.organizers.shrinik.logo}
                alt="Shrinik Club"
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <span className="font-display font-semibold text-xs tracking-[0.1em] text-shrinik-600">
              SHRINIK
            </span>
          </div>

          <span className="thin-rule w-16 my-6 ml-6 text-ink-500" />

          <div className="pl-6 md:pl-0">
            <div className="font-display font-bold text-2xl md:text-3xl text-ink-0">
              VIBRANT 2K26
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}