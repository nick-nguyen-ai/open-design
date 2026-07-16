# Diagram Collections — goal run log

**Goal:** five diagram component collections (distinct visual languages) in the MCP
registry, proven by five skill+MCP-composed samples viewable on the web.
**Branch:** `diagram-collections` · **Date:** 2026-07-17 · **Spec:**
`docs/superpowers/specs/2026-07-16-diagram-collections-design.md` · **Plan:**
`docs/superpowers/plans/2026-07-16-diagram-collections.md`

## What shipped

- `packages/diagram-grammar` — 8 bounded Zod specs (flow, sequence, layers, zones,
  cycle, compare, cells, timeline), deterministic layout engines (serpentine flow),
  outline builders (a11y text mirrors). 44 tests.
- `packages/diagram-collections` — five families × 8 renderers = **40 components**
  (`comp.dgm.<family>.<kind>`): sketchnote (hand journal), blueprint (cyanotype
  drafting), circuit (neon terminal), isometric (2.5D studio), gazette (print
  atelier). Shared DiagramFrame/rough/iso/manifest-factory. 67 tests, axe-clean,
  three reduced-motion legs each, shape-not-colour node encoding.
- 5 grammar manifests (`sketchnote-journal`, `drafting-board`, `neon-circuit`,
  `isometric-studio`, `print-gazette`).
- 5 world-templates `dgm-<family>` / worlds `deck-dgm-<family>` — ten-slide grammar
  tours sharing one fill contract (`_dgm-kit/dgm-fill.ts`) and one mechanics shell;
  craft per family in each Template + CSS. Certifier 12/12 worlds, 0 findings.
- MCP surface: 40 components + 5 grammars + 5 templates discoverable/composable with
  **zero server code changes** (registry compilation only). Steering tests prove each
  family's intents select its template deterministically.

## The five sample runs (experience-composer skill, scripted MCP fallback)

Phase 0: no MCP server attached to the session → the skill's sanctioned scripted
fallback (`apps/mcp-server/src/dgm-samples-outcome.ts`, same real tool code paths via
stdio client). Phase 1 intake answers were fixed by the autonomous briefs (audience,
depth, style recorded in each spec below; fidelity: condense to the ten-slide tour;
length: 10 slides). Phase 3 narrative map is the tour contract itself (cover + one
slide per diagram kind + close) — the authoring freedom is which story each kind
tells. Phases 4–6 below.

| # | Route | Template | Brief (condensed) | Compose | validate_fill |
|---|---|---|---|---|---|
| 1 | `/demo/https-handshake` | dgm-sketchnote | teach how HTTPS works (TLS 1.3, certs, keys) | selected dgm-sketchnote | valid, round 1 |
| 2 | `/demo/payment-rails` | dgm-blueprint | specify card payment rails (auth/clear/settle) | selected dgm-blueprint | valid, round 1 |
| 3 | `/demo/million-users` | dgm-circuit | scale story to 1M users (LB/cache/replicas/queues) | selected dgm-circuit | valid, round 1 |
| 4 | `/demo/kubernetes-anatomy` | dgm-isometric | onboard via k8s anatomy dioramas | selected dgm-isometric | valid, round 1 |
| 5 | `/demo/caching-field-guide` | dgm-gazette | field guide to caching trade-offs | selected dgm-gazette | valid, round 1 |

Raw tool responses: `docs/superpowers/specs/diagram-collections/<slug>/mcp-outcome.json`
(25/25 outcome checks pass; rerun with `corepack pnpm --filter mcp-server dgmsamples`).
All five fills validated on the first round — no validate-loop fixes were needed
(bounds were authored against the shared contract).

## Evidence

- Screenshots: every slide of every world and every sample —
  `docs/superpowers/specs/diagram-collections/<world-or-demo>/slide-01..10.png`
  (100 shots, 1440×900, built app via `vite preview`). Rig: `shoot-worlds.mjs`.
- e2e: `apps/gallery/e2e/dgm-demos.spec.ts` — all five demos click through all ten
  slides via the real next button, family renderer + outline mirror asserted per
  diagram slide, console clean. Negative-tested once (mutated counter expectation,
  watched 5 failures, reverted).

## Craft iterations caught by driving the real thing

1. **Stage half-height** — `.X-main` grid gave the hidden h1 a stretched row; slides
   rendered in half the viewport. Fixed with `grid-template-rows: auto 1fr` ×5.
2. **Figures overflowing cards** — SVGs rendered at full card width; capped per deck
   at `max-block-size: min(52vh, 560px)` with preserved aspect.
3. **Flow strips** — 8-rank flows read as a thin strip; the flow layout now
   serpentines at 4 ranks per row.
4. **Cycle stage clipping** — stage plates 52→60 tall.
5. **Isometric label collisions** — layer labels moved beside the terraces; zone
   labels moved onto the floor in front of each parcel.

## Gates (final, in order)

| Gate | Result |
|---|---|
| `registry:build` | 45 components, 65 experiences, 15 grammars, 0 errors |
| `typecheck` | clean |
| `lint` | clean |
| `test` (full) | green in isolation; full-run Landing/LivePartIds timeouts are the documented slow-machine flake (GUIDANCE §7c) — both suites pass alone, repeatedly |
| `certify` | 12 templates, 0 findings |
| `gallery build` | clean |
| `gallery e2e` | **47/47 passed** (incl. 5 new dgm-demos specs; landing census amended 60→65) |

## Honest notes

- Plan tasks 11–15 (five templates) landed as one commit off the proven sketchnote
  pattern rather than five — deviation noted in the commit message.
- Sketchnote sequence slides can show minor label/arrow nuzzling on two-line message
  labels — legible, in-register for the hand-drawn style, left as-is.
- The `deck.world` slot in composed fills names the world family (e.g. "THE LIT
  BOARD") — chrome identity comes from the fill by design; composers may retitle.
- Docs-only commits (spec, plan) were made on local `main` before branching; they are
  also on this branch. Local `main` is 2 docs commits ahead of `origin/main`.
