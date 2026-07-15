/**
 * SAMPLE (experience-composer skill run): a real-time TRUST & SAFETY
 * content-moderation decisioning stack, staged as "The Drawing Office"
 * signed-engineering-drawing world-template. CONTENT ONLY, conforming to
 * {@link DrawingOfficeFill}; the shipped `DrawingOfficeTemplate` carries the
 * whole craft. Five-surface quality test — the TECHNICAL-EXPLAINER sample.
 *
 * THE STORY maps 1:1 onto the template's pinned fixed-slot topology (verified in
 * `docs/superpowers/specs/moderation-explainer-sample/source-context.md`): the
 * publicly documented moderation pipeline — reports + content stream in, a
 * classifier serving fleet with a model registry, a policy engine that decides,
 * an enforcement log, a quality/drift watch, and a human review queue. The
 * pinned constraint is the HUMAN REVIEW QUEUE (case-review): review capacity is
 * the classic bottleneck in this pattern — automation scales with hardware, human
 * judgement does not.
 *
 * Pattern references (public): DesignGurus "Design a Real-Time AI Content
 * Moderation System at Scale"; "QUEST: Queue Simulation for Content Moderation at
 * Scale" (arXiv 2103.16816) — the review queue as the constrained resource.
 *
 * Every capacity/latency figure here is SYNTHETIC ILLUSTRATIVE — the pattern is
 * real, the numbers are not measurements. Covered by `sheet.dataNotice` and the
 * figure source-note.
 */
import { DrawingOfficeFill } from '../exp-system-architecture/drawing-office-fill.js';

