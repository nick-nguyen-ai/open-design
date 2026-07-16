import { FILL_SCHEMA, type GazetteDeckFill } from '../deck-dgm-gazette/dgm-gazette-fill.js';

/**
 * "/demo/caching-field-guide" — experience-composer run 5 (gazette tour).
 * Brief: publish a field guide to caching — strategies, eviction, failure
 * modes — as an edited manual comparing technique trade-offs.
 * Composed via compose_slide_deck → dgm-gazette; validated by validate_fill.
 */
export const cachingFieldGuideFill: GazetteDeckFill = FILL_SCHEMA.parse({
  deck: {
    code: 'DGM-CCH-01',
    world: 'THE GAZETTE',
    title: 'A field guide to caching',
    standfirst:
      'Caching is the art of being approximately right, quickly. This manual prints the discipline in nine plates: where caches live, how entries are born and die, which strategy to reach for, and the failure modes that arrive at night.',
    notice: 'synthetic field manual — demonstration only',
  },
  flow: {
    heading: 'The anatomy of one fast read',
    caption:
      'Plate one follows a single read through its two chances at speed. Each miss costs an order of magnitude; the population step at the end is what makes the next reader lucky.',
    title: 'A read through the caches',
    nodes: [
      { id: 'req', label: 'Request arrives', kind: 'start' },
      { id: 'l1', label: 'In-process hit?', kind: 'decision' },
      { id: 'l2', label: 'Distributed hit?', kind: 'decision' },
      { id: 'origin', label: 'Origin store read', kind: 'process' },
      { id: 'kv', label: 'Cache cluster', kind: 'data' },
      { id: 'fast', label: 'Served in microseconds', kind: 'end' },
      { id: 'served', label: 'Served, next reader lucky', kind: 'end' },
    ],
    edges: [
      { from: 'req', to: 'l1', step: 1 },
      { from: 'l1', to: 'fast', label: 'hit', step: 2 },
      { from: 'l1', to: 'l2', label: 'miss', step: 3 },
      { from: 'l2', to: 'fast', label: 'hit', step: 4 },
      { from: 'l2', to: 'origin', label: 'miss', step: 5 },
      { from: 'origin', to: 'kv', label: 'populate + TTL', step: 6 },
      { from: 'kv', to: 'served', step: 7 },
    ],
  },
  sequence: {
    heading: 'Correspondence under a stampede',
    caption:
      'When a popular key expires, a thousand readers arrive at once. The single-flight lock elects one to fetch while the rest wait — the difference between a blip and an outage, printed as letters.',
    title: 'The stampede, contained',
    actors: [
      { id: 'readers', label: 'A thousand readers', kind: 'user' },
      { id: 'app3', label: 'App', kind: 'service' },
      { id: 'cache3', label: 'Cache', kind: 'store' },
      { id: 'db2', label: 'Database', kind: 'external' },
    ],
    messages: [
      { from: 'readers', to: 'app3', label: 'GET /trending — all at once' },
      { from: 'app3', to: 'cache3', label: 'key expired: miss ×1000' },
      { from: 'app3', to: 'cache3', label: 'SETNX lock:trending', note: 'one winner, 999 waiters' },
      { from: 'app3', to: 'db2', label: 'one query, from the winner' },
      { from: 'db2', to: 'app3', label: 'result, 40ms', reply: true },
      { from: 'app3', to: 'cache3', label: 'SET trending TTL 60 + release' },
      { from: 'cache3', to: 'readers', label: 'everyone reads the fresh entry', reply: true },
    ],
  },
  layers: {
    heading: 'A stratigraphy of speed',
    caption:
      'Caches are sediment: each layer catches what the one above lets through. The manual’s rule — know your hit ratio at every stratum, because a layer that stops earning its keep is pure risk.',
    title: 'Where caches live',
    sideLabel: 'a miss descends',
    layers: [
      { id: 'browser2', label: 'Browser', detail: 'The user’s own copy', items: ['HTTP cache', 'service worker'] },
      { id: 'cdn2', label: 'CDN edge', detail: 'Miles from the user, not continents', items: ['static', 'signed pages'] },
      { id: 'inproc', label: 'In-process', detail: 'Microseconds, per node', items: ['LRU maps'] },
      { id: 'dist', label: 'Distributed', detail: 'Shared truth, milliseconds', items: ['redis', 'memcached'], tone: 'accent' },
      { id: 'buffer', label: 'Database buffers', detail: 'The cache you already paid for', items: ['buffer pool'] },
    ],
  },
  zones: {
    heading: 'The estate of copies',
    caption:
      'Every district holds a copy of something the origin owns. The dispatch lines mark the only honest flows: populate on miss, invalidate on write — any other arrow on this map is a bug in waiting.',
    title: 'The caching estate',
    zones: [
      { id: 'client', label: 'Client side', nodes: [{ id: 'bcache', label: 'Browser cache' }] },
      { id: 'edgez2', label: 'Edge', nodes: [{ id: 'pop3', label: 'CDN PoPs' }] },
      { id: 'svctier', label: 'Service tier', nodes: [{ id: 'l1map', label: 'In-process maps' }, { id: 'cluster', label: 'Cache cluster' }] },
      { id: 'originz', label: 'Origin', nodes: [{ id: 'db3', label: 'Database' }, { id: 'inval', label: 'Invalidation bus' }] },
    ],
    links: [
      { from: 'bcache', to: 'pop3', label: 'conditional GET' },
      { from: 'pop3', to: 'cluster', label: 'miss' },
      { from: 'l1map', to: 'cluster', label: 'fallthrough' },
      { from: 'cluster', to: 'db3', label: 'populate on miss' },
      { from: 'inval', to: 'cluster', label: 'invalidate on write' },
      { from: 'inval', to: 'pop3', label: 'purge' },
    ],
  },
  cycle: {
    heading: 'The life of an entry',
    caption:
      'Every cached value walks this ring from birth to eviction. The manual marks refresh as the craftsman’s stage: refreshing just before expiry is what separates a warm cache from a lucky one.',
    title: 'The entry lifecycle',
    hubLabel: 'hit ratio',
    stages: [
      { id: 'populate', label: 'Populate', detail: 'Born on a miss' },
      { id: 'serve', label: 'Serve', detail: 'Earn the hit ratio' },
      { id: 'refreshst', label: 'Refresh', detail: 'Renew before expiry' },
      { id: 'expire', label: 'Expire', detail: 'TTL runs out' },
      { id: 'evict', label: 'Evict', detail: 'LRU makes room' },
    ],
  },
  compare: {
    heading: 'The three strategies, priced',
    caption:
      'Who owns the read path is the whole question. The tariff prints each strategy’s promise and its bill — and the verdict has not changed since the first edition.',
    title: 'Cache-aside vs read-through vs write-through',
    columns: [
      { id: 'aside2', label: 'Cache-aside', tone: 'accent' },
      { id: 'readthrough', label: 'Read-through' },
      { id: 'writethrough', label: 'Write-through' },
    ],
    rows: [
      { label: 'Who fills it', values: ['your code, explicitly', 'the cache library', 'every write, always'] },
      { label: 'Miss cost', values: ['one extra hop', 'hidden in the layer', 'rare — writes pre-warm'] },
      { label: 'Staleness', values: ['TTL-bounded', 'TTL-bounded', 'near zero'] },
      { label: 'The bill', values: ['stampede logic is yours', 'less control on keys', 'write latency, cold reads'] },
    ],
    verdict: 'Cache-aside wins by default: explicit, debuggable, and honest about who owns every miss.',
  },
  cells: {
    heading: 'A gazetteer of cache terms',
    caption:
      'Eight entries, one line each — the working vocabulary of every caching conversation, printed for the desk drawer.',
    title: 'Entries, second edition',
    columnsHint: 4,
    cells: [
      { id: 'ttl2', label: 'TTL', detail: 'How long a copy may claim to be true' },
      { id: 'lru', label: 'LRU', detail: 'Evict what nobody has touched longest' },
      { id: 'lfu', label: 'LFU', detail: 'Evict what nobody touches often' },
      { id: 'stampede2', label: 'Stampede', detail: 'A crowd chasing one expired key' },
      { id: 'negative', label: 'Negative cache', detail: 'Remember the misses too' },
      { id: 'warmup', label: 'Warm-up', detail: 'Pre-load before the traffic arrives' },
      { id: 'invalidation', label: 'Invalidation', detail: 'The famously hard problem' },
      { id: 'hitratio', label: 'Hit ratio', detail: 'The only KPI a cache has' },
    ],
  },
  timeline: {
    heading: 'A chronicle of borrowed time',
    caption:
      'The discipline keeps moving the copy closer to the reader: from CPU registers to RAM daemons to the network edge — and now to compute running inside the cache itself.',
    title: 'Caching, era by era',
    nowIndex: 3,
    eras: [
      { id: 'cpu', label: 'Hardware caches', marker: '1980s', detail: 'The pattern is born in silicon' },
      { id: 'memcached2', label: 'Memcached era', marker: '2003', detail: 'RAM as a shared service' },
      { id: 'redis2', label: 'Redis era', marker: '2009', detail: 'Structures, persistence, pub/sub' },
      { id: 'edge4', label: 'Edge era', marker: 'now', detail: 'Copies and compute at the PoP' },
    ],
  },
  close: {
    takeaways: [
      'Populate on miss, invalidate on write — every other arrow on the map is a future incident.',
      'Know the hit ratio of every layer; an idle cache is pure risk.',
      'Contain stampedes with single-flight before they contain you.',
      'Cache-aside by default; earn anything fancier with a measured problem.',
    ],
    signoff:
      'Print your own plate: one diagram of every cache between your user and your database, each labelled with its TTL and hit ratio. The blank spots on that map are next quarter’s incidents.',
  },
});
