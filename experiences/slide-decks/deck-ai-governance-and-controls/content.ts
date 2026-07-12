/**
 * Content pack for "The Control Frame" — the live rendering of
 * `deck-ai-governance-and-controls`.
 *
 * Swiss-precision governance: the visual language of a certified control
 * framework. A near-black field, a hairline modular grid that IS the design
 * surface, monochrome with a single signal amber. The commanding visual is
 * THE CONTROL MATRIX — the bank's AI controls as a grid of lifecycle stages
 * (rows) against control families (columns). One cell is an acknowledged GAP.
 * The deck then navigates its own matrix: it zooms into regions of it.
 *
 * Everything here is TYPED and DETERMINISTIC. Control ids, owners and
 * statuses are synthetic demonstration data; no real framework is reproduced.
 */

/* ------------------------------------------------------------------ */
/* Framework chrome                                                    */
/* ------------------------------------------------------------------ */

export const FRAMEWORK = {
  version: 'AI-CF v4.2',
  effectiveDate: 'EFFECTIVE 01 FEB 2027',
  title: 'AI CONTROL FRAMEWORK',
  owner: 'GROUP AI RISK & GOVERNANCE',
  dataNotice: 'POLICY FRAMEWORK · SYNTHETIC',
  keyboardHint: '← → NAVIGATE · HOME/END FIRST/LAST · M — MATRIX',
} as const;

/* ------------------------------------------------------------------ */
/* The matrix: lifecycle stages (rows) × control families (columns)    */
/* ------------------------------------------------------------------ */

export const LIFECYCLE = [
  { id: 'L1', label: 'DATA & SOURCING' },
  { id: 'L2', label: 'DESIGN & BUILD' },
  { id: 'L3', label: 'VALIDATION' },
  { id: 'L4', label: 'APPROVAL' },
  { id: 'L5', label: 'DEPLOYMENT' },
  { id: 'L6', label: 'MONITORING' },
] as const;

export const FAMILIES = [
  { id: 'F1', label: 'ACCOUNTABILITY' },
  { id: 'F2', label: 'RISK & CONTROL' },
  { id: 'F3', label: 'DATA & PRIVACY' },
  { id: 'F4', label: 'FAIRNESS' },
  { id: 'F5', label: 'TRANSPARENCY' },
] as const;

export type ControlStatus = 'certified' | 'in-review' | 'exception' | 'planned' | 'gap';

export interface Cell {
  /** CTRL-AI-0NN, assigned row-major. */
  id: string;
  name: string;
  status: ControlStatus;
  /** Owner initials (line-of-defence marker). */
  owner: string;
  /** Present only on the gap cell. */
  remediation?: string;
}

/**
 * Status glyphs are SHAPE-coded (never colour alone): a screen reader gets the
 * word, a sighted user gets a distinct shape as well as the amber signal.
 */
export const STATUS_GLYPH: Record<ControlStatus, string> = {
  certified: '●',
  'in-review': '◐',
  exception: '▲',
  planned: '○',
  gap: '▢',
};

export const STATUS_LABEL: Record<ControlStatus, string> = {
  certified: 'Certified',
  'in-review': 'In review',
  exception: 'Exception',
  planned: 'Planned',
  gap: 'Control gap',
};

// Row-major control definitions. Kept terse; ids are generated below.
const RAW: readonly (readonly [string, ControlStatus, string])[][] = [
  // L1 · DATA & SOURCING
  [
    ['Data sourcing accountability', 'certified', 'CDO'],
    ['Source risk assessment', 'certified', '2LD'],
    ['Lineage & consent register', 'in-review', 'DPO'],
    ['Representativeness review', 'certified', 'MRM'],
    ['Dataset datasheet', 'certified', 'CDO'],
  ],
  // L2 · DESIGN & BUILD
  [
    ['Model owner assigned', 'certified', 'MO'],
    ['Design risk controls', 'certified', '2LD'],
    ['Privacy-by-design review', 'certified', 'DPO'],
    ['Fairness objective set', 'planned', 'MRM'],
    ['Design decision log', 'certified', 'MO'],
  ],
  // L3 · VALIDATION
  [
    ['Independent validation owner', 'certified', 'IVL'],
    ['Effectiveness testing', 'exception', 'IVL'],
    ['Data leakage checks', 'certified', 'IVL'],
    ['Fairness testing', 'certified', 'MRM'],
    ['Validation report filed', 'certified', 'IVL'],
  ],
  // L4 · APPROVAL
  [
    ['Approval authority defined', 'certified', 'MRC'],
    ['Residual-risk sign-off', 'certified', 'CRO'],
    ['Privacy sign-off', 'certified', 'DPO'],
    ['Fairness sign-off', 'certified', 'MRC'],
    ['Approval record & rationale', 'certified', 'MRC'],
  ],
  // L5 · DEPLOYMENT
  [
    ['Deployment accountability', 'certified', 'CIO'],
    ['Change & rollback control', 'certified', '2LD'],
    ['Access & retention control', 'certified', 'DPO'],
    ['Adverse-action review', 'in-review', 'MRM'],
    ['Customer disclosure', 'certified', 'CIO'],
  ],
  // L6 · MONITORING
  [
    ['Monitoring accountability', 'certified', 'MO'],
    ['Drift & breach control', 'certified', '2LD'],
    ['Ongoing privacy monitoring', 'certified', 'DPO'],
    ['Fairness monitoring in production', 'gap', '—'],
    ['Explainability monitoring', 'exception', 'CIO'],
  ],
];

