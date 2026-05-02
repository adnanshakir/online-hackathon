import { motion } from 'motion/react';
import { fadeUp } from '@/components/motion/variants';

export function PagePlaceholder({ title, description, badge }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-3xl"
    >
      <div className="flex items-center gap-3">
        {badge && (
          <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
            {badge}
          </span>
        )}
      </div>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
      {description && (
        <p className="mt-3 max-w-xl text-[var(--color-muted)]">{description}</p>
      )}

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-32 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/40"
          />
        ))}
      </div>
    </motion.div>
  );
}
