# Grammar specimen run — monumental-type × opendesign-intro — 2026-07-21

**Outcome: VALIDATED FILL (valid: true, 2 rounds) — via the grammar's live template
`tminus` (`deck-product-launch`), NOT the plan-pinned `deck-product-vision`.**
Artifacts: `mcp-outcome.json` (both compose calls), `fill.json` (the exact JSON that
passed), `validate-outcome.json` (round history + final pass + client-side Zod parse).

## Intake record

- Surface: slide-deck (given) · Audience: mixed (engineers + design-minded PMs) —
  internals named, no code
- Fidelity: CONDENSE — the template fixes the deck at 10 sections (every kind repeats
  exactly 1), so condensation happened inside slots, not by dropping slides
- Pin: `deck-product-vision` per the bake-off plan (Task 6 row) — **UNKNOWN_TEMPLATE**;
  re-pinned `tminus` (see divergence note below)
- Context: businessIntent `[explain-design-system, enable-adoption]`,
  corporateSuitability `standard`, motionPreference 1 (template locks its own level 2)
- Source: `GUIDANCE.md`, `docs/borrow-a-part.md`,
  `docs/superpowers/specs/design-audit-pilot/RUN-LOG.md`; narrative map from
  `docs/superpowers/specs/opendesign-intro-sample/RUN-LOG.md`

## Divergence note (honesty rule)

The plan's pin, `deck-product-vision` ("The Manifesto"), is a hand-built live world
that was never templatized: its directory holds only `ManifestoPage.tsx`,
`content.ts`, `manifesto.css` and the experience manifest — no `*Template.tsx`, no
`*-fill.ts` (`FILL_SCHEMA`/`SECTIONS`), no `*.worldtemplate.manifest.ts` — so the
compose pin fails `UNKNOWN_TEMPLATE` (same blocker as the executive-editorial,
precision-grid, signal-glass and spatial-canvas sibling runs; server list matches
`packages/registry/generated/world-templates.json`, so the registry view is current).

Unlike those siblings, **monumental-type has a live, composable, in-grammar deck
template**: `tminus` (`deck-product-launch`, "The T-Minus"), whose descriptor declares
`grammarId: 'monumental-type'` — the authoritative template→grammar mapping. Since the
bake-off's purpose is a genuine specimen of the *grammar* (not of one world), the run
proceeded with `pinTemplateId: "tminus"` instead of blocking. The Manifesto remains
the stronger poster-art expression of the grammar; templatizing it (GUIDANCE §6b
ingestion chain) is the follow-up that would let the plan's original pin work.

## Slide map (10 slides, kind — title/headline — source beats)

1. title — cover: "Every template / is a live world." over product OPENDESIGN — beat 1
   (one system, five surfaces; GUIDANCE §1). This is the public specimen frame.
2. one-sentence — the system in one sentence + facts 5 surfaces / 65 worlds / 3 routes —
   beats 1+5
3. thesis — "Templates carry craft. / Fills carry content." + doctrine paragraph —
   beat 4 (division of labor)
4. readiness — five quality gates, one amber — beat 6 (quality loop; the REAL anomaly,
   below)
5. comms — the skill ↔ MCP handshake as the comms plan (skill / compose tool / author /
   validate_fill / gallery) — beat 3 (+ part of beat 2)
6. pricing — the three routes as tiers priced in effort: COMPOSE "1 MCP call" (feature),
   BORROW "1 part-id", AUDIT "0 edits" — beat 7
7. runbook — one compose run as the day-0 rail, STEP 1–8, go/no-go diamond on
   validate_fill — beat 2 (+ the DESIGN.md Part 2 verify chain)
8. risk — abort triggers (certifier findings > 0, rounds > 3, mid-run design flaw,
   375px horizontal scroll) + git-shaped rollback — beat 6
9. metrics — 65 / 5 / 3 / 0 / 3 as KPI tiles — beats 5+9 numbers
10. closing — "GREEN — Leave the estate greener than you found it." + decisions —
    beat 10

## Kept / cut (CONDENSE)

- Kept: beats 1–7, 9 (numbers only), 10.
- Cut: beat 8 (lexicon) as a standalone — terms are named in situ (fill, template,
  certifier, part-id, verify rig); beat 9 (timeline) as a standalone — the Jul 18
  pilot date survives in the readiness/risk/closing copy, the Jul 15 borrow-pilot
  date is dropped; environment gotchas (§7), git hygiene detail, certifier CLI
  invocations, 42+ e2e spec count, descriptor-side parts listing (same cuts as the
  sibling runs).

