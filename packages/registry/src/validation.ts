import type { DiscoveredManifests } from './discovery.js';
import type { Diagnostic } from './types.js';

/**
 * Cross-manifest validation rules (the subset locked by the task brief). Each
 * rule appends structured {@link Diagnostic}s; schema-level violations are
 * already surfaced during discovery as `SCHEMA_INVALID`. Rules never throw.
 */
export function runValidationRules(manifests: DiscoveredManifests, diagnostics: Diagnostic[]): void {
  regDuplicateId(manifests, diagnostics);
  regUnknownReference(manifests, diagnostics);
  compConflictSymmetry(manifests, diagnostics);
  a11yReducedMotion(manifests, diagnostics);
  provProvenance(manifests, diagnostics);
  searchEmptyText(manifests, diagnostics);
  approvalForExperiences(manifests, diagnostics);
  worldTemplateReferences(manifests, diagnostics);
}

/** REG_DUPLICATE_ID: no two manifests of any kind may share an id. */
function regDuplicateId(manifests: DiscoveredManifests, diagnostics: Diagnostic[]): void {
  const byId = new Map<string, string[]>();
  const record = (id: string, path: string): void => {
    const paths = byId.get(id);
    if (paths) paths.push(path);
    else byId.set(id, [path]);
  };
  for (const { manifest, path } of manifests.components) record(manifest.id, path);
  for (const { manifest, path } of manifests.experiences) record(manifest.id, path);
  for (const { manifest, path } of manifests.grammars) record(manifest.id, path);
  for (const { manifest, path } of manifests.motionSequences) record(manifest.sequenceId, path);

  for (const [id, paths] of byId) {
    if (paths.length > 1) {
      diagnostics.push({
        ruleId: 'REG_DUPLICATE_ID',
        severity: 'error',
        message: `Duplicate id "${id}" declared by ${paths.length} manifests: ${paths.join(', ')}`,
        entityId: id,
      });
    }
  }
}

/** REG_UNKNOWN_REFERENCE: experience grammarId / signatureSequence / componentsUsed must resolve. */
function regUnknownReference(manifests: DiscoveredManifests, diagnostics: Diagnostic[]): void {
  const componentIds = new Set(manifests.components.map((c) => c.manifest.id));
  const grammarIds = new Set(manifests.grammars.map((g) => g.manifest.id));
  const motionIds = new Set(manifests.motionSequences.map((m) => m.manifest.sequenceId));

  for (const { manifest, path } of manifests.experiences) {
    if (!grammarIds.has(manifest.grammarId)) {
      diagnostics.push({
        ruleId: 'REG_UNKNOWN_REFERENCE',
        severity: 'error',
        message: `Experience "${manifest.id}" references unknown grammarId "${manifest.grammarId}"`,
        entityId: manifest.id,
        path,
      });
    }
    if (!motionIds.has(manifest.signatureSequence)) {
      diagnostics.push({
        ruleId: 'REG_UNKNOWN_REFERENCE',
        severity: 'error',
        message: `Experience "${manifest.id}" references unknown signatureSequence "${manifest.signatureSequence}"`,
        entityId: manifest.id,
        path,
      });
    }
    for (const componentId of manifest.componentsUsed) {
      if (!componentIds.has(componentId)) {
        diagnostics.push({
          ruleId: 'REG_UNKNOWN_REFERENCE',
          severity: 'error',
          message: `Experience "${manifest.id}" references unknown component "${componentId}"`,
          entityId: manifest.id,
          path,
        });
      }
    }
  }
}

/** COMP_SYMMETRY: conflictsWith must be mutual (worksWellWith may be asymmetric). */
function compConflictSymmetry(manifests: DiscoveredManifests, diagnostics: Diagnostic[]): void {
  const conflicts = new Map<string, Set<string>>();
  const pathById = new Map<string, string>();
  for (const { manifest, path } of manifests.components) {
    conflicts.set(manifest.id, new Set(manifest.compatibility.conflictsWith));
    pathById.set(manifest.id, path);
  }

  for (const [id, targets] of conflicts) {
    for (const other of targets) {
      const otherSet = conflicts.get(other);
      // Only enforce symmetry against known components; unknown ids are a
      // separate concern (not required by the locked rule subset).
      if (otherSet && !otherSet.has(id)) {
        diagnostics.push({
          ruleId: 'COMP_SYMMETRY',
          severity: 'error',
          message: `Component "${id}" lists "${other}" in conflictsWith, but "${other}" does not list "${id}" back (conflicts must be symmetric)`,
          entityId: id,
          path: pathById.get(id),
        });
      }
    }
  }
}

