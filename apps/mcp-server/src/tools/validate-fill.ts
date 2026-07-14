/**
 * `validate_fill` domain logic — adapter-independent (no SDK import).
 *
 * Validates a candidate fill against a world-template's DESCRIPTOR contract, NOT
 * the world-specific Zod fill schema. The server loads only the generated JSON
 * (no tsx-at-runtime of the experience files), so it cannot import
 * `quarter-fill`/`cutover-fill`. Instead it enforces the machine-checkable
 * envelope the descriptor already carries:
 *   - required slots present (resolved by their dot-path name),
 *   - per-slot char caps (`maxChars`) and item counts (`minItems`/`maxItems`),
 *   - the declared craft rules (the single flagged anomaly, the required notice).
 *
 * This catches the design-degrading mistakes (a missing anomaly, an oversize
 * headline, an unbalanced grid). FULL Zod-level validation — refinements,
 * cross-field rules, enum membership — remains a CLIENT-SIDE step: the fill
 * author imports the world's `*Fill` Zod schema and parses before shipping. The
 * tool guarantees the descriptor contract; the client guarantees the rest.
 *
 * Returns a structured {@link ToolOutcome}: the findings on success (a
 * schema-invalid fill is a SUCCESSFUL call returning `valid:false`), an
 * `INVALID_INPUT` for malformed arguments, or `UNKNOWN_TEMPLATE` for an id that
 * is not in the registry.
 */
import type { SlotSpec, WorldTemplateDescriptor } from '@enterprise-design/contracts';
import { ValidateFillInput, type FillFinding, type ValidateFillOutput } from '../schemas.js';
import { makeError, newRequestId, type ToolOutcome } from '../errors.js';
import type { RegistryData } from '../registry-data.js';

