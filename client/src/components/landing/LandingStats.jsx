import { STATS } from '@/data/landingData';

export function LandingStats() {
  return (
    <section id="why" className="border-y border-[var(--color-border)]">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-[var(--color-border)] md:grid-cols-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="bg-[var(--color-background)] px-6 py-12 md:py-16"
          >
            <div className="font-mono text-3xl tabular-nums tracking-tight md:text-4xl">
              {s.value}
            </div>
            <div className="mt-3 text-[13px] font-medium text-[var(--color-foreground)]">
              {s.label}
            </div>
            <div className="mt-1 text-[11px] text-[var(--color-muted)]">
              {s.sub}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
