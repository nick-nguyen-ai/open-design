# Grammar specimen run — research-notebook × opendesign-intro — 2026-07-21

**Outcome: BLOCKED at the compose step. No fill was authored** (no `fill.json` /
`validate-outcome.json` in this directory — none would be true). This is the honest
run record required by GUIDANCE §3f/§3g and the compose doctrine ("a design flaw
found mid-run is template work: stop, report").

## Intake record

- Surface: slide-deck (given) · Audience: mixed (engineers + design-minded PMs)
- Fidelity: CONDENSE — fewest slides that keep the 10-beat opendesign-intro arc
  (one system/five surfaces → COMPOSE flow → skill/MCP handshake → division-of-labor
  stack → gallery estate 65 worlds → quality loop → COMPOSE vs BORROW vs AUDIT →
  lexicon → timeline → close)
- Pin: `deck-genai-model-validation-report` (research-notebook's example deck, per
  `packages/registry/data/grammars/research-notebook.grammar.manifest.ts` and the
  bake-off plan `docs/superpowers/plans/2026-07-21-grammar-tab-specimens.md` Task 6)
- Context: businessIntent `[explain-design-system, enable-adoption]`,
  corporateSuitability `standard`, motionPreference 1
- Source: `GUIDANCE.md`, `docs/borrow-a-part.md`,
  `docs/superpowers/specs/design-audit-pilot/RUN-LOG.md`; narrative map from
  `docs/superpowers/specs/opendesign-intro-sample/RUN-LOG.md`

## The blocker

`compose_slide_deck` with the required pin returned **UNKNOWN_TEMPLATE** (full
result: `mcp-outcome.json`). Root cause verified in source, not just from the tool
error:

- `experiences/slide-decks/deck-genai-model-validation-report/` is a **hand-built
  live world** ("The Lab Report", shipped 2026-07-12, quality 92, approval note
  "Live build shipped (task 15)"), **never templatized**. The directory contains
  exactly four files — `LabReportPage.tsx`, `content.ts`, `lab.css`, and
  `deck-genai-model-validation-report.experience.manifest.ts`. There is **no
  `*Template.tsx`, no `*-fill.ts` (no `FILL_SCHEMA`/`SECTIONS`), and no
  `*.worldtemplate.manifest.ts`** anywhere in the repo for this id, so a registry
  rebuild cannot surface it either.
- `packages/registry/generated/world-templates.json` publishes exactly the 8 live
  slide-deck templates the error lists (cutover, dgm-blueprint/circuit/gazette/
  isometric/sketchnote, quarter, tminus) — the server registry is current, not stale.
- Its `content.ts` is shipped editorial content baked into typed `Plate` objects —
  the opposite of the fill/template split; there is no descriptor contract for
  `validate_fill` to enforce and no fillSkeleton to author against. A `validate_fill`
  call would fail with the same UNKNOWN_TEMPLATE.
- **No live slide-deck template belongs to `research-notebook`** (cutover →
  technical-blueprint, quarter → precision-grid, tminus → monumental-type, dgm-* →
  their own five bake-off grammars). There is no in-grammar fallback pin; any
  substitute template would render a different grammar and mislabel the specimen.
  Same failure mode already recorded by the executive-editorial, precision-grid, and
  calm-command sibling runs in this directory tree.

The bake-off plan anticipated exactly this (its calm-command row): "if the compose
route cannot target the grammar, leave the example fallback and flag in the run
log". This note is that flag, for research-notebook. The gallery's
`GrammarSpecimen` fallback chain shows an example screenshot of the shipped world
instead, so the Grammars tab stays image-bearing.

## Fit note (honest, for when the template exists)

The fit would be genuinely strong — the best of the blocked grammars. The Lab
Report's plate kinds map almost one-to-one onto the opendesign-intro beats:
`spec` → division-of-labor doctrine (label/value rows: template=craft,
fill=content, MCP=selection, skill=orchestration); `battery` → the gallery estate
table (5 surfaces × world counts, total 65); `figure` → the quality-loop evidence
(the audit pilot's real numbers); `findings` → COMPOSE/BORROW/AUDIT as register
rows with the audit pilot's real catch (T-Minus 529px mobile scrollWidth, CRITICAL,
reported-not-patched) as the one OPEN anomaly; `limitations` → honest caveats
(descriptor caps vs render budgets from the sample run); `verdict` → the
"evidence over assertion" close with the stamp. A validation-report grammar
narrating a system whose whole doctrine is validation evidence is a natural rhyme.
Cover would carry: kicker "INDEPENDENT REVIEW"-register team line, title
"OpenDesign / One system, five surfaces", thesis on division of labor.

## Scaffold facts (looked up per the run brief; state of the world as-is)

- World directory: `experiences/slide-decks/deck-genai-model-validation-report/`
- Fill schema import path + exported names: **does not exist** — there is no
  `*-fill.ts` and no `FILL_SCHEMA`/`SECTIONS`/fill type exports. The content-bearing
  module is `experiences/slide-decks/deck-genai-model-validation-report/content.ts`
  (imported by the page as `./content.js`), exporting `REPORT`, `PLATES`,
  `PLATE_COUNT`, `plateNumberForId`, the `Plate` union type (`CoverPlate`,
  `SpecPlate`, `BatteryPlate`, `FigurePlate`, `FindingsPlate`, `LimitationsPlate`,
  `VerdictPlate`), and chart data (`HALLUCINATION_BY_CLASS`,
  `HALLUCINATION_APPETITE`, `HALLUCINATION_BREACH_INDEX`, `DRIFT_SERIES`).
- Template component: **no `*Template.tsx` exists**. The page component is the
  default export `LabReportPage` in
  `experiences/slide-decks/deck-genai-model-validation-report/LabReportPage.tsx`
  (thin-wrapper + template split never performed).
- Component root `data-testid`: `live-lab-report` (on the `.lr-root` div in
  `LabReportPage.tsx`).
- Mood: **light** — no worldtemplate descriptor exists to declare it, so this is
  read from the art layer (`lab.css`: paper `#d3dce4` / `#e1e7ed`, ink `#152230`;
  "cool grey-blue technical stock", print drops to white).
- Slide count: shipped world renders **8 plates** (cover + 7 numbered plates,
  `PLATE_COUNT = 8`). **My fill: n/a — no fill was authored** (no skeleton exists
  to author against).

## Unblock path (template work, out of scope for a compose run)

GUIDANCE §6b ingestion chain on this world:
`corepack pnpm --filter @enterprise-design/registry scaffold-template` → extract
`LabReportTemplate.tsx` from `LabReportPage.tsx` under the parity oracles
(`LiveWorlds*`, `apps/gallery/e2e/live-decks.spec.ts`) → author
`deck-genai-model-validation-report-fill.ts` (`FILL_SCHEMA` + `SECTIONS` in
lockstep with a new `*.worldtemplate.manifest.ts` descriptor; plate kinds cover,
spec, battery, figure ×2, findings, limitations, verdict) → certify to 0 findings →
`data-part-id` anchors + `LivePartIds.test.tsx` entry → registry rebuild. Then
re-run this compose with the same pin; the fill plan in the fit note above should
drop straight in.

## Gate summary

- Compose call: made once, exactly as briefed — ERROR `UNKNOWN_TEMPLATE`
  (requestId `6dc81e55-0d83-489a-ad1e-220a5d049a65`).
- Validate loop: not entered (0 rounds) — no worldTemplateId exists to validate
  against.
- Edits outside this evidence directory: **none** (`git status` on the source world
  is clean).
