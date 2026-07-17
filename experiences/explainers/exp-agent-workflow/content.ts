/**
 * "The Signal Box" — shipped content for `exp-agent-workflow`.
 *
 * A synthetic support-triage agent's decision workflow drawn as a railway
 * interlocking diagram. States, transitions, guards, and the run log are
 * invented.
 */

export type BlockKind = 'main' | 'siding' | 'terminal';

export interface TrackBlock {
  id: string;
  label: string;
  sub: string;
  kind: BlockKind;
  x: number;
  y: number;
}

export interface TrackRun {
  id: string;
  from: string;
  to: string;
  kind: 'main' | 'switch' | 'return';
}

export interface Lever {
  id: string;
  from: string;
  to: string;
  trigger: string;
  guard: string;
  onFail: string;
}

export interface RunHop {
  id: string;
  at: string;
  block: string;
  note: string;
  state: 'clear' | 'held' | 'diverted';
}

export const BOX = {
  masthead: 'SIGNAL BOX 7 · AGENT INTERLOCKING DIAGRAM',
  system: 'SUPPORT-TRIAGE AGENT · MERIDIAN SERVICE DESK',
  provenance: 'SYNTHETIC WORKFLOW · A DEMONSTRATION AGENT, NOT A LIVE SYSTEM',
  kicker: 'HOW THE AGENT MOVES',
  statement: 'Every route is interlocked. No signal, no movement.',
  subline:
    'The triage agent is genuinely stateful: seven track blocks, nine switched transitions, and a guard on every one. The diagram below is the real topology — a token cannot enter a block unless its lever’s guard proves clear, and every failed guard routes to a named siding, never to a mystery.',
  figures: [
    { label: 'TRACK BLOCKS', value: '7' },
    { label: 'LEVERS (TRANSITIONS)', value: '9' },
    { label: 'GUARDS', value: '9' },
    { label: 'SIDINGS', value: '2' },
  ],
} as const;

export const DIAGRAM = {
  title: 'The interlocking diagram',
  sub: 'The main line runs left to right · sidings hold what the line cannot',
  caption:
    'Interlocking diagram of the triage agent: the main line runs Intake, Classify, Retrieve, Draft, Verify, Respond to the Done terminal. A retry return runs from Verify back to Retrieve; the Escalate siding leaves Classify and Verify to the human desk; the Abort siding terminates unrecoverable runs.',
} as const;

export const BLOCKS: TrackBlock[] = [
  { id: 'intake', label: 'INTAKE', sub: 'ticket arrives', kind: 'main', x: 40, y: 200 },
  { id: 'classify', label: 'CLASSIFY', sub: 'intent + severity', kind: 'main', x: 200, y: 200 },
  { id: 'retrieve', label: 'RETRIEVE', sub: 'kb + account context', kind: 'main', x: 370, y: 200 },
  { id: 'draft', label: 'DRAFT', sub: 'compose response', kind: 'main', x: 540, y: 200 },
  { id: 'verify', label: 'VERIFY', sub: 'policy + fact checks', kind: 'main', x: 700, y: 200 },
  { id: 'respond', label: 'RESPOND', sub: 'send + annotate', kind: 'main', x: 860, y: 200 },
  { id: 'done', label: 'DONE', sub: 'terminal', kind: 'terminal', x: 990, y: 200 },
  { id: 'escalate', label: 'ESCALATE', sub: 'human desk siding', kind: 'siding', x: 450, y: 80 },
  { id: 'abort', label: 'ABORT', sub: 'unrecoverable siding', kind: 'siding', x: 450, y: 330 },
];

export const RUNS: TrackRun[] = [
  { id: 'r1', from: 'intake', to: 'classify', kind: 'main' },
  { id: 'r2', from: 'classify', to: 'retrieve', kind: 'main' },
  { id: 'r3', from: 'retrieve', to: 'draft', kind: 'main' },
  { id: 'r4', from: 'draft', to: 'verify', kind: 'main' },
  { id: 'r5', from: 'verify', to: 'respond', kind: 'main' },
  { id: 'r6', from: 'respond', to: 'done', kind: 'main' },
  { id: 'r7', from: 'classify', to: 'escalate', kind: 'switch' },
  { id: 'r8', from: 'verify', to: 'escalate', kind: 'switch' },
  { id: 'r9', from: 'verify', to: 'retrieve', kind: 'return' },
  { id: 'r10', from: 'classify', to: 'abort', kind: 'switch' },
];

