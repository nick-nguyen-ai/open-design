/**
 * Content pack for "The Specimen Book" — the live rendering of
 * `home-research-publication-portfolio`.
 *
 * A researcher's publications set as a TYPE FOUNDRY'S SPECIMEN BOOK: archival,
 * not rhetorical. Each paper is a SPECIMEN whose title is set in a DIFFERENT
 * optical treatment of the variable display face (weight / optical-size / soft /
 * wonk / italic axes), with foundry-style metadata beneath in mono, the abstract
 * as small print, and a one-line "what survived" note — what the field actually
 * kept. One specimen carries `RETRACTED — SEE ERRATUM`, set with the same care
 * as the triumphs (the anomaly: the record includes its own correction).
 *
 * The only colourless world in the catalogue: ink black, near-white, grades of
 * grey — no accent colour at all. Everything is TYPED and DETERMINISTIC; the
 * profile is ILLUSTRATIVE AND SYNTHETIC. No Math.random at render.
 */

/* ------------------------------------------------------------------ */
/* Colophon — the researcher                                           */
/* ------------------------------------------------------------------ */

export const PERSON = {
  name: 'Imani Okafor',
  honorific: 'Dr',
  role: 'Senior Research Scientist',
  affiliation: 'Machine Learning Systems Laboratory',
  location: 'Edinburgh',
  hIndex: 21,
  totalCitations: 1840,
  firstPublished: 2015,
  syntheticMark: 'ILLUSTRATIVE PROFILE · SYNTHETIC',
} as const;

export const CHROME = {
  world: 'THE SPECIMEN BOOK · PERSONAL PAGE',
  edition: 'FIRST EDITION · SET IN THE HOUSE FACE',
  synthetic: 'ILLUSTRATIVE PROFILE · SYNTHETIC',
} as const;

export const STATEMENT: readonly string[] = [
  'A body of work,',
  'set in type that',
  'earns its size.',
];

export const STATEMENT_SUBLINE =
  'A publication list is not a CV line item — it is a specimen book. Each paper is set here in its own cut of the house face, at the size the field gave it, with a plain note on what actually survived peer review and time. The retraction is set with the same care as the citations.';

/* ------------------------------------------------------------------ */
/* Optical axes — every specimen is a different cut of the face        */
/* ------------------------------------------------------------------ */

/** Fraunces variable axes. `italic` toggles the italic instance. */
export interface OpticalCut {
  opsz: number;
  wght: number;
  soft: number;
  wonk: 0 | 1;
  italic: boolean;
  /** Optical tracking, em. */
  tracking: number;
  /** Human name of the cut, set in the metadata line. */
  cutName: string;
}

/* ------------------------------------------------------------------ */
/* Specimens — the papers                                              */
/* ------------------------------------------------------------------ */

export type ReviewStatus = 'PEER-REVIEWED' | 'JOURNAL' | 'WORKSHOP' | 'PREPRINT' | 'RETRACTED';

export interface Specimen {
  id: string;
  /** Two-digit specimen number, mono. */
  number: string;
  title: string;
  venue: string;
  year: string;
  status: ReviewStatus;
  citations: number;
  coAuthors: number;
  cut: OpticalCut;
  abstract: string;
  /** The honesty layer: one line on what the field actually kept. */
  whatSurvived: string;
  /** Present only on the retracted specimen. */
  erratum?: string;
}

