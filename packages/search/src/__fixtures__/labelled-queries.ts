/**
 * The retrieval spike's labelled query set (plan §35 / task-9 brief): a
 * realistic natural-language request paired with the id (or small acceptable
 * set of ids) that should appear in the top 3 results. Spans all 5 experience
 * surfaces (dashboard, project-page, slide-deck, personal-page,
 * technical-explainer) plus component- and grammar-level requests, using real
 * ids from the compiled catalogue (`packages/registry`).
 *
 * Two cohorts, distinguished by the `paraphrased` flag:
 *
 * - `paraphrased: false` — "title-echo" queries that reuse the target's title
 *   words plus a generic descriptor ("regulatory control hub dashboard"). With
 *   `title` boosted 5x these are near-guaranteed hits; they prove the plumbing
 *   works but not much about genuine retrieval.
 * - `paraphrased: true` — the queries that actually de-risk the plan's
 *   riskiest assumption (plan §15.4): a user describing their INTENT without
 *   naming the template, phrased against the business-intent / "when to use"
 *   prose the registry folds into each document's `text`, NOT its title words.
 *   These are the meaningful signal for lexical viability.
 *
 * The spike asserts the top-3 threshold over the FULL set; the report breaks
 * out the paraphrased-only number as the honest headline.
 */
export interface LabelledQuery {
  query: string;
  /** Any one of these ids appearing in the top 3 results counts as a hit. */
  expectedTopIds: string[];
  /** True if the query deliberately avoids the target's title words (genuine intent phrasing). */
  paraphrased: boolean;
}

