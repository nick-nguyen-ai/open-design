# open-design COMPOSE run — OpenDesign system intro deck, 2026-07-19

Route: `/demo/opendesign-intro` · Template: `dgm-circuit` (`deck-dgm-circuit`, THE LIT BOARD, dark, art-directed)
Scaffold: `experiences/slide-decks/sample-opendesign-intro/` · Evidence: this directory (`slide-01..10.png`, `shoot.mjs`, `validate-outcome.json`).

## Intake (all answers from the brief; none asked)

- Source: `GUIDANCE.md`, `docs/borrow-a-part.md`, `docs/superpowers/specs/design-audit-pilot/RUN-LOG.md`
- Fidelity: concise · Audience: mixed (engineers + design-minded PMs) · Depth: names internals, no code walking
- Length: ~15 min → 10 slides · Style: art-directed (styleHint hard filter) · Surface: slide-deck (given)

## Selection (compose_slide_deck)

Score 5 = audienceOverlap 2×2 + intentMatch 0 + corporateFit 1; three-way tie (dgm-circuit, dgm-sketchnote, tminus)
broken by the stable tie-break. **Fit note (honesty rule):** zero intent-keyword overlap — the score was carried by
audience alone — but the content fit is genuinely strong: all eight pinned diagram kinds are claimed by real source
material and the 10-slide grammar tour matches the requested length exactly. Proceeded.

## Narrative map (as shipped)

1. cover — One system, five surfaces (GUIDANCE §1)
2. flow — the COMPOSE route end-to-end (compose.md)
3. sequence — skill ↔ MCP server handshake (GUIDANCE §1)
4. layers — division-of-labor stack (GUIDANCE doctrine)
5. zones — gallery estate, 5 surfaces / 65 worlds, borrow wire (brief + borrow-a-part.md pilot coverage)
6. cycle — the quality loop; audit pilot's real catch (design-audit-pilot RUN-LOG)
7. compare — COMPOSE vs BORROW vs AUDIT
8. cells — lexicon incl. part-inspector demo moment (borrow-a-part.md)
9. timeline — hand-built → contracts → MCP tools → pilots (Jul 15/18) → 65 live
10. close — takeaways + ask

Cut (concise fidelity): environment gotchas (§7), git hygiene, React/lint discipline, certifier CLI invocations,
descriptor-side parts listing (future work), enforcement test file names, reading list.

## Validate loop

- MCP `validate_fill` transport note: this session's harness serialized the `fill` argument as a string → `(root) Fill
  must be an object`. Fell back per compose.md Phase 0 to the same domain function (`validateFillTool` +
  `loadRegistryData`) via tsx — identical code path.
- Round 1: `valid: true`, 0 findings.
- Rounds 2–3 were content-fit driven (screenshots), both re-validated `valid: true`:
  - R2: shortened cycle stage labels, timeline era labels, compare verdict, cells details (inspector, certifier),
    sequence actor label, zones link labels — all exceeded the shipped example's magnitude and wrapped/ellipsized.
  - R3: dropped zones link labels entirely (auto-router placed the midpoint label on an adjacent node); the caption
    carries the borrow-wire meaning.

## Quality gate

Pre-emit critique: **P5 H5 E4 S5 R4 V4** (all ≥3, no revision pass required).
E4: two auto-layout niggles remain with in-spec content — the flow slide's "one call" step label sits close to the
target node border, and the zones borrow wire dashes pass under the T-Minus node. R4: cells cards render with airy
bottoms at 8 items (template geometry).

Honest-copy sweep: every figure traces — 65 worlds (user's brief), Jul 15 (borrow-a-part.md), Jul 18 + 529px/375px
(design-audit-pilot RUN-LOG), three pilot worlds (borrow-a-part.md), eight terms (8 cells), six axes
(quality-gates.md), max 3 rounds (compose.md). No synthetic figures; notice states "sourced from repo docs and pilot
run logs, 2026-07". Template-leak check: all editorial words on all ten slides are authored in this fill; remaining
strings are chrome (counter, derived kickers, home/end, LIVE badge, `>>` verdict prefix, `[nn]` step numerals).

## Template-work observations (reported, not patched)

- **Descriptor caps vs rendered budget (dgm-circuit):** several slots validate far above what the render shows without
  ellipsis/overlap — cells `detail` (cap 160, truncates ~50 chars), timeline era `label` (truncates ~14), compare
  `verdict` (cap 160, truncates ~110), cycle stage `label` (overlaps its detail when it wraps past one line). So
  `validate_fill` passes content the template then ellipsizes. Worth tightening the descriptor caps or the render
  budgets so the contract and the pixels agree.
- **Zones auto-router:** a cross-zone link's midpoint label (and its dashes) can land on an unrelated node that sits
  between the endpoints.

## Re-verification pass — 2026-07-19 (second session)

Picked up the untracked scaffold from the first session, re-verified from source rather than trusting the prior
artifacts (repo convention: don't trust stale `dist/`/PNGs).

- **Selection divergence (honest note):** a fresh `compose_slide_deck` this session — with a richer `businessIntent`
  (an internal-tooling / walkthrough phrasing) and `audience [technical, mixed]` — scored **`dgm-sketchnote` = 7**
  (audienceOverlap 4 + intentMatch 1 "walkthrough" + corporateFit 2), a clear winner over `dgm-circuit` (6) and
  `tminus` (6). The first session's context had zero intent overlap → the 3-way tie at 5. Both selections are
  legitimate outputs of the same deterministic scorer on slightly different intent phrasings; the two templates share
  the **exact same DGM tour fill contract**, so the shipped fill renders unchanged through either. Kept the circuit
  build (complete + wired); a swap to the sketchnote skin is a one-line template change in the page wrapper.
- **Verification (this session):** `corepack pnpm typecheck` — pass (all projects). `FILL_SCHEMA.parse` — succeeds at
  import. `validateFillTool` domain path (in-process, real object) — `valid: true`, 0 findings. Fresh
  `pnpm --filter gallery build` — clean. Re-shot `slide-01..10.png` from the fresh build via `shoot.mjs`.
- **Gates (this session):** content-fit checklist — pass (no template leak, no overflow/orphans, numbers agree: 65 on
  slides 1/5/9/10, Jul 15/18 + 529px/375px consistent, provenance in hero + footer). Pre-emit critique:
  **P5 H5 E4 S5 R5 V4** (all ≥3). E4 unchanged: flow-slide auto-layout loop-back routing is slightly sprawling but
  in-spec and legible — template craft, not content.
