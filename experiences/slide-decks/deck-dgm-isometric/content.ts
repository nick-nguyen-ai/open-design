import type { IsometricDeckFill } from './dgm-isometric-fill.js';

/**
 * SHIPPED_FILL for "The Studio Floor" — the isometric tour deck's shipped
 * story: a modern data platform toured floor by floor as a set of dioramas.
 * Original content, synthetic by design.
 */
export const SHIPPED_FILL: IsometricDeckFill = {
  deck: {
    code: 'DGM-IS-01',
    world: 'THE STUDIO FLOOR',
    title: 'The data platform, in miniature',
    standfirst:
      'Every dashboard number once lived inside an app as an event. This deck builds the platform that moves it — ingestion, streams, the lakehouse, transformation, serving — as small dioramas you can walk around in your head.',
    notice: 'synthetic onboarding tour — demonstration only',
  },
  flow: {
    heading: 'An event finds its way home',
    caption:
      'One checkout event, door to dashboard. The hot-or-cold decision is the platform’s only fork: alerts ride the stream in seconds, while the same event lands in the lakehouse for tomorrow’s models.',
    title: 'From click to chart',
    nodes: [
      { id: 'emit', label: 'App emits event', kind: 'start' },
      { id: 'gateway', label: 'Ingest gateway', kind: 'process' },
      { id: 'hotcold', label: 'Hot path too?', kind: 'decision' },
      { id: 'stream', label: 'Stream topic', kind: 'data' },
      { id: 'lake', label: 'Lakehouse landing', kind: 'data' },
      { id: 'transform', label: 'Transform models', kind: 'process' },
      { id: 'dash', label: 'Dashboard tile', kind: 'end' },
    ],
    edges: [
      { from: 'emit', to: 'gateway', step: 1 },
      { from: 'gateway', to: 'hotcold', step: 2 },
      { from: 'hotcold', to: 'stream', label: 'hot', step: 3 },
      { from: 'hotcold', to: 'lake', label: 'cold', step: 4 },
      { from: 'stream', to: 'lake', label: 'sink', step: 5 },
      { from: 'lake', to: 'transform', step: 6 },
      { from: 'transform', to: 'dash', step: 7 },
    ],
  },
  sequence: {
    heading: 'Nobody waits for anybody',
    caption:
      'The whole conversation is asynchronous on purpose: the producer never blocks on the warehouse, and the BI tool never talks to the stream. Each participant reads at its own pace and acknowledges what it durably owns.',
    title: 'The pipeline conversation',
    actors: [
      { id: 'producer', label: 'Service', kind: 'user' },
      { id: 'broker', label: 'Event broker', kind: 'store' },
      { id: 'proc', label: 'Stream processor', kind: 'service' },
      { id: 'wh', label: 'Warehouse', kind: 'store' },
    ],
    messages: [
      { from: 'producer', to: 'broker', label: 'publish(checkout.v2)', note: 'fire and forget' },
      { from: 'broker', to: 'proc', label: 'consume batch' },
      { from: 'proc', to: 'proc', label: 'enrich + dedupe' },
      { from: 'proc', to: 'wh', label: 'micro-batch load' },
      { from: 'wh', to: 'proc', label: 'commit offsets', reply: true },
    ],
  },
  layers: {
    heading: 'Five floors, one building',
    caption:
      'The staircase reads the way data flows: sources feed streams, streams feed storage, storage feeds transformation, and everything above serves people. The lakehouse floor is accented — it is the foundation slab.',
    title: 'The platform, floor by floor',
    sideLabel: 'data descends',
    layers: [
      { id: 'serving', label: 'Serving + BI', detail: 'Dashboards, notebooks, APIs', items: ['BI tool', 'metrics API'] },
      { id: 'transform2', label: 'Transformation', detail: 'Tested models on a schedule', items: ['dbt', 'orchestrator'] },
      { id: 'lakehouse', label: 'Lakehouse storage', detail: 'Open tables, one copy of truth', items: ['bronze', 'silver', 'gold'], tone: 'accent' },
      { id: 'streaming', label: 'Streaming', detail: 'Topics and processors', items: ['broker', 'stream jobs'] },
      { id: 'ingest', label: 'Ingestion', detail: 'Gateways, CDC, connectors', items: ['SDKs', 'CDC taps'] },
    ],
  },
  zones: {
    heading: 'Four districts on the floor',
    caption:
      'Sources emit, the pipeline district moves, the lakehouse district remembers, and consumption reads. Notice every link points inward-then-outward — no consumer ever reaches back into a source district directly.',
    title: 'The platform estate',
    zones: [
      { id: 'sources', label: 'Sources', nodes: [{ id: 'apps', label: 'Product apps' }, { id: 'saas', label: 'SaaS tools' }, { id: 'dbs', label: 'Databases (CDC)' }] },
      { id: 'pipeline2', label: 'Pipeline', nodes: [{ id: 'broker2', label: 'Broker' }, { id: 'jobs', label: 'Stream jobs' }] },
      { id: 'lakehouse2', label: 'Lakehouse', nodes: [{ id: 'tables', label: 'Open tables' }, { id: 'catalog', label: 'Catalog' }] },
      { id: 'consume', label: 'Consumption', nodes: [{ id: 'bi', label: 'BI + notebooks' }, { id: 'ml', label: 'ML features' }] },
    ],
    links: [
      { from: 'apps', to: 'broker2', label: 'events' },
      { from: 'dbs', to: 'broker2', label: 'CDC' },
      { from: 'saas', to: 'tables', label: 'batch pulls' },
      { from: 'broker2', to: 'jobs' },
      { from: 'jobs', to: 'tables', label: 'sink' },
      { from: 'tables', to: 'bi', label: 'gold models' },
      { from: 'tables', to: 'ml', label: 'features' },
      { from: 'catalog', to: 'bi', label: 'lineage' },
    ],
  },
  cycle: {
    heading: 'Trust is a maintenance schedule',
    caption:
      'Data quality is not a gate at the door; it is this loop running forever: profile what arrives, test what you publish, alert on drift, fix the source, backfill the gap — and profile again.',
    title: 'The data quality loop',
    hubLabel: 'trust',
    stages: [
      { id: 'profile', label: 'Profile', detail: 'Shape of what arrived' },
      { id: 'test', label: 'Test', detail: 'Contracts on models' },
      { id: 'alert', label: 'Alert', detail: 'Drift pages a human' },
      { id: 'fix', label: 'Fix', detail: 'At the source, not the copy' },
      { id: 'backfill', label: 'Backfill', detail: 'Heal the history' },
    ],
  },
  compare: {
    heading: 'How fresh does truth need to be?',
    caption:
      'Batch, micro-batch, and streaming are one dial, not three religions. The studio sets the dial per table: finance closes on batch, product metrics ride micro-batch, and only fraud pays the streaming toll.',
    title: 'Batch vs micro-batch vs streaming',
    columns: [
      { id: 'batch', label: 'Batch' },
      { id: 'micro', label: 'Micro-batch', tone: 'accent' },
      { id: 'stream2', label: 'Streaming' },
    ],
    rows: [
      { label: 'Freshness', values: ['hours to daily', 'minutes', 'seconds'] },
      { label: 'Cost shape', values: ['cheap, bursty', 'moderate, steady', 'premium, always-on'] },
      { label: 'Failure story', values: ['rerun the job', 'rerun the window', 'replay + exactly-once care'] },
      { label: 'Fits', values: ['finance closes, ML training', 'product analytics', 'fraud, ops alerts'] },
    ],
    verdict: 'Default to micro-batch; drop to batch when nobody is waiting, pay for streaming only when seconds change a decision.',
  },
  cells: {
    heading: 'The studio’s labelled parts',
    caption:
      'Eight parts every newcomer trips over in week one, each with the one-line meaning that survives contact with the codebase. Learn these and every architecture diagram in this deck re-reads itself.',
    title: 'Platform vocabulary',
    columnsHint: 4,
    cells: [
      { id: 'cdc', label: 'CDC', detail: 'Databases narrating their own changes' },
      { id: 'dag', label: 'DAG', detail: 'The dependency graph a run walks' },
      { id: 'model', label: 'Model', detail: 'A tested, versioned SELECT' },
      { id: 'partition', label: 'Partition', detail: 'How big tables stay scannable' },
      { id: 'watermark', label: 'Watermark', detail: 'How late data is still on time' },
      { id: 'lineage', label: 'Lineage', detail: 'Where a number actually came from' },
      { id: 'medallion', label: 'Medallion', detail: 'Bronze to silver to gold refinement' },
      { id: 'sla2', label: 'Freshness SLA', detail: 'The promise a table makes' },
    ],
  },
  timeline: {
    heading: 'Ten years of moving the same rows',
    caption:
      'The platform kept its promises and changed its plumbing: warehouses met lakes, the lakehouse merged them, and the current era makes streams the default door instead of the special case.',
    title: 'The platform, era by era',
    nowIndex: 3,
    eras: [
      { id: 'wh2', label: 'Cloud warehouse', marker: '2016', detail: 'SQL scales elastically' },
      { id: 'lake2', label: 'Data lake', marker: '2018', detail: 'Cheap files, loose schema' },
      { id: 'lh', label: 'Lakehouse', marker: '2021', detail: 'Open tables unify both' },
      { id: 'streamfirst', label: 'Streaming-first', marker: 'now', detail: 'Events as the front door' },
    ],
  },
  close: {
    takeaways: [
      'One fork — hot or cold — explains almost every pipeline on the floor.',
      'Asynchrony is the contract: every participant reads at its own pace.',
      'The lakehouse slab holds one copy of truth; everything else is a view of it.',
      'Freshness is a dial priced per table, not a platform-wide religion.',
    ],
    signoff:
      'Pick one dashboard tile you rely on and walk its floors backwards — serving, model, table, stream, source. If you can name each floor’s owner, you are onboarded.',
  },
};
