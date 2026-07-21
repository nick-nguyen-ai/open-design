/**
 * Deterministic sample data for live component previews on the component
 * explorer/detail routes. Frozen fixtures keep the previews (and their
 * Playwright smoke) stable — no random values, no live data.
 */
import type { ComponentType, ReactNode } from 'react';
import { KpiTile, StatusList } from '@enterprise-design/content-components';
import { CategoryBarChart, TrendChart } from '@enterprise-design/data-viz';
import { FlowDiagram } from '@enterprise-design/diagrams';
import * as Collections from '@enterprise-design/diagram-collections';
import '@enterprise-design/diagram-collections/styles.css';
import {
  CELLS_FIXTURE,
  COMPARE_FIXTURE,
  CYCLE_FIXTURE,
  FLOW_FIXTURE,
  LAYERS_FIXTURE,
  SEQUENCE_FIXTURE,
  TIMELINE_FIXTURE,
  ZONES_FIXTURE,
} from '@enterprise-design/diagram-grammar';

export const PREVIEWABLE_COMPONENT_IDS = [
  'comp.kpi-tile',
  'comp.trend-chart',
  'comp.category-bar-chart',
  'comp.status-list',
  'comp.flow-diagram',
] as const;

function KpiPreview() {
  return (
    <KpiTile
      title="Portfolio KPIs"
      metrics={[
        { id: 'exposure', label: 'Model exposure', value: 0.62, unit: 'ratio', delta: -0.04, deltaGoodDirection: 'down', status: 'on-track' },
        { id: 'breaches', label: 'Open breaches', value: 3, unit: 'count', delta: 0.5, deltaGoodDirection: 'down', status: 'at-risk' },
        { id: 'coverage', label: 'Control coverage', value: 0.94, unit: 'percent', target: 0.95, delta: 0.02, status: 'on-track' },
      ]}
    />
  );
}

function TrendPreview() {
  return (
    <TrendChart
      title="Risk posture over time"
      unit="index"
      variant="area"
      showAverageLine
      series={[
        {
          id: 'posture',
          label: 'Composite risk index',
          points: [
            { x: '2026-01', y: 72 },
            { x: '2026-02', y: 68 },
            { x: '2026-03', y: 74 },
            { x: '2026-04', y: 66 },
            { x: '2026-05', y: 61 },
            { x: '2026-06', y: 58 },
          ],
        },
      ]}
    />
  );
}

function CategoryBarPreview() {
  return (
    <CategoryBarChart
      title="Findings by severity"
      unit="findings"
      data={[
        { id: 'critical', category: 'Critical', value: 4, target: 2 },
        { id: 'high', category: 'High', value: 11, target: 8 },
        { id: 'medium', category: 'Medium', value: 23 },
        { id: 'low', category: 'Low', value: 39 },
      ]}
    />
  );
}

function StatusPreview() {
  return (
    <StatusList
      title="Remediation status"
      items={[
        { id: 'a', label: 'Model documentation refresh', status: 'success', description: 'Signed off by validation.' },
        { id: 'b', label: 'Challenger model benchmark', status: 'warning', description: 'In review — due this week.' },
        { id: 'c', label: 'Data lineage attestation', status: 'danger', description: 'Blocked on upstream owner.' },
        { id: 'd', label: 'Bias testing rerun', status: 'info', description: 'Scheduled for next cycle.' },
      ]}
    />
  );
}

function FlowPreview() {
  return (
    <FlowDiagram
      title="Model approval flow"
      data={{
        nodes: [
          { id: 'intake', label: 'Intake', kind: 'start' },
          { id: 'validate', label: 'Validation', kind: 'process' },
          { id: 'gate', label: 'Risk gate', kind: 'decision' },
          { id: 'deploy', label: 'Deploy', kind: 'process' },
          { id: 'monitor', label: 'Monitor', kind: 'end' },
        ],
        edges: [
          { id: 'e1', from: 'intake', to: 'validate' },
          { id: 'e2', from: 'validate', to: 'gate' },
          { id: 'e3', from: 'gate', to: 'deploy', label: 'pass' },
          { id: 'e4', from: 'deploy', to: 'monitor' },
        ],
      }}
    />
  );
}

/**
 * The 40 diagram-collection components are 5 visual families × 8 diagram
 * kinds, every renderer taking the same `{ spec }` prop — so their previews
 * are generated from this table using the grammar's canonical fixtures
 * (the same specs the collections' own tests render).
 */
const DGM_FAMILIES = ['blueprint', 'circuit', 'gazette', 'isometric', 'sketchnote'] as const;

const DGM_KIND_SPECS = {
  cells: CELLS_FIXTURE,
  compare: COMPARE_FIXTURE,
  cycle: CYCLE_FIXTURE,
  flow: FLOW_FIXTURE,
  layers: LAYERS_FIXTURE,
  sequence: SEQUENCE_FIXTURE,
  timeline: TIMELINE_FIXTURE,
  zones: ZONES_FIXTURE,
} as const;

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function dgmPreviews(): Record<string, () => ReactNode> {
  const out: Record<string, () => ReactNode> = {};
  for (const family of DGM_FAMILIES) {
    for (const [kind, spec] of Object.entries(DGM_KIND_SPECS)) {
      const exportName = `${capitalise(family)}${capitalise(kind)}`;
      const Renderer = Collections[exportName as keyof typeof Collections] as ComponentType<{
        spec: typeof spec;
      }>;
      out[`comp.dgm.${family}.${kind}`] = () => <Renderer spec={spec} />;
    }
  }
  return out;
}

const PREVIEWS: Record<string, () => ReactNode> = {
  'comp.kpi-tile': KpiPreview,
  'comp.trend-chart': TrendPreview,
  'comp.category-bar-chart': CategoryBarPreview,
  'comp.status-list': StatusPreview,
  'comp.flow-diagram': FlowPreview,
  ...dgmPreviews(),
};

/** Render the live preview for a component id, or `null` if none is wired. */
export function ComponentLivePreview({ componentId }: { componentId: string }) {
  const Preview = PREVIEWS[componentId];
  if (!Preview) return null;
  return <Preview />;
}

export function hasLivePreview(componentId: string): boolean {
  return componentId in PREVIEWS;
}
