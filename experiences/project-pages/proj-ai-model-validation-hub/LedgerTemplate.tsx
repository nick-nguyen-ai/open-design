/**
 * "The Validation Ledger" — the world-TEMPLATE. Carries the whole craft of
 * `proj-ai-model-validation-hub` and renders it from a typed {@link LedgerFill}
 * (content slots only). `LedgerPage` is now a thin wrapper that hands this
 * component the shipped fill; the rendered output is what the page rendered
 * before templatization.
 *
 * A programme hub that reads like a well-edited board paper crossed with a
 * working ledger. The commanding visual is the validation pipeline ledger:
 * every in-flight model on the road from intake to sign-off, revealed in reading
 * order (LedgerReveal), with the one stalled item the page is arranged around.
 * The pipeline is fixed-slot (a four-column grid): the stage id set is pinned by
 * the schema; the fill re-labels the stages and rewrites their content.
 *
 * Anomaly: exactly one ledger model carries `status: 'stalled'` — the single
 * flagged item held past the stall threshold, marked with the sienna stall stamp
 * and stall note on the track and flagged in the mirror table.
 *
 * Art-direction licence (task 13): this file and ledger.css are the
 * experience-local art layer — raw colour values are permitted HERE only.
 * Shared components consume tokens (the theme is locked to light by
 * LiveExperience, not re-locked here); motion easings/durations remain
 * token-driven.
 */
