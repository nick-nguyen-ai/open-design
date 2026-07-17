/**
 * "The Triage Bay" — the live full-bleed rendering of
 * `db-incident-remediation-centre`.
 *
 * Incident state as a hospital ward monitor: every incident is a patient
 * chart moving through four lanes (triage → containment → remediation →
 * review), the one critical case owns the board with live vitals and timed
 * interventions, and discharge has a protocol. Grammar: living-system (the
 * board breathes — an ECG pulse on the critical chart); signature:
 * data-ink-draw; motion level 2; locked dark.
 *
 * Art-direction licence: this file and triage-bay.css are the
 * experience-local art layer — raw colour values are permitted HERE only.
 *
 * `data-part-id` values are a PUBLIC BORROW CONTRACT (surfaced by the gallery's
 * part inspector, consumed by the design-borrow skill): never rename or remove
 * one without updating LivePartIds.test.tsx.
 */
import { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import {
  ChartFigure,
  buildTrendChartOption,
  buildTrendChartTable,
} from '@enterprise-design/data-viz';
import type { ChartOption } from '@enterprise-design/data-viz';
import { VisuallyHidden } from '@enterprise-design/primitives';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource-variable/inter/index.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import './triage-bay.css';
import { BAY, CASE, FOOT, INCIDENTS, LANES, PROTOCOL, VITALS, WARD } from './content.js';

type Rec = Record<string, unknown>;

const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const INK = {
  monitor: '#5fdcac',
  amber: '#f0b45c',
  red: '#ff6a5e',
  faint: '#7f948f',
  grid: 'rgba(127, 148, 143, 0.16)',
  panel: '#0c1a19',
  text: '#d7e4de',
} as const;

function useVitalsOption(reduced: boolean): ChartOption {
  return useMemo(() => {
    const base = buildTrendChartOption(
      [{ id: 'err', label: 'authorisation error rate %', points: VITALS }],
      { colors: [INK.monitor], reducedMotion: reduced, showAverageLine: false },
    ) as Rec;
    const series = (base.series as Rec[]).map((s) => ({
      ...s,
      showSymbol: false,
      symbol: 'none',
      lineStyle: { ...(s.lineStyle as Rec), width: 1.6 },
      markLine: {
        silent: true,
        symbol: 'none',
        lineStyle: { color: INK.red, type: 'dashed' as const, width: 1 },
        label: {
          formatter: 'DISCHARGE < 0.5%',
          color: INK.red,
          fontFamily: MONO,
          fontSize: 9,
          position: 'insideEndTop' as const,
        },
        data: [{ yAxis: CASE.dischargeThreshold }],
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
      legend: { show: false },
      tooltip: {
        trigger: 'axis',
        backgroundColor: INK.panel,
        borderColor: INK.grid,
        textStyle: { color: INK.text, fontFamily: MONO, fontSize: 11 },
      },
      xAxis: {
        ...(base.xAxis as Rec),
        ...axis({ splitLine: { show: false } }),
        axisLabel: { color: INK.faint, fontFamily: MONO, fontSize: 9, interval: 11 },
      },
      yAxis: { ...(base.yAxis as Rec), min: 0, max: 3, ...axis() },
    };
  }, [reduced]);
}

export default function TriageBayPage() {
  const { reduced } = useMotionPreference();
  const vitalsOption = useVitalsOption(reduced);
  const vitalsTable = useMemo(
    () => buildTrendChartTable([{ id: 'err', label: 'authorisation error rate %', points: VITALS }]),
    [],
  );

  return (
    <div className="tb-root" data-testid="live-triage-bay" data-reduced={reduced ? 'true' : undefined}>
      <header className="tb-chrome" data-part-id="db-incident-remediation-centre/chrome">
        <div className="tb-chrome-left">
          <RouterLink to="/" className="tb-back">
            ◄ GALLERY
          </RouterLink>
          <span className="tb-chrome-rule" aria-hidden="true" />
          <span className="tb-chrome-mast">{BAY.masthead}</span>
        </div>
        <div className="tb-chrome-right">
          <span>{BAY.standard}</span>
          <span className="tb-chrome-rule" aria-hidden="true" />
          <span className="tb-chrome-shift">{BAY.shift}</span>
        </div>
      </header>

      <main className="tb-main">
        <section className="tb-triage" aria-labelledby="tb-statement" data-part-id="db-incident-remediation-centre/triage">
          <p className="tb-kicker">{BAY.kicker}</p>
          <h1 id="tb-statement" className="tb-statement">
            {BAY.statement}
          </h1>
          <p className="tb-subline">{BAY.subline}</p>
          <dl className="tb-figures" data-part-id="db-incident-remediation-centre/triage/figures">
            {BAY.figures.map((figure) => (
              <div key={figure.label} className="tb-figure">
                <dt>{figure.label}</dt>
                <dd>{figure.value}</dd>
              </div>
            ))}
          </dl>
          <p className="tb-provenance">{BAY.provenance}</p>
        </section>

        <section className="tb-band" aria-labelledby="tb-bay-heading" data-part-id="db-incident-remediation-centre/bay">
          <h2 id="tb-bay-heading" className="tb-band-heading">
            {WARD.title}
            <span className="tb-band-sub">{WARD.sub}</span>
          </h2>
          <div className="tb-lanes" data-part-id="db-incident-remediation-centre/bay/lanes">
            {LANES.map((lane) => (
              <section key={lane.id} className="tb-lane" aria-label={`${lane.label} lane`}>
                <h3 className="tb-lane-head">
                  {lane.label}
                  <span className="tb-lane-note">{lane.note}</span>
                </h3>
                <ul className="tb-lane-list">
                  {INCIDENTS.filter((incident) => incident.lane === lane.id).map((incident) => (
                    <li key={incident.id} className="tb-chart" data-severity={incident.severity}>
                      {incident.severity === 'critical' && (
                        <svg className="tb-ecg" viewBox="0 0 120 22" aria-hidden="true">
                          <path
                            className="tb-ecg-line"
                            d="M0,11 H30 L36,11 L40,3 L44,19 L48,8 L52,11 H78 L84,11 L88,4 L92,18 L96,9 L100,11 H120"
                          />
                        </svg>
                      )}
                      <p className="tb-chart-head">
                        <span className="tb-chart-ref">{incident.ref}</span>
                        <span className="tb-chart-sev" data-severity={incident.severity}>
                          {incident.severity.toUpperCase()}
                        </span>
                      </p>
                      <p className="tb-chart-title">{incident.title}</p>
                      <dl className="tb-chart-vitals">
                        <div>
                          <dt>SERVICE</dt>
                          <dd>{incident.service}</dd>
                        </div>
                        <div>
                          <dt>ERR</dt>
                          <dd>{incident.errRate}</dd>
                        </div>
                        <div>
                          <dt>P95</dt>
                          <dd>{incident.p95}</dd>
                        </div>
                      </dl>
                      <p className="tb-chart-foot">
                        <span>{incident.inLane}</span>
                        <span>{incident.owner}</span>
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>

        <section className="tb-band" aria-labelledby="tb-case-heading" data-part-id="db-incident-remediation-centre/case">
          <h2 id="tb-case-heading" className="tb-band-heading">
            {CASE.title}
            <span className="tb-band-sub">{CASE.sub}</span>
          </h2>
          <div className="tb-case-grid">
            <div className="tb-case-vitals" data-part-id="db-incident-remediation-centre/case/vitals-chart">
              <h3 className="tb-panel-heading">{CASE.vitalsHeading}</h3>
              <ChartFigure
                title={CASE.chartTitle}
                sourceNote={CASE.chartSource}
                option={vitalsOption}
                tableColumns={vitalsTable.columns}
                tableRows={vitalsTable.rows}
                height={270}
                reducedMotion={reduced}
              />
            </div>
            <div className="tb-case-log" data-part-id="db-incident-remediation-centre/case/interventions">
              <h3 className="tb-panel-heading">{CASE.interventionsHeading}</h3>
              <ol className="tb-interventions">
                {CASE.interventions.map((item) => (
                  <li key={item.id} className="tb-intervention" data-kind={item.kind}>
                    <span className="tb-intervention-at">{item.at}</span>
                    <div className="tb-intervention-body">
                      <p className="tb-intervention-label">{item.label}</p>
                      <p className="tb-intervention-detail">{item.detail}</p>
                    </div>
                    <span className="tb-intervention-kind">{item.kind.toUpperCase()}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="tb-band" aria-labelledby="tb-protocol-heading" data-part-id="db-incident-remediation-centre/protocol">
          <h2 id="tb-protocol-heading" className="tb-band-heading">
            {PROTOCOL.title}
            <span className="tb-band-sub">{PROTOCOL.sub}</span>
          </h2>
          <ol className="tb-protocol">
            {PROTOCOL.items.map((item, i) => (
              <li key={item.id} className="tb-protocol-item">
                <span className="tb-protocol-num">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <p className="tb-protocol-rule">{item.rule}</p>
                  <p className="tb-protocol-note">{item.note}</p>
                </div>
              </li>
            ))}
          </ol>
          <VisuallyHidden>
            Discharge protocol — three conditions that must all hold before an incident chart
            leaves the bay.
          </VisuallyHidden>
        </section>
      </main>

      <footer className="tb-foot">
        <p>{FOOT.note}</p>
        <p className="tb-foot-line">
          <span>{BAY.provenance}</span>
          <span>{FOOT.next}</span>
        </p>
      </footer>
    </div>
  );
}
