import { describe, expect, it } from 'vitest';
import { WorldTemplateDescriptor, SlideKindSpec, SlotSpec } from './world-template.js';

const validSlot = {
  name: 'notice',
  type: 'text',
  required: true,
  limits: { maxChars: 60 },
  guidance: 'A synthetic-data notice, printed on the footer rule of every slide.',
};

const validSlideKind = {
  kind: 'kpi',
  purpose: 'The four headline metrics, one flagged below its floor.',
  repeats: { min: 1, max: 1 },
  slots: [
    validSlot,
    {
      name: 'kpis',
      type: 'metric',
      required: true,
      limits: { minItems: 4, maxItems: 4 },
      guidance: 'Exactly four KPI tiles; exactly one carries the off-track anomaly status.',
    },
  ],
};

const validDescriptor = {
  schemaVersion: '1.0',
  id: 'quarter',
  experienceId: 'deck-quarterly-business-review',
  surface: 'slide-deck',
  style: 'conventional',
  mood: 'light',
  grammarId: 'precision-grid',
  audiences: ['executive', 'business'],
  businessIntents: ['review-quarterly-performance'],
  componentsUsed: ['comp.kpi-tile'],
  slideKinds: [validSlideKind],
  guidance: ['Exactly one KPI carries the anomaly status.', 'The synthetic notice is required.'],
};

describe('WorldTemplateDescriptor', () => {
  it('parses a valid descriptor', () => {
    const parsed = WorldTemplateDescriptor.parse(validDescriptor);
    expect(parsed.id).toBe('quarter');
    expect(parsed.slideKinds[0]?.slots[0]?.name).toBe('notice');
  });

  it('rejects a schemaVersion other than 1.0', () => {
    const result = WorldTemplateDescriptor.safeParse({ ...validDescriptor, schemaVersion: '2.0' });
    expect(result.success).toBe(false);
  });

  it('rejects a style outside art-directed | conventional', () => {
    const result = WorldTemplateDescriptor.safeParse({ ...validDescriptor, style: 'whimsical' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.join('.') === 'style')).toBe(true);
    }
  });

  it('rejects a slot with an unknown type', () => {
    const result = SlotSpec.safeParse({ ...validSlot, type: 'colour' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.join('.') === 'type')).toBe(true);
    }
  });

  it('rejects a slot missing its guidance', () => {
    const { guidance: _guidance, ...noGuidance } = validSlot;
    const result = SlotSpec.safeParse(noGuidance);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.join('.') === 'guidance')).toBe(true);
    }
  });

  it('rejects a slot missing its limits object', () => {
    const { limits: _limits, ...noLimits } = validSlot;
    const result = SlotSpec.safeParse(noLimits);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.join('.') === 'limits')).toBe(true);
    }
  });

  it('rejects a slide kind with no slots', () => {
    const result = SlideKindSpec.safeParse({ ...validSlideKind, slots: [] });
    expect(result.success).toBe(false);
  });

  it('requires at least one slide kind', () => {
    const result = WorldTemplateDescriptor.safeParse({ ...validDescriptor, slideKinds: [] });
    expect(result.success).toBe(false);
  });

  it('defaults craftRules to an empty array when omitted', () => {
    const parsed = WorldTemplateDescriptor.parse(validDescriptor);
    expect(parsed.craftRules).toEqual([]);
  });

  it('accepts declared craft rule ids and rejects unknown ones', () => {
    const ok = WorldTemplateDescriptor.safeParse({
      ...validDescriptor,
      craftRules: ['exactly-one-anomaly-kpi', 'notice-required'],
    });
    expect(ok.success).toBe(true);
    const bad = WorldTemplateDescriptor.safeParse({
      ...validDescriptor,
      craftRules: ['no-such-rule'],
    });
    expect(bad.success).toBe(false);
  });

  it('is JSON-serializable and round-trips stable (no functions)', () => {
    const parsed = WorldTemplateDescriptor.parse(validDescriptor);
    const json = JSON.stringify(parsed);
    const roundTripped = WorldTemplateDescriptor.parse(JSON.parse(json));
    expect(roundTripped).toEqual(parsed);
    // A second serialization is byte-identical — the descriptor holds no functions/undefined.
    expect(JSON.stringify(roundTripped)).toBe(json);
  });
});
