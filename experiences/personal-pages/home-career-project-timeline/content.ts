/**
 * The shipped fill for "The Line" — the live rendering of
 * `home-career-project-timeline`.
 *
 * THE WORLD: a career drawn as ONE continuous survey line running down the page
 * through the years — projects are STATIONS, promotions are GAUGE CHANGES where
 * the line visibly thickens, side-projects are BRANCH lines that either terminate
 * or rejoin carrying something back, and one honest SWITCHBACK records a two-year
 * detour that was reversed out of (the anomaly the eye goes to). All the craft
 * lives in `TheLineTemplate.tsx`; this file carries only the CONTENT, validated
 * against {@link TheLineFill} at load, so the shipped line is itself a proof that
 * the contract admits the real design.
 *
 * Everything here is TYPED and DETERMINISTIC. The profile is ILLUSTRATIVE AND
 * SYNTHETIC (the page carries the mark in `chrome.syntheticMark`); the
 * institution is unnamed and the magnitudes are credible but invented. The one
 * deliberate anomaly is the Northbridge migration switchback — a two-year detour
 * reversed out at 70% cutover, left in honestly.
 */
import { TheLineFill } from './the-line-fill.js';

export const theLineFill: TheLineFill = TheLineFill.parse({
  chrome: {
    pageTitle: 'The Line',
    world: 'THE LINE · PERSONAL PAGE',
    service: 'SERVICE · LINE OPEN 2014 · STILL RUNNING',
    syntheticMark: 'ILLUSTRATIVE PROFILE · SYNTHETIC',
    footerProvenance: 'ILLUSTRATIVE PROFILE · SYNTHETIC · SAMPLE CONTENT IS MARKED AS SUCH',
    footerService: 'LINE OPEN 2014 · STILL RUNNING',
  },

  hero: {
    kicker: 'THE LINE',
    statementLines: ['One line,', 'twelve years,', 'no gaps hidden.'],
    person: {
      name: 'Marcus Adeyemi',
      role: 'Principal ML Engineer',
      team: 'Decisioning Platform',
      location: 'Melbourne',
    },
    subline:
      'A career is not a list of job titles — it is a single line that thickens where I grew, branches where I gambled, and once doubled back on itself. This is that line, drawn honestly, with the detour left in.',
    syntheticNotice:
      'This entire profile is illustrative and synthetic — a demonstration person, not a real member of staff. Projects, dates and figures are sample content.',
    facts: [
      { label: 'LINE OPENED', value: '2014' },
      { label: 'STATIONS', value: '9 shipped' },
      { label: 'GAUGE', value: 'analyst → principal' },
      { label: 'STILL RUNNING', value: 'yes' },
    ],
  },

  line: {
    sectionTitle: 'THE LINE',
    sectionSub: 'STATION = PROJECT · GAUGE = GRADE · BRANCH = SIDE-PROJECT · ONE SWITCHBACK, LEFT IN',
    originLabel: 'LINE OPEN · 2014',
    gaugeRoles: {
      1: 'Analyst',
      2: 'Senior Analyst',
      3: 'Lead',
      4: 'Principal',
    },
    nodes: [
      {
        id: 'n-2014',
        kind: 'station',
        code: 'DP-01',
        year: '2014',
        name: 'Graduate intake — fraud rules desk',
        gauge: 1,
        outcome: 'First model in production; rule-set false positives down 18%.',
      },
      {
        id: 'n-2016',
        kind: 'station',
        code: 'DP-02',
        year: '2016',
        name: 'Risk data mart consolidation',
        gauge: 1,
        outcome: 'Nine source systems folded into one governed mart.',
      },
      {
        id: 'n-2017',
        kind: 'gauge-change',
        code: 'DP-03',
        year: '2017',
        name: 'Credit scorecard rebuild',
        gauge: 2,
        promotion: 'GAUGE CHANGE · ANALYST → SENIOR',
        outcome: 'Median approval time 6 days → 2 days on 40k applications/mo.',
      },
      {
        id: 'n-2018',
        kind: 'branch',
        code: 'DP-B1',
        year: '2018',
        name: 'Hack-week anomaly detector',
        gauge: 2,
        outcome: 'Prototype flagged 3 live incidents in a fortnight.',
        branch: {
          fate: 'terminated',
          carried: 'Shelved — no owner, no on-call. Terminated honestly rather than left to rot.',
        },
      },
      {
        id: 'n-2019',
        kind: 'switchback',
        code: 'DP-XX',
        year: '2019–2021',
        name: 'The Northbridge migration',
        gauge: 2,
        outcome: 'Two years in; reversed out at 70% cutover.',
        detour: {
          span: 'TWO-YEAR DETOUR · REVERSED OUT',
          lesson:
            'A doomed platform migration I backed and could not save. We rolled the whole thing back. It taught me to demand a rollback plan before the first commit — a rule I have never broken since.',
        },
      },
      {
        id: 'n-2021',
        kind: 'station',
        code: 'DP-05',
        year: '2021',
        name: 'Model risk monitoring platform',
        gauge: 2,
        outcome: 'Twelve production models under one drift watch.',
      },
      {
        id: 'n-2022',
        kind: 'gauge-change',
        code: 'DP-06',
        year: '2022',
        name: 'Decisioning ML guild',
        gauge: 3,
        promotion: 'GAUGE CHANGE · SENIOR → LEAD',
        outcome: 'Stood up a practice of 24 engineers across 5 squads.',
      },
      {
        id: 'n-2023',
        kind: 'branch',
        code: 'DP-B2',
        year: '2023',
        name: 'Feature store spike',
        gauge: 3,
        outcome: 'Weekend spike → serves 40 features to 6 teams.',
        branch: {
          fate: 'rejoined',
          carried: 'Rejoined the main line as shared infrastructure — the side-bet that paid its way back.',
        },
      },
      {
        id: 'n-2024',
        kind: 'station',
        code: 'DP-08',
        year: '2024',
        name: 'Real-time fraud, second generation',
        gauge: 3,
        outcome: 'Caught $4.2M in attempted fraud at 40ms p99 decision latency.',
      },
      {
        id: 'n-2025',
        kind: 'gauge-change',
        code: 'DP-09',
        year: '2025',
        name: 'Validation partnership',
        gauge: 4,
        promotion: 'GAUGE CHANGE · LEAD → PRINCIPAL',
        outcome: 'Median model approval 9 days → 4 days across the fleet.',
      },
    ],
    terminus: {
      code: 'DP-10',
      label: 'NEXT STATION · UNDER SURVEY',
      name: 'Causal decisioning',
      intent:
        'Moving the bank from prediction to intervention — decisions that change outcomes, not just forecast them. Surveyed, not yet cut. Stated as intent, not as a promise.',
    },
  },

  interchange: {
    sectionTitle: 'INTERCHANGES',
    sectionSub: 'WHERE THIS LINE CROSSED OTHER PEOPLE’S',
    items: [
      {
        id: 'x-1',
        code: 'IX-A',
        station: 'DP-05 · Model risk platform',
        crossedWith: 'Model Validation office',
        note: 'Two years of monthly read-outs turned an audit relationship into a design partnership.',
      },
      {
        id: 'x-2',
        code: 'IX-B',
        station: 'DP-06 · ML guild',
        crossedWith: 'Priya Menon — Streaming Platform',
        note: 'Her pipelines under my models; we shared an on-call rotation for a year.',
      },
      {
        id: 'x-3',
        code: 'IX-C',
        station: 'DP-08 · Real-time fraud',
        crossedWith: 'Financial Crime operations',
        note: 'Ops analysts sat with us for the whole build — the line runs through their floor now.',
      },
      {
        id: 'x-4',
        code: 'IX-D',
        station: 'DP-B2 · Feature store',
        crossedWith: 'Six adopting squads',
        note: 'The branch that rejoined carried their requirements back onto the main line.',
      },
    ],
  },

  register: {
    sectionTitle: 'STATION REGISTER',
    sectionSub: 'THE LINE AS A DATED TABLE — THE ACCESSIBLE MIRROR',
    caption:
      'Every station on the line in date order: code, year, project, grade in force, and outcome. The dated equivalent of the drawn line above.',
  },
});

/** Standard certifier alias (Task 5): the shipped fill instance. */
export const SHIPPED_FILL = theLineFill;
