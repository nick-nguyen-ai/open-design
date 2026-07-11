import { buildComponent } from '../../../_builders.js';

// performance.bundleCostKbGzip is required by the schema; omitting it must
// surface a clear SCHEMA_INVALID error naming the field.
const base = buildComponent({ id: 'comp.no-bundle-cost', name: 'No Bundle Cost' });
const { bundleCostKbGzip: _omitted, ...performanceWithoutCost } = base.performance;

export default { ...base, performance: performanceWithoutCost };
