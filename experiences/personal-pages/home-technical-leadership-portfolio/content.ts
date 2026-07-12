/**
 * Content pack for "The Annual Letter" — the live rendering of
 * `home-technical-leadership-portfolio`.
 *
 * A principal engineer's page written and set like a chairman's annual
 * letter: ivory letterpress paper, ink serif, restraint. Leadership measured
 * not by what one holds but by what runs without them — so the record counts
 * systems handed over and retired, and the letter itself admits, in its own
 * required section, what the author got wrong in FY26.
 *
 * Everything here is TYPED and DETERMINISTIC. The profile is ILLUSTRATIVE
 * AND SYNTHETIC (the page carries the mark). Systems cross-reference the
 * shipped universe — the Drawing Office (drawing register), the Validation
 * Ledger, the Model Risk Control Room — the same bank seen from the platform.
 */

/* ------------------------------------------------------------------ */
/* Identity                                                            */
/* ------------------------------------------------------------------ */

export const PERSON = {
  name: 'Priya Balakrishnan',
  role: 'Principal Engineer',
  discipline: 'Platform Engineering',
  location: 'Sydney',
  tenureLine: 'TWELFTH YEAR · PLATFORM ENGINEERING',
  syntheticMark: 'ILLUSTRATIVE PROFILE · SYNTHETIC',
  filed: 'FILED FY26 · FOR THE PLATFORM REVIEW',
  reportsToward: 'DISTINGUISHED ENGINEER',
} as const;

/** The masthead name, set as two lines so the display type can breathe. */
export const MASTHEAD: readonly string[] = ['Priya', 'Balakrishnan'];

export const STANDFIRST =
  'A letter on twelve years of platform work — what we built, what I handed over, and what I got wrong this year. I have measured the record the only way that lasts: by what still runs without me.';

/* ------------------------------------------------------------------ */
/* The tenure engraving — the commanding visual                        */
/* ------------------------------------------------------------------ */

export type SystemStatus = 'runs' | 'handed' | 'retired' | 'sunset';

export const SYSTEM_STATUS_LABEL: Record<SystemStatus, string> = {
  runs: 'IN SERVICE',
  handed: 'HANDED OVER',
  retired: 'RETIRED',
  sunset: 'SUNSET BY DESIGN',
};

export interface TenureSystem {
  id: string;
  /** Short name for the engraving stem. */
  name: string;
  /** Calendar year the system entered service — its position on the datum. */
  year: number;
  /** Stem direction from the datum line. */
  side: 'above' | 'below';
  status: SystemStatus;
  /** Who or what carries it now — leadership measured by succession. */
  successor?: string;
  /** One-line note carried in the record table. */
  note: string;
  /** Cross-reference into the shipped universe, in mono microtype. */
  crossRef?: string;
}

export const TENURE_START = 2015;
export const TENURE_END = 2026;

export const SYSTEMS: readonly TenureSystem[] = [
  {
    id: 'provisioning',
    name: 'Provisioning Fabric',
    year: 2016,
    side: 'below',
    status: 'handed',
    successor: 'Runtime Platform guild',
    note: 'First fleet-wide provisioning plane. Handed to the guild in FY20; still the substrate under everything below.',
    crossRef: 'SUBSTRATE · 11 TEAMS',
  },
  {
    id: 'deploy-v1',
    name: 'Deploy Pipeline v1',
    year: 2017,
    side: 'above',
    status: 'retired',
    successor: 'Deploy Pipeline v3',
    note: 'Retired FY22 once v3 reached parity. Kept in the record because it taught the release model everything since inherits.',
    crossRef: 'SUPERSEDED · v3',
  },
  {
    id: 'mesh',
    name: 'Service Mesh',
    year: 2019,
    side: 'below',
    status: 'runs',
    note: 'Carries north-south traffic for the decisioning estate. Runs unattended; I have not been paged for it in two years.',
    crossRef: 'cf. CUSTOMER DECISIONING',
  },
  {
    id: 'schema',
    name: 'Schema Registry',
    year: 2020,
    side: 'above',
    status: 'handed',
    successor: 'Data Platform team',
    note: 'The contract layer between producers and models. Handed to Data Platform FY23 with its own on-call and its own budget.',
    crossRef: 'CONTRACTS · 400+ SCHEMAS',
  },
  {
    id: 'incident',
    name: 'Incident Ledger',
    year: 2021,
    side: 'below',
    status: 'runs',
    note: 'Every production incident, timestamped and blameless. Feeds the risk desk the numbers the night watch reads at 02:47.',
    crossRef: 'cf. MODEL RISK CONTROL ROOM',
  },
  {
    id: 'drawing-office',
    name: 'The Drawing Office',
    year: 2022,
    side: 'above',
    status: 'runs',
    note: 'The architecture-of-record: every system drawn once, drawn well. The register other teams cite in reviews.',
    crossRef: 'DRG. 8836-C',
  },
  {
    id: 'cost-governor',
    name: 'Cost Governor',
    year: 2023,
    side: 'below',
    status: 'sunset',
    successor: 'FinOps native controls',
    note: 'We built it, it worked, and then the cloud shipped the same control natively. We turned it off on purpose — the anomaly on this line.',
    crossRef: 'SUNSET BY DESIGN · FY26',
  },
  {
    id: 'validation-ledger',
    name: 'Validation Ledger',
    year: 2024,
    side: 'above',
    status: 'handed',
    successor: 'Model Risk & Validation',
    note: 'The platform under model validation. Handed to Model Risk FY26; it now runs their programme, not mine.',
    crossRef: 'cf. THE VALIDATION LEDGER',
  },
  {
    id: 'runtime-v4',
    name: 'Runtime Platform v4',
    year: 2026,
    side: 'below',
    status: 'runs',
    note: 'This year’s work: one runtime, one deploy path, one bill. In service since P06, migrating the long tail through P11.',
    crossRef: 'IN FLIGHT · P06→P11',
  },
];

