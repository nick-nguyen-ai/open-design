import { describe, expect, it } from 'vitest';
import { MotionSequence } from './motion.js';

const validMotionSequence = {
  sequenceId: 'ledger-reveal',
  name: 'Ledger Reveal',
  description: 'Rows reveal top to bottom in ledger order.',
  trigger: 'enter',
  order: ['header', 'row-1', 'row-2'],
  totalDurationMs: 800,
  reducedMotionVariant: 'fade-only',
};

describe('MotionSequence', () => {
  it('round-trips a valid motion sequence', () => {
    const parsed = MotionSequence.parse(validMotionSequence);
    expect(parsed).toEqual(validMotionSequence);
  });

  it('rejects totalDurationMs above the 1200ms signature-sequence cap', () => {
    const result = MotionSequence.safeParse({ ...validMotionSequence, totalDurationMs: 1500 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.includes('totalDurationMs'))).toBe(
        true,
      );
    }
  });

  it('rejects an empty reducedMotionVariant', () => {
    const result = MotionSequence.safeParse({ ...validMotionSequence, reducedMotionVariant: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.path.includes('reducedMotionVariant')),
      ).toBe(true);
    }
  });

  it('rejects a trigger value outside the documented set', () => {
    const result = MotionSequence.safeParse({ ...validMotionSequence, trigger: 'hover' });
    expect(result.success).toBe(false);
  });
});
