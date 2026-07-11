import { z } from 'zod';
import { CompositionRole } from './enums.js';

export const RecommendationEvidence = z.object({
  componentId: z.string(),
  matchedIntents: z.array(z.string()),
  matchedConstraints: z.array(z.string()),
  score: z.number(),
  explanation: z.string(),
});
export type RecommendationEvidence = z.infer<typeof RecommendationEvidence>;

export const RankedComponent = z.object({
  componentId: z.string(),
  role: CompositionRole,
  score: z.number(),
  evidence: RecommendationEvidence,
  fallbackComponentId: z.string().optional(),
});
export type RankedComponent = z.infer<typeof RankedComponent>;
