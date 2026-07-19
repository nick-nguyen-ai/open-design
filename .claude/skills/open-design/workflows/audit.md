# AUDIT workflow — grade an existing experience, change nothing

Grade an existing experience/route in this repo against `references/quality-gates.md` and
return a severity-ranked punch list. **This verb never edits.** No fixes, no redesigns, no
"while I was in there" — the output is the report. (Pattern adopted from Hallmark's `audit`
verb, MIT, Together AI.)

## Phase 0 — Resolve the target

Accept any of: a route (`/live/<id>`, `/demo/<slug>`), an experienceId, or a directory under
`experiences/`. Resolve to BOTH:

1. **The code** — the experience directory (`content.ts` / `fill.ts`, `*Page.tsx` /
   `*Template.tsx`, sibling `.css`).
2. **The rendered page** — build, serve, and run the verify rig
   (`node .claude/skills/open-design/scripts/verify.mjs --route <route> --testid <testid>
   [--slides N] --out <evidence-dir>`): it captures every state at 1440/1280/375 (plus a
   full-page shot for single-page surfaces) and runs the ⚙ DOM probes — its `findings.json`
   pre-answers gates F1, the overflow/overlap tells, and the C1 contrast math, so the sweep
   in Phase 1 starts from mechanical findings instead of re-deriving them.

Never grade from code alone: half the gates are visual and only fail on the rendered page.

## Phase 1 — Sweep

Work through `references/quality-gates.md` in order (A → F):

- ⚙-marked gates: check mechanically — grep the CSS/TSX (`transition: all`, bare `1fr` image
  tracks, `font-style: italic` on headings, hex values outside the token block…), compute the
  contrast pairs for C1–C3.
- Visual gates: judge on the screenshots.
- House invariants count as gates too: part-ID contract intact (`data-part-id` present and
  well-formed if the world is contracted in `LivePartIds.test.tsx`), reduced-motion collapse
  (`[data-reduced]` + `prefers-reduced-motion`), SYNTHETIC provenance notice where fictional
  data is shown.

Also run the six-axis pre-emit critique table AS a rubric over the rendered page — score it
1–5 per axis and report the scores. An audited page scoring < 3 on an axis deserves a
finding even if no single named gate fires.

## Phase 2 — Report

For each finding:

```
severity · tell-name · where (file:line, or "screenshot: <region>") · one-line fix
```

- Group by severity: **critical** (ships as slop) → **major** (looks AI-generated) →
  **minor** (taste). Use the ladder names from `references/quality-gates.md`.
- Suppress nothing, but say when a hit is deliberate craft (e.g. an old-school world that is
  intentionally plain): note it as `pass-with-intent` rather than a finding — our catalogue
  deliberately includes simple, conventional worlds; conventional ≠ slop.
- End with the count line: `N critical · M major · K minor` and the six critique scores.
- If the target is a **shipped live world** (in `LIVE_EXPERIENCE_IDS`), remind the reader
  that fixes are template work requiring the usual gates (tests, previews, and the
  screenshot judge of `references/screenshot-judge.md`) — an audit finding is not a licence
  to hot-patch a shipped world. (AUDIT itself needs no separate judge: this route IS the
  full rubric run fresh against the pixels.)

**Exit:** the punch list, delivered. Nothing edited, `git status` clean.
