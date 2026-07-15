# design-borrow pilot run — 2026-07-15

**Instruction:** `Borrow part deck-cloud-migration/waves/swimlanes using the design-borrow skill.`
**Target:** new demo route `/demo/borrow-pilot` (`experiences/slide-decks/demo-borrow-pilot/`).

## Phase 0 — Resolve
- Source: `experiences/slide-decks/deck-cloud-migration/CutoverTemplate.tsx`,
  anchor `<div className="cu-swimlanes" data-part-id="deck-cloud-migration/waves/swimlanes">`
  (the `case 'waves'` branch), CSS `cutover.css`.

## Phase 1 — Classify
- **Slice** (bespoke grid riding the local `Build` stagger wrapper; no registry component).

## Phase 2 — Slice list
- JSX: swimlanes grid subtree (lane → head → chips → note).
- Helpers: `Build` (stagger wrapper, `--cu-i` index).
- CSS closure: `.cu-swimlanes .cu-lane .cu-lane-head .cu-lane-name .cu-lane-when
  .cu-lane-chips .cu-lane-note .cu-chip[data-kind] .cu-build` +
  `@keyframes cu-rise` + reduced-motion overrides + narrow-viewport 1fr collapse.
- Package imports: `@enterprise-design/motion` (`useMotionPreference`), fonts.

## Phase 3 — Adaptations
- Prefix `cu-` → `bp-` everywhere (classes, `--cu-i` → `--bp-i`).
- Animation trigger: deck `data-state='active'` → mount-armed `data-armed` on the root
  (rAF after first paint); reduced-motion collapse preserved via `data-reduced` + media query.
- Chip kinds re-semanticized `app/data/integration` → `ui/contract/skill` (same three pastel ramps).
- Inks re-tuned: focus edge `#2f6fdd` → warm `#b56a2f`; canvas warmed. Light mood kept.
- Content 100% target-owned (the borrow-a-part rollout itself); no source words/data.
- No `data-part-id` carried over.

## Phase 4 — Gates
1. `corepack pnpm typecheck` — clean.
2. Part-id contract suites — 8/8 green.
3. `git status --porcelain experiences/slide-decks/deck-cloud-migration` — empty (source untouched).
4. Build + preview + screenshots (this directory):
   - `target-borrowed-swimlanes.png` — the borrowed grid, re-inked, target content.
   - `source-waves-slide.png` — the source waves slide for comparison.
   - `source-waves-inspecting.png` — the part inspector armed on the source route.

**Friction found:** none blocking; skill wording held. The mount-armed trigger note in
`references/slicing-and-adapting.md` §5 (deck-driven animations need a re-trigger outside decks)
was the one adaptation the skill correctly predicted.
