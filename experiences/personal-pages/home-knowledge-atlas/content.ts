/**
 * Content pack for "The Atlas" — the live rendering of `home-knowledge-atlas`.
 *
 * A staff engineer's knowledge drawn as a nautical chart. Knowledge domains are
 * TERRITORIES (landmass sized by domain breadth, elevation-contour density set
 * by mastery); artifacts are SETTLEMENTS (docs/systems/talks marked as towns
 * with founding dates); SHIPPING LANES connect territories the person has
 * bridged; SOUNDINGS mark waters they have only sailed; and one honestly-drawn
 * UNCHARTED region admits the edges of the map — `HERE BE GAPS` (the anomaly).
 *
 * Everything here is TYPED and DETERMINISTIC. The profile is ILLUSTRATIVE AND
 * SYNTHETIC (the chart carries the mark); the institution is unnamed and the
 * magnitudes are credible but invented. Coastlines are composed from the
 * per-territory `coast` radius profile — no Math.random at render.
 */

/* ------------------------------------------------------------------ */
/* Identity — the cartographer                                         */
/* ------------------------------------------------------------------ */

export const PERSON = {
  name: 'Sofia Marchetti',
  role: 'Staff Engineer',
  team: 'Payments Platform',
  location: 'Lisbon',
  surveyingSince: 2014,
  syntheticMark: 'ILLUSTRATIVE PROFILE · SYNTHETIC',
} as const;

export const CHROME = {
  world: 'THE ATLAS · PERSONAL PAGE',
  survey: 'SURVEYED 2014–2027',
  synthetic: 'ILLUSTRATIVE PROFILE · SYNTHETIC',
  cartouche: 'SURVEYED 2014–2027 · SYNTHETIC CHART',
} as const;

export const STATEMENT: readonly string[] = [
  'A map of',
  'what I know —',
  'edges and all.',
];

export const STATEMENT_SUBLINE =
  'Knowledge is not a folder tree. It is a coastline you survey over years: some waters you have made home, some you have only sailed, and some are honestly left blank. This is my chart, drawn to scale, with the gaps marked as gaps.';

export interface IdentityFact {
  label: string;
  value: string;
}

export const IDENTITY_FACTS: readonly IdentityFact[] = [
  { label: 'FIRST SURVEY', value: '2014' },
  { label: 'TERRITORIES', value: '6 charted' },
  { label: 'SETTLEMENTS', value: '10 founded' },
  { label: 'GAPS', value: 'named, not hidden' },
];

/* ------------------------------------------------------------------ */
/* Mastery — elevation; higher mastery draws more contour rings        */
/* ------------------------------------------------------------------ */

export type Mastery = 1 | 2 | 3 | 4 | 5;

export const MASTERY_LABEL: Record<Mastery, string> = {
  1: 'Sighted',
  2: 'Surveyed',
  3: 'Charted',
  4: 'Settled',
  5: 'Home waters',
};

/* ------------------------------------------------------------------ */
/* Settlements — artifacts founded within a territory                  */
/* ------------------------------------------------------------------ */

export type SettlementKind = 'system' | 'doc' | 'talk';

export interface Settlement {
  id: string;
  /** Town name — the artifact. */
  name: string;
  kind: SettlementKind;
  founded: number;
  /** Position WITHIN the territory, as a fraction of its radius from centroid. */
  at: { dx: number; dy: number };
}

/* ------------------------------------------------------------------ */
/* Territories — the knowledge domains, west → east (focus order)      */
/* ------------------------------------------------------------------ */

export interface Territory {
  id: string;
  /** Territory name, set in letterspaced small caps on the chart. */
  name: string;
  /** The waters around it, set in italic serif. */
  waters: string;
  /** Centroid in the 1000×640 chart viewBox. */
  cx: number;
  cy: number;
  /** Base radius — landmass size = domain breadth. */
  radius: number;
  /** Mastery → interior contour-ring count. */
  mastery: Mastery;
  /** Radius multipliers around the compass — the hand-composed coastline. */
  coast: readonly number[];
  /** Gazetteer prose: what they actually know here. */
  knows: string;
  lastVisited: string;
  settlements: readonly Settlement[];
}

