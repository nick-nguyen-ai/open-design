# Grammar specimen run — executive-editorial × opendesign-intro — 2026-07-21

**Status: BLOCKED at the compose step. No fill was authored.** This note is the
honest run record required by GUIDANCE §3f/§3g ("stop, report" when a run hits
template work).

## Intake record

- Surface: slide-deck · Audience: mixed (engineers + design-minded PMs)
- Fidelity: CONDENSE (fewest slides that keep the 10-beat opendesign-intro arc)
- Pin: `deck-ai-strategy` (per the bake-off plan,
  `docs/superpowers/plans/2026-07-21-grammar-tab-specimens.md` Task 6 row
  "executive-editorial → deck-ai-strategy")
- Context: corporateSuitability standard, motionPreference 1,
  businessIntent [explain-design-system, enable-adoption]
- Source content: `GUIDANCE.md`, `docs/borrow-a-part.md`,
  `docs/superpowers/specs/design-audit-pilot/RUN-LOG.md`; narrative map from
  `docs/superpowers/specs/opendesign-intro-sample/RUN-LOG.md`

## What happened

`compose_slide_deck` with `pinTemplateId: "deck-ai-strategy"` returned
**`UNKNOWN_TEMPLATE`** (full result: `mcp-outcome.json`). Root cause, verified
in source, not just the tool error:

- `experiences/slide-decks/deck-ai-strategy/` is a **hand-built live world**
  ("The Morning Board Pack", shipped 2026-07-12, quality 93), **never
  templatized**: it has `BoardDeckPage.tsx` + `content.ts` + `deck.css` +
  experience manifest, but **no `*Template.tsx`, no `*-fill.ts`
  (no `FILL_SCHEMA`/`SECTIONS`), and no `*.worldtemplate.manifest.ts`** —
  a repo-wide glob for `**/*.worldtemplate.manifest.ts` mentioning
  `ai-strategy` finds nothing, so a registry rebuild cannot surface it either.
- `packages/registry/generated/world-templates.json` lists 8 live slide-deck
  templates (cutover, dgm-blueprint/circuit/gazette/isometric/sketchnote,
  quarter, tminus) — the MCP error's list matches, so the server view is
  current, not stale.
- **No live slide-deck template belongs to `executive-editorial`** (cutover →
  technical-blueprint, quarter → precision-grid, tminus → monumental-type,
  dgm-* → their own grammars). So there is no in-grammar fallback pin: any
  substitute template would render a *different* grammar and mislabel the
  specimen — worse than no specimen (the gallery's `GrammarSpecimen` fallback
  chain shows an example screenshot instead).

## Why this run stops here

- The COMPOSE contract (GUIDANCE §1 doctrine, fill-authoring brief) forbids
  template work mid-run: fills are content-only, and this session's mandate
  forbids edits outside this evidence directory. Making `deck-ai-strategy`
  composable means extracting `BoardDeckTemplate.tsx` from `BoardDeckPage.tsx`
  under parity oracles, writing a fill schema + SECTIONS + worldtemplate
  descriptor, certifying to 0 findings, and adding part-id anchors — the
  GUIDANCE §6b ingestion chain, a full templatizing task.
- The bake-off plan itself anticipated exactly this failure mode (its
  calm-command row): "if the compose route cannot target the grammar, leave
  the example fallback and flag in the run log". This is that flag, for
  executive-editorial.

## Unblock path (for the next session)

Templatize `deck-ai-strategy` per GUIDANCE §6b (scaffold-template →
extract template under the parity oracle → fill schema/SECTIONS/descriptor →
certify → part-ids), then re-run this specimen fill. The shipped world's
`content.ts` already models 9 slide kinds (title, section, statement, summary,
evidence, envelope, milestones, resolution, closing) — a natural descriptor
section vocabulary. The 10-beat intro arc condenses well into it (draft
mapping: cover→title, five-surfaces→statement, compose-flow+handshake→summary,
division-of-labor→section+statement, estate-65-worlds→evidence,
quality-loop→envelope, three-routes→summary, timeline→milestones,
close→resolution+closing ≈ 10–12 slides, within the world's 12).

## Slide map / kept-cut / validate loop

Not applicable — no fillSkeleton was returned, so no fill, no
`validate_fill` rounds, no `fill.json` / `validate-outcome.json`. Nothing was
fabricated to stand in for them.

## Fit note (honest)

Untestable this run. On paper the fit is promising — the board-pack register
(one argued statement per slide, low density) suits an adoption pitch, though
CONDENSE would have to merge the 10 beats hard since the grammar caps density
("small number of committed choices"), and the mixed audience is a stretch for
a template whose shipped audience is executive-only.

## Scaffold facts (as they exist today)

- **(a) World directory:** `experiences/slide-decks/deck-ai-strategy/` —
  `BoardDeckPage.tsx`, `content.ts`, `deck.css`,
  `deck-ai-strategy.experience.manifest.ts`. **No fill schema / template
  component exports exist** (that is the blocker). The content contract is
  `content.ts`: exports `DECK`, `SLIDES`, `SLIDE_COUNT`, `slideNumberForId`,
  `FIG1`, `EVIDENCE_SERIES` and the slide interfaces (`TitleSlide`,
  `SectionSlide`, `StatementSlide`, `SummarySlide`, `EvidenceSlide`,
  `EnvelopeSlide`, `MilestonesSlide`, `ResolutionSlide`, `ClosingSlide`,
  union `Slide`); page component is the default export of `BoardDeckPage.tsx`
  (imports via `./content.js`). There is no `FILL_SCHEMA`/`SECTIONS` pair to
  import.
- **(b) Component root data-testid:** `live-deck`
  (`BoardDeckPage.tsx:465`, on `div.bd-root`).
- **(c) Mood:** no worldtemplate descriptor exists, so no descriptor `mood`.
  The page's art layer is **dark** by construction (ivory `#e9dfc8` on
  near-black panels `#171310`/`#171310`-family, print stylesheet "dark drops
  to white"); registry `themeModes: ["light","dark"]`.
- **(d) Slide count:** my fill — none (blocked). The shipped world's own deck
  is 12 slides (`SLIDE_COUNT`, verified against `SLIDES` in `content.ts`).
