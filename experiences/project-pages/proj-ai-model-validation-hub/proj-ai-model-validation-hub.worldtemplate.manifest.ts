/**
 * World-template descriptor for "The Validation Ledger"
 * (`proj-ai-model-validation-hub`).
 *
 * The FIRST (and currently only) PROJECT-PAGE world-template the MCP can
 * compose. Task 3 compiles every `*.worldtemplate.manifest.ts` into
 * `packages/registry/generated/world-templates.json`, so the default export must
 * be a JSON-serializable {@link WorldTemplateDescriptor}. The slot specs and
 * craft guidance are drawn from `ledger-fill.ts` — one source of truth for the
 * template's content contract. Parsing here guarantees the shipped descriptor is
 * valid before it ever reaches the registry.
 *
 * Targeting: `surface: 'project-page'` (its own pre-filter pool) + the
 * project/programme/validation briefKeywords win any model-validation programme
 * hub brief; the style/mood/grammarId/audiences/businessIntents mirror the
 * shipped experience manifest.
 */
import { WorldTemplateDescriptor } from '@enterprise-design/contracts';
import { LEDGER_SECTIONS, LEDGER_GUIDANCE } from './ledger-fill.js';

const descriptor: WorldTemplateDescriptor = WorldTemplateDescriptor.parse({
  schemaVersion: '1.1',
  id: 'ledger',
  experienceId: 'proj-ai-model-validation-hub',
  surface: 'project-page',
  style: 'art-directed',
  mood: 'light',
  grammarId: 'research-notebook',
  audiences: ['technical', 'risk-and-governance'],
  businessIntents: ['centralise-validation-evidence', 'track-sign-off-status'],
  briefKeywords: ['project', 'programme', 'validation', 'models', 'pipeline', 'sign-off', 'status', 'governance'],
  componentsUsed: ['comp.status-list', 'comp.trend-chart', 'comp.flow-diagram', 'comp.kpi-tile'],
  sections: LEDGER_SECTIONS,
  guidance: LEDGER_GUIDANCE,
  craftRules: [
    {
      kind: 'exactly-one',
      path: 'pipeline.models',
      field: 'status',
      equals: 'stalled',
      description: 'Exactly one ledger model carries status stalled — the single flagged item held past the stall threshold that the whole page is arranged around.',
    },
    {
      kind: 'required-nonempty',
      path: 'office.editionLine',
      description: 'office.editionLine must state data provenance (synthetic or sourced); it prints as the footer edition line.',
    },
  ],
});

export default descriptor;
