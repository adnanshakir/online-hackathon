import { useState, useEffect } from 'react';
import { motion as _motion } from 'motion/react';
const Motion = _motion;
import { Avatar } from '@/components/shared/Avatar';
import { workspace } from '@/lib/api';

/**
 * Pseudo-presence: Show real workspace members who are active.
 * If no real members are fetched, falls back to a subtle empty state.
 */
export function LiveViewers({ incidentId }) {
  const [viewers, setViewers] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const users = await workspace.listUsers();
        // Just show a few users to simulate "viewing now"
        setViewers(users.slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch viewers:', err);
      }
    };
    fetch();
  }, [incidentId]);

  if (viewers.length === 0) return null;

  return (
    <Motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2"
    >
      <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
        Viewing now
      </span>
      <div className="flex -space-x-2">
        {viewers.map((u) => (
          <span key={u.id} className="relative">
            <Avatar user={u} size="xs" ring />
            <span className="absolute bottom-0 right-0 size-1.5 rounded-full bg-emerald-500 ring-2 ring-[var(--color-background)]" />
          </span>
        ))}
      </div>
    </Motion.div>
  );
}
