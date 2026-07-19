# Verifying a borrow

## Gates (all four, in order)

```powershell
# 1. Types
corepack pnpm typecheck

# 2. Part-id contract untouched
corepack pnpm --filter gallery exec vitest run src/test/part-ids-static.test.ts src/routes/LivePartIds.test.tsx

# 3. Source world untouched (MUST print nothing)
git status --porcelain experiences/<surface>/<experienceId>

# 4. Build for the visual check
corepack pnpm --filter gallery build
```

## Screenshot + probe the target (the verify rig)

Serve the built gallery, then run the skill's ONE rig against the target route
— it shoots every state at 1440/1280/375 AND runs the DOM probes (root
overflow, text overflow/overlap, contrast — the gates a borrow's re-tune most
often breaks), writing `findings.json` beside the PNGs:

```powershell
corepack pnpm --filter gallery exec vite preview --port 4318   # background
node .claude/skills/open-design/scripts/verify.mjs `
  --route /demo/<target-slug> --testid <target-root-testid> [--slides N] `
  --out docs/superpowers/specs/<run-slug>
```

Zero actionable findings is the exit condition (see the reading table in
`DESIGN.md` Part 2 Step 3). Keep run evidence (screenshots + `findings.json` +
a short run log: ID resolved, classification, slice list, adaptations) under
`docs/superpowers/specs/<run-slug>/`.

## Visual comparison

Open the source part once more — `/live/<experienceId>?inspect=1`, click the
part — and compare against the target screenshot:

- Geometry/idiom preserved (the thing you borrowed still reads as itself).
- Colours belong to the TARGET's mood (no stray source inks).
- Content is entirely the target's (no source words, numbers, or labels).
- Reduced motion: re-shoot with reduced motion emulated if the part animates.
