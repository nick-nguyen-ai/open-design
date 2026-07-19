import type {
  ComponentManifest,
  ExperienceManifest,
  DesignGrammar,
  MotionSequence,
  SearchDocument,
  CompositionRole,
  ShippedMagnitudes,
  WorldTemplateDescriptor,
} from '@enterprise-design/contracts';

/** Severity of a validation diagnostic. `error` fails the build; `warning` is surfaced but non-fatal. */
export type Severity = 'error' | 'warning';

/** A structured validation finding produced by the compiler. */
export interface Diagnostic {
  /** Stable rule identifier, e.g. `REG_DUPLICATE_ID`. */
  ruleId: string;
  severity: Severity;
  message: string;
  /** Offending manifest id (component/experience/grammar id or motion sequenceId), when applicable. */
  entityId?: string;
  /** Absolute path to the offending manifest file, when applicable. */
  path?: string;
}

/** One node of the compatibility graph, derived from a component's `CompatibilityManifest`. */
export interface CompatibilityNode {
  id: string;
  worksWellWith: string[];
  conflictsWith: string[];
  requiresOneOf: string[];
  compositionRoles: CompositionRole[];
  maxInstancesPerViewport?: number;
}

/** Serialisable compatibility graph persisted to `compatibility.json`. */
export interface CompatibilityGraphData {
  nodes: CompatibilityNode[];
}

/** The full result of a registry compile. Arrays are sorted deterministically by id. */
export interface CompileResult {
  components: ComponentManifest[];
  experiences: ExperienceManifest[];
  grammars: DesignGrammar[];
  motionSequences: MotionSequence[];
  worldTemplates: WorldTemplateDescriptor[];
  /** Per-template shipped slot magnitudes, derived from each world's SHIPPED_FILL. */
  shippedMagnitudes: ShippedMagnitudes;
  compatibility: CompatibilityGraphData;
  searchDocuments: SearchDocument[];
  diagnostics: Diagnostic[];
  errorCount: number;
  warningCount: number;
  /** True when there are zero `error`-severity diagnostics. */
  ok: boolean;
}

export interface CompileOptions {
  /** Directory the discovery globs are resolved against. Defaults to `process.cwd()`. */
  cwd?: string;
  /** When true, write the JSON artefacts to `outDir` (only if the compile has no errors). */
  write?: boolean;
  /** Output directory for artefacts. Defaults to `<cwd>/packages/registry/generated`. */
  outDir?: string;
}
