import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as _motion } from 'motion/react';
const Motion = _motion;
import {
  Server,
  Plus,
  Activity,
  AlertTriangle,
  AlertCircle,
  Wrench,
  Loader2,
  Globe,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { fadeUp } from '@/components/motion/variants';
import { cn } from '@/lib/utils';
import * as api from '@/lib/api';

const STATUS_OPTIONS = [
  {
    value: 'operational',
    label: 'Operational',
    icon: Activity,
    tone: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    dot: 'bg-emerald-500',
  },
  {
    value: 'degraded',
    label: 'Degraded',
    icon: AlertTriangle,
    tone: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
    dot: 'bg-yellow-500',
  },
  {
    value: 'down',
    label: 'Down',
    icon: AlertCircle,
    tone: 'border-red-500/30 bg-red-500/10 text-red-400',
    dot: 'bg-red-500',
  },
  {
    value: 'maintenance',
    label: 'Maintenance',
    icon: Wrench,
    tone: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
    dot: 'bg-blue-500',
  },
];

const TYPE_TONE = {
  frontend: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  backend: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  database: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  infra: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
};

function StatusPicker({ current, onChange, busy }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {STATUS_OPTIONS.map((opt) => {
        const isActive = current === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            disabled={busy}
            onClick={() => onChange(opt.value)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider transition-all',
              isActive
                ? opt.tone + ' ring-1 ring-current'
                : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:border-[var(--color-muted)] hover:text-[var(--color-foreground)]',
              busy && 'opacity-50 cursor-wait'
            )}
          >
            <span className={cn('size-1.5 rounded-full', opt.dot)} />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.listServices();
      setServices(data);
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || 'Could not load services'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (id, nextStatus) => {
    if (updatingId) return;
    setUpdatingId(id);
    // Optimistic update — revert on failure for snappy UX
    const prev = services;
    setServices((s) =>
      s.map((svc) => (svc._id === id ? { ...svc, status: nextStatus } : svc))
    );
    try {
      const updated = await api.updateServiceStatus(id, nextStatus);
      setServices((s) => s.map((svc) => (svc._id === id ? updated : svc)));
      toast.success(`Status set to ${nextStatus}`);
    } catch (err) {
      setServices(prev);
      toast.error(
        err.response?.data?.message || err.message || 'Could not update status'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      return;
    }
    setDeletingId(id);
    try {
      await api.deleteService(id);
      setServices((s) => s.filter((svc) => svc._id !== id));
      toast.success('Service deleted');
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || 'Could not delete service'
      );
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <Motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-7xl"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Services</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Define what you operate. Toggle health status to surface it on the
            public status page.
          </p>
        </div>
        <Button asChild variant="gradient" size="sm">
          <Link to="/service-setup">
            <Plus className="h-4 w-4" /> New service
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="grid place-items-center py-16 text-[var(--color-muted)]">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="mt-3 text-sm">Loading services…</span>
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] p-12 text-center">
          <Server className="mx-auto h-8 w-8 text-[var(--color-muted)]" />
          <h2 className="mt-4 text-lg font-semibold">No services yet</h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Add your first service to start tracking incidents against it.
          </p>
          <Button asChild variant="gradient" size="sm" className="mt-5">
            <Link to="/service-setup">
              <Plus className="h-4 w-4" /> Add a service
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((svc) => (
            <div
              key={svc._id}
              className="rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-semibold tracking-tight">
                    {svc.name}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span
                      className={cn(
                        'rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider',
                        TYPE_TONE[svc.type] ||
                          'border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-muted)]'
                      )}
                    >
                      {svc.type}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-muted)]">
                      {svc.environment}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {svc.liveUrl && (
                    <a
                      href={svc.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-brand-primary)]"
                      title={svc.liveUrl}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(svc._id)}
                    disabled={deletingId === svc._id}
                    title={
                      confirmDeleteId === svc._id
                        ? 'Click again to confirm'
                        : 'Delete service'
                    }
                    className={cn(
                      'rounded-md p-1.5 transition-all',
                      confirmDeleteId === svc._id
                        ? 'bg-red-500/15 text-red-400 hover:bg-red-500/25'
                        : 'text-[var(--color-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-red-400'
                    )}
                  >
                    {deletingId === svc._id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {svc.description && (
                <p className="mt-3 line-clamp-2 text-[12px] leading-relaxed text-[var(--color-muted-strong)]">
                  {svc.description}
                </p>
              )}

              {Array.isArray(svc.techStack) && svc.techStack.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {svc.techStack.slice(0, 6).map((t) => (
                    <span
                      key={t}
                      className="rounded border border-[var(--color-border)] bg-[var(--color-background)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-muted-strong)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-4 border-t border-[var(--color-border)] pt-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                    Health status
                  </span>
                  {updatingId === svc._id && (
                    <Loader2 className="h-3 w-3 animate-spin text-[var(--color-muted)]" />
                  )}
                </div>
                <StatusPicker
                  current={svc.status || 'operational'}
                  onChange={(next) => handleStatusChange(svc._id, next)}
                  busy={updatingId === svc._id}
                />
              </div>

              {svc.repoUrl && (
                <a
                  href={svc.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-[11px] text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
                >
                  <Globe className="h-3 w-3" />
                  Repo
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </Motion.div>
  );
}
