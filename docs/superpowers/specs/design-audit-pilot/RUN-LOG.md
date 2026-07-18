# design skill AUDIT route — pilot run, 2026-07-18

First run of `.claude/skills/open-design/workflows/audit.md` (Hallmark-derived punch-list
verb). Two targets: one shipped live world, one composed demo. Rubric:
`references/quality-gates.md`. **No edits were made** — findings are reported here.

Evidence: `weighing-room-{fold,full,mobile}.png`, `openwiki-{fold,full,mobile}.png`
(1280×800 fold, full-page, 375px full-page), shot via a temporary
`apps/gallery/scripts/tmp-audit-shots.mjs` (deleted after the run) against the dev
server, with a per-viewport `scrollWidth > clientWidth` probe for gate F1.

---

## Target 1 — `/live/proj-vendor-assessment` (The Weighing Room, shipped live world)

Pre-emit critique as rubric: **P5 H5 E4 S5 R5 V5**.

Mechanical sweep: no `transition: all`, no italic display, `:focus-visible` present on
`.wr-back` and `.wr-acetate`, no horizontal scroll at 375/1280 (F1 probe false), glass
table scrolls internally (`overflow-x: auto`, weighing-room.css:277). Provenance
notice present in hero AND footer. Eyebrow stacks above the heading (A14 pass). Hero
is left-set with off-axis meta (A5 pass).

Findings:

- `minor · hidden-scroll-affordance · experiences/project-pages/proj-vendor-assessment/weighing-room.css:277 · at 375px the vendor verdict columns clip with no cue that the table region scrolls — add an edge-fade or a "scroll →" hint under ~48rem.`

**0 critical · 0 major · 1 minor.**

Pass-with-intent notes: the plain hairline KPI strip and quiet lens chips are the
world's deliberate procurement-office register — conventional ≠ slop.

## Target 2 — `/demo/openwiki` (composed via the T-Minus template, `deck-product-launch`)

Pre-emit critique as rubric: **P5 H5 E3 S4 R5 V5** (E3 driven by the mobile finding).

Findings:

- `critical · horizontal-scroll (F1) · experiences/slide-decks/deck-product-launch/t-minus.css:153 · at 375px the page scrollWidth ≈ 529px: the three .tm-chrome-cell top-bar cells are white-space: nowrap with no narrow-width collapse, and nothing clips the deck root — collapse/hide the centre chrome cell below ~30rem and add overflow-x: clip at the root.`

This is **template work on `deck-product-launch`** (it affects every deck composed
from T-Minus, not just this fill) — per the audit contract it is reported, not
patched here.

Pass-with-intent notes: `.tm-stamp` (line-height 0.8) and `.tm-go` (0.82) are
single-line display numerals — no wrap, so no cap-collision (F6 does not fire); the
amber second headline line is the template's signature accent moment and stays within
the accent-footprint budget; `.tm-display`/`.tm-monument` are mixed-case at 0.96–0.98,
above the all-caps floor rule's scope.

**1 critical · 0 major · 0 minor.**

---

## Verdict on the workflow itself

The route works end-to-end: resolve → render+code sweep → severity punch list, zero
edits (`git status` clean apart from this evidence folder). It found one real,
previously-unnoticed template defect on its first outing (T-Minus mobile chrome), and
correctly declined to hot-patch it. The `pass-with-intent` valve mattered on both
targets — without it, deliberate craft (plain registers, giant single-line numerals)
would have read as findings.
