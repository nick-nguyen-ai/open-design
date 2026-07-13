/**
 * Content pack for the MCP demo deck: "How LangChain Deep Agents Work".
 *
 * NOT a catalogue template — no *.experience.manifest.ts, not counted in the
 * registry. It exists to show what an MCP `compose_design` blueprint looks
 * like once a designer renders it at full craft: the blueprint composed for
 * this brief (surface slide-deck · audience technical · theme dark) selected
 * the `kinetic-intelligence` grammar and the component roles used below
 * (comp.status-list for summary/evidence, comp.flow-diagram as the primary
 * visual); this deck renders that plan inside one art-directed world.
 *
 * THE WORLD — "The Window": the deck's thesis is that a deep agent is a
 * smaller context held on purpose, so the commanding visual is the
 * orchestrator's context window itself — a luminous column that persists
 * across every slide, flooding red on the problem slide (the one anomaly)
 * and standing narrow and calm everywhere else.
 *
 * Content is factual in architecture; token figures in the trace are
 * illustrative (declared in DECK.dataNotice).
 */
import type { FlowDiagramData } from '@enterprise-design/diagrams';
import type { StatusListItemDatum } from '@enterprise-design/content-components';

export const DECK = {
  code: 'MCP-DEMO-01',
  title: 'How LangChain Deep Agents Work',
  world: 'THE WINDOW',
  provenance: 'COMPOSED BY COMPOSE_DESIGN · KINETIC-INTELLIGENCE · ENTERPRISE-NEUTRAL-DARK',
  dataNotice: 'ARCHITECTURE ACCURATE · TOKEN FIGURES ILLUSTRATIVE',
  keyboardHint: '← → NAVIGATE · HOME/END',
  capK: 200,
} as const;

export interface Pillar {
  id: string;
  index: string;
  name: string;
  tag: string;
  description: string;
  /** What this mechanism keeps OUT of the orchestrator's window. */
  held: string;
}

export const PILLARS: readonly Pillar[] = [
  {
    id: 'planning',
    index: '01',
    name: 'Planning tool',
    tag: 'write_todos',
    description:
      'The plan lives outside the window as an explicit, editable todo list — not implied by scrollback the model must re-derive on every turn.',
    held: 'PLAN HELD AT 0.3K · NEVER RE-DERIVED',
  },
  {
    id: 'subagents',
    index: '02',
    name: 'Sub-agents',
    tag: 'task()',
    description:
      'A dedicated tool spawns a sub-agent with its own clean context for one focused job, and returns only its summary — the parent never sees the intermediate noise.',
    held: '38K OF SCRATCH · NEVER ENTERS',
  },
  {
    id: 'filesystem',
    index: '03',
    name: 'Virtual filesystem',
    tag: 'write_file / read_file / ls',
    description:
      'Large intermediate artefacts — research notes, drafts, logs — persist to a virtual file store backed by agent state, not the conversation.',
    held: 'FINDINGS.MD 6.2K STORED · 0.2K CITED',
  },
  {
    id: 'prompt',
    index: '04',
    name: 'Detailed system prompt',
    tag: 'system message',
    description:
      'A long, structured prompt — in the lineage of Claude Code’s own — tells the agent when to plan, when to delegate, and when to write instead of remember.',
    held: 'THE DISCIPLINE THAT KEEPS IT AT 6%',
  },
] as const;

export const PROBLEM_ITEMS: readonly StatusListItemDatum[] = [
  {
    id: 'p1',
    label: 'Context fills with intermediate tool output',
    status: 'danger',
    description: 'Every search result and file read stays in scrollback forever.',
  },
  {
    id: 'p2',
    label: 'Sub-goals get lost after a few dozen turns',
    status: 'warning',
    description: 'The plan was never written down anywhere the model has to re-check.',
  },
  {
    id: 'p3',
    label: 'One bad tool call pollutes the whole conversation',
    status: 'danger',
    description: 'No boundary lets the agent discard a failed exploration.',
  },
  {
    id: 'p4',
    label: 'Planning and doing share one undifferentiated loop',
    status: 'warning',
    description: 'Nothing forces the model to decide before it acts.',
  },
];

export const ARCHITECTURE: FlowDiagramData = {
  nodes: [
    { id: 'request', label: 'User request', kind: 'start' },
    { id: 'plan', label: 'Planning tool', kind: 'process' },
    { id: 'orchestrator', label: 'Orchestrator', kind: 'process' },
    { id: 'sub-research', label: 'Research agent', kind: 'process' },
    { id: 'sub-code', label: 'Writer agent', kind: 'process' },
    { id: 'fs', label: 'Virtual FS', kind: 'data' },
    { id: 'answer', label: 'Final answer', kind: 'end' },
  ],
  edges: [
    { id: 'e1', from: 'request', to: 'plan' },
    { id: 'e2', from: 'plan', to: 'orchestrator' },
    { id: 'e3', from: 'orchestrator', to: 'sub-research', label: 'task()' },
    { id: 'e4', from: 'orchestrator', to: 'sub-code', label: 'task()' },
    { id: 'e5', from: 'sub-research', to: 'fs', label: 'write_file' },
    { id: 'e6', from: 'sub-code', to: 'fs', label: 'write_file' },
    { id: 'e7', from: 'fs', to: 'answer', label: 'read_file' },
  ],
};

