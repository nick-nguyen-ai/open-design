/**
 * "The Registry" — the live full-bleed rendering of `db-regulatory-control-hub`.
 *
 * A supervisory filing hall: the control posture headlined in one monumental
 * figure, backed by a precision grid of control-family drawers; opening a
 * drawer reads its controls with per-control result stamps and evidence
 * references. Grammar: precision-grid (with the plan's monumental-type
 * headline); signature: ledger-reveal; motion level 1; locked light;
 * corporate register: restricted — deliberately austere and print-faithful.
 *
 * Art-direction licence: this file and registry.css are the experience-local
 * art layer — raw colour values are permitted HERE only.
 *
 * `data-part-id` values are a PUBLIC BORROW CONTRACT (surfaced by the gallery's
 * part inspector, consumed by the design skill): never rename or remove
 * one without updating LivePartIds.test.tsx.
 */
import { useMemo, useState } from 'react';
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
import './registry.css';
import {
  CONTROLS,
  COVERAGE,
  EVIDENCE,
  EXCEPTIONS,
  FAMILIES,
  FOOT,
  INDEX,
  REGISTRY,
  REQUESTS,
  type ControlResult,
} from './content.js';

type Rec = Record<string, unknown>;

const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const INK = {
  ink: '#20211f',
  faint: '#6c6c66',
  registryBlue: '#22406b',
  exception: '#9c3123',
  effective: '#31614a',
  grid: 'rgba(108, 108, 102, 0.22)',
  paper: '#f4f2ec',
} as const;

const RESULT_LABEL: Record<ControlResult, string> = {
  effective: 'EFFECTIVE',
  exception: 'EXCEPTION',
  'retest-due': 'RETEST DUE',
};

function useCoverageOption(reduced: boolean): ChartOption {
  return useMemo(() => {
    const base = buildCategoryBarChartOption(
      FAMILIES.map((family) => ({
        id: family.id,
        category: family.code,
        value: family.effective,
      })),
      { colors: [INK.registryBlue], reducedMotion: reduced },
    ) as Rec;
    const series = (base.series as Rec[]).map((s) => ({
      ...s,
      barMaxWidth: 26,
      itemStyle: { ...(s.itemStyle as Rec), borderRadius: 0 },
    }));
    const axis = (extra?: Rec): Rec => ({
      axisLine: { lineStyle: { color: INK.grid } },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: INK.grid } },
      axisLabel: { color: INK.faint, fontFamily: MONO, fontSize: 10 },
      ...extra,
    });
    return {
      ...base,
      series,
      backgroundColor: 'transparent',
      textStyle: { fontFamily: MONO, color: INK.faint },
      tooltip: {
        trigger: 'axis',
        backgroundColor: INK.paper,
        borderColor: INK.grid,
        textStyle: { color: INK.ink, fontFamily: MONO, fontSize: 11 },
      },
      xAxis: { ...(base.xAxis as Rec), ...axis({ splitLine: { show: false } }) },
      yAxis: { ...(base.yAxis as Rec), max: 40, ...axis() },
    };
  }, [reduced]);
}

