"use client";

import { useEffect, useState, useId } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FaqItem } from "@/lib/types";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const instanceId = useId();
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    fetch("/api/public/faq").then((response) => response.ok ? response.json() : Promise.reject(new Error("Unable to load FAQs.")))
      .then((data) => {
        if (isCurrent) {
          setFaq(data);
          setError(null);
        }
      })
      .catch((fetchError: unknown) => {
        if (isCurrent) {
          setError(fetchError instanceof Error ? fetchError.message : "Unable to load FAQs.");
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
    <section id="faq" className="py-24 sm:py-28 md:py-36">
      <div className="container-content max-w-2xl mx-auto">
        <motion.div
          className="text-center mb-12 md:mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 0.84, 0.44, 1] }}
        >
          <p className="text-[12px] font-semibold tracking-[0.28em] uppercase text-ink-500 mb-4">
            Questions
          </p>
          <h2 className="text-4xl sm:text-5xl">FAQ</h2>
        </motion.div>

        {isLoading ? (
          <p className="py-12 text-center micro-label">Loading FAQs...</p>
        ) : error ? (
          <p className="py-12 text-center text-red-700">Unable to load FAQs: {error}</p>
        ) : (
          <div>
            {faq.map((item, i) => {
            const isOpen = openIndex === i;
            const panelId = `${instanceId}-faq-panel-${i}`;
            const triggerId = `${instanceId}-faq-trigger-${i}`;
            return (
              <div key={i} className="border-b border-ink-700/20">
                <button
                  id={triggerId}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="w-full flex items-center justify-between gap-6 py-5 sm:py-6 text-left group"
                >
                  <span className="text-[15px] md:text-[16px] font-medium text-ink-0 group-hover:text-ink-0 transition-colors">
                    {item.question}
                  </span>
                  <Plus
                    size={20}
                    className={`shrink-0 text-ink-500 transition-transform duration-300 ${
                      isOpen ? "rotate-45 text-shrinik-600" : "group-hover:text-ink-300"
                    }`}
                  />
                </button>

                {/* Framer Motion accordion — no maxHeight clipping */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={triggerId}
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 0.84, 0.44, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <p className="pb-6 text-[14px] text-ink-300 leading-relaxed pr-8">
                        {item.answer || "Coming Soon"}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
            })}
          </div>
        )}
      </div>
    </section>
  );
}