export const LEVERS = {
  title: 'The lever frame',
  sub: 'One lever per transition · the guard must prove before the lever pulls',
  caption:
    'Lever frame — every transition with its trigger, its guard condition, and where a failed guard routes.',
  items: [
    { id: 'l1', from: 'INTAKE', to: 'CLASSIFY', trigger: 'Ticket queued', guard: 'Payload schema valid · PII scrubber ran', onFail: 'ABORT with reason payload-invalid' },
    { id: 'l2', from: 'CLASSIFY', to: 'RETRIEVE', trigger: 'Intent classified', guard: 'Confidence ≥ 0.75 AND severity < critical', onFail: 'ESCALATE to human desk' },
    { id: 'l3', from: 'CLASSIFY', to: 'ESCALATE', trigger: 'Severity critical or confidence low', guard: 'Always provable — the safe default', onFail: '—' },
    { id: 'l4', from: 'RETRIEVE', to: 'DRAFT', trigger: 'Context assembled', guard: '≥ 1 KB article above relevance floor', onFail: 'RETRY retrieve once, then ESCALATE' },
    { id: 'l5', from: 'DRAFT', to: 'VERIFY', trigger: 'Draft complete', guard: 'Draft cites only retrieved sources', onFail: 'Re-draft with citation constraint pinned' },
    { id: 'l6', from: 'VERIFY', to: 'RESPOND', trigger: 'All checks green', guard: 'Policy check AND fact check AND tone check', onFail: 'See levers 7 and 8' },
    { id: 'l7', from: 'VERIFY', to: 'RETRIEVE', trigger: 'Fact check failed', guard: 'Retry budget remaining (max 2)', onFail: 'ESCALATE with the failed claims attached' },
    { id: 'l8', from: 'VERIFY', to: 'ESCALATE', trigger: 'Policy check failed', guard: 'Always provable — policy failures never retry', onFail: '—' },
    { id: 'l9', from: 'RESPOND', to: 'DONE', trigger: 'Send acknowledged', guard: 'Ticket annotated with route history', onFail: 'Held in RESPOND; annotation retried' },
  ] as Lever[],
} as const;

export const RUN_LOG = {
  title: 'One run, signalled through',
  sub: 'Ticket MT-88412 · Tuesday 03:07 · every hop timed by the box',
  hops: [
    { id: 'h1', at: '03:07:02', block: 'INTAKE → CLASSIFY', note: 'Schema valid; PII scrubbed (2 fields).', state: 'clear' },
    { id: 'h2', at: '03:07:04', block: 'CLASSIFY → RETRIEVE', note: 'Intent billing-dispute at 0.91; severity normal.', state: 'clear' },
    { id: 'h3', at: '03:07:09', block: 'RETRIEVE → DRAFT', note: '3 KB articles above floor; account context joined.', state: 'clear' },
    { id: 'h4', at: '03:07:21', block: 'DRAFT → VERIFY', note: 'Draft cites 2 of 3 sources; citation guard proved.', state: 'clear' },
    { id: 'h5', at: '03:07:26', block: 'VERIFY → RETRIEVE', note: 'Fact check flagged a stale fee figure — retry 1 of 2.', state: 'diverted' },
    { id: 'h6', at: '03:07:31', block: 'RETRIEVE → DRAFT → VERIFY', note: 'Fresh fee table retrieved; re-draft clean; all checks green.', state: 'clear' },
    { id: 'h7', at: '03:07:34', block: 'RESPOND → DONE', note: 'Sent; route history annotated to the ticket.', state: 'clear' },
  ] as RunHop[],
} as const;

export const SIDINGS = {
  title: 'The sidings',
  sub: 'Where the line refuses to guess',
  items: [
    {
      id: 's1',
      name: 'ESCALATE',
      note: 'The human desk. Reached by low confidence, critical severity, exhausted retries, or any policy failure. The agent attaches its full route history — the human starts with everything the box saw, not a blank ticket.',
    },
    {
      id: 's2',
      name: 'ABORT',
      note: 'Unrecoverable runs: malformed payloads, scrubber failures. Nothing customer-facing ever leaves this siding; it pages the platform crew instead.',
    },
  ],
} as const;

export const FOOT = {
  note: 'The diagram is generated from the agent’s state-machine definition — the same file the runtime executes. If the drawing and the behaviour disagree, the build fails.',
  next: 'BOX INSPECTION · WEEKLY · FRIDAYS 10:00',
} as const;