export const MATRIX: Cell[][] = RAW.map((row, r) =>
  row.map(([name, status, owner], c) => ({
    id: `CTRL-AI-${String(r * FAMILIES.length + c + 1).padStart(3, '0')}`,
    name,
    status,
    owner,
    ...(status === 'gap'
      ? { remediation: 'CONTROL GAP · REMEDIATION Q3 · owner to be named at approval' }
      : {}),
  })),
);

/** Coordinates of the single acknowledged gap — the deliberate anomaly. */
export const GAP_COORD = (() => {
  for (let r = 0; r < MATRIX.length; r += 1) {
    const row = MATRIX[r];
    if (!row) continue;
    for (let c = 0; c < row.length; c += 1) {
      if (row[c]?.status === 'gap') return { row: r, col: c };
    }
  }
  return { row: -1, col: -1 };
})();

export const CONTROL_COUNT = MATRIX.flat().length;
export const GAP_COUNT = MATRIX.flat().filter((c) => c.status === 'gap').length;
export const EXCEPTION_COUNT = MATRIX.flat().filter((c) => c.status === 'exception').length;

/* ------------------------------------------------------------------ */
/* Slide model                                                         */
/* ------------------------------------------------------------------ */

interface FrameBase {
  id: string;
  indexTitle: string;
  section: string;
  /** True while the slide is looking at the matrix (drives the cell counter). */
  inMatrix?: boolean;
}

export interface CoverFrame extends FrameBase {
  kind: 'cover';
  titleLines: readonly string[];
  thesis: string;
  meta: readonly string[];
}

export interface PrinciplesFrame extends FrameBase {
  kind: 'principles';
  kicker: string;
  principles: readonly { no: string; word: string; line: string }[];
}

export interface MatrixFrame extends FrameBase {
  kind: 'matrix';
  kicker: string;
  heading: string;
  standfirst: string;
}

export interface ZoomFrame extends FrameBase {
  kind: 'zoom';
  focus: { type: 'row' | 'col'; index: number };
  kicker: string;
  heading: string;
  reading: string;
  /** Per-cell obligation text for the focused line, in family/lifecycle order. */
  obligations: readonly string[];
}

export interface EscalationFrame extends FrameBase {
  kind: 'escalation';
  kicker: string;
  heading: string;
  standfirst: string;
  steps: readonly { tier: string; owner: string; trigger: string; clock: string }[];
}

export interface ClosingFrame extends FrameBase {
  kind: 'closing';
  lines: readonly string[];
  obligations: readonly string[];
  meta: readonly string[];
}

export type Frame =
  | CoverFrame
  | PrinciplesFrame
  | MatrixFrame
  | ZoomFrame
  | EscalationFrame
  | ClosingFrame;

const SEC_FRAME = 'THE FRAME';
const SEC_MATRIX = 'THE MATRIX';
const SEC_OBLIG = 'OBLIGATIONS';

