# Template Fidelity + External-Client Rendering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let external MCP clients receive OpenDesign templates as real, buildable artifacts - a `templateFidelity` knob on the compose tools, MCP resources serving template/part source by reference, a `render_experience` tool that Vite-builds a standalone bundle, and the skill workflows (ADAPT / BORROW / COMPOSE) that consume them without blowing up the main agent's context.

**Architecture:** Everything moves **by reference**: tools return `opendesign://` URIs + byte sizes, never file contents. The server gains a resources capability (template source, part slices, rendered bundles). `render_experience` shells out to `vite build` on a tiny `render-host` app that maps `worldTemplateId → Template component` and imports a generated fill. The skill gains an ADAPT route and a fidelity branch; at `strict` only a subagent reads reference code.

**Tech Stack:** TypeScript, Zod, `@modelcontextprotocol/sdk` ^1.29 (`registerResource` + `ResourceTemplate`), Vite 8 + `@vitejs/plugin-react` + `@tailwindcss/vite`, Vitest.

**Spec:** `docs/superpowers/specs/2026-07-21-template-fidelity-external-clients-design.md` - read it first.

## Global Constraints

- `templateFidelity: 'strict' | 'free'`, **default `'strict'`** (applied in code, not in the Zod schema, so the field stays optional on the wire).
- Tools NEVER return file contents inline - URIs + byte sizes only.
- URI scheme (exact): `opendesign://templates/<worldTemplateId>/source/<file>`, `opendesign://parts/<experienceId>/<file>`, `opendesign://renders/<renderId>/<file>`.
- Renders: keep the **5** most recent, evict older; evicted read → `NOT_FOUND` with remediation "re-run render_experience".
- Every `isError` result must carry a JSON-serialized contracts `McpError` (existing invariant - use `makeError` from `errors.ts`).
- AUDIT workflow untouched. No `guided` level. No HTTP hosting.
- Repo commands run from `design-mcp-fable/` root; mcp-server tests: `corepack pnpm --filter mcp-server test` (wired with a registry prebuild). Commit after every task.
- The working tree may contain ANOTHER session's uncommitted grammar-specimen files (`spec-*` decks, `docs/superpowers/specs/grammar-specimens/`, `grammar-specimens-revalidate.mts`, `App.tsx`, `shoot-previews.mjs`). **Stage only files this plan touches - never `git add -A`. Do not push.**

## File Structure

```
apps/mcp-server/src/
  reference-files.ts            (new)  repo-root + experience-dir resolution, file listing, safe reads, URI builders
  reference-files.test.ts       (new)
  resources.ts                  (new)  registerResource wiring for templates/parts/renders
  render-store.ts               (new)  render ids, build queue, eviction, output listing
  tools/get-part-reference.ts   (new)  partId → source-slice manifest
  tools/get-part-reference.test.ts (new)
  tools/render-experience.ts    (new)  validate fill → vite build → bundle metadata
  schemas.ts                    (mod)  TemplateFidelity, ReferenceFile, TemplateReference, new tool IO schemas
  server.ts                     (mod)  resources capability + 2 new tool registrations + posture comment
  tools/compose-core.ts         (mod)  fidelity param, reference manifest on both return paths
  tools/compose-slide-deck.ts   (mod)  pass fidelity through
  tools/compose-surface.ts      (mod)  pass fidelity through
  server.test.ts                (mod)  fidelity + resources + part-reference + render integration tests
apps/mcp-server/render-host/
  index.html                    (new)
  vite.config.ts                (new)
  src/main.tsx                  (new)
  src/index.css                 (new)
  src/templates.ts              (new)  12-entry worldTemplateId → { load, theme } map
  generated/render-config.json  (new, committed default; overwritten per render)
  generated/fill.json           (new, committed default; overwritten per render)
  scripts/prepare-sample.mts    (new)  writes generated/* from the cockpit shipped fill
.claude/skills/open-design/
  SKILL.md                      (mod)  ADAPT route + triggers
  workflows/adapt.md            (new)
  workflows/compose.md          (mod)  fidelity phase + strict-port branch
  workflows/borrow.md           (mod)  fidelity phase + external-client path via get_part_reference
  references/porting.md         (new)  faithful-port rules + subagent dispatch pattern
```

---

### Task 1: `reference-files.ts` - locating and reading template source

**Files:**
- Create: `apps/mcp-server/src/reference-files.ts`
- Test: `apps/mcp-server/src/reference-files.test.ts`

**Interfaces:**
- Produces:
  - `repoRoot(): string` - absolute path of the workspace root.
  - `experienceDir(experienceId: string): string | undefined` - absolute dir, searching the five surface dirs.
  - `listExperienceFiles(experienceId: string): Array<{ path: string; bytes: number }> | undefined` - recursive, posix-relative paths, sorted, excluding `node_modules`/`dist`.
  - `readExperienceFile(experienceId: string, relPath: string): string | undefined` - traversal-safe UTF-8 read; `undefined` when missing/escaping.
  - `templateSourceUri(worldTemplateId: string, relPath: string): string`
  - `partFileUri(experienceId: string, relPath: string): string`

- [ ] **Step 1: Write the failing test**

```ts
// apps/mcp-server/src/reference-files.test.ts
import { describe, expect, it } from 'vitest';
import {
  experienceDir,
  listExperienceFiles,
  partFileUri,
  readExperienceFile,
  templateSourceUri,
} from './reference-files.js';

describe('reference-files', () => {
  it('resolves an experience dir across surface dirs', () => {
    expect(experienceDir('db-model-monitoring-cockpit')).toMatch(/dashboards[\\/]db-model-monitoring-cockpit$/);
    expect(experienceDir('deck-cloud-migration')).toMatch(/slide-decks[\\/]deck-cloud-migration$/);
    expect(experienceDir('nope-not-real')).toBeUndefined();
  });

  it('lists source files with byte sizes, posix paths, sorted', () => {
    const files = listExperienceFiles('db-model-monitoring-cockpit')!;
    const paths = files.map((f) => f.path);
    expect(paths).toContain('CockpitTemplate.tsx');
    expect(paths).toContain('cockpit.css');
    expect(paths.every((p) => !p.includes('\\'))).toBe(true);
    expect(files.every((f) => f.bytes > 0)).toBe(true);
    expect([...paths].sort()).toEqual(paths);
  });

  it('reads a file and refuses traversal', () => {
    expect(readExperienceFile('db-model-monitoring-cockpit', 'CockpitTemplate.tsx')).toContain('CockpitTemplate');
    expect(readExperienceFile('db-model-monitoring-cockpit', '../../package.json')).toBeUndefined();
    expect(readExperienceFile('db-model-monitoring-cockpit', 'missing.tsx')).toBeUndefined();
  });

  it('builds the spec URI shapes', () => {
    expect(templateSourceUri('cockpit', 'CockpitTemplate.tsx')).toBe(
      'opendesign://templates/cockpit/source/CockpitTemplate.tsx',
    );
    expect(partFileUri('deck-cloud-migration', 'CutoverTemplate.tsx')).toBe(
      'opendesign://parts/deck-cloud-migration/CutoverTemplate.tsx',
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm --filter mcp-server exec vitest run src/reference-files.test.ts`
Expected: FAIL - cannot resolve `./reference-files.js`.