export const LABELLED_QUERIES: LabelledQuery[] = [
  // ── Title-echo cohort (plumbing sanity) ──────────────────────────────────
  // Dashboards
  { query: 'model monitoring dashboard', expectedTopIds: ['db-model-monitoring-cockpit'], paraphrased: false },
  { query: 'regulatory control hub dashboard', expectedTopIds: ['db-regulatory-control-hub'], paraphrased: false },
  { query: 'delivery control tower dashboard', expectedTopIds: ['db-delivery-control-tower'], paraphrased: false },
  {
    query: 'dependency network explorer dashboard',
    expectedTopIds: ['db-dependency-network-explorer'],
    paraphrased: false,
  },
  { query: 'data quality operations dashboard', expectedTopIds: ['db-data-quality-operations'], paraphrased: false },
  { query: 'scenario stress simulator dashboard', expectedTopIds: ['db-scenario-stress-simulator'], paraphrased: false },
  { query: 'AI risk command centre dashboard', expectedTopIds: ['db-ai-risk-command-centre'], paraphrased: false },
  {
    query: 'portfolio performance storytelling dashboard',
    expectedTopIds: ['db-portfolio-performance-explorer'],
    paraphrased: false,
  },

  // Slide decks
  { query: 'AI strategy deck', expectedTopIds: ['deck-ai-strategy'], paraphrased: false },
  { query: 'AI governance and controls deck', expectedTopIds: ['deck-ai-governance-and-controls'], paraphrased: false },
  { query: 'experiment results slides', expectedTopIds: ['deck-experiment-results'], paraphrased: false },
  { query: 'technical training deck', expectedTopIds: ['deck-technical-training'], paraphrased: false },
  { query: 'transformation roadmap deck', expectedTopIds: ['deck-transformation-roadmap'], paraphrased: false },
  {
    query: 'executive decision proposal deck',
    expectedTopIds: ['deck-executive-decision-proposal'],
    paraphrased: false,
  },
  {
    query: 'genai model validation report deck',
    expectedTopIds: ['deck-genai-model-validation-report'],
    paraphrased: false,
  },

  // Project pages
  {
    query: 'cloud migration programme project page',
    expectedTopIds: ['proj-cloud-migration-programme'],
    paraphrased: false,
  },
  { query: 'vendor risk assessment project', expectedTopIds: ['proj-vendor-assessment'], paraphrased: false },
  {
    query: 'AI model validation hub project page',
    expectedTopIds: ['proj-ai-model-validation-hub'],
    paraphrased: false,
  },
  {
    query: 'model lifecycle workspace project page',
    expectedTopIds: ['proj-model-lifecycle-workspace'],
    paraphrased: false,
  },
  {
    query: 'operating model redesign project page',
    expectedTopIds: ['proj-operating-model-redesign'],
    paraphrased: false,
  },
  {
    query: 'regulatory remediation programme project page',
    expectedTopIds: ['proj-regulatory-remediation-programme'],
    paraphrased: false,
  },

  // Personal pages
  {
    query: 'career and project timeline personal page',
    expectedTopIds: ['home-career-project-timeline'],
    paraphrased: false,
  },
  {
    query: 'data scientist studio personal homepage',
    expectedTopIds: ['home-data-scientist-studio'],
    paraphrased: false,
  },
  { query: 'knowledge atlas personal page', expectedTopIds: ['home-knowledge-atlas'], paraphrased: false },
  {
    query: 'mentoring and tutorial hub personal page',
    expectedTopIds: ['home-mentoring-tutorial-hub'],
    paraphrased: false,
  },
  {
    query: 'technical leadership portfolio personal page',
    expectedTopIds: ['home-technical-leadership-portfolio'],
    paraphrased: false,
  },

  // Technical explainers
  { query: 'system architecture explainer', expectedTopIds: ['exp-system-architecture'], paraphrased: false },
  { query: 'incident postmortem report', expectedTopIds: ['exp-incident-postmortem'], paraphrased: false },
  { query: 'data lineage map explainer', expectedTopIds: ['exp-data-lineage-map'], paraphrased: false },
  { query: 'agent workflow explainer', expectedTopIds: ['exp-agent-workflow'], paraphrased: false },
  { query: 'algorithm explanation walkthrough', expectedTopIds: ['exp-algorithm-explanation'], paraphrased: false },
  {
    query: 'architecture decision record explainer',
    expectedTopIds: ['exp-architecture-decision-record'],
    paraphrased: false,
  },
  { query: 'migration plan blueprint', expectedTopIds: ['exp-migration-plan'], paraphrased: false },

  // Components
  { query: 'kpi tile component', expectedTopIds: ['comp.kpi-tile'], paraphrased: false },
  { query: 'line chart for time series', expectedTopIds: ['comp.trend-chart'], paraphrased: false },
  { query: 'bar chart comparing categories', expectedTopIds: ['comp.category-bar-chart'], paraphrased: false },
  { query: 'status list with badges', expectedTopIds: ['comp.status-list'], paraphrased: false },
  { query: 'flow diagram of a process', expectedTopIds: ['comp.flow-diagram'], paraphrased: false },

  // Grammars
  { query: 'calm command grammar for stressed readers', expectedTopIds: ['calm-command'], paraphrased: false },
  {
    query: 'precision grid grammar for a systems of record dashboard',
    expectedTopIds: ['precision-grid'],
    paraphrased: false,
  },
  {
    query: 'research notebook grammar showing hypotheses and evidence',
    expectedTopIds: ['research-notebook'],
    paraphrased: false,
  },
  { query: 'monumental type grammar for a big headline', expectedTopIds: ['monumental-type'], paraphrased: false },
  { query: 'spatial canvas grammar for a navigable map', expectedTopIds: ['spatial-canvas'], paraphrased: false },
  {
    query: 'living system grammar for a process with state',
    expectedTopIds: ['living-system'],
    paraphrased: false,
  },

  // Motion sequences
  { query: 'ledger reveal motion sequence', expectedTopIds: ['ledger-reveal'], paraphrased: false },
  { query: 'horizon sweep motion baseline', expectedTopIds: ['horizon-sweep'], paraphrased: false },

  // ── Paraphrased cohort (genuine business-intent phrasing; no title words) ──
  // Dashboards
  {
    query: 'how are our production models drifting since last week',
    expectedTopIds: ['db-model-monitoring-cockpit'],
    paraphrased: true,
  },
  {
    query: 'board-level view of where our AI exposure sits right now',
    expectedTopIds: ['db-ai-risk-command-centre'],
    paraphrased: true,
  },
  {
    query: 'coordinate the response while an incident is still active',
    expectedTopIds: ['db-incident-remediation-centre'],
    paraphrased: true,
  },
  // Slide decks
  {
    query: 'slides to get executives to sign off on a single decision',
    expectedTopIds: ['deck-executive-decision-proposal'],
    paraphrased: true,
  },
  {
    query: 'present our enterprise AI plan to the leadership committee',
    expectedTopIds: ['deck-ai-strategy'],
    paraphrased: true,
  },
  {
    query: 'slides showing programme phases that build on one another',
    expectedTopIds: ['deck-transformation-roadmap'],
    paraphrased: true,
  },
  // Project pages
  {
    query: 'move our workloads to the cloud without breaking dependencies',
    expectedTopIds: ['proj-cloud-migration-programme'],
    paraphrased: true,
  },
  // Personal pages
  {
    query: "a page showing what I'm actively working on right now for colleagues",
    expectedTopIds: ['home-data-scientist-studio'],
    paraphrased: true,
  },
  {
    query: 'help mentees find the right tutorial without hunting',
    expectedTopIds: ['home-mentoring-tutorial-hub'],
    paraphrased: true,
  },
  // Technical explainers
  {
    query: "explain our platform's moving parts to a new engineer",
    expectedTopIds: ['exp-system-architecture'],
    paraphrased: true,
  },
  {
    query: 'answer where a data value originally came from for an audit',
    expectedTopIds: ['exp-data-lineage-map', 'db-data-quality-operations'],
    paraphrased: true,
  },
  // Components
  {
    query: 'show a metric changing over time',
    expectedTopIds: ['comp.trend-chart'],
    paraphrased: true,
  },
  {
    query: 'summarise a handful of headline numbers at the top of a report',
    expectedTopIds: ['comp.kpi-tile'],
    paraphrased: true,
  },
  // Grammars
  {
    query: 'a restrained layout for a surface people watch under pressure',
    expectedTopIds: ['calm-command'],
    paraphrased: true,
  },
  {
    query: 'present content as an explorable network instead of a scrolling list',
    expectedTopIds: ['spatial-canvas'],
    paraphrased: true,
  },
];
