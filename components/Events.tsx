"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import EventToggle from "@/components/EventToggle";
import EventCard from "@/components/EventCard";
import EventSheet from "@/components/EventSheet";
import { EventCategory, FestEvent } from "@/lib/types";

export default function Events() {
  const [mode, setMode] = useState<EventCategory>("creative");
  const [selected, setSelected] = useState<FestEvent | null>(null);
  const [events, setEvents] = useState<FestEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    fetch("/api/public/events").then((response) => response.ok ? response.json() : Promise.reject(new Error("Unable to load events.")))
      .then((data) => {
        if (isCurrent) {
          setEvents(data);
          setError(null);
        }
      })
      .catch((fetchError: unknown) => {
        if (isCurrent) {
          setError(fetchError instanceof Error ? fetchError.message : "Unable to load events.");
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

  const filtered = useMemo(() => events.filter((e) => e.category === mode), [events, mode]);

  return (
    <section id="events" className="py-24 sm:py-28 md:py-40 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-700"
        style={{
          background:
            mode === "tech"
              ? "radial-gradient(ellipse 50% 40% at 85% 5%, rgba(109,40,217,0.04), transparent 70%)"
              : "radial-gradient(ellipse 50% 40% at 85% 5%, rgba(159,18,57,0.04), transparent 70%)",
        }}
      />
      <div className="container-content relative">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.16, 0.84, 0.44, 1] }}
          >
            <p className="micro-label mb-4">The Line-Up</p>
            <h2 className="text-[11vw] sm:text-5xl md:text-6xl leading-[0.95]">
              CHOOSE
              <br />
              YOUR
              <br />
              ARENA.
            </h2>
          </motion.div>

          {/* Toggle — centered on mobile, right-aligned on md+ */}
          <motion.div
            className="flex justify-center md:justify-end"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 0.84, 0.44, 1] }}
          >
            <EventToggle mode={mode} onChange={setMode} />
          </motion.div>
        </div>

        {/* Event grid */}
        {isLoading ? (
          <p className="py-12 text-center micro-label">Loading events...</p>
        ) : error ? (
          <p className="py-12 text-center text-red-700">Unable to load events: {error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ink-700/12 border border-ink-700/12">
            {filtered.map((event, i) => (
              <div key={event.id} className={`h-full ${i === 0 ? "sm:col-span-2 lg:col-span-2" : ""}`}>
                <EventCard event={event} onOpen={setSelected} featured={i === 0} />
              </div>
            ))}
          </div>
        )}
      </div>

      <EventSheet event={selected} onClose={() => setSelected(null)} />
    </section>
  );
}