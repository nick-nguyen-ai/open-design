# Batch-2 Slide-Deck Templates + MCP Quality Loop — Design

**Date:** 2026-07-14 · **Status:** approved lineup (user, this date) · **Branch:** `slice-1-landing-mcp`

## Goal (verbatim from the user)

Pursue until BOTH are met:

1. Complete 10 new slide-deck templates, quality confirmed similar to the existing 10 templates and fable-25.
2. Revise the MCP server and test it iteratively until a sample outcome generated *via the MCP* reaches the same quality level as the templates ("reverse engineering from the template to structure").

## Phase A — ten new deck templates

### Approved lineup

| # | Template (slug) | Audience | Style | Signature visuals |
|---|---|---|---|---|
| 1 | Project Kickoff & Plan (`deck-project-kickoff`) | Mixed | Art-directed world | Excalidraw-style plan sketch, milestone timeline, RACI grid |
| 2 | Research Discussion (`deck-research-discussion`) | Technical | Art-directed world | Margin-note annotations, hypothesis→method→findings flow, confidence-interval chart |
| 3 | Marketing Campaign Proposal (`deck-marketing-campaign`) | Non-technical | Art-directed world | Sketch funnel, interactive channel-mix chart, bold editorial type |
| 4 | Quarterly Business Review (`deck-quarterly-business-review`) | Executive | **PowerPoint-familiar** | Classic agenda/KPI/summary anatomy, interactive trend charts |
| 5 | Product Launch Plan (`deck-product-launch`) | Mixed | Art-directed world | Countdown timeline, launch-readiness checklist board |
| 6 | Team Retrospective (`deck-team-retrospective`) | Non-technical | Art-directed world | Whiteboard/excalidraw aesthetic — sticky notes, hand-drawn arrows |
| 7 | Sales / Client Pitch (`deck-sales-pitch`) | Non-technical | **PowerPoint-familiar** | Clean corporate pitch: problem→solution→proof→pricing |
| 8 | Budget & Resource Planning (`deck-budget-planning`) | Non-technical | **PowerPoint-familiar** | Waterfall chart, allocation tables, headcount plan |
| 9 | Cloud Migration Plan (`deck-cloud-migration`) | Technical | Art-directed world | Draw.io-style architecture diagrams (current→target), sequenced cutover flow |
| 10 | Analytics Deep-Dive (`deck-analytics-deep-dive`) | Technical | Art-directed world | Interactive charts as the hero — hover/focus exploration of one dataset |

### Definitions

- **Art-directed world:** same standard as batch 1 — one persistent conceit, experience-local CSS art layer (raw colours allowed there only, motion via `var(--dur-*)`/`var(--ease-*)`), one deliberate anomaly, corner-anchored mono chrome, staged builds, print + reduced-motion handling. Binding rules: `.superpowers/sdd/briefs/live-world-shared-rules.md`. Craft exemplars: `deck-technical-architecture-explanation` (Sectional pattern), `demo-langchain-deepagents` (The Window).
- **PowerPoint-familiar (3 decks: #4, #7, #8):** conventional slide anatomy a normal PowerPoint author would recognise — title bar, content zone, footer with page number/logo line, agenda slide, section dividers, bulleted content where natural. The craft is in flawless execution (typographic scale, grid alignment, considered charts, restrained palette), not novelty. Explicitly NOT a "world" conceit; motion minimal (level ≤1). This is the anti-avant-garde option for users who want a deck that looks like what people normally make — just perfect.
- **Excalidraw idiom:** hand-sketched look — wobbly strokes (SVG path jitter or `stroke-dasharray` texture), rounded imperfect boxes, handwritten-feel annotation font, sketch arrows.
- **Draw.io idiom:** precise boxes-and-connectors technical diagramming — orthogonal connectors, port dots, swimlanes, layer legends.
- **Interactive charts:** bespoke SVG with hover/focus states (tooltip readouts, series toggles, brushed ranges) where it serves the narrative; keyboard-accessible equivalents required; static fallback for print/reduced-motion.

### Constraints

- Everything inside `d:\Project\design-mcp\design-mcp-fable`. `corepack pnpm` only.
- Diagrams/charts are **bespoke per template** (local SVG/TSX in the experience folder). No new registry components in Phase A — the user explicitly deferred that ("build the templates directly, we will do the reverse engineering later").
- Each template: `content.ts` + page TSX + world CSS + `*.experience.manifest.ts` (approval state per batch-1 convention), route in the gallery, `_deck-kit` `useDeckNavigation` mechanics (←/→/Home/End, `?slide=` deep link, print one-per-page).
- Build process: SDD — opus implementer subagents from Fable-authored briefs; ≥2-pass hostile screenshot review per deck by Fable; fixes dispatched; gates (typecheck, lint, build, e2e where applicable) green before a deck counts as done.
- No overlap with batch-1 topics; each deck's world must be visually distinct from all 19 others (originality check in review).

### Phase-A exit criterion (goal condition 1)

All 10 shipped, gates green, and Fable's hostile review confirms each is at the batch-1 / fable-25 bar (recorded per deck in the SDD ledger with a quality note; manifests carry `approval.state: 'approved'` + qualityScore).

## Phase B — MCP quality loop (reverse engineering)

Starts after Phase A (the 20 templates are its raw material). Iterative loop:

1. **Extract:** derive parameterized structure from the shipped templates — what varies per instance (content slots, palette seeds, conceit parameters, slide-kind schedule) vs what is fixed craft (layout anatomy, motion choreography, chrome, diagram idiom).
2. **Encode:** extend the MCP server/registry so `compose_design` (or a successor tool) can select a world/template and emit output rich enough to produce a rendered deck at that craft level — the exact mechanism (template registry + fill kit vs code generation) is decided inside the loop, evidence-first, and recorded in the ledger.
3. **Test:** generate a sample deck end-to-end via the MCP (a fresh brief, not one of the 20), render it, screenshot it.
4. **Judge:** hostile review against the template bar. If below, diagnose the gap, revise the encoding, repeat.

### Phase-B exit criterion (goal condition 2)

A sample outcome generated through the MCP server that Fable's hostile review judges at the same quality level as the handcrafted templates, with the generation path reproducible (documented commands, no manual design edits between MCP output and rendered result).

Phase B gets its own detailed design + plan once Phase A ships (its shape depends on what extraction reveals); this spec fixes only its goal, loop, and exit criterion.

## Testing

- Phase A: per-deck gates + hostile screenshot passes (playwright-core scripts, built-app preview); whole-batch final review before declaring condition 1 met.
- Phase B: each loop iteration ends with a rendered sample + screenshot review; final acceptance run recorded (brief → MCP calls → files → screenshots).

## Out of scope

- Registered diagram/chart components in the shared packages (deferred to Phase B extraction).
- The remaining 30 dashboard/project/explainer worlds from earlier roadmaps.
- Merging `slice-1-landing-mcp` → main (separate user decision).
