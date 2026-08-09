"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  Camera,
  MapPin,
  ShieldCheck,
  Timer,
  Zap,
  Scan,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Truck,
  Building2,
  HeartHandshake,
  Heart,
} from "lucide-react";

const TRUST_POINTS = [
  { icon: Timer, label: "Avg. 11 min match time" },
  { icon: ShieldCheck, label: "HACCP-aligned handoffs" },
  { icon: MapPin, label: "PostGIS route solving" },
];

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001,
  });

  // Left column animations
  const leftRotateY = useTransform(smoothProgress, [0, 0.5, 1], [0, 6, 0]);
  const leftScale = useTransform(smoothProgress, [0, 0.5, 1], [1, 0.98, 0.94]);
  const leftX = useTransform(smoothProgress, [0, 1], [0, -12]);
  const leftOpacity = useTransform(smoothProgress, [0.85, 1], [1, 0.55]);

  // --- 3D Character & Board Animations ---

  // Board lowers down & fades out (0% to 18%)
  const boardY = useTransform(smoothProgress, [0, 0.12, 0.2], [0, 110, 160]);
  const boardRotateX = useTransform(
    smoothProgress,
    [0, 0.12, 0.2],
    [0, 25, 45],
  );
  const boardScale = useTransform(
    smoothProgress,
    [0, 0.12, 0.2],
    [1, 0.9, 0.7],
  );
  const boardOpacity = useTransform(smoothProgress, [0.1, 0.18], [1, 0]);

  // Boy position shifts
  const boyX = useTransform(
    smoothProgress,
    [0.15, 0.3, 0.78, 0.88],
    [0, -90, -90, -40],
  );

  // Head rotate: normal -> side turn -> gentle Namaste bow head tilt (+12 deg)
  const boyHeadRotate = useTransform(
    smoothProgress,
    [0, 0.2, 0.5, 0.78, 0.88],
    [0, -4, 4, 6, 12],
  );
  const boyEyeLookX = useTransform(
    smoothProgress,
    [0, 0.2, 0.78, 0.88],
    [0, 4, 4, 0],
  );

  // --- Arm Animations (Holding board -> Presenting -> Namaskar folded hands) ---
  const leftArmRotate = useTransform(
    smoothProgress,
    [0, 0.2, 0.5, 0.78, 0.88],
    [0, 15, 30, 30, 72],
  );
  const rightArmRotate = useTransform(
    smoothProgress,
    [0, 0.2, 0.5, 0.78, 0.88],
    [0, -35, -70, -70, -72],
  );

  // Talking Mouth Animation (Active during steps 1-3, stops during Namaskar)
  const mouthRy = useTransform(smoothProgress, (v) => {
    if (v < 0.18 || v > 0.78) return 0;
    return Math.abs(Math.sin(v * 75)) * 5;
  });
  const mouthCy = useTransform(mouthRy, (ry) => 163 + ry);

  // Speech indicator beam opacity
  const beamOpacity = useTransform(
    smoothProgress,
    [0.2, 0.25, 0.75, 0.8],
    [0, 1, 1, 0],
  );

  // --- Sequential Explanation Cards (Steps 1 to 3 + Final Namaskar Welcome) ---
  const card1Opacity = useTransform(
    smoothProgress,
    [0.2, 0.25, 0.36, 0.41],
    [0, 1, 1, 0],
  );
  const card1Y = useTransform(
    smoothProgress,
    [0.2, 0.25, 0.36, 0.41],
    [35, 0, 0, -25],
  );
  const card1Scale = useTransform(
    smoothProgress,
    [0.2, 0.25, 0.36, 0.41],
    [0.88, 1, 1, 0.92],
  );

  const card2Opacity = useTransform(
    smoothProgress,
    [0.41, 0.46, 0.56, 0.61],
    [0, 1, 1, 0],
  );
  const card2Y = useTransform(
    smoothProgress,
    [0.41, 0.46, 0.56, 0.61],
    [35, 0, 0, -25],
  );
  const card2Scale = useTransform(
    smoothProgress,
    [0.41, 0.46, 0.56, 0.61],
    [0.88, 1, 1, 0.92],
  );

  const card3Opacity = useTransform(
    smoothProgress,
    [0.61, 0.66, 0.75, 0.8],
    [0, 1, 1, 0],
  );
  const card3Y = useTransform(
    smoothProgress,
    [0.61, 0.66, 0.75, 0.8],
    [35, 0, 0, -25],
  );
  const card3Scale = useTransform(
    smoothProgress,
    [0.61, 0.66, 0.75, 0.8],
    [0.88, 1, 1, 0.92],
  );

  const card4Opacity = useTransform(
    smoothProgress,
    [0.8, 0.86, 1.0],
    [0, 1, 1],
  );
  const card4Y = useTransform(smoothProgress, [0.8, 0.86, 1.0], [35, 0, 0]);
  const card4Scale = useTransform(
    smoothProgress,
    [0.8, 0.86, 1.0],
    [0.88, 1, 1],
  );

  return (
    <section
      id="top"
      ref={containerRef}
      className="relative h-[320vh] w-full overflow-clip bg-background"
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden pt-12 sm:pt-0">
        {/* Background ambient elements */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_32%),radial-gradient(circle_at_center,rgba(34,197,94,0.08),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 ambient-grid opacity-60" />
        <div className="pointer-events-none absolute -top-44 left-1/4 size-[46rem] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[140px]" />
        <div className="pointer-events-none absolute top-1/3 right-1/5 size-[38rem] rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-background" />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.02fr_1fr] lg:gap-16">
          {/* Left Column Text Content */}
          <motion.div
            style={{
              rotateY: leftRotateY,
              scale: leftScale,
              x: leftX,
              opacity: leftOpacity,
              perspective: 1200,
            }}
            className="relative z-10 flex flex-col justify-center space-y-7"
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex"
            >
              <span className="glass flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-xl">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
                </span>
                <Zap className="size-3.5 text-emerald-400" aria-hidden />
                Real-time surplus rescue network
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="max-w-3xl text-balance text-5xl font-semibold leading-[1.02] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
            >
              Zero Food Waste.{" "}
              <span className="text-gradient-emerald">Instant Rescue.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="max-w-xl text-pretty text-lg leading-relaxed text-slate-600 dark:text-muted-foreground sm:text-xl"
            >
              Instantly match fresh surplus meals from kitchens and events to
              nearby shelters, volunteers, and communities before food goes to
              waste.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.26 }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <motion.a
                href="./donor-login"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-shadow hover:shadow-primary/30"
              >
                <Camera className="size-4.5" aria-hidden />
                I Have Surplus Food
                <ArrowRight className="size-4" />
              </motion.a>

              <motion.a
                href="./volunteer-login"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="glass inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-100 bg-white/5 px-6 py-4 text-sm font-semibold text-foreground backdrop-blur-xl transition-colors hover:bg-white/10 dark:border-border"
              >
                <MapPin className="size-4.5 text-emerald-400" aria-hidden />I
                Need Food / Volunteer
              </motion.a>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.34 }}
              className="flex flex-wrap gap-x-6 gap-y-3 pt-2"
            >
              {TRUST_POINTS.map((point) => (
                <li
                  key={point.label}
                  className="flex items-center gap-2 text-xs font-medium text-muted-foreground"
                >
                  <point.icon className="size-4 text-emerald-400" aria-hidden />
                  <span>{point.label}</span>
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Right Column: 3D Boy Presenter Area */}
          <div className="relative flex h-[580px] w-full items-center justify-center perspective-[1200px]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08),transparent_60%)]" />

            {/* Glowing beam from character to explainer cards */}
            <motion.div
              style={{ opacity: beamOpacity, x: boyX }}
              className="pointer-events-none absolute z-10 h-32 w-64 translate-x-28 bg-gradient-to-r from-emerald-500/20 via-primary/10 to-transparent blur-xl"
            />

            {/* Boy Character & Held Board Wrapper */}
            <motion.div
              style={{ x: boyX }}
              className="relative z-20 flex flex-col items-center justify-center"
            >
              {/* Initial 3D Held Board */}
              <motion.div
                style={{
                  y: boardY,
                  rotateX: boardRotateX,
                  scale: boardScale,
                  opacity: boardOpacity,
                  transformOrigin: "bottom center",
                }}
                className="relative z-30 mb-[-28px] flex items-center justify-center"
              >
                <div className="glass flex items-center gap-3 rounded-2xl border-2 border-emerald-400/80 bg-gradient-to-b from-white/90 to-emerald-50/90 px-6 py-4 shadow-[0_20px_50px_rgba(16,185,129,0.35)] backdrop-blur-2xl dark:from-slate-900/90 dark:to-emerald-950/90">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Welcome to
                    </span>
                    <h2 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                      RELIEF<span className="text-emerald-500">ROUTE</span>
                    </h2>
                  </div>
                </div>
              </motion.div>

              {/* 3D Stylized Vector Character SVG */}
              <motion.div className="relative size-72 sm:size-80">
                <svg
                  viewBox="0 0 300 320"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-full drop-shadow-[0_25px_35px_rgba(0,0,0,0.25)]"
                >
                  <defs>
                    <radialGradient id="skinGrad" cx="35%" cy="30%" r="65%">
                      <stop offset="0%" stopColor="#FFE3D1" />
                      <stop offset="65%" stopColor="#F5B995" />
                      <stop offset="100%" stopColor="#D98A62" />
                    </radialGradient>

                    <radialGradient id="hairGrad" cx="40%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#334155" />
                      <stop offset="70%" stopColor="#1E293B" />
                      <stop offset="100%" stopColor="#0F172A" />
                    </radialGradient>

                    <linearGradient
                      id="hoodieGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="50%" stopColor="#059669" />
                      <stop offset="100%" stopColor="#047857" />
                    </linearGradient>

                    <radialGradient id="eyeGrad" cx="35%" cy="35%" r="60%">
                      <stop offset="0%" stopColor="#0284C7" />
                      <stop offset="80%" stopColor="#0369A1" />
                      <stop offset="100%" stopColor="#0C4A6E" />
                    </radialGradient>
                  </defs>

                  {/* Body & Clothes */}
                  <g id="torso">
                    <path
                      d="M 60 260 C 60 210, 240 210, 240 260 L 255 320 L 45 320 Z"
                      fill="url(#hoodieGrad)"
                    />
                    <path
                      d="M 130 225 L 170 225 L 160 320 L 140 320 Z"
                      fill="#F8FAFC"
                    />
                    <path
                      d="M 150 225 L 150 320"
                      stroke="#CBD5E1"
                      strokeWidth="3"
                    />

                    <path
                      d="M 105 210 Q 130 230, 140 255"
                      stroke="#047857"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 195 210 Q 170 230, 160 255"
                      stroke="#047857"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  </g>

                  {/* Left Arm (Folds into center for Namaskar) */}
                  <motion.g
                    id="leftArm"
                    style={{
                      rotate: leftArmRotate,
                      transformOrigin: "80px 220px",
                    }}
                  >
                    <path
                      d="M 75 220 Q 40 240, 65 270"
                      stroke="url(#hoodieGrad)"
                      strokeWidth="32"
                      strokeLinecap="round"
                    />
                    <circle cx="68" cy="272" r="15" fill="url(#skinGrad)" />
                  </motion.g>

                  {/* Right Arm (Folds into center for Namaskar) */}
                  <motion.g
                    id="rightArm"
                    style={{
                      rotate: rightArmRotate,
                      transformOrigin: "220px 220px",
                    }}
                  >
                    <path
                      d="M 225 220 Q 260 240, 235 270"
                      stroke="url(#hoodieGrad)"
                      strokeWidth="32"
                      strokeLinecap="round"
                    />
                    <circle cx="232" cy="272" r="15" fill="url(#skinGrad)" />
                  </motion.g>

                  {/* Head Assembly */}
                  <motion.g
                    id="headGroup"
                    style={{
                      rotate: boyHeadRotate,
                      transformOrigin: "150px 150px",
                    }}
                  >
                    <ellipse
                      cx="150"
                      cy="205"
                      rx="28"
                      ry="12"
                      fill="#D98A62"
                      opacity="0.6"
                    />
                    <path
                      d="M 132 180 L 168 180 L 164 210 L 136 210 Z"
                      fill="url(#skinGrad)"
                    />

                    <ellipse
                      cx="94"
                      cy="142"
                      rx="10"
                      ry="14"
                      fill="url(#skinGrad)"
                    />
                    <ellipse
                      cx="206"
                      cy="142"
                      rx="10"
                      ry="14"
                      fill="url(#skinGrad)"
                    />

                    <ellipse
                      cx="150"
                      cy="140"
                      rx="56"
                      ry="62"
                      fill="url(#skinGrad)"
                    />

                    <path
                      d="M 92 135 C 88 80, 212 80, 208 135 C 200 95, 180 75, 150 75 C 120 75, 100 95, 92 135 Z"
                      fill="url(#hairGrad)"
                    />
                    <path
                      d="M 100 110 C 120 90, 150 115, 185 98 C 160 82, 125 82, 100 110 Z"
                      fill="#475569"
                      opacity="0.5"
                    />

                    <path
                      d="M 118 118 Q 132 112, 138 118"
                      stroke="#1E293B"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 162 118 Q 168 112, 182 118"
                      stroke="#1E293B"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />

                    {/* Eyes */}
                    <g id="eyes">
                      <ellipse
                        cx="128"
                        cy="132"
                        rx="10"
                        ry="12"
                        fill="#FFFFFF"
                      />
                      <motion.ellipse
                        style={{ x: boyEyeLookX }}
                        cx="128"
                        cy="132"
                        rx="6"
                        ry="8"
                        fill="url(#eyeGrad)"
                      />
                      <circle cx="126" cy="129" r="2.5" fill="#FFFFFF" />

                      <ellipse
                        cx="172"
                        cy="132"
                        rx="10"
                        ry="12"
                        fill="#FFFFFF"
                      />
                      <motion.ellipse
                        style={{ x: boyEyeLookX }}
                        cx="172"
                        cy="132"
                        rx="6"
                        ry="8"
                        fill="url(#eyeGrad)"
                      />
                      <circle cx="170" cy="129" r="2.5" fill="#FFFFFF" />
                    </g>

                    <path
                      d="M 150 132 L 146 148 Q 150 152, 154 148 Z"
                      fill="#E29D7A"
                    />
                    <circle cx="150" cy="148" r="3" fill="#FAD1B8" />

                    <circle
                      cx="112"
                      cy="148"
                      r="8"
                      fill="#F43F5E"
                      opacity="0.18"
                    />
                    <circle
                      cx="188"
                      cy="148"
                      r="8"
                      fill="#F43F5E"
                      opacity="0.18"
                    />

                    {/* Talking Mouth Animation */}
                    <g id="mouth">
                      <motion.ellipse
                        cx="150"
                        rx="11"
                        style={{ cy: mouthCy, ry: mouthRy }}
                        fill="#3F1212"
                      />
                      <path
                        d="M 134 163 Q 150 166, 166 163"
                        stroke="#9A4323"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        fill="none"
                      />
                    </g>
                  </motion.g>
                </svg>
              </motion.div>
            </motion.div>

            {/* 
              Cards Container: 
              Using CSS Grid so all cards physically stack on top of each other exactly in the center.
            */}
            <div className="absolute -right-4 sm:-right-12 lg:-right-20 top-1/2 z-30 grid -translate-y-1/2 items-center justify-center">
              {/* Step 1: AI Camera Scan */}
              <motion.div
                style={{ opacity: card1Opacity, y: card1Y, scale: card1Scale }}
                className="col-start-1 row-start-1 glass w-72 sm:w-80 rounded-3xl border-2 border-emerald-400/50 bg-background/85 p-5 shadow-[0_20px_60px_rgba(16,185,129,0.2)] backdrop-blur-2xl"
              >
                <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                    <Scan className="size-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                      Step 1 • AI Vision
                    </span>
                    <h3 className="text-sm font-bold text-foreground">
                      Snap & Upload Surplus
                    </h3>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Kitchens simply snap a photo. AI instantly verifies meal
                  portions, freshness index, and HACCP compliance parameters.
                </p>
                <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span>AI Freshness Score</span>
                  <span className="font-mono">98% Perfect</span>
                </div>
              </motion.div>

              {/* Step 2: PostGIS Route Solving */}
              <motion.div
                style={{ opacity: card2Opacity, y: card2Y, scale: card2Scale }}
                className="col-start-1 row-start-1 glass w-72 sm:w-80 rounded-3xl border-2 border-blue-500/50 bg-background/85 p-5 shadow-[0_20px_60px_rgba(59,130,246,0.2)] backdrop-blur-2xl"
              >
                <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                    <Truck className="size-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
                      Step 2 • Smart Dispatch
                    </span>
                    <h3 className="text-sm font-bold text-foreground">
                      Optimal Route Solver
                    </h3>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  PostGIS algorithm calculates traffic, distance, and shelter
                  capacity to match nearest volunteer rider in real-time.
                </p>
                <div className="mt-3 flex items-center justify-between rounded-xl bg-blue-500/10 px-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <span>Matched Transit Time</span>
                  <span className="font-mono">8.4 Mins Away</span>
                </div>
              </motion.div>

              {/* Step 3: Verified Shelter Handoff */}
              <motion.div
                style={{ opacity: card3Opacity, y: card3Y, scale: card3Scale }}
                className="col-start-1 row-start-1 glass w-72 sm:w-80 rounded-3xl border-2 border-emerald-400/50 bg-background/85 p-5 shadow-[0_20px_60px_rgba(16,185,129,0.25)] backdrop-blur-2xl"
              >
                <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                    <Building2 className="size-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                      Step 3 • Zero Waste
                    </span>
                    <h3 className="text-sm font-bold text-foreground">
                      Community Handoff
                    </h3>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Meals are delivered safely to verified local shelters,
                  nourishing families with total transparency and zero waste.
                </p>
                <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="size-3.5" /> Verified Impact
                  </span>
                  <span className="font-mono">24 Meals Rescued</span>
                </div>
              </motion.div>

              {/* Step 4: Final Namaste / Welcome Message Card */}
              <motion.div
                style={{ opacity: card4Opacity, y: card4Y, scale: card4Scale }}
                className="col-start-1 row-start-1 glass w-72 sm:w-80 rounded-3xl border-2 border-emerald-400/80 bg-gradient-to-b from-background/90 to-emerald-950/20 p-6 shadow-[0_25px_70px_rgba(16,185,129,0.3)] backdrop-blur-2xl"
              >
                <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md">
                    <HeartHandshake className="size-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                      Namaste 🙏
                    </span>
                    <h3 className="text-base font-extrabold text-foreground">
                      Welcome to the Movement
                    </h3>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Together, we can end food waste and bring fresh meals to
                  thousands. Join as a donor kitchen, volunteer rider, or
                  partner shelter today!
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg transition-transform hover:scale-105">
                  <Heart className="size-4 fill-white" />
                  <span>Start Rescuing Meals</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
