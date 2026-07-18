/**
 * "The Wind Tunnel" — the live full-bleed rendering of
 * `db-scenario-stress-simulator`.
 *
 * Stress testing as an instrumented test chamber: the same balance sheet on
 * three rigs side by side (baseline / adverse / severe), each rig reading its
 * capital gauge against the floor, and the driver traces showing which inputs
 * actually move the outcome. Grammar: kinetic-intelligence; signature:
 * data-ink-draw (the gauge arcs sweep to their reading); motion level 2;
 * locked dark; corporate register: restricted.
 *
 * Art-direction licence: this file and wind-tunnel.css are the
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
import '@fontsource/ibm-plex-mono/600.css';
import './wind-tunnel.css';
import { DRIVERS, FOOT, READING, RIGS, TUNNEL, type ScenarioRig } from './content.js';

type Rec = Record<string, unknown>;

const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const INK = {
  amber: '#f2a341',
  cyan: '#6fc3d9',
  red: '#ff6a5e',
  faint: '#8b8b97',
  grid: 'rgba(139, 139, 151, 0.16)',
  panel: '#15151c',
  text: '#dcdce4',
} as const;

/** Map a gauge value onto the 210° instrument arc (from -195° to +15°). */
function gaugeAngle(value: number, min: number, max: number): number {
  const t = Math.min(1, Math.max(0, (value - min) / (max - min)));
  return -195 + t * 210;
}

function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const rad = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function arcPath(cx: number, cy: number, r: number, fromDeg: number, toDeg: number): string {
  const [x1, y1] = polar(cx, cy, r, fromDeg);
  const [x2, y2] = polar(cx, cy, r, toDeg);
  const large = toDeg - fromDeg > 180 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

function RigGaugeDial({ rig }: { rig: ScenarioRig }) {
  const { gauge } = rig;
  const valueDeg = gaugeAngle(gauge.value, gauge.min, gauge.max);
  const floorDeg = gaugeAngle(gauge.floor, gauge.min, gauge.max);
  const [nx, ny] = polar(70, 74, 46, valueDeg);
  const [fx1, fy1] = polar(70, 74, 34, floorDeg);
  const [fx2, fy2] = polar(70, 74, 58, floorDeg);
  return (
    <svg
      className="wt-gauge"
      viewBox="0 0 140 110"
      role="img"
      aria-label={`${rig.name}: ${gauge.label} ${gauge.display}, floor ${gauge.floorLabel}`}
    >
      <path className="wt-gauge-track" d={arcPath(70, 74, 52, -195, 15)} />
      <path
        className="wt-gauge-sweep"
        data-severity={rig.severity}
        d={arcPath(70, 74, 52, -195, valueDeg)}
      />
      <line className="wt-gauge-floor" x1={fx1} y1={fy1} x2={fx2} y2={fy2} />
      <line className="wt-gauge-needle" x1={70} y1={74} x2={nx} y2={ny} />
      <circle className="wt-gauge-hub" cx={70} cy={74} r={4} />
      <text className="wt-gauge-value" x={70} y={66} textAnchor="middle">
        {gauge.display}
      </text>
      <text className="wt-gauge-label" x={70} y={98} textAnchor="middle">
        {gauge.floorLabel}
      </text>
    </svg>
  );
}

function useTornadoOption(reduced: boolean): ChartOption {
  return useMemo(() => {
    const data = DRIVERS.traces.map((trace) => ({
      id: trace.id,
      category: trace.category,
      value: trace.value,
    }));
    const base = buildCategoryBarChartOption(data, {
      colors: [INK.amber],
      reducedMotion: reduced,
    }) as Rec;
    const series = (base.series as Rec[]).map((s) => ({
      ...s,
      barMaxWidth: 22,
      itemStyle: {
        color: (params: { dataIndex: number }) => (params.dataIndex < 2 ? INK.red : INK.amber),
      },
    }));
    const axis = (extra?: Rec): Rec => ({
      axisLine: { lineStyle: { color: INK.grid } },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: INK.grid } },
      axisLabel: { color: INK.faint, fontFamily: MONO, fontSize: 9 },
      ...extra,
    });
    return {
      ...base,
      series,
      backgroundColor: 'transparent',
      textStyle: { fontFamily: MONO, color: INK.faint },
      tooltip: {
        trigger: 'axis',
        backgroundColor: INK.panel,
        borderColor: INK.grid,
        textStyle: { color: INK.text, fontFamily: MONO, fontSize: 11 },
      },
      xAxis: {
        ...(base.xAxis as Rec),
        ...axis({
          splitLine: { show: false },
          axisLabel: { color: INK.faint, fontFamily: MONO, fontSize: 8.5, interval: 0, rotate: 14 },
        }),
      },
      yAxis: { ...(base.yAxis as Rec), ...axis() },
    };
  }, [reduced]);
}