- [ ] **Step 3: Write the implementation**

```ts
// apps/mcp-server/src/reference-files.ts
/**
 * Template/part source location and safe reads - the filesystem half of the
 * by-reference contract. Tools and resources return `opendesign://` URIs plus
 * byte sizes from here; file CONTENT only ever leaves through
 * `resources/read`, never through a tool result.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));

/** design-mcp-fable workspace root (this file lives at apps/mcp-server/src). */
export function repoRoot(): string {
  return path.resolve(here, '..', '..', '..');
}

/** The five experience surface directories, in scan order. */
const SURFACE_DIRS = ['dashboards', 'slide-decks', 'explainers', 'project-pages', 'personal-pages'];

const EXCLUDED = new Set(['node_modules', 'dist']);

export function experienceDir(experienceId: string): string | undefined {
  for (const surface of SURFACE_DIRS) {
    const dir = path.join(repoRoot(), 'experiences', surface, experienceId);
    if (existsSync(dir) && statSync(dir).isDirectory()) return dir;
  }
  return undefined;
}

function walk(dir: string, base: string, out: Array<{ path: string; bytes: number }>): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDED.has(entry.name)) continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(abs, base, out);
    else out.push({ path: path.relative(base, abs).split(path.sep).join('/'), bytes: statSync(abs).size });
  }
}

/** Recursive listing of an experience's source files (posix-relative, sorted). */
export function listExperienceFiles(experienceId: string): Array<{ path: string; bytes: number }> | undefined {
  const dir = experienceDir(experienceId);
  if (!dir) return undefined;
  const out: Array<{ path: string; bytes: number }> = [];
  walk(dir, dir, out);
  out.sort((a, b) => a.path.localeCompare(b.path));
  return out;
}

/** Traversal-safe UTF-8 read of one experience source file. */
export function readExperienceFile(experienceId: string, relPath: string): string | undefined {
  const dir = experienceDir(experienceId);
  if (!dir) return undefined;
  const abs = path.resolve(dir, relPath);
  if (!abs.startsWith(dir + path.sep)) return undefined;
  if (!existsSync(abs) || !statSync(abs).isFile()) return undefined;
  return readFileSync(abs, 'utf8');
}

export function templateSourceUri(worldTemplateId: string, relPath: string): string {
  return `opendesign://templates/${worldTemplateId}/source/${relPath}`;
}

