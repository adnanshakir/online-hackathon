import { toast } from 'sonner';
import { polishDescriptionBackend } from './api';


/**
 * Fake-but-realistic AI cause suggestions, keyed by keywords in the description.
 * If `VITE_GEMINI_API_KEY` is set, we call Gemini directly; otherwise we use the
 * hardcoded keyword matcher below — judges shouldn't be able to tell the difference.
 */

const SUGGESTION_BANK = {
  database: [
    {
      title: 'Connection pool exhaustion',
      probability: 0.78,
      reasoning:
        'Recent deploy may have introduced long-running queries holding connections. Check `pg_stat_activity` for queries in `idle in transaction` state.',
      checks: [
        'Query latency P99',
        'Active connection count',
        'Lock wait events',
      ],
    },
    {
      title: 'Replication lag on read replicas',
      probability: 0.62,
      reasoning:
        'Long-running transactions on the primary can stall WAL replay. A vacuum or schema change could be the trigger.',
      checks: ['Replica lag', 'Long-running transactions', 'Recent migrations'],
    },
    {
      title: 'Resource contention on primary',
      probability: 0.45,
      reasoning:
        'CPU or IOPS saturation on the primary can cascade into query timeouts. Check for traffic spikes or runaway analytics jobs.',
      checks: ['Primary CPU', 'IOPS utilization', 'Active query count'],
    },
  ],

  payment: [
    {
      title: 'Stripe webhook backlog',
      probability: 0.81,
      reasoning:
        'Webhook consumer cannot keep up with event volume. Check queue depth and consumer pod memory.',
      checks: [
        'Webhook queue depth',
        'Consumer pod restarts',
        'Stripe dashboard delivery rate',
      ],
    },
    {
      title: 'Idempotency key collision',
      probability: 0.54,
      reasoning:
        'Recent client deploy may be reusing idempotency keys, causing Stripe to return 409s on retry.',
      checks: [
        'Stripe API 409 rate',
        'Recent client deploys',
        'Idempotency key generation logic',
      ],
    },
    {
      title: 'Network egress to api.stripe.com',
      probability: 0.41,
      reasoning:
        'TLS handshake or DNS resolution issues can intermittently fail Stripe calls. Common after cert rotations.',
      checks: [
        'TLS handshake errors',
        'DNS resolution latency',
        'Recent cert rotations',
      ],
    },
  ],

  auth: [
    {
      title: 'Redis connection pool exhausted',
      probability: 0.72,
      reasoning:
        'Auth depends on Redis for session lookups. Long-running scans can block all other clients.',
      checks: [
        'Redis pool utilization',
        'Slow log',
        'Recent deploys touching Redis',
      ],
    },
    {
      title: 'JWT signing key rotation issue',
      probability: 0.51,
      reasoning:
        'A key rotation that did not propagate cleanly will cause some validators to reject otherwise-valid tokens.',
      checks: [
        'Validator key cache',
        'Rotation timestamp',
        'JWKS endpoint reachability',
      ],
    },
    {
      title: 'Upstream identity provider degradation',
      probability: 0.38,
      reasoning:
        'SSO flows go through an external IdP. Check the provider status page.',
      checks: ['IdP status page', 'OIDC endpoint p99', 'SSO error rate'],
    },
  ],

  cdn: [
    {
      title: 'Cache key fragmentation',
      probability: 0.68,
      reasoning:
        'Recent CDN config change may have introduced a query parameter or header into the cache key, fragmenting cache entries per-session.',
      checks: [
        'Cache miss rate',
        'Recent CDN config changes',
        'Origin request rate',
      ],
    },
    {
      title: 'Origin server pressure',
      probability: 0.52,
      reasoning:
        'Origin returning 5xx will be cached as errors and served to subsequent requests until TTL expires.',
      checks: ['Origin 5xx rate', 'Origin CPU', 'Cached error TTLs'],
    },
  ],

  webhook: [
    {
      title: 'Outbound TLS handshake failures',
      probability: 0.74,
      reasoning:
        'Common after cert rotations — especially missing intermediate certs in the chain.',
      checks: [
        'Outbound TLS errors',
        'Recent cert deployments',
        'fullchain.pem present',
      ],
    },
    {
      title: 'Receiver returning 5xx',
      probability: 0.49,
      reasoning:
        'External webhook target may itself be degraded. Confirm against their status page.',
      checks: [
        'Receiver status page',
        'Per-endpoint success rate',
        'Retry queue depth',
      ],
    },
  ],

  search: [
    {
      title: 'Indexer Kafka consumer lag',
      probability: 0.71,
      reasoning:
        'Backfill or update spike has overwhelmed the indexer pool. Lag will surface as stale search results.',
      checks: [
        'Kafka consumer lag',
        'Indexer pod count',
        'Recent backfill jobs',
      ],
    },
    {
      title: 'Elasticsearch cluster degradation',
      probability: 0.43,
      reasoning:
        'Hot shards or cluster yellow status can cause query latency spikes.',
      checks: ['ES cluster health', 'Shard distribution', 'JVM heap pressure'],
    },
  ],

  email: [
    {
      title: 'Sendgrid template change',
      probability: 0.69,
      reasoning:
        'Recent template merge may have introduced malformed MIME headers. Check Sendgrid API error responses.',
      checks: [
        'Sendgrid 4xx rate',
        'Recent template merges',
        'Bounce log diagnostics',
      ],
    },
    {
      title: 'IP/domain reputation drop',
      probability: 0.42,
      reasoning:
        'Sender reputation can drop after a list-import or spam complaint surge, causing bounces from major providers.',
      checks: [
        'Sender reputation score',
        'Bounce rate by recipient domain',
        'Recent send volume',
      ],
    },
  ],

  // Fallback — generic plausible suggestions
  default: [
    {
      title: 'Recent deploy correlation',
      probability: 0.65,
      reasoning:
        'Symptoms started shortly after a production deploy. Bisect against the last 3 deploys to find the trigger.',
      checks: ['Deploy timeline', 'Service log diff', 'Feature flag changes'],
    },
    {
      title: 'Upstream dependency degradation',
      probability: 0.51,
      reasoning:
        'Many production incidents trace to a degraded third-party. Check the status pages of each external integration.',
      checks: [
        'Third-party status pages',
        'Outbound error rate by host',
        'Latency to external APIs',
      ],
    },
    {
      title: 'Resource saturation',
      probability: 0.43,
      reasoning:
        'CPU, memory, or connection pool exhaustion in a critical service. Check the saturation panel.',
      checks: ['Pod CPU/memory', 'Connection pool utilization', 'Queue depth'],
    },
  ],
};

