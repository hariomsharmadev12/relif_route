"use client";

import { motion } from "framer-motion";
import { Activity, Leaf, Rocket, Users } from "lucide-react";

const GOAL = 100;
const CURRENT = 0; // wire this to real signups/pledges when you have them

export function ImpactTickerCard() {
  const progress = Math.min((CURRENT / GOAL) * 100, 100);

  return (
    <article className="glass relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-5 sm:p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-primary/12 blur-3xl"
      />

      <header className="relative mb-5">
        <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
          <Rocket className="size-3" aria-hidden />
          Just Launched
        </span>
        <h3 className="text-xl font-semibold tracking-tight">
          Be one of the first to keep food off the pile.
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          We're brand new — every meal saved from here starts with someone like
          you.
        </p>
      </header>

      {/* founding goal progress */}
      <div className="relative rounded-2xl border border-border bg-secondary/60 p-4">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Founding goal — first {GOAL} meals
          </p>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-primary">
            <Users className="size-3.5" aria-hidden />
            {CURRENT}/{GOAL}
          </span>
        </div>

        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-border/60">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${progress}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full bg-primary"
          />
        </div>

        <p className="mt-3 text-[13px] text-muted-foreground">
          {CURRENT === 0
            ? "Zero so far — meal #1 could be yours."
            : `${GOAL - CURRENT} meals to go until we hit our first milestone.`}
        </p>
      </div>

      {/* factual, non-fabricated impact stat */}
      <div className="relative mt-4 rounded-2xl border border-border bg-secondary/60 p-4">
        <div className="flex items-start gap-2.5">
          <Leaf className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">
              Every meal rescued
            </span>{" "}
            keeps roughly 2.5 kg of CO₂e out of the atmosphere — based on
            standard food-waste emission estimates, not our own data yet.
          </p>
        </div>
      </div>

      <div className="relative mt-5 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
        <Activity className="size-3.5" aria-hidden />
        Live counters turn on the moment our first meal is logged.
      </div>
    </article>
  );
}
