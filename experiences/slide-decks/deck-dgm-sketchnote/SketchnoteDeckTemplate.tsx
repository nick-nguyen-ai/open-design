/**
 * "The Field Notebook" — the world-TEMPLATE for `deck-dgm-sketchnote`, the
 * sketchnote grammar-tour deck. Ten pages of an engineer's paper notebook:
 * cover, one page per diagram kind (the full sketchnote collection — flow,
 * sequence, layers, zones, cycle, compare, cells, timeline), and a close.
 *
 * Craft: cream paper field, Caveat hand throughout, washi-tape page headers,
 * marker-swipe heading underlines, and the sketchnote family's rough-stroke
 * diagrams doing the storytelling. All content renders from the shared tour
 * fill (`_dgm-kit/dgm-fill.ts`); deck mechanics come from `DgmDeckShell`.
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
  SketchnoteCells,
  SketchnoteCompare,
  SketchnoteCycle,
  SketchnoteFlow,
  SketchnoteLayers,
  SketchnoteSequence,
  SketchnoteTimeline,
  SketchnoteZones,
} from '@enterprise-design/diagram-collections';
import '@enterprise-design/diagram-collections/styles.css';
import '@fontsource/caveat/400.css';
import '@fontsource/caveat/700.css';
import '@fontsource-variable/inter';
import './sketchnote-deck.css';
import { DgmDeckShell, DGM_SECTION_KINDS, type DgmSectionKind } from '../_dgm-kit/DgmDeckShell.js';
import type { SketchnoteDeckFill } from './dgm-sketchnote-fill.js';

/** Chrome kicker derived from the section kind — no editorial literals. */
function kicker(kind: DgmSectionKind): string {
  const index = DGM_SECTION_KINDS.indexOf(kind);
  return `${String(index).padStart(2, '0')} · ${kind.replace('-slide', '')}`;
}

export default function SketchnoteDeckTemplate({ fill }: { fill: SketchnoteDeckFill }) {
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
        return <SketchnoteFlow spec={specs.flow} />;
      case 'sequence-slide':
        return <SketchnoteSequence spec={specs.sequence} />;
      case 'layers-slide':
        return <SketchnoteLayers spec={specs.layers} />;
      case 'zones-slide':
        return <SketchnoteZones spec={specs.zones} />;
      case 'cycle-slide':
        return <SketchnoteCycle spec={specs.cycle} />;
      case 'compare-slide':
        return <SketchnoteCompare spec={specs.compare} />;
      case 'cells-slide':
        return <SketchnoteCells spec={specs.cells} />;
      case 'timeline-slide':
        return <SketchnoteTimeline spec={specs.timeline} />;
      default:
        return null;
    }
  }

  function renderSlide(kind: DgmSectionKind) {
    if (kind === 'cover') {
      return (
        <div className="skd-cover" data-part-id={`deck-dgm-sketchnote/${kind}`}>
          <span className="skd-tape" aria-hidden="true" />
          <p className="skd-kicker">{fill.deck.code}</p>
          <h2 className="skd-title">{fill.deck.title}</h2>
          <p className="skd-standfirst">{fill.deck.standfirst}</p>
          <p className="skd-notice-line">{fill.deck.notice}</p>
        </div>
      );
    }
    if (kind === 'close') {
      return (
        <div className="skd-close" data-part-id={`deck-dgm-sketchnote/${kind}`}>
          <span className="skd-tape" aria-hidden="true" />
          <p className="skd-kicker">{kicker(kind)}</p>
          <ul className="skd-takeaways">
            {fill.close.takeaways.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="skd-signoff">{fill.close.signoff}</p>
        </div>
      );
    }
    const slide = fill[kind.replace('-slide', '') as 'flow'];
    return (
      <div className="skd-page" data-part-id={`deck-dgm-sketchnote/${kind}`}>
        <span className="skd-tape" aria-hidden="true" />
        <div className="skd-page-head">
          <p className="skd-kicker">{kicker(kind)}</p>
          <h2 className="skd-heading">{slide.heading}</h2>
          <p className="skd-caption">{slide.caption}</p>
        </div>
        <div className="skd-figure">{diagramFor(kind)}</div>
      </div>
    );
  }

  return (
    <DgmDeckShell
      fill={fill}
      rootTestId="live-dgm-sketchnote"
      classPrefix="skd"
      summary="A hand-sketched field notebook touring all eight diagram kinds of the sketchnote collection."
      renderSlide={renderSlide}
    />
  );
}
