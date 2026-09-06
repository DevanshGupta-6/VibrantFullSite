"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/siteConfig";

function getRemaining() {
  const now = new Date().getTime();
  const start = new Date(siteConfig.eventStart).getTime();
  const end = new Date(siteConfig.eventEnd).getTime();

  if (now < start) {
    const diff = start - now;
    return {
      status: "upcoming" as const,
      days: Math.floor(diff / 86400000),
      hours: Math.floor(diff / 3600000) % 24,
      minutes: Math.floor(diff / 60000) % 60,
      seconds: Math.floor(diff / 1000) % 60,
    };
  }
  if (now <= end) return { status: "live" as const };
  return { status: "ended" as const };
}

export default function Countdown() {
  const [remaining, setRemaining] = useState<ReturnType<typeof getRemaining> | null>(null);

  useEffect(() => {
    setRemaining(getRemaining());
    const id = setInterval(() => setRemaining(getRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!remaining) return <section className="py-10 border-t border-ink-700/15" aria-hidden="true" />;

  if (remaining.status === "live") {
    return (
      <section className="py-16 md:py-20 text-center border-t border-ink-700/15">
        <div className="fusion-text font-display font-extrabold text-3xl md:text-5xl">
          VIBRANT 2K26 IS LIVE
        </div>
      </section>
    );
  }

  if (remaining.status === "ended") {
    return (
      <section className="py-16 md:py-20 text-center border-t border-ink-700/15">
        <div className="fusion-text font-display font-extrabold text-2xl md:text-4xl">
          THANK YOU FOR BEING PART OF VIBRANT 2K26
        </div>
      </section>
    );
  }

  const units = [
    { label: "Days", value: remaining.days },
    { label: "Hours", value: remaining.hours },
    { label: "Min", value: remaining.minutes },
    { label: "Sec", value: remaining.seconds },
  ];

  return (
    <section className="pb-20 md:pb-24 pt-12 md:pt-16 text-center border-t border-ink-700/15">
      <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-ink-500 mb-8">
        Vibrant Begins In
      </p>
      <div className="flex items-baseline justify-center gap-0 flex-wrap">
        {units.map((u, i) => (
          <div key={u.label} className="flex items-baseline">
            <div className="flex flex-col items-center px-4 sm:px-5 md:px-7">
              {/* min-w prevents layout shift as digits change */}
              <span className="font-display font-extrabold tabular-nums text-5xl sm:text-6xl md:text-7xl text-ink-0 min-w-[2ch] text-center">
                {String(u.value).padStart(2, "0")}
              </span>
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-ink-500 mt-2">
                {u.label}
              </span>
            </div>
            {i < units.length - 1 && (
              <span className="font-display text-xl sm:text-2xl md:text-3xl text-ink-700 -translate-y-3 select-none">
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}