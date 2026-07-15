# GUIDANCE.md — Working standard for this repo

Notes from Fable to whoever works here next (written for Claude Opus, useful to any
agent or human). I'm handing this codebase over mid-stride: everything on `main` is
green and shipped, and the conventions below are the reason it stayed that way. Read
this before your first change. When in doubt, the standard is: **evidence over
assertion, contracts over convention, and the rendered pixels are the truth.**

---

## 1. Mental model — what this repo IS

A pnpm monorepo that turns one design system into five composable surfaces:

```
apps/gallery          React 19 + Vite gallery; catalogue routes + full-bleed /live/* worlds + /demo/* outputs
apps/mcp-server       MCP tools: search/get/compose/validate over the compiled registry
packages/contracts    Zod contracts: ComponentManifest, WorldTemplateDescriptor (sections, slots, craft rules)
packages/registry     Compiles *.manifest.ts → generated/*.json; certifier; scaffolder CLIs
packages/design-tokens, themes, primitives, motion, content-components, data-viz, diagrams
experiences/<surface>/<experienceId>/   The 30+ live worlds — the actual craft
```

**The doctrine (this is the whole architecture, internalize it):** division of labor.
- A **world-template** (`XxxTemplate.tsx` + its CSS) carries ALL the craft — layout,
  color, motion, geometry. It renders from a typed **fill** (content slots only).
- The **fill** carries ALL the content. `content.ts` exports `SHIPPED_FILL`;
  `<id>-fill.ts` exports `FILL_SCHEMA` + `SECTIONS` in lockstep with the descriptor.
- **MCP compose tools** select one template deterministically and hand back a fill
  skeleton. **Skills** (`experience-composer`, `design-borrow`) orchestrate runs.
- During a compose or borrow run you NEVER write CSS/layout/motion and NEVER edit a
  shipped world's TSX/CSS. A design flaw found mid-run is template work: stop, report.

A world directory looks like:

```
experiences/slide-decks/deck-cloud-migration/
  CutoverPage.tsx                     thin wrapper (~15 lines): hands SHIPPED_FILL to the template
  CutoverTemplate.tsx                 the craft (~1200 lines of bespoke JSX/SVG)
  cutover.css                         experience-local art layer
  cutover-fill.ts / content.ts        FILL_SCHEMA + SECTIONS / SHIPPED_FILL
  *.worldtemplate.manifest.ts         descriptor for MCP composition
  *.experience.manifest.ts            catalogue metadata
  leak-allowlist.json                 (optional) chrome strings the leak scan may ignore
```

The registry compiles all manifests into `packages/registry/generated/*.json`.
That directory is **generated, not committed** — run `corepack pnpm run registry:build`
after every clone and after touching any manifest (`pretest` does it automatically).

---

## 2. Contracts you must never break silently

These are enforced by tests. When a contract fights you, the answer is never to
loosen the test quietly — either your change is wrong, or the contract needs a
deliberate, documented amendment in the same commit.

1. **Certifier** (`packages/registry/src/certify.ts`, CLI:
   `corepack pnpm --filter @enterprise-design/registry certify`). Per world:
   descriptor parses; fill schema + SECTIONS in lockstep with descriptor sections;
   `SHIPPED_FILL` parses; every slot resolves; slot limits + craft rules hold; **no
   editorial text hardcoded in the template** (leak scan — chrome goes in
   `leak-allowlist.json`, sparingly); no `AUTHOR:` markers.

2. **Part IDs are a public borrow contract.**
   `data-part-id="<experienceId>/<sectionKind>[/<partName>]"`, anchored in template
   source so they travel with the code. Rules: segment 1 = the experience directory
   name; literals unique per experience; containers carry IDs, repeated children
   never do; curated granularity (5–15 per world — section roots + genuinely
   borrow-worthy parts). Enforced by `apps/gallery/src/test/part-ids-static.test.ts`
   (every experience) and `apps/gallery/src/routes/LivePartIds.test.tsx` (exact
   per-world lists). Renaming/removing an ID updates that test **in the same
   commit**. Never copy a source `data-part-id` into borrowed markup.

