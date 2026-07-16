# Gallery Ink redesign — run log

Design: `../2026-07-17-gallery-ink-redesign-design.md` (approved via visual-companion
session 2026-07-16/17). Branch: `feat/gallery-ink-redesign`.

## What shipped

- **Theme**: `gallery-ink-light`/`-dark` pair in `packages/themes` (warm paper / ink /
  vermilion; chart+status+diagram tokens byte-identical to enterprise-neutral so nothing
  inside live worlds shifts). Fraunces display serif via `--font-display`/`--font-heading`
  re-valued in the gallery stylesheet only.
- **IA**: Gallery (/) · Make your design (/make) · Showcase (/showcase) · Contribute
  (/contribute); `/browse` (query-preserving), `/components`, `/grammars`, `/guide`,
  `/blueprint-lab` redirect; detail routes unchanged. Blueprint Lab stub, Components,
  Grammars, Guide pages deleted (content absorbed by Contribute/Make).
- **Previews**: 42 committed screenshots (33 live worlds + 9 demo samples, 2.9 MB) via
  `apps/gallery/scripts/shoot-previews.mjs`; framed-print cards + 600 ms hover upgrade
  to the running world in a scaled iframe (mouse-only; reduced motion opts out).
- **Bug fixed at source**: the tailwind bridge declared stacking tokens as
  `--z-<name>: var(--z-<name>)` — wrong Tailwind v4 namespace (no `z-modal`/`z-sticky`
  utilities generated) and cyclically self-referential. Drawer/Dialog rendered at
  `z-index: auto`; now `--z-index-*` → real 1400/1100.

## Evidence (1440×900, against the dev build @ f-branch head)

| file | shows |
| --- | --- |
| `landing-light.png` | Gallery home, full page — hero, facets, framed preview cards |
| `landing-dark.png` | Warm-charcoal dark counterpart, above the fold |
| `showcase.png` | The 9 MCP/skill samples with provenance captions |
| `make.png` | The 4-step compose loop with paste-ready prompts |
| `contribute.png` | Doctrine, components grid, grammars grid, add-a-world |
| `template-detail.png` | Detail page with the live preview hero (Cloud Migration) |

## Gates at head

- `corepack pnpm lint` — clean.
- `corepack pnpm typecheck` — clean.
- `corepack pnpm test` — themes 113 (incl. new pair through the WCAG suite),
  gallery 254+ incl. new Redirects/samples/PreviewImage suites; the four full-suite
  failures on first pass were the documented slow-machine load flakes
  (Landing/LiveWorlds timeouts) + the CRLF smudge of generated `tokens.css`
  (fix: `generate:css`); all pass in isolation.
- `corepack pnpm --filter gallery e2e` — 42/42 (re-run after the z-index fix).
- `git status experiences/` — untouched; template pixels unchanged.
