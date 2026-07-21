/**
 * Writes generated/{render-config,fill}.json from the cockpit shipped fill.
 *
 * This is the build-smoke input: `generated/` is the COMMITTED sample that
 * `@render-input/*` resolves to when OPENDESIGN_RENDER_INPUT is unset, i.e.
 * when render-host is built standalone rather than by `render_experience`
 * (which writes its own private input directory per render and never touches
 * these files). Run from anywhere:
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
