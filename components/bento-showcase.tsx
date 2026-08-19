"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  Compass,
  Globe,
  Leaf,
  ShieldCheck,
  Target,
  Utensils,
} from "lucide-react";
import { fadeUp, staggerContainer } from "@/components/motion-primitives";
import { HeatmapRadarCard } from "@/components/bento/heatmap-radar-card";
import { StatsRow } from "@/components/bento/stats-row";
import { ProcessStepper } from "@/components/bento/process-stepper";
import { SectionHeading } from "@/components/section-heading";

/**
 * Reusable 3D Tilt Wrapper with mouse tracking & spatial Z-axis depth
 */
function Card3D({
  children,
  className = "",
  depth = 20,
}: {
  children: React.ReactNode;
  className?: string;
  depth?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const shineX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const shineY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`group relative rounded-3xl transition-shadow duration-500 [perspective:1000px] hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)] ${className}`}
    >
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-white/10 via-slate-700/20 to-white/10 opacity-60 transition-opacity duration-500 group-hover:opacity-100" />

      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-20"
        style={{
          background: `radial-gradient(600px circle at ${shineX} ${shineY}, rgba(255,255,255,0.08), transparent 40%)`,
        }}
      />

      <div
        style={{ transform: `translateZ(${depth}px)` }}
        className="relative h-full w-full rounded-3xl bg-slate-900/90 backdrop-blur-xl"
      >
        {children}
      </div>
    </motion.div>
  );
}

/**
 * Zero Hunger 3D mascot — a playful floating bowl, built the same way
 * as the rest of this section's 3D elements (translateZ layers + mouse
 * tilt + idle float), so it needs no extra 3D/model dependencies.
 */
