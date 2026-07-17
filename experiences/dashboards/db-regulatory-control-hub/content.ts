/**
 * "The Registry" — shipped content for `db-regulatory-control-hub`.
 *
 * Synthetic demonstration data for a fictional bank's control registry.
 * Every control family, exception, and request is invented.
 */

export type ControlResult = 'effective' | 'exception' | 'retest-due';
export type RequestState = 'open' | 'drafting' | 'submitted';

export interface ControlFamily {
  id: string;
  code: string;
  name: string;
  controls: number;
  effective: number;
  lastTested: string;
  note: string;
}

export interface ControlEntry {
  id: string;
  ref: string;
  name: string;
  result: ControlResult;
  owner: string;
  evidenceRef: string;
  tested: string;
}

export interface ExceptionNotice {
  id: string;
  ref: string;
  familyCode: string;
  title: string;
  raised: string;
  remediateBy: string;
  owner: string;
  note: string;
}

export interface EvidenceRequest {
  id: string;
  ref: string;
  from: string;
  title: string;
  due: string;
  state: RequestState;
}

export const REGISTRY = {
  masthead: 'MERIDIAN GROUP · CONTROL REGISTRY',
  period: 'ASSESSMENT PERIOD Q2 2026 · CLOSED 30 JUN · FILED 14 JUL',
  authority: 'MAINTAINED BY GROUP CONTROLS OFFICE UNDER THE SUPERVISORY ENGAGEMENT PLAN',
  provenance: 'SYNTHETIC DEMONSTRATION DATA · NOT MERIDIAN FIGURES',
  kicker: 'THE POSTURE, AS FILED',
  numerator: 247,
  denominator: 251,
  figureCaption: 'CONTROLS TESTED EFFECTIVE THIS PERIOD',
  statement:
    'Two hundred and forty-seven of two hundred and fifty-one controls tested effective. The four exceptions are filed below with named owners and remediation dates — none is a repeat finding.',
  attestation: 'ATTESTED · CHIEF CONTROLS OFFICER · 14 JUL 2026',
} as const;

export const INDEX = {
  title: 'The filing index',
  sub: 'Eight control families · select a drawer to read its controls',
} as const;

export const FAMILIES: ControlFamily[] = [
  { id: 'access', code: 'CF-01', name: 'Access & identity', controls: 38, effective: 38, lastTested: '22 JUN', note: 'Quarterly recertification complete; no stale privileged accounts.' },
  { id: 'change', code: 'CF-02', name: 'Change management', controls: 31, effective: 30, lastTested: '24 JUN', note: 'One emergency change bypassed CAB minuting — exception EX-114.' },
  { id: 'model', code: 'CF-03', name: 'Model governance', controls: 27, effective: 26, lastTested: '18 JUN', note: 'One validation refresh past due — exception EX-109.' },
  { id: 'data', code: 'CF-04', name: 'Data integrity', controls: 34, effective: 34, lastTested: '26 JUN', note: 'Reconciliation suite green all period; lineage attestations on file.' },
  { id: 'resilience', code: 'CF-05', name: 'Operational resilience', controls: 29, effective: 28, lastTested: '19 JUN', note: 'One failover drill exceeded its recovery objective — exception EX-117.' },
  { id: 'thirdparty', code: 'CF-06', name: 'Third-party oversight', controls: 26, effective: 25, lastTested: '25 JUN', note: 'One critical vendor attestation late — exception EX-121.' },
  { id: 'conduct', code: 'CF-07', name: 'Conduct & conflicts', controls: 33, effective: 33, lastTested: '23 JUN', note: 'Annual declarations 100% returned; sampling clean.' },
  { id: 'financial', code: 'CF-08', name: 'Financial reporting', controls: 33, effective: 33, lastTested: '27 JUN', note: 'Key reports re-performed without variance.' },
];

