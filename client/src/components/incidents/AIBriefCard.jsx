import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Loader2,
  Target,
  AlertTriangle,
  RefreshCw,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';
import * as api from '@/lib/api';
import { cn } from '@/lib/utils';

/**
 * AI Brief panel shown on the IncidentDetail right sidebar.
 *
 * Two on-demand buttons:
 *   1. Generate Summary    — calls /api/ai/incidents/:id/summary  (plain text)
 *   2. Analyze Root Cause  — calls /api/ai/incidents/:id/root-cause (JSON array)
 *
 * Backend has Mistral → Gemini failover; if both keys are missing the
 * request 500s and we surface the message via toast.
 */

// Read confidence off whichever shape the backend returns. Different SDK
// outputs sneak through (number | "high" | "0.85"); we just want to render
// it cleanly without crashing.
function formatConfidence(c) {
  if (c == null) return null;
  if (typeof c === 'number') {
    return c <= 1 ? `${Math.round(c * 100)}%` : `${Math.round(c)}%`;
  }
  return String(c);
}

const CAUSE_TONES = [
  // Top-ranked cause draws the eye — brand color. Subsequent causes step
  // down to muted neutral so the user reads them in priority order.
  'border-[var(--color-brand-primary)]/40 bg-[var(--color-brand-primary)]/8',
  'border-orange-500/30 bg-orange-500/5',
  'border-[var(--color-border)] bg-[var(--color-surface-elevated)]',
];

export function AIBriefCard({ incidentId }) {
  const [summary, setSummary] = useState('');
  const [causes, setCauses] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingCauses, setLoadingCauses] = useState(false);

  const handleSummary = async () => {
    setLoadingSummary(true);
    try {
      const data = await api.getAISummary(incidentId);
      // Backend may return { summary: string } or just the string.
      const text =
        typeof data === 'string'
          ? data
          : data?.summary || data?.text || data?.data || '';
      if (!text) throw new Error('AI returned an empty summary.');
      setSummary(text);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          'Could not generate summary'
      );
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleCauses = async () => {
    setLoadingCauses(true);
    try {
      const data = await api.getAIRootCause(incidentId);
      // Tolerant unwrap — backend has changed shape a few times during dev.
      const list = Array.isArray(data)
        ? data
        : data?.causes || data?.rootCauses || data?.data || [];
      if (!Array.isArray(list) || list.length === 0) {
        throw new Error('AI returned no root causes.');
      }
      setCauses(list);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          'Could not analyze root cause'
      );
    } finally {
      setLoadingCauses(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--color-brand-primary)]/30 bg-gradient-to-b from-[var(--color-brand-primary)]/[0.06] to-[var(--color-surface)] p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-md bg-[var(--color-brand-primary)]/15 text-[var(--color-brand-primary)]">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-brand-primary)]">
            AI Brief
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-muted)]">
          Mistral → Gemini
        </span>
      </div>

      <p className="mt-3 text-[12px] leading-relaxed text-[var(--color-muted-strong)]">
        Reads the timeline + service tech stack to generate a stakeholder
        summary and ranked technical causes.
      </p>

      {/* Action buttons */}
      <div className="mt-4 grid grid-cols-1 gap-2">
        <button
          type="button"
          onClick={handleSummary}
          disabled={loadingSummary}
          className={cn(
            'flex items-center justify-center gap-2 rounded-md border border-[var(--color-brand-primary)]/40 bg-[var(--color-brand-primary)]/10 px-3 py-2 text-[12px] font-semibold text-[var(--color-brand-primary)] transition-colors',
            'hover:border-[var(--color-brand-primary)]/70 hover:bg-[var(--color-brand-primary)]/20',
            'disabled:opacity-60'
          )}
        >
          {loadingSummary ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : summary ? (
            <RefreshCw className="h-3.5 w-3.5" />
          ) : (
            <FileText className="h-3.5 w-3.5" />
          )}
          {summary ? 'Regenerate summary' : 'Generate summary'}
        </button>

        <button
          type="button"
          onClick={handleCauses}
          disabled={loadingCauses}
          className={cn(
            'flex items-center justify-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[12px] font-semibold text-[var(--color-foreground)] transition-colors',
            'hover:border-[var(--color-brand-primary)]/40 hover:text-[var(--color-brand-primary)]',
            'disabled:opacity-60'
          )}
        >
          {loadingCauses ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : causes.length ? (
            <RefreshCw className="h-3.5 w-3.5" />
          ) : (
            <Target className="h-3.5 w-3.5" />
          )}
          {causes.length ? 'Re-analyze root cause' : 'Analyze root cause'}
        </button>
      </div>

      {/* Summary output */}
      <AnimatePresence>
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)]/60 p-3"
          >
            <div className="mb-1.5 flex items-center gap-1.5">
              <FileText className="h-3 w-3 text-[var(--color-brand-primary)]" />
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                Summary
              </span>
            </div>
            <p className="whitespace-pre-wrap text-[12.5px] leading-relaxed text-[var(--color-foreground)]/90">
              {summary}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Root cause output */}
      <AnimatePresence>
        {causes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-3 space-y-2"
          >
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="h-3 w-3 text-orange-400" />
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                Probable causes
              </span>
            </div>
            {causes.slice(0, 3).map((c, i) => {
              const title =
                c?.title || c?.cause || c?.name || c?.summary || `Cause ${i + 1}`;
              const reasoning = c?.reasoning || c?.detail || c?.explanation || '';
              const confidence = formatConfidence(c?.confidence);
              return (
                <div
                  key={`${i}-${title}`}
                  className={cn('rounded-lg border p-3', CAUSE_TONES[i] || CAUSE_TONES[2])}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[9px] font-bold tabular-nums text-[var(--color-muted)]">
                        #{i + 1}
                      </span>
                      <span className="text-[12.5px] font-semibold text-[var(--color-foreground)]">
                        {title}
                      </span>
                    </div>
                    {confidence && (
                      <span className="shrink-0 font-mono text-[9px] tabular-nums text-[var(--color-brand-primary)]">
                        {confidence}
                      </span>
                    )}
                  </div>
                  {reasoning && (
                    <p className="mt-1 text-[11.5px] leading-relaxed text-[var(--color-muted-strong)]">
                      {reasoning}
                    </p>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