3. **Demo routes are not catalogue templates.** `/demo/*` outputs get no experience
   manifest, no `live.ts` entry, no approval flag.

4. **Parity is sacred during refactors.** Templatizing a page must render
   byte-for-byte what the page rendered before (the `LiveWorlds*` +
   `apps/gallery/e2e/live-*` suites are the oracles). Attribute-only changes are the
   only "free" edits.

---

## 3. The working loop — how to run a task

**a. Re-verify everything you think you know.** This repo moves fast — parallel
sessions land whole subsystems between your plan and your implementation. Real
examples: my implementation plan said "the certifier doesn't exist yet, write a
standalone test"; by implementation day the certifier had landed. The cockpit was a
plain page during exploration and a fully templatized world two hours later. **Read
the current source before acting on any plan, memory, or summary — including this
file.** Cheap greps beat wrong assumptions.

**b. Plan, then work the plan as tasks.** One reviewable commit per task
(`feat(scope): …`, `fix(scope): …`, `test(scope): …`). Each commit leaves the repo
green. If you find yourself bundling unrelated fixes, split.

**c. Tests are part of the feature, and you must test the tests.** When you add a
contract (new IDs, new manifest field), add the suite in the same task — then
**break it on purpose once** (mutate an ID, watch the exact failure message, revert).
A guard that has never fired is a hope, not a gate.

**d. Drive the real thing before claiming done.** Green unit tests are necessary,
not sufficient. The one real bug in the borrow-a-part feature shipped past 7 passing
unit tests and 3 careful screenshots: the inspector's floating button occluded the
deck's "Next slide" button, and only a full e2e *click* caught it. Build, serve,
click through the actual routes:

```powershell
corepack pnpm --filter gallery build
corepack pnpm --filter gallery exec vite preview --port 4318   # background
# then click through, and screenshot via the shoot.mjs pattern (see §6d)
```

**e. Debugging discipline.** When a test fails:
- Reproduce **in isolation** first (`vitest run <file>`, `playwright test <spec>`).
  Full-suite runs on a loaded machine produce timeout flakes that vanish alone;
  a deterministic failure survives isolation. Run twice before concluding "flake".
- Decide "my change vs pre-existing" with **import-graph reasoning**: if nothing in
  the failing test's import closure is in your diff
  (`git diff <base>..HEAD --name-only`), it isn't yours — prove it and say so
  explicitly in your report. Never silently ignore it, never silently "fix" it
  either.
- Fix causes, not symptoms. The occlusion fix was moving the button out of template
  territory (a design decision, documented in a comment), not adding a wait to the
  test.

**f. Keep evidence.** Every skill run and nontrivial feature leaves screenshots + a
short run log in `docs/superpowers/specs/<run-slug>/` (see
`docs/superpowers/specs/borrow-pilot/RUN-LOG.md` for the shape: what was resolved,
what was adapted, which gates passed). Future-you reconstructs decisions from these.

**g. Report honestly.** The deck-composer "honesty rule" applies to everything: if a
fit is weak, a gate was skipped, or a flake was tolerated — say so plainly in the
commit/report. Never force a bad fit silently.

---

## 4. Definition of Done — the gates

All of these, in this order, before "done":

```powershell
corepack pnpm run registry:build                                  # after any manifest change
corepack pnpm typecheck
corepack pnpm lint                                                # zero errors; hooks rules are strict (§5g)
corepack pnpm test                                                # full unit suites (pretest rebuilds registry)
corepack pnpm --filter @enterprise-design/registry certify        # 0 findings across all worlds
corepack pnpm --filter gallery build
corepack pnpm --filter gallery e2e                                # 42+ Playwright specs, REBUILD FIRST (§7d)
```

If a gate fails on something outside your diff, apply §3e: isolate, prove
provenance, report. Known pre-existing conditions are listed in §7.

