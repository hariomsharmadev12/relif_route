"use client";

import { motion } from "framer-motion";
import { Heart, Truck, Users, Navigation } from "lucide-react";

const NODES = [
  { id: 1, top: "22%", left: "45%", color: "emerald", delay: 0 },
  { id: 2, top: "38%", left: "30%", color: "blue", delay: 0.3 },
  { id: 3, top: "48%", left: "58%", color: "emerald", delay: 0.6 },
  { id: 4, top: "62%", left: "38%", color: "purple", delay: 0.9 },
  { id: 5, top: "70%", left: "55%", color: "blue", delay: 1.2 },
  { id: 6, top: "30%", left: "65%", color: "emerald", delay: 1.5 },
] as const;

const LINKS: [number, number][] = [
  [1, 2],
  [1, 3],
  [2, 4],
  [3, 5],
  [3, 6],
  [4, 5],
];

const NODE_COLOR: Record<string, string> = {
  emerald: "bg-emerald-400 text-emerald-400",
  blue: "bg-blue-400 text-blue-400",
  purple: "bg-purple-400 text-purple-400",
};

export function LiveMapCard() {
  const nodeMap = Object.fromEntries(NODES.map((n) => [n.id, n]));

  return (
    <article className="relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-xl">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/India_edcp_location_map.svg/1200px-India_edcp_location_map.svg.png"
        alt=""
        aria-hidden
        loading="lazy"
        className="pointer-events-none absolute inset-0 h-full w-full scale-125 select-none object-contain object-center opacity-30 mix-blend-screen"
      />
      <div aria-hidden className="absolute inset-0 ambient-grid opacity-20" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12),transparent_60%)]" />

      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        {LINKS.map(([a, b], i) => {
          const from = nodeMap[a];
          const to = nodeMap[b];
          return (
            <motion.line
              key={`${a}-${b}`}
              x1={from.left}
              y1={from.top}
              x2={to.left}
              y2={to.top}
              stroke="rgba(16,185,129,0.35)"
              strokeWidth={1.5}
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: i * 0.15 }}
            />
          );
        })}
      </svg>

      {NODES.map((node) => (
        <motion.span
          key={node.id}
          className={`absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_12px_3px_currentColor] ${NODE_COLOR[node.color]}`}
          style={{ top: node.top, left: node.left }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, delay: node.delay }}
        />
      ))}

      <motion.span
        className="absolute left-[45%] top-[10%] flex size-9 -translate-x-1/2 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
      >
        <Heart className="size-4 fill-white" aria-hidden />
      </motion.span>
      <motion.span
        className="absolute right-[12%] top-[42%] flex size-9 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg"
        animate={{ x: [0, 6, 0] }}
        transition={{ duration: 3.4, repeat: Number.POSITIVE_INFINITY }}
      >
        <Truck className="size-4" aria-hidden />
      </motion.span>
      <motion.span
        className="absolute bottom-[16%] left-[18%] flex size-9 items-center justify-center rounded-full bg-purple-500 text-white shadow-lg"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.8, repeat: Number.POSITIVE_INFINITY }}
      >
        <Users className="size-4" aria-hidden />
      </motion.span>

      <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-[11px] font-bold text-slate-200 backdrop-blur-md">
        <Navigation className="size-3.5 text-emerald-400" aria-hidden />
        Live rescue network across India
      </div>
    </article>
  );
}