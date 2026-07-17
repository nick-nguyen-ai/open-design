/**
 * "The Morning Brief" — shipped content for `db-ai-risk-command-centre`.
 *
 * Synthetic demonstration data for a fictional bank ("Meridian Group").
 * All figures, models, and committee actions are invented.
 */

export type AppetiteState = 'within' | 'elevated' | 'breach';
export type ActionState = 'on-track' | 'due' | 'overdue' | 'closed';

export interface BriefFigure {
  label: string;
  value: string;
  note: string;
}

export interface DomainModel {
  id: string;
  name: string;
  tier: string;
  exposure: string;
  state: AppetiteState;
  note: string;
}

export interface RiskDomain {
  id: string;
  name: string;
  headline: string;
  /** Utilisation of risk appetite, 0–1. */
  utilisation: number;
  modelCount: number;
  onWatch: number;
  state: AppetiteState;
  reading: string;
  models: DomainModel[];
}

export interface TrendPoint {
  x: string;
  y: number;
}

export interface CommitteeAction {
  id: string;
  ref: string;
  title: string;
  owner: string;
  due: string;
  state: ActionState;
  note: string;
}

export const CHROME = {
  masthead: 'MERIDIAN GROUP · MODEL RISK',
  edition: 'MORNING BRIEF · TUESDAY 14 JULY 2026 · 06:00',
  desk: 'PREPARED BY THE MODEL RISK DESK FOR GROUP RISK COMMITTEE',
  provenance: 'SYNTHETIC DEMONSTRATION DATA · NOT MERIDIAN FIGURES',
} as const;

export const BRIEF = {
  kicker: 'THE POSITION AT THIS MORNING’S OPEN',
  statement: 'Contained.',
  subline:
    'All five model risk domains open the day inside appetite. One domain — GenAI applications — runs elevated on a single validation backlog, with remediation on file and due Friday.',
  figures: [
    { label: 'MODELS ON REGISTER', value: '241', note: '+3 since last brief' },
    { label: 'WITHIN APPETITE', value: '97.9%', note: '236 of 241 models' },
    { label: 'ELEVATED DOMAINS', value: '1', note: 'GenAI applications' },
    { label: 'ACTIONS OPEN', value: '7', note: '0 overdue' },
  ] as BriefFigure[],
} as const;

export const LEDGER = {
  title: 'The posture ledger',
  sub: 'Five domains · appetite utilisation at 06:00 · unfold a line for its evidence',
  columnsNote:
    'Posture ledger — five model risk domains with appetite utilisation, model counts, and watch items. Select a domain to load its evidence below.',
} as const;

export const DOMAINS: RiskDomain[] = [
  {
    id: 'credit',
    name: 'Credit decisioning',
    headline: 'Quiet. IRB suite revalidated in June; drift well inside tolerance.',
    utilisation: 0.54,
    modelCount: 88,
    onWatch: 2,
    state: 'within',
    reading:
      'The credit suite holds fifty-four percent of appetite. Two scorecards remain on watch after the Q2 origination-mix shift; both retrain on the August cycle and neither has moved since the last brief.',
    models: [
      { id: 'crd-1', name: 'retail-pd-v9', tier: 'Tier 1', exposure: '£4.1bn', state: 'within', note: 'Revalidated 12 Jun' },
      { id: 'crd-2', name: 'sme-origination-v4', tier: 'Tier 2', exposure: '£1.2bn', state: 'elevated', note: 'On watch · mix shift' },
      { id: 'crd-3', name: 'collections-priority-v6', tier: 'Tier 2', exposure: '£640m', state: 'within', note: 'Stable' },
    ],
  },
  {
    id: 'fraud',
    name: 'Fraud & financial crime',
    headline: 'Two models retrained overnight after the mule-network pattern shift.',
    utilisation: 0.61,
    modelCount: 42,
    onWatch: 3,
    state: 'within',
    reading:
      'Fraud runs at sixty-one percent of appetite. The overnight retrain of the two payment-screening models completed clean at 03:10; challenger parity restored. Alert volumes are back inside the daily corridor.',
    models: [
      { id: 'frd-1', name: 'payment-screen-v11', tier: 'Tier 1', exposure: '£2.8bn', state: 'within', note: 'Retrained 03:10' },
      { id: 'frd-2', name: 'mule-network-v3', tier: 'Tier 1', exposure: '£2.8bn', state: 'within', note: 'Retrained 03:10' },
      { id: 'frd-3', name: 'card-anomaly-v7', tier: 'Tier 2', exposure: '£910m', state: 'elevated', note: 'On watch · alert drift' },
    ],
  },
  {
    id: 'markets',
    name: 'Markets & treasury',
    headline: 'VaR backtesting green for the eleventh consecutive week.',
    utilisation: 0.38,
    modelCount: 35,
    onWatch: 0,
    state: 'within',
    reading:
      'The markets suite is the quietest book on the register — thirty-eight percent of appetite, no watch items, and a clean eleventh week of VaR backtesting. Nothing requires committee attention.',
    models: [
      { id: 'mkt-1', name: 'var-hs-v5', tier: 'Tier 1', exposure: '£12.4bn', state: 'within', note: '11 weeks green' },
      { id: 'mkt-2', name: 'irrbb-behavioural-v2', tier: 'Tier 2', exposure: '£6.0bn', state: 'within', note: 'Stable' },
    ],
  },
  {
    id: 'genai',
    name: 'GenAI applications',
    headline: 'Elevated. One validation backlog holds the domain over its soft limit.',
    utilisation: 0.86,
    modelCount: 19,
    onWatch: 4,
    state: 'elevated',
    reading:
      'The GenAI book carries eighty-six percent of appetite, over the eighty-percent soft limit for a ninth day. The cause is singular: the document-summarisation assistant awaits its first-line validation evidence, queued behind the June onboarding wave. The pack is complete, the review is scheduled, and the domain returns inside appetite when it lands Friday. No customer-facing model is affected.',
    models: [
      { id: 'gai-1', name: 'doc-summary-assist-v2', tier: 'Tier 2', exposure: 'Internal', state: 'breach', note: 'Validation due Fri 17 Jul' },
      { id: 'gai-2', name: 'kyc-narrative-v1', tier: 'Tier 2', exposure: 'Internal', state: 'elevated', note: 'Evidence pack in review' },
      { id: 'gai-3', name: 'complaints-triage-v4', tier: 'Tier 2', exposure: 'Internal', state: 'within', note: 'Monitored weekly' },
      { id: 'gai-4', name: 'advisor-copilot-v1', tier: 'Tier 3', exposure: 'Pilot', state: 'elevated', note: 'Pilot guardrails active' },
    ],
  },
  {
    id: 'operational',
    name: 'Operational & conduct',
    headline: 'Quiet. Complaints-routing recalibration signed off Monday.',
    utilisation: 0.47,
    modelCount: 57,
    onWatch: 1,
    state: 'within',
    reading:
      'Operational models hold forty-seven percent of appetite. Monday’s recalibration of the complaints-routing model was signed off by second line with no conditions; the single watch item is the annual review of the staff-rostering model, due in September.',
    models: [
      { id: 'ops-1', name: 'complaints-route-v8', tier: 'Tier 2', exposure: 'Conduct', state: 'within', note: 'Signed off 13 Jul' },
      { id: 'ops-2', name: 'staff-roster-v3', tier: 'Tier 3', exposure: 'Internal', state: 'elevated', note: 'Annual review Sep' },
    ],
  },
];

