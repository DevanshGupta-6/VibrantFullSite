"use client";

import { EventCategory } from "@/lib/types";

export default function EventToggle({
  mode,
  onChange,
}: {
  mode: EventCategory;
  onChange: (mode: EventCategory) => void;
}) {
  const isTech = mode === "tech";

  return (
    <div
      role="tablist"
      aria-label="Event category"
      className="inline-flex items-center relative bg-base-900 border border-ink-700/30 rounded-full p-1 mx-auto"
    >
      {/* Sliding background pill — moves left/right based on active tab */}
      <span
        className="absolute inset-y-1 w-[calc(50%-2px)] rounded-full transition-all duration-400 ease-[cubic-bezier(.16,.84,.44,1)] pointer-events-none"
        style={{
          left: isTech ? "calc(50% + 2px)" : "4px",
          background: isTech
            ? "linear-gradient(110deg, rgba(109,40,217,0.3), rgba(168,85,247,0.22))"
            : "linear-gradient(110deg, rgba(159,18,57,0.3), rgba(219,39,119,0.22))",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: isTech ? "rgba(168,85,247,0.45)" : "rgba(185,28,61,0.45)",
        }}
        aria-hidden="true"
      />

      {/* CREATIVE — first */}
      <button
        role="tab"
        aria-selected={mode === "creative"}
        onClick={() => onChange("creative")}
        className={`relative z-10 px-5 sm:px-7 py-2.5 text-[12px] sm:text-[13px] font-semibold tracking-[0.12em] sm:tracking-[0.14em] uppercase rounded-full transition-colors duration-300 min-w-[90px] sm:min-w-[110px] min-h-[44px] ${
          mode === "creative" ? "text-ink-0" : "text-ink-500 hover:text-ink-300"
        }`}
      >
        Creative
      </button>

      {/* TECH — second */}
      <button
        role="tab"
        aria-selected={mode === "tech"}
        onClick={() => onChange("tech")}
        className={`relative z-10 px-5 sm:px-7 py-2.5 text-[12px] sm:text-[13px] font-semibold tracking-[0.12em] sm:tracking-[0.14em] uppercase rounded-full transition-colors duration-300 min-w-[90px] sm:min-w-[110px] min-h-[44px] ${
          mode === "tech" ? "text-ink-0" : "text-ink-500 hover:text-ink-300"
        }`}
      >
        Tech
      </button>
    </div>
  );
}