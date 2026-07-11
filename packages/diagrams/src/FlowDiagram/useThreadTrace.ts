/**
 * `thread-trace` (plan §4.3): "a path illuminates node-by-node along its true
 * topology when traversed, leaving a faint persistent trail." Diagrams are
 * the one signature sequence not yet exported as a React component from
 * `@enterprise-design/motion` (only `ledger-reveal`, `horizon-sweep`, and
 * `data-ink-draw` are). Rather than add a new export to that foundation
 * package for a single call site, this hook composes it from the package's
 * already-public primitives — `buildStaggeredTimeline`, `easings.trace`,
 * `durationsMs`, `useMotionPreference` — the exact building blocks
 * `data-ink-draw` itself is built from, so the reveal shares the same motion
 * identity and duration/easing tokens.
 *
 * Scope: this implements the ENTRANCE reveal (nodes/edges illuminate
 * node-by-node, in topological rank order, once on mount) and leaves the
 * revealed elements at full opacity afterwards — the "persistent trail" the
 * spec describes. It does not implement hover/selection-triggered
 * RE-illumination of a traversal path; that would be a genuine interaction
 * feature layered on top of this reveal, and is out of scope for this pass.
 */
import {
  REDUCED_MOTION_CAP_MS,
  SIGNATURE_SEQUENCE_CAP_MS,
  buildStaggeredTimeline,
  durationsMs,
  easings,
  useMotionPreference,
} from '@enterprise-design/motion';
import type { TimelineStep } from '@enterprise-design/motion';

export interface ThreadTraceResult {
  /** One step per rank, in ascending rank order. */
  stepsByRank: Map<number, TimelineStep>;
  reduced: boolean;
}

/** Builds one reveal step per RANK (not per node) — every node in a rank illuminates together. */
export function useThreadTrace(ranks: readonly number[]): ThreadTraceResult {
  const { reduced } = useMotionPreference();
  const ids = ranks.map(String);

  const steps = reduced
    ? buildStaggeredTimeline({
        ids,
        staggerMs: durationsMs.feedback / 2,
        stepDurationMs: durationsMs.feedback,
        ease: easings.trace,
        capMs: REDUCED_MOTION_CAP_MS,
      })
    : buildStaggeredTimeline({
        ids,
        staggerMs: durationsMs.state,
        stepDurationMs: durationsMs.structure,
        ease: easings.trace,
        capMs: SIGNATURE_SEQUENCE_CAP_MS,
      });

  const stepsByRank = new Map<number, TimelineStep>();
  ranks.forEach((rank, index) => {
    const step = steps[index];
    if (step) stepsByRank.set(rank, step);
  });

  return { stepsByRank, reduced };
}