---

## 5. The design quality bar (the craft rules)

This is where "Fable-level output" lives. The gallery's worlds are art-directed to a
bank-credible standard; hold the line.

a. **Art-direction licence.** Raw colour values are permitted ONLY in a world's own
   `*Template.tsx` / `*Page.tsx` + sibling `.css` (the "experience-local art
   layer"). Everything else — shared components, chrome, overlays — consumes theme
   tokens (`var(--…)`). When borrowing across moods, re-tune raw inks deliberately,
   in one `INK`-style map, never scattered.

b. **Motion comes from tokens.** Durations/easings are `var(--dur-*)` /
   `var(--ease-*)` from `packages/motion` + `packages/primitives/src/tailwind-theme.css`.
   Never ad-hoc cubic-beziers. Signature sequences respect
   `SIGNATURE_SEQUENCE_CAP_MS` (1200ms) and `REDUCED_MOTION_CAP_MS` (400ms).

c. **Reduced motion is part of every animation, not an afterthought.** Every
   animated pattern has three legs: the `useMotionPreference()` gate in JSX, a
   `data-reduced` attribute hook, and a `@media (prefers-reduced-motion: reduce)`
   override. Tests assert the reduced variant renders the FULL content (no
   information lives only in motion).

d. **Accessibility is asserted, not aspired to.** Every world has an axe suite.
   Charts/diagrams carry text mirrors (`VisuallyHidden`, table mirrors); status is
   letter-coded, never colour-alone; interactive things have real roles and
   accessible names (note: a glyph child becomes the accessible name — use
   `aria-label` on icon buttons).

e. **Worlds lock their mood.** `LiveExperience` pins `data-theme` per world.
   Anything global that floats above worlds (like the PartInspector) must be
   **theme-independent** (hardcoded, contrast-checked on both moods) — and must be
   verified on a dark world AND a light world.

f. **Template chrome owns the page corners.** Deck nav arrows, notices, and counters
   live in the corners of live pages. Global floating UI goes to the right edge,
   vertically centred. (Learned the hard way — see §3d.)

g. **React discipline the linter enforces:** no ref writes during render; no
   synchronous `setState` in effects — use lazy `useState` initializers and the
   adjust-state-during-render pattern (see `PartInspector.tsx` for a worked
   example); everything keyed properly. Also: `useDeckNavigation` **rewrites the
   query string on every slide turn** — never treat the URL as state storage on live
   pages; read params once on entry.

h. **Anchor conventions:** `data-testid` for behavior/test anchors, `data-part-id`
   for borrow anchors, `data-*` state attributes (`data-state`, `data-status`,
   `data-reduced`) for styling hooks. All three are load-bearing; keep them stable.

---

## 6. Recipes

### a. New feature in the gallery/harness
1. Explore current source (assume your priors are stale — §3a).
2. Write the plan; break into committable tasks.
3. Contract tests first or alongside; negative-test them (§3c).
4. Implement; run gates (§4); drive the real UI (§3d).
5. Document: a `docs/<feature>.md` note (see `docs/borrow-a-part.md` for the bar) +
   evidence directory.

### b. Templatizing a world / adding a world-template
Follow the ingestion chain: `corepack pnpm --filter @enterprise-design/registry scaffold-template`
proposes fill + manifest skeletons; extracting `Template.tsx` from `Page.tsx` is
human craft (parity-oracle protected). Fill schema and SECTIONS in lockstep with the
descriptor; certify to 0 findings; leak-allowlist only genuine chrome; then add
`data-part-id` anchors + a `LivePartIds.test.tsx` entry. Study
`deck-cloud-migration/` as the reference world.

### c. Composing a sample experience
Use the `experience-composer` skill (`.claude/skills/`). One compose call per
experience; author every slot from source content; `validate_fill` loop max 3
rounds; scaffold a `/demo/<slug>` route; screenshot every state.

### d. Borrowing a part
Use the `design-borrow` skill: Resolve → Classify (registered `comp.*` components
are IMPORTED, bespoke code is SLICED) → Slice (closure walk: JSX subtree +
transitive helpers + CSS blocks incl. keyframes and reduced-motion legs) → Adapt
(prefix rename, ink re-tune, target-owned content, keep motion gates) → Verify
(four gates incl. `git status --porcelain` EMPTY on the source world). Screenshot
rig pattern: `docs/superpowers/specs/borrow-pilot/shoot.mjs`.

### e. Inspecting parts in the browser
Any `/live/*` or `/demo/*` route → the ⌖ toggle (right-center) or `?inspect=1` →
click a part → copy the borrow command. Escape exits; arrow keys still turn slides.

---

## 7. Environment gotchas (Windows / this machine class)

a. **Fresh clone bootstrap:** `corepack pnpm install`, then
   `corepack pnpm run registry:build` (typecheck fails without the generated JSON).

b. **CRLF smudge breaks generated-CSS parity tests.** There is no `.gitattributes`;
   a fresh checkout with `autocrlf` converts committed LF files to CRLF and
   `packages/design-tokens` + `packages/themes` byte-parity tests fail with a diff
   where every line looks identical. Fix: run each package's generator
   (`corepack pnpm --filter @enterprise-design/design-tokens generate:css`, same for
   `themes`) — it rewrites LF and `git status` stays clean. (Adding `.gitattributes`
   with `* text=auto eol=lf` for these files would fix it permanently — do it if it
   bites you twice.)

c. **`Landing.test.tsx` times out on slow machines** (user-event + axe over the
   60-card landing). Pre-existing; verify in isolation before investigating.

d. **Playwright reuses an existing server on port 4318** (`reuseExistingServer`).
   If you've been iterating with `vite preview`, **rebuild `dist/` before e2e** or
   you'll test stale code. Same trap in reverse: the preview server serves whatever
   is in `dist/`, so after any source change, rebuild before screenshotting.

e. **Vitest roots at the repo root.** Run gallery suites as
   `corepack pnpm --filter gallery exec vitest run <path-relative-to-apps/gallery>`.

f. **Git hygiene in a multi-session repo:** never bare `git stash` (the stash stack
   is shared across worktrees and concurrent sessions) — prefer a WIP commit. Before
   touching a branch, check whether another session has uncommitted changes on it
   (`git status` in the primary checkout); isolate in a worktree if so. The remote
   is `https://github.com/nick-nguyen-ai/open-design` (private); `main` is the
   integration branch.

---

## 8. How to think (the part that isn't mechanical)

- **Distrust green.** Passing tests tell you what the tests cover, nothing more.
  Ask "what would this look like broken?" and go look at that state directly.
- **Prefer contracts anchored in source over side-band documentation.** An attribute
  in the template, a zod schema, a locked test — these survive refactors; prose
  doesn't. When you write prose (like this file), point it at the source of truth.
- **When a rule fights reality, stop and surface it.** Don't patch around a
  certifier finding, a lint rule, or a locked test. Either the change is wrong or
  the contract needs a deliberate amendment — both deserve a sentence in the commit.
- **Name the blast radius before acting.** Before a merge, list the divergent files.
  Before moving UI, ask what already lives there. Before deleting, read what you're
  deleting.
- **Small, honest, evidenced steps compound.** Seven small commits with screenshots
  beat one heroic commit with a paragraph of claims. If a step was skipped, the
  report says so.

Reading list, in order: `packages/contracts/src/world-template.ts` →
`packages/registry/src/certify.ts` → `experiences/slide-decks/deck-cloud-migration/`
(the reference world) → `.claude/skills/design-borrow/SKILL.md` +
`.claude/skills/deck-composer/SKILL.md` → `docs/borrow-a-part.md` →
`docs/superpowers/specs/*.md` (the design specs that grew this repo).

Have a good run. Leave it greener than you found it. — Fable
