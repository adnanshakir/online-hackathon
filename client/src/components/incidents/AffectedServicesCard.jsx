import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { getServiceById } from '@/data/services';

export function AffectedServicesCard({ serviceIds = [] }) {
  const services = serviceIds.map(getServiceById).filter(Boolean);
  return (
    <Card className="p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
        Affected services
      </h3>
      <ul className="mt-3 space-y-2">
        {services.length === 0 && (
          <li className="text-xs text-[var(--color-muted)]">No services tagged.</li>
        )}
        {services.map((s) => (
          <li key={s.id} className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{s.name}</div>
              <div className="text-[11px] text-[var(--color-muted)] truncate">
                {s.description}
              </div>
            </div>
            <StatusBadge status={s.status} animated />
          </li>
        ))}
      </ul>
    </Card>
  );
}
