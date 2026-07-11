import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const workspaceRoot = fileURLToPath(new URL('../..', import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Allow importing the generated registry JSON that lives outside apps/gallery.
    fs: { allow: [workspaceRoot] },
  },
  build: {
    // Keep the landing bundle lean; ECharts-backed component previews are
    // route-split (see React.lazy in the router).
    chunkSizeWarningLimit: 900,
  },
});
