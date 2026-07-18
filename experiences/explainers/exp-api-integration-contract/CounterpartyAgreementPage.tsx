/**
 * "The Counterparty Agreement" — the live full-bleed rendering of
 * `exp-api-integration-contract`.
 *
 * An API integration contract typeset as a bilateral agreement: recitals,
 * numbered clauses, the endpoints as Schedule A, a request/response exhibit,
 * failures as remedies, versioning as amendments with sunset dates, and a
 * witness block. Written so a downstream team can build against it
 * unsupervised. Grammar: precision-grid; signature: ledger-reveal; motion
 * level 1; locked light; deliberately old-school legal print.
 *
 * Art-direction licence: this file and counterparty.css are the
 * experience-local art layer — raw colour values are permitted HERE only.
 *
 * `data-part-id` values are a PUBLIC BORROW CONTRACT (surfaced by the gallery's
 * part inspector, consumed by the design skill): never rename or remove
 * one without updating LivePartIds.test.tsx.
 */
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import { VisuallyHidden } from '@enterprise-design/primitives';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource-variable/fraunces/opsz-italic.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './counterparty.css';
import {
  AGREEMENT,
  AMENDMENTS,
  DEFINITIONS,
  EXHIBIT_A,
  FOOT,
  RECITALS,
  REMEDIES,
  SCHEDULE_A,
  SIGNATURES,
} from './content.js';

