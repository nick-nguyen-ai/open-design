/**
 * Registry data loading — adapter-independent domain module.
 *
 * The registry is compiled to JSON by `pnpm registry:build` (wired as this
 * app's `prestart`/`predemo`/`pretest`). Here we read the committed generated
 * artefacts ONCE at startup and build the lexical search index. This is the
 * only filesystem access the server performs: two known files under
 * `packages/registry/generated`, no traversal, no writes, no network — the
 * read-only posture the server promises.
 *
 * Loading the pre-compiled JSON (rather than running `compileRegistry` at
 * startup) keeps the server deterministic and free of a tsx-at-runtime
 * compile step; the JSON is validated against the contracts schemas on load
 * so drift surfaces immediately instead of corrupting a tool response.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { z } from 'zod';
import { ComponentManifest, SearchDocument } from '@enterprise-design/contracts';
import { createSearchIndex } from '@enterprise-design/search';
import type { SearchIndex } from '@enterprise-design/search';

/** Everything the tools need to answer a request, built once and held for the process lifetime. */
export interface RegistryData {
  readonly components: readonly ComponentManifest[];
  readonly componentById: ReadonlyMap<string, ComponentManifest>;
  readonly searchDocuments: readonly SearchDocument[];
  readonly searchIndex: SearchIndex;
}

const GENERATED_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../packages/registry/generated',
);

function readGenerated<T>(file: string, schema: z.ZodType<T>): T {
  const raw = readFileSync(path.join(GENERATED_DIR, file), 'utf8');
  return schema.parse(JSON.parse(raw));
}

/**
 * Read and validate the generated catalogue, then build the search index.
 * Throws if the generated files are missing or fail schema validation — the
 * caller (server entrypoint) surfaces that to stderr and exits, since a
 * corrupt catalogue means the server cannot answer anything correctly.
 */
export function loadRegistryData(): RegistryData {
  const components = readGenerated('components.json', z.array(ComponentManifest));
  const searchDocuments = readGenerated('search-documents.json', z.array(SearchDocument));

  return {
    components,
    componentById: new Map(components.map((component) => [component.id, component])),
    searchDocuments,
    searchIndex: createSearchIndex([...searchDocuments]),
  };
}
