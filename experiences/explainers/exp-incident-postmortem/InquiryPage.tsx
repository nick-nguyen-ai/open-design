/**
 * "The Inquiry" — the live full-bleed rendering of `exp-incident-postmortem`.
 *
 * An incident postmortem held to evidentiary standard, staged as a board of
 * inquiry dossier: the recorder trace (Exhibit A), a source-attributed
 * timeline (Exhibit B), numbered findings with pullable evidence, the causal
 * chain (Exhibit C), and an action register with named owners. Grammar:
 * research-notebook; signature: horizon-sweep; motion level 2; locked light;
 * corporate register: restricted.
 *
 * Art-direction licence: this file and inquiry.css are the experience-local
 * art layer — raw colour values are permitted HERE only.
 *
 * `data-part-id` values are a PUBLIC BORROW CONTRACT (surfaced by the gallery's
 * part inspector, consumed by the open-design skill): never rename or remove
 * one without updating LivePartIds.test.tsx.
 */
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import { VisuallyHidden } from '@enterprise-design/primitives';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource-variable/inter/index.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import './inquiry.css';
import {
  ACTIONS,
  CHAIN,
  FINDINGS,
  FOOT,
  INQUIRY,
  RECORDER,
  TIMELINE,
  type Finding,
} from './content.js';

const KIND_LABEL: Record<Finding['kind'], string> = {
  'root-cause': 'ROOT CAUSE',
  contributing: 'CONTRIBUTING',
  mitigating: 'MITIGATING',
};

