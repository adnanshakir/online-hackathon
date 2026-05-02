import { motion } from 'motion/react';
import { Users, Sparkles, CheckCircle2 } from 'lucide-react';
import { PREVIEW_TIMELINE, TONE_LABEL } from '@/data/landingData';

export function WorkspacePreview() {
  return (
    <div className="glow-border rounded-2xl min-w-0 max-w-full">
      <div className="overflow-hidden rounded-2xl bg-[var(--color-surface)] min-w-0 max-w-full">
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
              <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                4 updates ·{' '}
                <span className="relative inline-flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--color-brand-primary)] opacity-75" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-[var(--color-brand-primary)]" />
                </span>{' '}
                live
              </span>
            </div>

            <div className="relative space-y-3.5">
              <motion.div
                aria-hidden
                className="absolute left-[5px] top-2 bottom-2 w-px bg-[var(--color-border)] origin-top"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 2.5, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
              />
              {PREVIEW_TIMELINE.map((u, i) => (
                <motion.div
                  key={u.time}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 1.3 + i * 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex items-start gap-3 pl-7"
                >
                  <span className={`absolute left-0 top-1.5 size-3 rounded-full ring-4 ring-[var(--color-surface)] ${u.dot}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="font-mono text-[10px] tabular-nums text-[var(--color-muted)]">{u.time}</span>
                      <span className={`rounded border px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider ${TONE_LABEL[u.label]}`}>
                        {u.label}
                      </span>
                    </div>
                    <div className="mt-0.5 text-[12.5px] leading-snug text-[var(--color-foreground)]/95">{u.text}</div>
                  </div>
                </motion.div>
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
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '87%' }}
                transition={{ duration: 1.2, delay: 3.5, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-[var(--color-brand-primary)]"
              />
            </div>

            <div className="mt-4 space-y-1.5">
              {['Roll back v2.4.1', 'Add queue depth alert', 'Schedule postmortem'].map((s) => (
                <div key={s} className="flex items-start gap-1.5 text-[11.5px]">
                  <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-[var(--color-brand-primary)]" />
                  <span className="text-[var(--color-muted-strong)] leading-tight">{s}</span>
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
              className={`whitespace-nowrap rounded-full border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] ${i === 0
                ? 'border-[var(--color-brand-primary)]/40 bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]'
                : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted-strong)]'
                }`}
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
