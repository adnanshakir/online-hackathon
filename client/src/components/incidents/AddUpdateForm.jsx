import { useState } from 'react';
import { Send, Loader2, Sparkles, Undo2, Tag } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { STATUS_PIPELINE } from '@/lib/constants';
import { cn } from '@/lib/utils';
import * as api from '@/lib/api';
import { polishDescription } from '@/lib/ai';
import { toast } from 'sonner';

const UPDATE_STAGES = [
  {
    id: 'investigating',
    label: 'Investigation',
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  {
    id: 'identified',
    label: 'Identification',
    color: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  },
  {
    id: 'remediation',
    label: 'Remediation',
    color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  {
    id: 'monitoring',
    label: 'Monitoring',
    color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  },
  {
    id: 'resolved',
    label: 'Resolve',
    color: 'bg-green-500/10 text-green-400 border-green-500/20',
  },
];

export function AddUpdateForm({
  incidentId,
  currentStatus,
  onTyping,
  onSuccess,
}) {
  const [message, setMessage] = useState('');
  const [stage, setStage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [polishing, setPolishing] = useState(false);
  const [history, setHistory] = useState(null);

  const handlePolish = async () => {
    if (!message.trim()) return;
    setPolishing(true);
    try {
      const result = await polishDescription(message);
      setHistory(message);
      setMessage(result.polished);
      toast.success('AI refined your update');
    } catch (err) {
      toast.error('AI Polish failed');
    } finally {
      setPolishing(false);
    }
  };

  const handleUndo = () => {
    if (history) {
      setMessage(history);
      setHistory(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    try {
      // Stage acts as statusChange
      const statusChange = stage;

      await api.postUpdate(incidentId, {
        message: message.trim(),
        statusChange,
      });
      setMessage('');
      setStage(null);
      setHistory(null);
      onSuccess?.();
      toast.success('Update posted');
    } catch (err) {
      toast.error('Failed to post update', { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-5"
    >
      <div className="relative">
        <Textarea
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            onTyping?.(e.target.value.length > 0);
          }}
          onBlur={() => onTyping?.(false)}
          placeholder="Post an update for the team…"
          className="min-h-[120px] resize-none border-0 bg-transparent p-0 text-base focus-visible:ring-0 placeholder:text-[var(--color-muted)]"
        />
        <div className="absolute bottom-0 right-0 flex items-center gap-2">
          {history && (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={handleUndo}
              title="Undo AI polish"
              className="h-8 w-8 text-[var(--color-muted)] hover:bg-[var(--color-surface-elevated)]"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handlePolish}
            disabled={polishing || !message.trim()}
            className="h-8 px-3 text-[11px] font-bold uppercase tracking-widest text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)]/5"
          >
            {polishing ? (
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-3.5 w-3.5" />
            )}
            AI Polish
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-5 pt-4 border-t border-[var(--color-border)]/50">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar flex-1">
            <span className="shrink-0 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-muted)] mr-2">
              Stage:
            </span>
            {UPDATE_STAGES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStage(stage === s.id ? null : s.id)}
                disabled={s.id === currentStatus && stage !== s.id}
                className={cn(
                  'shrink-0 rounded-xl border px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-all',
                  stage === s.id
                    ? s.color +
                        ' ring-2 ring-current border-current ring-offset-2 ring-offset-[var(--color-surface)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-muted)] hover:border-[var(--color-muted)] hover:text-[var(--color-foreground)]',
                  s.id === currentStatus &&
                    stage !== s.id &&
                    'opacity-20 cursor-not-allowed grayscale'
                )}
              >
                {s.label}
              </button>
            ))}
          </div>

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            disabled={submitting || !message.trim()}
            className="shrink-0 rounded-xl px-6 font-bold shadow-lg shadow-[var(--color-brand-primary)]/10"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Post update
          </Button>
        </div>
      </div>
    </form>
  );
}
