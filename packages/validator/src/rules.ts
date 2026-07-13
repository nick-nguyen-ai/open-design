import type {
  ComponentManifest,
  ComponentPlacement,
  DesignBlueprint,
  SectionBlueprint,
} from '@enterprise-design/contracts';
import type { FindingSeed, Rule } from './types.js';
import { isCostly, surfaceMotionCap } from './surface-rules.js';

/** Every placement in the blueprint (route sections + global), tagged with a stable path. */
function allPlacements(
  blueprint: DesignBlueprint,
): Array<{ placement: ComponentPlacement; section?: SectionBlueprint; path: string }> {
  const out: Array<{ placement: ComponentPlacement; section?: SectionBlueprint; path: string }> = [];
  blueprint.routes.forEach((route, ri) => {
    route.sections.forEach((section, si) => {
      section.componentPlacements.forEach((placement, pi) => {
        out.push({ placement, section, path: `routes[${ri}].sections[${si}].componentPlacements[${pi}]` });
      });
    });
  });
  blueprint.globalComponents.forEach((placement, gi) => {
    out.push({ placement, path: `globalComponents[${gi}]` });
  });
  return out;
}

const RAW_COLOUR = /(#[0-9a-fA-F]{3,8}\b)|(\b(?:rgb|rgba|hsl|hsla)\s*\()/;

const REG_001: Rule = {
  id: 'REG-001',
  domain: 'compatibility',
  baseSeverity: 'error',
  check(blueprint, registry) {
    const known = new Set(registry.components.map((c) => c.id));
    const findings: FindingSeed[] = [];
    for (const { placement, path } of allPlacements(blueprint)) {
      for (const [field, id] of [
        ['componentId', placement.componentId],
        ['fallbackComponentId', placement.fallbackComponentId],
      ] as const) {
        if (id && !known.has(id)) {
          findings.push({
            ruleId: 'REG-001',
            path: `${path}.${field}`,
            message: `Unknown component id "${id}" — not present in the registry.`,
            remediation: 'Reference a component that exists in the compiled registry.',
            componentIds: [id],
          });
        }
      }
    }
    return findings;
  },
};

const COMP_001: Rule = {
  id: 'COMP-001',
  domain: 'compatibility',
  baseSeverity: 'error',
  check(blueprint, registry) {
    const byId = new Map(registry.components.map((c) => [c.id, c]));
    const placed = allPlacements(blueprint)
      .map((p) => byId.get(p.placement.componentId))
      .filter((c): c is ComponentManifest => c !== undefined);
    const findings: FindingSeed[] = [];
    const seen = new Set<string>();
    for (const a of placed) {
      for (const b of placed) {
        if (a.id === b.id) continue;
        const key = [a.id, b.id].sort().join('|');
        if (seen.has(key)) continue;
        if (a.compatibility.conflictsWith.includes(b.id) || b.compatibility.conflictsWith.includes(a.id)) {
          seen.add(key);
          findings.push({
            ruleId: 'COMP-001',
            path: 'routes',
            message: `Components "${a.id}" and "${b.id}" declare an explicit conflict.`,
            remediation: 'Remove or substitute one of the conflicting components.',
            componentIds: [a.id, b.id],
          });
        }
      }
    }
    return findings;
  },
};

const COMP_002: Rule = {
  id: 'COMP-002',
  domain: 'compatibility',
  baseSeverity: 'error',
  check(blueprint, registry) {
    const byId = new Map(registry.components.map((c) => [c.id, c]));
    const placedIds = new Set(allPlacements(blueprint).map((p) => p.placement.componentId));
    const findings: FindingSeed[] = [];
    for (const id of placedIds) {
      const manifest = byId.get(id);
      if (!manifest) continue;
      const req = manifest.compatibility.requiresOneOf;
      if (req.length > 0 && !req.some((r) => placedIds.has(r))) {
        findings.push({
          ruleId: 'COMP-002',
          path: 'routes',
          message: `Component "${id}" requires one of [${req.join(', ')}] but none is placed.`,
          remediation: `Add one of the required companion components: ${req.join(', ')}.`,
          componentIds: [id, ...req],
        });
      }
    }
    return findings;
  },
};

const IA_001: Rule = {
  id: 'IA-001',
  domain: 'compatibility',
  baseSeverity: 'warning',
  check(blueprint) {
    const notes = [...blueprint.implementationNotes, ...blueprint.accessibilityStrategy.landmarkPlan]
      .join(' ')
      .toLowerCase();
    const hasBreadcrumb = notes.includes('breadcrumb');
    const findings: FindingSeed[] = [];
    blueprint.routes.forEach((route, ri) => {
      const depth = route.path.split('/').filter(Boolean).length;
      if (depth > 2 && !hasBreadcrumb) {
        findings.push({
          ruleId: 'IA-001',
          path: `routes[${ri}].path`,
          message: `Navigation depth ${depth} exceeds 2 without a breadcrumb/location indicator note.`,
          remediation: 'Add breadcrumbs or an equivalent location indicator, or flatten the route depth.',
          componentIds: [],
        });
      }
    });
    return findings;
  },
};

const IA_002: Rule = {
  id: 'IA-002',
  domain: 'compatibility',
  baseSeverity: 'error',
  check(blueprint) {
    const findings: FindingSeed[] = [];
    blueprint.routes.forEach((route, ri) => {
      route.sections.forEach((section, si) => {
        const dominant = section.componentPlacements.filter((p) => p.role === 'primary-visual');
        if (dominant.length > 1) {
          findings.push({
            ruleId: 'IA-002',
            path: `routes[${ri}].sections[${si}]`,
            message: `Section "${section.id}" has ${dominant.length} dominant (primary-visual) components; at most one is allowed per viewport.`,
            remediation: 'Demote all but one primary visual to secondary-visual, or split into separate sections.',
            componentIds: dominant.map((p) => p.componentId),
          });
        }
      });
    });
    return findings;
  },
};

const CONTENT_001: Rule = {
  id: 'CONTENT-001',
  domain: 'contentCoverage',
  baseSeverity: 'error',
  check(blueprint) {
    const findings: FindingSeed[] = [];
    const flag = (value: string, path: string) => {
      if (value.startsWith('missing:')) {
        findings.push({
          ruleId: 'CONTENT-001',
          path,
          message: `Required content is unmapped: "${value}".`,
          remediation: 'Supply the missing content or map the slot to an available content-pack path.',
          componentIds: [],
        });
      }
    };
    blueprint.routes.forEach((route, ri) => {
      route.sections.forEach((section, si) => {
        Object.entries(section.contentMapping).forEach(([k, v]) =>
          flag(v, `routes[${ri}].sections[${si}].contentMapping.${k}`),
        );
        section.componentPlacements.forEach((placement, pi) => {
          Object.entries(placement.propsMapping).forEach(([k, v]) =>
            flag(v, `routes[${ri}].sections[${si}].componentPlacements[${pi}].propsMapping.${k}`),
          );
        });
      });
    });
    return findings;
  },
};

const A11Y_001: Rule = {
  id: 'A11Y-001',
  domain: 'accessibility',
  baseSeverity: 'error',
  check(blueprint) {
    const equivalents = blueprint.accessibilityStrategy.chartEquivalents;
    const findings: FindingSeed[] = [];
    blueprint.routes.forEach((route, ri) => {
      route.sections.forEach((section, si) => {
        section.componentPlacements.forEach((placement, pi) => {
          if (placement.role === 'primary-visual' && !(placement.region in equivalents)) {
            findings.push({
              ruleId: 'A11Y-001',
              path: `routes[${ri}].sections[${si}].componentPlacements[${pi}]`,
              message: `Primary visual "${placement.componentId}" at region "${placement.region}" has no textual/chart equivalent.`,
              remediation: 'Add a chartEquivalents entry keyed by the placement region describing the accessible equivalent.',
              componentIds: [placement.componentId],
            });
          }
        });
      });
    });
    return findings;
  },
};

const A11Y_002: Rule = {
  id: 'A11Y-002',
  domain: 'accessibility',
  baseSeverity: 'warning',
  check(blueprint) {
    const findings: FindingSeed[] = [];
    blueprint.routes.forEach((route, ri) => {
      route.sections.forEach((section, si) => {
        const seq = section.motionSequence;
        if (seq && seq.reducedMotionVariant.trim().length === 0) {
          findings.push({
            ruleId: 'A11Y-002',
            path: `routes[${ri}].sections[${si}].motionSequence.reducedMotionVariant`,
            message: `Motion sequence "${seq.sequenceId}" has no reduced-motion fallback.`,
            remediation: 'Provide a non-empty reducedMotionVariant describing the reduced-motion rendering.',
            componentIds: [],
          });
        }
      });
    });
    return findings;
  },
};

const MOTION_001: Rule = {
  id: 'MOTION-001',
  domain: 'compatibility',
  baseSeverity: 'warning',
  check(blueprint) {
    const cap = surfaceMotionCap(blueprint.surface);
    if (blueprint.motionLevel > cap) {
      return [
        {
          ruleId: 'MOTION-001',
          path: 'motionLevel',
          message: `Motion level ${blueprint.motionLevel} exceeds the ${blueprint.surface} cap of ${cap}.`,
          remediation: `Reduce motionLevel to ${cap} or lower for this surface.`,
          componentIds: [],
        },
      ];
    }
    return [];
  },
};

const MOTION_002: Rule = {
  id: 'MOTION-002',
  domain: 'compatibility',
  baseSeverity: 'error',
  check(blueprint, registry) {
    const signatureIds = new Set(registry.motionSequences.map((m) => m.sequenceId));
    let count = 0;
    for (const route of blueprint.routes) {
      for (const section of route.sections) {
        if (section.motionSequence && signatureIds.has(section.motionSequence.sequenceId)) count += 1;
      }
    }
    if (count !== 1) {
      return [
        {
          ruleId: 'MOTION-002',
          path: 'routes',
          message: `Blueprint declares ${count} signature motion sequences; exactly one is required.`,
          remediation: 'Attach exactly one signature motion sequence to the blueprint.',
          componentIds: [],
        },
      ];
    }
    return [];
  },
};

const PERF_001: Rule = {
  id: 'PERF-001',
  domain: 'performance',
  baseSeverity: 'warning',
  check(blueprint, registry) {
    const byId = new Map(registry.components.map((c) => [c.id, c]));
    const findings: FindingSeed[] = [];
    blueprint.routes.forEach((route, ri) => {
      route.sections.forEach((section, si) => {
        const costly = section.componentPlacements
          .map((p) => byId.get(p.componentId))
          .filter((c): c is ComponentManifest => c !== undefined && isCostly(c));
        if (costly.length > 2) {
          findings.push({
            ruleId: 'PERF-001',
            path: `routes[${ri}].sections[${si}]`,
            message: `Section "${section.id}" renders ${costly.length} high-cost visuals simultaneously (max 2).`,
            remediation: 'Reduce to at most two high-cost visuals per viewport, lazy-load, or split sections.',
            componentIds: costly.map((c) => c.id),
          });
        }
      });
    });
    return findings;
  },
};

const CORP_001: Rule = {
  id: 'CORP-001',
  domain: 'corporateSuitability',
  baseSeverity: 'warning',
  check(blueprint, registry) {
    const restricted = blueprint.implementationNotes.some((n) => n.trim() === 'corporate-mode:restricted');
    if (!restricted) return [];
    const byId = new Map(registry.components.map((c) => [c.id, c]));
    const findings: FindingSeed[] = [];
    for (const { placement, path } of allPlacements(blueprint)) {
      const manifest = byId.get(placement.componentId);
      if (manifest && !manifest.corporateSuitability.includes('restricted')) {
        findings.push({
          ruleId: 'CORP-001',
          path,
          message: `Component "${manifest.id}" is not suitable in restricted corporate mode (suitability: ${manifest.corporateSuitability.join(', ')}).`,
          remediation: 'Substitute a restricted-safe component or relax the corporate mode with a waiver.',
          componentIds: [manifest.id],
        });
      }
    }
    return findings;
  },
};

const THEME_001: Rule = {
  id: 'THEME-001',
  domain: 'corporateSuitability',
  baseSeverity: 'error',
  check(blueprint) {
    const findings: FindingSeed[] = [];
    const scan = (group: Record<string, string> | undefined, label: string) => {
      if (!group) return;
      for (const [key, value] of Object.entries(group)) {
        if (RAW_COLOUR.test(value)) {
          findings.push({
            ruleId: 'THEME-001',
            path: `tokens.${label}.${key}`,
            message: `Token override "${key}" uses a raw colour value "${value}"; only semantic token names are allowed.`,
            remediation: 'Replace the raw value with a semantic token name (e.g. --surface-raised).',
            componentIds: [],
          });
        }
      }
    };
    scan(blueprint.tokens.colour, 'colour');
    scan(blueprint.tokens.typography, 'typography');
    return findings;
  },
};

/** All rules except SCHEMA-001 (which the runner applies first as a hard gate). */
export const RULES: Rule[] = [
  REG_001,
  COMP_001,
  COMP_002,
  IA_001,
  IA_002,
  CONTENT_001,
  A11Y_001,
  A11Y_002,
  MOTION_001,
  MOTION_002,
  PERF_001,
  CORP_001,
  THEME_001,
];
