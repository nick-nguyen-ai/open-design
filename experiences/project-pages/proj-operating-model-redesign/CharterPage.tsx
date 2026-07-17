/**
 * "The Charter" — the live full-bleed rendering of
 * `proj-operating-model-redesign`.
 *
 * An operating-model redesign written as the articles of a charter: each
 * decision an article with its rationale and a transition seal
 * (IN FORCE / TRANSITIONING), read calmly, never re-litigated. Deliberately
 * simple and old-school — settled law, not a reorg deck.
 * Grammar: calm-command; signature: ledger-reveal (articles take their
 * seats in order); motion level 1; locked light.
 *
 * Art-direction licence: this file and charter.css are the experience-local
 * art layer — raw colour values are permitted HERE only.
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
import './charter.css';
import { ARTICLES, CHARTER, CUSTODIANS, FOOT, PREAMBLE, TRANSITION } from './content.js';

const SEAL_LABEL = { 'in-force': 'IN FORCE', transitioning: 'TRANSITIONING' } as const;

export default function CharterPage() {
  const { reduced } = useMotionPreference();

  return (
    <div className="chr-root" data-testid="live-charter" data-reduced={reduced ? 'true' : undefined}>
      <header className="chr-chrome" data-part-id="proj-operating-model-redesign/chrome">
        <div className="chr-chrome-left">
          <RouterLink to="/" className="chr-back">
            ◄ GALLERY
          </RouterLink>
          <span className="chr-chrome-rule" aria-hidden="true" />
          <span className="chr-chrome-mast">{CHARTER.masthead}</span>
        </div>
        <span className="chr-chrome-ref">{CHARTER.ref}</span>
      </header>

      <main className="chr-main">
        <section className="chr-cover" aria-labelledby="chr-title" data-part-id="proj-operating-model-redesign/cover">
          <p className="chr-kicker">{CHARTER.kicker}</p>
          <h1 id="chr-title" className="chr-title">
            {CHARTER.title}
          </h1>
          <p className="chr-subline">{CHARTER.subline}</p>
          <dl className="chr-figures" data-part-id="proj-operating-model-redesign/cover/figures">
            {CHARTER.figures.map((figure) => (
              <div key={figure.label} className="chr-figure">
                <dt>{figure.label}</dt>
                <dd>{figure.value}</dd>
              </div>
            ))}
          </dl>
          <p className="chr-provenance">{CHARTER.provenance}</p>
        </section>

        <section className="chr-band" aria-labelledby="chr-preamble-heading" data-part-id="proj-operating-model-redesign/preamble">
          <h2 id="chr-preamble-heading" className="chr-band-heading">
            {PREAMBLE.title}
          </h2>
          <p className="chr-preamble">{PREAMBLE.body}</p>
        </section>

        <section className="chr-band" aria-labelledby="chr-articles-heading" data-part-id="proj-operating-model-redesign/articles">
          <h2 id="chr-articles-heading" className="chr-band-heading">
            The articles
            <span className="chr-band-sub">Seven decisions, sealed</span>
          </h2>
          <ol className="chr-articles" data-part-id="proj-operating-model-redesign/articles/article-entries">
            {ARTICLES.map((article) => (
              <li key={article.id} className="chr-article" data-seal={article.seal}>
                <header className="chr-article-head">
                  <span className="chr-article-numeral">ARTICLE {article.numeral}</span>
                  <h3 className="chr-article-title">{article.title}</h3>
                  <span className="chr-seal" data-seal={article.seal}>
                    <span className="chr-seal-ring" aria-hidden="true" />
                    {SEAL_LABEL[article.seal]}
                    <span className="chr-seal-since">{article.since}</span>
                  </span>
                </header>
                <p className="chr-article-decision">{article.decision}</p>
                <p className="chr-article-rationale">
                  <span className="chr-rationale-label">RATIONALE</span> {article.rationale}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <div className="chr-columns">
          <section className="chr-band" aria-labelledby="chr-transition-heading" data-part-id="proj-operating-model-redesign/transition">
            <h2 id="chr-transition-heading" className="chr-band-heading">
              {TRANSITION.title}
              <span className="chr-band-sub">{TRANSITION.sub}</span>
            </h2>
            <table className="chr-transition" data-part-id="proj-operating-model-redesign/transition/schedule">
              <thead>
                <tr>
                  <th scope="col">ART.</th>
                  <th scope="col">WHAT MOVES</th>
                  <th scope="col">WINDOW</th>
                  <th scope="col">STATE</th>
                </tr>
              </thead>
              <tbody>
                {TRANSITION.rows.map((row) => (
                  <tr key={row.id}>
                    <td className="chr-tr-article">{row.article}</td>
                    <td>{row.move}</td>
                    <td className="chr-tr-window">{row.window}</td>
                    <td className="chr-tr-state">{row.state}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="chr-band" aria-labelledby="chr-custodians-heading" data-part-id="proj-operating-model-redesign/custodians">
            <h2 id="chr-custodians-heading" className="chr-band-heading">
              {CUSTODIANS.title}
              <span className="chr-band-sub">{CUSTODIANS.sub}</span>
            </h2>
            <ul className="chr-custodians">
              {CUSTODIANS.entries.map((entry) => (
                <li key={entry.id} className="chr-custodian">
                  <span className="chr-custodian-role">{entry.role}</span>
                  <p className="chr-custodian-duty">{entry.duty}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      <footer className="chr-foot">
        <p>{FOOT.note}</p>
        <p className="chr-foot-line">
          <span>{CHARTER.provenance}</span>
          <span>{FOOT.next}</span>
        </p>
      </footer>
    </div>
  );
}
