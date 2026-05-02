import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '@/store/uiStore';

/**
 * Wires up global keyboard shortcuts:
 *   g d → /app/dashboard
 *   g i → /app/incidents
 *   g t → /app/team
 *   g s → /status/opswatch-demo
 *   c   → open create-incident dialog
 *   ?   → open shortcuts help
 *   esc → close any modal
 *
 * Ignores keystrokes while typing in inputs/textareas.
 */
export function useKeyboardShortcuts({ onCreateIncident } = {}) {
  const navigate = useNavigate();
  const { setShortcutsOpen, setCommandOpen } = useUIStore();
  const seqRef = useRef({ leader: null, expires: 0 });

  useEffect(() => {
    const isTyping = (target) => {
      if (!target) return false;
      const tag = target.tagName;
      return (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        target.isContentEditable
      );
    };

    const onKey = (e) => {
      if (isTyping(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key.toLowerCase();

      // Reset stale leader
      if (Date.now() > seqRef.current.expires) seqRef.current.leader = null;

      // Awaiting second key after `g`
      if (seqRef.current.leader === 'g') {
        seqRef.current.leader = null;
        if (key === 'd') return navigate('/app/dashboard');
        if (key === 'i') return navigate('/app/incidents');
        if (key === 't') return navigate('/app/team');
        if (key === 's') return navigate('/status/opswatch-demo');
        return;
      }

      if (key === 'g') {
        seqRef.current.leader = 'g';
        seqRef.current.expires = Date.now() + 1200;
        return;
      }

      if (key === 'c') {
        e.preventDefault();
        onCreateIncident?.();
        return;
      }

      if (key === '?' || (e.shiftKey && key === '/')) {
        e.preventDefault();
        setShortcutsOpen(true);
        return;
      }

      if (key === 'escape') {
        setCommandOpen(false);
        setShortcutsOpen(false);
      }
    };

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [navigate, onCreateIncident, setShortcutsOpen, setCommandOpen]);
}
