/**
 * render-host build config.
 *
 * A deliberately tiny Vite app whose ONLY job is to render one world template
 * with one fill into a standalone static bundle. `render_experience` (the MCP
 * tool) shells out to:
 *
 *   OPENDESIGN_RENDER_INPUT=<abs input dir> \
 *   vite build --config apps/mcp-server/render-host/vite.config.ts \
 *     --outDir <abs> --emptyOutDir
 *
 * run from the repo root, after writing `render-config.json` and `fill.json`
 * into that PER-RENDER input directory. `root` is pinned to this directory so
 * the command works regardless of the caller's cwd.
 *
 * Why the env var: the two generated inputs used to be shared, git-tracked
 * files under `render-host/generated/`. Two MCP server processes on one
 * checkout (routine - one per session) would overwrite each other's inputs
 * between write and build, and each would happily return `ok: true` with a
 * bundle of the OTHER caller's template and fill. Resolving the import
 * location per build makes that interference structurally impossible: nothing
 * a build reads is shared. With the var unset the app still builds standalone
 * from the committed sample in `generated/` (see scripts/prepare-sample.mts),
 * which no build ever mutates.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const workspaceRoot = fileURLToPath(new URL('../../..', import.meta.url));

/** Where `@render-input/*` resolves: this build's inputs, else the committed sample. */
const renderInput = process.env.OPENDESIGN_RENDER_INPUT
  ? path.resolve(process.env.OPENDESIGN_RENDER_INPUT)
  : fileURLToPath(new URL('./generated', import.meta.url));

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  // Emitted pages are opened from disk (file://) or served from an arbitrary
  // sub-path by the client, so asset URLs must be relative, not root-absolute.
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    // Prefix alias: `@render-input/fill.json` -> `<renderInput>/fill.json`.
    alias: { '@render-input': renderInput },
  },
  server: {
    // Templates, tokens and the generated registry all live outside this dir.
    fs: { allow: [workspaceRoot] },
  },
  build: {
    // Whole templates (charts, diagram collections) land in one chunk here;
    // the gallery's 900 kB budget does not apply to a single-page bundle.
    chunkSizeWarningLimit: 1500,
  },
});
