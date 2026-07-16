/**
 * "THE DRAFTING BOARD" — the world-TEMPLATE for `deck-dgm-blueprint`, the blueprint
 * grammar-tour deck. Ten slides: cover, one per diagram kind (the full
 * blueprint collection — flow, sequence, layers, zones, cycle, compare, cells,
 * timeline), and a close.
 *
 * All content renders from the shared tour fill (`_dgm-kit/dgm-fill.ts`);
 * deck mechanics come from `DgmDeckShell`; the deck chrome craft lives in
 * the sibling CSS (experience-local art layer).
 */
import { useMemo } from 'react';
import type {
  CellsSpecT,
  CompareSpecT,
  CycleSpecT,
  FlowSpecT,
  LayersSpecT,
  SequenceSpecT,
  TimelineSpecT,
  ZonesSpecT,
} from '@enterprise-design/diagram-grammar';
import {
  BlueprintCells,
  BlueprintCompare,
  BlueprintCycle,
  BlueprintFlow,
  BlueprintLayers,
  BlueprintSequence,
  BlueprintTimeline,
  BlueprintZones,
} from '@enterprise-design/diagram-collections';
import '@enterprise-design/diagram-collections/styles.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './blueprint-deck.css';
import { DgmDeckShell, DGM_SECTION_KINDS, type DgmSectionKind } from '../_dgm-kit/DgmDeckShell.js';
import type { BlueprintDeckFill } from './dgm-blueprint-fill.js';

/** Chrome kicker derived from the section kind — no editorial literals. */
function kicker(kind: DgmSectionKind): string {
  const index = DGM_SECTION_KINDS.indexOf(kind);
  return `${String(index).padStart(2, '0')} · ${kind.replace('-slide', '')}`;
}

export default function BlueprintDeckTemplate({ fill }: { fill: BlueprintDeckFill }) {
  const specs = useMemo(
    () => ({
      flow: { kind: 'flow', title: fill.flow.title, nodes: fill.flow.nodes, edges: fill.flow.edges } satisfies FlowSpecT,
      sequence: {
        kind: 'sequence',
        title: fill.sequence.title,
        actors: fill.sequence.actors,
        messages: fill.sequence.messages,
      } satisfies SequenceSpecT,
      layers: {
        kind: 'layers',
        title: fill.layers.title,
        layers: fill.layers.layers,
        sideLabel: fill.layers.sideLabel,
      } satisfies LayersSpecT,
      zones: { kind: 'zones', title: fill.zones.title, zones: fill.zones.zones, links: fill.zones.links } satisfies ZonesSpecT,
      cycle: {
        kind: 'cycle',
        title: fill.cycle.title,
        stages: fill.cycle.stages,
        hubLabel: fill.cycle.hubLabel,
      } satisfies CycleSpecT,
      compare: {
        kind: 'compare',
        title: fill.compare.title,
        columns: fill.compare.columns,
        rows: fill.compare.rows,
        verdict: fill.compare.verdict,
      } satisfies CompareSpecT,
      cells: {
        kind: 'cells',
        title: fill.cells.title,
        cells: fill.cells.cells,
        columnsHint: fill.cells.columnsHint,
      } satisfies CellsSpecT,
      timeline: {
        kind: 'timeline',
        title: fill.timeline.title,
        eras: fill.timeline.eras,
        nowIndex: fill.timeline.nowIndex,
      } satisfies TimelineSpecT,
    }),
    [fill],
  );

  function diagramFor(kind: DgmSectionKind) {
    switch (kind) {
      case 'flow-slide':
        return <BlueprintFlow spec={specs.flow} />;
      case 'sequence-slide':
        return <BlueprintSequence spec={specs.sequence} />;
      case 'layers-slide':
        return <BlueprintLayers spec={specs.layers} />;
      case 'zones-slide':
        return <BlueprintZones spec={specs.zones} />;
      case 'cycle-slide':
        return <BlueprintCycle spec={specs.cycle} />;
      case 'compare-slide':
        return <BlueprintCompare spec={specs.compare} />;
      case 'cells-slide':
        return <BlueprintCells spec={specs.cells} />;
      case 'timeline-slide':
        return <BlueprintTimeline spec={specs.timeline} />;
      default:
        return null;
    }
  }

  function renderSlide(kind: DgmSectionKind) {
    if (kind === 'cover') {
      return (
        <div className="bpd-cover" data-part-id={`deck-dgm-blueprint/${kind}`}>
          <span className="bpd-device" aria-hidden="true" />
          <p className="bpd-kicker">{fill.deck.code}</p>
          <h2 className="bpd-title">{fill.deck.title}</h2>
          <p className="bpd-standfirst">{fill.deck.standfirst}</p>
          <p className="bpd-notice-line">{fill.deck.notice}</p>
        </div>
      );
    }
    if (kind === 'close') {
      return (
        <div className="bpd-close" data-part-id={`deck-dgm-blueprint/${kind}`}>
          <span className="bpd-device" aria-hidden="true" />
          <p className="bpd-kicker">{kicker(kind)}</p>
          <ul className="bpd-takeaways">
            {fill.close.takeaways.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="bpd-signoff">{fill.close.signoff}</p>
        </div>
      );
    }
    const slide = fill[kind.replace('-slide', '') as 'flow'];
    return (
      <div className="bpd-page" data-part-id={`deck-dgm-blueprint/${kind}`}>
        <span className="bpd-device" aria-hidden="true" />
        <div className="bpd-page-head">
          <p className="bpd-kicker">{kicker(kind)}</p>
          <h2 className="bpd-heading">{slide.heading}</h2>
          <p className="bpd-caption">{slide.caption}</p>
        </div>
        <div className="bpd-figure">{diagramFor(kind)}</div>
      </div>
    );
  }

  return (
    <DgmDeckShell
      fill={fill}
      rootTestId="live-dgm-blueprint"
      classPrefix="bpd"
      summary="A cyanotype drafting-sheet tour of all eight diagram kinds of the blueprint collection."
      renderSlide={renderSlide}
    />
  );
}
