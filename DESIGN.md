# DESIGN.md — the design quality bar and how to verify it

The single home for this repo's craft principles (Part 1) and the mechanical
verification procedure every design run walks before claiming done (Part 2).
Written so that ANY agent — including a smaller model — can execute Part 2
without judgment gaps: every step is a command to run or a yes/no question,
and the two places genuine judgment remains (the content-fit read and the
screenshot judge) say exactly what to look at.

Related contracts, one pointer each: gate list + severity ladder →
`.claude/skills/open-design/references/quality-gates.md`; run workflows →
`.claude/skills/open-design/workflows/`; repo working standard → `GUIDANCE.md`.

---

## Part 1 — The craft principles (the "Fable bar")

The gallery's worlds are art-directed to a bank-credible standard; hold the line.

a. **Art-direction licence.** Raw colour values are permitted ONLY in a world's
   own `*Template.tsx` / `*Page.tsx` + sibling `.css` (the "experience-local
   art layer"). Everything else — shared components, chrome, overlays —
   consumes theme tokens (`var(--…)`). When borrowing across moods, re-tune
   raw inks deliberately, in one `INK`-style map, never scattered.

b. **Motion comes from tokens.** Durations/easings are `var(--dur-*)` /
   `var(--ease-*)` from `packages/motion` +
   `packages/primitives/src/tailwind-theme.css`. Never ad-hoc cubic-beziers.
   Signature sequences respect `SIGNATURE_SEQUENCE_CAP_MS` (1200ms) and
   `REDUCED_MOTION_CAP_MS` (400ms).

c. **Reduced motion is part of every animation, not an afterthought.** Three
   legs, always: the `useMotionPreference()` gate in JSX, a `data-reduced`
   attribute hook, and a `@media (prefers-reduced-motion: reduce)` override.
   The reduced variant renders the FULL content — no information lives only
   in motion.

d. **Accessibility is asserted, not aspired to.** Every world has an axe
   suite. Charts/diagrams carry text mirrors (`VisuallyHidden`, table
   mirrors); status is letter-coded, never colour-alone; interactive things
   have real roles and accessible names (a glyph child becomes the accessible
   name — use `aria-label` on icon buttons).

e. **Worlds lock their mood.** `LiveExperience` pins `data-theme` per world.
   Anything global floating above worlds (like the PartInspector) must be
   theme-independent — hardcoded, contrast-checked on both moods — and
   verified on a dark world AND a light world.

f. **Template chrome owns the page corners.** Deck nav arrows, notices, and
   counters live in the corners of live pages. Global floating UI goes to the
   right edge, vertically centred.

g. **React discipline the linter enforces:** no ref writes during render; no
   synchronous `setState` in effects — lazy `useState` initializers and the
   adjust-state-during-render pattern (see `PartInspector.tsx`); everything
   keyed properly. `useDeckNavigation` rewrites the query string on every
   slide turn — never treat the URL as state storage on live pages; read
   params once on entry.

h. **Anchor conventions:** `data-testid` for behavior/test anchors,
   `data-part-id` for borrow anchors, `data-*` state attributes
   (`data-state`, `data-status`, `data-reduced`) for styling hooks. All three
   are load-bearing; keep them stable.

i. **Division of labor is the whole architecture.** Templates carry ALL the
   craft (layout, colour, motion, geometry); fills carry ALL the content. A
   run never writes CSS and never edits a shipped world's TSX/CSS — a design
   flaw found mid-run is template work: stop, report it, never patch around
   it.

j. **Honest content.** Every figure traces to the source or is covered by the
   provenance notice; no invented quotes, metrics, or biography. The example
   in a fill skeleton anchors the register AND the magnitude the template was
   tuned around.

---

## Part 2 — The verification procedure (run it verbatim)

Run this before reporting ANY design run (compose, borrow, or template work)
as done. Steps 1–5 are mechanical; steps 6–8 are the two judgment passes and
the honesty sweep. Record every result in the run log.

**Step 1 — Build the real thing.** Screenshots from a stale `dist/` are
worthless (the preview server serves whatever is there):

```
corepack pnpm typecheck
corepack pnpm --filter gallery build
corepack pnpm --filter gallery exec vite preview --port 4318   # background
```

**Step 2 — Run the verify rig** (the ONE driver; do not hand-write shoot
scripts). For a deck with N slides:

```
node .claude/skills/open-design/scripts/verify.mjs \
  --route /demo/<slug> --testid <template-root-testid> --slides N \
  --out docs/superpowers/specs/<slug>-sample
```

For a single-page surface drop `--slides`. The rig shoots every state at
1440/1280/375, runs the DOM probes, and writes `findings.json`. It warns if
`dist/` is older than the sources — if it warns, go back to Step 1.

**Step 3 — Read `findings.json`.** Every entry is one of:

| probe | it means | fix side |
| --- | --- | --- |
| `root-overflow` | the page scrolls horizontally at that viewport (gate F1) | template work — report |
| `text-overflow` | a value is clipped or ellipsized in its box | fill first (tighten copy); template if in-spec content still clips |
| `text-overlap` | two text boxes intersect | fill first (shorten labels); template if auto-layout collides in-spec content |
| `contrast` | a computed WCAG ratio is below floor | template work — report |
| `contrast-unverifiable` | text sits over an image/gradient | check those regions by eye in Step 6 |

Zero actionable findings is the exit condition for this step. Fix fill-side
findings (edit the fill → `validate_fill` → rebuild → rerun Step 2); report
template-side findings as template work and STOP if they block.

**Step 4 — Contract checks.** All three must pass:

```
corepack pnpm run registry:build
corepack pnpm --filter @enterprise-design/registry certify   # 0 findings
```

plus `validate_fill` returning `valid: true` on the final fill (the render
budgets and craft rules — back-edges, notices, anomalies — live here).

**Step 5 — Interaction smoke.** Click through the real route once: every
slide/section reachable, arrow keys work on decks, nothing occludes the nav
(the borrow-pilot bug shipped past 7 unit tests and 3 screenshots; only a
click caught it).

**Step 6 — Content-fit read (judgment pass #1, by the run's author).** With
the 1440 screenshots in front of you, walk the content-fit checklist in
`.claude/skills/open-design/references/scaffold-and-verify.md` §4 — template
leak first, then overflow/orphans/density/tone/arc, the `unverifiable`
contrast regions from Step 3, and CROWDING: two chrome texts flush with zero
gap read as a collision the probes cannot see.

**Step 7 — Screenshot judge (judgment pass #2, NEVER the author).** Dispatch
a fresh-context subagent per
`.claude/skills/open-design/references/screenshot-judge.md`: it receives ONLY
the screenshots and the rubric — not the fill, not the brief, not your
intent — and returns six-axis scores plus severity-laddered findings. Any
axis < 3 → revise (Steps 2–6 again) and re-judge; two rounds is normal, a
third means the template choice is wrong.

**Step 8 — Honest-copy sweep.** Scan every quantitative claim on every
screenshot: each number traces to the source or is covered by the provenance
notice, the notice renders visibly, and any figure appearing twice matches
exactly. An invented "10× faster" is a blocking finding.

**Pass criteria (all of them):** rig findings 0 · certify 0 · validate_fill
valid · smoke clean · content-fit clean · judge all axes ≥ 3 with no
critical/major findings · honest-copy clean. Then — and only then — report
done, with the run log carrying the scores and the evidence paths.
