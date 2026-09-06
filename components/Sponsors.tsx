"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sponsor } from "@/lib/types";

export default function Sponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    fetch("/api/public/sponsors").then((response) => response.ok ? response.json() : Promise.reject(new Error("Unable to load sponsors.")))
      .then((data) => {
        if (isCurrent) {
          setSponsors(data);
          setError(null);
        }
      })
      .catch((fetchError: unknown) => {
        if (isCurrent) {
          setError(fetchError instanceof Error ? fetchError.message : "Unable to load sponsors.");
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const hasSponsors = sponsors.length > 0;

  return (
    <section id="sponsors" className="py-24 sm:py-28 md:py-36">
      <div className="container-content text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 0.84, 0.44, 1] }}
        >
          <p className="text-[12px] font-semibold tracking-[0.28em] uppercase text-ink-500 mb-4">
            Backed By
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-12 md:mb-14">
            POWERED BY THOSE
            <br />
            WHO BELIEVE IN <span className="accent-rule">IDEAS.</span>
          </h2>
        </motion.div>

        {isLoading ? (
          <p className="py-12 text-center micro-label">Loading sponsors...</p>
        ) : error ? (
          <p className="py-12 text-center text-red-700">Unable to load sponsors: {error}</p>
        ) : hasSponsors ? (
          sponsorTierOrder.map((tier) => {
            const tierSponsors = sponsors.filter((s) => s.tier === tier);
            if (tierSponsors.length === 0) return null;
            return (
              <div key={tier} className="mb-12">
                <p className="text-[10.5px] font-semibold tracking-[0.24em] uppercase text-ink-500 mb-6">
                  {tier}
                </p>
                <div className="flex flex-wrap justify-center gap-5 sm:gap-7 md:gap-8">
                  {tierSponsors.map((s) => (
                    <div
                      key={s.id}
                      className="relative w-28 sm:w-32 h-12 sm:h-14 grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                    >
                      {s.logo ? (
                        <Image src={s.logo} alt={s.name} fill sizes="128px" className="object-contain" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[11px] text-ink-500 border border-ink-700/25 bg-ink-700/10 rounded-sm">
                          {s.name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="border border-ink-700/20 bg-ink-700/5 rounded-sm py-12 px-8 max-w-sm mx-auto">
            <p className="micro-label text-center">
              Sponsor announcements coming soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}