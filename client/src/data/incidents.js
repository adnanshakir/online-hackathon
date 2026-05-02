/**
 * Seed incidents. Timestamps are computed relative to now() at first load,
 * then persisted via the store so they remain stable across refresh.
 */

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

const ago = (ms) => new Date(Date.now() - ms).toISOString();

export function seedIncidents() {
  return [
    /* ────────────── ACTIVE CRITICAL ────────────── */
    {
      id: 'inc_001',
      title: 'Payment processing delays in EU region',
      description:
        'Customers in EU are experiencing 5-10 second delays during checkout. Stripe webhook retries are queueing up, and several transactions are timing out before confirmation.',
      severity: 'critical',
      status: 'investigating',
      createdAt: ago(47 * MIN),
      resolvedAt: null,
      createdById: 'u_priya',
      assigneeIds: ['u_priya', 'u_alex'],
      serviceIds: ['s_pay', 's_api'],
      affectedUsers: 4280,
      updates: [
        {
          id: 'upd_001_1',
          authorId: 'u_priya',
          message:
            'Confirming reports of elevated latency on /v1/charges in eu-west-1. Pulling traces now.',
          statusChange: 'investigating',
          createdAt: ago(47 * MIN),
        },
        {
          id: 'upd_001_2',
          authorId: 'u_alex',
          message:
            'Stripe webhook queue depth is climbing — currently at 8.2k pending events vs. normal ~120. Looks like our consumer is struggling.',
          statusChange: null,
          createdAt: ago(32 * MIN),
        },
        {
          id: 'upd_001_3',
          authorId: 'u_priya',
          message:
            'Identified the consumer pod is OOM-killing every ~4 min. Scaling out the worker pool while we look at the memory leak.',
          statusChange: null,
          createdAt: ago(11 * MIN),
        },
      ],
      postmortem: null,
    },

    /* ────────────── ACTIVE MEDIUM ────────────── */
    {
      id: 'inc_002',
      title: 'Database read replica lag spike',
      description:
        'Two of three read replicas have replication lag exceeding 30 seconds, causing stale reads on the customer dashboard.',
      severity: 'medium',
      status: 'monitoring',
      createdAt: ago(3 * HOUR + 12 * MIN),
      resolvedAt: null,
      createdById: 'u_maya',
      assigneeIds: ['u_maya', 'u_jordan'],
      serviceIds: ['s_db', 's_web'],
      affectedUsers: 920,
      updates: [
        {
          id: 'upd_002_1',
          authorId: 'u_maya',
          message:
            'PagerDuty fired on replica-2 lag > 30s. Checking long-running transactions on the primary.',
          statusChange: 'investigating',
          createdAt: ago(3 * HOUR + 12 * MIN),
        },
        {
          id: 'upd_002_2',
          authorId: 'u_jordan',
          message:
            'Found a runaway analytics query holding locks on `events` table for ~14 min. Killing it now.',
          statusChange: null,
          createdAt: ago(2 * HOUR + 48 * MIN),
        },
        {
          id: 'upd_002_3',
          authorId: 'u_maya',
          message:
            'Query terminated. Replica lag dropping — replica-2 down to 8s, replica-3 down to 11s.',
          statusChange: 'identified',
          createdAt: ago(2 * HOUR + 21 * MIN),
        },
        {
          id: 'upd_002_4',
          authorId: 'u_jordan',
          message:
            'Replicas fully caught up. Adding a statement timeout on the analytics role to prevent recurrence.',
          statusChange: null,
          createdAt: ago(1 * HOUR + 6 * MIN),
        },
        {
          id: 'upd_002_5',
          authorId: 'u_maya',
          message:
            'Statement timeout deployed (15min cap on analytics role). Monitoring for 30 more minutes before resolving.',
          statusChange: 'monitoring',
          createdAt: ago(34 * MIN),
        },
      ],
      postmortem: null,
    },

    /* ────────────── RESOLVED ────────────── */
    {
      id: 'inc_003',
      title: 'Auth service returning 504 errors',
      description:
        'Auth /token endpoint returned 504 Gateway Timeout for ~22 minutes. Login attempts failed for roughly 12% of active sessions during the window.',
      severity: 'high',
      status: 'resolved',
      createdAt: ago(2 * DAY + 4 * HOUR),
      resolvedAt: ago(2 * DAY + 3 * HOUR + 38 * MIN),
      createdById: 'u_alex',
      assigneeIds: ['u_alex', 'u_priya'],
      serviceIds: ['s_auth', 's_api'],
      affectedUsers: 8120,
      updates: [
        {
          id: 'upd_003_1',
          authorId: 'u_alex',
          message:
            'Multiple alerts firing on auth/token p99. Investigating upstream Redis connection pool.',
          statusChange: 'investigating',
          createdAt: ago(2 * DAY + 4 * HOUR),
        },
        {
          id: 'upd_003_2',
          authorId: 'u_priya',
          message:
            'Redis connection pool exhausted — 100% of connections held by long-running ZRANGEBYSCORE calls. Likely a tooling change.',
          statusChange: 'identified',
          createdAt: ago(2 * DAY + 3 * HOUR + 51 * MIN),
        },
        {
          id: 'upd_003_3',
          authorId: 'u_alex',
          message:
            'Reverted the analytics tooling deploy that introduced the unbounded ZRANGEBYSCORE. Connections recovering.',
          statusChange: 'monitoring',
          createdAt: ago(2 * DAY + 3 * HOUR + 44 * MIN),
        },
        {
          id: 'upd_003_4',
          authorId: 'u_priya',
          message: 'Token endpoint p99 back to normal (~40ms). Marking resolved.',
          statusChange: 'resolved',
          createdAt: ago(2 * DAY + 3 * HOUR + 38 * MIN),
        },
      ],
      postmortem: 'inc_003_pm',
    },

    {
      id: 'inc_004',
      title: 'CDN cache miss rate elevated',
      description:
        'Cache miss rate jumped from 4% to 38% for ~1.5 hours after a config rollout, causing origin server load to triple.',
      severity: 'medium',
      status: 'resolved',
      createdAt: ago(5 * DAY + 7 * HOUR),
      resolvedAt: ago(5 * DAY + 5 * HOUR + 30 * MIN),
      createdById: 'u_sam',
      assigneeIds: ['u_sam', 'u_jordan'],
      serviceIds: ['s_cdn', 's_web'],
      affectedUsers: 14200,
      updates: [
        {
          id: 'upd_004_1',
          authorId: 'u_sam',
          message:
            'Datadog alert: CDN miss rate at 38% (normal: 4%). Investigating recent config changes.',
          statusChange: 'investigating',
          createdAt: ago(5 * DAY + 7 * HOUR),
        },
        {
          id: 'upd_004_2',
          authorId: 'u_jordan',
          message:
            'New cache key fingerprint includes a query param that varies per session. Effectively defeating the cache.',
          statusChange: 'identified',
          createdAt: ago(5 * DAY + 6 * HOUR + 24 * MIN),
        },
        {
          id: 'upd_004_3',
          authorId: 'u_sam',
          message:
            'Rolled back the cache key change. Miss rate dropping — currently at 12% and falling.',
          statusChange: 'monitoring',
          createdAt: ago(5 * DAY + 5 * HOUR + 51 * MIN),
        },
        {
          id: 'upd_004_4',
          authorId: 'u_sam',
          message: 'Miss rate stable at 4.2%. Resolved.',
          statusChange: 'resolved',
          createdAt: ago(5 * DAY + 5 * HOUR + 30 * MIN),
        },
      ],
      postmortem: 'inc_004_pm',
    },

    {
      id: 'inc_005',
      title: 'Webhook delivery failures for Stripe events',
      description:
        'Outbound Stripe webhooks failed with TLS handshake errors for 38 minutes after a certificate rotation. ~2,400 events queued for retry.',
      severity: 'critical',
      status: 'resolved',
      createdAt: ago(9 * DAY + 14 * HOUR),
      resolvedAt: ago(9 * DAY + 13 * HOUR + 22 * MIN),
      createdById: 'u_maya',
      assigneeIds: ['u_maya', 'u_alex', 'u_priya'],
      serviceIds: ['s_pay', 's_api'],
      affectedUsers: 2400,
      updates: [
        {
          id: 'upd_005_1',
          authorId: 'u_maya',
          message: 'Webhook delivery failures across all Stripe endpoints. TLS handshake errors in logs.',
          statusChange: 'investigating',
          createdAt: ago(9 * DAY + 14 * HOUR),
        },
        {
          id: 'upd_005_2',
          authorId: 'u_alex',
          message:
            'Cert rotation 1h ago shipped only the leaf cert, missing the intermediate. Stripe rejects the chain.',
          statusChange: 'identified',
          createdAt: ago(9 * DAY + 13 * HOUR + 47 * MIN),
        },
        {
          id: 'upd_005_3',
          authorId: 'u_priya',
          message:
            'Re-issued the cert with full chain. Deployed to all webhook senders. First successful delivery in 38 min.',
          statusChange: 'monitoring',
          createdAt: ago(9 * DAY + 13 * HOUR + 31 * MIN),
        },
        {
          id: 'upd_005_4',
          authorId: 'u_maya',
          message: 'Backlog drained, all retries succeeded. Resolved.',
          statusChange: 'resolved',
          createdAt: ago(9 * DAY + 13 * HOUR + 22 * MIN),
        },
      ],
      postmortem: 'inc_005_pm',
    },

    {
      id: 'inc_006',
      title: 'Slack notifications delayed',
      description:
        'Internal Slack alerts ran 8-12 minutes behind real-time during a queue worker scaling issue.',
      severity: 'low',
      status: 'resolved',
      createdAt: ago(14 * DAY + 5 * HOUR),
      resolvedAt: ago(14 * DAY + 4 * HOUR + 18 * MIN),
      createdById: 'u_jordan',
      assigneeIds: ['u_jordan'],
      serviceIds: ['s_api'],
      affectedUsers: 0,
      updates: [
        {
          id: 'upd_006_1',
          authorId: 'u_jordan',
          message: 'Internal Slack notifications running ~10min behind. No customer impact.',
          statusChange: 'investigating',
          createdAt: ago(14 * DAY + 5 * HOUR),
        },
        {
          id: 'upd_006_2',
          authorId: 'u_jordan',
          message: 'Notification worker pool was at min replicas. HPA hadn\'t scaled out. Bumped manually.',
          statusChange: 'identified',
          createdAt: ago(14 * DAY + 4 * HOUR + 41 * MIN),
        },
        {
          id: 'upd_006_3',
          authorId: 'u_jordan',
          message: 'Queue drained. Tightening HPA thresholds in a follow-up.',
          statusChange: 'resolved',
          createdAt: ago(14 * DAY + 4 * HOUR + 18 * MIN),
        },
      ],
      postmortem: 'inc_006_pm',
    },

    {
      id: 'inc_007',
      title: 'Search results returning stale data',
      description:
        'Elasticsearch index lag caused search results to show data 15-20 minutes behind actual state for ~3 hours.',
      severity: 'high',
      status: 'resolved',
      createdAt: ago(21 * DAY + 11 * HOUR),
      resolvedAt: ago(21 * DAY + 8 * HOUR + 12 * MIN),
      createdById: 'u_sam',
      assigneeIds: ['u_sam', 'u_alex'],
      serviceIds: ['s_web', 's_api', 's_db'],
      affectedUsers: 6800,
      updates: [
        {
          id: 'upd_007_1',
          authorId: 'u_sam',
          message: 'Customer reports of stale search results. Confirmed via internal test queries.',
          statusChange: 'investigating',
          createdAt: ago(21 * DAY + 11 * HOUR),
        },
        {
          id: 'upd_007_2',
          authorId: 'u_alex',
          message: 'CDC pipeline from Postgres to Elasticsearch is backed up — Kafka consumer lag at 2.4M events.',
          statusChange: 'identified',
          createdAt: ago(21 * DAY + 9 * HOUR + 50 * MIN),
        },
        {
          id: 'upd_007_3',
          authorId: 'u_alex',
          message: 'Scaled the indexer pool from 4 to 12 pods. Lag dropping at ~80k events/min.',
          statusChange: 'monitoring',
          createdAt: ago(21 * DAY + 8 * HOUR + 40 * MIN),
        },
        {
          id: 'upd_007_4',
          authorId: 'u_sam',
          message: 'Lag back to <5s. Resolved.',
          statusChange: 'resolved',
          createdAt: ago(21 * DAY + 8 * HOUR + 12 * MIN),
        },
      ],
      postmortem: 'inc_007_pm',
    },

    {
      id: 'inc_008',
      title: 'Email delivery degraded for new accounts',
      description:
        'Welcome emails to new sign-ups bounced for ~50 minutes after a Sendgrid template change pushed a malformed MIME header.',
      severity: 'medium',
      status: 'resolved',
      createdAt: ago(34 * DAY + 6 * HOUR),
      resolvedAt: ago(34 * DAY + 5 * HOUR + 10 * MIN),
      createdById: 'u_taylor',
      assigneeIds: ['u_taylor', 'u_sam'],
      serviceIds: ['s_api'],
      affectedUsers: 540,
      updates: [
        {
          id: 'upd_008_1',
          authorId: 'u_taylor',
          message: 'Bounce rate on welcome emails spiked to 91%. Investigating template changes.',
          statusChange: 'investigating',
          createdAt: ago(34 * DAY + 6 * HOUR),
        },
        {
          id: 'upd_008_2',
          authorId: 'u_sam',
          message: 'Last template merge added a stray newline in the Content-Type header. Reverting.',
          statusChange: 'identified',
          createdAt: ago(34 * DAY + 5 * HOUR + 32 * MIN),
        },
        {
          id: 'upd_008_3',
          authorId: 'u_taylor',
          message: 'Revert deployed, bounce rate back to baseline. Re-sending the missed welcome batch (~540 users).',
          statusChange: 'monitoring',
          createdAt: ago(34 * DAY + 5 * HOUR + 18 * MIN),
        },
        {
          id: 'upd_008_4',
          authorId: 'u_taylor',
          message: 'All resends successful. Resolved.',
          statusChange: 'resolved',
          createdAt: ago(34 * DAY + 5 * HOUR + 10 * MIN),
        },
      ],
      postmortem: 'inc_008_pm',
    },
  ];
}
