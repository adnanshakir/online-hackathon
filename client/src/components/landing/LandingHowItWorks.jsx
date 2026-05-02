import { motion } from 'motion/react'; // eslint-disable-line no-unused-vars
import { STEPS } from '@/data/landingData';
import { fadeUp, stagger } from '@/components/motion/variants';

export function LandingHowItWorks() {
  return (
    <section id="how" className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:items-end">
          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-muted)]">
              How it works
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] md:text-[52px]">
              From alert{' '}
              <span className="text-[var(--color-brand-primary)]">
                to all clear.
              </span>
            </h2>
          </div>
          <p className="text-[15px] leading-relaxed text-[var(--color-muted-strong)] md:text-[17px]">
            Four steps. One workspace. Zero context loss between detection and
            the published postmortem.
          </p>
        </div>

        <motion.div
          variants={stagger(0.05, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-20px' }}
          className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-border)] md:grid-cols-4"
        >
          {STEPS.map((s) => (
            <motion.div
              key={s.n}
              variants={fadeUp}
              className="bg-[var(--color-surface)] p-7 md:p-8"
            >
              <div className="font-mono text-[11px] tabular-nums text-[var(--color-brand-primary)]">
                {s.n}
              </div>
              <h3 className="mt-6 text-lg font-semibold tracking-[-0.02em]">
                {s.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-muted-strong)]">
                {s.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
