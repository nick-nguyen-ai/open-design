/**
 * Content pack for "The Field Manual" — the live rendering of
 * `deck-technical-training`.
 *
 * Internal training as a beloved technical field manual: the aesthetic of
 * aviation ops manuals and machinery plates. Utilitarian paper tone, olive and
 * graphite inks, safety-orange used ONLY for warnings. Slides are PROCEDURES
 * with numbered steps in strict two-column plates (steps left, DO/DON'T plates
 * right), machinery-label warning callouts, a mid-deck CHECKPOINT self-test
 * (answers overleaf, flipped treatment), a tools plate, and a sign-off sheet.
 *
 * The anomaly: PROC 3.2 step 4 is marked REVISED AFTER INCIDENT IR-2214 with a
 * terse margin note — the manual visibly learns. Procedures cite the Control
 * Frame's control ids (CTRL-AI-0NN) where they enforce one.
 *
 * Everything here is TYPED and DETERMINISTIC — synthetic demonstration data;
 * no real institution implied.
 */

/* ------------------------------------------------------------------ */
/* Manual chrome                                                       */
/* ------------------------------------------------------------------ */

export const MANUAL = {
  code: 'FM-OPS-07',
  title: 'MODEL OPERATIONS FIELD MANUAL',
  unit: 'UNIT 3 · MOVING MODELS SAFELY',
  revision: 'REV D · 2026-07',
  authority: 'ISSUED BY MODEL PLATFORM OPERATIONS',
  crossRef: 'CONTROL IDS PER THE AI CONTROL FRAMEWORK (CTRL-AI-0NN)',
  dataNotice: 'TRAINING MATERIAL · SYNTHETIC',
  keyboardHint: '← → PAGES · HOME / END · C — CHECKPOINT',
} as const;

/* ------------------------------------------------------------------ */
/* Slide model                                                         */
/* ------------------------------------------------------------------ */

export interface ProcStep {
  no: string;
  text: string;
  /** Terse mono annotation set against the step (control id, timing, gate). */
  tag?: string;
  /** The anomaly: this step was rewritten after an incident. */
  revised?: { incident: string; marginNote: string };
}

export interface DoDontPlate {
  kind: 'do' | 'dont';
  title: string;
  line: string;
}

export interface WarningLabel {
  /** Machinery-label text, set in safety orange. */
  text: string;
}

interface SlideBase {
  id: string;
  /** Register line (contents + accessible mirror). */
  registerTitle: string;
  /** Footer section. */
  section: string;
}

export interface CoverSlide extends SlideBase {
  kind: 'cover';
  lines: readonly string[];
  meta: readonly string[];
}

export interface ContentsSlide extends SlideBase {
  kind: 'contents';
  intro: string;
}

export interface ProcedureSlide extends SlideBase {
  kind: 'procedure';
  procNo: string;
  title: string;
  objective: string;
  steps: readonly ProcStep[];
  plates: readonly DoDontPlate[];
  warning?: WarningLabel;
}

export interface CheckpointSlide extends SlideBase {
  kind: 'checkpoint';
  title: string;
  instruction: string;
  questions: readonly { no: string; q: string }[];
}

export interface AnswersSlide extends SlideBase {
  kind: 'answers';
  title: string;
  answers: readonly { no: string; a: string }[];
}

export interface ToolsSlide extends SlideBase {
  kind: 'tools';
  title: string;
  intro: string;
  tools: readonly { slot: string; name: string; purpose: string; approved: string }[];
}

export interface SignoffSlide extends SlideBase {
  kind: 'signoff';
  title: string;
  competencies: readonly { id: string; text: string }[];
  lines: readonly { role: string; fields: readonly string[] }[];
}

export type Slide =
  | CoverSlide
  | ContentsSlide
  | ProcedureSlide
  | CheckpointSlide
  | AnswersSlide
  | ToolsSlide
  | SignoffSlide;

/* ------------------------------------------------------------------ */
/* The nine pages                                                      */
/* ------------------------------------------------------------------ */

