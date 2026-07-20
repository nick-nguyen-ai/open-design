# OpenDesign intro deck — durable Opus copy, 2026-07-19

Route: `/demo/opendesign-intro-opus` · Template: `dgm-circuit` (`deck-dgm-circuit`, THE LIT BOARD, dark, art-directed)
Scaffold: `experiences/slide-decks/sample-opendesign-intro-opus/` (fill.ts + OpenDesignIntroOpusPage.tsx)

## Why this folder exists

The shared `sample-opendesign-intro/` scaffold is being rewritten by concurrent sessions (sibling `-fable` and
`-sonnet` copies also appeared). This is the stable copy owned by this Opus session, wired to its own route so no other
session can clobber it. Content is byte-identical to the compose output verified earlier this session — see
`../opendesign-intro-sample/RUN-LOG.md` for the full intake, narrative map, selection note, and template-work
observations.

## Verification (this copy)

- `FILL_SCHEMA.parse` — succeeds at import (export renamed `openDesignIntroOpusFill`).
- `validateFillTool` real domain path (in-process, real object) — `valid: true`, 0 findings.
- `corepack pnpm typecheck` — pass (all projects).
- `corepack pnpm --filter gallery build` — clean; `slide-01..10.png` re-shot from the fresh build via `shoot.mjs`
  against `/demo/opendesign-intro-opus`.
- Content-fit + honest-copy gates: pass (identical content to the verified original). Pre-emit critique
  **P5 H5 E4 S5 R5 V4**.

Note: the MCP `validate_fill` tool cannot be called from this chat bridge (the `fill` arg arrives as a string → root
guard); validated through the real code path in-process per compose.md Phase 0.
