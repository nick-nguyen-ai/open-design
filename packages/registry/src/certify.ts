/**
 * The data-driven world-template CERTIFIER (Task 5).
 *
 * Given a `*.worldtemplate.manifest.ts` path, {@link certifyWorld} proves the
 * whole world is safe to ship — with ZERO per-world test boilerplate — by
 * resolving the world's contract entirely by convention:
 *
 *   - the manifest's default export is a valid {@link WorldTemplateDescriptor};
 *   - the sibling `<id>-fill.ts` exports `FILL_SCHEMA` (a Zod schema) and
 *     `SECTIONS` that are in LOCKSTEP with `descriptor.sections`;
 *   - the sibling `content.ts` exports `SHIPPED_FILL`, and it parses against
 *     `FILL_SCHEMA` (`shipped-parses`);
 *   - every descriptor slot path resolves in the shipped fill (`slot-resolves`)
 *     and every top-level fill field is advertised by a slot (`lockstep`);
 *   - the shipped fill honours every slot limit and craft rule (`craft-holds`);
 *   - no editorial text is hardcoded in the world's single `*Template.tsx`
 *     (`leak`) — chrome may be declared in a sibling `leak-allowlist.json`;
 *   - no `AUTHOR:` markers survive in the fill or manifest source
 *     (`author-marker`).
 *
 * Every finding is a plain, serializable record; a safe template yields `[]`.
 * The vitest suite asserts zero findings per discovered template and the CLI
 * (`certify-cli.ts`) prints them and exits non-zero.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  WorldTemplateDescriptor,
  SectionSpec,
  evaluateCraftRule,
  resolveFillPath,
  type SlotSpec,
} from '@enterprise-design/contracts';
import { z } from 'zod';

export type CertCheck =
  | 'lockstep'
  | 'shipped-parses'
  | 'slot-resolves'
  | 'craft-holds'
  | 'leak'
  | 'author-marker';

export interface CertFinding {
  templateId: string;
  check: CertCheck;
  message: string;
}

/** A Zod-schema-shaped export (only the surface the certifier needs). */
interface ParseLike {
  safeParse(value: unknown): { success: boolean };
}

function isParseLike(value: unknown): value is ParseLike {
  return typeof value === 'object' && value !== null && typeof (value as ParseLike).safeParse === 'function';
}

/** Recursively sort object keys so two structurally-equal trees stringify identically. */
function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value !== null && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      out[key] = canonicalize((value as Record<string, unknown>)[key]);
    }
    return out;
  }
  return value;
}

/** Key-order-insensitive deep-equality by canonical JSON (zod reorders keys to schema order). */
function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(canonicalize(a)) === JSON.stringify(canonicalize(b));
}

async function importModule(file: string): Promise<Record<string, unknown>> {
  return (await import(/* @vite-ignore */ pathToFileURL(file).href)) as Record<string, unknown>;
}

/** The allowed-chrome list is an array of strings or `{ text, reason }` records. */
function readAllowlist(dir: string): string[] {
  const file = path.join(dir, 'leak-allowlist.json');
  if (!fs.existsSync(file)) return [];
  const parsed: unknown = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!Array.isArray(parsed)) return [];
  return parsed
    .map((entry) => (typeof entry === 'string' ? entry : (entry as { text?: unknown }).text))
    .filter((text): text is string => typeof text === 'string');
}

/** Mirror `validate-fill.checkSlot` limit semantics against a concrete value. */
function slotLimitViolations(slot: SlotSpec, value: unknown): string[] {
  const out: string[] = [];
  if (value === undefined || value === null) return out; // resolution is a separate check
  const { maxChars, minItems, maxItems } = slot.limits;

  if (maxChars !== undefined) {
    if (typeof value === 'string') {
      if (value.length > maxChars) out.push(`"${slot.name}" is ${value.length} chars; cap is ${maxChars}.`);
    } else if (Array.isArray(value)) {
      value.forEach((el, i) => {
        if (typeof el === 'string' && el.length > maxChars) {
          out.push(`"${slot.name}[${i}]" is ${el.length} chars; cap is ${maxChars}.`);
        }
      });
    }
  }
  if (Array.isArray(value)) {
    if (minItems !== undefined && value.length < minItems) {
      out.push(`"${slot.name}" has ${value.length} item(s); minimum is ${minItems}.`);
    }
    if (maxItems !== undefined && value.length > maxItems) {
      out.push(`"${slot.name}" has ${value.length} item(s); maximum is ${maxItems}.`);
    }
  }
  return out;
}

