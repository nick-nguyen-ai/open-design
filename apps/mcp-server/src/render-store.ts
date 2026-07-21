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
 */
import { spawn } from 'node:child_process';
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

let queue: Promise<unknown> = Promise.resolve();

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
      child.kill();
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
  mkdirSync(dir, { recursive: true });
  for (const [name, contents] of Object.entries(GENERATED_DEFAULTS)) {
    writeFileSync(path.join(dir, name), contents);
  }
}

function evictOld(): void {
  if (!existsSync(renderOut())) return;
  const dirs = readdirSync(renderOut(), { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => ({ name: e.name, mtime: statSync(path.join(renderOut(), e.name)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);
  for (const stale of dirs.slice(MAX_RENDERS)) {
    rmSync(path.join(renderOut(), stale.name), { recursive: true, force: true });
  }
}

/**
 * Cheap post-build sanity check: the host mounts into `<div id="root">` and
 * Vite must have injected the entry script. A bundle missing either is not
 * servable, so it is treated as a build failure rather than shipped blank.
 */
function entryLooksRenderable(outDir: string): string | undefined {
  const entry = path.join(outDir, 'index.html');
  if (!existsSync(entry)) return 'index.html was not emitted.';
  const html = readFileSync(entry, 'utf8');
  if (!html.includes('<div id="root">')) return 'index.html has no #root mount point.';
  if (!/<script[^>]+type="module"[^>]+src=/.test(html)) return 'index.html has no module entry script.';
  return undefined;
}

export type RenderResult =
  | { ok: true; renderId: string; outDir: string; buildMs: number }
  | { ok: false; logTail: string };

export function runRender(templateId: string, fill: Record<string, unknown>): Promise<RenderResult> {
  const job = queue.then(async (): Promise<RenderResult> => {
    const renderId = randomUUID();
    const outDir = path.join(renderOut(), renderId);
    const generated = path.join(renderHost(), 'generated');
    const started = Date.now();
    try {
      mkdirSync(generated, { recursive: true });
      writeFileSync(path.join(generated, 'render-config.json'), JSON.stringify({ templateId }));
      writeFileSync(path.join(generated, 'fill.json'), JSON.stringify(fill));
      const { code, logTail } = await viteBuild(outDir);
      if (code !== 0) {
        rmSync(outDir, { recursive: true, force: true }); // never a partial bundle
        return { ok: false, logTail };
      }
      const unrenderable = entryLooksRenderable(outDir);
      if (unrenderable) {
        rmSync(outDir, { recursive: true, force: true });
        return { ok: false, logTail: `${unrenderable}\n${logTail}` };
      }
      evictOld();
      return { ok: true, renderId, outDir, buildMs: Date.now() - started };
    } finally {
      restoreGeneratedDefaults();
    }
  });
  queue = job.catch(() => undefined);
  return job;
}

/** Recursive listing of one render's emitted files (posix-relative, sorted). */
export function listRenderFiles(renderId: string): Array<{ path: string; bytes: number }> | undefined {
  const dir = path.join(renderOut(), renderId);
  if (!existsSync(dir)) return undefined;
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
  const dir = path.join(renderOut(), renderId);
  const abs = path.resolve(dir, relPath);
  if (!abs.startsWith(dir + path.sep) || !existsSync(abs) || !statSync(abs).isFile()) return undefined;
  return readFileSync(abs);
}
