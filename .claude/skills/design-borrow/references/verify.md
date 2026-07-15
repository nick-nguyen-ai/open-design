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

## Screenshot the target

Copy the screenshot rig pattern from
`docs/superpowers/specs/phase-b-sample/shoot.mjs` (Playwright against
`vite preview`): serve the built gallery on a fixed port, `page.goto` the
target route, screenshot each state you borrowed into (for decks: the slide
carrying the part; use `?slide=N`).

```powershell
corepack pnpm --filter gallery exec vite preview --port 4318   # background
node <your-shoot-script>.mjs                                   # writes PNGs
```

Keep run evidence (screenshots + a short run log: ID resolved, classification,
slice list, adaptations) under `docs/superpowers/specs/<run-slug>/`.

## Visual comparison

Open the source part once more — `/live/<experienceId>?inspect=1`, click the
part — and compare against the target screenshot:

- Geometry/idiom preserved (the thing you borrowed still reads as itself).
- Colours belong to the TARGET's mood (no stray source inks).
- Content is entirely the target's (no source words, numbers, or labels).
- Reduced motion: re-shoot with reduced motion emulated if the part animates.
