import { motion } from 'motion/react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { AnimatedCounter } from '@/components/shared/AnimatedCounter';
import { Sparkline } from '@/components/shared/Sparkline';
import { cn } from '@/lib/utils';

export function StatCard({
  label,
  value,
  format = (v) => Math.round(v).toLocaleString(),
  delta,
  trend = 'up',
  spark = [],
  sparkColor = '#8b5cf6',
  icon: Icon,
  className,
}) {
  const trendUp = trend === 'up';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className={cn('group overflow-hidden p-5', className)}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
              {label}
            </p>
            <div className="mt-2 text-3xl font-semibold tracking-tight">
              <AnimatedCounter value={Number(value) || 0} format={format} />
            </div>
          </div>
          {Icon && (
            <div className="grid size-9 place-items-center rounded-lg bg-[var(--color-surface-elevated)] text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-foreground)]">
              <Icon className="h-4 w-4" />
            </div>
          )}
        </div>
        <div className="mt-4 flex items-end justify-between gap-3">
          {delta != null && (
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium',
                trendUp
                  ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                  : 'border-red-500/20 bg-red-500/10 text-red-400'
              )}
            >
              {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {delta}
            </span>
          )}
          <div className="flex-1">
            <Sparkline data={spark} color={sparkColor} height={36} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
