/**
 * The GENERATION half of the world-template ingestion engine (Task 6).
 *
 * The certifier (`certify.ts`, Task 5) is the verification half — it proves a
 * finished world is safe to ship. This module is its mirror image: given a
 * shipped content shape it emits the SKELETONS a templatization starts from —
 * a Zod fill schema and a descriptor manifest — with every human decision left
 * as an `AUTHOR:` marker. Because the certifier REFUSES any surviving `AUTHOR:`
 * marker, a scaffold literally cannot ship until every marker is authored; the
 * scaffolder never tries to produce finished craft.
 *
 * Everything here is PURE (string in, string out) so `scaffold.test.ts` can pin
 * the exact marker-carrying source; the CLI (`scaffold-cli.ts`) does the IO —
 * locate the experience, read `content.ts`, and write the two files.
 */
import type { SlotType } from '@enterprise-design/contracts';

/**
 * A string cap below this is uselessly tight (a real slot's copy varies), so the
 * proposed cap is floored here even when `ceil(len * 1.3)` is smaller. The floor
 * only bites for short shipped strings; longer ones scale by the 1.3 headroom.
 */
const STRING_CAP_FLOOR = 12;

/** The proposed char cap for a shipped string: 30% headroom, floored. Flagged for the author. */
function stringCap(value: string): number {
  return Math.max(STRING_CAP_FLOOR, Math.ceil(value.length * 1.3));
}

/** The proposed upper item bound for a shipped array: 30% headroom (never below 1). */
function arrayBound(length: number): number {
  return Math.max(1, Math.ceil(length * 1.3));
}

/**
 * Render a single value as an inline (one-line) Zod schema expression. Objects
 * and arrays recurse; every cap and bound carries an `AUTHOR:` marker; a value
 * whose type cannot be inferred (null / undefined) becomes a flagged `z.unknown()`.
 */
function renderValue(value: unknown): string {
  if (Array.isArray(value)) {
    if (value.length === 0) return 'z.array(z.unknown() /* AUTHOR: type me */)';
    const element = renderValue(value[0]);
    return `z.array(${element}).min(1).max(/* AUTHOR: bounds */ ${arrayBound(value.length)})`;
  }
  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).map(
      ([key, child]) => `${key}: ${renderValue(child)}`,
    );
    return `z.object({ ${entries.join(', ')} })`;
  }
  if (typeof value === 'string') return `z.string().min(1).max(/* AUTHOR: cap */ ${stringCap(value)})`;
  if (typeof value === 'number') return 'z.number()';
  if (typeof value === 'boolean') return 'z.boolean()';
  return 'z.unknown() /* AUTHOR: type me */';
}

/**
 * Propose a Zod object schema (as TS source text) for a shipped content shape.
 * The top-level object is rendered multi-line (one slot per line) so it drops
 * straight into a fill module; nested structures stay inline. The caller authors
 * every `AUTHOR:` marker before the world can certify.
 */
export function proposeFill(shape: unknown): string {
  if (shape === null || typeof shape !== 'object' || Array.isArray(shape)) {
    // Not an object shape — emit whatever the walker infers so the CLI still
    // produces a (flagged) starting point rather than nothing.
    return renderValue(shape);
  }
  const lines = Object.entries(shape as Record<string, unknown>).map(
    ([key, value]) => `  ${key}: ${renderValue(value)},`,
  );
  return `z.object({\n${lines.join('\n')}\n})`;
}

/* ------------------------------------------------------------------ */
/* Identifier casing                                                   */
/* ------------------------------------------------------------------ */

