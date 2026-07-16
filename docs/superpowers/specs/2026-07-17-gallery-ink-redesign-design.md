# Gallery Ink — chrome redesign + IA refresh

**Approved 2026-07-17** (visual companion session: `visual-direction.html`, `gallery-ink-landing.html`).
Branch: `feat/gallery-ink-redesign`. Scope: the gallery chrome only — **no template/world pixels change**.

## Why

- "Browse" and "Templates" in the nav point at the same page; Blueprint Lab ships as a stub;
  Components/Grammars/Guide are thin metadata pages in internal vocabulary.
- The MCP/skill story is invisible: samples hide at unlisted `/demo/*` routes and nothing
  explains that an AI composes these templates.
- The chrome is generic Tailwind-neutral while the templates one click away carry locked
  art direction — a design gallery showing zero pixels of design.

User decisions: keep the current page skeleton (corporate-credible), remove "Browse by
template type" + "Featured collections", 4-tab IA, brand **OpenDesign**, direction
**A — Gallery Ink**, previews = **static screenshots + live iframe on hover**.

## Information architecture

| Tab (nav) | Route | Content |
| --- | --- | --- |
| Gallery (home) | `/` | Current landing skeleton: hero + search → facet sidebar + catalogue grid. Shortcuts + collections rows removed. Bottom band CTA → Make your design. |
| Make your design | `/make` | For a visitor: pick a template → connect the MCP server or run the skill → describe your content → get your design. Paste-ready snippets; borrow-a-part mention; links to Showcase. |
| Showcase | `/showcase` | The MCP/skill-generated samples as a visual grid: screenshot, which template it was composed into, which tool/skill made it, link to the live route. Data in `data/samples.ts`. |
| Contribute | `/contribute` | The technical story: doctrine (world-templates + fills + certifier), components grid (absorbs `/components`), grammars grid (absorbs `/grammars`), part-ID/borrow contract, how to add a world (GUIDANCE.md pointer), repo link. |

Redirects (no link rot): `/browse` → `/` (query preserved), `/components` → `/contribute`,
`/grammars` → `/contribute`, `/guide` → `/contribute`, `/blueprint-lab` → `/make`.
Detail routes stay: `/templates/:id`, `/components/:id`, `/grammars/:id`, `/live/:id`, `/demo/*`.

Brand: header wordmark **Open*Design*** (serif, italic accent) + mono tagline
"A GALLERY OF LIVING TEMPLATES". Footer restyled to match.

## Visual direction — Gallery Ink

A design museum's catalogue: warm paper, ink text, serif display, exhibition-label mono
captions, one vermilion accent. Quiet motion. Corporate-credible, not loud.

**Theme tokens** — new theme pair `gallery-ink-light` / `gallery-ink-dark` in
`packages/themes` (same token contract; enterprise-neutral stays shipped). The gallery's
`index.css` imports the ink pair instead of neutral. Safe at `:root`: experiences use
zero themed tokens (verified by grep). Chart/status/diagram token values stay identical
to enterprise-neutral so registered components inside worlds do not shift.

- Light: base `#faf7f1` paper, raised white, warm hairline borders, ink text ramp,
  vermilion accent (exact values tuned until the themes contrast suite passes AA).
- Dark: warm charcoal ink counterpart, brighter vermilion for AA.

**Type**: display/heading = **Fraunces** (variable, via `@fontsource-variable/fraunces`),
re-valued through the existing `--font-display`/`--font-heading` tokens in the gallery
stylesheet only; body stays the sans stack; labels use the existing mono stack.
Experiences load their own fonts and are unaffected (verified by grep).

**Motion** (all gated by `useMotionPreference`): catalogue cards settle in with a quiet
stagger on scroll (IntersectionObserver); hover lifts the framed card and reveals an
"OPEN LIVE ▸" tag; reduced motion collapses both.

## Preview pipeline (cards stop being text-only)

- `apps/gallery/scripts/shoot-previews.mjs`: builds are assumed done; serves `dist` via
  `vite preview`, shoots every live world (`LIVE_EXPERIENCE_IDS`, 33) and every demo
  sample route at 1280×800, JPEG q75, to `apps/gallery/public/previews/<id>.jpg`
  (~60–120 KB each, committed). Per-id overrides (e.g. a deck's most representative
  slide) live in a map at the top of the script. Re-run when templates change.
- `PreviewImage` component: `<img src="/previews/<id>.jpg">` with graceful fallback to
  the current text-only card top when the file is missing (404 → onError hides the img).
- **Live hover upgrade**: after ~600 ms of hover/focus on a card with a live route, the
  static image swaps to a scaled `<iframe src="/live/<id>">` (one at a time, destroyed on
  leave; skipped for reduced motion and touch).

## Page-by-page

- **Landing**: remove `TemplateShortcuts` + `FeaturedCollections` (components deleted);
  keep Hero skeleton (eyebrow/headline/sub/search/suggested), re-inked with serif
  headline "Every template here is alive."; keep RecentlyViewedRow (renders only when
  non-empty), facets, segmented control, sort, QuickPreviewDrawer; ResultCard becomes a
  framed print: preview image → serif title + LIVE tag → mono meta → 2-line description.
  Blueprint Lab band → "Found your template? → Make your design".
- **TemplateDetail**: adds the preview image as a hero figure; Gallery Ink styling; the
  "Open live template" action stays primary.
- **ComponentDetail / GrammarDetail**: restyled by the token/type swap; back-links now
  point at `/contribute`.
- **Header/Footer/Page scaffold/NotFound/RouteFallback**: re-inked.
- **Components.tsx / Grammars.tsx / Guide.tsx / BlueprintLab.tsx**: deleted; their
  content lives on as Contribute sections (components + grammars grids reuse the same
  card markup).

## Tests

- Update: `Landing.test.tsx` (removed sections, new copy), `landing.spec.ts` e2e (new
  hero copy; same behavioural assertions), header/nav assertions where they exist.
- New: redirect tests (all five legacy routes land on their new homes, `/browse?q=x`
  preserves the query); `samples.test.ts` — every Showcase entry's route exists in
  `App.tsx` and its preview image file exists; PreviewImage fallback test.
- Unchanged and must stay green: world contract suites, part-id suites, certifier,
  CSS parity oracles, live-deck e2e specs.

## Gates (Definition of Done)

`corepack pnpm lint` · `typecheck` · `test` · `--filter gallery e2e` · themes contrast
suite green with the ink pair · screenshot evidence (landing light/dark, showcase, make,
contribute) in `docs/superpowers/specs/gallery-ink-redesign/` · worlds untouched:
`git status --porcelain experiences/` empty except intentional none.

## Out of scope

Template/world changes; MCP server changes; mobile nav drawer (the current md-breakpoint
behaviour is kept); merging to main (feature branch only, per user).

## Implementation order

1. Theme pair + fonts (tests drive the palette).
2. Preview pipeline: script + committed images (build once, shoot all).
3. IA: routes, redirects, Header/Footer, delete stub pages.
4. Landing + ResultCard + motion.
5. Showcase (+ `data/samples.ts`), Make, Contribute.
6. Detail pages + drawer restyle; live-hover iframe upgrade.
7. Test updates + new suites; gates; evidence; push branch.
