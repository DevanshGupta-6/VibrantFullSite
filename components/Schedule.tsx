"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ScheduleDay } from "@/lib/types";

export default function Schedule() {
  const [schedule, setSchedule] = useState<ScheduleDay[]>([]);
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const day = schedule.find((d) => d.day === activeDay);

  useEffect(() => {
    let isCurrent = true;

    fetch("/api/public/schedule").then((response) => response.ok ? response.json() : Promise.reject(new Error("Unable to load schedule.")))
      .then((data) => {
        if (isCurrent) {
          setSchedule(data);
          setActiveDay(data[0]?.day ?? null);
          setError(null);
        }
      })
      .catch((fetchError: unknown) => {
        if (isCurrent) {
          setError(fetchError instanceof Error ? fetchError.message : "Unable to load schedule.");
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

  return (
    <section id="schedule" className="py-24 sm:py-28 md:py-36">
      <div className="container-content">
        <motion.div
          className="text-center mb-12 md:mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 0.84, 0.44, 1] }}
        >
          <p className="text-[12px] font-semibold tracking-[0.28em] uppercase text-ink-500 mb-4">
            Two Days
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl">
            THE <span className="accent-rule">TIMELINE.</span>
          </h2>
        </motion.div>

        {isLoading ? (
          <p className="py-12 text-center micro-label">Loading schedule...</p>
        ) : error ? (
          <p className="py-12 text-center text-red-700">Unable to load schedule: {error}</p>
        ) : (
          <div>
            {/* Day toggle — horizontally scrollable if more days are added */}
            <div className="flex justify-center mb-12 md:mb-14 overflow-x-auto pb-2">
              <div className="flex gap-2">
                {schedule.map((d) => (
                  <button
                    key={d.day}
                    onClick={() => setActiveDay(d.day)}
                    className={`px-6 sm:px-7 py-3 text-[12px] sm:text-[12.5px] font-semibold tracking-[0.1em] uppercase border transition-colors rounded-sm whitespace-nowrap ${
                      activeDay === d.day
                        ? "border-vibeesta-400/60 text-ink-0 bg-vibeesta-600/15"
                        : "border-ink-700/30 text-ink-500 hover:text-ink-300 hover:bg-ink-700/10"
                    }`}
                  >
                    {d.dateLabel}
                  </button>
                ))}
              </div>
            </div>

            {day?.items && day.items.length > 0 ? (
              <div className="flex md:flex-row flex-col gap-0 md:overflow-x-auto scrollbar-hide pb-4">
                {day.items.map((item, i) => (
                  <div
                    key={i}
                    className="relative md:min-w-[210px] md:px-6 pl-9 pb-10 md:pb-0 border-l md:border-l md:border-t-0 border-ink-700/25 first:border-l-0 md:first:pl-0"
                  >
                    <span className="absolute md:top-0 top-1.5 -left-[6px] w-3 h-3 rounded-full bg-vibeesta-400 ring-2 ring-base-950" />
                    <div className="font-display font-bold text-lg text-ink-0 mb-1">{item.time}</div>
                    <div className="text-[13.5px] font-semibold text-ink-0 leading-snug">{item.title}</div>
                    {item.note && (
                      <div className="text-[12px] text-ink-500 mt-1 leading-normal">{item.note}</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-ink-500 text-sm font-medium tracking-[0.08em] uppercase py-8">
                Schedule Coming Soon
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}