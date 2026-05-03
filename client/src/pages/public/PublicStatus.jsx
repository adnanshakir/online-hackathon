import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/Logo';
import { StatusHero } from '@/components/status/StatusHero';
import { ServiceCard } from '@/components/status/ServiceCard';
import { UptimeChart } from '@/components/status/UptimeChart';
import { PublicIncidentCard } from '@/components/status/PublicIncidentCard';
import { PastIncidents } from '@/components/status/PastIncidents';
import { SERVICES } from '@/data/services';
import { APP_NAME } from '@/lib/constants';
import * as api from '@/lib/api';

/**
 * Normalize a backend incident into the shape every status component expects.
 */
function normalizeIncident(raw) {
  if (!raw) return null;
  return {
    id: raw._id || raw.id,
    title: raw.title,
    severity: raw.severity,
    status: raw.status,
    serviceIds: raw.service ? [raw.service] : [],
    createdAt: raw.createdAt,
    resolvedAt:
      raw.status === 'resolved' ? raw.updatedAt || raw.createdAt : null,
    updates: [], // public endpoint doesn't include the timeline
  };
}

const SIM_TITLE = 'Investigating elevated error rate on checkout';
const SIM_UPDATES = [
  {
    delay: 0,
    status: 'investigating',
    message: 'We are investigating reports of checkout failures.',
  },
  {
    delay: 5000,
    status: 'identified',
    message: 'Identified an issue with the payment gateway integration.',
  },
  {
    delay: 10000,
    status: 'monitoring',
    message: 'Fix deployed. Monitoring recovery.',
  },
  {
    delay: 15000,
    status: 'resolved',
    message: 'The issue is resolved.',
  },
];

export default function PublicStatus() {
  const [active, setActive] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, force] = useState(0);

  // Fetch real public status. We don't need auth for this — the backend
  // route is intentionally open. Refresh every 30s so a customer leaving
  // the tab open sees state changes without a manual refresh.
  useEffect(() => {
    let cancelled = false;
    const fetchAll = async () => {
      try {
        const [statusResp, historyResp] = await Promise.all([
          api.getPublicStatus(),
          api.getStatusHistory(),
        ]);
        if (cancelled) return;
        const activeRaw = statusResp?.data || statusResp || [];
        const pastRaw = historyResp?.data || historyResp || [];
        setActive(activeRaw.map(normalizeIncident).filter(Boolean));
        setPast(pastRaw.map(normalizeIncident).filter(Boolean).slice(0, 12));
      } catch (err) {
        if (!cancelled) {
          // eslint-disable-next-line no-console
          console.error('Public status fetch failed:', err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchAll();
    const t = setInterval(fetchAll, 30_000);
    // Tick the "started X ago" labels on a faster cadence
    const t2 = setInterval(() => force((n) => n + 1), 5_000);
    return () => {
      cancelled = true;
      clearInterval(t);
      clearInterval(t2);
    };
  }, []);

  const [simRunning, setSimRunning] = useState(false);

  // Demo simulation logic
  const runSimulation = async () => {
    if (simRunning) return;
    setSimRunning(true);
    toast.info('Starting real-time simulation...');

    for (const step of SIM_UPDATES) {
      if (step.delay > 0) {
        await new Promise((r) => setTimeout(r, 2000)); // Faster for demo
      }
      const fake = {
        _id: 'sim-inc',
        title: SIM_TITLE,
        status: step.status,
        severity: 'critical',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setActive([normalizeIncident(fake)]);
    }

    toast.success('Simulation complete — system recovery confirmed.');
    setTimeout(() => {
      setSimRunning(false);
      setActive([]);
    }, 4000);
  };

  const allOperational = useMemo(
    () => !loading && active.length === 0,
    [loading, active.length]
  );

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      {/* Top bar */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-background)]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <Logo />
            <span className="hidden text-xs text-[var(--color-muted)] md:inline">
              / Status
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={runSimulation}
              disabled={simRunning}
              title="Demo only — runs a fake incident in real time"
            >
              <Zap
                className={`h-3.5 w-3.5 ${simRunning ? 'animate-pulse text-amber-500' : ''}`}
              />
              {simRunning ? 'Simulating…' : 'Simulate incident'}
            </Button>
            <Button
              variant="gradient"
              size="sm"
              onClick={() =>
                toast.success('Subscribed!', {
                  description: "You'll get an email when there's an update.",
                })
              }
            >
              <Bell className="h-3.5 w-3.5" />
              Subscribe
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <StatusHero allOperational={allOperational} activeCount={active.length} />

      {/* Active incidents */}
      {active.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 pb-10">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
            Active incidents
          </h2>
          <div className="space-y-4">
            {active.map((inc) => (
              <PublicIncidentCard key={inc.id} incident={inc} />
            ))}
          </div>
        </section>
      )}

      {/* Service grid — backend's /api/status doesn't yet return services,
          so we fall back to the seeded SERVICES catalogue for now. Swap to
          api.listServices() (or extend /api/status) once the backend ships
          the workspace-public listing. */}
      <section className="mx-auto max-w-5xl px-6 py-10">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
          Services
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.id} service={s} idx={i} />
          ))}
        </div>
      </section>

      {/* Uptime chart */}
      <section className="mx-auto max-w-5xl px-6 py-6">
        <UptimeChart days={90} />
      </section>

      {/* Past incidents */}
      <section className="mx-auto max-w-5xl px-6 pb-12">
        <PastIncidents incidents={past} />
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6 text-xs text-[var(--color-muted)]">
          <div>Powered by {APP_NAME}</div>
          <div className="flex items-center gap-3">
            <Link to="/" className="hover:text-[var(--color-foreground)]">
              Home
            </Link>
            <Link to="/login" className="hover:text-[var(--color-foreground)]">
              Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