/** Resolve a dot-path (e.g. `deck.notice`, `summary.sentences`) against a value. */
function resolvePath(root: unknown, path: string): unknown {
  let current: unknown = root;
  for (const part of path.split('.')) {
    if (current === null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

function isMissing(value: unknown): boolean {
  return value === undefined || value === null;
}

/** Append descriptor-level slot findings (required / maxChars / minItems / maxItems). */
function checkSlot(fill: unknown, slot: SlotSpec, findings: FillFinding[]): void {
  const value = resolvePath(fill, slot.name);

  if (isMissing(value)) {
    if (slot.required) {
      findings.push({
        path: slot.name,
        rule: 'required',
        message: `Required slot "${slot.name}" is missing.`,
        guidance: slot.guidance,
      });
    }
    return;
  }

  const { maxChars, minItems, maxItems } = slot.limits;

  if (maxChars !== undefined) {
    if (typeof value === 'string') {
      if (value.length > maxChars) {
        findings.push({
          path: slot.name,
          rule: 'maxChars',
          message: `Slot "${slot.name}" is ${value.length} chars; the cap is ${maxChars}.`,
          guidance: slot.guidance,
        });
      }
    } else if (Array.isArray(value)) {
      value.forEach((element, index) => {
        if (typeof element === 'string' && element.length > maxChars) {
          findings.push({
            path: `${slot.name}[${index}]`,
            rule: 'maxChars',
            message: `Slot "${slot.name}[${index}]" is ${element.length} chars; the cap is ${maxChars}.`,
            guidance: slot.guidance,
          });
        }
      });
    }
  }

  if (Array.isArray(value)) {
    if (minItems !== undefined && value.length < minItems) {
      findings.push({
        path: slot.name,
        rule: 'minItems',
        message: `Slot "${slot.name}" has ${value.length} item(s); the minimum is ${minItems}.`,
        guidance: slot.guidance,
      });
    }
    if (maxItems !== undefined && value.length > maxItems) {
      findings.push({
        path: slot.name,
        rule: 'maxItems',
        message: `Slot "${slot.name}" has ${value.length} item(s); the maximum is ${maxItems}.`,
        guidance: slot.guidance,
      });
    }
  }
}

/** Append craft-rule findings for the rules the descriptor declares. */
function checkCraftRules(fill: unknown, descriptor: WorldTemplateDescriptor, findings: FillFinding[]): void {
  for (const rule of descriptor.craftRules) {
    if (rule === 'notice-required') {
      const notice = resolvePath(fill, 'deck.notice');
      if (typeof notice !== 'string' || notice.trim().length === 0) {
        findings.push({
          path: 'deck.notice',
          rule: 'craft',
          message: 'Craft rule "notice-required": deck.notice must be a present, non-empty synthetic-data notice.',
        });
      }
    } else if (rule === 'exactly-one-anomaly-kpi') {
      const kpis = resolvePath(fill, 'kpis');
      const count = Array.isArray(kpis)
        ? kpis.filter((k) => typeof k === 'object' && k !== null && (k as { status?: unknown }).status === 'off-track').length
        : 0;
      if (count !== 1) {
        findings.push({
          path: 'kpis',
          rule: 'craft',
          message: `Craft rule "exactly-one-anomaly-kpi": exactly one KPI must carry status "off-track" (found ${count}).`,
        });
      }
    } else if (rule === 'exactly-one-stays-node') {
      const nodes = resolvePath(fill, 'nodes');
      const count = Array.isArray(nodes)
        ? nodes.filter((n) => typeof n === 'object' && n !== null && (n as { disposition?: unknown }).disposition === 'stays').length
        : 0;
      if (count !== 1) {
        findings.push({
          path: 'nodes',
          rule: 'craft',
          message: `Craft rule "exactly-one-stays-node": exactly one estate node must carry disposition "stays" (found ${count}).`,
        });
      }
    } else if (rule === 'exactly-one-blocked-gate') {
      const gates = resolvePath(fill, 'gates');
      const count = Array.isArray(gates)
        ? gates.filter((g) => typeof g === 'object' && g !== null && (g as { status?: unknown }).status === 'warning').length
        : 0;
      if (count !== 1) {
        findings.push({
          path: 'gates',
          rule: 'craft',
          message: `Craft rule "exactly-one-blocked-gate": exactly one readiness gate must carry status "warning" (found ${count}).`,
        });
      }
    }
  }
}

/** Drop exact-duplicate findings (a slot may appear in more than one slide kind). */
function dedupe(findings: FillFinding[]): FillFinding[] {
  const seen = new Set<string>();
  const out: FillFinding[] = [];
  for (const finding of findings) {
    const key = `${finding.path}\x1f${finding.rule}\x1f${finding.message}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(finding);
  }
  return out;
}

export function validateFillTool(registry: RegistryData, rawInput: unknown): ToolOutcome<ValidateFillOutput> {
  const requestId = newRequestId();

  const parsed = ValidateFillInput.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      error: makeError('INVALID_INPUT', 'Invalid arguments for validate_fill.', {
        requestId,
        details: parsed.error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`),
        remediation: ['Provide a non-empty worldTemplateId and a fill value (see tools/list).'],
      }),
    };
  }

  const { worldTemplateId, fill } = parsed.data;
  const descriptor = registry.worldTemplateById.get(worldTemplateId);
  if (!descriptor) {
    return {
      ok: false,
      error: makeError('UNKNOWN_TEMPLATE', `Unknown world-template "${worldTemplateId}".`, {
        requestId,
        details: [`Known templates: ${[...new Set(registry.worldTemplates.map((t) => `${t.id} (${t.experienceId})`))].join(', ')}.`],
        remediation: ['Use the worldTemplateId returned by compose_slide_deck (its id or experienceId).'],
      }),
    };
  }

  // A non-object fill fails every descriptor slot; report it once, clearly.
  if (fill === null || typeof fill !== 'object' || Array.isArray(fill)) {
    return {
      ok: true,
      data: {
        valid: false,
        worldTemplateId,
        findings: [
          { path: '(root)', rule: 'required', message: 'Fill must be an object mapping slot names to values.' },
        ],
      },
    };
  }

  const findings: FillFinding[] = [];
  for (const slideKind of descriptor.slideKinds) {
    for (const slot of slideKind.slots) {
      checkSlot(fill, slot, findings);
    }
  }
  checkCraftRules(fill, descriptor, findings);

  const deduped = dedupe(findings);
  return {
    ok: true,
    data: { valid: deduped.length === 0, worldTemplateId, findings: deduped },
  };
}
