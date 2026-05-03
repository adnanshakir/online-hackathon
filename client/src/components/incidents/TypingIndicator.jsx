import { motion as _motion, AnimatePresence } from 'motion/react';
const Motion = _motion;
import { USERS } from '@/data/users';

export function TypingIndicator({ visible, user }) {
  const displayName = user?.name?.split(' ')[0] || 'Someone';

  return (
    <AnimatePresence>
      {visible && (
        <Motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          className="flex items-center gap-2 text-xs text-[var(--color-muted)] mb-2"
        >
          <span className="font-bold text-[var(--color-brand-primary)]">
            {displayName}
          </span>
          <span>is typing</span>
          <span className="flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <Motion.span
                key={i}
                className="size-1 rounded-full bg-[var(--color-brand-primary)]/50"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </span>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