export const TERRITORIES: readonly Territory[] = [
  {
    id: 't-payments',
    name: 'Payments',
    waters: 'the settled coast',
    cx: 168,
    cy: 250,
    radius: 118,
    mastery: 5,
    coast: [1.0, 0.86, 1.12, 0.92, 1.18, 0.9, 1.06, 0.82, 1.14, 0.88, 1.0, 0.94],
    knows:
      'Double-entry ledgers, idempotency, settlement windows, scheme rails and reconciliation. Home waters — eight years, three rewrites, one that survived.',
    lastVisited: 'this week',
    settlements: [
      { id: 's-ledger', name: 'Ledger v2', kind: 'system', founded: 2019, at: { dx: -0.28, dy: -0.18 } },
      { id: 's-idem', name: 'Idempotency RFC', kind: 'doc', founded: 2021, at: { dx: 0.34, dy: 0.3 } },
    ],
  },
  {
    id: 't-distsys',
    name: 'Distributed Systems',
    waters: 'the deep straits',
    cx: 470,
    cy: 168,
    radius: 104,
    mastery: 5,
    coast: [1.0, 0.9, 1.16, 0.84, 1.1, 0.94, 1.2, 0.86, 1.04, 0.92, 1.12, 0.88],
    knows:
      'Consensus, sagas, exactly-once vs effectively-once, backpressure and partial failure. Charted the hard way, on call.',
    lastVisited: 'last month',
    settlements: [
      { id: 's-consensus', name: 'Consensus, in Practice', kind: 'talk', founded: 2020, at: { dx: -0.36, dy: 0.3 } },
      { id: 's-saga', name: 'Saga Pattern RFC', kind: 'doc', founded: 2021, at: { dx: 0.14, dy: 0.5 } },
    ],
  },
  {
    id: 't-mlinfra',
    name: 'ML Infrastructure',
    waters: 'the new harbours',
    cx: 388,
    cy: 452,
    radius: 112,
    mastery: 4,
    coast: [1.0, 0.94, 1.1, 0.86, 1.16, 0.9, 1.08, 0.82, 1.14, 0.92, 1.02, 0.9],
    knows:
      'Feature stores, model registries, serving latency and drift watch. Settled, and still building out the interior.',
    lastVisited: '2 weeks ago',
    settlements: [
      { id: 's-fstore', name: 'Feature Store', kind: 'system', founded: 2022, at: { dx: -0.26, dy: -0.24 } },
      { id: 's-registry', name: 'Model Registry', kind: 'system', founded: 2023, at: { dx: 0.3, dy: 0.26 } },
    ],
  },
  {
    id: 't-datamodel',
    name: 'Data Modelling',
    waters: 'the river delta',
    cx: 648,
    cy: 430,
    radius: 92,
    mastery: 3,
    coast: [1.0, 0.88, 1.08, 0.94, 1.14, 0.86, 1.0, 0.92, 1.1, 0.84, 1.06, 0.9],
    knows:
      'Event schemas, contracts, slowly-changing dimensions and versioned migrations. Charted the coast; the uplands are still rough.',
    lastVisited: 'last quarter',
    settlements: [
      { id: 's-schema', name: 'Event Schema Registry', kind: 'system', founded: 2022, at: { dx: -0.1, dy: 0.4 } },
    ],
  },
  {
    id: 't-observability',
    name: 'Observability',
    waters: 'the signal shallows',
    cx: 800,
    cy: 236,
    radius: 84,
    mastery: 3,
    coast: [1.0, 0.92, 1.1, 0.86, 1.04, 0.94, 1.12, 0.88, 1.0, 0.9, 1.08, 0.86],
    knows:
      'Traces, sampling, RED/USE, and how to page a human only when it matters. Charted, expanding after a bad quarter of alert fatigue.',
    lastVisited: 'this month',
    settlements: [
      { id: 's-trace', name: 'Trace Sampling Note', kind: 'doc', founded: 2024, at: { dx: 0.04, dy: 0.2 } },
    ],
  },
  {
    id: 't-crypto',
    name: 'Applied Cryptography',
    waters: 'the far reach',
    cx: 876,
    cy: 470,
    radius: 78,
    mastery: 2,
    coast: [1.0, 0.84, 1.06, 0.9, 1.12, 0.82, 1.0, 0.94, 1.08, 0.86, 1.02, 0.9],
    knows:
      'Token vaults, envelope encryption, key rotation and the parts of a threat model I can defend. Surveyed — I know where the reefs are, not the whole sea.',
    lastVisited: '3 months ago',
    settlements: [
      { id: 's-vault', name: 'Token Vault', kind: 'system', founded: 2025, at: { dx: -0.16, dy: 0.42 } },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Shipping lanes — territories the cartographer has bridged           */
/* ------------------------------------------------------------------ */

export interface Lane {
  id: string;
  from: string;
  to: string;
  /** What was carried across — the bridge that was actually built. */
  cargo: string;
  /** Curve bow, +/- perpendicular offset so lanes don't overlap. */
  bow: number;
}

export const LANES: readonly Lane[] = [
  { id: 'l-1', from: 't-payments', to: 't-mlinfra', cargo: 'real-time fraud scoring', bow: 44 },
  { id: 'l-2', from: 't-distsys', to: 't-mlinfra', cargo: 'model serving at scale', bow: -38 },
  { id: 'l-3', from: 't-payments', to: 't-datamodel', cargo: 'ledger event schemas', bow: -60 },
  { id: 'l-4', from: 't-distsys', to: 't-observability', cargo: 'distributed tracing', bow: 40 },
];

/* ------------------------------------------------------------------ */
/* Soundings — waters only sailed, marked with a depth (fathoms)       */
/* ------------------------------------------------------------------ */

export interface Sounding {
  id: string;
  label: string;
  /** Fathoms — smaller = shallower familiarity. */
  fathoms: number;
  x: number;
  y: number;
}

export const SOUNDINGS: readonly Sounding[] = [
  { id: 'snd-fe', label: 'Frontend / React', fathoms: 4, x: 268, y: 486 },
  { id: 'snd-stats', label: 'Applied statistics', fathoms: 6, x: 560, y: 300 },
  { id: 'snd-mobile', label: 'Mobile', fathoms: 2, x: 704, y: 150 },
];

/* ------------------------------------------------------------------ */
/* The uncharted region — the anomaly, drawn honestly                  */
/* ------------------------------------------------------------------ */

export const UNCHARTED = {
  id: 'uncharted',
  title: 'HERE BE GAPS',
  legend: 'Rust · streaming at scale',
  note: 'Left blank on purpose. I have read the maps; I have not sailed here. Marking it as gap is more honest than a coastline I would have to guess.',
  /** A large torn-edge void across the deep south — beyond the charted coast. */
  polygon: '560,632 596,606 636,624 684,600 742,626 800,602 872,626 942,606 942,660 560,660',
} as const;

/* ------------------------------------------------------------------ */
/* Cartographer's card                                                 */
/* ------------------------------------------------------------------ */

export const CARTOGRAPHER = {
  title: "Cartographer's card",
  motto: 'A chart is a promise: everything drawn here, I can defend at a whiteboard.',
  method:
    'I chart a territory only after I have shipped in it, broken it, or taught it. Waters I have only read about are marked as soundings, not land.',
} as const;

/* ------------------------------------------------------------------ */
/* Recent expeditions — last quarter's learning, dated                 */
/* ------------------------------------------------------------------ */

export interface Expedition {
  id: string;
  date: string;
  heading: string;
  found: string;
}

export const EXPEDITIONS: readonly Expedition[] = [
  {
    id: 'x-1',
    date: 'JUN 2027',
    heading: 'eBPF for network observability',
    found: 'Traced tail latency to a kernel retransmit storm no APM agent had surfaced.',
  },
  {
    id: 'x-2',
    date: 'MAY 2027',
    heading: 'Formal methods — TLA+ on the settlement window',
    found: 'A model checker found a double-credit race two reviewers and I had missed.',
  },
  {
    id: 'x-3',
    date: 'APR 2027',
    heading: 'Vector search internals',
    found: 'Read three HNSW papers; a sounding, not a coastline yet.',
  },
];

/* ------------------------------------------------------------------ */
/* Legend copy                                                         */
/* ------------------------------------------------------------------ */

export interface LegendKey {
  glyph: 'territory' | 'settlement' | 'lane' | 'sounding' | 'uncharted';
  label: string;
}

export const LEGEND: readonly LegendKey[] = [
  { glyph: 'territory', label: 'Territory — a domain, sized by breadth' },
  { glyph: 'settlement', label: 'Settlement — a shipped artifact, dated' },
  { glyph: 'lane', label: 'Shipping lane — a domain I have bridged' },
  { glyph: 'sounding', label: 'Sounding — water I have only sailed' },
  { glyph: 'uncharted', label: 'Uncharted — an honest gap' },
];

export const SETTLEMENT_KIND_LABEL: Record<SettlementKind, string> = {
  system: 'system',
  doc: 'document',
  talk: 'talk',
};
