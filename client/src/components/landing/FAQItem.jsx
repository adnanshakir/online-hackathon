import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export const FAQItem = ({ q, a, isOpen, onClick }) => {
  return (
    <div className="border-b border-[var(--color-border)] last:border-0">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between py-6 text-left transition-colors hover:text-[var(--color-brand-primary)]"
      >
        <span className="text-[17px] font-medium tracking-tight md:text-lg">{q}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <ChevronDown className={`h-5 w-5 transition-colors ${isOpen ? 'text-[var(--color-brand-primary)]' : 'text-[var(--color-muted)]'}`} />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <div className="pb-8 pr-12 text-[15px] leading-relaxed text-[var(--color-muted-strong)]">
          {a}
        </div>
      </motion.div>
    </div>
  );
};
