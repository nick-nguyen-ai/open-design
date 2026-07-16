# Diagram Collections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Five diagram component collections (distinct visual languages) over one shared
diagram grammar, registered in the MCP registry, proven by five skill+MCP-composed sample
decks live at `/demo/*`.

**Architecture:** `packages/diagram-grammar` (React-free Zod specs + deterministic layout +
outline builders) feeds `packages/diagram-collections` (5 families × 8 SVG renderers, each
family its own token sheet and craft). Five new deck world-templates (one per family, new
grammar manifests) make the collections composable via the existing MCP compose tools; five
sample decks composed via the experience-composer skill prove the goal.

**Tech Stack:** TypeScript, Zod, React 19, SVG, vitest + @testing-library/react + jest-axe,
pnpm workspace, existing registry/certifier/MCP infra.

**Spec:** `docs/superpowers/specs/2026-07-16-diagram-collections-design.md`

## Global Constraints (from GUIDANCE.md — every task inherits these)

- Gates per commit: `corepack pnpm run registry:build` (after manifest changes) →
  `corepack pnpm typecheck` → `corepack pnpm lint` → `corepack pnpm test` →
  `corepack pnpm --filter @enterprise-design/registry certify` (0 findings) →
  (`--filter gallery build` + `e2e` for gallery-touching tasks; rebuild dist before e2e).
- Raw colour values ONLY in a world's own `*Template.tsx`/`*Page.tsx` + sibling `.css`.
  Shared packages consume tokens. **Deliberate amendment for this feature:** each
  collection family defines its palette as a prefixed CSS custom-property sheet
  (`--dgm-<family>-*`) in `packages/diagram-collections/src/<family>/<family>.css` — a
  token sheet, not scattered raw values; documented in that file's header comment.
- Motion: `var(--dur-*)`/`var(--ease-*)` tokens only; every animated pattern has the three
  reduced-motion legs (`useMotionPreference()` gate, `data-reduced` attribute,
  `@media (prefers-reduced-motion: reduce)` override); reduced variant renders FULL content.
- A11y asserted: axe suite per family; text mirror (outline) for every diagram; non-colour
  encoding (shape/letter); `aria-label` on icon-only interactive elements.
- Part IDs: `data-part-id="<experienceId>/<sectionKind>[/<partName>]"`, 5–15 curated per
  world, containers only, exact lists locked in `LivePartIds.test.tsx` same-commit.
- No editorial text hardcoded in templates (leak scan); chrome via `leak-allowlist.json`
  sparingly. No `AUTHOR:` markers.
- Demo routes get NO experience manifest, NO `live.ts` entry, NO approval flag.
- Never copy ByteByteGo assets/palettes; content of samples re-authored, structure ours.
- Commits: one reviewable commit per task, `feat(scope): …`, repo green after each.
- Windows: LF hygiene per GUIDANCE §7b; vitest roots at repo root
  (`corepack pnpm --filter <pkg> exec vitest run --root ../.. <path>` pattern or package
  `test` script).

## File Structure (locked)

```
packages/diagram-grammar/
  package.json tsconfig.json
  src/index.ts
  src/specs.ts               # 8 Zod specs + DiagramSpec union + DiagramKind
  src/specs.test.ts
  src/layout/flow.ts sequence.ts layers.ts zones.ts cycle.ts compare.ts cells.ts timeline.ts
  src/layout/layout.test.ts  # determinism + bounds for all 8
  src/outline.ts             # buildOutline(spec) → string[] per kind
  src/outline.test.ts
packages/diagram-collections/
  package.json tsconfig.json
  src/index.ts               # exports all 40 components + families metadata
  src/shared/rough.ts        # seeded jitter path utils (sketchnote)
  src/shared/iso.ts          # isometric projection math
  src/shared/DiagramFrame.tsx# shared <figure>+title+mirror+data-testid wrapper
  src/shared/shared.test.ts
  src/<family>/<family>.css                    # token sheet + family styles
  src/<family>/<Family><Kind>.tsx              # 8 renderers per family
  src/<family>/<family>-manifests.ts           # makeCollectionManifest calls…
  src/<family>/dgm-<family>-<kind>.component.manifest.ts  # ×8 thin default-export files
  src/<family>/<family>.test.tsx               # fixtures ×8: render+axe+reduced+outline
packages/registry/data/grammars/
  sketchnote-journal.grammar.manifest.ts drafting-board.grammar.manifest.ts
  neon-circuit.grammar.manifest.ts isometric-studio.grammar.manifest.ts
  print-gazette.grammar.manifest.ts
experiences/slide-decks/deck-dgm-<family>/     # ×5 shipped worlds (family ∈ sketchnote,
  <Family>DeckPage.tsx <Family>DeckTemplate.tsx <family>-deck.css
  <family>-fill.ts content.ts
  dgm-<family>.worldtemplate.manifest.ts dgm-<family>.experience.manifest.ts
experiences/slide-decks/demo-dgm-<slug>/       # ×5 samples (thin pages, SHIPPED fill only)
apps/gallery/src/App.tsx                       # 5 live + 5 demo routes
apps/gallery/src/routes/LivePartIds.test.tsx   # +5 world entries
apps/gallery/e2e/dgm-demos.spec.ts             # click-through all 5 demos
docs/superpowers/specs/diagram-collections/    # RUN-LOG.md + screenshots
```

