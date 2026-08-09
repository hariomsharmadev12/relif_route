import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy — ReliefRoute AI',
  description: 'How ReliefRoute AI collects, uses, and protects your data.',
}

const SECTIONS = [
  {
    title: '1. Who we are',
    body: `ReliefRoute AI ("ReliefRoute," "we," "us") is an early-stage platform connecting kitchens with surplus food to shelters and volunteers who can rescue it. We are pre-launch and actively building — this policy describes our current data practices and will be updated as the product evolves.`,
  },
  {
    title: '2. Information we collect',
    body: `Account details you give us directly (name, email, organization, role — kitchen, shelter, or volunteer). Location data when you post, claim, or route a food batch, so pickups can be matched to nearby users. Usage data such as pages visited and actions taken, collected automatically to help us fix bugs and improve the product. We do not knowingly collect more than we need to run a pickup or delivery.`,
  },
  {
    title: '3. How we use it',
    body: `To match surplus food batches with nearby shelters and volunteers. To route and confirm pickups and deliveries. To send essential account and safety notifications (e.g. a claimed batch, an expiring window). To understand how the product is used so we can improve it. We do not sell personal data, and we do not use your data to train third-party advertising models.`,
  },
  {
    title: '4. Sharing',
    body: `Location and batch details are shared only with the specific parties involved in a handoff (e.g. the kitchen sees the volunteer or shelter that claims their batch, and vice versa). We may share data with service providers who help us run the platform (hosting, email delivery), bound by confidentiality obligations. We do not share data with advertisers.`,
  },
  {
    title: '5. Data retention',
    body: `We keep account and handoff records for as long as your account is active, plus a limited period afterward for safety and compliance reasons (e.g. food-handling audit trails). You can request deletion of your account and associated data at any time — see the contact section below.`,
  },
  {
    title: '6. Your rights',
    body: `Depending on where you live, you may have the right to access, correct, export, or delete your personal data, and to object to certain uses of it. To exercise any of these rights, reach out through our contact page and we'll respond directly — we're a small team, so expect a real person, not a ticket queue.`,
  },
  {
    title: '7. Children\u2019s privacy',
    body: `ReliefRoute is intended for use by adults acting on behalf of kitchens, shelters, and volunteer organizations. It is not directed at children, and we do not knowingly collect personal data from anyone under 16. If you believe a child has provided us data, contact us and we'll remove it.`,
  },
  {
    title: '8. Security',
    body: `We take reasonable technical and organizational measures to protect your data, but no system is completely secure. As an early-stage product, our security practices will continue to mature — we'll disclose material changes here.`,
  },
  {
    title: '9. Changes to this policy',
    body: `We'll update the date below whenever this policy changes, and post a visible notice on the site for material changes while we're small enough to do that meaningfully.`,
  },
]

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        Back to ReliefRoute
      </Link>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated July 31, 2026</p>

      <div className="glass mt-8 rounded-2xl border border-border p-4 text-sm leading-relaxed text-muted-foreground">
        We're a pre-launch startup. This policy is an honest, plain-language draft of how we intend
        to handle data — it hasn't been reviewed by a lawyer yet, and we recommend having one look
        it over (especially around food-safety and location data) before we go live.
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
        Questions about this policy or your data? Visit our{' '}
        <Link href="/contact" className="font-medium text-foreground underline underline-offset-4">
          contact page
        </Link>
        .
      </div>
    </main>
  )
}