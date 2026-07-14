# Scaffold & Verify — from validated fill to rendered deck

## 1. Scaffold the demo route

Pattern lives at `experiences/slide-decks/sample-payments-retry/` (the shipped reference). Two files + one route line:

**`experiences/slide-decks/<slug>/fill.ts`** — the validated fill as a typed export:

```ts
import { <World>FillSchema, type <World>Fill } from '../<template-world>/<world>-fill.js';

export const <slug>Fill: <World>Fill = <World>FillSchema.parse({
  // ... the exact object that passed validate_fill — client-side Zod parse
  // is the second lock; if this throws, the fill and validation drifted.
});
```

**`experiences/slide-decks/<slug>/<Slug>Page.tsx`** — thin wrapper, nothing but theme lock + render (copy `SamplePage.tsx` and change names). The template's mood decides the locked theme — check the world-template descriptor's `mood`; Cutover locks `light`:

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

**Route** — in `apps/gallery/src/App.tsx`, next to the existing `/demo/mcp-sample` route (demo routes render OUTSIDE RootLayout; mirror that block exactly):

```tsx
<Route path="/demo/<slug>" element={<<Slug>Page />} />
```

(lazy-import the page the same way the neighbors do).

## 2. Build and serve the BUILT app

Screenshots must come from the production build, not the dev server:

```
corepack pnpm typecheck
corepack pnpm --filter gallery build
corepack pnpm --filter gallery exec vite preview --port 4318
```

## 3. Screenshot every slide

Copy `docs/superpowers/specs/phase-b-sample/shoot.mjs` beside your run's evidence directory and adjust `ROUTE`, `SLIDE_COUNT`, and the deck's stable testid (the template root's `data-testid`, e.g. `live-cutover`). It resolves Playwright through `apps/gallery`'s manifest (do not change that part — a bare import resolves to the wrong workspace), shoots `?slide=1..N` at 1440×900 after fonts + a 900ms motion settle. Run from repo root:

```
node <evidence-dir>/shoot.mjs
```

Evidence directory convention: `docs/superpowers/specs/<slug>-sample/` — holds `source-context.md`, `mcp-outcome.json`, the validate result, `shoot.mjs`, and `slide-NN.png`.

## 4. Content-fit checklist (read every screenshot, per slide)

Design quality is the template's job — you are checking that YOUR CONTENT sits well in it:

- **Template leak (check FIRST):** read every word on every slide and ask "did I author this?" Any sentence you didn't write is shipped-instance story leaking from the template — a template defect, even when it happens to sound plausible. (The OpenWiki run caught four of these: an anomaly echo line, a runbook summary paragraph, a derived-looking kicker, and six editorial headlines.)
- **Overflow/truncation:** no clipped text, no ellipsis you didn't write, no wrapped display type breaking the type ramp.
- **Orphans in display type:** no single-word last lines in titles/headlines; rephrase, don't restyle.
- **Density:** no slide that reads empty (slot much shorter than its example's magnitude) or crammed (items at max where the example used fewer) — compare against the skeleton examples.
- **Tone vs audience answer:** an exec deck reads in outcomes, an engineering deck in mechanisms; check every headline against the recorded audience.
- **Arc order:** flip the screenshots in sequence — does the story build? Would a stranger know after slide 2 why they should care?
- **Anomaly reads honest:** the flagged item looks like a real caveat, not decoration.
- **Provenance visible:** the notice slot renders and covers every invented figure.
- **Numbers agree:** any figure appearing on two slides matches exactly.

Findings here are CONTENT findings → fix the fill (Phase 4), re-validate (Phase 5), rebuild, re-shoot. If a finding is genuinely about the template (craft breaks even with in-spec content), stop and report it as template work — do not hand-edit rendered output or template code inside a deck run.