## Diagram grammar contract (verbatim — Task 1 implements exactly this)

```ts
// packages/diagram-grammar/src/specs.ts
import { z } from 'zod';

export const DiagramKind = z.enum(['flow','sequence','layers','zones','cycle','compare','cells','timeline']);
export type DiagramKind = z.infer<typeof DiagramKind>;

const id = z.string().min(1).max(40);
const label = z.string().min(1).max(80);
const detail = z.string().max(160);

export const FlowSpec = z.object({
  kind: z.literal('flow'), title: label,
  nodes: z.array(z.object({ id, label, kind: z.enum(['start','process','decision','data','actor','end']) })).min(3).max(12),
  edges: z.array(z.object({ from: id, to: id, label: label.optional(), step: z.number().int().min(1).max(20).optional() })).min(2).max(16),
}).refine(s => s.edges.every(e => s.nodes.some(n => n.id === e.from) && s.nodes.some(n => n.id === e.to)),
  { message: 'every edge endpoint must be a node id' });

export const SequenceSpec = z.object({
  kind: z.literal('sequence'), title: label,
  actors: z.array(z.object({ id, label, kind: z.enum(['user','service','store','external']) })).min(2).max(6),
  messages: z.array(z.object({ from: id, to: id, label, reply: z.boolean().optional(), note: detail.optional() })).min(2).max(14),
}).refine(s => s.messages.every(m => s.actors.some(a => a.id === m.from) && s.actors.some(a => a.id === m.to)),
  { message: 'every message endpoint must be an actor id' });

export const LayersSpec = z.object({
  kind: z.literal('layers'), title: label,
  layers: z.array(z.object({ id, label, detail: detail.optional(), items: z.array(label).max(6).optional(),
    tone: z.enum(['base','accent','alert']).optional() })).min(3).max(9),
  sideLabel: label.optional(),
});

export const ZonesSpec = z.object({
  kind: z.literal('zones'), title: label,
  zones: z.array(z.object({ id, label, nodes: z.array(z.object({ id, label })).min(1).max(8) })).min(2).max(6),
  links: z.array(z.object({ from: id, to: id, label: label.optional() })).max(14),
}).refine(s => { const ids = new Set(s.zones.flatMap(z2 => z2.nodes.map(n => n.id)));
  return s.links.every(l => ids.has(l.from) && ids.has(l.to)); },
  { message: 'every link endpoint must be a zone-node id' });

export const CycleSpec = z.object({
  kind: z.literal('cycle'), title: label,
  stages: z.array(z.object({ id, label, detail: detail.optional() })).min(3).max(8),
  hubLabel: label.optional(),
});

export const CompareSpec = z.object({
  kind: z.literal('compare'), title: label,
  columns: z.array(z.object({ id, label, tone: z.enum(['base','accent']).optional() })).min(2).max(4),
  rows: z.array(z.object({ label, values: z.array(z.string().max(120)).min(2).max(4) })).min(2).max(8),
  verdict: detail.optional(),
}).refine(s => s.rows.every(r => r.values.length === s.columns.length),
  { message: 'each row has exactly one value per column' });

export const CellsSpec = z.object({
  kind: z.literal('cells'), title: label,
  cells: z.array(z.object({ id, label, detail: detail.optional(), badge: z.string().max(12).optional() })).min(4).max(12),
  columnsHint: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
});

export const TimelineSpec = z.object({
  kind: z.literal('timeline'), title: label,
  eras: z.array(z.object({ id, label, detail: detail.optional(), marker: z.string().max(12).optional() })).min(3).max(8),
  nowIndex: z.number().int().nonnegative().optional(),
}).refine(s => s.nowIndex === undefined || s.nowIndex < s.eras.length,
  { message: 'nowIndex must index an era' });

export const DiagramSpec = z.discriminatedUnion('kind',
  [FlowSpec, SequenceSpec, LayersSpec, ZonesSpec, CycleSpec, CompareSpec, CellsSpec, TimelineSpec]);
export type DiagramSpec = z.infer<typeof DiagramSpec>;
// + exported per-spec types: FlowSpecT = z.infer<typeof FlowSpec> etc.
```

