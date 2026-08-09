"use client";

import { useRef } from "react";
import type { PointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useReducedMotion,
} from "framer-motion";
import { Aperture } from "lucide-react";

// Added high-quality food placeholder images to the detections
const DETECTIONS = [
  {
    label: "Pasta tray",
    box: "left-[6%] top-[12%] h-[36%] w-[40%]",
    delay: 0.2,
    img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=400&q=80",
  },
  {
    label: "Salad bowl",
    box: "right-[8%] top-[20%] h-[30%] w-[32%]",
    delay: 0.6,
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80",
  },
  {
    label: "Bread crate",
    box: "left-[26%] bottom-[10%] h-[30%] w-[38%]",
    delay: 1.0,
    img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
  },
];

export function VisionAiCard() {
  const cardRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const rawTiltX = useTransform(pointerY, [-0.5, 0.5], [10, -10]);
  const tiltX = useSpring(rawTiltX, { stiffness: 220, damping: 20, mass: 0.4 });
  const rawTiltY = useTransform(pointerX, [-0.5, 0.5], [-10, 10]);
  const tiltY = useSpring(rawTiltY, { stiffness: 220, damping: 20, mass: 0.4 });

  const glareX = useTransform(pointerX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(pointerY, [-0.5, 0.5], [0, 100]);
  const glareBackground = useTransform([glareX, glareY], (values) => {
    const [x, y] = values as number[];
    return `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.1), transparent 50%)`;
  });

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const scrollTiltX = useTransform(scrollYProgress, [0, 0.5, 1], [9, 0, -9]);
  const scrollLift = useTransform(scrollYProgress, [0, 0.5, 1], [26, 0, -26]);
  const bgParallax = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  const combinedRotateX = useTransform([tiltX, scrollTiltX], (values) => {
    const [pointer, scroll] = values as number[];
    return pointer + scroll;
  });

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <div style={{ perspective: 1200 }} className="h-full">
      <motion.article
        ref={cardRef}
        id="ai-vision"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={
          reduceMotion
            ? undefined
            : {
                rotateX: combinedRotateX,
                rotateY: tiltY,
                y: scrollLift,
                transformStyle: "preserve-3d",
              }
        }
        className="group relative flex h-full scroll-mt-28 flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-2xl will-change-transform sm:p-8"
      >
        <header
          style={reduceMotion ? undefined : { transform: "translateZ(32px)" }}
          className="mb-6 flex items-start justify-between gap-4"
        >
          <div>
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              <Aperture className="size-3" aria-hidden />
              Vision AI
            </span>
            <h3 className="text-2xl font-bold tracking-tight text-white">
              Point. Scan. Logged.
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">
              Kitchen staff photograph the pass. Multimodal inference returns
              portion counts, allergens and a safe shelf-life window in under
              two seconds.
            </p>
          </div>
          <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 font-mono text-[10px] font-medium text-red-400 sm:flex">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-red-500" />
            </span>
            REC 00:02
          </span>
        </header>

        {/* Mock viewfinder */}
        <div
          style={
            reduceMotion
              ? undefined
              : { transform: "translateZ(48px)", transformStyle: "preserve-3d" }
          }
          className="relative mt-auto aspect-16/9 overflow-hidden rounded-2xl border border-white/5 bg-slate-950 shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)]"
        >
          <motion.div
            aria-hidden
            style={reduceMotion ? undefined : { y: bgParallax }}
            className="absolute inset-0 ambient-grid opacity-30"
          />

          {DETECTIONS.map((d) => (
            <motion.div
              key={d.label}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: d.delay, duration: 0.45 }}
              className={`absolute flex items-center justify-center rounded-xl border-2 border-emerald-400/80 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.3)] backdrop-blur-sm overflow-hidden ${d.box}`}
            >
              {/* Added image rendering for the food items */}
              <img
                src={d.img}
                alt={d.label}
                className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-screen"
              />
              <span className="absolute -top-6 left-[-2px] whitespace-nowrap rounded-md bg-emerald-500 px-2 py-0.5 font-mono text-[10px] font-bold text-white shadow-lg">
                {d.label}
              </span>
            </motion.div>
          ))}

          <motion.div
            aria-hidden
            animate={reduceMotion ? undefined : { y: ["-20%", "120%"] }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-emerald-400/20 to-transparent border-b border-emerald-400/50 pointer-events-none"
          />

          <div className="absolute bottom-4 left-4 flex gap-4 rounded-xl border border-white/10 bg-slate-900/80 px-4 py-2.5 font-mono text-[10px] leading-relaxed text-white shadow-xl backdrop-blur-md">
            <div className="flex flex-col">
              <span className="text-slate-400 uppercase text-[8px] tracking-wider">
                Portion Count
              </span>
              <span className="font-bold text-emerald-400 text-xs">
                40 Units
              </span>
            </div>
            <div className="w-px bg-white/10" />
            <div className="flex flex-col">
              <span className="text-slate-400 uppercase text-[8px] tracking-wider">
                Shelf Life
              </span>
              <span className="font-bold text-emerald-400 text-xs">
                4.0 Hours
              </span>
            </div>
          </div>

          {!reduceMotion && (
            <motion.div
              aria-hidden
              style={{ background: glareBackground }}
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          )}
        </div>
      </motion.article>
    </div>
  );
}
