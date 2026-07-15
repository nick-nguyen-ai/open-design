/**
 * Static part-id scan — every `data-part-id` in every experience source must
 * be well-formed and rooted in its own experience directory.
 *
 * The ID scheme is a PUBLIC BORROW CONTRACT:
 *   `<experienceId>/<sectionKind>[/<partName>]`
 * where segment 1 must equal the experience directory name. String-literal
 * IDs must be unique within an experience; template-literal IDs (dynamic
 * section roots like `` `deck-x/${slide.kind}` ``) must start with the static
 * `<experienceId>/` prefix.
 *
 * NOTE: this scan is shaped to migrate into `packages/registry/src/certify.ts`
 * as a `part-ids` check once part IDs extend beyond the pilot worlds — the
 * certifier only sees templatized worlds, while this walk covers every
 * experience.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const EXPERIENCES_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../../experiences',
);

const WELL_FORMED = /^[a-z0-9-]+\/[a-z0-9-]+(\/[a-z0-9-]+)?$/;
const LITERAL_RE = /data-part-id="([^"]*)"/g;
const TEMPLATE_RE = /data-part-id=\{`([^`]*)`\}/g;
// `partId="..."` / partId={`...`} feed a data-part-id through a local wrapper
// (e.g. Cutover's Build) — scanned under the same contract.
const PROP_LITERAL_RE = /\bpartId="([^"]*)"/g;
const PROP_TEMPLATE_RE = /\bpartId=\{`([^`]*)`\}/g;

interface Found {
  file: string;
  experienceId: string;
  value: string;
  kind: 'literal' | 'template';
}

function walkTsx(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkTsx(full));
    else if (entry.name.endsWith('.tsx')) out.push(full);
  }
  return out;
}

function collect(): Found[] {
  const found: Found[] = [];
  for (const file of walkTsx(EXPERIENCES_DIR)) {
    const rel = path.relative(EXPERIENCES_DIR, file);
    const segments = rel.split(path.sep);
    // experiences/<surface>/<experienceId>/... — shared kit dirs (_deck-kit,
    // _shared) are not experiences but still must not carry part ids rooted
    // elsewhere; their "experienceId" is the directory name and would fail
    // the prefix rule if an ID ever appeared there.
    const experienceId = segments[1] ?? '';
    const source = fs.readFileSync(file, 'utf8');
    for (const [re, kind] of [
      [LITERAL_RE, 'literal'],
      [PROP_LITERAL_RE, 'literal'],
      [TEMPLATE_RE, 'template'],
      [PROP_TEMPLATE_RE, 'template'],
    ] as const) {
      re.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = re.exec(source)) !== null) {
        found.push({ file: rel, experienceId, value: match[1] ?? '', kind });
      }
    }
  }
  return found;
}

describe('data-part-id static contract', () => {
  const found = collect();

  it('finds the pilot anchors (sanity that the scan sees anything at all)', () => {
    // 26 source-level sites across the three pilots (dynamic section roots
    // count once here; the rendered contract in LivePartIds.test.tsx counts
    // the expanded 36).
    expect(found.length).toBeGreaterThanOrEqual(26);
  });

  it('every literal ID is well-formed and rooted in its experience directory', () => {
    const bad = found
      .filter((f) => f.kind === 'literal')
      .filter((f) => !WELL_FORMED.test(f.value) || !f.value.startsWith(`${f.experienceId}/`))
      .map((f) => `${f.file}: "${f.value}"`);
    expect(bad).toEqual([]);
  });

  it('every template-literal ID starts with its static experience prefix', () => {
    const bad = found
      .filter((f) => f.kind === 'template')
      .filter((f) => !f.value.startsWith(`${f.experienceId}/`))
      .map((f) => `${f.file}: \`${f.value}\``);
    expect(bad).toEqual([]);
  });

  it('literal IDs are unique within an experience', () => {
    const seen = new Map<string, string>();
    const dupes: string[] = [];
    for (const f of found) {
      if (f.kind !== 'literal') continue;
      const key = `${f.experienceId}::${f.value}`;
      const prior = seen.get(key);
      if (prior !== undefined) dupes.push(`"${f.value}" in ${prior} and ${f.file}`);
      else seen.set(key, f.file);
    }
    expect(dupes).toEqual([]);
  });
});
