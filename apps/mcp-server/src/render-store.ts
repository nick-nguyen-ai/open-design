// apps/mcp-server/src/render-store.ts
/**
 * Render builds and their on-disk store. Builds are SERIALIZED (one vite
 * build at a time - they share render-host/generated). The store keeps the
 * MAX_RENDERS most recent bundles under apps/mcp-server/render-out/ and
 * evicts older ones; an evicted read returns undefined (NOT_FOUND upstream).
 *
 * Working-tree hygiene: `render-host/generated/render-config.json` and
 * `generated/fill.json` are TRACKED files with committed defaults. A build
 * overwrites them with the caller's template id and fill, so both are restored
 * to those defaults in a `finally` - on success AND on failure. A render must
 * never leave the working tree dirty, and client-supplied content must never
 * linger in a tracked file.
 *
 * Security: `renderId` reaches this module straight from a client-supplied
 * `opendesign://renders/{renderId}/{+file}` URI, and the SDK does NOT
 * percent-decode that segment - so a literal `..` (or a `\` on win32) would
 * otherwise be normalised INTO the joined path before any traversal guard
 * could see it. Ids are `randomUUID()` values, so every id is shape-checked
 * before it is allowed near the filesystem.
 */
import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { repoRoot } from './reference-files.js';

export const MAX_RENDERS = 5;

/** One build's wall-clock ceiling. A healthy build is ~2s; 60s means something is wrong. */
export const BUILD_TIMEOUT_MS = 60_000;

/**
 * The committed contents of the two tracked generated inputs, byte for byte
 * (trailing newline included). Restored after every build. Kept as literals
 * rather than snapshotted at startup so a crashed previous run cannot make a
 * dirty file the "default".
 */
const GENERATED_DEFAULTS: Record<string, string> = {
  'render-config.json': '{\n  "templateId": "cockpit"\n}\n',
  'fill.json': '{}\n',
};

const renderHost = (): string => path.join(repoRoot(), 'apps', 'mcp-server', 'render-host');
const renderOut = (): string => path.join(repoRoot(), 'apps', 'mcp-server', 'render-out');

/** Render ids are `randomUUID()` output and nothing else. */
const RENDER_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * The one place a renderId becomes a path. Returns undefined for any id that
 * is not a UUID, and re-checks that the join stayed a direct child of
 * render-out/ (belt and braces if the shape rule is ever loosened).
 */
export function renderDir(renderId: string): string | undefined {
  if (!RENDER_ID.test(renderId)) return undefined;
  const root = renderOut();
  const dir = path.join(root, renderId);
  if (path.dirname(dir) !== root) return undefined;
  return dir;
}

/**
 * Test seam: the fs entry points the render job body uses, held in one object
 * so a test can make a real call site fail the way EPERM/EBUSY does on win32.
 * Production code never reassigns these.
 */
export const renderFs = { mkdirSync, writeFileSync, rmSync };

let queue: Promise<unknown> = Promise.resolve();

/**
 * With `shell: true` on win32 the child is cmd.exe, so `kill()` leaves the
 * vite process running - and an orphan can keep writing into outDir after the
 * cleanup rm, recreating exactly the partial bundle this module refuses to
 * ship. Kill the whole tree there; elsewhere a plain kill is the tree.
 */
function killTree(child: ChildProcess): void {
  if (process.platform === 'win32' && child.pid !== undefined) {
    const killer = spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
    killer.on('error', () => child.kill());
    return;
  }
  child.kill();
}

function viteBuild(outDir: string): Promise<{ code: number; logTail: string }> {
  return new Promise((resolve) => {
    const child = spawn(
      'corepack',
      [
        'pnpm',
        'exec',
        'vite',
        'build',
        '--config',
        path.join(renderHost(), 'vite.config.ts'),
        '--outDir',
        outDir,
        '--emptyOutDir',
      ],
      { cwd: repoRoot(), shell: process.platform === 'win32' },
    );
    let log = '';
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      killTree(child);
    }, BUILD_TIMEOUT_MS);
    child.stdout.on('data', (d: Buffer) => (log += d.toString()));
    child.stderr.on('data', (d: Buffer) => (log += d.toString()));
    child.on('error', (err) => {
      clearTimeout(timer);
      resolve({ code: 1, logTail: `${log}\nspawn failed: ${err.message}`.slice(-2000) });
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (timedOut) log += `\nbuild exceeded ${BUILD_TIMEOUT_MS}ms and was killed.`;
      resolve({ code: timedOut ? 1 : (code ?? 1), logTail: log.slice(-2000) });
    });
  });
}

/** Restore the tracked render-host inputs to their committed defaults. */
function restoreGeneratedDefaults(): void {
  const dir = path.join(renderHost(), 'generated');
  renderFs.mkdirSync(dir, { recursive: true });
  for (const [name, contents] of Object.entries(GENERATED_DEFAULTS)) {
    renderFs.writeFileSync(path.join(dir, name), contents);
  }
}

