import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion as _motion } from 'motion/react';
const Motion = _motion;
import {
  ArrowLeft,
  MoreHorizontal,
  Radio,
  Pencil,
  Loader2,
  Server,
  ExternalLink,
} from 'lucide-react';
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
import * as api from '@/lib/api';
import { fadeUp } from '@/components/motion/variants';
import { USERS } from '@/data/users';

export default function IncidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [incident, setIncident] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const [typing, setTyping] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [incidentData, updatesData] = await Promise.all([
        api.getIncident(id),
        api.getTimeline(id),
      ]);
      setIncident(incidentData);
      setUpdates(updatesData);
      setTitleDraft(incidentData.title);
    } catch (_err) {
      console.error('Failed to fetch incident data:', _err);
      toast.error('Could not load incident details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh every 30s for "live" feel
  useEffect(() => {
    if (!incident || incident.status === 'resolved') return;
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData, incident]);

  const handleStatusChange = async (next) => {
    if (next === incident.status) return;
    try {
      await api.changeStatus(incident.id, next);
      await fetchData();
      toast.success(`Status updated to ${next}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const saveTitle = async () => {
    if (titleDraft.trim() && titleDraft !== incident.title) {
      try {
        await api.updateIncident(incident.id, { title: titleDraft.trim() });
        setIncident((prev) => ({ ...prev, title: titleDraft.trim() }));
        toast.success('Title updated');
      } catch {
        toast.error('Failed to update title');
      }
    }
    setEditingTitle(false);
  };

  if (loading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <Motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        >
          <Loader2 className="h-10 w-10 text-[var(--color-brand-primary)]" />
        </Motion.div>
        <p className="text-sm font-medium text-[var(--color-muted)]">
          Fetching intelligence...
        </p>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <p className="text-sm text-[var(--color-muted)]">Incident not found.</p>
        <Button
          variant="ghost"
          className="mt-4"
          onClick={() => navigate('/app/incidents')}
        >
          <ArrowLeft className="h-4 w-4" /> Back to incidents
        </Button>
      </div>
    );
  }

  return (
    <Motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-7xl"
    >
      {/* Header Section */}
      <div className="mb-8 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon-sm" asChild>
            <Link to="/app/incidents">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-muted)]">
            <span>
              INC-
              {String(incident.id || '')
                .slice(-6)
                .toUpperCase()}
            </span>
            <span className="opacity-30">|</span>
            <span>
              Created <LiveDuration from={incident.createdAt} /> ago
            </span>
          </div>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
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
                className="w-full bg-transparent text-4xl font-bold tracking-tight focus:outline-none"
              />
            ) : (
              <div className="group flex items-center gap-3">
                <h1 className="text-4xl font-bold tracking-tight">
                  {incident.title}
                </h1>
                <button
                  onClick={() => setEditingTitle(true)}
                  className="opacity-0 group-hover:opacity-40 transition-opacity"
                >
                  <Pencil className="h-5 w-5" />
                </button>
              </div>
            )}

            <div className="mt-4 flex items-center gap-3">
              <SeverityBadge severity={incident.severity} />
              <StatusBadge status={incident.status} animated />
              <div className="h-4 w-px bg-[var(--color-border)] mx-1" />
              <LiveViewers incidentId={incident.id} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/app/incidents/${incident.id}/postmortem`}>
                Generate Postmortem
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/50 p-1 backdrop-blur-sm">
          <StatusPipeline
            current={incident.status}
            onChange={handleStatusChange}
          />
        </div>
      </div>

      {/* Main Grid: Left sidebar with info, Right main with timeline */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[340px_1fr]">
        {/* Left Column: Details & Services */}

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

        {/* Center/Right Column: Timeline */}
        <div className="min-w-0 space-y-6">
          <Card className="p-6">
            <h2 className="text-sm font-semibold">Incident Description</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-strong)] whitespace-pre-wrap">
              {incident.description ||
                'Initial report pending detailed description.'}
            </p>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">Timeline</h2>
              <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
                <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                Live Feed
              </div>
            </div>

            <div className="relative pl-8">
              <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--color-border)] via-[var(--color-border)] to-transparent" />
              <Timeline updates={updates} />
            </div>

            <div className="mt-8 pt-4 border-t border-[var(--color-border)]">
              <TypingIndicator visible={typing} />
              <AddUpdateForm
                incidentId={incident.id}
                currentStatus={incident.status}
                onTyping={setTyping}
                onSuccess={fetchData}
              />
            </div>
          </div>
        </div>
      </div>
    </Motion.div>
  );
}
