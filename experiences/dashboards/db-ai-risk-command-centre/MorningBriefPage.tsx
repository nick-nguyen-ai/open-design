/**
 * "The Morning Brief" — the live full-bleed rendering of
 * `db-ai-risk-command-centre`.
 *
 * A bank-boardroom risk brief printed before the market opens: one monumental
 * posture statement, then a calm ledger of risk domains that each unfold to the
 * model-level evidence behind the line. Grammar: calm-command; signature:
 * ledger-reveal (rows take their seat one by one); motion level 1; locked
 * light. Old-school broadsheet register on purpose — this world is for readers
 * who trust paper.
 *
 * Art-direction licence: this file and morning-brief.css are the
 * experience-local art layer — raw colour values are permitted HERE only;
 * shared components inside keep consuming tokens.
 *
 * `data-part-id` values are a PUBLIC BORROW CONTRACT (surfaced by the gallery's
 * part inspector, consumed by the open-design skill): never rename or remove
 * one without updating LivePartIds.test.tsx.
 */
import { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import {
  ChartFigure,
  buildTrendChartOption,
  buildTrendChartTable,
} from '@enterprise-design/data-viz';
import type { ChartOption } from '@enterprise-design/data-viz';
import { VisuallyHidden } from '@enterprise-design/primitives';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource-variable/fraunces/opsz-italic.css';
import '@fontsource-variable/inter/index.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './morning-brief.css';
import {
  ACTIONS,
  BRIEF,
  CHROME,
  DOMAINS,
  DOMAIN_TRENDS,
  EVIDENCE,
  FOOT,
  LEDGER,
  type AppetiteState,
  type RiskDomain,
} from './content.js';

type Rec = Record<string, unknown>;

const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const INK = {
  text: '#211d15',
  faint: '#6d6557',
  rule: '#d9d1bf',
  oxblood: '#8c2318',
  bottle: '#2e4b3f',
  grid: 'rgba(109, 101, 87, 0.18)',
  paper: '#f7f4ec',
} as const;

const STATE_LABEL: Record<AppetiteState, string> = {
  within: 'WITHIN',
  elevated: 'ELEVATED',
  breach: 'OVER LIMIT',
};

function useUtilisationOption(reduced: boolean, domain: RiskDomain): ChartOption {
  return useMemo(() => {
    const points = DOMAIN_TRENDS[domain.id] ?? [];
    const base = buildTrendChartOption(
      [{ id: 'util', label: `${domain.name} — appetite utilisation`, points }],
      { colors: [domain.state === 'within' ? INK.bottle : INK.oxblood], reducedMotion: reduced, showAverageLine: false },
    ) as Rec;
    const series = (base.series as Rec[]).map((s) => ({
      ...s,
      showSymbol: false,
      symbol: 'none',
      lineStyle: { ...(s.lineStyle as Rec), width: 1.5 },
      markLine: {
        silent: true,
        symbol: 'none',
        lineStyle: { color: INK.oxblood, type: 'dashed' as const, width: 1 },
        label: {
          formatter: 'SOFT LIMIT 80%',
          color: INK.oxblood,
          fontFamily: MONO,
          fontSize: 9,
          position: 'insideEndTop' as const,
        },
        data: [{ yAxis: EVIDENCE.softLimit }],
      },
    }));
    const axis = (extra?: Rec): Rec => ({
      axisLine: { lineStyle: { color: INK.grid } },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: INK.grid } },
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
        borderColor: INK.rule,
        textStyle: { color: INK.text, fontFamily: MONO, fontSize: 11 },
        valueFormatter: (value: unknown) => `${Math.round(Number(value) * 100)}%`,
      },
      xAxis: {
        ...(base.xAxis as Rec),
        ...axis({ splitLine: { show: false } }),
        axisLabel: { color: INK.faint, fontFamily: MONO, fontSize: 9, interval: 21 },
      },
      yAxis: {
        ...(base.yAxis as Rec),
        min: 0,
        max: 1,
        ...axis(),
        axisLabel: {
          color: INK.faint,
          fontFamily: MONO,
          fontSize: 9,
          formatter: (v: number) => `${Math.round(v * 100)}%`,
        },
      },
    };
  }, [reduced, domain]);
}

function UtilisationBar({ domain }: { domain: RiskDomain }) {
  return (
    <span className="mb-util" data-state={domain.state} aria-hidden="true">
      <span className="mb-util-fill" style={{ width: `${Math.round(domain.utilisation * 100)}%` }} />
      <span className="mb-util-limit" style={{ left: `${EVIDENCE.softLimit * 100}%` }} />
    </span>
  );
}

