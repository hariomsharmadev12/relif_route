"use client";

import { motion } from "framer-motion";
import { Bell, Check, Send } from "lucide-react";

export function AutomatedAlertsCard() {
  return (
    // Removed generic 'glass' and added explicit background, border, and shadow classes for high visibility
    <article className="relative flex flex-col overflow-hidden rounded-3xl p-5 sm:p-6 h-full bg-white border border-slate-200 shadow-xl dark:bg-slate-900 dark:border-slate-800">
      <header className="mb-4">
        <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
          <Bell className="size-3" aria-hidden />
          Automated Alerts
        </span>
        <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          One tap to claim.
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Nearby shelters get a push the second a batch is verified — claimed
          inventory locks instantly for everyone else.
        </p>
      </header>

      {/* Changed bg-secondary/70 to high-contrast slate backgrounds */}
      <div className="relative flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
        <div aria-hidden className="absolute inset-0 ambient-grid opacity-50" />

        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.96 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 22,
            delay: 0.2,
          }}
          // Upgraded to a solid white card with a clean shadow for the notification bubble
          className="relative rounded-2xl p-3.5 shadow-md bg-white border border-slate-100 dark:bg-slate-800 dark:border-slate-700"
        >
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <Send className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                  ReliefRoute Bot
                </p>
                <span className="font-mono text-[10px] font-medium text-slate-500 dark:text-slate-400">
                  now
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                <span className="font-bold text-slate-900 dark:text-white">
                  40 hot meals
                </span>{" "}
                available at Kanto Grill — 2.4km from you. Expires in 3h 42m.
              </p>
              <div className="mt-3 flex gap-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  <Check className="size-3.5" aria-hidden />
                  Claim batch
                </motion.button>
                <button
                  type="button"
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                >
                  Pass
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 24,
            delay: 0.55,
          }}
          className="mt-3 flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-[11px] font-semibold text-slate-600 bg-white/60 border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-400 backdrop-blur-sm"
        >
          <span className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
          Telegram · WhatsApp · SMS fallback delivered in 240ms
        </motion.div>
      </div>
    </article>
  );
}
