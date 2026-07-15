/**
 * "The Drawing Office" — the world-TEMPLATE. Carries the whole craft of
 * `exp-system-architecture` and renders it from a typed {@link DrawingOfficeFill}
 * (content slots only). `DrawingOfficePage` is now a thin wrapper that hands this
 * component the shipped fill; the rendered output is what the page rendered
 * before templatization.
 *
 * The platform's architecture as a signed engineering drawing: drafting-paper
 * field, hand-routed plan, dimension lines, section cuts, a proper title block
 * with a revision table, and a measured editorial narrative with mono margin
 * annotations. The bespoke {@link ArchitectureDrawing} owns the drawing's whole
 * GEOMETRY (fixed-slot, keyed by id); this template owns every other craft
 * decision and derives the schedule of parts, the connections list, the flagged
 * constraint, and FIG 4.1's red ink from the fill.
 *
 * Art-direction licence (task 12): this file and drawing.css are the
 * experience-local art layer — raw colour values allowed HERE only. Shared
 * components consume tokens. The document theme (light) is locked by
 * LiveExperience — not re-locked here.
 */
import { Fragment, useEffect, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import {
  ChartFigure,
  buildCategoryBarChartOption,
  buildCategoryBarChartTable,
} from '@enterprise-design/data-viz';
import type { ChartOption, CategoryBarDatum } from '@enterprise-design/data-viz';
import { buildFlowDiagramOutline } from '@enterprise-design/diagrams';
import type { FlowDiagramData } from '@enterprise-design/diagrams';
import { VisuallyHidden } from '@enterprise-design/primitives';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import './drawing.css';
import { ArchitectureDrawing } from './ArchitectureDrawing.js';
import type { DrawingOfficeFill } from './drawing-office-fill.js';

/* Local chart ink — drafting palette (licence §1). */
const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const INK = {
  line: '#22303c',
  blue: '#2c5a78',
  red: '#b5442a',
  muted: '#5a6b76',
  grid: 'rgba(34, 48, 60, 0.16)',
  paper: '#f5f1e6',
} as const;

type Rec = Record<string, unknown>;

function useHeadroomOption(
  reduced: boolean,
  headroom: readonly CategoryBarDatum[],
  floorPct: number,
): ChartOption {
  return useMemo(() => {
    const base = buildCategoryBarChartOption([...headroom], {
      colors: [INK.blue, INK.red],
      unit: '%',
      orientation: 'horizontal',
      reducedMotion: reduced,
    }) as Rec;
    const inkedSeries = (base.series as Rec[]).map((s) => ({
      ...s,
      ...(s.type === 'bar'
        ? {
            barWidth: 12,
            itemStyle: { ...(s.itemStyle as Rec), borderRadius: 0 },
            label: { ...(s.label as Rec), color: INK.line, fontFamily: MONO, fontSize: 10 },
            // Any tier below the review-board floor carries the drawing's red —
            // the constraint encoding is derived from the data, never a fixed id.
            data: (s.data as number[]).map((value) =>
              value < floorPct ? { value, itemStyle: { color: INK.red } } : value,
            ),
          }
        : {}),
    }));
    const axisInk = {
      axisLabel: { color: INK.muted, fontFamily: MONO, fontSize: 10 },
      axisLine: { lineStyle: { color: INK.grid } },
      axisTick: { show: false },
      nameTextStyle: { color: INK.muted, fontFamily: MONO },
    };
    return {
      ...base,
      backgroundColor: 'transparent',
      legend: { show: false },
      textStyle: { fontFamily: MONO, color: INK.muted },
      xAxis: { ...(base.xAxis as Rec), ...axisInk, splitLine: { lineStyle: { color: INK.grid } } },
      yAxis: {
        ...(base.yAxis as Rec),
        ...axisInk,
        axisLabel: { color: INK.line, fontFamily: MONO, fontSize: 10 },
        splitLine: { show: false },
        inverse: true,
      },
      series: inkedSeries,
    } as ChartOption;
  }, [reduced, headroom, floorPct]);
}

export default function DrawingOfficeTemplate({ fill }: { fill: DrawingOfficeFill }) {
  const { reduced } = useMotionPreference();
  const { sheet, masthead, drawing, notes, narrative, figure } = fill;

  useEffect(() => {
    // Derived from the fill: a different architecture gets a truthful tab title.
    document.title = sheet.pageTitle;
  }, [sheet.pageTitle]);

  // The diagram data the outline + chart derive from — content only; the drawing
  // owns geometry. buildFlowDiagramOutline lists nodes first, then connections.
  const diagramData = useMemo<FlowDiagramData>(
    () => ({
      nodes: drawing.nodes.map((n) => ({ id: n.id, label: n.label, kind: n.kind })),
      edges: drawing.edges.map((e) => ({ id: e.id, from: e.from, to: e.to, label: e.label })),
    }),
    [drawing.nodes, drawing.edges],
  );
  const outline = useMemo(() => buildFlowDiagramOutline(diagramData), [diagramData]);
  const connectionLines = outline.slice(drawing.nodes.length);

  const headroomOption = useHeadroomOption(reduced, figure.headroom, figure.floorPct);
  const headroomTable = useMemo(() => buildCategoryBarChartTable([...figure.headroom]), [figure.headroom]);

  const partMarks = drawing.nodes.map((node, index) => ({
    mark: String(index + 1).padStart(2, '0'),
    node,
  }));

  return (
    <div className="dw-root" data-testid="live-architecture" data-reduced={reduced ? 'true' : undefined}>
      <header className="dw-chrome" aria-label="Drawing chrome">
        <div className="dw-chrome-cell">
          <RouterLink to="/" className="dw-back">
            ◄ GALLERY
          </RouterLink>
          <span className="dw-chrome-rule" aria-hidden="true" />
          <span>
            {sheet.office} · {sheet.project}
          </span>
        </div>
        <div className="dw-chrome-cell">
          <span>
            DWG {sheet.drawingNo} · {sheet.revision} · {sheet.sheet} · {sheet.scale}
          </span>
        </div>
      </header>

      <main className="dw-main">
        <section className="dw-masthead" aria-labelledby="dw-title">
          <p className="dw-kicker">{masthead.kicker}</p>
          <h1 id="dw-title" className="dw-display">
            {masthead.displayLines.map((line, i) => (
              <Fragment key={i}>
                {i > 0 ? <br /> : null}
                {line}
              </Fragment>
            ))}
          </h1>
          <p className="dw-lede">
            {sheet.title} — {masthead.lede}
          </p>
        </section>

        <section className="dw-sheet-section" aria-labelledby="dw-sheet-heading">
          <h2 id="dw-sheet-heading">
            <VisuallyHidden>{drawing.figureHeading}</VisuallyHidden>
          </h2>
          <figure className="dw-sheet">
            <ArchitectureDrawing
              className="dw-sheet-svg"
              nodes={drawing.nodes}
              edges={drawing.edges}
              zones={drawing.zones}
              dimensions={drawing.dimensions}
              constraintFlag={drawing.constraintFlag}
            />
            <div className="dw-titleblock" data-testid="title-block" role="group" aria-label="Drawing title block">
              <div className="dw-tb-row dw-tb-head">
                <span className="dw-tb-project">{sheet.project}</span>
                <span className="dw-tb-class">{sheet.classification}</span>
              </div>
              <p className="dw-tb-title">{sheet.title}</p>
              <table className="dw-tb-rev" aria-label="Revision table">
                <thead>
                  <tr>
                    <th scope="col">REV</th>
                    <th scope="col">DATE</th>
                    <th scope="col">DESCRIPTION</th>
                    <th scope="col">BY</th>
                  </tr>
                </thead>
                <tbody>
                  {sheet.revisions.map((r) => (
                    <tr key={r.rev}>
                      <td>{r.rev}</td>
                      <td>{r.date}</td>
                      <td>{r.description}</td>
                      <td>{r.by}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <dl className="dw-tb-grid">
                <div>
                  <dt>DRAWN</dt>
                  <dd>{sheet.drawn}</dd>
                </div>
                <div>
                  <dt>CHECKED</dt>
                  <dd>{sheet.checked}</dd>
                </div>
                <div>
                  <dt>APPROVED</dt>
                  <dd>{sheet.approved}</dd>
                </div>
                <div>
                  <dt>DRAWING NO</dt>
                  <dd>
                    {sheet.drawingNo} · {sheet.revision}
                  </dd>
                </div>
              </dl>
            </div>
            <figcaption>
              <VisuallyHidden>{drawing.caption}</VisuallyHidden>
            </figcaption>
          </figure>

          <div className="dw-under-sheet">
            <section className="dw-schedule" aria-labelledby="dw-schedule-heading" data-testid="schedule-of-parts">
              <h3 id="dw-schedule-heading" className="dw-panel-heading">
                SCHEDULE OF PARTS
              </h3>
              <table className="dw-schedule-table">
                <thead>
                  <tr>
                    <th scope="col">MARK</th>
                    <th scope="col">PART</th>
                    <th scope="col">CLASS</th>
                  </tr>
                </thead>
                <tbody>
                  {partMarks.map(({ mark, node }) => (
                    <tr key={node.id} data-constrained={node.emphasis === 'constrained' || undefined}>
                      <td className="dw-num">{mark}</td>
                      <th scope="row">{node.label}</th>
                      <td>{node.kind.toUpperCase()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h4 className="dw-panel-subheading">CONNECTIONS</h4>
              <ul className="dw-connections">
                {connectionLines.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </section>

            <section className="dw-notes" aria-labelledby="dw-notes-heading">
              <h3 id="dw-notes-heading" className="dw-panel-heading">
                GENERAL NOTES
              </h3>
              <ol className="dw-notes-list">
                {notes.items.map((note) => (
                  <li key={note.no} data-critical={note.critical || undefined}>
                    <span className="dw-note-no">{note.no}.</span> {note.text}
                  </li>
                ))}
              </ol>
              <p className="dw-legend" aria-label="Drawing legend">
                {notes.legend}
              </p>
            </section>
          </div>
        </section>

        <div className="dw-body">
          {narrative.sections.map((section) => (
            <section key={section.no} className="dw-section" aria-labelledby={`dw-s-${section.no}`}>
              <div className="dw-margin-note" aria-hidden="true">
                {section.annotation}
              </div>
              <div className="dw-section-text">
                <h2 id={`dw-s-${section.no}`} className="dw-section-heading">
                  <span className="dw-section-no">{section.no}</span> {section.title}
                </h2>
                {section.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {section.hostsFigure ? (
                  <figure className="dw-figure">
                    <div className="dw-figure-head">
                      <span className="dw-figure-no">{figure.number}</span>
                      <span>{figure.title}</span>
                      <span className="dw-figure-floor">FLOOR {figure.floorPct}%</span>
                    </div>
                    <ChartFigure
                      title={figure.chartTitle}
                      sourceNote={figure.source}
                      option={headroomOption}
                      tableColumns={headroomTable.columns}
                      tableRows={headroomTable.rows}
                      height={280}
                      reducedMotion={reduced}
                    />
                    <figcaption className="dw-figure-caption">{figure.caption}</figcaption>
                  </figure>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      </main>

      <footer className="dw-footer">
        <span>{sheet.dataNotice}</span>
        <span>
          {sheet.drawingNo} · {sheet.revision} · PRINTS DROP THE FIELD TO WHITE
        </span>
      </footer>
    </div>
  );
}
