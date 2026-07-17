/**
 * "The Lab Bench" — the live full-bleed rendering of
 * `db-experiment-analysis-workspace`.
 *
 * A data-science team's experiment workspace held to the standard of a
 * published lab notebook: hypothesis cards taped to the bench with earned
 * verdict stamps, a pre-registered run ledger, the uplift evidence drawn run
 * by run against the promotion bar, and the decisions the bench has filed.
 * Grammar: research-notebook; signature: data-ink-draw; motion level 1;
 * locked light; density high.
 *
 * Art-direction licence: this file and lab-bench.css are the experience-local
 * art layer — raw colour values are permitted HERE only.
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
import '@fontsource-variable/inter/index.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import '@fontsource/caveat/500.css';
import './lab-bench.css';
import {
  BENCH,
  DECISIONS,
  EVIDENCE,
  FOOT,
  HYPOTHESES,
  RUNS,
  type HypothesisState,
  type RunVerdict,
} from './content.js';

type Rec = Record<string, unknown>;

const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const INK = {
  ink: '#26251f',
  faint: '#6e6a5c',
  verdictGreen: '#2f5d43',
  refuteRed: '#a03123',
  pencilBlue: '#31548e',
  grid: 'rgba(110, 106, 92, 0.18)',
  paper: '#f8f6ee',
} as const;

const STATE_STAMP: Record<HypothesisState, string> = {
  gathering: 'GATHERING',
  supported: 'SUPPORTED',
  refuted: 'REFUTED',
};

const VERDICT_MARK: Record<RunVerdict, string> = {
  uplift: '▲ UPLIFT',
  flat: '– FLAT',
  regression: '▼ REGRESSION',
};

function useUpliftOption(reduced: boolean): ChartOption {
  return useMemo(() => {
    const base = buildTrendChartOption(
      [{ id: 'uplift', label: 'AUC uplift vs baseline', points: EVIDENCE.points }],
      { colors: [INK.pencilBlue], reducedMotion: reduced, showAverageLine: false },
    ) as Rec;
    const series = (base.series as Rec[]).map((s) => ({
      ...s,
      symbolSize: 7,
      lineStyle: { ...(s.lineStyle as Rec), width: 1.5 },
      markLine: {
        silent: true,
        symbol: 'none',
        lineStyle: { color: INK.verdictGreen, type: 'dashed' as const, width: 1 },
        label: {
          formatter: 'PROMOTION BAR +0.010',
          color: INK.verdictGreen,
          fontFamily: MONO,
          fontSize: 9,
          position: 'insideEndBottom' as const,
        },
        data: [{ yAxis: EVIDENCE.promotionBar }],
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
        backgroundColor: INK.paper,
        borderColor: INK.grid,
        textStyle: { color: INK.ink, fontFamily: MONO, fontSize: 11 },
      },
      xAxis: { ...(base.xAxis as Rec), ...axis({ splitLine: { show: false } }) },
      yAxis: { ...(base.yAxis as Rec), min: 0, max: 0.02, ...axis() },
    };
  }, [reduced]);
}

export default function LabBenchPage() {
  const { reduced } = useMotionPreference();
  const upliftOption = useUpliftOption(reduced);
  const upliftTable = useMemo(
    () => buildTrendChartTable([{ id: 'uplift', label: 'AUC uplift vs baseline', points: EVIDENCE.points }]),
    [],
  );

  return (
    <div className="lb-root" data-testid="live-lab-bench" data-reduced={reduced ? 'true' : undefined}>
      <header className="lb-chrome" data-part-id="db-experiment-analysis-workspace/chrome">
        <div className="lb-chrome-row">
          <RouterLink to="/" className="lb-back">
            ◄ GALLERY
          </RouterLink>
          <span className="lb-chrome-mast">{BENCH.masthead}</span>
          <span>{BENCH.notebookRef}</span>
        </div>
        <div className="lb-chrome-row lb-chrome-row-sub">
          <span>{BENCH.standard}</span>
          <span className="lb-provenance">{BENCH.provenance}</span>
        </div>
      </header>

      <main className="lb-main">
        <section className="lb-bench" aria-labelledby="lb-statement" data-part-id="db-experiment-analysis-workspace/bench">
          <p className="lb-kicker">{BENCH.kicker}</p>
          <h1 id="lb-statement" className="lb-statement">
            {BENCH.statement}
          </h1>
          <p className="lb-subline">{BENCH.subline}</p>
          <dl className="lb-figures" data-part-id="db-experiment-analysis-workspace/bench/figures">
            {BENCH.figures.map((figure) => (
              <div key={figure.label} className="lb-figure">
                <dt>{figure.label}</dt>
                <dd>{figure.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="lb-band" aria-labelledby="lb-hyp-heading" data-part-id="db-experiment-analysis-workspace/hypotheses">
          <h2 id="lb-hyp-heading" className="lb-band-heading">
            <span className="lb-band-index">§1</span> {HYPOTHESES.title}
            <span className="lb-band-sub">{HYPOTHESES.sub}</span>
          </h2>
          <div className="lb-cards" data-part-id="db-experiment-analysis-workspace/hypotheses/cards">
            {HYPOTHESES.items.map((hypothesis, i) => (
              <article key={hypothesis.id} className="lb-card" data-state={hypothesis.state} style={{ ['--lb-card' as string]: i }}>
                <span className="lb-card-tape" aria-hidden="true" />
                <header className="lb-card-head">
                  <span className="lb-card-ref">{hypothesis.ref}</span>
                  <span className="lb-card-stamp" data-state={hypothesis.state}>
                    {STATE_STAMP[hypothesis.state]}
                  </span>
                </header>
                <p className="lb-card-statement">{hypothesis.statement}</p>
                <p className="lb-card-evidence">{hypothesis.evidenceNote}</p>
                <footer className="lb-card-foot">
                  <span>
                    {hypothesis.owner.toUpperCase()} · STAKE: {hypothesis.stake.toUpperCase()}
                  </span>
                </footer>
                <p className="lb-card-margin" aria-hidden="true">
                  {hypothesis.marginNote}
                </p>
              </article>
            ))}
          </div>
        </section>

        <div className="lb-columns">
          <section className="lb-band" aria-labelledby="lb-runs-heading" data-part-id="db-experiment-analysis-workspace/runs">
            <h2 id="lb-runs-heading" className="lb-band-heading">
              <span className="lb-band-index">§2</span> {RUNS.title}
              <span className="lb-band-sub">{RUNS.sub}</span>
            </h2>
            <div className="lb-ledger-wrap">
              <table className="lb-ledger" data-part-id="db-experiment-analysis-workspace/runs/ledger">
                <caption>
                  <VisuallyHidden>{RUNS.caption}</VisuallyHidden>
                </caption>
                <thead>
                  <tr>
                    <th scope="col">RUN</th>
                    <th scope="col">HYP</th>
                    <th scope="col">CONFIG DELTA</th>
                    <th scope="col">PRIMARY METRIC</th>
                    <th scope="col">CI</th>
                    <th scope="col">VERDICT</th>
                    <th scope="col">DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {RUNS.items.map((run) => (
                    <tr key={run.id} data-verdict={run.verdict}>
                      <th scope="row">{run.run}</th>
                      <td>{run.hypothesisRef}</td>
                      <td className="lb-ledger-delta">{run.delta}</td>
                      <td className="lb-ledger-metric">{run.metric}</td>
                      <td className="lb-ledger-ci">{run.ci}</td>
                      <td>
                        <span className="lb-verdict" data-verdict={run.verdict}>
                          {VERDICT_MARK[run.verdict]}
                        </span>
                      </td>
                      <td className="lb-ledger-date">{run.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="lb-band" aria-labelledby="lb-evidence-heading" data-part-id="db-experiment-analysis-workspace/evidence">
            <h2 id="lb-evidence-heading" className="lb-band-heading">
              <span className="lb-band-index">§3</span> {EVIDENCE.title}
              <span className="lb-band-sub">{EVIDENCE.sub}</span>
            </h2>
            <div data-part-id="db-experiment-analysis-workspace/evidence/uplift-chart">
              <ChartFigure
                title={EVIDENCE.chartTitle}
                sourceNote={EVIDENCE.chartSource}
                option={upliftOption}
                tableColumns={upliftTable.columns}
                tableRows={upliftTable.rows}
                height={250}
                reducedMotion={reduced}
              />
            </div>
            <p className="lb-reading">{EVIDENCE.reading}</p>
          </section>
        </div>

        <section className="lb-band" aria-labelledby="lb-decisions-heading" data-part-id="db-experiment-analysis-workspace/decisions">
          <h2 id="lb-decisions-heading" className="lb-band-heading">
            <span className="lb-band-index">§4</span> {DECISIONS.title}
            <span className="lb-band-sub">{DECISIONS.sub}</span>
          </h2>
          <ul className="lb-decisions">
            {DECISIONS.items.map((decision) => (
              <li key={decision.id} className="lb-decision" data-outcome={decision.outcome}>
                <span className="lb-decision-ref">{decision.ref}</span>
                <div className="lb-decision-body">
                  <p className="lb-decision-text">{decision.decision}</p>
                  <p className="lb-decision-basis">STOOD ON · {decision.basis}</p>
                </div>
                <span className="lb-decision-outcome" data-outcome={decision.outcome}>
                  {decision.outcome.toUpperCase()}
                </span>
                <span className="lb-decision-filed">{decision.filed}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="lb-foot">
        <p>{FOOT.note}</p>
        <p className="lb-foot-line">
          <span>{BENCH.provenance}</span>
          <span>{FOOT.next}</span>
        </p>
      </footer>
    </div>
  );
}
