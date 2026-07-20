/**
 * open-design skill COMPOSE output — the internal OpenDesign system intro deck
 * for a mixed engineer/PM audience, composed via `compose_slide_deck` →
 * `deck-dgm-circuit` (THE LIT BOARD) and authored CONTENT ONLY against the
 * shared tour fill contract. Not a catalogue template — the demo route
 * `/demo/opendesign-intro`.
 *
 * Source content: GUIDANCE.md, docs/borrow-a-part.md, and
 * docs/superpowers/specs/design-audit-pilot/RUN-LOG.md. Every figure traces to
 * those sources (65 worlds, the Jul 15/18 pilot dates, the 529px/375px audit
 * finding); `deck.notice` states the provenance. The Zod schema is `.parse`d at
 * module load, so an out-of-contract edit fails loudly wherever this is imported.
 */
import { FILL_SCHEMA, type CircuitDeckFill } from '../deck-dgm-circuit/dgm-circuit-fill.js';

export const openDesignIntroFill: CircuitDeckFill = FILL_SCHEMA.parse({
  deck: {
    code: 'OD-01',
    world: 'OPENDESIGN',
    title: 'One system, five surfaces',
    standfirst:
      'A gallery of 65 live worlds, one skill with three routes, and an MCP server that picks templates and validates fills. This deck walks the machine end to end: templates carry the craft, fills carry the content, gates hold the bar.',
    notice: 'sourced from repo docs and pilot run logs, 2026-07',
  },
  flow: {
    heading: 'Compose: a doc goes in, a rendered experience comes out',
    caption:
      'Follow the numbered path: you supply source and answers, one MCP call picks the template and returns a fill skeleton, you author only content, and validation loops until the contract holds. No CSS at any step.',
    title: 'The COMPOSE route, source to /demo',
    nodes: [
      { id: 'src', label: 'Source docs', kind: 'start' },
      { id: 'intake', label: 'Intake brief', kind: 'process' },
      { id: 'select', label: 'MCP picks template', kind: 'process' },
      { id: 'skel', label: 'Fill skeleton', kind: 'data' },
      { id: 'author', label: 'Author the fill', kind: 'process' },
      { id: 'check', label: 'Contract holds?', kind: 'decision' },
      { id: 'ship', label: 'Scaffold + build', kind: 'process' },
      { id: 'done', label: '/demo route live', kind: 'end' },
    ],
    edges: [
      { from: 'src', to: 'intake', step: 1 },
      { from: 'intake', to: 'select', label: 'one call', step: 2 },
      { from: 'select', to: 'skel', step: 3 },
      { from: 'skel', to: 'author', step: 4 },
      { from: 'author', to: 'check', step: 5 },
      { from: 'check', to: 'author', label: 'findings' },
      { from: 'check', to: 'ship', label: 'valid', step: 6 },
      { from: 'ship', to: 'done', step: 7 },
    ],
  },
  sequence: {
    heading: 'Selection and validation are one deterministic conversation',
    caption:
      'The skill carries the judgment; the server carries the craft. Scoring is transparent — audience overlap, intent keywords, corporate fit — and findings echo the slot, the limit, and the guidance.',
    title: 'Skill ↔ MCP server handshake',
    actors: [
      { id: 'claude', label: 'Claude + skill', kind: 'user' },
      { id: 'mcp', label: 'MCP server', kind: 'service' },
      { id: 'reg', label: 'Compiled registry', kind: 'store' },
    ],
    messages: [
      { from: 'claude', to: 'mcp', label: 'compose_slide_deck(context, brief)' },
      { from: 'mcp', to: 'reg', label: 'score every descriptor' },
      { from: 'reg', to: 'mcp', label: 'ranked candidates', reply: true },
      { from: 'mcp', to: 'claude', label: 'template + fill skeleton', reply: true, note: 'stable tie-break' },
      { from: 'claude', to: 'mcp', label: 'validate_fill(fill)' },
      { from: 'mcp', to: 'claude', label: 'valid | precise findings', reply: true, note: 'max 3 rounds, then stop' },
    ],
  },
  layers: {
    heading: 'You own the top layer; the template owns everything under it',
    caption:
      'Reading top-down: the fill is the only layer a run may touch. The accented template layer holds all layout, color, and motion — which is why a flaw found mid-run is template work to report, never patch.',
    title: 'The division of labor, layer by layer',
    sideLabel: 'a fill becomes pixels',
    layers: [
      { id: 'fill', label: 'Content fill', detail: 'Your words in typed slots', items: ['copy', 'data', 'no geometry'] },
      { id: 'contract', label: 'Contracts', detail: 'Zod descriptor + certifier', items: ['slots', 'limits', 'craft rules'] },
      { id: 'template', label: 'World template', detail: 'All the craft lives here', items: ['layout', 'color', 'motion'], tone: 'accent' },
      { id: 'tokens', label: 'Token packages', detail: 'Themes, motion, primitives', items: ['var(--dur-*)', 'var(--ease-*)'] },
      { id: 'gallery', label: 'Gallery route', detail: 'The rendered truth', items: ['/live/*', '/demo/*'] },
    ],
  },
  zones: {
    heading: 'Sixty-five live worlds, five surfaces, one gallery',
    caption:
      "Each sector is a surface; the worlds shown are representatives, not the full roster of 65. The wire to watch is borrow: part IDs anchored in three pilot worlds already let one world's treatment travel to another.",
    title: 'The gallery estate (representative worlds)',
    zones: [
      {
        id: 'decks',
        label: 'Slide decks',
        nodes: [
          { id: 'cutover', label: 'Cloud Migration' },
          { id: 'tminus', label: 'T-Minus' },
          { id: 'circuit', label: 'The Lit Board' },
        ],
      },
      { id: 'dash', label: 'Dashboards', nodes: [{ id: 'cockpit', label: 'Monitoring Cockpit' }] },
      {
        id: 'proj',
        label: 'Project pages',
        nodes: [
          { id: 'weighing', label: 'The Weighing Room' },
          { id: 'foundry', label: 'Foundry' },
        ],
      },
      { id: 'personal', label: 'Personal pages', nodes: [{ id: 'studio', label: 'Data-Scientist Studio' }] },
      { id: 'expl', label: 'Explainers', nodes: [{ id: 'drawing', label: 'Drawing Office' }] },
    ],
    links: [
      { from: 'cutover', to: 'cockpit' },
      { from: 'cockpit', to: 'studio' },
    ],
  },
  cycle: {
    heading: 'Quality is a loop, not a gate at the end',
    caption:
      'Every run walks this ring before claiming done. On its first outing the AUDIT route caught a real critical — deck chrome forcing a 529px scroll on a 375px screen — and correctly reported it as template work.',
    title: 'The quality loop around every run',
    hubLabel: 'quality-gates.md',
    stages: [
      { id: 'run', label: 'Run a route', detail: 'Compose, borrow, or audit' },
      { id: 'render', label: 'Render', detail: 'Build, serve, screenshot' },
      { id: 'critique', label: 'Critique', detail: 'Six axes; under 3 blocks' },
      { id: 'sweep', label: 'Gate sweep', detail: 'Scroll, focus, honest copy' },
      { id: 'report', label: 'Report', detail: 'Severity-ranked, zero edits' },
      { id: 'fix', label: 'Template work', detail: 'The fix lands at the source' },
    ],
  },
  compare: {
    heading: 'Three routes, one skill — pick by what you need shipped',
    caption:
      'Same skill, same gates, different deliverables. The columns share one hard boundary that keeps the system safe: no route ever edits a shipped template to make its own run look better.',
    title: 'COMPOSE vs BORROW vs AUDIT',
    columns: [
      { id: 'compose', label: 'COMPOSE' },
      { id: 'borrow', label: 'BORROW' },
      { id: 'audit', label: 'AUDIT' },
    ],
    rows: [
      { label: 'You bring', values: ['Source docs and a brief', 'A part ID from the inspector', 'Any live or demo route'] },
      { label: 'You get', values: ['A rendered /demo route', 'That treatment, adapted in your world', 'A severity punch list, zero edits'] },
      { label: 'The machine', values: ['MCP selects + validates', 'Resolve, slice, adapt, verify', 'Six axes + mechanical gates'] },
      { label: 'Hard boundary', values: ['Never edit the template', 'Source world stays untouched', 'Report, never hot-patch'] },
    ],
    verdict:
      'A whole experience, one treatment, or a verdict — same bar all three ways, and none patches a template.',
  },
  cells: {
    heading: 'Eight terms and you can read the whole repo',
    caption:
      'The working vocabulary of the system. The inspector cell is the live demo: arm it on any live route, click a part, and paste the copied command straight into a session.',
    title: 'The OpenDesign lexicon',
    columnsHint: 4,
    cells: [
      { id: 'world', label: 'World template', detail: 'TSX + CSS that carries all layout, color, motion' },
      { id: 'fillcell', label: 'Fill', detail: 'Typed content slots — the only thing a run authors' },
      { id: 'descriptor', label: 'Descriptor', detail: 'The Zod contract compose and validate enforce' },
      { id: 'partid', label: 'data-part-id', detail: 'Public borrow anchor: experience/section/part' },
      {
        id: 'inspector',
        label: 'Part inspector',
        badge: 'demo',
        detail: '?inspect=1; click a part, copy the command',
      },
      { id: 'noticecell', label: 'Provenance notice', detail: 'Every deck states where its data came from' },
      { id: 'certifier', label: 'Certifier', detail: 'Zero-findings gate across all worlds' },
      { id: 'demoroute', label: '/demo route', detail: 'Compose output — never a catalogue template' },
    ],
  },
  timeline: {
    heading: 'How the craft became a system',
    caption:
      'The craft came first: worlds were built by hand, then contracts, tools, and routes grew around them. Both pilots ran in the same July week, and the final batches of live worlds landed right behind them.',
    title: 'OpenDesign, era by era',
    nowIndex: 5,
    eras: [
      { id: 'hand', label: 'Hand-built', detail: 'Worlds crafted, no contracts' },
      { id: 'contracts', label: 'Contracts', detail: 'Descriptor, certifier, parity' },
      { id: 'mcptools', label: 'MCP tools', detail: 'Deterministic selection' },
      { id: 'borrowpilot', label: 'Borrow pilot', marker: 'Jul 15', detail: 'Inspector + part IDs ship' },
      { id: 'auditpilot', label: 'Audit pilot', marker: 'Jul 18', detail: 'First run catches a real defect' },
      { id: 'live65', label: '65 worlds live', marker: 'now', detail: 'One skill routes all three' },
    ],
  },
  close: {
    takeaways: [
      'Templates carry the craft, fills carry the content — nobody writes CSS to ship a deck.',
      'One deterministic MCP call picks the template; validate_fill makes fixes mechanical.',
      'The inspector turns any anchored part into a one-line borrow command.',
      'The gates are real: the audit pilot caught a live template defect on day one.',
    ],
    signoff:
      'Open the gallery and arm ?inspect=1 on a live world. This week, compose one experience from a doc you own — and when something looks wrong, file it as template work. That one rule is what keeps 65 worlds at the bar.',
  },
});
