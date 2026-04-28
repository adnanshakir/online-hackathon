import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  Pencil,
  Download,
  Share2,
  CheckCircle2,
  Circle,
  Users,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SeverityBadge } from '@/components/shared/SeverityBadge';
import { ReadingProgress } from '@/components/incidents/ReadingProgress';
import { useIncidentsStore } from '@/store/incidentsStore';
import { getPostmortem } from '@/data/postmortems';
import { regeneratePostmortem } from '@/lib/ai';
import { formatDate } from '@/lib/format';
import { Avatar } from '@/components/shared/Avatar';
import { getUserById } from '@/data/users';

export default function Postmortem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const incident = useIncidentsStore((s) => s.incidents.find((i) => i.id === id));
  const [pm, setPm] = useState(null);
  const [regenLoading, setRegenLoading] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  useEffect(() => {
    if (!incident) return;
    if (incident.postmortem) {
      const found = getPostmortem(incident.postmortem);
      setPm(found ? { ...found, generatedAt: found.generatedAt || new Date().toISOString() } : null);
    } else {
      // For freshly resolved incidents, generate a stub on the fly
      setPm({
        incidentId: incident.id,
        generatedAt: new Date().toISOString(),
        summary: `On ${formatDate(incident.createdAt)}, an incident titled "${incident.title}" was opened and resolved within the response window. This postmortem captures impact, timeline, and follow-up actions.`,
        impact: {
          usersAffected: incident.affectedUsers || 0,
          durationMinutes: Math.round(
            (new Date(incident.resolvedAt || Date.now()) - new Date(incident.createdAt)) / 60000
          ),
          severity: incident.severity,
          services: incident.serviceIds,
        },
        timeline: incident.updates.map((u, i) => ({
          time: `T+${i}`,
          event: u.message,
        })),
        rootCause:
          'Root cause analysis is in progress. The team identified contributing factors during triage and applied a mitigation; deeper investigation is ongoing.',
        resolution: 'The mitigation reverted the impact within the response window.',
        actionItems: [
          { description: 'Document detection and response timing', owner: '—', done: false },
          { description: 'Add monitoring for the failure mode', owner: '—', done: false },
        ],
      });
    }
  }, [incident?.id, incident?.postmortem]);

  const regenerate = async () => {
    setRegenLoading(true);
    try {
      await regeneratePostmortem(incident);
      setPm((p) => (p ? { ...p, generatedAt: new Date().toISOString() } : p));
      toast.success('Postmortem regenerated');
    } finally {
      setRegenLoading(false);
    }
  };

  const exportMd = () => {
    if (!pm || !incident) return;
    const md = renderMarkdown(incident, pm);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `postmortem-${incident.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded as Markdown');
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied');
    } catch {
      toast.error('Could not copy');
    }
  };

  if (!incident || !pm) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <Loader2 className="mx-auto h-5 w-5 animate-spin text-[var(--color-muted)]" />
      </div>
    );
  }

  return (
    <>
      <ReadingProgress />
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-3xl print:max-w-none"
      >
        {/* Toolbar */}
        <div className="mb-8 flex items-center justify-between gap-2 print:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/app/incidents/${id}`)}
          >
            <ArrowLeft className="h-4 w-4" /> Back to incident
          </Button>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" onClick={regenerate} disabled={regenLoading}>
              {regenLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              Regenerate
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setEditingSection(editingSection ? null : 'all')}>
              <Pencil className="h-3.5 w-3.5" />
              {editingSection ? 'Done' : 'Edit'}
            </Button>
            <Button variant="ghost" size="sm" onClick={exportMd}>
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
            <Button variant="ghost" size="sm" onClick={share}>
              <Share2 className="h-3.5 w-3.5" />
              Share
            </Button>
          </div>
        </div>

        {/* Header */}
        <header className="border-b border-[var(--color-border)] pb-8">
          <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
            <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-0.5 font-mono">
              POSTMORTEM
            </span>
            <span>·</span>
            <span>{incident.id}</span>
            <span>·</span>
            <span>Generated {formatDate(pm.generatedAt)}</span>
          </div>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            {incident.title}
          </h1>
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <SeverityBadge severity={incident.severity} />
            <span className="text-xs text-[var(--color-muted)]">
              {formatDate(incident.createdAt)} → {incident.resolvedAt ? formatDate(incident.resolvedAt) : 'ongoing'}
            </span>
          </div>
        </header>

        {/* Impact card */}
        <section className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
              <Users className="h-3 w-3" /> Users affected
            </div>
            <div className="mt-1.5 text-2xl font-semibold tabular-nums">
              {pm.impact.usersAffected.toLocaleString()}
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
              <Clock className="h-3 w-3" /> Duration
            </div>
            <div className="mt-1.5 text-2xl font-semibold tabular-nums">
              {pm.impact.durationMinutes}m
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
              <AlertTriangle className="h-3 w-3" /> Severity
            </div>
            <div className="mt-1.5 text-2xl font-semibold capitalize">{pm.impact.severity}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
              Services
            </div>
            <div className="mt-1.5 text-2xl font-semibold tabular-nums">
              {pm.impact.services.length}
            </div>
          </Card>
        </section>

        {/* Document body */}
        <div className="mt-12 space-y-10">
          <section>
            <h2 className="text-xl font-semibold tracking-tight">Summary</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-foreground)]">
              {pm.summary.replace('[DATE]', formatDate(incident.createdAt))}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight">Timeline</h2>
            <ol className="mt-3 space-y-2">
              {pm.timeline.map((t, i) => (
                <li
                  key={i}
                  className="flex gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
                >
                  <span className="font-mono text-xs font-medium tabular-nums text-[var(--color-brand-violet)] min-w-[40px]">
                    {t.time}
                  </span>
                  <span className="text-sm">{t.event}</span>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight">Root cause</h2>
            <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-[var(--color-foreground)] [&>p]:mb-3">
              <ReactMarkdown>{pm.rootCause}</ReactMarkdown>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight">Resolution</h2>
            <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-[var(--color-foreground)]">
              <ReactMarkdown>{pm.resolution}</ReactMarkdown>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight">Action items</h2>
            <ul className="mt-3 space-y-2">
              {pm.actionItems.map((it, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
                >
                  {it.done ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-[var(--color-muted)]" />
                  )}
                  <div className="flex-1">
                    <div className={`text-sm ${it.done ? 'text-[var(--color-muted)] line-through' : ''}`}>
                      {it.description}
                    </div>
                    <div className="mt-0.5 text-[11px] text-[var(--color-muted)]">
                      Owner: {it.owner}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Footer / contributors */}
        <footer className="mt-16 flex items-center justify-between gap-4 border-t border-[var(--color-border)] pt-8 print:hidden">
          <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
            <span>Contributors:</span>
            <div className="flex -space-x-2">
              {incident.assigneeIds.map(getUserById).filter(Boolean).map((u) => (
                <Avatar key={u.id} user={u} size="xs" ring />
              ))}
            </div>
          </div>
          <Link
            to={`/app/incidents/${incident.id}`}
            className="text-xs text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
          >
            View incident →
          </Link>
        </footer>
      </motion.article>
    </>
  );
}

function renderMarkdown(incident, pm) {
  return `# Postmortem: ${incident.title}

**Severity:** ${incident.severity.toUpperCase()}
**Date:** ${formatDate(incident.createdAt)} → ${incident.resolvedAt ? formatDate(incident.resolvedAt) : 'ongoing'}
**Duration:** ${pm.impact.durationMinutes} minutes
**Users affected:** ${pm.impact.usersAffected.toLocaleString()}

## Summary

${pm.summary.replace('[DATE]', formatDate(incident.createdAt))}

## Timeline

${pm.timeline.map((t) => `- **${t.time}** — ${t.event}`).join('\n')}

## Root cause

${pm.rootCause}

## Resolution

${pm.resolution}

## Action items

${pm.actionItems.map((it) => `- [${it.done ? 'x' : ' '}] ${it.description} (Owner: ${it.owner})`).join('\n')}
`;
}
