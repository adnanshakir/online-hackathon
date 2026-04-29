import { motion } from 'motion/react';

/**
 * Slowly-drifting glow blobs that sit behind page content.
 * Gives the dark UI a sense of life without being distracting.
 */
export function AmbientGlow({ variant = 'app' }) {
  if (variant === 'hero') {
    return (
      <>
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[600px] w-[1100px] -translate-x-1/2 rounded-full blur-[140px]"
          style={{
            background:
              'linear-gradient(135deg, oklch(86.05% 0.1808 143.81 / 0.45) 0%, oklch(69% 0.12 143.81 / 0.30) 100%)',
          }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute top-40 right-0 -z-10 h-[400px] w-[400px] rounded-full blur-[120px]"
          style={{ background: 'oklch(69% 0.12 143.81 / 0.28)' }}
          animate={{ x: [0, 40, 0], y: [0, -20, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
      </>
    );
  }

  // Default: subtle ambient drift behind the app shell
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full blur-[120px]"
        style={{ background: 'oklch(86.05% 0.1808 143.81 / 0.14)' }}
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 30, -20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed bottom-0 left-1/4 -z-10 h-[400px] w-[400px] rounded-full blur-[120px]"
        style={{ background: 'oklch(69% 0.12 143.81 / 0.12)' }}
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -30, 20, 0],
          scale: [1, 0.95, 1.1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  );
}
