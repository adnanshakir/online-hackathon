import { useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Target, AlertTriangle } from 'lucide-react';

export function CreativeAIBriefShowcase() {
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="group relative flex h-[500px] md:h-[600px] w-full items-center justify-center overflow-hidden rounded-3xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-foreground)] shadow-2xl"
    >

      {/* Base very dim dot grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}
      />

      {/* Spotlight dot grid that reveals on hover */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-[0.25]"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '24px 24px',
          WebkitMaskImage: 'radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), black, transparent)',
          maskImage: 'radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), black, transparent)'
        }}
      />

      {/* The Central Generative Text Block */}
      <div className="relative z-10 max-w-4xl px-10 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-14 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--color-muted)]"
        >
          <Sparkles className="mr-2 inline-block h-3.5 w-3.5 text-[var(--color-brand-primary)]" />
          Live AI Analysis
        </motion.div>

        <div className="text-[17px] sm:text-[24px] md:text-[36px] font-medium leading-[2.2] md:leading-[1.7] tracking-tight text-[var(--color-foreground)]/70">
          A 19-minute outage on the checkout API was triggered by a{' '}

          <span className="relative inline-block whitespace-nowrap">
            {/* The Text that gets highlighted */}
            <motion.span
              initial={{ color: 'var(--color-muted)' }}
              whileInView={{ color: 'var(--color-brand-primary)' }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="relative z-10 transition-colors"
            >
              saturated webhook queue
            </motion.span>

            {/* The Annotation Node (Root Cause) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -top-28 md:-top-24 left-1/2 flex -translate-x-1/2 flex-col items-center group"
            >
              <div className="flex cursor-pointer items-center gap-2 rounded-full border border-[var(--color-brand-primary)]/30 bg-[var(--color-brand-primary)]/10 px-2.5 py-1 md:px-3.5 md:py-1.5 font-mono text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-brand-primary)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-[var(--color-brand-primary)]/60 hover:bg-[var(--color-brand-primary)]/20 hover:shadow-[0_0_20px_-5px_var(--color-brand-primary)]">
                <Target className="h-3 w-3" />
                Root Cause · 87% Match
              </div>
              {/* Connecting Line */}
              <div className="mt-2 h-10 md:h-8 w-px bg-gradient-to-b from-[var(--color-brand-primary)]/60 to-transparent transition-all duration-300 group-hover:from-[var(--color-brand-primary)]/100" />
            </motion.div>
          </span>

          {' '}following the{' '}

          <span className="relative inline-block">
            <code className="mx-1 cursor-default rounded bg-[var(--color-foreground)]/5 px-2 py-1 font-mono text-[22px] text-[var(--color-foreground)]/90 transition-colors duration-300 hover:bg-[var(--color-foreground)]/10 md:text-[30px]">v2.4.1</code>

            {/* The Annotation Node (Action) */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -bottom-36 md:-bottom-28 left-1/2 flex -translate-x-1/2 flex-col items-center group"
            >
              {/* Connecting Line */}
              <div className="mb-2 h-12 md:h-8 w-px bg-gradient-to-t from-orange-400/60 to-transparent transition-all duration-300 group-hover:from-orange-400/100" />
              <div className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 md:px-4 md:py-2 font-mono text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-orange-500/60 hover:bg-orange-500/20 hover:shadow-[0_0_20px_-5px_rgba(249,115,22,0.8)]">
                <AlertTriangle className="h-3.5 w-3.5" />
                Suggested: Roll back
              </div>
            </motion.div>
          </span>

          {' '}deployment. Mitigation succeeded; zero customer reports filed.
        </div>

      </div>
    </div>
  );
}
