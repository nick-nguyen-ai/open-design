/**
 * "The Drawing Office" — the live full-bleed rendering of
 * `exp-system-architecture`. The platform's architecture as a signed
 * engineering drawing: drafting-paper field, hand-routed plan, dimension
 * lines, section cuts, a proper title block with a revision table, and a
 * measured editorial narrative with mono margin annotations.
 *
 * Art-direction licence (task 12): this file and drawing.css are the
 * experience-local art layer — raw colour values allowed HERE only. Shared
 * components consume tokens (the page locks the document theme to light).
 */
import { useEffect, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import {
  ChartFigure,
  buildCategoryBarChartOption,
  buildCategoryBarChartTable,
} from '@enterprise-design/data-viz';
import type { ChartOption } from '@enterprise-design/data-viz';
import { buildFlowDiagramOutline } from '@enterprise-design/diagrams';
import { VisuallyHidden } from '@enterprise-design/primitives';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import './drawing.css';
import {
  ARCHITECTURE,
  CAPACITY_HEADROOM,
  CONSTRAINED_NODE_ID,
  DRAWING_NOTES,
  FIG_41,
  HEADROOM_FLOOR_PCT,
  REVISIONS,
  SECTIONS,
  SHEET,
} from './content.js';
import { ArchitectureDrawing } from './ArchitectureDrawing.js';

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

function useHeadroomOption(reduced: boolean): ChartOption {
  return useMemo(() => {
    const base = buildCategoryBarChartOption([...CAPACITY_HEADROOM], {
      colors: [INK.blue, INK.red],
      unit: '%',
      orientation: 'horizontal',
      reducedMotion: reduced,
    }) as Rec;
    const constrainedIndex = CAPACITY_HEADROOM.findIndex((d) => d.id === 'fs-read');
    const inkedSeries = (base.series as Rec[]).map((s) => ({
      ...s,
      ...(s.type === 'bar'
        ? {
            barWidth: 12,
            itemStyle: { ...(s.itemStyle as Rec), borderRadius: 0 },
            label: { ...(s.label as Rec), color: INK.line, fontFamily: MONO, fontSize: 10 },
            // The constrained tier carries the drawing's red — colour plus
            // the schedule/notes text, never colour alone.
            data: (s.data as number[]).map((value, i) =>
              i === constrainedIndex ? { value, itemStyle: { color: INK.red } } : value,
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
  }, [reduced]);
}

const PART_MARKS = ARCHITECTURE.nodes.map((node, index) => ({
  mark: String(index + 1).padStart(2, '0'),
  node,
}));

export default function DrawingOfficePage() {
  const { reduced } = useMotionPreference();

  useEffect(() => {
    document.title = 'The Drawing Office — Model Decision Platform, As Built';
  }, []);

  const outline = useMemo(() => buildFlowDiagramOutline(ARCHITECTURE), []);
  const connectionLines = outline.slice(ARCHITECTURE.nodes.length);
  const headroomOption = useHeadroomOption(reduced);
  const headroomTable = useMemo(() => buildCategoryBarChartTable([...CAPACITY_HEADROOM]), []);

  return (
    <div className="dw-root" data-testid="live-architecture" data-reduced={reduced ? 'true' : undefined}>
      <header className="dw-chrome" aria-label="Drawing chrome">
        <div className="dw-chrome-cell">
          <RouterLink to="/" className="dw-back">
            ◄ GALLERY
          </RouterLink>
          <span className="dw-chrome-rule" aria-hidden="true" />
          <span>
            {SHEET.office} · {SHEET.project}
          </span>
        </div>
        <div className="dw-chrome-cell">
          <span>
            DWG {SHEET.drawingNo} · {SHEET.revision} · {SHEET.sheet} · {SHEET.scale}
          </span>
        </div>
      </header>

      <main className="dw-main">
        <section className="dw-masthead" aria-labelledby="dw-title">
          <p className="dw-kicker">AS-BUILT RECORD · CHECKED AND SIGNED</p>
          <h1 id="dw-title" className="dw-display">
            An architecture is a promise written down.
            <br />
            This sheet is the promise, as built.
          </h1>
          <p className="dw-lede">
            {SHEET.title} — the decision fabric behind ninety million daily answers, drawn the
            way it actually runs.
          </p>
        </section>

        <section className="dw-sheet-section" aria-labelledby="dw-sheet-heading">
          <h2 id="dw-sheet-heading">
            <VisuallyHidden>The general-arrangement drawing</VisuallyHidden>
          </h2>
          <figure className="dw-sheet">
            <ArchitectureDrawing className="dw-sheet-svg" />
            <div className="dw-titleblock" data-testid="title-block" role="group" aria-label="Drawing title block">
              <div className="dw-tb-row dw-tb-head">
                <span className="dw-tb-project">{SHEET.project}</span>
                <span className="dw-tb-class">{SHEET.classification}</span>
              </div>
              <p className="dw-tb-title">{SHEET.title}</p>
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
                  {REVISIONS.map((r) => (
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
                  <dd>{SHEET.drawn}</dd>
                </div>
                <div>
                  <dt>CHECKED</dt>
                  <dd>{SHEET.checked}</dd>
                </div>
                <div>
                  <dt>APPROVED</dt>
                  <dd>{SHEET.approved}</dd>
                </div>
                <div>
                  <dt>DRAWING NO</dt>
                  <dd>
                    {SHEET.drawingNo} · {SHEET.revision}
                  </dd>
                </div>
              </dl>
            </div>
            <figcaption>
              <VisuallyHidden>
                General-arrangement drawing of the model decision platform: ten parts across a
                channel DMZ, a restricted core zone, and an overnight oversight band. The
                schedule of parts below lists every part and connection.
              </VisuallyHidden>
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
                  {PART_MARKS.map(({ mark, node }) => (
                    <tr key={node.id} data-constrained={node.id === CONSTRAINED_NODE_ID || undefined}>
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
                {DRAWING_NOTES.map((note) => (
                  <li key={note.no} data-critical={note.critical || undefined}>
                    <span className="dw-note-no">{note.no}.</span> {note.text}
                  </li>
                ))}
              </ol>
              <p className="dw-legend" aria-label="Drawing legend">
                LEGEND — DOUBLE LINE: PART · DASH: ZONE BOUNDARY · HATCH: CONSTRAINED PART ·
                A–A / B–B: SECTION CUTS · DIM LINES CARRY LATENCY BUDGETS
              </p>
            </section>
          </div>
        </section>

        <div className="dw-body">
          {SECTIONS.map((section) => (
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
                {section.no === '04' ? (
                  <figure className="dw-figure">
                    <div className="dw-figure-head">
                      <span className="dw-figure-no">{FIG_41.number}</span>
                      <span>{FIG_41.title}</span>
                      <span className="dw-figure-floor">FLOOR {HEADROOM_FLOOR_PCT}%</span>
                    </div>
                    <ChartFigure
                      title={`${FIG_41.number} — Capacity headroom by component`}
                      sourceNote={FIG_41.source}
                      option={headroomOption}
                      tableColumns={headroomTable.columns}
                      tableRows={headroomTable.rows}
                      height={280}
                      reducedMotion={reduced}
                    />
                    <figcaption className="dw-figure-caption">{FIG_41.caption}</figcaption>
                  </figure>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      </main>

      <footer className="dw-footer">
        <span>{SHEET.dataNotice}</span>
        <span>
          {SHEET.drawingNo} · {SHEET.revision} · PRINTS DROP THE FIELD TO WHITE
        </span>
      </footer>
    </div>
  );
}
