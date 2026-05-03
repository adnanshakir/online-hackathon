import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion as _motion } from 'motion/react';
const Motion = _motion;
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Info,
  Activity,
} from 'lucide-react';
import { http } from '@/lib/api';
import { formatDateTime, timeAgo } from '@/lib/format';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import { APP_NAME } from '@/lib/constants';

export default function PublicStatus() {
  const { teamSlug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const response = await http.get(`/status/page/${teamSlug}`);
        setData(response.data.data);
      } catch {
        setError('Status page not found or unavailable.');
      } finally {
        setLoading(false);
      }
    }
    if (teamSlug) {
      fetchStatus();
      const interval = setInterval(fetchStatus, 30_000);
      return () => clearInterval(interval);
    }
  }, [teamSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-brand-primary)]" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] text-[var(--color-foreground)]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Not Found</h1>
          <p className="text-[var(--color-muted)] mt-2">{error}</p>
          <Link
            to="/"
            className="text-[var(--color-brand-primary)] hover:underline mt-4 inline-block"
          >
            Go to homepage
          </Link>
        </div>
      </div>
    );
  }

  const { settings, services, activeIncidents } = data;
  const isAllOperational =
    services.every((s) => s.status === 'operational') &&
    activeIncidents.length === 0;

  return (
    <div
      className={`min-h-screen ${settings.theme === 'light' ? 'bg-zinc-50 text-zinc-900' : 'bg-[#0A0A0A] text-zinc-50'} selection:bg-[var(--color-brand-primary)]/30`}
    >
      {/* Dynamic Theme Colors */}
      <style>{`
        :root {
          --color-surface-status: ${settings.theme === 'light' ? '#ffffff' : '#121212'};
          --color-border-status: ${settings.theme === 'light' ? '#e4e4e7' : '#27272a'};
          --color-muted-status: ${settings.theme === 'light' ? '#71717a' : '#a1a1aa'};
        }
      `}</style>

      {/* Header */}
      <header className="border-b border-[var(--color-border-status)] bg-[var(--color-surface-status)]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {settings.logo ? (
              <img
                src={settings.logo}
                alt={settings.siteName}
                className="h-8 w-8 rounded-md"
              />
            ) : (
              <div className="h-8 w-8 rounded-md bg-[var(--color-brand-primary)] flex items-center justify-center">
                <Activity className="h-5 w-5 text-black" />
              </div>
            )}
            <h1 className="font-bold text-lg">{settings.siteName}</h1>
          </div>
          {settings.showSubscribers && (
            <button className="text-sm font-medium px-4 py-2 rounded-full bg-[var(--color-brand-primary)] text-black hover:bg-[var(--color-brand-secondary)] transition-colors">
              Subscribe to Updates
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Overall Status Banner */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 md:p-8 rounded-2xl border-2 flex flex-col md:flex-row items-center gap-6 justify-between ${
            isAllOperational
              ? 'bg-[var(--color-brand-primary)]/10 border-[var(--color-brand-primary)]/30'
              : 'bg-amber-500/10 border-amber-500/30'
          }`}
        >
          <div className="flex items-center gap-4">
            {isAllOperational ? (
              <CheckCircle2 className="h-10 w-10 text-[var(--color-brand-primary)]" />
            ) : (
              <AlertTriangle className="h-10 w-10 text-amber-500" />
            )}
            <div>
              <h2 className="text-2xl font-bold">
                {isAllOperational
                  ? 'All Systems Operational'
                  : 'Some Systems Are Experiencing Issues'}
              </h2>
              <p className="text-[var(--color-muted-status)] mt-1">
                Refreshed {timeAgo(new Date().toISOString())}
              </p>
            </div>
          </div>
        </Motion.div>

        {/* Public Announcement */}
        {settings.announcement?.isActive && settings.announcement.message && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div
              className={`p-6 rounded-xl border ${
                settings.announcement.type === 'critical'
                  ? 'bg-red-500/10 border-red-500/30 text-red-500'
                  : settings.announcement.type === 'warning'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                    : 'bg-blue-500/10 border-blue-500/30 text-blue-500'
              }`}
            >
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 mt-0.5" />
                <div className="prose prose-sm dark:prose-invert max-w-none text-current">
                  <ReactMarkdown>{settings.announcement.message}</ReactMarkdown>
                </div>
              </div>
            </div>
          </Motion.div>
        )}

        {/* Services Status */}
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-bold">System Status</h3>
          <div className="rounded-xl border border-[var(--color-border-status)] bg-[var(--color-surface-status)] overflow-hidden divide-y divide-[var(--color-border-status)]">
            {services.map((service) => (
              <div
                key={service._id}
                className="p-4 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <div>
                  <div className="font-medium">{service.name}</div>
                  {service.description && (
                    <div className="text-xs text-[var(--color-muted-status)] mt-0.5">
                      {service.description}
                    </div>
                  )}
                </div>
                {service.status === 'operational' ? (
                  <span className="text-sm font-medium text-[var(--color-brand-primary)] flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> Operational
                  </span>
                ) : service.status === 'degraded' ? (
                  <span className="text-sm font-medium text-amber-500 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" /> Degraded
                  </span>
                ) : (
                  <span className="text-sm font-medium text-red-500 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" /> Outage
                  </span>
                )}
              </div>
            ))}
            {services.length === 0 && (
              <div className="p-8 text-center text-[var(--color-muted-status)]">
                No services configured yet.
              </div>
            )}
          </div>
        </Motion.div>

        {/* Active Incidents */}
        {settings.showIncidents && activeIncidents.length > 0 && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold">Active Incidents</h3>
            <div className="space-y-4">
              {activeIncidents.map((inc) => (
                <div
                  key={inc._id}
                  className="rounded-xl border border-[var(--color-border-status)] bg-[var(--color-surface-status)] p-6"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h4 className="text-lg font-bold">{inc.title}</h4>
                    <Badge
                      variant={
                        inc.severity === 'critical'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {inc.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-[var(--color-muted-status)] mb-4">
                    Investigating since {formatDateTime(inc.createdAt)}
                  </div>
                  {inc.message && (
                    <div className="prose prose-sm dark:prose-invert max-w-none p-4 rounded-lg bg-black/5 dark:bg-white/5">
                      <ReactMarkdown>{inc.message}</ReactMarkdown>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Motion.div>
        )}
      </main>

      <footer className="border-t border-[var(--color-border-status)] mt-20">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6 text-sm text-[var(--color-muted-status)]">
          <p>
            Powered by{' '}
            <span className="font-bold text-[var(--color-brand-primary)]">
              {APP_NAME}
            </span>
          </p>
          <Link
            to="/"
            className="hover:text-[var(--color-brand-primary)] transition-colors"
          >
            Get your own status page
          </Link>
        </div>
      </footer>
    </div>
  );
}
