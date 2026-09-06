"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";

const NAV_ITEMS = [
  { label: "Home", hash: "hero" },
  { label: "About", hash: "about" },
  { label: "Events", hash: "events" },
  { label: "Schedule", hash: "schedule" },
  { label: "Sponsors", hash: "sponsors" },
  { label: "FAQ", hash: "faq" },
  { label: "Contact", hash: "contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAdminRoute = pathname.startsWith("/admin");
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const [registrationUrl, setRegistrationUrl] = useState<string>("");

  useEffect(() => {
    fetch("/api/public/settings").then((r) => r.ok ? r.json() : null).then((d) => setRegistrationUrl(d?.registrationUrl || "")).catch(() => undefined);
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
      if (!isHome) return;
      const sections = NAV_ITEMS.map((i) => document.getElementById(i.hash)).filter(
        Boolean
      ) as HTMLElement[];
      let current = "hero";
      for (const sec of sections) {
        if (window.scrollY >= sec.offsetTop - 160) current = sec.id;
      }
      setActive(current);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    document.body.classList.toggle("locked", menuOpen);
  }, [menuOpen]);

  function hrefFor(hash: string) {
    return isHome ? `#${hash}` : `/#${hash}`;
  }

  if (isAdminRoute) return null;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-500 ${
          scrolled
            ? "bg-base-950/85 backdrop-blur-md border-b border-ink-700/30 py-3"
            : "bg-transparent py-5 md:py-6"
        }`}
      >
        <div className="container-content flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="VIBRANT 2K26 home">
            <span className="relative w-8 h-8 rounded-sm overflow-hidden flex-shrink-0">
              <Image
                src={siteConfig.organizers.vibeesta.logoMark}
                alt=""
                fill
                sizes="32px"
                className="object-cover"
              />
            </span>
            <span className="text-[11px] font-display font-semibold tracking-[0.08em] text-vibeesta-300 leading-none">
              VIBEESTA
            </span>
            <span className="text-ink-500 text-xs px-0.5">×</span>
            <span className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={siteConfig.organizers.shrinik.logo}
                alt=""
                fill
                sizes="32px"
                className="object-cover"
              />
            </span>
            <span className="text-[11px] font-display font-semibold tracking-[0.08em] text-shrinik-600 leading-none">
              SHRINIK
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.slice(1).map((item) => (
              <a
                key={item.hash}
                href={hrefFor(item.hash)}
                className={`relative px-3.5 py-2 text-[13px] font-medium transition-colors rounded-md ${
                  active === item.hash ? "text-ink-0" : "text-ink-300 hover:text-ink-0 hover:bg-ink-700/10"
                }`}
              >
                {item.label}
                {active === item.hash && isHome && (
                  <span className="absolute left-3.5 right-3.5 -bottom-0.5 h-px bg-vibeesta-400" />
                )}
              </a>
            ))}
            <Link
              href="/gallery"
              className={`relative px-3.5 py-2 text-[13px] font-medium transition-colors rounded-md ${
                pathname === "/gallery" ? "text-ink-0" : "text-ink-300 hover:text-ink-0 hover:bg-ink-700/10"
              }`}
            >
              Gallery
              {pathname === "/gallery" && <span className="absolute left-3.5 right-3.5 -bottom-0.5 h-px bg-shrinik-600" />}
            </Link>
            <Link
              href="/campus-ambassador"
              className={`relative px-3.5 py-2 text-[13px] font-medium transition-colors rounded-md ${
                pathname === "/campus-ambassador" ? "text-ink-0" : "text-ink-300 hover:text-ink-0 hover:bg-ink-700/10"
              }`}
            >
              Ambassador
              {pathname === "/campus-ambassador" && <span className="absolute left-3.5 right-3.5 -bottom-0.5 h-px bg-vibeesta-400" />}
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {registrationUrl ? (
              <a
                href={registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary btn-sm hidden lg:inline-flex"
              >
                Register Now
              </a>
            ) : (
              <span className="btn-ghost btn-sm hidden lg:inline-flex">
                Registration Opening Soon
              </span>
            )}
            {/* Hamburger — 44×44px minimum touch target */}
            <button
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="lg:hidden w-11 h-11 flex items-center justify-center text-ink-0 rounded-lg hover:bg-ink-700/20 transition-colors active:scale-95 shrink-0"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen menu — slides in from right */}
      <div
        className={`fixed inset-0 z-[190] bg-base-950/98 backdrop-blur-xl flex flex-col items-center justify-center gap-1 transition-all duration-400 lg:hidden ${
          menuOpen
            ? "opacity-100 pointer-events-auto translate-x-0"
            : "opacity-0 pointer-events-none translate-x-4"
        }`}
        style={{ transitionProperty: "opacity, transform" }}
      >
        {NAV_ITEMS.map((item) => (
          <a
            key={item.hash}
            href={hrefFor(item.hash)}
            onClick={() => setMenuOpen(false)}
            className={`w-full max-w-xs text-center font-display font-bold text-2xl py-3.5 rounded-xl transition-colors ${
              active === item.hash && isHome
                ? "text-ink-0 bg-ink-700/20"
                : "text-ink-300 hover:text-ink-0 hover:bg-ink-700/10"
            }`}
          >
            {item.label}
          </a>
        ))}
        <Link
          href="/gallery"
          onClick={() => setMenuOpen(false)}
          className={`w-full max-w-xs text-center font-display font-bold text-2xl py-3.5 rounded-xl transition-colors ${
            pathname === "/gallery"
              ? "text-ink-0 bg-ink-700/20"
              : "text-ink-300 hover:text-ink-0 hover:bg-ink-700/10"
          }`}
        >
          Gallery
        </Link>
        <Link
          href="/campus-ambassador"
          onClick={() => setMenuOpen(false)}
          className={`w-full max-w-xs text-center font-display font-bold text-2xl py-3.5 rounded-xl transition-colors ${
            pathname === "/campus-ambassador"
              ? "text-ink-0 bg-ink-700/20"
              : "text-ink-300 hover:text-ink-0 hover:bg-ink-700/10"
          }`}
        >
          Ambassador
        </Link>
        {/* Mobile Register CTA */}
        <div className="mt-6">
          {registrationUrl ? (
            <a
              href={registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              onClick={() => setMenuOpen(false)}
            >
              Register Now
            </a>
          ) : (
            <span className="btn-ghost">
              Registration Opening Soon
            </span>
          )}
        </div>
      </div>
    </>
  );
}