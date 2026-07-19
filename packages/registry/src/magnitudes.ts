/**
 * Shipped-magnitude derivation — the registry-build half of the render-budget
 * contract.
 *
 * A descriptor's `maxChars` is the hard envelope, but the template's craft was
 * tuned around what its SHIPPED world actually renders: the shipped fill is the
 * proven-to-render corpus. This module derives, per slot, the magnitudes that
 * corpus actually uses (string length, max array-element length, max length per
 * string field of object arrays) so `validate_fill` can flag a candidate value
 * that fits the cap but exceeds shipped × RENDER_BUDGET_HEADROOM — the class of
 * fill that validates clean and then ellipsizes on screen.
 *
 * Emitted as the PARALLEL artefact `generated/shipped-magnitudes.json` — never
 * part of the descriptor, so the SECTIONS⇄descriptor lockstep the certifier
 * enforces stays out of reach of derived data, and the field cannot be
 * hand-authored by mistake.
 *
 * KNOWN BOUNDARY: derivation walks ONE level of structure — string slots,
 * string arrays, and string/string-array fields of object-array elements.
 * Deeper nesting (e.g. `zones.zones[].nodes[].label`) carries no derived
 * budget; the descriptor cap and the visual gates cover those.
 */
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import type { ShippedMagnitudes, SlotMagnitude, WorldTemplateDescriptor } from '@enterprise-design/contracts';
import { resolveFillPath } from '@enterprise-design/contracts';
import type { Loaded } from './discovery.js';
import type { Diagnostic } from './types.js';

/** A descriptor slot name with any trailing `[]` stripped to a plain dot-path. */
function slotPath(name: string): string {
  return name.replace(/\[\]$/, '');
}

/**
 * Derive the shipped magnitude of one resolved slot value. Returns `undefined`
 * when the value carries no measurable string content (numbers, booleans,
 * empty magnitudes) — such slots simply get no render budget.
 */
export function deriveSlotMagnitude(value: unknown): SlotMagnitude | undefined {
  if (typeof value === 'string') return { chars: value.length };
  if (!Array.isArray(value)) return undefined;

  let itemChars: number | undefined;
  const fields: Record<string, number> = {};
  let hasFields = false;

  for (const element of value) {
    if (typeof element === 'string') {
      itemChars = Math.max(itemChars ?? 0, element.length);
      continue;
    }
    if (element === null || typeof element !== 'object') continue;
    for (const [field, fieldValue] of Object.entries(element as Record<string, unknown>)) {
      if (typeof fieldValue === 'string') {
        fields[field] = Math.max(fields[field] ?? 0, fieldValue.length);
        hasFields = true;
      } else if (Array.isArray(fieldValue)) {
        // One nested level: a string-array field (tableRows `values`, layer `items`).
        for (const sub of fieldValue) {
          if (typeof sub === 'string') {
            fields[field] = Math.max(fields[field] ?? 0, sub.length);
            hasFields = true;
          }
        }
      }
    }
  }

  const out: SlotMagnitude = {};
  if (itemChars !== undefined) out.itemChars = itemChars;
  if (hasFields) out.fields = fields;
  return out.itemChars !== undefined || out.fields ? out : undefined;
}

/**
 * Derive every slot's shipped magnitude for one descriptor against its shipped
 * fill. Slots that do not resolve or carry no string content get no entry.
 */
export function deriveShippedMagnitudes(
  descriptor: WorldTemplateDescriptor,
  shippedFill: unknown,
): Record<string, SlotMagnitude> {
  const out: Record<string, SlotMagnitude> = {};
  for (const section of descriptor.sections) {
    for (const slot of section.slots) {
      const p = slotPath(slot.name);
      if (out[p] !== undefined) continue; // a slot may appear in more than one section kind
      const magnitude = deriveSlotMagnitude(resolveFillPath(shippedFill, p));
      if (magnitude !== undefined) out[p] = magnitude;
    }
  }
  return out;
}

/**
 * Derive magnitudes for every discovered world-template by importing the
 * sibling `content.ts` (the certifier's convention). A world whose shipped
 * fill cannot be loaded is a broken contract → an `error` diagnostic, never a
 * throw, so the compile reports it alongside everything else.
 */
export async function deriveAllShippedMagnitudes(
  worldTemplates: Loaded<WorldTemplateDescriptor>[],
  diagnostics: Diagnostic[],
): Promise<ShippedMagnitudes> {
  const out: ShippedMagnitudes = {};
  for (const { manifest, path: manifestPath } of worldTemplates) {
    const contentPath = path.join(path.dirname(manifestPath), 'content.ts');
    let shippedFill: unknown;
    try {
      const mod = (await import(/* @vite-ignore */ pathToFileURL(contentPath).href)) as Record<string, unknown>;
      shippedFill = mod.SHIPPED_FILL;
    } catch (error) {
      diagnostics.push({
        ruleId: 'MAGNITUDE_DERIVATION_FAILED',
        severity: 'error',
        message: `Failed to import content.ts for world-template "${manifest.id}": ${(error as Error).message}`,
        entityId: manifest.id,
        path: contentPath,
      });
      continue;
    }
    if (shippedFill === undefined) {
      diagnostics.push({
        ruleId: 'MAGNITUDE_DERIVATION_FAILED',
        severity: 'error',
        message: `content.ts for world-template "${manifest.id}" does not export SHIPPED_FILL.`,
        entityId: manifest.id,
        path: contentPath,
      });
      continue;
    }
    out[manifest.id] = deriveShippedMagnitudes(manifest, shippedFill);
  }
  return out;
}
