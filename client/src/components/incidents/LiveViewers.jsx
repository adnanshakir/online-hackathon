import { motion } from 'motion/react';
import { Avatar } from '@/components/shared/Avatar';
import { USERS } from '@/data/users';

/**
 * Pseudo-presence: pick 2-3 deterministic "viewers" based on incident id.
 * Looks like real-time collaboration without any backend.
 */
export function LiveViewers({ incidentId }) {
  const seed = (incidentId || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const count = (seed % 2) + 2; // 2 or 3
  const viewers = USERS.filter((u) => u.online).slice(0, count);

  return (
    <motion.div
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
    </motion.div>
  );
}
