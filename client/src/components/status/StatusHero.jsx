import { motion } from 'motion/react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StatusHero({ allOperational, activeCount }) {
  return (
    <section className="relative overflow-hidden">
      {/* glow + grid background */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 -z-10 opacity-40 blur-[120px]',
          allOperational
            ? 'bg-emerald-500/30'
            : 'bg-red-500/30'
        )}
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />

      <div className="mx-auto max-w-5xl px-6 py-16 md:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/60 px-4 py-1.5 backdrop-blur"
        >
          <span className="relative inline-flex">
            <span
              className={cn(
                'inline-block size-2 rounded-full',
                allOperational ? 'bg-emerald-500' : 'bg-red-500'
              )}
            />
            <span
              className={cn(
                'absolute inset-0 inline-block size-2 rounded-full',
                allOperational ? 'bg-emerald-500' : 'bg-red-500',
                'animate-ping'
              )}
            />
          </span>
          <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
            Live · updated every 5s
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-6 flex items-center justify-center gap-3 text-balance text-4xl font-semibold tracking-tight md:text-6xl"
        >
          {allOperational ? (
            <>
              <CheckCircle2 className="hidden h-10 w-10 text-emerald-500 md:inline" />
              <span>All systems operational</span>
            </>
          ) : (
            <>
              <AlertTriangle className="hidden h-10 w-10 text-red-500 md:inline" />
              <span>We're investigating an issue</span>
            </>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-4 max-w-xl text-pretty text-base text-[var(--color-muted)]"
        >
          {allOperational
            ? 'Everything is running smoothly. We continuously monitor every service and post updates here in real time.'
            : `${activeCount} ${activeCount === 1 ? 'incident' : 'incidents'} in progress. We're actively working on a fix and will post updates as we learn more.`}
        </motion.p>
      </div>
    </section>
  );
}