## Layout contracts (Task 2 — signatures locked; geometry deterministic, never throws on schema-valid input)

```ts
// each in packages/diagram-grammar/src/layout/<kind>.ts
export interface FlowLayout { width: number; height: number;
  nodes: Array<{ id: string; x: number; y: number; w: number; h: number; kind: FlowNodeKind; label: string; rank: number }>;
  edges: Array<{ from: string; to: string; points: Array<[number, number]>; labelAt: [number, number]; label?: string; step?: number }>; }
export function layoutFlow(spec: FlowSpecT): FlowLayout;         // layered left→right rank layout (reuse the rank
                                                                 // approach of packages/diagrams buildFlowDiagramLayout);
                                                                 // cycles/unreachable → rank 0 (documented)
export function layoutSequence(spec: SequenceSpecT): SequenceLayout; // actors evenly spaced on top, messages as ordered
  // horizontal arrows y = headerH + i*rowH; SequenceLayout { width,height, actors:{id,x,label,kind}[], messages:{from,to,y,label,reply,note?}[] }
export function layoutLayers(spec: LayersSpecT): LayersLayout;   // full-width stacked bands, band h by content
export function layoutZones(spec: ZonesSpecT): ZonesLayout;      // zones on a 2-col (≤4) / 3-col (5–6) grid; nodes on an
  // inner grid per zone; links routed centre-to-centre with midpoint label anchor
export function layoutCycle(spec: CycleSpecT): CycleLayout;      // stages on a circle r=f(n), angle -90° start, clockwise;
  // arc segments between consecutive stages; optional hub centre
export function layoutCompare(spec: CompareSpecT): CompareLayout;// N equal columns, header row + R value rows
export function layoutCells(spec: CellsSpecT): CellsLayout;      // grid cols = columnsHint ?? (n≤6?2 : n≤9?3 : 4), row-major
export function layoutTimeline(spec: TimelineSpecT): TimelineLayout; // horizontal axis, eras evenly spaced, alternating
  // above/below detail cards, optional now marker
```

