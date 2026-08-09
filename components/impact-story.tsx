"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Heart } from "lucide-react";
import {
  CountUp,
  fadeUp,
  staggerContainer,
} from "@/components/motion-primitives";

const METRICS = [
  {
    value: 0,
    suffix: "+",
    label: "Meals rescued so far — could be your first",
  },
  { value: 90, suffix: "%+", label: "Target: batches collected before expiry" },
  { value: 15, suffix: " min", label: "Goal: match-to-claim time" },
  { value: 0, suffix: "", label: "Kitchens & shelters onboarded — be #1" },
];

const HEARTS = [
  { delay: 0, x: -6 },
  { delay: 1.3, x: 8 },
  { delay: 2.6, x: -2 },
];

function GivingScene() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative h-full w-full bg-gradient-to-br from-primary/15 via-secondary/50 to-chart-4/10">
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full">
        {/* ground shadows */}
        <ellipse
          cx="140"
          cy="262"
          rx="44"
          ry="7"
          className="fill-foreground/10"
        />
        <ellipse
          cx="255"
          cy="266"
          rx="40"
          ry="6"
          className="fill-foreground/10"
        />
        <ellipse
          cx="332"
          cy="272"
          rx="26"
          ry="5"
          className="fill-foreground/10"
        />

        {/* ---- giver ---- */}
        <motion.g
          animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* legs */}
          <rect
            x="120"
            y="222"
            width="13"
            height="38"
            rx="6.5"
            className="fill-foreground/60"
          />
          <rect
            x="146"
            y="222"
            width="13"
            height="38"
            rx="6.5"
            className="fill-foreground/60"
          />
          {/* dress / body */}
          <path
            d="M114 160 L166 160 L180 224 L100 224 Z"
            className="fill-primary"
          />
          {/* trailing arm */}
          <path
            d="M116 168 Q100 186 106 210"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
            className="text-primary"
          />
          {/* offering arm, subtle reach animation */}
          <motion.path
            d="M164 166 Q198 156 214 184"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
            className="text-primary"
            animate={
              reduceMotion
                ? undefined
                : {
                    d: [
                      "M164 166 Q198 156 214 184",
                      "M164 166 Q200 152 218 180",
                      "M164 166 Q198 156 214 184",
                    ],
                  }
            }
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* head + hair */}
          <circle cx="140" cy="142" r="18" className="fill-foreground/80" />
          <path d="M122 140 a18 18 0 0 1 36 0 z" className="fill-foreground" />
          <circle cx="140" cy="118" r="5.5" className="fill-foreground" />
        </motion.g>

        {/* bowl of food */}
        <g>
          <ellipse
            cx="216"
            cy="184"
            rx="17"
            ry="4.5"
            className="fill-chart-4"
          />
          <path d="M199 184 Q216 202 233 184 Z" className="fill-chart-4/80" />
          {/* steam */}
          {[-8, 0, 8].map((offset, i) => (
            <motion.path
              key={i}
              d={`M${208 + offset} 176 Q${212 + offset} 164 ${208 + offset} 152`}
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              className="text-foreground/30"
              animate={
                reduceMotion
                  ? undefined
                  : { opacity: [0, 0.7, 0], y: [0, -10, -18] }
              }
              transition={{
                duration: 2.4,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeOut",
              }}
            />
          ))}
          {/* soft pulse glow marking the handoff */}
          <motion.circle
            cx="216"
            cy="186"
            r="26"
            className="fill-primary/15"
            animate={
              reduceMotion
                ? undefined
                : { scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }
            }
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </g>

        {/* ---- adult receiver ---- */}
        <motion.g
          animate={reduceMotion ? undefined : { y: [0, -3, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3,
          }}
        >
          <rect
            x="248"
            y="220"
            width="12"
            height="34"
            rx="6"
            className="fill-foreground/50"
          />
          <rect
            x="270"
            y="220"
            width="12"
            height="34"
            rx="6"
            className="fill-foreground/50"
          />
          <path
            d="M244 162 L288 162 L298 222 L234 222 Z"
            className="fill-chart-4"
          />
          {/* reaching arm toward bowl */}
          <motion.path
            d="M248 168 Q234 176 226 190"
            stroke="currentColor"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
            className="text-chart-4"
            animate={
              reduceMotion
                ? undefined
                : {
                    d: [
                      "M248 168 Q234 176 226 190",
                      "M248 168 Q232 172 222 186",
                      "M248 168 Q234 176 226 190",
                    ],
                  }
            }
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <path
            d="M286 168 Q296 182 290 202"
            stroke="currentColor"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
            className="text-chart-4"
          />
          <circle cx="266" cy="146" r="16" className="fill-foreground/80" />
          <path d="M250 144 a16 16 0 0 1 32 0 z" className="fill-foreground" />
        </motion.g>

        {/* ---- child receiver ---- */}
        <motion.g
          animate={reduceMotion ? undefined : { y: [0, -3, 0] }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.6,
          }}
        >
          <rect
            x="322"
            y="238"
            width="9"
            height="26"
            rx="4.5"
            className="fill-foreground/50"
          />
          <rect
            x="338"
            y="238"
            width="9"
            height="26"
            rx="4.5"
            className="fill-foreground/50"
          />
          <path
            d="M320 194 L350 194 L357 240 L313 240 Z"
            className="fill-primary/70"
          />
          <path
            d="M322 198 Q312 206 308 216"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            className="text-primary/70"
          />
          <circle cx="335" cy="182" r="12" className="fill-foreground/80" />
          <path d="M323 180 a12 12 0 0 1 24 0 z" className="fill-foreground" />
        </motion.g>
      </svg>

      {/* floating hearts near the handoff */}
      <div className="pointer-events-none absolute left-[54%] top-[52%]">
        {!reduceMotion &&
          HEARTS.map((h, i) => (
            <motion.span
              key={i}
              className="absolute -translate-x-1/2"
              initial={{ opacity: 0, y: 0, x: h.x }}
              animate={{ opacity: [0, 1, 0], y: -30 }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                delay: h.delay,
                ease: "easeOut",
              }}
            >
              <Heart className="size-3 fill-primary text-primary" aria-hidden />
            </motion.span>
          ))}
      </div>
    </div>
  );
}

