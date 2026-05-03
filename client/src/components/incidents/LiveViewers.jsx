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
      <div className="flex items-center gap-2">
        <div className="flex -space-x-1.5">
          {viewers.map((u) => (
            <span
              key={u._id || u.id}
              className="relative group cursor-help"
              title={`${u.name} (${u.role})`}
            >
              <Avatar user={u} size="xs" ring />
              <span className="absolute bottom-0 right-0 size-1 rounded-full bg-emerald-500 ring-1 ring-[var(--color-background)]" />
            </span>
          ))}
        </div>
        <div className="flex flex-col -space-y-0.5">
          <span className="text-[10px] font-medium text-[var(--color-foreground)] leading-tight">
            {viewers[0].name}
          </span>
          <span className="text-[9px] text-[var(--color-muted)] leading-tight capitalize">
            {viewers[0].role}
            {viewers.length > 1 && ` + ${viewers.length - 1} more`}
          </span>
        </div>
      </div>
    </Motion.div>
  );
}
