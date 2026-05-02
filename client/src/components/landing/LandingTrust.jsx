import { ShieldCheck, Users, TrendingDown, Zap } from 'lucide-react';
import SecurityShieldShowcase from '@/components/landing/SecurityShieldShowcase';

export function LandingTrust() {
  return (
    <section className="relative border-y border-[var(--color-border)] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1fr_0.8fr_1.2fr] md:items-center">
          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-brand-primary)]">
              Trust
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] md:text-[44px]">
              Your data{' '}
              <span className="text-[var(--color-muted)]">stays yours.</span>
            </h2>
          </div>

          <div className="flex justify-center md:justify-start">
            <SecurityShieldShowcase />
          </div>

          <p className="text-[15px] leading-relaxed text-[var(--color-muted-strong)]">
            Cookie-based sessions with refresh tokens. Isolated team workspaces.
            AI processes timelines without storage misuse. Built so security
            never blocks speed.
          </p>
        </div>

        <div className="mt-12 grid gap-3 md:grid-cols-4">
          {[
            {
              icon: ShieldCheck,
              label: 'Secure auth',
              text: 'Refresh-token sessions, RBAC.',
            },
            {
              icon: Users,
              label: 'Isolated teams',
              text: 'Per-workspace data boundary.',
            },
            {
              icon: TrendingDown,
              label: 'No data misuse',
              text: 'AI runs on the timeline only.',
            },
            {
              icon: Zap,
              label: 'Fast by design',
              text: 'High-pressure UI, sub-second.',
            },
          ].map((b) => (
            <div
              key={b.label}
              className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
            >
              <b.icon className="h-5 w-5 shrink-0 text-[var(--color-brand-primary)]" />
              <div>
                <div className="text-sm font-semibold">{b.label}</div>
                <div className="mt-0.5 text-[12px] leading-relaxed text-[var(--color-muted-strong)]">
                  {b.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
