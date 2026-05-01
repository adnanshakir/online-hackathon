import { useRef } from 'react';
import { motion as Motion, useScroll, useTransform } from 'motion/react';

export function DualMarquee() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Transform scroll position into X translation
  const x1 = useTransform(scrollYProgress, [0, 1], ['-8%', '0%']);
  const x2 = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);

  const items = [
    'INCIDENT RESPONSE',
    'AI ROOT CAUSE',
    'REAL-TIME TIMELINES',
    'PUBLIC STATUS PAGES',
    'AUTOMATED POSTMORTEMS',
    'SMART ROUTING',
  ];

  return (
    <div
      ref={ref}
      className="relative my-10 flex h-[200px] w-full items-center justify-center overflow-hidden"
    >
      {/* Background Banner - Tilted Up, Scrolling Right */}
      <div className="absolute left-1/2 z-0 flex w-[200vw] -translate-x-1/2 -rotate-[3deg] border-y border-[var(--color-border-strong)] bg-[var(--color-surface-elevated)] py-3 shadow-[0_0_40px_rgba(0,0,0,0.5)] md:py-4">
        <motion.div style={{ x: x1 }} className="flex whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center">
              {items.map((item, j) => (
                <div key={`${i}-${j}`} className="flex items-center">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-foreground)] md:text-[14px]">
                    {item}
                  </span>
                  <div className="mx-6 h-1 w-1 rotate-45 bg-[var(--color-muted-strong)] md:mx-8 md:h-1.5 md:w-1.5" />
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Foreground Banner - Tilted Down, Scrolling Left */}
      <div className="absolute left-1/2 z-10 flex w-[200vw] -translate-x-1/2 rotate-[2deg] bg-[var(--color-brand-primary)] py-3 shadow-[0_0_40px_rgba(0,0,0,0.5)] md:py-4">
        <motion.div style={{ x: x2 }} className="flex whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center">
              {items.map((item, j) => (
                <div key={`${i}-${j}`} className="flex items-center">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-[#050505] md:text-[14px]">
                    {item}
                  </span>
                  <div className="mx-6 h-1 w-1 rotate-45 bg-[#050505]/40 md:mx-8 md:h-1.5 md:w-1.5" />
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