export default function InquiryPage() {
  const { reduced } = useMotionPreference();

  return (
    <div className="iq-root" data-testid="live-inquiry" data-reduced={reduced ? 'true' : undefined}>
      <header className="iq-chrome" data-part-id="exp-incident-postmortem/chrome">
        <div className="iq-chrome-row">
          <RouterLink to="/" className="iq-back">
            ◄ GALLERY
          </RouterLink>
          <span className="iq-chrome-mast">{INQUIRY.masthead}</span>
          <span>{INQUIRY.office}</span>
        </div>
        <div className="iq-chrome-row iq-chrome-row-sub">
          <span className="iq-provenance">{INQUIRY.provenance}</span>
        </div>
      </header>

      <main className="iq-main">
        <section className="iq-cover" aria-labelledby="iq-title" data-part-id="exp-incident-postmortem/cover">
          <p className="iq-kicker">{INQUIRY.kicker}</p>
          <h1 id="iq-title" className="iq-title">
            {INQUIRY.title}
          </h1>
          <p className="iq-standfirst">{INQUIRY.standfirst}</p>
          <dl className="iq-facts" data-part-id="exp-incident-postmortem/cover/facts">
            {INQUIRY.facts.map((fact) => (
              <div key={fact.label} className="iq-fact">
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="iq-band" aria-labelledby="iq-recorder-heading" data-part-id="exp-incident-postmortem/recorder">
          <h2 id="iq-recorder-heading" className="iq-band-heading">
            {RECORDER.title}
            <span className="iq-band-sub">{RECORDER.sub}</span>
          </h2>
          <figure className="iq-recorder-figure">
            <div
              className="iq-recorder"
              role="img"
              aria-label={RECORDER.caption}
              data-part-id="exp-incident-postmortem/recorder/trace"
            >
              {RECORDER.segments.map((segment) => (
                <div
                  key={segment.id}
                  className="iq-recorder-segment"
                  data-band={segment.band}
                  style={{ width: `${segment.pct}%` }}
                >
                  <span className="iq-recorder-time">{segment.from}</span>
                  <span className="iq-recorder-band">{segment.band.toUpperCase()}</span>
                </div>
              ))}
            </div>
            <figcaption className="iq-recorder-caption">
              <VisuallyHidden>{RECORDER.caption}</VisuallyHidden>
              <span className="iq-legend">
                <span className="iq-legend-item">
                  <span className="iq-legend-swatch" data-band="nominal" aria-hidden="true" />
                  NOMINAL
                </span>
                <span className="iq-legend-item">
                  <span className="iq-legend-swatch" data-band="degraded" aria-hidden="true" />
                  DEGRADED
                </span>
                <span className="iq-legend-item">
                  <span className="iq-legend-swatch" data-band="outage" aria-hidden="true" />
                  FULL OUTAGE
                </span>
              </span>
            </figcaption>
          </figure>
        </section>

        <section className="iq-band" aria-labelledby="iq-timeline-heading" data-part-id="exp-incident-postmortem/timeline">
          <h2 id="iq-timeline-heading" className="iq-band-heading">
            {TIMELINE.title}
            <span className="iq-band-sub">{TIMELINE.sub}</span>
          </h2>
          <ol className="iq-timeline">
            {TIMELINE.entries.map((entry) => (
              <li key={entry.id} className="iq-entry">
                <span className="iq-entry-at">{entry.at}</span>
                <div className="iq-entry-body">
                  <p className="iq-entry-text">{entry.entry}</p>
                  <p className="iq-entry-source">SOURCE · {entry.source}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="iq-band" aria-labelledby="iq-findings-heading" data-part-id="exp-incident-postmortem/findings">
          <h2 id="iq-findings-heading" className="iq-band-heading">
            {FINDINGS.title}
            <span className="iq-band-sub">{FINDINGS.sub}</span>
          </h2>
          <ol className="iq-findings" data-part-id="exp-incident-postmortem/findings/list">
            {FINDINGS.items.map((finding) => (
              <li key={finding.id} className="iq-finding" data-kind={finding.kind}>
                <div className="iq-finding-rail">
                  <span className="iq-finding-no">{finding.no}</span>
                  <span className="iq-finding-kind" data-kind={finding.kind}>
                    {KIND_LABEL[finding.kind]}
                  </span>
                </div>
                <div className="iq-finding-body">
                  <p className="iq-finding-text">{finding.finding}</p>
                  <p className="iq-finding-evidence">EVIDENCE · {finding.evidence}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="iq-band" aria-labelledby="iq-chain-heading" data-part-id="exp-incident-postmortem/chain">
          <h2 id="iq-chain-heading" className="iq-band-heading">
            {CHAIN.title}
            <span className="iq-band-sub">{CHAIN.sub}</span>
          </h2>
          <ol className="iq-chain">
            {CHAIN.links.map((link, i) => (
              <li key={link.id} className="iq-chain-link">
                <span className="iq-chain-label">{link.label}</span>
                <span className="iq-chain-ref">{link.ref}</span>
                {i < CHAIN.links.length - 1 && (
                  <span className="iq-chain-arrow" aria-hidden="true">
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
        </section>

        <section className="iq-band" aria-labelledby="iq-actions-heading" data-part-id="exp-incident-postmortem/actions">
          <h2 id="iq-actions-heading" className="iq-band-heading">
            {ACTIONS.title}
            <span className="iq-band-sub">{ACTIONS.sub}</span>
          </h2>
          <div className="iq-register-wrap">
            <table className="iq-register" data-part-id="exp-incident-postmortem/actions/register">
              <caption>
                <VisuallyHidden>
                  Action register — five actions with reference, owner, due date, and state.
                </VisuallyHidden>
              </caption>
              <thead>
                <tr>
                  <th scope="col">REF</th>
                  <th scope="col">ACTION</th>
                  <th scope="col">OWNER</th>
                  <th scope="col">DUE</th>
                  <th scope="col">STATE</th>
                </tr>
              </thead>
              <tbody>
                {ACTIONS.items.map((action) => (
                  <tr key={action.id} data-state={action.state}>
                    <th scope="row">{action.ref}</th>
                    <td className="iq-register-action">{action.action}</td>
                    <td>{action.owner}</td>
                    <td className="iq-register-due">{action.due}</td>
                    <td>
                      <span className="iq-register-state" data-state={action.state}>
                        {action.state.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="iq-foot">
        <p>{FOOT.note}</p>
        <p className="iq-foot-line">
          <span>{INQUIRY.provenance}</span>
          <span>{FOOT.next}</span>
        </p>
      </footer>
    </div>
  );
}
