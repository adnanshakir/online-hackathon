import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react'; // eslint-disable-line no-unused-vars
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';
import { WorkspacePreview } from '@/components/landing/WorkspacePreview';
import { enableDemoMode } from '@/lib/demo';
import { toast } from 'sonner';

export function LandingHero() {
  const heroRef = useRef(null);
  const navigate = useNavigate();

  const handleHeroMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    heroRef.current.style.setProperty('--mouse-x', `${x}px`);
    heroRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const startDemo = () => {
    enableDemoMode();
    toast.success('Demo session started — explore freely.');
    navigate('/app/dashboard');
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={handleHeroMouseMove}
      className="group relative px-6 pt-12 pb-24 md:pt-24 md:pb-36 overflow-hidden"
    >
      {/* Base very dim dot grid */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Spotlight dot grid that reveals on hover */}
      <div
        className="absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-[0.15]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '24px 24px',
          WebkitMaskImage:
            'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), black, transparent)',
          maskImage:
            'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), black, transparent)',
        }}
      />
      <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center md:gap-16">
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
            className="mt-6 text-[52px] font-bold leading-[1.0] tracking-[-0.04em] xs:text-[52px] md:text-[72px] lg:text-[84px]"
          >
            Outages get <br />
            <span className="whitespace-nowrap text-[var(--color-brand-primary)]">
              resolved here.
            </span>{' '}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-7 max-w-lg text-[15px] leading-relaxed text-[var(--color-muted-strong)] md:mx-0 md:text-[16px]"
          >
            {APP_NAME} is the workspace your on-call team opens when production
            breaks. Live timelines, smart role assignment, and AI briefs that
            turn 19-minute outages into one-click postmortems.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-3 md:justify-start"
          >
            <Button
              asChild
              variant="gradient"
              size="xl"
              className="rounded-full px-7"
            >
              <Link to="/signup">
                Start managing free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="xl"
              onClick={startDemo}
              className="rounded-full px-5 text-[var(--color-muted-strong)]"
            >
              See live demo <ArrowRight className="h-4 w-4" />
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
                <div className="font-mono text-xl tabular-nums tracking-tight md:text-2xl">
                  {v}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  {l}
                </div>
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
  );
}
