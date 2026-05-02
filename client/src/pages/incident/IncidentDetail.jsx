import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, MoreHorizontal, Radio, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SeverityBadge } from '@/components/shared/SeverityBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { LiveDuration } from '@/components/shared/LiveDuration';
import { Timeline } from '@/components/incidents/Timeline';
import { StatusPipeline } from '@/components/incidents/StatusPipeline';
import { AddUpdateForm } from '@/components/incidents/AddUpdateForm';
import { RespondersCard } from '@/components/incidents/RespondersCard';
import { AffectedServicesCard } from '@/components/incidents/AffectedServicesCard';
import { DetailsCard } from '@/components/incidents/DetailsCard';
import { ActionsCard } from '@/components/incidents/ActionsCard';
import { AIBriefCard } from '@/components/incidents/AIBriefCard';
import { LiveViewers } from '@/components/incidents/LiveViewers';
import { TypingIndicator } from '@/components/incidents/TypingIndicator';
import { useIncidentsStore } from '@/store/incidentsStore';
import * as api from '@/lib/api';
import { fadeUp } from '@/components/motion/variants';
import { USERS } from '@/data/users';

const SIM_MESSAGES = [
  'Pulling fresh traces from the gateway — back in a second.',
  'Cross-checking against the deploy timeline. One PR landed 12 min before alert.',
  'Reproduced internally. Will share findings once I have a cleaner repro.',
  'Comparing against the last clean run — diff is small but suspicious.',
  'Filed a follow-up to harden monitoring on this code path.',
];

export default function IncidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const incident = useIncidentsStore((s) => s.incidents.find((i) => i.id === id));
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  // Title inline edit
  useEffect(() => {
    if (incident) setTitleDraft(incident.title);
  }, [incident?.title]);

  // Show "X is typing" when *we* type — pseudo-collab feel
  const showTyping = typing && incident?.status !== 'resolved';

  // Demo mode: a fake teammate posts an update every 30s
  useEffect(() => {
    if (!demoMode || !incident || incident.status === 'resolved') return;
    const id1 = setInterval(async () => {
      const author = USERS[Math.floor(Math.random() * USERS.length)];
      const message = SIM_MESSAGES[Math.floor(Math.random() * SIM_MESSAGES.length)];
      await api.postUpdate(incident.id, { authorId: author.id, message });
      toast.success('New update', { description: `${author.name.split(' ')[0]}: ${message.slice(0, 48)}…` });
    }, 30_000);
    return () => clearInterval(id1);
  }, [demoMode, incident?.id, incident?.status]);

  if (!incident) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <p className="text-sm text-[var(--color-muted)]">Incident not found.</p>
        <Button variant="ghost" className="mt-4" onClick={() => navigate('/app/incidents')}>
          <ArrowLeft className="h-4 w-4" /> Back to incidents
        </Button>
      </div>
    );
  }

  const handleStatusChange = async (next) => {
    if (next === incident.status) return;
    await api.changeStatus(incident.id, next);
    toast.success(`Status → ${next}`);
  };

  const saveTitle = async () => {
    if (titleDraft.trim() && titleDraft !== incident.title) {
      await api.updateIncident(incident.id, { title: titleDraft.trim() });
      toast.success('Title updated');
    }
    setEditingTitle(false);
  };

  const reversedUpdates = useMemo(
    () => [...incident.updates].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
    [incident.updates]
  );

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-7xl"
    >
      {/* Sticky header */}
      <div className="sticky top-16 z-20 -mx-4 -mt-6 mb-6 border-b border-[var(--color-border)] bg-[var(--color-background)]/80 px-4 py-4 backdrop-blur-xl md:-mx-8 md:px-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
              <Link to="/app/incidents" className="hover:text-[var(--color-foreground)]">
                Incidents
              </Link>
              <span>/</span>
              <span className="font-mono">{incident.id}</span>
            </div>
            {/* Title — inline editable */}
            <div className="mt-1 flex items-center gap-2">
              {editingTitle ? (
                <input
                  autoFocus
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  onBlur={saveTitle}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveTitle();
                    if (e.key === 'Escape') {
                      setTitleDraft(incident.title);
                      setEditingTitle(false);
                    }
                  }}
                  className="w-full bg-transparent text-2xl font-semibold tracking-tight focus:outline-none"
                />
              ) : (
                <button
                  onClick={() => setEditingTitle(true)}
                  className="group flex items-center gap-2 text-left"
                >
                  <h1 className="text-2xl font-semibold tracking-tight">{incident.title}</h1>
                  <Pencil className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-50" />
                </button>
              )}
            </div>
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <SeverityBadge severity={incident.severity} />
              <StatusBadge status={incident.status} animated />
              <span className="text-xs text-[var(--color-muted)] tabular-nums">
                Open for <LiveDuration from={incident.createdAt} until={incident.resolvedAt} />
              </span>
              <LiveViewers incidentId={incident.id} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={demoMode ? 'gradient' : 'outline'}
              size="sm"
              onClick={() => setDemoMode((v) => !v)}
              title="Toggle live simulation"
            >
              <Radio className="h-3.5 w-3.5" />
              {demoMode ? 'Live demo on' : 'Live demo'}
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="More">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <StatusPipeline current={incident.status} onChange={handleStatusChange} />
        </div>
      </div>

      {/* Two-column body */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-5">
          <Card className="p-5">
            <h2 className="text-sm font-semibold">Description</h2>
            <p className="mt-1 text-sm text-[var(--color-muted)] whitespace-pre-wrap">
              {incident.description || 'No description provided.'}
            </p>
          </Card>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Timeline</h2>
              <span className="text-xs text-[var(--color-muted)]">
                {incident.updates.length} updates
              </span>
            </div>
            <Timeline updates={reversedUpdates} />
          </div>

          <div className="space-y-2">
            <TypingIndicator visible={showTyping} />
            <AddUpdateForm
              incidentId={incident.id}
              currentStatus={incident.status}
              onTyping={setTyping}
            />
          </div>
        </div>

        <aside className="space-y-4">
          {/* AI Brief sits at the top of the sidebar — it's the headline
              feature and the most-clicked thing on this page. */}
          <AIBriefCard incidentId={incident.id} />
          <RespondersCard
            assigneeIds={incident.assigneeIds}
            onAdd={() => toast.info('Add responder — coming soon')}
          />
          <AffectedServicesCard serviceIds={incident.serviceIds} />
          <DetailsCard incident={incident} />
          <ActionsCard incident={incident} />
        </aside>
      </div>
    </motion.div>
  );
}
