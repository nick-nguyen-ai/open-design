/**
 * "THE GAZETTE" — the world-TEMPLATE for `deck-dgm-gazette`, the gazette
 * grammar-tour deck. Ten slides: cover, one per diagram kind (the full
 * gazette collection — flow, sequence, layers, zones, cycle, compare, cells,
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
  GazetteCells,
  GazetteCompare,
  GazetteCycle,
  GazetteFlow,
  GazetteLayers,
  GazetteSequence,
  GazetteTimeline,
  GazetteZones,
} from '@enterprise-design/diagram-collections';
import '@enterprise-design/diagram-collections/styles.css';
import '@fontsource-variable/fraunces';
import '@fontsource-variable/inter';
import './gazette-deck.css';
import { DgmDeckShell, DGM_SECTION_KINDS, type DgmSectionKind } from '../_dgm-kit/DgmDeckShell.js';
import type { GazetteDeckFill } from './dgm-gazette-fill.js';

/** Chrome kicker derived from the section kind — no editorial literals. */
function kicker(kind: DgmSectionKind): string {
  const index = DGM_SECTION_KINDS.indexOf(kind);
  return `${String(index).padStart(2, '0')} · ${kind.replace('-slide', '')}`;
}

export default function GazetteDeckTemplate({ fill }: { fill: GazetteDeckFill }) {
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
        return <GazetteFlow spec={specs.flow} />;
      case 'sequence-slide':
        return <GazetteSequence spec={specs.sequence} />;
      case 'layers-slide':
        return <GazetteLayers spec={specs.layers} />;
      case 'zones-slide':
        return <GazetteZones spec={specs.zones} />;
      case 'cycle-slide':
        return <GazetteCycle spec={specs.cycle} />;
      case 'compare-slide':
        return <GazetteCompare spec={specs.compare} />;
      case 'cells-slide':
        return <GazetteCells spec={specs.cells} />;
      case 'timeline-slide':
        return <GazetteTimeline spec={specs.timeline} />;
      default:
        return null;
    }
  }

  function renderSlide(kind: DgmSectionKind) {
    if (kind === 'cover') {
      return (
        <div className="gzd-cover" data-part-id={`deck-dgm-gazette/${kind}`}>
          <span className="gzd-device" aria-hidden="true" />
          <p className="gzd-kicker">{fill.deck.code}</p>
          <h2 className="gzd-title">{fill.deck.title}</h2>
          <p className="gzd-standfirst">{fill.deck.standfirst}</p>
          <p className="gzd-notice-line">{fill.deck.notice}</p>
        </div>
      );
    }
    if (kind === 'close') {
      return (
        <div className="gzd-close" data-part-id={`deck-dgm-gazette/${kind}`}>
          <span className="gzd-device" aria-hidden="true" />
          <p className="gzd-kicker">{kicker(kind)}</p>
          <ul className="gzd-takeaways">
            {fill.close.takeaways.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="gzd-signoff">{fill.close.signoff}</p>
        </div>
      );
    }
    const slide = fill[kind.replace('-slide', '') as 'flow'];
    return (
      <div className="gzd-page" data-part-id={`deck-dgm-gazette/${kind}`}>
        <span className="gzd-device" aria-hidden="true" />
        <div className="gzd-page-head">
          <p className="gzd-kicker">{kicker(kind)}</p>
          <h2 className="gzd-heading">{slide.heading}</h2>
          <p className="gzd-caption">{slide.caption}</p>
        </div>
        <div className="gzd-figure">{diagramFor(kind)}</div>
      </div>
    );
  }

  return (
    <DgmDeckShell
      fill={fill}
      rootTestId="live-dgm-gazette"
      classPrefix="gzd"
      summary="A print-atelier field-guide tour of all eight diagram kinds of the gazette collection."
      renderSlide={renderSlide}
    />
  );
}
