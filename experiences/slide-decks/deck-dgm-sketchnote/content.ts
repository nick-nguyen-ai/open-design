import type { SketchnoteDeckFill } from './dgm-sketchnote-fill.js';

/**
 * SHIPPED_FILL for "The Field Notebook" — the sketchnote tour deck's shipped
 * story: what actually happens when you type a URL and press Enter, told
 * across the eight diagram kinds. Original content, synthetic by design.
 */
export const SHIPPED_FILL: SketchnoteDeckFill = {
  deck: {
    code: 'DGM-SK-01',
    world: 'THE FIELD NOTEBOOK',
    title: 'From URL to pixels',
    standfirst:
      'You type a address and press Enter. What follows is a half-second relay race across caches, resolvers, sockets, and render loops — sketched here page by page, the way you would explain it at a whiteboard.',
    notice: 'synthetic teaching content — demonstration only',
  },
  flow: {
    heading: 'Half a second, seven handoffs',
    caption:
      'The happy path from keystroke to pixels. The two decisions that matter are both caches: a warm browser cache skips the network entirely, and a warm CDN edge skips the origin.',
    title: 'The journey of one request',
    nodes: [
      { id: 'you', label: 'You press Enter', kind: 'start' },
      { id: 'cache', label: 'Browser cache warm?', kind: 'decision' },
      { id: 'dns', label: 'DNS lookup', kind: 'process' },
      { id: 'conn', label: 'TCP + TLS handshake', kind: 'process' },
      { id: 'edge', label: 'CDN edge hit?', kind: 'decision' },
      { id: 'origin', label: 'Origin renders response', kind: 'process' },
      { id: 'store', label: 'Edge cache', kind: 'data' },
      { id: 'paint', label: 'Pixels on screen', kind: 'end' },
    ],
    edges: [
      { from: 'you', to: 'cache', step: 1 },
      { from: 'cache', to: 'paint', label: 'hit', step: 2 },
      { from: 'cache', to: 'dns', label: 'miss', step: 3 },
      { from: 'dns', to: 'conn', step: 4 },
      { from: 'conn', to: 'edge', step: 5 },
      { from: 'edge', to: 'paint', label: 'hit', step: 6 },
      { from: 'edge', to: 'origin', label: 'miss', step: 7 },
      { from: 'origin', to: 'store', step: 8 },
      { from: 'store', to: 'paint', step: 9 },
    ],
  },
  sequence: {
    heading: 'Nobody knows the whole answer',
    caption:
      'DNS is a chain of narrowing questions. The recursive resolver does the legwork once, caches the answer, and every later visitor on the same resolver rides that cache until the TTL runs out.',
    title: 'Resolving www.example.com',
    actors: [
      { id: 'browser', label: 'Browser', kind: 'user' },
      { id: 'resolver', label: 'Recursive resolver', kind: 'service' },
      { id: 'root', label: 'Root + TLD servers', kind: 'external' },
      { id: 'auth', label: 'Authoritative NS', kind: 'store' },
    ],
    messages: [
      { from: 'browser', to: 'resolver', label: 'where is www.example.com?' },
      { from: 'resolver', to: 'root', label: 'who owns .com?', note: 'cached for days in practice' },
      { from: 'root', to: 'resolver', label: 'ask the .com TLD servers', reply: true },
      { from: 'resolver', to: 'auth', label: 'who is www.example.com?' },
      { from: 'auth', to: 'resolver', label: 'A record: 93.184.216.34, TTL 300', reply: true },
      { from: 'resolver', to: 'browser', label: 'here is the address', reply: true },
    ],
  },
  layers: {
    heading: 'One request crosses six floors',
    caption:
      'Every byte of that request descends the sender’s stack and climbs the receiver’s. Each floor only talks to its neighbours — which is exactly why any one of them can be swapped out without the rest noticing.',
    title: 'The stack the request rides',
    sideLabel: 'down on send, up on receive',
    layers: [
      { id: 'app', label: 'Application', detail: 'The browser speaks HTTP', items: ['HTTP/3', 'DNS', 'WebSocket'], tone: 'accent' },
      { id: 'tls', label: 'Security', detail: 'TLS wraps the conversation', items: ['TLS 1.3', 'certificates'] },
      { id: 'transport', label: 'Transport', detail: 'Streams, ordering, retries', items: ['TCP', 'QUIC'] },
      { id: 'network', label: 'Network', detail: 'Addressing and routing', items: ['IP', 'BGP'] },
      { id: 'link', label: 'Link + physical', detail: 'Frames on a wire or air', items: ['Ethernet', 'Wi-Fi'], tone: 'base' },
    ],
  },
  zones: {
    heading: 'Four neighbourhoods, one street',
    caption:
      'The request visits four estates: your device, your ISP’s resolver, the CDN edge a few miles away, and the origin that might be a continent off. The whole latency game is answering as close to you as possible.',
    title: 'Where the work actually runs',
    zones: [
      { id: 'device', label: 'Your device', nodes: [{ id: 'ua', label: 'Browser' }, { id: 'oscache', label: 'OS DNS cache' }] },
      { id: 'isp', label: 'ISP', nodes: [{ id: 'rr', label: 'Recursive resolver' }] },
      { id: 'edge', label: 'CDN edge', nodes: [{ id: 'pop', label: 'Edge PoP' }, { id: 'waf', label: 'WAF' }] },
      { id: 'origin', label: 'Origin cloud', nodes: [{ id: 'lb', label: 'Load balancer' }, { id: 'app2', label: 'App servers' }, { id: 'db', label: 'Database' }] },
    ],
    links: [
      { from: 'ua', to: 'oscache', label: 'first look' },
      { from: 'ua', to: 'rr', label: 'dns, ~20ms' },
      { from: 'ua', to: 'pop', label: 'https, ~30ms' },
      { from: 'pop', to: 'lb', label: 'on miss, ~80ms' },
      { from: 'waf', to: 'pop', label: 'inspects' },
      { from: 'lb', to: 'app2' },
      { from: 'app2', to: 'db', label: 'queries' },
    ],
  },
  cycle: {
    heading: 'The page never stops rendering',
    caption:
      'Rendering is not a one-shot pipeline but a loop: every script mutation or style change re-enters it. Fast pages are the ones that keep each lap inside a frame budget of sixteen milliseconds.',
    title: 'The render loop',
    hubLabel: '16ms budget',
    stages: [
      { id: 'parse', label: 'Parse', detail: 'HTML to DOM, CSS to CSSOM' },
      { id: 'style', label: 'Style', detail: 'Match rules to nodes' },
      { id: 'layout', label: 'Layout', detail: 'Compute boxes' },
      { id: 'paint', label: 'Paint', detail: 'Rasterise layers' },
      { id: 'composite', label: 'Composite', detail: 'GPU assembles the frame' },
      { id: 'react', label: 'React to input', detail: 'Scripts mutate, loop again' },
    ],
  },
  compare: {
    heading: 'Three generations on the same wire',
    caption:
      'The protocol under the page changed twice in a decade. The through-line: every generation attacks head-of-line blocking one layer deeper — first in HTTP itself, then in TCP.',
    title: 'HTTP/1.1 vs HTTP/2 vs HTTP/3',
    columns: [
      { id: 'h1', label: 'HTTP/1.1' },
      { id: 'h2', label: 'HTTP/2' },
      { id: 'h3', label: 'HTTP/3', tone: 'accent' },
    ],
    rows: [
      { label: 'Transport', values: ['TCP', 'TCP', 'QUIC on UDP'] },
      { label: 'Parallelism', values: ['6-ish connections', 'multiplexed streams', 'independent streams'] },
      { label: 'Head-of-line', values: ['blocks per connection', 'blocks on packet loss', 'per-stream only'] },
      { label: 'Setup cost', values: ['TCP + TLS round trips', 'TCP + TLS round trips', '0-RTT resumption'] },
    ],
    verdict: 'Serve H3 where you can, keep H2 as the floor, and treat H1 as a compatibility exit.',
  },
  cells: {
    heading: 'The words on the journey',
    caption:
      'Eight terms that carry the whole story. If a teammate can gloss each of these in one line, they can debug most of what goes wrong between a keystroke and a pixel.',
    title: 'A pocket glossary',
    columnsHint: 4,
    cells: [
      { id: 'url', label: 'URL', detail: 'scheme://host:port/path?query#fragment' },
      { id: 'ttl', label: 'TTL', detail: 'How long an answer may be cached' },
      { id: 'sni', label: 'SNI', detail: 'Names the host inside the TLS hello' },
      { id: 'cdn', label: 'CDN PoP', detail: 'The edge datacentre that answers nearby' },
      { id: 'tls13', label: 'TLS 1.3', detail: 'One round trip to an encrypted channel' },
      { id: 'hsts', label: 'HSTS', detail: 'Browser remembers: HTTPS only, always' },
      { id: 'etag', label: 'ETag', detail: 'Fingerprint that turns 200s into 304s' },
      { id: 'ttfb', label: 'TTFB', detail: 'Keystroke to first byte — the honest metric' },
    ],
  },
  timeline: {
    heading: 'Thirty years to shave a round trip',
    caption:
      'Each era exists to remove a wait: more sockets, then multiplexing, then a new transport. The next wait in line is the last unencrypted lookup — DNS itself.',
    title: 'How the web got fast',
    nowIndex: 4,
    eras: [
      { id: 'h09', label: 'HTTP/0.9', marker: '1991', detail: 'One line, one document' },
      { id: 'h11', label: 'HTTP/1.1', marker: '1997', detail: 'Keep-alive and Host headers' },
      { id: 'https', label: 'HTTPS by default', marker: '2013', detail: 'Encryption becomes table stakes' },
      { id: 'h2', label: 'HTTP/2', marker: '2015', detail: 'Streams over one connection' },
      { id: 'h3', label: 'HTTP/3 + QUIC', marker: 'now', detail: 'Transport rebuilt on UDP' },
    ],
  },
  close: {
    takeaways: [
      'Two cache decisions — browser and edge — decide whether the network is involved at all.',
      'DNS is a chain of narrowing questions, answered once and ridden from cache.',
      'Every protocol generation attacks head-of-line blocking one layer deeper.',
      'Fast pages are render loops that stay inside the 16ms lap, not one-shot pipelines.',
    ],
    signoff:
      'Trace one real page load in your devtools this week: find the DNS time, the TLS time, and the first byte. The sketches in this notebook are the map; the waterfall is the territory.',
  },
};