export function partFileUri(experienceId: string, relPath: string): string {
  return `opendesign://parts/${experienceId}/${relPath}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `corepack pnpm --filter mcp-server exec vitest run src/reference-files.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/mcp-server/src/reference-files.ts apps/mcp-server/src/reference-files.test.ts
git commit -m "feat(mcp): reference-files - template source location, safe reads, opendesign:// URIs"
```

---

### Task 2: `templateFidelity` knob + reference manifest on compose tools

**Files:**
- Modify: `apps/mcp-server/src/schemas.ts` (after `FillSkeleton`, ~line 284)
- Modify: `apps/mcp-server/src/tools/compose-core.ts` (signature + both success returns)
- Modify: `apps/mcp-server/src/tools/compose-slide-deck.ts`, `apps/mcp-server/src/tools/compose-surface.ts`
- Test: extend `apps/mcp-server/src/server.test.ts`

**Interfaces:**
- Consumes: `listExperienceFiles`, `templateSourceUri` (Task 1).
- Produces:
  - `TemplateFidelity = z.enum(['strict', 'free'])` exported from `schemas.ts`.
  - Compose inputs gain optional `templateFidelity`; outputs gain optional `reference: TemplateReference`.
  - `TemplateReference = { templateId: string; sourceFiles: Array<{ uri, path, bytes }>; note: string }`.
  - `composeForSurface(registry, surface, ctx, contentBrief, toolName, fidelity: TemplateFidelity)` - new required last param.

- [ ] **Step 1: Add schemas**

In `schemas.ts`, after the `FillSkeleton` export add:

```ts
// ---- templateFidelity + reference manifest ---------------------------------

/**
 * How faithful the consuming skill must be to the selected template.
 * 'strict' (the DEFAULT, applied in code): reproduce the template's real
 * design - the response carries a reference manifest of source-file resource
 * URIs to port from. 'free': contract only; the client designs the visuals.
 * Named for direction-clarity: high fidelity = faithful to the template
 * ("creativity level" was rejected as inverted).
 */
export const TemplateFidelity = z.enum(['strict', 'free']);
export type TemplateFidelity = z.infer<typeof TemplateFidelity>;

/** One reference source file - a pointer, NEVER inline content. */
export const ReferenceFile = z.object({
  uri: z.string().describe("opendesign:// resource URI - fetch via resources/read."),
  path: z.string().describe('Path relative to the experience source dir.'),
  bytes: z.number().int(),
});
export type ReferenceFile = z.infer<typeof ReferenceFile>;

/** The strict-fidelity reference manifest for the selected template. */
export const TemplateReference = z.object({
  templateId: z.string(),
  sourceFiles: z.array(ReferenceFile),
  note: z.string(),
});
export type TemplateReference = z.infer<typeof TemplateReference>;
```

Add to `ComposeSlideDeckInput` (and the four surface inputs in the same file - each is its own `z.object`) the field:

```ts
  templateFidelity: TemplateFidelity.optional().describe(
    "How faithful the consumer must be to the template. Default 'strict': the response includes a reference manifest of source resource URIs to port from. 'free': contract only.",
  ),
```

Add to `ComposeSlideDeckOutput`:

```ts
  /** Present at templateFidelity 'strict' (the default): source pointers for the winner. */
  reference: TemplateReference.optional(),
```

- [ ] **Step 2: Write the failing tests** (in `server.test.ts`, new `describe`)

```ts
describe('templateFidelity', () => {
  it('compose_slide_deck defaults to strict and returns a reference manifest of URIs only', async () => {
    const result = (await client.callTool({
      name: 'compose_slide_deck',
      arguments: { context: deckContext(), contentBrief: 'quarterly business review' },
    })) as CallToolResult;
    expect(result.isError).toBeFalsy();
    const out = ComposeSlideDeckOutput.parse(result.structuredContent);
    expect(out.reference).toBeDefined();
    expect(out.reference!.templateId).toBe(out.worldTemplateId);
    expect(out.reference!.sourceFiles.length).toBeGreaterThan(0);
    for (const f of out.reference!.sourceFiles) {
      expect(f.uri).toBe(`opendesign://templates/${out.worldTemplateId}/source/${f.path}`);
      expect(f.bytes).toBeGreaterThan(0);
    }
    // by-reference contract: no file content anywhere in the payload
    expect(JSON.stringify(out)).not.toContain('import ');
  });

  it("templateFidelity 'free' omits the reference manifest", async () => {
    const result = (await client.callTool({
      name: 'compose_slide_deck',
      arguments: { context: deckContext(), contentBrief: 'quarterly business review', templateFidelity: 'free' },
    })) as CallToolResult;
    const out = ComposeSlideDeckOutput.parse(result.structuredContent);
    expect(out.reference).toBeUndefined();
  });
});
```

- [ ] **Step 3: Run to verify failure**

Run: `corepack pnpm --filter mcp-server exec vitest run src/server.test.ts -t templateFidelity`
Expected: FAIL - `reference` undefined (and unknown-argument rejection until schemas land).

- [ ] **Step 4: Implement**

In `compose-core.ts`: import `type TemplateFidelity` from `../schemas.js` and `listExperienceFiles, templateSourceUri` from `../reference-files.js`. Add helper:

```ts
function buildReference(descriptor: WorldTemplateDescriptor): TemplateReference | undefined {
  const files = listExperienceFiles(descriptor.experienceId);
  if (!files) return undefined;
  return {
    templateId: descriptor.id,
    sourceFiles: files.map((f) => ({ uri: templateSourceUri(descriptor.id, f.path), path: f.path, bytes: f.bytes })),
    note:
      'Strict fidelity: port this design faithfully - adjust only for content and consistency with the existing design. Fetch files individually via resources/read; do NOT load them into the orchestrating agent context (dispatch a subagent to read and port).',
  };
}
```

Thread `fidelity: TemplateFidelity` as the sixth parameter of `composeForSurface`; on BOTH success returns (the pinned path near line 267 and the scored path near line 311) add:

```ts
      ...(fidelity === 'strict' ? { reference: buildReference(descriptor) } : {}),
```

(for the pinned path the descriptor variable is `pinned`). In `compose-slide-deck.ts` and each of the four wrappers in `compose-surface.ts`, pass `parsed.data.templateFidelity ?? 'strict'`.

`ComposeSlideDeckInput` wrappers advertise input schemas in `server.ts` via `.shape` - no server.ts change needed beyond what registerTool already spreads. Verify by reading the `compose_slide_deck` registration block.

- [ ] **Step 5: Run the full mcp-server suite**

Run: `corepack pnpm --filter mcp-server test`
Expected: PASS - new tests green; existing sample-outcome/compose tests unaffected (additive optional field).

- [ ] **Step 6: Commit**

```bash
git add apps/mcp-server/src/schemas.ts apps/mcp-server/src/tools/compose-core.ts apps/mcp-server/src/tools/compose-slide-deck.ts apps/mcp-server/src/tools/compose-surface.ts apps/mcp-server/src/server.test.ts
git commit -m "feat(mcp): templateFidelity knob - strict default returns reference manifest by URI"
```

---

### Task 3: resources capability - serve template + part source

**Files:**
- Create: `apps/mcp-server/src/resources.ts`
- Modify: `apps/mcp-server/src/server.ts` (capabilities + one call)
- Test: extend `apps/mcp-server/src/server.test.ts`

**Interfaces:**
- Consumes: `readExperienceFile`, `experienceDir` (Task 1); `RegistryData.worldTemplates` (templateId → experienceId).
- Produces: `registerReferenceResources(server: McpServer, registry: RegistryData): void`.

- [ ] **Step 1: Write the failing tests**

```ts
describe('reference resources', () => {
  it('serves template source by URI', async () => {
    const res = await client.readResource({
      uri: 'opendesign://templates/cockpit/source/CockpitTemplate.tsx',
    });
    const first = res.contents[0]!;
    expect(first.mimeType).toBe('text/plain');
    expect(String(first.text)).toContain('CockpitTemplate');
  });

  it('serves part source by URI', async () => {
    const res = await client.readResource({
      uri: 'opendesign://parts/deck-cloud-migration/CutoverTemplate.tsx',
    });
    expect(String(res.contents[0]!.text)).toContain('data-part-id');
  });

  it('rejects unknown template ids and traversal', async () => {
    await expect(
      client.readResource({ uri: 'opendesign://templates/nope/source/x.tsx' }),
    ).rejects.toThrow();
    await expect(
      client.readResource({ uri: 'opendesign://templates/cockpit/source/../../package.json' }),
    ).rejects.toThrow();
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `corepack pnpm --filter mcp-server exec vitest run src/server.test.ts -t "reference resources"`
Expected: FAIL - server has no resources capability.

- [ ] **Step 3: Implement `resources.ts`**

```ts
// apps/mcp-server/src/resources.ts
/**
 * MCP resources - the ONLY channel that moves file content to clients.
 * Tools return `opendesign://` URIs (see reference-files.ts); these handlers
 * resolve them. Reads are traversal-safe; unknown ids throw, which the SDK
 * surfaces as a resources/read error.
 */
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { RegistryData } from './registry-data.js';
import { readExperienceFile } from './reference-files.js';

function textContents(uri: string, text: string) {
  return { contents: [{ uri, mimeType: 'text/plain', text }] };
}

export function registerReferenceResources(server: McpServer, registry: RegistryData): void {
  server.registerResource(
    'template-source',
    new ResourceTemplate('opendesign://templates/{templateId}/source/{+file}', { list: undefined }),
    {
      title: 'World-template source file',
      description: 'Source of a catalogue world-template, for strict-fidelity porting.',
    },
    async (uri, variables) => {
      const templateId = String(variables.templateId);
      const file = String(variables.file);
      const descriptor = registry.worldTemplates.find((t) => t.id === templateId);
      if (!descriptor) throw new Error(`Unknown world template '${templateId}'.`);
      const text = readExperienceFile(descriptor.experienceId, file);
      if (text === undefined) throw new Error(`No source file '${file}' in template '${templateId}'.`);
      return textContents(uri.href, text);
    },
  );

  server.registerResource(
    'part-source',
    new ResourceTemplate('opendesign://parts/{experienceId}/{+file}', { list: undefined }),
    {
      title: 'Experience part source file',
      description: 'Source of a live-world file referenced by get_part_reference.',
    },
    async (uri, variables) => {
      const experienceId = String(variables.experienceId);
      const file = String(variables.file);
      const text = readExperienceFile(experienceId, file);
      if (text === undefined) throw new Error(`No source file '${file}' in experience '${experienceId}'.`);
      return textContents(uri.href, text);
    },
  );
}
```

In `server.ts`: change capabilities to `{ capabilities: { tools: {}, resources: {} } }`, import and call `registerReferenceResources(server, registry)` right after `installStructuredErrorWrapper(server)`. Update the file-header comment: the server's filesystem posture is now "registry JSON at startup + read-only experience source via resources + writes confined to `render-out/`" (render-out arrives in Task 6; write the comment once here).

**Note on `{+file}`:** RFC 6570 reserved expansion - required so `file` may contain `/`. If `ResourceTemplate` in SDK 1.29 fails to match nested paths in the Step 4 run, fall back to registering with `{file}` and URL-encoding the path in `templateSourceUri`/`partFileUri` (`encodeURIComponent(relPath)`) plus `decodeURIComponent` here - adjust the Task 1 URI test expectations accordingly and note it in the commit message.

- [ ] **Step 4: Run tests**

Run: `corepack pnpm --filter mcp-server exec vitest run src/server.test.ts -t "reference resources"`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/mcp-server/src/resources.ts apps/mcp-server/src/server.ts apps/mcp-server/src/server.test.ts
git commit -m "feat(mcp): resources capability - template + part source served by opendesign:// URI"
```

---

### Task 4: `get_part_reference` tool

**Files:**
- Create: `apps/mcp-server/src/tools/get-part-reference.ts`
- Test: `apps/mcp-server/src/tools/get-part-reference.test.ts`
- Modify: `apps/mcp-server/src/schemas.ts`, `apps/mcp-server/src/server.ts`

**Interfaces:**
- Consumes: `experienceDir`, `listExperienceFiles`, `readExperienceFile`, `partFileUri` (Task 1); `ReferenceFile` (Task 2); `makeError`/`ToolOutcome` (existing).
- Produces: `getPartReferenceTool(rawInput: unknown): ToolOutcome<GetPartReferenceOutput>` with output `{ partId, experienceId, files: ReferenceFile[], note }`.

- [ ] **Step 1: Add schemas** (in `schemas.ts`)

```ts
// ---- get_part_reference -----------------------------------------------------

export const GetPartReferenceInput = z.object({
  partId: z
    .string()
    .min(3)
    .describe("A data-part-id from the gallery part inspector: '<experienceId>/<section>[/<part>]'."),
});
export type GetPartReferenceInput = z.infer<typeof GetPartReferenceInput>;

export const GetPartReferenceOutput = z.object({
  partId: z.string(),
  experienceId: z.string(),
  /** Source files implementing the part (matching TSX/TS) plus the experience's stylesheets. */
  files: z.array(ReferenceFile),
  note: z.string(),
});
export type GetPartReferenceOutput = z.infer<typeof GetPartReferenceOutput>;
```

- [ ] **Step 2: Write the failing test**

```ts
// apps/mcp-server/src/tools/get-part-reference.test.ts
import { describe, expect, it } from 'vitest';
import { getPartReferenceTool } from './get-part-reference.js';

describe('get_part_reference', () => {
  it('resolves a known part to its implementing files + stylesheets', () => {
    const outcome = getPartReferenceTool({ partId: 'deck-cloud-migration/waves/swimlanes' });
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    const paths = outcome.data.files.map((f) => f.path);
    expect(paths).toContain('CutoverTemplate.tsx');
    expect(paths.some((p) => p.endsWith('.css'))).toBe(true);
    for (const f of outcome.data.files) {
      expect(f.uri).toBe(`opendesign://parts/deck-cloud-migration/${f.path}`);
    }
  });

  it('resolves a dynamic (template-literal) part id via its tail segment', () => {
    const outcome = getPartReferenceTool({ partId: 'deck-cloud-migration/estate/estate-diagram' });
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.data.files.map((f) => f.path)).toContain('CutoverTemplate.tsx');
  });

  it('NOT_FOUND for an unknown part, with nearby part-id suggestions', () => {
    const outcome = getPartReferenceTool({ partId: 'deck-cloud-migration/nope/nothing' });
    expect(outcome.ok).toBe(false);
    if (outcome.ok) return;
    expect(outcome.error.code).toBe('NOT_FOUND');
    expect(outcome.error.details!.join(' ')).toContain('deck-cloud-migration/');
  });

  it('NOT_FOUND for an unknown experience', () => {
    const outcome = getPartReferenceTool({ partId: 'no-such-world/a/b' });
    expect(outcome.ok).toBe(false);
    if (outcome.ok) return;
    expect(outcome.error.code).toBe('NOT_FOUND');
  });
});
```

- [ ] **Step 3: Run to verify failure**

Run: `corepack pnpm --filter mcp-server exec vitest run src/tools/get-part-reference.test.ts`
Expected: FAIL - module not found.

- [ ] **Step 4: Implement**

```ts
// apps/mcp-server/src/tools/get-part-reference.ts
/**
 * `get_part_reference` - resolve a `data-part-id` to the source files that
 * implement it, as opendesign://parts/ URIs (BORROW for external clients).
 * Matching: a file matches if it contains the full part id literally, or the
 * part's tail segment (covers template-literal ids like
 * `deck-cloud-migration/${layout}/estate-diagram`). The experience's
 * stylesheets always ship - a part's look is inseparable from its CSS.
 */
