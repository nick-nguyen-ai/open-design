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

/**
 * An experience id is ONE directory name, never a path. It arrives from a
 * client-supplied `opendesign://parts/{experienceId}/{+file}` URI, and the SDK
 * does not percent-decode that segment - so without this check a literal `..`
 * (or a `\` on win32) would be normalised INTO the joined path, escaping
 * experiences/ before any traversal guard downstream could see it.
 */
function isIdSegment(id: string): boolean {
  if (id === '' || id === '.' || id === '..') return false;
  return !/[\\/]/.test(id) && !id.includes('\0');
}

export function experienceDir(experienceId: string): string | undefined {
  if (!isIdSegment(experienceId)) return undefined;
  for (const surface of SURFACE_DIRS) {
    const surfaceRoot = path.join(repoRoot(), 'experiences', surface);
    const dir = path.join(surfaceRoot, experienceId);
    if (path.dirname(dir) !== surfaceRoot) continue;
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
  out.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
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
