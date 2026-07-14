/**
 * The shipped fill for "The T-Minus" — the first {@link TMinusFill} instance.
 *
 * THE WORLD: a product-launch plan staged as a COUNTDOWN SEQUENCE. Every slide
 * carries a monumental T-minus stamp (T-30 → T-0) that counts down as the deck
 * advances, over a midnight field crossed by a single thin amber horizon line
 * that RISES slide by slide toward launch — at T-0 it reaches the top and the
 * field goes GO-green. All the craft lives in `TMinusTemplate.tsx`; this file
 * carries only the CONTENT, validated against the `TMinusFill` schema at load, so
 * the shipped deck is itself a proof that the contract admits the real design.
 *
 * Anomaly (verbatim): on the readiness board the security gate is amber against
 * otherwise green gates — `SECURITY REVIEW PENDING — BLOCKS T-7`. The one thing
 * that can still stop the clock.
 *
 * All figures are a synthetic launch (declared in `deck.notice`). No real
 * institution is named or implied; magnitudes are realistic for a mid-market
 * bank payments product.
 */
import { TMinusFill } from './tminus-fill.js';

export const tminusFill: TMinusFill = TMinusFill.parse({
  deck: {
    code: 'LAUNCH-04',
    world: 'T-MINUS',
    product: 'MERIDIAN INSTANT',
    programme: 'REAL-TIME BUSINESS PAYMENTS · GO-LIVE',
    war: 'LAUNCH CONTROL · SEQUENCE 04',
    notice: 'SYNTHETIC LAUNCH PLAN — DEMONSTRATION ONLY',
  },

  cover: {
    line1: 'A launch is a',
    line2: 'countdown, not a date.',
    standfirst:
      'Thirty days to real-time payments in production. This is the sequence — every gate, every ramp, and the one amber square still standing between us and go.',
  },

  oneSentence: {
    lead: 'What we are launching',
    sentence:
      'Meridian Instant lets a business move money in seconds, any hour, any day — with the same settlement certainty they get from a wire, at a tenth of the cost.',
    facts: [
      { stat: '< 8 sec', cap: 'end-to-end settlement, target' },
      { stat: '24 / 7 / 365', cap: 'always-on rails' },
      { stat: '£0.20', cap: 'per payment, flat' },
    ],
  },

  thesis: {
    line1: 'Speed is the',
    line2: 'whole product.',
    standfirst:
      'Businesses do not switch banks for another payments menu. They switch when a payment that used to take a day takes eight seconds and never fails silently. That is the one promise this launch has to keep on day zero — everything else on the plan exists to protect it.',
  },

  /** The editorial slide headlines — the shipped deck's voice, verbatim. */
  headlines: {
    readiness: 'Five gates. Four are green.',
    comms: 'Nobody hears it before the right people do.',
    pricing: 'One flat price does most of the selling.',
    runbook: 'Launch day, hour by hour.',
    risk: 'What stops the clock — and how fast we’re back.',
    metrics: 'Four numbers tell us it worked.',
  },

  /** The readiness board — the security gate is the single flagged blocker. */
  gates: [
    {
      id: 'legal',
      label: 'Legal & regulatory',
      status: 'success',
      description: 'Terms, disclosures and the regulator go-live notification are filed and cleared.',
    },
    {
      id: 'security',
      label: 'Security review',
      status: 'warning',
      description: 'SECURITY REVIEW PENDING — BLOCKS T-7. Penetration retest of the payments API is booked but not signed off.',
    },
    {
      id: 'docs',
      label: 'Documentation',
      status: 'success',
      description: 'Help centre, API reference and the day-0 runbook are published and reviewed.',
    },
    {
      id: 'support',
      label: 'Support readiness',
      status: 'success',
      description: 'Frontline trained on the top twenty cases; launch-week escalation rota staffed.',
    },
    {
      id: 'infra',
      label: 'Infrastructure',
      status: 'success',
      description: 'Capacity load-tested to three times expected day-0 volume with headroom to spare.',
    },
  ],

  /** The one flagged blocker — echoed under the board and in the a11y summary. */
  anomalyLabel: 'SECURITY REVIEW PENDING — BLOCKS T-7',
  anomalyNote: 'the retest is booked; sign-off is the single thing between amber and go.',

  comms: [
    { id: 'c1', channel: 'In-product', moment: 'T-0, at GA', detail: 'Eligible admins see an enablement card the moment their account flips on.' },
    { id: 'c2', channel: 'Relationship managers', moment: 'T-3 → T-0', detail: 'Top 200 accounts briefed by their RM before the public announcement.' },
    { id: 'c3', channel: 'Email', moment: 'T-0, embargo lift', detail: 'Segmented to eligible businesses only; no cold blast to the base.' },
    { id: 'c4', channel: 'Press & analyst', moment: 'T-0, 16:00', detail: 'Embargoed briefing lifts with GA; one spokesperson, one message.' },
    { id: 'c5', channel: 'Status page', moment: 'T-0 → T+7', detail: 'Live launch status and known-issues log, updated by the on-call lead.' },
  ],

  pricing: [
    { id: 'starter', name: 'Starter', price: '£0.30', unit: 'per payment', includes: 'Up to 2,000 instant payments a month, standard support.', feature: false },
    { id: 'business', name: 'Business', price: '£0.20', unit: 'per payment', includes: 'Volume pricing, bulk file upload, priority support.', feature: true },
    { id: 'scale', name: 'Scale', price: 'Custom', unit: 'committed volume', includes: 'API rate uplift, dedicated limits, named support engineer.', feature: false },
  ],

  runbook: [
    { id: 'freeze', time: '05:00', label: 'Freeze', detail: 'Code freeze confirmed; release candidate pinned.' },
    { id: 'enable', time: '06:00', label: 'Enable', detail: 'Feature flags on in production, still dark to customers.' },
    { id: 'smoke', time: '07:00', label: 'Smoke', detail: 'Synthetic payments run clean end to end across rails.' },
    { id: 'gono', time: '07:45', label: 'Go / No-go', detail: 'Launch director calls it on the readiness board.', gate: true },
    { id: 'staff', time: '08:00', label: 'Staff cohort', detail: 'Employees transact live — the first real money moves.' },
    { id: 'ramp', time: '09:00', label: 'Ramp 10%', detail: 'First customer cohort enabled; error budget watched.' },
    { id: 'widen', time: '12:00', label: 'Widen 50%', detail: 'Half of eligible accounts; comms embargo still on.' },
    { id: 'ga', time: '16:00', label: 'GA · 100%', detail: 'General availability; announcement and press embargo lift.' },
    { id: 'watch', time: '18:00', label: 'Night watch', detail: 'Heightened monitoring held through the first overnight.' },
  ],
  runbookNote:
    'One code freeze at 05:00, one go/no-go on the readiness board at 07:45, then a staged ramp — staff, 10%, 50%, 100% — before the announcement lifts at general availability. Every step is reversible with one switch until we choose to open the doors.',

  aborts: [
    { id: 'a1', metric: 'Payment success rate', threshold: 'below 99.0% for 5 min', action: 'Halt ramp, hold cohort, page platform on-call.' },
    { id: 'a2', metric: 'Settlement latency (p95)', threshold: 'above 20 sec sustained', action: 'Freeze further widening; investigate rail before proceeding.' },
    { id: 'a3', metric: 'Duplicate / misdirected payment', threshold: 'any confirmed case', action: 'Full stop. Flags off, reconcile, incident bridge opens.' },
    { id: 'a4', metric: 'Security signal', threshold: 'any credible exploit', action: 'Kill switch. Rollback to flags-off, notify regulator.' },
  ],

  rollbackNote:
    'Rollback is one switch: feature flags to off returns every account to the existing rails with no data migration. We can be fully back to today’s state inside ten minutes, any point on the timeline.',

  metrics: [
    { id: 'activated', label: 'Activated accounts · day 7', value: 4200, unit: 'count', target: 3500, status: 'on-track' },
    { id: 'success', label: 'Payment success rate · day 7', value: 0.994, unit: 'percent', target: 0.99, status: 'on-track' },
    { id: 'latency', label: 'Settlement p95 · day 7', value: 7.8, unit: 'ratio', status: 'on-track' },
    { id: 'tickets', label: 'Support tickets / 1k txns · day 30', value: 1.4, unit: 'ratio', delta: -0.28, deltaGoodDirection: 'down', status: 'on-track' },
  ],

  metricsNote:
    'Day-7 numbers are the launch-week targets committed to the steering group; the day-30 support ratio is the trailing figure we expect once the enablement wave settles.',

  closing: {
    word: 'GO',
    line: 'On the readiness board, one gate stays amber.',
    detail:
      'We launch when security signs off — not before. Clear that one gate this week and the sequence above runs itself. Everything else is green.',
    decisions: [
      'Confirm the day-0 launch director and the go/no-go time (07:45).',
      'Close the pending security retest before T-7 — the only open gate.',
      'Approve the ramp plan: staff, then 10%, 50%, 100% across launch day.',
    ],
  },
});
