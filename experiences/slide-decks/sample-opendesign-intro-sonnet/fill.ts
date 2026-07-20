/**
 * open-design skill COMPOSE output — the internal OpenDesign system intro deck
 * for a mixed engineer/PM audience, composed via `compose_slide_deck` →
 * `deck-dgm-circuit` (THE LIT BOARD) and authored CONTENT ONLY against the
 * shared tour fill contract. Not a catalogue template — the demo route
 * `/demo/opendesign-intro-sonnet`.
 *
 * Source content: GUIDANCE.md, docs/borrow-a-part.md, and
 * docs/superpowers/specs/design-audit-pilot/RUN-LOG.md. World counts (25
 * decks + 10 dashboards + 10 explainers + 10 personal + 10 project-pages =
 * 65) were verified against the repo directory listing, not taken from the
 * brief. Timeline markers trace to `git log` dates. The Zod schema is
 * `.parse`d at module load, so an out-of-contract edit fails loudly wherever
 * this is imported.
 */
import { FILL_SCHEMA, type CircuitDeckFill } from '../deck-dgm-circuit/dgm-circuit-fill.js';

export const openDesignIntroSonnetFill: CircuitDeckFill = FILL_SCHEMA.parse({
  deck: {
    code: 'OD-01',
    world: 'OpenDesign',
    title: 'OpenDesign: One System, Five Surfaces',
    standfirst:
      'One design system split by a strict division of labor: templates carry the craft, fills carry the content, and one MCP server plus one skill turn source material into a shipped, gated route.',
    notice: 'Figures verified against repo state, 2026-07-19',
  },
  flow: {
    heading: 'Compose turns source content into a shipped route',
    caption:
      'One call to the MCP server picks a template and returns a fill skeleton; the skill authors every slot from source, then validate_fill checks the contract before anything ships.',
    title: 'The compose pipeline',
    nodes: [
      { id: 'source', label: 'Source content', kind: 'start' },
      { id: 'select', label: 'MCP selects template', kind: 'process' },
      { id: 'skeleton', label: 'Fill skeleton returned', kind: 'data' },
      { id: 'author', label: 'Skill authors slots', kind: 'process' },
      { id: 'validate', label: 'validate_fill', kind: 'decision' },
      { id: 'ship', label: 'Scaffold, screenshot, ship', kind: 'end' },
    ],
    edges: [
      { from: 'source', to: 'select', step: 1 },
      { from: 'select', to: 'skeleton', step: 2 },
      { from: 'skeleton', to: 'author', step: 3 },
      { from: 'author', to: 'validate', step: 4 },
      { from: 'validate', to: 'author', label: 'fix + re-validate' },
      { from: 'validate', to: 'ship', label: 'valid', step: 5 },
    ],
  },
  sequence: {
    heading: 'The live demo: borrow a part in one click',
    caption:
      'Every notable part of a live world carries a stable data-part-id. Hover highlights it, click copies a ready-to-paste borrow command, and the skill resolves, classifies, slices, adapts, and verifies behind it.',
    title: 'Borrowing a part',
    actors: [
      { id: 'designer', label: 'Designer', kind: 'user' },
      { id: 'inspector', label: 'Part Inspector', kind: 'service' },
      { id: 'skill', label: 'open-design skill (BORROW)', kind: 'service' },
      { id: 'source', label: 'Source world', kind: 'external' },
    ],
    messages: [
      { from: 'designer', to: 'inspector', label: 'Click a highlighted part' },
      { from: 'inspector', to: 'designer', label: 'data-part-id + copy button', reply: true },
      { from: 'designer', to: 'skill', label: 'Paste: Borrow part <id>' },
      { from: 'skill', to: 'source', label: 'Resolve, classify, slice' },
      { from: 'source', to: 'skill', label: 'Component or bespoke code', reply: true },
      { from: 'skill', to: 'designer', label: 'Adapted copy, four gates verified', reply: true },
    ],
  },
  layers: {
    heading: 'Four layers, one strict division of labor',
    caption:
      "Craft lives in the template, content lives in the fill, selection lives in the MCP server, and judgment lives in the skill — no layer ever does another layer's job.",
    title: 'Who owns what',
    layers: [
      { id: 'skill', label: 'open-design skill', detail: 'Orchestrates the run: content selection, narrative flow, slot authoring', tone: 'accent' },
      { id: 'mcp', label: 'MCP compose tools', detail: 'Deterministic template selection plus fill validation' },
      { id: 'fill', label: 'Fill (content.ts)', detail: 'Typed content only — no layout, no color, no motion' },
      { id: 'template', label: 'World-template', detail: 'All craft: layout, color, motion, geometry', tone: 'base' },
    ],
    sideLabel: 'content flows down, never craft',
  },
  zones: {
    heading: "The repo is the system's own estate map",
    caption:
      'Four zones, each with one job: the gallery renders, the MCP server serves compose tools, the registry compiles contracts, and every world lives in its own experience directory.',
    title: 'Repo estate',
    zones: [
      {
        id: 'gallery-zone',
        label: 'apps/gallery',
        nodes: [
          { id: 'g-live', label: '/live/* worlds' },
          { id: 'g-inspect', label: 'Part Inspector' },
        ],
      },
      {
        id: 'worlds-zone',
        label: 'experiences/<surface>/<id>',
        nodes: [
          { id: 'w-tsx', label: 'Template.tsx' },
          { id: 'w-content', label: 'content.ts' },
        ],
      },
      {
        id: 'mcp-zone',
        label: 'apps/mcp-server',
        nodes: [
          { id: 'm-compose', label: 'compose_* tools' },
        ],
      },
      {
        id: 'registry-zone',
        label: 'packages/contracts + registry',
        nodes: [
          { id: 'r-cert', label: 'Certifier' },
          { id: 'r-json', label: 'generated/*.json' },
        ],
      },
    ],
    links: [
      { from: 'g-inspect', to: 'w-tsx', label: 'reads data-part-id' },
      { from: 'm-compose', to: 'r-json', label: 'reads descriptors' },
      { from: 'r-cert', to: 'w-tsx', label: 'certifies to 0 findings' },
    ],
  },
  cycle: {
    heading: 'The gates catch real defects, not hypothetical ones',
    caption:
      'validate_fill loops up to three rounds before a compose ships, the certifier holds every world to zero findings, and the audit route can re-check anything anytime without touching it.',
    title: 'The quality loop',
    stages: [
      { id: 'compose', label: 'Compose', detail: 'Fill authored from source' },
      { id: 'validate', label: 'validate_fill', detail: 'Slots, limits, craft rules' },
      { id: 'certify', label: 'Certifier', detail: 'Zero findings, every world' },
      { id: 'audit', label: 'Audit route', detail: 'Grades shipped work, no edits' },
      { id: 'caught', label: 'Defect caught', detail: 'T-Minus: 375px overflow, filed critical' },
    ],
    hubLabel: 'quality gates',
  },
  compare: {
    heading: 'Three routes, one skill, no overlap',
    caption:
      'Compose creates a new experience from source content, borrow lifts one proven part into another template, and audit grades what already shipped — pick by what you are touching, not by habit.',
    title: 'Compose vs Borrow vs Audit',
    columns: [
      { id: 'compose', label: 'Compose' },
      { id: 'borrow', label: 'Borrow' },
      { id: 'audit', label: 'Audit', tone: 'accent' },
    ],
    rows: [
      { label: 'Input', values: ['Source content: docs, notes, URLs', 'A data-part-id from the inspector', 'An existing shipped route'] },
      { label: 'Output', values: ['A new /demo/<slug> route', 'An adapted, prefixed copy of one part', 'A severity-ranked punch list'] },
      {
        label: 'Edits shipped source?',
        values: ['Never — only the new demo is written', 'Never — git status stays clean on the source', 'Never — read-only by design'],
      },
      { label: 'When to use', values: ['You have content and need a surface', 'You saw a treatment you want elsewhere', 'You need to know if it is at the bar'] },
    ],
    verdict: 'All three share one rule: a flaw found mid-run is template work — report it, never patch around it.',
  },
  cells: {
    heading: '65 live worlds, five surfaces, one contract',
    caption:
      'Every world pairs a bespoke template with a typed content fill. The count below is the current shipped catalogue, verified against the repo today, not a round number.',
    title: 'The gallery catalogue',
    cells: [
      { id: 'decks', label: 'Slide decks', badge: '25', detail: 'Cover-to-close arcs, including the diagram-grammar family this deck itself uses' },
      { id: 'dashboards', label: 'Dashboards', badge: '10', detail: 'KPI rows and panels, one flagged anomaly required per world' },
      { id: 'explainers', label: 'Technical explainers', badge: '10', detail: 'One pinned drawing plus legend, fixed-topology fills' },
      { id: 'personal', label: 'Personal pages', badge: '10', detail: 'Scroll sections built from real-person facts only, never invented' },
      { id: 'projects', label: 'Project pages', badge: '10', detail: 'Context to outcomes; some run on a pinned four-stage ledger' },
    ],
  },
  timeline: {
    heading: 'Three weeks from first live world to sixty-five',
    caption:
      'Every date below is a real commit. The catalogue grew in dated batches, and the gates that check it landed alongside the worlds, not after them.',
    title: 'How we got here',
    eras: [
      { id: 'first', label: 'First live worlds', marker: 'Jul 12', detail: 'Board deck, programme ledger, and studio ship at the fable-25 bar' },
      { id: 'batch2', label: 'Batch-2 decks', marker: 'Jul 14', detail: 'Ten new deck worlds land; thirty-three worlds approved' },
      { id: 'borrow', label: 'Borrow-a-part pilot', marker: 'Jul 15', detail: 'Part Inspector and the BORROW route ship' },
      { id: 'allworlds', label: 'All-worlds-live', marker: 'Jul 17', detail: 'Dashboards, explainers, project and personal pages complete: 65 worlds' },
      { id: 'auditmerge', label: 'Audit pilot, skill merged', marker: 'Jul 18', detail: 'AUDIT route proven; compose, borrow, and audit merge into one skill' },
      { id: 'today', label: 'This deck', marker: 'Jul 19', detail: 'Composed live, using the system it describes' },
    ],
    nowIndex: 5,
  },
  close: {
    takeaways: [
      'One template, one fill: division of labor is the whole architecture.',
      'The MCP server never invents content; the skill never writes CSS.',
      'validate_fill and the certifier make quality provable, not just eyeballed.',
      'Borrow lifts one proven part instead of rebuilding it from scratch.',
      'Audit grades without editing: the same gates run everywhere.',
    ],
    signoff:
      'Open the inspector on any /live or /demo route (the target icon, bottom-right, or ?inspect=1), click a part you like, and paste the copied command into your own next compose or borrow run.',
  },
});