export default function RegistryPage() {
  const { reduced } = useMotionPreference();
  const [openFamilyId, setOpenFamilyId] = useState('model');
  const openFamily = FAMILIES.find((f) => f.id === openFamilyId) ?? FAMILIES[0]!;
  const drawer = CONTROLS[openFamily.id] ?? [];

  const coverageOption = useCoverageOption(reduced);
  const coverageTable = useMemo(
    () =>
      buildCategoryBarChartTable(
        FAMILIES.map((family) => ({ id: family.id, category: family.code, value: family.effective })),
      ),
    [],
  );

  return (
    <div className="rg-root" data-testid="live-registry" data-reduced={reduced ? 'true' : undefined}>
      <header className="rg-chrome" data-part-id="db-regulatory-control-hub/chrome">
        <div className="rg-chrome-row">
          <RouterLink to="/" className="rg-back">
            ◄ GALLERY
          </RouterLink>
          <span className="rg-chrome-mast">{REGISTRY.masthead}</span>
          <span>{REGISTRY.period}</span>
        </div>
        <div className="rg-chrome-row rg-chrome-row-sub">
          <span>{REGISTRY.authority}</span>
          <span className="rg-provenance">{REGISTRY.provenance}</span>
        </div>
      </header>

      <main className="rg-main">
        <section className="rg-posture" aria-labelledby="rg-figure" data-part-id="db-regulatory-control-hub/posture">
          <p className="rg-kicker">{REGISTRY.kicker}</p>
          <p id="rg-figure" className="rg-figure" data-part-id="db-regulatory-control-hub/posture/headline-figure">
            <span className="rg-figure-num">{REGISTRY.numerator}</span>
            <span className="rg-figure-slash" aria-hidden="true">
              /
            </span>
            <span className="rg-figure-den">{REGISTRY.denominator}</span>
          </p>
          <p className="rg-figure-caption">{REGISTRY.figureCaption}</p>
          <p className="rg-statement">{REGISTRY.statement}</p>
          <p className="rg-attestation">{REGISTRY.attestation}</p>
        </section>

        <section className="rg-band" aria-labelledby="rg-index-heading" data-part-id="db-regulatory-control-hub/index">
          <h2 id="rg-index-heading" className="rg-band-heading">
            <span className="rg-band-index">§1</span> {INDEX.title}
            <span className="rg-band-sub">{INDEX.sub}</span>
          </h2>
          <ul className="rg-index-grid">
            {FAMILIES.map((family, i) => {
              const open = family.id === openFamilyId;
              const clean = family.effective === family.controls;
              return (
                <li key={family.id} className="rg-drawer-item" style={{ ['--rg-row' as string]: i }}>
                  <button
                    type="button"
                    className="rg-drawer"
                    aria-expanded={open}
                    data-clean={clean ? 'true' : undefined}
                    onClick={() => setOpenFamilyId(family.id)}
                  >
                    <span className="rg-drawer-code">{family.code}</span>
                    <span className="rg-drawer-name">{family.name}</span>
                    <span className="rg-drawer-score">
                      {family.effective}
                      <span className="rg-drawer-score-of"> / {family.controls}</span>
                    </span>
                    <span className="rg-drawer-meta">TESTED {family.lastTested}</span>
                    <span className="rg-drawer-state">{clean ? 'CLEAN' : 'EXCEPTION ON FILE'}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rg-band" aria-labelledby="rg-evidence-heading" data-part-id="db-regulatory-control-hub/evidence">
          <h2 id="rg-evidence-heading" className="rg-band-heading">
            <span className="rg-band-index">§2</span> {EVIDENCE.title}
            <span className="rg-band-sub">{EVIDENCE.sub}</span>
          </h2>
          <div className="rg-drawer-open">
            <div className="rg-drawer-open-head">
              <p className="rg-drawer-open-title">
                {openFamily.code} · {openFamily.name.toUpperCase()}
              </p>
              <p className="rg-drawer-open-note">{openFamily.note}</p>
            </div>
            <table className="rg-controls" data-part-id="db-regulatory-control-hub/evidence/control-table">
              <caption>
                <VisuallyHidden>
                  Controls on file for {openFamily.name}: reference, control, result, owner, evidence
                  reference, and test date.
                </VisuallyHidden>
              </caption>
              <thead>
                <tr>
                  <th scope="col">REF</th>
                  <th scope="col">CONTROL</th>
                  <th scope="col">RESULT</th>
                  <th scope="col">OWNER</th>
                  <th scope="col">EVIDENCE</th>
                  <th scope="col">TESTED</th>
                </tr>
              </thead>
              <tbody>
                {drawer.map((control) => (
                  <tr key={control.id} data-result={control.result}>
                    <th scope="row">{control.ref}</th>
                    <td className="rg-controls-name">{control.name}</td>
                    <td>
                      <span className="rg-stamp" data-result={control.result}>
                        {RESULT_LABEL[control.result]}
                      </span>
                    </td>
                    <td>{control.owner}</td>
                    <td className="rg-controls-ev">{control.evidenceRef}</td>
                    <td>{control.tested}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="rg-columns">
          <section className="rg-band" aria-labelledby="rg-coverage-heading" data-part-id="db-regulatory-control-hub/coverage">
            <h2 id="rg-coverage-heading" className="rg-band-heading">
              <span className="rg-band-index">§3</span> {COVERAGE.title}
              <span className="rg-band-sub">{COVERAGE.sub}</span>
            </h2>
            <div data-part-id="db-regulatory-control-hub/coverage/family-chart">
              <ChartFigure
                title={COVERAGE.chartTitle}
                sourceNote={COVERAGE.chartSource}
                option={coverageOption}
                tableColumns={coverageTable.columns}
                tableRows={coverageTable.rows}
                height={260}
                reducedMotion={reduced}
              />
            </div>
          </section>

          <section className="rg-band" aria-labelledby="rg-requests-heading" data-part-id="db-regulatory-control-hub/requests">
            <h2 id="rg-requests-heading" className="rg-band-heading">
              <span className="rg-band-index">§4</span> {REQUESTS.title}
              <span className="rg-band-sub">{REQUESTS.sub}</span>
            </h2>
            <ul className="rg-requests">
              {REQUESTS.items.map((request) => (
                <li key={request.id} className="rg-request" data-state={request.state}>
                  <div className="rg-request-head">
                    <span className="rg-request-ref">{request.ref}</span>
                    <span className="rg-request-from">{request.from}</span>
                    <span className="rg-request-due">{request.due}</span>
                  </div>
                  <p className="rg-request-title">{request.title}</p>
                  <p className="rg-request-state">{request.state.toUpperCase()}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="rg-band" aria-labelledby="rg-exceptions-heading" data-part-id="db-regulatory-control-hub/exceptions">
          <h2 id="rg-exceptions-heading" className="rg-band-heading">
            <span className="rg-band-index">§5</span> {EXCEPTIONS.title}
            <span className="rg-band-sub">{EXCEPTIONS.sub}</span>
          </h2>
          <ol className="rg-exceptions">
            {EXCEPTIONS.items.map((exception) => (
              <li key={exception.id} className="rg-exception">
                <div className="rg-exception-rail">
                  <span className="rg-exception-ref">{exception.ref}</span>
                  <span className="rg-exception-family">{exception.familyCode}</span>
                </div>
                <div className="rg-exception-body">
                  <p className="rg-exception-title">{exception.title}</p>
                  <p className="rg-exception-note">{exception.note}</p>
                </div>
                <div className="rg-exception-dates">
                  <span>RAISED {exception.raised}</span>
                  <span className="rg-exception-due">REMEDIATE BY {exception.remediateBy}</span>
                  <span className="rg-exception-owner">{exception.owner.toUpperCase()}</span>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="rg-foot">
        <p>{FOOT.note}</p>
        <p className="rg-foot-line">
          <span>{REGISTRY.provenance}</span>
          <span>{FOOT.next}</span>
        </p>
      </footer>
    </div>
  );
}
