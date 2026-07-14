/**
 * "The T-Minus" — deck-composer skill run: introducing LangChain OpenWiki and
 * the countdown to adopting it (ledger T33). CONTENT ONLY, conforming to
 * {@link TMinusFill}; the template carries the whole craft.
 *
 * Every fact traces to the run's source context
 * (`docs/superpowers/specs/openwiki-sample/source-context.md`): OpenWiki blog
 * post + README. Real figures: stars, license, providers, CLI commands.
 * Synthetic: day-30 pilot targets and clock times — covered by `deck.notice`.
 */
import { TMinusFill } from '../deck-product-launch/tminus-fill.js';

export const openwikiFill: TMinusFill = TMinusFill.parse({
  deck: {
    code: 'OPENWIKI-GA',
    world: 'T-MINUS',
    product: 'OPENWIKI',
    programme: 'OPEN-SOURCE REPO DOCUMENTATION · GA',
    war: 'LANGCHAIN OSS · LAUNCH ROOM 01',
    notice: 'PUBLIC LANGCHAIN SOURCES + SYNTHETIC TARGETS',
  },
  cover: {
    line1: 'Documentation that',
    line2: 'keeps itself current.',
    standfirst:
      'OpenWiki is live: an open-source agent that builds a wiki for any repository and maintains it from the commit history. This is the countdown to switching it on across our repos.',
  },
  oneSentence: {
    lead: 'WHAT JUST SHIPPED',
    sentence:
      'OpenWiki is an open-source agent and CLI that generates a living wiki for any codebase, then keeps it current from git diffs on a schedule — so coding agents and humans share one map of the repo.',
    facts: [
      { stat: '10.9k', cap: 'GitHub stars at launch' },
      { stat: 'MIT', cap: 'license — fully open source' },
      { stat: '6+', cap: 'model providers supported' },
    ],
  },
  thesis: {
    line1: 'Stale docs are',
    line2: 'a broken build.',
    standfirst:
      'Every merge quietly invalidates a page somewhere, and large repos rot fastest. Now coding agents read those pages too — so stale documentation turns directly into wrong code. OpenWiki treats the wiki as a build artifact: generated once, then rebuilt from what actually changed, run by run.',
  },
  headlines: {
    readiness: 'Four green lights. One amber.',
    comms: 'Everyone hears it in the right order.',
    pricing: 'Free is the product. The model is the meter.',
    runbook: 'Pilot day, hour by hour.',
    risk: 'What stops the pilot — and how fast we roll back.',
    metrics: 'Four numbers will tell us it worked.',
  },
  gates: [
    {
      id: 'repos',
      label: 'Pilot repos selected',
      status: 'success',
      description: 'Three candidate repositories agreed with their owning teams for the first generation pass.',
    },
    {
      id: 'provider',
      label: 'Model provider keys',
      status: 'success',
      description: 'Provider chosen and keys stored via openwiki auth; retry attempts configured in ~/.openwiki/.env.',
    },
    {
      id: 'ci',
      label: 'CI schedule ready',
      status: 'success',
      description: 'GitHub Action prepared to run openwiki --update on a schedule, reading git diffs since the last run.',
    },
    {
      id: 'agents',
      label: 'Agent files wired',
      status: 'success',
      description: 'AGENTS.md and CLAUDE.md carry short wiki references, so agents pull pages on demand without context bloat.',
    },
    {
      id: 'review',
      label: 'Human review gate',
      status: 'warning',
      description: 'No named reviewer yet for agent-written pages — generated docs ship unreviewed until an owner signs off.',
    },
  ],
  anomalyLabel: 'GENERATED DOCS UNREVIEWED — NO NAMED OWNER',
  anomalyNote: 'naming the reviewing owners is on today’s agenda; sign-off is the single thing between amber and go.',
  comms: [
    {
      id: 'blog',
      channel: 'Blog',
      moment: 'T-0, at GA',
      detail: 'LangChain publishes Introducing OpenWiki — the problem, the pipeline, and the quickstart.',
    },
    {
      id: 'github',
      channel: 'GitHub',
      moment: 'T-0',
      detail: 'langchain-ai/openwiki goes public under MIT with the README quickstart and issue templates.',
    },
    {
      id: 'npm',
      channel: 'npm',
      moment: 'T-0',
      detail: 'openwiki published: npm install -g openwiki, then openwiki --init prompts for provider and key.',
    },
    {
      id: 'allhands',
      channel: 'Engineering all-hands',
      moment: 'T+1, 10:00',
      detail: 'This deck: what OpenWiki is, the pilot plan, and the review gate that must close first.',
    },
    {
      id: 'channels',
      channel: 'Team channels',
      moment: 'T+1 → T+7',
      detail: 'Pilot teams get the runbook and a thread for wiki-accuracy reports during week one.',
    },
  ],
  pricing: [
    {
      id: 'code',
      name: 'Code mode',
      price: 'FREE',
      unit: 'per repository',
      includes: 'Repo wiki in openwiki/, AGENTS.md wiring, scheduled updates from git diffs',
      feature: true,
    },
    {
      id: 'personal',
      name: 'Personal mode',
      price: 'FREE',
      unit: 'per person',
      includes: 'Local brain wiki in ~/.openwiki with connectors: Notion, Gmail, X, web search',
      feature: false,
    },
    {
      id: 'model',
      name: 'Your model',
      price: 'BYO',
      unit: 'per token, at cost',
      includes: 'OpenAI, Anthropic, OpenRouter, Fireworks, Baseten, NVIDIA NIM — or compatible',
      feature: false,
    },
  ],
  runbook: [
    { id: 'install', time: '09:00', label: 'Install', detail: 'npm install -g openwiki on the pilot machines and the CI runner.' },
    { id: 'init', time: '09:15', label: 'Init', detail: 'openwiki --init per repo; choose the provider, store the API key.' },
    { id: 'build', time: '09:30', label: 'First build', detail: 'Full wiki generated into openwiki/ as interconnected pages.' },
    { id: 'wire', time: '10:30', label: 'Wire agents', detail: 'AGENTS.md and CLAUDE.md get short references to the new wiki.' },
    { id: 'review', time: '11:30', label: 'Review gate', detail: 'Named owner reads every generated page; go / no-go on accuracy.', gate: true },
    { id: 'schedule', time: '13:00', label: 'Schedule', detail: 'GitHub Action cron enabled; openwiki --update runs after merges.' },
    { id: 'query', time: '14:00', label: 'First queries', detail: 'Teams try openwiki -p questions against the fresh wiki.' },
    { id: 'watch', time: 'T+7', label: 'Week-one watch', detail: 'Accuracy reports triaged; update lag measured against merges.' },
  ],
  runbookNote:
    'Install to first queries inside one morning. The 11:30 review gate is the only go/no-go — a named owner reads every generated page before the schedule flips on. Until then, everything OpenWiki has written is plain files on a branch, reversible by deleting them.',
  aborts: [
    {
      id: 'accuracy',
      metric: 'Factual errors found in review',
      threshold: '>1 per generated page',
      action: 'Hold the rollout; regenerate with a stronger model before retry.',
    },
    {
      id: 'ci',
      metric: 'Scheduled update failures',
      threshold: '2 consecutive Action runs',
      action: 'Disable the cron; fall back to manual openwiki --update.',
    },
    {
      id: 'spend',
      metric: 'Provider token spend',
      threshold: 'Monthly cap breached',
      action: 'Switch provider or model via OPENWIKI_PROVIDER; resume next cycle.',
    },
  ],
  rollbackNote:
    'Rollback is one commit: OpenWiki writes plain files inside the repo. Delete the openwiki/ directory, revert the AGENTS.md and CLAUDE.md references, disable the Action — and the repo is exactly what it was. No service to unwind, no data held outside git.',
  metrics: [
    { id: 'stars', label: 'GitHub stars at launch', value: 10900, unit: 'count', status: 'on-track' },
    { id: 'repos', label: 'Pilot repos onboarded — day 30', value: 3, unit: 'count', status: 'neutral' },
    { id: 'lag', label: 'Median doc update lag, hours', value: 24, unit: 'count', status: 'at-risk' },
    { id: 'coverage', label: 'Core-module coverage, day 30', value: 0.8, unit: 'percent', status: 'neutral' },
  ],
  metricsNote:
    'Stars are the live GitHub figure at launch; the other three are day-30 pilot targets set before the rollout — update lag stays at-risk until week-one data proves the schedule keeps pace with merges.',
  closing: {
    word: 'GO',
    line: 'One gate stays amber: nobody owns the generated pages yet.',
    detail:
      'Name a reviewing owner per pilot repo and the board goes green — the whole runbook is a morning, and the wiki starts paying rent on the first merge.',
    decisions: [
      'Name the documentation reviewer for each of the three pilot repos',
      'Fix the default provider and model, and set the monthly token-spend cap',
      'Approve wiring wiki references into AGENTS.md and CLAUDE.md on pilot repos',
    ],
  },
});