export default function MorningBriefPage() {
  const { reduced } = useMotionPreference();
  const [selectedId, setSelectedId] = useState('genai');
  const selected = DOMAINS.find((d) => d.id === selectedId) ?? DOMAINS[0]!;

  const trendOption = useUtilisationOption(reduced, selected);
  const trendTable = useMemo(
    () =>
      buildTrendChartTable([
        {
          id: 'util',
          label: `${selected.name} — appetite utilisation`,
          points: DOMAIN_TRENDS[selected.id] ?? [],
        },
      ]),
    [selected],
  );

  return (
    <div className="mb-root" data-testid="live-morning-brief" data-reduced={reduced ? 'true' : undefined}>
      <header className="mb-chrome" data-part-id="db-ai-risk-command-centre/chrome">
        <div className="mb-chrome-row">
          <RouterLink to="/" className="mb-back">
            ◄ GALLERY
          </RouterLink>
          <span className="mb-chrome-mast">{CHROME.masthead}</span>
          <span className="mb-chrome-edition">{CHROME.edition}</span>
        </div>
        <div className="mb-chrome-row mb-chrome-row-sub">
          <span>{CHROME.desk}</span>
          <span className="mb-provenance">{CHROME.provenance}</span>
        </div>
      </header>

      <main className="mb-main">
        <section className="mb-brief" aria-labelledby="mb-statement" data-part-id="db-ai-risk-command-centre/brief">
          <p className="mb-kicker">{BRIEF.kicker}</p>
          <h1 id="mb-statement" className="mb-statement" data-part-id="db-ai-risk-command-centre/brief/posture-statement">
            {BRIEF.statement}
          </h1>
          <p className="mb-subline">{BRIEF.subline}</p>
          <dl className="mb-figures" data-part-id="db-ai-risk-command-centre/brief/figures">
            {BRIEF.figures.map((figure) => (
              <div key={figure.label} className="mb-figure">
                <dt>{figure.label}</dt>
                <dd>
                  <span className="mb-figure-value">{figure.value}</span>
                  <span className="mb-figure-note">{figure.note}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mb-band" aria-labelledby="mb-ledger-heading" data-part-id="db-ai-risk-command-centre/ledger">
          <h2 id="mb-ledger-heading" className="mb-band-heading">
            <span className="mb-band-index">I</span> {LEDGER.title}
            <span className="mb-band-sub">{LEDGER.sub}</span>
          </h2>
          <VisuallyHidden>{LEDGER.columnsNote}</VisuallyHidden>
          <ol className="mb-ledger-list">
            {DOMAINS.map((domain, i) => {
              const isSelected = domain.id === selectedId;
              return (
                <li key={domain.id} className="mb-ledger-row" style={{ ['--mb-row' as string]: i }}>
                  <button
                    type="button"
                    className="mb-ledger-line"
                    aria-expanded={isSelected}
                    data-state={domain.state}
                    onClick={() => setSelectedId(domain.id)}
                  >
                    <span className="mb-ledger-name">{domain.name}</span>
                    <span className="mb-ledger-headline">{domain.headline}</span>
                    <span className="mb-ledger-meter">
                      <UtilisationBar domain={domain} />
                      <span className="mb-ledger-pct">{Math.round(domain.utilisation * 100)}%</span>
                    </span>
                    <span className="mb-ledger-count">
                      {domain.modelCount} MODELS · {domain.onWatch} ON WATCH
                    </span>
                    <span className="mb-ledger-state" data-state={domain.state}>
                      {STATE_LABEL[domain.state]}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="mb-band" aria-labelledby="mb-evidence-heading" data-part-id="db-ai-risk-command-centre/evidence">
          <h2 id="mb-evidence-heading" className="mb-band-heading">
            <span className="mb-band-index">II</span> {EVIDENCE.title}
            <span className="mb-band-sub">{EVIDENCE.sub}</span>
          </h2>
          <div className="mb-evidence-grid">
            <div className="mb-reading">
              <h3 className="mb-panel-heading">{selected.name.toUpperCase()} · THE READING</h3>
              <p className="mb-reading-text">{selected.reading}</p>
              <table className="mb-register" data-part-id="db-ai-risk-command-centre/evidence/register">
                <caption>
                  <VisuallyHidden>
                    Models behind the {selected.name} line — name, tier, exposure, state, and note.
                  </VisuallyHidden>
                </caption>
                <thead>
                  <tr>
                    <th scope="col">MODEL</th>
                    <th scope="col">TIER</th>
                    <th scope="col">EXPOSURE</th>
                    <th scope="col">STATE</th>
                    <th scope="col">NOTE</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.models.map((model) => (
                    <tr key={model.id} data-state={model.state}>
                      <th scope="row">{model.name}</th>
                      <td>{model.tier}</td>
                      <td>{model.exposure}</td>
                      <td>
                        <span className="mb-state-mark" data-state={model.state}>
                          {STATE_LABEL[model.state]}
                        </span>
                      </td>
                      <td className="mb-register-note">{model.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mb-trend" data-part-id="db-ai-risk-command-centre/evidence/trend-chart">
              <h3 className="mb-panel-heading">{EVIDENCE.trendHeading}</h3>
              <ChartFigure
                title={`${selected.name} — appetite utilisation, 90 days`}
                sourceNote={EVIDENCE.chartSource}
                option={trendOption}
                tableColumns={trendTable.columns}
                tableRows={trendTable.rows}
                height={280}
                reducedMotion={reduced}
              />
            </div>
          </div>
        </section>

        <section className="mb-band" aria-labelledby="mb-actions-heading" data-part-id="db-ai-risk-command-centre/actions">
          <h2 id="mb-actions-heading" className="mb-band-heading">
            <span className="mb-band-index">III</span> {ACTIONS.title}
            <span className="mb-band-sub">{ACTIONS.sub}</span>
          </h2>
          <ol className="mb-actions">
            {ACTIONS.items.map((action) => (
              <li key={action.id} className="mb-action" data-state={action.state}>
                <span className="mb-action-ref">{action.ref}</span>
                <div className="mb-action-body">
                  <p className="mb-action-title">{action.title}</p>
                  <p className="mb-action-note">{action.note}</p>
                </div>
                <span className="mb-action-owner">{action.owner}</span>
                <span className="mb-action-due">
                  DUE {action.due.toUpperCase()}
                  <span className="mb-action-state" data-state={action.state}>
                    {action.state === 'on-track' ? 'ON TRACK' : action.state.toUpperCase()}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="mb-foot">
        <p>{FOOT.note}</p>
        <p className="mb-foot-line">
          <span>{CHROME.provenance}</span>
          <span>{FOOT.nextEdition}</span>
        </p>
      </footer>
    </div>
  );
}
