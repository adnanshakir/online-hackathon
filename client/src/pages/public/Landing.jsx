import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Activity, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Logo } from '@/components/shared/Logo';
import { AmbientGlow } from '@/components/shared/AmbientGlow';
import { fadeUp, stagger } from '@/components/motion/variants';
import { APP_NAME } from '@/lib/constants';

const FEATURES = [
  {
    icon: Activity,
    title: 'Real-time updates',
    description:
      'Timelines update live as your team posts. No refresh, no missed context — just the truth, as it unfolds.',
    color: '#8b5cf6',
  },
  {
    icon: Sparkles,
    title: 'AI postmortems',
    description:
      'Generate a complete postmortem in seconds: summary, timeline, root cause, and action items — ready to ship.',
    color: '#3b82f6',
  },
  {
    icon: Globe,
    title: 'Public status pages',
    description:
      'Beautiful, customer-facing status pages with 90-day uptime, real-time incident updates, and email subscriptions.',
    color: '#10b981',
  },
];

const LOGOS = ['Acme', 'Globex', 'Hooli', 'Initech', 'Stark', 'Wayne', 'Pied Piper'];

const STATS = [
  { label: 'Avg time-to-resolution', value: '↓ 64%' },
  { label: 'Postmortems shipped', value: '12,400+' },
  { label: 'Uptime guarantee', value: '99.99%' },
];

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--color-background)] text-[var(--color-foreground)]">
      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm text-[var(--color-muted)] md:flex">
          <a href="#features" className="hover:text-[var(--color-foreground)]">Features</a>
          <a href="#stats" className="hover:text-[var(--color-foreground)]">Why Sentinel</a>
          <Link to="/status/sentinel-demo" className="hover:text-[var(--color-foreground)]">Status</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button variant="gradient" size="sm" asChild>
            <Link to="/signup">Start free</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        {/* Continuously-breathing glow blobs */}
        <AmbientGlow variant="hero" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />

        <div className="mx-auto max-w-6xl px-6 pb-20 pt-12 md:pt-24 text-center">
          <motion.span
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/60 px-3 py-1 text-xs text-[var(--color-muted)] backdrop-blur"
          >
            <Sparkles className="h-3 w-3" />
            AI-assisted incident response · launched 2026
          </motion.span>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.05 }}
            className="mt-6 text-balance text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl"
          >
            Resolve incidents <span className="text-gradient">10x faster</span>.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="mx-auto mt-6 max-w-xl text-pretty text-lg text-[var(--color-muted)]"
          >
            {APP_NAME} keeps your engineering team aligned during outages — real-time
            updates, AI postmortems, and beautiful public status pages.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.15 }}
            className="mt-8 flex items-center justify-center gap-3"
          >
            <Button variant="gradient" size="lg" asChild>
              <Link to="/signup">
                Start free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/app/dashboard">View demo</Link>
            </Button>
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="mt-4 text-xs text-[var(--color-muted)]"
          >
            Free for the first 5 teammates · No credit card required
          </motion.p>

          {/* Hero product mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto mt-16 max-w-4xl"
          >
            <div
              className="pointer-events-none absolute -inset-x-12 -inset-y-6 -z-10 rounded-[2rem] blur-2xl"
              style={{
                background:
                  'linear-gradient(90deg, rgba(139, 92, 246, 0.25) 0%, rgba(59, 130, 246, 0.10) 50%, rgba(59, 130, 246, 0.25) 100%)',
              }}
            />
            <Card className="overflow-hidden p-0">
              <div className="flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-2.5">
                <span className="size-2.5 rounded-full bg-red-500/70" />
                <span className="size-2.5 rounded-full bg-yellow-500/70" />
                <span className="size-2.5 rounded-full bg-emerald-500/70" />
                <span className="ml-3 text-[10px] font-medium text-[var(--color-muted)]">
                  app.sentinel.dev/dashboard
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 p-4 text-left md:p-6">
                {[
                  { label: 'Active', val: '2', color: '#ef4444' },
                  { label: 'Avg resolution', val: '14m', color: '#3b82f6' },
                  { label: 'Resolved this week', val: '6', color: '#10b981' },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
                  >
                    <div className="text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
                      {s.label}
                    </div>
                    <div
                      className="mt-1 text-2xl font-semibold tabular-nums"
                      style={{ color: s.color }}
                    >
                      {s.val}
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2 border-t border-[var(--color-border)] p-4 md:p-6">
                {[
                  { sev: '#ef4444', label: 'CRITICAL', title: 'Payment processing delays in EU region', status: 'investigating' },
                  { sev: '#eab308', label: 'MEDIUM', title: 'Database read replica lag spike', status: 'monitoring' },
                ].map((row) => (
                  <div
                    key={row.title}
                    className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-left"
                  >
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{ background: `${row.sev}20`, color: row.sev, border: `1px solid ${row.sev}40` }}
                    >
                      {row.label}
                    </span>
                    <span className="flex-1 truncate text-sm font-medium">{row.title}</span>
                    <span className="text-[11px] text-[var(--color-muted)]">{row.status}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)]/40">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-center text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
            Trusted by engineering teams at
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {LOGOS.map((l) => (
              <span
                key={l}
                className="text-base font-semibold tracking-tight text-[var(--color-muted)]/70 transition-colors hover:text-[var(--color-foreground)]"
                style={{ fontFamily: 'serif', letterSpacing: '-0.02em' }}
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
            Everything you need, <span className="text-gradient">nothing you don't.</span>
          </h2>
          <p className="mt-4 text-base text-[var(--color-muted)]">
            From the moment an alert fires to the final postmortem, Sentinel keeps your team
            in flow.
          </p>
        </div>

        <motion.div
          variants={stagger(0.1, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-16 grid gap-6 md:grid-cols-3"
        >
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <motion.div key={f.title} variants={fadeUp}>
                <Card className="group h-full p-6 transition-all hover:-translate-y-0.5 hover:border-[var(--color-muted)]">
                  <div
                    className="grid size-11 place-items-center rounded-xl"
                    style={{ background: `${f.color}18`, color: f.color }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">{f.title}</h3>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">{f.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Stats */}
      <section id="stats" className="border-t border-[var(--color-border)]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-[var(--color-border)] md:grid-cols-3 md:divide-x md:divide-y-0">
          {STATS.map((s) => (
            <div key={s.label} className="px-6 py-12 text-center">
              <div className="text-4xl font-semibold tracking-tight md:text-5xl">
                <span className="text-gradient">{s.value}</span>
              </div>
              <div className="mt-2 text-xs uppercase tracking-wider text-[var(--color-muted)]">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-6xl px-6 py-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
        <Card className="relative overflow-hidden p-10 text-center md:p-16">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(139, 92, 246, 0.18) 0%, transparent 50%, rgba(59, 130, 246, 0.18) 100%)',
            }}
          />
          <div className="relative">
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
              Ship reliability,{' '}
              <span className="text-gradient">not just code.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-[var(--color-muted)]">
              Set up your workspace in under two minutes.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button variant="gradient" size="lg" asChild>
                <Link to="/signup">
                  Get started <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/status/sentinel-demo">See public status</Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-[var(--color-muted)] md:flex-row">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span>© 2026 {APP_NAME}. Built for the hackathon.</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-[var(--color-foreground)]">Privacy</a>
            <a href="#" className="hover:text-[var(--color-foreground)]">Terms</a>
            <Link to="/status/sentinel-demo" className="hover:text-[var(--color-foreground)]">Status</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
