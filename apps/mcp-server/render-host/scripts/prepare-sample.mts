/**
 * Writes generated/{render-config,fill}.json from the cockpit shipped fill.
 *
 * This is the build-smoke input: it puts render-host in exactly the state
 * `render_experience` will leave it in before shelling out to `vite build`.
 * Run from anywhere:
 *   node --import tsx apps/mcp-server/render-host/scripts/prepare-sample.mts
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { cockpitFill } from '../../../../experiences/dashboards/db-model-monitoring-cockpit/content.js';

const gen = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'generated');
writeFileSync(path.join(gen, 'render-config.json'), JSON.stringify({ templateId: 'cockpit' }, null, 2));
writeFileSync(path.join(gen, 'fill.json'), JSON.stringify(cockpitFill, null, 2));
console.log('render-host sample prepared (cockpit)');
