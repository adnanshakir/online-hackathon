/**
 * Hardcoded postmortem markdown for resolved incidents.
 * Keyed by `incident.postmortem` field.
 */

export const POSTMORTEMS = {
  inc_003_pm: {
    incidentId: 'inc_003',
    generatedAt: null, // filled by store on first read
    summary:
      'On [DATE], the auth service `/token` endpoint returned 504 Gateway Timeout errors for approximately 22 minutes, causing roughly 12% of active sessions to fail re-authentication. The root cause was a Redis connection pool exhaustion triggered by an analytics tooling deploy that introduced unbounded `ZRANGEBYSCORE` queries.',
    impact: {
      usersAffected: 8120,
      durationMinutes: 22,
      severity: 'high',
      services: ['Authentication', 'API Gateway'],
    },
    timeline: [
      { time: 'T+0', event: 'Datadog alert fires on `/token` p99 > 8s.' },
      { time: 'T+9', event: 'Engineer identifies Redis pool exhaustion via connection metrics.' },
      { time: 'T+13', event: 'Analytics tooling deploy identified as the trigger; revert begins.' },
      { time: 'T+19', event: 'Revert lands, connections begin recovering.' },
      { time: 'T+22', event: 'p99 latency back to baseline. Incident resolved.' },
    ],
    rootCause: `An analytics tooling deploy at 14:31 UTC introduced a new background job that called \`ZRANGEBYSCORE key -inf +inf\` (unbounded) against a 4M-element sorted set. Each call held a Redis connection for 8-12 seconds.

Within 9 minutes, the connection pool (max 200) was fully consumed by these long-running calls, leaving the auth service unable to acquire connections for token validation. Token validation requires a Redis lookup; without a free connection, requests timed out at the gateway after 8 seconds, returning 504.`,
    resolution: `The analytics tooling deploy was reverted. Within 4 minutes of the revert landing, Redis connection pool utilization dropped from 100% back to its baseline of ~35%. Auth p99 recovered within 6 minutes.`,
    actionItems: [
      { description: 'Add Redis slow-query monitoring with P95 > 500ms alert', owner: 'Alex', done: true },
      { description: 'Enforce LIMIT clause on all Redis sorted-set scans in code review', owner: 'Priya', done: true },
      { description: 'Reduce auth-service Redis timeout from 8s to 2s', owner: 'Alex', done: false },
      { description: 'Add canary stage for analytics tooling deploys', owner: 'Maya', done: false },
    ],
  },

  inc_004_pm: {
    incidentId: 'inc_004',
    generatedAt: null,
    summary:
      'A CDN configuration change deployed on [DATE] inadvertently included a session-scoped query parameter in the cache key fingerprint, causing the cache miss rate to jump from 4% to 38% for approximately 90 minutes. Origin server load tripled but capacity held; no user-facing errors occurred.',
    impact: {
      usersAffected: 14200,
      durationMinutes: 90,
      severity: 'medium',
      services: ['CDN', 'Web App'],
    },
    timeline: [
      { time: 'T+0', event: 'CDN config change deploys.' },
      { time: 'T+12', event: 'Datadog alert fires on miss rate > 30%.' },
      { time: 'T+36', event: 'Faulty cache key change identified.' },
      { time: 'T+69', event: 'Rollback complete, miss rate begins dropping.' },
      { time: 'T+90', event: 'Miss rate back to 4.2% baseline. Resolved.' },
    ],
    rootCause: `The new cache key template included \`{query.session_id}\` as a fingerprint component. \`session_id\` is unique per browser session, which meant every visitor effectively had a private cache namespace. Cache hits collapsed to near zero for any returning visitor's first request of a session.

The change was tested in staging, but staging traffic comes from a single internal load test runner, so the per-session fragmentation was invisible.`,
    resolution: `The cache key change was reverted via the CDN console (a 30-second action). Cache miss rate began dropping immediately as the previous shared-key entries were re-served. Within 21 minutes, miss rate was fully back to baseline.`,
    actionItems: [
      { description: 'Update CDN deploy review checklist to require synthetic multi-session cache test', owner: 'Sam', done: true },
      { description: 'Add cache miss rate to the deploy diff dashboard', owner: 'Jordan', done: true },
      { description: 'Document allowed cache key components in the engineering wiki', owner: 'Sam', done: false },
    ],
  },

  inc_005_pm: {
    incidentId: 'inc_005',
    generatedAt: null,
    summary:
      'A scheduled certificate rotation on [DATE] shipped a leaf certificate without its intermediate CA, breaking the TLS chain for outbound webhook calls to Stripe. All webhook deliveries failed for 38 minutes; approximately 2,400 events queued for retry and were successfully delivered after the fix.',
    impact: {
      usersAffected: 2400,
      durationMinutes: 38,
      severity: 'critical',
      services: ['Payments', 'API Gateway'],
    },
    timeline: [
      { time: 'T+0', event: 'Certificate rotation completes; new leaf-only cert deploys.' },
      { time: 'T+0', event: 'All Stripe webhook deliveries begin failing with TLS handshake errors.' },
      { time: 'T+13', event: 'On-call engineer identifies missing intermediate cert.' },
      { time: 'T+22', event: 'Cert reissued with full chain and deployed.' },
      { time: 'T+38', event: 'Backlog drained, all retries succeeded. Resolved.' },
    ],
    rootCause: `The cert rotation script was updated three weeks ago to use a new ACME client. The new client downloads the leaf certificate and the chain as separate files, but our deploy step only copied \`cert.pem\` (leaf only) to the webhook senders, omitting \`fullchain.pem\`.

Stripe (correctly) rejects TLS connections that do not present a complete chain. Our other endpoints were unaffected because they sit behind a load balancer that supplies the chain at the edge — only direct outbound clients (webhooks) used the leaf-only cert.`,
    resolution: `The deploy script was updated to copy \`fullchain.pem\` instead of \`cert.pem\`. The certificate was redeployed with the correct chain, and the webhook retry backlog (~2,400 events) was successfully drained over the following 12 minutes.`,
    actionItems: [
      { description: 'Add automated post-rotation TLS chain verification step', owner: 'Maya', done: true },
      { description: 'Add monitoring for webhook delivery success rate per endpoint', owner: 'Alex', done: true },
      { description: 'Document TLS chain requirements in the cert rotation runbook', owner: 'Priya', done: false },
      { description: 'Move webhook senders behind the same edge LB as inbound traffic', owner: 'Maya', done: false },
    ],
  },

  inc_006_pm: {
    incidentId: 'inc_006',
    generatedAt: null,
    summary:
      'Internal Slack alert delivery ran 8-12 minutes behind real-time for approximately 42 minutes. The cause was the notification worker pool sitting at minimum replicas while traffic spiked; the Horizontal Pod Autoscaler did not scale out in time. No customer-facing impact.',
    impact: {
      usersAffected: 0,
      durationMinutes: 42,
      severity: 'low',
      services: ['API Gateway'],
    },
    timeline: [
      { time: 'T+0', event: 'Internal alerts begin queuing during traffic spike.' },
      { time: 'T+19', event: 'On-call notices delayed Slack alerts.' },
      { time: 'T+24', event: 'Worker pool manually scaled out from 2 to 8.' },
      { time: 'T+42', event: 'Queue drained. Resolved.' },
    ],
    rootCause: `The HPA on the notification worker deployment uses CPU as its sole scaling metric. The notification worker is mostly I/O-bound (HTTP calls to Slack), so it never hits the CPU threshold even when its queue is deeply backlogged.`,
    resolution: `Manually scaled the worker pool from 2 to 8 replicas. The queue drained over the following 18 minutes.`,
    actionItems: [
      { description: 'Switch HPA to use queue depth as the scaling metric', owner: 'Jordan', done: true },
      { description: 'Set min replicas to 4 for the notification worker', owner: 'Jordan', done: true },
    ],
  },

  inc_007_pm: {
    incidentId: 'inc_007',
    generatedAt: null,
    summary:
      'Elasticsearch indexer pipeline lag caused search results to show data 15-20 minutes behind actual state for approximately 3 hours. The root cause was a 5x burst in update volume after a backfill job that the indexer pool was not provisioned to handle.',
    impact: {
      usersAffected: 6800,
      durationMinutes: 188,
      severity: 'high',
      services: ['Web App', 'API Gateway', 'Database Cluster'],
    },
    timeline: [
      { time: 'T+0', event: 'Backfill job kicks off.' },
      { time: 'T+0', event: 'Indexer Kafka consumer lag begins growing.' },
      { time: 'T+71', event: 'Customer reports of stale search results begin.' },
      { time: 'T+170', event: 'On-call identifies indexer pool underscaled.' },
      { time: 'T+178', event: 'Indexer pool scaled from 4 to 12 pods.' },
      { time: 'T+188', event: 'Lag below 5s. Resolved.' },
    ],
    rootCause: `A backfill job was scheduled to re-index a category of records that had drifted out of sync over several months. The job emitted ~2.4M Postgres updates over 30 minutes — well within DB capacity, but 5x the normal indexer throughput. The Kafka consumer pool stayed at 4 pods because no autoscaling was configured on it.`,
    resolution: `The indexer pool was manually scaled from 4 to 12 pods. Consumer lag drained at approximately 80k events/min and reached baseline (<5s) in 18 minutes.`,
    actionItems: [
      { description: 'Add HPA to indexer pool keyed on Kafka consumer lag', owner: 'Alex', done: true },
      { description: 'Require capacity review for any backfill job >100k records', owner: 'Sam', done: true },
      { description: 'Add a "freshness" SLO for search and surface it on the team dashboard', owner: 'Sam', done: false },
    ],
  },

  inc_008_pm: {
    incidentId: 'inc_008',
    generatedAt: null,
    summary:
      'Welcome emails to new sign-ups bounced at 91% for approximately 50 minutes after a Sendgrid template change introduced a malformed Content-Type MIME header. Approximately 540 users did not receive their welcome email until the resend.',
    impact: {
      usersAffected: 540,
      durationMinutes: 50,
      severity: 'medium',
      services: ['API Gateway'],
    },
    timeline: [
      { time: 'T+0', event: 'Sendgrid template merge deploys.' },
      { time: 'T+8', event: 'Bounce rate alert fires (91% vs. 2% baseline).' },
      { time: 'T+32', event: 'Stray newline in Content-Type header identified.' },
      { time: 'T+42', event: 'Revert deployed, bounces drop.' },
      { time: 'T+50', event: 'Missed batch (540 users) successfully resent. Resolved.' },
    ],
    rootCause: `A template change introduced a stray newline character before \`Content-Type:\`. RFC 5322 treats this as a header-value continuation, which Sendgrid cannot parse, returning a 400 from its API. Our worker treated the 400 as a permanent failure and recorded the user as "bounced" without retry.`,
    resolution: `The template change was reverted, and the missed batch of 540 users was identified via the bounce log and resent successfully.`,
    actionItems: [
      { description: 'Add a Sendgrid validation step to the template merge pipeline', owner: 'Sam', done: true },
      { description: 'Treat 400-class Sendgrid errors as retryable for 24h before marking bounced', owner: 'Taylor', done: false },
    ],
  },
};

export function getPostmortem(id) {
  return POSTMORTEMS[id] || null;
}
