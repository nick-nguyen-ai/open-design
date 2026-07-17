/**
 * "The Minute Book" — the live full-bleed rendering of
 * `exp-architecture-decision-record`.
 *
 * An architecture decision given the narrative shape it actually has: board
 * minutes. Context read into the record, options considered — the rejected
 * ones struck through but legible — the resolution in formal language,
 * consequences minuted with owners, and one dissent recorded honestly.
 * Grammar: executive-editorial; signature: ledger-reveal (the minutes take
 * their seats in order); motion level 2; locked light. SIMPLE by design.
 *
 * Art-direction licence: this file and minute-book.css are the
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
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './minute-book.css';
import {
  BOOK,
  CLOSING,
  CONSEQUENCES,
  CONTEXT,
  DISSENT,
  OPTIONS,
  RESOLUTION,
  FOOT,
} from './content.js';

export default function MinuteBookPage() {
  const { reduced } = useMotionPreference();

  return (
    <div className="mk-root" data-testid="live-minute-book" data-reduced={reduced ? 'true' : undefined}>
      <header className="mk-chrome" data-part-id="exp-architecture-decision-record/chrome">
        <div className="mk-chrome-row">
          <RouterLink to="/" className="mk-back">
            ◄ GALLERY
          </RouterLink>
          <span className="mk-chrome-mast">{BOOK.masthead}</span>
          <span>{BOOK.sitting}</span>
        </div>
        <div className="mk-chrome-row mk-chrome-row-sub">
          <span className="mk-provenance">{BOOK.provenance}</span>
        </div>
      </header>

      <main className="mk-main">
        <section className="mk-sitting" aria-labelledby="mk-title" data-part-id="exp-architecture-decision-record/sitting">
          <p className="mk-kicker">{BOOK.kicker}</p>
          <h1 id="mk-title" className="mk-title">
            {BOOK.title}
          </h1>
          <p className="mk-present">{BOOK.present}</p>
          <p className="mk-status">{BOOK.status}</p>
        </section>

        <section className="mk-minute" style={{ ['--mk-row' as string]: 0 }} aria-labelledby="mk-context-heading" data-part-id="exp-architecture-decision-record/context">
          <h2 id="mk-context-heading" className="mk-minute-heading">
            {CONTEXT.minute}
          </h2>
          {CONTEXT.paragraphs.map((paragraph, i) => (
            <p key={i} className="mk-para">
              {paragraph}
            </p>
          ))}
        </section>

        <section className="mk-minute" style={{ ['--mk-row' as string]: 1 }} aria-labelledby="mk-options-heading" data-part-id="exp-architecture-decision-record/options">
          <h2 id="mk-options-heading" className="mk-minute-heading">
            {OPTIONS.minute}
          </h2>
          <p className="mk-note">{OPTIONS.note}</p>
          <ol className="mk-options" data-part-id="exp-architecture-decision-record/options/option-cards">
            {OPTIONS.items.map((option) => (
              <li key={option.id} className="mk-option" data-outcome={option.outcome}>
                <div className="mk-option-head">
                  <span className="mk-option-letter">OPTION {option.letter}</span>
                  <span className="mk-option-outcome" data-outcome={option.outcome}>
                    {option.outcome === 'carried' ? 'CARRIED' : 'NOT CARRIED'}
                  </span>
                </div>
                <div className="mk-option-body">
                  <p className="mk-option-title">{option.title}</p>
                  <p className="mk-option-summary">{option.summary}</p>
                  <p className="mk-option-line">
                    <span className="mk-option-label">FOR IT</span> {option.strengths}
                  </p>
                  <p className="mk-option-line">
                    <span className="mk-option-label">AGAINST IT</span> {option.weaknesses}
                  </p>
                </div>
                <p className="mk-option-note">{option.outcomeNote}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mk-minute" style={{ ['--mk-row' as string]: 2 }} aria-labelledby="mk-resolution-heading" data-part-id="exp-architecture-decision-record/resolution">
          <h2 id="mk-resolution-heading" className="mk-minute-heading">
            {RESOLUTION.minute}
          </h2>
          <blockquote className="mk-resolution" data-part-id="exp-architecture-decision-record/resolution/text">
            {RESOLUTION.text}
          </blockquote>
        </section>

        <section className="mk-minute" style={{ ['--mk-row' as string]: 3 }} aria-labelledby="mk-consequences-heading" data-part-id="exp-architecture-decision-record/consequences">
          <h2 id="mk-consequences-heading" className="mk-minute-heading">
            {CONSEQUENCES.minute}
          </h2>
          <ol className="mk-consequences">
            {CONSEQUENCES.items.map((consequence, i) => (
              <li key={consequence.id} className="mk-consequence">
                <span className="mk-consequence-num">4.{i + 1}</span>
                <p className="mk-consequence-text">{consequence.text}</p>
                <span className="mk-consequence-owner">{consequence.owner.toUpperCase()}</span>
                <span className="mk-consequence-review">REVIEW {consequence.review}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mk-minute" style={{ ['--mk-row' as string]: 4 }} aria-labelledby="mk-dissent-heading" data-part-id="exp-architecture-decision-record/dissent">
          <h2 id="mk-dissent-heading" className="mk-minute-heading">
            {DISSENT.minute}
          </h2>
          <p className="mk-dissent">{DISSENT.text}</p>
        </section>

        <section className="mk-closing" aria-label="Confirmation" data-part-id="exp-architecture-decision-record/closing">
          <p className="mk-confirm">{CLOSING.confirmLine}</p>
          <div className="mk-closing-row">
            <div className="mk-signature">
              <p className="mk-signature-name">The Chair</p>
              <p className="mk-signature-role">
                {CLOSING.chair} · {CLOSING.date}
              </p>
            </div>
            <p className="mk-next-review">{CLOSING.nextReview}</p>
          </div>
        </section>
      </main>

      <footer className="mk-foot">
        <p>{FOOT.note}</p>
        <p className="mk-foot-line">
          <span>{BOOK.provenance}</span>
          <span>{FOOT.next}</span>
        </p>
      </footer>
    </div>
  );
}
