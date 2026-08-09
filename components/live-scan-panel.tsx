'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Clock3, ScanLine, Sparkles, Utensils } from 'lucide-react'
import { StatusDot } from '@/components/motion-primitives'

type Box = {
  id: string
  label: string
  confidence: number
  style: string
  delay: number
}

const BOXES: Box[] = [
  { id: 'rice', label: 'Steamed rice', confidence: 0.97, style: 'left-[8%] top-[16%] h-[30%] w-[34%]', delay: 0.5 },
  { id: 'veg', label: 'Roast veg', confidence: 0.93, style: 'right-[10%] top-[22%] h-[26%] w-[30%]', delay: 0.9 },
  { id: 'bread', label: 'Bread rolls', confidence: 0.89, style: 'left-[22%] bottom-[14%] h-[26%] w-[32%]', delay: 1.3 },
]

export function LiveScanPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="glass relative rounded-3xl p-3 shadow-xl sm:p-4"
      style={{ perspective: 1200 }}
    >
      {/* Panel header */}
      <div className="flex items-center justify-between gap-3 px-1.5 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary/12 text-primary">
            <ScanLine className="size-4" />
          </span>
          <div className="leading-tight">
            <p className="text-xs font-semibold">Gemini Vision Scan</p>
            <p className="font-mono text-[10px] text-muted-foreground">session_ba91 · device: pwa</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <StatusDot />
          Live
        </span>
      </div>

      {/* Viewfinder */}
      <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-border bg-secondary">
        <Image
          src="/images/surplus-tray-scan.png"
          alt="Overhead view of surplus prepared food in commercial kitchen trays being scanned"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 560px"
          className="object-cover"
        />

        {/* scanning sweep */}
        <motion.div
          aria-hidden
          initial={{ y: '-10%' }}
          animate={{ y: ['-10%', '110%', '-10%'] }}
          transition={{ duration: 5.2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
          className="pointer-events-none absolute inset-x-0 h-24 bg-linear-to-b from-transparent via-primary/25 to-transparent"
        >
          <span className="absolute bottom-0 left-0 h-px w-full bg-primary/80 shadow-[0_0_16px_2px_var(--primary)]" />
        </motion.div>

        {/* corner reticles */}
        <span aria-hidden className="absolute left-3 top-3 size-5 border-l-2 border-t-2 border-primary/70" />
        <span aria-hidden className="absolute right-3 top-3 size-5 border-r-2 border-t-2 border-primary/70" />
        <span aria-hidden className="absolute bottom-3 left-3 size-5 border-b-2 border-l-2 border-primary/70" />
        <span aria-hidden className="absolute bottom-3 right-3 size-5 border-b-2 border-r-2 border-primary/70" />

        {/* detection boxes */}
        {BOXES.map((box) => (
          <motion.div
            key={box.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: box.delay, duration: 0.5, ease: 'easeOut' }}
            className={`absolute rounded-lg border-2 border-primary/80 bg-primary/8 ${box.style}`}
          >
            <span className="absolute -top-6 left-0 flex items-center gap-1 whitespace-nowrap rounded-md bg-primary px-1.5 py-0.5 font-mono text-[10px] font-semibold text-primary-foreground">
              {box.label} · {(box.confidence * 100).toFixed(0)}%
            </span>
          </motion.div>
        ))}

        {/* JSON output overlay */}
        <motion.pre
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.7, duration: 0.6 }}
          className="glass absolute bottom-3 right-3 hidden max-w-[62%] overflow-hidden rounded-xl p-3 font-mono text-[10px] leading-relaxed text-foreground/90 sm:block"
        >
          {`{
  "portion_count": 40,
  "categories": ["grain","veg","protein"],
  "allergens": ["gluten"],
  "shelf_life_hours": 4,
  "temp_state": "hot_hold",
  "route_eta_min": 11
}`}
        </motion.pre>
      </div>

      {/* Readout strip */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { icon: Utensils, label: 'Portions', value: '40' },
          { icon: Clock3, label: 'Shelf life', value: '4h' },
          { icon: Sparkles, label: 'Confidence', value: '96%' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-secondary/60 px-3 py-2.5">
            <stat.icon className="mb-1.5 size-4 text-primary" aria-hidden />
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{stat.label}</p>
            <p className="text-sm font-semibold tabular-nums">{stat.value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
