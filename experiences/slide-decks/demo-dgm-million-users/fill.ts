import { FILL_SCHEMA, type CircuitDeckFill } from '../deck-dgm-circuit/dgm-circuit-fill.js';

/**
 * "/demo/million-users" — experience-composer run 3 (circuit tour).
 * Brief: tell the scale story of an app growing to its first million users —
 * load balancers, caches, replicas, queues — for a technical audience.
 * Composed via compose_slide_deck → dgm-circuit; validated by validate_fill.
 */
export const millionUsersFill: CircuitDeckFill = FILL_SCHEMA.parse({
  deck: {
    code: 'DGM-1M-01',
    world: 'THE LIT BOARD',
    title: 'The first million users',
    standfirst:
      'Nobody scales by rewriting; you scale by relieving one bottleneck at a time. This board lights the six moves that carry a single server to a million users — and the loop that tells you which move is next.',
    notice: 'synthetic scale story — demonstration only',
  },
  flow: {
    heading: 'The request path, fully grown',
    caption:
      'By the time you serve a million users, every request runs this gauntlet. The two cache decisions do most of the work — the database only hears from the requests that survive both.',
    title: 'One request at scale',
    nodes: [
      { id: 'user', label: 'User request', kind: 'start' },
      { id: 'edge', label: 'Edge cached?', kind: 'decision' },
      { id: 'lb', label: 'Load balancer', kind: 'process' },
      { id: 'app', label: 'Stateless app node', kind: 'process' },
      { id: 'cache', label: 'Cache hit?', kind: 'decision' },
      { id: 'redis', label: 'Distributed cache', kind: 'data' },
      { id: 'db', label: 'Primary + replicas', kind: 'data' },
      { id: 'resp', label: 'Response served', kind: 'end' },
    ],
    edges: [
      { from: 'user', to: 'edge', step: 1 },
      { from: 'edge', to: 'resp', label: 'hit', step: 2 },
      { from: 'edge', to: 'lb', label: 'miss', step: 3 },
      { from: 'lb', to: 'app', step: 4 },
      { from: 'app', to: 'cache', step: 5 },
      { from: 'cache', to: 'redis', label: 'hit', step: 6 },
      { from: 'cache', to: 'db', label: 'miss', step: 7 },
      { from: 'db', to: 'resp', step: 8 },
      { from: 'redis', to: 'resp', step: 9 },
    ],
  },
  sequence: {
    heading: 'Cache-aside, the workhorse read',
    caption:
      'The pattern that carries 90% of read traffic: try the cache, fall through to a replica, write the answer back with a TTL. The replica — never the primary — absorbs the misses.',
    title: 'A read under load',
    actors: [
      { id: 'svc', label: 'App node', kind: 'service' },
      { id: 'kv', label: 'Cache cluster', kind: 'store' },
      { id: 'replica', label: 'Read replica', kind: 'store' },
      { id: 'primary', label: 'Primary DB', kind: 'external' },
    ],
    messages: [
      { from: 'svc', to: 'kv', label: 'GET user:42' },
      { from: 'kv', to: 'svc', label: 'miss', reply: true },
      { from: 'svc', to: 'replica', label: 'SELECT … (read path)', note: 'primary never sees reads' },
      { from: 'replica', to: 'svc', label: 'row, ~3ms', reply: true },
      { from: 'svc', to: 'kv', label: 'SET user:42 TTL 300' },
      { from: 'primary', to: 'replica', label: 'async replication stream' },
    ],
  },
  layers: {
    heading: 'The stack that absorbs a million',
    caption:
      'Each layer exists to protect the one below it: the edge absorbs the world, the balancer spreads it, stateless apps scale sideways, the cache shields the data floor. The accent marks where statelessness ends.',
    title: 'The scaling stack',
    sideLabel: 'load descends',
    layers: [
      { id: 'edge2', label: 'Edge + CDN', detail: 'Static bytes never enter', items: ['CDN', 'WAF'] },
      { id: 'lb2', label: 'Load balancing', detail: 'Health-checked spread', items: ['L7 LB', 'autoscaler'] },
      { id: 'app2', label: 'Stateless apps', detail: 'Any node, any request', items: ['app ×N', 'sessions in cache'] },
      { id: 'cache2', label: 'Cache tier', detail: 'The shield in front of state', items: ['redis cluster'], tone: 'accent' },
      { id: 'data', label: 'Data tier', detail: 'One writer, many readers', items: ['primary', 'replicas ×3'] },
    ],
  },
  zones: {
    heading: 'Four sectors, one board',
    caption:
      'Synchronous work lives on the left path; everything that can wait crosses into the async sector. The queue wire is the pressure valve — when the board runs hot, it is the line that saves you.',
    title: 'The platform at 1M',
    zones: [
      { id: 'edgez', label: 'Edge', nodes: [{ id: 'cdn', label: 'CDN' }, { id: 'waf2', label: 'WAF' }] },
      { id: 'appz', label: 'App sector', nodes: [{ id: 'lb3', label: 'Balancers' }, { id: 'nodes', label: 'App nodes ×12' }] },
      { id: 'dataz', label: 'Data sector', nodes: [{ id: 'kv2', label: 'Cache cluster' }, { id: 'pg', label: 'Primary' }, { id: 'reps', label: 'Replicas ×3' }] },
      { id: 'asyncz', label: 'Async sector', nodes: [{ id: 'q', label: 'Queue' }, { id: 'workers', label: 'Workers ×8' }] },
    ],
    links: [
      { from: 'cdn', to: 'lb3', label: 'dynamic only' },
      { from: 'lb3', to: 'nodes' },
      { from: 'nodes', to: 'kv2', label: 'reads' },
      { from: 'nodes', to: 'reps', label: 'cache misses' },
      { from: 'nodes', to: 'q', label: 'anything that can wait' },
      { from: 'workers', to: 'pg', label: 'writes, paced' },
      { from: 'pg', to: 'reps', label: 'replication' },
    ],
  },
  cycle: {
    heading: 'Scaling is a loop, not a ladder',
    caption:
      'There is no final architecture — only this loop run again and again. The teams that reach a million users are the ones that measure before they move, and move one bottleneck at a time.',
    title: 'The capacity loop',
    hubLabel: 'p99',
    stages: [
      { id: 'measure', label: 'Measure', detail: 'p99, saturation, queues' },
      { id: 'find', label: 'Find the bottleneck', detail: 'One at a time' },
      { id: 'relieve', label: 'Relieve', detail: 'Cache, replica, or queue' },
      { id: 'shift', label: 'Shift load', detail: 'Roll out gradually' },
      { id: 'verify', label: 'Verify', detail: 'Did p99 move?' },
    ],
  },
  compare: {
    heading: 'Three ways to buy headroom',
    caption:
      'Vertical is a credit card, horizontal is an architecture, async is a philosophy. The board favours horizontal for serving and async for everything the user does not wait on.',
    title: 'Scale up vs out vs async',
    columns: [
      { id: 'vertical', label: 'Scale up' },
      { id: 'horizontal', label: 'Scale out', tone: 'accent' },
      { id: 'async', label: 'Go async' },
    ],
    rows: [
      { label: 'Buys you', values: ['instant headroom', 'linear capacity', 'smoothed peaks'] },
      { label: 'Ceiling', values: ['the biggest box sold', 'coordination costs', 'eventual consistency'] },
      { label: 'Demands', values: ['nothing — just money', 'statelessness first', 'idempotent handlers'] },
      { label: 'Fails by', values: ['one big blast radius', 'config sprawl', 'silent queue backlog'] },
    ],
    verdict: 'Buy up once to survive today, build out to survive the year, go async to survive success.',
  },
  cells: {
    heading: 'The board’s status tags',
    caption:
      'Eight terms that appear on every incident call past 100k users. Learn them before the pager teaches them.',
    title: 'Scale vocabulary',
    columnsHint: 4,
    cells: [
      { id: 'p99', label: 'p99', detail: 'The latency your unluckiest 1% feel' },
      { id: 'pool', label: 'Connection pool', detail: 'The first invisible ceiling you hit' },
      { id: 'replica2', label: 'Read replica', detail: 'Reads scale out; the lag is real' },
      { id: 'hotkey', label: 'Hot key', detail: 'One celebrity row melting one shard' },
      { id: 'backpressure', label: 'Backpressure', detail: 'Saying no early instead of dying late' },
      { id: 'breaker', label: 'Circuit breaker', detail: 'Fail fast when a dependency browns out' },
      { id: 'idem', label: 'Idempotency', detail: 'Retries that cannot double-charge' },
      { id: 'stampede', label: 'Stampede', detail: 'A thousand misses chasing one expiry' },
    ],
  },
  timeline: {
    heading: 'One box to one million',
    caption:
      'The same story at every successful startup, told in five power-ons. Each era ends the same way — the current bottleneck becomes the next era’s first slide.',
    title: 'The scaling chronicle',
    nowIndex: 4,
    eras: [
      { id: 'one', label: 'One server', marker: '0–1k', detail: 'App and DB share a box' },
      { id: 'split', label: 'Split tiers', marker: '1k–10k', detail: 'DB gets its own metal' },
      { id: 'lbera', label: 'Balance + cache', marker: '10k–100k', detail: 'Stateless apps, cache tier' },
      { id: 'repera', label: 'Replicas + CDN', marker: '100k–500k', detail: 'Reads scale out, edge absorbs' },
      { id: 'queueera', label: 'Queues + shards', marker: '→1M', detail: 'Async everything, shard the hot' },
    ],
  },
  close: {
    takeaways: [
      'Statelessness is the price of admission — every later move assumes it.',
      'Two cache layers do most of the serving; the database hears only the survivors.',
      'Send everything the user does not wait on through the queue.',
      'Measure p99 before and after every move — scaling without the loop is guessing.',
    ],
    signoff:
      'Find your current bottleneck tonight: one dashboard, one saturated resource, one graph. That graph is your next architecture slide — the board only ever lights one move at a time.',
  },
});
