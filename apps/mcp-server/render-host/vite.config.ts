/**
 * render-host build config.
 *
 * A deliberately tiny Vite app whose ONLY job is to render one world template
 * with one fill into a standalone static bundle. `render_experience` (the MCP
 * tool) shells out to:
 *
 *   vite build --config apps/mcp-server/render-host/vite.config.ts \
 *     --outDir <abs> --emptyOutDir
 *
 * run from the repo root, after writing `generated/render-config.json` and
 * `generated/fill.json`. `root` is pinned to this directory so the command
 * works regardless of the caller's cwd.
 */
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const workspaceRoot = fileURLToPath(new URL('../../..', import.meta.url));

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  // Emitted pages are opened from disk (file://) or served from an arbitrary
  // sub-path by the client, so asset URLs must be relative, not root-absolute.
  base: './',
  plugins: [react(), tailwindcss()],
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
