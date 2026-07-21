# Grammar Tab Specimens Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Grammar cards, quick-preview drawer, and grammar detail pages show real design pixels â€” the same specimen content rendered per grammar â€” visible on localhost.

**Architecture:** A new `GrammarSpecimen` component resolves `previews/grammar-<id>.jpg` with a two-step fallback (first example screenshot, then nothing over the existing plate). Card/drawer/detail wire it in. Specimen assets: 5 copied from the existing dgm bake-off shots now; 10 composed offline later (Task 6, per-grammar open-design COMPOSE runs).

**Tech Stack:** React 18 + Vite gallery app, vitest + @testing-library/react (jsdom), Playwright shoot script, enterprise-design MCP (Task 6 only).

**Spec:** `docs/superpowers/specs/2026-07-21-grammar-tab-specimens-design.md`

## Global Constraints

- Specimen asset path: `apps/gallery/public/previews/grammar-<grammarId>.jpg`, 1280Ã—800 jpeg q75 (same contract as `shoot-previews.mjs`).
- Never render an empty preview frame for a grammar: specimen â†’ first resolvable example screenshot â†’ accent plate (already beneath).
- No new live worlds, routes, or registry entries; Templates tab untouched.
- Test command (from repo root): `corepack pnpm --filter gallery test` (or targeted: `corepack pnpm --filter gallery exec vitest run --root ../.. apps/gallery/src/components/GrammarSpecimen.test.tsx`).
- Commit trailer: `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: `GrammarSpecimen` component + fallback helper

**Files:**
- Create: `apps/gallery/src/components/GrammarSpecimen.tsx`
- Test: `apps/gallery/src/components/GrammarSpecimen.test.tsx`

**Interfaces:**
- Consumes: `grammarById`, `experienceById` from `../data/registry.js`.
- Produces: `GrammarSpecimen({ grammarId, alt, className })` React component; `specimenFallbackId(grammarId: string): string | null` (exported for tests and reuse).

- [ ] **Step 1: Write the failing test**

```tsx
// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import '../test/jest-dom-setup.js';
import { GrammarSpecimen, specimenFallbackId } from './GrammarSpecimen.js';

afterEach(cleanup);

describe('specimenFallbackId', () => {
  it('returns the first example experience that exists in the registry', () => {
    expect(specimenFallbackId('neon-circuit')).toBe('deck-dgm-circuit');
  });

  it('returns null for an unknown grammar', () => {
    expect(specimenFallbackId('not-a-grammar')).toBeNull();
  });
});

