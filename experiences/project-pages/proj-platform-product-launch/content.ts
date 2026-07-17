/**
 * "The Marquee" — synthetic content for `proj-platform-product-launch`.
 * A platform launch as opening night: the launch statement in marquee-scale
 * type under warm bulb glow; behind the curtain, the three-act programme,
 * the workstream call sheet, and the house readiness checklist.
 * Fictional bank: Meridian. All content synthetic.
 */

export const SHOW = {
  masthead: 'MERIDIAN BANK · HOUSE MANAGEMENT',
  ref: 'OPENING NIGHT · 2 OCT 2026 · THE GRAND',
  marqueeTop: 'MERIDIAN BANK PROUDLY PRESENTS',
  marqueeName: 'MERIDIAN ONE',
  marqueeSub: 'THE UNIFIED BUSINESS BANKING PLATFORM · A PLATFORM IN THREE ACTS',
  statement:
    'Nine product lines, four login screens, and three support numbers become one platform with one front door. The house opens 2 October. Everything below the marquee is what it takes to be ready when the lights come up.',
  figures: [
    { label: 'DAYS TO CURTAIN', value: '79' },
    { label: 'PREVIEWS PLAYED', value: '3' },
    { label: 'HOUSE READINESS', value: '87%' },
    { label: 'PILOT TENANTS SEATED', value: '12' },
  ],
  provenance: 'SYNTHETIC SHOWBILL · A DEMONSTRATION LAUNCH, NOT A LIVE PRODUCT',
} as const;

export const ACTS = {
  title: 'The programme',
  sub: 'A launch in three acts — no act opens until the one before has played',
  entries: [
    {
      id: 'act-1',
      numeral: 'ACT I',
      name: 'Private previews',
      window: 'PLAYED · MAY–JUN 2026',
      body: 'Twelve pilot tenants in the house, every seat instrumented. Three previews played; forty-one defects found where defects are cheap — in front of a friendly audience.',
      state: 'played',
    },
    {
      id: 'act-2',
      numeral: 'ACT II',
      name: 'The limited season',
      window: 'NOW PLAYING · JUL–SEP 2026',
      body: 'Five hundred invited businesses by the front door, legacy doors still open behind them. The box office watches adoption nightly; nobody is forced through the new entrance yet.',
      state: 'playing',
    },
    {
      id: 'act-3',
      numeral: 'ACT III',
      name: 'The general run',
      window: 'OPENS 2 OCT 2026',
      body: 'The marquee lights, the full house, the old doors close on a published schedule — six months of notice, no surprise closings. The run is judged on retention, not on opening-night applause.',
      state: 'billed',
    },
  ],
} as const;

export interface CrewLine {
  id: string;
  workstream: string;
  lead: string;
  call: string;
  status: 'ready' | 'rehearsing' | 'attention';
  note: string;
}

export const CALL_SHEET = {
  title: 'The call sheet',
  sub: 'Every workstream, its lead, and its call — the time it must be in place',
  lines: [
    {
      id: 'cs-1',
      workstream: 'Platform engineering',
      lead: 'R. Okonkwo',
      call: 'READY NOW · HOLDS',
      status: 'ready',
      note: 'Load rehearsed at 3× opening-night traffic; failover played twice without a dropped session.',
    },
    {
      id: 'cs-2',
      workstream: 'Migration & onboarding',
      lead: 'S. Varga',
      call: 'CALL 1 SEP',
      status: 'ready',
      note: 'Bulk migration tooling signed off; the first five hundred move in Act II as the dress rehearsal.',
    },
    {
      id: 'cs-3',
      workstream: 'Servicing & operations',
      lead: 'D. Mensah',
      call: 'CALL 8 SEP',
      status: 'rehearsing',
      note: 'New servicing flows in rehearsal with 60 agents; certification completes 5 Sep.',
    },
    {
      id: 'cs-4',
      workstream: 'Risk & compliance sign-off',
      lead: 'A. Lindqvist',
      call: 'CALL 12 SEP',
      status: 'ready',
      note: 'Conduct review closed. Final attestation is diarised the week after servicing certifies.',
    },
    {
      id: 'cs-5',
      workstream: 'Pricing & commercial',
      lead: 'J. Barrow',
      call: 'CALL 15 SEP',
      status: 'attention',
      note: 'Legacy price-plan mapping has 214 edge cases unresolved. Extra hands assigned; recovery reviewed weekly at the production meeting.',
    },
    {
      id: 'cs-6',
      workstream: 'Communications & front of house',
      lead: 'P. Whelan',
      call: 'CALL 22 SEP',
      status: 'rehearsing',
      note: 'Customer letters drafted and legal-checked; the six-month door-closing schedule publishes with Act III.',
    },
  ] as const satisfies readonly CrewLine[],
} as const;

export const HOUSE = {
  title: 'The house checklist',
  sub: 'What must be true before the doors open — lamps lit as items land',
  items: [
    { id: 'h-1', item: 'Load rehearsal at 3× expected opening traffic', done: true },
    { id: 'h-2', item: 'Failover played end to end, twice, unannounced', done: true },
    { id: 'h-3', item: 'Pilot-tenant satisfaction holds above 8/10 across previews', done: true },
    { id: 'h-4', item: 'Support model staffed for opening-week volume', done: true },
    { id: 'h-5', item: 'Rollback to legacy doors rehearsed and timed under one hour', done: true },
    { id: 'h-6', item: 'Regulatory attestation signed', done: false },
    { id: 'h-7', item: 'Pricing edge cases cleared or consciously deferred with owner', done: false },
    { id: 'h-8', item: 'Door-closing schedule for legacy platforms published', done: true },
  ],
} as const;

export const NOTICES = {
  title: 'House notices',
  sub: 'Posted at the stage door, latest first',
  entries: [
    {
      id: 'n-1',
      date: '10 JUL 2026',
      entry: 'Third preview played to all twelve pilot tenants; zero severity-one defects for the first time.',
    },
    {
      id: 'n-2',
      date: '30 JUN 2026',
      entry: 'Act II invitations sent to five hundred businesses; first hundred seated within a week.',
    },
    {
      id: 'n-3',
      date: '18 JUN 2026',
      entry: 'Pricing edge-case count published honestly at 214. Attention flag raised on the call sheet — the marquee does not light over an unresolved bill.',
    },
  ],
} as const;

export const FOOT = {
  note: 'The Marquee — a platform launch with the typographic weight of a product moment: the bill above, the call sheet and house checklist below. All names and figures are synthetic.',
  next: 'CURTAIN · 2 OCT 2026 · JUDGED ON RETENTION, NOT APPLAUSE',
} as const;
