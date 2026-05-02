import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react'; // eslint-disable-line no-unused-vars
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/StatCard';
import { ActiveIncidentsList } from '@/components/dashboard/ActiveIncidentsList';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { USERS } from '@/data/users';
import { fadeUp } from '@/components/motion/variants';
import { listIncidents } from '@/lib/api';

function generateSpark(seed = 1, length = 16) {
  const out = [];
  let v = 50;
  for (let i = 0; i < length; i++) {
    v += (Math.sin((i + seed) * 1.7) + (Math.random() - 0.5)) * 8;
    out.push(Math.max(10, v));
  }
  return out;
}

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await listIncidents();
        setIncidents(data);
      } catch (err) {
        console.error('Dashboard fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const stats = useMemo(() => {
    const active = incidents.filter((i) => i.status !== 'resolved');
    const resolvedThisWeek = incidents.filter(
      (i) =>
        i.status === 'resolved' &&
        i.resolvedAt &&
        Date.now() - new Date(i.resolvedAt).getTime() < 7 * 24 * 3600 * 1000
    );
    const resolvedAll = incidents.filter(
      (i) => i.status === 'resolved' && i.resolvedAt
    );
    const avgMin =
      resolvedAll.length === 0
        ? 0
        : resolvedAll.reduce((acc, i) => {
            const ms = new Date(i.resolvedAt) - new Date(i.createdAt);
            return acc + ms / 60000;
          }, 0) / resolvedAll.length;
    const teamOnline = USERS.filter((u) => u.online).length;
    return {
      active: active.length,
      activeIncidents: active,
      avgResolutionMin: Math.round(avgMin),
      resolvedWeek: resolvedThisWeek.length,
      teamOnline,
    };
  }, [incidents]);

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-7xl"
    >
      {/* Header */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Live status across all your services and active incidents.
          </p>
        </div>
        <Button variant="gradient" size="sm" asChild>
          <Link to="/app/incidents">
            View all incidents <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex h-96 flex-col items-center justify-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          >
            <Loader2 className="h-10 w-10 text-[var(--color-brand-primary)]" />
          </motion.div>
          <p className="text-sm font-medium text-[var(--color-muted)]">
            Syncing with HQ...
          </p>
        </div>
      ) : (
        <>
          {/* Stat row */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Active incidents"
              value={stats.active}
              icon={AlertTriangle}
              spark={generateSpark(1)}
              sparkColor="#ef4444"
              delta={stats.active > 0 ? '+2 this week' : 'No change'}
              trend={stats.active > 0 ? 'down' : 'up'}
            />
            <StatCard
              label="Avg resolution time"
              value={stats.avgResolutionMin}
              format={(v) => `${Math.round(v)}m`}
              icon={Clock}
              spark={generateSpark(2)}
              sparkColor="#3b82f6"
              delta="-18% vs last week"
              trend="up"
            />
            <StatCard
              label="Resolved this week"
              value={stats.resolvedWeek}
              icon={CheckCircle2}
              spark={generateSpark(3)}
              sparkColor="#10b981"
              delta="On track"
              trend="up"
            />
            <StatCard
              label="Team online"
              value={stats.teamOnline}
              format={(v) => `${Math.round(v)} / ${USERS.length}`}
              icon={Users}
              spark={generateSpark(4)}
              sparkColor="#8b5cf6"
            />
          </div>

          {/* Body grid */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-semibold">Active incidents</h2>
                <Link
                  to="/app/incidents?filter=active"
                  className="text-xs text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                >
                  View all →
                </Link>
              </div>
              <ActiveIncidentsList incidents={stats.activeIncidents} />
            </div>

            <Card className="p-5">
              <h2 className="text-base font-semibold">Recent activity</h2>
              <p className="text-xs text-[var(--color-muted)]">
                Last updates across all incidents.
              </p>
              <div className="mt-5">
                <ActivityFeed incidents={incidents} limit={7} />
              </div>
            </Card>
          </div>
        </>
      )}
    </motion.div>
  );
}
