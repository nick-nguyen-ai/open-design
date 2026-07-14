# Deck-Composer Orchestrator Skill — Design

**Date:** 2026-07-14 · **Status:** approved direction (user picked Approach 1 during brainstorm, then directed implementation + live test)

## Goal

A project skill that turns a user's source content into a finished, rendered slide deck by orchestrating the enterprise-design MCP server: the skill carries the judgment (content, narrative flow, slot authoring); the MCP carries the craft (template selection, fill skeleton, validation). Proven by a live test: an intro deck for LangChain OpenWiki at the Fable bar for both content and design, iterating skill and MCP until it holds.

**Exit criteria (goal):** (1) the user can view the OpenWiki slide pack at a demo route; (2) the controller is satisfied after hostile review that content AND design are at the bar ("people know this was made by Fable"). No manual design edits between MCP-validated fill and rendered output.

## Decisions locked during brainstorm (user-approved)

1. **Granularity:** one world-template per deck (`compose_slide_deck` once); the skill's per-step work is narrative — mapping source beats to the template's slide kinds, choosing repeats and order within descriptor bounds. No per-slide UI mixing across worlds.
2. **Location/consumer:** project skill at `design-mcp-fable/.claude/skills/deck-composer/`, auto-discovered by Claude Code sessions in this repo. Liftable into a plugin later, unchanged.
3. **Pipeline end:** a rendered demo route. One run delivers: validated fill + scaffolded route (`fill.ts` + thin wrapper page, `sample-payments-retry` pattern) + build + per-slide screenshots + one content-fit sanity pass (overflow, tone, narrative order). Not a catalogue template: no experience manifest, no approval flag.
4. **Content mode:** the user prepares a clean source context (files, pastes, URLs already distilled to text). The skill then asks a **standard intake question set**: content fidelity (retain as much as possible vs make concise), audience, technical depth, timing/length, style preference. Real data preferred; gaps filled with clearly-marked synthetic data (templates' notice slot covers this).

## Skill anatomy (Approach 1 — skill only, no new MCP tool *types*)

```
.claude/skills/deck-composer/
  SKILL.md                    # the phased workflow (process; ~1 page + phase details)
  references/
    fill-authoring.md         # how to write slots from a fillSkeleton: fidelity rules,
                              # limits discipline, anomaly-slot honesty, notice slot, no geometry
    scaffold-and-verify.md    # wrapper-page template, route registration, build,
                              # screenshot loop, content-fit checklist
```

### Workflow phases (SKILL.md core)

- **Phase 0 — Preflight.** Confirm the enterprise-design MCP tools are available (`compose_slide_deck`, `validate_fill`). If not connected, give the `claude mcp add` command and stop. Fallback for scripted/CI use: invoke the same domain functions via a tsx script (the `sample-outcome.ts` pattern).
- **Phase 1 — Intake.** Collect the clean source context. Ask the standard question set (one AskUserQuestion batch): fidelity retain-vs-condense, audience, technical depth, timing (talk length → target slide count), style hint (art-directed / conventional / no preference). When the user has pre-answered any of these in the brief, don't re-ask.
- **Phase 2 — Compose.** Build the `SlideDeckContext` from the answers, distill the source into a `contentBrief`, call `compose_slide_deck` once. Report the selected template and rationale to the user. If the rationale shows a weak fit (score dominated by generic terms, no intent overlap), say so honestly and name the closest-fitting non-templatized world — that is MCP-revision signal, not something to paper over.
- **Phase 3 — Narrative map.** Break the source into beats; map beats → slide kinds within the descriptor's `repeats` bounds; apply the fidelity answer (retain → use repeatable kinds up to max; condense → fewer beats, tighter slots); order for the template's arc. Present the outline (slide → kind → working title → source sections consumed → kept/cut list when condensing) for user confirmation when the user is present; in autonomous runs, record it in the run log instead.
- **Phase 4 — Fill authoring.** Write every slot from the source per the skeleton's spec/guidance/example. Hard rules: never exceed limits by "just a little"; the anomaly slot must be an honest tension from the source (or clearly synthetic); the notice slot states data provenance; zero geometry.
- **Phase 5 — Validate loop.** `validate_fill` until `valid:true`. Findings are fixed content-side only. Cap at 3 failed rounds, then surface to the user with the findings verbatim.
- **Phase 6 — Ship & verify.** Scaffold `experiences/slide-decks/<slug>/fill.ts` + thin wrapper page; register `/demo/<slug>` route; typecheck + build; screenshot every slide (playwright, `shoot.mjs` pattern); run the content-fit checklist; report the route URL + screenshot paths.

### Boundaries and error handling

- The skill never edits template CSS/TSX to fix a deck. Design findings route to the template/tooling (repo work, separate from a deck run).
- Weak template match: state it, offer the closest available template or stop — never force a bad fit silently.
- Oversized source: distill to a working summary first, keep the original for slot-level facts.
- Build/screenshot failures: standard gates; fix the scaffold, not the fill, unless validation was somehow bypassed.

## Live test plan (this goal)

1. Build the skill (above).
2. Run it on the OpenWiki sources. Expected first-loop finding: neither Quarter (QBR) nor Cutover (migration) fits a product-intro brief — the MCP-revision step is then to **templatize `deck-product-launch` (The T-Minus)**, the natural world for "Introducing X", following the T27/T28 extraction pattern (TMinusTemplate + tminus-fill + worldtemplate manifest + parity oracles unchanged; registry 2→3; selection keywords must let a product-intro brief win).
3. Re-run compose → expect `deck-product-launch`; author the OpenWiki fill; validate; ship `/demo/openwiki`.
4. Controller hostile review (≥2 passes) on content + design; template-side or skill-side fixes only; loop until the bar holds; record `=== GOAL MET ===` in the ledger with the reproducible chain.

## Testing

- Skill: proven by the live run (skills are prose; the run is the test). The scaffold reference's wrapper snippet must be the same code the run actually ships.
- T-Minus templatization: existing batch-2 unit + e2e tests pass UNCHANGED (parity oracles); lockstep descriptor↔Zod guard tests added like Quarter/Cutover; catalogue counts updated; `--filter mcp-server demo` + `sample` stay green.
- Deck run: `validate_fill` valid:true (saved evidence), gallery build green, screenshots committed under `docs/superpowers/specs/openwiki-sample/`.

## Self-review

Placeholders: none. Consistency: skill never edits templates (boundary) vs goal "revise the mcp" — reconciled: MCP/template revision happens as repo work triggered by run findings, not inside a deck run. Scope: one skill + one templatization + one deck run — single plan. Ambiguity: "satisfied with quality" pinned to the existing hostile-review bar (fable-25 reference worlds).
