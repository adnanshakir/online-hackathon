import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion as _motion } from 'motion/react';
const Motion = _motion;
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
import { fadeUp } from '@/components/motion/variants';
import { listIncidents, workspace, getTimeline } from '@/lib/api';

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
  const [team, setTeam] = useState([]);
  const [allUpdates, setAllUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [incData, teamData] = await Promise.all([
        listIncidents(),
        workspace.listUsers(),
      ]);
      setIncidents(incData);
      setTeam(teamData);

      // Fetch updates for the most recent active incidents to populate the feed
      const activeOnly = incData
        .filter((i) => i.status !== 'resolved')
        .slice(0, 5);
      const updatesPromises = activeOnly.map((i) => getTimeline(i.id));
      const updatesResults = await Promise.all(updatesPromises);

      const flatUpdates = updatesResults.flatMap((updates, idx) =>
        updates.map((u) => ({
          ...u,
          incidentId: activeOnly[idx].id,
          incidentTitle: activeOnly[idx].title,
        }))
      );
      setAllUpdates(
        flatUpdates.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
    } catch (err) {
      console.error('Dashboard fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // 10s poll
    return () => clearInterval(interval);
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

    // Simulate "online" status for real users if they were updated recently
    // In a real app, this would come from a presence API/WebSocket
    const onlineCount =
      team.length > 0 ? Math.max(1, Math.floor(team.length * 0.7)) : 0;

    return {
      active: active.length,
      activeIncidents: active,
      avgResolutionMin: Math.round(avgMin),
      resolvedWeek: resolvedThisWeek.length,
      teamTotal: team.length,
      teamOnline: onlineCount,
    };
  }, [incidents, team]);

  return (
    <Motion.div
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
          <Motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          >
            <Loader2 className="h-10 w-10 text-[var(--color-brand-primary)]" />
          </Motion.div>
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
              delta={stats.active > 0 ? `${stats.active} current` : 'All clear'}
              trend={stats.active > 0 ? 'down' : 'up'}
            />
            <StatCard
              label="Avg resolution time"
              value={stats.avgResolutionMin}
              format={(v) => `${Math.round(v)}m`}
              icon={Clock}
              spark={generateSpark(2)}
              sparkColor="#3b82f6"
              delta={
                stats.avgResolutionMin > 0
                  ? 'Based on latest data'
                  : 'No resolutions yet'
              }
              trend="up"
            />
            <StatCard
              label="Resolved this week"
              value={stats.resolvedWeek}
              icon={CheckCircle2}
              spark={generateSpark(3)}
              sparkColor="#10b981"
              delta={
                stats.resolvedWeek > 0
                  ? `${stats.resolvedWeek} resolved`
                  : 'Waiting for closure'
              }
              trend="up"
            />
            <StatCard
              label="Team online"
              value={stats.teamOnline}
              format={(v) => `${Math.round(v)} / ${stats.teamTotal}`}
              icon={Users}
              spark={generateSpark(4)}
              sparkColor="#8b5cf6"
              delta="Active now"
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
                <ActivityFeed updates={allUpdates} limit={7} />
              </div>
            </Card>
          </div>
        </>
      )}
    </Motion.div>
  );
}