/* ------------------------------------------------------------------ */
/* The letter — first-person prose, in reading order                   */
/* ------------------------------------------------------------------ */

export interface LetterSection {
  id: string;
  /** Roman numeral marker, engraving style. */
  numeral: string;
  heading: string;
  /** Paragraphs of real first-person prose — no lorem. */
  body: readonly string[];
  /** Marginalia for this section: dates, system names, cross-refs (mono). */
  margin: readonly string[];
  /** The required credibility section carries the anomaly flag. */
  flagged?: boolean;
}

export const LETTER: readonly LetterSection[] = [
  {
    id: 'built',
    numeral: 'I',
    heading: 'On what we built',
    body: [
      'Twelve years ago the bank deployed software the way it moved money: carefully, by hand, and rarely. The platform we built since is the quiet answer to that — a provisioning fabric, a mesh, a deploy path, a schema contract, an incident ledger. None of it is glamorous. All of it is load-bearing.',
      'I have learned to distrust the pride I feel in a system I still touch. The systems I am proudest of are the ones I have not opened in a year: the mesh that carries decisioning traffic and never pages me, the schema registry that now belongs to another team with its own budget. Pride in a running system I no longer hold is the only pride that compounds.',
    ],
    margin: ['2015 — JOINED', 'PROVISIONING FABRIC · 2016', 'SERVICE MESH · 2019', 'DRG. 8836-C'],
  },
  {
    id: 'without',
    numeral: 'II',
    heading: 'On what runs without me',
    body: [
      'The truest measure of platform leadership is subtraction. Four of the nine systems on the record are no longer mine to run — two handed to teams that operate them better than I did, one retired the day its successor reached parity, one turned off on purpose. That is the work: to build something well enough that it can leave you.',
      'This year the Validation Ledger left. It is the platform under model validation, and it now runs the Model Risk programme — their on-call, their roadmap, their credit. I signed off the handover in P04 and have deliberately not looked at its dashboards since. A handover you keep watching is not a handover; it is a hostage.',
    ],
    margin: ['HANDED · 4 OF 9', 'VALIDATION LEDGER → MODEL RISK', 'P04 · HANDOVER SIGNED', 'cf. THE VALIDATION LEDGER'],
  },
  {
    id: 'wrong',
    numeral: 'III',
    heading: 'What I got wrong in FY26',
    flagged: true,
    body: [
      'I built the Cost Governor a year too late and kept it a year too long. We shipped it in FY23 to claw back spend the cloud gave us no native lever over — and it worked, it saved real money. But the platform provider shipped the same control natively eighteen months later, and I let ours run for two more quarters out of attachment to a thing that had been good. That is the failure: not the build, the reluctance to turn it off.',
      'The lesson I am keeping is that a system earning its keep today can still be the wrong system to own tomorrow, and that the discipline of sunsetting is harder than the discipline of building. I flagged the Governor for sunset in FY26 and we retired it in P05. I would rather this letter record the mistake plainly than have the record look tidier than the year actually was.',
    ],
    margin: ['COST GOVERNOR · 2023', 'SUNSET BY DESIGN · P05 FY26', 'THE ANOMALY ON THE LINE', 'SAVED $1.4M · THEN REDUNDANT'],
  },
  {
    id: 'next',
    numeral: 'IV',
    heading: 'On what comes next',
    body: [
      'The work in flight is Runtime Platform v4: one runtime, one deploy path, one bill, replacing three that grew apart. It is in service since P06 and I intend to have handed it to a standing team before it is finished — to build the succession in from the start rather than bolt it on at the end, the way I wish I had with the Governor.',
      'I am asking the review to weigh this record the way I weigh it: by what still runs, by what left cleanly, and by the one thing I turned off on purpose. Everything else is commentary.',
    ],
    margin: ['RUNTIME PLATFORM v4 · 2026', 'IN SERVICE · P06', 'SUCCESSION BY DESIGN', 'FILED FOR REVIEW'],
  },
];

/* ------------------------------------------------------------------ */
/* Principles — pull quotes, set large                                 */
/* ------------------------------------------------------------------ */

export const PRINCIPLES: readonly string[] = [
  'Pride in a system you still touch is suspicion; pride in one that runs without you is the record.',
  'A handover you keep watching is not a handover. It is a hostage.',
  'The discipline of sunsetting is harder than the discipline of building.',
];

/* ------------------------------------------------------------------ */
/* Closing signature block                                             */
/* ------------------------------------------------------------------ */

export const SIGNATURE = {
  valediction: 'Set and filed for the platform review,',
  name: 'Priya Balakrishnan',
  role: 'Principal Engineer · Platform Engineering',
  place: 'Sydney · FY26',
} as const;

/* ------------------------------------------------------------------ */
/* Chrome                                                              */
/* ------------------------------------------------------------------ */

export const CHROME = {
  world: 'THE ANNUAL LETTER · PERSONAL PAGE',
  synthetic: 'ILLUSTRATIVE PROFILE · SYNTHETIC',
  edition: 'PLATFORM ENGINEERING · FY26 EDITION',
} as const;
