"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/siteConfig";

const EASE_CINEMATIC = [0.16, 0.84, 0.44, 1] as const;

export default function IntroExperience() {
  const prefersReducedMotion = useReducedMotion();

  const [phase, setPhase] = useState<
    "idle" | "enter" | "converge" | "collide" | "reveal" | "exit" | "done"
  >("idle");

  useEffect(() => {
    document.body.classList.add("locked");

    if (prefersReducedMotion) {
      const t1 = setTimeout(() => setPhase("reveal"), 50);
      const t2 = setTimeout(() => setPhase("exit"), 700);
      const t3 = setTimeout(() => {
        setPhase("done");
        document.body.classList.remove("locked");
      }, 1100);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }

    const timers = [
      setTimeout(() => setPhase("enter"), 50),
      setTimeout(() => setPhase("converge"), 1400),
      setTimeout(() => setPhase("collide"), 2000),
      setTimeout(() => setPhase("reveal"), 2500),
      setTimeout(() => setPhase("exit"), 3400),
      setTimeout(() => {
        setPhase("done");
        document.body.classList.remove("locked");
      }, 3900),
    ];

    return () => timers.forEach(clearTimeout);
  }, [prefersReducedMotion]);

  function skip() {
    setPhase("exit");

    setTimeout(() => {
      setPhase("done");
      document.body.classList.remove("locked");
    }, 500);
  }

  const collided =
    phase === "collide" || phase === "reveal" || phase === "exit";

  const revealed =
    phase === "reveal" || phase === "exit";

  if (phase === "done") return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[500] bg-base-950 flex items-center justify-center overflow-hidden"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "exit" ? 0 : 1 }}
        transition={{ duration: 0.6, ease: EASE_CINEMATIC }}
        role="presentation"
        aria-hidden="true"
      >
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 85%)",
          }}
        />

        {/* Vibeesta orb — left */}
        <motion.div
          className="absolute flex flex-col items-center gap-4"
          initial={{ x: "-45vw", opacity: 0, scale: 0.85 }}
          animate={
            collided
              ? { x: 0, opacity: 0, scale: 0.5 }
              : { x: "-18vw", opacity: 0.95, scale: 1 }
          }
          transition={{
            duration: collided ? 0.6 : 1.0,
            ease: EASE_CINEMATIC,
          }}
        >
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center">
            <div className="absolute -inset-6 rounded-full bg-vibeesta-500/30 blur-3xl" />
            <div className="absolute inset-0 rounded-full bg-vibeesta-400/25 blur-xl" />
            <div className="absolute inset-0 rounded-full border border-vibeesta-400/30" />

            <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-20 md:h-20 rounded-full overflow-hidden">
              <Image
                src={siteConfig.organizers.vibeesta.logoMark}
                alt="Vibeesta"
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
          </div>

          <span className="text-[10px] sm:text-[11px] md:text-xs font-display font-semibold tracking-[0.3em] text-vibeesta-300">
            VIBEESTA
          </span>
        </motion.div>

        {/* Shrinik orb — right */}
        <motion.div
          className="absolute flex flex-col items-center gap-4"
          initial={{ x: "45vw", opacity: 0, scale: 0.85 }}
          animate={
            collided
              ? { x: 0, opacity: 0, scale: 0.5 }
              : { x: "18vw", opacity: 0.95, scale: 1 }
          }
          transition={{
            duration: collided ? 0.6 : 1.0,
            ease: EASE_CINEMATIC,
            delay: prefersReducedMotion ? 0 : 0.15,
          }}
        >
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center">
            <div className="absolute -inset-6 rounded-full bg-shrinik-600/35 blur-3xl" />
            <div className="absolute inset-0 rounded-full bg-shrinik-700/30 blur-xl" />
            <div className="absolute inset-0 rounded-full border border-shrinik-600/30" />

            <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-20 md:h-20 rounded-full overflow-hidden">
              <Image
                src={siteConfig.organizers.shrinik.logo}
                alt="Shrinik Club"
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
          </div>

          <span className="text-[10px] sm:text-[11px] md:text-xs font-display font-semibold tracking-[0.3em] text-shrinik-600">
            SHRINIK
          </span>
        </motion.div>

        {/* Collision fusion flash */}
        <motion.div
          className="absolute w-4 h-4 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.95), rgba(219,39,119,0.65) 25%, rgba(168,85,247,0.55) 45%, rgba(159,18,57,0.4) 68%, transparent 80%)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={
            phase === "collide"
              ? { scale: 22, opacity: 1 }
              : revealed
              ? { scale: 22, opacity: 0 }
              : { scale: 0, opacity: 0 }
          }
          transition={{
            duration: 0.7,
            ease: EASE_CINEMATIC,
          }}
        />

        {/* VIBRANT reveal */}
        <motion.div
          className="relative z-10 text-center px-4 sm:px-6"
          initial={{
            opacity: 0,
            scale: 0.94,
            filter: "blur(6px)",
          }}
          animate={
            revealed
              ? {
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                }
              : {
                  opacity: 0,
                  scale: 0.94,
                  filter: "blur(6px)",
                }
          }
          transition={{
            duration: 0.7,
            ease: EASE_CINEMATIC,
          }}
        >
          <div className="fusion-text font-display font-extrabold uppercase text-[15vw] sm:text-[10vw] md:text-[7vw] leading-[0.9]">
            VIBRANT
          </div>

          <motion.div
            className="fusion-text font-display font-extrabold uppercase text-[15vw] sm:text-[10vw] md:text-[7vw] leading-[0.9]"
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={
              revealed
                ? {
                    opacity: 1,
                    y: 0,
                  }
                : {
                    opacity: 0,
                    y: 10,
                  }
            }
            transition={{
              duration: 0.5,
              delay: 0.25,
              ease: EASE_CINEMATIC,
            }}
          >
            2K26
          </motion.div>

          <motion.div
            className="mt-4 text-[10px] sm:text-[11px] md:text-xs font-semibold tracking-[0.32em] sm:tracking-[0.35em] text-ink-300"
            initial={{ opacity: 0 }}
            animate={
              revealed
                ? { opacity: 1 }
                : { opacity: 0 }
            }
            transition={{
              duration: 0.5,
              delay: 0.45,
            }}
          >
            {siteConfig.tagline}
          </motion.div>
        </motion.div>

        {/* Skip intro — safe-area aware positioning */}
        <button
          onClick={skip}
          className="absolute text-[11px] tracking-[0.14em] uppercase text-ink-500 hover:text-ink-0 border border-ink-700/40 rounded-full px-4 py-2.5 transition-colors bg-base-950/40 backdrop-blur-sm hover:bg-base-950/60"
          style={{
            bottom: "calc(1.75rem + env(safe-area-inset-bottom, 0px))",
            right: "1.25rem",
          }}
        >
          Skip Intro
        </button>
      </motion.div>
    </AnimatePresence>
  );
}