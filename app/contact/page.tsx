'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Mail, Send } from 'lucide-react'

const CONTACT_EMAIL = 'hariomsharmasvs@gmail.com' // replace with your real inbox

const ROLES = ['Kitchen', 'Shelter', 'Volunteer', 'Other'] as const

export default function ContactPage() {
  const reduceMotion = useReducedMotion()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<(typeof ROLES)[number]>('Kitchen')
  const [message, setMessage] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const subject = encodeURIComponent(`ReliefRoute contact — ${role}`)
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nRole: ${role}\n\n${message}`,
    )
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        Back to ReliefRoute
      </Link>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">Get in touch</h1>
      <p className="mt-3 max-w-lg text-pretty text-sm leading-relaxed text-muted-foreground">
        We're a small, pre-launch team, so a message here reaches a real person — not a support
        queue. Tell us who you are and what you need.
      </p>

      <motion.form
        onSubmit={handleSubmit}
        initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="glass mt-10 space-y-5 rounded-3xl border border-border p-6 sm:p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none ring-primary/40 transition-shadow focus:ring-2"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none ring-primary/40 transition-shadow focus:ring-2"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">I'm reaching out as a</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {ROLES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  role === r
                    ? 'border-primary bg-primary/10 text-accent-foreground'
                    : 'border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="message" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Message
          </label>
          <textarea
            id="message"
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1.5 w-full resize-none rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none ring-primary/40 transition-shadow focus:ring-2"
            placeholder="What can we help with?"
          />
        </div>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 sm:w-auto"
        >
          <Send className="size-4" aria-hidden />
          Open in email
        </button>
        <p className="text-xs text-muted-foreground">
          This opens your email app with the message pre-filled — we don't have a support inbox
          wired up on the site yet.
        </p>
      </motion.form>

      <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Mail className="size-4" aria-hidden />
        Or reach us directly at{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-foreground underline underline-offset-4">
          {CONTACT_EMAIL}
        </a>
      </div>
    </main>
  )
}