export const TRACE_ITEMS: readonly StatusListItemDatum[] = [
  {
    id: 't1',
    label: 'write_todos([research, draft, fact-check])',
    status: 'info',
    description: 'The plan is now a persistent, editable object — not a memory. Window 11.2K.',
  },
  {
    id: 't2',
    label: 'task(subagent="research-agent", …)',
    status: 'info',
    description: 'Orchestrator delegates; its own context stays short. Window 11.6K.',
  },
  {
    id: 't3',
    label: 'research-agent runs 14 tool calls in its own clean context',
    status: 'success',
    description: '38K of scratch work — none of it ever reaches the orchestrator. Window 11.6K.',
  },
  {
    id: 't4',
    label: 'write_file("findings.md", …) → two-line summary returned',
    status: 'success',
    description: 'The result persists to the virtual filesystem, not the conversation. Window 11.8K.',
  },
  {
    id: 't5',
    label: 'Orchestrator reads findings.md · todo 1/3 complete',
    status: 'info',
    description: 'The plan and the filesystem are the source of truth. Window 12.1K.',
  },
  {
    id: 't6',
    label: 'task(subagent="writer-agent", …)',
    status: 'info',
    description: 'Second delegation, same discipline. Window 12.4K.',
  },
  {
    id: 't7',
    label: 'Final answer synthesised from files + completed todos',
    status: 'success',
    description: 'Window 12.9K — after the entire run.',
  },
];

/** The window ledger — the money figure on the trace slide. */
export interface LedgerStep {
  id: string;
  /** Orchestrator window level after this step, in K tokens. */
  k: number;
}

export const LEDGER: readonly LedgerStep[] = [
  { id: 'T1', k: 11.2 },
  { id: 'T2', k: 11.6 },
  { id: 'T3', k: 11.6 },
  { id: 'T4', k: 11.8 },
  { id: 'T5', k: 12.1 },
  { id: 'T6', k: 12.4 },
  { id: 'T7', k: 12.9 },
] as const;

/** The discarded sub-agent spike: which step index, and how tall. */
export const LEDGER_DISCARD = { atStep: 2, k: 38.4, label: '38K · DISCARDED' } as const;
export const LEDGER_DELTA_K = 1.7;

export const CLOSING = {
  statement: 'A deep agent is not a bigger model. It is a smaller context, held on purpose.',
  guidance:
    'Reach for this pattern when a task is long-horizon, decomposes into independent sub-tasks, and produces artefacts too large to keep in the conversation — research, multi-file coding, multi-step operational runbooks.',
} as const;

export type SlideKind = 'cover' | 'problem' | 'pillars' | 'architecture' | 'trace' | 'closing';

/** Geometry + load of the luminous window column, per slide (viewport %). */
export interface WindowState {
  left: number;
  width: number;
  /** Percent of the 200K cap in use. */
  load: number;
  tone: 'calm' | 'danger';
}

export interface Slide {
  id: string;
  kind: SlideKind;
  section: string;
  kicker: string;
  /** Blueprint provenance: which composed role this slide renders. */
  role: string;
  window: WindowState;
}

export const SLIDES: readonly Slide[] = [
  {
    id: 'cover',
    kind: 'cover',
    section: 'Cover',
    kicker: 'HOW LANGCHAIN DEEP AGENTS WORK',
    role: 'GRAMMAR · KINETIC-INTELLIGENCE',
    window: { left: 71, width: 16, load: 6, tone: 'calm' },
  },
  {
    id: 'problem',
    kind: 'problem',
    section: 'The problem',
    kicker: '01 · THE PROBLEM',
    role: 'ROLE SUMMARY · COMP.STATUS-LIST',
    window: { left: 52, width: 41, load: 97, tone: 'danger' },
  },
  {
    id: 'pillars',
    kind: 'pillars',
    section: 'The four pillars',
    kicker: '02 · THE FOUR PILLARS',
    role: 'ROLE STRUCTURE · TOKEN CARDS',
    window: { left: 3.5, width: 5.5, load: 9, tone: 'calm' },
  },
  {
    id: 'architecture',
    kind: 'architecture',
    section: 'Architecture',
    kicker: '03 · ARCHITECTURE',
    role: 'ROLE PRIMARY-VISUAL · COMP.FLOW-DIAGRAM',
    window: { left: 3.5, width: 5.5, load: 11, tone: 'calm' },
  },
  {
    id: 'trace',
    kind: 'trace',
    section: 'A run, traced',
    kicker: '04 · A RUN, TRACED',
    role: 'ROLE EVIDENCE · COMP.STATUS-LIST',
    window: { left: 3.5, width: 5.5, load: 12, tone: 'calm' },
  },
  {
    id: 'closing',
    kind: 'closing',
    section: 'Closing',
    kicker: '05 · CLOSING',
    role: 'ROLE CLOSING · KINETIC-INTELLIGENCE',
    window: { left: 47, width: 9, load: 6, tone: 'calm' },
  },
];

export const SLIDE_COUNT = SLIDES.length;