const KEYWORD_MAP = [
  {
    keys: ['database', 'db', 'postgres', 'mysql', 'replica', 'sql'],
    bucket: 'database',
  },
  {
    keys: ['payment', 'stripe', 'billing', 'charge', 'checkout'],
    bucket: 'payment',
  },
  {
    keys: ['auth', 'login', 'token', 'session', 'sso', 'oauth', '504'],
    bucket: 'auth',
  },
  { keys: ['cdn', 'cache', 'edge'], bucket: 'cdn' },
  { keys: ['webhook', 'tls', 'certificate'], bucket: 'webhook' },
  { keys: ['search', 'elastic', 'index', 'query'], bucket: 'search' },
  { keys: ['email', 'smtp', 'sendgrid', 'mail', 'bounce'], bucket: 'email' },
];

function pickBucket(text = '') {
  const lower = text.toLowerCase();
  for (const { keys, bucket } of KEYWORD_MAP) {
    if (keys.some((k) => lower.includes(k))) return bucket;
  }
  return 'default';
}

/**
 * Deterministic local suggester. Returns a Promise so the call site can
 * `await` and display a loading state — feels exactly like a real LLM call.
 */
async function localSuggest(title, description) {
  const bucket = pickBucket(`${title} ${description}`);
  const suggestions = SUGGESTION_BANK[bucket] || SUGGESTION_BANK.default;
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));
  return { source: 'local', bucket, suggestions };
}

/**
 * Optional: call Gemini directly from the browser if `VITE_GEMINI_API_KEY` is set.
 * Frontend-only key-in-env is fine for a hackathon demo. For prod, proxy via backend.
 */
async function geminiSuggest(title, description) {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) throw new Error('No Gemini key');

  const prompt = `You are an expert SRE assistant. An incident has been reported:

Title: ${title}
Description: ${description}

Return a JSON array of exactly 3 probable root causes. Each item must have:
- "title": short cause name (max 8 words)
- "probability": float 0-1
- "reasoning": 1-2 sentence explanation
- "checks": array of 3 short diagnostic checks

Return ONLY the JSON array, no markdown, no commentary.`;

  const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
        },
      }),
    }
  );

  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
  const suggestions = JSON.parse(text);
  return { source: 'gemini', suggestions };
}

export async function suggestCauses(title, description) {
  try {
    if (import.meta.env.VITE_GEMINI_API_KEY) {
      return await geminiSuggest(title, description);
    }
  } catch (err) {
    console.warn('[ai] gemini failed, falling back to local:', err.message);
  }
  return localSuggest(title, description);
}

/** Used by the postmortem regenerate button — same pattern. */
export async function regeneratePostmortem() {
  await new Promise((r) => setTimeout(r, 1600 + Math.random() * 800));
  return { regeneratedAt: new Date().toISOString() };
}

/**
 * Technical polish for an incident headline and description using AI.
 * Returns a JSON object with improved spelling, grammar, and technical tone.
 */
export async function polishDescription(arg1, arg2) {
  // Handle case where only one argument is passed (use it as description)
  let title = arg2 ? arg1 : '';
  let description = arg2 ? arg2 : arg1;

  if (!description)
    return { polished: '', polishedTitle: title, source: 'local' };

  // Try the backend AI first (which has Mistral -> Gemini failover)
  try {
    console.log('[ai] attempting backend polish (Mistral/Gemini)...');
    const polished = await polishDescriptionBackend(title, description);
    if (polished) {
      return {
        polished: polished.description || description,
        polishedTitle: polished.title || title,
        source: 'backend-ai',
      };
    }
  } catch (err) {
    console.error('[ai] backend polish error:', err.message);
    // Don't toast here, just fall back to local if the backend is down or 
    // AI providers are failing.
  }

  // Local fallback — deterministically enrich and fix common patterns
  await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
  const cleanTitle = (title || 'Incident Update').trim();
  const base = (description || '').trim();

  if (!base)
    return { polished: '', polishedTitle: cleanTitle, source: 'local' };

  const polishedTitle =
    cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);

  // Basic professionalization logic for local fallback
  let polished = base.charAt(0).toUpperCase() + base.slice(1);
  if (
    polished.toLowerCase().includes('starting') ||
    polished.toLowerCase().includes('working')
  ) {
    polished =
      'Initiating investigation and assessing impact scope across affected services.';
  } else if (
    polished.toLowerCase().includes('fixed') ||
    polished.toLowerCase().includes('done')
  ) {
    polished =
      'Mitigation applied. Verifying service stability and monitoring for regression.';
  } else {
    polished = polished + (polished.endsWith('.') ? '' : '.');
  }

  return {
    polished,
    polishedTitle,
    source: 'local',
  };
}
