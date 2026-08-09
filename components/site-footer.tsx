"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Route } from "lucide-react";

const LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Contact", href: "/contact" },
];

export function SiteFooter() {
  const reduceMotion = useReducedMotion();

  return (
    <footer className="relative overflow-hidden border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <span className="relative flex size-9 items-center justify-center rounded-xl bg-foreground text-background">
              <Route className="size-4.5" />
              <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-primary ring-2 ring-background" />
            </span>
            <div>
              <p className="text-sm font-semibold tracking-tight">
                ReliefRoute AI
              </p>
              <p className="text-xs text-muted-foreground">
                Zero food waste, one route at a time.
              </p>
            </div>
          </div>

          <ul className="flex flex-wrap gap-6">
            {LINKS.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ReliefRoute AI. Just getting started.
          </p>
        </div>
      </div>

      {/* giant wordmark, Discord-style */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative select-none pb-2 pt-6"
      >
        <p
          className="whitespace-nowrap text-center font-bold leading-none tracking-tighter text-foreground/8"
          style={{ fontSize: "clamp(3.5rem, 16vw, 13rem)" }}
        >
          ReliefRoute
        </p>

        {!reduceMotion && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, transparent 30%, color-mix(in srgb, var(--color-primary) 25%, transparent) 50%, transparent 70%)",
              mixBlendMode: "screen",
            }}
            animate={{ backgroundPositionX: ["-200%", "200%"] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 2,
            }}
          />
        )}
      </motion.div>
    </footer>
  );
}
