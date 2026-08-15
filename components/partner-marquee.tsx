"use client";

import { motion } from "framer-motion";

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

function PartnerCard({ name, location }: { name: string; location: string }) {
  return (
    <div className="flex shrink-0 items-center gap-3 rounded-full border border-emerald-500/30 bg-slate-900/80 px-5 py-2.5 shadow-[0_0_20px_rgba(16,185,129,0.15)] backdrop-blur-md">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
      </span>
      <div className="flex flex-col">
        <span className="text-sm font-bold tracking-wide text-white">
          {name}
        </span>
        <span className="text-[10px] text-slate-400">{location}</span>
      </div>
    </div>
  );
}

export function PartnerMarquee3D() {
  // Duplicate the list so the scroll loop is seamless
  const loop = [...PARTNERS, ...PARTNERS];

  return (
    <section
      aria-label="Partner organizations"
      className="relative flex h-[320px] w-full flex-col items-center justify-center overflow-hidden border-y border-border bg-slate-950 text-white"
    >
      {/* Lightweight ambient background — no WebGL */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.12),transparent_45%),radial-gradient(circle_at_70%_70%,rgba(59,130,246,0.1),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 ambient-grid opacity-20" />

      {/* Header Tag */}
      <div className="relative z-10 mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400 drop-shadow">
          ✦ Rescuing Surplus Across 340+ Kitchens
        </p>
      </div>

      {/* Auto-scrolling marquee row */}
      <div className="relative z-10 w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-slate-950 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-slate-950 to-transparent" />

        <motion.div
          className="flex gap-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        >
          {loop.map((partner, idx) => (
            <PartnerCard
              key={`${partner.name}-${idx}`}
              name={partner.name}
              location={partner.location}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}