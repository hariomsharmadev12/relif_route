import { BentoShowcase } from "@/components/bento-showcase";
import { DispatchConsole } from "@/components/dispatch-console";
import { FaqSection } from "@/components/faq-section";
import { HeroSection } from "@/components/hero-section";
import { HowItWorks } from "@/components/how-it-works";
import { ImpactStory } from "@/components/impact-story";
import { LaunchCta } from "@/components/launch-cta";
// Updated import to match the exported function name
import { PartnerMarquee3D } from "@/components/partner-marquee";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import { Testimonials } from "@/components/testimonials";

export default function Page() {
  return (
    <>
      <SiteNavbar />
      <main>
        <HeroSection />
        {/* Updated component call */}
        <PartnerMarquee3D />
        <BentoShowcase />
        <HowItWorks />
        <DispatchConsole />
        <ImpactStory />
        <Testimonials />
        <FaqSection />
        <LaunchCta />
      </main>
      <SiteFooter />
    </>
  );
}
