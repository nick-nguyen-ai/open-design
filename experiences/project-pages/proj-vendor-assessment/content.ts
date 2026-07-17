/**
 * "The Weighing Room" — synthetic content for `proj-vendor-assessment`.
 * A vendor decision as a weighing room: risk, commercial, and technical
 * lenses laid over the same four vendors as acetate sheets. No single lens
 * may dominate — the balance is the interface. Fictional bank: Meridian;
 * all vendors fictional. All content synthetic.
 */

export const ROOM = {
  masthead: 'MERIDIAN BANK · PROCUREMENT WEIGHING ROOM',
  ref: 'ASSESSMENT VA-18 · CORE DOCUMENT PLATFORM · DECISION DUE SEP 2026',
  kicker: 'THREE LENSES, FOUR VENDORS, ONE BALANCE',
  title: 'No single lens gets to decide.',
  subline:
    'Four vendors are on the scales for Meridian’s document platform. Risk, commercial, and technical teams each assessed the same vendors independently — three acetate sheets over one table. Lay them one at a time or all at once; the weighing room exists so that the loudest lens in the building is not mistaken for the heaviest.',
  figures: [
    { label: 'VENDORS WEIGHED', value: '4' },
    { label: 'LENSES', value: '3' },
    { label: 'CRITERIA', value: '12' },
    { label: 'DECISION DUE', value: 'SEP 2026' },
  ],
  provenance: 'SYNTHETIC ASSESSMENT · DEMONSTRATION VENDORS, NOT A LIVE PROCUREMENT',
} as const;

export type LensId = 'risk' | 'commercial' | 'technical';

export const LENSES: readonly { id: LensId; name: string; owner: string }[] = [
  { id: 'risk', name: 'Risk lens', owner: 'Third-party risk' },
  { id: 'commercial', name: 'Commercial lens', owner: 'Procurement' },
  { id: 'technical', name: 'Technical lens', owner: 'Architecture' },
];

export const VENDORS: readonly { id: string; name: string; line: string }[] = [
  { id: 'v-northgate', name: 'Northgate Systems', line: 'The incumbent’s bigger sibling' },
  { id: 'v-casca', name: 'Casca', line: 'The modern challenger' },
  { id: 'v-verandt', name: 'Verandt', line: 'The regulated-industry specialist' },
  { id: 'v-ostrom', name: 'Ostrom Cloud', line: 'The hyperscaler bundle' },
];

export type Reading = 'strong' | 'adequate' | 'weak';

export interface Criterion {
  id: string;
  lens: LensId;
  name: string;
  readings: Record<string, Reading>;
  note: string;
}

