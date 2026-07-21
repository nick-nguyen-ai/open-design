# grammar-specimen run — kinetic-intelligence / opendesign-intro — 2026-07-21

**Outcome: BLOCKED (template work required). No fill was authored; no fill.json / validate-outcome.json exists — see "Why blocked" below. No fabricated results.**

## Intake record

- Surface: slide-deck (given) · Audience: mixed (engineers + design-minded PMs) · Fidelity: CONDENSE
- Pin: `deck-experiment-results` (grammar `kinetic-intelligence`, the grammar's only deck world per its grammar manifest)
- Source: `GUIDANCE.md`, `docs/borrow-a-part.md`, `docs/superpowers/specs/design-audit-pilot/RUN-LOG.md`; narrative map from `docs/superpowers/specs/opendesign-intro-sample/RUN-LOG.md` (10 beats)
- Context sent: `businessIntent ["explain-design-system","enable-adoption"]`, `corporateSuitability standard`, `motionPreference 1`

## Why blocked (evidence: mcp-outcome.json)

`compose_slide_deck` with the pin returned **UNKNOWN_TEMPLATE** — "not a live slide-deck template". A `validate_fill` probe returned the same code, so the gap is registry-wide, not compose-specific. Stale registry ruled out: the server's 8 live deck templates match exactly the 8 `*.worldtemplate.manifest.ts` files in the current checkout, and `experiences/slide-decks/deck-experiment-results/` contains **no** worldtemplate descriptor, **no** `*-fill.ts`, and **no** extracted Template component — "The Readout" shipped as a plain page (approved 2026-07-13, quality 91) with its content hardcoded in `content.ts`, and was never templatized.

Templatizing it (GUIDANCE §6b: scaffold-template → extract Template.tsx under parity oracles → fill schema + SECTIONS in lockstep → certify → part IDs) is template work, explicitly out of scope for a compose run ("you NEVER write CSS/layout/motion... A design flaw found mid-run is template work: stop, report") and outside this run's write boundary (evidence dir only). The grammar-tab plan (`docs/superpowers/plans/2026-07-21-grammar-tab-specimens.md`, Task 6) anticipated exactly this failure mode for calm-command — "if the compose route cannot target the grammar, leave the example fallback and flag in the run log" — the same valve applies here: `GrammarSpecimen` falls back to the grammar's first example screenshot, so the gallery shows no empty frame.

## Slide map / kept-cut

Not applicable — no fillSkeleton was returned to author against. Planned condensation (for the future run, once templatized): the 10-beat arc maps onto The Readout's 8 shipped slide kinds — thesis (cover: one system, five surfaces), ledger (estate: 5 surfaces / 65 worlds), reading ×3 (COMPOSE / BORROW / AUDIT as instrument readings — the audit pilot's real catches are natural "readings": T-Minus 529px overflow = the WITHHELD-style anomaly), board (routes compared, verdict-coded), method (division-of-labor doctrine + quality gates), close (timeline + takeaways).

## Fit note (honest)

Content-to-template fit would be **strong** if the template existed: the deck's whole register is verdict-honest experiment readout ("we ship what survives measurement"), which mirrors the source's honesty doctrine, and the audit pilot's findings (1 critical, 1 minor, real dates Jul 15/18) supply real readings — the single-anomaly craft rule maps to the pilot's T-Minus critical finding with zero invention. But the RESULT NUMERAL + trace-chart anatomy of `reading` slides demands metric series; only the audit counts (findings, viewport widths, 529px scrollWidth) are real numbers, so most series would be synthetic under the notice. The blocker is purely contractual, not a content mismatch.

## Scaffold facts (looked up from source)

- (a) World directory: `experiences/slide-decks/deck-experiment-results/`. **No fill schema exists** — there is no `*-fill.ts` and therefore no `FILL_SCHEMA`/`SECTIONS` exports and no `SHIPPED_FILL`; content is hardcoded exports in `experiences/slide-decks/deck-experiment-results/content.ts` (`SESSION`, `LEDGER`, `READINGS`, `WITHHELD_READING`, `BOARD`, `METHOD`, `SLIDES`, `SLIDE_COUNT`, `VERDICT_LABEL`, `VERDICT_GLYPH`, `slideNumberForId`, `readingById`). The page component is the default export `ReadoutDeckPage` from `experiences/slide-decks/deck-experiment-results/ReadoutDeckPage.tsx` (page, not a fill-driven Template).
- (b) Component root `data-testid`: **`live-readout`** (`ReadoutDeckPage.tsx:592`, on `.rd-root`).
- (c) Mood: **dark** — no worldtemplate descriptor exists to declare it; per the experience manifest approval notes, "a bench-oscilloscope readout session on a near-black instrument field with phosphor-teal traces".
- (d) Slide count of this fill: **n/a (blocked)**. The shipped world has **8** slides (`SLIDES` in content.ts: thesis, ledger, reading ×3, board, method, close).

## Unblock path (template work, separate task)

Templatize `deck-experiment-results` per GUIDANCE §6b (reference world `deck-cloud-migration`): extract `ReadoutTemplate.tsx` from `ReadoutDeckPage.tsx` under the parity oracles, author `readout-fill.ts` (FILL_SCHEMA + SECTIONS) + `deck-experiment-results.worldtemplate.manifest.ts`, certify to 0 findings, add part IDs + `LivePartIds.test.tsx` entry, `registry:build`, restart the MCP server — then rerun this specimen compose with the same pin.
