import { useEffect, useState } from 'react';
import { durationBetween } from '@/lib/format';

/**
 * Re-renders every second to keep elapsed time fresh.
 */
export function LiveDuration({ from, until = null, intervalMs = 1000, className }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    if (until) return;
    const id = setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [until, intervalMs]);
  return <span className={className}>{durationBetween(from, until || new Date())}</span>;
}
