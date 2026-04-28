import { motion } from 'motion/react';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Sparkline } from '@/components/shared/Sparkline';
import { generateUptimeSeries } from '@/data/services';

export function ServiceCard({ service, idx = 0 }) {
  const series = generateUptimeSeries(idx + 1, 60).map((d) => d.uptime);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: idx * 0.05 }}
    >
      <Card className="p-5 transition-all hover:border-[var(--color-muted)]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold truncate">{service.name}</h3>
            <p className="mt-0.5 text-xs text-[var(--color-muted)] truncate">{service.description}</p>
          </div>
          <StatusBadge status={service.status} animated />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--color-muted)]">Response</div>
            <div className="mt-0.5 font-medium tabular-nums">{service.responseTime}ms</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--color-muted)]">90-day uptime</div>
            <div className="mt-0.5 font-medium tabular-nums">{service.uptime90d.toFixed(2)}%</div>
          </div>
        </div>

        <div className="mt-3">
          <Sparkline
            data={series}
            color={service.status === 'operational' ? '#10b981' : '#ef4444'}
            height={32}
          />
        </div>
      </Card>
    </motion.div>
  );
}
