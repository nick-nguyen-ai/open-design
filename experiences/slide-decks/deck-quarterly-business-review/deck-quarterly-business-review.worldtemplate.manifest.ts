/**
 * World-template descriptor for "The Quarter" (`deck-quarterly-business-review`).
 *
 * Task 3 compiles every `*.worldtemplate.manifest.ts` into
 * `packages/registry/generated/world-templates.json`, so the default export must
 * be a JSON-serializable {@link WorldTemplateDescriptor}. The slot specs and
 * craft guidance are drawn from `quarter-fill.ts` — one source of truth for the
 * template's content contract. Parsing here guarantees the shipped descriptor is
 * valid before it ever reaches the registry.
 */
import { WorldTemplateDescriptor } from '@enterprise-design/contracts';
import { QUARTER_SECTIONS, QUARTER_GUIDANCE } from './quarter-fill.js';

const descriptor: WorldTemplateDescriptor = WorldTemplateDescriptor.parse({
  schemaVersion: '1.1',
  id: 'quarter',
  experienceId: 'deck-quarterly-business-review',
  surface: 'slide-deck',
  style: 'conventional',
  mood: 'light',
  grammarId: 'precision-grid',
  audiences: ['executive', 'business'],
  businessIntents: ['review-quarterly-performance', 'brief-the-board'],
  componentsUsed: ['comp.kpi-tile', 'comp.trend-chart', 'comp.category-bar-chart'],
  sections: QUARTER_SECTIONS,
  guidance: QUARTER_GUIDANCE,
  craftRules: [
    { kind: 'exactly-one', path: 'kpis', field: 'status', equals: 'off-track',
      description: 'Exactly one KPI carries status off-track — the single flagged anomaly the world turns on.' },
    { kind: 'required-nonempty', path: 'deck.notice',
      description: 'deck.notice must state data provenance (synthetic or sourced).' },
  ],
});

export default descriptor;
