"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Camera,
  MapPin,
  TrendingUp,
  Navigation,
} from "lucide-react";
import { fadeUp, staggerContainer } from "@/components/motion-primitives";

// Custom Floating Glass Card Component for Labels
const FloatingBadge = ({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    animate={{
      y: [0, -10, 0],
    }}
    transition={{
      y: { duration: 5, repeat: Infinity, delay, ease: "easeInOut" },
      opacity: { duration: 0.6 },
      scale: { duration: 0.6 },
    }}
    className={`absolute z-20 backdrop-blur-xl bg-zinc-900/80 border border-white/10 shadow-2xl rounded-2xl p-3 flex items-center gap-3 ${className}`}
  >
    {children}
  </motion.div>
);

// Custom component for the 3D floating effect
const FloatingItem = ({
  children,
  delay,
  className,
}: {
  children: React.ReactNode;
  delay: number;
  className: string;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    animate={{
      y: [0, -20, 0],
      x: [0, 8, 0],
      rotate: [0, 10, -5, 0],
    }}
    transition={{
      y: { duration: 6, repeat: Infinity, delay, ease: "easeInOut" },
      x: { duration: 7, repeat: Infinity, delay, ease: "easeInOut" },
      rotate: { duration: 8, repeat: Infinity, delay, ease: "easeInOut" },
      opacity: { duration: 0.8 },
      scale: { duration: 0.8, type: "spring" },
    }}
    // Heavy black drop-shadow to make the emojis look 3D against the dark background
    className={`absolute pointer-events-none drop-shadow-[0_25px_25px_rgba(0,0,0,0.8)] ${className}`}
  >
    {children}
  </motion.div>
);

export function LaunchCta() {
  return (
    // Changed to w-full to allow full edge-to-edge span
    <section id="launch" className="relative w-full mt-12">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        // Removed rounded corners and horizontal border constraints, added y-axis borders
        className="relative w-full overflow-hidden bg-zinc-950 border-y border-white/10 py-16 sm:py-20 lg:py-24 shadow-2xl"
      >
        {/* Soft Background Glow Effects */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[150px] translate-x-1/3 -translate-y-1/4"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 bottom-0 -z-10 h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[150px] -translate-x-1/3 translate-y-1/4"
        />

        {/* Noise Overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
          }}
        />

        {/* Inner Content Container to keep text constrained nicely while background spans infinitely */}
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-12">
          {/* Hero Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Text & CTAs */}
            <div className="lg:col-span-6 text-left">
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Onboarding in under 10 minutes
                </span>
              </motion.div>

              <motion.h2
                variants={fadeUp}
                className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl xl:text-6xl leading-[1.15]"
              >
                Tonight&apos;s surplus can still be{" "}
                <span className="relative text-emerald-400 underline decoration-emerald-500/50 underline-offset-8">
                  someone&apos;s dinner.
                </span>
              </motion.h2>

              <motion.p
                variants={fadeUp}
                className="mt-6 text-base sm:text-lg leading-relaxed text-zinc-400 max-w-lg"
              >
                Install the app, scan your first tray, and let the routing
                engine find the{" "}
                <span className="text-emerald-400 font-semibold">
                  fastest path
                </span>{" "}
                to a table near you.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                variants={fadeUp}
                className="mt-8 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center"
              >
                {/* Primary Green CTA */}
                <motion.a
                  href="./donor-login"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-5 py-3.5 transition-all shadow-lg shadow-emerald-500/20 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-zinc-950/10">
                      <Camera className="size-5 text-zinc-950" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold leading-tight">
                        I Have Surplus Food
                      </div>
                      <div className="text-[11px] text-zinc-900/70 font-medium">
                        Donate Food
                      </div>
                    </div>
                  </div>
                  <div className="p-1.5 rounded-full bg-zinc-950/10 group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight className="size-4 text-zinc-950" />
                  </div>
                </motion.a>

                {/* Secondary Dark CTA */}
                <motion.a
                  href="./volunteer-login"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 text-white px-5 py-3.5 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-500/20">
                      <MapPin className="size-5 text-purple-400" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold leading-tight">
                        I Need Food / Volunteer
                      </div>
                      <div className="text-[11px] text-zinc-400 font-medium">
                        Help Now
                      </div>
                    </div>
                  </div>
                  <div className="p-1.5 rounded-full bg-zinc-800 group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight className="size-4 text-zinc-400" />
                  </div>
                </motion.a>
              </motion.div>
            </div>

            {/* Right Column: 3D Illustration & Floating Badges */}
            <div className="lg:col-span-6 relative flex items-center justify-center min-h-[380px] sm:min-h-[460px]">
              {/* Badge 1: Live Impact */}
              <FloatingBadge className="top-2 left-2 sm:left-6" delay={0}>
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <TrendingUp className="size-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-zinc-200">
                    Live Impact
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    12,540 meals saved
                  </div>
                </div>
              </FloatingBadge>

              {/* Badge 2: AI Routing */}
              <FloatingBadge className="top-10 right-2 sm:right-6" delay={1}>
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Navigation className="size-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-zinc-200">
                    AI Routing
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Finding fastest path
                  </div>
                </div>
              </FloatingBadge>

              {/* Badge 3: Nearby Shelter */}
              <FloatingBadge className="bottom-8 right-4 sm:right-10" delay={2}>
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                  <MapPin className="size-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-zinc-200">
                    Nearby Shelter
                  </div>
                  <div className="text-[11px] text-zinc-400">2.4 km away</div>
                </div>
              </FloatingBadge>

              {/* 3D Food Box Container */}
              <div className="relative w-full max-w-sm sm:max-w-md aspect-square flex items-center justify-center">
                {/* Route line glowing path behind object */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none stroke-emerald-500/40"
                  viewBox="0 0 400 400"
                  fill="none"
                >
                  <path
                    d="M 60 300 C 140 380, 260 260, 340 310"
                    strokeWidth="3"
                    strokeDasharray="6 6"
                    className="animate-pulse"
                  />
                  <circle cx="340" cy="310" r="6" fill="#10b981" />
                </svg>

                {/* 3D Floating Foods using Emojis */}
                <div className="relative w-64 h-64">
                  <FloatingItem
                    delay={0}
                    className="top-4 left-4 text-7xl sm:text-8xl z-10"
                  >
                    🍔
                  </FloatingItem>
                  <FloatingItem
                    delay={1.5}
                    className="top-16 right-0 text-6xl sm:text-7xl z-10"
                  >
                    🥗
                  </FloatingItem>
                  <FloatingItem
                    delay={0.7}
                    className="bottom-8 left-12 text-6xl sm:text-7xl z-20"
                  >
                    🍱
                  </FloatingItem>
                  <FloatingItem
                    delay={2.2}
                    className="bottom-4 right-10 text-7xl sm:text-8xl z-0"
                  >
                    🍲
                  </FloatingItem>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
