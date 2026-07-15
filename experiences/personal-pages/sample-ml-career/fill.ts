/**
 * SAMPLE fill for "The Line" world-template — the PERSONAL-PAGE surface entry in
 * the five-surface quality test of the experience-composer pipeline.
 *
 * CONTENT ONLY, authored against {@link TheLineFill} (the template in
 * `../home-career-project-timeline/TheLineTemplate.tsx` carries all the craft).
 *
 * THE STORY: an ILLUSTRATIVE COMPOSITE persona — Nadia Osei, an applied-ML
 * engineer whose ~14-year career is drawn as one survey line whose SPINE is the
 * field's own public epochs. The PERSON, her employers and her figures are
 * SYNTHETIC; the field milestones each station answers to are REAL and dated:
 *   · 2012 — AlexNet wins ImageNet (deep-learning breakout)
 *   · 2015 — TensorFlow open-sourced (Nov 9 2015)
 *   · 2017 — "Attention Is All You Need" / the Transformer (Jun 2017)
 *   · 2020 — GPT-3 (175B) released
 *   · 2022 — ChatGPT launches (Nov 30 2022)
 *   · 2024–2026 — the agentic wave
 * The single honest SWITCHBACK is a genuine career reversal: she took an
 * engineering-manager role in 2023 and stepped back down to hands-on IC work a
 * year later when the agentic wave broke without her. `chrome.syntheticMark`
 * (and the footer / accessible hero notice) declare the persona illustrative and
 * the epochs real — the personal-page honesty rule forbids inventing biography
 * for a real person, so this is an explicitly-marked composite instead.
 */
import { TheLineFill } from '../home-career-project-timeline/the-line-fill.js';

