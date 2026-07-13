import type { ComponentManifest, DesignGrammar, MotionSequence } from '@enterprise-design/contracts';

/**
 * The slice of the compiled registry the composition engine reads. Domain
 * packages receive registry DATA as a parameter and never touch the
 * filesystem (browser-safe, mirroring `@enterprise-design/search`); tests
 * build this from `compileRegistry`.
 */
export interface CompositionRegistry {
  components: ComponentManifest[];
  grammars: DesignGrammar[];
  motionSequences: MotionSequence[];
}

/** Which structural variant `composeDesign` returns as its top-level blueprint. */
export type AlternativeMode = 'conservative' | 'recommended' | 'expressive';

export interface ComposeOptions {
  /** Structural variant to promote to the returned blueprint. Defaults to `recommended`. */
  alternativeMode?: AlternativeMode;
  /**
   * Restrict the component candidate pool to these ids (still subject to
   * role / surface / corporate compatibility filtering). Omit to consider the
   * whole registry.
   */
  selectedComponentIds?: string[];
}
