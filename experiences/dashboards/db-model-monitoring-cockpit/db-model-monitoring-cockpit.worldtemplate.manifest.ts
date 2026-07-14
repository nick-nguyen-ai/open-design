/**
 * World-template descriptor for "The Cockpit" (`db-model-monitoring-cockpit`).
 *
 * The FIRST non-deck (dashboard) world-template the MCP can compose. Task 3
 * compiles every `*.worldtemplate.manifest.ts` into
 * `packages/registry/generated/world-templates.json`, so the default export must
 * be a JSON-serializable {@link WorldTemplateDescriptor}. The slot specs and
 * craft guidance are drawn from `cockpit-fill.ts` — one source of truth for the
 * template's content contract. Parsing here guarantees the shipped descriptor is
 * valid before it ever reaches the registry.
 *
 * Targeting: `surface: 'dashboard'` (its own pre-filter pool) + the
 * monitoring/drift briefKeywords win any model-monitoring dashboard brief; the
 * style/mood/grammarId/audiences/businessIntents mirror the shipped experience
 * manifest.
 */
import { WorldTemplateDescriptor } from '@enterprise-design/contracts';
import { COCKPIT_SECTIONS, COCKPIT_GUIDANCE } from './cockpit-fill.js';

const descriptor: WorldTemplateDescriptor = WorldTemplateDescriptor.parse({
  schemaVersion: '1.1',
  id: 'cockpit',
  experienceId: 'db-model-monitoring-cockpit',
  surface: 'dashboard',
  style: 'art-directed',
  mood: 'dark',
  grammarId: 'precision-grid',
  audiences: ['technical', 'risk-and-governance'],
  businessIntents: ['monitor-model-health', 'detect-drift-early'],
  briefKeywords: ['monitoring', 'drift', 'model', 'psi', 'fleet', 'inference', 'latency', 'alerts'],
  componentsUsed: ['comp.trend-chart', 'comp.category-bar-chart', 'comp.status-list', 'comp.kpi-tile'],
  sections: COCKPIT_SECTIONS,
  guidance: COCKPIT_GUIDANCE,
  craftRules: [
    {
      kind: 'exactly-one',
      path: 'fleet.models',
      field: 'status',
      equals: 'breach',
      description: 'Exactly one fleet model carries status breach — the single flagged contact past its limit.',
    },
    {
      kind: 'required-nonempty',
      path: 'watch.dataNotice',
      description: 'watch.dataNotice must state data provenance (synthetic or sourced).',
    },
  ],
});

export default descriptor;
