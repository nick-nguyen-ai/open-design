# Diagram Collections — five visual languages for one diagram grammar

**Date:** 2026-07-16 · **Author:** Fable · **Status:** GOAL MET 2026-07-17 — see docs/superpowers/specs/diagram-collections/RUN-LOG.md

## Goal

Five diagram component collections — each a complete, distinct visual language at the
quality bar of the ByteByteGo diagram corpus (397 reference diagrams surveyed in
`d:\Project\design-mcp\ref-repo\system-design-101`) — registered in the MCP server and
usable across compositions. Proven by **five sample slide decks composed via the
experience-composer skill + MCP compose tools, live at `/demo/*`**. Goal is met when
the five samples are viewable on the web.

The reference corpus is ByteByteGo's copyrighted artwork: we learn the diagram *types*
and their communication patterns, and rebuild the visual languages as our own. No
asset, palette file, or trace is copied.

## Reference taxonomy (what 397 ByteByteGo diagrams actually are)

Classified by slug + visual inspection of 8 representatives:

| Family | ~share | Signature |
|---|---|---|
| Numbered how-it-works flow | 30% | actor/system nodes, numbered dashed edges |
| Top-N celled grid | 20% | N numbered cells, mini-icon + caption each |
| Architecture map | 12% | clustered zones, heterogeneous nodes, cross-links |
| Comparison / versus | 10% | 2–4 parallel columns, per-row contrasts |
| Cheat-sheet panels | 8% | dense titled panels (fold into cells/compare) |
| Sequence | 6% | lifelines, ordered messages, activation |
| Layer stack | 5% | horizontal bands, per-layer annotations |
| Timeline / evolution | 4% | eras, milestone markers |
| Roadmap hub-spoke, cycle, matrix, decision tree | ~5% | fold into zones/cycle/cells/flow |

From this: **eight canonical diagram kinds** every collection implements —
`flow`, `sequence`, `layers`, `zones`, `cycle`, `compare`, `cells`, `timeline`.
Eight kinds × 5 collections = 40 registered components; each collection is
independently sufficient to tell a full system-design story.

## Architecture — shared grammar, five bespoke renderers

Division of labor mirrors the repo doctrine (templates carry craft, fills carry
content): **the grammar carries meaning, the collection carries craft.**

### 1. `packages/diagram-grammar` (new, React-free)

- Zod spec per kind (`FlowSpec`, `SequenceSpec`, …, `TimelineSpec`) +
  `DiagramSpec` discriminated union on `kind`. Bounded (node/edge/item caps) so any
  schema-valid spec stays composed.
- Deterministic pure layout engines per kind (`layoutFlow(spec) → positioned
  geometry`). No randomness without a seed; same spec → same geometry.
- Outline builders per kind: the always-present textual mirror (a11y contract),
  e.g. `buildFlowOutline(spec)` lists nodes then connections.
- Unit tests: schema bounds, layout determinism, outline completeness.

### 2. `packages/diagram-collections` (new, React)

Five families, each a directory with 8 renderer components, a family token sheet
(CSS custom properties — both moods contrast-checked where the family supports
both), and 8 component manifests produced by a local `makeCollectionManifest`
factory (ids `comp.dgm.<family>.<kind>`, category `diagram`).

| Family | Language | Type / craft signature |
|---|---|---|
| `sketchnote` | Excalidraw-style hand journal | Caveat font; seeded rough-stroke jitter on every path; sticky-note fills; marker underlines; paper-white, light mood |
| `blueprint` | Drafting table / draw.io precision | IBM Plex Mono; cyanotype deep-blue field, white hairlines; strict orthogonal edge routing; dimension ticks; stencil node shapes; title-block corner |
| `circuit` | Neon terminal | dark near-black field; phosphor-glow edges (SVG filters); glassy node chips; scanline accents; Space Grotesk (new dep) |
| `isometric` | 2.5D studio | true isometric projection (shared iso math); extruded blocks with three-face shading; soft candy palette; long shadows; light mood |
| `gazette` | Vintage print atelier | Fraunces serif display; cream paper, ink black + vermilion spot colour; numbered medallions; hatch/halftone fills; ruled borders |

Every component: renders from its grammar spec + layout, ships the text mirror
(VisuallyHidden outline), motion from tokens with the three reduced-motion legs,
non-colour encoding (shape/letter), axe-tested. Per family one spec-fixture test
file covering all 8 kinds (render, axe, reduced motion, outline).

### 3. Five deck world-templates (one per family) — the "grammar tour" decks

`experiences/slide-decks/deck-dgm-<family>/`: cover → eight diagram slides (one
per kind) → close. The template owns all chrome, art-directed to its family
(deck chrome and diagram family share one mood). Fills carry only content: each
diagram section's slots reuse existing slot types (`nodes`, `edges`, `items`,
`tableRows`, `text`, `longtext`). Distinct `grammarId` per template
(`sketchnote-journal`, `drafting-blueprint`, `neon-circuit`, `isometric-studio`,
`print-gazette`) so a compose `styleHint` selects each deterministically.
Certifier to 0 findings; curated `data-part-id` anchors + `LivePartIds` entries;
descriptor `componentsUsed` lists the family's 8 component ids.

### 4. MCP surface

Component manifests + world-template descriptors compile into the registry;
`search_components`, `get_component`, `compose_slide_deck` (and the other
surface tools — `compatibleSurfaces` spans all five surfaces) pick them up with
no server code change. Server tests assert the 40 components and 5 templates are
discoverable and composable.

### 5. Five samples (the goal test)

Composed via experience-composer skill + MCP, one per family, topics re-authored
from the reference corpus's subject matter (content ours, structure ours):

1. `/demo/https-handshake` — sketchnote — "How HTTPS actually works"
2. `/demo/payment-rails` — blueprint — "Inside a card payment"
3. `/demo/million-users` — circuit — "Scaling to the first million users"
4. `/demo/kubernetes-anatomy` — isometric — "Kubernetes, piece by piece"
5. `/demo/caching-field-guide` — gazette — "A field guide to caching"

Each sample: one compose call, fill authored from the brief, `validate_fill`
loop ≤3 rounds, demo route (no experience manifest — demo-route contract),
screenshots + run log in `docs/superpowers/specs/diagram-collections/`.

## Error handling

- Schema-invalid specs fail at fill validation (Zod), never at render.
- Layout engines never throw on schema-valid input (bounded inputs; degenerate
  cases collapse to safe stacked layouts, documented per engine).
- Unknown `kind`/family requests fail structured (`NO_MATCH`) at compose time.

## Testing / gates

Per-commit green through the standard gates: `registry:build`, `typecheck`,
`lint`, `test`, `certify` (0 findings), gallery `build`, `e2e` (new specs click
through all five demo routes). Negative-test new contracts once (mutate a part
id / manifest field, observe failure, revert). Drive the real routes and
screenshot every deck state before claiming done.

## Non-goals

- No embedding of ByteByteGo PNGs or palettes; no `/demo` catalogue manifests;
  no changes to existing worlds beyond registry/App route additions; no new
  compose selection logic.
