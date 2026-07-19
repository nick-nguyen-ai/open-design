# Three-candidate compose + the quality-control rig — design note, 2026-07-19

Why this landed: the opendesign-intro compose run (docs/superpowers/specs/
opendesign-intro-sample + -fable-sample) exposed the verification chain's
soft spots with a live specimen. `validate_fill` blessed a fill (round 1,
valid:true) that then shipped six real content-fit findings — truncated
details, colliding labels, a stranded flow node — because the descriptor caps
sat ~3× above what the templates render, every catch downstream was an
eyeballed screenshot, and the author graded its own work (self-score E4; the
independent audit of the same pixels said E3). Separately, the deterministic
selector picked `dgm-circuit` on audience-only evidence while a slightly
richer brief phrasing made `dgm-sketchnote` a clear winner — one honest
answer, but the user never saw the near-misses.

## What changed (one commit per line, all gated)

**Contracts** (`packages/contracts/src/world-template.ts`)
- `no-back-edges` craft rule kind (shared `evaluateCraftRule`, so certifier
  and `validate_fill` cannot diverge) — declared on `flow.edges` of all five
  dgm manifests; the loop-back that wrecked the intro deck's flow slide is
  now machine-rejected.
- `SlotMagnitude` / `ShippedMagnitudes` + the budget constants
  (`RENDER_BUDGET_HEADROOM` 1.25, `RENDER_BUDGET_MIN_SLACK` 14,
  `MAXCHARS_DRIFT_FACTOR` 4, `MAXCHARS_DRIFT_SLACK` 40).

**Registry**
- `magnitudes.ts`: the build imports each world's `content.ts` and emits
  `generated/shipped-magnitudes.json` (templateId → slot path → shipped
  string/field magnitudes) — the proven-to-render corpus as data.
- Certifier `budget-drift`: a `maxChars` beyond BOTH 4× shipped AND
  shipped+40 is a finding. Retuned the genuinely drifted dgm caps at their
  single `_dgm-kit` source (figure title 80→48, heading 70→64, sideLabel
  80→32, hubLabel 80→14).

**MCP server**
- `validate_fill` `renderBudget` findings: object-array string fields (the
  values NO cap governs — cells details, era labels, stage labels) budget
  against shipped × 1.25 with a +14 floor; machine fields exempt. Calibrated
  against the known-good intro fill (a naive all-slot version produced 22
  false positives; capped string slots stay governed by their drift-tightened
  caps).
- `fill` is `z.record(...)` on the wire (`"type":"object"`) — the
  stringified-fill transport bug that forced scripted fallbacks is dead.
- Every `compose_*` returns `alternatives` (top-3, winner first, score
  breakdown + style/mood/grammar/guidance) and accepts `pinTemplateId` (an
  explicit pick: bypasses scoring and NO_TEMPLATE_FIT, rejects cross-surface
  ids).
- Committed tripwire: `__fixtures__/bad-dgm-fill.ts` plants exactly three
  defects; the test asserts the exact path+rule set, so a silently regressed
  guard is named.

**Skill + docs**
- `scripts/verify.mjs` + `scripts/probes.mjs`: THE verify rig — every state
  at 1440/1280/375, DOM probes (root overflow F1 at all viewports; text
  overflow/ellipsis, text overlap, WCAG contrast with honest `unverifiable`
  at the probe viewports), `findings.json`, `--strict`, stale-dist warning.
  Probes skip visually-hidden a11y mirrors (the first live run flooded on
  them). Negative-tested by `apps/gallery/e2e/verify-rig.spec.ts` against the
  planted `fixtures/probe-fixture.html`.
- Root `DESIGN.md`: Part 1 absorbs GUIDANCE §5 (now a pointer); Part 2 is the
  numbered verification procedure (build → rig → findings table → contracts →
  smoke → content-fit → judge → honest copy → pass criteria), written so a
  smaller model can run it verbatim.
- `references/screenshot-judge.md`: the mandatory fresh-context grading pass
  (screenshots + rubric only, never the fill/brief/intent); its scores are
  the run's scores. Wired into compose Phase 6 + borrow Phase 4.
- compose.md: intake capped at three questions (style question deleted — the
  candidate pick IS the style choice); Phase 2 presents the alternatives with
  `/live/<experienceId>` shipped examples as zero-cost previews; "mix" =
  compose the pick + borrow parts from the others (dgm family: same fill,
  different pin).

## Deliberate limits (so nobody "fixes" them blindly)

- renderBudget scopes to uncapped object-array fields only — budgeting capped
  slots against one shipped SAMPLE rejects known-good fills (55-char heading
  over a 26-char sample renders fine).
- The rig cannot see crowding-without-overlap (the dgm 375px footer: flush
  boxes, no intersection) or contrast over gradients (`unverifiable`) — both
  stay with the screenshot judge by design.
- Only slide-deck has >1 template today, so the candidate pick degrades to a
  stated fit on the other four surfaces until they grow siblings.