/** Controls on file per family (a representative drawer's worth each). */
export const CONTROLS: Record<string, ControlEntry[]> = {
  access: [
    { id: 'a1', ref: 'AC-114', name: 'Privileged access quarterly recertification', result: 'effective', owner: 'Identity Ops', evidenceRef: 'EV-2214', tested: '22 JUN' },
    { id: 'a2', ref: 'AC-021', name: 'Joiner-mover-leaver within 24 hours', result: 'effective', owner: 'Identity Ops', evidenceRef: 'EV-2215', tested: '22 JUN' },
    { id: 'a3', ref: 'AC-090', name: 'Production access requires approved ticket', result: 'effective', owner: 'Platform Security', evidenceRef: 'EV-2216', tested: '21 JUN' },
    { id: 'a4', ref: 'AC-133', name: 'Service-account credential rotation ≤ 90 days', result: 'effective', owner: 'Platform Security', evidenceRef: 'EV-2217', tested: '20 JUN' },
  ],
  change: [
    { id: 'c1', ref: 'CH-201', name: 'All production changes carry CAB approval', result: 'exception', owner: 'Release Management', evidenceRef: 'EX-114', tested: '24 JUN' },
    { id: 'c2', ref: 'CH-118', name: 'Rollback plan attached before deployment', result: 'effective', owner: 'Release Management', evidenceRef: 'EV-2230', tested: '24 JUN' },
    { id: 'c3', ref: 'CH-064', name: 'Segregation of build and deploy duties', result: 'effective', owner: 'Platform Security', evidenceRef: 'EV-2231', tested: '23 JUN' },
    { id: 'c4', ref: 'CH-089', name: 'Emergency changes ratified within 5 days', result: 'retest-due', owner: 'Release Management', evidenceRef: 'EV-2232', tested: 'RETEST 28 JUL' },
  ],
  model: [
    { id: 'm1', ref: 'MG-044', name: 'Tier-1 models revalidated on schedule', result: 'exception', owner: 'Model Risk', evidenceRef: 'EX-109', tested: '18 JUN' },
    { id: 'm2', ref: 'MG-051', name: 'Model changes pass second-line review', result: 'effective', owner: 'Model Risk', evidenceRef: 'EV-2201', tested: '18 JUN' },
    { id: 'm3', ref: 'MG-102', name: 'GenAI use registered before deployment', result: 'effective', owner: 'AI Governance', evidenceRef: 'EV-2202', tested: '17 JUN' },
    { id: 'm4', ref: 'MG-076', name: 'Monitoring thresholds reviewed quarterly', result: 'effective', owner: 'Model Risk', evidenceRef: 'EV-2203', tested: '17 JUN' },
  ],
  data: [
    { id: 'd1', ref: 'DI-011', name: 'Daily ledger-to-warehouse reconciliation', result: 'effective', owner: 'Data Ops', evidenceRef: 'EV-2245', tested: '26 JUN' },
    { id: 'd2', ref: 'DI-034', name: 'Critical data elements carry lineage attestation', result: 'effective', owner: 'Data Governance', evidenceRef: 'EV-2246', tested: '26 JUN' },
    { id: 'd3', ref: 'DI-058', name: 'Quality thresholds alert within one cycle', result: 'effective', owner: 'Data Ops', evidenceRef: 'EV-2247', tested: '25 JUN' },
  ],
  resilience: [
    { id: 'r1', ref: 'OR-071', name: 'Critical services fail over inside recovery objective', result: 'exception', owner: 'Resilience Office', evidenceRef: 'EX-117', tested: '19 JUN' },
    { id: 'r2', ref: 'OR-033', name: 'Impact tolerances tested annually per service', result: 'effective', owner: 'Resilience Office', evidenceRef: 'EV-2260', tested: '19 JUN' },
    { id: 'r3', ref: 'OR-102', name: 'Third-party concentration mapped and reviewed', result: 'effective', owner: 'Resilience Office', evidenceRef: 'EV-2261', tested: '18 JUN' },
  ],
  thirdparty: [
    { id: 't1', ref: 'TP-019', name: 'Critical vendors return annual control attestation', result: 'exception', owner: 'Vendor Management', evidenceRef: 'EX-121', tested: '25 JUN' },
    { id: 't2', ref: 'TP-042', name: 'Exit plans current for critical services', result: 'effective', owner: 'Vendor Management', evidenceRef: 'EV-2271', tested: '25 JUN' },
    { id: 't3', ref: 'TP-063', name: 'Fourth-party dependencies disclosed', result: 'effective', owner: 'Vendor Management', evidenceRef: 'EV-2272', tested: '24 JUN' },
  ],
  conduct: [
    { id: 'cd1', ref: 'CC-008', name: 'Annual conflict declarations returned', result: 'effective', owner: 'Compliance', evidenceRef: 'EV-2280', tested: '23 JUN' },
    { id: 'cd2', ref: 'CC-027', name: 'Personal account dealing pre-clearance', result: 'effective', owner: 'Compliance', evidenceRef: 'EV-2281', tested: '23 JUN' },
    { id: 'cd3', ref: 'CC-055', name: 'Gifts and hospitality register sampled', result: 'effective', owner: 'Compliance', evidenceRef: 'EV-2282', tested: '22 JUN' },
  ],
  financial: [
    { id: 'f1', ref: 'FR-012', name: 'Key reports re-performed independently', result: 'effective', owner: 'Financial Control', evidenceRef: 'EV-2290', tested: '27 JUN' },
    { id: 'f2', ref: 'FR-036', name: 'Journal entries above threshold dual-approved', result: 'effective', owner: 'Financial Control', evidenceRef: 'EV-2291', tested: '27 JUN' },
    { id: 'f3', ref: 'FR-048', name: 'Month-end close checklist evidenced', result: 'effective', owner: 'Financial Control', evidenceRef: 'EV-2292', tested: '26 JUN' },
  ],
};

