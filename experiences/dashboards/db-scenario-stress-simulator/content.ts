/**
 * "The Wind Tunnel" — shipped content for `db-scenario-stress-simulator`.
 *
 * Synthetic demonstration data for a fictional bank's stress-testing rig.
 * Scenarios, gauges, and driver traces are invented.
 */

export type RigVerdict = 'passes' | 'binding' | 'fails';

export interface RigGauge {
  label: string;
  value: number;
  display: string;
  /** Gauge scale bounds. */
  min: number;
  max: number;
  /** The regulatory / appetite floor drawn on the arc. */
  floor: number;
  floorLabel: string;
}

export interface ScenarioRig {
  id: string;
  code: string;
  name: string;
  description: string;
  severity: 'baseline' | 'adverse' | 'severe';
  verdict: RigVerdict;
  verdictNote: string;
  gauge: RigGauge;
  lossFigure: string;
  lcr: string;
}

export interface DriverTrace {
  id: string;
  category: string;
  /** Contribution to CET1 depletion, basis points (negative = depletes). */
  value: number;
  baseline: string;
  severe: string;
  note: string;
}

export const TUNNEL = {
  masthead: 'MERIDIAN RISK LAB · SCENARIO WIND TUNNEL',
  session: 'TEST SESSION 26-07 · MODEL SUITE v9 · RUN 14 JUL 2026',
  standard: 'THREE SCENARIOS ON THE RIG · SAME BALANCE SHEET · SAME INSTRUMENTS',
  provenance: 'SYNTHETIC DEMONSTRATION DATA · NOT MERIDIAN FIGURES',
  kicker: 'WHAT THE TUNNEL SHOWED THIS SESSION',
  statement: 'The balance sheet holds. Two drivers do the damage.',
  subline:
    'All three scenarios clear the CET1 floor — the severe run by 90 basis points, which makes it binding, not comfortable. The driver traces are the finding: credit migration in the SME book and the funding-cost shock explain two-thirds of the depletion between baseline and severe. Everything else is noise by comparison.',
  figures: [
    { label: 'SCENARIOS ON RIG', value: '3' },
    { label: 'DRIVERS INSTRUMENTED', value: '12' },
    { label: 'RUNS THIS SESSION', value: '36' },
    { label: 'BINDING CONSTRAINT', value: 'CET1' },
  ],
} as const;

export const RIGS = {
  title: 'The test rigs',
  sub: 'Same balance sheet in three winds · gauges read capital at the trough',
  items: [
    {
      id: 'base',
      code: 'RIG A',
      name: 'BASELINE',
      description: 'Central macro path — consensus rates, mild credit normalisation.',
      severity: 'baseline',
      verdict: 'passes',
      verdictNote: 'CLEARS FLOOR BY 420 BPS',
      gauge: { label: 'CET1 AT TROUGH', value: 15.4, display: '15.4%', min: 8, max: 18, floor: 11.2, floorLabel: 'FLOOR 11.2%' },
      lossFigure: '£0.4bn expected credit losses',
      lcr: 'LCR 148%',
    },
    {
      id: 'adverse',
      code: 'RIG B',
      name: 'ADVERSE-24',
      description: 'Rate shock +250bps, property −18%, unemployment to 6.5%.',
      severity: 'adverse',
      verdict: 'passes',
      verdictNote: 'CLEARS FLOOR BY 230 BPS',
      gauge: { label: 'CET1 AT TROUGH', value: 13.5, display: '13.5%', min: 8, max: 18, floor: 11.2, floorLabel: 'FLOOR 11.2%' },
      lossFigure: '£1.1bn expected credit losses',
      lcr: 'LCR 131%',
    },
    {
      id: 'severe',
      code: 'RIG C',
      name: 'SEVERE-97',
      description: 'Disorderly repricing, property −35%, SME default wave, funding freeze.',
      severity: 'severe',
      verdict: 'binding',
      verdictNote: 'CLEARS FLOOR BY 90 BPS — BINDING',
      gauge: { label: 'CET1 AT TROUGH', value: 12.1, display: '12.1%', min: 8, max: 18, floor: 11.2, floorLabel: 'FLOOR 11.2%' },
      lossFigure: '£2.7bn expected credit losses',
      lcr: 'LCR 117%',
    },
  ] as ScenarioRig[],
} as const;

export const DRIVERS = {
  title: 'Driver traces',
  sub: 'What actually moves the outcome, baseline → severe · CET1 depletion in basis points',
  chartTitle: 'CET1 depletion by driver, baseline to SEVERE-97 (basis points)',
  chartSource: 'Contribution of each instrumented driver to the 330bps depletion between RIG A and RIG C. Synthetic demonstration data.',
  traces: [
    { id: 't1', category: 'SME credit migration', value: -118, baseline: 'PD 1.1%', severe: 'PD 4.3%', note: 'The single largest trace — concentrated in the 2023-24 origination vintages.' },
    { id: 't2', category: 'Funding cost shock', value: -96, baseline: '+0bps', severe: '+310bps', note: 'Term-funding repricing under the freeze; hedges absorb the first 80bps only.' },
    { id: 't3', category: 'Property collateral', value: -44, baseline: '−2%', severe: '−35%', note: 'LGD uplift on secured books; regional concentration caps the tail.' },
    { id: 't4', category: 'Trading & CVA', value: -31, baseline: 'calm', severe: 'stressed', note: 'Mark-to-market on the rates book; within desk limits throughout.' },
    { id: 't5', category: 'Fee income contraction', value: -25, baseline: '+2%', severe: '−18%', note: 'Volume-driven; recovers within four quarters in every path.' },
    { id: 't6', category: 'Operational & other', value: -16, baseline: 'plan', severe: 'stressed', note: 'Conservative overlay; no single event dominates.' },
  ] as DriverTrace[],
} as const;

export const READING = {
  title: 'The reading',
  sub: 'What the desk takes from session 26-07',
  paragraphs: [
    'Two traces carry the session: SME credit migration (−118bps) and the funding-cost shock (−96bps) together explain 65% of the depletion between the baseline and severe rigs. The next four drivers combined contribute less than either one alone. This is where mitigation spend earns its keep — a 20% reduction in SME vintage concentration buys back more capital than hedging every other trace on the board.',
    'The severe run passing by only 90 basis points is the number the committee should sit with. It is a pass, and it is also the thinnest margin this rig has produced in six sessions — driven by book growth, not model change. The recommendation on file: re-run with the proposed SME concentration cap before the September capital plan is locked.',
  ],
} as const;

export const FOOT = {
  note: 'Every run in the tunnel is reproducible: scenario file, model suite version, and balance-sheet snapshot are pinned per session. Comparing sessions means comparing like for like, or saying so.',
  next: 'NEXT SESSION 26-08 · SCHEDULED 11 AUG 2026',
} as const;
