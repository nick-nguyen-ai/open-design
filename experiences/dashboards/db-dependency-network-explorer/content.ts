/**
 * "The Interchange" — shipped content for `db-dependency-network-explorer`.
 *
 * Synthetic demonstration data for a fictional platform dependency network
 * drawn as a transit map. Lines, stations, and dossiers are invented.
 */

export interface MetroLine {
  id: string;
  name: string;
  color: string;
  /** SVG path (45-degree metro geometry). */
  path: string;
}

export interface Station {
  id: string;
  name: string;
  lineIds: string[];
  x: number;
  y: number;
  /** True when two or more lines meet here. */
  interchange?: boolean;
  owner: string;
  tier: string;
  upstream: string[];
  downstream: string[];
  /** Services affected if this station goes down. */
  blastRadius: string[];
  changeWindow: string;
  note: string;
}

export const AUTHORITY = {
  masthead: 'MERIDIAN PLATFORM TRANSIT AUTHORITY',
  mapRef: 'NETWORK MAP · ISSUE 7 · DRAWN FROM LIVE DEPENDENCY GRAPH · 14 JUL 2026',
  provenance: 'SYNTHETIC DEMONSTRATION DATA · NOT A LIVE ESTATE',
  kicker: 'EVERY SERVICE IS A STATION · EVERY DEPENDENCY IS TRACK',
  statement: 'Know the blast radius before you board.',
  subline:
    'Twenty services across four platform lines, drawn as the network they actually form. Select any station to read its dossier: what feeds it, what it feeds, and exactly which journeys stop if it goes down tonight.',
  figures: [
    { label: 'STATIONS', value: '20' },
    { label: 'LINES', value: '4' },
    { label: 'INTERCHANGES', value: '2' },
    { label: 'CHANGES THIS WEEK', value: '11' },
  ],
} as const;

export const MAP = {
  title: 'The network',
  sub: 'Four lines · two interchanges · select a station for its dossier',
  caption:
    'Transit-style dependency map: the Identity, Payments, Customer, and Data lines with twenty stations. Auth Gateway and Ledger Core are interchanges where lines meet. The station index below lists every station with its line and dependants.',
} as const;

export const LINES: MetroLine[] = [
  { id: 'identity', name: 'IDENTITY LINE', color: '#b18cff', path: 'M60,80 H240 L400,240 V420 H560' },
  { id: 'payments', name: 'PAYMENTS LINE', color: '#ffb547', path: 'M60,400 H240 L400,240 H640 L800,80 H930' },
  { id: 'customer', name: 'CUSTOMER LINE', color: '#6cc9e8', path: 'M60,240 H240 L360,120 H520 L640,240 H760 L880,360' },
  { id: 'data', name: 'DATA LINE', color: '#79d99a', path: 'M100,480 H280 L440,340 H620 L800,480 H930' },
];

