import { describe, expect, it } from 'vitest';
import { DesignGrammar } from './grammar.js';

const validDesignGrammar = {
  id: 'precision-grid',
  name: 'Precision Grid',
  intent: 'Dense, structured, exact layouts for data-heavy surfaces.',
  layoutRules: ['12-column grid', 'dense spacing scale'],
  typographyRules: ['tabular numerals for data'],
  navigationRules: ['persistent left rail'],
  chartRules: ['gridlines visible', 'no 3D charts'],
  diagramRules: ['orthogonal connectors only'],
  motionRules: ['motion level capped at 2'],
  signatureSequences: ['ledger-reveal', 'data-ink-draw'],
  surfaceRules: ['dashboard', 'technical-explainer'],
  preferredComponents: ['comp.kpi-tile'],
  prohibitedPatterns: ['decorative illustration'],
  accessibilityNotes: ['high contrast gridlines'],
  exampleExperienceIds: ['exp.risk-dashboard'],
};

describe('DesignGrammar', () => {
  it('round-trips a valid design grammar', () => {
    const parsed = DesignGrammar.parse(validDesignGrammar);
    expect(parsed).toEqual(validDesignGrammar);
  });

  it('rejects signatureSequences that is not an array', () => {
    const result = DesignGrammar.safeParse({
      ...validDesignGrammar,
      signatureSequences: 'ledger-reveal',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.path.includes('signatureSequences')),
      ).toBe(true);
    }
  });

  it('rejects a grammar missing a required field', () => {
    const { intent: _intent, ...withoutIntent } = validDesignGrammar;
    const result = DesignGrammar.safeParse(withoutIntent);
    expect(result.success).toBe(false);
  });
});