export default function WindTunnelPage() {
  const { reduced } = useMotionPreference();
  const tornadoOption = useTornadoOption(reduced);
  const tornadoTable = useMemo(
    () =>
      buildCategoryBarChartTable(
        DRIVERS.traces.map((trace) => ({ id: trace.id, category: trace.category, value: trace.value })),
      ),
    [],
  );

  return (
    <div className="wt-root" data-testid="live-wind-tunnel" data-reduced={reduced ? 'true' : undefined}>
      <header className="wt-chrome" data-part-id="db-scenario-stress-simulator/chrome">
        <div className="wt-chrome-left">
          <RouterLink to="/" className="wt-back">
            ◄ GALLERY
          </RouterLink>
          <span className="wt-chrome-rule" aria-hidden="true" />
          <span className="wt-chrome-mast">{TUNNEL.masthead}</span>
        </div>
        <div className="wt-chrome-right">
          <span>{TUNNEL.standard}</span>
          <span className="wt-chrome-rule" aria-hidden="true" />
          <span className="wt-chrome-session">{TUNNEL.session}</span>
        </div>
      </header>

      <main className="wt-main">
        <section className="wt-tunnel" aria-labelledby="wt-statement" data-part-id="db-scenario-stress-simulator/tunnel">
          <p className="wt-kicker">{TUNNEL.kicker}</p>
          <h1 id="wt-statement" className="wt-statement">
            {TUNNEL.statement}
          </h1>
          <p className="wt-subline">{TUNNEL.subline}</p>
          <dl className="wt-figures" data-part-id="db-scenario-stress-simulator/tunnel/figures">
            {TUNNEL.figures.map((figure) => (
              <div key={figure.label} className="wt-figure">
                <dt>{figure.label}</dt>
                <dd>{figure.value}</dd>
              </div>
            ))}
          </dl>
          <p className="wt-provenance">{TUNNEL.provenance}</p>
        </section>

        <section className="wt-band" aria-labelledby="wt-rigs-heading" data-part-id="db-scenario-stress-simulator/rigs">
          <h2 id="wt-rigs-heading" className="wt-band-heading">
            {RIGS.title}
            <span className="wt-band-sub">{RIGS.sub}</span>
          </h2>
          <div className="wt-rigs" data-part-id="db-scenario-stress-simulator/rigs/gauge-cluster">
            {RIGS.items.map((rig) => (
              <article key={rig.id} className="wt-rig" data-severity={rig.severity}>
                <header className="wt-rig-head">
                  <span className="wt-rig-code">{rig.code}</span>
                  <span className="wt-rig-name">{rig.name}</span>
                  <span className="wt-rig-verdict" data-verdict={rig.verdict}>
                    {rig.verdict === 'binding' ? 'BINDING' : rig.verdict.toUpperCase()}
                  </span>
                </header>
                <p className="wt-rig-desc">{rig.description}</p>
                <RigGaugeDial rig={rig} />
                <p className="wt-rig-verdict-note" data-verdict={rig.verdict}>
                  {rig.verdictNote}
                </p>
                <dl className="wt-rig-reads">
                  <div>
                    <dt>LOSSES</dt>
                    <dd>{rig.lossFigure}</dd>
                  </div>
                  <div>
                    <dt>LIQUIDITY</dt>
                    <dd>{rig.lcr}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <div className="wt-columns">
          <section className="wt-band" aria-labelledby="wt-drivers-heading" data-part-id="db-scenario-stress-simulator/drivers">
            <h2 id="wt-drivers-heading" className="wt-band-heading">
              {DRIVERS.title}
              <span className="wt-band-sub">{DRIVERS.sub}</span>
            </h2>
            <div data-part-id="db-scenario-stress-simulator/drivers/tornado-chart">
              <ChartFigure
                title={DRIVERS.chartTitle}
                sourceNote={DRIVERS.chartSource}
                option={tornadoOption}
                tableColumns={tornadoTable.columns}
                tableRows={tornadoTable.rows}
                height={290}
                reducedMotion={reduced}
              />
            </div>
          </section>

          <section className="wt-band" aria-labelledby="wt-trace-heading" data-part-id="db-scenario-stress-simulator/trace-table">
            <h2 id="wt-trace-heading" className="wt-band-heading">
              Trace detail
              <span className="wt-band-sub">Baseline → severe, per driver</span>
            </h2>
            <div className="wt-trace-wrap">
              <table className="wt-trace">
                <caption>
                  <VisuallyHidden>
                    Driver traces — each instrumented driver with its baseline and severe readings
                    and its contribution to capital depletion in basis points.
                  </VisuallyHidden>
                </caption>
                <thead>
                  <tr>
                    <th scope="col">DRIVER</th>
                    <th scope="col">BASE</th>
                    <th scope="col">SEVERE</th>
                    <th scope="col" className="wt-num">
                      Δ CET1
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {DRIVERS.traces.map((trace, i) => (
                    <tr key={trace.id} data-lead={i < 2 ? 'true' : undefined}>
                      <th scope="row">
                        {trace.category}
                        <span className="wt-trace-note">{trace.note}</span>
                      </th>
                      <td>{trace.baseline}</td>
                      <td>{trace.severe}</td>
                      <td className="wt-num">{trace.value} bps</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <section className="wt-band" aria-labelledby="wt-reading-heading" data-part-id="db-scenario-stress-simulator/reading">
          <h2 id="wt-reading-heading" className="wt-band-heading">
            {READING.title}
            <span className="wt-band-sub">{READING.sub}</span>
          </h2>
          <div className="wt-reading">
            {READING.paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </section>
      </main>

      <footer className="wt-foot">
        <p>{FOOT.note}</p>
        <p className="wt-foot-line">
          <span>{TUNNEL.provenance}</span>
          <span>{FOOT.next}</span>
        </p>
      </footer>
    </div>
  );
}
