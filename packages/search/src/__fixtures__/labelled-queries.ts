/**
 * The retrieval spike's labelled query set (plan §35 / task-9 brief): a
 * realistic natural-language request paired with the id (or small acceptable
 * set of ids) that should appear in the top 3 results. Spans all 5 experience
 * surfaces (dashboard, project-page, slide-deck, personal-page,
 * technical-explainer) plus component- and grammar-level requests, using real
 * ids from the compiled catalogue (`packages/registry`).
 */
export interface LabelledQuery {
  query: string;
  /** Any one of these ids appearing in the top 3 results counts as a hit. */
  expectedTopIds: string[];
}

export const LABELLED_QUERIES: LabelledQuery[] = [
  // Dashboards
  { query: 'model monitoring dashboard', expectedTopIds: ['db-model-monitoring-cockpit'] },
  { query: 'regulatory control hub dashboard', expectedTopIds: ['db-regulatory-control-hub'] },
  { query: 'delivery control tower dashboard', expectedTopIds: ['db-delivery-control-tower'] },
  { query: 'dependency network explorer dashboard', expectedTopIds: ['db-dependency-network-explorer'] },
  { query: 'data quality operations dashboard', expectedTopIds: ['db-data-quality-operations'] },
  { query: 'scenario stress simulator dashboard', expectedTopIds: ['db-scenario-stress-simulator'] },
  { query: 'AI risk command centre dashboard', expectedTopIds: ['db-ai-risk-command-centre'] },
  { query: 'portfolio performance storytelling dashboard', expectedTopIds: ['db-portfolio-performance-explorer'] },

  // Slide decks
  { query: 'AI strategy deck', expectedTopIds: ['deck-ai-strategy'] },
  { query: 'AI governance and controls deck', expectedTopIds: ['deck-ai-governance-and-controls'] },
  { query: 'experiment results slides', expectedTopIds: ['deck-experiment-results'] },
  { query: 'technical training deck', expectedTopIds: ['deck-technical-training'] },
  { query: 'transformation roadmap deck', expectedTopIds: ['deck-transformation-roadmap'] },
  { query: 'executive decision proposal deck', expectedTopIds: ['deck-executive-decision-proposal'] },
  { query: 'genai model validation report deck', expectedTopIds: ['deck-genai-model-validation-report'] },

  // Project pages
  { query: 'cloud migration programme project page', expectedTopIds: ['proj-cloud-migration-programme'] },
  { query: 'vendor risk assessment project', expectedTopIds: ['proj-vendor-assessment'] },
  { query: 'AI model validation hub project page', expectedTopIds: ['proj-ai-model-validation-hub'] },
  { query: 'model lifecycle workspace project page', expectedTopIds: ['proj-model-lifecycle-workspace'] },
  { query: 'operating model redesign project page', expectedTopIds: ['proj-operating-model-redesign'] },
  { query: 'regulatory remediation programme project page', expectedTopIds: ['proj-regulatory-remediation-programme'] },

  // Personal pages
  { query: 'career and project timeline personal page', expectedTopIds: ['home-career-project-timeline'] },
  { query: 'data scientist studio personal homepage', expectedTopIds: ['home-data-scientist-studio'] },
  { query: 'knowledge atlas personal page', expectedTopIds: ['home-knowledge-atlas'] },
  { query: 'mentoring and tutorial hub personal page', expectedTopIds: ['home-mentoring-tutorial-hub'] },
  { query: 'technical leadership portfolio personal page', expectedTopIds: ['home-technical-leadership-portfolio'] },

  // Technical explainers
  { query: 'system architecture explainer', expectedTopIds: ['exp-system-architecture'] },
  { query: 'incident postmortem report', expectedTopIds: ['exp-incident-postmortem'] },
  { query: 'data lineage map explainer', expectedTopIds: ['exp-data-lineage-map'] },
  { query: 'agent workflow explainer', expectedTopIds: ['exp-agent-workflow'] },
  { query: 'algorithm explanation walkthrough', expectedTopIds: ['exp-algorithm-explanation'] },
  { query: 'architecture decision record explainer', expectedTopIds: ['exp-architecture-decision-record'] },
  { query: 'migration plan blueprint', expectedTopIds: ['exp-migration-plan'] },

  // Components
  { query: 'kpi tile component', expectedTopIds: ['comp.kpi-tile'] },
  { query: 'line chart for time series', expectedTopIds: ['comp.trend-chart'] },
  { query: 'bar chart comparing categories', expectedTopIds: ['comp.category-bar-chart'] },
  { query: 'status list with badges', expectedTopIds: ['comp.status-list'] },
  { query: 'flow diagram of a process', expectedTopIds: ['comp.flow-diagram'] },

  // Grammars
  { query: 'calm command grammar for stressed readers', expectedTopIds: ['calm-command'] },
  { query: 'precision grid grammar for a systems of record dashboard', expectedTopIds: ['precision-grid'] },
  { query: 'research notebook grammar showing hypotheses and evidence', expectedTopIds: ['research-notebook'] },
  { query: 'monumental type grammar for a big headline', expectedTopIds: ['monumental-type'] },
  { query: 'spatial canvas grammar for a navigable map', expectedTopIds: ['spatial-canvas'] },
  { query: 'living system grammar for a process with state', expectedTopIds: ['living-system'] },

  // Motion sequences
  { query: 'ledger reveal motion sequence', expectedTopIds: ['ledger-reveal'] },
  { query: 'horizon sweep motion baseline', expectedTopIds: ['horizon-sweep'] },
];
