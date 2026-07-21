# Grammar specimen — technical-blueprint — opendesign-intro fill, 2026-07-21

Validated fill only (no scaffold, no render, no commits). Artifacts in this directory:
`mcp-outcome.json` (compose result + the failed pin attempt), `fill.json` (the exact
object that passed), `validate-outcome.json` (final passing result).

## Intake record

- Surface: slide-deck (given) · Audience: mixed (engineers + design-minded PMs)
- Fidelity: CONDENSE — fewest slides that keep the 10-beat arc; template is fixed at 10 sections
- Pin: `deck-technical-architecture-explanation` as briefed → **UNKNOWN_TEMPLATE** (that world is a
  hand-built live world; it has no worldtemplate manifest and is not in `world-templates.json`).
  Re-pinned `deck-cloud-migration` (`cutover`) — the ONLY live slide-deck template in the
  technical-blueprint grammar, so the grammar goal holds. Error preserved in `mcp-outcome.json`.
- Context: businessIntent [explain-design-system, enable-adoption], corporateSuitability standard,
  motionPreference 1 (template locks motion level 2, mood locked light).
- validate_fill: round 1 → 18 renderBudget findings (world render budgets sit well below the
  descriptor maxChars — same contract-vs-pixels gap the dgm-circuit run reported); round 2 →
  **valid: true, 0 findings**. Client-side `FILL_SCHEMA.safeParse` (tsx, real module): **OK**.

## Slide map (kind — title/headline — source beats)