export const SLIDES: readonly Slide[] = [
  {
    kind: 'cover',
    id: 'cover',
    registerTitle: 'Cover — Model Operations Field Manual',
    section: 'COVER',
    lines: ['Read it.', 'Follow it.', 'Sign it.'],
    meta: [
      `${MANUAL.code} · ${MANUAL.revision}`,
      MANUAL.unit,
      MANUAL.authority,
      MANUAL.dataNotice,
    ],
  },
  {
    kind: 'contents',
    id: 'contents',
    registerTitle: 'Contents — the procedure register',
    section: 'CONTENTS',
    intro:
      'Three procedures, one checkpoint, one kit, one signature. Nothing in this unit is advisory: every step is either mandatory or marked optional, and the manual says which.',
  },
  {
    kind: 'procedure',
    id: 'proc-3-1',
    registerTitle: 'PROC 3.1 — Promoting features to the online store',
    section: 'PROC 3.1',
    procNo: 'PROC 3.1',
    title: 'PROMOTING FEATURES TO THE ONLINE STORE',
    objective:
      'Move a feature set from offline development to online serving without breaking a model that already depends on the previous version.',
    steps: [
      { no: '1', text: 'Freeze the feature-set definition and tag it. A promotion always references a tag, never a branch.', tag: 'GIT TAG · IMMUTABLE' },
      { no: '2', text: 'Run the parity job: offline and online values must agree on the sampled window before promotion is allowed.', tag: 'PARITY ≥ 99.9%' },
      { no: '3', text: 'Promote to the online store behind a version alias. Existing models keep reading the old version until they opt in.', tag: 'ALIASED · NO IN-PLACE' },
      { no: '4', text: 'Record the promotion in the decision ledger with the parity report attached.', tag: 'ENFORCES CTRL-AI-003' },
    ],
    plates: [
      { kind: 'do', title: 'PROMOTE BY TAG', line: 'A tag is the same bytes forever. The parity report stays true.' },
      { kind: 'dont', title: 'PROMOTE A BRANCH', line: 'A branch moves after review. Your parity report is about the past.' },
    ],
  },
  {
    kind: 'procedure',
    id: 'proc-3-2',
    registerTitle: 'PROC 3.2 — Deploying a model to staging · REVISED',
    section: 'PROC 3.2',
    procNo: 'PROC 3.2',
    title: 'DEPLOYING A MODEL TO STAGING',
    objective:
      'Put a certified release candidate in front of shadow traffic, prove it behaves, and leave a record that proves you proved it.',
    steps: [
      { no: '1', text: 'Verify the candidate carries a certification stamp from validation. No stamp, no deploy — there is no exceptions path.', tag: 'GATE · CERT REQUIRED' },
      { no: '2', text: 'Deploy to the staging pool with shadow traffic only. The candidate scores real requests; its answers go nowhere.', tag: 'SHADOW · 0% SERVE' },
      { no: '3', text: 'Hold for the soak window and compare score distributions against the incumbent on the same traffic.', tag: 'SOAK ≥ 48 H' },
      {
        no: '4',
        text: 'Pin the feature-set version the candidate was certified against before it sees a single shadow request. The pin is verified by the deploy job, not by the engineer.',
        tag: 'PIN VERIFIED IN CI',
        revised: {
          incident: 'IR-2214',
          marginNote: 'A candidate scored 6 h of shadow traffic on features one version ahead of its certificate. Caught in soak. The pin moved from checklist to build gate.',
        },
      },
      { no: '5', text: 'Record the deployment, soak evidence and sign-off chain in the decision ledger.', tag: 'ENFORCES CTRL-AI-021' },
    ],
    plates: [
      { kind: 'do', title: 'PIN THEN DEPLOY', line: 'The certificate names a feature version. Staging runs exactly that.' },
      { kind: 'dont', title: 'TRUST THE DEFAULT', line: '“Latest” is a moving part. Certificates do not follow it.' },
    ],
    warning: { text: 'CAUTION · NEVER RETRAIN ON PRODUCTION LABELS — LABELS LAG DECISIONS. RETRAINING ON THEM TEACHES THE MODEL ITS OWN MISTAKES.' },
  },
  {
    kind: 'checkpoint',
    id: 'checkpoint',
    registerTitle: 'Checkpoint — self-test before proceeding',
    section: 'CHECKPOINT',
    title: 'CHECKPOINT · UNIT 3',
    instruction:
      'Close the manual. Answer all four aloud. The instructor walks the room; answers are overleaf. Do not proceed to PROC 3.3 with an unresolved item.',
    questions: [
      { no: 'Q1', q: 'A promotion references a branch that passed review yesterday. Proceed?' },
      { no: 'Q2', q: 'What does a certification stamp bind a candidate to, besides its own weights?' },
      { no: 'Q3', q: 'Shadow traffic shows a 2% score shift against the incumbent. Who decides what happens next?' },
      { no: 'Q4', q: 'Why is retraining on production labels forbidden even when they are plentiful?' },
    ],
  },
  {
    kind: 'answers',
    id: 'answers',
    registerTitle: 'Checkpoint answers — flipped plate',
    section: 'CHECKPOINT',
    title: 'ANSWERS · UNIT 3',
    answers: [
      { no: 'A1', a: 'No. Tags only — a branch can move after review. Re-tag and re-run parity (PROC 3.1 step 1).' },
      { no: 'A2', a: 'The exact feature-set version it was validated against. The pin is enforced in CI since IR-2214 (PROC 3.2 step 4).' },
      { no: 'A3', a: 'The model owner, with the soak evidence in front of them — never the deploying engineer alone (CTRL-AI-021).' },
      { no: 'A4', a: 'Labels lag decisions and inherit their bias: the model would learn its own mistakes as ground truth.' },
    ],
  },
  {
    kind: 'tools',
    id: 'tools',
    registerTitle: 'Tools plate — the approved kit',
    section: 'KIT',
    title: 'APPROVED TOOLCHAIN · KIT PLATE 3-K',
    intro:
      'The kit is closed: if a tool is not on this plate, it does not touch a model in staging or production. Additions go through platform review, not personal preference.',
    tools: [
      { slot: 'K1', name: 'forge', purpose: 'Build & certify release candidates', approved: 'v4 LTS' },
      { slot: 'K2', name: 'parity', purpose: 'Offline/online feature agreement', approved: 'v2.8+' },
      { slot: 'K3', name: 'shadowctl', purpose: 'Shadow pools & soak windows', approved: 'v1.9' },
      { slot: 'K4', name: 'ledgerpen', purpose: 'Decision-ledger records & evidence', approved: 'v3.2' },
      { slot: 'K5', name: 'drift-scope', purpose: 'Distribution comparison in soak', approved: 'v5.0' },
      { slot: 'K6', name: 'rollback', purpose: 'One-command reversion (PROC 3.3)', approved: 'v2.1' },
    ],
  },
  {
    kind: 'procedure',
    id: 'proc-3-3',
    registerTitle: 'PROC 3.3 — Rolling back a bad deploy',
    section: 'PROC 3.3',
    procNo: 'PROC 3.3',
    title: 'ROLLING BACK A BAD DEPLOY',
    objective:
      'Return serving to the last known-good release in minutes, with the evidence trail intact — rollback is a routine manoeuvre, not an emergency.',
    steps: [
      { no: '1', text: 'Declare the rollback in the operations channel and name the incumbent release you are returning to. Declaring is not blame; silence is.', tag: 'DECLARE FIRST' },
      { no: '2', text: 'Run rollback to the incumbent. The alias flips atomically; in-flight requests complete on the version that started them.', tag: 'ATOMIC ALIAS FLIP' },
      { no: '3', text: 'Verify serving metrics return to the incumbent baseline within the watch window.', tag: 'WATCH ≤ 15 MIN' },
      { no: '4', text: 'File the rollback record with cause, evidence and the candidate’s disposition. A rolled-back candidate re-enters at PROC 3.2 step 1 — never mid-way.', tag: 'ENFORCES CTRL-AI-022' },
    ],
    plates: [
      { kind: 'do', title: 'ROLL BACK EARLY', line: 'The cheapest rollback is the one you did not have to defend.' },
      { kind: 'dont', title: 'PATCH IN PLACE', line: 'A hot-edited model has no certificate. You now run an unknown.' },
    ],
    warning: { text: 'CAUTION · A ROLLED-BACK CANDIDATE RE-ENTERS AT STEP 1. THERE IS NO “QUICK REDEPLOY” PATH IN THIS MANUAL.' },
  },
  {
    kind: 'signoff',
    id: 'signoff',
    registerTitle: 'Sign-off — competency register',
    section: 'SIGN-OFF',
    title: 'COMPETENCY REGISTER · UNIT 3',
    competencies: [
      { id: 'C3.1', text: 'Can promote a feature set by tag with a passing parity report.' },
      { id: 'C3.2', text: 'Can deploy a certified candidate to staging with the feature pin verified.' },
      { id: 'C3.3', text: 'Can execute a declared rollback inside the watch window.' },
      { id: 'C3.4', text: 'Can state, unprompted, why production labels are never training data.' },
    ],
    lines: [
      { role: 'TRAINEE', fields: ['NAME', 'SIGNATURE', 'DATE'] },
      { role: 'INSTRUCTOR', fields: ['NAME', 'SIGNATURE', 'DATE'] },
    ],
  },
];

export const SLIDE_COUNT = SLIDES.length;

/** 1-based slide number for a slug, or null. */
export function slideNumberForId(id: string): number | null {
  const index = SLIDES.findIndex((slide) => slide.id === id);
  return index === -1 ? null : index + 1;
}

export const CHECKPOINT_NUMBER = slideNumberForId('checkpoint') as number;

/** The revised step — the deliberate anomaly (the manual visibly learns). */
export const REVISED_STEP = (
  SLIDES.find((s): s is ProcedureSlide => s.kind === 'procedure' && s.id === 'proc-3-2') as ProcedureSlide
).steps.find((s) => s.revised) as ProcStep;
