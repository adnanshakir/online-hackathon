import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as _motion, AnimatePresence } from 'motion/react';
const Motion = _motion;
import { Sparkles, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar } from '@/components/shared/Avatar';
import { SEVERITY } from '@/lib/constants';
import { USERS } from '@/data/users';
import { cn } from '@/lib/utils';
import { suggestCauses } from '@/lib/ai';
import * as api from '@/lib/api';

export function NewIncidentDialog({ open, onOpenChange }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('high');
  const [selectedService, setSelectedService] = useState(null);
  const [availableServices, setAvailableServices] = useState([]);
  const [responders, setResponders] = useState([]);
  const [suggestions, setSuggestions] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setTitle('');
    setDescription('');
    setSeverity('high');
    setSelectedService(null);
    setResponders([]);
    setSuggestions(null);
    setAiLoading(false);
  };

  const fetchServices = async () => {
    try {
      const data = await api.listServices();
      setAvailableServices(data);
    } catch (err) {
      console.error('Failed to load services:', err);
    }
  };

  useEffect(() => {
    if (open) fetchServices();
  }, [open]);

  const toggle = (arr, setArr, id) => {
    setArr(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);
  };

  const handleAI = async () => {
    if (!title.trim() && !description.trim()) {
      toast.error('Add a title or description first.');
      return;
    }
    setAiLoading(true);
    setSuggestions(null);
    try {
      const result = await suggestCauses(title, description);
      setSuggestions(result.suggestions || []);
      toast.success(
        `AI found ${result.suggestions?.length || 0} probable causes`,
        {
          description:
            result.source === 'gemini'
              ? 'Powered by Gemini'
              : 'Pattern-matched',
        }
      );
    } catch (err) {
      toast.error('Could not get AI suggestions.', {
        description: err.message,
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('Title is required.');
      return;
    }
    if (!selectedService) {
      toast.error('You must link this incident to a service.');
      return;
    }
    setSubmitting(true);
    try {
      const incident = await api.createIncident({
        title,
        description,
        severity,
        service: selectedService,
        assigneeIds: responders.length ? responders : [],
      });
      toast.success('Incident declared', { description: title });
      reset();
      onOpenChange(false);
      navigate(`/app/incidents/${incident.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Declare new incident</DialogTitle>
          <DialogDescription>
            Open an incident to alert responders and start the timeline.
          </DialogDescription>
        </DialogHeader>

        <div className="grid max-h-[68vh] gap-5 overflow-y-auto pr-1">
          {/* Title */}
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Payment processing delays in EU region"
              className="h-11 text-base"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>What's happening</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Symptoms, scope, and any signals you've noticed so far…"
              rows={3}
            />
          </div>

          {/* Severity — visual cards */}
          <div className="space-y-2">
            <Label>Severity</Label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {Object.values(SEVERITY).map((s) => {
                const Icon = s.icon;
                const active = severity === s.value;
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setSeverity(s.value)}
                    className={cn(
                      'group relative flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-all',
                      active
                        ? 'border-transparent bg-[var(--color-surface-elevated)] ring-2'
                        : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-muted)]'
                    )}
                    style={active ? { '--tw-ring-color': s.color } : {}}
                  >
                    <div className="flex w-full items-center justify-between">
                      <Icon className="h-4 w-4" style={{ color: s.color }} />
                      <AnimatePresence>
                        {active && (
                          <Motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="grid size-4 place-items-center rounded-full"
                            style={{ background: s.color }}
                          >
                            <Check className="h-2.5 w-2.5 text-white" />
                          </Motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{s.label}</div>
                      <div className="line-clamp-2 text-[11px] text-[var(--color-muted)]">
                        {s.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Affected service — REQUIRED dropdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Affected Service</Label>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-primary)]">
                Required
              </span>
            </div>
            <select
              value={selectedService || ''}
              onChange={(e) => setSelectedService(e.target.value)}
              className={cn(
                'h-11 w-full rounded-lg border bg-[var(--color-surface)] px-3 text-sm font-medium transition-all focus:outline-none focus:ring-2',
                selectedService
                  ? 'border-[var(--color-brand-primary)]/50 focus:ring-[var(--color-brand-primary)]/20'
                  : 'border-[var(--color-border)] focus:ring-[var(--color-ring)]'
              )}
            >
              <option value="" disabled>
                Select the affected service…
              </option>
              {availableServices.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.type})
                </option>
              ))}
            </select>
            {availableServices.length === 0 && (
              <p className="text-[10px] text-amber-500">
                No services found. Please create a service first in Settings.
              </p>
            )}
          </div>

          {/* Responders */}
          <div className="space-y-2">
            <Label>Responders</Label>
            <div className="flex flex-wrap gap-1.5">
              {USERS.map((u) => {
                const active = responders.includes(u.id);
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => toggle(responders, setResponders, u.id)}
                    className={cn(
                      'flex items-center gap-2 rounded-full border px-2 py-1 text-xs transition-all',
                      active
                        ? 'border-[var(--color-brand-violet)] bg-[var(--color-brand-violet)]/10 text-[var(--color-foreground)]'
                        : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:border-[var(--color-muted)]'
                    )}
                  >
                    <Avatar user={u} size="xs" />
                    <span className="pr-1">{u.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI suggestions */}
          <div
            className="rounded-xl border border-[var(--color-border)] p-4"
            style={{
              background:
                'linear-gradient(135deg, rgba(139, 92, 246, 0.10) 0%, rgba(59, 130, 246, 0.05) 100%)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="grid size-7 place-items-center rounded-lg bg-gradient-accent">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold">AI cause analysis</div>
                  <div className="text-[11px] text-[var(--color-muted)]">
                    Get probable root causes based on your description.
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAI}
                disabled={aiLoading}
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Analyzing…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" /> Get suggestions
                  </>
                )}
              </Button>
            </div>

            <AnimatePresence>
              {suggestions && (
                <Motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 space-y-2 overflow-hidden"
                >
                  {suggestions.map((s, i) => (
                    <Motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-medium">{s.title}</div>
                        <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-2 py-0.5 text-[10px] tabular-nums text-[var(--color-muted)]">
                          {Math.round((s.probability || 0) * 100)}% match
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[var(--color-muted)]">
                        {s.reasoning}
                      </p>
                      {s.checks?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {s.checks.map((c, j) => (
                            <span
                              key={j}
                              className="rounded-md bg-[var(--color-surface-elevated)] px-1.5 py-0.5 text-[10px] text-[var(--color-muted)]"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </Motion.div>
                  ))}
                </Motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="gradient"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Declare incident
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
