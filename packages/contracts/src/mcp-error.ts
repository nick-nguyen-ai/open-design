import { z } from 'zod';

export const McpErrorCode = z.enum([
  'INVALID_INPUT',
  'NO_MATCH',
  'NO_TEMPLATE_FIT',
  'CONSTRAINT_CONFLICT',
  'UNKNOWN_COMPONENT',
  'UNKNOWN_TEMPLATE',
  'INVALID_BLUEPRINT',
  'REGISTRY_UNAVAILABLE',
  'INTERNAL_ERROR',
]);
export type McpErrorCode = z.infer<typeof McpErrorCode>;

export const McpError = z.object({
  code: McpErrorCode,
  message: z.string(),
  details: z.array(z.string()),
  remediation: z.array(z.string()),
  requestId: z.string(),
});
export type McpError = z.infer<typeof McpError>;
