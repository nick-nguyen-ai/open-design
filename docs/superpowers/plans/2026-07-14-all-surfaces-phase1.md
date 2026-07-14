# All-Surfaces Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make all five surfaces composable through the MCP (parameterized craft rules, descriptor v1.1, compose core + 4 new tools, certifier + scaffolder, 4 pilot templates, generalized skill), gated by five fresh samples at the Fable bar.

**Architecture:** The proven world-template pattern (Template.tsx + `<id>-fill.ts` + `*.worldtemplate.manifest.ts` → compiled `world-templates.json`) generalizes across surfaces via a `sections` vocabulary; one shared compose core serves five thin per-surface tools; a data-driven certifier suite walks the compiled catalogue so new templates are certified with zero per-world test code.

**Tech Stack:** TypeScript, Zod v4, vitest, tsx, pnpm workspaces (`corepack pnpm`), MCP TS SDK (existing adapter), React 18 + vite (gallery).

**Spec:** `docs/superpowers/specs/2026-07-14-scale-mcp-all-surfaces-design.md`

## Global Constraints

- All work inside `d:\Project\design-mcp\design-mcp-fable`; always `corepack pnpm` (bare `pnpm` is admin-blocked).
- Commit messages: NO double quotes (PowerShell); trailer `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- The regression trio must stay green after every task that touches contracts/registry/mcp-server: `corepack pnpm --filter mcp-server demo` (43/43), `... sample` (7/7), `... openwiki` (7/7).
- Standard gates per task: `corepack pnpm typecheck`, `corepack pnpm lint`, `corepack pnpm test -- run` (workspace-appropriate filters fine), plus the trio when applicable.
- Selection behaviour for the three existing deck templates must not change: payments-retry brief → cutover, OpenWiki brief → tminus, QBR-style briefs → quarter.
- Fills are content-only; templates carry all geometry/craft. Never hand-edit rendered output to pass a check.
- Descriptor JSON must stay JSON-serializable (no functions).
- Naming conventions (locked, used by certifier): world-template id is kebab/short (`cockpit`, `drawing-office`, `ledger`, `the-line`); fill module is `<id>-fill.ts` next to the manifest; fill module exports `FILL_SCHEMA` (Zod schema) and `SECTIONS` (`SectionSpec[]`); the world's `content.ts` exports `SHIPPED_FILL` (the parsed shipped instance); exactly one `*Template.tsx` per templatized world directory; optional `leak-allowlist.json` (array of exact strings) next to the manifest.

---

### Task 1: Parameterized craft rules (CraftRule union + generic interpreter)

**Files:**
- Modify: `packages/contracts/src/world-template.ts` (replace `CraftRuleId` with `CraftRule`)
- Modify: `packages/contracts/src/world-template.test.ts`
- Modify: `packages/contracts/src/index.ts` (export rename if `CraftRuleId` is exported there)
- Modify: `apps/mcp-server/src/tools/validate-fill.ts` (generic interpreter)
- Modify: `experiences/slide-decks/deck-quarterly-business-review/deck-quarterly-business-review.worldtemplate.manifest.ts`
- Modify: `experiences/slide-decks/deck-cloud-migration/deck-cloud-migration.worldtemplate.manifest.ts`
- Modify: `experiences/slide-decks/deck-product-launch/deck-product-launch.worldtemplate.manifest.ts`
- Modify: any test referencing `craftRules` string ids (`packages/registry/src/catalogue.test.ts`, `apps/gallery/src/routes/TMinusWorldTemplate.test.ts`, mcp-server server/validate tests — grep `craftRules` and `exactly-one` to find them all)

**Interfaces:**
- Consumes: existing `WorldTemplateDescriptor`, `resolvePath` in validate-fill.
- Produces: `CraftRule` (discriminated union) exported from contracts; descriptors carry `craftRules: CraftRule[]`. Tasks 2–10 rely on this exact shape.

- [ ] **Step 1: Write the failing contracts test** — in `world-template.test.ts`, replace/extend the craft-rule cases:

```ts
import { CraftRule, WorldTemplateDescriptor } from './world-template.js';

it('accepts an exactly-one rule with path/field/equals', () => {
  const rule = CraftRule.parse({
    kind: 'exactly-one',
    path: 'gates',
    field: 'status',
    equals: 'warning',
    description: 'Exactly one readiness gate carries status warning.',
  });
  expect(rule.kind).toBe('exactly-one');
});

it('accepts a required-nonempty rule', () => {
  const rule = CraftRule.parse({
    kind: 'required-nonempty',
    path: 'deck.notice',
    description: 'The synthetic-data notice must be present.',
  });
  expect(rule.path).toBe('deck.notice');
});

