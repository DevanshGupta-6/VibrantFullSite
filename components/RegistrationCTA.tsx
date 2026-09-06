"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import Atmosphere from "@/components/Atmosphere";
import { siteConfig } from "@/config/siteConfig"

export default function RegistrationCTA() {
  const [registrationUrl, setRegistrationUrl] = useState("");
  useEffect(() => { fetch("/api/public/settings").then((r) => r.ok ? r.json() : null).then((d) => setRegistrationUrl(d?.registrationUrl || "")).catch(() => undefined); }, []);

  return (
    <section id="register" className="py-24 sm:py-28 md:py-40 text-center relative overflow-hidden">
      <Atmosphere variant="fusion" fog />

      <motion.div
        className="container-content relative"
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 0.84, 0.44, 1] }}
      >
        <h2 className="text-[9vw] sm:text-5xl md:text-6xl leading-[1.02] text-ink-0">
          READY TO MAKE
          <br />
          IT <span className="accent-rule">VIBRANT?</span>
        </h2>
        <p className="mt-5 mb-9 sm:mb-10 text-ink-300 text-[14px] sm:text-[15px] max-w-xs sm:max-w-none mx-auto">
          Your ideas. Your talent. Your moment.
        </p>
        {registrationUrl ? (
          <a
            href={registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary btn-lg inline-flex"
          >
            Register Now <ArrowRight size={17} />
          </a>
        ) : (
          <span className="btn-ghost btn-lg inline-flex">
            Registration Opening Soon
          </span>
        )}
        <p className="mt-8 text-[11.5px] sm:text-[12.5px] font-semibold tracking-[0.28em] uppercase text-ink-500">
          {siteConfig.eventDateLabel}
        </p>
      </motion.div>
    </section>
  );
}