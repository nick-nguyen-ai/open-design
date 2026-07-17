/**
 * "The Town Plan" — synthetic content for `proj-data-modernisation-programme`.
 * The target data estate as an urban masterplan: domains are districts,
 * sequencing is construction phasing, progress is district-by-district
 * occupancy. The legacy estate is the river the new town is built away from.
 * Fictional bank: Meridian. All content synthetic.
 */

export const PLAN = {
  masthead: 'MERIDIAN BANK · TOWN PLANNING OFFICE',
  ref: 'MASTERPLAN DM-2 · THE DATA QUARTER · REVISED 14 JUL 2026',
  kicker: 'THE TARGET ESTATE, DRAWN AS A TOWN',
  title: 'Eight districts. Three phases. One river we are moving away from.',
  subline:
    'Meridian’s data modernisation, drawn as a masterplan. Each business domain is a district; a district is occupied when its data products are certified and its consumers have moved in. The legacy warehouse is the river: the town still draws from it over two bridges, and the plan retires a bridge each phase.',
  figures: [
    { label: 'DISTRICTS', value: '8' },
    { label: 'OCCUPIED', value: '3' },
    { label: 'UNDER CONSTRUCTION', value: '3' },
    { label: 'ZONED', value: '2' },
  ],
  provenance: 'SYNTHETIC MASTERPLAN · A DEMONSTRATION ESTATE, NOT A LIVE MIGRATION',
} as const;

export type DistrictStatus = 'occupied' | 'under-construction' | 'zoned';

export interface District {
  id: string;
  name: string;
  status: DistrictStatus;
  phase: 'I' | 'II' | 'III';
  certified: number;
  planned: number;
}

export const DISTRICTS: readonly District[] = [
  { id: 'd-customer', name: 'Customer', status: 'occupied', phase: 'I', certified: 12, planned: 12 },
  { id: 'd-payments', name: 'Payments', status: 'occupied', phase: 'I', certified: 9, planned: 9 },
  { id: 'd-finance', name: 'Finance', status: 'occupied', phase: 'I', certified: 11, planned: 11 },
  { id: 'd-risk', name: 'Risk', status: 'under-construction', phase: 'II', certified: 6, planned: 10 },
  { id: 'd-product', name: 'Product', status: 'under-construction', phase: 'II', certified: 4, planned: 9 },
  { id: 'd-operations', name: 'Operations', status: 'under-construction', phase: 'II', certified: 3, planned: 8 },
  { id: 'd-markets', name: 'Markets', status: 'zoned', phase: 'III', certified: 0, planned: 7 },
  { id: 'd-colleague', name: 'Colleague', status: 'zoned', phase: 'III', certified: 0, planned: 5 },
] as const;

export const STATUS_LABEL: Record<DistrictStatus, string> = {
  occupied: 'OCCUPIED',
  'under-construction': 'UNDER CONSTRUCTION',
  zoned: 'ZONED',
};

export const DRAWING = {
  title: 'The masterplan',
  sub: 'Districts, streets, the river, and the two remaining bridges',
  caption:
    'Urban masterplan of the data estate: eight domain districts in three rows, the legacy river along the west edge, and two bridges still carrying feeds from the legacy warehouse.',
  legend: {
    occupied: 'OCCUPIED · PRODUCTS CERTIFIED, CONSUMERS MOVED IN',
    construction: 'UNDER CONSTRUCTION · PHASE II',
    zoned: 'ZONED · PHASE III',
    bridge: 'BRIDGE · A LEGACY FEED STILL IN USE',
  },
} as const;

export const PHASES = {
  title: 'Construction phasing',
  sub: 'The order of the build, and what each phase retires',
  entries: [
    {
      id: 'ph-1',
      numeral: 'I',
      name: 'The riverfront',
      window: 'COMPLETE · 2025',
      districts: 'Customer · Payments · Finance',
      retires: 'Retired the nightly extract barges: 34 file feeds replaced by published data products.',
      state: 'complete',
    },
    {
      id: 'ph-2',
      numeral: 'II',
      name: 'The midtown',
      window: 'IN BUILD · OPENS Q4 2026',
      districts: 'Risk · Product · Operations',
      retires: 'Retires Bridge 2: finance marts stop drawing from the legacy warehouse when Risk certifies.',
      state: 'building',
    },
    {
      id: 'ph-3',
      numeral: 'III',
      name: 'The heights',
      window: 'ZONED · 2027',
      districts: 'Markets · Colleague',
      retires: 'Retires Bridge 1 and the river itself: the legacy warehouse is decommissioned at phase end.',
      state: 'zoned',
    },
  ],
} as const;

export const OCCUPANCY = {
  title: 'The occupancy ledger',
  sub: 'Certified data products per district — occupancy is certification, not migration of tables',
} as const;

export const COVENANTS = {
  title: 'Planning covenants',
  sub: 'The rules every district is built under',
  rules: [
    {
      id: 'cv-1',
      rule: 'A district is occupied only when its data products are certified and its consumers have moved in.',
      note: 'Copying tables to the cloud is groundworks, not occupancy. Certification is the certificate of habitation.',
    },
    {
      id: 'cv-2',
      rule: 'No through-traffic: consumers travel on published roads.',
      note: 'Every cross-district read goes through a published data product API. Private footpaths between districts are bricked up when found.',
    },
    {
      id: 'cv-3',
      rule: 'Each phase must retire a bridge.',
      note: 'New construction that leaves every legacy feed standing is sprawl, not modernisation. The phase plan names the bridge it removes.',
    },
    {
      id: 'cv-4',
      rule: 'The river is drawn on every revision of the plan until it is gone.',
      note: 'Pretending the legacy warehouse is already retired is how towns flood. It stays on the map while a single feed still crosses it.',
    },
  ],
} as const;

export const FOOT = {
  note: 'The Town Plan — a data modernisation drawn as an urban masterplan: districts, phasing, occupancy, and the legacy river being retired bridge by bridge. All content synthetic.',
  next: 'NEXT ON THE PLAN · RISK DISTRICT CERTIFICATION · Q4 2026 · BRIDGE 2 COMES DOWN',
} as const;
