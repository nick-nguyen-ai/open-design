import { z } from 'zod';

export const DesignGrammar = z.object({
  id: z.string(),
  name: z.string(),
  intent: z.string(),
  layoutRules: z.array(z.string()),
  typographyRules: z.array(z.string()),
  navigationRules: z.array(z.string()),
  chartRules: z.array(z.string()),
  diagramRules: z.array(z.string()),
  motionRules: z.array(z.string()),
  signatureSequences: z.array(z.string()),
  surfaceRules: z.array(z.string()),
  preferredComponents: z.array(z.string()),
  prohibitedPatterns: z.array(z.string()),
  accessibilityNotes: z.array(z.string()),
  exampleExperienceIds: z.array(z.string()),
});
export type DesignGrammar = z.infer<typeof DesignGrammar>;
