import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Bell, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/Logo';
import { StatusHero } from '@/components/status/StatusHero';
import { ServiceCard } from '@/components/status/ServiceCard';
import { UptimeChart } from '@/components/status/UptimeChart';
import { PublicIncidentCard } from '@/components/status/PublicIncidentCard';
import { PastIncidents } from '@/components/status/PastIncidents';
import { useIncidentsStore } from '@/store/incidentsStore';
import { SERVICES } from '@/data/services';
import { APP_NAME } from '@/lib/constants';
import * as api from '@/lib/api';

const SIM_TITLE = 'Investigating elevated error rate on checkout';
const SIM_UPDATES = [
  {
    delay: 0,
    statusChange: 'investigating',
    message: 'Pages on the checkout flow are returning errors for a subset of users. Our team is on it.',
  },
  {
    delay: 5_000,
    statusChange: null,
    message: 'We have isolated the issue to our payment provider integration. Mitigation is in progress.',
  },
  {
    delay: 10_000,
    statusChange: 'identified',
    message: 'A recent deploy introduced an incompatible payload format. Reverting now.',
  },
  {
    delay: 15_000,
    statusChange: 'monitoring',
    message: 'Revert is rolling out across regions. Error rate is dropping. Continuing to monitor.',
  },
  {
    delay: 22_000,
    statusChange: 'resolved',
    message: 'Error rate is back to baseline and verified across all regions. Apologies for the disruption.',
  },
];

export default function PublicStatus() {
  const incidents = useIncidentsStore((s) => s.incidents);
  const [, force] = useState(0);
  const [simRunning, setSimRunning] = useState(false);
  const simIdRef = useRef(null);

  // Auto-refresh active section every 5 sec
  useEffect(() => {
    const t = setInterval(() => force((n) => n + 1), 5_000);
    return () => clearInterval(t);
  }, []);

  const active = useMemo(
    () => incidents.filter((i) => i.status !== 'resolved'),
    [incidents]
  );
  const past = useMemo(
    () =>
      incidents
        .filter((i) => i.status === 'resolved')
        .sort((a, b) => new Date(b.resolvedAt) - new Date(a.resolvedAt))
        .slice(0, 12),
    [incidents]
  );

  const allOperational = active.length === 0;

  const runSimulation = async () => {
    if (simRunning) return;
    setSimRunning(true);
    toast.info('Demo: simulating an incident in real time');
    const inc = await api.createIncident({
      title: SIM_TITLE,
      description:
        'Customers may see errors during checkout. We are actively investigating.',
      severity: 'high',
      serviceIds: ['s_pay', 's_api'],
      assigneeIds: ['u_priya', 'u_alex'],
    });
    simIdRef.current = inc.id;

    // The first update is auto-created by createIncident; post the rest
    SIM_UPDATES.slice(1).forEach((u) => {
      setTimeout(async () => {
        await api.postUpdate(inc.id, {
          message: u.message,
          statusChange: u.statusChange,
          authorId: 'u_priya',
        });
      }, u.delay);
    });

    setTimeout(() => {
      setSimRunning(false);
      toast.success('Simulation complete', {
        description: 'Incident resolved — check the timeline.',
      });
    }, 24_000);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      {/* Top bar */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-background)]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo />
            <span className="hidden text-xs text-[var(--color-muted)] md:inline">/ Status</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={runSimulation}
              disabled={simRunning}
              title="Demo only — runs a fake incident in real time"
            >
              <Zap className="h-3.5 w-3.5" />
              {simRunning ? 'Simulation running…' : 'Simulate incident'}
            </Button>
            <Button
              variant="gradient"
              size="sm"
              onClick={() =>
                toast.success('Subscribed!', {
                  description: 'You\'ll get an email when there\'s an update.',
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

      {/* Service grid */}
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
            <Link to="/" className="hover:text-[var(--color-foreground)]">Home</Link>
            <Link to="/login" className="hover:text-[var(--color-foreground)]">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
