/**
 * Deterministic helpers shared across the compiler.
 *
 * Determinism is a hard requirement: re-running `registry:build` on unchanged
 * inputs must produce byte-identical artefacts. We achieve that by (a) sorting
 * every top-level array by a stable string key using code-unit ordering (never
 * `localeCompare`, which is locale-dependent) and (b) recursively sorting object
 * keys before serialisation so authoring order in a manifest cannot leak into
 * the output bytes.
 */

/** Code-unit string comparison — stable and locale-independent, unlike `localeCompare`. */
export function compareStrings(a: string, b: string): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/** Return a new array sorted by the string key produced by `key`. */
export function sortBy<T>(items: readonly T[], key: (item: T) => string): T[] {
  return [...items].sort((a, b) => compareStrings(key(a), key(b)));
}

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

function sortKeysDeep(value: unknown): JsonValue {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }
  if (value !== null && typeof value === 'object') {
    const source = value as Record<string, unknown>;
    const out: Record<string, JsonValue> = {};
    for (const objectKey of Object.keys(source).sort(compareStrings)) {
      out[objectKey] = sortKeysDeep(source[objectKey]);
    }
    return out;
  }
  return value as JsonValue;
}

/**
 * Serialise a value to deterministic JSON: object keys sorted recursively,
 * two-space indentation, and a trailing newline. Array element order is
 * preserved (callers sort top-level arrays explicitly via {@link sortBy}).
 */
export function stableStringify(value: unknown): string {
  return `${JSON.stringify(sortKeysDeep(value), null, 2)}\n`;
}

/** Collapse whitespace, trim, and lowercase a set of fragments into a lexical blob. */
export function normalizeText(fragments: Array<string | undefined>): string {
  return fragments
    .filter((fragment): fragment is string => typeof fragment === 'string' && fragment.length > 0)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}
