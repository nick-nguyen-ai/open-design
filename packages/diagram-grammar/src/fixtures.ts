import type {
  CellsSpecT,
  CompareSpecT,
  CycleSpecT,
  FlowSpecT,
  LayersSpecT,
  SequenceSpecT,
  TimelineSpecT,
  ZonesSpecT,
} from './specs.js';

/**
 * Canonical schema-valid fixtures, one per diagram kind — shared by the
 * grammar's own tests and by every collection's renderer tests so the whole
 * feature agrees on what a "typical" spec looks like. Content is original
 * (generic engineering subject matter), deliberately exercising optional
 * fields: labels, details, tones, badges, markers, replies, steps.
 */

export const FLOW_FIXTURE: FlowSpecT = {
  kind: 'flow',
  title: 'Request lifecycle',
  nodes: [
    { id: 'in', label: 'Receive request', kind: 'start' },
    { id: 'check', label: 'Validate payload', kind: 'process' },
    { id: 'route', label: 'Cache hit?', kind: 'decision' },
    { id: 'store', label: 'Result cache', kind: 'data' },
    { id: 'out', label: 'Respond', kind: 'end' },
  ],
  edges: [
    { from: 'in', to: 'check', step: 1 },
    { from: 'check', to: 'route', step: 2 },
    { from: 'route', to: 'store', label: 'miss', step: 3 },
    { from: 'route', to: 'out', label: 'hit', step: 4 },
    { from: 'store', to: 'out', step: 5 },
  ],
};

export const SEQUENCE_FIXTURE: SequenceSpecT = {
  kind: 'sequence',
  title: 'Token exchange',
  actors: [
    { id: 'client', label: 'Client', kind: 'user' },
    { id: 'api', label: 'Auth API', kind: 'service' },
    { id: 'vault', label: 'Key vault', kind: 'store' },
  ],
  messages: [
    { from: 'client', to: 'api', label: 'POST /token' },
    { from: 'api', to: 'vault', label: 'fetch signing key', note: 'cached 5 min' },
    { from: 'vault', to: 'api', label: 'key material', reply: true },
    { from: 'api', to: 'client', label: '200 access token', reply: true },
  ],
};

export const LAYERS_FIXTURE: LayersSpecT = {
  kind: 'layers',
  title: 'Service stack',
  layers: [
    { id: 'edge', label: 'Edge', detail: 'CDN and WAF', tone: 'accent' },
    { id: 'app', label: 'Application', items: ['API', 'Workers', 'Schedulers'] },
    { id: 'data', label: 'Data', detail: 'Postgres and object store' },
    { id: 'infra', label: 'Infrastructure', tone: 'alert' },
  ],
  sideLabel: 'request path',
};

export const ZONES_FIXTURE: ZonesSpecT = {
  kind: 'zones',
  title: 'Deployment estate',
  zones: [
    { id: 'onprem', label: 'On-prem', nodes: [{ id: 'ledger', label: 'Ledger DB' }, { id: 'batch', label: 'Batch jobs' }] },
    { id: 'cloud', label: 'Cloud', nodes: [{ id: 'api', label: 'API' }, { id: 'queue', label: 'Queue' }, { id: 'cache', label: 'Cache' }] },
    { id: 'saas', label: 'SaaS', nodes: [{ id: 'idp', label: 'Identity' }] },
  ],
  links: [
    { from: 'api', to: 'ledger', label: 'sql' },
    { from: 'api', to: 'cache' },
    { from: 'batch', to: 'queue', label: 'nightly' },
    { from: 'api', to: 'idp', label: 'oidc' },
  ],
};

export const CYCLE_FIXTURE: CycleSpecT = {
  kind: 'cycle',
  title: 'Deploy loop',
  stages: [
    { id: 'build', label: 'Build' },
    { id: 'test', label: 'Test', detail: 'Unit and e2e gates' },
    { id: 'ship', label: 'Ship' },
    { id: 'observe', label: 'Observe', detail: 'Golden signals' },
  ],
  hubLabel: 'CI',
};

export const COMPARE_FIXTURE: CompareSpecT = {
  kind: 'compare',
  title: 'REST vs GraphQL',
  columns: [
    { id: 'rest', label: 'REST' },
    { id: 'gql', label: 'GraphQL', tone: 'accent' },
  ],
  rows: [
    { label: 'Payload shape', values: ['fixed per endpoint', 'client-selected'] },
    { label: 'Caching', values: ['HTTP-native', 'needs tooling'] },
    { label: 'Versioning', values: ['URL or header', 'schema evolution'] },
  ],
  verdict: 'Pick per read-pattern, not fashion.',
};

export const CELLS_FIXTURE: CellsSpecT = {
  kind: 'cells',
  title: 'Caching strategies',
  cells: [
    { id: 'aside', label: 'Cache-aside', detail: 'App owns the read path' },
    { id: 'through', label: 'Read-through', detail: 'Cache owns the read path', badge: 'hot' },
    { id: 'write', label: 'Write-through', detail: 'Writes land in both' },
    { id: 'behind', label: 'Write-behind', detail: 'Async flush to store' },
    { id: 'refresh', label: 'Refresh-ahead', detail: 'Predictive reload' },
  ],
  columnsHint: 3,
};

export const TIMELINE_FIXTURE: TimelineSpecT = {
  kind: 'timeline',
  title: 'Cloud eras',
  eras: [
    { id: 'iron', label: 'Bare metal', marker: '2000s', detail: 'Racked and pinned' },
    { id: 'vm', label: 'Virtual machines', detail: 'Consolidation era' },
    { id: 'containers', label: 'Containers', marker: '2013' },
    { id: 'k8s', label: 'Orchestration', marker: 'now', detail: 'Declarative fleets' },
  ],
  nowIndex: 3,
};
