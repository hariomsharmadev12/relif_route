"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChefHat, Truck, HandHeart, Heart, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

const STOPS = [
  {
    id: "kitchen",
    icon: ChefHat,
    title: "Surplus gets logged",
    body: "A kitchen posts what\u2019s left over before it goes to waste.",
    left: "9%",
    top: "68%",
  },
  {
    id: "transit",
    icon: Truck,
    title: "A volunteer claims it",
    body: "The nearest runner picks up the batch on their route.",
    left: "50%",
    top: "26%",
  },
  {
    id: "shelter",
    icon: HandHeart,
    title: "It reaches someone",
    body: "Delivered warm, straight into hands that needed it.",
    left: "91%",
    top: "68%",
  },
] as const;

// keyframe points sampled along the S-curve below, used to move the marker
const MARKER_CX = [70, 160, 350, 520, 630];
const MARKER_CY = [180, 108, 78, 108, 180];

const HEARTS = [
  { delay: 0, x: -8 },
  { delay: 1.4, x: 6 },
  { delay: 2.8, x: -2 },
];

export function DispatchConsole() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="dispatch"
      className="relative mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28"
    >
      <SectionHeading
        eyebrow="How it works"
        title="One meal, three hands."
        description="what actually happens between a kitchen with extra food and a shelter that needs it."
      />

      {/* Updated Background: Sleek Dark Glassmorphism */}
      <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 relative mt-12 overflow-hidden rounded-3xl p-6 shadow-2xl sm:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 -top-24 size-64 rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 bottom-0 size-56 rounded-full bg-chart-4/10 blur-3xl"
        />

        {/* animated route scene - desktop / tablet */}
        <div className="relative hidden aspect-[700/260] w-full sm:block">
          <svg
            viewBox="0 0 700 260"
            className="absolute inset-0 h-full w-full"
            aria-hidden
          >
            <defs>
              <linearGradient id="routeLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
                <stop
                  offset="50%"
                  stopColor="currentColor"
                  stopOpacity="0.45"
                />
                <stop
                  offset="100%"
                  stopColor="currentColor"
                  stopOpacity="0.15"
                />
              </linearGradient>
              <radialGradient id="markerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* base path */}
            <path
              d="M70,180 C160,60 260,60 350,80 C440,100 540,100 630,180"
              fill="none"
              stroke="url(#routeLine)"
              strokeWidth="2"
              className="text-foreground"
            />

            {/* flowing dashes on top for a sense of motion */}
            <motion.path
              d="M70,180 C160,60 260,60 350,80 C440,100 540,100 630,180"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="1 14"
              className="text-primary"
              animate={
                reduceMotion ? undefined : { strokeDashoffset: [0, -60] }
              }
              transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
            />

            {/* glow trail behind the marker */}
            <motion.circle
              r="14"
              fill="url(#markerGlow)"
              className="text-primary"
              animate={
                reduceMotion
                  ? { cx: MARKER_CX[2], cy: MARKER_CY[2] }
                  : { cx: MARKER_CX, cy: MARKER_CY }
              }
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* the traveling meal marker */}
            <motion.circle
              r="5"
              fill="currentColor"
              className="text-primary"
              animate={
                reduceMotion
                  ? { cx: MARKER_CX[2], cy: MARKER_CY[2] }
                  : { cx: MARKER_CX, cy: MARKER_CY }
              }
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* node anchors */}
            {[
              [70, 180],
              [350, 80],
              [630, 180],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="4" className="fill-border" />
            ))}
          </svg>

          {/* floating hearts near the shelter node, ambient only */}
          <div
            className="pointer-events-none absolute"
            style={{ left: "91%", top: "52%" }}
          >
            {!reduceMotion &&
              HEARTS.map((h, i) => (
                <motion.span
                  key={i}
                  className="absolute -translate-x-1/2"
                  initial={{ opacity: 0, y: 0, x: h.x }}
                  animate={{ opacity: [0, 1, 0], y: -34 }}
                  transition={{
                    duration: 2.6,
                    repeat: Infinity,
                    delay: h.delay,
                    ease: "easeOut",
                  }}
                >
                  <Heart
                    className="size-3 fill-primary text-primary"
                    aria-hidden
                  />
                </motion.span>
              ))}
          </div>

          {/* node cards */}
          {STOPS.map((stop, index) => (
            <motion.div
              key={stop.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="absolute w-44 -translate-x-1/2 text-center sm:w-52"
              style={{ left: stop.left, top: stop.top }}
            >
              {/* Updated Background: Dark Inner Node */}
              <motion.div
                animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.4,
                }}
                className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl border border-white/5 bg-zinc-950/80 shadow-sm backdrop-blur"
              >
                <stop.icon className="size-5 text-primary" aria-hidden />
              </motion.div>
              <p className="text-sm font-semibold tracking-tight text-foreground">
                {stop.title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {stop.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* mobile fallback: simple honest stacked steps, no cramped SVG */}
        <div className="flex flex-col gap-3 sm:hidden">
          {STOPS.map((stop, index) => (
            <div key={stop.id}>
              {/* Updated Background: Dark Mobile Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 rounded-2xl border border-white/5 bg-zinc-900/80 p-4"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <stop.icon className="size-4.5 text-primary" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {stop.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {stop.body}
                  </p>
                </div>
              </motion.div>
              {index < STOPS.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowRight
                    className="size-3.5 rotate-90 text-muted-foreground"
                    aria-hidden
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
