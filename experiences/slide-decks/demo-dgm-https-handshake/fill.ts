import { FILL_SCHEMA, type SketchnoteDeckFill } from '../deck-dgm-sketchnote/dgm-sketchnote-fill.js';

/**
 * "/demo/https-handshake" — experience-composer run 1 (sketchnote tour).
 * Brief: teach how HTTPS actually works — the TLS 1.3 handshake, certificates,
 * and session keys — as a whiteboard walkthrough for engineers.
 * Composed via compose_slide_deck → dgm-sketchnote; validated by validate_fill.
 */
export const httpsHandshakeFill: SketchnoteDeckFill = FILL_SCHEMA.parse({
  deck: {
    code: 'FLD-TLS-01',
    world: 'FIELD NOTES · TLS',
    title: 'How HTTPS actually works',
    standfirst:
      'The padlock is a story in three parts: two strangers agree on secrets in public, a third party vouches for one of them, and then everything else is just fast symmetric crypto. Sketched here the way you would teach it.',
    notice: 'synthetic teaching notes — demonstration only',
  },
  flow: {
    heading: 'One round trip to a shared secret',
    caption:
      'TLS 1.3 collapses the old dance into a single round trip: both sides contribute a key share, the server proves who it is, and the trust check is the only gate — fail it and the browser walks away.',
    title: 'From hello to encrypted bytes',
    nodes: [
      { id: 'hello', label: 'ClientHello + key share', kind: 'start' },
      { id: 'shello', label: 'ServerHello + key share', kind: 'process' },
      { id: 'cert', label: 'Certificate + proof', kind: 'data' },
      { id: 'trust', label: 'Chain trusted?', kind: 'decision' },
      { id: 'abort', label: 'Connection refused', kind: 'end' },
      { id: 'keys', label: 'Both derive session keys', kind: 'process' },
      { id: 'app', label: 'Encrypted application data', kind: 'end' },
    ],
    edges: [
      { from: 'hello', to: 'shello', step: 1 },
      { from: 'shello', to: 'cert', step: 2 },
      { from: 'cert', to: 'trust', step: 3 },
      { from: 'trust', to: 'abort', label: 'no', step: 4 },
      { from: 'trust', to: 'keys', label: 'yes', step: 5 },
      { from: 'keys', to: 'app', step: 6 },
    ],
  },
  sequence: {
    heading: 'The whole conversation, verbatim',
    caption:
      'Four letters and the channel is up. Notice the browser never asks the CA anything at connection time — the vouching happened months earlier, and the trust store carries it locally.',
    title: 'TLS 1.3 in four messages',
    actors: [
      { id: 'browser', label: 'Browser', kind: 'user' },
      { id: 'server', label: 'Web server', kind: 'service' },
      { id: 'store', label: 'Local trust store', kind: 'store' },
    ],
    messages: [
      { from: 'browser', to: 'server', label: 'ClientHello: ciphers + key share + SNI' },
      { from: 'server', to: 'browser', label: 'ServerHello + certificate + Finished', reply: true },
      { from: 'browser', to: 'store', label: 'does a root I trust sign this chain?', note: 'offline check, no network' },
      { from: 'store', to: 'browser', label: 'chain verifies to a trusted root', reply: true },
      { from: 'browser', to: 'server', label: 'Finished — switch to session keys' },
      { from: 'server', to: 'browser', label: 'encrypted response begins', reply: true },
    ],
  },
  layers: {
    heading: 'Where the padlock actually sits',
    caption:
      'HTTPS is HTTP unchanged, riding a TLS record layer that encrypts everything above the transport. Each floor is oblivious to the ones below — which is why the web upgraded to encryption without rewriting itself.',
    title: 'The protected stack',
    sideLabel: 'what wraps what',
    layers: [
      { id: 'http', label: 'HTTP', detail: 'Verbs, headers, bodies — unchanged', items: ['requests', 'responses'] },
      { id: 'tls', label: 'TLS records', detail: 'Encrypts and authenticates every byte', items: ['AEAD', 'sequence numbers'], tone: 'accent' },
      { id: 'handshake', label: 'Handshake + keys', detail: 'Key agreement and identity', items: ['ECDHE', 'certificates'] },
      { id: 'tcp', label: 'TCP', detail: 'Ordered, reliable bytes' },
      { id: 'ip', label: 'IP and below', detail: 'Routing — sees only ciphertext' },
    ],
  },
  zones: {
    heading: 'Who can see what',
    caption:
      'The network middle — ISPs, coffee-shop wifi, middleboxes — carries the bytes but reads none of them. Identity lives at the edges: your trust store on one side, the server’s private key on the other.',
    title: 'The trust map',
    zones: [
      { id: 'device', label: 'Your device', nodes: [{ id: 'ua', label: 'Browser' }, { id: 'roots', label: 'Trust store' }] },
      { id: 'middle', label: 'The network middle', nodes: [{ id: 'wifi', label: 'Wi-Fi + ISP' }, { id: 'boxes', label: 'Middleboxes' }] },
      { id: 'serverside', label: 'Server side', nodes: [{ id: 'edge', label: 'TLS terminator' }, { id: 'origin', label: 'Origin app' }, { id: 'key', label: 'Private key' }] },
      { id: 'authority', label: 'Authority', nodes: [{ id: 'ca', label: 'Certificate authority' }, { id: 'ct', label: 'CT logs' }] },
    ],
    links: [
      { from: 'ua', to: 'edge', label: 'ciphertext only' },
      { from: 'ua', to: 'roots', label: 'verify chain' },
      { from: 'edge', to: 'key', label: 'signs handshake' },
      { from: 'edge', to: 'origin', label: 'decrypted inside' },
      { from: 'ca', to: 'ct', label: 'issuance logged' },
    ],
  },
  cycle: {
    heading: 'Certificates are a subscription',
    caption:
      'A certificate is not a fact, it is a lease. The loop below runs forever on every serious domain — and automation (ACME) is what turned it from an annual outage into a non-event.',
    title: 'The certificate lifecycle',
    hubLabel: 'ACME',
    stages: [
      { id: 'prove', label: 'Prove control', detail: 'DNS or HTTP challenge' },
      { id: 'issue', label: 'Issue', detail: 'CA signs the chain' },
      { id: 'deploy', label: 'Deploy', detail: 'Key + chain to the edge' },
      { id: 'monitor', label: 'Monitor', detail: 'CT logs, expiry alarms' },
      { id: 'renew', label: 'Renew', detail: 'Before day 90' },
    ],
  },
  compare: {
    heading: 'Why 1.3 retired a decade of knobs',
    caption:
      'TLS 1.3 is less configurable than 1.2 on purpose: fewer choices, fewer footguns, one less round trip. If a legacy client cannot speak it, that is a client problem worth knowing about.',
    title: 'TLS 1.2 vs TLS 1.3',
    columns: [
      { id: 'tls12', label: 'TLS 1.2' },
      { id: 'tls13', label: 'TLS 1.3', tone: 'accent' },
    ],
    rows: [
      { label: 'Handshake cost', values: ['two round trips', 'one round trip, 0-RTT resume'] },
      { label: 'Key exchange', values: ['RSA or ECDHE — configurable', 'ECDHE only, forward secret'] },
      { label: 'Cipher menu', values: ['dozens, some broken', 'five AEAD suites, all sound'] },
      { label: 'Handshake privacy', values: ['certificate in the clear', 'certificate encrypted'] },
    ],
    verdict: 'Terminate on 1.3, keep 1.2 only for measured legacy, and let nothing older connect.',
  },
  cells: {
    heading: 'Eight terms on the whiteboard',
    caption:
      'The vocabulary that carries every HTTPS conversation. Each gets one honest line — enough to hold your own in a security review without pretending to be a cryptographer.',
    title: 'The padlock glossary',
    columnsHint: 4,
    cells: [
      { id: 'sni', label: 'SNI', detail: 'Names the host before encryption starts' },
      { id: 'alpn', label: 'ALPN', detail: 'Picks HTTP/2 or /3 inside the handshake' },
      { id: 'fs', label: 'Forward secrecy', detail: 'Stolen keys cannot decrypt the past' },
      { id: 'aead', label: 'AEAD', detail: 'Encryption and integrity in one pass' },
      { id: 'ocsp', label: 'OCSP stapling', detail: 'Server carries its own freshness proof' },
      { id: 'hsts', label: 'HSTS', detail: 'Browser refuses plain HTTP thereafter' },
      { id: 'resume', label: 'Resumption', detail: 'Returning visitors skip the handshake' },
      { id: 'chain', label: 'Chain', detail: 'Leaf to intermediate to trusted root' },
    ],
  },
  timeline: {
    heading: 'From optional to assumed',
    caption:
      'Encryption on the web went from banking-only to table stakes in one decade. The turning point was not a protocol — it was free automated certificates making the right thing the easy thing.',
    title: 'The road to HTTPS everywhere',
    nowIndex: 4,
    eras: [
      { id: 'ssl', label: 'SSL 2 and 3', marker: '1995', detail: 'Netscape’s first padlocks' },
      { id: 'tls10', label: 'TLS 1.0–1.2', marker: '1999', detail: 'Standardised, slowly hardened' },
      { id: 'snowden', label: 'The wake-up', marker: '2013', detail: 'Pervasive surveillance revealed' },
      { id: 'acme', label: 'Free certificates', marker: '2015', detail: 'ACME automates issuance' },
      { id: 'tls13', label: 'TLS 1.3 default', marker: 'now', detail: 'One round trip, sound by default' },
    ],
  },
  close: {
    takeaways: [
      'The handshake buys a shared secret in one round trip; everything after is fast symmetric crypto.',
      'Trust is checked locally against your root store — the CA vouched long before you connected.',
      'Certificates are leases on a loop; automation is what makes the loop reliable.',
      'Prefer TLS 1.3 and treat anything older as a measured, expiring exception.',
    ],
    signoff:
      'Open any site’s padlock and read the chain end to end — leaf, intermediate, root. If you can narrate who signed what and which secret encrypts the page, this notebook has done its job.',
  },
});
