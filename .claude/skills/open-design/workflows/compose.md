# COMPOSE workflow — source content → finished rendered experience

Turn a user's source content into a finished, rendered experience — on any of five surfaces (slide deck, dashboard, project page, personal page, technical explainer). **Division of labor is the whole design:** this workflow (you, the LLM) carries the judgment — content selection, narrative/section flow, slot authoring. The enterprise-design MCP server carries the craft — template selection, fill skeleton, validation. You never write CSS, layout, motion, or geometry; an experience is one world-template filled with content, and the template guarantees the design quality.

**Hard boundaries (read first):**
- One compose call per experience — pick the tool by surface (Phase 2). Never mix UIs from different worlds; per-section/per-slide freedom lives INSIDE the template (which kinds, how many repeats, what order — within the skeleton's bounds).
- Never edit template TSX/CSS to fix an experience. A design flaw found during a run is template/tooling work — report it, don't patch around it.
- Never exceed a slot limit "by a little", never fabricate data silently (the notice slot states provenance), never invent geometry (fills are content-only).
- **Fixed-topology honesty (explainers especially).** Some templates pin a node/edge structure and the fill only relabels it (`drawing-office`: a fixed drawing; `ledger`: a pinned 4-stage pipeline). If the source system does NOT map onto that fixed structure, say so and name the closest-fitting world — a different architecture needs a different template. Never force-fit a system into a topology it doesn't have.
- **Personal pages: facts only.** Never invent biography. Every real-person fact must come from the provided source; if the source is thin, keep the page thin — do not pad with plausible-sounding life details.
- The output is a **demo route**, not a catalogue template: no experience manifest, no live.ts entry, no approval flag. Exception: an EXTERNAL target (output outside this repo) has no gallery to route into, so it ships as a port or a render bundle instead (Phase 6, "External target"); everything else on this list still binds.

## Phase 0 — Preflight

Confirm the MCP compose tools and `validate_fill` are available in this session. If not connected, tell the user to run (from the repo root) and restart the session:

```
claude mcp add enterprise-design -- corepack pnpm --filter mcp-server start
```

Scripted fallback (CI, or a session without the MCP attached): call the same domain functions via a tsx script following `apps/mcp-server/src/sample-outcome.ts` — identical inputs/outputs, still the real tool code paths. The certifier (`corepack pnpm --filter @enterprise-design/registry certify`) and the canonical-brief matrix (`apps/mcp-server/src/canonical-briefs.ts`) are the outcome scripts to reference when you need a reproducible, MCP-less path.

**Template fidelity.** Ask once (skip if already stated), default strict:
`templateFidelity` - strict: the compose response includes a `reference`
manifest and, for EXTERNAL targets (output outside this repo), the port
follows `references/porting.md`; free: contract-only, today's flow. Pass the
choice to every compose call. In-repo demo routes ignore the manifest - the
template code is already here; scaffold as before. (This is about template
CODE, not about how much of the source content survives - that is Phase 1's
Q2.)

**Exit:** tools reachable (or fallback chosen and stated) + `templateFidelity` fixed.

## Phase 1 — Intake (at most THREE questions)

1. **Source context.** Ask the user for their clean source content: file paths, pasted text, or already-distilled URL extracts. If they hand you raw URLs, extract the substance first and show them what you captured. If the source is huge, distill a working summary but keep the original for slot-level facts.
2. **The question batch** — ONE AskUserQuestion batch of AT MOST three questions. Skip any the brief already answers; infer the rest from the source and record every answer (asked or inferred) in the run log. There is NO style question — the Phase 2 candidate pick replaces it (the user chooses a look by choosing a world).
   - **Q1 — Audience + depth (one question):** who is this for, and how deep into internals may it go? (executives–outcomes / engineers–mechanisms / mixed–both / general–plain language)
   - **Q2 — Content fidelity + length (one question; unrelated to Phase 0's `templateFidelity`):** keep as much of the source as possible (**retain**), or cut to the arc (**condense**) — and roughly how long (minutes of talk / reading depth → slide or section count)?
   - **Q3 — Surface, ONLY if genuinely ambiguous** (the user didn't name one and the source doesn't fix one): *"Is this a document to present (a slide deck) or a destination to visit (a page or dashboard)?"* A talk → slide-deck; a live monitoring view → dashboard; a story about one piece of work → project-page; a page about a person → personal-page; one central diagram → technical-explainer. When the surface IS clear, use the third slot (if anything still blocks you) for the single most load-bearing unknown — or ask only two.

**Exit:** source captured + answers recorded + surface fixed.

## Phase 2 — Candidates, pick, compose

Build the surface context from the answers (the correct `surface` literal, audience list, businessIntent list, corporateSuitability, motionPreference — no styleHint unless the user volunteered a hard style constraint) and distill the source into a one-paragraph `contentBrief`. **Call the one compose tool that matches the surface, once (unpinned):**

| Surface | Tool | Skeleton is | Phase 3 map |
| --- | --- | --- | --- |
| slide-deck | `compose_slide_deck` | slide kinds (repeatable) | narrative map |
| dashboard | `compose_dashboard` | page regions (KPI row, panels, status/risk) | section map |
| project-page | `compose_project_page` | scroll sections (context → approach → work → outcomes → next) | section map |
| personal-page | `compose_personal_page` | scroll sections (who → what → work → contact) | section map |
| technical-explainer | `compose_explainer` | one drawing + legend/annotation sections | section map |

Every tool returns `worldTemplateId`, `experienceId`, a rationale, scoring evidence, **`alternatives` (the top-3 positive-score candidates, winner first)**, and the winner's `fillSkeleton`.

**Present the candidates.** When `alternatives` has more than one entry, put the choice to the user as one AskUserQuestion — one option per candidate (winner first, marked "(Recommended)"), each described from the data: display name (from the experience catalogue) + `style`/`mood`/`grammarId`, one line from its `guidance`, the `scoreBreakdown`, and the live preview URL `/live/<experienceId>` (every templatized world ships a full example there — that IS the preview; render nothing speculative). With exactly one candidate (most non-deck surfaces today), skip the question, state the fit, and proceed — degrade honestly, never pad the list.

**On the pick:** the winner → proceed with the skeleton already in hand. A non-winner → ONE follow-up call to the same tool with `pinTemplateId: <their pick>` to fetch that template's skeleton (an explicit pin never returns NO_TEMPLATE_FIT). Record pick + reason in the run log.

**"Can I mix them?"** One experience = one world-template — that invariant holds (never blend section UIs across worlds). The sanctioned mix: COMPOSE on the picked template, then BORROW a specific part's treatment from a non-picked candidate via its `data-part-id` (route the borrow workflow after this run ships). Special case — the five `deck-dgm-*` tour decks share ONE fill contract: switching among them later is a re-compose with a different `pinTemplateId` and the same fill, zero rewriting.

**Honesty rule (unchanged, applies to whichever candidate wins the pick):** if the rationale shows a weak fit (no real intent overlap, score carried by generic keywords), say so plainly, name the closest-fitting world that is NOT yet templatized, and let the user decide. Never force a bad fit silently. **For fixed-topology surfaces** (explainer `drawing-office`, project-page `ledger`) this check is stricter: verify the source's structure actually maps onto the template's pinned nodes/stages before proceeding — if it doesn't, that's a wrong-template signal, not something to solve in the fill.

**Exit:** template picked (by the user when there was a real choice) and fit assessment delivered.

## Phase 3 — Narrative map (decks) / Section map (single-page)

Break the source into beats/facts and map them onto the skeleton's sections, within each section's `repeats`/`minItems`/`maxItems` bounds from the fillSkeleton. Apply the Q2 CONTENT-fidelity answer here (not Phase 0's `templateFidelity`, which never affects this map): **retain** → use repeatable kinds/sections up to their descriptor max so more source survives; **condense** → the fewest beats that keep the arc.

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

**External target (client repo, strict):** there is no gallery to scaffold
into. Dispatch the porting subagent (`references/porting.md`) with the
`reference` manifest + validated fill; alternatively, when the client only
needs the artifact as-is, call `render_experience` with the winning
`worldTemplateId` (not `experienceId` - `render_experience` only accepts the
canonical template id) and the validated fill, and hand over the `entryUri`
bundle. Verify with screenshots of the ported result in the client's own
environment.

**Quality gate (before reporting done):** walk `DESIGN.md` Part 2 verbatim — the verify rig + findings table (Steps 2–3), contract checks, interaction smoke, then the content-fit read (Step 6, yours) and the honest-copy gate on the fill (scan every quantitative claim — each number must trace to the source or be covered by the synthetic-provenance notice; an invented "10× faster" is a blocking finding). Then dispatch the **screenshot judge** (Step 7, `references/screenshot-judge.md`) — a fresh-context subagent that sees only the screenshots and the rubric; its six-axis scores are the run's scores. Any axis < 3 or any critical/major judge finding → revise via Phase 4/5 and re-judge (two rounds is normal; a third means the template choice is wrong). The template guarantees the visual craft, but the fill can still ship slop copy or a bad content fit — Steps 6 and 8 are about YOUR half of the division of labor.

**Exit:** report to the user — the route URL, screenshot + findings.json locations, the content-fit result, and the JUDGE's critique scores. The experience is done when DESIGN.md's pass criteria are all met.
