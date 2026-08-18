"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  Compass,
  Globe,
  Leaf,
  ShieldCheck,
  Sparkles,
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
      className={`group relative rounded-3xl transition-shadow duration-500 [perspective:1000px] hover:shadow-[0_20px_50px_rgba(16,185,129,0.15)] ${className}`}
    >
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-emerald-500/30 via-slate-700/20 to-blue-500/30 opacity-60 transition-opacity duration-500 group-hover:opacity-100" />

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
 * Floating 3D robot mascot — pure CSS/Tailwind layered "depth" build
 * (translateZ layers + mouse-tracked tilt + idle float), so it needs
 * no extra 3D/model dependencies to work in this project.
 */
function RobotMascot3D() {
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
      {/* Ambient glow grounding the figure */}
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-emerald-500/15 blur-3xl" />

      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-full w-full [transform-style:preserve-3d]"
      >
        {/* Antenna */}
        <div
          style={{ transform: "translateZ(48px)" }}
          className="absolute left-1/2 top-0 h-9 w-1 -translate-x-1/2 rounded-full bg-gradient-to-b from-slate-500 to-slate-700"
        >
          <span className="absolute -top-2 left-1/2 size-3 -translate-x-1/2 rounded-full bg-emerald-400 shadow-[0_0_16px_5px_rgba(16,185,129,0.65)]" />
        </div>

        {/* Head */}
        <div
          style={{ transform: "translateZ(38px)" }}
          className="absolute left-1/2 top-8 h-[72px] w-[92px] -translate-x-1/2 rounded-[22px] border border-slate-600/70 bg-gradient-to-b from-slate-600 via-slate-700 to-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
        >
          <div className="absolute inset-x-3 top-3 flex h-9 items-center justify-center gap-3 rounded-2xl bg-slate-950/85 shadow-inner">
            <span className="size-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_3px_rgba(16,185,129,0.8)]" />
            <span className="size-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_3px_rgba(16,185,129,0.8)]" />
          </div>
          <div className="absolute inset-x-6 bottom-2 h-1 rounded-full bg-slate-900/60" />
        </div>

        {/* Neck */}
        <div
          style={{ transform: "translateZ(30px)" }}
          className="absolute left-1/2 top-[76px] h-3 w-4 -translate-x-1/2 rounded bg-slate-700"
        />

        {/* Body */}
        <div
          style={{ transform: "translateZ(24px)" }}
          className="absolute left-1/2 top-[92px] h-[92px] w-[112px] -translate-x-1/2 rounded-[26px] border border-slate-600/70 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 shadow-[0_18px_35px_rgba(0,0,0,0.5)]"
        >
          <div className="absolute left-1/2 top-4 flex size-11 -translate-x-1/2 items-center justify-center rounded-full border-2 border-emerald-400/70 bg-slate-900/80 shadow-[0_0_18px_rgba(16,185,129,0.35)]">
            <Leaf className="size-5 text-emerald-400" />
          </div>
          <div className="absolute inset-x-5 bottom-4 h-1.5 rounded-full bg-emerald-400/30" />
        </div>

        {/* Arms */}
        <div
          style={{ transform: "translateZ(16px) rotate(18deg)" }}
          className="absolute -left-2 top-[104px] h-3.5 w-14 rounded-full bg-gradient-to-r from-slate-600 to-slate-700"
        />
        <div
          style={{ transform: "translateZ(16px) rotate(-18deg)" }}
          className="absolute -right-2 top-[104px] h-3.5 w-14 origin-right rounded-full bg-gradient-to-l from-slate-600 to-slate-700"
        />

        {/* Legs */}
        <div
          style={{ transform: "translateZ(12px)" }}
          className="absolute left-1/2 top-[180px] h-8 w-[70px] -translate-x-1/2 rounded-b-2xl bg-slate-800"
        >
          <div className="absolute inset-x-3 top-2 h-4 w-[calc(50%-0.5rem)] rounded-lg bg-slate-900" />
          <div className="absolute inset-y-2 right-3 h-4 w-[calc(50%-0.5rem)] rounded-lg bg-slate-900" />
        </div>

        {/* Grounding shadow */}
        <div className="absolute -bottom-3 left-1/2 h-4 w-32 -translate-x-1/2 rounded-full bg-black/40 blur-md" />
      </motion.div>
    </div>
  );
}

/**
 * SDG 2: Zero Hunger Highlight Card
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
    <section className="relative w-full overflow-hidden bg-slate-950 py-20 text-white sm:py-32 [perspective:1200px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_50%)]" />
      <div className="pointer-events-none absolute -inset-y-1/2 inset-x-0 opacity-15 [transform-style:preserve-3d] [transform:rotateX(65deg)_scale(1.8)] bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-950 via-slate-950/80 to-transparent z-10" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        {/* Main Section Header - text + 3D robot mascot side by side */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-16 flex flex-col items-start gap-10 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="max-w-3xl">
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1.5 text-xs font-semibold text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <Sparkles className="size-3.5 text-emerald-400" />
              3D Live Telemetry
            </motion.div>

            <div className="mt-6">
              <SectionHeading
                eyebrow="Live Tech"
                title="The whole rescue loop, running in one system."
                description="Detection, matching, dispatch and reporting share the same real-time state — so nothing gets double-claimed and nothing expires in limbo."
              />
            </div>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
              <a
                href="#live-map"
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_10px_25px_rgba(16,185,129,0.3)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_15px_35px_rgba(16,185,129,0.45)] active:scale-[0.98]"
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

          {/* 3D robot mascot — right side of the header text, text sizes untouched */}
          <RobotMascot3D />
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
          className="mt-8"
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
          className="mt-8"
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
          className="mt-8"
        >
          <Card3D depth={15}>
            <ProcessStepper />
          </Card3D>
        </motion.div>
      </div>
    </section>
  );
}