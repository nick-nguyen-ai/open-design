import type { ComponentManifest, CompositionRole } from '@enterprise-design/contracts';
import type { CompatibilityGraphData, CompatibilityNode } from './types.js';
import { sortBy } from './util.js';

/**
 * Build the serialisable compatibility graph from each component's
 * `CompatibilityManifest`. Nodes are sorted by id so `compatibility.json` is
 * deterministic.
 */
export function buildCompatibilityGraph(components: ComponentManifest[]): CompatibilityGraphData {
  const nodes: CompatibilityNode[] = components.map((component) => {
    const { compatibility } = component;
    const node: CompatibilityNode = {
      id: component.id,
      worksWellWith: [...compatibility.worksWellWith],
      conflictsWith: [...compatibility.conflictsWith],
      requiresOneOf: [...compatibility.requiresOneOf],
      compositionRoles: [...compatibility.compositionRoles],
    };
    if (compatibility.maxInstancesPerViewport !== undefined) {
      node.maxInstancesPerViewport = compatibility.maxInstancesPerViewport;
    }
    return node;
  });
  return { nodes: sortBy(nodes, (node) => node.id) };
}

/** In-memory query API over a {@link CompatibilityGraphData}. */
export class CompatibilityGraph {
  private readonly nodes: Map<string, CompatibilityNode>;

  constructor(data: CompatibilityGraphData) {
    this.nodes = new Map(data.nodes.map((node) => [node.id, node]));
  }

  has(id: string): boolean {
    return this.nodes.has(id);
  }

  worksWellWith(id: string): string[] {
    return this.nodes.get(id)?.worksWellWith ?? [];
  }

  conflictsFor(id: string): string[] {
    return this.nodes.get(id)?.conflictsWith ?? [];
  }

  requiresOneOf(id: string): string[] {
    return this.nodes.get(id)?.requiresOneOf ?? [];
  }

  rolesFor(id: string): CompositionRole[] {
    return this.nodes.get(id)?.compositionRoles ?? [];
  }

  maxInstancesFor(id: string): number | undefined {
    return this.nodes.get(id)?.maxInstancesPerViewport;
  }
}