export const mlCareerFill: TheLineFill = TheLineFill.parse({
  chrome: {
    pageTitle: 'The Line',
    world: 'THE LINE · APPLIED-ML CAREER',
    service: 'SERVICE · LINE OPEN 2012 · STILL RUNNING',
    syntheticMark: 'ILLUSTRATIVE PERSONA · REAL EPOCHS',
    footerProvenance: 'ILLUSTRATIVE COMPOSITE PERSONA · REAL FIELD MILESTONES · FIGURES ARE SAMPLES',
    footerService: 'LINE OPEN 2012 · STILL RUNNING',
  },

  hero: {
    kicker: 'THE LINE',
    statementLines: ['One line,', 'fourteen years,', 'the field set the pace.'],
    person: {
      name: 'Nadia Osei',
      role: 'Principal ML Engineer',
      team: 'Applied ML Platform',
      location: 'Remote · Sydney',
    },
    subline:
      'A career is not a list of titles — it is one line that thickens where I grew, branches where I gambled, and once doubled back when I left management to build again. Its spine is the field’s: each station answers a real ML milestone of its year.',
    syntheticNotice:
      'This profile is an illustrative composite — a demonstration engineer, not a real person. The employers and figures are synthetic; only the field milestones the line answers to are real and dated.',
    facts: [
      { label: 'LINE OPENED', value: '2012 · ImageNet year' },
      { label: 'STATIONS', value: '10 logged · 1 next' },
      { label: 'GAUGE', value: 'engineer → principal' },
      { label: 'SPINE', value: 'real ML epochs' },
      { label: 'STILL RUNNING', value: 'yes' },
    ],
  },

  line: {
    sectionTitle: 'THE LINE',
    sectionSub: 'STATION = PROJECT · GAUGE = GRADE · BRANCH = SIDE-BET · ONE SWITCHBACK, LEFT IN',
    originLabel: 'LINE OPEN · 2012',
    gaugeRoles: {
      1: 'ML Engineer',
      2: 'Senior ML Engineer',
      3: 'Staff Engineer',
      4: 'Principal Engineer',
    },
    nodes: [
      {
        id: 'n-2012',
        kind: 'station',
        code: 'ML-01',
        year: '2012',
        name: 'Cheque-capture image classifier',
        gauge: 1,
        outcome: 'First CNN in production; hand-keyed fields down 22% on 8k docs/day.',
      },
      {
        id: 'n-2015',
        kind: 'gauge-change',
        code: 'ML-02',
        year: '2015',
        name: 'Recommender rebuilt on TensorFlow',
        gauge: 2,
        promotion: 'GAUGE CHANGE · ENGINEER → SENIOR',
        outcome: 'Retrained nightly on the new stack; click-through up 14%.',
      },
      {
        id: 'n-2017',
        kind: 'station',
        code: 'ML-03',
        year: '2017',
        name: 'First transformer in the stack',
        gauge: 2,
        outcome: 'Dropped the RNN; ticket-routing F1 0.71 → 0.86 on 90k/mo.',
      },
      {
        id: 'n-2018',
        kind: 'branch',
        code: 'ML-B1',
        year: '2018',
        name: 'Hack-week embeddings search',
        gauge: 2,
        outcome: 'Prototype semantic search over 2M SKUs in a fortnight.',
        branch: {
          fate: 'terminated',
          carried: 'Shelved — no owner, no serving budget. Killed honestly rather than left to rot.',
        },
      },
      {
        id: 'n-2020',
        kind: 'gauge-change',
        code: 'ML-04',
        year: '2020',
        name: 'First GPT-3 few-shot feature',
        gauge: 3,
        promotion: 'GAUGE CHANGE · SENIOR → STAFF',
        outcome: 'Few-shot draft replies live to 30k tickets/mo; no fine-tune.',
      },
      {
        id: 'n-2022',
        kind: 'station',
        code: 'ML-05',
        year: '2022',
        name: 'Support copilot, post-ChatGPT',
        gauge: 3,
        outcome: 'Shipped 3 weeks after ChatGPT; ticket deflection up to 38%.',
      },
      {
        id: 'n-2023',
        kind: 'switchback',
        code: 'ML-XX',
        year: '2023–2024',
        name: 'The management detour',
        gauge: 3,
        outcome: 'One year off the tools; reversed out when agents landed.',
        detour: {
          span: 'ONE-YEAR DETOUR · REVERSED OUT',
          lesson:
            'I took an engineering-manager role and spent a year in one-on-ones and roadmaps while the agentic wave broke without me. I stepped back down to build again, having learned I lead best with my hands on the work. A title is not a direction.',
        },
      },
      {
        id: 'n-2024',
        kind: 'station',
        code: 'ML-06',
        year: '2024',
        name: 'Agentic ops assistant, gen-1',
        gauge: 3,
        outcome: 'Multi-step agent closed 1.2k ops tickets/mo end-to-end.',
      },
      {
        id: 'n-2025',
        kind: 'branch',
        code: 'ML-B2',
        year: '2025',
        name: 'Eval harness spike',
        gauge: 3,
        outcome: 'Weekend spike → 400 graded traces gating every release.',
        branch: {
          fate: 'rejoined',
          carried: 'Rejoined the main line as shared eval infra — the side-bet that paid its way back.',
        },
      },
      {
        id: 'n-2026',
        kind: 'gauge-change',
        code: 'ML-07',
        year: '2026',
        name: 'Agent platform, org-wide',
        gauge: 4,
        promotion: 'GAUGE CHANGE · STAFF → PRINCIPAL',
        outcome: 'One agent runtime under 6 teams; p99 tool latency 90ms.',
      },
    ],
    terminus: {
      code: 'ML-08',
      label: 'NEXT STATION · UNDER SURVEY',
      name: 'Self-improving agents',
      intent:
        'Agents that write and grade their own evals, then earn the right to ship — closing by machine the loop I have spent three years wiring by hand. Surveyed, not yet cut. Stated as intent, not as a promise.',
    },
  },

  interchange: {
    sectionTitle: 'INTERCHANGES',
    sectionSub: 'WHERE THIS LINE CROSSED OTHER PEOPLE’S',
    items: [
      {
        id: 'x-1',
        code: 'IX-A',
        station: 'ML-03 · Transformer swap',
        crossedWith: 'Platform SRE guild',
        note: 'They gave the models a GPU fleet to sit on; I gave them a latency budget to hold.',
      },
      {
        id: 'x-2',
        code: 'IX-B',
        station: 'ML-05 · Support copilot',
        crossedWith: 'Devi Rao — Trust & Safety',
        note: 'Her red-team caught my prompt-injection hole before launch; we co-own the guardrails now.',
      },
      {
        id: 'x-3',
        code: 'IX-C',
        station: 'ML-06 · Agentic ops',
        crossedWith: 'Operations floor, night shift',
        note: 'Ops leads sat the whole build; the agent runs on their runbook, not my guess at it.',
      },
      {
        id: 'x-4',
        code: 'IX-D',
        station: 'ML-B2 · Eval harness',
        crossedWith: 'Every team that ships agents',
        note: 'The branch that rejoined carried their release gates back onto the main line.',
      },
    ],
  },

  register: {
    sectionTitle: 'STATION REGISTER',
    sectionSub: 'THE LINE AS A DATED TABLE — THE ACCESSIBLE MIRROR',
    caption:
      'Ten logged stations plus the one next station under survey, in date order: code, year, project, grade in force, and outcome — each answering the ML milestone of its year.',
  },
});

/** Standard sample alias: the composed fill instance. */
export const SAMPLE_FILL = mlCareerFill;
