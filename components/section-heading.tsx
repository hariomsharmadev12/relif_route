'use client'

import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/components/motion-primitives'
import { cn } from '@/lib/utils'

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}
    >
      <motion.span
        variants={fadeUp}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
      >
        <span className="size-1.5 rounded-full bg-primary" />
        {eyebrow}
      </motion.span>
      <motion.h2
        variants={fadeUp}
        className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
      >
        {title}
      </motion.h2>
      {description ? (
        <motion.p
          variants={fadeUp}
          className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          {description}
        </motion.p>
      ) : null}
    </motion.div>
  )
}
