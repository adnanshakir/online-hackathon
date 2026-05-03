import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { STATUS_PIPELINE } from '@/lib/constants';
import { cn } from '@/lib/utils';
import * as api from '@/lib/api';
import { toast } from 'sonner';

export function AddUpdateForm({
  incidentId,
  currentStatus,
  onTyping,
  onSuccess,
}) {
  const [message, setMessage] = useState('');
  const [statusChange, setStatusChange] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    try {
      await api.postUpdate(incidentId, { message, statusChange });
      setMessage('');
      setStatusChange(null);
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
      className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-3"
    >
      <Textarea
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          onTyping?.(e.target.value.length > 0);
        }}
        onBlur={() => onTyping?.(false)}
        placeholder="Post an update for the team…"
        className="min-h-[72px] resize-none border-0 bg-transparent p-0 focus-visible:ring-0"
      />
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
          Also change status:
        </span>
        {STATUS_PIPELINE.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusChange(statusChange === s ? null : s)}
            disabled={s === currentStatus && statusChange !== s}
            className={cn(
              'rounded-md px-1.5 py-0.5 transition-all',
              statusChange === s
                ? 'ring-2 ring-[var(--color-ring)] ring-offset-1 ring-offset-[var(--color-surface)]'
                : '',
              s === currentStatus && statusChange !== s && 'opacity-40'
            )}
          >
            <StatusBadge status={s} />
          </button>
        ))}
        <div className="ml-auto">
          <Button
            type="submit"
            variant="gradient"
            size="sm"
            disabled={submitting || !message.trim()}
          >
            {submitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            Post update
          </Button>
        </div>
      </div>
    </form>
  );
}