function ZeroHungerBowl3D() {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateXSpring = useSpring(y, { stiffness: 200, damping: 20 });
  const rotateYSpring = useSpring(x, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(rotateXSpring, [-0.5, 0.5], ["14deg", "-14deg"]);
  const rotateY = useTransform(rotateYSpring, [-0.5, 0.5], ["-14deg", "14deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      className="relative mx-auto hidden shrink-0 lg:block"
      style={{ perspective: "1200px", width: 220, height: 220 }}
      aria-hidden="true"
    >
      {/* Ambient glow grounding the figure — neutral, no accent hue */}
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-white/10 blur-3xl" />

      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-full w-full [transform-style:preserve-3d]"
      >
        {/* Steam wisps */}
        <motion.div
          animate={{ y: [0, -10, 0], opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ transform: "translateZ(50px)" }}
          className="absolute left-[78px] top-2 h-10 w-2 rounded-full bg-white/40 blur-[3px]"
        />
        <motion.div
          animate={{ y: [0, -10, 0], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          style={{ transform: "translateZ(50px)" }}
          className="absolute left-[112px] top-4 h-8 w-2 rounded-full bg-white/40 blur-[3px]"
        />
        <motion.div
          animate={{ y: [0, -10, 0], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
          style={{ transform: "translateZ(50px)" }}
          className="absolute left-[96px] top-0 h-7 w-1.5 rounded-full bg-white/30 blur-[3px]"
        />

        {/* Garnish sprig */}
        <div
          style={{ transform: "translateZ(46px) rotate(-12deg)" }}
          className="absolute left-[86px] top-9 text-white/70"
        >
          <Leaf className="size-6" />
        </div>

        {/* Food mound */}
        <div
          style={{ transform: "translateZ(40px)" }}
          className="absolute left-1/2 top-[70px] h-16 w-32 -translate-x-1/2 rounded-t-full bg-gradient-to-b from-slate-300 to-slate-500 shadow-inner"
        />

        {/* Scattered grains */}
        <div
          style={{ transform: "translateZ(44px)" }}
          className="absolute left-1/2 top-[78px] flex -translate-x-1/2 gap-2"
        >
          <span className="size-1.5 rounded-full bg-white/70" />
          <span className="size-1.5 rounded-full bg-white/50" />
          <span className="size-1.5 rounded-full bg-white/60" />
        </div>

        {/* Bowl */}
        <div
          style={{ transform: "translateZ(26px)" }}
          className="absolute left-1/2 top-[104px] h-[86px] w-[176px] -translate-x-1/2 rounded-b-[70px] rounded-t-[26px] border border-white/15 bg-gradient-to-b from-slate-100 via-slate-300 to-slate-500 shadow-[0_18px_35px_rgba(0,0,0,0.5)]"
        >
          <div className="absolute inset-x-4 top-2 h-3 rounded-full bg-white/30" />
        </div>

        {/* Spoon leaning on the rim */}
        <div
          style={{ transform: "translateZ(34px) rotate(28deg)" }}
          className="absolute -right-1 top-[86px] h-16 w-2.5 rounded-full bg-gradient-to-b from-slate-200 to-slate-400"
        >
          <span className="absolute -top-2.5 left-1/2 h-4 w-3.5 -translate-x-1/2 rounded-full bg-gradient-to-b from-slate-200 to-slate-400" />
        </div>

        {/* Grounding shadow */}
        <div className="absolute -bottom-3 left-1/2 h-4 w-32 -translate-x-1/2 rounded-full bg-black/40 blur-md" />
      </motion.div>
    </div>
  );
}

/**
 * SDG 2: Zero Hunger Highlight Card — left as-is
 */
function SDG2ZeroHungerCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-amber-500/25 bg-gradient-to-br from-amber-950/40 via-slate-900/95 to-slate-950 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
      {/* Background Accent Orbs */}
      <div className="pointer-events-none absolute -right-12 -top-12 size-56 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 size-56 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Side Info */}
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold text-amber-400 backdrop-blur-md">
            <Target className="size-3.5 text-amber-400" />
            UN Sustainable Development Goal 2
          </div>

          <h3 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            Driving Action for <span className="text-amber-400">SDG 2: Zero Hunger</span>
          </h3>

          <p className="mt-2.5 text-sm leading-relaxed text-slate-300 sm:text-base">
            By connecting surplus meals from hotels and restaurants directly to verified local shelters, our automated engine eliminates logistical delays to turn potential food waste into fresh nourishment for vulnerable communities.
          </p>
        </div>

        {/* Right Side Impact Pillars */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-auto">
          <div className="flex flex-col gap-1 rounded-2xl border border-slate-800/80 bg-slate-900/80 p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Utensils className="size-4" />
              Target 2.1
            </div>
            <span className="text-sm font-semibold text-white">Universal Meal Access</span>
            <span className="text-xs text-slate-400">Safe, fresh surplus diverted in minutes.</span>
          </div>

          <div className="flex flex-col gap-1 rounded-2xl border border-slate-800/80 bg-slate-900/80 p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <ShieldCheck className="size-4" />
              Target 2.2
            </div>
            <span className="text-sm font-semibold text-white">Ending Malnutrition</span>
            <span className="text-xs text-slate-400">Optimized routing directly to high-need shelters.</span>
          </div>

          <div className="flex flex-col gap-1 rounded-2xl border border-slate-800/80 bg-slate-900/80 p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
              <Globe className="size-4" />
              Target 2.c
            </div>
            <span className="text-sm font-semibold text-white">Zero Food Waste</span>
            <span className="text-xs text-slate-400">Real-time balancing of supply & local demand.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BentoShowcase() {
  return (
    <section className="relative w-full overflow-hidden border-t border-white/10 bg-slate-900 py-12 text-white sm:py-16 [perspective:1200px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05),transparent_50%)]" />
      <div className="pointer-events-none absolute -inset-y-1/2 inset-x-0 opacity-15 [transform-style:preserve-3d] [transform:rotateX(65deg)_scale(1.8)] bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-900 via-slate-900/80 to-transparent z-10" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        {/* Main Section Header - text + 3D bowl mascot side by side */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-10 flex flex-col items-start gap-10 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="max-w-3xl">
            <SectionHeading
              title="The whole rescue loop, running in one system."
              description="Detection, matching, dispatch and reporting share the same real-time state — so nothing gets double-claimed and nothing expires in limbo."
            />

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
              <a
                href="#live-map"
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_10px_25px_rgba(0,0,0,0.35)] transition-all duration-300 hover:scale-[1.03] hover:bg-slate-100 hover:shadow-[0_15px_35px_rgba(0,0,0,0.45)] active:scale-[0.98]"
              >
                <Compass className="size-4.5 transition-transform duration-300 group-hover:rotate-45" aria-hidden />
                Explore Live Map
              </a>

              <a
                href="#how-it-works"
                className="group inline-flex items-center gap-2.5 rounded-2xl border border-slate-800 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-200 shadow-md backdrop-blur-lg transition-all duration-300 hover:border-slate-700 hover:bg-slate-800/90 hover:shadow-lg active:scale-[0.98]"
              >
                See How It Works
                <ArrowRight className="size-4.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
              </a>
            </motion.div>
          </div>

          {/* 3D Zero Hunger bowl mascot — right side of the header text, text sizes untouched */}
          <ZeroHungerBowl3D />
        </motion.div>

        {/* SDG 2: Zero Hunger Banner Section */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <Card3D depth={15}>
            <SDG2ZeroHungerCard />
          </Card3D>
        </motion.div>

        {/* Heatmap Radar Row */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-6"
        >
          <Card3D depth={20}>
            <HeatmapRadarCard />
          </Card3D>
        </motion.div>

        {/* Middle Stats Section */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-6"
        >
          <Card3D depth={15}>
            <StatsRow />
          </Card3D>
        </motion.div>

        {/* Process Stepper Section */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-6"
        >
          <Card3D depth={15}>
            <ProcessStepper />
          </Card3D>
        </motion.div>
      </div>
    </section>
  );
}