/** A11Y_REDUCED_MOTION: any component with motionLevel > 0 must declare reducedMotion. */
function a11yReducedMotion(manifests: DiscoveredManifests, diagnostics: Diagnostic[]): void {
  for (const { manifest, path } of manifests.components) {
    if (manifest.motionLevel > 0 && manifest.accessibility.reducedMotion !== true) {
      diagnostics.push({
        ruleId: 'A11Y_REDUCED_MOTION',
        severity: 'error',
        message: `Component "${manifest.id}" has motionLevel ${manifest.motionLevel} but accessibility.reducedMotion is not true`,
        entityId: manifest.id,
        path,
      });
    }
  }
}

/** PROV_PROVENANCE: an approved component must have reviewed licence + a review record. */
function provProvenance(manifests: DiscoveredManifests, diagnostics: Diagnostic[]): void {
  for (const { manifest, path } of manifests.components) {
    if (manifest.approval.state !== 'approved') continue;
    const licenceOk = manifest.provenance.licenceReviewed === true;
    const recordOk = manifest.provenance.reviewRecord.trim().length > 0;
    if (!licenceOk || !recordOk) {
      diagnostics.push({
        ruleId: 'PROV_PROVENANCE',
        severity: 'error',
        message: `Approved component "${manifest.id}" must have provenance.licenceReviewed=true and a non-empty provenance.reviewRecord`,
        entityId: manifest.id,
        path,
      });
    }
  }
}

/** SEARCH_EMPTY_TEXT: searchText must contain non-whitespace (schema only enforces min length 1). */
function searchEmptyText(manifests: DiscoveredManifests, diagnostics: Diagnostic[]): void {
  const check = (id: string, searchText: string, path: string): void => {
    if (searchText.trim().length === 0) {
      diagnostics.push({
        ruleId: 'SEARCH_EMPTY_TEXT',
        severity: 'error',
        message: `"${id}" has an empty (whitespace-only) searchText`,
        entityId: id,
        path,
      });
    }
  };
  for (const { manifest, path } of manifests.components) check(manifest.id, manifest.searchText, path);
  for (const { manifest, path } of manifests.experiences) check(manifest.id, manifest.searchText, path);
}

/**
 * WT_UNKNOWN_REFERENCE: a world-template descriptor's experienceId, grammarId,
 * and every componentsUsed id must resolve to a real manifest — the template
 * carries a shipped world's craft, so its references must exist.
 */
function worldTemplateReferences(manifests: DiscoveredManifests, diagnostics: Diagnostic[]): void {
  const componentIds = new Set(manifests.components.map((c) => c.manifest.id));
  const grammarIds = new Set(manifests.grammars.map((g) => g.manifest.id));
  const experienceIds = new Set(manifests.experiences.map((e) => e.manifest.id));

  for (const { manifest, path } of manifests.worldTemplates) {
    if (!experienceIds.has(manifest.experienceId)) {
      diagnostics.push({
        ruleId: 'WT_UNKNOWN_REFERENCE',
        severity: 'error',
        message: `World-template "${manifest.id}" references unknown experienceId "${manifest.experienceId}"`,
        entityId: manifest.id,
        path,
      });
    }
    if (!grammarIds.has(manifest.grammarId)) {
      diagnostics.push({
        ruleId: 'WT_UNKNOWN_REFERENCE',
        severity: 'error',
        message: `World-template "${manifest.id}" references unknown grammarId "${manifest.grammarId}"`,
        entityId: manifest.id,
        path,
      });
    }
    for (const componentId of manifest.componentsUsed) {
      if (!componentIds.has(componentId)) {
        diagnostics.push({
          ruleId: 'WT_UNKNOWN_REFERENCE',
          severity: 'error',
          message: `World-template "${manifest.id}" references unknown component "${componentId}"`,
          entityId: manifest.id,
          path,
        });
      }
    }
  }
}

/** APPROVAL: an approved experience referencing a not-yet-approved component → warning. */
function approvalForExperiences(manifests: DiscoveredManifests, diagnostics: Diagnostic[]): void {
  const componentApproval = new Map(
    manifests.components.map((c) => [c.manifest.id, c.manifest.approval.state]),
  );
  for (const { manifest, path } of manifests.experiences) {
    if (manifest.approval.state !== 'approved') continue;
    for (const componentId of manifest.componentsUsed) {
      const state = componentApproval.get(componentId);
      // Unknown components are reported by REG_UNKNOWN_REFERENCE; skip them here.
      if (state !== undefined && state !== 'approved') {
        diagnostics.push({
          ruleId: 'APPROVAL',
          severity: 'warning',
          message: `Approved experience "${manifest.id}" uses component "${componentId}" whose approval.state is "${state}" (not approved)`,
          entityId: manifest.id,
          path,
        });
      }
    }
  }
}
