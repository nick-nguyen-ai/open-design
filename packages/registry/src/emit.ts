import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { CompileResult } from './types.js';
import { stableStringify } from './util.js';

/** Filenames of the six generated artefacts, in a stable order. */
export const ARTEFACT_FILES = {
  components: 'components.json',
  experiences: 'experiences.json',
  grammars: 'grammars.json',
  motionSequences: 'motion-sequences.json',
  compatibility: 'compatibility.json',
  searchDocuments: 'search-documents.json',
} as const;

/**
 * Serialise a compile result into `{ filename: json }` pairs. Deterministic:
 * top-level arrays are already sorted by the compiler, and {@link stableStringify}
 * sorts object keys recursively, so equal inputs yield byte-identical strings.
 */
export function serializeArtefacts(result: CompileResult): Record<string, string> {
  return {
    [ARTEFACT_FILES.components]: stableStringify(result.components),
    [ARTEFACT_FILES.experiences]: stableStringify(result.experiences),
    [ARTEFACT_FILES.grammars]: stableStringify(result.grammars),
    [ARTEFACT_FILES.motionSequences]: stableStringify(result.motionSequences),
    [ARTEFACT_FILES.compatibility]: stableStringify(result.compatibility),
    [ARTEFACT_FILES.searchDocuments]: stableStringify(result.searchDocuments),
  };
}

/** Write the serialised artefacts to `outDir`, creating it if needed. */
export async function writeArtefacts(result: CompileResult, outDir: string): Promise<void> {
  await mkdir(outDir, { recursive: true });
  const files = serializeArtefacts(result);
  for (const [name, content] of Object.entries(files)) {
    await writeFile(path.join(outDir, name), content, 'utf8');
  }
}
