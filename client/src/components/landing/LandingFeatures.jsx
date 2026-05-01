import { motion } from 'motion/react'; // eslint-disable-line no-unused-vars
import {
  Sparkles,
  Activity,
  Globe,
  Zap,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { SpotlightGrid } from '@/components/landing/SpotlightGrid';
import { fadeUp } from '@/components/motion/variants';
import { APP_NAME } from '@/lib/constants';

export function LandingFeatures() {
  return (
    <section id="features" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-muted)]">
            Features
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] md:text-[56px]">
            Everything you need.{' '}
            <span className="text-[var(--color-muted)]">
              Nothing you don't.
            </span>
          </h2>
        </div>

        <SpotlightGrid className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2">
          {/* AI Brief — large hero card */}
          <motion.div variants={fadeUp} className="md:col-span-2 md:row-span-2">
            <div className="spotlight-card relative h-full overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-8 dark:border-white/10 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
              <div className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-primary)]">
                <Sparkles className="h-3.5 w-3.5" />
                Differentiator
              </div>
              <h3 className="mt-5 text-3xl font-semibold tracking-[-0.03em] md:text-[40px]">
                {APP_NAME}{' '}
                <span className="text-[var(--color-brand-primary)]">
                  AI Brief.
                </span>
              </h3>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--color-muted-strong)]">
                One click turns your full incident timeline into an executive
                summary, probable root cause, and recommended next steps. Ship
                the postmortem before the standup.
              </p>

              <div className="mt-10 flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-4">
                <div>
                  <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                    Probable cause
                  </div>
                  <div className="mt-1 text-sm font-medium">
                    Webhook timeout under load
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                    Confidence
                  </div>
                  <div className="mt-1 font-mono text-sm tabular-nums text-[var(--color-brand-primary)]">
                    87%
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <div className="spotlight-card h-full rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-7 dark:border-white/10 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
              <Activity className="h-5 w-5 text-[var(--color-brand-primary)]" />
              <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em]">
                Real-time timeline
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-muted-strong)]">
                Every update, status change, and assignment in one chronological
                feed.
              </p>
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <div className="spotlight-card h-full rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-7 dark:border-white/10 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
              <Globe className="h-5 w-5 text-[var(--color-brand-primary)]" />
              <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em]">
                Public status pages
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-muted-strong)]">
                Customer-facing pages with 90-day uptime, live updates, and
                email subscriptions.
              </p>
            </div>
          </motion.div>
        </SpotlightGrid>

        <SpotlightGrid className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              icon: Zap,
              title: 'Built for speed',
              text: 'Sub-second updates, no page refreshes, optimized for high-pressure UI.',
            },
            {
              icon: Users,
              title: 'Smart role assignment',
              text: 'Assign owners and responders so accountability is crystal-clear.',
            },
            {
              icon: ShieldCheck,
              title: 'Secure by default',
              text: 'Cookie sessions, refresh tokens, isolated team workspaces.',
            },
          ].map((f) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4 }}
            >
              <div className="spotlight-card rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-7 dark:border-white/10 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
                <f.icon className="h-5 w-5 text-[var(--color-muted-strong)]" />
                <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em]">
                  {f.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-muted-strong)]">
                  {f.text}
                </p>
              </div>
            </motion.div>
          ))}
        </SpotlightGrid>
      </div>
    </section>
  );
}