export const CRITERIA: readonly Criterion[] = [
  {
    id: 'cr-1',
    lens: 'risk',
    name: 'Exit & data portability',
    readings: { 'v-northgate': 'adequate', 'v-casca': 'strong', 'v-verandt': 'strong', 'v-ostrom': 'weak' },
    note: 'Ostrom’s export tooling is proprietary; a rehearsed exit took 11 weeks in reference checks.',
  },
  {
    id: 'cr-2',
    lens: 'risk',
    name: 'Resilience & incident history',
    readings: { 'v-northgate': 'strong', 'v-casca': 'adequate', 'v-verandt': 'strong', 'v-ostrom': 'strong' },
    note: 'Casca has one regional outage in 24 months; the other three are clean over the same window.',
  },
  {
    id: 'cr-3',
    lens: 'risk',
    name: 'Regulatory posture & audit rights',
    readings: { 'v-northgate': 'strong', 'v-casca': 'adequate', 'v-verandt': 'strong', 'v-ostrom': 'adequate' },
    note: 'Verandt grants full on-site audit rights as standard; Casca and Ostrom negotiate them per contract.',
  },
  {
    id: 'cr-4',
    lens: 'risk',
    name: 'Subcontractor chain transparency',
    readings: { 'v-northgate': 'adequate', 'v-casca': 'strong', 'v-verandt': 'strong', 'v-ostrom': 'weak' },
    note: 'Ostrom’s fourth-party chain runs three levels deep before the storage layer is named.',
  },
  {
    id: 'cr-5',
    lens: 'commercial',
    name: 'Five-year total cost',
    readings: { 'v-northgate': 'weak', 'v-casca': 'strong', 'v-verandt': 'adequate', 'v-ostrom': 'strong' },
    note: 'Northgate is 1.8× the median bid once mandatory modules are included.',
  },
  {
    id: 'cr-6',
    lens: 'commercial',
    name: 'Pricing transparency & indexation',
    readings: { 'v-northgate': 'adequate', 'v-casca': 'strong', 'v-verandt': 'strong', 'v-ostrom': 'weak' },
    note: 'Ostrom indexes on a usage unit the buyer cannot forecast; both specialists publish flat rate cards.',
  },
  {
    id: 'cr-7',
    lens: 'commercial',
    name: 'Contractual flexibility',
    readings: { 'v-northgate': 'weak', 'v-casca': 'adequate', 'v-verandt': 'strong', 'v-ostrom': 'adequate' },
    note: 'Northgate requires a seven-year initial term; Verandt offers three plus rolling one-year extensions.',
  },
  {
    id: 'cr-8',
    lens: 'commercial',
    name: 'Reference economics at our scale',
    readings: { 'v-northgate': 'strong', 'v-casca': 'adequate', 'v-verandt': 'strong', 'v-ostrom': 'adequate' },
    note: 'Two live references at comparable document volume for Northgate and Verandt; Casca’s largest is half our size.',
  },
  {
    id: 'cr-9',
    lens: 'technical',
    name: 'API completeness & standards',
    readings: { 'v-northgate': 'adequate', 'v-casca': 'strong', 'v-verandt': 'adequate', 'v-ostrom': 'strong' },
    note: 'Casca and Ostrom expose everything the UI can do via API; Northgate’s bulk operations are UI-only.',
  },
  {
    id: 'cr-10',
    lens: 'technical',
    name: 'Integration with our estate',
    readings: { 'v-northgate': 'strong', 'v-casca': 'adequate', 'v-verandt': 'strong', 'v-ostrom': 'adequate' },
    note: 'Verandt ships native connectors for both our core platforms; Casca needs a build for one.',
  },
  {
    id: 'cr-11',
    lens: 'technical',
    name: 'Performance at reference volume',
    readings: { 'v-northgate': 'adequate', 'v-casca': 'strong', 'v-verandt': 'adequate', 'v-ostrom': 'strong' },
    note: 'Load test at 2× projected volume: Casca and Ostrom held sub-second retrieval; the others degraded politely.',
  },
  {
    id: 'cr-12',
    lens: 'technical',
    name: 'Product roadmap credibility',
    readings: { 'v-northgate': 'weak', 'v-casca': 'strong', 'v-verandt': 'adequate', 'v-ostrom': 'adequate' },
    note: 'Northgate’s roadmap re-promises the same modernisation it promised the references two years ago.',
  },
] as const;

export const READING_LABEL: Record<Reading, string> = {
  strong: 'STRONG',
  adequate: 'ADEQUATE',
  weak: 'WEAK',
};

export const BALANCE = {
  title: 'The balance',
  sub: 'Strong readings per lens — equal weights, by design; the room forbids a heavier thumb',
} as const;

export const FINDINGS = {
  title: 'What the weighing shows',
  sub: 'Read across all three sheets, not down one',
  notes: [
    {
      id: 'fn-1',
      text: 'Verandt is the most even weight: no lens loves it most, no lens flags it. In this room, that evenness is a finding, not a lack of one.',
    },
    {
      id: 'fn-2',
      text: 'Casca wins the technical sheet and the price row, but its scale references and negotiated audit rights put real work on the risk lens before contract.',
    },
    {
      id: 'fn-3',
      text: 'Ostrom’s bundle price is real and so is its exit problem. A vendor that is cheap to enter and slow to leave is not cheap.',
    },
    {
      id: 'fn-4',
      text: 'Northgate’s weight sits in yesterday: strong operations, strong references, and a roadmap the references have stopped believing.',
    },
  ],
} as const;

export const PROTOCOL = {
  title: 'Weighing-room protocol',
  sub: 'How the decision will be taken',
  rules: [
    {
      id: 'pr-1',
      rule: 'The lenses are weighed equally and separately.',
      note: 'Each team scored without sight of the other sheets. The first time the acetates were stacked was in this room.',
    },
    {
      id: 'pr-2',
      rule: 'A weak reading is a conversation, not a veto.',
      note: 'Any WEAK goes back to the vendor with a named question. Two of twelve have already improved on evidence.',
    },
    {
      id: 'pr-3',
      rule: 'References are visited, not surveyed.',
      note: 'Every reference reading above comes from a working session at the reference’s site, not a questionnaire.',
    },
    {
      id: 'pr-4',
      rule: 'The decision is written before it is announced.',
      note: 'A decision memo naming what we saw on each sheet — including what we chose to live with — is signed before the vendor hears anything.',
    },
  ],
} as const;

export const FOOT = {
  note: 'The Weighing Room — a vendor assessment as three acetate lenses over the same table, with a balance no single lens may tip. All vendors and readings are synthetic.',
  next: 'DECISION MEMO DRAFTED · SIGNED BY ALL THREE LENS OWNERS · SEP 2026',
} as const;