export const moderationStackFill: DrawingOfficeFill = DrawingOfficeFill.parse({
  sheet: {
    pageTitle: 'The Drawing Office — Content Moderation Decisioning, As Built',
    office: 'THE DRAWING OFFICE',
    project: 'TRUST & SAFETY PLATFORM',
    title: 'CONTENT MODERATION DECISIONING — GENERAL ARRANGEMENT',
    drawingNo: 'TS-ARCH-007',
    sheet: 'SHEET 1 OF 1',
    scale: 'SCALE N.T.S.',
    revision: 'REV A',
    classification: 'SYNTHETIC DEMO — NOT FOR CONSTRUCTION',
    drawn: 'R. OKONKWO',
    checked: 'J. MERCADO',
    approved: 'TRUST & SAFETY REVIEW BOARD',
    dataNotice: 'SYNTHETIC ILLUSTRATIVE DATA · FIGURES ARE NOT MEASUREMENTS',
    revisions: [
      { rev: 'P1', date: '2026-05-15', description: 'ISSUED FOR REVIEW', by: 'RO' },
      { rev: 'P2', date: '2026-06-20', description: 'REVIEW-QUEUE CONSTRAINT ADDED', by: 'RO' },
      { rev: 'A', date: '2026-07-08', description: 'ISSUED AS BUILT', by: 'JM' },
    ],
  },

  masthead: {
    kicker: 'AS-BUILT RECORD · CHECKED AND SIGNED',
    displayLines: [
      'Moderation is a promise about what stays up.',
      'This sheet is that promise, as built.',
    ],
    lede: 'the decisioning fabric behind millions of daily moderation calls, drawn the way it actually runs.',
  },

  drawing: {
    figureHeading: 'The general-arrangement drawing',
    caption:
      'General-arrangement drawing of the content moderation decisioning stack: ten parts across a public intake edge, a restricted decisioning core, and an oversight band for human review. The schedule of parts below lists every part and connection.',
    constraintFlag: 'NOTE 3',
    nodes: [
      { id: 'edge-gateway', label: 'CONTENT INTAKE GATEWAY', kind: 'start', emphasis: 'standard' },
      { id: 'decision-api', label: 'MODERATION DECISION API', kind: 'process', emphasis: 'standard' },
      { id: 'stream-ingest', label: 'CONTENT EVENT FIREHOSE', kind: 'data', emphasis: 'standard' },
      { id: 'feature-store', label: 'SIGNAL STORE', kind: 'data', emphasis: 'standard' },
      { id: 'model-serving', label: 'CLASSIFIER SERVING FLEET', kind: 'process', emphasis: 'standard' },
      { id: 'policy-engine', label: 'POLICY & RULES ENGINE', kind: 'decision', emphasis: 'standard' },
      { id: 'decision-log', label: 'ENFORCEMENT LOG', kind: 'data', emphasis: 'standard' },
      { id: 'drift-watch', label: 'QUALITY & DRIFT WATCH', kind: 'process', emphasis: 'standard' },
      { id: 'model-registry', label: 'CLASSIFIER REGISTRY', kind: 'data', emphasis: 'standard' },
      { id: 'case-review', label: 'HUMAN REVIEW QUEUE', kind: 'end', emphasis: 'constrained' },
    ],
    edges: [
      { id: 'e-edge-api', from: 'edge-gateway', to: 'decision-api', label: 'intake traffic' },
      { id: 'e-edge-ingest', from: 'edge-gateway', to: 'stream-ingest', label: 'event mirror' },
      { id: 'e-ingest-fs', from: 'stream-ingest', to: 'feature-store', label: 'signals, 5 s lag' },
      { id: 'e-api-serving', from: 'decision-api', to: 'model-serving', label: 'classify request' },
      { id: 'e-fs-serving', from: 'feature-store', to: 'model-serving', label: '≤ 15 ms p50 read' },
      { id: 'e-registry-serving', from: 'model-registry', to: 'model-serving', label: 'signed classifiers' },
      { id: 'e-serving-policy', from: 'model-serving', to: 'policy-engine', label: 'scores' },
      { id: 'e-policy-log', from: 'policy-engine', to: 'decision-log', label: 'action + rationale' },
      { id: 'e-log-drift', from: 'decision-log', to: 'drift-watch', label: 'sampled windows' },
      { id: 'e-drift-case', from: 'drift-watch', to: 'case-review', label: 'escalations to review' },
    ],
    zones: [
      { id: 'channel-dmz', label: 'INTAKE EDGE — PUBLIC INGEST' },
      { id: 'core-zone', label: 'CORE ZONE — RESTRICTED · NOTE 1' },
      { id: 'oversight', label: 'OVERSIGHT — REVIEW DESK CADENCE' },
    ],
    dimensions: [
      { id: 'hot-path', label: 'HOT PATH TRAVERSE ≤ 220 MS P99 · INTAKE TO ACTION' },
      { id: 'durable-record', label: 'ACTION TO ENFORCEMENT LOG ≤ 300 MS P99' },
    ],
  },

  notes: {
    items: [
      { no: 1, text: 'ALL CROSS-BOUNDARY CALLS mTLS. IDENTITY ASSERTED PER HOP; REPORTER PII TOKENISED AT THE INTAKE EDGE.' },
      { no: 2, text: 'CLASSIFIER ARTEFACTS DEPLOY FROM THE REGISTRY ONLY — SIGNED, VERSIONED, REVOCABLE.' },
      { no: 3, text: 'HUMAN REVIEW QUEUE AT 86% OF RATED REVIEW THROUGHPUT. BACKLOG GROWS PAST SLA IN Q3 AT CURRENT REPORT VOLUME — SEE FIG 4.1.', critical: true },
      { no: 4, text: 'ENFORCEMENT LOG IS APPEND-ONLY; 5-YEAR RETENTION UNDER RECORDS SCHEDULE RS-204 FOR APPEAL AND AUDIT.' },
    ],
    legend:
      'LEGEND — DOUBLE LINE: PART · DASH: ZONE BOUNDARY · HATCH: CONSTRAINED PART · A–A / B–B: SECTION CUTS · DIM LINES CARRY LATENCY BUDGETS',
  },

  narrative: {
    sections: [
      {
        no: '01',
        title: 'Context',
        annotation: 'REF TS-ARCH-001 · PLATFORM CHARTER',
        paragraphs: [
          'Every post, comment, image, and user report that reaches the platform passes through one decision fabric: the content moderation decisioning stack. It answers a single question at scale — does this stay up? — across millions of items a day, and it must answer fast enough that harmful content is caught before it spreads.',
          'This sheet is the as-built general arrangement. It is drawn the way the stack actually runs in production today, not the way the design review said it would. Where the two differ, this drawing governs.',
        ],
        hostsFigure: false,
      },
      {
        no: '02',
        title: 'The decision path',
        annotation: 'SECTION A–A · ≤ 220 MS END TO END',
        paragraphs: [
          'The hot path reads left to right across the sheet: the content intake gateway authenticates channels and normalises submissions and reports, the moderation decision API assembles a classify request, the classifier serving fleet evaluates the champion models, and the policy and rules engine has the final word — a model score is advice, policy is the enforcement decision.',
          'The whole traverse is budgeted at 220 milliseconds at the 99th percentile, measured intake to action. Section A–A cuts this path; every component it crosses is deployed active-active across two regions.',
        ],
        hostsFigure: false,
      },
      {
        no: '03',
        title: 'Signals and models',
        annotation: 'NOTE 1 · TRUST BOUNDARY AT EDGE',
        paragraphs: [
          'The content event firehose mirrors every intake event into the signal store, a few seconds behind live. Signals — text features, media hashes, account history, reporter reputation — are computed once, versioned, and served from a single store, so no classifier computes its own view of an item. The classifier registry holds signed artefacts; serving loads from the registry alone.',
        ],
        hostsFigure: false,
      },
      {
        no: '04',
        title: 'Review capacity',
        annotation: 'NOTE 3 · CONSTRAINT — SEE FIG 4.1',
        paragraphs: [
          'One part on this sheet is drawn with a hatch: the human review queue is at 86 percent of rated throughput, the stack’s only exhausted margin. Classifiers clear the confident cases; the borderline, the appealed, and the sampled land here for human judgement. FIG 4.1 plots headroom by stage against the 25 percent review-board floor; every automated stage clears it — the review queue does not.',
          'At current report volume the queue crosses the floor in the third quarter, and backlog turns into delayed enforcement — harmful content stays up longer. Revision B is expected to add reviewer capacity and raise the auto-decision confidence threshold; the hold point on the title block tracks it.',
        ],
        hostsFigure: true,
      },
      {
        no: '05',
        title: 'Failure modes',
        annotation: 'REF TS-RUN-009 · DEGRADED-MODE RUNBOOK',
        paragraphs: [
          'The stack degrades in the order the drawing implies. If classifier serving is unreachable, the policy engine decides on rules alone and flags the item for replay. If the signal store lags past its window, models fall back to conservative defaults — when in doubt, hold for review — and the quality and drift watch begins counting the exposure.',
          'Drift is the slowest failure and the best instrumented: sampled windows from the enforcement log feed the quality watch, and when a classifier leaves its envelope or a policy shifts, the affected items route to the human review queue as escalations. That queue is where the stack’s judgement ultimately lands — and, per NOTE 3, where it is thinnest.',
        ],
        hostsFigure: false,
      },
    ],
  },

  figure: {
    number: 'FIG 4.1',
    title: 'REVIEW & DECISION HEADROOM BY STAGE',
    chartTitle: 'FIG 4.1 — Review & decision headroom by stage',
    caption:
      'Remaining throughput headroom, percent of rated capacity, at the illustrative peak. Diamond marks the 25% floor required by the review board. The human review queue sits below the floor — the constraint flagged as NOTE 3. Synthetic figures; not measurements.',
    source: 'SOURCE: CAPACITY REVIEW · SYNTHETIC ILLUSTRATIVE DATA — NOT MEASUREMENTS',
    floorPct: 25,
    headroom: [
      { id: 'intake', category: 'Intake gateway', value: 58, target: 25 },
      { id: 'api', category: 'Decision API', value: 49, target: 25 },
      { id: 'serving', category: 'Classifier serving', value: 41, target: 25 },
      { id: 'signals', category: 'Signal store', value: 33, target: 25 },
      { id: 'policy', category: 'Policy engine', value: 61, target: 25 },
      { id: 'review', category: 'Human review queue', value: 14, target: 25 },
    ],
  },
});

/** Standard certifier alias: the sample fill instance. */
export const SAMPLE_FILL = moderationStackFill;
