import { Card } from '@/components/ui/card';
import { IncidentRow } from './IncidentRow';
import { EmptyState } from '@/components/shared/EmptyState';
import { Inbox } from 'lucide-react';

export function IncidentsTable({ incidents }) {
  if (!incidents.length) {
    return (
      <EmptyState
        icon={Inbox}
        title="No incidents match your filters"
        description="Try clearing filters or switching tabs to find what you're looking for."
      />
    );
  }
  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-left text-[10px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
              <th className="px-5 py-3">Incident</th>
              <th className="px-3 py-3">Severity</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Responders</th>
              <th className="px-3 py-3">Duration</th>
              <th className="px-3 py-3">Last update</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {incidents.map((inc) => (
              <IncidentRow key={inc.id} incident={inc} />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
