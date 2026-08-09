import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service — ReliefRoute AI',
  description: 'The terms that govern use of the ReliefRoute AI platform.',
}

const SECTIONS = [
  {
    title: '1. Acceptance of these terms',
    body: `By creating an account or using ReliefRoute AI ("ReliefRoute," "we," "us"), you agree to these terms. If you're using ReliefRoute on behalf of an organization — a kitchen, shelter, or volunteer group — you're confirming you have the authority to accept these terms for that organization.`,
  },
  {
    title: '2. What ReliefRoute is',
    body: `ReliefRoute is a platform that connects kitchens with surplus food to nearby shelters and volunteers who can collect and deliver it. We are pre-launch: features, availability, and these terms will change as we build. We do not prepare, handle, or transport food ourselves — we connect the people who do.`,
  },
  {
    title: '3. Who can use it',
    body: `You must be at least 18 years old and acting in a professional or volunteer capacity for a kitchen, shelter, or delivery role. You're responsible for the accuracy of what you post — including food contents, quantities, and safe time windows.`,
  },
  {
    title: '4. Food safety responsibility',
    body: `ReliefRoute is a matching and logistics tool. We do not inspect, certify, or guarantee the safety of any food listed or transported through the platform. Kitchens are responsible for only listing food that's safe to donate, and for accurately representing its condition and expiry window. Shelters and volunteers are responsible for their own judgment about accepting and handling a given batch. Anyone using ReliefRoute should understand their local food-donation liability protections (for example, Good Samaritan food donation laws) — we'll point to relevant resources as we build this out, but this isn't legal advice.`,
  },
  {
    title: '5. Volunteer conduct',
    body: `Volunteers agree to complete claimed pickups reliably, communicate honestly about delays, and treat kitchen and shelter staff with respect. Repeated no-shows or unsafe handling may result in account suspension.`,
  },
  {
    title: '6. Account suspension',
    body: `We may suspend or terminate accounts that misuse the platform, misrepresent food safety information, or behave abusively toward other users. We'll aim to communicate clearly before doing so, except where safety requires immediate action.`,
  },
  {
    title: '7. "As is" service, no warranty',
    body: `ReliefRoute is provided "as is," especially at this early stage. We don't guarantee the platform will be uninterrupted, error-free, or that a match will always be available. To the fullest extent permitted by law, we disclaim warranties beyond what's legally required.`,
  },
  {
    title: '8. Limitation of liability',
    body: `To the extent permitted by law, ReliefRoute is not liable for losses arising from food quality, spoilage, handling, or delivery carried out by users of the platform. Our role is limited to matching and logistics facilitation, not food safety guarantees.`,
  },
  {
    title: '9. Changes to these terms',
    body: `We'll update the date below when these terms change and post a visible notice for material changes. Continued use after a change means you accept the updated terms.`,
  },
  {
    title: '10. Governing law',
    body: `[Placeholder — to be finalized with counsel before launch, based on the jurisdiction ReliefRoute is incorporated or primarily operating in.]`,
  },
]

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        Back to ReliefRoute
      </Link>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated July 31, 2026</p>

      <div className="glass mt-8 rounded-2xl border border-border p-4 text-sm leading-relaxed text-muted-foreground">
        We're pre-launch and this draft hasn't been reviewed by a lawyer yet. Food-donation
        liability rules vary by location and matter a lot here — get counsel to review section 4
        and section 10 in particular before this goes live for real users.
      </div>

      <div className="mt-10 space-y-8">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-semibold tracking-tight">{section.title}</h2>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
              {section.body}
            </p>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-border bg-secondary/40 p-5 text-sm text-muted-foreground">
        Questions about these terms? Visit our{' '}
        <Link href="/contact" className="font-medium text-foreground underline underline-offset-4">
          contact page
        </Link>
        .
      </div>
    </main>
  )
}