import { motion, AnimatePresence } from 'motion/react';
import { USERS } from '@/data/users';

export function TypingIndicator({ visible }) {
  const ghostUser = USERS[2]; // Maya

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          className="flex items-center gap-2 text-xs text-[var(--color-muted)]"
        >
          <span className="font-medium">{ghostUser.name.split(' ')[0]}</span>
          <span>is typing</span>
          <span className="flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="size-1 rounded-full bg-[var(--color-muted)]"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