it('rejects an unknown rule kind and legacy string ids', () => {
  expect(() => CraftRule.parse('notice-required')).toThrow();
  expect(() => CraftRule.parse({ kind: 'count-range', path: 'x', description: 'y' })).toThrow();
});
```

- [ ] **Step 2: Run to verify failure** — `corepack pnpm --filter @enterprise-design/contracts test -- run` → FAIL (`CraftRule` not exported).

- [ ] **Step 3: Implement in `world-template.ts`** — delete the `CraftRuleId` enum + its doc block; add:

```ts
/**
 * Machine-checkable craft rules a template declares, parameterized so any
 * template can express its design-defining constraint without server changes.
 * `validate_fill` interprets them generically:
 * - `exactly-one`: the array at `path` has exactly one element whose `field`
 *   equals `equals` (the single flagged anomaly/blocker/tension).
 * - `required-nonempty`: the string at `path` is present and non-empty after
 *   trimming (the provenance notice).
 * New kinds join the union only when a template needs one.
 */
export const CraftRule = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('exactly-one'),
    path: z.string().min(1),
    field: z.string().min(1),
    equals: z.string().min(1),
    description: z.string().min(1),
  }),
  z.object({
    kind: z.literal('required-nonempty'),
    path: z.string().min(1),
    description: z.string().min(1),
  }),
]);
export type CraftRule = z.infer<typeof CraftRule>;
```

and in `WorldTemplateDescriptor` replace `craftRules: z.array(CraftRuleId).default([])` with `craftRules: z.array(CraftRule).default([])`. Update `packages/contracts/src/index.ts` exports (`CraftRuleId` → `CraftRule`).

- [ ] **Step 4: Migrate the three manifests** — replace the string arrays:

```ts
// deck-quarterly-business-review (quarter)
craftRules: [
  { kind: 'exactly-one', path: 'kpis', field: 'status', equals: 'off-track',
    description: 'Exactly one KPI carries status off-track — the single flagged anomaly the world turns on.' },
  { kind: 'required-nonempty', path: 'deck.notice',
    description: 'deck.notice must state data provenance (synthetic or sourced).' },
],
// deck-cloud-migration (cutover)
craftRules: [
  { kind: 'exactly-one', path: 'nodes', field: 'disposition', equals: 'stays',
    description: 'Exactly one estate node carries disposition stays — the single deliberate exception.' },
  { kind: 'required-nonempty', path: 'deck.notice',
    description: 'deck.notice must state data provenance (synthetic or sourced).' },
],
// deck-product-launch (tminus)
craftRules: [
  { kind: 'exactly-one', path: 'gates', field: 'status', equals: 'warning',
    description: 'Exactly one readiness gate carries status warning — the single honest blocker.' },
  { kind: 'required-nonempty', path: 'deck.notice',
    description: 'deck.notice must state data provenance (synthetic or sourced).' },
],
```

- [ ] **Step 5: Rewrite `checkCraftRules` in `validate-fill.ts`** as the generic interpreter (drop the four hardcoded branches):

```ts
/** Generic interpreter for the descriptor's parameterized craft rules. */
function checkCraftRules(fill: unknown, descriptor: WorldTemplateDescriptor, findings: FillFinding[]): void {
  for (const rule of descriptor.craftRules) {
    if (rule.kind === 'required-nonempty') {
      const value = resolvePath(fill, rule.path);
      if (typeof value !== 'string' || value.trim().length === 0) {
        findings.push({
          path: rule.path,
          rule: 'craft',
          message: `Craft rule (required-nonempty at "${rule.path}"): ${rule.description}`,
        });
      }
    } else {
      const value = resolvePath(fill, rule.path);
      const count = Array.isArray(value)
        ? value.filter(
            (el) => typeof el === 'object' && el !== null && (el as Record<string, unknown>)[rule.field] === rule.equals,
          ).length
        : 0;
      if (count !== 1) {
        findings.push({
          path: rule.path,
          rule: 'craft',
          message: `Craft rule (exactly-one at "${rule.path}" where ${rule.field}="${rule.equals}", found ${count}): ${rule.description}`,
        });
      }
    }
  }
}
```

- [ ] **Step 6: Update dependent tests** — grep `craftRules`, `notice-required`, `exactly-one-` across the repo; update assertions to the new object shape (e.g. `expect(descriptor.craftRules).toContainEqual({ kind: 'exactly-one', path: 'gates', field: 'status', equals: 'warning', description: expect.any(String) })` — match the messages the interpreter now emits in mcp-server validate tests).

- [ ] **Step 7: Gates** — `corepack pnpm typecheck && corepack pnpm lint && corepack pnpm test -- run`, then the trio (`demo` 43/43, `sample` 7/7, `openwiki` 7/7). All green.

- [ ] **Step 8: Commit** — `git commit -m 'feat(contracts): parameterize craft rules as a discriminated union with generic validate_fill interpreter'` (+ trailer).

---

### Task 2: Descriptor v1.1 — `sections` rename + `briefKeywords`

**Files:**
- Modify: `packages/contracts/src/world-template.ts` (`SlideKindSpec`→`SectionSpec`, `SlideKindRepeats`→`SectionRepeats`, `slideKinds`→`sections`, `schemaVersion: z.literal('1.1')`, add `briefKeywords`)
- Modify: `packages/contracts/src/world-template.test.ts`, `packages/contracts/src/index.ts`
- Modify: the 3 worldtemplate manifests (`schemaVersion: '1.1'`, `sections:`) and their fill modules: `quarter-fill.ts`, `cutover-fill.ts`, `tminus-fill.ts` (rename `*_SLIDE_KINDS` exports to `*_SECTIONS`; keep content identical)
- Modify: `apps/mcp-server/src/schemas.ts` (`FillSkeletonSlideKind`→`FillSkeletonSection`, `FillSkeleton.slideKinds`→`FillSkeleton.sections`)
- Modify: `apps/mcp-server/src/tools/compose-slide-deck.ts` (build from `descriptor.sections`), `apps/mcp-server/src/server.ts` (audit `count: outcome.data.fillSkeleton.sections.length`)
- Modify: `apps/mcp-server/src/demo-client.ts`, `apps/mcp-server/src/sample-outcome.ts`, `apps/mcp-server/src/openwiki-outcome.ts` (any `slideKinds` reads)
- Modify: `apps/gallery/src/routes/TMinusWorldTemplate.test.ts` + any other lockstep tests referencing `SLIDE_KINDS`
- Modify: `.claude/skills/deck-composer/SKILL.md` + `references/*.md` (terminology: skeleton now says `sections`)

**Interfaces:**
- Produces: `SectionSpec`, `SectionRepeats`, `WorldTemplateDescriptor` with `sections: SectionSpec[]`, `briefKeywords: z.array(z.string().min(1)).default([])`, `schemaVersion: '1.1'`. Every later task uses `sections`/`SectionSpec` — never `slideKinds`.

- [ ] **Step 1: Failing contracts test** — descriptor parses with `schemaVersion: '1.1'`, `sections`, and `briefKeywords: ['monitoring', 'drift']`; rejects `schemaVersion: '1.0'` and unknown key `slideKinds` is simply unused (Zod strips) — assert `parsed.sections.length > 0` and `parsed.briefKeywords` defaults to `[]` when omitted.
- [ ] **Step 2: Run to verify failure**, then implement the contracts rename:

```ts
export const SectionRepeats = z.object({
  min: z.number().int().nonnegative(),
  max: z.number().int().positive(),
});
export type SectionRepeats = z.infer<typeof SectionRepeats>;

/** One section anatomy (a deck slide kind, a page region) — purpose + slots. */
export const SectionSpec = z.object({
  kind: z.string().min(1),
  purpose: z.string().min(1),
  repeats: SectionRepeats.optional(),
  slots: z.array(SlotSpec).min(1),
});
export type SectionSpec = z.infer<typeof SectionSpec>;
```

and in the descriptor: `schemaVersion: z.literal('1.1')`, `sections: z.array(SectionSpec).min(1)`, `briefKeywords: z.array(z.string().min(1)).default([])`. Delete `SlideKindSpec`/`SlideKindRepeats` (no aliases — one vocabulary).

- [ ] **Step 3: Mechanical rename across consumers** — the file list above; in fill modules rename `QUARTER_SLIDE_KINDS`→`QUARTER_SECTIONS` etc. and their type annotations `SlideKindSpec[]`→`SectionSpec[]`; in `schemas.ts` rename `FillSkeletonSlideKind`→`FillSkeletonSection` with `repeats: SectionSpec.shape.repeats` and `FillSkeleton = z.object({ sections: z.array(FillSkeletonSection), craftGuarantees: z.array(z.string()) })`; in `compose-slide-deck.ts` map `descriptor.sections`. Grep for `slideKinds|SlideKind|SLIDE_KINDS` — zero hits when done (outside this plan/spec and git history).
- [ ] **Step 4: Update skill docs** — in `.claude/skills/deck-composer/` replace skeleton-shape references (`fillSkeleton.slideKinds` → `fillSkeleton.sections`; the phrase "slide kinds" stays as deck vocabulary where it names the CONCEPT, but any literal JSON path must say `sections`).
- [ ] **Step 5: Gates + trio** — all green; the trio proves selection and skeleton parity survived the rename.
- [ ] **Step 6: Commit** — `git commit -m 'feat(contracts): descriptor v1.1 - sections vocabulary + briefKeywords targeting'` (+ trailer).

---

### Task 3: Compose core extraction + canonical-brief matrix seed

**Files:**
- Create: `apps/mcp-server/src/tools/compose-core.ts`
- Create: `apps/mcp-server/src/tools/compose-core.test.ts`
- Create: `apps/mcp-server/src/canonical-briefs.ts` (fixture) + `apps/mcp-server/src/canonical-briefs.test.ts`
- Modify: `apps/mcp-server/src/tools/compose-slide-deck.ts` (delegate to core)
- Modify: `packages/contracts/src/mcp-error.ts` (add `NO_TEMPLATE_FIT` to `McpErrorCode`)

**Interfaces:**
- Produces: `composeForSurface(registry: RegistryData, surface: SurfaceType, context: ComposeContext, contentBrief: string, toolName: string): ToolOutcome<ComposeOutput>` where `ComposeContext = { audience: Audience[]; businessIntent: string[]; corporateSuitability: CorporateSuitability; motionPreference: MotionLevel; styleHint?: 'art-directed' | 'conventional' }` and `ComposeOutput = ComposeSlideDeckOutput` (same shape, reused). Task 4's tools call exactly this.
- Scoring: unchanged weights, with descriptor tokens now `tokenize([...businessIntents, ...briefKeywords].join(' '))`.

- [ ] **Step 1: Failing core tests** in `compose-core.test.ts` (build a fake `RegistryData` with two descriptors on different surfaces):

```ts
it('filters by surface before scoring', () => { /* dashboard context never returns a slide-deck descriptor */ });
it('briefKeywords tokens count toward intent match', () => { /* descriptor with briefKeywords ['drift'] beats sibling when brief says drift */ });
it('returns NO_TEMPLATE_FIT when the best score is 0', () => { /* context sharing no audience/intent/keyword and corporateFit 0 */ });
it('keeps the deck tie-break: score desc then id asc', () => { /* two equal-score descriptors */ });
```

- [ ] **Step 2: Implement `compose-core.ts`** — move `tokenize`, `corporateFit`, `scoreTemplate`, `slotExample`, `buildFillSkeleton` (now over `sections`) from `compose-slide-deck.ts` verbatim; add the surface pre-filter (`registry.worldTemplates.filter((t) => t.surface === surface)`), the `briefKeywords` line in `scoreTemplate`, and the zero-score outcome:

```ts
if (winner.score === 0) {
  return {
    ok: false,
    error: makeError('NO_TEMPLATE_FIT', `No live ${surface} template fits this brief.`, {
      requestId,
      details: [
        `Live ${surface} templates: ${candidates.map((c) => `${c.descriptor.id} (${c.descriptor.experienceId})`).join(', ') || '(none)'}.`,
        ...evidence.slice(0, 5),
      ],
      remediation: [
        'Adjust audience/businessIntent to match a live template, or request this world be templatized.',
      ],
    }),
  };
}
```

(`NO_MATCH` keeps its existing styleHint-filter meaning; empty surface pool also returns `NO_TEMPLATE_FIT` with the `(none)` detail.) `compose_slide_deck` becomes a thin wrapper: parse `ComposeSlideDeckInput`, call `composeForSurface(registry, 'slide-deck', context, contentBrief, 'compose_slide_deck')`.
- [ ] **Step 3: Seed the canonical-brief matrix** — `canonical-briefs.ts` exports `CANONICAL_BRIEFS: { surface: SurfaceType; expect: string; context: ComposeContext; brief: string }[]` seeded with the three locked deck briefs (payments-cutover → `cutover`, OpenWiki product-intro → `tminus`, QBR executive review → `quarter` — copy the exact contexts from `sample-outcome.ts` / `openwiki-outcome.ts` / the demo-client QBR case). `canonical-briefs.test.ts` iterates: `composeForSurface` must select `expect` for every row. Pilots (Tasks 7–10) each append one row.
- [ ] **Step 4: Gates + trio green** (this is the behaviour-preserving proof). Commit — `git commit -m 'refactor(mcp): extract compose core with surface filter, briefKeywords, NO_TEMPLATE_FIT, canonical-brief matrix'` (+ trailer).

---

### Task 4: Four per-surface compose tools

**Files:**
- Modify: `apps/mcp-server/src/schemas.ts` (add `PageContext` + per-tool input/output aliases)
- Create: `apps/mcp-server/src/tools/compose-surface.ts` (the four thin handlers)
- Modify: `apps/mcp-server/src/server.ts` (register 4 tools)
- Modify: `apps/mcp-server/src/server.test.ts` (or the existing tool-registration test file — extend)

**Interfaces:**
- Consumes: `composeForSurface` from Task 3.
- Produces: MCP tools `compose_dashboard`, `compose_project_page`, `compose_personal_page`, `compose_explainer`. Input identical in shape to `compose_slide_deck` but with the tool's surface literal; output schema reuses the skeleton output. The skill (Task 11) names these tools.

- [ ] **Step 1: Failing server tests** — for each new tool: (a) it is listed in `tools/list`; (b) calling it with a context whose surface literal is wrong → `INVALID_INPUT`; (c) with no live template on that surface (pre-pilot registry fixture) → `NO_TEMPLATE_FIT`.
- [ ] **Step 2: Implement** — in `schemas.ts`, a factory:

```ts
const surfaceContext = <S extends string>(surface: S) =>
  z.object({
    surface: z.literal(surface).describe(`Fixed surface for this tool; must be '${surface}'.`),
    audience: z.array(Audience).min(1).describe('Intended audiences; overlap with a template audience is the strongest selection signal.'),
    businessIntent: z.array(z.string().min(1)).min(1).describe('Business intents driving template selection.'),
    corporateSuitability: CorporateSuitability.describe("Corporate register: 'restricted' leans conventional, 'expressive' leans art-directed, 'standard' fits either."),
    motionPreference: MotionLevel.describe('Desired motion level 0-3 (echoed; templates lock their own motion).'),
    styleHint: z.enum(['art-directed', 'conventional']).optional().describe('Optional HARD filter on template style.'),
  });
