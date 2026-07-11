import { z } from 'zod';

export const MotionTrigger = z.enum([
  'enter',
  'select',
  'navigate',
  'data-change',
  'scroll-section',
]);
export type MotionTrigger = z.infer<typeof MotionTrigger>;

export const MotionSequence = z.object({
  sequenceId: z.string(),
  name: z.string(),
  description: z.string(),
  trigger: MotionTrigger,
  order: z.array(z.string()),
  totalDurationMs: z.number().positive().max(1200),
  reducedMotionVariant: z.string().min(1),
});
export type MotionSequence = z.infer<typeof MotionSequence>;
