# grammar-specimen COMPOSE run — spatial-canvas — 2026-07-21 — BLOCKED (honest stop, no fill authored)

Route: open-design COMPOSE, grammar bake-off specimen (same opendesign-intro source content as the five shipped sibling decks).
Evidence dir: `docs/superpowers/specs/grammar-specimens/spatial-canvas/` (this directory). No repo files outside it were touched; no commits.

## Intake record

- Surface: slide-deck (given) · Audience: mixed (engineers + design-minded PMs) · Fidelity: CONDENSE (10-beat arc)
- Pin: `deck-innovation-showcase` (per `docs/superpowers/plans/2026-07-21-grammar-tab-specimens.md`, Task 6 table: spatial-canvas → deck-innovation-showcase)
- Context: `{surface: slide-deck, audience: [mixed], businessIntent: [explain-design-system, enable-adoption], corporateSuitability: standard, motionPreference: 1}`
- Source: `GUIDANCE.md`, `docs/borrow-a-part.md`, `docs/superpowers/specs/design-audit-pilot/RUN-LOG.md`; narrative map from `docs/superpowers/specs/opendesign-intro-sample/RUN-LOG.md` (10 beats).

## The blocker (verified from source, not just the tool error)

`compose_slide_deck` with the pin returned **`UNKNOWN_TEMPLATE`** (full payload in `mcp-outcome.json`): the live slide-deck templates are cutover, dgm-blueprint, dgm-circuit, dgm-gazette, dgm-isometric, dgm-sketchnote, quarter, tminus — `deck-innovation-showcase` is not among them.

Verified against the repo, per GUIDANCE §3a (re-verify; the registry could have been stale):

- `experiences/slide-decks/deck-innovation-showcase/` contains only `GalleryFloorPage.tsx` (hand-built page, 22 KB), `content.ts` (typed content pack, NOT a fill schema), `gallery.css`, and the experience manifest. There is **no `*Template.tsx`, no `*-fill.ts` (no `FILL_SCHEMA`/`SECTIONS`), and no `*.worldtemplate.manifest.ts`**.
- `packages/registry/generated/world-templates.json` lists 12 world-templates; `deck-innovation-showcase` is absent, so a registry rebuild would not change the outcome.
- Wider check: **none of the five spatial-canvas example experiences** (`db-dependency-network-explorer`, `proj-data-modernisation-programme`, `deck-innovation-showcase`, `home-knowledge-atlas`, `exp-data-lineage-map` — from `packages/registry/data/grammars/spatial-canvas.grammar.manifest.ts`) is templatized on ANY surface. spatial-canvas currently has **zero composable targets**.

Making `deck-innovation-showcase` composable means extracting a `GalleryFloorTemplate.tsx`, authoring a fill schema + SECTIONS in lockstep with a new descriptor, certifying to 0 findings, and adding part-id anchors — that is **template work** (GUIDANCE recipe §6b), which the compose doctrine forbids mid-run ("a design flaw found mid-run is template work: stop, report") and which this run's brief forbade outright (no edits outside this evidence dir). The specimens plan anticipated exactly this case for calm-command: *"if the compose route cannot target the grammar, leave the example fallback and flag in the run log"* — the same disposition applies here.

Not done, deliberately: no fill.json, no validate-outcome.json — there is no fill contract to author against, and fabricating one against the hand-built page would violate the division-of-labor doctrine and the honesty rule. No unpinned compose fallback was taken either: any winner would be a different grammar's template, which defeats the bake-off's purpose (one grammar, one specimen).

## Slide map / kept-cut

Not applicable — no skeleton was returned. The intended arc (had a skeleton existed) was the sibling runs' 10 beats: cover · one-system-five-surfaces · COMPOSE flow · skill/MCP handshake · division-of-labor stack · gallery estate (65 worlds — a natural fit for this template's exhibition-floor conceit) · quality loop · COMPOSE/BORROW/AUDIT compare · lexicon · timeline+close.

## Fit note (honest)

Conceptually the fit would have been strong: "The Gallery Floor" hangs a portfolio as exhibits on a navigable floor plan, and the OpenDesign estate (5 surfaces / 65 worlds, three routes as halls, the audit pilot's real catch as the celebrated RETIRED piece / anomaly slot) maps almost one-to-one onto halls, plinths, placards, and status bands. But the fit is unrealizable today: the world exposes no fill contract at all. Templatizing it (per GUIDANCE §6b, with `deck-cloud-migration` as the reference) is the prerequisite, and its shipped anomaly convention (the de-accessioned piece) already matches the fill-authoring honesty rules.

## Scaffold facts (looked up for the record)

- (a) World directory: `experiences/slide-decks/deck-innovation-showcase/`. Fill schema import path/names: **none exist** — there is no `*-fill.ts`; `content.ts` exports hand-built constants (`EXHIBITION`, `HALLS`, exhibit/placard data), not a `FILL_SCHEMA`. Page component: default export `GalleryFloorPage` from `experiences/slide-decks/deck-innovation-showcase/GalleryFloorPage.tsx` (a page, not a fill-driven template).
- (b) Component root data-testid: `live-gallery-floor` (GalleryFloorPage.tsx:531; also `floor-catalogue`, `floor-counter`, `slide-section`, `retired-placard`).
- (c) Mood: **dark** — no worldtemplate descriptor exists to declare it; per the experience manifest approval notes, "warm charcoal gallery dark with spotlight pools".
- (d) Slide count of this fill: **n/a** (no fill authored). The shipped world walks 3 routes / plan+six-plinth floor.

## What unblocks this specimen

1. Templatize `deck-innovation-showcase` (template extraction + fill schema + descriptor + certify + part IDs) — a separate template-work task; or
2. Amend the specimens plan to pick a different spatial-canvas target once any of its five worlds is templatized; until then the grammar card keeps its example-screenshot fallback (per the plan's Task 6 escape hatch).
