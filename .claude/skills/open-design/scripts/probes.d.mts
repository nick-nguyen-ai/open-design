/**
 * Type declarations for probes.mjs so TypeScript consumers (the verify-rig
 * e2e spec) can import the probe functions without loosening their config.
 */
export interface ProbeFinding {
  probe: string;
  selector: string;
  detail: string;
}

export function probeRootOverflow(): ProbeFinding[];
export function probeTextOverflow(): ProbeFinding[];
export function probeTextOverlap(): ProbeFinding[];
export function probeContrast(): ProbeFinding[];
