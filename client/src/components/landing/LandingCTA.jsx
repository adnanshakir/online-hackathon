import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';
import InteractiveGrid from '@/components/ui/InteractiveGrid';

export function LandingCTA() {
  return (
    <section
      className="relative px-6 py-32 bg-grid overflow-hidden"
      style={{ backgroundSize: '56px 56px' }}
    >
      <InteractiveGrid cellSize={56} />
      <div className="relative mx-auto max-w-4xl text-center pointer-events-none z-10">
        <h2 className="text-5xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-[88px]">
          Be ready for the{' '}
          <span className="text-[var(--color-brand-primary)]">
            next incident.
          </span>
        </h2>
        <p className="mx-auto mt-7 max-w-xl text-[15px] leading-relaxed text-[var(--color-muted-strong)] md:text-[17px]">
          Join teams shipping calmer, faster outages with {APP_NAME}.
        </p>
        <div className="mt-11 flex flex-wrap items-center justify-center gap-3 pointer-events-auto">
          <Button
            asChild
            variant="gradient"
            size="xl"
            className="rounded-full px-7"
          >
            <Link to="/signup">Get started — it's free</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="xl"
            className="rounded-full px-7"
          >
            <Link to="/status/opswatch-demo">Live status page</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
