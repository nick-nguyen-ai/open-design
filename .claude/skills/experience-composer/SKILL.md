---
name: experience-composer
description: Use when the user wants to turn source content (docs, notes, URLs, briefs) into a finished, rendered experience in this repo — a slide deck, a dashboard, a project page, a personal page, or a technical explainer. Orchestrates the enterprise-design MCP server (compose_slide_deck / compose_dashboard / compose_project_page / compose_personal_page / compose_explainer, plus validate_fill) from intake through a rendered /demo route. Triggers on "create/make/build a slide deck / presentation / dashboard / project page / profile page / explainer / diagram from …".
---

# Experience Composer

Turn a user's source content into a finished, rendered experience — on any of five surfaces (slide deck, dashboard, project page, personal page, technical explainer). **Division of labor is the whole design:** this skill (you, the LLM) carries the judgment — content selection, narrative/section flow, slot authoring. The enterprise-design MCP server carries the craft — template selection, fill skeleton, validation. You never write CSS, layout, motion, or geometry; an experience is one world-template filled with content, and the template guarantees the design quality.

**Hard boundaries (read first):**
- One compose call per experience — pick the tool by surface (Phase 2). Never mix UIs from different worlds; per-section/per-slide freedom lives INSIDE the template (which kinds, how many repeats, what order — within the skeleton's bounds).
- Never edit template TSX/CSS to fix an experience. A design flaw found during a run is template/tooling work — report it, don't patch around it.
- Never exceed a slot limit "by a little", never fabricate data silently (the notice slot states provenance), never invent geometry (fills are content-only).
- **Fixed-topology honesty (explainers especially).** Some templates pin a node/edge structure and the fill only relabels it (`drawing-office`: a fixed drawing; `ledger`: a pinned 4-stage pipeline). If the source system does NOT map onto that fixed structure, say so and name the closest-fitting world — a different architecture needs a different template. Never force-fit a system into a topology it doesn't have.
- **Personal pages: facts only.** Never invent biography. Every real-person fact must come from the provided source; if the source is thin, keep the page thin — do not pad with plausible-sounding life details.
- The output is a **demo route**, not a catalogue template: no experience manifest, no live.ts entry, no approval flag.

## Phase 0 — Preflight

Confirm the MCP compose tools and `validate_fill` are available in this session. If not connected, tell the user to run (from the repo root) and restart the session:

```
claude mcp add enterprise-design -- corepack pnpm --filter mcp-server start
```

Scripted fallback (CI, or a session without the MCP attached): call the same domain functions via a tsx script following `apps/mcp-server/src/sample-outcome.ts` — identical inputs/outputs, still the real tool code paths. The certifier (`corepack pnpm --filter @enterprise-design/registry certify`) and the canonical-brief matrix (`apps/mcp-server/src/canonical-briefs.ts`) are the outcome scripts to reference when you need a reproducible, MCP-less path.

**Exit:** tools reachable (or fallback chosen and stated).

## Phase 1 — Intake

1. **Source context.** Ask the user for their clean source content: file paths, pasted text, or already-distilled URL extracts. If they hand you raw URLs, extract the substance first and show them what you captured. If the source is huge, distill a working summary but keep the original for slot-level facts.
2. **Standard question set** — one AskUserQuestion batch. Skip any the brief already answers; record every answer (asked or inferred) in the run log:
   - **Content fidelity:** retain as much of the original as possible, or make it concise?
   - **Audience:** executives / engineers / mixed / general?
   - **Technical depth:** how deep into internals may the experience go?
   - **Timing/length:** how long is the talk / how much does the reader want to take in (→ target slide count or section count)?
   - **Style:** art-directed, conventional (PowerPoint-familiar), or no preference?
   - **Surface — ASK ONLY when it is not already given** (the user didn't name a surface and the brief doesn't fix one): *"Is this a document to present (a slide deck) or a destination to visit (a page or dashboard)?"* Use the answer plus the source shape to choose the surface: a talk → slide-deck; a live monitoring view → dashboard; a story about one piece of work → project-page; a page about a person → personal-page; one central diagram of a system/concept → technical-explainer.

**Exit:** source captured + all answers recorded + surface fixed.

## Phase 2 — Compose

Build the surface context from the answers (the correct `surface` literal, audience list, businessIntent list, corporateSuitability, motionPreference, styleHint only if the user chose a style) and distill the source into a one-paragraph `contentBrief`. **Call the one compose tool that matches the surface, once:**

| Surface | Tool | Skeleton is | Phase 3 map |
| --- | --- | --- | --- |
| slide-deck | `compose_slide_deck` | slide kinds (repeatable) | narrative map |
| dashboard | `compose_dashboard` | page regions (KPI row, panels, status/risk) | section map |
| project-page | `compose_project_page` | scroll sections (context → approach → work → outcomes → next) | section map |
| personal-page | `compose_personal_page` | scroll sections (who → what → work → contact) | section map |
| technical-explainer | `compose_explainer` | one drawing + legend/annotation sections | section map |

Every tool returns the same shape: `worldTemplateId`, `experienceId`, a rationale, scoring evidence, and `fillSkeleton.sections` (each section/kind carries its slots' `spec` + `guidance` + `example`).

Report to the user: selected template, its style/mood, and the rationale. **Honesty rule:** if the rationale shows a weak fit (no real intent overlap, score carried by generic keywords), say so plainly, name the closest-fitting world that is NOT yet templatized, and let the user decide (proceed with the best available, or stop). Never force a bad fit silently. **For fixed-topology surfaces** (explainer `drawing-office`, project-page `ledger`) this check is stricter: verify the source's structure actually maps onto the template's pinned nodes/stages before proceeding — if it doesn't, that's a wrong-template signal, not something to solve in the fill.

**Exit:** template selected and user informed (with fit assessment).

## Phase 3 — Narrative map (decks) / Section map (single-page)

Break the source into beats/facts and map them onto the skeleton's sections, within each section's `repeats`/`minItems`/`maxItems` bounds from the fillSkeleton. Apply the fidelity answer here: **retain** → use repeatable kinds/sections up to their descriptor max so more source survives; **condense** → the fewest beats that keep the arc.

- **Slide decks → narrative map.** Order beats for the template's narrative arc, not the source's section order. Present one line per slide: `slide N — <kind> — <working title> — <source sections consumed>`, plus a kept/cut list when condensing.
- **Single-page surfaces (dashboard / project-page / personal-page / explainer) → section map.** Map which section carries which source facts; **every section earns its place** — a section with no real source fact behind it is a section to cut, not to pad. Present one line per section: `section — <name> — <source facts it carries>`, plus a kept/cut list. For **fixed-slot topologies** (drawing-office nodes/edges, ledger stages), the map is a matching exercise: each pinned node/stage must be claimed by a real part of the source system; if a pinned slot has nothing to hold, revisit the template choice (Phase 2), don't invent filler.

Present the outline before writing any slot. If the user is present, get their confirmation; in an autonomous run, record the outline in the run log and proceed.

**Exit:** confirmed (or logged) outline.

## Phase 4 — Fill authoring

Write every slot from the source, following `references/fill-authoring.md` (read it before the first slot). The skeleton's per-slot `spec`, `guidance`, and `example` are your writing brief — the example shows the register and magnitude that the template was designed around.

**Exit:** a complete fill object, content-only, every required slot filled.

## Phase 5 — Validate loop

Call `validate_fill`. Fix findings **content-side only** (tighten copy, drop an item, correct a count) and re-validate. If three rounds fail, stop and show the user the findings verbatim — don't thrash.

**Exit:** `valid: true` (save the result alongside the run's evidence).

## Phase 6 — Ship & verify

Follow `references/scaffold-and-verify.md`: scaffold the fill + a thin wrapper page, register the `/demo/<slug>` route in the gallery, typecheck + build, screenshot (every slide for decks; one viewport + one full-page for single-page surfaces), run the content-fit checklist, fix content findings via Phase 4/5.

**Exit:** report to the user — the route URL, screenshot locations, and the content-fit result. The experience is done when the checklist is clean.
