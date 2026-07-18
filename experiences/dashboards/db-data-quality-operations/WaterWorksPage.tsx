/**
 * "The Water Works" — the live full-bleed rendering of
 * `db-data-quality-operations`.
 *
 * Data-quality operations staged as a utility works department: the estate is
 * an AS-BUILT SHEET (sources → treatment → mains → consumers) and tonight's
 * quality failures are RED-LINE MARKUPS pinned to the exact junction that
 * failed, each written up as an incident docket routed to its accountable
 * crew. Grammar: technical-blueprint; signature: data-ink-draw (the pipes ink
 * themselves in); motion level 1; locked light; density high.
 *
 * Art-direction licence: this file and water-works.css are the
 * experience-local art layer — raw colour values are permitted HERE only.
 *
 * `data-part-id` values are a PUBLIC BORROW CONTRACT (surfaced by the gallery's
 * part inspector, consumed by the design skill): never rename or remove
 * one without updating LivePartIds.test.tsx.
 */
import { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import {
  ChartFigure,
  buildCategoryBarChartOption,
  buildCategoryBarChartTable,
} from '@enterprise-design/data-viz';
import type { ChartOption } from '@enterprise-design/data-viz';
import { VisuallyHidden } from '@enterprise-design/primitives';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource-variable/inter/index.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './water-works.css';
import {
  CHECKS,
  DOCKETS,
  FOOT,
  MARKUPS,
  NODES,
  PIPES,
  SHEET,
  WORKS,
  type DocketState,
  type WorksNode,
} from './content.js';

type Rec = Record<string, unknown>;

const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const INK = {
  ink: '#243138',
  faint: '#5f6d74',
  redline: '#b3271e',
  water: '#20647e',
  grid: 'rgba(95, 109, 116, 0.2)',
  paper: '#f3f4f0',
} as const;

const NODE_W = 168;
const NODE_H = 54;

const STATE_LABEL: Record<DocketState, string> = {
  isolated: 'ISOLATED',
  flushing: 'FLUSHING',
  repaired: 'REPAIRED',
};

function nodeById(id: string): WorksNode {
  return NODES.find((n) => n.id === id) ?? NODES[0]!;
}

/** Orthogonal pipe path from a node's right edge to a node's left edge. */
function pipePath(fromId: string, toId: string): string {
  const from = nodeById(fromId);
  const to = nodeById(toId);
  const x1 = from.x + NODE_W;
  const y1 = from.y + NODE_H / 2;
  const x2 = to.x;
  const y2 = to.y + NODE_H / 2;
  const mid = x1 + (x2 - x1) / 2;
  return `M ${x1} ${y1} H ${mid} V ${y2} H ${x2}`;
}

function useSuiteOption(reduced: boolean): ChartOption {
  return useMemo(() => {
    const base = buildCategoryBarChartOption(
      CHECKS.suites.map((suite) => ({ id: suite.id, category: suite.suite, value: suite.passed })),
      { colors: [INK.water], reducedMotion: reduced },
    ) as Rec;
    const axis = (extra?: Rec): Rec => ({
      axisLine: { lineStyle: { color: INK.grid } },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: INK.grid } },
      axisLabel: { color: INK.faint, fontFamily: MONO, fontSize: 10 },
      ...extra,
    });
    return {
      ...base,
      series: (base.series as Rec[]).map((s) => ({ ...s, barMaxWidth: 30 })),
      backgroundColor: 'transparent',
      textStyle: { fontFamily: MONO, color: INK.faint },
      tooltip: {
        trigger: 'axis',
        backgroundColor: INK.paper,
        borderColor: INK.grid,
        textStyle: { color: INK.ink, fontFamily: MONO, fontSize: 11 },
      },
      xAxis: { ...(base.xAxis as Rec), ...axis({ splitLine: { show: false } }) },
      yAxis: { ...(base.yAxis as Rec), ...axis() },
    };
  }, [reduced]);
}

