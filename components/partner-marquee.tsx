"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
});

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

// Coordinates mapped to the heads across the 3D creature cluster (% top/left)
const HEAD_POSITIONS = [
  { top: "28%", left: "24%" }, // Teapot head (Top Left)
  { top: "22%", left: "50%" }, // Red creature (Top Center)
  { top: "26%", left: "72%" }, // Traffic cone head (Top Right)
  { top: "46%", left: "33%" }, // Pink hair (Mid Left)
  { top: "42%", left: "54%" }, // Blue creature (Mid Center)
  { top: "44%", left: "78%" }, // Green/Purple head (Mid Right)
  { top: "68%", left: "28%" }, // Small yellow guy (Bottom Left)
  { top: "62%", left: "52%" }, // Glasses creature (Bottom Center)
  { top: "68%", left: "74%" }, // Dark mustache guy (Bottom Right)
];

export function PartnerMarquee3D() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cycle to the next kitchen & head position every 2 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PARTNERS.length);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const currentPartner = PARTNERS[currentIndex];
  const currentPos = HEAD_POSITIONS[currentIndex % HEAD_POSITIONS.length];

  return (
    <section
      aria-label="Partner organizations"
      className="relative flex h-[580px] w-full flex-col items-center justify-center overflow-hidden border-y border-border bg-slate-950 text-white"
    >
      {/* 1. Darkened 3D Creature Background */}
      <div className="absolute inset-0 z-0 brightness-40 contrast-125 transition-all duration-700">
        <Spline scene="https://prod.spline.design/xnNfrAwT6mZTDFOu/scene.splinecode" />
      </div>

      {/* Dark gradient overlay to keep atmosphere deep and clean */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-slate-950/80 via-slate-950/30 to-slate-950/90" />

      {/* Header Tag */}
      <div className="absolute top-8 z-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400 drop-shadow">
          ✦ Rescuing Surplus Across 340+ Kitchens
        </p>
      </div>

      {/* 2. Dynamic Floating Kitchen Badge (Jumps from head to head) */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.7, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: currentPos.top,
              left: currentPos.left,
              transform: "translate(-50%, -100%)",
            }}
            className="flex flex-col items-center"
          >
            {/* Tooltip Card */}
            <div className="flex items-center gap-3 rounded-full border border-emerald-500/40 bg-slate-900/90 px-5 py-2.5 shadow-[0_0_25px_rgba(16,185,129,0.3)] backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-wide text-white">
                  {currentPartner.name}
                </span>
                <span className="text-[10px] text-slate-400">
                  {currentPartner.location}
                </span>
              </div>
            </div>

            {/* Glowing Pointer Arrow */}
            <div className="h-0 w-0 border-x-[6px] border-x-transparent border-t-[8px] border-t-emerald-500/40" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom status bar indicator */}
      <div className="absolute bottom-6 z-10 flex items-center gap-2">
        {PARTNERS.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "w-6 bg-emerald-400" : "w-1.5 bg-slate-700"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