/** A descriptor slot name with any trailing `[]` stripped to a plain dot-path. */
function slotPath(name: string): string {
  return name.replace(/\[\]$/, '');
}

/**
 * Extract candidate JSX text nodes from a template source. The brief's regex
 * captures the run between a `>` and the next `<`; because that run can span the
 * `);\n\n case 'x': return (` boundary between two sibling JSX returns, we drop
 * any candidate containing a newline — genuine single-line text nodes never do,
 * while every such code fragment does. Candidates with ≥4 words or ≥25 chars are
 * the ones substantial enough to be an editorial leak.
 */
function leakCandidates(templateSource: string): string[] {
  const re = />\s*([^<>{}\n][^<>{}]*)</g;
  const seen = new Set<string>();
  const out: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = re.exec(templateSource)) !== null) {
    const raw = match[1];
    if (raw === undefined || raw.includes('\n')) continue; // a code fragment between two returns, not a text node
    const candidate = raw.trim();
    if (!candidate) continue;
    const words = candidate.split(/\s+/).length;
    if (words < 4 && candidate.length < 25) continue;
    if (seen.has(candidate)) continue;
    seen.add(candidate);
    out.push(candidate);
  }
  return out;
}

/**
 * Certify a single world-template. Returns every finding; an empty array means
 * the world is safe. Never throws for a template-authoring mistake — the mistake
 * becomes a finding.
 */
