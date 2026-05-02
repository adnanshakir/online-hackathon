import { useMemo, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react'; // eslint-disable-line no-unused-vars
import { Plus, Search, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IncidentsTable } from '@/components/incidents/IncidentsTable';
import { useUIStore } from '@/store/uiStore';
import { SEVERITY } from '@/lib/constants';
import { fadeUp } from '@/components/motion/variants';
import { cn } from '@/lib/utils';
import { listIncidents } from '@/lib/api';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'resolved', label: 'Resolved' },
];

export default function IncidentsList() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const setNewIncidentOpen = useUIStore((s) => s.setNewIncidentOpen);
  const [params, setParams] = useSearchParams();
  const filter = params.get('filter') || 'all';
  const severityFilter = params.get('severity') || 'all';
  const [query, setQuery] = useState('');

  const fetchIncidents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listIncidents({
        filter: filter === 'all' ? undefined : filter,
        severity: severityFilter === 'all' ? undefined : severityFilter,
      });
      setIncidents(data);
    } catch (err) {
      console.error('Failed to fetch incidents:', err);
    } finally {
      setLoading(false);
    }
  }, [filter, severityFilter]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const filtered = useMemo(() => {
    let out = incidents;
    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q)
      );
    }
    return out.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [incidents, query]);

  const counts = useMemo(
    () => ({
      all: incidents.length,
      active: incidents.filter((i) => i.status !== 'resolved').length,
      resolved: incidents.filter((i) => i.status === 'resolved').length,
    }),
    [incidents]
  );

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-7xl"
    >
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Incidents</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Triage, assign, and track every incident.
          </p>
        </div>
        <Button
          variant="gradient"
          size="sm"
          onClick={() => setNewIncidentOpen(true)}
        >
          <Plus className="h-4 w-4" /> New incident
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setParams(t.id === 'all' ? {} : { filter: t.id })}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                filter === t.id
                  ? 'bg-[var(--color-surface-elevated)] text-[var(--color-foreground)] shadow-sm'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
              )}
            >
              {t.label}
              <span
                className={cn(
                  'rounded-full px-1.5 py-0 text-[10px]',
                  filter === t.id
                    ? 'bg-[var(--color-background)] text-[var(--color-muted)]'
                    : 'bg-transparent text-[var(--color-muted)]'
                )}
              >
                {counts[t.id]}
              </span>
            </button>
          ))}
        </div>

        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search incidents…"
            className="pl-9"
          />
        </div>

        <div className="relative">
          <Filter className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-muted)]" />
          <select
            value={severityFilter}
            onChange={(e) => {
              const next = new URLSearchParams(params);
              if (e.target.value === 'all') next.delete('severity');
              else next.set('severity', e.target.value);
              setParams(next);
            }}
            className="h-10 appearance-none rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] pl-9 pr-3 text-xs font-medium text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
          >
            <option value="all">All severities</option>
            {Object.values(SEVERITY).map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          >
            <Loader2 className="h-8 w-8 text-[var(--color-brand-primary)]" />
          </motion.div>
          <p className="text-sm text-[var(--color-muted)]">
            Syncing with HQ...
          </p>
        </div>
      ) : (
        <IncidentsTable incidents={filtered} />
      )}
    </motion.div>
  );
}
