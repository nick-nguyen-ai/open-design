# Grammar specimen — living-system / deck-transformation-roadmap — BLOCKED, 2026-07-21

Bake-off run: render the "opendesign-intro" content in every design grammar. This leg
targeted grammar `living-system` via `pinTemplateId: "deck-transformation-roadmap"`
("The River"). **The run is blocked before fill authoring: the pinned world is not a
published compose template.** Per the repo doctrine (GUIDANCE §1: "A design flaw found
mid-run is template work: stop, report"; §6b: templatizing a world is parity-protected
human craft), this is reported, not patched. No fill was authored, no `fill.json` /
`validate-outcome.json` exist — fabricating them would violate the honesty rule.

## Intake record

- Surface: slide-deck · Audience: mixed (engineers + design-minded PMs)
- Fidelity: CONDENSE (fewest slides keeping the 10-beat opendesign-intro arc)
- Pin: `deck-transformation-roadmap` (grammar `living-system`)
- businessIntent: explain-design-system, enable-adoption · corporateSuitability: standard · motion: 1
- Source: `GUIDANCE.md`, `docs/borrow-a-part.md`, `docs/superpowers/specs/design-audit-pilot/RUN-LOG.md`;
  narrative map from `docs/superpowers/specs/opendesign-intro-sample/RUN-LOG.md` (10 beats)

## The blocker (evidence, three independent confirmations)

1. **MCP server (authoritative):** `compose_slide_deck` with the pin returned
   `UNKNOWN_TEMPLATE` — "pinTemplateId \"deck-transformation-roadmap\" is not a live
   slide-deck template." Full result: `mcp-outcome.json` (requestId
   `360c9d51-8939-417d-93d8-448d8c4170a9`). The server lists exactly eight live
   slide-deck templates: cutover, dgm-blueprint, dgm-circuit, dgm-gazette,
   dgm-isometric, dgm-sketchnote, quarter, tminus.
2. **Filesystem:** `experiences/slide-decks/deck-transformation-roadmap/` contains only
   `RiverDeckPage.tsx`, `content.ts`, `river.css`, and the *experience* manifest.
   There is **no `*.worldtemplate.manifest.ts`** (descriptor) and **no `*-fill.ts`**
   (no `FILL_SCHEMA`, no `SECTIONS`, no `SHIPPED_FILL`) — `content.ts` exports bespoke
   world data (`PROGRAMME`, `STATIONS`, `REACHES`, `RIVER` geometry, `SLIDES`,
   `SLIDE_COUNT`, `BENEFIT_SERIES`), not a fill contract. The page renders that data
   directly; it was never split into template + fill.
3. **Generated registry:** `packages/registry/generated/world-templates.json` has 12
   templates; `deck-transformation-roadmap` is absent (its five dgm/classic slide-deck
   siblings are present). A registry rebuild would not change this — there is no source
   descriptor to compile.

Why no substitute was used: every other live slide-deck template belongs to a different
grammar already covered (or coverable) by a sibling run; swapping templates would
break the one-grammar-one-specimen premise of the bake-off. The unblock path is
template work on `deck-transformation-roadmap` (GUIDANCE §6b ingestion chain:
scaffold-template → extract `RiverTemplate.tsx` from `RiverDeckPage.tsx` under the
parity oracle → fill schema + SECTIONS in lockstep with a new descriptor → certify to
0 findings) — a separate, deliberate task, not a compose run.

## Slide map / kept-cut

Not applicable — no fillSkeleton was returned, so no fill was authored. The intended
CONDENSE mapping (recorded for the future templatized run) was: thesis/cover ← beat 1
(one system, five surfaces); overview+ledger ← beats 4/8 (division-of-labor stack as
stations); reach×3 ← beat 9 timeline eras (hand-built → contracts+certifier → MCP
tools+pilots→65 live); confluence ← beat 3 (skill ⌁ MCP handshake merging);
narrows (the flagged anomaly) ← the real tension from the audit pilot (T-Minus mobile
chrome critical found and deliberately not hot-patched — quality gates vs shipping);
benefits ← beat 6 quality loop; commitments/close ← beat 10. The roadmap-shaped
kinds map the timeline beat exceptionally well, as the brief predicted.

## Fit note (honest)

Unknown at the pixel level — untestable without a fill contract. On paper the fit is
promising but tight: The River's slide kinds are stations/reaches/confluences on ONE
continuous journey, which suits the repo's growth-timeline beat strongly, but the
10-beat intro arc carries three non-chronological beats (lexicon, three-route compare,
handshake sequence) that would have to condense into `overview`'s route ledger and one
`confluence` slide; the shipped world runs 9 slides, so CONDENSE was the right
fidelity. The `benefits` kind pins a £m benefit-vs-invest TrendChart — the
opendesign-intro content has no cost series, so that slot would have needed either a
synthetic series fully covered by the notice or a template-side cap discussion.

## Scaffold facts (looked up from source, current as of this run)

- (a) World directory: `experiences/slide-decks/deck-transformation-roadmap/`.
  **No fill schema exists** — there is no `*-fill.ts`, hence no `FILL_SCHEMA`/fill
  type to import, and no separate template component. The only component is the page:
  default export `RiverDeckPage` from
  `experiences/slide-decks/deck-transformation-roadmap/RiverDeckPage.tsx`; its content
  module is `./content.js` (exports `PROGRAMME`, `RIVER`, `RIVER_NODES`, `STATIONS`,
  `REACHES`, `TRIBUTARIES`, `SLIDES`, `SLIDE_COUNT`, `STATUS_GLYPH`, `STATUS_LABEL`,
  `BENEFIT_SERIES`, `reachById`, `stationsForRefs`, `slideNumberForId`; types `Slide`,
  `Station`, `StationStatus`).
- (b) Component root `data-testid`: `live-river` (on `.rv-root` in RiverDeckPage.tsx).
- (c) Mood: **dark** — deep teal-green nocturne (`.rv-root` background around
  `rgba(4, 24, 28)` in river.css; approval notes call it "a deep teal-green
  nocturne"). No worldtemplate descriptor exists to declare mood formally.
- (d) Slide count: my fill — none (blocked). The shipped world ships **9 slides**
  (`SLIDE_COUNT`): thesis, overview, reach ×3, narrows, confluence, benefits,
  commitments.

## Validate loop

Not reached (0 rounds). `validate_fill` requires a `worldTemplateId` from the compose
result; none exists for this world.
