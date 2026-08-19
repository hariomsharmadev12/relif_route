"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Partners list
const PARTNERS = [
  { name: "Northside Kitchens", location: "450+ meals saved" },
  { name: "Harbor Shelter Trust", location: "Downtown HQ" },
  { name: "Bento Collective", location: "1.2k meals saved" },
  { name: "GreenLeaf Catering", location: "Westside Hub" },
  { name: "City Food Bank", location: "Metro Region" },
  { name: "Metro Hotel Group", location: "Hospitality Partner" },
  { name: "Sunrise Mission", location: "310+ meals saved" },
  { name: "Campus Dining Co.", location: "University Hub" },
];

function PartnerCard({
  name,
  location,
  active,
  onEnter,
  onLeave,
}: {
  name: string;
  location: string;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      className="relative shrink-0"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      tabIndex={0}
    >
      {/* Hover / focus popup */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="pointer-events-none absolute -top-11 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md bg-white px-3 py-1.5 text-xs font-medium text-slate-900 shadow-lg shadow-black/30"
          >
            {name}
            <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white" />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`flex items-center gap-3 rounded-full border px-5 py-2.5 backdrop-blur-md outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white/40 ${
          active
            ? "border-white/25 bg-white/[0.06]"
            : "border-white/10 bg-white/[0.02]"
        }`}
      >
        <span className="relative flex h-2 w-2">
          {active && (
            <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-white/50" />
          )}
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white/40" />
        </span>
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-wide text-white">
            {name}
          </span>
          <span className="text-[10px] text-white/40">{location}</span>
        </div>
      </div>
    </div>
  );
}

export function PartnerMarquee3D() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Duplicate the list so the scroll loop is seamless
  const loop = [...PARTNERS, ...PARTNERS];

  return (
    <section
      aria-label="Partner organizations"
      className="relative flex h-[200px] w-full flex-col items-center justify-center overflow-hidden border-y border-border bg-slate-950 text-white"
    >
      {/* Subtle, neutral ambient backdrop — no color washes */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.04),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 ambient-grid opacity-[0.06]" />

      {/* Header Tag */}
      <div className="relative z-10 mb-6 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/40">
          Rescuing Surplus Across 340+ Kitchens
        </p>
      </div>

      {/* Auto-scrolling marquee row */}
      <div className="relative z-10 w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-slate-950 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-slate-950 to-transparent" />

        <div className="overflow-hidden">
          <div
            className="marquee-track flex w-max gap-4"
            style={{
              animationPlayState: hoveredIdx !== null ? "paused" : "running",
            }}
          >
            {loop.map((partner, idx) => (
              <PartnerCard
                key={`${partner.name}-${idx}`}
                name={partner.name}
                location={partner.location}
                active={hoveredIdx === idx}
                onEnter={() => setHoveredIdx(idx)}
                onLeave={() =>
                  setHoveredIdx((cur) => (cur === idx ? null : cur))
                }
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .marquee-track {
          animation: marquee 28s linear infinite;
        }
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}