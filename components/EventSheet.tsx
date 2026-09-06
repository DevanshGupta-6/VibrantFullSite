"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FestEvent } from "@/lib/types";

const COMING_SOON = "Coming Soon";

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="py-3.5 border-b border-ink-700/20 pr-4">
      <div className="text-[10px] font-semibold tracking-[0.16em] uppercase text-ink-500 mb-1.5">
        {label}
      </div>
      <div className="text-[13.5px] font-display font-semibold uppercase text-ink-0">
        {value || COMING_SOON}
      </div>
    </div>
  );
}

export default function EventSheet({
  event,
  onClose,
}: {
  event: FestEvent | null;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [registrationUrl, setRegistrationUrl] = useState("");

  useEffect(() => { fetch("/api/public/settings").then((r) => r.ok ? r.json() : null).then((d) => setRegistrationUrl(d?.registrationUrl || "")).catch(() => undefined); }, []);

  useEffect(() => {
    if (!event) return;
    document.body.classList.add("locked");
    closeRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("locked");
    };
  }, [event, onClose]);

  const isTech = event?.category === "tech";
  const accent = isTech ? "text-vibeesta-300" : "text-shrinik-600";

  return (
    <AnimatePresence>
      {event && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
          />

          {/* Sheet panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-sheet-title"
            className="fixed top-0 right-0 bottom-0 z-[301] w-full sm:w-[520px] bg-base-850 border-l border-ink-700/25 overflow-y-auto px-6 sm:px-10 pt-20 md:pt-24 flex flex-col"
            style={{
              paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))",
            }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.16, 0.84, 0.44, 1] }}
          >
            {/* Close button */}
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close event details"
              className="absolute top-5 right-5 sm:top-6 sm:right-6 w-10 h-10 rounded-full border border-ink-700/40 flex items-center justify-center text-ink-300 hover:text-ink-0 hover:border-ink-500/50 transition-colors active:scale-95"
            >
              <X size={18} />
            </button>

            {/* Content — scrollable area */}
            <div className="flex-1">
              <div className={`text-[11px] font-semibold tracking-[0.2em] uppercase mb-3 ${accent}`}>
                {isTech ? "Tech Event" : "Creative Event"} · No. {event.number}
              </div>
              <h3 id="event-sheet-title" className="text-[26px] sm:text-[30px] md:text-[36px] leading-[1.05] mb-4 sm:mb-5">
                {event.name}
              </h3>
              <p className="text-[14px] sm:text-[14.5px] leading-relaxed text-ink-300 mb-7 sm:mb-8">
                {event.description || COMING_SOON}
              </p>

              <div className="grid grid-cols-2 border-t border-ink-700/20">
                <Field label="Date" value={event.date} />
                <Field label="Time" value={event.time} />
                <Field label="Team Size" value={event.teamSize} />
                <Field label="Venue" value={event.venue} />
                <Field label="Fee" value={event.fee} />
                <Field label="Prize" value={event.prize} />
              </div>

              <div className="mt-7 sm:mt-8">
                <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-ink-500 mb-2">
                  Eligibility
                </div>
                <p className="text-[14px] text-ink-300 leading-relaxed">
                  {event.eligibility || COMING_SOON}
                </p>
              </div>

              <div className="mt-6">
                <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-ink-500 mb-2">
                  Rules
                </div>
                {event.rules && event.rules.length > 0 ? (
                  <ul className="space-y-2">
                    {event.rules.map((rule, i) => (
                      <li key={i} className="text-[14px] text-ink-300 leading-relaxed pl-5 relative">
                        <span className="absolute left-0 top-[10px] w-3 h-px bg-ink-500" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[14px] text-ink-300">{COMING_SOON}</p>
                )}
              </div>

              <div className="mt-6">
                <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-ink-500 mb-2">
                  Coordinators
                </div>
                <p className="text-[14px] text-ink-300">{event.coordinators || COMING_SOON}</p>
              </div>
            </div>

            {/* Sticky bottom CTA — always visible above home bar */}
            <div
              className="sticky bottom-0 left-0 right-0 pt-4 pb-2 bg-base-850 mt-8 -mx-6 sm:-mx-10 px-6 sm:px-10 border-t border-ink-700/15"
              style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))" }}
            >
              {registrationUrl ? (
                <a
                  href={registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full"
                >
                  Register for {event.name}
                </a>
              ) : (
                <span className="btn-ghost w-full">
                  Registration Opening Soon
                </span>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}