/** `the-line` -> `TheLine`. */
export function pascalCase(id: string): string {
  return id
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/** `the-line` -> `THE_LINE`. */
export function upperSnake(id: string): string {
  return id
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((part) => part.toUpperCase())
    .join('_');
}

/* ------------------------------------------------------------------ */
/* Section-slot skeleton                                               */
/* ------------------------------------------------------------------ */

/** The descriptor SlotType a shipped top-level value maps to for the skeleton. */
function slotTypeFor(value: unknown): SlotType {
  if (Array.isArray(value)) return 'items';
  if (typeof value === 'number') return 'number';
  return 'text';
}

/** The `limits` literal a shipped top-level value maps to for the skeleton. */
function slotLimitsFor(value: unknown): string {
  if (Array.isArray(value)) return `{ minItems: 1, maxItems: ${arrayBound(value.length)} }`;
  if (typeof value === 'string') return `{ maxChars: ${stringCap(value)} }`;
  return '{}';
}

/** One `SlotSpec` object literal (as source) per top-level field, guidance flagged. */
function proposeSlots(shape: Record<string, unknown>): string {
  return Object.entries(shape)
    .map(([name, value]) => {
      const type = slotTypeFor(value);
      const limits = slotLimitsFor(value);
      return `      { name: '${name}', type: '${type}', required: true, limits: ${limits}, guidance: 'AUTHOR: what this slot is for + e.g. example' },`;
    })
    .join('\n');
}

/* ------------------------------------------------------------------ */
/* File builders                                                       */
/* ------------------------------------------------------------------ */

export interface ScaffoldInputs {
  templateId: string;
  experienceId: string;
  shape: unknown;
}

/**
 * Build the `<template-id>-fill.ts` skeleton: the proposed fill schema, a single
 * `page` section listing every top-level slot, and the standard certifier
 * aliases (`FILL_SCHEMA`, `SECTIONS`). Every editorial decision is an `AUTHOR:`
 * marker, so the certifier refuses this file until it is authored.
 */
export function buildFillModule({ templateId, experienceId, shape }: ScaffoldInputs): string {
  const FillName = `${pascalCase(templateId)}Fill`;
  const SectionsName = `${upperSnake(templateId)}_SECTIONS`;
  const shapeObject =
    shape !== null && typeof shape === 'object' && !Array.isArray(shape)
      ? (shape as Record<string, unknown>)
      : {};

  return `/**
 * AUTHOR: fill schema for the "${templateId}" world-template (${experienceId}).
 *
 * Generated by \`scaffold-template\` as a SKELETON. Replace every AUTHOR: marker:
 * derive real char caps and item bounds from the shipped instance's magnitudes
 * (the proposed values are ceil(len * 1.3) placeholders), split the single
 * \`page\` section into the page's real regions, and write concrete guidance with
 * an \`e.g.\` drawn from the shipped content. The certifier REFUSES any surviving
 * AUTHOR: marker, so this scaffold cannot ship until it is finished.
 */
import { z } from 'zod';
import type { SectionSpec } from '@enterprise-design/contracts';

export const ${FillName} = ${proposeFill(shape)};
export type ${FillName} = z.infer<typeof ${FillName}>;

export const ${SectionsName}: SectionSpec[] = [
  {
    kind: 'page',
    purpose: 'AUTHOR: what this page/section is for (split into the real page regions).',
    repeats: { min: 1, max: 1 },
    slots: [
${proposeSlots(shapeObject)}
    ],
  },
];

/* Standard certifier aliases — resolved by convention, no per-world boilerplate. */
export const FILL_SCHEMA = ${FillName};
export const SECTIONS = ${SectionsName};
`;
}

/**
 * Build the `<experience-id>.worldtemplate.manifest.ts` skeleton: a descriptor
 * shell with the ids filled and the sections imported from the fill module, but
 * every craft/targeting field left as an `AUTHOR:` marker. The enum fields carry
 * a valid placeholder plus an inline `AUTHOR:` comment so the file both
 * typechecks and refuses certification until authored.
 */
export function buildManifest({ templateId, experienceId }: Omit<ScaffoldInputs, 'shape'>): string {
  const SectionsName = `${upperSnake(templateId)}_SECTIONS`;
  return `/**
 * AUTHOR: world-template descriptor for "${templateId}" (${experienceId}).
 *
 * Generated by \`scaffold-template\` as a SKELETON. Replace every AUTHOR: marker:
 * confirm the surface/style/mood/grammarId against the shipped experience
 * manifest, list the discriminating briefKeywords, and declare the craft rules
 * (the exactly-one flagged-anomaly rule + the required-nonempty provenance
 * notice). The certifier REFUSES any surviving AUTHOR: marker.
 */
import { WorldTemplateDescriptor } from '@enterprise-design/contracts';
import { ${SectionsName} } from './${templateId}-fill.js';

const descriptor: WorldTemplateDescriptor = WorldTemplateDescriptor.parse({
  schemaVersion: '1.1',
  id: '${templateId}',
  experienceId: '${experienceId}',
  surface: 'slide-deck', // AUTHOR: dashboard | project-page | slide-deck | personal-page | technical-explainer
  style: 'art-directed', // AUTHOR: art-directed | conventional
  mood: 'dark', // AUTHOR: light | dark | adaptive
  grammarId: 'AUTHOR: set the grammar id (match the shipped experience manifest)',
  audiences: ['mixed'], // AUTHOR: confirm audiences from the experience manifest
  businessIntents: ['AUTHOR: business intent(s) from the experience manifest'],
  briefKeywords: ['AUTHOR: 5-10 discriminating brief keywords'],
  componentsUsed: [], // AUTHOR: list the comp.* ids the template renders
  sections: ${SectionsName},
  guidance: ['AUTHOR: the craft guarantees the template makes (flagged anomaly, provenance notice, balanced grids)'],
  craftRules: [
    // AUTHOR: declare the exactly-one flagged-anomaly rule + the required-nonempty provenance-notice rule.
  ],
});

export default descriptor;
`;
}
