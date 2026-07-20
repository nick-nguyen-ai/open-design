import { FILL_SCHEMA, type GazetteDeckFill } from '../deck-dgm-gazette/dgm-gazette-fill.js';

/**
 * "/demo/harness-engineering" — open-design COMPOSE run (gazette tour).
 * Brief: a field guide to harness engineering — the discipline of building
 * everything around an AI coding agent except the model itself — sourced
 * from test-skills/harness-engineering-source-note.md.
 * Composed via compose_slide_deck → dgm-gazette; validated by validate_fill.
 */
export const harnessEngineeringFill: GazetteDeckFill = FILL_SCHEMA.parse({
  deck: {
    code: 'DGM-HE-01',
    world: 'THE GAZETTE',
    title: 'Everything Except the Model',
    standfirst:
      'A field guide to the discipline of building everything around an AI coding agent — tools, memory, sandboxes, verification, guardrails — so a raw model becomes a dependable agent. The claim: a good harness beats a good model.',
    notice: 'Sourced from cited harness-engineering writing',
  },
  flow: {
    heading: 'Verification is a loop, not a hope',
    caption:
      'Plan–Execute–Verify decomposes work into an explicit plan, executes against it, then checks the result against the plan and external criteria. A failed check returns to a fresh plan, not to shipping.',
    title: 'Plan, Execute, Verify',
    nodes: [
      { id: 'plan', label: 'Plan', kind: 'start' },
      { id: 'execute', label: 'Execute', kind: 'process' },
      { id: 'verify', label: 'Verify', kind: 'decision' },
      { id: 'ship', label: 'Ship', kind: 'end' },
    ],
    edges: [
      { from: 'plan', to: 'execute', label: 'decompose' },
      { from: 'execute', to: 'verify', label: 'check output' },
      { from: 'verify', to: 'ship', label: 'criteria met' },
    ],
  },
  sequence: {
    heading: 'One output, three different judges',
    caption:
      "An agent's output can be checked three ways — rules-based, visual, and LLM-as-judge — each reporting a verdict back to the agent that produced the work.",
    title: 'Three Feedback Types',
    actors: [
      { id: 'agent', label: 'Agent', kind: 'user' },
      { id: 'rules', label: 'Rules Engine', kind: 'service' },
      { id: 'browser', label: 'Headless Browser', kind: 'external' },
      { id: 'judge', label: 'Judge Subagent', kind: 'service' },
    ],
    messages: [
      { from: 'agent', to: 'rules', label: 'submit output' },
      { from: 'rules', to: 'agent', label: 'tests/linters/types pass?', reply: true },
      { from: 'agent', to: 'browser', label: 'render screenshot' },
      { from: 'browser', to: 'agent', label: 'visual diff', reply: true },
      { from: 'agent', to: 'judge', label: 'grade this output' },
      { from: 'judge', to: 'agent', label: 'verdict', reply: true },
    ],
  },
  layers: {
    heading: 'A production harness has five layers',
    caption:
      'Commonly described in about five layers, each doing different work — from choosing tools to watching what happened afterward.',
    title: 'The Five-Layer Harness',
    layers: [
      { id: 'orchestration', label: 'Tool Orchestration', detail: 'Curated tool interfaces' },
      { id: 'verification', label: 'Verification Loops', detail: 'Tests, checks, and judges' },
      { id: 'memory', label: 'Context / Memory', detail: 'What the model is fed and keeps' },
      { id: 'guardrails', label: 'Guardrails', detail: 'Gates, permissions, cost limits' },
      { id: 'observability', label: 'Observability', detail: 'Logs that make behaviour visible' },
    ],
    sideLabel: 'the loop',
  },
  zones: {
    heading: 'Not every tool call is trusted equally',
    caption:
      'Claude Code gates tool capabilities independently — staged trust, per-call permission checks, and explicit confirmation for the riskiest operations.',
    title: 'Staged Trust Zones',
    zones: [
      { id: 'zone-read', label: 'Read-Only', nodes: [{ id: 'read-file', label: 'Read' }] },
      { id: 'zone-write', label: 'Write', nodes: [{ id: 'write-file', label: 'Write' }] },
      { id: 'zone-highrisk', label: 'High-Risk', nodes: [{ id: 'force-push', label: 'Force-push' }] },
    ],
    links: [
      { from: 'read-file', to: 'write-file', label: 'escalate' },
      { from: 'write-file', to: 'force-push', label: 'escalate' },
    ],
  },
  cycle: {
    heading: 'A harness is a cybernetic control loop',
    caption:
      'Guides act before the model moves, shaping the odds of a good first attempt; sensors act after, observing results so the agent can self-correct.',
    title: 'Guides and Sensors',
    stages: [
      { id: 'guides', label: 'Guides', detail: 'Shape behaviour before action' },
      { id: 'action', label: 'Action', detail: 'The model attempts the task' },
      { id: 'sensors', label: 'Sensors', detail: 'Tests and judges observe results' },
      { id: 'correction', label: 'Correction', detail: 'The agent adjusts and retries' },
    ],
    hubLabel: 'the harness',
  },
  compare: {
    heading: "Two ways to check an agent's work",
    caption:
      'Verification runs in one of two modes — deterministic and fast, or AI-judged and richer — and most mature harnesses lean on both.',
    title: 'Computational vs. Inferential',
    columns: [
      { id: 'computational', label: 'Computational' },
      { id: 'inferential', label: 'Inferential' },
    ],
    rows: [
      { label: 'Speed', values: ['Fast', 'Slower'] },
      { label: 'Judgment', values: ['Deterministic', 'AI-based semantic judgment'] },
      { label: 'Examples', values: ['Tests, linters, type checkers', 'LLM-as-judge, subagent grading'] },
      { label: 'Richness', values: ['Narrow, pass/fail', 'Richer, nuanced'] },
    ],
    verdict: 'Most mature harnesses use both: rules for speed, judgment for nuance.',
  },
  cells: {
    heading: 'Four ideas worth naming on their own',
    caption:
      'A harness gap large enough to move one engineer from Top 30 to Top 5 on Terminal Bench 2.0 by changing only the harness — plus a hardening habit, a permission model, and a way to survive long tasks.',
    title: 'Key Patterns',
    columnsHint: 4,
    cells: [
      { id: 'harness-gap', label: 'Harness Gap', detail: 'Scores differ by harness', badge: 'GAP' },
      { id: 'ratchet', label: 'The Ratchet', detail: 'Mistakes become rules', badge: 'HABIT' },
      { id: 'gates', label: 'Permissions', detail: 'Constraints back compliance', badge: 'CONTROL' },
      { id: 'long-horizon', label: 'Long-Horizon', detail: 'Splits, memory, resets', badge: 'SCALE' },
    ],
  },
  timeline: {
    heading: 'Some harnesses are more solved than others',
    caption:
      'The discipline is uneven: code quality is mature, architecture fitness is emerging, and functional correctness is largely unsolved.',
    title: 'The Maturity Frontier',
    eras: [
      { id: 'maintainability', label: 'Quality', detail: 'Lint, types', marker: 'Mature' },
      { id: 'architecture-fitness', label: 'Arch. Fitness', detail: 'Structure stays sound', marker: 'Emerging' },
      { id: 'behavior', label: 'Behavior', detail: 'Functional correctness', marker: 'Unsolved' },
    ],
    nowIndex: 1,
  },
  close: {
    takeaways: [
      'Harness engineering is everything around the model — not prompting, not training.',
      'The harness gap is real: capability is mostly a property of scaffolding, not weights.',
      'Guides act before, sensors act after — together they form a control loop.',
      'The Ratchet Principle turns every mistake into a permanent rule.',
      'Maintainability is mature; architecture-fitness is emerging; behavior correctness is unsolved.',
    ],
    signoff:
      "The goal isn't to remove the human from the loop — it's to aim a good harness so human judgment lands exactly where it matters most: the parts still unsolved.",
  },
});