export const FRAMES: readonly Frame[] = [
  {
    kind: 'cover',
    id: 'cover',
    indexTitle: 'Cover — the control framework',
    section: 'FRONT MATTER',
    titleLines: ['Every model the', 'bank runs sits in', 'one frame.'],
    thesis:
      'Governance is not a document; it is a grid. Thirty certified controls hold every AI model across its life, from sourcing to monitoring. This framework shows the grid whole — including the one cell that is still empty, because a control framework that hides its gaps is not a control framework.',
    meta: [
      `${FRAMEWORK.title} · ${FRAMEWORK.version}`,
      `${FRAMEWORK.effectiveDate} · OWNER ${FRAMEWORK.owner}`,
      `${CONTROL_COUNT} CONTROLS · ${GAP_COUNT} ACKNOWLEDGED GAP · ${FRAMEWORK.dataNotice}`,
    ],
  },
  {
    kind: 'principles',
    id: 'principles',
    indexTitle: 'Principles',
    section: SEC_FRAME,
    kicker: 'FOUR PRINCIPLES',
    principles: [
      { no: '01', word: 'Owned', line: 'Every model has one accountable human at every stage.' },
      { no: '02', word: 'Proven', line: 'No model is approved on assertion; only on evidence.' },
      { no: '03', word: 'Watched', line: 'Autonomy is matched, control for control, by monitoring.' },
      { no: '04', word: 'Stated', line: 'Gaps are named in the frame, not left off it.' },
    ],
  },
  {
    kind: 'matrix',
    id: 'matrix',
    indexTitle: 'The control matrix',
    section: SEC_MATRIX,
    inMatrix: true,
    kicker: 'THE CONTROL MATRIX',
    heading: 'The frame, whole.',
    standfirst:
      'Six lifecycle stages down, five control families across. Each cell is a certified control with an id, a status and an owner. One cell is empty — an acknowledged gap under remediation. The eye finds it first; so should the regulator.',
  },
  {
    kind: 'zoom',
    id: 'three-lines',
    indexTitle: 'Zoom — three lines of defence',
    section: SEC_MATRIX,
    inMatrix: true,
    focus: { type: 'col', index: 0 },
    kicker: 'ZOOM · COLUMN F1 · ACCOUNTABILITY',
    heading: 'Three lines of defence.',
    reading:
      'Read the accountability column top to bottom and the three lines of defence appear: the model owner and business hold the first line, independent risk and validation the second, and the committee the assurance point above them. No stage is unowned.',
    obligations: [
      'First line — the Chief Data Officer owns sourcing accountability and the dataset record.',
      'First line — the model owner is named at build and carries the model for its life.',
      'Second line — independent validation owns the VALIDATION line, reporting apart from the owner.',
      'Assurance — the Model Risk Committee is the approval authority and records its rationale.',
      'First line — the CIO owns deployment accountability and customer disclosure.',
      'First line — monitoring accountability returns to the model owner, paged on breach.',
    ],
  },
  {
    kind: 'zoom',
    id: 'approval-gate',
    indexTitle: 'Zoom — model-approval gate',
    section: SEC_MATRIX,
    inMatrix: true,
    focus: { type: 'row', index: 3 },
    kicker: 'ZOOM · ROW L4 · APPROVAL',
    heading: 'The model-approval gate.',
    reading:
      'The approval row is a gate, not a rubber stamp: five controls must all be green before a model touches a customer. Every one is certified — approval is the one line in the frame that carries no exceptions, by design.',
    obligations: [
      'Approval authority is defined and cannot be delegated below the Committee.',
      'Residual risk is signed off by the Chief Risk Officer, independently of the owner.',
      'Privacy impact is signed off by the Data Protection Officer before go-live.',
      'Fairness outcomes are signed off against the appetite set at design.',
      'The approval, its rationale and its conditions are recorded and auditable.',
    ],
  },
  {
    kind: 'zoom',
    id: 'monitoring',
    indexTitle: 'Zoom — monitoring obligations',
    section: SEC_MATRIX,
    inMatrix: true,
    focus: { type: 'row', index: 5 },
    kicker: 'ZOOM · ROW L6 · MONITORING',
    heading: 'What we owe after go-live.',
    reading:
      'Monitoring is where the frame is honest about itself. Four controls are certified — and one is not. Fairness monitoring in production is an acknowledged GAP under remediation for Q3; the frame carries the empty cell openly rather than pretend the obligation is met.',
    obligations: [
      'Monitoring accountability sits with the model owner, paged before the regulator is.',
      'Drift and breach control reverts autonomy automatically on a threshold breach.',
      'Ongoing privacy monitoring runs against access and retention obligations.',
      'GAP — fairness monitoring in production is not yet certified. Remediation Q3.',
      'Explainability monitoring is under an exception pending a tooling upgrade.',
    ],
  },
  {
    kind: 'escalation',
    id: 'escalation',
    indexTitle: 'Escalation path',
    section: SEC_OBLIG,
    kicker: 'ESCALATION PATH',
    heading: 'When a control breaches.',
    standfirst:
      'A breach does not wait for a meeting. It climbs a defined path, on a defined clock, until someone with authority holds it.',
    steps: [
      { tier: 'DETECT', owner: 'MONITORING', trigger: 'Threshold breach detected', clock: 'T + 0' },
      { tier: '1ST LINE', owner: 'MODEL OWNER', trigger: 'Autonomy reverted, triage opened', clock: '≤ 1 H' },
      { tier: '2ND LINE', owner: 'RISK & VALIDATION', trigger: 'Independent assessment', clock: '≤ 24 H' },
      { tier: 'COMMITTEE', owner: 'MODEL RISK COMMITTEE', trigger: 'Decision to hold or restore', clock: '≤ 72 H' },
      { tier: 'BOARD', owner: 'BOARD RISK', trigger: 'Notified if material', clock: 'NEXT SITTING' },
    ],
  },
  {
    kind: 'closing',
    id: 'closing',
    indexTitle: 'Closing obligations',
    section: SEC_OBLIG,
    lines: ['A frame you can', 'point at.'],
    obligations: [
      'The matrix is the control inventory of record; every cell is auditable to its evidence.',
      'The gap is owned as a gap: remediation Q3, reported to the Committee until closed.',
      'The framework is reviewed on every material change and at least annually.',
    ],
    meta: [`${FRAMEWORK.title} · ${FRAMEWORK.version} · ${FRAMEWORK.effectiveDate}`, FRAMEWORK.dataNotice],
  },
];

export const FRAME_COUNT = FRAMES.length;

/** 1-based frame number for a slug, or null. */
export function frameNumberForId(id: string): number | null {
  const index = FRAMES.findIndex((frame) => frame.id === id);
  return index === -1 ? null : index + 1;
}