export async function certifyWorld(manifestPath: string): Promise<CertFinding[]> {
  const findings: CertFinding[] = [];
  const dir = path.dirname(manifestPath);

  // --- The descriptor ------------------------------------------------------
  let rawId = path.basename(manifestPath);
  let descriptor: WorldTemplateDescriptor | undefined;
  try {
    const mod = await importModule(manifestPath);
    const parsed = WorldTemplateDescriptor.safeParse(mod.default);
    if (typeof (mod.default as { id?: unknown })?.id === 'string') rawId = (mod.default as { id: string }).id;
    if (!parsed.success) {
      findings.push({
        templateId: rawId,
        check: 'lockstep',
        message: `Manifest default export is not a valid WorldTemplateDescriptor: ${parsed.error.issues
          .map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
          .join('; ')}`,
      });
      return findings;
    }
    descriptor = parsed.data;
  } catch (error) {
    findings.push({ templateId: rawId, check: 'lockstep', message: `Failed to import manifest: ${(error as Error).message}` });
    return findings;
  }
  const templateId = descriptor.id;

  // --- The fill module -----------------------------------------------------
  const fillPath = path.join(dir, `${templateId}-fill.ts`);
  let fillSchema: ParseLike | undefined;
  let sections: unknown;
  try {
    const fillMod = await importModule(fillPath);
    if (!isParseLike(fillMod.FILL_SCHEMA)) {
      findings.push({ templateId, check: 'lockstep', message: `${templateId}-fill.ts must export FILL_SCHEMA (a Zod schema with .safeParse).` });
    } else {
      fillSchema = fillMod.FILL_SCHEMA;
    }
    if (fillMod.SECTIONS === undefined) {
      findings.push({ templateId, check: 'lockstep', message: `${templateId}-fill.ts must export SECTIONS.` });
    } else {
      sections = fillMod.SECTIONS;
    }
  } catch (error) {
    findings.push({ templateId, check: 'lockstep', message: `Failed to import ${templateId}-fill.ts: ${(error as Error).message}` });
  }

  // Lockstep: the exported SECTIONS deep-equal the descriptor's sections. Both
  // are normalized through canonical JSON because zod reorders object keys to
  // schema order on parse, so a raw literal and a parsed tree differ only there.
  if (sections !== undefined && !deepEqual(sections, descriptor.sections)) {
    // A parse of SECTIONS mismatch is either a real divergence or (harmlessly)
    // key order — canonicalization already ruled the latter out, so report it.
    const normalized = z.array(SectionSpec).safeParse(sections);
    if (!normalized.success) {
      findings.push({ templateId, check: 'lockstep', message: `Exported SECTIONS is not a valid SectionSpec[]: ${normalized.error.issues.map((i) => i.message).join('; ')}` });
    } else if (!deepEqual(normalized.data, descriptor.sections)) {
      findings.push({ templateId, check: 'lockstep', message: 'Exported SECTIONS is not in lockstep with descriptor.sections (they describe different slots).' });
    }
  }

  // --- The shipped fill ----------------------------------------------------
  const contentPath = path.join(dir, 'content.ts');
  let shippedFill: unknown;
  try {
    const contentMod = await importModule(contentPath);
    if (contentMod.SHIPPED_FILL === undefined) {
      findings.push({ templateId, check: 'shipped-parses', message: 'content.ts must export SHIPPED_FILL (the shipped fill instance).' });
    } else {
      shippedFill = contentMod.SHIPPED_FILL;
    }
  } catch (error) {
    findings.push({ templateId, check: 'shipped-parses', message: `Failed to import content.ts: ${(error as Error).message}` });
  }

  if (shippedFill !== undefined && fillSchema && !fillSchema.safeParse(shippedFill).success) {
    findings.push({ templateId, check: 'shipped-parses', message: 'SHIPPED_FILL does not parse against FILL_SCHEMA.' });
  }

  // --- Lockstep both directions + slot resolution + craft/limits -----------
  if (shippedFill !== undefined) {
    const slots: SlotSpec[] = descriptor.sections.flatMap((section) => section.slots);
    const slotPaths = slots.map((slot) => slotPath(slot.name));

    // Every descriptor slot resolves to a present value in the shipped fill.
    for (const slot of slots) {
      const resolved = resolveFillPath(shippedFill, slotPath(slot.name));
      if (resolved === undefined) {
        findings.push({ templateId, check: 'slot-resolves', message: `Slot "${slot.name}" does not resolve in SHIPPED_FILL.` });
      } else {
        for (const violation of slotLimitViolations(slot, resolved)) {
          findings.push({ templateId, check: 'craft-holds', message: `Slot limit violated: ${violation}` });
        }
      }
    }

    // Every top-level fill field is advertised by at least one slot path.
    if (shippedFill !== null && typeof shippedFill === 'object' && !Array.isArray(shippedFill)) {
      for (const key of Object.keys(shippedFill as Record<string, unknown>)) {
        const advertised = slotPaths.some((p) => p === key || p.startsWith(`${key}.`));
        if (!advertised) {
          findings.push({ templateId, check: 'lockstep', message: `Fill field "${key}" is not advertised by any descriptor slot (unslotted fill field).` });
        }
      }
    }

    // The declared craft rules hold against the shipped fill.
    for (const rule of descriptor.craftRules) {
      if (!evaluateCraftRule(rule, shippedFill)) {
        findings.push({ templateId, check: 'craft-holds', message: `Craft rule (${rule.kind} at "${rule.path}") does not hold for SHIPPED_FILL.` });
      }
    }
  }

  // --- Leak scan -----------------------------------------------------------
  const templateFiles = fs.readdirSync(dir).filter((name) => name.endsWith('Template.tsx'));
  const soleTemplate = templateFiles[0];
  if (templateFiles.length !== 1 || soleTemplate === undefined) {
    findings.push({ templateId, check: 'leak', message: `Expected exactly one *Template.tsx in ${path.basename(dir)}; found ${templateFiles.length}.` });
  } else if (shippedFill !== undefined) {
    const templateSource = fs.readFileSync(path.join(dir, soleTemplate), 'utf8');
    const fillJson = JSON.stringify(shippedFill);
    const allowlist = readAllowlist(dir);
    for (const candidate of leakCandidates(templateSource)) {
      if (fillJson.includes(candidate)) continue;
      if (allowlist.includes(candidate)) continue;
      findings.push({
        templateId,
        check: 'leak',
        message: `Hardcoded template text is neither in SHIPPED_FILL nor allowlisted: ${JSON.stringify(candidate)}`,
      });
    }
  }

  // --- Author markers ------------------------------------------------------
  for (const source of [fillPath, manifestPath]) {
    if (fs.existsSync(source) && fs.readFileSync(source, 'utf8').includes('AUTHOR:')) {
      findings.push({ templateId, check: 'author-marker', message: `Source ${path.basename(source)} contains an "AUTHOR:" marker.` });
    }
  }

  return findings;
}
