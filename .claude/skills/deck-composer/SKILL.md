---
name: deck-composer
description: Use when the user wants to turn source content (docs, notes, URLs, briefs) into a finished slide deck in this repo — orchestrates the enterprise-design MCP server (compose_slide_deck, validate_fill) from intake through a rendered /demo route. Triggers on "create/make/build a slide deck / presentation / slide pack from …".
---

# Deck Composer

Turn a user's source content into a finished, rendered slide deck. **Division of labor is the whole design:** this skill (you, the LLM) carries the judgment — content selection, narrative flow, slot authoring. The enterprise-design MCP server carries the craft — template selection, fill skeleton, validation. You never write CSS, layout, motion, or geometry; a deck is one world-template filled with content, and the template guarantees the design quality.

**Hard boundaries (read first):**
- One `compose_slide_deck` call per deck. Never mix slide UIs from different worlds — per-slide freedom lives INSIDE the template (which slide kinds, how many repeats, what order).
- Never edit template TSX/CSS to fix a deck. A design flaw found during a run is template/tooling work — report it, don't patch around it.
- Never exceed a slot limit "by a little", never fabricate data silently (the notice slot states provenance), never invent geometry (fills are content-only).
- The output is a **demo route**, not a catalogue template: no experience manifest, no live.ts entry, no approval flag.

## Phase 0 — Preflight

Confirm the MCP tools `compose_slide_deck` and `validate_fill` are available in this session. If not connected, tell the user to run (from the repo root) and restart the session:

```
claude mcp add enterprise-design -- corepack pnpm --filter mcp-server start
```

Scripted fallback (CI, or a session without the MCP attached): call the same domain functions via a tsx script following `apps/mcp-server/src/sample-outcome.ts` — identical inputs/outputs, still the real tool code paths.

**Exit:** tools reachable (or fallback chosen and stated).

## Phase 1 — Intake

1. **Source context.** Ask the user for their clean source content: file paths, pasted text, or already-distilled URL extracts. If they hand you raw URLs, extract the substance first and show them what you captured. If the source is huge, distill a working summary but keep the original for slot-level facts.
2. **Standard question set** — one AskUserQuestion batch. Skip any the brief already answers; record every answer (asked or inferred) in the run log:
   - **Content fidelity:** retain as much of the original as possible, or make it concise?
   - **Audience:** executives / engineers / mixed / general?
   - **Technical depth:** how deep into internals may the deck go?
   - **Timing/length:** how long is the talk (→ target slide count)?
   - **Style:** art-directed, conventional (PowerPoint-familiar), or no preference?

**Exit:** source captured + all five answers recorded.

## Phase 2 — Compose

Build the `SlideDeckContext` from the answers (surface `slide-deck`, audience list, businessIntent list, corporateSuitability, motionPreference, styleHint only if the user chose a style) and distill the source into a one-paragraph `contentBrief`. Call `compose_slide_deck` once.

Report to the user: selected template, its style/mood, and the rationale. **Honesty rule:** if the rationale shows a weak fit (no real intent overlap, score carried by generic keywords), say so plainly, name the closest-fitting world that is NOT yet templatized, and let the user decide (proceed with the best available, or stop). Never force a bad fit silently.

**Exit:** template selected and user informed (with fit assessment).

## Phase 3 — Narrative map

Break the source into beats and map them onto the template's slide kinds, within each kind's `repeats` bounds from the fillSkeleton. Apply the fidelity answer here: **retain** → use repeatable kinds up to their descriptor max so more source survives; **condense** → the fewest beats that keep the arc. Order beats for the template's narrative arc, not the source's section order.

Present the outline before writing any slot — one line per slide: `slide N — <kind> — <working title> — <source sections consumed>` — plus a kept/cut list when condensing. If the user is present, get their confirmation; in an autonomous run, record the outline in the run log and proceed.

**Exit:** confirmed (or logged) outline.

## Phase 4 — Fill authoring

Write every slot from the source, following `references/fill-authoring.md` (read it before the first slot). The skeleton's per-slot `spec`, `guidance`, and `example` are your writing brief — the example shows the register and magnitude that the template was designed around.

**Exit:** a complete fill object, content-only, every required slot filled.

## Phase 5 — Validate loop

Call `validate_fill`. Fix findings **content-side only** (tighten copy, drop an item, correct a count) and re-validate. If three rounds fail, stop and show the user the findings verbatim — don't thrash.

**Exit:** `valid: true` (save the result alongside the run's evidence).

## Phase 6 — Ship & verify

Follow `references/scaffold-and-verify.md`: scaffold `experiences/slide-decks/<slug>/fill.ts` + thin wrapper page, register `/demo/<slug>` in the gallery, typecheck + build, screenshot every slide, run the content-fit checklist, fix content findings via Phase 4/5.

**Exit:** report to the user — the route URL, screenshot locations, and the content-fit result. The deck is done when the checklist is clean.