export const ComposeDashboardInput = z.object({ context: surfaceContext('dashboard'), contentBrief: z.string().min(1) });
export const ComposeProjectPageInput = z.object({ context: surfaceContext('project-page'), contentBrief: z.string().min(1) });
export const ComposePersonalPageInput = z.object({ context: surfaceContext('personal-page'), contentBrief: z.string().min(1) });
export const ComposeExplainerInput = z.object({ context: surfaceContext('technical-explainer'), contentBrief: z.string().min(1) });
```

(refactor `SlideDeckContext` to use the same factory: `surfaceContext('slide-deck')` — zero behaviour change). `compose-surface.ts` exports four functions, each parsing its input then delegating to `composeForSurface` with its surface. Register in `server.ts` mirroring the `compose_slide_deck` block; tool descriptions teach the surface anatomy (deck: slide kinds + repeats + narrative order; dashboard: page regions with live-feeling data + one flagged anomaly; project/personal page: sections building one story; explainer: a drawing + its legend/annotation sections).
- [ ] **Step 3: Gates + trio.** Commit — `git commit -m 'feat(mcp): per-surface compose tools for dashboard, project-page, personal-page, explainer'` (+ trailer).

---

### Task 5: Certifier — data-driven suite + CLI

**Files:**
- Create: `packages/registry/src/certify.ts` (runner: pure functions returning findings)
- Create: `packages/registry/src/certify.test.ts` (the data-driven suite)
- Create: `packages/registry/src/certify-cli.ts`
- Modify: `packages/registry/package.json` (script `certify`: `tsx src/certify-cli.ts`)
- Modify: `experiences/slide-decks/deck-quarterly-business-review/quarter-fill.ts`, `.../deck-cloud-migration/cutover-fill.ts`, `.../deck-product-launch/tminus-fill.ts` — add standard exports; and each deck's `content.ts` — add `SHIPPED_FILL`

**Interfaces:**
- Consumes: discovery conventions (`*.worldtemplate.manifest.ts` globbing, same IGNORE list as `discovery.ts`).
- Produces: `certifyWorld(manifestPath: string): Promise<CertFinding[]>` with `CertFinding = { templateId: string; check: 'lockstep' | 'shipped-parses' | 'slot-resolves' | 'craft-holds' | 'leak' | 'author-marker'; message: string }`; the vitest suite asserts zero findings per discovered template; the CLI prints findings and exits 1 on any.

- [ ] **Step 1: Add the standard exports** to the three fill modules (aliases, no logic):

```ts
// tminus-fill.ts (same pattern in quarter/cutover)
export const FILL_SCHEMA = TMinusFill;
export const SECTIONS = TMINUS_SECTIONS;
// content.ts
export const SHIPPED_FILL = tminusFill;
```

- [ ] **Step 2: Failing suite** — `certify.test.ts` discovers every manifest (reuse `DISCOVERY_GLOBS.worldTemplate` + IGNORE from `discovery.ts`) and for each runs `certifyWorld`; assert `findings` is empty, message includes the findings on failure. Before `certify.ts` exists → FAIL.
- [ ] **Step 3: Implement `certifyWorld`** in `certify.ts`:
  1. Import the manifest (pathToFileURL, like discovery), parse with `WorldTemplateDescriptor`.
  2. Import sibling `<id>-fill.ts`; require exports `FILL_SCHEMA` (has `.safeParse`) and `SECTIONS` (deep-equal to `descriptor.sections` — the lockstep check: `JSON.stringify(SECTIONS) === JSON.stringify(descriptor.sections)`).
  3. **Lockstep both directions:** every descriptor slot `name` (dot-path, ignoring a trailing `[]` if any) resolves inside `FILL_SCHEMA` — implement by parsing `SHIPPED_FILL` (step 4) and resolving each slot path against it (missing → `slot-resolves` finding); and every top-level key of `SHIPPED_FILL` appears as a prefix of at least one slot path (else `lockstep` finding: unslotted fill field).
  4. Import sibling `content.ts`; require `SHIPPED_FILL`; `FILL_SCHEMA.safeParse(SHIPPED_FILL)` must succeed (`shipped-parses`).
  5. Check every slot's limits against the shipped instance values and run the Task-1 craft-rule interpreter logic against `SHIPPED_FILL` (`craft-holds`) — copy the small interpreter (or export it from contracts as `evaluateCraftRule(rule, fill): boolean`; do export it from contracts to avoid duplication, and have validate-fill use the same function).
  6. **Leak scan:** read the directory's single `*Template.tsx` as text; extract JSX text nodes with `/>\s*([^<>{}\n][^<>{}]*)</g`; trim; candidates with ≥4 words or ≥25 chars must appear as a value (string-includes) somewhere in `JSON.stringify(SHIPPED_FILL)` or in the world's `leak-allowlist.json` (if present) → else `leak` finding. Zero or multiple `*Template.tsx` files → `leak` finding naming the problem.
  7. **Author markers:** the fill module + manifest sources must not contain the string `AUTHOR:` (`author-marker` finding).
- [ ] **Step 4: CLI** — `certify-cli.ts`: args `[templateId]`; discovers manifests, filters by id when given, prints per-template PASS or the findings, exit 1 on any finding. Add `"certify": "tsx src/certify-cli.ts"` to `packages/registry/package.json` scripts.
- [ ] **Step 5: Run** — `corepack pnpm --filter @enterprise-design/registry test -- run` green (3 templates certified); `corepack pnpm --filter @enterprise-design/registry certify` prints 3 PASS. Full gates + trio.
- [ ] **Step 6: Commit** — `git commit -m 'feat(registry): data-driven template certifier suite and certify CLI'` (+ trailer).

---

### Task 6: Scaffolder CLI

**Files:**
- Create: `packages/registry/src/scaffold-cli.ts` + `packages/registry/src/scaffold.ts` + `packages/registry/src/scaffold.test.ts`
- Modify: `packages/registry/package.json` (script `scaffold-template`: `tsx src/scaffold-cli.ts`)

**Interfaces:**
- Produces: `corepack pnpm --filter @enterprise-design/registry scaffold-template <experience-id> <template-id>` → writes `<template-id>-fill.ts` and `<experience-id>.worldtemplate.manifest.ts` skeletons into the experience directory (refusing to overwrite existing files). `scaffold.ts` exports `proposeFill(shape: unknown): string` (TS source text) for testability.

- [ ] **Step 1: Failing tests** for `proposeFill`: given `{ title: 'Hi', items: [{ label: 'A', value: 3 }] }` it emits a Zod object source with `title: z.string().min(1).max(/* AUTHOR: cap */ 12)` (cap = ceil(len × 1.3), flagged), `items: z.array(z.object({ label: …, value: z.number() })).min(1).max(/* AUTHOR: bounds */ 2)`; nested objects recurse; unknown/null values emit `z.unknown() /* AUTHOR: type me */`.
- [ ] **Step 2: Implement** `proposeFill` (recursive shape walk) and the CLI: locate the experience dir by globbing `experiences/**/<experience-id>.experience.manifest.ts`; import its sibling `content.ts`; take its first exported object value as the shape; write `<template-id>-fill.ts` containing the proposed schema + a `SECTIONS: SectionSpec[]` stub (one section `kind: 'page'` listing every top-level slot with `guidance: 'AUTHOR: what this slot is for + e.g. example'`) + the standard exports (`FILL_SCHEMA`, `SECTIONS`); write the manifest with `schemaVersion: '1.1'`, ids filled, `audiences`/`businessIntents`/`briefKeywords`/`craftRules`/`guidance` carrying `AUTHOR:` markers. Print next steps (extract Template.tsx; author limits/guidance; add `SHIPPED_FILL` to content.ts; run certify — which refuses `AUTHOR:` markers, so a scaffold cannot ship unfinished).
- [ ] **Step 3: Gates; commit** — `git commit -m 'feat(registry): scaffold-template CLI proposing fill and manifest skeletons'` (+ trailer).

---

### Tasks 7–10: Pilot templatizations (one task per world, opus implementers)

| Task | World | Surface | Template id | Page → Template |
|---|---|---|---|---|
| 7 | `experiences/dashboards/db-model-monitoring-cockpit` | dashboard | `cockpit` | `CockpitPage.tsx` (+`DriftScope.tsx`) → `CockpitTemplate.tsx` |
| 8 | `experiences/explainers/exp-system-architecture` | technical-explainer | `drawing-office` | `DrawingOfficePage.tsx` (+`ArchitectureDrawing.tsx`) → `DrawingOfficeTemplate.tsx` |
| 9 | `experiences/project-pages/proj-ai-model-validation-hub` | project-page | `ledger` | `LedgerPage.tsx` → `LedgerTemplate.tsx` |
| 10 | `experiences/personal-pages/home-career-project-timeline` | personal-page | `the-line` | `TheLinePage.tsx` → `TheLineTemplate.tsx` |

Each pilot task follows the proven extraction pattern (reference instance: `experiences/slide-decks/deck-product-launch/` — `TMinusTemplate.tsx` + `tminus-fill.ts` + manifest + `content.ts` `SHIPPED_FILL`). Steps for EVERY pilot:

- [ ] **Step 1: Read the world** — the Page component, its helper components, `content.ts`, and the CSS. List every rendered string and where it comes from.
- [ ] **Step 2: Extract `<Name>Template.tsx`** — a component taking `{ fill: <Name>Fill }` that renders the ENTIRE experience from the fill. The Page becomes a thin wrapper: theme lock (copy its existing behaviour) + `<Template fill={SHIPPED_FILL} />`. **Template-leak rule:** every editorial string (headlines, captions, notes, kickers, body copy) must come from the fill; only structural chrome (axis glyphs, purely decorative marks) may stay hardcoded, and each such string goes into `leak-allowlist.json`. Derived strings (kickers computed from fill data) are encouraged over slots when the shipped instance derives cleanly.
- [ ] **Step 3: Author `<id>-fill.ts`** — Zod schema (use the scaffolder for the first draft: `corepack pnpm --filter @enterprise-design/registry scaffold-template <experience-id> <template-id>`, then author every `AUTHOR:` marker), `SECTIONS` (real page regions, not one blob — e.g. cockpit: header/kpi-rail/drift-panel/model-table/incident-log as the page actually reads; each section's slots with limits from shipped magnitudes + ~30% headroom and guidance with an `e.g.` drawn from the shipped instance), `FILL_SCHEMA` + `SECTIONS` exports.
- [ ] **Step 4: Refactor `content.ts`** — the shipped instance becomes `SHIPPED_FILL: <Name>Fill = <Name>Fill.parse({ … })` with the page rendering from it (behaviour-preserving: the live route must render pixel-identically; verify against the built gallery).
- [ ] **Step 5: Author the manifest** — `schemaVersion: '1.1'`, id per table, surface, style/mood/grammarId matching the shipped world's experience manifest, audiences + businessIntents from the experience manifest, `briefKeywords` (5–10 discriminating tokens, e.g. cockpit: `['monitoring', 'drift', 'model', 'inference', 'latency', 'alerts']`), `craftRules`: MANDATORY `required-nonempty` on the world's provenance notice slot (add such a slot if the shipped world lacks one — dashboards/pages showing synthetic figures need it at the Fable honesty bar) + an `exactly-one` rule wherever the shipped anatomy has a single flagged element (cockpit: the one drifting/alerting model; ledger: the one open/blocked validation item; the-line: the one current/active chapter; drawing-office: the one highlighted flow or decision — implementer confirms the exact path/field/value from the shipped content and encodes it; if a world genuinely has no single-anomaly anatomy, document why in the manifest guidance instead of forcing one).
- [ ] **Step 6: Certify + matrix** — `corepack pnpm --filter @enterprise-design/registry certify <template-id>` green; append the world's canonical brief row to `canonical-briefs.ts` (a realistic brief that must select it — trivially true while it is its surface's only template, but the row locks Phase 2/3 regressions).
- [ ] **Step 7: Gates** — typecheck, lint, full unit, gallery build, e2e, trio. The world's existing live route must be visually unchanged (screenshot the built app's route before/after; compare).
- [ ] **Step 8: Commit** — `git commit -m 'feat(<world>): templatize as <template-id> world-template (fill + sections + manifest + certifier green)'` (+ trailer).

---

### Task 11: experience-composer skill generalization

**Files:**
- Create: `.claude/skills/experience-composer/SKILL.md` + `references/fill-authoring.md` + `references/scaffold-and-verify.md` (moved + generalized from deck-composer)
- Modify: `.claude/skills/deck-composer/SKILL.md` → one-paragraph pointer stub naming experience-composer; delete the old references/ copies

**Interfaces:**
- Consumes: the five compose tools (Task 4 names), certifier CLI (Task 5), demo-route scaffold pattern.
- Produces: the skill the controller follows for the five-sample test (Task 12).

- [ ] **Step 1: Move and generalize** — SKILL.md phases stay 0–6; Phase 2 picks the tool by surface (`compose_slide_deck` | `compose_dashboard` | `compose_project_page` | `compose_personal_page` | `compose_explainer`); Phase 3 becomes "narrative map" for decks (beats → slide kinds within repeats) and "section map" for single-page surfaces (which sections carry which source facts; every section earns its place); intake questions unchanged (fidelity retain-vs-condense, audience, technical depth, timing, style) plus one new: "is this a document to present (deck) or a destination to visit (page/dashboard/explainer)?" — only when the surface is not already given.
- [ ] **Step 2: fill-authoring.md** — stays surface-neutral; add a dashboard note (synthetic time-series/figures must be covered by the notice slot; magnitudes anchored to the skeleton examples) and a personal-page note (real-person facts only from the provided source; no invented biography).
- [ ] **Step 3: scaffold-and-verify.md** — generalize the route scaffold (demo routes for pages render the Template directly with theme lock, same `/demo/<slug>` pattern; SLIDE_COUNT in shoot.mjs becomes 1 screenshot for single-page surfaces at 1440×900 PLUS one full-page screenshot at full scroll height); content-fit checklist unchanged (template-leak first) with a single-page addition: check the page reads as a coherent visit, not a filled form.
- [ ] **Step 4: Stub** — deck-composer/SKILL.md becomes: name + one paragraph pointing to experience-composer (deck flow lives there verbatim).
- [ ] **Step 5: Commit** — `git commit -m 'feat(skills): generalize deck-composer to experience-composer across all five surfaces'` (+ trailer).

---

### Task 12: Five-sample goal verification (CONTROLLER-EXECUTED — not a subagent dispatch)

The controller follows the experience-composer skill end-to-end five times, one sample per surface, each from real source material chosen at execution (public, linkable sources the way OpenWiki was). Per sample:

- [ ] Intake: write `docs/superpowers/specs/<slug>-sample/source-context.md` (source facts, intake answers, section/narrative map, honesty ledger).
- [ ] Compose via the surface's tool (scripted outcome file mirroring `openwiki-outcome.ts`, asserting the expected template wins); author the fill; `validate_fill` loop to zero findings; client-side `FILL_SCHEMA.parse` passes.
- [ ] Scaffold `/demo/<slug>` route; `corepack pnpm --filter gallery build`; screenshot from `vite preview` (built app) via the shoot.mjs pattern.
- [ ] ≥2-pass hostile review at the bank-CEO bar (content AND design; template-leak check first). Defects route to their owner: fill (content), template/descriptor (craft), tool (selection/skeleton), skill (process) — never hand-edit output. Re-shoot after every fix.
- [ ] Record in the ledger; commit evidence (source-context, outcome json, screenshots).

Goal exit: all five samples pass, all gates green (typecheck, lint, unit incl. certifier, gallery build, e2e, trio + the new outcome scripts, canonical-brief matrix), ledger `=== GOAL MET ===` entry written.

---

## Execution notes

- Subagent-driven development; ledger `.superpowers/sdd/progress.md` (tasks here map to ledger T34+; check the ledger before dispatching anything).
- Implementer models: Tasks 1–6, 11 = opus; Tasks 7–10 = opus (craft extraction); reviews per SDD defaults.
- Tasks are strictly ordered 1→11 (each builds on the prior's interfaces); Task 12 is controller work after 11.