All layouts share `PADDING = 24`, integer-rounded coordinates, and are pure functions of the
spec (no Date, no Math.random). Test: same spec twice → deep-equal; every coordinate within
`[0,width]×[0,height]`; max-bound specs stay composed (no overlaps beyond declared overlap-free
guarantees: nodes within a rank don't overlap; bands/columns/cells never overlap).

## Outline contract (Task 3)

```ts
// packages/diagram-grammar/src/outline.ts
export function buildOutline(spec: DiagramSpec): string[];
// flow: ["Flow: <title>", "Steps: <n1> → … (ordered by edge step then rank)", per-edge "from → to (label)"]
// sequence: per-message "i. <fromLabel> → <toLabel>: <label>"; layers: top-to-bottom "i. <label> — <detail> [items…]"
// zones: per-zone "Zone <label>: nodes…", then "Links: a → b (label)"; cycle: "1..n <label> — <detail>, returns to 1"
// compare: per-row "<rowLabel>: <col1>=<v1>; <col2>=<v2>…" (+verdict); cells: "i. <label> — <detail>"
// timeline: "i. <label> (<marker>) — <detail>" + "current: <label>" when nowIndex set
// Guarantee: EVERY label/detail/value string in the spec appears in the outline (tested per kind).
```

## Collections shared internals (Task 4)

```ts
// src/shared/DiagramFrame.tsx — every renderer wraps in this
export interface DiagramFrameProps { family: string; kind: DiagramKind; title: string;
  outline: string[]; reduced: boolean; children: React.ReactNode; /* svg */ }
// renders <figure class="dgm dgm-<family>" data-testid="dgm-<family>-<kind>" data-reduced={reduced||undefined}>
//   <figcaption> (family-styled title) + <VisuallyHidden><ol> outline</ol></VisuallyHidden> + {children}
// VisuallyHidden imported from @enterprise-design/primitives (verify export name at implementation; primitives is a dependency).

// src/shared/rough.ts — deterministic hand-drawn utils (NO Math.random)
export function seededJitter(seed: string): (i: number) => number;    // mulberry32 over fnv1a(seed), returns [-1,1]
export function roughLine(x1,y1,x2,y2, seed, amp?): string;           // SVG path d with 2 passes + midpoint wobble
export function roughRect(x,y,w,h, seed, amp?): string;               // 4 rough edges, slight corner overshoot
export function roughEllipse(cx,cy,rx,ry, seed): string;              // 8-segment bezier with radius wobble

// src/shared/iso.ts
export function isoProject(x: number, y: number, z: number): [number, number]; // 30° iso: [ (x−y)·cos30, (x+y)·sin30 − z ]
export function isoBoxFaces(x,y,z,w,d,h): { top: string; left: string; right: string }; // 3 polygon points strings

// src/<family>/manifest-factory.ts lives once in shared:
export function makeCollectionManifest(o: { family: string; familyName: string; kind: DiagramKind;
  description: string; searchText: string; grammarId: string; sourceFile: string; exportName: string;
  motionLevel: 0|1|2|3; knownLimitations: string[] }): ComponentManifest;
// fixed fields: schemaVersion '1.0', id `comp.dgm.<family>.<kind>`, category 'diagram', subcategory kind,
// compatibleSurfaces ALL FIVE, audiences ['technical','business','mixed'], density ['medium','high'],
// corporateSuitability ['standard','expressive'], themeModes per family (documented), contentRequirements
// { requiredFields:['spec'], acceptedDataShapes:['graph'], … }, a11y block all true + knownLimitations,
// performance { renderingCost:'low', bundleCostKbGzip: 6, recommendedDataLimit: 30, fallbackComponentId: 'comp.status-list' },
// provenance reviewRecord 'REV-2026-T7-DGM', approval { state:'approved', reviewer:'design-lead', reviewedAt:'2026-07-17', qualityScore: 85+ }.
```

Renderer prop contract (all 40): `export function SketchnoteFlow({ spec }: { spec: FlowSpecT }): JSX.Element` —
component computes layout + outline internally (`useMemo`), reads `useMotionPreference()`, renders
`<DiagramFrame …><svg viewBox=…>` with family craft. No fetch, no state beyond motion pref.

## The five family style specs (locked craft direction)

| | tokens prefix | field | ink/accents | type | signature moves |
|---|---|---|---|---|---|
| sketchnote | `--dgm-sk-*` | paper `#fdfcf7` | ink `#2a2a33`; highlights amber `#ffd166`, coral `#ef7674`, sky `#7fb5d5`, sage `#87b38d` | Caveat (display+labels), Inter fallback | every stroke via rough*(seed=node/edge id); sticky-note node fills with 1.5° alternating rotation; marker-swipe underline behind title; dashed rough edges with hand arrowheads |
| blueprint | `--dgm-bp-*` | cyanotype `#0e2a47` | hairlines `#dce9f7`; accent cyan `#66d9e8`; alert amber `#f5b942` | IBM Plex Mono everywhere | dot-grid background; strictly orthogonal edges (Manhattan midpoint routing); dimension ticks + end caps; stencil node shapes; title-block corner stamp `DGM-<kind>-01` |
| circuit | `--dgm-cx-*` | near-black `#0a0e14` | phosphor green `#3ef2a5`, cyan `#41d6ff`, magenta `#ff5ea8`; dim grid `#1b2430` | Space Grotesk (add dep), Plex Mono for chips | SVG glow filter (feGaussianBlur+merge) on edges; glass node chips (translucent fill + 1px inner stroke); animated edge dash-flow (token durations, reduced→static); corner scanline accent |
| isometric | `--dgm-iso-*` | mist `#f2f4f8` | candy: violet `#8f7ff0`, mint `#6fd7b2`, peach `#ffb38a`, rose `#f78fb3`; shade steps −12%/−24% | Inter (600 labels) | ALL nodes drawn as isoBoxFaces extrusions (top/left/right shades); ground long-shadow polygons; edges as iso-plane paths; flat label plates floating above boxes |
| gazette | `--dgm-gz-*` | cream `#f7f2e7` | ink `#1c1a17`; vermilion spot `#d0402b`; rule grey `#b9b0a0` | Fraunces (display), Inter (captions) | double-rule frame + column rules; numbered medallion circles (vermilion, serif numerals); diagonal hatch fills (SVG pattern) for emphasis zones; drop-cap first letter of title |

Non-colour encoding held per family: node kinds differ by SHAPE in all families
(start=pill, process=rect, decision=diamond, data=cylinder-ish, actor=head-and-shoulders
glyph or plate, end=double pill), compare tones carry ✓-style glyph badges, layer tones carry
letter badges (B/A/!).

## World-template section table (identical section KINDS for all five templates; craft differs)

| section kind | slots (type) |
|---|---|
| `cover` | deck.title (text ≤60), deck.standfirst (longtext ≤240), deck.notice (text ≤120, provenance craft-rule) |
| `flow-slide` | flow.heading (text ≤70), flow.caption (longtext ≤220), flow.title (text ≤80), flow.nodes (nodes 3–12), flow.edges (edges 2–16) |
| `sequence-slide` | seq.heading, seq.caption, seq.title, seq.actors (nodes 2–6), seq.messages (edges 2–14) |
| `layers-slide` | layers.heading, layers.caption, layers.title, layers.layers (items 3–9 — objects {label, detail?, items?, tone?}) |
| `zones-slide` | zones.heading, zones.caption, zones.title, zones.zones (items 2–6 nested nodes), zones.links (edges 0–14) |
| `cycle-slide` | cycle.heading, cycle.caption, cycle.title, cycle.stages (items 3–8), cycle.hubLabel (text, optional) |
| `compare-slide` | compare.heading, compare.caption, compare.title, compare.columns (items 2–4), compare.rows (tableRows 2–8), compare.verdict (longtext, optional) |
| `cells-slide` | cells.heading, cells.caption, cells.title, cells.cells (items 4–12) |
| `timeline-slide` | timeline.heading, timeline.caption, timeline.title, timeline.eras (items 3–8) |
| `close` | close.takeaways (items 3–6), close.signoff (longtext ≤240) |

Fill schema per deck: `FILL_SCHEMA = z.object({ deck…, flow: FlowSpec-shaped content…, … })` —
the diagram sub-objects reuse the grammar spec schemas (import from `@enterprise-design/diagram-grammar`)
minus `kind` (template injects it). SECTIONS/descriptor in lockstep (certifier-checked).
Craft rule per deck: `required-nonempty` on `deck.notice`. Per-template `businessIntents`
(unique, steer compose): sketchnote `['teach-protocol-walkthrough','explain-how-it-works']`;
blueprint `['document-system-rails','specify-integration']`; circuit
`['scale-architecture-story','plan-capacity-growth']`; isometric
`['tour-platform-anatomy','onboard-into-infrastructure']`; gazette
`['publish-field-guide','compare-technique-tradeoffs']`. grammarIds: `sketchnote-journal`,
`drafting-board`, `neon-circuit`, `isometric-studio`, `print-gazette` (5 new grammar
manifests in `packages/registry/data/grammars/`, shaped like `technical-blueprint.grammar.manifest.ts`,
signatureSequences drawn from existing motion ids only: `data-ink-draw`, `horizon-sweep`, `ledger-reveal`).

## Samples (Task 17–21) — briefs locked

| demo route | family steered | topic (content re-authored, ByteByteGo-inspired subject) |
|---|---|---|
| `/demo/https-handshake` | sketchnote | How HTTPS actually works: TLS handshake, certs, session keys |
| `/demo/payment-rails` | blueprint | Inside a card payment: auth → clearing → settlement |
| `/demo/million-users` | circuit | Scaling to the first million users: LB, cache, replicas, queues |
| `/demo/kubernetes-anatomy` | isometric | Kubernetes piece by piece: control plane, nodes, pods, services |
| `/demo/caching-field-guide` | gazette | A field guide to caching: strategies, eviction, failure modes |

Each run (experience-composer skill): one `compose_slide_deck` call (context.businessIntent =
the template's first intent; audience/motion per skill defaults) → author every slot from the
brief → `validate_fill` ≤3 rounds → thin demo page (imports the family template + demo fill,
NO manifests) → route in App.tsx → screenshots per slide → RUN-LOG entry.

---

### Task 0: Branch

- [ ] `git checkout -b diagram-collections` from clean `main` (verify `git status` clean first).

### Task 1: diagram-grammar package + specs

**Files:** Create `packages/diagram-grammar/{package.json,tsconfig.json,src/index.ts,src/specs.ts,src/specs.test.ts}`
**Interfaces produced:** everything in "Diagram grammar contract" above + per-spec inferred types (`FlowSpecT` …).

- [ ] package.json: name `@enterprise-design/diagram-grammar`, mirror `packages/diagrams/package.json`
      (deps: only `zod`; no react); tsconfig mirrors sibling packages; wire into root tsc -b if the
      base config lists project references (verify `tsconfig.json` at repo root).
- [ ] Write `specs.test.ts` FIRST: for each of 8 kinds — a minimal valid fixture parses; an
      over-bound fixture fails (e.g. 13 flow nodes); a dangling-ref fixture fails (flow edge → missing
      node; sequence message → missing actor; zones link → missing node; compare row width mismatch;
      timeline nowIndex out of range). Run: expect FAIL (module missing).
- [ ] Implement `src/specs.ts` exactly as the contract block. `src/index.ts` re-exports.
- [ ] `corepack pnpm --filter @enterprise-design/diagram-grammar test` → PASS; typecheck+lint; commit
      `feat(diagram-grammar): eight bounded diagram spec schemas`.

### Task 2: layout engines

**Files:** Create `src/layout/{flow,sequence,layers,zones,cycle,compare,cells,timeline}.ts`, `src/layout/layout.test.ts`
**Interfaces:** consumes specs; produces the 8 `layoutX` signatures + layout interfaces (contract above).

- [ ] Tests first (all 8): determinism (two calls deep-equal), bounds (all coords in box), min & max
      fixtures render sane (nodes non-overlapping within rank/band/column/cell guarantees), flow cycle
      fixture doesn't throw. Expect FAIL.
- [ ] Implement each engine per the locked geometry notes. Flow reuses the rank-assignment idea from
      `packages/diagrams/src/FlowDiagram/buildFlowDiagramLayout.ts` (read it; do NOT import — grammar
      package stays dependency-light; reimplement compactly).
- [ ] Tests PASS; gates; commit `feat(diagram-grammar): deterministic layout engines for all eight kinds`.

### Task 3: outline builders

**Files:** Create `src/outline.ts`, `src/outline.test.ts`; modify `src/index.ts`.

- [ ] Tests first: per kind, EVERY label/detail/value string of a max fixture appears in
      `buildOutline(spec).join('\n')`; ordering assertions (sequence message order; layers top-down;
      cycle wraps). Expect FAIL → implement → PASS; gates; commit
      `feat(diagram-grammar): textual outline builders (a11y mirrors)`.

### Task 4: diagram-collections scaffold + shared internals

**Files:** Create `packages/diagram-collections/{package.json,tsconfig.json,src/index.ts}`,
`src/shared/{DiagramFrame.tsx,rough.ts,iso.ts,manifest-factory.ts,shared.test.ts}`.
**Interfaces:** consumes diagram-grammar; produces DiagramFrame, rough*/iso* utils,
`makeCollectionManifest` (contract above).

- [ ] package.json mirrors `packages/diagrams` (react peer, motion/primitives/contracts/design-tokens
      deps + `@enterprise-design/diagram-grammar`); add test setup files copied from
      `packages/diagrams/src/test/`.
- [ ] Tests first: seededJitter deterministic + bounded; roughLine/Rect/Ellipse return valid `d`
      strings and are seed-stable; isoProject known values (`isoProject(1,0,0)` ≈ `[cos30, sin30]`);
      DiagramFrame renders figure with testid, figcaption title, hidden outline items, `data-reduced`
      when reduced; manifest factory output parses with `ComponentManifest.parse` and pins the fixed
      fields. FAIL → implement → PASS; gates; commit `feat(diagram-collections): package scaffold, rough/iso utils, frame, manifest factory`.

### Tasks 5–9: the five families (one task each: 5=sketchnote, 6=blueprint, 7=circuit, 8=isometric, 9=gazette)

**Files per family:** Create `src/<family>/<family>.css`, 8 renderer components
`<Family><Kind>.tsx` (Kind ∈ Flow,Sequence,Layers,Zones,Cycle,Compare,Cells,Timeline),
8 thin manifest files `dgm-<family>-<kind>.component.manifest.ts` (each default-exports
`makeCollectionManifest({...})`), `<family>.test.tsx`; modify `src/index.ts`.
**Interfaces:** consumes grammar specs/layouts/outlines + shared utils; produces components named
`SketchnoteFlow`, `BlueprintZones`, `CircuitLayers`, `IsometricCells`, `GazetteTimeline`, … (Family+Kind, all 40)
with prop `{ spec }`; ids `comp.dgm.<family>.<kind>`.

Common recipe (executor: apply per family with that family's style-spec row; craft is authored
at implementation against the style spec — this is the same human-craft licence the repo's
world-templates use, protected by the tests below):

- [ ] Test file first — for each of the 8 kinds: renders from a rich fixture (labels visible),
      axe clean, outline mirror lists every fixture label, `data-reduced` honoured
      (render with matchMedia mock reduced → no animated dash/opacity-from-0 styles), node-kind
      SHAPES distinguishable (assert distinct shape testids/paths for two different node kinds).
      Circuit only (Task 7): first `corepack pnpm --filter @enterprise-design/diagram-collections add @fontsource/space-grotesk`.
- [ ] Implement `<family>.css` token sheet (header comment: deliberate art-direction amendment,
      values from the style-spec row; both-moods contrast where family supports it) + 8 renderers +
      8 manifests. Every animated affordance: motion tokens + three reduced legs.
- [ ] `registry:build` → 8 new components compile; family tests PASS; gates; commit
      `feat(diagram-collections): <family> family — eight <language> renderers + manifests`.

### Task 10: registry + MCP discoverability proof + grammar manifests

**Files:** Create the 5 grammar manifests in `packages/registry/data/grammars/`; modify
`apps/mcp-server/src/server.test.ts` (or add `apps/mcp-server/src/diagram-collections.test.ts`).

- [ ] Write server test first: registry data contains exactly 40 `comp.dgm.*` components;
      `search_components` for "hand-drawn sequence diagram" returns `comp.dgm.sketchnote.sequence`
      in top results; `get_component('comp.dgm.circuit.flow')` returns manifest. Expect FAIL only
      if manifests malformed — this test also guards regressions.
- [ ] Author 5 grammar manifests (id/name/intent/rules per family style spec; signatureSequences
      from existing motion ids; preferredComponents = that family's 8 ids; exampleExperienceIds
      filled in Task 11–15 — use the deck experience ids now, they land before registry build gates
      re-run at the end of those tasks… **No**: registry validates references at build time. Set
      `exampleExperienceIds: []` now; append the deck id in each Task 11–15 commit.)
- [ ] registry:build + full gates; negative-test once: temporarily corrupt one manifest id → build
      error surfaces → revert. Commit `feat(registry): five diagram-family grammars; MCP discoverability tests`.

### Tasks 11–15: the five world-templates (11=sketchnote … 15=gazette, one per family)

**Files per family:** Create `experiences/slide-decks/deck-dgm-<family>/` (all 7 files per File
Structure), modify `apps/gallery/src/App.tsx` (live route), `apps/gallery/src/routes/LivePartIds.test.tsx`
(exact ID list), `packages/registry/data/grammars/<grammar>.grammar.manifest.ts` (exampleExperienceIds).
**Interfaces:** consumes the family's 8 components; produces worldtemplate id `dgm-<family>`,
experienceId `deck-dgm-<family>`, sections per the locked section table, grammarId per family.

Per family:

- [ ] `<family>-fill.ts`: `FILL_SCHEMA` (diagram sub-schemas imported from grammar, `kind` omitted
      via `.omit({kind:true})` on object specs — where refine blocks omit, rebuild the inner object),
      `SECTIONS` + `GUIDANCE` in lockstep with the section table; craft rule `required-nonempty deck.notice`.
- [ ] `content.ts` SHIPPED_FILL: a real showcase story for that family (author original content —
      e.g. sketchnote ships "How a URL becomes a page", blueprint ships "An order's journey through
      a warehouse system", circuit ships "Anatomy of a streaming platform", isometric ships "A data
      platform, floor by floor", gazette ships "The observability field manual") — every slot filled,
      certifier-parseable.
- [ ] `<Family>DeckTemplate.tsx` + css: 10-slide deck (cover, 8 diagram slides, close) using
      `useDeckNavigation` from `experiences/slide-decks/_deck-kit/useDeckNavigation.ts`; chrome
      art-directed to the family (deck corners own nav/counter/notice per GUIDANCE §5f); imports the
      family's 8 components; injects `kind` into fill sub-objects to form specs. 6–10 curated
      `data-part-id="deck-dgm-<family>/<sectionKind>[/…]"` anchors. Page wrapper ~15 lines.
- [ ] Descriptor + experience manifests (worldtemplate: audiences/businessIntents per locked list,
      style 'art-directed', mood per family; experience manifest approved like siblings).
- [ ] Tests: add LivePartIds entry; run certifier → 0 findings; axe via existing LiveWorlds pattern
      (add to the newest LiveWorldsDecks* suite or create `LiveWorldsDecksH.test.tsx` following
      `LiveWorldsDecksG.test.tsx`); registry:build; full gates incl. gallery build; drive `/live/deck-dgm-<family>`
      through all 10 slides in preview, screenshot. Commit `feat(deck-dgm-<family>): <family> grammar-tour world-template`.

### Task 16: compose-path steering tests

**Files:** Modify `apps/mcp-server/src/tools/compose-core.test.ts` (or the Task 10 test file).

- [ ] Test: for each family, `compose_slide_deck` with context `{surface:'slide-deck',
      audience:'technical', businessIntent:'<family first intent>', corporateSuitability:'expressive',
      motionPreference:'full'}` + a topic brief selects `dgm-<family>` (winner id asserted) and the
      fillSkeleton lists the section table's slots. Run → if a wrong template wins, adjust that
      template's businessIntents/audiences (never compose-core) until all five steer deterministically.
- [ ] Gates; commit `test(mcp-server): five diagram templates steer deterministically by intent`.

### Tasks 17–21: the five samples (17=https-handshake/sketchnote … 21=caching-field-guide/gazette, per Samples table)

Per sample — run via the **experience-composer skill** (this is a skill run, not free-form coding):

- [ ] Compose call (MCP demo-client or skill harness per `.claude/skills/experience-composer/SKILL.md`),
      capture rationale+skeleton in RUN-LOG.
- [ ] Author every slot from the brief (original content at ByteByteGo explanatory quality: concrete
      steps, real port/protocol/latency-class facts, honest captions). `validate_fill` ≤3 rounds.
- [ ] Demo world `experiences/slide-decks/demo-dgm-<slug>/`: `content.ts` (the validated fill) +
      `<Slug>Page.tsx` thin wrapper importing the family template. NO manifests, no live.ts, no approval.
- [ ] Route `demo/<slug>` in App.tsx (lazy, like `demo/deepagents`); gallery build; drive all 10
      slides; screenshot each slide to `docs/superpowers/specs/diagram-collections/<slug>/`.
- [ ] Gates (no certify change — demos aren't certified); commit `feat(demo): <slug> — <family> sample composed via skill+MCP`.

### Task 22: e2e + final verification + evidence

**Files:** Create `apps/gallery/e2e/dgm-demos.spec.ts`; create `docs/superpowers/specs/diagram-collections/RUN-LOG.md`;
modify `docs/superpowers/specs/2026-07-16-diagram-collections-design.md` (status line).

- [ ] e2e: for each of the 5 demo routes — page loads, deck advances through all slides via the
      template's next control, one diagram testid per expected kind appears, no console errors.
      REBUILD dist first (GUIDANCE §7d). Negative-test once (break a route, watch fail, revert).
- [ ] Full gate suite from Global Constraints, in order, fresh. Record outputs in RUN-LOG.
- [ ] RUN-LOG.md: per sample — compose rationale, validate_fill rounds, adaptations, gate results,
      screenshot index. Honest notes on any weak fit.
- [ ] Commit `test(e2e): five diagram-collection demos click through green; run evidence`.

## Self-review notes

- Spec coverage: taxonomy→grammar (T1–3), five collections (T4–9), MCP registration (T10, T16),
  five templates (T11–15), five web samples (T17–21), gates/evidence (T22). Non-goals respected
  (no compose-core changes — T16 adjusts template metadata only; no BBG assets).
- Known deliberate deviations from the writing-plans letter: per-family renderer code is authored
  at implementation against locked style specs + locked prop/test contracts (40 full component
  listings in a plan would be the implementation itself); the repo's own doctrine treats template
  craft as authored work protected by contracts, and the same applies here.
- Type consistency: `FlowSpecT`-style types, `layoutX`/`buildOutline` names, `comp.dgm.<family>.<kind>`
  ids, `dgm-<family>` template ids, `deck-dgm-<family>` experience ids used consistently throughout.
