import { describe, expect, it } from 'vitest';
import { CraftRule, WorldTemplateDescriptor, SectionSpec, SlotSpec, evaluateCraftRule } from './world-template.js';

const validSlot = {
  name: 'notice',
  type: 'text',
  required: true,
  limits: { maxChars: 60 },
  guidance: 'A synthetic-data notice, printed on the footer rule of every slide.',
};

const validSection = {
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
  schemaVersion: '1.1',
  id: 'quarter',
  experienceId: 'deck-quarterly-business-review',
  surface: 'slide-deck',
  style: 'conventional',
  mood: 'light',
  grammarId: 'precision-grid',
  audiences: ['executive', 'business'],
  businessIntents: ['review-quarterly-performance'],
  componentsUsed: ['comp.kpi-tile'],
  sections: [validSection],
  guidance: ['Exactly one KPI carries the anomaly status.', 'The synthetic notice is required.'],
};

describe('WorldTemplateDescriptor', () => {
  it('parses a valid descriptor', () => {
    const parsed = WorldTemplateDescriptor.parse(validDescriptor);
    expect(parsed.id).toBe('quarter');
    expect(parsed.sections.length).toBeGreaterThan(0);
    expect(parsed.sections[0]?.slots[0]?.name).toBe('notice');
  });

  it('parses schemaVersion 1.1 with sections and briefKeywords', () => {
    const parsed = WorldTemplateDescriptor.parse({
      ...validDescriptor,
      briefKeywords: ['monitoring', 'drift'],
    });
    expect(parsed.schemaVersion).toBe('1.1');
    expect(parsed.briefKeywords).toEqual(['monitoring', 'drift']);
  });

  it('defaults briefKeywords to an empty array when omitted', () => {
    const parsed = WorldTemplateDescriptor.parse(validDescriptor);
    expect(parsed.briefKeywords).toEqual([]);
  });

  it('rejects the legacy schemaVersion 1.0', () => {
    const result = WorldTemplateDescriptor.safeParse({ ...validDescriptor, schemaVersion: '1.0' });
    expect(result.success).toBe(false);
  });

  it('rejects a schemaVersion other than 1.1', () => {
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

  it('rejects a section with no slots', () => {
    const result = SectionSpec.safeParse({ ...validSection, slots: [] });
    expect(result.success).toBe(false);
  });

  it('requires at least one section', () => {
    const result = WorldTemplateDescriptor.safeParse({ ...validDescriptor, sections: [] });
    expect(result.success).toBe(false);
  });

  it('defaults craftRules to an empty array when omitted', () => {
    const parsed = WorldTemplateDescriptor.parse(validDescriptor);
    expect(parsed.craftRules).toEqual([]);
  });

  it('accepts an exactly-one rule with path/field/equals', () => {
    const rule = CraftRule.parse({
      kind: 'exactly-one',
      path: 'gates',
      field: 'status',
      equals: 'warning',
      description: 'Exactly one readiness gate carries status warning.',
    });
    expect(rule.kind).toBe('exactly-one');
  });

  it('accepts a required-nonempty rule', () => {
    const rule = CraftRule.parse({
      kind: 'required-nonempty',
      path: 'deck.notice',
      description: 'The synthetic-data notice must be present.',
    });
    expect(rule.path).toBe('deck.notice');
  });

  it('rejects an unknown rule kind and legacy string ids', () => {
    expect(() => CraftRule.parse('notice-required')).toThrow();
    expect(() => CraftRule.parse({ kind: 'count-range', path: 'x', description: 'y' })).toThrow();
  });

  it('accepts declared craft rules as objects and rejects legacy string ids', () => {
    const ok = WorldTemplateDescriptor.safeParse({
      ...validDescriptor,
      craftRules: [
        { kind: 'exactly-one', path: 'kpis', field: 'status', equals: 'off-track', description: 'One anomaly.' },
        { kind: 'required-nonempty', path: 'deck.notice', description: 'Provenance notice.' },
      ],
    });
    expect(ok.success).toBe(true);
    const bad = WorldTemplateDescriptor.safeParse({
      ...validDescriptor,
      craftRules: ['no-such-rule'],
    });
    expect(bad.success).toBe(false);
  });

  it('accepts a no-back-edges rule', () => {
    const rule = CraftRule.parse({
      kind: 'no-back-edges',
      path: 'flow.edges',
      description: 'The flow lays out as a DAG; a return edge strands its node.',
    });
    expect(rule.kind).toBe('no-back-edges');
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

describe('evaluateCraftRule — no-back-edges', () => {
  const rule = CraftRule.parse({
    kind: 'no-back-edges',
    path: 'flow.edges',
    description: 'The flow must be acyclic.',
  });
  const fillWith = (edges: unknown) => ({ flow: { edges } });

  it('passes a linear chain', () => {
    const edges = [
      { from: 'a', to: 'b' },
      { from: 'b', to: 'c' },
      { from: 'c', to: 'd' },
    ];
    expect(evaluateCraftRule(rule, fillWith(edges))).toBe(true);
  });

  it('passes a branching DAG (diamond)', () => {
    const edges = [
      { from: 'a', to: 'b' },
      { from: 'a', to: 'c' },
      { from: 'b', to: 'd' },
      { from: 'c', to: 'd' },
    ];
    expect(evaluateCraftRule(rule, fillWith(edges))).toBe(true);
  });

  it('fails a two-node cycle', () => {
    const edges = [
      { from: 'a', to: 'b' },
      { from: 'b', to: 'a' },
    ];
    expect(evaluateCraftRule(rule, fillWith(edges))).toBe(false);
  });

  it('fails a self-loop', () => {
    expect(evaluateCraftRule(rule, fillWith([{ from: 'a', to: 'a' }]))).toBe(false);
  });

  it('fails a longer cycle reached from a linear prefix', () => {
    const edges = [
      { from: 'start', to: 'a' },
      { from: 'a', to: 'b' },
      { from: 'b', to: 'c' },
      { from: 'c', to: 'a' },
    ];
    expect(evaluateCraftRule(rule, fillWith(edges))).toBe(false);
  });

  it('skips malformed elements rather than failing them', () => {
    const edges = [
      { from: 'a', to: 'b' },
      { from: 'b' }, // missing `to`
      null,
      'not-an-edge',
      { from: 42, to: 'c' }, // non-string endpoint
    ];
    expect(evaluateCraftRule(rule, fillWith(edges))).toBe(true);
  });

  it('passes an empty array and a non-array value (presence is required’s job)', () => {
    expect(evaluateCraftRule(rule, fillWith([]))).toBe(true);
    expect(evaluateCraftRule(rule, fillWith(undefined))).toBe(true);
    expect(evaluateCraftRule(rule, {})).toBe(true);
  });

  it('does not false-positive on a node revisited via two DAG paths', () => {
    // d is reachable twice (via b and via c) but there is no cycle.
    const edges = [
      { from: 'a', to: 'b' },
      { from: 'a', to: 'c' },
      { from: 'b', to: 'd' },
      { from: 'c', to: 'd' },
      { from: 'd', to: 'e' },
    ];
    expect(evaluateCraftRule(rule, fillWith(edges))).toBe(true);
  });
});
