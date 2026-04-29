import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Sparkles,
  Activity,
  Globe,
  ShieldCheck,
  Zap,
  Users,
  CheckCircle2,
  TrendingDown,
  Sun,
  Moon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/Logo';
import { fadeUp, stagger } from '@/components/motion/variants';
import { APP_NAME } from '@/lib/constants';
import { useThemeStore } from '@/store/themeStore';

const STATS = [
  { value: '↓ 64%', label: 'Mean time to resolve', sub: 'across pilot teams' },
  { value: '< 1.5s', label: 'AI Brief generation', sub: 'from full timeline' },
  { value: '99.99%', label: 'Public-page uptime', sub: 'edge-cached globally' },
  { value: '0', label: 'Lost context per outage', sub: 'one source of truth' },
];

const STEPS = [
  { n: '01', title: 'Open an incident', text: 'Severity, service, and owner — captured in seconds.' },
  { n: '02', title: 'Stream the chaos', text: 'Every update lands in one chronological feed.' },
  { n: '03', title: 'Generate the brief', text: 'AI writes a summary, root cause, and next steps.' },
  { n: '04', title: 'Resolve & publish', text: 'Status page and postmortem update instantly.' },
];

export default function Landing() {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  return (
    <div className="relative min-h-screen overflow-x-clip text-[var(--color-foreground)]">
      {/* ─── ISLAND PILL NAV ──────────────────────────────────── */}
      <header className="sticky top-4 z-30 mx-auto flex max-w-6xl items-center justify-between px-6 py-3 md:relative md:top-0 md:py-6">
        <Logo />
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/80 px-2 py-1.5 backdrop-blur-md md:flex">
          <a href="#why" className="rounded-full px-3.5 py-1.5 text-[13px] text-[var(--color-muted-strong)] transition-colors hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)]">Why</a>
          <a href="#features" className="rounded-full px-3.5 py-1.5 text-[13px] text-[var(--color-muted-strong)] transition-colors hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)]">Features</a>
          <a href="#ai" className="rounded-full px-3.5 py-1.5 text-[13px] text-[var(--color-muted-strong)] transition-colors hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)]">AI Brief</a>
          <a href="#how" className="rounded-full px-3.5 py-1.5 text-[13px] text-[var(--color-muted-strong)] transition-colors hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)]">How</a>
          <Link to="/status/opswatch-demo" className="rounded-full px-3.5 py-1.5 text-[13px] text-[var(--color-muted-strong)] transition-colors hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)]">Status</Link>
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex size-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted-strong)] transition-colors hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)]"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Button asChild variant="ghost" size="sm" className="hidden text-[var(--color-muted-strong)] sm:inline-flex">
            <Link to="/login">Sign in</Link>
          </Button>
          <Button asChild variant="gradient" size="sm" className="rounded-full px-4">
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
      </header>

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative px-6 pt-16 pb-28 md:pt-24 md:pb-36">
        <div className="relative mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          {/* Left — copy block, left-aligned */}
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-strong)]"
            >
              <span className="size-1.5 rounded-full bg-[var(--color-brand-primary)]" />
              Built for outages, not dashboards
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-[44px] font-semibold leading-[0.98] tracking-[-0.04em] md:text-[68px] lg:text-[80px]"
            >
              Outages get{' '}
              <span className="text-[var(--color-brand-primary)]">resolved</span>{' '}
              here.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-7 max-w-xl text-[15px] leading-relaxed text-[var(--color-muted-strong)] md:text-[17px]"
            >
              {APP_NAME} is the workspace your on-call team opens when production breaks.
              Live timelines, smart role assignment, and AI briefs that turn 19-minute outages
              into one-click postmortems.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Button asChild variant="gradient" size="xl" className="rounded-full px-7">
                <Link to="/signup">
                  Start managing free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="xl" className="rounded-full px-5 text-[var(--color-muted-strong)]">
                <Link to="/login">
                  See live demo <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-[var(--color-border)] pt-7"
            >
              {[
                ['↓ 64%', 'MTTR'],
                ['<1.5s', 'AI brief'],
                ['99.99%', 'Status uptime'],
              ].map(([v, l]) => (
                <div key={l}>
                  <div className="font-mono text-xl tabular-nums tracking-tight md:text-2xl">{v}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">{l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — workspace preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <WorkspacePreview />
          </motion.div>
        </div>
      </section>

      {/* ─── STATS STRIP ──────────────────────────────────────── */}
      <section id="why" className="border-y border-[var(--color-border)]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-[var(--color-border)] md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-[var(--color-background)] px-6 py-12 md:py-16">
              <div className="font-mono text-3xl tabular-nums tracking-tight md:text-4xl">{s.value}</div>
              <div className="mt-3 text-[13px] font-medium text-[var(--color-foreground)]">{s.label}</div>
              <div className="mt-1 text-[11px] text-[var(--color-muted)]">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PROBLEM ─────────────────────────────────────────── */}
      <section className="relative px-6 py-32">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-semibold leading-[1.15] tracking-[-0.03em] md:text-5xl lg:text-[56px]"
          >
            Incidents are chaotic.{' '}
            <span className="text-[var(--color-muted)]">Your tools shouldn't be.</span>
          </motion.h2>
          <p className="mx-auto mt-8 max-w-2xl text-[15px] leading-relaxed text-[var(--color-muted-strong)] md:text-base">
            During outages, teams jump between chats, logs, and dashboards. Information gets lost,
            response slows down, and customers stay in the dark. {APP_NAME} brings the entire
            response into one structured workflow — so your team can act, not scramble.
          </p>
        </div>
      </section>

      {/* ─── FEATURES — bento, flat surfaces, no gradients ──── */}
      <section id="features" className="relative px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-muted)]">
              Features
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] md:text-[56px]">
              Everything you need.{' '}
              <span className="text-[var(--color-muted)]">Nothing you don't.</span>
            </h2>
          </div>

          <motion.div
            variants={stagger(0.08, 0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2"
          >
            {/* AI Brief — large hero card */}
            <motion.div variants={fadeUp} className="md:col-span-2 md:row-span-2">
              <div className="relative h-full overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-8">
                <div className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-primary)]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Differentiator
                </div>
                <h3 className="mt-5 text-3xl font-semibold tracking-[-0.03em] md:text-[40px]">
                  {APP_NAME} <span className="text-[var(--color-brand-primary)]">AI Brief.</span>
                </h3>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--color-muted-strong)]">
                  One click turns your full incident timeline into an executive summary,
                  probable root cause, and recommended next steps. Ship the postmortem before
                  the standup.
                </p>

                <div className="mt-10 flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-4">
                  <div>
                    <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">Probable cause</div>
                    <div className="mt-1 text-sm font-medium">Webhook timeout under load</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">Confidence</div>
                    <div className="mt-1 font-mono text-sm tabular-nums text-[var(--color-brand-primary)]">87%</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <div className="h-full rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-7">
                <Activity className="h-5 w-5 text-[var(--color-brand-primary)]" />
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em]">Real-time timeline</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-muted-strong)]">
                  Every update, status change, and assignment in one chronological feed.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <div className="h-full rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-7">
                <Globe className="h-5 w-5 text-[var(--color-brand-primary)]" />
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em]">Public status pages</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-muted-strong)]">
                  Customer-facing pages with 90-day uptime, live updates, and email subscriptions.
                </p>
              </div>
            </motion.div>
          </motion.div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { icon: Zap, title: 'Built for speed', text: 'Sub-second updates, no page refreshes, optimized for high-pressure UI.' },
              { icon: Users, title: 'Smart role assignment', text: 'Assign owners and responders so accountability is crystal-clear.' },
              { icon: ShieldCheck, title: 'Secure by default', text: 'Cookie sessions, refresh tokens, isolated team workspaces.' },
            ].map((f) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-7"
              >
                <f.icon className="h-5 w-5 text-[var(--color-muted-strong)]" />
                <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em]">{f.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-muted-strong)]">{f.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        <div className="hairline" />
      </div>

      {/* ─── HOW IT WORKS ─────────────────────────────────────── */}
      <section id="how" className="relative px-6 py-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:items-end">
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-muted)]">
                How it works
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] md:text-[52px]">
                From alert <span className="text-[var(--color-brand-primary)]">to all-clear.</span>
              </h2>
            </div>
            <p className="text-[15px] leading-relaxed text-[var(--color-muted-strong)] md:text-[17px]">
              Four steps. One workspace. Zero context loss between detection and the published
              postmortem.
            </p>
          </div>

          <motion.div
            variants={stagger(0.05, 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-border)] md:grid-cols-4"
          >
            {STEPS.map((s) => (
              <motion.div
                key={s.n}
                variants={fadeUp}
                className="bg-[var(--color-surface)] p-7 md:p-8"
              >
                <div className="font-mono text-[11px] tabular-nums text-[var(--color-brand-primary)]">{s.n}</div>
                <h3 className="mt-6 text-lg font-semibold tracking-[-0.02em]">{s.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-muted-strong)]">{s.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── AI BRIEF DEEP DIVE ──────────────────────────────── */}
      <section id="ai" className="relative px-6 py-32">
        <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-2 md:items-center">
          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-brand-primary)]">
              {APP_NAME} AI Brief
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] md:text-[56px] md:leading-[1.05]">
              Not just tracking.{' '}
              <span className="text-[var(--color-muted)]">Intelligent handling.</span>
            </h2>
            <p className="mt-7 max-w-md text-[15px] leading-relaxed text-[var(--color-muted-strong)] md:text-[17px]">
              Most incident tools are glorified spreadsheets. {APP_NAME} reads the timeline,
              detects patterns, and writes the artifacts your team actually needs.
            </p>

            <div className="mt-9 space-y-3.5">
              {[
                'One-click summaries from your live timeline',
                'Probable root cause, ranked by confidence',
                'Next-step recommendations tailored to severity',
                'Auto-generated postmortems, ready to ship',
              ].map((p) => (
                <div key={p} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-brand-primary)]" />
                  <span className="text-[15px] text-[var(--color-foreground)]/92">{p}</span>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Button asChild variant="gradient" size="lg" className="rounded-full px-6">
                <Link to="/signup">
                  Try AI Brief free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-7">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  <Sparkles className="h-3.5 w-3.5 text-[var(--color-brand-primary)]" />
                  AI Brief · INC-8421
                </div>
                <span className="rounded-full bg-[var(--color-brand-primary)]/15 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--color-brand-primary)]">
                  1.4s
                </span>
              </div>

              <h4 className="mt-6 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">Summary</h4>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-foreground)]/95">
                A 19-minute outage on the checkout API was caused by a saturated Stripe webhook
                queue after deploy <code className="rounded bg-[var(--color-surface-elevated)] px-1.5 py-0.5 font-mono text-[12px]">v2.4.1</code>.
                Mitigation succeeded; zero customer reports filed.
              </p>

              <h4 className="mt-6 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">Probable root cause</h4>
              <div className="mt-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium">Webhook handler timeout under load</span>
                  <span className="font-mono text-[11px] tabular-nums text-[var(--color-brand-primary)]">87%</span>
                </div>
                <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-[var(--color-border)]">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '87%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-[var(--color-brand-primary)]"
                  />
                </div>
              </div>

              <h4 className="mt-6 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">Suggested next steps</h4>
              <div className="mt-2 space-y-2">
                {[
                  ['Roll back to v2.4.0', 'high'],
                  ['Add queue depth alert', 'medium'],
                  ['Schedule postmortem', 'medium'],
                ].map(([t, p]) => (
                  <div key={t} className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3.5 py-2.5">
                    <span className="text-[13px]">{t}</span>
                    <span className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider ${p === 'high' ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'}`}>
                      {p}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRUST STRIP ──────────────────────────────────────── */}
      <section className="relative border-y border-[var(--color-border)] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-[1fr_1.5fr] md:items-end">
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-brand-primary)]">Trust</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] md:text-[44px]">
                Your data <span className="text-[var(--color-muted)]">stays yours.</span>
              </h2>
            </div>
            <p className="text-[15px] leading-relaxed text-[var(--color-muted-strong)]">
              Cookie-based sessions with refresh tokens. Isolated team workspaces. AI processes
              timelines without storage misuse. Built so security never blocks speed.
            </p>
          </div>

          <div className="mt-12 grid gap-3 md:grid-cols-4">
            {[
              { icon: ShieldCheck, label: 'Secure auth', text: 'Refresh-token sessions, RBAC.' },
              { icon: Users, label: 'Isolated teams', text: 'Per-workspace data boundary.' },
              { icon: TrendingDown, label: 'No data misuse', text: 'AI runs on the timeline only.' },
              { icon: Zap, label: 'Fast by design', text: 'High-pressure UI, sub-second.' },
            ].map((b) => (
              <div key={b.label} className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                <b.icon className="h-5 w-5 shrink-0 text-[var(--color-brand-primary)]" />
                <div>
                  <div className="text-sm font-semibold">{b.label}</div>
                  <div className="mt-0.5 text-[12px] leading-relaxed text-[var(--color-muted-strong)]">{b.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────────────── */}
      <section className="relative px-6 py-32">
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-5xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-[88px]">
            Be ready for the{' '}
            <span className="text-[var(--color-brand-primary)]">next incident.</span>
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-[15px] leading-relaxed text-[var(--color-muted-strong)] md:text-[17px]">
            Join teams shipping calmer, faster outages with {APP_NAME}.
          </p>
          <div className="mt-11 flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="gradient" size="xl" className="rounded-full px-7">
              <Link to="/signup">Get started — it's free</Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="rounded-full px-7">
              <Link to="/status/opswatch-demo">Live status page</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER — Micro-inspired split statement + giant wordmark ─── */}
      <footer className="relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-background)]">
        {/* split statement */}
        <div className="mx-auto max-w-6xl px-6 pt-20 md:pt-32">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <h2 className="text-[clamp(2.25rem,7vw,5rem)] font-semibold leading-[1] tracking-[-0.04em]">
              Stay calm.
            </h2>
            <h2 className="font-serif text-[clamp(1.875rem,5.5vw,4rem)] italic leading-[1.05] tracking-[-0.02em] text-[var(--color-muted-strong)]">
              Even when production isn't.
            </h2>
          </div>
          <div className="mt-10 hairline md:mt-12" />
        </div>

        {/* socials + nav + copyright row */}
        <div className="mx-auto max-w-6xl px-6 py-6 md:py-7">
          <div className="flex flex-col items-start gap-5 md:flex-row md:flex-wrap md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <SocialIcon href="https://linkedin.com" label="LinkedIn">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.22.79 24 1.77 24h20.45c.99 0 1.78-.78 1.78-1.73V1.72C24 .77 23.21 0 22.22 0Z" />
              </SocialIcon>
              <SocialIcon href="https://x.com" label="X">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
              </SocialIcon>
              <SocialIcon href="https://github.com" label="GitHub">
                <path d="M12 0a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.08 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.66-.31-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.31-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.61-5.49 5.91.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 0Z" />
              </SocialIcon>
            </div>

            <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
              <a href="#features" className="transition-colors hover:text-[var(--color-foreground)]">Features</a>
              <a href="#ai" className="transition-colors hover:text-[var(--color-foreground)]">AI Brief</a>
              <a href="#how" className="transition-colors hover:text-[var(--color-foreground)]">How it works</a>
              <Link to="/status/opswatch-demo" className="transition-colors hover:text-[var(--color-foreground)]">Status</Link>
              <Link to="/login" className="transition-colors hover:text-[var(--color-foreground)]">Sign in</Link>
            </nav>

            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
              © {new Date().getFullYear()} {APP_NAME} Inc.
            </span>
          </div>
        </div>

        {/* giant cut wordmark */}
        <div
          aria-hidden
          className="relative mt-2 select-none"
        >
          <div
            className="whitespace-nowrap text-center font-semibold leading-[0.78] text-[var(--color-foreground)]"
            style={{
              fontSize: 'clamp(4.5rem, 21vw, 20rem)',
              letterSpacing: '-0.06em',
              transform: 'translateY(18%)',
            }}
          >
            {APP_NAME}
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
 * Inline social icon — avoids depending on lucide brand icons
 * (which were removed from lucide-react over trademark concerns)
 * ──────────────────────────────────────────────────────────── */

function SocialIcon({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex size-9 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-muted-strong)] transition-colors hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)]"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
        className="h-3.5 w-3.5"
      >
        {children}
      </svg>
    </a>
  );
}

