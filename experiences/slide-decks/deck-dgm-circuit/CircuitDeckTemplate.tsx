/**
 * "THE LIT BOARD" — the world-TEMPLATE for `deck-dgm-circuit`, the circuit
 * grammar-tour deck. Ten slides: cover, one per diagram kind (the full
 * circuit collection — flow, sequence, layers, zones, cycle, compare, cells,
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
  CircuitCells,
  CircuitCompare,
  CircuitCycle,
  CircuitFlow,
  CircuitLayers,
  CircuitSequence,
  CircuitTimeline,
  CircuitZones,
} from '@enterprise-design/diagram-collections';
import '@enterprise-design/diagram-collections/styles.css';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/ibm-plex-mono/400.css';
import './circuit-deck.css';
import { DgmDeckShell, DGM_SECTION_KINDS, type DgmSectionKind } from '../_dgm-kit/DgmDeckShell.js';
import type { CircuitDeckFill } from './dgm-circuit-fill.js';

/** Chrome kicker derived from the section kind — no editorial literals. */
function kicker(kind: DgmSectionKind): string {
  const index = DGM_SECTION_KINDS.indexOf(kind);
  return `${String(index).padStart(2, '0')} · ${kind.replace('-slide', '')}`;
}

export default function CircuitDeckTemplate({ fill }: { fill: CircuitDeckFill }) {
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
        return <CircuitFlow spec={specs.flow} />;
      case 'sequence-slide':
        return <CircuitSequence spec={specs.sequence} />;
      case 'layers-slide':
        return <CircuitLayers spec={specs.layers} />;
      case 'zones-slide':
        return <CircuitZones spec={specs.zones} />;
      case 'cycle-slide':
        return <CircuitCycle spec={specs.cycle} />;
      case 'compare-slide':
        return <CircuitCompare spec={specs.compare} />;
      case 'cells-slide':
        return <CircuitCells spec={specs.cells} />;
      case 'timeline-slide':
        return <CircuitTimeline spec={specs.timeline} />;
      default:
        return null;
    }
  }

  function renderSlide(kind: DgmSectionKind) {
    if (kind === 'cover') {
      return (
        <div className="cxd-cover" data-part-id={`deck-dgm-circuit/${kind}`}>
          <span className="cxd-device" aria-hidden="true" />
          <p className="cxd-kicker">{fill.deck.code}</p>
          <h2 className="cxd-title">{fill.deck.title}</h2>
          <p className="cxd-standfirst">{fill.deck.standfirst}</p>
          <p className="cxd-notice-line">{fill.deck.notice}</p>
        </div>
      );
    }
    if (kind === 'close') {
      return (
        <div className="cxd-close" data-part-id={`deck-dgm-circuit/${kind}`}>
          <span className="cxd-device" aria-hidden="true" />
          <p className="cxd-kicker">{kicker(kind)}</p>
          <ul className="cxd-takeaways">
            {fill.close.takeaways.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="cxd-signoff">{fill.close.signoff}</p>
        </div>
      );
    }
    const slide = fill[kind.replace('-slide', '') as 'flow'];
    return (
      <div className="cxd-page" data-part-id={`deck-dgm-circuit/${kind}`}>
        <span className="cxd-device" aria-hidden="true" />
        <div className="cxd-page-head">
          <p className="cxd-kicker">{kicker(kind)}</p>
          <h2 className="cxd-heading">{slide.heading}</h2>
          <p className="cxd-caption">{slide.caption}</p>
        </div>
        <div className="cxd-figure">{diagramFor(kind)}</div>
      </div>
    );
  }

  return (
    <DgmDeckShell
      fill={fill}
      rootTestId="live-dgm-circuit"
      classPrefix="cxd"
      summary="A neon-terminal tour of all eight diagram kinds of the circuit collection."
      renderSlide={renderSlide}
    />
  );
}
