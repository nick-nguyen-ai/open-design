import type { GazetteDeckFill } from './dgm-gazette-fill.js';

/**
 * SHIPPED_FILL for "The Gazette" — the gazette tour deck's shipped story:
 * a field manual for observability, set as printed plates.
 * Original content, synthetic by design.
 */
export const SHIPPED_FILL: GazetteDeckFill = {
  deck: {
    code: 'DGM-GZ-01',
    world: 'THE GAZETTE',
    title: 'A field manual for seeing',
    standfirst:
      'Systems fail quietly before they fail loudly. This manual sets the discipline of observability in nine plates: the instruments, the signals, the loop of noticing — so the reader can find a fault by lamplight, not by luck.',
    notice: 'synthetic field manual — demonstration only',
  },
  flow: {
    heading: 'The anatomy of a good alarm',
    caption:
      'Plate one traces an incident from first alarm to closed loop. The triage decision is the manual’s hinge: a symptom alert routes to dashboards and traces; a cause alert has already done half the work.',
    title: 'From page to postmortem',
    nodes: [
      { id: 'alert', label: 'Alert fires', kind: 'start' },
      { id: 'triage', label: 'Symptom or cause?', kind: 'decision' },
      { id: 'oncall', label: 'On-call engineer', kind: 'actor' },
      { id: 'boards', label: 'Dashboards', kind: 'process' },
      { id: 'traces', label: 'Trace search', kind: 'data' },
      { id: 'fixit', label: 'Mitigate + fix', kind: 'process' },
      { id: 'learn', label: 'Postmortem filed', kind: 'end' },
    ],
    edges: [
      { from: 'alert', to: 'triage', step: 1 },
      { from: 'triage', to: 'oncall', label: 'page', step: 2 },
      { from: 'oncall', to: 'boards', label: 'symptom', step: 3 },
      { from: 'boards', to: 'traces', step: 4 },
      { from: 'traces', to: 'fixit', step: 5 },
      { from: 'triage', to: 'fixit', label: 'cause known', step: 6 },
      { from: 'fixit', to: 'learn', step: 7 },
    ],
  },
  sequence: {
    heading: 'Correspondence of an incident',
    caption:
      'The night’s letters, in order: the monitor writes to the pager, the pager to the engineer, the engineer to the runbook — and the runbook, if it is any good, writes back with the exact query to run next.',
    title: 'The paging conversation',
    actors: [
      { id: 'monitor', label: 'Burn-rate monitor', kind: 'service' },
      { id: 'pager', label: 'Pager', kind: 'external' },
      { id: 'engineer', label: 'On-call', kind: 'user' },
      { id: 'runbook', label: 'Runbook + boards', kind: 'store' },
    ],
    messages: [
      { from: 'monitor', to: 'pager', label: 'SLO burn 14×', note: 'fast-burn rule' },
      { from: 'pager', to: 'engineer', label: 'page: checkout latency' },
      { from: 'engineer', to: 'pager', label: 'ack, on it', reply: true },
      { from: 'engineer', to: 'runbook', label: 'open runbook page' },
      { from: 'runbook', to: 'engineer', label: 'first three queries', reply: true },
      { from: 'engineer', to: 'monitor', label: 'silence after mitigation' },
    ],
  },
  layers: {
    heading: 'The telemetry press, in section',
    caption:
      'A cross-section of the machine that turns behaviour into evidence: instrumentation at the top where code lives, then collection, the pipeline, storage, and the query floor where humans finally read.',
    title: 'The observability stack',
    sideLabel: 'evidence descends',
    layers: [
      { id: 'sdk', label: 'Instrumentation', detail: 'The code narrates itself', items: ['OTel SDKs', 'auto-instr.'], tone: 'accent' },
      { id: 'agents', label: 'Collection', detail: 'Agents and collectors', items: ['sidecar', 'daemonset'] },
      { id: 'pipe', label: 'Pipeline', detail: 'Sample, redact, route', items: ['tail sampling', 'PII scrub'] },
      { id: 'storage3', label: 'Storage', detail: 'Three shapes, three stores', items: ['TSDB', 'log index', 'trace store'] },
      { id: 'query', label: 'Query + alerting', detail: 'Where humans read', items: ['dashboards', 'SLO rules'] },
    ],
  },
  zones: {
    heading: 'A map of the estate at night',
    caption:
      'Four districts, lamplit: the fleet that emits, the collectors that gather, the backend that remembers, and the on-call desk that reads. The vermilion dispatch lines are the paths a page actually travels.',
    title: 'The observability estate',
    zones: [
      { id: 'fleet', label: 'Service fleet', nodes: [{ id: 'svc1', label: 'Services ×120' }, { id: 'infra', label: 'Infra + k8s' }] },
      { id: 'collect', label: 'Collection', nodes: [{ id: 'otelc', label: 'OTel collectors' }, { id: 'gwc', label: 'Gateway tier' }] },
      { id: 'backend', label: 'Backend', nodes: [{ id: 'tsdb', label: 'Metrics TSDB' }, { id: 'logs2', label: 'Log store' }, { id: 'tracestore', label: 'Trace store' }] },
      { id: 'desk', label: 'On-call desk', nodes: [{ id: 'boards2', label: 'Dashboards' }, { id: 'pager2', label: 'Pager' }] },
    ],
    links: [
      { from: 'svc1', to: 'otelc', label: 'OTLP' },
      { from: 'infra', to: 'otelc', label: 'scrape' },
      { from: 'otelc', to: 'gwc', label: 'batch' },
      { from: 'gwc', to: 'tsdb' },
      { from: 'gwc', to: 'logs2' },
      { from: 'gwc', to: 'tracestore' },
      { from: 'tsdb', to: 'pager2', label: 'burn rules' },
      { from: 'tsdb', to: 'boards2' },
    ],
  },
  cycle: {
    heading: 'The reliability rosette',
    caption:
      'The manual’s central figure: six stations on an endless ring. A team’s maturity is simply how quickly it travels this circle — and whether the learning station actually changes the instrumentation station.',
    title: 'The reliability loop',
    hubLabel: 'the service',
    stages: [
      { id: 'instrument', label: 'Instrument', detail: 'Emit the three signals' },
      { id: 'observe', label: 'Observe', detail: 'Boards someone reads' },
      { id: 'alertst', label: 'Alert', detail: 'On symptoms, via SLOs' },
      { id: 'respond', label: 'Respond', detail: 'Runbooks, not heroics' },
      { id: 'learnst', label: 'Learn', detail: 'Blameless postmortem' },
      { id: 'improve', label: 'Improve', detail: 'Fix the telemetry too' },
    ],
  },
  compare: {
    heading: 'The three signals, priced',
    caption:
      'Logs, metrics, and traces answer different questions at different costs. The tariff table prints what each is for and what each will charge you — in storage, in cardinality, and in three a.m. attention.',
    title: 'Logs vs metrics vs traces',
    columns: [
      { id: 'logs3', label: 'Logs' },
      { id: 'metrics2', label: 'Metrics', tone: 'accent' },
      { id: 'traces2', label: 'Traces' },
    ],
    rows: [
      { label: 'Answers', values: ['what exactly happened', 'how much, how fast', 'where time went'] },
      { label: 'Cost driver', values: ['volume of lines', 'cardinality of labels', 'sampling rate'] },
      { label: 'Alert on it?', values: ['sparingly — noisy', 'yes — SLOs live here', 'no — investigate here'] },
      { label: 'Failure mode', values: ['grep at 3am', 'averages that lie', 'the unsampled request'] },
    ],
    verdict: 'Alert on metrics, investigate with traces, convict with logs — and budget cardinality like money.',
  },
  cells: {
    heading: 'A gazetteer of the discipline',
    caption:
      'Eight entries every practitioner should be able to recite at the desk. Each is printed with its one-line definition; the numbers are entry marks, not rankings.',
    title: 'Entries, first edition',
    columnsHint: 4,
    cells: [
      { id: 'slo', label: 'SLO', detail: 'The promise: how good is good enough' },
      { id: 'budget', label: 'Error budget', detail: 'The promise’s small change' },
      { id: 'burn', label: 'Burn rate', detail: 'How fast the budget is spending' },
      { id: 'golden', label: 'Golden signals', detail: 'Latency, traffic, errors, saturation' },
      { id: 'span', label: 'Span', detail: 'One timed step inside a trace' },
      { id: 'cardinality', label: 'Cardinality', detail: 'Label combinations — the silent bill' },
      { id: 'runbook2', label: 'Runbook', detail: 'The first three queries, written down' },
      { id: 'postmortem', label: 'Postmortem', detail: 'The learning, filed blamelessly' },
    ],
  },
  timeline: {
    heading: 'From green lights to open telemetry',
    caption:
      'The discipline’s own chronicle: host checks became time series, time series met traces, and the current edition finally agrees on one wire format for all three signals.',
    title: 'Observability, era by era',
    nowIndex: 3,
    eras: [
      { id: 'nagios', label: 'Host checks', marker: '2002', detail: 'Up or down, red or green' },
      { id: 'graphite', label: 'Time series', marker: '2008', detail: 'Graphs of everything' },
      { id: 'prom', label: 'Labels + SLOs', marker: '2015', detail: 'Prometheus and the budget era' },
      { id: 'otel', label: 'OpenTelemetry', marker: 'now', detail: 'One standard, three signals' },
    ],
  },
  close: {
    takeaways: [
      'Alert on symptoms through SLOs; let causes be found, not paged.',
      'The three signals divide the labour: metrics alert, traces locate, logs convict.',
      'Cardinality is the silent bill — budget it like money.',
      'A runbook that opens with three exact queries is worth ten dashboards.',
    ],
    signoff:
      'Take one service you own and print its page for this manual: its SLO, its burn alert, its first three queries. If that page cannot be written, that — not tooling — is the gap.',
  },
};
