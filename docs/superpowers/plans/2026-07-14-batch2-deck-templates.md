# Batch-2 Slide-Deck Templates (10 Worlds) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship ten new slide-deck template worlds (7 art-directed + 3 PowerPoint-familiar) at the batch-1 / fable-25 quality bar, fully registered (manifests, live routes, tests, screenshots), gates green.

**Architecture:** Each deck is a self-contained experience under `experiences/slide-decks/<id>/` — typed content pack + page TSX + experience-local CSS art layer — registered as a live world (`/live/<id>`) and an approved catalogue template. Deck mechanics reuse the established batch-1 pattern (keyboard nav, `?slide=` deep link, print CSS, reduced-motion parity). Bespoke diagrams/charts are local SVG/TSX in the experience folder — NOT new registry components (user-deferred).

**Tech Stack:** React 19 + TypeScript strict ESM, Tailwind v4 (experience-local CSS for the art layer), `@enterprise-design/motion` tokens, vitest + testing-library + axe, Playwright, `corepack pnpm`.

**Spec:** `docs/superpowers/specs/2026-07-14-batch2-decks-and-mcp-quality-design.md`
**Ledger:** `.superpowers/sdd/progress.md` (this plan's tasks are ledger T23–T26; append status lines there).

## Global Constraints

Copied from `.superpowers/sdd/briefs/live-world-shared-rules.md` (binding in full — implementers read that file first) and the spec:

- Everything inside `d:\Project\design-mcp\design-mcp-fable` ONLY. Branch `slice-1-landing-mcp`. Package manager `corepack pnpm` (bare `pnpm` is admin-blocked). Registry rebuild: `corepack pnpm registry:build`.
- The bar: https://fable-25.netlify.app/ as matched by the 20 shipped worlds. **A grid of cards is the failure state. A reskin of an existing world is the failure state.** Every world: ONE commanding bespoke visual; corner-anchored mono microtype chrome; narrative thesis in large editorial display type; deep single-mood atmosphere; data that feels live/computed; ONE deliberate anomaly.
- Art-direction licence: raw colour values ONLY in the experience's own CSS file. Easings/durations ONLY from motion tokens (`var(--dur-feedback|state|structure|narrative)`, `var(--ease-settle|lift|trace|shift)`); ESLint bans literal `cubic-bezier(`.
- No new runtime deps EXCEPT `@fontsource/*` OFL packages (subset weights actually used; record licence in report). Already available in `experiences/package.json`: `@fontsource-variable/fraunces`, `@fontsource-variable/inter`, `@fontsource/ibm-plex-mono`.
- Decks: 8–12 full-viewport slides; ←/→/Home/End + on-screen prev/next buttons; slide counter chrome; `?slide=` deep link; print stylesheet (one slide per page, dark drops to white); stepped reduced-motion variant; synthetic-data notice in chrome.
- Content packs: deterministic (`no Math.random` at render), realistic institutional magnitudes, credible synthetic names, no lorem, no real-institution claims.
- Accessibility: landmarks/headings; keyboard reachable; WCAG AA against actual backgrounds; every bespoke visual has an accessible textual mirror (table/list/outline); interactive charts keyboard-operable with visually-hidden data-table equivalents.
- Each deck's manifest must list `componentsUsed` with ≥1 REAL component id actually used on a slide (the only ids that exist: `comp.kpi-tile`, `comp.trend-chart`, `comp.category-bar-chart`, `comp.status-list`, `comp.flow-diagram`). `grammarId` and `signatureSequence` must exist in `packages/registry/generated/grammars.json` / `motion-sequences.json`.
- MANDATORY hostile self-critique loop per world: full-page screenshot → hostile-director critique → ≥5 concrete upgrades → implement → re-screenshot. **≥2 passes per world, critiques logged in the report.**
- Gates all exit 0 before a task is done: `corepack pnpm typecheck` · `corepack pnpm lint` · `corepack pnpm test` · `corepack pnpm --filter gallery build` · `corepack pnpm --filter gallery e2e`.
- Commits on `slice-1-landing-mcp` end with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- e2e serves the BUILT app (`vite preview`) — always rebuild gallery before re-screenshotting.

### Batch-wide originality matrix (binding)

No new world may reuse another world's core device (existing devices already taken: radial scope, drafting sheet, monumental board type, paper ledger, signal glass, clause paper, grid-paper plates, control matrix, route spine, phosphor bench, exhibition floor, letterpress poster, cyanotype section, ops manual, annual letter, bench journal, botanical bench, transit line, dawn confluence, reading room, nautical atlas, type specimen, playbill marquee, luminous context-window column).

---

## Registration pattern (identical mechanics referenced by every task)

Each deck registers in exactly four places. Shown once here; each task lists its exact ids/values.

**(a) Live route map** — `apps/gallery/src/routes/LiveExperience.tsx`: add a lazy import and a `LIVE_PAGES` entry:

```tsx
const PlanningWallPage = lazy(
  () => import('../../../../experiences/slide-decks/deck-project-kickoff/PlanningWallPage.js'),
);
// … in LIVE_PAGES:
'deck-project-kickoff': { mood: 'light', Component: PlanningWallPage },
```

**(b) Live id list** — `apps/gallery/src/data/live.ts`: append the id to `LIVE_EXPERIENCE_IDS`.

**(c) Experience manifest** — `experiences/slide-decks/<id>/<id>.experience.manifest.ts`, `export default buildExperience({...})` with `approval.state: 'approved'`, `provenance.licenceReviewed: true` semantics per batch-1 manifests (copy the field shape from `experiences/slide-decks/deck-ai-strategy/deck-ai-strategy.experience.manifest.ts`), plus a reviewRecord note naming the live build.

**(d) Catalogue expectations** — `packages/registry/src/catalogue.test.ts`: bump `result.experiences` length, the `slide-deck` bySurface length, and add the new ids to the approved-ids literal array. Exact values per task below.

Unit-test and e2e conventions (follow, don't reinvent): unit file per task under `apps/gallery/src/routes/` mirroring `LiveWorlds.test.tsx` (jsdom, `MotionProvider reducedMotion`, `renderLive('/live/<id>')`, `vi.setConfig({ testTimeout: 30_000 })`, 15s findByTestId waits, axe, theme-lock assertion); Playwright spec per task under `apps/gallery/e2e/` mirroring `live-decks.spec.ts` (each world loads, settles, full-page screenshot `apps/gallery/e2e/screenshots/live-<short>.png` of a monumental CONTENT slide via `?slide=N`).

Every task's steps are: (1) study exemplars; (2) content packs; (3) pages + CSS; (4) register (a)–(d); (5) unit tests; (6) gates + e2e + screenshots; (7) hostile critique pass 1 → fixes; (8) pass 2 → fixes → re-screenshot; (9) final gates; (10) commit(s) + report. Concrete requirements per task follow.

---

### Task 1 (ledger T23): Decks D — The Planning Wall · The Preprint · The Campaign Room

**Files:**
- Create: `experiences/slide-decks/deck-project-kickoff/{content.ts, PlanningWallPage.tsx, planning-wall.css, deck-project-kickoff.experience.manifest.ts}`
- Create: `experiences/slide-decks/deck-research-discussion/{content.ts, PreprintPage.tsx, preprint.css, deck-research-discussion.experience.manifest.ts}`
- Create: `experiences/slide-decks/deck-marketing-campaign/{content.ts, CampaignRoomPage.tsx, campaign-room.css, deck-marketing-campaign.experience.manifest.ts}`
- Modify: `apps/gallery/src/routes/LiveExperience.tsx` (3 lazy imports + 3 `LIVE_PAGES` entries), `apps/gallery/src/data/live.ts` (3 ids), `packages/registry/src/catalogue.test.ts` (counts + approved ids), `experiences/package.json` (add `@fontsource/caveat` — OFL, weights 400+600 only)
- Test: `apps/gallery/src/routes/LiveWorldsDecksD.test.tsx`, `apps/gallery/e2e/live-decks-d.spec.ts`

**Interfaces:**
- Consumes: `useDeckNavigation` from `experiences/slide-decks/_deck-kit/useDeckNavigation.js`; `StatusList` from `@enterprise-design/content-components`; `ChartFigure`-based charts from `@enterprise-design/data-viz`; motion tokens.
- Produces: three live world pages (default exports `PlanningWallPage`, `PreprintPage`, `CampaignRoomPage`); catalogue counts experiences=53, slide-deck=13, approved=26.

**World briefs (binding creative contracts):**

**1. `deck-project-kickoff` — "The Planning Wall"** (mood: light). Conceit: the kickoff as a project wall — butcher-paper field with a HAND-SKETCHED excalidraw-idiom plan: wobbly-stroke milestone route (M0→M5) drawn as one continuous pencil line across a persistent wall band, taped index-card slides, sketched RACI grid, red-pencil risk circles. Excalidraw idiom = imperfect strokes (SVG paths with slight jitter baked into the path data — deterministic, precomputed in content.ts, never random at render), rounded uneven rectangles, hand-drawn arrowheads, Caveat for annotations (body text stays Inter). Palette: warm paper `#f5efe2`, graphite `#3a3a3a`, pencil red `#c9402f`, tape `rgba(120,110,90,0.25)`. Slides (10): title (thesis: "A plan you can point at."); why-now; scope IN/OUT (two taped lists); milestone route (THE commanding visual — full-wall sketch); RACI grid; workstreams via `comp.status-list` on a taped panel; risk wall (red circles); resourcing; first-90-days calendar strip; closing ask. Anomaly (verbatim, test-asserted): milestone M3 circled red, annotated `DEPENDENCY UNCONFIRMED — DATA PLATFORM SIGN-OFF`. Accessible mirror: milestone route + RACI as a visually-hidden ordered list/table. Synthetic notice: `SYNTHETIC PROGRAMME — DEMONSTRATION ONLY`. Manifest: audiences `["product-owner","engineering"]`-style values valid per contracts enums (copy legal values from a batch-1 manifest), businessIntents e.g. `["align-project-kickoff","commit-milestones"]`, density low, motionLevel 2, signatureSequence `ledger-reveal`, componentsUsed `["comp.status-list"]`, grammarId: pick the best-fit id present in `packages/registry/generated/grammars.json` (verify at build).

**2. `deck-research-discussion` — "The Preprint"** (mood: light). Conceit: the deck as pages of an annotated preprint under seminar discussion — white paper ground, two-column academic fragments, a second voice in the margins (blue-pencil reviewer annotations, slightly rotated), figure plates with serif captions, DOI-style mono footer. NOT grid-paper (Bench Journal/Lab Report own that) — this is typeset-paper texture. Palette: paper `#fbfaf7`, ink `#1c1c1e`, annotation blue `#2b5db8`, highlight `rgba(255,220,90,0.35)`. Fraunces for body serif; IBM Plex Mono for apparatus. Slides (10): title-as-paper-header (authors, affiliation, synthetic DOI); abstract (with one margin annotation disagreeing); hypothesis ladder H1→H3; method flow; results — effect sizes via `comp.category-bar-chart` framed as Figure 2; bespoke confidence-interval dot-whisker plate (Figure 3, local SVG: point estimates + CI bars, one crossing zero); the replication slide; limitations (annotated heavily); discussion questions; citation/closing. Anomaly (verbatim): finding F3 stamped `DOES NOT REPLICATE (n=12)` — kept, not hidden, with margin note "report it anyway." Mirror: CI plate as visually-hidden table (estimate, low, high, n per finding). Notice: `SYNTHETIC STUDY — NO REAL SUBJECTS`. componentsUsed `["comp.category-bar-chart"]`, signatureSequence `data-ink-draw`, motionLevel 1–2.

**3. `deck-marketing-campaign` — "The Campaign Room"** (mood: dark). Conceit: campaign proposal as a launch war-room at night — near-black field, ONE electric accent (coral `#ff5a4e`), monumental condensed editorial type for campaign beats, a hand-sketched funnel (excalidraw idiom: wobbly trapezoids, annotated conversion %s) as the spine visual, and an INTERACTIVE channel-mix chart: bespoke horizontal stacked bar (local SVG) where hovering/focusing a segment raises it and pins a mono tooltip (budget, CAC, expected reach); keyboard: segments are buttons, arrow keys move focus, tooltip mirrors to an aria-live region. Palette: field `#0b0a0c`, ink `#f2ede6`, coral `#ff5a4e`, dim `#8a8694`. Slides (9): title (campaign name "SIGNAL & NOISE", thesis line); audience insight; the big idea (monumental type slide); funnel (commanding visual); channel mix (interactive chart + `comp.kpi-tile` row: budget, CAC target, reach); flight calendar (phase bars); creative direction board; measurement plan; the ask. Anomaly (verbatim): funnel channel struck through `PAID SOCIAL — CUT · CAC 4.1× TARGET`. Mirror: funnel + channel mix as hidden tables. Notice: `SYNTHETIC CAMPAIGN — DEMONSTRATION ONLY`. componentsUsed `["comp.kpi-tile"]`, signatureSequence `horizon-sweep`, motionLevel 2.

**Steps:**

- [ ] **Step 1: Read the contract + exemplars.** Read `.superpowers/sdd/briefs/live-world-shared-rules.md`, then study `experiences/slide-decks/deck-technical-architecture-explanation/` (SectionalPage.tsx + sectional.css), `experiences/slide-decks/demo-langchain-deepagents/` (The Window — newest craft reference), `experiences/slide-decks/_deck-kit/useDeckNavigation.ts`, and screenshots `apps/gallery/e2e/screenshots/live-*.png`.
- [ ] **Step 2: Content packs.** Write the three `content.ts` files: typed slide model (follow `demo-langchain-deepagents/content.ts` shape — `SLIDES` array with id/kind/section/kicker, plus world-specific data exports), all copy final (no lorem), anomaly strings EXACTLY as specified above, sketch-path data precomputed as consts.
- [ ] **Step 3: Pages + art layers.** Build the three pages + CSS per briefs. Deck mechanics via `useDeckNavigation`. Theme mood is enforced by `LiveExperience`'s `useLockedTheme` — do NOT re-lock inside the page. Print + reduced-motion blocks in every CSS file (copy the structural pattern from `sectional.css`).
- [ ] **Step 4: Register.** Add `@fontsource/caveat` to `experiences/package.json` (`corepack pnpm install`); apply registration pattern (a)–(d): ids `deck-project-kickoff`, `deck-research-discussion`, `deck-marketing-campaign`; moods light/light/dark. In `catalogue.test.ts`: experiences `toHaveLength(53)`, slide-deck `toHaveLength(13)`, approved-ids array += the three ids (keep sorted). Run `corepack pnpm registry:build` — expect 0 errors, 0 warnings.
- [ ] **Step 5: Unit tests.** `apps/gallery/src/routes/LiveWorldsDecksD.test.tsx`, per world ≥3 its (follow `LiveWorlds.test.tsx` harness verbatim): (1) renders + slide count + title-slide active + theme locked to its mood + synthetic notice present; (2) `?slide=` deep-links to the anomaly slide and the anomaly text is on-screen — e.g. `expect(screen.getByText(/DEPENDENCY UNCONFIRMED — DATA PLATFORM SIGN-OFF/)).toBeInTheDocument()`; (3) ArrowRight/End/Home navigation updates the counter, reduced mode has no `data-state="leaving"` pass; (4) axe clean; (5) accessible mirror present (query the hidden table/list by role/name). Campaign Room additionally: channel segment focusable, focus/hover updates the aria-live readout.
- [ ] **Step 6: First render + screenshots.** `corepack pnpm --filter gallery build` then `corepack pnpm --filter gallery e2e` with new `live-decks-d.spec.ts` (3 tests → screenshots `live-planning-wall.png`, `live-preprint.png`, `live-campaign-room.png`, each a CONTENT slide via `?slide=`).
- [ ] **Step 7: Hostile critique pass 1.** Per world: critique the screenshot as a hostile design director; list ≥5 concrete upgrades; implement all; rebuild.
- [ ] **Step 8: Hostile critique pass 2.** Re-screenshot, second critique, implement, re-screenshot. Log both passes' actual critiques in the report.
- [ ] **Step 9: Gates.** `corepack pnpm typecheck` · `corepack pnpm lint` · `corepack pnpm test` · `corepack pnpm --filter gallery build` · `corepack pnpm --filter gallery e2e` — all exit 0.
- [ ] **Step 10: Commit + report.** Commit(s) on `slice-1-landing-mcp` (message: `Batch-2 decks D: Planning Wall, Preprint, Campaign Room live worlds` + trailer). Full report (status, commits, critique logs, test summary, Caveat licence note) to the dispatch-given path.

---

### Task 2 (ledger T24): Decks E — T-Minus · The Whiteboard · The Cutover

**Files:**
- Create: `experiences/slide-decks/deck-product-launch/{content.ts, TMinusPage.tsx, t-minus.css, deck-product-launch.experience.manifest.ts}`
- Create: `experiences/slide-decks/deck-team-retrospective/{content.ts, WhiteboardPage.tsx, whiteboard.css, deck-team-retrospective.experience.manifest.ts}`
- Create: `experiences/slide-decks/deck-cloud-migration/{content.ts, CutoverPage.tsx, cutover.css, deck-cloud-migration.experience.manifest.ts}`
- Modify: `apps/gallery/src/routes/LiveExperience.tsx`, `apps/gallery/src/data/live.ts`, `packages/registry/src/catalogue.test.ts`
- Test: `apps/gallery/src/routes/LiveWorldsDecksE.test.tsx`, `apps/gallery/e2e/live-decks-e.spec.ts`

**Interfaces:**
- Consumes: same as Task 1 (deck kit, real components, motion tokens; Caveat font now installed).
- Produces: default exports `TMinusPage`, `WhiteboardPage`, `CutoverPage`; catalogue counts experiences=56, slide-deck=16, approved=29.

**World briefs:**

**4. `deck-product-launch` — "T-Minus"** (mood: dark). Conceit: the launch plan as a countdown sequence — every slide carries a monumental `T-30` / `T-14` / `T-7` / `T-1` / `T-0` stamp that counts down as the deck advances (the persistent device), over a midnight field with a thin amber horizon line that rises slide by slide toward launch. Palette: midnight `#070b12`, ink `#eef0e9`, amber `#f0a63c`, go-green `#4fae72`. Slides (10): title (T-30); the product in one sentence; launch thesis; readiness board via `comp.status-list` (gates: legal, security, docs, support, infra) — THE anomaly lives here; comms & channel plan; pricing & packaging table; day-0 runbook timeline (bespoke horizontal sequence, local SVG); risk & rollback (what triggers abort); metrics for day-7/day-30 via `comp.kpi-tile`; T-0 closing (full-bleed GO slide, horizon line reaches top). Anomaly (verbatim): readiness gate `SECURITY REVIEW PENDING — BLOCKS T-7`, amber against otherwise-green gates. Mirror: runbook timeline as hidden ordered list. Notice: `SYNTHETIC LAUNCH PLAN — DEMONSTRATION ONLY`. componentsUsed `["comp.status-list","comp.kpi-tile"]`, signatureSequence `horizon-sweep`, motionLevel 2.

**5. `deck-team-retrospective` — "The Whiteboard"** (mood: light). Conceit: full excalidraw world — the retro as a whiteboard photographed mid-session: marker-stroke frame drawn around each slide, sticky notes (slightly rotated, drop-shadowed, four muted marker colours), hand-drawn arrows and dot-votes, Caveat handwriting for note text with Inter for structure. Strokes wobble via precomputed path jitter (deterministic). Distinct from The Planning Wall: that is pencil-on-paper planning; this is marker-on-whiteboard conversation — different texture, different geometry (stickies vs taped cards), no milestone route. Palette: whiteboard `#f8f8f6`, marker black `#2f3136`, marker red `#c94f42`, marker blue `#3d6bb0`, marker green `#4a8f5c`, sticky yellows/pinks (`#f7e9a0`, `#f3c9c2`). Slides (9): title (sprint 41 retro, marker title); how-we-felt (dot-vote scale); what-went-well wall (stickies); what-didn't wall (stickies); the one big thing (monumental marker slide); actions board via `comp.status-list` framed as a taped printout ("the only typed thing on the board"); ownership map (hand-drawn arrows stickies→names); experiment for next sprint; closing (marker "same time in two weeks"). Anomaly (verbatim): action sticky circled three times in red: `CARRIED 3 SPRINTS — FLAKY E2E OWNERSHIP`. Mirror: sticky walls as hidden lists per column. Notice: `SYNTHETIC RETROSPECTIVE — NO REAL TEAM`. componentsUsed `["comp.status-list"]`, signatureSequence `ledger-reveal`, motionLevel 2.

**6. `deck-cloud-migration` — "The Cutover"** (mood: light). Conceit: the migration plan as a draw.io working file — flat diagram-tool canvas (faint dot-grid), precise orthogonal connectors with port dots, pastel-filled rounded system boxes with type badges, a layers legend chip in chrome, selection-handle accents on the "current focus" node per slide. Draw.io idiom = exact geometry (this world's strokes are perfectly straight — the anti-excalidraw), swimlane phases, connector labels in mono. Distinct from The Sectional (cyanotype print) and Drawing Office (drafting linework): this is a modern web diagram tool aesthetic. Palette: canvas `#fafbfc`, grid dot `rgba(60,70,90,0.12)`, node fills (`#dbe8f7` app, `#e3f2e4` data, `#fdeeda` integration), stroke `#5b6b82`, focus `#2f6fdd`. Slides (10): title (as file header "cutover-plan.drawio · rev 14"); current estate diagram (commanding visual 1); target estate diagram (commanding visual 2 — same canvas, morphed layout); the delta slide (what moves, what dies, what stays); migration waves swimlane (wave 1–3 lanes with system chips); cutover-night sequence via `comp.flow-diagram` in a canvas frame; data sync & validation plan; rollback tree; risk register via `comp.status-list`; closing (rev sign-off box). Anomaly (verbatim): estate node badged `MAINFRAME LEDGER — STAYS ON-PREM · LATENCY SLA 4ms`, the one box that never moves, rendered with a padlock glyph and heavier stroke. Mirror: both estate diagrams as hidden nested lists (system → zone → disposition). Notice: `SYNTHETIC ESTATE — DEMONSTRATION ONLY`. componentsUsed `["comp.flow-diagram","comp.status-list"]`, signatureSequence `data-ink-draw`, motionLevel 1–2.

**Steps:** identical sequence to Task 1 Steps 1–10 with these substitutions: content packs/pages/CSS per the three briefs above; registration ids `deck-product-launch` (dark), `deck-team-retrospective` (light), `deck-cloud-migration` (light); catalogue counts experiences `toHaveLength(56)`, slide-deck `toHaveLength(16)`, approved += 3 ids; unit test file `LiveWorldsDecksE.test.tsx` with the same per-world assertion set (anomaly strings verbatim: `SECURITY REVIEW PENDING — BLOCKS T-7`, `CARRIED 3 SPRINTS — FLAKY E2E OWNERSHIP`, `MAINFRAME LEDGER — STAYS ON-PREM · LATENCY SLA 4ms`); e2e spec `live-decks-e.spec.ts` → screenshots `live-t-minus.png`, `live-whiteboard.png`, `live-cutover.png`; both hostile critique passes; all gates; commit `Batch-2 decks E: T-Minus, Whiteboard, Cutover live worlds` + trailer; full report to dispatch path. No new fonts this task.

- [ ] Step 1 (exemplars) · - [ ] Step 2 (content packs) · - [ ] Step 3 (pages+CSS) · - [ ] Step 4 (register, counts 56/16/29) · - [ ] Step 5 (unit tests) · - [ ] Step 6 (build+e2e+screenshots) · - [ ] Step 7 (critique pass 1) · - [ ] Step 8 (critique pass 2) · - [ ] Step 9 (gates) · - [ ] Step 10 (commit+report)

---

### Task 3 (ledger T25): Decks F — the PowerPoint-familiar three: The Quarter · The Straight Pitch · The Allocation

These three deliberately use CONVENTIONAL slide anatomy — the shape a competent human makes in PowerPoint — executed flawlessly. Shared anatomy (all three): persistent title bar (deck title left, section right), content zone on a visible 12-col grid, footer rule with page number + confidentiality line + synthetic notice, agenda slide with numbered sections, section-divider slides, restrained entrance motion (motionLevel 1: single fade/rise per slide, no choreography). NO world conceit, NO atmospheric field — white/near-white grounds, one accent colour each. The craft is typographic scale (Fraunces display / Inter text / Plex Mono figures), perfect alignment, considered charts. The three must still be visually distinct from each other via accent, chart treatment, and voice.

**Files:**
- Create: `experiences/slide-decks/deck-quarterly-business-review/{content.ts, QuarterPage.tsx, quarter.css, deck-quarterly-business-review.experience.manifest.ts}`
- Create: `experiences/slide-decks/deck-sales-pitch/{content.ts, StraightPitchPage.tsx, straight-pitch.css, deck-sales-pitch.experience.manifest.ts}`
- Create: `experiences/slide-decks/deck-budget-planning/{content.ts, AllocationPage.tsx, allocation.css, deck-budget-planning.experience.manifest.ts}`
- Modify: `apps/gallery/src/routes/LiveExperience.tsx`, `apps/gallery/src/data/live.ts`, `packages/registry/src/catalogue.test.ts`
- Test: `apps/gallery/src/routes/LiveWorldsDecksF.test.tsx`, `apps/gallery/e2e/live-decks-f.spec.ts`

**Interfaces:**
- Consumes: deck kit; `comp.kpi-tile`, `comp.trend-chart`, `comp.category-bar-chart`; motion tokens.
- Produces: default exports `QuarterPage`, `StraightPitchPage`, `AllocationPage`; catalogue counts experiences=59, slide-deck=19, approved=32.

**World briefs:**

**7. `deck-quarterly-business-review` — "The Quarter"** (mood: light). Accent: corporate navy `#1f3a67`. Slides (11): title; agenda (numbered 01–05); exec summary (three sentences, large); KPI row via `comp.kpi-tile` (revenue, NRR, margin, headcount) — anomaly here; revenue trend via `comp.trend-chart` with hover tooltip; segment performance via `comp.category-bar-chart`; wins & losses two-column; pipeline table; risks & mitigations; next-quarter priorities (numbered, ≤4); appendix divider + data-notes slide. Anomaly (verbatim): KPI tile flagged `NRR 96% — BELOW 100% FLOOR`, the single red figure in a green row, echoed in exec summary. Voice: institutional, unsparing. Notice: `SYNTHETIC RESULTS — DEMONSTRATION ONLY`. componentsUsed `["comp.kpi-tile","comp.trend-chart","comp.category-bar-chart"]`, signatureSequence `ledger-reveal`, motionLevel 1.

**8. `deck-sales-pitch` — "The Straight Pitch"** (mood: light). Accent: deep teal `#0e6b62`. Structure problem→solution→proof→pricing (10 slides): title (client name + date, restrained); the problem in the client's words (large quote treatment); cost of doing nothing (one number, huge); the solution (one diagram: simple 3-node before/after, exact geometry, local SVG); how it works (3 numbered steps); proof via `comp.kpi-tile` (3 customer-outcome metrics) + one named case study slide; anomaly slide `WHERE WE ARE NOT A FIT` (three honest bullets — the candor IS the anomaly, verbatim heading test-asserted); pricing table (3 tiers, middle pre-selected with a quiet rule, no dark patterns); implementation timeline strip; the ask + next meeting. Notice: `SYNTHETIC PITCH — NO REAL CLIENT`. componentsUsed `["comp.kpi-tile"]`, signatureSequence `ledger-reveal`, motionLevel 1.

**9. `deck-budget-planning` — "The Allocation"** (mood: light). Accent: oxblood `#7d2a33`. Slides (10): title; budget context (last year vs this year, two figures); THE waterfall (bespoke local SVG: opening budget → +increments/−cuts → closing, hover/focus a bar pins a mono readout; keyboard operable; the commanding visual); allocation by function via `comp.category-bar-chart`; headcount plan table (by team, quarter columns); cost-per-team detail; the anomaly line; capex vs opex split; scenarios (base/stretch/cut, three columns); approval ask + sign-off block. Anomaly (verbatim): waterfall bar + table row flagged `CLOUD EGRESS +38% YOY — UNRESOLVED`, oxblood against neutral bars. Mirror: waterfall as hidden table (step, delta, running total). Notice: `SYNTHETIC BUDGET — DEMONSTRATION ONLY`. componentsUsed `["comp.category-bar-chart"]`, signatureSequence `data-ink-draw`, motionLevel 1.

**Steps:** same 10-step sequence as Task 1 with: registration ids + moods (all light); catalogue counts experiences `toHaveLength(59)`, slide-deck `toHaveLength(19)`, approved += 3 ids; unit test file `LiveWorldsDecksF.test.tsx` (anomaly assertions verbatim: `NRR 96% — BELOW 100% FLOOR`, `WHERE WE ARE NOT A FIT`, `CLOUD EGRESS +38% YOY — UNRESOLVED`; Allocation additionally: waterfall bar focusable and readout updates); e2e `live-decks-f.spec.ts` → `live-quarter.png`, `live-straight-pitch.png`, `live-allocation.png`; hostile critique passes judge against a DIFFERENT question for these three: "is this the best conventional deck a human has ever seen — or merely a normal one?" (dead space, weak hierarchy, default-looking charts are the failure modes); gates; commit `Batch-2 decks F: the PowerPoint-familiar three (Quarter, Straight Pitch, Allocation)` + trailer; report.

- [ ] Step 1 · - [ ] Step 2 · - [ ] Step 3 · - [ ] Step 4 (counts 59/19/32) · - [ ] Step 5 · - [ ] Step 6 · - [ ] Step 7 · - [ ] Step 8 · - [ ] Step 9 · - [ ] Step 10

---

### Task 4 (ledger T26): Deck G — The Long Signal (analytics deep-dive) + batch closeout

**Files:**
- Create: `experiences/slide-decks/deck-analytics-deep-dive/{content.ts, LongSignalPage.tsx, long-signal.css, deck-analytics-deep-dive.experience.manifest.ts}`
- Modify: `apps/gallery/src/routes/LiveExperience.tsx`, `apps/gallery/src/data/live.ts`, `packages/registry/src/catalogue.test.ts`
- Test: `apps/gallery/src/routes/LiveWorldsDecksG.test.tsx`, `apps/gallery/e2e/live-decks-g.spec.ts`

**Interfaces:**
- Consumes: deck kit; `comp.trend-chart`, `comp.kpi-tile`; motion tokens.
- Produces: default export `LongSignalPage`; catalogue counts experiences=60, slide-deck=20, approved=33. Batch complete.

**World brief:**

**10. `deck-analytics-deep-dive` — "The Long Signal"** (mood: dark). Conceit: ONE dataset — 52 weeks of a single business metric (checkout conversion, synthetic) — threads the entire deck as a persistent bespoke chart band across the bottom of every slide (the device: the SAME series, progressively annotated as the argument develops; each slide's analysis lights up its region of the line). The hero slide expands the band to full viewport as THE interactive instrument: crosshair hover with mono readout (week, value, 7-day delta), click/Enter pins a comparison marker, arrow keys walk weeks, `B` toggles a baseline overlay — all bespoke local SVG, aria-live readout, hidden data table. Palette: observatory `#0a0d12`, signal cyan `#5fd4d0`, ink `#e8e6df`, flag `#e0564a`, dim `#79808e`. Distinct from the cockpit (radial scope) and The Window (capacity column): this is a longitudinal line instrument. Slides (10): title (the line at low opacity, thesis "One metric, honestly read."); the question; the dataset (provenance card, weeks/n/definitions); the instrument (full-viewport interactive hero); seasonality decomposition (small-multiple strips, local SVG); the anomaly week; cohort comparison via `comp.trend-chart` (two cohorts) framed by the world; what moved it (annotated causes on the band, `comp.kpi-tile` row of effect sizes); what we do not know (honest uncertainty slide); recommendation + monitoring plan. Anomaly (verbatim): week-37 region flagged `WEEK 37 REGIME CHANGE — FLAGGED, NOT SMOOTHED` (red band segment, annotation card explains the level shift is kept in all summary stats). Notice: `SYNTHETIC SERIES — DEMONSTRATION ONLY`. componentsUsed `["comp.trend-chart","comp.kpi-tile"]`, signatureSequence `data-ink-draw`, motionLevel 2.

**Steps:**

- [ ] **Step 1–3:** exemplars → content pack (52 deterministic weekly values with a real level shift at week 37, seasonal shape, and noise baked into the const array) → page + CSS per brief.
- [ ] **Step 4: Register.** Pattern (a)–(d), id `deck-analytics-deep-dive`, mood dark; catalogue counts experiences `toHaveLength(60)`, slide-deck `toHaveLength(20)`, approved += 1 id (final list = 33).
- [ ] **Step 5: Unit tests.** `LiveWorldsDecksG.test.tsx`: standard deck assertions + anomaly text verbatim + instrument keyboard contract (focus the hero chart, ArrowRight moves the readout week — assert aria-live text changes; `B` toggles baseline — assert overlay node appears) + hidden data table has 52 rows + axe.
- [ ] **Step 6–8: Screenshots + TWO hostile critique passes** (screenshot `live-long-signal.png` on the instrument slide).
- [ ] **Step 9: Batch closeout verification.** All gates exit 0. Then the whole-batch checks: `corepack pnpm registry:build` 0 errors; gallery landing shows 60 templates; every new `/live/<id>` route in `live-decks-{d,e,f,g}.spec.ts` passes; confirm all 10 new screenshots exist under `apps/gallery/e2e/screenshots/`.
- [ ] **Step 10: Commit + report.** `Batch-2 deck G: The Long Signal; batch-2 complete (10 new deck worlds, 33 approved)` + trailer; report.

---

## After Task 4 (controller work, not a subagent task)

1. Controller hostile review of all 10 screenshots against batch-1 + fable-25 + the originality matrix; dispatch fix subagents for any Critical/Important finding; record per-deck quality confirmation in the ledger (this is goal condition 1's evidence).
2. Final whole-branch review per subagent-driven-development (most capable model) covering T23–T26.
3. Append `PHASE 4` status lines to `.superpowers/sdd/progress.md` as each task completes.
4. Phase B (MCP quality loop) gets its own brainstorm + plan per the spec.

## Self-Review (done at write time)

- **Spec coverage:** 10 lineup entries → 10 briefs across 4 tasks ✓; PowerPoint-familiar definition applied to #7–9 ✓; excalidraw idiom (#1, #5), draw.io idiom (#6), interactive charts (#3 channel mix, #7 trend hover, #9 waterfall, #10 instrument) ✓; bespoke-not-registered constraint stated globally ✓; manifests/routes/tests/gates per world ✓; hostile-review + exit criterion captured in closeout ✓.
- **Placeholder scan:** no TBDs; every anomaly string, palette, slide schedule, count, path, and command is concrete. Creative copy inside content packs is intentionally the implementer's craft, bounded by binding briefs — the batch-1-proven contract.
- **Type consistency:** page export names match between Files and LIVE_PAGES entries; count ladder 53/13/26 → 56/16/29 → 59/19/32 → 60/20/33 is monotonic and sums correctly from the 50/10/23 baseline.
