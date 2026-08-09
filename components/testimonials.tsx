"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChefHat,
  Home,
  Truck,
  Sparkles,
} from "lucide-react";
import { fadeUp, staggerContainer } from "@/components/motion-primitives";
import { SectionHeading } from "@/components/section-heading";

// NOTE: content intentionally has no invented names/quotes/usage stats —
// swap these for real testimonials once you have real users.
const CARDS = [
  {
    tag: "For kitchens",
    icon: ChefHat,
    title: "Surplus doesn\u2019t have to mean waste",
    body: "Kitchens tell us the same thing: pans go in the bin because no one can collect them before close. The claim-and-route flow exists to close exactly that gap.",
  },
  {
    tag: "For shelters",
    icon: Home,
    title: "Know what\u2019s coming, before it arrives",
    body: "Shelters need to trust what shows up \u2014 what it is, how long it\u2019s safe, and when. Every batch carries that information from the first scan.",
  },
  {
    tag: "For volunteers",
    icon: Truck,
    title: "A pickup that fits your commute",
    body: "Volunteering shouldn\u2019t require a free evening. One tap claims a nearby run, with routing and a signature at the door.",
  },
  {
    tag: "For everyone",
    icon: Sparkles,
    title: "Built to survive a dinner rush",
    body: "Every screen is designed around real kitchen chaos \u2014 fast taps, big buttons, nothing that slows a rush hour down.",
  },
] as const;

function ReviewCard({
  card,
  index,
}: {
  card: (typeof CARDS)[number];
  index: number;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(900px) rotateX(${py * -6}deg) rotateY(${px * 6}deg)`;
  }

  function handleLeave() {
    if (!ref.current) return;
    ref.current.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg)";
  }

  return (
    <motion.div
      variants={fadeUp}
      className="w-[85%] shrink-0 snap-center sm:w-[360px]"
    >
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="glass flex h-full flex-col rounded-3xl p-6 shadow-md transition-transform duration-200 ease-out will-change-transform"
      >
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
          <card.icon className="size-3" aria-hidden />
          {card.tag}
        </span>
        <h3 className="mt-4 text-lg font-semibold leading-snug tracking-tight">
          {card.title}
        </h3>
        <p className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-muted-foreground">
          {card.body}
        </p>
        <div className="mt-5 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className="size-1.5 rounded-full bg-border"
              style={{ animationDelay: `${index * 0.1 + i * 0.05}s` }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateProgress = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const ratio = max > 0 ? el.scrollLeft / max : 0;
    setProgress(ratio);
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft > max - 8);
  }, []);

  useEffect(() => {
    updateProgress();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      el.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [updateProgress]);

  function scrollByCard(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]") as HTMLElement | null;
    const amount = (card?.offsetWidth ?? 320) + 16;
    el.scrollBy({ left: amount * dir, behavior: "smooth" });
  }

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Field notes"
          title="Built with the people doing the work."
          description="We haven't run a single rescue yet — these are the problems we keep hearing about, and what we're building to fix them."
        />

        {/* nav arrows, Apple-carousel style */}
        <div className="hidden shrink-0 gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={atStart}
            aria-label="Previous"
            className="flex size-10 items-center justify-center rounded-full border border-border bg-card/70 text-foreground transition-opacity disabled:opacity-30"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={atEnd}
            aria-label="Next"
            className="flex size-10 items-center justify-center rounded-full border border-border bg-card/70 text-foreground transition-opacity disabled:opacity-30"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>

      <motion.div
        ref={trackRef}
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="scrollbar-none mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
      >
        {CARDS.map((card, i) => (
          <div key={card.title} data-card>
            <ReviewCard card={card} index={i} />
          </div>
        ))}
      </motion.div>

      {/* scrubber progress bar, Apple-style */}
      <div className="mx-auto mt-6 h-1 w-40 overflow-hidden rounded-full bg-border/60">
        <motion.div
          className="h-full rounded-full bg-primary"
          animate={{ width: `${Math.max(progress * 100, 12)}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>
    </section>
  );
}
