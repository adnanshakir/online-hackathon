import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { REVEAL_SEGMENTS } from '@/data/landingData';

function ScrollRevealWord({ word, scrollYProgress, start, end, highlight = false }) {
  const opacity = useTransform(scrollYProgress, [start, end], [0.12, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className={`inline-block mr-[0.25em] ${highlight ? 'text-[var(--color-brand-primary)]' : ''}`}
    >
      {word}
    </motion.span>
  );
}

export function ScrollRevealParagraph() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.25'],
  });

  const words = REVEAL_SEGMENTS.flatMap((seg) =>
    seg.text.split(' ').map((word) => ({ word, highlight: seg.highlight }))
  );

  return (
    <p
      ref={ref}
      className="text-[28px] font-semibold leading-[1.2] tracking-[-0.03em] sm:text-[36px] md:text-[44px] lg:text-[52px]"
    >
      {words.map((w, i) => {
        const start = (i / words.length) * 0.85;
        const end = ((i + 1) / words.length) * 0.85;
        return (
          <ScrollRevealWord
            key={`${w.word}-${i}`}
            word={w.word}
            scrollYProgress={scrollYProgress}
            start={start}
            end={end}
            highlight={w.highlight}
          />
        );
      })}
    </p>
  );
}
