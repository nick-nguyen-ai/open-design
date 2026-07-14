# Deck-Composer Skill + OpenWiki Live Test — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the deck-composer orchestrator skill and prove it live: an OpenWiki intro deck at the Fable bar (content + design), iterating skill and MCP until it holds (spec: `docs/superpowers/specs/2026-07-14-deck-composer-skill-design.md`).

**Architecture:** Skill = judgment (intake, narrative mapping, slot authoring, verify loop) as prose workflow in `.claude/skills/deck-composer/`. MCP = craft (selection, skeleton, validation), extended with a third world-template — **The T-Minus** (`deck-product-launch`) — so product-intro briefs have a true home. Live run follows the skill verbatim and produces `/demo/openwiki`.

**Tech Stack:** unchanged (React 19 strict TS ESM, Zod v4, compiled-JSON registry, stdio MCP, vitest/Playwright, `corepack pnpm`).

**Ledger:** `.superpowers/sdd/progress.md` — plan Tasks 1–3 = ledger T31–T33.

## Global Constraints

- Everything inside `d:\Project\design-mcp\design-mcp-fable`; branch `slice-1-landing-mcp`; `corepack pnpm`; commit trailer `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`; no double quotes in commit messages.
- MCP posture unchanged: read-only, deterministic, no LLM, SDK isolated to server.ts/index.ts.
- Behaviour-preserving templatization: the shipped deck-product-launch world's existing unit + e2e tests pass UNCHANGED (parity oracle). Visual output of the shipped instance must not change.
- **Selection stability:** after adding the T-Minus descriptor, the committed sample chain must still select `deck-cloud-migration` for the payments-retry brief (`corepack pnpm --filter mcp-server sample` 7/7 PASS) and the demo cases must still select their templates (`demo` PASS).
- Content-only fills: no geometry slots; anomaly slot honest; notice slot required.
- Gates per task: `corepack pnpm typecheck` · `lint` · `test` · `--filter gallery build` · `--filter gallery e2e` exit 0; MCP tasks also `demo` + `sample` PASS.

---

### Task 1 (ledger T31): The deck-composer skill

**Files:**
- Create: `.claude/skills/deck-composer/SKILL.md`
- Create: `.claude/skills/deck-composer/references/fill-authoring.md`
- Create: `.claude/skills/deck-composer/references/scaffold-and-verify.md`

**Content requirements (controller-authored; spec §Skill anatomy is the source of truth):**
- SKILL.md frontmatter: `name: deck-composer`; description triggers on "create/make a slide deck/presentation from <content>" in this repo.
- Phases 0–6 exactly as spec'd, each with: what to do, what to show the user, exit condition. Phase 1 intake question set verbatim: fidelity (retain vs condense), audience, technical depth, timing/length, style hint — one AskUserQuestion batch, skip pre-answered ones.
- fill-authoring.md: skeleton→slot discipline (limits are hard; guidance/example anchor tone), fidelity application rules (retain → repeatable kinds to descriptor max; condense → fewest beats that keep the arc), anomaly honesty rule, notice provenance rule, no-geometry rule, validate-loop etiquette (≤3 failed rounds then stop).
- scaffold-and-verify.md: the exact wrapper-page pattern from `experiences/slide-decks/sample-payments-retry/SamplePage.tsx` (fill.ts + thin wrapper + route in `apps/gallery/src/App.tsx`), build + screenshot commands (`shoot.mjs` pattern with the resolution anchored at apps/gallery), and the content-fit checklist (per-slide: overflow/truncation, orphan words in display type, tone vs audience answer, arc order, data provenance visible).

**Steps:**
- [ ] Write the three files (controller does this inline — prose/judgment work, no subagent).
- [ ] Self-check: every MCP tool name, file path, and command in the skill exists in the repo today (no aspirational references).
- [ ] Commit (`T31: deck-composer orchestrator skill` + trailer).

### Task 2 (ledger T32): The T-Minus templatized (deck-product-launch)

Mirror T27/T28 extraction pattern in `experiences/slide-decks/deck-product-launch/`:

**Files:**
- Create: `TMinusTemplate.tsx`, `tminus-fill.ts` (Zod fill + slot specs), `deck-product-launch.worldtemplate.manifest.ts`
- Modify: `content.ts` → exports the shipped `TMinusFill` instance; the world's Page component → thin wrapper rendering `TMinusTemplate` with that fill.
- Modify: `packages/registry/src/catalogue.test.ts` (world-template count 2→3, refs resolve), `apps/mcp-server/src/demo-client.ts` (add a product-intro compose case expecting `deck-product-launch`).

**Interfaces:**
- `TMinusFill` — extraction-derived: deck meta, countdown/launch-window framing slots, feature/capability items, rollout or readiness rows, the anomaly slot carrying the shipped verbatim string `SECURITY REVIEW PENDING — BLOCKS T-7` as its instance value (fill slot itself generic: one flagged blocker/risk, exactly-one craft rule), notice slot. Limits from shipped values + ~30% headroom.
- Descriptor: `style: 'art-directed'`, audiences and businessIntents chosen so a product-introduction brief (keywords: launch, introduce, announce, release, product) outscores Quarter and Cutover — AND the payments-retry migration brief still selects Cutover (verify with `sample`).
- Lockstep guard tests (descriptor slots ↔ Zod fill shape) like Quarter/Cutover.
- Parity oracle: the existing batch-2 unit test file and e2e spec covering `deck-product-launch` (locate via `grep -r TMinus apps/gallery/src experiences`) pass UNCHANGED.

**Steps:** extraction table in task report → fill schema + descriptor → refactor (parity tests unchanged, run to prove) → manifest + registry/demo updates → gates incl. `demo` + `sample` PASS → commit (`T32: The T-Minus templatized; third world-template` + trailer).

### Task 3 (ledger T33): OpenWiki live run (controller-driven loop)

1. Source context: OpenWiki blog + README extractions (already gathered; save to `docs/superpowers/specs/openwiki-sample/source-context.md`). Intake answers (user absent — controller records them in the run log): fidelity = condense (blog+README → intro deck), audience = engineering + executive (dev-tool adoption pitch reaches both), technical depth = medium-high, timing ≈ 10 slides, style = art-directed (Fable showcase).
2. Follow SKILL.md verbatim via the scripted MCP path (`sample-outcome.ts` pattern → new `openwiki-outcome` script or extended sample script): `compose_slide_deck` → expect `deck-product-launch`; save raw outputs to `docs/superpowers/specs/openwiki-sample/mcp-outcome.json`.
3. Narrative map (record in run log) → author `experiences/slide-decks/sample-openwiki/fill.ts` (content only) → `validate_fill` valid:true (save result) → thin wrapper + `/demo/openwiki` route.
4. Build, screenshot every slide → `docs/superpowers/specs/openwiki-sample/slide-NN.png`; controller hostile review ≥2 passes (content + design). Design findings → template/skill side; content findings → fill. Loop.
5. Exit at the bar; ledger `=== GOAL MET ===` with reproducible chain; commit (`T33: OpenWiki deck via deck-composer skill at template quality` + trailer). Anything learned about the skill's wording → fold back into SKILL.md in the same commit (that IS the skill iteration).

## Self-Review
Spec coverage: skill anatomy → T1; MCP revision for product-intro fit → T2; live test + iteration loop → T3 ✓. No placeholders (T-Minus slot specifics are extraction outputs by design, like T27/T28) ✓. Type names consistent (TMinusFill/TMinusTemplate/descriptor pattern) ✓. Selection-stability constraint carried into T2 interfaces and Global Constraints ✓.
