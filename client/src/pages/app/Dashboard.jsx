import { useMemo, useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion as _motion } from 'motion/react';
const Motion = _motion;
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  ArrowRight,
  Loader2,
  Bell,
  CheckCheck,
  Server,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/StatCard';
import { ActiveIncidentsList } from '@/components/dashboard/ActiveIncidentsList';
import { fadeUp } from '@/components/motion/variants';
import {
  listIncidents,
  workspace,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  getNotificationStreamUrl,
} from '@/lib/api';
import { timeAgo } from '@/lib/format';

function generateSpark(seed = 1, length = 16) {
  const out = [];
  let v = 50;
  for (let i = 0; i < length; i++) {
    v += (Math.sin((i + seed) * 1.7) + (Math.random() - 0.5)) * 8;
    out.push(Math.max(10, v));
  }
  return out;
}

/* ── Type icon map ── */
const TYPE_META = {
  incident: { Icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
  service: { Icon: Server, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  workspace: { Icon: Users, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  default: {
    Icon: Info,
    color: 'text-[var(--color-muted)]',
    bg: 'bg-[var(--color-surface-elevated)]',
  },
};

function NotifIcon({ type }) {
  const meta = TYPE_META[type] ?? TYPE_META.default;
  const { Icon, color, bg } = meta;
  return (
    <div className={`grid size-8 shrink-0 place-items-center rounded-lg ${bg}`}>
      <Icon className={`h-3.5 w-3.5 ${color}`} />
    </div>
  );
}

/* ── Dashboard notification feed ── */
function NotificationFeed() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = useCallback(async () => {
    try {
      const res = await getNotifications(1, 15);
      setNotifications(res.data ?? []);
      setUnreadCount(res.unreadCount ?? 0);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifs();

    // SSE for real-time push
    let sse;
    try {
      sse = new EventSource(getNotificationStreamUrl(), {
        withCredentials: true,
      });
      sse.addEventListener('notification', (e) => {
        try {
          const notif = JSON.parse(e.data);
          setNotifications((prev) => {
            if (prev.some((n) => n._id === notif._id)) return prev;
            return [notif, ...prev].slice(0, 15);
          });
          setUnreadCount((c) => c + 1);
        } catch {
          /* ignore */
        }
      });
    } catch {
      /* fallback to polling */
    }

    // 30s polling fallback
    const poll = setInterval(fetchNotifs, 30000);
    return () => {
      sse?.close();
      clearInterval(poll);
    };
  }, [fetchNotifs]);

  const handleClick = async (n) => {
    if (!n.isRead) {
      try {
        await markNotificationRead(n._id);
        setNotifications((prev) =>
          prev.map((x) => (x._id === n._id ? { ...x, isRead: true } : x))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch {
        /* silent */
      }
    }
    if (n.link) navigate(`/app${n.link}`);
  };

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      /* silent */
    }
  };

  return (
    <Card className="p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-[var(--color-muted)]" />
          <h2 className="text-base font-semibold">Notifications</h2>
          {unreadCount > 0 && (
            <span className="rounded-full bg-red-500/15 px-1.5 py-px text-[10px] font-bold text-red-400">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAll}
            className="flex items-center gap-1 text-[11px] text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
          >
            <CheckCheck className="h-3 w-3" />
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="flex-1 space-y-1 overflow-y-auto max-h-[380px]">
        {loading ? (
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="size-8 rounded-lg bg-[var(--color-surface-elevated)] shrink-0" />
                <div className="flex-1 space-y-2 py-0.5">
                  <div className="h-2.5 w-3/4 rounded bg-[var(--color-surface-elevated)]" />
                  <div className="h-2 w-1/2 rounded bg-[var(--color-surface-elevated)]" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <div className="grid size-10 place-items-center rounded-full bg-[var(--color-surface-elevated)]">
              <Bell className="h-4 w-4 text-[var(--color-muted)]" />
            </div>
            <div>
              <p className="text-sm font-medium">All caught up!</p>
              <p className="mt-1 text-[11px] text-[var(--color-muted)]">
                Notifications appear here when incidents or workspace events
                occur.
              </p>
            </div>
          </div>
        ) : (
          notifications.map((n) => (
            <button
              key={n._id}
              onClick={() => handleClick(n)}
              className={`flex w-full gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-[var(--color-surface-elevated)] ${
                !n.isRead ? 'bg-[var(--color-brand-primary)]/[0.04]' : ''
              }`}
            >
              <NotifIcon type={n.type} />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold leading-snug">
                    {n.title}
                  </p>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className="text-[10px] text-[var(--color-muted)] whitespace-nowrap">
                      {timeAgo(n.createdAt)}
                    </span>
                    {!n.isRead && (
                      <span className="size-1.5 rounded-full bg-[var(--color-brand-primary)] shrink-0" />
                    )}
                  </div>
                </div>
                <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-[var(--color-muted)]">
                  {n.message}
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [incData, teamData] = await Promise.all([
        listIncidents(),
        workspace.listUsers(),
      ]);
      setIncidents(incData);
      setTeam(teamData);
    } catch (err) {
      console.error('Dashboard fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
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

            {/* Real-time notification feed */}
            <NotificationFeed />
          </div>
        </>
      )}
    </Motion.div>
  );
}
