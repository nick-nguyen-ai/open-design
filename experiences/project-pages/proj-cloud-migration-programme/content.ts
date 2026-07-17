/**
 * "The Slipway" — synthetic content for `proj-cloud-migration-programme`.
 * The migration as a shipyard board: workloads are vessels moving dry dock →
 * slipway → open water; dependencies are mooring ropes that must be slipped
 * before a vessel may launch. Fictional bank: Meridian. All content synthetic.
 */

export const YARD = {
  masthead: 'MERIDIAN BANK · CLOUD YARD AUTHORITY',
  ref: 'YARD BOARD CM-4 · PASSAGE TO CLOUD · AS AT 14 JUL 2026',
  kicker: 'DRY DOCK → SLIPWAY → OPEN WATER',
  title: 'No vessel launches with a rope still made fast.',
  subline:
    'Nine workloads are crossing from the on-premise yard to open water. Each vessel sits in one of three zones — dry dock (being prepared), slipway (in motion), open water (migrated and cut over). Mooring ropes are dependencies: a vessel may enter the slipway only when every rope runs to a vessel already in open water.',
  figures: [
    { label: 'VESSELS', value: '9' },
    { label: 'OPEN WATER', value: '3' },
    { label: 'ON THE SLIPWAY', value: '2' },
    { label: 'IN DRY DOCK', value: '4' },
  ],
  provenance: 'SYNTHETIC YARD BOARD · A DEMONSTRATION MIGRATION, NOT A LIVE PROGRAMME',
} as const;

export type Zone = 'dry-dock' | 'slipway' | 'open-water';
export type RiskClass = 'routine' | 'watch' | 'heavy-lift';

export interface Vessel {
  id: string;
  name: string;
  hull: string;
  zone: Zone;
  tonnage: string;
  window: string;
  risk: RiskClass;
  moorings: readonly string[];
  note: string;
}

export const VESSELS: readonly Vessel[] = [
  {
    id: 'v-ledger',
    name: 'Customer Ledger',
    hull: 'HULL 01',
    zone: 'open-water',
    tonnage: '38 TB',
    window: 'CROSSED FEB 2026',
    risk: 'routine',
    moorings: [],
    note: 'First across. Two statement cycles in open water without a reconciliation break.',
  },
  {
    id: 'v-docs',
    name: 'Document Store',
    hull: 'HULL 02',
    zone: 'open-water',
    tonnage: '112 TB',
    window: 'CROSSED MAR 2026',
    risk: 'routine',
    moorings: [],
    note: 'Bulk archive moved by freighter (offline transfer); deltas synced live.',
  },
  {
    id: 'v-channels',
    name: 'Channels API',
    hull: 'HULL 03',
    zone: 'open-water',
    tonnage: '4 TB',
    window: 'CROSSED MAY 2026',
    risk: 'routine',
    moorings: ['v-ledger'],
    note: 'Launched once the ledger rope was slipped. Latency improved 22% in open water.',
  },
  {
    id: 'v-payments',
    name: 'Payments Core',
    hull: 'HULL 04',
    zone: 'slipway',
    tonnage: '26 TB',
    window: 'LAUNCH WINDOW 20–22 SEP 2026',
    risk: 'heavy-lift',
    moorings: ['v-ledger', 'v-channels'],
    note: 'The heaviest hull in the yard. Dual-write rehearsal holds; drain gate tested weekly.',
  },
  {
    id: 'v-fraud',
    name: 'Fraud Screening',
    hull: 'HULL 05',
    zone: 'slipway',
    tonnage: '9 TB',
    window: 'LAUNCH WINDOW 4–5 OCT 2026',
    risk: 'watch',
    moorings: ['v-channels'],
    note: 'Model latency budget is the watch item: 40ms in open water vs 31ms in the yard.',
  },
  {
    id: 'v-risk',
    name: 'Risk Engine',
    hull: 'HULL 06',
    zone: 'dry-dock',
    tonnage: '17 TB',
    window: 'DOCK EXIT NOV 2026',
    risk: 'watch',
    moorings: ['v-payments', 'v-warehouse'],
    note: 'Two ropes still fast — cannot enter the slipway until Payments Core and the Warehouse cross.',
  },
  {
    id: 'v-warehouse',
    name: 'Data Warehouse',
    hull: 'HULL 07',
    zone: 'dry-dock',
    tonnage: '210 TB',
    window: 'DOCK EXIT DEC 2026',
    risk: 'heavy-lift',
    moorings: ['v-docs'],
    note: 'Largest tonnage in the yard. Hull being re-plated: schema modernised before it moves, not after.',
  },
  {
    id: 'v-statements',
    name: 'Statements',
    hull: 'HULL 08',
    zone: 'dry-dock',
    tonnage: '31 TB',
    window: 'DOCK EXIT JAN 2027',
    risk: 'routine',
    moorings: ['v-ledger', 'v-docs'],
    note: 'Both ropes already run to open water — holds dock only for the print-vendor contract window.',
  },
  {
    id: 'v-batch',
    name: 'Batch Scheduler',
    hull: 'HULL 09',
    zone: 'dry-dock',
    tonnage: '2 TB',
    window: 'DOCK EXIT FEB 2027 · LAST OUT',
    risk: 'watch',
    moorings: ['v-payments', 'v-risk', 'v-statements'],
    note: 'Deliberately last: the scheduler that orchestrates the yard leaves only when the yard is empty.',
  },
] as const;