export const SPECIMENS: readonly Specimen[] = [
  {
    id: 'sp-01',
    number: '01',
    title: 'Effectively-Once Delivery for Model Feature Pipelines',
    venue: 'VLDB',
    year: 'FY18',
    status: 'PEER-REVIEWED',
    citations: 412,
    coAuthors: 2,
    cut: { opsz: 120, wght: 820, soft: 0, wonk: 0, italic: false, tracking: -0.02, cutName: 'House Display Black' },
    abstract:
      'We formalise effectively-once semantics for feature materialisation under partial failure, and show a lease-and-fence protocol that eliminates duplicate features without a distributed transaction. Evaluated across three production feature stores.',
    whatSurvived:
      'The lease-and-fence protocol; four systems ship a variant of it. The formalism is taught; the benchmark section is forgotten.',
  },
  {
    id: 'sp-02',
    number: '02',
    title: 'On the Quiet Failure Modes of Learned Retrieval',
    venue: 'NeurIPS',
    year: 'FY20',
    status: 'PEER-REVIEWED',
    citations: 336,
    coAuthors: 3,
    cut: { opsz: 84, wght: 340, soft: 40, wonk: 0, italic: true, tracking: 0.0, cutName: 'House Text Light Italic' },
    abstract:
      'Learned retrievers fail silently when the query distribution drifts. We characterise three quiet failure modes and give a cheap online detector that flags them before downstream metrics move.',
    whatSurvived:
      'The taxonomy of quiet failures entered the vocabulary. The detector was superseded within two years — as it should be.',
  },
  {
    id: 'sp-03',
    number: '03',
    title: 'Contracts, Not Schemas: Versioning Data at the Team Boundary',
    venue: 'SIGMOD',
    year: 'FY21',
    status: 'JOURNAL',
    citations: 289,
    coAuthors: 1,
    cut: { opsz: 108, wght: 900, soft: 0, wonk: 1, italic: false, tracking: -0.015, cutName: 'House Display Wonk' },
    abstract:
      'A data contract is an API, not a table. We propose consumer-driven contracts for analytical data and a compatibility calculus that lets producers evolve without breaking silent downstream readers.',
    whatSurvived:
      'The phrase "contracts, not schemas" outran the paper. The compatibility calculus is used; the tooling prototype is not.',
  },
  {
    id: 'sp-04',
    number: '04',
    title: 'Drift Is a Property of the World, Not the Model',
    venue: 'ICML',
    year: 'FY22',
    status: 'PEER-REVIEWED',
    citations: 258,
    coAuthors: 4,
    cut: { opsz: 96, wght: 560, soft: 70, wonk: 0, italic: false, tracking: -0.005, cutName: 'House Text Soft Medium' },
    abstract:
      'We argue that distribution drift should be measured on inputs and outcomes, not model scores, and give an estimator that attributes drift to named world-events rather than to the model under watch.',
    whatSurvived:
      'The framing changed how two teams write monitoring specs. The estimator is one of several the field now uses.',
  },
  {
    id: 'sp-05',
    number: '05',
    title: 'A Note on Reproducing Ourselves',
    venue: 'Workshop on ML Reproducibility',
    year: 'FY23',
    status: 'WORKSHOP',
    citations: 74,
    coAuthors: 0,
    cut: { opsz: 72, wght: 420, soft: 30, wonk: 0, italic: true, tracking: 0.005, cutName: 'House Text Book Italic' },
    abstract:
      'A single-author reflection: we tried to reproduce our own three-year-old result and could not, at first. What broke, why, and the small disciplines that would have prevented it.',
    whatSurvived:
      'Cited more in onboarding docs than in papers — which is the point. Its checklist is pinned in two labs.',
  },
  {
    id: 'sp-06',
    number: '06',
    title: 'Fast Approximate Attribution via Score Caching',
    venue: 'AISTATS',
    year: 'FY23',
    status: 'RETRACTED',
    citations: 61,
    coAuthors: 2,
    cut: { opsz: 100, wght: 600, soft: 20, wonk: 0, italic: false, tracking: -0.008, cutName: 'House Text Semibold' },
    abstract:
      'We proposed a caching scheme claiming near-exact feature attribution at a fraction of the cost. A boundary condition in the caching proof does not hold under correlated features.',
    whatSurvived:
      'Nothing of the speed claim. What survived is the erratum: a worked counter-example the community reuses when teaching why the shortcut fails.',
    erratum:
      'RETRACTED FY24 — the central speed-accuracy claim does not hold under correlated features. Retracted by the authors, not the venue. The counter-example in the erratum is the part worth keeping.',
  },
  {
    id: 'sp-07',
    number: '07',
    title: 'Serving Causal Estimates Under a Latency Budget',
    venue: 'VLDB',
    year: 'FY25',
    status: 'PEER-REVIEWED',
    citations: 143,
    coAuthors: 3,
    cut: { opsz: 132, wght: 780, soft: 10, wonk: 0, italic: false, tracking: -0.022, cutName: 'House Display Bold' },
    abstract:
      'Causal estimates are expensive to serve online. We give an amortised estimator with a bounded-staleness guarantee that keeps p99 decision latency under budget while preserving the interval.',
    whatSurvived:
      'Too recent to know. The bounded-staleness guarantee is the part being built on; ask again in three years.',
  },
];

/* ------------------------------------------------------------------ */
/* Citations-over-time exhibit — a restrained GREY figure              */
/* ------------------------------------------------------------------ */

export interface CitationSeries {
  id: string;
  label: string;
  points: readonly { x: string; y: number }[];
}

