/**
 * "THE STUDIO FLOOR" — the world-TEMPLATE for `deck-dgm-isometric`, the isometric
 * grammar-tour deck. Ten slides: cover, one per diagram kind (the full
 * isometric collection — flow, sequence, layers, zones, cycle, compare, cells,
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
  IsometricCells,
  IsometricCompare,
  IsometricCycle,
  IsometricFlow,
  IsometricLayers,
  IsometricSequence,
  IsometricTimeline,
  IsometricZones,
} from '@enterprise-design/diagram-collections';
import '@enterprise-design/diagram-collections/styles.css';
import '@fontsource-variable/inter';
import './isometric-deck.css';
import { DgmDeckShell, DGM_SECTION_KINDS, type DgmSectionKind } from '../_dgm-kit/DgmDeckShell.js';
import type { IsometricDeckFill } from './dgm-isometric-fill.js';

/** Chrome kicker derived from the section kind — no editorial literals. */
function kicker(kind: DgmSectionKind): string {
  const index = DGM_SECTION_KINDS.indexOf(kind);
  return `${String(index).padStart(2, '0')} · ${kind.replace('-slide', '')}`;
}

export default function IsometricDeckTemplate({ fill }: { fill: IsometricDeckFill }) {
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
        return <IsometricFlow spec={specs.flow} />;
      case 'sequence-slide':
        return <IsometricSequence spec={specs.sequence} />;
      case 'layers-slide':
        return <IsometricLayers spec={specs.layers} />;
      case 'zones-slide':
        return <IsometricZones spec={specs.zones} />;
      case 'cycle-slide':
        return <IsometricCycle spec={specs.cycle} />;
      case 'compare-slide':
        return <IsometricCompare spec={specs.compare} />;
      case 'cells-slide':
        return <IsometricCells spec={specs.cells} />;
      case 'timeline-slide':
        return <IsometricTimeline spec={specs.timeline} />;
      default:
        return null;
    }
  }

  function renderSlide(kind: DgmSectionKind) {
    if (kind === 'cover') {
      return (
        <div className="isd-cover" data-part-id={`deck-dgm-isometric/${kind}`}>
          <span className="isd-device" aria-hidden="true" />
          <p className="isd-kicker">{fill.deck.code}</p>
          <h2 className="isd-title">{fill.deck.title}</h2>
          <p className="isd-standfirst">{fill.deck.standfirst}</p>
          <p className="isd-notice-line">{fill.deck.notice}</p>
        </div>
      );
    }
    if (kind === 'close') {
      return (
        <div className="isd-close" data-part-id={`deck-dgm-isometric/${kind}`}>
          <span className="isd-device" aria-hidden="true" />
          <p className="isd-kicker">{kicker(kind)}</p>
          <ul className="isd-takeaways">
            {fill.close.takeaways.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="isd-signoff">{fill.close.signoff}</p>
        </div>
      );
    }
    const slide = fill[kind.replace('-slide', '') as 'flow'];
    return (
      <div className="isd-page" data-part-id={`deck-dgm-isometric/${kind}`}>
        <span className="isd-device" aria-hidden="true" />
        <div className="isd-page-head">
          <p className="isd-kicker">{kicker(kind)}</p>
          <h2 className="isd-heading">{slide.heading}</h2>
          <p className="isd-caption">{slide.caption}</p>
        </div>
        <div className="isd-figure">{diagramFor(kind)}</div>
      </div>
    );
  }

  return (
    <DgmDeckShell
      fill={fill}
      rootTestId="live-dgm-isometric"
      classPrefix="isd"
      summary="A candy-block diorama tour of all eight diagram kinds of the isometric collection."
      renderSlide={renderSlide}
    />
  );
}