import { GetPartReferenceInput, type GetPartReferenceOutput } from '../schemas.js';
import { makeError, newRequestId, type ToolOutcome } from '../errors.js';
import { experienceDir, listExperienceFiles, partFileUri, readExperienceFile } from '../reference-files.js';

const SOURCE_EXT = /\.(tsx|ts)$/;
const MAX_SUGGESTIONS = 10;

export function getPartReferenceTool(rawInput: unknown): ToolOutcome<GetPartReferenceOutput> {
  const requestId = newRequestId();
  const parsed = GetPartReferenceInput.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      error: makeError('INVALID_INPUT', 'Invalid arguments for get_part_reference.', {
        requestId,
        details: parsed.error.issues.map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`),
        remediation: ["Pass { partId: '<experienceId>/<section>[/<part>]' }."],
      }),
    };
  }

  const partId = parsed.data.partId;
  const segments = partId.split('/').filter(Boolean);
  const experienceId = segments[0] ?? '';
  if (segments.length < 2 || !experienceDir(experienceId)) {
    return {
      ok: false,
      error: makeError('NOT_FOUND', `Unknown experience '${experienceId}' in part id '${partId}'.`, {
        requestId,
        remediation: ['Part ids come from the gallery part inspector: <experienceId>/<section>[/<part>].'],
      }),
    };
  }

  const tail = segments[segments.length - 1]!;
  const files = listExperienceFiles(experienceId)!;
  const matching: string[] = [];
  const seenPartIds = new Set<string>();
  for (const f of files) {
    if (!SOURCE_EXT.test(f.path)) continue;
    const text = readExperienceFile(experienceId, f.path)!;
    for (const m of text.matchAll(/data-part-id="([^"]+)"/g)) seenPartIds.add(m[1]!);
    if (text.includes(partId) || text.includes(`/${tail}`)) matching.push(f.path);
  }

  if (matching.length === 0) {
    return {
      ok: false,
      error: makeError('NOT_FOUND', `No source implements part '${partId}'.`, {
        requestId,
        details: [...seenPartIds].sort().slice(0, MAX_SUGGESTIONS).map((id) => `known part: ${id}`),
        remediation: ['Check the part id in the gallery part inspector; static ids are listed in details.'],
      }),
    };
  }

  const styles = files.filter((f) => f.path.endsWith('.css')).map((f) => f.path);
  const chosen = [...new Set([...matching, ...styles])];
  const byPath = new Map(files.map((f) => [f.path, f.bytes]));
  return {
    ok: true,
    data: {
      partId,
      experienceId,
      files: chosen.map((p) => ({ uri: partFileUri(experienceId, p), path: p, bytes: byPath.get(p)! })),
      note:
        'Fetch files individually via resources/read; dispatch a subagent to read and port - do not load them into the orchestrating agent context.',
    },
  };
}
```

Register in `server.ts` (after the `validate_fill` block, same shape as `get_component`):

```ts
  server.registerTool(
    'get_part_reference',
    {
      title: 'Get part source reference',
      description:
        "Resolve a data-part-id ('<experienceId>/<section>[/<part>]', from the gallery part inspector) to the source files implementing it, as opendesign://parts/ resource URIs with byte sizes. Content is fetched via resources/read, never inline.",
      inputSchema: GetPartReferenceInput.shape,
      outputSchema: GetPartReferenceOutput.shape,
      annotations: { title: 'Get part source reference', ...READ_ONLY_ANNOTATIONS },
    },
    async (args) => {
      const outcome = getPartReferenceTool(args);
      logger.info('get_part_reference', { ok: outcome.ok });
      return toCallToolResult(outcome);
    },
  );
```

(Match the surrounding registrations' exact callback/logging style - read one neighbouring block first and mirror it.)

- [ ] **Step 5: Run tool tests + full suite**

Run: `corepack pnpm --filter mcp-server test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/mcp-server/src/tools/get-part-reference.ts apps/mcp-server/src/tools/get-part-reference.test.ts apps/mcp-server/src/schemas.ts apps/mcp-server/src/server.ts
git commit -m "feat(mcp): get_part_reference - data-part-id to source-slice manifest"
```

---

### Task 5: render-host - the buildable wrapper app

**Files:**
- Create: `apps/mcp-server/render-host/index.html`, `vite.config.ts`, `src/main.tsx`, `src/index.css`, `src/templates.ts`, `generated/render-config.json`, `generated/fill.json`, `scripts/prepare-sample.mts`
- Modify: `apps/mcp-server/tsconfig.json` (exclude `render-host` - it builds with Vite, not tsc), `apps/mcp-server/package.json` (devDeps), root `.gitignore` (render output + generated overwrites)

**Interfaces:**
- Produces: a Vite app such that `corepack pnpm exec vite build --config apps/mcp-server/render-host/vite.config.ts --outDir <abs> --emptyOutDir` (run from repo root) emits a standalone bundle rendering `templates.ts[config.templateId]` with `generated/fill.json`. Task 6 shells into exactly this command.

- [ ] **Step 1: Files**

`index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OpenDesign render</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`vite.config.ts` (mirror the gallery's config - react + tailwind plugins, workspace fs allow):

```ts
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const workspaceRoot = fileURLToPath(new URL('../../..', import.meta.url));

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [react(), tailwindcss()],
  server: { fs: { allow: [workspaceRoot] } },
  build: { chunkSizeWarningLimit: 1500 },
});
```

`src/templates.ts` - the 12-entry map (ids and experience dirs verified against `packages/registry/generated/world-templates.json`; template component filenames MUST be verified by listing each experience dir before writing this file - the pattern is `<Name>Template.tsx` but names vary, e.g. `CockpitTemplate`, `CutoverTemplate`):

```ts
import type { ComponentType } from 'react';

export interface RenderTemplate {
  load: () => Promise<{ default: ComponentType<{ fill: never }> }>;
  /** Templates that lock a document theme (e.g. cockpit locks dark). */
  theme?: 'dark' | 'light';
}

/** worldTemplateId → renderable template component. Keep in sync with world-templates.json. */
export const TEMPLATES: Record<string, RenderTemplate> = {
  cockpit: { load: () => import('../../../../experiences/dashboards/db-model-monitoring-cockpit/CockpitTemplate.js'), theme: 'dark' },
  cutover: { load: () => import('../../../../experiences/slide-decks/deck-cloud-migration/CutoverTemplate.js') },
  // ... one entry per remaining template id: dgm-blueprint, dgm-circuit,
  // dgm-gazette, dgm-isometric, dgm-sketchnote, drawing-office, ledger,
  // quarter, the-line, tminus - component path verified per experience dir.
};
```

(The implementer fills all 12 entries with verified paths; a missing/wrong path fails the Step 3 build, so errors cannot ship silently. Check each template's demo/spec page under `apps/gallery/src/App.tsx` imports for the proven import path and any theme lock.)

`src/main.tsx`:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import config from '../generated/render-config.json';
import fill from '../generated/fill.json';
import { TEMPLATES } from './templates.js';
import './index.css';

const entry = TEMPLATES[config.templateId];
if (!entry) throw new Error(`render-host: unknown templateId '${config.templateId}'`);
if (entry.theme) document.documentElement.setAttribute('data-theme', entry.theme);

const { default: Template } = await entry.load();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Template fill={fill as never} />
  </StrictMode>,
);
```

`src/index.css` - copy the gallery's token/theme import chain (`apps/gallery/src/index.css` lines 13–17: tailwindcss, design-tokens, both gallery-ink themes, primitives tailwind-theme) **plus** the gallery's `@source` globs for the experiences + packages so Tailwind generates the classes templates use; copy those globs verbatim from the gallery file, adjusting relative paths from `apps/mcp-server/render-host/src/`.

`generated/render-config.json` (committed default): `{ "templateId": "cockpit" }`
`generated/fill.json` (committed default): `{}`

`scripts/prepare-sample.mts`:

```ts
/** Writes generated/{render-config,fill}.json from the cockpit shipped fill - build smoke input. */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { cockpitFill } from '../../../../experiences/dashboards/db-model-monitoring-cockpit/cockpit-fill.js';

const gen = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'generated');
writeFileSync(path.join(gen, 'render-config.json'), JSON.stringify({ templateId: 'cockpit' }, null, 2));
writeFileSync(path.join(gen, 'fill.json'), JSON.stringify(cockpitFill, null, 2));
console.log('render-host sample prepared (cockpit)');
```

(Verify the fill export name in `cockpit-fill.ts` first and use the actual one.)

`apps/mcp-server/tsconfig.json`: add `"exclude": ["render-host"]` (merge with any existing exclude). `apps/mcp-server/package.json` devDependencies: add `"@vitejs/plugin-react"`, `"@tailwindcss/vite"`, `"vite"`, `"react"`, `"react-dom"`, `"@types/react"`, `"@types/react-dom"` at the versions the gallery uses (copy from `apps/gallery/package.json`), plus workspace deps the templates import (match the gallery's `@enterprise-design/*` list). Run `corepack pnpm install`. Root `.gitignore`: add `apps/mcp-server/render-out/`.

- [ ] **Step 2: Build smoke - prepare sample then build**

Run (repo root):
```bash
node --import tsx apps/mcp-server/render-host/scripts/prepare-sample.mts
corepack pnpm exec vite build --config apps/mcp-server/render-host/vite.config.ts --outDir "$PWD/apps/mcp-server/render-out/smoke" --emptyOutDir
```
Expected: build succeeds; `apps/mcp-server/render-out/smoke/index.html` exists and references hashed JS/CSS assets.

- [ ] **Step 3: Restore committed defaults** (so the working tree stays canonical)

```bash
git checkout -- apps/mcp-server/render-host/generated 2>/dev/null || true
```
(If checkout fails because the files are new, rewrite them to the defaults from Step 1.)

- [ ] **Step 4: Commit**

```bash
git add apps/mcp-server/render-host apps/mcp-server/tsconfig.json apps/mcp-server/package.json pnpm-lock.yaml .gitignore
git commit -m "feat(mcp): render-host - buildable wrapper app for world templates"
```

---

### Task 6: `render_experience` tool + renders resource

**Files:**
- Create: `apps/mcp-server/src/render-store.ts`, `apps/mcp-server/src/tools/render-experience.ts`
- Modify: `apps/mcp-server/src/schemas.ts`, `apps/mcp-server/src/server.ts`, `apps/mcp-server/src/resources.ts`
- Test: extend `apps/mcp-server/src/server.test.ts` (integration, long timeout)

**Interfaces:**
- Consumes: `validateFillTool(registry, rawInput)` (existing - reuse for pre-build validation); render-host build command (Task 5); `repoRoot()` (Task 1).
- Produces:
  - `renderExperienceTool(registry, rawInput): Promise<ToolOutcome<RenderExperienceOutput>>` - note **async** (the only async tool; the registration callback already awaits).
  - `RenderExperienceOutput = { renderId, entryUri, files: Array<{ uri, path, bytes }>, totalBytes, buildMs }`.
  - `render-store.ts`: `runRender(templateId, fill): Promise<{ renderId, outDir, buildMs }>` (serialized queue), `readRenderFile(renderId, relPath): Buffer | undefined`, `MAX_RENDERS = 5` eviction.

- [ ] **Step 1: Add schemas**

```ts
// ---- render_experience ------------------------------------------------------

export const RenderExperienceInput = z.object({
  worldTemplateId: z.string().min(1).describe('A compiled world-template id (see compose alternatives).'),
  fill: z
    .record(z.string(), z.unknown())
    .describe('The complete fill object; validated with validate_fill semantics before building.'),
});
export type RenderExperienceInput = z.infer<typeof RenderExperienceInput>;

export const RenderExperienceOutput = z.object({
  renderId: z.string(),
  entryUri: z.string().describe('opendesign://renders/<renderId>/index.html'),
  files: z.array(ReferenceFile),
  totalBytes: z.number().int(),
  buildMs: z.number().int(),
});
export type RenderExperienceOutput = z.infer<typeof RenderExperienceOutput>;
```

- [ ] **Step 2: Write the failing integration test** (in `server.test.ts`)

```ts
describe('render_experience', () => {
  it(
    'builds a standalone bundle and serves it via renders resources',
    async () => {
      const { cockpitFill } = await import(
        '../../../experiences/dashboards/db-model-monitoring-cockpit/cockpit-fill.js'
      );
      const result = (await client.callTool({
        name: 'render_experience',
        arguments: { worldTemplateId: 'cockpit', fill: cockpitFill },
      })) as CallToolResult;
      expect(result.isError).toBeFalsy();
      const out = RenderExperienceOutput.parse(result.structuredContent);
      expect(out.entryUri).toBe(`opendesign://renders/${out.renderId}/index.html`);
      expect(out.files.map((f) => f.path)).toContain('index.html');
      expect(out.totalBytes).toBeGreaterThan(10_000);

      const entry = await client.readResource({ uri: out.entryUri });
      expect(String(entry.contents[0]!.text)).toContain('<div id="root">');
    },
    240_000,
  );

  it('rejects an invalid fill without building', async () => {
    const result = (await client.callTool({
      name: 'render_experience',
      arguments: { worldTemplateId: 'cockpit', fill: { nonsense: true } },
    })) as CallToolResult;
    expect(result.isError).toBe(true);
    const err = JSON.parse((result.content as Array<{ text: string }>)[0]!.text) as McpError;
    expect(err.code).toBe('INVALID_INPUT');
  });

  it('unknown template is UNKNOWN_TEMPLATE-style NOT_FOUND', async () => {
    const result = (await client.callTool({
      name: 'render_experience',
      arguments: { worldTemplateId: 'nope', fill: {} },
    })) as CallToolResult;
    expect(result.isError).toBe(true);
  });
});
```

(Verify the cockpit fill export name before writing; adjust if it differs.)

- [ ] **Step 3: Run to verify failure** - `corepack pnpm --filter mcp-server exec vitest run src/server.test.ts -t render_experience` → FAIL (unknown tool).

- [ ] **Step 4: Implement `render-store.ts`**

```ts
// apps/mcp-server/src/render-store.ts
/**
 * Render builds and their on-disk store. Builds are SERIALIZED (one vite
 * build at a time - they share render-host/generated). The store keeps the
 * MAX_RENDERS most recent bundles under apps/mcp-server/render-out/ and
 * evicts older ones; an evicted read returns undefined (NOT_FOUND upstream).
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { repoRoot } from './reference-files.js';

export const MAX_RENDERS = 5;

const renderHost = () => path.join(repoRoot(), 'apps', 'mcp-server', 'render-host');
const renderOut = () => path.join(repoRoot(), 'apps', 'mcp-server', 'render-out');

let queue: Promise<unknown> = Promise.resolve();

function viteBuild(outDir: string): Promise<{ code: number; logTail: string }> {
  return new Promise((resolve) => {
    const child = spawn(
      'corepack',
      ['pnpm', 'exec', 'vite', 'build', '--config', path.join(renderHost(), 'vite.config.ts'), '--outDir', outDir, '--emptyOutDir'],
      { cwd: repoRoot(), shell: process.platform === 'win32' },
    );
    let log = '';
    child.stdout.on('data', (d: Buffer) => (log += d.toString()));
    child.stderr.on('data', (d: Buffer) => (log += d.toString()));
    child.on('close', (code) => resolve({ code: code ?? 1, logTail: log.slice(-2000) }));
  });
}

function evictOld(): void {
  if (!existsSync(renderOut())) return;
  const dirs = readdirSync(renderOut(), { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => ({ name: e.name, mtime: statSync(path.join(renderOut(), e.name)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);
  for (const stale of dirs.slice(MAX_RENDERS)) rmSync(path.join(renderOut(), stale.name), { recursive: true, force: true });
}

export function runRender(
  templateId: string,
  fill: Record<string, unknown>,
): Promise<{ ok: true; renderId: string; outDir: string; buildMs: number } | { ok: false; logTail: string }> {
  const job = queue.then(async () => {
    const renderId = randomUUID();
    const outDir = path.join(renderOut(), renderId);
    mkdirSync(path.join(renderHost(), 'generated'), { recursive: true });
    writeFileSync(path.join(renderHost(), 'generated', 'render-config.json'), JSON.stringify({ templateId }));
    writeFileSync(path.join(renderHost(), 'generated', 'fill.json'), JSON.stringify(fill));
    const started = Date.now();
    const { code, logTail } = await viteBuild(outDir);
    if (code !== 0) {
      rmSync(outDir, { recursive: true, force: true }); // never a partial bundle
      return { ok: false as const, logTail };
    }
    evictOld();
    return { ok: true as const, renderId, outDir, buildMs: Date.now() - started };
  });
  queue = job.catch(() => undefined);
  return job;
}

export function listRenderFiles(renderId: string): Array<{ path: string; bytes: number }> | undefined {
  const dir = path.join(renderOut(), renderId);
  if (!existsSync(dir)) return undefined;
  const out: Array<{ path: string; bytes: number }> = [];
  const walk = (d: string) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const abs = path.join(d, e.name);
      if (e.isDirectory()) walk(abs);
      else out.push({ path: path.relative(dir, abs).split(path.sep).join('/'), bytes: statSync(abs).size });
    }
  };
  walk(dir);
  return out.sort((a, b) => a.path.localeCompare(b.path));
}

export function readRenderFile(renderId: string, relPath: string): Buffer | undefined {
  const dir = path.join(renderOut(), renderId);
  const abs = path.resolve(dir, relPath);
  if (!abs.startsWith(dir + path.sep) || !existsSync(abs) || !statSync(abs).isFile()) return undefined;
  return readFileSync(abs);
}
```

- [ ] **Step 5: Implement `tools/render-experience.ts`**

```ts
// apps/mcp-server/src/tools/render-experience.ts
/**
 * `render_experience` - validate a fill, then vite-build the template + fill
 * into a standalone static bundle and return POINTERS (renders resource URIs
 * + sizes). The heavy artifact never enters the tool result.
 */
