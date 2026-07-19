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
import {
  RENDER_BUDGET_HEADROOM,
  RENDER_BUDGET_MIN_SLACK,
  evaluateCraftRule,
  resolveFillPath as resolvePath,
  type ShippedMagnitudes,
  type SlotMagnitude,
  type SlotSpec,
  type WorldTemplateDescriptor,
} from '@enterprise-design/contracts';
import { ValidateFillInput, type FillFinding, type ValidateFillOutput } from '../schemas.js';
import { makeError, newRequestId, type ToolOutcome } from '../errors.js';
import type { RegistryData } from '../registry-data.js';

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

/** The render budget for one shipped magnitude: headroom with an absolute floor. */
function budget(shipped: number): number {
  return Math.max(Math.ceil(shipped * RENDER_BUDGET_HEADROOM), shipped + RENDER_BUDGET_MIN_SLACK);
}

/**
 * Machine/reference fields that are never rendered as prose (ids and edge
 * endpoints) or carry enum-like tokens: exempt from render budgets.
 */
const NON_PROSE_FIELDS = new Set(['id', 'from', 'to', 'kind', 'tone', 'reply', 'step']);

/**
 * Budget candidate values against the SHIPPED world's magnitudes (derived at
 * registry build — the proven-to-render corpus).
 *
 * SCOPE — object-array string fields ONLY (plus one nested level of
 * string-array fields like tableRows `values`): those are the values no
 * `maxChars` governs, and where every real truncation in the pilot runs
 * happened (cells detail, era labels, stage labels). Plain string and
 * string-array slots are governed by their descriptor caps, which the
 * certifier's budget-drift check keeps honest — budgeting them against a
 * single shipped SAMPLE double-polices and rejects known-good fills (a
 * 55-char heading renders fine over a 26-char shipped sample).
 * Machine fields (ids, edge endpoints, enum tokens) are exempt. The verify
 * rig's ellipsis probe remains the precise, rendered-pixels catcher; this is
 * the cheap static layer that stops egregious overshoot before a render.
 */
function checkRenderBudget(
  fill: unknown,
  slot: SlotSpec,
  magnitudes: Record<string, SlotMagnitude> | undefined,
  findings: FillFinding[],
): void {
  if (!magnitudes) return;
  const path = slot.name.replace(/\[\]$/, '');
  const magnitude = magnitudes[path];
  if (magnitude?.fields === undefined) return;
  const value = resolvePath(fill, path);
  if (!Array.isArray(value)) return;

  const push = (where: string, actual: number, shipped: number) => {
    findings.push({
      path: where,
      rule: 'renderBudget',
      message: `"${where}" is ${actual} chars; the shipped world renders ${shipped} here (budget ${budget(shipped)} = shipped × ${RENDER_BUDGET_HEADROOM}, floor +${RENDER_BUDGET_MIN_SLACK}). Longer values ellipsize or overlap in the template's frame — tighten toward the shipped magnitude.`,
      guidance: slot.guidance,
    });
  };

  value.forEach((element, index) => {
    if (element === null || typeof element !== 'object' || Array.isArray(element)) return;
    for (const [field, fieldValue] of Object.entries(element as Record<string, unknown>)) {
      if (NON_PROSE_FIELDS.has(field)) continue;
      const shipped = magnitude.fields?.[field];
      if (shipped === undefined || shipped === 0) continue;
      if (typeof fieldValue === 'string') {
        if (fieldValue.length > budget(shipped)) push(`${path}[${index}].${field}`, fieldValue.length, shipped);
      } else if (Array.isArray(fieldValue)) {
        fieldValue.forEach((sub, subIndex) => {
          if (typeof sub === 'string' && sub.length > budget(shipped)) {
            push(`${path}[${index}].${field}[${subIndex}]`, sub.length, shipped);
          }
        });
      }
    }
  });
}

/**
 * Generic interpreter for the descriptor's parameterized craft rules. The
 * pass/fail decision is delegated to the shared {@link evaluateCraftRule} in
 * contracts (so the tool and the certifier can never diverge); only the
 * message construction is tool-specific.
 */
function checkCraftRules(fill: unknown, descriptor: WorldTemplateDescriptor, findings: FillFinding[]): void {
  for (const rule of descriptor.craftRules) {
    if (evaluateCraftRule(rule, fill)) continue;
    if (rule.kind === 'required-nonempty') {
      findings.push({
        path: rule.path,
        rule: 'craft',
        message: `Craft rule (required-nonempty at "${rule.path}"): ${rule.description}`,
      });
    } else if (rule.kind === 'no-back-edges') {
      findings.push({
        path: rule.path,
        rule: 'craft',
        message: `Craft rule (no-back-edges at "${rule.path}" — the edge list contains a directed cycle): ${rule.description}`,
      });
    } else {
      const value = resolvePath(fill, rule.path);
      const count = Array.isArray(value)
        ? value.filter(
            (el) => typeof el === 'object' && el !== null && (el as Record<string, unknown>)[rule.field] === rule.equals,
          ).length
        : 0;
      findings.push({
        path: rule.path,
        rule: 'craft',
        message: `Craft rule (exactly-one at "${rule.path}" where ${rule.field}="${rule.equals}", found ${count}): ${rule.description}`,
      });
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
  const magnitudes: ShippedMagnitudes[string] | undefined = registry.shippedMagnitudes[descriptor.id];
  for (const section of descriptor.sections) {
    for (const slot of section.slots) {
      checkSlot(fill, slot, findings);
      checkRenderBudget(fill, slot, magnitudes, findings);
    }
  }
  checkCraftRules(fill, descriptor, findings);

  const deduped = dedupe(findings);
  return {
    ok: true,
    data: { valid: deduped.length === 0, worldTemplateId, findings: deduped },
  };
}