describe('GrammarSpecimen', () => {
  it('renders the specimen preview path first', () => {
    const { container } = render(<GrammarSpecimen grammarId="neon-circuit" alt="" />);
    expect(container.querySelector('img')).toHaveAttribute('src', '/previews/grammar-neon-circuit.jpg');
  });

  it('falls back to the first example screenshot when the specimen is missing', () => {
    const { container } = render(<GrammarSpecimen grammarId="neon-circuit" alt="" />);
    fireEvent.error(container.querySelector('img')!);
    expect(container.querySelector('img')).toHaveAttribute('src', '/previews/deck-dgm-circuit.jpg');
  });

  it('renders nothing when specimen and example are both missing', () => {
    const { container } = render(<GrammarSpecimen grammarId="neon-circuit" alt="" />);
    fireEvent.error(container.querySelector('img')!);
    fireEvent.error(container.querySelector('img')!);
    expect(container.querySelector('img')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm --filter gallery exec vitest run --root ../.. apps/gallery/src/components/GrammarSpecimen.test.tsx`
Expected: FAIL â€” cannot resolve `./GrammarSpecimen.js`.

- [ ] **Step 3: Write the implementation**

```tsx
import { useState } from 'react';
import { experienceById, grammarById } from '../data/registry.js';

/** The example experience whose screenshot backs a grammar when its specimen shot is missing. */
export function specimenFallbackId(grammarId: string): string | null {
  const grammar = grammarById.get(grammarId);
  return grammar?.exampleExperienceIds.find((id) => experienceById.has(id)) ?? null;
}

export interface GrammarSpecimenProps {
  grammarId: string;
  alt: string;
  className?: string;
}

/**
 * The grammar's specimen shot â€” the same content rendered in this grammar
 * (`/previews/grammar-<id>.jpg`). Falls back to the grammar's first example
 * screenshot, then to nothing, so callers keep their plate underneath
 * (same layering contract as `PreviewImage`).
 */
export function GrammarSpecimen({ grammarId, alt, className }: GrammarSpecimenProps) {
  const [source, setSource] = useState<'specimen' | 'example' | 'none'>('specimen');
  const exampleId = specimenFallbackId(grammarId);
  const id = source === 'specimen' ? `grammar-${grammarId}` : exampleId;
  if (source === 'none' || !id) return null;
  return (
    <img
      src={`/previews/${id}.jpg`}
      alt={alt}
      loading="lazy"
      onError={() => setSource(source === 'specimen' && exampleId ? 'example' : 'none')}
      className={className}
    />
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `corepack pnpm --filter gallery exec vitest run --root ../.. apps/gallery/src/components/GrammarSpecimen.test.tsx`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/gallery/src/components/GrammarSpecimen.tsx apps/gallery/src/components/GrammarSpecimen.test.tsx
git commit -m "feat(gallery): GrammarSpecimen component with example fallback"
```

---

### Task 2: Grammar cards show the specimen; footer counts examples

**Files:**
- Modify: `apps/gallery/src/components/ResultCard.tsx` (footer grammar branch ~line 86-92; preview frame ~line 224-234)
- Test: extend `apps/gallery/src/components/GrammarSpecimen.test.tsx`? No â€” card behavior belongs in a new `apps/gallery/src/components/ResultCard.test.tsx` only if one doesn't exist (it doesn't; Landing tests cover cards indirectly). Add `apps/gallery/src/components/ResultCard.test.tsx`.

**Interfaces:**
- Consumes: `GrammarSpecimen` from Task 1; `grammarById`, `experienceById` (already partially imported â€” add `grammarById`).
- Produces: grammar cards render `<GrammarSpecimen â€¦>` inside the preview frame; footer text `N example templates`.

- [ ] **Step 1: Write the failing test**

```tsx
// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '../test/jest-dom-setup.js';
import { documentById } from '../data/registry.js';
import { ResultCard } from './ResultCard.js';

afterEach(cleanup);

function renderCard(id: string) {
  const doc = documentById.get(id);
  if (!doc) throw new Error(`no search document for ${id}`);
  return render(
    <MemoryRouter>
      <ResultCard result={doc} onOpen={vi.fn()} />
    </MemoryRouter>,
  );
}

describe('ResultCard â€” grammar entity', () => {
  it('renders the grammar specimen image in the preview frame', () => {
    const { container } = renderCard('neon-circuit');
    const img = container.querySelector('img[src="/previews/grammar-neon-circuit.jpg"]');
    expect(img).not.toBeNull();
  });

  it('counts example templates in the footer instead of the static label', () => {
    renderCard('executive-editorial');
    expect(screen.getByText(/example templates/)).toBeInTheDocument();
    expect(screen.queryByText('Design grammar')).not.toBeInTheDocument();
  });
});
```

Note: if `documentById.get('neon-circuit')` is not a `SearchResult` shape, adapt: search documents double as results in this app (`documentById` maps id â†’ document with `entityType`, `facets`, `title`, `summary`). Verify at implementation time; if the shapes differ, build the minimal `SearchResult` literal inline from the document fields.

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm --filter gallery exec vitest run --root ../.. apps/gallery/src/components/ResultCard.test.tsx`
Expected: FAIL â€” no specimen img; footer still "Design grammar".

- [ ] **Step 3: Implement**

In `ResultCard.tsx`:

(a) Import: `import { GrammarSpecimen } from './GrammarSpecimen.js';` and add `grammarById` to the existing registry import.

(b) Footer grammar branch (replace lines 86-92):

```tsx
  // grammar
  const grammar = grammarById.get(result.id);
  const exampleCount =
    grammar?.exampleExperienceIds.filter((id) => experienceById.has(id)).length ?? 0;
  return (
    <div className="text-xs text-text-secondary">
      <span className="font-medium">
        {exampleCount} example {exampleCount === 1 ? 'template' : 'templates'}
      </span>
    </div>
  );
```

(c) Preview frame â€” after the `<PreviewPlate â€¦/>` line (~225), add:

```tsx
            {result.entityType === 'grammar' && (
              <GrammarSpecimen
                grammarId={result.id}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            )}
```

- [ ] **Step 4: Run tests**

Run: `corepack pnpm --filter gallery test`
Expected: new tests PASS; if any existing Landing/card test asserted "Design grammar" or the plate, update it to the new footer copy.

- [ ] **Step 5: Commit**

```bash
git add apps/gallery/src/components/ResultCard.tsx apps/gallery/src/components/ResultCard.test.tsx
git commit -m "feat(gallery): grammar cards render specimen shots + example counts"
```

---

### Task 3: Quick-preview drawer shows the specimen for grammars

**Files:**
- Modify: `apps/gallery/src/components/QuickPreviewDrawer.tsx` (top image slot, ~line 92-100)
- Test: `apps/gallery/src/components/PartInspector.test.tsx` pattern â€” but drawer behavior is covered by a small addition to `ResultCard.test.tsx`? No: create `apps/gallery/src/components/QuickPreviewDrawer.test.tsx`.

**Interfaces:**
- Consumes: `GrammarSpecimen` from Task 1.

- [ ] **Step 1: Write the failing test**

```tsx
// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '../test/jest-dom-setup.js';
import { documentById } from '../data/registry.js';
import { QuickPreviewDrawer } from './QuickPreviewDrawer.js';

afterEach(cleanup);

describe('QuickPreviewDrawer â€” grammar entity', () => {
  it('shows the grammar specimen in the top image slot', () => {
    const doc = documentById.get('print-gazette');
    const { baseElement } = render(
      <MemoryRouter>
        <QuickPreviewDrawer result={doc!} onClose={vi.fn()} />
      </MemoryRouter>,
    );
    expect(
      baseElement.querySelector('img[src="/previews/grammar-print-gazette.jpg"]'),
    ).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify it fails** â€” same vitest invocation pattern; expected FAIL (no img).

- [ ] **Step 3: Implement** â€” in `QuickPreviewDrawer.tsx`, import `GrammarSpecimen` and add directly after the experience preview block (after line 100):

```tsx
          {result.entityType === 'grammar' && (
            <div className="overflow-hidden rounded-md border border-border-subtle bg-surface-sunken">
              <GrammarSpecimen
                grammarId={result.id}
                alt={`Specimen design rendered in ${result.title}`}
                className="block aspect-[16/10] w-full object-cover object-top"
              />
            </div>
          )}
```

- [ ] **Step 4: Run tests** â€” `corepack pnpm --filter gallery test`; expected PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/gallery/src/components/QuickPreviewDrawer.tsx apps/gallery/src/components/QuickPreviewDrawer.test.tsx
git commit -m "feat(gallery): quick preview drawer shows grammar specimen"
```

---

### Task 4: GrammarDetail â€” specimen hero, sibling strip, visual example grid

**Files:**
- Modify: `apps/gallery/src/routes/GrammarDetail.tsx`
- Test: `apps/gallery/src/routes/GrammarDetail.test.tsx` (new)

**Interfaces:**
- Consumes: `GrammarSpecimen` (Task 1), `PreviewImage`, `grammars` + `experienceById` from registry, `SURFACE_LABEL`, `grammarAccent`, `detailRoute`.

- [ ] **Step 1: Write the failing test**

```tsx
// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '../test/jest-dom-setup.js';
import { grammars } from '../data/registry.js';
import GrammarDetail from './GrammarDetail.js';

afterEach(cleanup);

function renderDetail(grammarId: string) {
  return render(
    <MemoryRouter initialEntries={[`/grammars/${grammarId}`]}>
      <Routes>
        <Route path="/grammars/:grammarId" element={<GrammarDetail />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('GrammarDetail', () => {
  it('renders the specimen hero image', () => {
    const { container } = renderDetail('neon-circuit');
    expect(container.querySelector('img[src="/previews/grammar-neon-circuit.jpg"]')).not.toBeNull();
  });

  it('renders a sibling strip linking every other grammar, not itself', () => {
    renderDetail('neon-circuit');
    const strip = screen.getByRole('list', { name: /same design in other grammars/i });
    const links = strip.querySelectorAll('a');
    expect(links).toHaveLength(grammars.length - 1);
    expect(strip.querySelector('a[href="/grammars/neon-circuit"]')).toBeNull();
  });

  it('renders example templates as image cards linking to template detail', () => {
    renderDetail('neon-circuit');
    const grid = screen.getByRole('list', { name: /example templates/i });
    expect(grid.querySelector('a[href="/templates/deck-dgm-circuit"]')).not.toBeNull();
    expect(grid.querySelector('img[src="/previews/deck-dgm-circuit.jpg"]')).not.toBeNull();
  });
});
```

Note: verify the template detail route shape via `detailRoute('experience', id)` at implementation time â€” assert against its return value rather than a hardcoded `/templates/â€¦` if they differ.

- [ ] **Step 2: Run to verify it fails.**

- [ ] **Step 3: Implement** â€” in `GrammarDetail.tsx`:

Add imports:

```tsx
import { componentById, experienceById, grammarById, grammars } from '../data/registry.js';
import { grammarAccent, SURFACE_LABEL } from '../data/labels.js';
import { GrammarSpecimen } from '../components/GrammarSpecimen.js';
import { PreviewImage } from '../components/PreviewImage.js';
```

Directly after the accent bar `<span â€¦/>` (line 49-53), add the hero:

```tsx
      <div className="mb-10 overflow-hidden border border-border-subtle bg-surface-sunken">
        <GrammarSpecimen
          grammarId={grammar.id}
          alt={`The specimen design rendered in ${grammar.name}`}
          className="block aspect-[16/10] w-full object-cover object-top"
        />
      </div>
```

At the top of the `flex flex-col gap-10` container (before the rule lists), add the sibling strip:

```tsx
        <Section title="The same design in other grammars">
          <ul
            aria-label="The same design in other grammars"
            className="flex gap-4 overflow-x-auto pb-2"
          >
            {grammars
              .filter((g) => g.id !== grammar.id)
              .map((g) => (
                <li key={g.id} className="w-44 shrink-0">
                  <RouterLink
                    to={detailRoute('grammar', g.id)}
                    className="group block no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  >
                    <span className="relative block aspect-[16/10] overflow-hidden border border-border-subtle bg-surface-sunken">
                      <span
                        aria-hidden
                        className="absolute inset-x-0 top-0 z-[1] h-0.5"
                        style={{ backgroundColor: grammarAccent(g.id) }}
                      />
                      <GrammarSpecimen grammarId={g.id} alt="" className="block h-full w-full object-cover object-top" />
                    </span>
                    <span className="mt-1.5 block text-xs font-medium text-text-primary group-hover:underline">
                      {g.name}
                    </span>
                  </RouterLink>
                </li>
              ))}
          </ul>
        </Section>
```

Replace the "Example templates" chips `<Section>` (lines 85-100) with the visual grid:

```tsx
        {examples.length > 0 && (
          <Section title="Example templates">
            <ul aria-label="Example templates" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {examples.map((exp) => (
                <li key={exp.id}>
                  <RouterLink
                    to={detailRoute('experience', exp.id)}
                    className="group block no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  >
                    <span className="block aspect-[16/10] overflow-hidden border border-border-subtle bg-surface-sunken">
                      <PreviewImage id={exp.id} alt="" className="block h-full w-full object-cover object-top" />
                    </span>
                    <span className="mt-2 block text-sm font-medium text-text-primary group-hover:underline">
                      {exp.title}
                    </span>
                    <span className="block text-xs text-text-muted">{SURFACE_LABEL[exp.surface]}</span>
                  </RouterLink>
                </li>
              ))}
            </ul>
          </Section>
        )}
```

Keep rule lists after the sibling strip (imagery above, rulebook below, per spec).

- [ ] **Step 4: Run tests** â€” full suite; expected PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/gallery/src/routes/GrammarDetail.tsx apps/gallery/src/routes/GrammarDetail.test.tsx
git commit -m "feat(gallery): GrammarDetail specimen hero, sibling strip, visual example grid"
```

---

### Task 5: Seed the 5 bake-off specimens + shoot pipeline + localhost verify

**Files:**
- Create: `apps/gallery/public/previews/grammar-{sketchnote-journal,drafting-board,neon-circuit,isometric-studio,print-gazette}.jpg`
- Modify: `apps/gallery/scripts/shoot-previews.mjs`

- [ ] **Step 1: Copy existing dgm shots as specimens** (identical pixels; re-shot by pipeline later):

```powershell
$map = @{ 'sketchnote-journal'='deck-dgm-sketchnote'; 'drafting-board'='deck-dgm-blueprint'; 'neon-circuit'='deck-dgm-circuit'; 'isometric-studio'='deck-dgm-isometric'; 'print-gazette'='deck-dgm-gazette' }
$dir = 'apps/gallery/public/previews'
$map.GetEnumerator() | ForEach-Object { Copy-Item "$dir/$($_.Value).jpg" "$dir/grammar-$($_.Key).jpg" }
```

- [ ] **Step 2: Teach the shoot script about specimens** â€” in `shoot-previews.mjs`, after `ROUTE_OVERRIDES`, add:

```js
/**
 * Grammar specimens backed by a live world â€” shot from the world's route and
 * saved under the grammar key. Offline-composed specimens (the other 10) are
 * committed assets; see docs/superpowers/specs/grammar-specimens/.
 */
const GRAMMAR_SPECIMENS = {
  'sketchnote-journal': '/live/deck-dgm-sketchnote',
  'drafting-board': '/live/deck-dgm-blueprint',
  'neon-circuit': '/live/deck-dgm-circuit',
  'isometric-studio': '/live/deck-dgm-isometric',
  'print-gazette': '/live/deck-dgm-gazette',
};
```

and extend `SHOTS`:

```js
const SHOTS = [
  ...LIVE_IDS.map((id) => ({ id, route: ROUTE_OVERRIDES[id] ?? `/live/${id}` })),
  ...DEMO_SLUGS.map((slug) => ({ id: `demo-${slug}`, route: `/demo/${slug}` })),
  ...Object.entries(GRAMMAR_SPECIMENS).map(([g, route]) => ({ id: `grammar-${g}`, route })),
].filter((shot) => !ONLY || ONLY.has(shot.id));
```

- [ ] **Step 3: Full test suite** â€” `corepack pnpm --filter gallery test`; expected all PASS.

- [ ] **Step 4: Verify on localhost** â€” start `corepack pnpm --filter gallery dev` (background), open `http://localhost:5173`, switch catalogue to **Grammars**: all 15 cards image-bearing (5 specimens + 11 example fallbacks), no bare plates; open a grammar card â†’ drawer shows image; open detail page â†’ hero + sibling strip + example grid. Screenshot for the record.

- [ ] **Step 5: Commit**

```bash
git add apps/gallery/public/previews/grammar-*.jpg apps/gallery/scripts/shoot-previews.mjs
git commit -m "feat(gallery): seed bake-off grammar specimens + shoot pipeline support"
```

---

### Task 6: Compose the 10 offline specimens (content job, one open-design COMPOSE run per grammar)

**Files:**
- Create: `apps/gallery/public/previews/grammar-<id>.jpg` for the 10 remaining grammars
- Create: `docs/superpowers/specs/grammar-specimens/RUN-LOG.md` (+ per-run evidence)

Each run follows the open-design skill COMPOSE route with the same source content as the opendesign-intro sample (`GUIDANCE.md`, `docs/borrow-a-part.md`, design-audit-pilot RUN-LOG; concise fidelity, mixed audience), targeting each grammar's own deck template:

| Grammar | Fill target (deck template) |
|---|---|
| technical-blueprint | deck-technical-architecture-explanation |
| signal-glass | deck-analytics-deep-dive |
| spatial-canvas | deck-innovation-showcase |
| research-notebook | deck-genai-model-validation-report |
| living-system | deck-transformation-roadmap |
| precision-grid | deck-ai-governance-and-controls |
| executive-editorial | deck-ai-strategy |
| kinetic-intelligence | deck-experiment-results |
| monumental-type | deck-product-vision |
| calm-command | *(no deck template â€” compose on its strongest surface, `db-ai-risk-command-centre`-style dashboard or project page, same source content; if the compose route cannot target the grammar, leave the example fallback and flag in the run log)* |
| drafting-board â€¦ | *(covered by Task 5)* |

Steps per grammar: compose â†’ validate loop â†’ render locally â†’ screenshot cover frame at 1280Ã—800 jpeg q75 â†’ save as `grammar-<id>.jpg` â†’ log in RUN-LOG.md. Scaffold/working artifacts stay in the evidence dir; only the jpg ships. **Each run is a full QC pipeline pass (the sample run took multiple validate/critique rounds) â€” budget accordingly; these can run as separate sessions or subagents.**

- [x] technical-blueprint — SHIPPED via cutover (judge P4 H4 E3 S4 R4 V4; template work filed)
- [x] signal-glass — BLOCKED, no templatized world (evidence logged)
- [x] spatial-canvas — BLOCKED, no templatized world (evidence logged)
- [x] research-notebook — BLOCKED, no templatized world (evidence logged)
- [x] living-system — BLOCKED, no templatized world (evidence logged)
- [x] precision-grid — NOT SHIPPED: quarter rejected (hardcoded revenue conceit), cockpit failed 3 judge rounds on template-side criticals; fill + demo route kept as regeneration source
- [x] executive-editorial — BLOCKED, no templatized world (evidence logged)
- [x] kinetic-intelligence — BLOCKED, no templatized world (evidence logged)
- [x] monumental-type — SHIPPED via tminus (judge P5 H5 E3 S5 R4 V4)
- [x] calm-command — BLOCKED, no templatized world (evidence logged)
- [x] Final (partial by blocks): 7/15 same-content specimens live (5 dgm + monumental-type + technical-blueprint), 8 on example fallback; grammar tab verified on localhost â€” 15/15 specimen-backed cards; commit jpgs + RUN-LOG.

