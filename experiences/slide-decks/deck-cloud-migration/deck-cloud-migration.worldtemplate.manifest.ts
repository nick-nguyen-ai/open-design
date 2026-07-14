/**
 * World-template descriptor for "The Cutover" (`deck-cloud-migration`).
 *
 * Task 3 compiles every `*.worldtemplate.manifest.ts` into
 * `packages/registry/generated/world-templates.json`, so the default export must
 * be a JSON-serializable {@link WorldTemplateDescriptor}. The slot specs and
 * craft guidance are drawn from `cutover-fill.ts` — one source of truth for the
 * template's content contract. Parsing here guarantees the shipped descriptor is
 * valid before it ever reaches the registry.
 */
import { WorldTemplateDescriptor } from '@enterprise-design/contracts';
import { CUTOVER_SLIDE_KINDS, CUTOVER_GUIDANCE } from './cutover-fill.js';

const descriptor: WorldTemplateDescriptor = WorldTemplateDescriptor.parse({
  schemaVersion: '1.0',
  id: 'cutover',
  experienceId: 'deck-cloud-migration',
  surface: 'slide-deck',
  style: 'art-directed',
  mood: 'light',
  grammarId: 'technical-blueprint',
  audiences: ['technical', 'risk-and-governance'],
  businessIntents: ['plan-cloud-migration', 'commit-cutover'],
  componentsUsed: ['comp.flow-diagram', 'comp.status-list'],
  slideKinds: CUTOVER_SLIDE_KINDS,
  guidance: CUTOVER_GUIDANCE,
  craftRules: [
    { kind: 'exactly-one', path: 'nodes', field: 'disposition', equals: 'stays',
      description: 'Exactly one estate node carries disposition stays — the single deliberate exception.' },
    { kind: 'required-nonempty', path: 'deck.notice',
      description: 'deck.notice must state data provenance (synthetic or sourced).' },
  ],
});

export default descriptor;
