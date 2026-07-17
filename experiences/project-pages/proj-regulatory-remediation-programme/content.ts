/**
 * "The Undertakings Register" — synthetic content for
 * `proj-regulatory-remediation-programme`. Every remediation commitment a
 * numbered undertaking against its regulator deadline, with a status lozenge
 * that admits no ambiguity and an evidence line per undertaking.
 * Fictional bank: Meridian; fictional regulator: the Prudential Conduct
 * Office (PCO). All content synthetic.
 */

export const REGISTER = {
  masthead: 'MERIDIAN BANK',
  ref: 'REGISTER OF UNDERTAKINGS · PCO/2025/114 · AS AT 14 JUL 2026',
  kicker: 'EVERY COMMITMENT, NUMBERED, DATED, EVIDENCED',
  title: 'The Undertakings Register',
  subline:
    'Following the Prudential Conduct Office’s 2025 review of payments controls, Meridian gave ten formal undertakings. This register is the single record of all ten: each against its regulator deadline, each with a status that means exactly what it says, each with the evidence that proves it. There is no other version of this page.',
  figures: [
    { label: 'UNDERTAKINGS', value: '10' },
    { label: 'DISCHARGED', value: '4' },
    { label: 'ON TRACK', value: '5' },
    { label: 'AT RISK', value: '1' },
  ],
  provenance: 'SYNTHETIC REGISTER · DEMONSTRATION UNDERTAKINGS, NOT A LIVE REGULATORY RECORD',
} as const;

export const READING = {
  title: 'How to read this register',
  body: 'Three statuses only. DISCHARGED means the regulator has accepted the evidence and closed the undertaking — it never reopens on this page. ON TRACK means the current plan reaches the deadline with margin, and the evidence line shows the latest completed proof point. AT RISK means the current plan does not reach the deadline; the evidence line says what changed and what the recovery is. There is no AMBER-TRENDING-GREEN here.',
} as const;

export interface Undertaking {
  id: string;
  no: string;
  undertaking: string;
  deadline: string;
  owner: string;
  status: 'discharged' | 'on-track' | 'at-risk';
  evidence: string;
}

export const UNDERTAKINGS: readonly Undertaking[] = [
  {
    id: 'u-01',
    no: 'U-01',
    undertaking: 'Appoint an accountable executive for payments control remediation',
    deadline: '30 SEP 2025',
    owner: 'Chief Operating Officer',
    status: 'discharged',
    evidence: 'Appointment letter accepted by PCO, 12 Sep 2025 · closed by PCO letter ref 114/07',
  },
  {
    id: 'u-02',
    no: 'U-02',
    undertaking: 'Complete an independent root-cause review of the 2025 reconciliation failures',
    deadline: '31 DEC 2025',
    owner: 'Group Internal Audit',
    status: 'discharged',
    evidence: 'Review report delivered 4 Dec 2025 · findings accepted, closed 19 Jan 2026',
  },
  {
    id: 'u-03',
    no: 'U-03',
    undertaking: 'Remediate the four critical reconciliation controls identified in the review',
    deadline: '31 MAR 2026',
    owner: 'Payments Operations',
    status: 'discharged',
    evidence: 'All four controls re-tested effective by second line, 20 Mar 2026 · closed 8 Apr 2026',
  },
  {
    id: 'u-04',
    no: 'U-04',
    undertaking: 'Implement daily automated reconciliation across all payment schemes',
    deadline: '30 JUN 2026',
    owner: 'Payments Technology',
    status: 'discharged',
    evidence: 'Automation live for all seven schemes since 2 Jun 2026 · closed 30 Jun 2026',
  },
  {
    id: 'u-05',
    no: 'U-05',
    undertaking: 'Re-paper and re-test the payments control framework end to end',
    deadline: '30 SEP 2026',
    owner: 'Chief Control Officer',
    status: 'on-track',
    evidence: '61 of 84 controls re-papered and tested as at 11 Jul · run-rate reaches 84 by 5 Sep',
  },
  {
    id: 'u-06',
    no: 'U-06',
    undertaking: 'Clear the historical breaks backlog and remediate affected customers',
    deadline: '31 OCT 2026',
    owner: 'Customer Remediation',
    status: 'on-track',
    evidence: 'Backlog down from 18,400 to 3,120 breaks · customer payments 92% issued',
  },
  {
    id: 'u-07',
    no: 'U-07',
    undertaking: 'Implement management information giving daily sight of control health',
    deadline: '31 OCT 2026',
    owner: 'Chief Data Office',
    status: 'on-track',
    evidence: 'Daily control dashboard in parallel run since 22 Jun · formal cutover 15 Aug',
  },
  {
    id: 'u-08',
    no: 'U-08',
    undertaking: 'Retrain all payments operations colleagues on the revised procedures',
    deadline: '30 NOV 2026',
    owner: 'Payments Operations',
    status: 'on-track',
    evidence: '412 of 540 colleagues certified as at 11 Jul · sessions booked through Oct',
  },
  {
    id: 'u-09',
    no: 'U-09',
    undertaking: 'Decommission the legacy reconciliation platform and its manual workarounds',
    deadline: '31 DEC 2026',
    owner: 'Payments Technology',
    status: 'at-risk',
    evidence: 'Archive extraction running 6 weeks behind after vendor delay · recovery plan agreed 8 Jul: parallel extraction streams, board-reviewed fortnightly · residual risk to deadline held at PCO liaison meeting',
  },
  {
    id: 'u-10',
    no: 'U-10',
    undertaking: 'Commission an independent effectiveness review of the completed remediation',
    deadline: '31 MAR 2027',
    owner: 'Group Internal Audit',
    status: 'on-track',
    evidence: 'Reviewer appointed 1 Jul · terms of reference shared with PCO for comment',
  },
] as const;

export const RECORD = {
  title: 'The on-time record',
  sub: 'Milestones due vs delivered on time, by quarter — the trend the regulator watches',
  chartTitle: 'Milestones delivered on time by quarter',
  chartSource: 'Register of undertakings PCO/2025/114 · synthetic figures',
  quarters: [
    { id: 'q3-25', label: 'Q3 25', due: 6, onTime: 5 },
    { id: 'q4-25', label: 'Q4 25', due: 9, onTime: 8 },
    { id: 'q1-26', label: 'Q1 26', due: 11, onTime: 11 },
    { id: 'q2-26', label: 'Q2 26', due: 12, onTime: 12 },
    { id: 'q3-26', label: 'Q3 26 (to date)', due: 5, onTime: 5 },
  ],
} as const;

export const ATTESTATION = {
  title: 'Attestation',
  body: 'I confirm that this register is complete, that the status of each undertaking is stated without qualification, and that the Prudential Conduct Office receives this page, unedited, on the first business day of each month.',
  signer: { name: 'M. Whitfield', role: 'Chief Control Officer, Accountable Executive' },
  date: '14 July 2026',
} as const;

export const FOOT = {
  note: 'The Undertakings Register — remediation commitments as numbered undertakings with unambiguous status lozenges and an evidence line each. All undertakings and figures are synthetic.',
  next: 'NEXT SUBMISSION TO PCO · 3 AUG 2026 · THIS PAGE, UNEDITED',
} as const;
