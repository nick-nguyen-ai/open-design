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
