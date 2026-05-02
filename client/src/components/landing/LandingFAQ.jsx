import { useState } from 'react';
import { FAQ_DATA } from '@/data/landingData';
import { FAQItem } from '@/components/landing/FAQItem';

export function LandingFAQ() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <section className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-brand-primary)]">
            Questions
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
            Common <span className="text-[var(--color-muted)]">doubts.</span>
          </h2>
        </div>

        <div className="rounded-3xl border border-[var(--color-border-strong)] bg-[var(--color-surface)]/30 px-8 py-4 backdrop-blur-sm">
          {FAQ_DATA.map((item, idx) => (
            <FAQItem
              key={idx}
              q={item.q}
              a={item.a}
              isOpen={openFaq === idx}
              onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
