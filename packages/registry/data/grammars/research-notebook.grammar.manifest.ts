import type { DesignGrammar } from '@enterprise-design/contracts';

/**
 * Research Notebook (plan §9) — evidence and annotation. Lighter catalogue
 * grammar (complete and schema-valid; not one of the four RICH grammars).
 * Strongest surfaces: personal, project, slides.
 */
const researchNotebook: DesignGrammar = {
  id: 'research-notebook',
  name: 'Research Notebook',
  intent:
    'A grammar for content that must show its working — hypotheses, evidence, method, result — so a sceptical reader can audit the reasoning, not just accept the conclusion.',
  layoutRules: [
    'Each entry follows a consistent structure (question, method, evidence, conclusion) so entries are comparable at a glance.',
    'Evidence (charts, data tables, references) sits directly beside the claim it supports, never in a separate appendix.',
  ],
  typographyRules: [
    'Claims and evidence are typographically distinguished (e.g. claim in body weight, evidence caption in a lighter, smaller annotation style).',
    'Dates and provenance metadata are always present in a consistent, quiet annotation style beside each entry.',
  ],
  navigationRules: [
    'Entries are browsable chronologically by default, with a filter to reorder by topic or status without losing the chronological option.',
  ],
  chartRules: [
    'Every chart states its method or data source directly beneath it — a Research Notebook chart is never presented without its provenance.',
  ],
  diagramRules: [
    'Diagrams used to explain method or lineage carry the same evidentiary labelling as charts — source, date, and scope stated directly on the diagram.',
  ],
  motionRules: [
    'New entries or sections register with `horizon-sweep`, paging in like a notebook entry being turned to, consistent with the entry-by-entry structure.',
    'Evidence charts within an entry draw with `data-ink-draw`, so the reader sees the evidence build the way it was actually gathered (axes, then series, then annotation).',
  ],
  signatureSequences: ['horizon-sweep', 'data-ink-draw'],
  surfaceRules: [
    'Primary home is personal experiment/research pages and project pages built around validation or investigation evidence; usable for evidence-heavy slide decks.',
  ],
  preferredComponents: ['comp.trend-chart', 'comp.status-list', 'comp.kpi-tile'],
  prohibitedPatterns: [
    'Claims presented without adjacent, attributable evidence.',
    'Charts with no stated data source or collection window.',
  ],
  accessibilityNotes: [
    'Evidence captions are real text (not baked into an image), so they are available to screen readers and to text search alike.',
    'Reduced-motion mode presents each entry\'s claim and evidence together in a single opacity step, in the same chronological order.',
  ],
  exampleExperienceIds: [
    'db-experiment-analysis-workspace',
    'proj-ai-model-validation-hub',
    'proj-research-innovation-initiative',
    'deck-genai-model-validation-report',
    'home-data-scientist-studio',
    'home-ai-experiment-notebook',
    'exp-incident-postmortem',
  ],
};

export default researchNotebook;
