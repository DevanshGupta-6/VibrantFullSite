"use client";

import { motion } from "framer-motion";
import { Instagram, Linkedin, Mail, MapPin, ExternalLink } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";

function Row({ label, value, href }: { label: string; value: string; href?: string | null }) {
  const content = href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-ink-0 transition-colors">
      {value}
    </a>
  ) : (
    <span>{value}</span>
  );
  return (
    <li className="flex items-start sm:items-center justify-between gap-4 py-3.5 border-b border-ink-700/20 text-[14px] sm:text-[14.5px]">
      <span className="text-[10px] sm:text-[10.5px] font-semibold tracking-[0.16em] uppercase text-ink-500 shrink-0 pt-0.5 sm:pt-0">
        {label}
      </span>
      <span className="text-ink-0 text-right">{content}</span>
    </li>
  );
}

export default function Contact() {
  const { contact, socialLinks } = siteConfig;

  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(contact.location)}`;

  return (
    <section id="contact" className="py-24 sm:py-28 md:py-36">
      <div className="container-content">
        <motion.div
          className="mb-12 md:mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 0.84, 0.44, 1] }}
        >
          <p className="text-[12px] font-semibold tracking-[0.28em] uppercase text-ink-500 mb-4">
            Reach Out
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl">
            LET'S <span className="accent-rule">CONNECT.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 0.84, 0.44, 1] }}
          >
            <ul>
              <Row label="Email" value={contact.email ?? "Coming Soon"} href={contact.email ? `mailto:${contact.email}` : null} />
              <Row label="Phone" value={contact.phone ?? "Coming Soon"} href={contact.phone ? `tel:${contact.phone}` : null} />
              <Row label="Location" value={contact.location} />
              <Row label="Coordinators" value={contact.coordinators ?? "Coming Soon"} />
            </ul>

            {/* Social icons */}
            <div className="flex gap-3 mt-8">
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-11 h-11 rounded-full border border-ink-700/30 flex items-center justify-center hover:border-vibeesta-400/50 hover:text-vibeesta-300 transition-colors active:scale-95"
                >
                  <Instagram size={16} />
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-11 h-11 rounded-full border border-ink-700/30 flex items-center justify-center hover:border-vibeesta-400/50 hover:text-vibeesta-300 transition-colors active:scale-95"
                >
                  <Linkedin size={16} />
                </a>
              )}
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  aria-label="Email"
                  className="w-11 h-11 rounded-full border border-ink-700/30 flex items-center justify-center hover:border-vibeesta-400/50 hover:text-vibeesta-300 transition-colors active:scale-95"
                >
                  <Mail size={16} />
                </a>
              )}
            </div>
          </motion.div>

          {/* Styled map placeholder */}
          <motion.div
            className="aspect-[4/3] border border-ink-700/25 relative overflow-hidden rounded-sm bg-base-900"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 0.84, 0.44, 1] }}
          >
            {/* Decorative grid */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            {/* Atmosphere glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_60%,rgba(109,40,217,0.08),transparent_75%)]" />

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
              <div className="w-10 h-10 rounded-full border border-vibeesta-400/30 bg-vibeesta-600/10 flex items-center justify-center">
                <MapPin size={18} className="text-vibeesta-400" />
              </div>
              <div>
                <p className="text-[13px] font-display font-semibold text-ink-0 mb-1">
                  {contact.location}
                </p>
                <p className="text-[12px] text-ink-500">
                  G.L. Bajaj Institute of Technology
                </p>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-vibeesta-300 hover:text-vibeesta-300/80 border border-vibeesta-400/25 rounded-full px-4 py-2 transition-colors hover:bg-vibeesta-600/10"
              >
                Get Directions <ExternalLink size={12} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}