export const EVIDENCE = {
  title: 'The drawer, opened',
  sub: 'Controls on file for the selected family · every result carries an evidence reference',
} as const;

export const COVERAGE = {
  title: 'Coverage by family',
  sub: 'Controls tested effective vs. filed, per family',
  chartTitle: 'Control testing coverage by family, Q2 2026',
  chartSource: 'Effective controls per family against the filed total. Synthetic demonstration data.',
} as const;

export const EXCEPTIONS = {
  title: 'Exceptions filed',
  sub: 'Four exceptions · named owner · remediation date on record',
  items: [
    {
      id: 'x1',
      ref: 'EX-109',
      familyCode: 'CF-03',
      title: 'Tier-1 credit model validation refresh past due',
      raised: '18 JUN',
      remediateBy: '15 AUG',
      owner: 'Head of Model Risk',
      note: 'Validation pack in second-line review; interim compensating monitoring in force weekly.',
    },
    {
      id: 'x2',
      ref: 'EX-114',
      familyCode: 'CF-02',
      title: 'Emergency change deployed without CAB minuting',
      raised: '24 JUN',
      remediateBy: '31 JUL',
      owner: 'Head of Release Management',
      note: 'Change retrospectively ratified; CAB emergency-path minuting made mandatory in tooling.',
    },
    {
      id: 'x3',
      ref: 'EX-117',
      familyCode: 'CF-05',
      title: 'Payments-hub failover exceeded recovery objective by 11 minutes',
      raised: '19 JUN',
      remediateBy: '30 SEP',
      owner: 'Head of Resilience',
      note: 'Root cause in DNS cutover step; re-drill scheduled after automation lands.',
    },
    {
      id: 'x4',
      ref: 'EX-121',
      familyCode: 'CF-06',
      title: 'Critical vendor control attestation received late',
      raised: '25 JUN',
      remediateBy: '22 AUG',
      owner: 'Head of Vendor Management',
      note: 'Attestation now on file; contract amendment adds a 30-day attestation clause.',
    },
  ] as ExceptionNotice[],
} as const;

export const REQUESTS = {
  title: 'Evidence requests',
  sub: 'Open supervisory requests against this registry',
  items: [
    { id: 'q1', ref: 'REQ-2216', from: 'PRUDENTIAL SUPERVISOR', title: 'Failover drill evidence for payments hub, last four quarters', due: 'DUE 24 JUL', state: 'drafting' },
    { id: 'q2', ref: 'REQ-2209', from: 'PRUDENTIAL SUPERVISOR', title: 'Model inventory extract with validation dates, Tier 1 and 2', due: 'DUE 21 JUL', state: 'submitted' },
    { id: 'q3', ref: 'REQ-2221', from: 'CONDUCT AUTHORITY', title: 'Complaints-routing model change log, January to June', due: 'DUE 07 AUG', state: 'open' },
  ] as EvidenceRequest[],
} as const;

export const FOOT = {
  note: 'The registry restates at each period close. Between closes, entries change only by filed exception or filed remediation — never silently.',
  next: 'NEXT PERIOD CLOSES 30 SEP 2026',
} as const;
