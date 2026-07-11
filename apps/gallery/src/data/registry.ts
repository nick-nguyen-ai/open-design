/**
 * The gallery's single source of catalogue data.
 *
 * The registry is compiled to JSON by `pnpm registry:build` (wired as the
 * app's `predev`/`prebuild`), then imported here as plain data — no network,
 * no runtime compile. The client-side search index is built once from these
 * documents and shared across every route via {@link searchIndex}.
 */
import type {
  ComponentManifest,
  DesignGrammar,
  ExperienceManifest,
  SearchDocument,
} from '@enterprise-design/contracts';
import { availableFacets, createSearchIndex } from '@enterprise-design/search';

import searchDocumentsJson from '../../../../packages/registry/generated/search-documents.json';
import experiencesJson from '../../../../packages/registry/generated/experiences.json';
import componentsJson from '../../../../packages/registry/generated/components.json';
import grammarsJson from '../../../../packages/registry/generated/grammars.json';

export const searchDocuments = searchDocumentsJson as unknown as SearchDocument[];
export const experiences = experiencesJson as unknown as ExperienceManifest[];
export const components = componentsJson as unknown as ComponentManifest[];
export const grammars = grammarsJson as unknown as DesignGrammar[];

/** Built once at module load — safe to hold for the tab's lifetime. */
export const searchIndex = createSearchIndex(searchDocuments);

/** Facet values actually present in the catalogue, for building filter controls. */
export const facets = availableFacets(searchDocuments);

export const experienceById = new Map(experiences.map((e) => [e.id, e]));
export const componentById = new Map(components.map((c) => [c.id, c]));
export const grammarById = new Map(grammars.map((g) => [g.id, g]));

/** Documents keyed by id, for turning a search hit back into its facets/summary. */
export const documentById = new Map(searchDocuments.map((d) => [d.id, d]));

export const experienceDocuments = searchDocuments.filter((d) => d.entityType === 'experience');
export const componentDocuments = searchDocuments.filter((d) => d.entityType === 'component');
export const grammarDocuments = searchDocuments.filter((d) => d.entityType === 'grammar');

export const TEMPLATE_COUNT = experienceDocuments.length;

/** Count of templates per surface (drives the template-type shortcut cards). */
export const templateCountsBySurface = experienceDocuments.reduce<Record<string, number>>(
  (acc, doc) => {
    const surface = doc.facets.surface;
    if (surface) acc[surface] = (acc[surface] ?? 0) + 1;
    return acc;
  },
  {},
);
