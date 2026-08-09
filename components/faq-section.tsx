'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { SectionHeading } from '@/components/section-heading'

const FAQS = [
  {
    q: 'Is donating prepared food actually legal?',
    a: 'Yes. Good-faith food donation protections cover donors in most jurisdictions, and ReliefRoute records temperature state, timestamps and handoff photos so your compliance file writes itself.',
  },
  {
    q: 'How accurate is the vision model on mixed trays?',
    a: 'Portion counting lands within roughly 8% on mixed hot-hold trays. Staff can correct any field in one tap, and every correction feeds back into your location-specific calibration.',
  },
  {
    q: 'What happens if nobody claims a batch?',
    a: 'The urgency score escalates automatically — the radius widens, backup recipients get pinged, and if the expiry window closes the batch is routed to composting or animal-feed partners instead of landfill.',
  },
  {
    q: 'Do volunteers need a special vehicle?',
    a: 'No. Runs are sized to what a volunteer says they can carry, from a single insulated tote on a bike to a full van of hot pans.',
  },
  {
    q: 'Can it plug into our existing POS or inventory system?',
    a: 'Kitchen Pro and Municipal plans expose webhooks and a REST API, so surplus events can be pushed from your inventory system or pulled into your BI stack.',
  },
]

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="relative mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading eyebrow="Questions" title="Details that matter before you scan." align="center" />

      <ul className="mt-12 space-y-3">
        {FAQS.map((faq, index) => {
          const isOpen = open === index
          return (
            <li key={faq.q} className="glass overflow-hidden rounded-2xl">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-sm font-semibold sm:text-base">{faq.q}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground"
                >
                  <Plus className="size-3.5" aria-hidden />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
