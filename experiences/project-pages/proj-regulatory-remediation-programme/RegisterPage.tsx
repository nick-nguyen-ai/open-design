/**
 * "The Undertakings Register" — the live full-bleed rendering of
 * `proj-regulatory-remediation-programme`.
 *
 * Every remediation commitment a numbered undertaking against its regulator
 * deadline. Three status lozenges only — DISCHARGED / ON TRACK / AT RISK —
 * with zero ambiguity, an evidence line per undertaking, and the on-time
 * record charted. Deliberately simple and old-school: a register, not a
 * dashboard. Grammar: calm-command; signature: ledger-reveal (undertakings
 * take their seats in order); motion level 1; locked light.
 *
 * Art-direction licence: this file and register.css are the experience-local
 * art layer — raw colour values are permitted HERE only.
 *
 * `data-part-id` values are a PUBLIC BORROW CONTRACT (surfaced by the gallery's
 * part inspector, consumed by the design-borrow skill): never rename or remove
 * one without updating LivePartIds.test.tsx.
 */
import { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import { ChartFigure, buildCategoryBarChartOption, buildCategoryBarChartTable } from '@enterprise-design/data-viz';
import type { ChartOption } from '@enterprise-design/data-viz';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource-variable/inter/index.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './register.css';
import { ATTESTATION, FOOT, READING, RECORD, REGISTER, UNDERTAKINGS } from './content.js';

const STATUS_LABEL = { discharged: 'DISCHARGED', 'on-track': 'ON TRACK', 'at-risk': 'AT RISK' } as const;

function useOnTimeOption(reduced: boolean): ChartOption {
  return useMemo(
    () =>
      buildCategoryBarChartOption(
        RECORD.quarters.map((quarter) => ({
          id: quarter.id,
          category: quarter.label,
          value: quarter.onTime,
          target: quarter.due,
        })),
        { colors: ['#1f4e37'], reducedMotion: reduced },
      ),
    [reduced],
  );
}

export default function RegisterPage() {
  const { reduced } = useMotionPreference();
  const onTimeOption = useOnTimeOption(reduced);
  const onTimeTable = useMemo(
    () =>
      buildCategoryBarChartTable(
        RECORD.quarters.map((quarter) => ({
          id: quarter.id,
          category: quarter.label,
          value: quarter.onTime,
          target: quarter.due,
        })),
        'milestones',
      ),
    [],
  );

  return (
    <div className="ur-root" data-testid="live-undertakings-register" data-reduced={reduced ? 'true' : undefined}>
      <header className="ur-chrome" data-part-id="proj-regulatory-remediation-programme/chrome">
        <div className="ur-chrome-left">
          <RouterLink to="/" className="ur-back">
            ◄ GALLERY
          </RouterLink>
          <span className="ur-chrome-rule" aria-hidden="true" />
          <span className="ur-chrome-mast">{REGISTER.masthead}</span>
        </div>
        <span className="ur-chrome-ref">{REGISTER.ref}</span>
      </header>

      <main className="ur-main">
        <section className="ur-cover" aria-labelledby="ur-title" data-part-id="proj-regulatory-remediation-programme/cover">
          <p className="ur-kicker">{REGISTER.kicker}</p>
          <h1 id="ur-title" className="ur-title">
            {REGISTER.title}
          </h1>
          <p className="ur-subline">{REGISTER.subline}</p>
          <dl className="ur-figures" data-part-id="proj-regulatory-remediation-programme/cover/figures">
            {REGISTER.figures.map((figure) => (
              <div key={figure.label} className="ur-figure">
                <dt>{figure.label}</dt>
                <dd>{figure.value}</dd>
              </div>
            ))}
          </dl>
          <p className="ur-provenance">{REGISTER.provenance}</p>
        </section>

        <section className="ur-band" aria-labelledby="ur-register-heading" data-part-id="proj-regulatory-remediation-programme/register">
          <h2 id="ur-register-heading" className="ur-band-heading">
            The register
            <span className="ur-band-sub">Ten undertakings to the Prudential Conduct Office</span>
          </h2>
          <ol className="ur-register" data-part-id="proj-regulatory-remediation-programme/register/undertaking-rows">
            {UNDERTAKINGS.map((item) => (
              <li key={item.id} className="ur-row" data-status={item.status}>
                <div className="ur-row-head">
                  <span className="ur-row-no">{item.no}</span>
                  <p className="ur-row-undertaking">{item.undertaking}</p>
                  <span className="ur-lozenge" data-status={item.status}>
                    {STATUS_LABEL[item.status]}
                  </span>
                </div>
                <div className="ur-row-meta">
                  <span className="ur-row-deadline">
                    <span className="ur-meta-label">DEADLINE</span> {item.deadline}
                  </span>
                  <span className="ur-row-owner">
                    <span className="ur-meta-label">OWNER</span> {item.owner}
                  </span>
                </div>
                <p className="ur-row-evidence">
                  <span className="ur-meta-label">EVIDENCE</span> {item.evidence}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="ur-band" aria-labelledby="ur-reading-heading" data-part-id="proj-regulatory-remediation-programme/reading">
          <h2 id="ur-reading-heading" className="ur-band-heading">
            {READING.title}
          </h2>
          <p className="ur-reading">{READING.body}</p>
        </section>

        <div className="ur-columns">
          <section className="ur-band" aria-labelledby="ur-record-heading" data-part-id="proj-regulatory-remediation-programme/record">
            <h2 id="ur-record-heading" className="ur-band-heading">
              {RECORD.title}
              <span className="ur-band-sub">{RECORD.sub}</span>
            </h2>
            <div data-part-id="proj-regulatory-remediation-programme/record/on-time-chart">
              <ChartFigure
                title={RECORD.chartTitle}
                sourceNote={RECORD.chartSource}
                option={onTimeOption}
                tableColumns={onTimeTable.columns}
                tableRows={onTimeTable.rows}
                height={250}
                reducedMotion={reduced}
              />
            </div>
          </section>

          <section className="ur-band" aria-labelledby="ur-attestation-heading" data-part-id="proj-regulatory-remediation-programme/attestation">
            <h2 id="ur-attestation-heading" className="ur-band-heading">
              {ATTESTATION.title}
              <span className="ur-band-sub">{ATTESTATION.date}</span>
            </h2>
            <blockquote className="ur-attestation">
              <p>{ATTESTATION.body}</p>
              <footer className="ur-attestation-signer">
                <span className="ur-signature">{ATTESTATION.signer.name}</span>
                <span className="ur-signer-role">{ATTESTATION.signer.role}</span>
              </footer>
            </blockquote>
          </section>
        </div>
      </main>

      <footer className="ur-foot">
        <p>{FOOT.note}</p>
        <p className="ur-foot-line">
          <span>{REGISTER.provenance}</span>
          <span>{FOOT.next}</span>
        </p>
      </footer>
    </div>
  );
}