/* ────────────────────────────────────────────────────────────
 * Workspace preview — looks like the actual product, not a marketing card
 * ──────────────────────────────────────────────────────────── */

const PREVIEW_TIMELINE = [
  { time: '14:02', label: 'investigating', dot: 'bg-red-500', text: 'Elevated 5xx on /api/checkout' },
  { time: '14:08', label: 'identified', dot: 'bg-orange-500', text: 'Stripe webhook timeout under load' },
  { time: '14:14', label: 'monitoring', dot: 'bg-blue-500', text: 'Mitigation deployed; error rate falling' },
  { time: '14:21', label: 'resolved', dot: 'bg-[var(--color-brand-primary)]', text: '19 min · 0 customer reports' },
];

const TONE_LABEL = {
  investigating: 'border-red-500/30 bg-red-500/10 text-red-400',
  identified: 'border-orange-500/30 bg-orange-500/10 text-orange-400',
  monitoring: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
  resolved: 'border-[var(--color-brand-primary)]/40 bg-[var(--color-brand-primary)]/15 text-[var(--color-brand-primary)]',
};

function WorkspacePreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)]">
      {/* status bar */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 md:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
            INC-8421
          </span>
          <span className="rounded border border-red-500/30 bg-red-500/10 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-red-400">
            Critical
          </span>
        </div>
        <div className="hidden items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)] sm:flex">
          <span className="flex items-center gap-1.5">
            <Users className="h-3 w-3" /> 3 on-call
          </span>
          <span>·</span>
          <span className="tabular-nums">19m elapsed</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] tabular-nums text-[var(--color-muted)] sm:hidden">
          19m
        </span>
      </div>

      {/* incident title */}
      <div className="border-b border-[var(--color-border)] px-5 py-4">
        <div className="text-[15px] font-semibold tracking-[-0.02em] md:text-base">
          Elevated 5xx errors on checkout API
        </div>
        <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
          checkout-api · stripe-webhook
        </div>
      </div>

      {/* body — timeline + AI brief */}
      <div className="grid gap-px bg-[var(--color-border)] sm:grid-cols-[1.3fr_1fr]">
        {/* timeline column */}
        <div className="bg-[var(--color-surface)] p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
              Timeline
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
              4 updates · live
            </span>
          </div>

          <div className="relative space-y-3.5">
            <div aria-hidden className="absolute left-[5px] top-2 bottom-2 w-px bg-[var(--color-border)]" />
            {PREVIEW_TIMELINE.map((u) => (
              <div key={u.time} className="relative flex items-start gap-3 pl-7">
                <span className={`absolute left-0 top-1.5 size-3 rounded-full ring-4 ring-[var(--color-surface)] ${u.dot}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-mono text-[10px] tabular-nums text-[var(--color-muted)]">{u.time}</span>
                    <span className={`rounded border px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider ${TONE_LABEL[u.label]}`}>
                      {u.label}
                    </span>
                  </div>
                  <div className="mt-0.5 truncate text-[12.5px] text-[var(--color-foreground)]/95">{u.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI brief column */}
        <div className="bg-[var(--color-surface)] p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-brand-primary)]">
              <Sparkles className="h-3 w-3" /> AI Brief
            </span>
            <span className="rounded-full bg-[var(--color-brand-primary)]/15 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-[var(--color-brand-primary)]">
              1.4s
            </span>
          </div>

          <p className="text-[12.5px] leading-relaxed text-[var(--color-foreground)]/95">
            Stripe webhook queue saturated after deploy <code className="rounded bg-[var(--color-surface-elevated)] px-1 py-0.5 font-mono text-[10px]">v2.4.1</code>. Retries draining; checkout rate normal.
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">Confidence</span>
            <span className="font-mono text-[11px] tabular-nums text-[var(--color-brand-primary)]">87%</span>
          </div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[var(--color-border)]">
            <div className="h-full w-[87%] bg-[var(--color-brand-primary)]" />
          </div>

          <div className="mt-4 space-y-1.5">
            {['Roll back v2.4.1', 'Add queue depth alert', 'Schedule postmortem'].map((s) => (
              <div key={s} className="flex items-center gap-1.5 text-[11.5px]">
                <CheckCircle2 className="h-3 w-3 shrink-0 text-[var(--color-brand-primary)]" />
                <span className="truncate text-[var(--color-muted-strong)]">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* action chips */}
      <div className="flex items-center gap-2 overflow-x-auto border-t border-[var(--color-border)] bg-[var(--color-background)] px-5 py-3">
        {['+ Add update', 'Change status', 'Assign', 'Generate brief'].map((c, i) => (
          <span
            key={c}
            className={`whitespace-nowrap rounded-full border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] ${
              i === 0
                ? 'border-[var(--color-brand-primary)]/40 bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]'
                : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted-strong)]'
            }`}
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
