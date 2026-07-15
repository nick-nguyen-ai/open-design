/**
 * The shipped fill for "The Drawing Office" — the live rendering of
 * `exp-system-architecture`.
 *
 * THE WORLD: the platform's architecture presented as a signed engineering
 * drawing. All the craft lives in `DrawingOfficeTemplate.tsx` (with the bespoke
 * `ArchitectureDrawing.tsx` it imports); this file carries only the CONTENT,
 * validated against {@link DrawingOfficeFill} at load, so the shipped sheet is
 * itself a proof that the contract admits the real design.
 *
 * Everything here is TYPED and DETERMINISTIC; synthetic demonstration data. The
 * one deliberate anomaly: the feature store's read-replica tier is the capacity
 * constraint (emphasis "constrained", NOTE 3 on the drawing, FIG 4.1 in the
 * narrative).
 *
 * Narrative cohesion: this sheet documents the same model-decision platform
 * whose fleet the Model Risk Control Room watches overnight.
 */
import { DrawingOfficeFill } from './drawing-office-fill.js';

export const drawingOfficeFill: DrawingOfficeFill = DrawingOfficeFill.parse({
  sheet: {
    pageTitle: 'The Drawing Office — Model Decision Platform, As Built',
    office: 'THE DRAWING OFFICE',
    project: 'ENTERPRISE DECISION INTELLIGENCE',
    title: 'MODEL DECISION PLATFORM — GENERAL ARRANGEMENT',
    drawingNo: 'EDI-ARCH-004',
    sheet: 'SHEET 1 OF 1',
    scale: 'SCALE N.T.S.',
    revision: 'REV A',
    classification: 'SYNTHETIC DEMO — NOT FOR CONSTRUCTION',
    drawn: 'S. NARAYANAN',
    checked: 'M. OKAFOR',
    approved: 'PLATFORM REVIEW BOARD',
    dataNotice: 'SYNTHETIC DEMONSTRATION DATA · NOT A PRODUCTION RECORD',
    revisions: [
      { rev: 'P1', date: '2026-05-02', description: 'ISSUED FOR REVIEW', by: 'SN' },
      { rev: 'P2', date: '2026-06-11', description: 'CAPACITY NOTES ADDED', by: 'SN' },
      { rev: 'A', date: '2026-07-04', description: 'ISSUED AS BUILT', by: 'MO' },
    ],
  },

  masthead: {
    kicker: 'AS-BUILT RECORD · CHECKED AND SIGNED',
    displayLines: [
      'An architecture is a promise written down.',
      'This sheet is the promise, as built.',
    ],
    lede: 'the decision fabric behind ninety million daily answers, drawn the way it actually runs.',
  },

  drawing: {
    figureHeading: 'The general-arrangement drawing',
    caption:
      'General-arrangement drawing of the model decision platform: ten parts across a channel DMZ, a restricted core zone, and an overnight oversight band. The schedule of parts below lists every part and connection.',
    constraintFlag: 'NOTE 3',
    nodes: [
      { id: 'edge-gateway', label: 'CHANNEL EDGE GATEWAY', kind: 'start', emphasis: 'standard' },
      { id: 'decision-api', label: 'DECISION API', kind: 'process', emphasis: 'standard' },
      { id: 'stream-ingest', label: 'STREAM INGEST', kind: 'data', emphasis: 'standard' },
      { id: 'feature-store', label: 'FEATURE STORE', kind: 'data', emphasis: 'constrained' },
      { id: 'model-serving', label: 'MODEL SERVING FLEET', kind: 'process', emphasis: 'standard' },
      { id: 'policy-engine', label: 'POLICY & RULES ENGINE', kind: 'decision', emphasis: 'standard' },
      { id: 'decision-log', label: 'DECISION LOG', kind: 'data', emphasis: 'standard' },
      { id: 'drift-watch', label: 'DRIFT & MONITORING', kind: 'process', emphasis: 'standard' },
      { id: 'model-registry', label: 'MODEL REGISTRY', kind: 'data', emphasis: 'standard' },
      { id: 'case-review', label: 'CASE REVIEW WORKBENCH', kind: 'end', emphasis: 'standard' },
    ],
    edges: [
      { id: 'e-edge-api', from: 'edge-gateway', to: 'decision-api', label: 'auth traffic' },
      { id: 'e-edge-ingest', from: 'edge-gateway', to: 'stream-ingest', label: 'event mirror' },
      { id: 'e-ingest-fs', from: 'stream-ingest', to: 'feature-store', label: 'features, 4 s lag' },
      { id: 'e-api-serving', from: 'decision-api', to: 'model-serving', label: 'score request' },
      { id: 'e-fs-serving', from: 'feature-store', to: 'model-serving', label: '≤ 12 ms p50 read' },
      { id: 'e-registry-serving', from: 'model-registry', to: 'model-serving', label: 'signed artefacts' },
      { id: 'e-serving-policy', from: 'model-serving', to: 'policy-engine', label: 'scores' },
      { id: 'e-policy-log', from: 'policy-engine', to: 'decision-log', label: 'decision + rationale' },
      { id: 'e-log-drift', from: 'decision-log', to: 'drift-watch', label: 'nightly windows' },
      { id: 'e-drift-case', from: 'drift-watch', to: 'case-review', label: 'breach dossiers' },
    ],
    zones: [
      { id: 'channel-dmz', label: 'CHANNEL DMZ' },
      { id: 'core-zone', label: 'CORE ZONE — RESTRICTED · NOTE 1' },
      { id: 'oversight', label: 'OVERSIGHT — OVERNIGHT CADENCE' },
    ],
    dimensions: [
      { id: 'hot-path', label: 'HOT PATH TRAVERSE ≤ 180 MS P99 · EDGE TO ANSWER' },
      { id: 'durable-record', label: 'ANSWER TO DURABLE RECORD ≤ 250 MS P99' },
    ],
  },

  notes: {
    items: [
      { no: 1, text: 'ALL CROSS-BOUNDARY CALLS mTLS. IDENTITY AT THE EDGE, ASSERTED PER HOP.' },
      { no: 2, text: 'MODEL ARTEFACTS DEPLOY FROM THE REGISTRY ONLY — SIGNED, VERSIONED, REVOCABLE.' },
      { no: 3, text: 'FEATURE-STORE READ REPLICAS AT 78% OF RATED THROUGHPUT. HEADROOM EXHAUSTS Q4 AT CURRENT GROWTH — SEE FIG 4.1.', critical: true },
      { no: 4, text: 'DECISION LOG IS APPEND-ONLY; 7-YEAR RETENTION UNDER RECORDS SCHEDULE RS-114.' },
    ],
    legend:
      'LEGEND — DOUBLE LINE: PART · DASH: ZONE BOUNDARY · HATCH: CONSTRAINED PART · A–A / B–B: SECTION CUTS · DIM LINES CARRY LATENCY BUDGETS',
  },

  narrative: {
    sections: [
      {
        no: '01',
        title: 'Context',
        annotation: 'REF EDI-ARCH-001 · PLATFORM CHARTER',
        paragraphs: [
          'Every card swipe, login, and payment instruction that reaches the bank passes through one decision fabric: the model decision platform. It answers a single question at scale — should this go through? — roughly ninety million times a day, and it must answer inside the time a terminal is willing to wait.',
          'This sheet is the as-built general arrangement. It is drawn the way the platform actually runs in production today, not the way the programme slides said it would. Where the two differ, this drawing governs.',
        ],
        hostsFigure: false,
      },
      {
        no: '02',
        title: 'The decision path',
        annotation: 'SECTION A–A · ≤ 180 MS END TO END',
        paragraphs: [
          'The hot path reads left to right across the sheet: the channel edge gateway authenticates and normalises traffic, the decision API assembles a scoring request, the model serving fleet evaluates the champion model, and the policy and rules engine has the final word — a model score is advice, policy is the decision.',
          'The whole traverse is budgeted at 180 milliseconds at the 99th percentile, measured edge to answer. Section A–A cuts this path; every component it crosses is deployed active-active across two regions.',
        ],
        hostsFigure: false,
      },
      {
        no: '03',
        title: 'Data and features',
        annotation: 'NOTE 1 · TRUST BOUNDARY AT EDGE',
        paragraphs: [
          'The stream ingest tier mirrors every edge event into the feature store, four seconds behind live. Features are computed once, versioned, and served to models from a single store — no model computes its own view of a customer. The model registry holds signed artefacts; serving loads from the registry alone, so what is running is always exactly what was approved.',
        ],
        hostsFigure: false,
      },
      {
        no: '04',
        title: 'Capacity',
        annotation: 'NOTE 3 · CONSTRAINT — SEE FIG 4.1',
        paragraphs: [
          'One component on this sheet is drawn with a hatch: the feature store read-replica tier is at 78 percent of rated throughput, the platform’s only exhausted margin. FIG 4.1 plots remaining headroom by component against the 25 percent floor the review board requires; every other tier clears it.',
          'At current transaction growth the replicas cross the floor in the fourth quarter. Revision B of this drawing is expected to add a third replica set — the hold point on the title block tracks it.',
        ],
        hostsFigure: true,
      },
      {
        no: '05',
        title: 'Failure modes',
        annotation: 'REF EDI-RUN-009 · DEGRADED-MODE RUNBOOK',
        paragraphs: [
          'The platform degrades in the order the drawing implies. If model serving is unreachable, the policy engine decides on rules alone and flags the decision for replay. If the feature store lags past ten seconds, models fall back to point-in-time defaults, and the drift and monitoring tier begins counting the exposure.',
          'Drift itself is the slowest failure and the best instrumented: nightly windows from the decision log feed the drift watch, and when a model leaves its envelope the breach dossier lands in the case review workbench before the morning stand-up. The night watch in the Model Risk Control Room sees it first.',
        ],
        hostsFigure: false,
      },
    ],
  },

  figure: {
    number: 'FIG 4.1',
    title: 'CAPACITY HEADROOM BY COMPONENT',
    chartTitle: 'FIG 4.1 — Capacity headroom by component',
    caption:
      'Remaining throughput headroom, percent of rated capacity, measured at the 2026-06 peak. Diamond marks the 25% floor required by the platform review board. Feature-store reads sit below the floor — the constraint flagged as NOTE 3.',
    source: 'SOURCE: CAPACITY REVIEW 2026-06 · SYNTHETIC DEMONSTRATION DATA',
    floorPct: 25,
    headroom: [
      { id: 'edge', category: 'Edge gateway', value: 63, target: 25 },
      { id: 'api', category: 'Decision API', value: 55, target: 25 },
      { id: 'serving', category: 'Model serving', value: 47, target: 25 },
      { id: 'ingest', category: 'Stream ingest', value: 38, target: 25 },
      { id: 'registry', category: 'Model registry', value: 71, target: 25 },
      { id: 'fs-read', category: 'Feature store (read)', value: 22, target: 25 },
    ],
  },
});

/** Standard certifier alias (Task 5): the shipped fill instance. */
export const SHIPPED_FILL = drawingOfficeFill;
