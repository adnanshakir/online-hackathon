import { useRef, useCallback, useState, useEffect } from 'react';
import Lenis from 'lenis';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
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
  Target,
  AlertTriangle,
  Calendar,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/Logo';
import { fadeUp, stagger } from '@/components/motion/variants';
import { APP_NAME } from '@/lib/constants';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import InteractiveGrid from '@/components/ui/InteractiveGrid';

import { FAQ_DATA, STATS, STEPS } from '@/data/landingData';
import { FAQItem } from '@/components/landing/FAQItem';
import { CreativeAIBriefShowcase } from '@/components/landing/CreativeAIBriefShowcase';
import { ScrollRevealParagraph } from '@/components/landing/ScrollReveal';
import { SpotlightGrid } from '@/components/landing/SpotlightGrid';
import { DualMarquee } from '@/components/landing/DualMarquee';
import SecurityShieldShowcase from '@/components/landing/SecurityShieldShowcase';
import { WorkspacePreview } from '@/components/landing/WorkspacePreview';
import { SocialIcon } from '@/components/shared/SocialIcon';

export default function Landing() {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const [openFaq, setOpenFaq] = useState(0);
  const heroRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleHeroMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    heroRef.current.style.setProperty('--mouse-x', `${x}px`);
    heroRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

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
      {/* ─── ISLAND PILL NAV ──────────────────────────────────── */}
      <header className="sticky top-4 z-30 mx-auto flex max-w-6xl items-center justify-between px-6 py-3 md:relative md:top-0 md:py-6">
        <Logo />
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/80 px-2 py-1.5 backdrop-blur-xl shadow-sm md:flex">
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
          <Button asChild variant="gradient" size="sm" className="rounded-full px-4 hidden xs:inline-flex">
            <Link to="/signup">Get Started</Link>
          </Button>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="inline-flex size-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted-strong)] transition-colors hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)] md:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* ─── MOBILE SIDEBAR ──────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm md:hidden">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-[280px] h-full bg-[var(--color-background)] border-l border-[var(--color-border)] p-6 shadow-2xl flex flex-col"
          >
            <div className="flex justify-end">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex size-8 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-muted-strong)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="mt-12 flex flex-col gap-6 text-lg font-medium text-[var(--color-foreground)]">
              <a href="#why" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[var(--color-brand-primary)]">Why</a>
              <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[var(--color-brand-primary)]">Features</a>
              <a href="#ai" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[var(--color-brand-primary)]">AI Brief</a>
              <a href="#how" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[var(--color-brand-primary)]">How</a>
              <Link to="/status/opswatch-demo" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[var(--color-brand-primary)]">Status</Link>
            </nav>
            <div className="mt-auto pt-6 border-t border-[var(--color-border)] flex flex-col gap-3">
              <Button asChild variant="ghost" className="justify-center w-full">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild variant="gradient" className="justify-center w-full rounded-full">
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        className="group relative px-6 pt-12 pb-24 md:pt-24 md:pb-36 overflow-hidden"
      >
        {/* Base very dim dot grid */}
        <div className="absolute inset-0 z-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}
        />

        {/* Spotlight dot grid that reveals on hover */}
        <div className="absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-[0.15]"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
            backgroundSize: '24px 24px',
            WebkitMaskImage: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), black, transparent)',
            maskImage: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), black, transparent)'
          }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center md:gap-16">
          {/* Left — copy block */}
          <div className="text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex max-w-full text-center items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-[var(--color-muted-strong)] xs:gap-2.5 xs:text-[10px] xs:tracking-[0.2em]"
            >
              <span className="size-1.5 shrink-0 rounded-full bg-[var(--color-brand-primary)]" />
              <span className="truncate">Built for outages, not dashboards</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-[32px] font-bold leading-[1.05] tracking-[-0.02em] xs:text-[40px] md:text-[68px] lg:text-[80px]"
            >
              Outages get <br />
              <span className="whitespace-nowrap text-[var(--color-brand-primary)]">resolved here.</span>{' '}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mt-7 max-w-xl text-[15px] leading-relaxed text-[var(--color-muted-strong)] md:mx-0 md:text-[17px]"
            >
              {APP_NAME} is the workspace your on-call team opens when production breaks.
              Live timelines, smart role assignment, and AI briefs that turn 19-minute outages
              into one-click postmortems.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-9 flex flex-wrap items-center justify-center gap-3 md:justify-start"
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
              className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-4 border-t border-[var(--color-border)] pt-7 md:justify-start md:gap-x-8"
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
            className="relative min-w-0 max-w-full"
          >
            {/* Ambient glow behind preview */}
            <div className="absolute -inset-6 -z-10 rounded-3xl bg-[var(--color-brand-primary)]/[0.07] blur-3xl animate-[pulse_4s_ease-in-out_infinite]" />

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

      {/* ─── PROBLEM — scroll-driven word reveal ──────────────── */}
      <section className="relative px-6 py-32">
        <div className="mx-auto max-w-5xl text-center">
          <ScrollRevealParagraph />
        </div>
      </section>

      <DualMarquee />

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

          <SpotlightGrid className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2">
            {/* AI Brief — large hero card */}
            <motion.div variants={fadeUp} className="md:col-span-2 md:row-span-2">
              <div className="spotlight-card relative h-full overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-8 dark:border-white/10 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
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
              <div className="spotlight-card h-full rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-7 dark:border-white/10 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
                <Activity className="h-5 w-5 text-[var(--color-brand-primary)]" />
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em]">Real-time timeline</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-muted-strong)]">
                  Every update, status change, and assignment in one chronological feed.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <div className="spotlight-card h-full rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-7 dark:border-white/10 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
                <Globe className="h-5 w-5 text-[var(--color-brand-primary)]" />
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em]">Public status pages</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-muted-strong)]">
                  Customer-facing pages with 90-day uptime, live updates, and email subscriptions.
                </p>
              </div>
            </motion.div>
          </SpotlightGrid>

          <SpotlightGrid className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
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
              >
                <div className="spotlight-card rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-7 dark:border-white/10 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
                  <f.icon className="h-5 w-5 text-[var(--color-muted-strong)]" />
                  <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em]">{f.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-muted-strong)]">{f.text}</p>
                </div>
              </motion.div>
            ))}
          </SpotlightGrid>
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
            viewport={{ once: true, margin: '-20px' }}
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

      {/* ─── AI BRIEF DEEP DIVE — The "Wow" Showcase ─────────── */}
      <section id="ai" className="relative px-6 py-40">
        <div className="mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-brand-primary)]">
              OpsWatch AI Brief
            </p>
            <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.03em] md:text-[64px] md:leading-[1.05]">
              Out of chaos,<br />
              <span className="text-[var(--color-muted)]">instant clarity.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-[var(--color-muted-strong)]">
              Most tools give you a messy spreadsheet. OpsWatch reads the raw timeline, detects hidden patterns, and instantly generates the exact artifacts your team needs to act.
            </p>

            <div className="mt-10 flex justify-center">
              <Button asChild className="group h-12 rounded-full bg-[var(--color-brand-primary)] px-8 text-black hover:bg-[var(--color-brand-primary)]/90">
                <Link to="/signup" className="flex items-center">
                  Try AI Brief free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-20"
          >
            <CreativeAIBriefShowcase />
          </motion.div>
        </div>
      </section>

      {/* ─── TRUST STRIP ──────────────────────────────────────── */}
      <section className="relative border-y border-[var(--color-border)] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-[1fr_0.8fr_1.2fr] md:items-center">
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-brand-primary)]">Trust</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] md:text-[44px]">
                Your data <span className="text-[var(--color-muted)]">stays yours.</span>
              </h2>
            </div>

            <div className="flex justify-center md:justify-start">
              <SecurityShieldShowcase />
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

      {/* ─── FAQ SECTION ────────────────────────────────────────── */}
      <section className="relative px-6 py-24 md:py-32">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-brand-primary)]">Questions</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
              Common <span className="text-[var(--color-muted)]">doubts.</span>
            </h2>
          </div>

          <div className="rounded-3xl border border-[var(--color-border-strong)] bg-[var(--color-surface)]/30 px-8 py-4 backdrop-blur-sm">
            {FAQ_DATA.map((item, idx) => (
              <FAQItem
                key={idx}
                q={item.q}
                a={item.a}
                isOpen={openFaq === idx}
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────────────── */}
      <section className="relative px-6 py-32 bg-grid overflow-hidden" style={{ backgroundSize: '56px 56px' }}>
        <InteractiveGrid cellSize={56} />
        <div className="relative mx-auto max-w-4xl text-center pointer-events-none z-10">
          <h2 className="text-5xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-[88px]">
            Be ready for the{' '}
            <span className="text-[var(--color-brand-primary)]">next incident.</span>
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-[15px] leading-relaxed text-[var(--color-muted-strong)] md:text-[17px]">
            Join teams shipping calmer, faster outages with {APP_NAME}.
          </p>
          <div className="mt-11 flex flex-wrap items-center justify-center gap-3 pointer-events-auto">
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

        {/* giant wordmark */}
        <div
          aria-hidden
          className="relative mt-10 mb- select-none overflow-hidden"
        >
          <div
            className="whitespace-nowrap text-center font-black leading-[0.8] text-[var(--color-foreground)]/50"
            style={{
              fontSize: 'clamp(4rem, 18vw, 20rem)',
              letterSpacing: '-0.05em',
              transform: 'translateY(10%)',
            }}
          >
            {APP_NAME}
          </div>
        </div>
      </footer>
    </div>
  );
}