export const ZONE_LABEL: Record<Zone, string> = {
  'dry-dock': 'DRY DOCK',
  slipway: 'SLIPWAY',
  'open-water': 'OPEN WATER',
};

export const RISK_LABEL: Record<RiskClass, string> = {
  routine: 'ROUTINE PASSAGE',
  watch: 'ON WATCH',
  'heavy-lift': 'HEAVY LIFT',
};

export const BOARD = {
  title: 'The yard board',
  sub: 'Nine hulls, three zones — ropes are dependencies, read right to left',
  caption:
    'Shipyard board showing nine workload vessels across dry dock, slipway, and open water zones, with mooring ropes drawn between dependent vessels.',
  legend: {
    rope: 'MOORING ROPE · A DEPENDENCY STILL MADE FAST',
    slipped: 'SLIPPED ROPE · DEPENDENCY IN OPEN WATER',
  },
} as const;

export const RIGGING = {
  title: 'The rigging rules',
  sub: 'How a vessel earns its launch window',
  rules: [
    {
      id: 'rr-1',
      rule: 'A vessel enters the slipway only when every mooring rope runs to open water.',
      note: 'Dependencies migrate first or the vessel waits. No exceptions have been granted; two have been requested.',
    },
    {
      id: 'rr-2',
      rule: 'Every hull carries a drain gate — a rehearsed route back to dry dock.',
      note: 'Rollback is rehearsed while it is not needed. A drain gate that has never been opened is scenery.',
    },
    {
      id: 'rr-3',
      rule: 'Heavy-lift hulls cross alone.',
      note: 'No other launch is scheduled within a week of a heavy-lift window; the yard watches one crossing at a time.',
    },
    {
      id: 'rr-4',
      rule: 'Open water is a state, not a ceremony.',
      note: 'A vessel is in open water when the old berth is decommissioned — not when the migration party is held.',
    },
  ],
} as const;

export const HARBOUR_LOG = {
  title: 'The harbour log',
  sub: 'Recent movements, latest first',
  entries: [
    {
      id: 'hl-1',
      date: '11 JUL 2026',
      entry: 'Payments Core completed its third dual-write rehearsal; drain gate opened and closed in 41 minutes.',
      kind: 'rehearsal',
    },
    {
      id: 'hl-2',
      date: '28 JUN 2026',
      entry: 'Warehouse re-plating passed schema review; tonnage estimate revised from 195 TB to 210 TB.',
      kind: 'survey',
    },
    {
      id: 'hl-3',
      date: '19 JUN 2026',
      entry: 'Fraud Screening latency budget breached in trial — watch flag raised, tuning sprint scheduled.',
      kind: 'watch-flag',
    },
    {
      id: 'hl-4',
      date: '31 MAY 2026',
      entry: 'Channels API old berth decommissioned. Vessel formally logged in open water.',
      kind: 'crossing',
    },
  ],
} as const;

export const FOOT = {
  note: 'The Slipway — a cloud migration as a shipyard board: vessels, zones, and mooring ropes that must be slipped before launch. All workloads and figures are synthetic.',
  next: 'NEXT LAUNCH · PAYMENTS CORE · WINDOW OPENS 20 SEP 2026',
} as const;
