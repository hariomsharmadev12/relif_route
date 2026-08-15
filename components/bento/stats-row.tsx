"use client";

import { motion } from "framer-motion";
import { Utensils, Truck, Building2, Target } from "lucide-react";

// Kept at 0 / — to match the "Just Launched" honesty theme running through
// the rest of the site. Swap these for real numbers once you have them.
const STATS = [
  { icon: Utensils, value: "0", label: "Meals Rescued Today" },
  { icon: Truck, value: "0", label: "Active Pickups Live" },
  { icon: Building2, value: "0", label: "Shelters Helped This Week" },
  { icon: Target, value: "—", label: "Match Accuracy" },
];

export function StatsRow() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
        >
          <stat.icon className="size-4 text-emerald-400" aria-hidden />
          <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
          <p className="text-xs text-slate-400">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}