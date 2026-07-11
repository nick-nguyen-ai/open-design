import type { DesignGrammar } from '@enterprise-design/contracts';

/**
 * Living System (plan §9) — state and flow animation. Lighter catalogue
 * grammar (complete and schema-valid; not one of the four RICH grammars).
 * Strongest surfaces: project pages, explainers.
 */
const livingSystem: DesignGrammar = {
  id: 'living-system',
  name: 'Living System',
  intent:
    'A grammar for content whose subject is itself a process with state — an incident lifecycle, a model lifecycle, an agent workflow — where the layout\'s job is to make the current state and its possible transitions visible together.',
  layoutRules: [
    'The full state machine or lifecycle is always shown, with the current state visually emphasised rather than shown in isolation.',
    'Transition history (how the current state was reached) is available inline, not in a separate audit log page.',
  ],
  typographyRules: [
    'State names are set as short, consistent labels (never re-worded per context) so the same state reads identically everywhere it appears.',
  ],
  navigationRules: [
    'Navigating to a specific state or stage scrolls/pans the view to it without losing the full lifecycle from view.',
  ],
  chartRules: [
    'Where charts appear, they plot state duration or transition frequency — metrics about the process itself, not general business metrics.',
  ],
  diagramRules: [
    'The lifecycle/workflow diagram has a stable id per state and per transition, and highlights the current state distinctly from shape/icon, not colour alone.',
  ],
  motionRules: [
    'State changes reveal with `data-ink-draw`, read here as current-state → transition path → history, so a change is legible as a process, not a jump cut.',
    '`horizon-sweep` is used only for whole-page entry, establishing the datum before the lifecycle diagram itself draws in.',
  ],
  signatureSequences: ['data-ink-draw', 'horizon-sweep'],
  surfaceRules: [
    'Primary home is project pages and explainers whose subject is a lifecycle, workflow, or incident process.',
  ],
  preferredComponents: ['comp.flow-diagram', 'comp.status-list'],
  prohibitedPatterns: [
    'Showing only the current state without the surrounding lifecycle (loses the "living system" context).',
    'Colour-only distinction between current and past states.',
  ],
  accessibilityNotes: [
    'Current state is always labelled in text, not conveyed by animation or colour alone.',
    'Reduced-motion mode shows the settled lifecycle diagram directly with the current state pre-highlighted.',
  ],
  exampleExperienceIds: [
    'db-incident-remediation-centre',
    'proj-model-lifecycle-workspace',
    'deck-transformation-roadmap',
    'home-internal-ai-tool-laboratory',
    'exp-agent-workflow',
  ],
};

export default livingSystem;
