import type { MotionSequence } from '@enterprise-design/contracts';

/**
 * Registry manifest for the `ledger-reveal` signature sequence implemented in
 * `./LedgerReveal.tsx` (plan §4.3). This file is metadata only — the actual
 * runtime behaviour lives in the co-located component; the numbers here are
 * transcribed from that implementation, not invented.
 */
const ledgerRevealMotion: MotionSequence = {
  sequenceId: 'ledger-reveal',
  name: 'Ledger Reveal',
  description:
    'Numeric and tabular content resolves from a neutral placeholder to its final value in reading order, with a single settle — no counting-up theatrics, values arrive once. Items stagger-start by --dur-feedback (90ms) and each settles over --dur-structure (320ms) on --ease-settle, scaled down together so the whole reveal never exceeds the 1200ms signature-sequence budget regardless of item count. Natural home: dashboards and KPI walls.',
  trigger: 'enter',
  order: ['items-in-reading-order'],
  totalDurationMs: 1200,
  reducedMotionVariant:
    'Same reading order, opacity-only steps (no y-translate), halved stagger (--dur-feedback / 2), capped at the 400ms reduced-motion budget — the informational reveal order is preserved, only the movement is removed.',
};

export default ledgerRevealMotion;