export const STATIONS: Station[] = [
  { id: 'sso', name: 'SSO Portal', lineIds: ['identity'], x: 60, y: 80, owner: 'Identity Crew', tier: 'Tier 2', upstream: ['Credential Vault'], downstream: ['Auth Gateway'], blastRadius: ['Colleague sign-in', 'Back-office tools'], changeWindow: 'TUE / THU 20:00–22:00', note: 'Colleague-facing only; customer flows do not pass through here.' },
  { id: 'vault', name: 'Credential Vault', lineIds: ['identity'], x: 240, y: 80, owner: 'Identity Crew', tier: 'Tier 1', upstream: ['HSM cluster'], downstream: ['SSO Portal', 'Auth Gateway'], blastRadius: ['All token issuance'], changeWindow: 'FREEZE — CAB ONLY', note: 'Hardware-backed; changes need a CAB exception and dual sign-off.' },
  { id: 'authgw', name: 'Auth Gateway', lineIds: ['identity', 'payments'], x: 400, y: 240, interchange: true, owner: 'Platform Security', tier: 'Tier 1', upstream: ['Credential Vault', 'Payments API'], downstream: ['Ledger Core', 'Policy Engine'], blastRadius: ['Every authenticated journey', 'Payments authorisation', 'Mobile + web channels'], changeWindow: 'SUN 02:00–04:00', note: 'The busiest interchange on the map — assume everything routes through it until proven otherwise.' },
  { id: 'policy', name: 'Policy Engine', lineIds: ['identity'], x: 400, y: 420, owner: 'Platform Security', tier: 'Tier 2', upstream: ['Auth Gateway'], downstream: ['Device Trust'], blastRadius: ['Step-up auth decisions'], changeWindow: 'TUE / THU 20:00–22:00', note: 'Fails open to step-up challenge, never to allow.' },
  { id: 'device', name: 'Device Trust', lineIds: ['identity'], x: 560, y: 420, owner: 'Platform Security', tier: 'Tier 3', upstream: ['Policy Engine'], downstream: [], blastRadius: ['Device-binding enrolment'], changeWindow: 'ANY GREEN WINDOW', note: 'Terminal station; degradation queues enrolments, nothing breaks.' },
  { id: 'edge', name: 'Channel Edge', lineIds: ['payments'], x: 60, y: 400, owner: 'Channels Crew', tier: 'Tier 1', upstream: [], downstream: ['Payments API'], blastRadius: ['Mobile + web payment entry'], changeWindow: 'SUN 02:00–04:00', note: 'Origin station for all customer-initiated payments.' },
  { id: 'payapi', name: 'Payments API', lineIds: ['payments'], x: 240, y: 400, owner: 'Payments Crew', tier: 'Tier 1', upstream: ['Channel Edge'], downstream: ['Auth Gateway'], blastRadius: ['Payment initiation', 'Standing orders'], changeWindow: 'SUN 02:00–04:00', note: 'Versioned contract; v2 sunset scheduled September.' },
  { id: 'ledger', name: 'Ledger Core', lineIds: ['payments', 'customer'], x: 640, y: 240, interchange: true, owner: 'Core Banking', tier: 'Tier 1', upstream: ['Auth Gateway', 'Consent Registry'], downstream: ['Clearing Bridge', 'Servicing', 'Feature Store'], blastRadius: ['Balance reads', 'Posting', 'Servicing journeys', 'Overnight analytics feeds'], changeWindow: 'FREEZE — CAB ONLY', note: 'The other interchange. Blast radius spans three lines; changes ride the quarterly core release train.' },
  { id: 'clearing', name: 'Clearing Bridge', lineIds: ['payments'], x: 800, y: 80, owner: 'Core Payments', tier: 'Tier 1', upstream: ['Ledger Core'], downstream: ['Settlement Hub'], blastRadius: ['Outbound clearing files'], changeWindow: 'SAT 22:00–SUN 02:00', note: 'External scheme deadlines make missed windows expensive.' },
  { id: 'settle', name: 'Settlement Hub', lineIds: ['payments'], x: 930, y: 80, owner: 'Core Payments', tier: 'Tier 1', upstream: ['Clearing Bridge'], downstream: [], blastRadius: ['Same-day settlement'], changeWindow: 'SAT 22:00–SUN 02:00', note: 'Terminal station on the payments line; dual-run with the scheme sandbox.' },
  { id: 'crm', name: 'Branch CRM', lineIds: ['customer'], x: 60, y: 240, owner: 'Customer Crew', tier: 'Tier 3', upstream: [], downstream: ['Onboarding'], blastRadius: ['Branch appointment notes'], changeWindow: 'ANY GREEN WINDOW', note: 'Legacy origin; slated for replacement in the Q4 plan.' },
  { id: 'onboard', name: 'Onboarding', lineIds: ['customer'], x: 240, y: 240, owner: 'Customer Crew', tier: 'Tier 2', upstream: ['Branch CRM'], downstream: ['KYC Desk'], blastRadius: ['New-customer journeys'], changeWindow: 'TUE / THU 20:00–22:00', note: 'Queues gracefully; a two-hour outage adds a day to onboarding SLAs.' },
  { id: 'kyc', name: 'KYC Desk', lineIds: ['customer'], x: 360, y: 120, owner: 'Fin-Crime Crew', tier: 'Tier 1', upstream: ['Onboarding'], downstream: ['Consent Registry'], blastRadius: ['Identity verification', 'Account opening'], changeWindow: 'SUN 02:00–04:00', note: 'Screening models swap behind a challenger gate here.' },
  { id: 'consent', name: 'Consent Registry', lineIds: ['customer'], x: 520, y: 120, owner: 'Customer Crew', tier: 'Tier 1', upstream: ['KYC Desk'], downstream: ['Ledger Core'], blastRadius: ['Consent-gated data sharing'], changeWindow: 'SUN 02:00–04:00', note: 'Regulatory system of record for consent; audit log is append-only.' },
  { id: 'servicing', name: 'Servicing', lineIds: ['customer'], x: 760, y: 240, owner: 'Servicing Crew', tier: 'Tier 2', upstream: ['Ledger Core'], downstream: ['Complaints'], blastRadius: ['Agent servicing console'], changeWindow: 'TUE / THU 20:00–22:00', note: 'Read-mostly; degraded mode serves cached positions.' },
  { id: 'complaints', name: 'Complaints', lineIds: ['customer'], x: 880, y: 360, owner: 'Servicing Crew', tier: 'Tier 3', upstream: ['Servicing'], downstream: [], blastRadius: ['Complaint case tracking'], changeWindow: 'ANY GREEN WINDOW', note: 'Terminal station; regulatory clocks tracked independently.' },
  { id: 'bus', name: 'Event Bus', lineIds: ['data'], x: 100, y: 480, owner: 'Platform Crew', tier: 'Tier 1', upstream: [], downstream: ['Stream Works'], blastRadius: ['All async integration'], changeWindow: 'SUN 02:00–04:00', note: 'Every line publishes here; partitioned so one noisy topic cannot flood the map.' },
  { id: 'stream', name: 'Stream Works', lineIds: ['data'], x: 280, y: 480, owner: 'Data Crew', tier: 'Tier 2', upstream: ['Event Bus'], downstream: ['Customer 360'], blastRadius: ['Real-time enrichment'], changeWindow: 'TUE / THU 20:00–22:00', note: 'Replayable from the bus; an outage is latency, not loss.' },
  { id: 'c360', name: 'Customer 360', lineIds: ['data'], x: 440, y: 340, owner: 'Data Crew', tier: 'Tier 1', upstream: ['Stream Works'], downstream: ['Feature Store'], blastRadius: ['Single customer view', 'Personalisation'], changeWindow: 'SUN 02:00–04:00', note: 'Highest-dependency station off the interchanges; treat schema changes as network-wide.' },
  { id: 'feature', name: 'Feature Store', lineIds: ['data'], x: 620, y: 340, owner: 'ML Platform', tier: 'Tier 1', upstream: ['Customer 360', 'Ledger Core'], downstream: ['Analytics Mart'], blastRadius: ['Model inference features'], changeWindow: 'SUN 02:00–04:00', note: 'Serves online features to nine production models.' },
  { id: 'mart', name: 'Analytics Mart', lineIds: ['data'], x: 800, y: 480, owner: 'Data Crew', tier: 'Tier 2', upstream: ['Feature Store'], downstream: ['Reg Reports'], blastRadius: ['Exec dashboards', 'Regulatory reporting'], changeWindow: 'TUE / THU 20:00–22:00', note: 'Nightly build; intraday outages invisible until 06:00.' },
];

export const DOSSIER = {
  title: 'Station dossier',
  sub: 'The map stays primary — the detail reads beside it',
} as const;

export const INDEX = {
  title: 'Station index',
  sub: 'Every station with its line, tier, and change window',
  caption:
    'Station index — all twenty stations with their lines, owning crew, tier, and change window.',
} as const;

export const FOOT = {
  note: 'The map redraws nightly from the dependency graph; the index is the same data as the drawing. If the map and reality disagree, reality wins and the graph gets fixed.',
  next: 'NEXT REDRAW 02:00',
} as const;
