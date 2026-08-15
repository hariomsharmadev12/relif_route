"use client";

import { motion } from "framer-motion";
import { Scan, GitMerge, Truck, PackageCheck, BarChart3, ChevronRight } from "lucide-react";

const STEPS = [
  { icon: Scan, label: "Detect" },
  { icon: GitMerge, label: "Match" },
  { icon: Truck, label: "Dispatch" },
  { icon: PackageCheck, label: "Deliver" },
  { icon: BarChart3, label: "Impact" },
];

export function ProcessStepper() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-5 sm:justify-between">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 sm:mr-2">
        From detection to impact — in real time.
      </span>
      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-1 sm:gap-2"
          >
            <div className="flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200">
              <step.icon className="size-3.5 text-emerald-400" aria-hidden />
              {i + 1}. {step.label}
            </div>
            {i < STEPS.length - 1 && (
              <ChevronRight className="size-3.5 text-slate-600" aria-hidden />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}