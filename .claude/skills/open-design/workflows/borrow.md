# BORROW workflow — one part of a live world → adapted into another experience

Take one identified part of a shipped live world — a diagram, a chart treatment, an animation wrapper — and adapt its craft into a target experience in this repo. **The part ID is the contract:** `<experienceId>/<sectionKind>[/<partName>]`, anchored as a `data-part-id` attribute in the source template, surfaced by the gallery's part inspector (toggle on any `/live/*` or `/demo/*` page), and locked by `apps/gallery/src/routes/LivePartIds.test.tsx`. The canonical request shape is `Borrow part <id> using the open-design skill.`

**Hard boundaries (read first):**
- **Never edit the source world.** The borrow is a copy-and-adapt; `git status` under the source experience directory must stay empty for the whole run. If the part cannot be adapted without changing its source, stop and report it as template work.
- **Borrow structure, animation, and treatment — never shipped content.** The source world's text, data, and figures stay behind; the target supplies its own. (Copying editorial content trips the certifier's leak scan and misrepresents the shipped world.)
- **Repo-internal only.** Source and target both live in this repo's `experiences/` tree.
- **Never cross-import between experience directories.** Copy the code into the target; the only shared code is packages (`@enterprise-design/*`) and, within slide-decks, `_deck-kit`.

## Phase 0 — Resolve

Parse the part ID: segment 1 is the `experienceId`. Locate the source:

1. Glob `experiences/*/<experienceId>/` — its surface directory and file set.
2. Grep that directory's `.tsx` files for the ID: either the exact literal (`data-part-id="<id>"` or `partId="<id>"`) or, for section roots, the dynamic site (`` data-part-id={`<experienceId>/${...}`} `` — the anchor is the element rendering that section kind).
3. Identify the anchored JSX element and the sibling CSS file (`<xxx>.css`).

If the ID resolves nowhere, the contract is broken — stop and report (check `LivePartIds.test.tsx` for the current contracted list).

**Exit:** source file, anchor element, and CSS file named.

## Phase 1 — Classify

Look at what the anchored subtree actually is:

- **Import, not copy:** if the subtree is essentially one registered component usage (check `packages/registry/generated/components.json` — `id`, `sourcePath`, `exportName`), the borrow is an import of that package export into the target, plus optionally the thin framing wrapper/CSS around it. Skip Phase 2's slicing for the component itself.
- **Slice:** anything bespoke (an inline SVG, a hand-built grid, an animation wrapper) — proceed to Phase 2.

**Exit:** classification stated (import / slice / mixed).

## Phase 2 — Slice

Extract the minimal closure of the part, following `references/slicing-and-adapting.md`:

1. The anchor's JSX subtree.
2. Every local helper it transitively references (components, functions, consts, types) — walk the identifiers; take `Build`-style wrappers, layout engines, and geometry consts with it.
3. Every CSS class the subtree uses: copy only those rule blocks from the source CSS — including their `@keyframes` and `@media (prefers-reduced-motion)` companions.
4. The package imports the closure needs (`@enterprise-design/motion`, `@enterprise-design/diagrams`, …) — re-declared in the target, never re-exported from the source.

**Exit:** a self-contained slice list (JSX + helpers + CSS blocks + imports).

## Phase 3 — Adapt

Fit the slice to the target experience:

- **Rename the CSS prefix** from the source's (e.g. `cu-`) to the target's — every class in both the copied CSS and JSX.
- **Colours:** keep semantic theme tokens as-is; re-tune raw art-layer colour values to the target's locked mood (each world's mood is in `apps/gallery/src/data/live.ts` / `LIVE_PAGES`).
- **Motion:** keep `useMotionPreference()` gating and reduced-motion CSS intact — a borrowed animation must still collapse correctly.
- **Content:** replace every content reference (fill fields, shipped strings, data arrays) with the target's own data. If the target is templatized, the borrowed part's content must come from the target's fill.
- **Do not** leave a stray `data-part-id` from the source on the copied markup — the ID belongs to the source world. (The target may earn its own part IDs later, under its own experienceId prefix.)

**Exit:** the part renders in the target from target-owned content.

## Phase 4 — Verify

Follow `references/borrow-verify.md`. Non-negotiable gates:

1. `corepack pnpm typecheck` clean.
2. `corepack pnpm --filter gallery exec vitest run src/test/part-ids-static.test.ts src/routes/LivePartIds.test.tsx` green (the borrow must not disturb the contract).
3. **Source untouched:** `git status --porcelain experiences/<surface>/<experienceId>` prints nothing.
4. Build + preview + screenshot the target route; compare the borrowed part side-by-side with the source (`/live/<experienceId>?inspect=1` finds it again).
5. **Quality gate:** the adaptation is where slop creeps in, so check the gates from `references/quality-gates.md` that adaptation can break — contrast of every re-tuned colour against the target mood (ink-on-ink, text ≈ fill), motion collapses correctly under reduced-motion, and token discipline (no stray one-off hex introduced during the re-tune; new values join the target's token/variable block). Then run the pre-emit self-critique (six axes, 1–5) on the side-by-side screenshot — any axis < 3 → revisit Phase 3 before reporting.

**Exit:** report — target route, screenshot paths, the gate results, the critique scores, and any adaptation notes (what was re-tuned and why).