1. title — "One design system. / Five surfaces. One fixed point." — beat 1 (one system/five surfaces, GUIDANCE §1) + 65 worlds in the standfirst; the COVER specimen frame
2. current — hand-built estate: editorial welded into page TSX, invisible to compose — beats 1/9 (hand era; self-referential: "no template to pin" is this run's own error)
3. target — same boxes rewired through fill → schema → registry → MCP → skill — beats 3+4 (skill/MCP handshake as wire labels; division-of-labor as the re-zoning)
4. delta — "Templatizing: what moves, what dies, what refuses to move." — beats 4+7 (COMPOSE/BORROW/AUDIT compressed into moves/dies notes; craft = the stays column)
5. waves — five eras: hand-built → contracts+certifier → MCP tools → pilots (Jul 15–19) → 65 worlds today — beats 5+9 (timeline + estate)
6. cutover — "A COMPOSE run, intake to evidence — one gate in the middle." — beat 2 (compose.md flow; decision gate = validate_fill)
7. sync — "Nothing ships until every gate agrees." — beat 6 (Definition of Done order, GUIDANCE §4 + §3d)
8. rollback — "When the gate fails: three rounds, then stop and report." — beats 2+6 (validate-loop etiquette; stop-and-report doctrine)
9. risk — register: audit catch (375px/529px), descriptor-caps gap, e2e-only bug, compose coverage — beat 6 honest tensions
10. closing — "Sign the doctrine, then compose." — beat 10 (takeaways + ask; grammar bake-off named in the detail)

## Kept / cut (CONDENSE — binding)

Kept: all ten beats, merged as above (lexicon beat 8 lives in the estate node labels and wave
chips — descriptor, fill, registry, skill ARE the lexicon; routes beat 7 lives in delta + closing).
Cut: the cells-style lexicon slide, part-inspector demo moment (compressed to one BORROW line),
environment gotchas (§7), git hygiene, enforcement test file names, reading list, descriptor-side
parts listing (future work), certifier CLI invocations.

## Honesty rules

- Anomaly (exactly one): the `stays` node `craft`, locked, badge **"CRAFT STAYS HUMAN — no machine
  edits"** — the real doctrine tension: compose/borrow runs never write layout/colour/motion, and a
  flaw found mid-run is template work (stop, report). Echoed in delta.stays and rollback r4.
- Notice: "Synthetic estate — drawn from repo docs, Jul 2026" — covers the estate being a conceptual
  drawing (real subsystems, but the "migration" is a framing device) and chrome figures (`rev 1`).
- Numbers trace: 65 worlds + 5 surfaces (brief/GUIDANCE §1), Jul 15 (borrow-a-part.md), Jul 18 +
  375px/~529px (design-audit-pilot RUN-LOG), Jul 19 (opendesign-intro-sample RUN-LOG), 8 deck
  templates (this run's MCP listing of live slide-deck templates), 42+ Playwright specs (GUIDANCE
  §4), 7 unit tests + 3 screenshots (GUIDANCE §3d), max 3 rounds (GUIDANCE §6c). No geometry
  authored anywhere (estate + rollback auto-lay).

## Fit note (honest)

The Cutover is a migration narrative, not an architecture-explanation template. The fit works
because the source contains a REAL migration — templatizing hand-built worlds into the
template+fill platform (GUIDANCE §6b) — and the strongest sections land squarely: the flow slide
holds the COMPOSE run with validate_fill as the decision gate; the rollback tree IS the
validate-loop discipline; delta's moves/dies/stays IS the division of labor; the risk register
takes the repo's honest tensions verbatim. Weak fits, stated plainly: (1) the estate zone chrome
literally reads on-prem/cloud — here it stands for "hand territory vs composed platform" and only
the captions say so; (2) the waves swimlane is built for weekends, so era names sit in a "when"
slot styled like dates; (3) the deck the brief wanted (The Sectional) cannot be composed at all —
that gap is itself risk k4 on slide 9. Net: a good, honest fit for this content, but earned through
reframing rather than native.

## Post-run restoration note (2026-07-21, same session)

`fill.json` was corrupted downstream of this run (leading U+FFFD replacement character before the
`{` plus a reformat — not a BOM; JSON no longer parsed). The file was REWRITTEN byte-for-byte from
the exact fill object that passed round 2 (UTF-8, no BOM, LF, 2-space indent) and re-verified:
JSON parses, `FILL_SCHEMA.safeParse` OK, and a fresh `validate_fill` run returned
**valid: true, 0 findings** (validate-outcome.json unchanged — identical result).

The follow-up brief asked for two "tightenings" (`estateNotes.target` claimed 182 > 180,
`waves[3].when` claimed 17 > 16). **Neither was applied — both claims measure UTF-8 BYTES, not
characters.** Zod `max()` counts characters: `estateNotes.target` is **180 chars** (182 bytes —
two em dashes), `waves[3].when` "Jul 15–19, 2026" is **15 chars** (17 bytes — one en dash). Both
are within their limits, and the real `FILL_SCHEMA.parse` accepts the fill as-is (verified twice
via tsx against `cutover-fill.ts`). Changing them would have broken the contract that `fill.json`
is the exact JSON that passed validation, so the passing values were preserved.

## Scaffold facts

- (a) Template world dir: `experiences/slide-decks/deck-cloud-migration/`
  - Fill schema: `import { FILL_SCHEMA, SECTIONS, type CutoverFill } from '../deck-cloud-migration/cutover-fill.js'`
    (source `cutover-fill.ts`; also exports `CutoverFill` (schema const + type), `CUTOVER_SECTIONS`,
    `CUTOVER_GUIDANCE`, types `CutoverNode`, `CutoverEdge`; `FILL_SCHEMA`/`SECTIONS` are the
    certifier-convention aliases)
  - Template component: `import CutoverTemplate from '../deck-cloud-migration/CutoverTemplate.js'`
    (default export, props `{ fill: CutoverFill }`)
- (b) Template component root data-testid: `live-cutover` (on `div.cu-root`, CutoverTemplate.tsx:1136)
- (c) Mood: **light** (descriptor `deck-cloud-migration.worldtemplate.manifest.ts`, locked)
- (d) Slide count of this fill: **10** (title, current, target, delta, waves, cutover, sync,
  rollback, risk, closing — all sections repeat exactly once)
