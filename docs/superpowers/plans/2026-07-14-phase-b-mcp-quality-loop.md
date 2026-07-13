# Phase B — MCP Quality Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** An MCP-generated sample slide deck at the same quality level as the handcrafted templates, with a reproducible generation path and no manual design edits between MCP output and rendered result (goal condition 2; spec `docs/superpowers/specs/2026-07-14-batch2-decks-and-mcp-quality-design.md` §Phase B).

**Architecture:** Reverse-engineer shipped deck worlds into **parameterized world-templates**: a template = the world's full craft (layout anatomy, CSS art layer, motion, chrome, diagram idiom) refactored to consume a typed **fill** (content slots only). The registry compiles template descriptors (slot specs + guidance); the MCP server gains `compose_slide_deck` (deterministic template selection + fill skeleton) and `validate_fill`. Design quality then travels through the MCP because the template carries it; the consumer authors only content. Two pilot templates span the brief space: **The Quarter** (business/conventional) and **The Cutover** (technical/diagram).

**Tech Stack:** unchanged (React 19 strict TS ESM, Zod v4 contracts, compiled-JSON registry, stdio MCP server, vitest/Playwright, `corepack pnpm`).

**Ledger:** `.superpowers/sdd/progress.md` — plan Tasks 1–4 = ledger T27–T30.

## Global Constraints

- Everything inside `d:\Project\design-mcp\design-mcp-fable`; branch `slice-1-landing-mcp`; `corepack pnpm`; commits with the `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` trailer.
- MCP server posture unchanged: read-only, deterministic, no LLM sampling, no fs traversal beyond `packages/registry/generated`, tight advertised Zod schemas, structured contracts McpError, domain logic adapter-independent (no SDK import outside server.ts/index.ts).
- **Behaviour-preserving refactors:** templatizing a shipped world must keep its existing unit + e2e tests passing UNCHANGED (they are the parity oracle). Visual output of the shipped instance must not change.
- Template selection must be deterministic (scoring + stable tie-break, like `selectGrammar`).
- Fill validation enforces the craft constraints extraction reveals (slot char limits, item counts, required anomaly slot, required synthetic-notice slot) so a sloppy fill cannot silently degrade the design.
- Gates per task: `corepack pnpm typecheck` · `lint` · `test` · `--filter gallery build` · `--filter gallery e2e` all exit 0; mcp-server tasks also `corepack pnpm --filter mcp-server demo` PASS.

---

### Task 1 (ledger T27): World-template contracts + The Quarter templatized

**Files:**
- Create: `packages/contracts/src/world-template.ts` (+ test `world-template.test.ts`)
- Modify: `packages/contracts/src/index.ts` (exports)
- Create: `experiences/slide-decks/deck-quarterly-business-review/QuarterTemplate.tsx`, `quarter-fill.ts` (Zod fill schema + slot specs), `deck-quarterly-business-review.worldtemplate.manifest.ts`
- Modify: `experiences/slide-decks/deck-quarterly-business-review/{content.ts → exports a QuarterFill instance, QuarterPage.tsx → thin wrapper rendering QuarterTemplate with that fill}`

**Interfaces (produces):**
- `WorldTemplateDescriptor` (Zod, contracts): `{ schemaVersion:'1.0', id, experienceId, surface, style:'art-directed'|'conventional', mood, grammarId, audiences, businessIntents, componentsUsed, slideKinds: SlideKindSpec[], guidance: string[] }`.
- `SlideKindSpec`: `{ kind, purpose, repeats?: {min,max}, slots: SlotSpec[] }`; `SlotSpec`: `{ name, type:'text'|'longtext'|'number'|'metric'|'items'|'tableRows'|'nodes'|'edges', required, limits:{ maxChars?, minItems?, maxItems? }, guidance }`. Serializable to registry JSON (no functions).
- `experiences/.../quarter-fill.ts` exports `QuarterFill` (Zod) — the world-specific fill: deck meta (title, org, period, confidentiality line), agenda entries, exec summary sentences, 4 KPI slots (label/value/delta/target/status incl. exactly one flagged anomaly slot), trend + segment chart data, wins/losses, pipeline rows, risks, priorities, notice string. Limits derived from the shipped instance's actual magnitudes (extraction step).
- `QuarterTemplate({ fill }: { fill: QuarterFill })` — renders exactly what QuarterPage renders today.

