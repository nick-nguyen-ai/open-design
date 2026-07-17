/**
 * "The Annual Report" — the live full-bleed rendering of
 * `proj-enterprise-transformation-programme`.
 *
 * A multi-year transformation reported like a company's annual report:
 * a chairman's letter, a statement of committed outcomes with a variance
 * column measured against the ORIGINAL commitments, and notes to the
 * accounts where a number deserves an explanation. Deliberately simple —
 * a document, not an app; built for executives and old-school readers.
 * Grammar: executive-editorial; signature: horizon-sweep (a page-light
 * sweep crosses the cover on arrival); motion level 1; locked light.
 *
 * Art-direction licence: this file and annual-report.css are the
 * experience-local art layer — raw colour values are permitted HERE only.
 *
 * `data-part-id` values are a PUBLIC BORROW CONTRACT (surfaced by the gallery's
 * part inspector, consumed by the design-borrow skill): never rename or remove
 * one without updating LivePartIds.test.tsx.
 */
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource-variable/fraunces/opsz-italic.css';
import '@fontsource-variable/inter/index.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './annual-report.css';
import { FOOT, LETTER, NOTES, REPORT, SIGNATURES, STATEMENT } from './content.js';

const TONE_LABEL = { ahead: 'AHEAD', on: 'ON PLAN', behind: 'BEHIND' } as const;

export default function AnnualReportPage() {
  const { reduced } = useMotionPreference();

  return (
    <div className="ar-root" data-testid="live-annual-report" data-reduced={reduced ? 'true' : undefined}>
      <header className="ar-chrome" data-part-id="proj-enterprise-transformation-programme/chrome">
        <div className="ar-chrome-left">
          <RouterLink to="/" className="ar-back">
            ◄ GALLERY
          </RouterLink>
          <span className="ar-chrome-rule" aria-hidden="true" />
          <span className="ar-chrome-mast">{REPORT.masthead}</span>
        </div>
        <span className="ar-chrome-ref">{REPORT.ref}</span>
      </header>

      <main className="ar-main">
        <section className="ar-cover" aria-labelledby="ar-title" data-part-id="proj-enterprise-transformation-programme/cover">
          <div className="ar-cover-sweep" aria-hidden="true" />
          <p className="ar-kicker">{REPORT.kicker}</p>
          <h1 id="ar-title" className="ar-title">
            {REPORT.title}
          </h1>
          <p className="ar-subline">{REPORT.subline}</p>
          <dl className="ar-figures" data-part-id="proj-enterprise-transformation-programme/cover/figures">
            {REPORT.figures.map((figure) => (
              <div key={figure.label} className="ar-figure">
                <dt>{figure.label}</dt>
                <dd>{figure.value}</dd>
              </div>
            ))}
          </dl>
          <p className="ar-provenance">{REPORT.provenance}</p>
        </section>

        <section className="ar-band" aria-labelledby="ar-letter-heading" data-part-id="proj-enterprise-transformation-programme/letter">
          <h2 id="ar-letter-heading" className="ar-band-heading">
            {LETTER.title}
            <span className="ar-band-sub">{LETTER.sub}</span>
          </h2>
          <div className="ar-letter">
            {LETTER.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="ar-letter-para">
                {paragraph}
              </p>
            ))}
            <p className="ar-letter-signoff">
              <span className="ar-signature">{LETTER.signoff.name}</span>
              <span className="ar-signoff-role">{LETTER.signoff.role}</span>
            </p>
          </div>
        </section>

        <section className="ar-band" aria-labelledby="ar-statement-heading" data-part-id="proj-enterprise-transformation-programme/statement">
          <h2 id="ar-statement-heading" className="ar-band-heading">
            {STATEMENT.title}
            <span className="ar-band-sub">{STATEMENT.sub}</span>
          </h2>
          <table className="ar-statement" data-part-id="proj-enterprise-transformation-programme/statement/outcome-lines">
            <thead>
              <tr>
                {STATEMENT.columns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STATEMENT.lines.map((line) => (
                <tr key={line.id} className="ar-line" data-tone={line.tone}>
                  <th scope="row" className="ar-line-outcome">
                    {line.outcome}
                    {line.noteRef && <sup className="ar-note-ref"> note {line.noteRef}</sup>}
                  </th>
                  <td className="ar-num">{line.committed}</td>
                  <td className="ar-num">{line.delivered}</td>
                  <td className="ar-num ar-variance">
                    {line.variance}
                    <span className="ar-tone" data-tone={line.tone}>
                      {TONE_LABEL[line.tone]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="ar-band" aria-labelledby="ar-notes-heading" data-part-id="proj-enterprise-transformation-programme/notes">
          <h2 id="ar-notes-heading" className="ar-band-heading">
            {NOTES.title}
            <span className="ar-band-sub">{NOTES.sub}</span>
          </h2>
          <ol className="ar-notes" data-part-id="proj-enterprise-transformation-programme/notes/note-entries">
            {NOTES.notes.map((note) => (
              <li key={note.no} className="ar-note">
                <span className="ar-note-no">NOTE {note.no}</span>
                <div>
                  <p className="ar-note-title">{note.title}</p>
                  <p className="ar-note-body">{note.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="ar-band" aria-labelledby="ar-signatures-heading" data-part-id="proj-enterprise-transformation-programme/signatures">
          <h2 id="ar-signatures-heading" className="ar-band-heading">
            {SIGNATURES.title}
            <span className="ar-band-sub">{SIGNATURES.date}</span>
          </h2>
          <div className="ar-signers">
            {SIGNATURES.signers.map((signer) => (
              <div key={signer.name} className="ar-signer">
                <span className="ar-signature">{signer.name}</span>
                <span className="ar-signer-rule" aria-hidden="true" />
                <span className="ar-signer-role">{signer.role}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="ar-foot">
        <p>{FOOT.note}</p>
        <p className="ar-foot-line">
          <span>{REPORT.provenance}</span>
          <span>{FOOT.next}</span>
        </p>
      </footer>
    </div>
  );
}
