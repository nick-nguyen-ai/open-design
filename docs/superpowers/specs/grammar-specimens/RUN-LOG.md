# Grammar specimens — compose runs, 2026-07-21

Goal (plan Task 6, `docs/superpowers/plans/2026-07-21-grammar-tab-specimens.md`):
the same opendesign-intro content rendered in every grammar, one cover frame per
grammar shipped as `apps/gallery/public/previews/grammar-<id>.jpg`.

## What the runs discovered (plan correction)

The plan's fill-target table assumed any catalogue deck could be composed. In
reality **only world-templatized worlds have fill contracts**, and the MCP
server publishes exactly 8 live deck templates: the five `dgm-*` bake-off
templates plus `cutover` (technical-blueprint), `quarter` (precision-grid),
`tminus` (monumental-type) — and one dashboard template, `cockpit`
(precision-grid). Every other pinned target returned `UNKNOWN_TEMPLATE`.

Result: **8 of 15 grammars are specimen-composable today** (5 dgm + 3 above).
The remaining 7 have zero templatized worlds; per the skill invariant
(templatizing mid-run is template work), their runs stopped with honest
evidence and the gallery keeps the example-screenshot fallback for them.

## Per-grammar outcomes

| Grammar | Template | Outcome |
| --- | --- | --- |
| precision-grid | `quarter` (deck-quarterly-business-review) | fill valid (2 rounds), 11 slides, demo `/demo/spec-precision-grid` |
| technical-blueprint | `cutover` (deck-cloud-migration) | fill valid (2 rounds), 10 slides, demo `/demo/spec-technical-blueprint` |
| monumental-type | `tminus` (deck-product-launch) | fill valid (2 rounds), 10 slides, demo `/demo/spec-monumental-type` |
| calm-command | — (db-ai-risk-command-centre not templatized) | blocked; example fallback |
| executive-editorial | — (deck-ai-strategy not templatized) | blocked; example fallback |
| signal-glass | — (deck-analytics-deep-dive not templatized) | blocked; example fallback |
| spatial-canvas | — (deck-innovation-showcase not templatized) | blocked; example fallback |
| research-notebook | — (deck-genai-model-validation-report not templatized) | blocked; example fallback |
| living-system | — (deck-transformation-roadmap not templatized) | blocked; example fallback |
| kinetic-intelligence | — (deck-experiment-results not templatized) | blocked; example fallback |

Intake (all three composed runs): audience mixed, fidelity condense, surface
slide-deck, same source as the dgm bake-off (`GUIDANCE.md`,
`docs/borrow-a-part.md`, design-audit-pilot RUN-LOG). Per-run details, slide
maps, fit notes: each grammar's `notes.md`.

## Verify (rig + baselines)

`verify.mjs` ran on all three demo routes (production build, port 4318), plus
**baseline runs on the three shipped worlds** to classify findings:

| Deck | Specimen findings | Shipped-world baseline | Delta |
| --- | --- | --- | --- |
| quarter | 114 | 111 | +3 text-overflow (longer x-axis date labels; baseline clips even "SMB") |
| cutover | 142 | 137 | +4 contrast (same class as baseline chrome), +2 overlap (auto-layout midpoint labels, in-spec content) |
| tminus | 71 | 66 | +5 overlap (template stamp × chrome class) |

All finding classes are exhibited by the shipped worlds themselves →
template-side, reported here, not patched (skill invariant). Fill-side items
found and fixed: two cutover runbook labels clipped 4–6px (tightened,
re-validated `valid: true`), one diagram label shortened. The 375px root
overflow on all three templates is the same defect class as the audit pilot's
documented T-Minus catch.

Encoding incident (process note): a PowerShell 5.1 round-trip corrupted CP1252
specials in one generated fill module; the client-side `FILL_SCHEMA.parse`
lock caught it at runtime (inflated char counts), and files were regenerated
via Node from the clean `fill.json` evidence. Generation script:
`gen-fill-ts.mjs` pattern — always read/write UTF-8 explicitly.

Re-validation evidence: `apps/mcp-server/src/grammar-specimens-revalidate.mts`
(stdio client against the real server) — all three fills `valid: true`,
0 findings.

## Judge scores (fresh-context screenshot judges, 1440 sets)

<!-- filled when the three judge agents return -->
- precision-grid: PENDING
- technical-blueprint: PENDING
- monumental-type: **P5 H5 E3 S5 R4 V4** — pass (no axis < 3). Critical =
  the template's own documented 375px chrome defect (specimen ships at 1280);
  majors are template-side (horizon hairline strikes copy on 3 slides, ~10px
  caption ink below 4.5:1, display face reads Inter-adjacent) — reported as
  template work. Judge praised the deck disclosing its own open amber gate.

## Specimen shots

`apps/gallery/scripts/shoot-previews.mjs` now maps all 8 composable grammars
in `GRAMMAR_SPECIMENS` (5 dgm live routes + 3 demo routes), so
`ONLY=grammar-<id>` re-shoots any specimen against a running gallery.
