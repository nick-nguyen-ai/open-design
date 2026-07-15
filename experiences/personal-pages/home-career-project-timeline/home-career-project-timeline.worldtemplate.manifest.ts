/**
 * World-template descriptor for "The Line" (`home-career-project-timeline`).
 *
 * The FIRST (and currently only) PERSONAL-PAGE world-template the MCP can
 * compose. Task 3 compiles every `*.worldtemplate.manifest.ts` into
 * `packages/registry/generated/world-templates.json`, so the default export must
 * be a JSON-serializable {@link WorldTemplateDescriptor}. The slot specs and
 * craft guidance are drawn from `the-line-fill.ts` — one source of truth for the
 * template's content contract. Parsing here guarantees the shipped descriptor is
 * valid before it ever reaches the registry.
 *
 * Targeting: `surface: 'personal-page'` (its own pre-filter pool) + the
 * career/timeline/portfolio briefKeywords win any personal career-timeline brief;
 * the style/mood/grammarId/audiences/businessIntents mirror the shipped
 * experience manifest.
 */
import { WorldTemplateDescriptor } from '@enterprise-design/contracts';
import { THE_LINE_SECTIONS, THE_LINE_GUIDANCE } from './the-line-fill.js';

const descriptor: WorldTemplateDescriptor = WorldTemplateDescriptor.parse({
  schemaVersion: '1.1',
  id: 'the-line',
  experienceId: 'home-career-project-timeline',
  surface: 'personal-page',
  style: 'art-directed',
  mood: 'dark',
  grammarId: 'kinetic-intelligence',
  audiences: ['personal-internal'],
  businessIntents: ['showcase-career-trajectory', 'connect-projects-to-outcomes'],
  briefKeywords: ['career', 'timeline', 'portfolio', 'projects', 'journey', 'profile', 'trajectory', 'personal'],
  // The visible craft is a bespoke SVG survey line, a native register table, and
  // the data-ink-draw motion sequence; the component palette mirrors the shipped
  // experience manifest (the world's declared components).
  componentsUsed: ['comp.trend-chart', 'comp.status-list'],
  sections: THE_LINE_SECTIONS,
  guidance: THE_LINE_GUIDANCE,
  craftRules: [
    {
      kind: 'exactly-one',
      path: 'line.nodes',
      field: 'kind',
      equals: 'switchback',
      description:
        'Exactly one line node carries kind switchback — the single honest detour the whole page is arranged around (drawn as a loop on the rail, labelled with what it taught, and flagged in the mirror table). This is the personal-page anomaly analogue: a career drawn with a real reversal left in, not airbrushed.',
    },
    {
      kind: 'required-nonempty',
      path: 'chrome.syntheticMark',
      description:
        'chrome.syntheticMark must state the profile is illustrative/synthetic where entries are not real; it prints as the chrome synthetic-mark badge and is reinforced in the footer and the accessible hero notice. Personal pages present a PERSON, so the provenance notice is mandatory whenever any entry is illustrative.',
    },
  ],
});

export default descriptor;
