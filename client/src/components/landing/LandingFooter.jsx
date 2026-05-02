import { Link } from 'react-router-dom';
import { APP_NAME } from '@/lib/constants';
import { SocialIcon } from '@/components/shared/SocialIcon';

export function LandingFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-background)]">
      {/* split statement */}
      <div className="mx-auto max-w-6xl px-6 pt-20 md:pt-32">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <h2 className="text-[clamp(2.25rem,7vw,5rem)] font-semibold leading-[1] tracking-[-0.04em]">
            Stay calm.
          </h2>
          <h2 className="font-serif text-[clamp(1.875rem,5.5vw,4rem)] italic leading-[1.05] tracking-[-0.02em] text-[var(--color-muted-strong)]">
            Even when production isn't.
          </h2>
        </div>
        <div className="mt-10 hairline md:mt-12" />
      </div>

      {/* socials + nav + copyright row */}
      <div className="mx-auto max-w-6xl px-6 py-6 md:py-7">
        <div className="flex flex-col items-start gap-5 md:flex-row md:flex-wrap md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <SocialIcon href="https://linkedin.com" label="LinkedIn">
              <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.22.79 24 1.77 24h20.45c.99 0 1.78-.78 1.78-1.73V1.72C24 .77 23.21 0 22.22 0Z" />
            </SocialIcon>
            <SocialIcon href="https://x.com" label="X">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
            </SocialIcon>
            <SocialIcon href="https://github.com" label="GitHub">
              <path d="M12 0a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.08 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.66-.31-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.31-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.61-5.49 5.91.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 0Z" />
            </SocialIcon>
          </div>

          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
            <a
              href="#features"
              className="transition-colors duration-300 hover:text-[var(--color-brand-primary)]"
            >
              Features
            </a>
            <a
              href="#ai"
              className="transition-colors duration-300 hover:text-[var(--color-brand-primary)]"
            >
              AI Brief
            </a>
            <a
              href="#how"
              className="transition-colors duration-300 hover:text-[var(--color-brand-primary)]"
            >
              How it works
            </a>
            <Link
              to="/status/opswatch-demo"
              className="transition-colors duration-300 hover:text-[var(--color-brand-primary)]"
            >
              Status
            </Link>
            <Link
              to="/login"
              className="transition-colors duration-300 hover:text-[var(--color-brand-primary)]"
            >
              Sign in
            </Link>
          </nav>

          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
            © {new Date().getFullYear()} {APP_NAME} Inc.
          </span>
        </div>
      </div>

      {/* giant wordmark */}
      <div
        aria-hidden
        className="relative mt-10 mb- select-none overflow-hidden"
      >
        <div
          className="whitespace-nowrap text-center font-black leading-[0.8] text-white/50 transition-colors duration-700 hover:text-[var(--color-brand-primary)]/40"
          style={{
            fontSize: 'clamp(4rem, 18vw, 20rem)',
            letterSpacing: '-0.05em',
            transform: 'translateY(10%)',
          }}
        >
          {APP_NAME}
        </div>
      </div>
    </footer>
  );
}
