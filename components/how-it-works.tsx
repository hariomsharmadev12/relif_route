'use client'

import { motion } from 'framer-motion'
import { Camera, HandHeart, Route, Sparkles } from 'lucide-react'
import { fadeUp, staggerContainer } from '@/components/motion-primitives'
import { SectionHeading } from '@/components/section-heading'

const STEPS = [
  {
    icon: Camera,
    step: '01',
    side: 'Donor',
    title: 'Snap the surplus',
    body: 'Two seconds on the pass. Vision AI classifies items, counts portions and flags allergens automatically.',
  },
  {
    icon: Sparkles,
    step: '02',
    side: 'System',
    title: 'Score the urgency',
    body: 'Shelf-life, temperature state and shelter demand combine into a live priority score for every batch.',
  },
  {
    icon: Route,
    step: '03',
    side: 'System',
    title: 'Solve the route',
    body: 'PostGIS finds the nearest capable recipient and a volunteer window that beats the expiry clock.',
  },
  {
    icon: HandHeart,
    step: '04',
    side: 'Recipient',
    title: 'Claim and collect',
    body: 'One tap locks the batch. Chain-of-custody photos close the loop with a verifiable receipt.',
  },
]

export function HowItWorks() {
  return (
    <section
      id="flow"
      className="relative mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28"
    >
      <SectionHeading
        eyebrow="Dual-sided flow"
        title="From full tray to fed table in four moves."
        description="Both sides of the marketplace run on the same clock. Every step is timestamped, auditable and reversible."
      />

      <motion.ol
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {STEPS.map((step) => (
          <motion.li key={step.step} variants={fadeUp}>
            <div className="glass group relative h-full overflow-hidden rounded-3xl p-5 transition-transform duration-300 hover:-translate-y-1">
              <span className="absolute right-4 top-4 font-mono text-xs text-muted-foreground/70">
                {step.step}
              </span>
              <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <step.icon className="size-5" aria-hidden />
              </span>
              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-foreground">
                {step.side}
              </p>
              <h3 className="mt-1 text-lg font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
              />
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  )
}