**Steps:**
- [ ] **Step 1: Extraction.** Read the shipped Quarter files; write the parameterization table (slot name → today's value → limit) into the task report; encode it as `quarter-fill.ts` Zod schema + the descriptor's SlideKindSpec list (slot limits from real values + ~30% headroom; anomaly slot required; notice required).
- [ ] **Step 2: Contracts.** `world-template.ts` schemas + tests (valid descriptor parses; missing guidance/limits rejected; JSON-round-trip stable).
- [ ] **Step 3: Refactor.** Split QuarterPage → QuarterTemplate (consumes fill) + instance fill in content.ts + thin QuarterPage wrapper. NO visual/markup changes — `LiveWorldsDecksF.test.tsx` and `live-decks-f.spec.ts` must pass UNCHANGED (run to prove).
- [ ] **Step 4: Manifest.** `*.worldtemplate.manifest.ts` default-exports the descriptor (typed, validated by contracts schema in a test).
- [ ] **Step 5: Gates + commit** (`Phase B T27: world-template contracts; The Quarter templatized` + trailer).

### Task 2 (ledger T28): The Cutover templatized

**Files:** mirror Task 1 in `experiences/slide-decks/deck-cloud-migration/`: create `CutoverTemplate.tsx`, `cutover-fill.ts`, `deck-cloud-migration.worldtemplate.manifest.ts`; refactor `content.ts`/`CutoverPage.tsx` into fill + thin wrapper.

**Interfaces:** `CutoverFill` — deck meta (file-header title, rev), estate nodes (id, label, kind app|data|integration, zone, disposition rehost|refactor|replace|replatform|retire|stays, badges incl. exactly one stays-anomaly node), edges (from,to,label), waves, flow-diagram data for the cutover-night sequence, risk items, sync/rollback copy, notice. Node/edge counts bounded (extraction: current estate 7 nodes → limits e.g. 5–9 nodes, 4–10 edges) so layouts stay composed.
- Parity oracle: `LiveWorldsDecksE.test.tsx` + `live-decks-e.spec.ts` pass UNCHANGED.

**Steps:** extraction table → fill schema + descriptor → refactor (tests unchanged) → manifest → gates + commit (`Phase B T28: The Cutover templatized` + trailer).

### Task 3 (ledger T29): Registry compilation + MCP tools

**Files:**
- Modify: `packages/registry/src/discovery.ts` + compiler (new glob `*.worldtemplate.manifest.ts` → `packages/registry/generated/world-templates.json`), `packages/registry/src/catalogue.test.ts` (2 world-templates, refs resolve to real experiences/grammars/components)
- Create: `apps/mcp-server/src/tools/compose-slide-deck.ts`, `apps/mcp-server/src/tools/validate-fill.ts` (+ server registration, schemas in `apps/mcp-server/src/schemas.ts`, tests in `server.test.ts`, demo cases in `demo-client.ts`)
- Modify: `apps/mcp-server/src/registry-data.ts` (load world-templates.json)

**Interfaces:**
- `compose_slide_deck` input: `{ context: DesignContext-lite (surface fixed slide-deck, audience, businessIntent, corporateSuitability, motionPreference, styleHint?: 'art-directed'|'conventional'), contentBrief: string }`. Output: `{ worldTemplateId, rationale, evidence, fillSkeleton }` where fillSkeleton = descriptor's slideKinds with per-slot `{ spec, guidance, example }` (examples drawn from the descriptor, NOT invented) + the craft guarantees list. Selection scoring: audience overlap ×2 + intent keyword match + styleHint hard filter + corporate fit; deterministic tie-break by id.
- `validate_fill` input: `{ worldTemplateId, fill: unknown }` → `{ valid, findings[] }`: schema errors (slot path + limit violated + guidance echoed), plus craft rules: anomaly slot present exactly once; notice present; item counts within bounds. Structured errors per server convention (`UNKNOWN_TEMPLATE`, `INVALID_INPUT`).
- Demo client: compose for a technical brief → expect deck-cloud-migration; conventional business brief → deck-quarterly-business-review; validate the shipped Quarter instance fill → valid:true; tampered fill (anomaly removed, oversize headline) → valid:false with precise findings.

**Steps:** registry glob+compiler+tests → registry-data load → tool domain modules (TDD: failing server.test cases first) → server registration + schemas → demo cases → gates incl. `--filter mcp-server demo` PASS → commit (`Phase B T29: world-template registry + compose_slide_deck/validate_fill tools` + trailer).

### Task 4 (ledger T30): The sample outcome (controller-driven loop; subagent only for mechanical steps)

1. Fresh brief (NOT one of the 20 topics): *"Explain how our payments retry pipeline works and what changes in the Q3 migration — platform engineering audience."*
2. Run the real MCP demo path (script or demo-client case): `compose_slide_deck` → expect deck-cloud-migration template + fill skeleton; save the raw tool outputs to `docs/superpowers/specs/phase-b-sample/mcp-outcome.json` (committed evidence).
3. Author `experiences/slide-decks/sample-payments-retry/fill.ts` — CONTENT ONLY, conforming to `CutoverFill`; `validate_fill` must return valid:true (save result). Register a demo route `/demo/mcp-sample` (like `/demo/deepagents`, NOT a catalogue template) rendering `CutoverTemplate` with this fill.
4. Build, screenshot every slide (playwright script), controller hostile review against the template bar. Findings about DESIGN → fix in the TEMPLATE/tooling (never in the sample's rendered output by hand) and re-run from step 2 — that is the loop. Findings about content → revise fill, re-validate.
5. Exit when the controller review passes at the bar. Record in ledger: `=== GOAL CONDITION 2 MET ===` with the reproducible chain (brief → tool calls → fill → route → screenshots). Commit (`Phase B T30: MCP-generated sample deck at template quality` + trailer).

## Self-Review
- Spec §Phase B loop steps 1–4 map to T27/28 (extract), T29 (encode), T30 (test+judge, iterate) ✓. Exit criterion verbatim honoured (reproducible, no manual design edits) ✓. Read-only server posture kept (fill authored client-side; server only composes/validates) ✓. No placeholders; types named consistently (WorldTemplateDescriptor/SlideKindSpec/SlotSpec/QuarterFill/CutoverFill) ✓. Parity oracles named per refactor ✓.