## Honesty rules

- **Anomaly (exactly one):** the amber readiness gate is the REAL template defect the
  Jul 18 audit pilot found **in this very template** — T-Minus mobile chrome scrolls
  to 529px at a 375px viewport (design-audit-pilot RUN-LOG, reported as template
  work, not patched). `anomalyLabel`: "T-MINUS MOBILE CHROME — 529PX AT 375PX".
  Deliberately self-referential: the specimen's own template carries the one honest
  flaw, and the closing slide says clearing it is template work.
- **Notice:** `deck.notice` = "SOURCED FROM REPO DOCS & PILOT RUN LOGS · 2026-07".
  No synthetic figures: 65 worlds + 5 surfaces (bake-off brief / GUIDANCE §1),
  3 routes (open-design skill), Jul 18 + 529px/375px (design-audit-pilot RUN-LOG),
  7 unit tests passed by the borrow bug (GUIDANCE §3d), 0 certifier findings
  (GUIDANCE §4), max 3 validate rounds + three intake questions (GUIDANCE §6c),
  closing line adapted from GUIDANCE's sign-off. No percent-unit KPIs, so the
  fraction convention never fires. No geometry anywhere.

## Validate loop (max 3; used 2)

- Round 1: `valid: false`, 1 finding — `pricing[1].includes` renderBudget (74 chars vs
  budget 73; shipped magnitude 58). Fixed content-side: tightened to 69 chars.
- Round 2: `valid: true`, 0 findings.
- Extra client-side check (validate_fill enforces the descriptor envelope only):
  `FILL_SCHEMA.safeParse(fill.json)` via tsx — success, so the full Zod contract
  (gates exactly-one-warning refinement, status/unit enums, single gate:true runbook
  step) holds too.

## Fit note (honest)

Moderate-to-good, with a stated cost. The monumental cover/thesis/closing slides fit
the content perfectly — "Every template / is a live world." is exactly the single
strong statement the grammar rewards, and readiness/runbook/risk/metrics map cleanly
onto the quality loop, the COMPOSE sequence, the stop rules and the estate numbers.
The cost is the launch framing: `comms` and `pricing` are launch-vocabulary kinds
that had to be *recast* (handshake-as-comms-plan works well; routes-as-price-tiers is
a deliberate conceit — "priced in edits: zero" keeps it honest but a viewer will
notice the template thinks it's launching a product). Runbook `time` slots carry
"STEP n" ordinals, not clock times, so the template-derived kicker reads
"ONE DAY · STEP 1 → Ship" — legible but slightly off-register. Also note the fill's
own anomaly: this template has a known mobile-chrome defect (529px @ 375px), so the
specimen should be shot at desktop 1280×800 (which the specimen contract already
requires). A templatized Manifesto would express this grammar better; recommended as
follow-up template work.

## Scaffold facts

- **(a) Template world dir:** `experiences/slide-decks/deck-product-launch/`.
  Fill schema: `experiences/slide-decks/deck-product-launch/tminus-fill.ts`
  (in-world import path `./tminus-fill.js`) — exports `TMinusFill` (the Zod object,
  doubling as the inferred type), certifier-standard aliases `FILL_SCHEMA` and
  `SECTIONS`, plus `TMINUS_SECTIONS`, `TMINUS_GUIDANCE`, and types `TMinusGate`,
  `TMinusRunStep`. Shipped content: `content.ts` exports `tminusFill` and alias
  `SHIPPED_FILL`. Template component: **default export `TMinusTemplate`** from
  `experiences/slide-decks/deck-product-launch/TMinusTemplate.tsx`
  (`TMinusTemplate({ fill }: { fill: TMinusFill })`); thin wrapper `TMinusPage.tsx`.
  (The plan-pinned world, `experiences/slide-decks/deck-product-vision/`, has no fill
  schema or template component — `ManifestoPage.tsx` root testid `live-manifesto`.)
- **(b) Template component root data-testid:** `live-t-minus`
  (TMinusTemplate.tsx:510, on `div.tm-root`).
- **(c) Mood:** `dark` (descriptor `mood: 'dark'`,
  `deck-product-launch.worldtemplate.manifest.ts`; guidance: "the mood is locked dark").
- **(d) Slide count of this fill:** **10** (the template's fixed section sequence:
  title, one-sentence, thesis, readiness, comms, pricing, runbook, risk, metrics,
  closing).
