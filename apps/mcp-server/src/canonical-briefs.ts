/**
 * The canonical-brief regression matrix.
 *
 * One row per surface pilot: a real brief + its surface-neutral `ComposeContext`
 * and the world-template id the deterministic core MUST select for it. The three
 * seed rows are the LOCKED deck outcomes — the exact contexts driving the demo
 * (`demo-client.ts` QBR case), the MCP sample (`sample-outcome.ts`), and the
 * OpenWiki skill run (`openwiki-outcome.ts`), copied here verbatim (minus the
 * fixed `surface` literal, which each row carries in its own field).
 *
 * `canonical-briefs.test.ts` iterates this matrix against the REAL registry and
 * asserts `composeForSurface` selects `expect` for every row — so the compose-core
 * extraction is provably behaviour-preserving for the shipped decks. Each pilot
 * (Tasks 7–10) appends one row when its surface goes live.
 */
import type { SurfaceType } from '@enterprise-design/contracts';
import type { ComposeContext } from './tools/compose-core.js';

/** One regression row: the surface, the template id expected, the context, and the brief. */
export interface CanonicalBrief {
  surface: SurfaceType;
  expect: string;
  context: ComposeContext;
  brief: string;
}

export const CANONICAL_BRIEFS: CanonicalBrief[] = [
  // Payments cutover — the MCP sample brief (sample-outcome.ts). NO styleHint; scoring decides.
  {
    surface: 'slide-deck',
    expect: 'cutover',
    context: {
      audience: ['technical'],
      businessIntent: ['plan-cloud-migration'],
      corporateSuitability: 'standard',
      motionPreference: 2,
    },
    brief:
      'Explain how our payments retry pipeline works and what changes in the Q3 migration — platform engineering audience.',
  },
  // OpenWiki product intro — the deck-composer skill run (openwiki-outcome.ts). styleHint art-directed.
  {
    surface: 'slide-deck',
    expect: 'tminus',
    context: {
      audience: ['mixed'],
      businessIntent: ['announce-product-release'],
      corporateSuitability: 'standard',
      motionPreference: 2,
      styleHint: 'art-directed',
    },
    brief:
      'Introduce OpenWiki, the just-released open-source agent for repo documentation — announce the launch and stage the countdown to rolling it out across our repositories: readiness gates, day-0 runbook, adoption targets.',
  },
  // QBR executive review — the demo-client business brief (demo-client.ts case 6b).
  {
    surface: 'slide-deck',
    expect: 'quarter',
    context: {
      audience: ['executive', 'business'],
      businessIntent: ['review-quarterly-performance'],
      corporateSuitability: 'restricted',
      motionPreference: 1,
    },
    brief: 'Quarterly business review of revenue, pipeline, and next-quarter priorities for the board.',
  },
  // Model-monitoring cockpit — the first dashboard pilot (Task 7). Locks the
  // 'cockpit' selection as the only live dashboard template; the row guards
  // Phase 2/3 regressions once more dashboards go live.
  {
    surface: 'dashboard',
    expect: 'cockpit',
    context: {
      audience: ['technical', 'risk-and-governance'],
      businessIntent: ['monitor-model-health', 'detect-drift-early'],
      corporateSuitability: 'standard',
      motionPreference: 1,
    },
    brief:
      'Stand up a fleet-wide model-monitoring dashboard for the model-risk team: watch every production model’s drift (PSI) against its breach limit, flag the one model in breach, and drill into its latency and feature-level diagnostics with an overnight alert log.',
  },
  // System-architecture explainer — the first technical-explainer pilot (Task 8).
  // Locks the 'drawing-office' selection as the only live technical-explainer
  // template; the row guards Phase 2/3 regressions once more explainers go live.
  {
    surface: 'technical-explainer',
    expect: 'drawing-office',
    context: {
      audience: ['technical', 'mixed'],
      businessIntent: ['onboard-new-engineers', 'support-architecture-review'],
      corporateSuitability: 'standard',
      motionPreference: 2,
    },
    brief:
      'Produce the canonical as-built explainer of our model-decision platform architecture: the components and services, how requests and data flow across trust boundaries, and where the system is capacity-constrained — one legible diagram new engineers and architecture reviewers can rely on.',
  },
  // Model-validation programme hub — the first project-page pilot (Task 9).
  // Locks the 'ledger' selection as the only live project-page template; the row
  // guards Phase 2/3 regressions once more project pages go live.
  {
    surface: 'project-page',
    expect: 'ledger',
    context: {
      audience: ['technical', 'risk-and-governance'],
      businessIntent: ['centralise-validation-evidence', 'track-sign-off-status'],
      corporateSuitability: 'restricted',
      motionPreference: 1,
    },
    brief:
      'Stand up the model-validation programme hub: one project page a validator, model owner, and committee can all point to — every in-flight model on the pipeline from intake to sign-off, the one item stalled past its review threshold flagged up front, the recent sign-off outcomes on file, and the decision log and programme status.',
  },
];