/**
 * Best-effort delete. `force` only swallows ENOENT - a real EPERM/EBUSY (a
 * scanner or editor holding a file open, routine on win32) still throws, and a
 * failed cleanup must not turn into an unstructured rejection.
 */
function removeQuietly(dir: string): string | undefined {
  try {
    renderFs.rmSync(dir, { recursive: true, force: true });
    return undefined;
  } catch (err) {
    return `cleanup of ${dir} failed: ${err instanceof Error ? err.message : String(err)}`;
  }
}

function evictOld(): void {
  if (!existsSync(renderOut())) return;
  const dirs = readdirSync(renderOut(), { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => ({ name: e.name, mtime: statSync(path.join(renderOut(), e.name)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);
  for (const stale of dirs.slice(MAX_RENDERS)) {
    removeQuietly(path.join(renderOut(), stale.name));
  }
}

/**
 * Cheap post-build sanity check: the host mounts into `<div id="root">` and
 * Vite must have injected the entry script. A bundle missing either is not
 * servable, so it is treated as a build failure rather than shipped blank.
 *
 * The script check inspects each `<script>` tag for the two attributes
 * INDEPENDENTLY - assuming Vite's current `type` before `src` ordering would
 * delete a perfectly good bundle the day that ordering changes.
 */
function entryLooksRenderable(outDir: string): string | undefined {
  const entry = path.join(outDir, 'index.html');
  if (!existsSync(entry)) return 'index.html was not emitted.';
  const html = readFileSync(entry, 'utf8');
  if (!html.includes('<div id="root">')) return 'index.html has no #root mount point.';
  const hasModuleEntry = [...html.matchAll(/<script\b[^>]*>/gi)].some(
    (m) => /\btype\s*=\s*["']?module\b/i.test(m[0]) && /\bsrc\s*=/i.test(m[0]),
  );
  if (!hasModuleEntry) return 'index.html has no module entry script.';
  return undefined;
}

export type RenderResult =
  | { ok: true; renderId: string; buildMs: number }
  | { ok: false; logTail: string };

export function runRender(templateId: string, fill: Record<string, unknown>): Promise<RenderResult> {
  const job = queue.then(async (): Promise<RenderResult> => {
    const renderId = randomUUID();
    const outDir = path.join(renderOut(), renderId);
    const generated = path.join(renderHost(), 'generated');
    const started = Date.now();
    // Total failure path: ANY throw in the body (or in the restore) becomes a
    // structured `ok: false`, never a rejection - an unstructured rejection
    // would reach the SDK as a bare Error.message and break the invariant that
    // every isError result carries a serialized McpError. Cleanup still runs.
    try {
      try {
        renderFs.mkdirSync(generated, { recursive: true });
        renderFs.writeFileSync(path.join(generated, 'render-config.json'), JSON.stringify({ templateId }));
        renderFs.writeFileSync(path.join(generated, 'fill.json'), JSON.stringify(fill));
        const { code, logTail } = await viteBuild(outDir);
        if (code !== 0) {
          const cleanupNote = removeQuietly(outDir); // never a partial bundle
          return { ok: false, logTail: cleanupNote ? `${logTail}\n${cleanupNote}` : logTail };
        }
        const unrenderable = entryLooksRenderable(outDir);
        if (unrenderable) {
          const cleanupNote = removeQuietly(outDir);
          return { ok: false, logTail: [unrenderable, logTail, cleanupNote].filter(Boolean).join('\n') };
        }
        evictOld();
        return { ok: true, renderId, buildMs: Date.now() - started };
      } finally {
        restoreGeneratedDefaults();
      }
    } catch (err) {
      const cleanupNote = removeQuietly(outDir);
      const message = err instanceof Error ? err.message : String(err);
      return {
        ok: false,
        logTail: [`render job failed before a bundle could be kept: ${message}`, cleanupNote]
          .filter(Boolean)
          .join('\n'),
      };
    }
  });
  queue = job.catch(() => undefined);
  return job;
}

/** Recursive listing of one render's emitted files (posix-relative, sorted). */
export function listRenderFiles(renderId: string): Array<{ path: string; bytes: number }> | undefined {
  const dir = renderDir(renderId);
  if (!dir || !existsSync(dir)) return undefined;
  const out: Array<{ path: string; bytes: number }> = [];
  const walk = (d: string): void => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const abs = path.join(d, e.name);
      if (e.isDirectory()) walk(abs);
      else out.push({ path: path.relative(dir, abs).split(path.sep).join('/'), bytes: statSync(abs).size });
    }
  };
  walk(dir);
  return out.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
}

/** Traversal-safe read of one file from a render bundle; undefined if evicted or absent. */
export function readRenderFile(renderId: string, relPath: string): Buffer | undefined {
  const dir = renderDir(renderId);
  if (!dir) return undefined;
  const abs = path.resolve(dir, relPath);
  if (!abs.startsWith(dir + path.sep) || !existsSync(abs) || !statSync(abs).isFile()) return undefined;
  return readFileSync(abs);
}
