"use client";

import { motion } from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";
import { fadeUp, staggerContainer } from "@/components/motion-primitives";
import { AutomatedAlertsCard } from "@/components/bento/automated-alerts-card";
import { HeatmapRadarCard } from "@/components/bento/heatmap-radar-card";
import { ImpactTickerCard } from "@/components/bento/impact-ticker-card";
import { LiveMapCard } from "@/components/bento/live-map-card";
import { StatsRow } from "@/components/bento/stats-row";
import { ProcessStepper } from "@/components/bento/process-stepper";
import { SectionHeading } from "@/components/section-heading";

export function BentoShowcase() {
  return (
    <section className="relative w-full overflow-hidden bg-slate-950 py-20 text-white sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.1),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 ambient-grid opacity-20" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-5 lg:items-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="lg:col-span-2"
          >
            <SectionHeading
              eyebrow="Live Tech"
              title="The whole rescue loop, running in one system."
              description="Detection, matching, dispatch and reporting share the same real-time state — so nothing gets double-claimed and nothing expires in limbo."
            />
            <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-3">
              <a
                href="#live-map"
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-transform hover:scale-[1.02]"
              >
                <Compass className="size-4" aria-hidden />
                Explore Live Map
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/60 px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-800"
              >
                See How It Works
                <ArrowRight className="size-4" aria-hidden />
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-4 sm:grid-cols-5 lg:col-span-3"
          >
            <motion.div variants={fadeUp} className="sm:col-span-3">
              <LiveMapCard />
            </motion.div>
            <motion.div variants={fadeUp} className="sm:col-span-2">
              <HeatmapRadarCard />
            </motion.div>
          </motion.div>
        </div>

        <div className="mt-10">
          <StatsRow />
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-6 grid gap-4 sm:gap-6 lg:grid-cols-2"
        >
          <motion.div variants={fadeUp}>
            <AutomatedAlertsCard />
          </motion.div>
          <motion.div variants={fadeUp}>
            <ImpactTickerCard />
          </motion.div>
        </motion.div>

        <div className="mt-6">
          <ProcessStepper />
        </div>
      </div>
    </section>
  );
}