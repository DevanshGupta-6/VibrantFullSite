"use client";

import { useEffect, useState } from "react";


export default function StickyRegisterCta() {
  const [show, setShow] = useState(false);
  const [registrationUrl, setRegistrationUrl] = useState("");

  useEffect(() => { fetch("/api/public/settings").then((r) => r.ok ? r.json() : null).then((d) => setRegistrationUrl(d?.registrationUrl || "")).catch(() => undefined); }, []);

  useEffect(() => {
    function onScroll() {
      setShow(window.scrollY > window.innerHeight * 0.85);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed left-1/2 z-[150] sm:hidden transition-all duration-500 ${
        show
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      style={{
        /* Single source of truth — no conflicting className transforms */
        bottom: "calc(1.25rem + env(safe-area-inset-bottom, 0px))",
        transform: `translateX(-50%) translateY(${show ? "0px" : "96px"})`,
      }}
    >
      {registrationUrl ? (
        <a
          href={registrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full fusion-gradient text-ink-0 text-[13px] font-semibold px-6 py-4 shadow-lg shadow-black/40"
        >
          Register Now →
        </a>
      ) : (
        <span className="inline-flex items-center rounded-full border border-ink-700/50 bg-base-950/90 backdrop-blur text-ink-300 text-[12px] font-medium px-6 py-4">
          Registration Opening Soon
        </span>
      )}
    </div>
  );
}