import { describe, expect, it } from 'vitest';
import { McpError } from './mcp-error.js';

const validMcpError = {
  code: 'NO_MATCH',
  message: 'No components matched the given constraints.',
  details: ['density=high and motionLevel=3 conflict with corporateSuitability=restricted'],
  remediation: ['Relax motionLevel to 1 or lower.'],
  requestId: 'req-123',
};

describe('McpError', () => {
  it('round-trips a valid MCP error', () => {
    const parsed = McpError.parse(validMcpError);
    expect(parsed).toEqual(validMcpError);
  });

  it('rejects a code value outside the documented error codes', () => {
    const result = McpError.safeParse({ ...validMcpError, code: 'TIMEOUT' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.includes('code'))).toBe(true);
    }
  });

  it('rejects an MCP error missing requestId', () => {
    const { requestId: _requestId, ...withoutRequestId } = validMcpError;
    const result = McpError.safeParse(withoutRequestId);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.includes('requestId'))).toBe(true);
    }
  });
});
