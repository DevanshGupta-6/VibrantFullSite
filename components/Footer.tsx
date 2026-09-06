"use client";

import Link from "next/link";
import { siteConfig } from "@/config/siteConfig";
import { usePathname } from "next/navigation";

const LINKS = [
  { label: "Home", href: "/#hero" },
  { label: "About", href: "/#about" },
  { label: "Events", href: "/#events" },
  { label: "Schedule", href: "/#schedule" },
  { label: "Sponsors", href: "/#sponsors" },
  { label: "Gallery", href: "/gallery" },
  { label: "Ambassador", href: "/campus-ambassador" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];

export default function Footer() {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if(isAdminRoute) return null;
  return (
    <footer className="border-t border-ink-700/20 py-14 md:py-20">
      <div className="container-content">
        {/* Top row */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10 md:mb-12">
          <div>
            <div className="text-ink-0 font-display font-extrabold text-3xl md:text-4xl">
              VIBRANT<span className="text-ink-700 text-base align-super ml-2">2K26</span>
            </div>
            <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-ink-500 mt-2">
              Vibeesta × Shrinik
            </div>
          </div>
          <div className="text-[12px] sm:text-[12.5px] text-ink-500 text-right max-w-[200px] sm:max-w-none leading-relaxed">
            {siteConfig.venue}
          </div>
        </div>

        {/* Nav links */}
        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap gap-x-5 gap-y-2.5 pt-8 border-t border-ink-700/15 mb-8 md:mb-10"
        >
          {LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-[13px] text-ink-300 hover:text-ink-0 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-between gap-2 text-[11px] sm:text-[11.5px] text-ink-500">
          <span>© 2026 VIBRANT 2K26. All Rights Reserved.</span>
          <span>{siteConfig.organizers.vibeesta.name} × {siteConfig.organizers.shrinik.name}</span>
        </div>
      </div>
    </footer>
  );
}