# Scaffold & Verify — from validated fill to rendered experience

This is surface-neutral: the scaffold shape is the same for every surface (a fill, a thin wrapper page, one `/demo/<slug>` route). The two places surface matters are called out inline — the wrapper's render call, and the screenshot step (per-slide for decks; viewport + full-page for single-page surfaces).

## 1. Scaffold the demo route

Reference patterns:
- **Decks:** `experiences/slide-decks/sample-payments-retry/` (the shipped reference).
- **Single-page surfaces:** render the world-template directly with a theme lock — same two-file + one-route shape. Put the run under the surface's directory: `experiences/dashboards/<slug>/`, `experiences/project-pages/<slug>/`, `experiences/personal-pages/<slug>/`, or `experiences/explainers/<slug>/`.

**`experiences/<surface-dir>/<slug>/fill.ts`** — the validated fill as a typed export. Every world fill module exports `FILL_SCHEMA` (the world's Zod schema) uniformly — parse the fill with it as the **client-side second lock**; if this throws, the fill and `validate_fill` drifted:

```ts
import { FILL_SCHEMA, type <World>Fill } from '../<template-world>/<world>-fill.js';

export const <slug>Fill: <World>Fill = FILL_SCHEMA.parse({
  // ... the exact object that passed validate_fill.
});
```

**`experiences/<surface-dir>/<slug>/<Slug>Page.tsx`** — thin wrapper, nothing but theme lock + render (copy the reference page and change names). The template's mood decides the locked theme — check the world-template descriptor's `mood` (Cutover locks `light`):

```tsx
import { useLayoutEffect } from 'react';
import <World>Template from '../<template-world>/<World>Template.js';
import { <slug>Fill } from './fill.js';

export default function <Slug>Page() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute('data-theme');
    root.setAttribute('data-theme', '<mood>');
    return () => {
      if (previous === null) root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', previous);
    };
  }, []);

  return <<World>Template fill={<slug>Fill} />;
}
```

The render call is identical across surfaces — a deck template and a single-page template both take `fill={...}`. The single-page template renders the whole page as a scroll (no `?slide=` param); the deck template renders one slide per `?slide=` query.

**Route** — in `apps/gallery/src/App.tsx`, next to the existing `/demo/mcp-sample` route (demo routes render OUTSIDE RootLayout; mirror that block exactly):

```tsx
<Route path="demo/<slug>" element={<Suspense fallback={<RouteFallback />}><<Slug>Demo /></Suspense>} />
```

(lazy-import the page the same way the neighbors do).

## 2. Build and serve the BUILT app

Screenshots must come from the production build, not the dev server:

```
corepack pnpm typecheck
corepack pnpm --filter gallery build
corepack pnpm --filter gallery exec vite preview --port 4318
```

## 3. Screenshot the experience

Copy `docs/superpowers/specs/phase-b-sample/shoot.mjs` beside your run's evidence directory and adjust `ROUTE` and the template root's stable `data-testid` (e.g. `live-cutover` for a deck, `live-studio` for a personal page). It resolves Playwright through `apps/gallery`'s manifest (do not change that part — a bare import resolves to the wrong workspace), waits for fonts + a 900ms motion settle, and shoots at 1440×900. Run from repo root: `node <evidence-dir>/shoot.mjs`.

**Screenshot count depends on the surface:**

- **Slide decks:** keep the `?slide=1..N` loop — set `SLIDE_COUNT` to the deck's slide count and shoot `slide-NN.png` per slide.
- **Single-page surfaces (dashboard / project-page / personal-page / explainer):** there are no slides. Replace the loop with **two shots** of `/demo/<slug>`:
  1. **Viewport** at 1440×900 (`fullPage: false`) → `viewport.png` — the above-the-fold first impression.
  2. **Full page** at full scroll height (`fullPage: true`) → `full-page.png` — the whole visit end to end.

  ```js
  await page.goto(`${BASE}${ROUTE}`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-testid="<template-root-testid>"]', { timeout: 15_000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(here, 'viewport.png') });
  await page.screenshot({ path: path.join(here, 'full-page.png'), fullPage: true });
  ```

Evidence directory convention: `docs/superpowers/specs/<slug>-sample/` — holds `source-context.md`, `mcp-outcome.json`, the validate result, `shoot.mjs`, and the screenshots.

## 4. Content-fit checklist (read every screenshot)

Design quality is the template's job — you are checking that YOUR CONTENT sits well in it. For decks, run this per slide; for single-page surfaces, run it against the viewport and full-page shots.

- **Template leak (check FIRST):** read every word on every slide/section and ask "did I author this?" Any sentence you didn't write is shipped-instance story leaking from the template — a template defect, even when it happens to sound plausible. (The OpenWiki run caught four of these: an anomaly echo line, a runbook summary paragraph, a derived-looking kicker, and six editorial headlines.)
- **Overflow/truncation:** no clipped text, no ellipsis you didn't write, no wrapped display type breaking the type ramp.
- **Orphans in display type:** no single-word last lines in titles/headlines; rephrase, don't restyle.
- **Density:** nothing that reads empty (slot much shorter than its example's magnitude) or crammed (items at max where the example used fewer) — compare against the skeleton examples.
- **Tone vs audience answer:** an exec deck reads in outcomes, an engineering deck in mechanisms; check every headline against the recorded audience.
- **Arc order (decks):** flip the screenshots in sequence — does the story build? Would a stranger know after slide 2 why they should care?
- **Coherent visit (single-page):** read the full-page shot top to bottom — does the page read as one continuous visit that hands the reader section to section, or as a form someone filled in box by box? Each section should lead into the next; a page that reads as disconnected filled tiles is a content-fit failure (usually a section that doesn't earn its place — revisit the Phase 3 section map).
- **Anomaly reads honest:** the flagged item looks like a real caveat, not decoration.
- **Provenance visible:** the notice slot renders and covers every invented figure (for dashboards, that the synthetic-data notice is present and unmissable).
- **Numbers agree:** any figure appearing twice matches exactly.

Findings here are CONTENT findings → fix the fill (Phase 4), re-validate (Phase 5), rebuild, re-shoot. If a finding is genuinely about the template (craft breaks even with in-spec content), stop and report it as template work — do not hand-edit rendered output or template code inside a run.
