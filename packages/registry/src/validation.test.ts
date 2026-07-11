import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { compileRegistry } from './compile.js';
import type { CompileResult, Severity } from './types.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const badRoot = (name: string): string => path.join(here, '__fixtures__', name);

async function compileBad(name: string): Promise<CompileResult> {
  return compileRegistry({ cwd: badRoot(name) });
}

function findDiagnostic(result: CompileResult, ruleId: string) {
  return result.diagnostics.find((d) => d.ruleId === ruleId);
}

describe('validation rules — one bad fixture each', () => {
  it('REG_DUPLICATE_ID: two manifests sharing an id → error', async () => {
    const result = await compileBad('bad-duplicate-id');
    const diagnostic = findDiagnostic(result, 'REG_DUPLICATE_ID');
    expect(diagnostic?.severity).toBe<Severity>('error');
    expect(diagnostic?.entityId).toBe('comp.dup');
    expect(result.ok).toBe(false);
  });

  it('REG_UNKNOWN_REFERENCE: experience referencing unknown ids → error', async () => {
    const result = await compileBad('bad-unknown-reference');
    const diagnostics = result.diagnostics.filter((d) => d.ruleId === 'REG_UNKNOWN_REFERENCE');
    expect(diagnostics.length).toBeGreaterThanOrEqual(3);
    expect(diagnostics.every((d) => d.severity === 'error')).toBe(true);
    const messages = diagnostics.map((d) => d.message).join(' ');
    expect(messages).toContain('ghost-grammar');
    expect(messages).toContain('ghost-sequence');
    expect(messages).toContain('comp.ghost');
    expect(result.ok).toBe(false);
  });

  it('COMP_SYMMETRY: one-sided conflictsWith → error', async () => {
    const result = await compileBad('bad-conflict-symmetry');
    const diagnostic = findDiagnostic(result, 'COMP_SYMMETRY');
    expect(diagnostic?.severity).toBe<Severity>('error');
    expect(diagnostic?.entityId).toBe('comp.alpha');
    expect(result.ok).toBe(false);
  });

  it('A11Y_REDUCED_MOTION: motionLevel > 0 without reducedMotion → error', async () => {
    const result = await compileBad('bad-a11y');
    const diagnostic = findDiagnostic(result, 'A11Y_REDUCED_MOTION');
    expect(diagnostic?.severity).toBe<Severity>('error');
    expect(diagnostic?.entityId).toBe('comp.motion-heavy');
    expect(result.ok).toBe(false);
  });

  it('PROV_PROVENANCE: approved component missing review record → error', async () => {
    const result = await compileBad('bad-provenance');
    const diagnostic = findDiagnostic(result, 'PROV_PROVENANCE');
    expect(diagnostic?.severity).toBe<Severity>('error');
    expect(diagnostic?.entityId).toBe('comp.approved-no-record');
    expect(result.ok).toBe(false);
  });

  it('SEARCH_EMPTY_TEXT: whitespace-only searchText → error', async () => {
    const result = await compileBad('bad-search-text');
    const diagnostic = findDiagnostic(result, 'SEARCH_EMPTY_TEXT');
    expect(diagnostic?.severity).toBe<Severity>('error');
    expect(diagnostic?.entityId).toBe('comp.blank-search');
    expect(result.ok).toBe(false);
  });

  it('PERF bundle cost: missing bundleCostKbGzip → clear SCHEMA_INVALID error', async () => {
    const result = await compileBad('bad-perf-bundle');
    const diagnostic = findDiagnostic(result, 'SCHEMA_INVALID');
    expect(diagnostic?.severity).toBe<Severity>('error');
    expect(diagnostic?.message).toContain('bundleCostKbGzip');
    expect(result.ok).toBe(false);
  });

  it('APPROVAL: approved experience using an unapproved component → warning (not error)', async () => {
    const result = await compileBad('bad-approval');
    const diagnostic = findDiagnostic(result, 'APPROVAL');
    expect(diagnostic?.severity).toBe<Severity>('warning');
    expect(diagnostic?.entityId).toBe('exp.approved');
    // A warning must not fail the build.
    expect(result.errorCount).toBe(0);
    expect(result.ok).toBe(true);
    expect(result.warningCount).toBeGreaterThan(0);
  });
});