export const EVIDENCE = {
  title: 'The evidence behind the line',
  sub: 'Loaded for the selected domain · charts and watch items to committee standard',
  trendHeading: 'APPETITE UTILISATION · 90 DAYS',
  softLimit: 0.8,
  chartSource: 'Daily appetite utilisation against the 80% soft limit. Synthetic demonstration data.',
} as const;

/** 90 days of appetite utilisation per domain (y is 0–1 utilisation). */
export const DOMAIN_TRENDS: Record<string, TrendPoint[]> = Object.fromEntries(
  DOMAINS.map((domain) => {
    const points: TrendPoint[] = [];
    for (let i = 0; i < 90; i += 1) {
      const day = new Date(Date.UTC(2026, 3, 15 + i));
      const x = day.toISOString().slice(0, 10);
      const t = i / 89;
      let y = domain.utilisation;
      switch (domain.id) {
        case 'credit':
          y = 0.5 + 0.05 * Math.sin(t * 5.1) + 0.02 * Math.sin(t * 23);
          break;
        case 'fraud':
          y = 0.57 + 0.06 * Math.sin(t * 4.2 + 1.1) + 0.015 * Math.sin(t * 31);
          break;
        case 'markets':
          y = 0.4 - 0.03 * t + 0.02 * Math.sin(t * 6.3);
          break;
        case 'genai':
          y = 0.55 + 0.28 * t * t + 0.02 * Math.sin(t * 19);
          break;
        case 'operational':
          y = 0.5 - 0.04 * Math.sin(t * 3.4) + 0.015 * Math.sin(t * 17);
          break;
      }
      points.push({ x, y: Math.round(Math.min(0.97, Math.max(0.2, y)) * 1000) / 1000 });
    }
    return [domain.id, points];
  }),
);

export const ACTIONS = {
  title: 'Before the committee',
  sub: 'Open actions · owners answer at Thursday’s sitting',
  items: [
    {
      id: 'act-1',
      ref: 'MRC-114',
      title: 'Land first-line validation of doc-summary-assist-v2',
      owner: 'Head of AI Validation',
      due: 'Fri 17 Jul',
      state: 'due',
      note: 'Evidence pack complete; review sitting booked 14:00 Friday.',
    },
    {
      id: 'act-2',
      ref: 'MRC-109',
      title: 'Close Q2 origination-mix watch on sme-origination-v4',
      owner: 'Credit Model Owner',
      due: 'Aug retrain cycle',
      state: 'on-track',
      note: 'Retrain scheduled 04 Aug; early drift readings inside tolerance.',
    },
    {
      id: 'act-3',
      ref: 'MRC-117',
      title: 'Present GenAI appetite recalibration options',
      owner: 'Model Risk Desk',
      due: 'Thu 23 Jul',
      state: 'on-track',
      note: 'Two options drafted: raise soft limit vs. split the GenAI book by materiality.',
    },
    {
      id: 'act-4',
      ref: 'MRC-102',
      title: 'Annual review scope for staff-roster-v3',
      owner: 'Operational Risk',
      due: 'Mon 07 Sep',
      state: 'on-track',
      note: 'Scope letter drafted; second line comments due end of month.',
    },
  ] as CommitteeAction[],
} as const;

export const FOOT = {
  note: 'This brief is prepared nightly from the model register and the appetite ledger. Figures state the position at 06:00 and do not restate intraday.',
  nextEdition: 'NEXT EDITION WEDNESDAY 15 JULY · 06:00',
} as const;
