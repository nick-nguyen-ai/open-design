// apps/mcp-server/src/render-store.ts
/**
 * Render builds and their on-disk store. The store keeps the MAX_RENDERS most
 * recent renders under apps/mcp-server/render-out/ and evicts older ones; an
 * evicted read returns undefined (NOT_FOUND upstream).
 *
 * On-disk shape - one directory per render, with the build's INPUTS and its
 * OUTPUT kept apart:
 *
 *   render-out/<renderId>/input/{render-config,fill}.json   <- what vite reads
 *   render-out/<renderId>/bundle/                           <- what is served
 *
 * Nothing a build reads is shared, so two MCP server processes on the same
 * checkout cannot interfere. (They used to: both wrote the caller's template
 * id and fill into the TRACKED `render-host/generated/*.json` before shelling
 * out, so an interleaving handed one caller a green build of the other
 * caller's template. Per-render inputs make that structurally impossible.) The
 * committed `render-host/generated/*.json` are now a static sample that no
 * build ever mutates - they are what `render-host` builds from when
 * OPENDESIGN_RENDER_INPUT is unset.
 *
 * `input/` sits OUTSIDE `bundle/`, so it is never emitted into the served
 * output, never listed in `files`, and never fetchable as a render resource -
 * but it is inside the render directory, so eviction reclaims it with the rest.
 *
 * Builds are still serialized in-process (one vite build at a time) to bound
 * CPU, not for correctness.
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

/**
 * One build's wall-clock ceiling, overridable with OPENDESIGN_RENDER_BUILD_TIMEOUT_MS.
 *
 * A WARM build is ~2s, which is what the old 60s ceiling was sized against -
 * but a COLD one is a different animal: the React and Tailwind plugins scan
 * all of `experiences/` plus six package trees, and on Windows right after a
 * fresh install that can run for minutes. Killing a healthy-but-slow first
 * build and blaming a template-map gap is worse than waiting, so the default
 * is generous and the ceiling exists only to stop a truly stuck build from
 * hanging the client forever.
 */
export const BUILD_TIMEOUT_MS = ((): number => {
  const raw = Number(process.env.OPENDESIGN_RENDER_BUILD_TIMEOUT_MS);
  return Number.isFinite(raw) && raw > 0 ? raw : 600_000;
})();

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

/** The SERVED half of a render: everything vite emitted, and nothing else. */
export function bundleDir(renderId: string): string | undefined {
  const dir = renderDir(renderId);
  return dir === undefined ? undefined : path.join(dir, 'bundle');
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

function viteBuild(outDir: string, inputDir: string): Promise<{ code: number; logTail: string; timedOut: boolean }> {
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
      {
        cwd: repoRoot(),
        shell: process.platform === 'win32',
        // The ONE thing that tells this build which inputs are its own.
        env: { ...process.env, OPENDESIGN_RENDER_INPUT: inputDir },
      },
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
      resolve({ code: 1, logTail: `${log}\nspawn failed: ${err.message}`.slice(-2000), timedOut: false });
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (timedOut) log += `\nbuild exceeded ${BUILD_TIMEOUT_MS}ms and was killed.`;
      resolve({ code: timedOut ? 1 : (code ?? 1), logTail: log.slice(-2000), timedOut });
    });
  });
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

/**
 * Best-effort housekeeping: keep the MAX_RENDERS most recent render dirs.
 *
 * TOTAL by construction. It runs after a build has already succeeded, so a
 * transient readdir/stat failure (a concurrent evict from a second server
 * process removing a directory between the listing and the stat is the
 * realistic one) must not turn a good render into an INTERNAL_ERROR and take
 * its bundle down with it. Losing an eviction pass costs disk; losing the
 * render costs the caller a rebuild.
 */
function evictOld(): void {
  try {
    if (!existsSync(renderOut())) return;
    const dirs = readdirSync(renderOut(), { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => ({ name: e.name, mtime: statSync(path.join(renderOut(), e.name)).mtimeMs }))
      .sort((a, b) => b.mtime - a.mtime);
    for (const stale of dirs.slice(MAX_RENDERS)) {
      removeQuietly(path.join(renderOut(), stale.name));
    }
  } catch {
    // Housekeeping only - never fail a completed render over it.
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
  | { ok: true; renderId: string; outDir: string; buildMs: number }
  | { ok: false; logTail: string; timedOut: boolean };

export function runRender(templateId: string, fill: Record<string, unknown>): Promise<RenderResult> {
  const job = queue.then(async (): Promise<RenderResult> => {
    const renderId = randomUUID();
    const dir = path.join(renderOut(), renderId);
    const inputDir = path.join(dir, 'input');
    const outDir = path.join(dir, 'bundle');
    const started = Date.now();
    // Total failure path: ANY throw in the body becomes a structured
    // `ok: false`, never a rejection - an unstructured rejection would reach
    // the SDK as a bare Error.message and break the invariant that every
    // isError result carries a serialized McpError. Cleanup still runs, and it
    // removes the WHOLE render dir (inputs included), so a failed render
    // leaves nothing behind.
    try {
      renderFs.mkdirSync(inputDir, { recursive: true });
      renderFs.writeFileSync(path.join(inputDir, 'render-config.json'), JSON.stringify({ templateId }));
      renderFs.writeFileSync(path.join(inputDir, 'fill.json'), JSON.stringify(fill));
      const { code, logTail, timedOut } = await viteBuild(outDir, inputDir);
      if (code !== 0) {
        const cleanupNote = removeQuietly(dir); // never a partial bundle
        return { ok: false, timedOut, logTail: cleanupNote ? `${logTail}\n${cleanupNote}` : logTail };
      }
      const unrenderable = entryLooksRenderable(outDir);
      if (unrenderable) {
        const cleanupNote = removeQuietly(dir);
        return {
          ok: false,
          timedOut: false,
          logTail: [unrenderable, logTail, cleanupNote].filter(Boolean).join('\n'),
        };
      }
      evictOld();
      return { ok: true, renderId, outDir, buildMs: Date.now() - started };
    } catch (err) {
      const cleanupNote = removeQuietly(dir);
      const message = err instanceof Error ? err.message : String(err);
      return {
        ok: false,
        timedOut: false,
        logTail: [`render job failed before a bundle could be kept: ${message}`, cleanupNote]
          .filter(Boolean)
          .join('\n'),
      };
    }
  });
  queue = job.catch(() => undefined);
  return job;
}

/**
 * Recursive listing of one render's EMITTED files (posix-relative, sorted).
 * Scoped to `bundle/`, so the build's own inputs are never listed.
 */
export function listRenderFiles(renderId: string): Array<{ path: string; bytes: number }> | undefined {
  const dir = bundleDir(renderId);
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

/**
 * Traversal-safe read of one file from a render BUNDLE; undefined if evicted
 * or absent. Rooted at `bundle/`, so `input/` is unreachable through the
 * renders resource even by an explicit `../input/fill.json`.
 */
export function readRenderFile(renderId: string, relPath: string): Buffer | undefined {
  const dir = bundleDir(renderId);
  if (!dir) return undefined;
  const abs = path.resolve(dir, relPath);
  if (!abs.startsWith(dir + path.sep) || !existsSync(abs) || !statSync(abs).isFile()) return undefined;
  return readFileSync(abs);
}
