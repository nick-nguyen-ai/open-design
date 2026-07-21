# Grammar tab specimens â€” same content, every grammar

**Date:** 2026-07-21
**Status:** Approved direction (screenshot-only specimens, all-in-one effort)

## Problem

The Grammars mode of the catalogue is the only browse mode with no pixels.
Template cards show live-world screenshots; grammar cards fall back to the
typographic `PreviewPlate` ("The rulebook") because grammars have no
`liveHref` (`apps/gallery/src/components/ResultCard.tsx`). `GrammarDetail`
is all text: rule bullets and name-chips. A user browsing grammars cannot
see what any grammar looks like, let alone how two grammars differ.

## Goal (user's perspective)

Scanning the grammar tab should *show* the difference between grammars and
how a grammar choice changes an overall design. The way to make differences
legible is to hold content constant: **the same design rendered in every
grammar**, so the grammar is the only variable between cards. The five
bake-off decks (`deck-dgm-*`) already prove the effect for 5 of 15 grammars.

## Decision summary

- Each grammar gets one **specimen image**: the same opendesign-intro
  content rendered in that grammar, one canonical frame, committed as
  `apps/gallery/public/previews/grammar-<grammarId>.jpg` (1280Ã—800, jpeg
  q75 â€” same contract as existing previews).
- Specimens are **screenshot-only** for the 10 grammars without a bake-off
  deck: composed offline via the open-design COMPOSE route, rendered
  locally, shot, and only the jpg committed. No new live worlds, routes,
  registry entries, or templates-tab entries. (Full interactive decks can
  be promoted individually later.)
- For the 5 bake-off grammars (drafting-board, neon-circuit, print-gazette,
  isometric-studio, sketchnote-journal) the specimen is shot from the
  existing live deck (`/live/deck-dgm-*`), re-keyed as
  `grammar-<grammarId>.jpg` so every grammar resolves uniformly.
- Ship gallery changes and all 15 specimens together â€” the tab lands as a
  complete comparison wall, never half-populated.

## Design

### 1. Specimen asset contract

- Path: `apps/gallery/public/previews/grammar-<grammarId>.jpg`.
- Content: the opendesign-intro deck's cover frame (the same source content
  used by the dgm bake-off), rendered in the target grammar.
- Uniform framing: 1280Ã—800 viewport, fonts settled, entrance motion
  settled â€” matching `apps/gallery/scripts/shoot-previews.mjs` output so
  specimens sit indistinguishably beside template screenshots.

### 2. `GrammarSpecimen` component (new)

`apps/gallery/src/components/GrammarSpecimen.tsx`

- Props: `grammarId`, `alt`, `className`.
- Renders `PreviewImage` with `id={`grammar-${grammarId}`}`.
- Fallback chain (never an empty frame):
  1. `grammar-<grammarId>.jpg` (the specimen);
  2. on error, the first example experience's screenshot
     (`exampleExperienceIds[0]`);
  3. on error again, the existing accent-tinted `PreviewPlate` (already
     rendered beneath by callers, so "fallback" is simply rendering
     nothing â€” the same layering contract `PreviewImage` has today).
- Selection logic (which example id backs step 2) lives in a pure helper
  exported for tests.

### 3. `ResultCard`

- Grammar results render `GrammarSpecimen` in the 16/10 preview frame,
  layered over the existing plate exactly as template screenshots are.
- Footer for grammars changes from the static "Design grammar" to
  "*N* example templates" (count of resolvable `exampleExperienceIds`).
- No live-hover iframe for grammars (there is no live route).

### 4. `QuickPreviewDrawer`

- Grammar results show `GrammarSpecimen` in the top image slot (same
  placement as template screenshots).
- Existing metadata rows unchanged.

### 5. `GrammarDetail` â€” the "impact" story, top to bottom

1. **Specimen hero** â€” the specimen image, large, directly under the title.
2. **"The same design in other grammars"** â€” a horizontal scroll strip of
   the other 14 grammars' specimens, each a small captioned thumbnail
   linking to that grammar's detail page. This answers "how would my
   design change if I picked differently?" from any grammar's page.
3. **Example templates grid** â€” replaces the text chips: screenshot
   thumbnail + title + surface label per example, linking to the
   template's detail page (which carries the Live link and Make handoff).
4. **Rule lists** â€” unchanged, below the imagery, as the reference layer.

### 6. Specimen production (the content job)

- For the 10 grammars without a bake-off deck: compose the opendesign-intro
  source content as a slide deck in each grammar via the open-design
  COMPOSE route (enterprise-design MCP), render locally, screenshot the
  cover frame at 1280Ã—800. Working artifacts (composition output, run log)
  go under `docs/superpowers/specs/grammar-specimens/` following the
  existing sample-run precedent; only the jpgs are shipped to
  `public/previews/`.
- For the 5 bake-off grammars: shoot `/live/deck-dgm-<family>` and save as
  `grammar-<grammarId>.jpg`.
- Extend `shoot-previews.mjs` with a `GRAMMAR_SPECIMENS` map
  (`grammarId â†’ route`) so the 5 live-backed specimens regenerate with the
  normal pipeline; the 10 offline specimens are committed assets
  regenerated by re-running the compose job (documented in the run log).

## Out of scope

- New live worlds, routes, or registry entries for the 10 offline
  specimens; no changes to the Templates tab.
- Per-grammar design tokens or hand-built specimen CSS inside the gallery.
- Extending the full 10-slide interactive bake-off to all 15 grammars
  (possible follow-up, one grammar at a time).

## Testing

- Unit: `GrammarSpecimen` fallback chain (specimen missing â†’ first
  example; both missing â†’ renders nothing over the plate); example-pick
  helper for grammars with 0/1/many examples and dangling ids.
- Update tests asserting the grammar plate ("The rulebook") or the
  "Design grammar" footer in `ResultCard`/`Landing` tests.
- `GrammarDetail`: renders hero, sibling strip (14 links, self excluded),
  example grid links to `detailRoute('experience', id)`.
- Visual sanity: after shooting, eyeball the grammar tab â€” 15 cards, same
  content, no empty plates.

## Acceptance

- Grammar tab shows 15 image-bearing cards of the same content rendered in
  each grammar; no typographic-plate-only cards remain.
- Every grammar detail page shows its specimen, the sibling comparison
  strip, and a visual example grid.
- Quick preview drawer shows the specimen for grammar results.
- all 15 `grammar-<id>.jpg` files exist in `public/previews/`.