import { RenderExperienceInput, type RenderExperienceOutput } from '../schemas.js';
import { makeError, newRequestId, type ToolOutcome } from '../errors.js';
import type { RegistryData } from '../registry-data.js';
import { validateFillTool } from './validate-fill.js';
import { listRenderFiles, runRender } from '../render-store.js';

export async function renderExperienceTool(
  registry: RegistryData,
  rawInput: unknown,
): Promise<ToolOutcome<RenderExperienceOutput>> {
  const requestId = newRequestId();
  const parsed = RenderExperienceInput.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      error: makeError('INVALID_INPUT', 'Invalid arguments for render_experience.', {
        requestId,
        details: parsed.error.issues.map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`),
        remediation: ['Pass { worldTemplateId, fill } - fill must satisfy validate_fill first.'],
      }),
    };
  }
  const { worldTemplateId, fill } = parsed.data;

  const validation = validateFillTool(registry, { worldTemplateId, fill });
  if (!validation.ok) return validation as ToolOutcome<never>;
  if (!validation.data.valid) {
    return {
      ok: false,
      error: makeError('INVALID_INPUT', `Fill fails validation for '${worldTemplateId}' - not building.`, {
        requestId,
        details: validation.data.findings.map((f: { message: string }) => f.message).slice(0, 20),
        remediation: ['Fix the fill via validate_fill until valid, then re-run render_experience.'],
      }),
    };
  }

  const built = await runRender(worldTemplateId, fill);
  if (!built.ok) {
    return {
      ok: false,
      error: makeError('INTERNAL_ERROR', 'Vite build failed; no bundle was kept.', {
        requestId,
        details: [built.logTail],
        remediation: ['Inspect the build log tail; a template map gap in render-host/src/templates.ts is the most common cause.'],
      }),
    };
  }

  const files = listRenderFiles(built.renderId)!;
  return {
    ok: true,
    data: {
      renderId: built.renderId,
      entryUri: `opendesign://renders/${built.renderId}/index.html`,
      files: files.map((f) => ({ uri: `opendesign://renders/${built.renderId}/${f.path}`, path: f.path, bytes: f.bytes })),
      totalBytes: files.reduce((n, f) => n + f.bytes, 0),
      buildMs: built.buildMs,
    },
  };
}
```

Check `ValidateFillOutput`'s finding shape first and use its real field (adjust `f.message` if the schema names it differently).

- [ ] **Step 6: Register tool + renders resource**

`server.ts` - register `render_experience` (NOT read-only):

```ts
  server.registerTool(
    'render_experience',
    {
      title: 'Render experience bundle',
      description:
        'Build a standalone static bundle (Vite) for a world template + validated fill. Returns render resource URIs + sizes - fetch content via resources/read. Builds are serialized; the 5 most recent renders are kept.',
      inputSchema: RenderExperienceInput.shape,
      outputSchema: RenderExperienceOutput.shape,
      annotations: { title: 'Render experience bundle', readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    },
    async (args) => {
      const outcome = await renderExperienceTool(registry, args);
      logger.info('render_experience', { ok: outcome.ok });
      return toCallToolResult(outcome);
    },
  );
```

`resources.ts` - add the renders template (text for `.html/.css/.js/.json/.svg/.txt`, base64 `blob` otherwise):

```ts
  server.registerResource(
    'render-bundle',
    new ResourceTemplate('opendesign://renders/{renderId}/{+file}', { list: undefined }),
    { title: 'Rendered experience bundle file', description: 'A file from a render_experience build (5 most recent kept).' },
    async (uri, variables) => {
      const renderId = String(variables.renderId);
      const file = String(variables.file);
      const data = readRenderFile(renderId, file);
      if (!data) throw new Error(`No render file '${file}' for '${renderId}' - evicted or never built; re-run render_experience.`);
      const ext = file.slice(file.lastIndexOf('.'));
      const textTypes: Record<string, string> = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.txt': 'text/plain' };
      const mime = textTypes[ext];
      return mime
        ? { contents: [{ uri: uri.href, mimeType: mime, text: data.toString('utf8') }] }
        : { contents: [{ uri: uri.href, mimeType: 'application/octet-stream', blob: data.toString('base64') }] };
    },
  );
```

- [ ] **Step 7: Run the integration tests** - `corepack pnpm --filter mcp-server exec vitest run src/server.test.ts -t render_experience` (allow ~4 min) → PASS. Then the full suite: `corepack pnpm --filter mcp-server test` → PASS.

- [ ] **Step 8: Commit**

```bash
git add apps/mcp-server/src/render-store.ts apps/mcp-server/src/tools/render-experience.ts apps/mcp-server/src/schemas.ts apps/mcp-server/src/server.ts apps/mcp-server/src/resources.ts apps/mcp-server/src/server.test.ts
git commit -m "feat(mcp): render_experience - standalone vite bundle served via renders resources"
```

---

### Task 7: skill - ADAPT route

**Files:**
- Modify: `.claude/skills/open-design/SKILL.md`
- Create: `.claude/skills/open-design/workflows/adapt.md`

- [ ] **Step 1: SKILL.md** - in `## Route`, after the COMPOSE bullet add:

```markdown
- **ADAPT** - the request restyles an EXISTING artifact (the user's own deck, page, …) with OpenDesign, whole or partial ("restyle my deck with …", "apply this template to slides 3–5") → read and follow `workflows/adapt.md`.
```

Extend the frontmatter `description` triggers with: `"restyle/redesign my existing deck/page with …", "apply this template to my slides"`.

- [ ] **Step 2: Write `workflows/adapt.md`** - full content:

```markdown
# ADAPT workflow - restyle an existing artifact with OpenDesign

The user already has a design (deck, page, document) OUTSIDE this repo's
catalogue; this workflow re-skins it with an OpenDesign template - the whole
artifact or a named part of it ("just slides 3–5"). Division of labor is the
same as COMPOSE: MCP selects the template and owns the contract; the
template code owns the craft; you own content mapping and judgment.

## Phase 0 - Fidelity

Ask once (skip if the request already states it), default strict:
`templateFidelity` - **strict**: port the selected template's real code onto
the existing content, adjusting only for content and consistency with the
client's surrounding design. **free**: take the template's structure/register
as guidance and restyle in your own design language.

## Phase 1 - Read the artifact

Inventory the existing artifact: sections/slides, content per section, any
design system it already follows. For PARTIAL scope, confirm exactly which
sections are in scope, and record what the out-of-scope sections look like -
the consistency warning in Phase 4 needs it.

## Phase 2 - Select via MCP

Call the surface's compose tool with a context built from the artifact
(audience, intent, suitability) and a contentBrief summarizing its content.
Present alternatives exactly as COMPOSE Phase 2 does (one AskUserQuestion,
winner recommended). At strict fidelity the response carries `reference`
(source-file URIs + sizes) - do NOT fetch any of them yourself.

## Phase 3 - Mapping

Write an explicit mapping: existing section/slide → template section, one
line each, with kept/cut/moved content noted. Sections with no real content
behind them are cut, not padded. Show the user the mapping before porting.

## Phase 4 - Port (strict) or restyle (free)

- **strict**: follow `references/porting.md` - dispatch the porting subagent
  with the reference manifest, the mapping, and the artifact content. The
  main agent never reads template source.
- **free**: restyle in place using the fill skeleton's structure and
  guidance as the brief; no template code involved.
- **Partial scope**: after the port, flag the consistency seam explicitly -
  "slides 3–5 now follow <template>; 1–2 and 6 keep the old design" - as a
  warning with a recommendation (adopt fully, or align tokens), never a
  silent mix. This is a warning, not a blocker: the catalogue invariant
  ("one experience = one world-template") binds catalogue worlds, not the
  client's own document.

## Phase 5 - Verify

Render/preview the artifact in its own environment, screenshot in-scope
sections, run the pre-emit self-critique from `references/quality-gates.md`,
and report: what changed, the mapping, the consistency note, screenshots.
```

- [ ] **Step 3: Verify routing coherence** - read the modified `SKILL.md` top-to-bottom once; the three routes + ADAPT must not overlap ambiguously (ADAPT = existing artifact; COMPOSE = new from source content; BORROW = named part).

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/open-design/SKILL.md .claude/skills/open-design/workflows/adapt.md
git commit -m "feat(skill): ADAPT route - restyle existing artifacts, whole or partial"
```

---

### Task 8: skill - fidelity branch in COMPOSE + BORROW, porting reference

**Files:**
- Create: `.claude/skills/open-design/references/porting.md`
- Modify: `.claude/skills/open-design/workflows/compose.md`, `.claude/skills/open-design/workflows/borrow.md`

- [ ] **Step 1: Write `references/porting.md`** - full content:

```markdown
# Porting reference - strict-fidelity code porting

Rules for reproducing a template/part's design outside this repo, used by
COMPOSE (external clients), ADAPT, and BORROW at `templateFidelity: strict`.

## Context discipline (non-negotiable)

The ORCHESTRATING agent never reads reference source. It handles selection,
mapping, validation findings, and screenshot review only. All code reading
and porting happens in ONE dispatched subagent per port:

- Give the subagent: the reference manifest (URIs + sizes), the content /
  fill / mapping, the target location, and this file.
- The subagent fetches resources ONE AT A TIME via resources/read, largest
  files only as needed, ports, writes output files, and reports back a file
  list + a ≤20-line summary - never the code itself.

## What "faithful" means

- Keep: layout structure, spacing rhythm, type scale/weights, color roles,
  motion character, component composition - the design's identity.
- Adjust ONLY for: (a) the actual content (counts within the template's
  bounds, real copy), (b) consistency with the client's surroundings -
  token/font substitutions when the host mandates them, class-name
  prefixing to avoid collisions, asset-path rewrites.
- Never: invent new sections, restyle "improvements", drop the template's
  a11y affordances (visually-hidden outlines, aria labels, reduced-motion
  branches - port them all).

## Mechanics

- CSS travels with markup: a part's look is inseparable from its
  stylesheet - port the relevant rules, renamed under one namespace prefix.
- Fonts: the template's font imports name the design; if the client cannot
  load them, document the substitution in the report.
- React → other targets: reproduce the DOM the component RENDERS (read the
  JSX + the CSS), not the React mechanics; interactive behaviour is ported
  only when the target supports it, and its absence is reported.
- Provenance: the ported output carries a comment naming the source
  template/part id and the port date.
```

- [ ] **Step 2: compose.md** - two edits. (a) In Phase 1 (setup), after the MCP-availability check add:

```markdown
**Fidelity.** Ask once (skip if already stated), default strict:
`templateFidelity` - strict: the compose response includes a `reference`
manifest and, for EXTERNAL targets (output outside this repo), the port
follows `references/porting.md`; free: contract-only, today's flow. Pass the
choice to every compose call. In-repo demo routes ignore the manifest - the
template code is already here; scaffold as before.
```

(b) In Phase 6 (scaffold/verify), add the external-target branch:

```markdown
**External target (client repo, strict):** there is no gallery to scaffold
into. Dispatch the porting subagent (`references/porting.md`) with the
`reference` manifest + validated fill; alternatively, when the client only
needs the artifact as-is, call `render_experience` with the validated fill
and hand over the `entryUri` bundle. Verify with screenshots of the ported
result in the client's own environment.
```

- [ ] **Step 3: borrow.md** - after the part-identification phase add:

```markdown
**External client (no repo access):** resolve the part with the MCP tool
`get_part_reference` - it returns the implementing source files as
`opendesign://parts/` URIs (+ the experience stylesheets). At strict
fidelity, dispatch the porting subagent per `references/porting.md`; at
free fidelity, request only the part's intent (describe it from the gallery)
and reinterpret. The in-repo borrow path below is unchanged.
```

- [ ] **Step 4: Coherence read** - read all three modified/created files once; every named tool (`get_part_reference`, `render_experience`), field (`reference`, `templateFidelity`) and file (`references/porting.md`) must match Tasks 2–6 exactly.

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/open-design/references/porting.md .claude/skills/open-design/workflows/compose.md .claude/skills/open-design/workflows/borrow.md
git commit -m "feat(skill): strict/free fidelity branches + porting reference for external clients"
```

---

### Task 9: final gates

- [ ] **Step 1: Full workspace gates**

```bash
corepack pnpm run typecheck
corepack pnpm run lint
corepack pnpm run test
corepack pnpm --filter mcp-server test
```
Expected: all PASS. (Root lint may still fail on the OTHER session's uncommitted `grammar-specimens-revalidate.mts` - a pre-existing failure outside this plan's files; confirm the failure list contains ONLY that file and record it in the report.)

- [ ] **Step 2: Spec cross-check** - walk the spec's "New MCP surface" table and "The three skill workflows" section; each row/requirement must map to a shipped task. Confirm renders eviction = 5, fidelity default = strict, no inline content in any tool result.

- [ ] **Step 3: Commit any stragglers touched by gates** (only plan files), then report: tools added, resources added, skill routes, test counts, and the held-push status.

---

## Self-Review Notes

- Spec coverage: knob (T2), manifest (T2), resources capability + URI scheme (T3/T6), `get_part_reference` (T4), `render_experience` full bundle (T5/T6), eviction=5 (T6), error contracts (T4/T6), ADAPT (T7), BORROW extension + porting + context discipline (T8), testing (per-task + T9). Out-of-scope items untouched.
- The `{+file}` RFC-6570 caveat in T3 carries its own fallback so a template-matching surprise cannot stall the plan.
- Type consistency: `ReferenceFile` defined once (T2) and reused by T4/T6; `composeForSurface` fidelity param named identically in T2's two call sites.
```
