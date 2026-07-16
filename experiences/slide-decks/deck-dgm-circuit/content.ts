import type { CircuitDeckFill } from './dgm-circuit-fill.js';

/**
 * SHIPPED_FILL for "The Lit Board" — the circuit tour deck's shipped story:
 * the anatomy of a video streaming platform, told as a powered board.
 * Original content, synthetic by design.
 */
export const SHIPPED_FILL: CircuitDeckFill = {
  deck: {
    code: 'DGM-CX-01',
    world: 'THE LIT BOARD',
    title: 'Anatomy of a stream',
    standfirst:
      'One upload becomes a million smooth playbacks. This board lights up the machine that does it — the transcode ladder, the edge, and the small adaptive loop inside every player that decides, second by second, what quality you deserve.',
    notice: 'synthetic platform story — demonstration only',
  },
  flow: {
    heading: 'Upload once, play anywhere',
    caption:
      'The mezzanine file is written once and never served. Everything the audience sees is a derived rendition — the ladder decision splits the pipeline by codec support before packaging seals each variant for the edge.',
    title: 'From upload to first frame',
    nodes: [
      { id: 'upload', label: 'Creator upload', kind: 'start' },
      { id: 'inspect', label: 'Probe + validate', kind: 'process' },
      { id: 'mezz', label: 'Mezzanine store', kind: 'data' },
      { id: 'ladder', label: 'Which codecs?', kind: 'decision' },
      { id: 'transcode', label: 'Transcode ladder', kind: 'process' },
      { id: 'package', label: 'Package + encrypt', kind: 'process' },
      { id: 'edge', label: 'Edge cache fill', kind: 'process' },
      { id: 'play', label: 'First frame', kind: 'end' },
    ],
    edges: [
      { from: 'upload', to: 'inspect', step: 1 },
      { from: 'inspect', to: 'mezz', step: 2 },
      { from: 'mezz', to: 'ladder', step: 3 },
      { from: 'ladder', to: 'transcode', label: 'h264 + av1', step: 4 },
      { from: 'transcode', to: 'package', step: 5 },
      { from: 'package', to: 'edge', step: 6 },
      { from: 'edge', to: 'play', step: 7 },
    ],
  },
  sequence: {
    heading: 'Four calls before a single frame',
    caption:
      'Startup latency lives in this conversation. The manifest tells the player what exists, the licence unlocks it, and only then does a segment move — which is why every millisecond here is fought over.',
    title: 'The playback handshake',
    actors: [
      { id: 'player', label: 'Player', kind: 'user' },
      { id: 'api', label: 'Playback API', kind: 'service' },
      { id: 'drm', label: 'DRM licence', kind: 'external' },
      { id: 'cdn', label: 'Edge PoP', kind: 'store' },
    ],
    messages: [
      { from: 'player', to: 'api', label: 'GET /play/{title}' },
      { from: 'api', to: 'player', label: 'manifest + tokens', reply: true, note: 'signed, short-lived' },
      { from: 'player', to: 'drm', label: 'licence request' },
      { from: 'drm', to: 'player', label: 'keys', reply: true },
      { from: 'player', to: 'cdn', label: 'GET segment 0 @ 720p' },
      { from: 'cdn', to: 'player', label: 'first bytes', reply: true },
    ],
  },
  layers: {
    heading: 'The stack under the play button',
    caption:
      'Reading top-down: the player decides, the edge answers, the pipeline prepares, storage remembers. The ABR layer is accented because it is the only layer making a decision every two seconds of every playback on earth.',
    title: 'Playback, layer by layer',
    sideLabel: 'a segment ascends',
    layers: [
      { id: 'app', label: 'Player app', detail: 'UI, buffers, decoders', items: ['tv', 'mobile', 'web'] },
      { id: 'abr', label: 'ABR logic', detail: 'Picks a rendition per segment', items: ['throughput', 'buffer level'], tone: 'accent' },
      { id: 'edge2', label: 'CDN edge', detail: 'Serves 95% of bytes', items: ['origin shield', 'tiered fill'] },
      { id: 'pipeline', label: 'Media pipeline', detail: 'Transcode, package, encrypt', items: ['ladder', 'CMAF'] },
      { id: 'store2', label: 'Origin storage', detail: 'Mezzanines and variants', items: ['object store'] },
    ],
  },
  zones: {
    heading: 'The board has four sectors',
    caption:
      'Devices at the rim, edge metal in the middle, the control plane and media pipeline in the core. The wire to watch is edge-to-origin: every request on it is a cache miss someone will page about.',
    title: 'The platform estate',
    zones: [
      { id: 'devices', label: 'Devices', nodes: [{ id: 'tv', label: 'Living-room apps' }, { id: 'mobile', label: 'Mobile + web' }] },
      { id: 'edge3', label: 'Edge sector', nodes: [{ id: 'pop2', label: 'PoPs ×200' }, { id: 'shield', label: 'Origin shield' }] },
      { id: 'control', label: 'Control plane', nodes: [{ id: 'papi', label: 'Playback API' }, { id: 'entitle', label: 'Entitlements' }] },
      { id: 'media', label: 'Media pipeline', nodes: [{ id: 'farm', label: 'Transcode farm' }, { id: 'pack2', label: 'Packager' }, { id: 'orig', label: 'Origin store' }] },
    ],
    links: [
      { from: 'tv', to: 'pop2', label: 'segments' },
      { from: 'mobile', to: 'papi', label: 'play intent' },
      { from: 'pop2', to: 'shield', label: 'miss' },
      { from: 'shield', to: 'orig', label: 'fill' },
      { from: 'papi', to: 'entitle' },
      { from: 'farm', to: 'pack2' },
      { from: 'pack2', to: 'orig' },
    ],
  },
  cycle: {
    heading: 'The two-second referendum',
    caption:
      'Every couple of seconds, every player votes on its own network truth: measure what the last segment cost, pick the next rendition, fetch, buffer, repeat. Smooth playback is this loop refusing to panic.',
    title: 'The adaptive bitrate loop',
    hubLabel: 'per segment',
    stages: [
      { id: 'measure', label: 'Measure', detail: 'Throughput of last fetch' },
      { id: 'estimate', label: 'Estimate', detail: 'Smooth the signal' },
      { id: 'pick', label: 'Pick rendition', detail: 'Highest safe rung' },
      { id: 'fetch', label: 'Fetch', detail: 'Next segment from edge' },
      { id: 'buffer', label: 'Buffer', detail: 'Seconds of safety' },
    ],
  },
  compare: {
    heading: 'Three wires to the screen',
    caption:
      'HLS and DASH are the segmented workhorses; WebRTC is a different animal for a different job. The board keeps both segmented rails lit via CMAF and saves the real-time rail for when latency IS the product.',
    title: 'HLS vs DASH vs WebRTC',
    columns: [
      { id: 'hls', label: 'HLS', tone: 'accent' },
      { id: 'dash', label: 'DASH' },
      { id: 'webrtc', label: 'WebRTC' },
    ],
    rows: [
      { label: 'Latency class', values: ['3–30s (LL: ~2s)', '3–30s (LL: ~3s)', 'sub-second'] },
      { label: 'Device reach', values: ['everywhere Apple', 'everywhere else', 'browsers, native'] },
      { label: 'Scale model', values: ['plain CDN objects', 'plain CDN objects', 'stateful sessions'] },
      { label: 'Use it for', values: ['VOD + live at scale', 'VOD + live at scale', 'calls, auctions, sports betting'] },
    ],
    verdict: 'Ship CMAF once, serve HLS and DASH from the same segments, and rent WebRTC only when sub-second is the product.',
  },
  cells: {
    heading: 'Terminal glossary',
    caption:
      'Eight tags that appear in every incident channel on this platform. Learn them once and the dashboards, the manifests, and the pager messages all start reading as one language.',
    title: 'The streaming lexicon',
    columnsHint: 4,
    cells: [
      { id: 'segment', label: 'Segment', detail: '2–6s chunk, the unit of delivery' },
      { id: 'manifest', label: 'Manifest', detail: 'The menu of renditions and segments' },
      { id: 'rendition', label: 'Rendition', detail: 'One rung of the bitrate ladder' },
      { id: 'abr2', label: 'ABR', detail: 'The loop that climbs the ladder' },
      { id: 'drm2', label: 'DRM', detail: 'Keys and licences around content' },
      { id: 'shield2', label: 'Origin shield', detail: 'The cache that protects origin' },
      { id: 'rebuffer', label: 'Rebuffer', detail: 'The spinner — the metric that matters' },
      { id: 'cmaf', label: 'CMAF', detail: 'One segment format for HLS and DASH' },
    ],
  },
  timeline: {
    heading: 'Twenty years of lower latency',
    caption:
      'Each era traded a little simplicity for a lot of reach or speed: Flash gave way to HTTP segments, formats converged on CMAF, and the current frontier drags segmented latency toward broadcast.',
    title: 'Streaming, era by era',
    nowIndex: 4,
    eras: [
      { id: 'rtmp', label: 'RTMP + Flash', marker: '2005', detail: 'Stateful servers per viewer' },
      { id: 'hls2', label: 'HTTP segments', marker: '2009', detail: 'HLS rides plain CDNs' },
      { id: 'dash2', label: 'DASH standard', marker: '2012', detail: 'The open counterpart' },
      { id: 'cmaf2', label: 'CMAF converges', marker: '2017', detail: 'One segment, two manifests' },
      { id: 'llhls', label: 'Low-latency rails', marker: 'now', detail: 'LL-HLS chasing broadcast' },
    ],
  },
  close: {
    takeaways: [
      'Store one mezzanine, serve only derived renditions — the ladder is the product.',
      'Startup latency lives in the handshake; fight for milliseconds before the first segment.',
      'The ABR loop is the platform’s heartbeat: measure, pick, fetch, buffer, repeat.',
      'Watch the edge-to-origin wire — every byte on it is a miss with a cost.',
    ],
    signoff:
      'Open your platform’s player stats overlay tonight: find the rendition switches, the buffer depth, and the rebuffer count. If you can narrate those three numbers, you can run this board.',
  },
};
