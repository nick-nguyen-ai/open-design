/**
 * Content-safe, stderr-only structured logging — adapter-independent.
 *
 * stdout is the MCP protocol channel: writing ANYTHING there that is not a
 * JSON-RPC frame corrupts the session. Every log line therefore goes to
 * stderr via {@link write}. Audit records carry only operational metadata —
 * tool name, status, duration, result count, error code — and NEVER the raw
 * query, component id, or any catalogue content, so logs can be shipped
 * without leaking what a caller searched for.
 *
 * Set `MCP_LOG=off` (or pass `enabled: false`) for a zero-logging mode.
 */

/** Operational audit record for one tool call. Content-free by construction. */
export interface AuditRecord {
  tool: string;
  status: 'ok' | 'error';
  durationMs: number;
  /** Result count for a successful call (e.g. rows returned). Omitted on error. */
  count?: number;
  /** Structured error code for a failed call (e.g. UNKNOWN_COMPONENT). Never a message with content. */
  code?: string;
}

export interface Logger {
  /** Record a completed tool call (content-free). */
  audit(record: AuditRecord): void;
  /** Lifecycle/diagnostic line — callers must pass a static, content-free message. */
  info(message: string): void;
  /** Error line — callers must pass a static, content-free message. */
  error(message: string): void;
}

export interface LoggerOptions {
  /** When false, nothing is logged at all (zero-logging mode). Defaults to `MCP_LOG !== 'off'`. */
  enabled?: boolean;
  /** Injectable sink for tests; defaults to real stderr. Must NEVER be stdout. */
  write?: (line: string) => void;
}

const defaultWrite = (line: string): void => {
  process.stderr.write(line + '\n');
};

export function createLogger(options: LoggerOptions = {}): Logger {
  const enabled = options.enabled ?? process.env.MCP_LOG !== 'off';
  const write = options.write ?? defaultWrite;

  const emit = (record: Record<string, unknown>): void => {
    if (!enabled) return;
    write(JSON.stringify({ ts: new Date().toISOString(), ...record }));
  };

  return {
    audit(record: AuditRecord): void {
      emit({ kind: 'audit', ...record });
    },
    info(message: string): void {
      emit({ kind: 'info', message });
    },
    error(message: string): void {
      emit({ kind: 'error', message });
    },
  };
}
