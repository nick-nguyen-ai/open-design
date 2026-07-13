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
import { QUARTER_SLIDE_KINDS, QUARTER_GUIDANCE } from './quarter-fill.js';

const descriptor: WorldTemplateDescriptor = WorldTemplateDescriptor.parse({
  schemaVersion: '1.0',
  id: 'quarter',
  experienceId: 'deck-quarterly-business-review',
  surface: 'slide-deck',
  style: 'conventional',
  mood: 'light',
  grammarId: 'precision-grid',
  audiences: ['executive', 'business'],
  businessIntents: ['review-quarterly-performance', 'brief-the-board'],
  componentsUsed: ['comp.kpi-tile', 'comp.trend-chart', 'comp.category-bar-chart'],
  slideKinds: QUARTER_SLIDE_KINDS,
  guidance: QUARTER_GUIDANCE,
  craftRules: ['exactly-one-anomaly-kpi', 'notice-required'],
});

export default descriptor;