import { useEffect, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { LedgerReveal, useMotionPreference } from '@enterprise-design/motion';
import {
  ChartFigure,
  buildTrendChartOption,
  buildTrendChartTable,
} from '@enterprise-design/data-viz';
import type { ChartOption, TrendChartSeriesInput } from '@enterprise-design/data-viz';
import { KpiTile, StatusList } from '@enterprise-design/content-components';
import { buildFlowDiagramOutline } from '@enterprise-design/diagrams';
import type { FlowDiagramData } from '@enterprise-design/diagrams';
import { VisuallyHidden } from '@enterprise-design/primitives';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import './ledger.css';
import type { LedgerFill, LedgerModel, LedgerStage, LedgerOutcome } from './ledger-fill.js';

/* ---------------------------------------------------------------- */
/* Local chart ink (experience-local art layer — licence §1)         */
/* ---------------------------------------------------------------- */

const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const INK = {
  ink: '#1d242b',
  muted: '#5f6a72',
  green: '#2e6e54',
  sienna: '#a8442c',
  grid: 'rgba(29, 36, 43, 0.14)',
  paper: '#f6f5f0',
} as const;

type Rec = Record<string, unknown>;

/** The recent-outcomes display vocabulary — a fixed enum→label map (chrome). */
const OUTCOME_LABEL: Record<LedgerOutcome, string> = {
  approved: 'APPROVED',
  'approved-with-conditions': 'APPROVED W/ CONDITIONS',
  rejected: 'REJECTED',
};

function useThroughputOption(reduced: boolean, series: TrendChartSeriesInput[]): ChartOption {
  return useMemo(() => {
    const base = buildTrendChartOption([...series], {
      colors: [INK.muted, INK.green],
      unit: 'models',
      reducedMotion: reduced,
      showAverageLine: false,
    }) as Rec;
    const axisInk = {
      axisLine: { lineStyle: { color: INK.grid } },
      axisTick: { show: false },
      axisLabel: { color: INK.muted, fontFamily: MONO, fontSize: 10 },
      nameTextStyle: { color: INK.muted, fontFamily: MONO },
    };
    const seriesOption = (base.series as Rec[]).map((s) => ({
      ...s,
      symbolSize: 5,
      ...(s.id === 'intake'
        ? { lineStyle: { ...(s.lineStyle as Rec), width: 1.25, type: 'dashed' } }
        : { lineStyle: { ...(s.lineStyle as Rec), width: 2 } }),
    }));
    return {
      ...base,
      series: seriesOption,
      backgroundColor: 'transparent',
      textStyle: { fontFamily: MONO, color: INK.muted },
      legend: {
        top: 0,
        icon: 'rect',
        itemWidth: 14,
        itemHeight: 2,
        textStyle: { color: INK.ink, fontFamily: MONO, fontSize: 10 },
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#ffffff',
        borderColor: INK.grid,
        textStyle: { color: INK.ink, fontFamily: MONO, fontSize: 11 },
      },
      grid: { left: 36, right: 16, top: 40, bottom: 30 },
      xAxis: {
        ...(base.xAxis as Rec),
        ...axisInk,
        axisLabel: { ...axisInk.axisLabel, interval: 1 },
        splitLine: { show: false },
      },
      yAxis: {
        ...(base.yAxis as Rec),
        ...axisInk,
        minInterval: 1,
        splitLine: { lineStyle: { color: INK.grid } },
      },
    } as ChartOption;
  }, [reduced, series]);
}

/* ---------------------------------------------------------------- */
/* Pipeline derivations (from the fill's stages + models)             */
/* ---------------------------------------------------------------- */

function stageIndex(stages: readonly LedgerStage[], id: string): number {
  return stages.findIndex((stage) => stage.id === id);
}

function stageCount(models: readonly LedgerModel[], stageId: string): number {
  return models.filter((model) => model.stage === stageId).length;
}

/* ---------------------------------------------------------------- */
/* The bespoke pipeline ledger (visual; mirrored by band 01's table)  */
/* ---------------------------------------------------------------- */

function LedgerRow({
  entry,
  stages,
  stallThresholdDays,
}: {
  entry: LedgerModel;
  stages: readonly LedgerStage[];
  stallThresholdDays: number;
}) {
  const currentIndex = stageIndex(stages, entry.stage);
  const stalled = entry.status === 'stalled';
  return (
    <div className="lg-row" data-stalled={stalled ? 'true' : undefined}>
      <div className="lg-row-id">
        <span className="lg-row-model">{entry.model}</span>
        <span className="lg-row-meta">
          {entry.version.toUpperCase()} · T{entry.tier} · {entry.owner.toUpperCase()}
        </span>
      </div>
      <div className="lg-track">
        {stages.map((stage, i) => {
          const state = i < currentIndex ? 'done' : i === currentIndex ? 'current' : 'ahead';
          return (
            <div key={stage.id} className="lg-cell" data-state={state}>
              {state === 'done' ? <span className="lg-trail" /> : null}
              {state === 'current' ? (
                <span className="lg-marker" data-stalled={stalled ? 'true' : undefined}>
                  <span className="lg-marker-days">{entry.daysInStage}D</span>
                  {stalled ? <span className="lg-stamp">STALLED</span> : null}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="lg-row-target">{entry.targetSignOff}</div>
      {stalled && entry.stall ? (
        <p className="lg-stall-note">
          <span className="lg-stall-note-flag">⚑ {entry.daysInStage} DAYS IN STAGE · THRESHOLD {stallThresholdDays} —</span>{' '}
          {entry.stall.reason} {entry.stall.escalation}
        </p>
      ) : null}
    </div>
  );
}

function PipelineLedger({
  rowLegend,
  stages,
  models,
  stallThresholdDays,
}: {
  rowLegend: string;
  stages: readonly LedgerStage[];
  models: readonly LedgerModel[];
  stallThresholdDays: number;
}) {
  return (
    <div className="lg-ledger" aria-hidden="true">
      <div className="lg-stage-head">
        <div className="lg-stage-head-lead">{rowLegend}</div>
        {stages.map((stage, i) => (
          <div key={stage.id} className="lg-stage-col">
            <span className="lg-stage-no">{String(i + 1).padStart(2, '0')}</span>
            <span className="lg-stage-label">{stage.label}</span>
            <span className="lg-stage-count">{stageCount(models, stage.id)} IN STAGE</span>
            <span className="lg-stage-rule">EXIT — {stage.exitRule.toUpperCase()}</span>
          </div>
        ))}
        <div className="lg-stage-head-target">TARGET</div>
      </div>
      <LedgerReveal
        className="lg-rows"
        items={models.map((entry) => ({
          id: entry.id,
          content: <LedgerRow entry={entry} stages={stages} stallThresholdDays={stallThresholdDays} />,
        }))}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* The template                                                      */
/* ---------------------------------------------------------------- */

export default function LedgerTemplate({ fill }: { fill: LedgerFill }) {
  const { reduced } = useMotionPreference();
  const { office, hero, pipeline, table, posture, outcomes, decisions } = fill;
  // The tables' subject-noun header is the first token of the fill's row
  // legend ("MODEL · TIER · OWNER" → "MODEL"; an agent programme gets AGENT) —
  // the subject is content, not chrome.
  const subjectNoun = pipeline.rowLegend.split('·')[0]!.trim() || 'ITEM';

  useEffect(() => {
    // Derived from the fill: a different programme gets a truthful tab title
    // (" — Live" is the gallery live-route suffix, chrome not content).
    document.title = `${office.pageTitle} — Live`;
  }, [office.pageTitle]);

  // The pipeline flow (stage-key outline) is DERIVED from the stages: each stage
  // is a node; each stage after the first carries the label of the edge into it.
  const pipelineFlow = useMemo<FlowDiagramData>(
    () => ({
      nodes: pipeline.stages.map((stage) => ({ id: stage.id, label: stage.label, kind: stage.flowKind })),
      edges: pipeline.stages.slice(1).map((stage, i) => {
        const from = pipeline.stages[i] as LedgerStage;
        return { id: `e-${from.id}-${stage.id}`, from: from.id, to: stage.id, label: stage.flowInboundLabel ?? '' };
      }),
    }),
    [pipeline.stages],
  );
  const stageKey = useMemo(() => buildFlowDiagramOutline(pipelineFlow), [pipelineFlow]);

  const throughputSeries = useMemo<TrendChartSeriesInput[]>(
    () => posture.throughput.map((s) => ({ id: s.id, label: s.label, points: [...s.points] })),
    [posture.throughput],
  );
  const throughputOption = useThroughputOption(reduced, throughputSeries);
  const throughputTable = useMemo(() => buildTrendChartTable([...throughputSeries]), [throughputSeries]);

  return (
    <div className="lg-root" data-testid="live-programme" data-reduced={reduced ? 'true' : undefined}>
      <header className="lg-chrome" aria-label="Programme office chrome">
        <div className="lg-chrome-cell">
          <RouterLink to="/" className="lg-back">
            ◄ GALLERY
          </RouterLink>
          <span className="lg-chrome-rule" aria-hidden="true" />
          <span>{office.programmeName}</span>
        </div>
        <div className="lg-chrome-cell">
          <span>
            {office.programmeCode} · {office.reportingPeriod}
          </span>
          <span className="lg-chrome-rule" aria-hidden="true" />
          <span className="lg-rag" data-testid="rag-posture">
            RAG {office.rag} — {office.ragReason}
          </span>
        </div>
      </header>

      <main className="lg-main">
        <section className="lg-hero" aria-labelledby="lg-statement">
          <p className="lg-kicker">{hero.kicker} · {office.reportingPeriod}</p>
          <h1 id="lg-statement" className="lg-display">
            {hero.statementLines.map((line, i) => (
              <span key={i} className="lg-display-line">
                {line}
              </span>
            ))}
          </h1>
          <p className="lg-subline">{hero.subline}</p>
          <dl className="lg-facts" aria-label="Programme facts">
            {hero.facts.map((fact) => (
              <div key={fact.label} className="lg-fact">
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="lg-ledger-section" aria-labelledby="lg-ledger-heading">
          <h2 id="lg-ledger-heading" className="lg-band-heading">
            <span className="lg-band-index">§1</span> {pipeline.bandTitle}
            <span className="lg-band-sub">{pipeline.bandSub}</span>
          </h2>
          <VisuallyHidden>{pipeline.a11yCaption}</VisuallyHidden>
          <PipelineLedger
            rowLegend={pipeline.rowLegend}
            stages={pipeline.stages}
            models={pipeline.models}
            stallThresholdDays={pipeline.stallThresholdDays}
          />
          <div className="lg-stage-key" aria-label="Stage key">
            <span className="lg-stage-key-title">STAGE KEY</span>
            <ul>
              {stageKey.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
            <span className="lg-stage-key-note">
              {pipeline.stageKeyNote} {pipeline.stallThresholdDays} DAYS
            </span>
          </div>
        </section>

        <section className="lg-band" aria-labelledby="lg-table-heading">
          <h2 id="lg-table-heading" className="lg-band-heading">
            <span className="lg-band-index">§2</span> {table.bandTitle}
            <span className="lg-band-sub">{table.bandSub}</span>
          </h2>
          <div className="lg-table-wrap">
            <table className="lg-table" data-testid="ledger-table">
              <caption>
                <VisuallyHidden>{table.caption}</VisuallyHidden>
              </caption>
              <thead>
                <tr>
                  <th scope="col">{subjectNoun}</th>
                  <th scope="col">TIER</th>
                  <th scope="col">OWNER</th>
                  <th scope="col">STAGE</th>
                  <th scope="col" className="lg-num">
                    DAYS
                  </th>
                  <th scope="col">ENTERED</th>
                  <th scope="col">TARGET</th>
                  <th scope="col">NOTE</th>
                </tr>
              </thead>
              <tbody>
                {pipeline.models.map((entry) => (
                  <tr key={entry.id} data-stalled={entry.status === 'stalled' ? 'true' : undefined}>
                    <th scope="row">
                      {entry.model} <span className="lg-table-ver">{entry.version}</span>
                    </th>
                    <td>T{entry.tier}</td>
                    <td>{entry.owner}</td>
                    <td>{pipeline.stages[stageIndex(pipeline.stages, entry.stage)]?.label}</td>
                    <td className="lg-num" data-over={entry.daysInStage > pipeline.stallThresholdDays || undefined}>
                      {entry.daysInStage}
                    </td>
                    <td className="lg-num">{entry.enteredStage}</td>
                    <td className="lg-num">{entry.targetSignOff}</td>
                    <td className="lg-note-cell">
                      {entry.status === 'stalled' && entry.stall ? `STALLED — ${entry.stall.reason}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="lg-band" aria-labelledby="lg-posture-heading">
          <h2 id="lg-posture-heading" className="lg-band-heading">
            <span className="lg-band-index">§3</span> {posture.bandTitle}
            <span className="lg-band-sub">{posture.bandSub}</span>
          </h2>
          <div className="lg-posture-grid">
            <KpiTile title={posture.kpiTitle} metrics={[...posture.kpis]} className="lg-kpis" />
            <figure className="lg-exhibit">
              <div className="lg-exhibit-head">
                <span className="lg-exhibit-no">{posture.exhibit.number}</span>
                <span>{posture.exhibit.title.toUpperCase()}</span>
              </div>
              <ChartFigure
                title={`${posture.exhibit.number} — ${posture.exhibit.title}`}
                sourceNote={posture.exhibit.source}
                option={throughputOption}
                tableColumns={throughputTable.columns}
                tableRows={throughputTable.rows}
                height={260}
                reducedMotion={reduced}
              />
              <figcaption className="lg-exhibit-caption">{posture.exhibit.caption}</figcaption>
            </figure>
          </div>
        </section>

        <section className="lg-band" aria-labelledby="lg-outcomes-heading">
          <h2 id="lg-outcomes-heading" className="lg-band-heading">
            <span className="lg-band-index">§4</span> {outcomes.bandTitle}
            <span className="lg-band-sub">{outcomes.bandSub}</span>
          </h2>
          <div className="lg-table-wrap">
            <table className="lg-table lg-outcomes" data-testid="outcomes-table">
              <caption>
                <VisuallyHidden>{outcomes.caption}</VisuallyHidden>
              </caption>
              <thead>
                <tr>
                  <th scope="col">REF</th>
                  <th scope="col">DATE</th>
                  <th scope="col">{subjectNoun}</th>
                  <th scope="col">TIER</th>
                  <th scope="col">OUTCOME</th>
                  <th scope="col" className="lg-num">
                    FINDINGS
                  </th>
                  <th scope="col">VALIDATOR</th>
                </tr>
              </thead>
              <tbody>
                {outcomes.rows.map((row) => (
                  <tr key={row.ref} id={`lg-${row.ref}`} data-outcome={row.outcome}>
                    <th scope="row">
                      <a className="lg-ref" href={`#lg-${row.ref}`}>
                        {row.ref}
                      </a>
                    </th>
                    <td className="lg-num">{row.date}</td>
                    <td>{row.model}</td>
                    <td>T{row.tier}</td>
                    <td>
                      <span className="lg-outcome" data-outcome={row.outcome}>
                        {OUTCOME_LABEL[row.outcome]}
                      </span>
                    </td>
                    <td className="lg-num">{row.findings}</td>
                    <td>{row.validator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="lg-band" aria-labelledby="lg-decisions-heading">
          <h2 id="lg-decisions-heading" className="lg-band-heading">
            <span className="lg-band-index">§5</span> {decisions.bandTitle}
            <span className="lg-band-sub">{decisions.bandSub}</span>
          </h2>
          <div className="lg-decisions-grid">
            <div className="lg-decision-log">
              <h3 className="lg-panel-heading">{decisions.decisionLogHeading}</h3>
              <ol className="lg-decision-list">
                {decisions.log.map((entry) => (
                  <li key={`${entry.date}-${entry.owner}`} className="lg-decision">
                    <span className="lg-decision-date">{entry.date}</span>
                    <span className="lg-decision-body">
                      <span className="lg-decision-text">{entry.decision}</span>
                      <span className="lg-decision-meta">
                        {entry.owner} · <strong>{entry.disposition}</strong>
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="lg-wire">
              <h3 className="lg-panel-heading">{decisions.wireHeading}</h3>
              <StatusList title={decisions.wireTitle} items={[...decisions.wire]} />
            </div>
          </div>
        </section>
      </main>

      <footer className="lg-footer">
        <span>{office.editionLine}</span>
        <span>
          {office.issued} · {office.director}
        </span>
      </footer>
    </div>
  );
}