export default function WaterWorksPage() {
  const { reduced } = useMotionPreference();
  const suiteOption = useSuiteOption(reduced);
  const suiteTable = useMemo(
    () =>
      buildCategoryBarChartTable(
        CHECKS.suites.map((suite) => ({ id: suite.id, category: suite.suite, value: suite.passed })),
      ),
    [],
  );

  return (
    <div className="ww-root" data-testid="live-water-works" data-reduced={reduced ? 'true' : undefined}>
      <header className="ww-chrome" data-part-id="db-data-quality-operations/chrome">
        <div className="ww-chrome-row">
          <RouterLink to="/" className="ww-back">
            ◄ GALLERY
          </RouterLink>
          <span className="ww-chrome-mast">{WORKS.masthead}</span>
          <span>{WORKS.sheetRef}</span>
        </div>
        <div className="ww-chrome-row ww-chrome-row-sub">
          <span>{WORKS.authority}</span>
          <span className="ww-provenance">{WORKS.provenance}</span>
        </div>
      </header>

      <main className="ww-main">
        <section className="ww-works" aria-labelledby="ww-statement" data-part-id="db-data-quality-operations/works">
          <p className="ww-kicker">{WORKS.kicker}</p>
          <h1 id="ww-statement" className="ww-statement">
            {WORKS.statement}
          </h1>
          <p className="ww-subline">{WORKS.subline}</p>
          <dl className="ww-figures" data-part-id="db-data-quality-operations/works/figures">
            {WORKS.figures.map((figure) => (
              <div key={figure.label} className="ww-figure">
                <dt>{figure.label}</dt>
                <dd>{figure.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="ww-band" aria-labelledby="ww-sheet-heading" data-part-id="db-data-quality-operations/sheet">
          <h2 id="ww-sheet-heading" className="ww-band-heading">
            <span className="ww-band-index">DW-1</span> {SHEET.title}
            <span className="ww-band-sub">{SHEET.sub}</span>
          </h2>
          <figure className="ww-sheet-figure">
            <div className="ww-sheet-scroll">
              <svg
                className="ww-sheet"
                viewBox="0 0 1100 450"
                role="img"
                aria-label={SHEET.caption}
                data-part-id="db-data-quality-operations/sheet/schematic"
              >
                <g className="ww-pipes">
                  {PIPES.map((pipe, i) => (
                    <path
                      key={pipe.id}
                      className="ww-pipe"
                      data-state={pipe.state}
                      d={pipePath(pipe.from, pipe.to)}
                      style={{
                        strokeWidth: pipe.flow + 1,
                        ['--ww-draw-delay' as string]: `${i * 90}ms`,
                      }}
                    />
                  ))}
                </g>
                <g className="ww-nodes">
                  {NODES.map((node) => (
                    <g key={node.id} className="ww-node" data-kind={node.kind} transform={`translate(${node.x}, ${node.y})`}>
                      <rect className="ww-node-box" width={NODE_W} height={NODE_H} rx={node.kind === 'source' ? 27 : 3} />
                      <text className="ww-node-label" x={NODE_W / 2} y={24}>
                        {node.label}
                      </text>
                      <text className="ww-node-sub" x={NODE_W / 2} y={40}>
                        {node.sub}
                      </text>
                    </g>
                  ))}
                </g>
                <g className="ww-markups">
                  {MARKUPS.map((markup) => {
                    const node = nodeById(markup.nodeId);
                    const cx = node.x + NODE_W / 2;
                    const cy = node.y + NODE_H / 2;
                    const lx = cx + markup.dx * 3;
                    const ly = cy + markup.dy;
                    return (
                      <g key={markup.id} className="ww-markup">
                        <ellipse className="ww-markup-ring" cx={cx} cy={cy} rx={NODE_W / 2 + 14} ry={NODE_H / 2 + 12} />
                        <line className="ww-markup-leader" x1={cx + (markup.dy > 0 ? -30 : 30)} y1={cy + (markup.dy > 0 ? NODE_H / 2 + 10 : -NODE_H / 2 - 10)} x2={lx} y2={ly} />
                        <text className="ww-markup-ref" x={lx + (markup.dx >= 0 ? 6 : -6)} y={ly + 4} textAnchor={markup.dx >= 0 ? 'start' : 'end'}>
                          {markup.ref} ⌁ SEE DOCKET
                        </text>
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>
            <figcaption className="ww-sheet-caption">
              <span className="ww-legend">
                {SHEET.legend.map((item) => (
                  <span key={item.label} className="ww-legend-item">
                    <span className={`ww-legend-swatch ww-legend-${item.swatch}`} aria-hidden="true" />
                    {item.label}
                  </span>
                ))}
              </span>
              <VisuallyHidden>{SHEET.caption}</VisuallyHidden>
            </figcaption>
          </figure>
        </section>

        <section className="ww-band" aria-labelledby="ww-dockets-heading" data-part-id="db-data-quality-operations/dockets">
          <h2 id="ww-dockets-heading" className="ww-band-heading">
            <span className="ww-band-index">DW-2</span> {DOCKETS.title}
            <span className="ww-band-sub">{DOCKETS.sub}</span>
          </h2>
          <div className="ww-dockets">
            {DOCKETS.items.map((docket) => (
              <article key={docket.id} className="ww-docket" data-state={docket.state}>
                <header className="ww-docket-head">
                  <span className="ww-docket-ref">{docket.ref}</span>
                  <span className="ww-docket-where">{docket.where}</span>
                  <span className="ww-docket-state">{STATE_LABEL[docket.state]}</span>
                </header>
                <p className="ww-docket-title">{docket.title}</p>
                <p className="ww-docket-found">{docket.found}</p>
                <p className="ww-docket-blast">
                  <span className="ww-docket-label">BLAST RADIUS</span> {docket.blastRadius}
                </p>
                <p className="ww-docket-note">{docket.note}</p>
                <footer className="ww-docket-foot">
                  <span className="ww-docket-stamp">
                    ROUTED · {docket.owner.toUpperCase()} · {docket.ownerDept}
                  </span>
                </footer>
              </article>
            ))}
          </div>
        </section>

        <div className="ww-columns">
          <section className="ww-band" aria-labelledby="ww-checks-heading" data-part-id="db-data-quality-operations/checks">
            <h2 id="ww-checks-heading" className="ww-band-heading">
              <span className="ww-band-index">DW-3</span> {CHECKS.title}
              <span className="ww-band-sub">{CHECKS.sub}</span>
            </h2>
            <div data-part-id="db-data-quality-operations/checks/suite-chart">
              <ChartFigure
                title={CHECKS.chartTitle}
                sourceNote={CHECKS.chartSource}
                option={suiteOption}
                tableColumns={suiteTable.columns}
                tableRows={suiteTable.rows}
                height={260}
                reducedMotion={reduced}
              />
            </div>
          </section>

          <section className="ww-band" aria-labelledby="ww-log-heading" data-part-id="db-data-quality-operations/run-log">
            <h2 id="ww-log-heading" className="ww-band-heading">
              <span className="ww-band-index">DW-4</span> {CHECKS.logTitle}
              <span className="ww-band-sub">Newest first · failures carry their red-line reference</span>
            </h2>
            <ul className="ww-log">
              {CHECKS.log.map((run) => (
                <li key={run.id} className="ww-run" data-result={run.result}>
                  <span className="ww-run-result" aria-hidden="true">
                    {run.result === 'pass' ? '✓' : run.result === 'warn' ? '△' : '✕'}
                  </span>
                  <div className="ww-run-body">
                    <p className="ww-run-label">
                      {run.label}
                      <VisuallyHidden> — {run.result}</VisuallyHidden>
                    </p>
                    <p className="ww-run-detail">{run.detail}</p>
                  </div>
                  <span className="ww-run-at">{run.at}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      <footer className="ww-foot">
        <p>{FOOT.note}</p>
        <p className="ww-foot-line">
          <span>{WORKS.provenance}</span>
          <span>{FOOT.next}</span>
        </p>
      </footer>
    </div>
  );
}
