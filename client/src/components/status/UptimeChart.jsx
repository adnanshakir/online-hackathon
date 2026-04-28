import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '@/components/ui/card';
import { generateUptimeSeries } from '@/data/services';

export function UptimeChart({ days = 90 }) {
  // Aggregate: pick the worst service per-day to show "overall" uptime
  const series = generateUptimeSeries(7, days);
  const overallUptime = (
    series.reduce((acc, d) => acc + d.uptime, 0) / series.length
  ).toFixed(3);

  return (
    <Card className="p-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-lg font-semibold">90-day uptime</h2>
          <p className="text-xs text-[var(--color-muted)]">
            Aggregate availability across all services
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold tabular-nums">{overallUptime}%</div>
          <div className="text-[10px] uppercase tracking-wider text-[var(--color-muted)]">Overall</div>
        </div>
      </div>
      <div className="mt-4 h-44">
        <ResponsiveContainer>
          <AreaChart data={series} margin={{ top: 10, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="uptime-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <YAxis domain={[99, 100]} hide />
            <Tooltip
              contentStyle={{
                background: 'var(--color-surface-elevated)',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: 'var(--color-muted)' }}
              formatter={(v) => [`${Number(v).toFixed(3)}%`, 'Uptime']}
            />
            <Area
              type="monotone"
              dataKey="uptime"
              stroke="#10b981"
              strokeWidth={1.8}
              fill="url(#uptime-gradient)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
