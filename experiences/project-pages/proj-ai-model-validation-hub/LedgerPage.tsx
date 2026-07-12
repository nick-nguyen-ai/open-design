/**
 * "The Validation Ledger" — the live full-bleed rendering of
 * `proj-ai-model-validation-hub`.
 *
 * A programme hub that reads like a well-edited board paper crossed with a
 * working ledger. The commanding visual is the validation pipeline ledger:
 * nine models on the road from intake to sign-off, revealed in reading
 * order (LedgerReveal), with one stalled item the page is arranged around.
 *
 * Art-direction licence (task 13): this file and ledger.css are the
 * experience-local art layer — raw colour values are permitted HERE only.
 * Shared components consume tokens (the page locks the theme to light);
 * motion easings/durations remain token-driven.
 */
import { useEffect, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { LedgerReveal, useMotionPreference } from '@enterprise-design/motion';
import {
  ChartFigure,
  buildTrendChartOption,
  buildTrendChartTable,
} from '@enterprise-design/data-viz';
import type { ChartOption } from '@enterprise-design/data-viz';
import { KpiTile, StatusList } from '@enterprise-design/content-components';
import { buildFlowDiagramOutline } from '@enterprise-design/diagrams';
import { VisuallyHidden } from '@enterprise-design/primitives';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import './ledger.css';
import {
  DECISION_LOG,
  EXHIBIT_A,
  LEDGER,
  OFFICE,
  OUTCOME_LABEL,
  PIPELINE_FLOW,
  PROGRAMME_FACTS,
  PROGRAMME_KPIS,
  PROGRAMME_WIRE,
  RECENT_OUTCOMES,
  STAGES,
  STALLED_ENTRY,
  STALL_THRESHOLD_DAYS,
  STATEMENT,
  STATEMENT_SUBLINE,
  THROUGHPUT_SERIES,
  stageCount,
  stageIndex,
} from './content.js';
import type { LedgerEntry } from './content.js';

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

function useThroughputOption(reduced: boolean): ChartOption {
  return useMemo(() => {
    const base = buildTrendChartOption([...THROUGHPUT_SERIES], {
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
    const series = (base.series as Rec[]).map((s) => ({
      ...s,
      symbolSize: 5,
      ...(s.id === 'intake'
        ? { lineStyle: { ...(s.lineStyle as Rec), width: 1.25, type: 'dashed' } }
        : { lineStyle: { ...(s.lineStyle as Rec), width: 2 } }),
    }));
    return {
      ...base,
      series,
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
  }, [reduced]);
}

/* ---------------------------------------------------------------- */
/* The bespoke pipeline ledger (visual; mirrored by band 01's table)  */
/* ---------------------------------------------------------------- */

function LedgerRow({ entry }: { entry: LedgerEntry }) {
  const currentIndex = stageIndex(entry.stage);
  return (
    <div className="lg-row" data-stalled={entry.stalled ? 'true' : undefined}>
      <div className="lg-row-id">
        <span className="lg-row-model">{entry.model}</span>
        <span className="lg-row-meta">
          {entry.version.toUpperCase()} · T{entry.tier} · {entry.owner.toUpperCase()}
        </span>
      </div>
      <div className="lg-track">
        {STAGES.map((stage, i) => {
          const state = i < currentIndex ? 'done' : i === currentIndex ? 'current' : 'ahead';
          return (
            <div key={stage.id} className="lg-cell" data-state={state}>
              {state === 'done' ? <span className="lg-trail" /> : null}
              {state === 'current' ? (
                <span className="lg-marker" data-stalled={entry.stalled ? 'true' : undefined}>
                  <span className="lg-marker-days">{entry.daysInStage}D</span>
                  {entry.stalled ? <span className="lg-stamp">STALLED</span> : null}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="lg-row-target">{entry.targetSignOff}</div>
      {entry.stalled ? (
        <p className="lg-stall-note">
          <span className="lg-stall-note-flag">⚑ {entry.daysInStage} DAYS IN STAGE · THRESHOLD {STALL_THRESHOLD_DAYS} —</span>{' '}
          {entry.stalled.reason} {entry.stalled.escalation}
        </p>
      ) : null}
    </div>
  );
}

function PipelineLedger() {
  return (
    <div className="lg-ledger" aria-hidden="true">
      <div className="lg-stage-head">
        <div className="lg-stage-head-lead">MODEL · TIER · OWNER</div>
        {STAGES.map((stage, i) => (
          <div key={stage.id} className="lg-stage-col">
            <span className="lg-stage-no">{String(i + 1).padStart(2, '0')}</span>
            <span className="lg-stage-label">{stage.label}</span>
            <span className="lg-stage-count">{stageCount(stage.id)} IN STAGE</span>
            <span className="lg-stage-rule">EXIT — {stage.exitRule.toUpperCase()}</span>
          </div>
        ))}
        <div className="lg-stage-head-target">TARGET</div>
      </div>
      <LedgerReveal
        className="lg-rows"
        items={LEDGER.map((entry) => ({ id: entry.id, content: <LedgerRow entry={entry} /> }))}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* The page                                                          */
/* ---------------------------------------------------------------- */

export default function LedgerPage() {
  const { reduced } = useMotionPreference();

  useEffect(() => {
    document.title = 'The Validation Ledger — Model Validation Programme — Live';
  }, []);

  const stageKey = useMemo(() => buildFlowDiagramOutline(PIPELINE_FLOW), []);
  const throughputOption = useThroughputOption(reduced);
  const throughputTable = useMemo(() => buildTrendChartTable([...THROUGHPUT_SERIES]), []);

  return (
    <div className="lg-root" data-testid="live-programme" data-reduced={reduced ? 'true' : undefined}>
      <header className="lg-chrome" aria-label="Programme office chrome">
        <div className="lg-chrome-cell">
          <RouterLink to="/" className="lg-back">
            ◄ GALLERY
          </RouterLink>
          <span className="lg-chrome-rule" aria-hidden="true" />
          <span>{OFFICE.programmeName}</span>
        </div>
        <div className="lg-chrome-cell">
          <span>
            {OFFICE.programmeCode} · {OFFICE.reportingPeriod}
          </span>
          <span className="lg-chrome-rule" aria-hidden="true" />
          <span className="lg-rag" data-testid="rag-posture">
            RAG {OFFICE.rag} — {OFFICE.ragReason}
          </span>
        </div>
      </header>

      <main className="lg-main">
        <section className="lg-hero" aria-labelledby="lg-statement">
          <p className="lg-kicker">THE VALIDATION LEDGER · {OFFICE.reportingPeriod}</p>
          <h1 id="lg-statement" className="lg-display">
            {STATEMENT.map((line, i) => (
              <span key={i} className="lg-display-line">
                {line}
              </span>
            ))}
          </h1>
          <p className="lg-subline">{STATEMENT_SUBLINE}</p>
          <dl className="lg-facts" aria-label="Programme facts">
            {PROGRAMME_FACTS.map((fact) => (
              <div key={fact.label} className="lg-fact">
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="lg-ledger-section" aria-labelledby="lg-ledger-heading">
          <h2 id="lg-ledger-heading" className="lg-band-heading">
            <span className="lg-band-index">§1</span> THE PIPELINE LEDGER
            <span className="lg-band-sub">
              NINE MODELS IN FLIGHT · READ LEFT TO RIGHT · ONE ITEM STALLED
            </span>
          </h2>
          <VisuallyHidden>
            The pipeline ledger plots nine in-flight models across four validation stages —
            intake, challenge, independent review, sign-off. {STALLED_ENTRY.model} has been in
            independent review for {STALLED_ENTRY.daysInStage} days against a{' '}
            {STALL_THRESHOLD_DAYS}-day stall threshold and is flagged as stalled. The table in
            section 2 carries every entry.
          </VisuallyHidden>
          <PipelineLedger />
          <div className="lg-stage-key" aria-label="Stage key">
            <span className="lg-stage-key-title">STAGE KEY</span>
            <ul>
              {stageKey.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
            <span className="lg-stage-key-note">
              TRAIL = STAGES CLEARED · SQUARE = CURRENT STAGE, DAYS IN STAGE · HATCH + STALLED
              STAMP = CLOCK HELD BEYOND {STALL_THRESHOLD_DAYS} DAYS
            </span>
          </div>
        </section>

        <section className="lg-band" aria-labelledby="lg-table-heading">
          <h2 id="lg-table-heading" className="lg-band-heading">
            <span className="lg-band-index">§2</span> THE LEDGER, LINE BY LINE
            <span className="lg-band-sub">TEXTUAL MIRROR · 9 ENTRIES</span>
          </h2>
          <div className="lg-table-wrap">
            <table className="lg-table" data-testid="ledger-table">
              <caption>
                <VisuallyHidden>
                  The pipeline ledger as a table: nine models with version, tier, owner, current
                  stage, days in stage, date entered, target sign-off, and any stall note.
                </VisuallyHidden>
              </caption>
              <thead>
                <tr>
                  <th scope="col">MODEL</th>
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
                {LEDGER.map((entry) => (
                  <tr key={entry.id} data-stalled={entry.stalled ? 'true' : undefined}>
                    <th scope="row">
                      {entry.model} <span className="lg-table-ver">{entry.version}</span>
                    </th>
                    <td>T{entry.tier}</td>
                    <td>{entry.owner}</td>
                    <td>{STAGES[stageIndex(entry.stage)]?.label}</td>
                    <td className="lg-num" data-over={entry.daysInStage > STALL_THRESHOLD_DAYS || undefined}>
                      {entry.daysInStage}
                    </td>
                    <td className="lg-num">{entry.enteredStage}</td>
                    <td className="lg-num">{entry.targetSignOff}</td>
                    <td className="lg-note-cell">
                      {entry.stalled ? `STALLED — ${entry.stalled.reason}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="lg-band" aria-labelledby="lg-posture-heading">
          <h2 id="lg-posture-heading" className="lg-band-heading">
            <span className="lg-band-index">§3</span> PROGRAMME POSTURE
            <span className="lg-band-sub">PROGRESS & STATUS · SUBORDINATE TO THE LEDGER</span>
          </h2>
          <div className="lg-posture-grid">
            <KpiTile title="Programme measures" metrics={[...PROGRAMME_KPIS]} className="lg-kpis" />
            <figure className="lg-exhibit">
              <div className="lg-exhibit-head">
                <span className="lg-exhibit-no">{EXHIBIT_A.number}</span>
                <span>{EXHIBIT_A.title.toUpperCase()}</span>
              </div>
              <ChartFigure
                title={`${EXHIBIT_A.number} — ${EXHIBIT_A.title}`}
                sourceNote={EXHIBIT_A.source}
                option={throughputOption}
                tableColumns={throughputTable.columns}
                tableRows={throughputTable.rows}
                height={260}
                reducedMotion={reduced}
              />
              <figcaption className="lg-exhibit-caption">{EXHIBIT_A.caption}</figcaption>
            </figure>
          </div>
        </section>

        <section className="lg-band" aria-labelledby="lg-outcomes-heading">
          <h2 id="lg-outcomes-heading" className="lg-band-heading">
            <span className="lg-band-index">§4</span> RECENT OUTCOMES
            <span className="lg-band-sub">LAST SIX DISPOSITIONS · EVIDENCE ON FILE</span>
          </h2>
          <div className="lg-table-wrap">
            <table className="lg-table lg-outcomes" data-testid="outcomes-table">
              <caption>
                <VisuallyHidden>
                  Recent validation outcomes: reference, date, model, tier, outcome, findings
                  raised, and validator.
                </VisuallyHidden>
              </caption>
              <thead>
                <tr>
                  <th scope="col">REF</th>
                  <th scope="col">DATE</th>
                  <th scope="col">MODEL</th>
                  <th scope="col">TIER</th>
                  <th scope="col">OUTCOME</th>
                  <th scope="col" className="lg-num">
                    FINDINGS
                  </th>
                  <th scope="col">VALIDATOR</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_OUTCOMES.map((row) => (
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
            <span className="lg-band-index">§5</span> DECISION LOG & PROGRAMME WIRE
            <span className="lg-band-sub">WHAT THE OFFICE DECIDED · WHAT THE OFFICE HEARD</span>
          </h2>
          <div className="lg-decisions-grid">
            <div className="lg-decision-log">
              <h3 className="lg-panel-heading">DECISION LOG</h3>
              <ol className="lg-decision-list">
                {DECISION_LOG.map((entry) => (
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
              <h3 className="lg-panel-heading">PROGRAMME WIRE</h3>
              <StatusList title="Programme wire" items={[...PROGRAMME_WIRE]} />
            </div>
          </div>
        </section>
      </main>

      <footer className="lg-footer">
        <span>{OFFICE.editionLine}</span>
        <span>
          {OFFICE.issued} · {OFFICE.director}
        </span>
      </footer>
    </div>
  );
}
