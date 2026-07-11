export { compileRegistry, defaultOutDir } from './compile.js';
export { discover, DISCOVERY_GLOBS } from './discovery.js';
export type { DiscoveredManifests, Loaded } from './discovery.js';
export { runValidationRules } from './validation.js';
export { buildCompatibilityGraph, CompatibilityGraph } from './compatibility.js';
export { buildSearchDocuments } from './search.js';
export { serializeArtefacts, writeArtefacts, ARTEFACT_FILES } from './emit.js';
export { stableStringify } from './util.js';
export type {
  CompileOptions,
  CompileResult,
  Diagnostic,
  Severity,
  CompatibilityNode,
  CompatibilityGraphData,
} from './types.js';