/** Three flagship specimens; distinguished by LINE STYLE, never colour. */
export const CITATION_SERIES: readonly CitationSeries[] = [
  {
    id: 'sp-01',
    label: 'Specimen 01 — Effectively-Once',
    points: [
      { x: 'FY18', y: 18 },
      { x: 'FY19', y: 74 },
      { x: 'FY20', y: 158 },
      { x: 'FY21', y: 244 },
      { x: 'FY22', y: 312 },
      { x: 'FY23', y: 366 },
      { x: 'FY24', y: 396 },
      { x: 'FY25', y: 412 },
    ],
  },
  {
    id: 'sp-02',
    label: 'Specimen 02 — Quiet Failure Modes',
    points: [
      { x: 'FY20', y: 12 },
      { x: 'FY21', y: 88 },
      { x: 'FY22', y: 176 },
      { x: 'FY23', y: 248 },
      { x: 'FY24', y: 300 },
      { x: 'FY25', y: 336 },
    ],
  },
  {
    id: 'sp-04',
    label: 'Specimen 04 — Drift Is a Property',
    points: [
      { x: 'FY22', y: 20 },
      { x: 'FY23', y: 110 },
      { x: 'FY24', y: 198 },
      { x: 'FY25', y: 258 },
    ],
  },
];

export const CITATION_FIGURE = {
  title: 'Citations by fiscal year — three flagship specimens',
  caption:
    'Cumulative citations for the three most-cited specimens. Series are told apart by line style and weight, not colour — this is the colourless world.',
  source: 'SYNTHETIC DEMONSTRATION DATA · citation counts are illustrative',
  unit: 'citations',
} as const;

/* ------------------------------------------------------------------ */
/* Reviewing & service register                                        */
/* ------------------------------------------------------------------ */

export interface ServiceEntry {
  id: string;
  venue: string;
  role: string;
  span: string;
  detail: string;
}

export const SERVICE: readonly ServiceEntry[] = [
  { id: 'sv-1', venue: 'VLDB', role: 'Programme Committee', span: 'FY21–FY26', detail: 'Reviewed 9–12 submissions per cycle; area chair for data systems FY24.' },
  { id: 'sv-2', venue: 'NeurIPS', role: 'Reviewer', span: 'FY19–FY26', detail: 'Datasets & Benchmarks track; two outstanding-reviewer citations.' },
  { id: 'sv-3', venue: 'SIGMOD', role: 'Reviewer', span: 'FY20–FY25', detail: 'Industrial track; shepherded three papers to camera-ready.' },
  { id: 'sv-4', venue: 'Journal of ML Systems', role: 'Associate Editor', span: 'FY23–', detail: 'Handling editor for reproducibility and data-contract submissions.' },
];

export const SERVICE_NOTE =
  'Service counted plainly. Reviewing is the rent you pay on being read; these are the ledgers, not a boast.';

/* ------------------------------------------------------------------ */
/* Reading list — "what I wish I had written"                          */
/* ------------------------------------------------------------------ */

export interface ReadingEntry {
  id: string;
  authors: string;
  title: string;
  venue: string;
  year: string;
  why: string;
}

export const READING_LIST: readonly ReadingEntry[] = [
  {
    id: 'r-1',
    authors: 'L. Novak, R. Adeyemi',
    title: 'The Cost of a Feature: Attribution Under Budget',
    venue: 'OSDI',
    year: 'FY22',
    why: 'Did in twelve pages what my Specimen 07 gestures at. The economic framing is the one I keep borrowing.',
  },
  {
    id: 'r-2',
    authors: 'M. Haddad',
    title: 'Why Your Metric Moved: Causal Monitoring in Practice',
    venue: 'VLDB',
    year: 'FY21',
    why: 'The paper I thought I was writing in Specimen 04, written earlier and more plainly.',
  },
  {
    id: 'r-3',
    authors: 'S. Vittori, P. Menon, K. Osei',
    title: 'Contracts as Types: A Compatibility Calculus',
    venue: 'POPL',
    year: 'FY23',
    why: 'Gave my "contracts, not schemas" slogan the formal spine it never had.',
  },
  {
    id: 'r-4',
    authors: 'D. Fischer',
    title: 'On Being Wrong in Public: A Field Guide to Retractions',
    venue: 'Comms. of the ML Community',
    year: 'FY24',
    why: 'I read this the week I retracted Specimen 06. It is why the erratum is set here with care.',
  },
  {
    id: 'r-5',
    authors: 'A. Blomqvist, T. Ferreira',
    title: 'Reproducibility Is a Social Contract',
    venue: 'Workshop on ML Reproducibility',
    year: 'FY22',
    why: 'The essay my little Specimen 05 wanted to be. Generous, exact, and correct.',
  },
];

export const READING_NOTE = 'Full credit, no envy. The library is the point, not the shelf with my name on it.';

export const STATUS_LABEL: Record<ReviewStatus, string> = {
  'PEER-REVIEWED': 'PEER-REVIEWED',
  JOURNAL: 'JOURNAL',
  WORKSHOP: 'WORKSHOP',
  PREPRINT: 'PREPRINT',
  RETRACTED: 'RETRACTED',
};
