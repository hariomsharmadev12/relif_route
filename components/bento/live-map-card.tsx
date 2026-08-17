"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Building2,
  HeartHandshake,
  Navigation,
  Sparkles,
  Truck,
  Utensils,
  Zap,
} from "lucide-react";

const NODES = [
  {
    id: "donor-1",
    label: "Grand Palace Hotel",
    type: "Restaurant",
    detail: "45 kg surplus meals",
    top: "28%",
    left: "26%",
    icon: Utensils,
    color: "amber",
  },
  {
    id: "shelter-1",
    label: "Hope City Shelter",
    type: "NGO Partner",
    detail: "120 meals requested",
    top: "32%",
    left: "72%",
    icon: HeartHandshake,
    color: "emerald",
  },
  {
    id: "courier-1",
    label: "Eco Transit Van",
    type: "Express Courier",
    detail: "En route (8 mins away)",
    top: "65%",
    left: "48%",
    icon: Truck,
    color: "blue",
  },
  {
    id: "donor-2",
    label: "Central Bakery",
    type: "Food Vendor",
    detail: "18 kg bread & snacks",
    top: "74%",
    left: "22%",
    icon: Building2,
    color: "purple",
  },
] as const;

export function LiveMapCard() {
  return (
    <article className="group relative flex h-[350px] w-full flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl transition-all duration-500 sm:h-[380px] [perspective:1000px]">
      {/* 3D Ambient Lighting & Mesh Grids */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(16,185,129,0.18),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.15),transparent_50%)]" />

      {/* 3D Perspective Plane Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden [transform-style:preserve-3d]">
        <div className="absolute -inset-10 opacity-20 [transform:rotateX(50deg)_scale(1.4)] bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        
        {/* Holographic India Map Graphic Overlay */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/India_edcp_location_map.svg/1200px-India_edcp_location_map.svg.png"
          alt="India Rescue Network Map"
          aria-hidden
          loading="lazy"
          className="pointer-events-none absolute inset-0 h-full w-full object-contain object-center opacity-25 mix-blend-screen scale-110"
        />
      </div>

      {/* Header HUD Bar */}
      <div className="relative z-20 flex items-center justify-between p-5 pb-0">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-400 backdrop-blur-md">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative size-2 rounded-full bg-emerald-500" />
            </span>
            Real-Time Dispatch Matrix
          </span>
        </div>

        {/* Live Match Notification Banner */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 backdrop-blur-md sm:flex"
        >
          <Zap className="size-3.5 text-amber-400 animate-bounce" />
          <span>Auto-Matched: <strong>45kg Meals</strong> &rarr; <strong>NGO Hope</strong></span>
        </motion.div>
      </div>

      {/* Interactive 3D Telemetry Canvas */}
      <div className="relative z-10 flex-1 w-full [transform-style:preserve-3d]">
        {/* SVG Energy Flow Connection Paths */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none" aria-hidden>
          <defs>
            <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Restaurant to NGO Connection */}
          <motion.path
            d="M 26% 28% Q 48% 10%, 72% 32%"
            fill="none"
            stroke="url(#emeraldGradient)"
            strokeWidth="2.5"
            strokeDasharray="6 6"
            animate={{ strokeDashoffset: [0, -24] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />

          {/* Courier to Shelter Connection */}
          <motion.path
            d="M 48% 65% Q 60% 50%, 72% 32%"
            fill="none"
            stroke="rgba(59, 130, 246, 0.6)"
            strokeWidth="2"
          />

          {/* Bakery to Courier Connection */}
          <motion.path
            d="M 22% 74% Q 35% 70%, 48% 65%"
            fill="none"
            stroke="rgba(168, 85, 247, 0.5)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
        </svg>

        {/* Floating 3D Node Cards */}
        {NODES.map((node) => {
          const Icon = node.icon;
          return (
            <motion.div
              key={node.id}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1, zIndex: 30 }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{ top: node.top, left: node.left }}
            >
              {/* Glowing Ripple Under Node */}
              <span
                className={`absolute inset-0 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-md ${
                  node.color === "amber"
                    ? "bg-amber-500"
                    : node.color === "emerald"
                    ? "bg-emerald-500"
                    : node.color === "blue"
                    ? "bg-blue-500"
                    : "bg-purple-500"
                }`}
              />

              {/* Node Card Pill */}
              <div className="relative flex items-center gap-2 rounded-2xl border border-slate-700/80 bg-slate-900/90 px-3 py-1.5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-emerald-400">
                <div
                  className={`flex size-7 items-center justify-center rounded-xl text-white shadow-md ${
                    node.color === "amber"
                      ? "bg-gradient-to-tr from-amber-600 to-yellow-400"
                      : node.color === "emerald"
                      ? "bg-gradient-to-tr from-emerald-600 to-teal-400"
                      : node.color === "blue"
                      ? "bg-gradient-to-tr from-blue-600 to-cyan-400"
                      : "bg-gradient-to-tr from-purple-600 to-pink-400"
                  }`}
                >
                  <Icon className="size-3.5" />
                </div>

                <div className="flex flex-col text-left">
                  <span className="text-[11px] font-bold text-white leading-tight">
                    {node.label}
                  </span>
                  <span className="text-[9px] font-medium text-slate-400">
                    {node.detail}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Floating Bar */}
      <div className="relative z-20 m-4 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-3 backdrop-blur-lg">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Navigation className="size-4 text-emerald-400 animate-pulse" />
          <span>Active Food Rescue Grid • 142 NGOs & 310+ Restaurants Syncing</span>
        </div>

        <div className="hidden items-center gap-1.5 text-[11px] font-semibold text-emerald-400 sm:flex">
          <Sparkles className="size-3.5" />
          <span>Zero Food Waste Active</span>
        </div>
      </div>
    </article>
  );
}