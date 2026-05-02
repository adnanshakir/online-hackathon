export const FAQ_DATA = [
  {
    q: 'What exactly is an AI Brief?',
    a: "It's an automated executive summary of your entire incident timeline. With one click, OpsWatch analyzes every status update, message, and assignment to generate a probable root cause and recommended next steps for your post-mortem.",
  },
  {
    q: 'Can we host status pages on our own domain?',
    a: 'Yes. Every team gets a public status page that can be mapped to your own CNAME (e.g., status.yourcompany.com) with automatic SSL certificate management.',
  },
  {
    q: 'How secure is our incident data?',
    a: 'We use enterprise-grade AES-256 encryption for data at rest and TLS 1.3 for data in transit. Your AI processing happens in isolated environments, and we never use your incident data to train our base models.',
  },
  {
    q: 'Is there a limit on the number of responders?',
    a: 'Our Free tier supports small teams. Pro and Enterprise tiers offer unlimited responder seats, so you can bring in as many on-call engineers as needed during a high-pressure outage.',
  },
];

export const STATS = [
  { value: '↓ 64%', label: 'Mean time to resolve', sub: 'across pilot teams' },
  { value: '< 1.5s', label: 'AI Brief generation', sub: 'from full timeline' },
  { value: '99.99%', label: 'Public-page uptime', sub: 'edge-cached globally' },
  { value: '0', label: 'Lost context per outage', sub: 'one source of truth' },
];

export const STEPS = [
  {
    n: '01',
    title: 'Open an incident',
    text: 'Severity, service, and owner — captured in seconds.',
  },
  {
    n: '02',
    title: 'Stream the chaos',
    text: 'Every update lands in one chronological feed.',
  },
  {
    n: '03',
    title: 'Generate the brief',
    text: 'AI writes a summary, root cause, and next steps.',
  },
  {
    n: '04',
    title: 'Resolve & publish',
    text: 'Status page and postmortem update instantly.',
  },
];

export const REVEAL_SEGMENTS = [
  { text: 'Incidents are', highlight: false },
  { text: 'chaotic.', highlight: true },
  { text: "Your tools shouldn't be.", highlight: false },
  { text: 'We bring the entire response into', highlight: false },
  { text: 'one structured workflow', highlight: true },
  { text: 'so your team can', highlight: false },
  { text: 'act, not scramble.', highlight: true },
];

export const PREVIEW_TIMELINE = [
  {
    time: '14:02',
    label: 'investigating',
    dot: 'bg-red-500',
    text: 'Elevated 5xx on /api/checkout',
  },
  {
    time: '14:08',
    label: 'identified',
    dot: 'bg-orange-500',
    text: 'Stripe webhook timeout under load',
  },
  {
    time: '14:14',
    label: 'monitoring',
    dot: 'bg-blue-500',
    text: 'Mitigation deployed; error rate falling',
  },
  {
    time: '14:21',
    label: 'resolved',
    dot: 'bg-[var(--color-brand-primary)]',
    text: '19 min · 0 customer reports',
  },
];

export const TONE_LABEL = {
  investigating: 'border-red-500/30 bg-red-500/10 text-red-400',
  identified: 'border-orange-500/30 bg-orange-500/10 text-orange-400',
  monitoring: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
  resolved:
    'border-[var(--color-brand-primary)]/40 bg-[var(--color-brand-primary)]/15 text-[var(--color-brand-primary)]',
};
