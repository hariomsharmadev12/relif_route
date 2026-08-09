"use client";

import { motion } from "framer-motion";
import { Navigation, Radar } from "lucide-react";

const PINS = [
  { id: 1, label: "2.4km away", tone: "open", pos: "left-[35%] top-[30%]" },
  { id: 2, label: "Claimed", tone: "claimed", pos: "right-[25%] top-[45%]" },
  { id: 3, label: "900m away", tone: "open", pos: "left-[45%] bottom-[25%]" },
];

export function HeatmapRadarCard() {
  return (
    <article
      id="live-map"
      className="relative flex flex-col overflow-hidden rounded-3xl p-5 sm:p-6 h-full bg-white border border-slate-200 shadow-xl dark:bg-slate-900 dark:border-slate-800"
    >
      <header className="mb-4">
        <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
          <Radar className="size-3" aria-hidden />
          Heatmap Radar
        </span>
        <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Demand, mapped live.
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Shelter demand density and donor supply resolved across India every 15
          seconds.
        </p>
      </header>

      <div className="relative flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
        {/* MAP BACKGROUND LAYER - rasterized PNG thumb, not raw SVG */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/India_edcp_location_map.svg/1200px-India_edcp_location_map.svg.png"
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 h-full w-full scale-125 object-contain object-center opacity-50 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen pointer-events-none select-none"
        />

        <div aria-hidden className="absolute inset-0 ambient-grid opacity-30" />

        {/* radar pulses */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              aria-hidden
              className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-600/60 dark:border-blue-500/50 bg-blue-500/5"
              animate={{ scale: [0.4, 3.4], opacity: [0.6, 0] }}
              transition={{
                duration: 3.6,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 1.2,
                ease: "easeOut",
              }}
            />
          ))}
          <span className="relative flex size-3 items-center justify-center rounded-full bg-blue-600 shadow-[0_0_16px_4px_rgba(37,99,235,0.7)]" />
        </div>

        {/* status pins */}
        {PINS.map((pin, index) => (
          <motion.span
            key={pin.id}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + index * 0.18 }}
            className={`absolute flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold shadow-md bg-white border border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 ${pin.pos}`}
          >
            <span
              className={
                pin.tone === "claimed"
                  ? "size-2 rounded-full bg-slate-400 dark:bg-slate-500"
                  : "size-2 rounded-full bg-blue-600 animate-pulse"
              }
            />
            {pin.label}
          </motion.span>
        ))}

        <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] font-bold shadow-lg bg-white/90 border border-slate-200 text-slate-800 backdrop-blur-md dark:bg-slate-900/90 dark:border-slate-700 dark:text-slate-200">
          <Navigation
            className="size-3.5 text-blue-600 dark:text-blue-400"
            aria-hidden
          />
          Routing 6 active pickups in India
        </div>
      </div>
    </article>
  );
}
