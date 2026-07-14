/**
 * World-template descriptor for "The T-Minus" (`deck-product-launch`).
 *
 * Task 3 compiles every `*.worldtemplate.manifest.ts` into
 * `packages/registry/generated/world-templates.json`, so the default export must
 * be a JSON-serializable {@link WorldTemplateDescriptor}. The slot specs and
 * craft guidance are drawn from `tminus-fill.ts` — one source of truth for the
 * template's content contract. Parsing here guarantees the shipped descriptor is
 * valid before it ever reaches the registry.
 *
 * Targeting: `audiences: ['mixed', 'technical']` + product-launch intents win a
 * product-introduction brief (launch / announce / release / product) while
 * leaving the existing selections stable — an executive/business brief still
 * lands on the conventional Quarter, and an art-directed hint over an
 * executive/business audience still resolves to the Cutover on the id tie-break.
 */
import { WorldTemplateDescriptor } from '@enterprise-design/contracts';
import { TMINUS_SLIDE_KINDS, TMINUS_GUIDANCE } from './tminus-fill.js';

const descriptor: WorldTemplateDescriptor = WorldTemplateDescriptor.parse({
  schemaVersion: '1.0',
  id: 'tminus',
  experienceId: 'deck-product-launch',
  surface: 'slide-deck',
  style: 'art-directed',
  mood: 'dark',
  grammarId: 'monumental-type',
  audiences: ['mixed', 'technical'],
  businessIntents: ['plan-product-launch', 'announce-product-release'],
  componentsUsed: ['comp.status-list', 'comp.kpi-tile'],
  slideKinds: TMINUS_SLIDE_KINDS,
  guidance: TMINUS_GUIDANCE,
  craftRules: ['exactly-one-blocked-gate', 'notice-required'],
});

export default descriptor;
