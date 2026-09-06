"use client";

import { ArrowRight, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import Atmosphere from "@/components/Atmosphere";
import OrbitRing from "@/components/OrbitRing";
import { siteConfig } from "@/config/siteConfig"

export default function Hero() {
  const [registrationUrl, setRegistrationUrl] = useState("");
  useEffect(() => { fetch("/api/public/settings").then((r) => r.ok ? r.json() : null).then((d) => setRegistrationUrl(d?.registrationUrl || "")).catch(() => undefined); }, []);

  return (
    <header
      id="hero"
      className="relative min-h-[100svh] flex flex-col justify-center pt-24 sm:pt-28 md:pt-32 pb-14 sm:pb-16 overflow-hidden"
    >
      <Atmosphere variant="fusion" fog />

      {/* LEFT — technical influence: fine grid */}
      <div
        className="absolute inset-y-0 left-0 w-[38%] pointer-events-none hidden md:block opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(rgba(200,170,255,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(200,170,255,0.16) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "linear-gradient(90deg, black, transparent 85%)",
          WebkitMaskImage: "linear-gradient(90deg, black, transparent 85%)",
        }}
      />

      {/* RIGHT — creative influence: flowing thin lines */}
      <svg
        className="absolute right-0 top-0 bottom-0 w-[42%] h-full pointer-events-none hidden md:block opacity-70"
        viewBox="0 0 400 800"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M 420 30 C 260 170, 340 330, 200 450 C 90 540, 210 640, 120 780" fill="none" stroke="rgba(225,29,72,0.5)" strokeWidth="1" />
        <path d="M 420 130 C 300 250, 370 390, 240 510" fill="none" stroke="rgba(219,39,119,0.3)" strokeWidth="0.7" />
        <path d="M 400 250 C 320 330, 360 420, 280 500" fill="none" stroke="rgba(219,39,119,0.2)" strokeWidth="0.6" />
      </svg>

      <OrbitRing size={520} color="vibeesta" className="absolute -left-40 top-[6%] pointer-events-none hidden lg:block opacity-80" />
      <OrbitRing size={360} color="shrinik" dashed className="absolute -right-24 bottom-[4%] pointer-events-none hidden lg:block opacity-80" />

      {/* Corner labels — visible on sm+, small on mobile */}
      <div className="absolute top-24 sm:top-28 left-4 sm:left-6 md:left-10 micro-label text-[9px] sm:text-[10.5px] opacity-70 sm:opacity-100">
        VBRNT / 2K26
        <br />
        TECH × CULTURE
      </div>
      <div className="absolute top-24 sm:top-28 right-4 sm:right-6 md:right-10 micro-label text-[9px] sm:text-[10.5px] text-right opacity-70 sm:opacity-100">
        16—17 OCT / 2026
        <br />
        G.L. BAJAJ
      </div>

      <div className="container-content relative z-10 text-center">
        <p className="text-[11px] sm:text-[12px] font-semibold tracking-[0.28em] sm:tracking-[0.3em] uppercase text-ink-300 mb-3 opacity-0 animate-[fadeUp_0.8s_ease-out_0.1s_forwards]">
          Vibeesta Creative Society × Shrinik Club present
        </p>

        <h1 className="leading-[0.88] opacity-0 animate-[fadeUp_0.9s_ease-out_0.2s_forwards]">
          <span className="block fusion-text text-[16vw] sm:text-[13vw] md:text-[9vw] lg:text-[7.5vw] xl:text-[6.5vw]">
            VIBRANT
          </span>
          <span className="block text-ink-0 text-[16vw] sm:text-[13vw] md:text-[9vw] lg:text-[7.5vw] xl:text-[6.5vw]">
            2K26
          </span>
        </h1>

        <p className="mt-5 sm:mt-6 text-[12px] sm:text-[13px] md:text-sm font-semibold tracking-[0.32em] sm:tracking-[0.35em] uppercase text-ink-300 opacity-0 animate-[fadeUp_0.8s_ease-out_0.4s_forwards]">
          {siteConfig.tagline}
        </p>

        <p className="mt-4 sm:mt-5 text-[14px] sm:text-[15px] text-ink-300 opacity-0 animate-[fadeUp_0.8s_ease-out_0.5s_forwards]">
          {siteConfig.eventDateLabel}
        </p>
        <p className="text-[13px] sm:text-[13.5px] text-ink-500 opacity-0 animate-[fadeUp_0.8s_ease-out_0.55s_forwards]">
          {siteConfig.venue}
        </p>

        <div className="mt-8 mb-2 opacity-0 animate-[fadeUp_0.8s_ease-out_0.65s_forwards]">
          <div className="font-display font-extrabold text-[26px] sm:text-[28px] md:text-4xl text-ink-0">
            {siteConfig.prizePool}
          </div>
          <div className="text-[11px] font-semibold tracking-[0.24em] uppercase text-ink-500 mt-1">
            Prize Pool
          </div>
        </div>

        {/* CTA buttons — stacks on very small screens, row on sm+ */}
        <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 opacity-0 animate-[fadeUp_0.8s_ease-out_0.75s_forwards]">
          {registrationUrl ? (
            <a
              href={registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full sm:w-auto"
            >
              Register Now <ArrowRight size={16} />
            </a>
          ) : (
            <span className="btn-ghost w-full sm:w-auto">
              Registration Opening Soon
            </span>
          )}
          <a
            href="#events"
            className="inline-flex items-center gap-2 border-b border-ink-700/50 text-ink-0 text-sm font-medium px-1 py-2 transition-colors hover:border-ink-0"
          >
            Explore Events
          </a>
        </div>

        {/* App Announcement */}
        <div className="mt-10 sm:mt-12 max-w-lg mx-auto p-5 sm:p-6 rounded-2xl border border-ink-800/60 bg-ink-900/40 backdrop-blur-md opacity-0 animate-[fadeUp_0.8s_ease-out_0.85s_forwards] relative overflow-hidden group">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-vibeesta/10 to-shrinik/10 opacity-30 group-hover:opacity-70 transition-opacity duration-500" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-vibeesta/10 text-vibeesta border border-vibeesta/20">
                <Ticket size={16} />
              </span>
              <span className="text-base font-semibold text-ink-0 tracking-wide">
                Free Entry Tickets
              </span>
            </div>
            <p className="text-sm text-ink-300 mb-6 leading-relaxed max-w-sm mx-auto">
              Download the official Vibeesta app to claim your free entry tickets in future and stay updated with Vibrant 2K26 announcements.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://play.google.com/store/apps/details?id=com.vibeesta.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-2.5 w-full sm:w-auto rounded-xl bg-ink-950/80 hover:bg-ink-800 transition-all duration-300 border border-ink-800 hover:border-vibeesta/50 text-sm font-medium text-ink-100 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="w-4 h-4">
                  <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                </svg>
                Play Store
              </a>
              <a
                href="https://apps.apple.com/us/app/vibeesta/id6761893909"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-2.5 w-full sm:w-auto rounded-xl bg-ink-950/80 hover:bg-ink-800 transition-all duration-300 border border-ink-800 hover:border-shrinik/50 text-sm font-medium text-ink-100 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" className="w-4 h-4">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                </svg>
                App Store
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-[fadeUp_0.8s_ease-out_0.95s_forwards]">
        <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-ink-500">
          Scroll
        </span>
        <span className="w-px h-8 bg-gradient-to-b from-ink-500 to-transparent" />
      </div>
    </header>
  );
}