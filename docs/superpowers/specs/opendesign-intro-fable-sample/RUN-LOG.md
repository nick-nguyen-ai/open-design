# opendesign-intro-fable — isolated copy of the Fable session's compose run, 2026-07-19

Route: `/demo/opendesign-intro-fable` · Scaffold: `experiences/slide-decks/sample-opendesign-intro-fable/`

This is a byte-identical copy (fill + wrapper, names and route updated) of the Fable session's final round-3 fill,
created because concurrent sessions (sonnet, opus, and a re-verification pass) were working in
`sample-opendesign-intro` and the user wanted this session's output kept apart. The full compose run log — intake,
selection evidence, narrative map, validate rounds, critique scores, template-work observations — lives in
`docs/superpowers/specs/opendesign-intro-sample/RUN-LOG.md`; everything there applies to this copy unchanged.

Verified this session: typecheck + gallery build green with all four opendesign routes registered;
`slide-01..10.png` here re-shot from the built app at `/demo/opendesign-intro-fable` via `shoot.mjs` (port 4319);
`FILL_SCHEMA.parse` runs at module import, so the render itself proves the fill is in contract.

## AUDIT + fix pass — 2026-07-19 (same session)

AUDIT route run on this route at 1280×800 (all slides) + 375px (all slides, F1 probe false throughout):
**0 critical · 2 major · 6 minor**, critique **P4 H5 E3 S4 R4 V3**. Content findings fixed in this fill
(fix pass, re-validated `valid: true`, rebuilt, re-shot):

- flow (major): dropped the `check→author` return edge — the loop had forced the auto-layout to strand
  "Author the fill" with orphaned step markers; linearized, the diagram snaps into the template's two-row
  serpentine (the caption carries the validate loop). Also resolves the flow density finding.
- zones (minor ×2): densified sparse sectors with real worlds from `experiences/` (Control Tower, Data Quality
  Ops, Slipway, Knowledge Atlas, Data Lineage Map, Incident Postmortem).
- cycle hub (minor): `quality-gates.md` → `the gates` (fits the hub circle's ~11-char budget).

Template findings reported, NOT patched (template work): dgm shell footer chrome collision at 375px (nav hint
overlaps the provenance notice — same class as the audit pilot's T-Minus catch); descriptor caps vs render
budgets (also in the original RUN-LOG); zones auto-router passing a wire under an intermediate node.
Post-fix critique: **P4 H5 E4 S4 R4 V3** — V3 is pass-with-intent (the five dgm tour decks share one
structural fingerprint by design; template reuse is the system's point).

## Quality-rig acceptance — 2026-07-19 (same session, after the QC improvements landed)

This run became the acceptance specimen for the three-candidate flow + verify rig
(docs/superpowers/specs/2026-07-19-three-candidate-compose-and-quality-rig.md):

- **Candidates:** an unpinned `compose_slide_deck` with this deck's brief now returns
  `alternatives` — `dgm-sketchnote` 6 (the "walkthrough" intent token), `dgm-circuit` 5,
  `tminus` 5, each with score breakdown and its `/live/<experienceId>` preview. Pinning the
  non-winner (`pinTemplateId: 'dgm-circuit'`) returns the circuit skeleton — i.e., THIS
  shipped deck is exactly what the new flow produces when the user picks circuit off the list.
- **Gates fire:** the shipped fill validates clean against the pinned template; planting the
  two historic defects (120-char cells detail, a flow loop-back) yields exactly
  `renderBudget@cells.cells[0].detail` + `craft@flow.edges`, and removing them restores
  `valid: true`. The very mistakes this run made in round 1 are now machine-rejected.
- **Verify rig:** `verify.mjs` over all 10 slides — 0 actionable findings at 1440+1280,
  F1 false at every viewport incl. 375 (`findings.json` in this directory). The known 375
  footer crowding is box-adjacency (no rect overlap) and stays with the judge, as
  documented in the rig's limits.
- **Screenshot judge (first run of the new mandatory pass):** fresh-context subagent,
  screenshots + rubric only. Scores — **P4 H4 E3 S5 R4 V4** (these replace the author's
  self-scores; note E3 vs the author's E4, the exact drift the judge exists to catch).
  Findings, ALL template-side on `deck-dgm-circuit` / the dgm kit (reported, not patched):
  - `critical? · ink-on-ink (C1) · diagram sublabels (cycle ring, timeline cards, layer
    chips, compare row labels)` — dim mono micro-type on near-black; the rig marks these
    regions `contrast-unverifiable` (the board's background grid is a background-image),
    so the pair must be computed template-side to confirm or clear.
  - `major · ornament collision · sequence slide, grip glyph half-occluded by the
    "Compiled registry" card` — template chrome placement.
  - `major · micro-type floor · ~9-10px diagram sublabels at 1440` — template type ramp.
  - 5 minors (accent-hue semantics rotating across slides, duplicated grip ornament,
    matrix cell padding, ring arrowhead affordance, wire-label clearance).
  No fill-side finding required a revision round; the fill-adjacent minor (wire-label
  clearance) is the already-documented auto-router observation. Verdict quote: "strong
  deck, held back by execution at the smallest type sizes … nothing structural."

**Acceptance result: the pipeline layers behaved as designed** — validate_fill caught the
planted static defects, the rig cleared the mechanical gates and honestly punted the
grid-background contrast to the judge, and the judge surfaced template-work findings the
author's earlier self-review had scored past. Template findings filed above for the
dgm-kit owner; per the invariant, nothing was hot-patched in this run.