export default function CounterpartyAgreementPage() {
  const { reduced } = useMotionPreference();

  return (
    <div className="ca-root" data-testid="live-counterparty" data-reduced={reduced ? 'true' : undefined}>
      <header className="ca-chrome" data-part-id="exp-api-integration-contract/chrome">
        <div className="ca-chrome-row">
          <RouterLink to="/" className="ca-back">
            ◄ GALLERY
          </RouterLink>
          <span className="ca-chrome-mast">{AGREEMENT.masthead}</span>
          <span>{AGREEMENT.office}</span>
        </div>
        <div className="ca-chrome-row ca-chrome-row-sub">
          <span className="ca-provenance">{AGREEMENT.provenance}</span>
        </div>
      </header>

      <main className="ca-main">
        <section className="ca-cover" aria-labelledby="ca-title" data-part-id="exp-api-integration-contract/cover">
          <p className="ca-kicker">{AGREEMENT.kicker}</p>
          <h1 id="ca-title" className="ca-title">
            {AGREEMENT.title}
          </h1>
          <p className="ca-subtitle">{AGREEMENT.subtitle}</p>
          <p className="ca-intent">{AGREEMENT.intent}</p>
        </section>

        <section className="ca-recitals" aria-label="Recitals" data-part-id="exp-api-integration-contract/recitals">
          {RECITALS.map((line, i) => (
            <p key={i} className="ca-recital" style={{ ['--ca-row' as string]: i }}>
              {line}
            </p>
          ))}
        </section>

        <section className="ca-clause" aria-labelledby="ca-defs-heading" data-part-id="exp-api-integration-contract/definitions">
          <h2 id="ca-defs-heading" className="ca-clause-heading">
            {DEFINITIONS.clause}
          </h2>
          <dl className="ca-terms">
            {DEFINITIONS.terms.map((term) => (
              <div key={term.id} className="ca-term">
                <dt>“{term.term}”</dt>
                <dd>{term.meaning}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="ca-clause" aria-labelledby="ca-schedule-heading" data-part-id="exp-api-integration-contract/schedule">
          <h2 id="ca-schedule-heading" className="ca-clause-heading">
            {SCHEDULE_A.clause}
          </h2>
          <p className="ca-lead">{SCHEDULE_A.lead}</p>
          <div className="ca-table-wrap">
            <table className="ca-endpoints" data-part-id="exp-api-integration-contract/schedule/endpoint-table">
              <caption>
                <VisuallyHidden>{SCHEDULE_A.caption}</VisuallyHidden>
              </caption>
              <thead>
                <tr>
                  <th scope="col">METHOD</th>
                  <th scope="col">PATH</th>
                  <th scope="col">PURPOSE</th>
                  <th scope="col">AUTHENTICATION</th>
                  <th scope="col">RATE LIMIT</th>
                </tr>
              </thead>
              <tbody>
                {SCHEDULE_A.endpoints.map((endpoint) => (
                  <tr key={endpoint.id}>
                    <td className="ca-method" data-method={endpoint.method}>
                      {endpoint.method}
                    </td>
                    <th scope="row">{endpoint.path}</th>
                    <td>{endpoint.purpose}</td>
                    <td className="ca-auth">{endpoint.auth}</td>
                    <td className="ca-rate">{endpoint.rateLimit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="ca-clause" aria-labelledby="ca-exhibit-heading" data-part-id="exp-api-integration-contract/exhibit">
          <h2 id="ca-exhibit-heading" className="ca-clause-heading">
            {EXHIBIT_A.clause}
          </h2>
          <p className="ca-lead">{EXHIBIT_A.lead}</p>
          <div className="ca-exhibit-grid" data-part-id="exp-api-integration-contract/exhibit/wire-samples">
            <figure className="ca-wire">
              <figcaption>THE CONSUMER SENDS</figcaption>
              <pre>{EXHIBIT_A.request}</pre>
            </figure>
            <figure className="ca-wire">
              <figcaption>THE PROVIDER REPLIES</figcaption>
              <pre>{EXHIBIT_A.response}</pre>
            </figure>
          </div>
        </section>

        <section className="ca-clause" aria-labelledby="ca-remedies-heading" data-part-id="exp-api-integration-contract/remedies">
          <h2 id="ca-remedies-heading" className="ca-clause-heading">
            {REMEDIES.clause}
          </h2>
          <p className="ca-lead">{REMEDIES.lead}</p>
          <div className="ca-table-wrap">
            <table className="ca-remedies" data-part-id="exp-api-integration-contract/remedies/failure-table">
              <caption>
                <VisuallyHidden>{REMEDIES.caption}</VisuallyHidden>
              </caption>
              <thead>
                <tr>
                  <th scope="col">FAILURE</th>
                  <th scope="col">MEANING</th>
                  <th scope="col">THE CONSUMER’S REMEDY</th>
                  <th scope="col">RETRY</th>
                </tr>
              </thead>
              <tbody>
                {REMEDIES.items.map((remedy) => (
                  <tr key={remedy.id}>
                    <th scope="row">{remedy.code}</th>
                    <td>{remedy.meaning}</td>
                    <td className="ca-remedy">{remedy.remedy}</td>
                    <td className="ca-retry" data-safe={remedy.retrySafe}>
                      {remedy.retrySafe.toUpperCase()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="ca-clause" aria-labelledby="ca-amendments-heading" data-part-id="exp-api-integration-contract/amendments">
          <h2 id="ca-amendments-heading" className="ca-clause-heading">
            {AMENDMENTS.clause}
          </h2>
          <p className="ca-lead">
            {AMENDMENTS.lead} {AMENDMENTS.sunsetPolicy}
          </p>
          <ol className="ca-amendments">
            {AMENDMENTS.items.map((amendment) => (
              <li key={amendment.id} className="ca-amendment" data-sunset={amendment.sunset ? 'true' : undefined}>
                <span className="ca-amendment-version">{amendment.version}</span>
                <span className="ca-amendment-date">{amendment.date}</span>
                <span className="ca-amendment-nature">{amendment.nature}</span>
                {amendment.sunset && <span className="ca-amendment-sunset">{amendment.sunset}</span>}
              </li>
            ))}
          </ol>
        </section>

        <section className="ca-witness" aria-labelledby="ca-witness-heading" data-part-id="exp-api-integration-contract/signatures">
          <h2 id="ca-witness-heading" className="ca-clause-heading ca-witness-heading">
            {SIGNATURES.clause}
          </h2>
          <p className="ca-lead ca-witness-lead">{SIGNATURES.lead}</p>
          <div className="ca-signature-grid">
            {[SIGNATURES.provider, SIGNATURES.consumer].map((party) => (
              <div key={party.role} className="ca-signature">
                <p className="ca-signature-role">{party.role}</p>
                <p className="ca-signature-name">{party.name}</p>
                <p className="ca-signature-mark">{party.mark}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="ca-foot">
        <p>{FOOT.note}</p>
        <p className="ca-foot-line">
          <span>{AGREEMENT.provenance}</span>
          <span>{FOOT.next}</span>
        </p>
      </footer>
    </div>
  );
}
