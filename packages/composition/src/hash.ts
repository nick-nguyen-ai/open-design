/**
 * Deterministic id derivation. `blueprintId`s must be a pure function of the
 * blueprint's structural content — never `Math.random`, never a timestamp — so
 * that identical inputs yield a byte-identical blueprint. We canonicalise to a
 * key-sorted JSON string and hash it with FNV-1a (a small, pure, dependency-
 * free hash; `node:crypto` is unavailable in browser-safe src).
 */

/** Stable JSON: object keys are emitted in sorted order at every depth. */
export function canonicalStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value) ?? 'null';
  }
  if (Array.isArray(value)) {
    return `[${value.map(canonicalStringify).join(',')}]`;
  }
  const entries = Object.keys(value as Record<string, unknown>)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalStringify((value as Record<string, unknown>)[key])}`);
  return `{${entries.join(',')}}`;
}

/** FNV-1a 32-bit over the UTF-16 code units of `input`, returned as 8 hex chars. */
export function fnv1a(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    // 32-bit FNV prime multiply via shifts to stay in integer range.
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}

/** `bp_<hash>` id for a structural signature object. */
export function blueprintIdFrom(signature: unknown): string {
  return `bp_${fnv1a(canonicalStringify(signature))}`;
}
