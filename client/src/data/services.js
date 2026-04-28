export const SERVICES = [
  {
    id: 's_api',
    name: 'API Gateway',
    description: 'Public REST + GraphQL gateway',
    status: 'operational',
    responseTime: 142,
    uptime90d: 99.98,
  },
  {
    id: 's_web',
    name: 'Web App',
    description: 'Customer-facing dashboard',
    status: 'operational',
    responseTime: 218,
    uptime90d: 99.95,
  },
  {
    id: 's_auth',
    name: 'Authentication',
    description: 'Login, SSO, sessions',
    status: 'operational',
    responseTime: 87,
    uptime90d: 99.99,
  },
  {
    id: 's_pay',
    name: 'Payments',
    description: 'Stripe-backed billing flows',
    status: 'investigating',
    responseTime: 412,
    uptime90d: 99.91,
  },
  {
    id: 's_db',
    name: 'Database Cluster',
    description: 'Primary + 3 read replicas',
    status: 'monitoring',
    responseTime: 24,
    uptime90d: 99.97,
  },
  {
    id: 's_cdn',
    name: 'CDN',
    description: 'Global asset edge network',
    status: 'operational',
    responseTime: 31,
    uptime90d: 99.99,
  },
];

export function getServiceById(id) {
  return SERVICES.find((s) => s.id === id);
}

/**
 * Generate a 90-day uptime sparkline series. Mostly 100%, with a few small dips.
 */
export function generateUptimeSeries(seed = 0, days = 90) {
  const out = [];
  const now = Date.now();
  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(now - i * 86400000);
    // Deterministic pseudo-noise based on day + seed
    const noise = Math.abs(Math.sin((day.getTime() / 86400000) * (seed + 1))) * 0.5;
    const dip = noise > 0.45 ? noise * 0.3 : 0;
    out.push({
      date: day.toISOString().slice(0, 10),
      uptime: Number((100 - dip).toFixed(3)),
    });
  }
  return out;
}
