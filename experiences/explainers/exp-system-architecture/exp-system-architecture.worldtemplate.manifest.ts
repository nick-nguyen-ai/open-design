/**
 * World-template descriptor for "The Drawing Office" (`exp-system-architecture`).
 *
 * The FIRST (and currently only) TECHNICAL-EXPLAINER world-template the MCP can
 * compose. Task 3 compiles every `*.worldtemplate.manifest.ts` into
 * `packages/registry/generated/world-templates.json`, so the default export must
 * be a JSON-serializable {@link WorldTemplateDescriptor}. The slot specs and
 * craft guidance are drawn from `drawing-office-fill.ts` — one source of truth
 * for the template's content contract. Parsing here guarantees the shipped
 * descriptor is valid before it ever reaches the registry.
 *
 * Targeting: `surface: 'technical-explainer'` (its own pre-filter pool) + the
 * architecture/system briefKeywords win any system-architecture explainer brief;
 * the style/mood/grammarId/audiences/businessIntents mirror the shipped
 * experience manifest.
 */
import { WorldTemplateDescriptor } from '@enterprise-design/contracts';
import { DRAWING_OFFICE_SECTIONS, DRAWING_OFFICE_GUIDANCE } from './drawing-office-fill.js';

const descriptor: WorldTemplateDescriptor = WorldTemplateDescriptor.parse({
  schemaVersion: '1.1',
  id: 'drawing-office',
  experienceId: 'exp-system-architecture',
  surface: 'technical-explainer',
  style: 'art-directed',
  mood: 'light',
  grammarId: 'technical-blueprint',
  audiences: ['technical', 'mixed'],
  businessIntents: ['onboard-new-engineers', 'support-architecture-review'],
  briefKeywords: ['architecture', 'system', 'services', 'integration', 'diagram', 'data-flow', 'components', 'as-built'],
  componentsUsed: ['comp.flow-diagram', 'comp.category-bar-chart'],
  sections: DRAWING_OFFICE_SECTIONS,
  guidance: DRAWING_OFFICE_GUIDANCE,
  craftRules: [
    {
      kind: 'exactly-one',
      path: 'drawing.nodes',
      field: 'emphasis',
      equals: 'constrained',
      description: 'Exactly one drawn part carries emphasis constrained — the single hatched, NOTE-flagged capacity constraint the schedule, drawing, and FIG 4.1 all point at.',
    },
    {
      kind: 'required-nonempty',
      path: 'sheet.dataNotice',
      description: 'sheet.dataNotice must state data provenance (synthetic or sourced).',
    },
  ],
});

export default descriptor;
