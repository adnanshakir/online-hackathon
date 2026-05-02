import { useEffect } from 'react';
import Lenis from 'lenis';
import { motion as _motion } from 'motion/react';
const Motion = _motion;
// Shared Components
import { ScrollRevealParagraph } from '@/components/landing/ScrollReveal';
import { DualMarquee } from '@/components/landing/DualMarquee';
import { CreativeAIBriefShowcase } from '@/components/landing/CreativeAIBriefShowcase';

// Section Components
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingHero } from '@/components/landing/LandingHero';
import { LandingStats } from '@/components/landing/LandingStats';
import { LandingFeatures } from '@/components/landing/LandingFeatures';
import { LandingHowItWorks } from '@/components/landing/LandingHowItWorks';
import { LandingTrust } from '@/components/landing/LandingTrust';
import { LandingCTA } from '@/components/landing/LandingCTA';
import { LandingFAQ } from '@/components/landing/LandingFAQ';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function Landing() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full max-w-[100vw] overflow-x-hidden select-none text-[var(--color-foreground)]">
      <LandingHeader />

      <main>
        <LandingHero />

        <LandingStats />

        {/* ─── PROBLEM — scroll-driven word reveal ──────────────── */}
        <section className="relative px-6 py-32">
          <div className="mx-auto max-w-5xl text-center">
            <ScrollRevealParagraph />
          </div>
        </section>

        <DualMarquee />

        <LandingFeatures />

        <div className="mx-auto max-w-6xl px-6">
          <div className="hairline" />
        </div>

        <LandingHowItWorks />

        {/* ─── AI BRIEF DEEP DIVE — The "Wow" Showcase ─────────── */}
        <section id="ai" className="relative px-6 py-40">
          <div className="mx-auto max-w-7xl text-center">
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-brand-primary)]">
                OpsWatch AI Brief
              </p>
              <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.03em] md:text-[64px] md:leading-[1.05]">
                Complex outages. <br />
                <span className="text-[var(--color-muted)]">
                  Summarized in seconds.
                </span>
              </h2>
            </Motion.div>

            <Motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-20"
            >
              <CreativeAIBriefShowcase />
            </Motion.div>
          </div>
        </section>

        <LandingTrust />

        <LandingCTA />

        <LandingFAQ />
      </main>

      <LandingFooter />
    </div>
  );
}
