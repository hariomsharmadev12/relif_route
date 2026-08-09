"use client";

import { useRef } from "react";
import type { PointerEvent, ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useReducedMotion,
} from "framer-motion";
import { fadeUp, staggerContainer } from "@/components/motion-primitives";
import { AutomatedAlertsCard } from "@/components/bento/automated-alerts-card";
import { HeatmapRadarCard } from "@/components/bento/heatmap-radar-card";
import { ImpactTickerCard } from "@/components/bento/impact-ticker-card";
import { VisionAiCard } from "@/components/bento/vision-ai-card";
import { SectionHeading } from "@/components/section-heading";

function TiltGridItem({
  children,
  className,
  parallaxRange = 32,
}: {
  children: ReactNode;
  className?: string;
  parallaxRange?: number;
}) {
  const itemRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const tiltX = useSpring(useTransform(pointerY, [-0.5, 0.5], [8, -8]), {
    stiffness: 240,
    damping: 22,
  });
  const tiltY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 240,
    damping: 22,
  });

  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    [parallaxRange, -parallaxRange],
  );

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
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
    <motion.div
      variants={fadeUp}
      className={className}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={itemRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={
          reduceMotion
            ? undefined
            : {
                rotateX: tiltX,
                rotateY: tiltY,
                y: parallaxY,
                transformStyle: "preserve-3d",
              }
        }
        className="h-full will-change-transform"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function BentoShowcase() {
  return (
    <section className="relative w-full overflow-hidden bg-slate-950 py-20 text-white sm:py-32">
      {/* Dark mode ambient glowing background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.1),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 ambient-grid opacity-20" />

      {/* Top fade transition from the Marquee */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Note: Ensure your SectionHeading component inherits the white text! */}
        <SectionHeading
          eyebrow="Live Tech"
          title="The whole rescue loop, running in one system."
          description="Detection, matching, dispatch and reporting share the same real-time state — so nothing gets double-claimed and nothing expires in limbo."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          style={{ perspective: 1400 }}
          className="mt-16 grid gap-4 sm:gap-6 lg:grid-cols-5"
        >
          <motion.div variants={fadeUp} className="lg:col-span-3">
            <VisionAiCard />
          </motion.div>
          <TiltGridItem className="lg:col-span-2" parallaxRange={36}>
            <HeatmapRadarCard />
          </TiltGridItem>
          <TiltGridItem className="lg:col-span-2" parallaxRange={36}>
            <AutomatedAlertsCard />
          </TiltGridItem>
          <TiltGridItem className="lg:col-span-3" parallaxRange={24}>
            <ImpactTickerCard />
          </TiltGridItem>
        </motion.div>
      </div>
    </section>
  );
}