function TiltPhotoCard() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const springCfg = { stiffness: 150, damping: 18, mass: 0.4 };
  const smx = useSpring(mx, springCfg);
  const smy = useSpring(my, springCfg);

  const rotateX = useTransform(smy, [0, 1], [8, -8]);
  const rotateY = useTransform(smx, [0, 1], [-8, 8]);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }

  function handleLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1200 }}
      className="relative"
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{
          rotateX: reduceMotion ? 0 : rotateX,
          rotateY: reduceMotion ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        className="glass relative overflow-hidden rounded-3xl p-2.5 shadow-xl"
      >
        <div className="relative aspect-4/3 overflow-hidden rounded-2xl">
          <GivingScene />
        </div>

        <div
          className="glass absolute bottom-5 left-5 right-5 rounded-2xl px-4 py-3 shadow-lg"
          style={{ transform: "translateZ(50px)" }}
        >
          <p className="text-xs font-semibold">
            Every handoff gets a signed record
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Surplus Food can be SOMEONE'S DINNER
          </p>
        </div>
      </motion.div>

      <motion.div
        animate={
          reduceMotion ? undefined : { y: [0, -8, 0], rotate: [-2, 2, -2] }
        }
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-4 -top-4 flex size-16 items-center justify-center rounded-2xl border border-border bg-card/90 shadow-lg backdrop-blur"
        style={{ transform: "translateZ(70px)" }}
      >
        <span className="text-[10px] font-bold uppercase leading-tight tracking-wider text-primary">
          Day
          <br />
          One
        </span>
      </motion.div>
    </motion.div>
  );
}

export function ImpactStory() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="impact"
      className="relative scroll-mt-24 overflow-hidden border-y border-border bg-secondary/30 py-20 sm:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 ambient-grid opacity-60"
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-primary/10 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-0 size-80 rounded-full bg-chart-4/10 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, -24, 0], y: [0, -16, 0] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
          >
            <motion.span
              className="size-1.5 rounded-full bg-primary"
              animate={
                reduceMotion
                  ? undefined
                  : { scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }
              }
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            Where we're starting
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
          >
            Every kilogram accounted for, every handoff signed.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground"
          >
            ReliefRoute logs an audit-ready record for every handoff from day
            one — built for grant reporting, ESG disclosure and municipal
            compliance, exportable as CSV or streamed over API.
          </motion.p>

          <motion.dl variants={fadeUp} className="mt-10 grid grid-cols-2 gap-4">
            {METRICS.map((metric) => (
              <motion.div
                key={metric.label}
                whileHover={reduceMotion ? undefined : { y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative overflow-hidden rounded-2xl p-4"
              >
                <div className="glass absolute inset-0 rounded-2xl" />
                <dd className="relative text-3xl font-semibold tracking-tight">
                  <CountUp value={metric.value} suffix={metric.suffix} />
                </dd>
                <dt className="relative mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {metric.label}
                </dt>
              </motion.div>
            ))}
          </motion.dl>
        </motion.div>

        <TiltPhotoCard />
      </div>
    </section>
  );
}
