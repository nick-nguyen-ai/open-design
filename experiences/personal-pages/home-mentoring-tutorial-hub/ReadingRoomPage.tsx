/**
 * "The Reading Room" — the live full-bleed rendering of
 * `home-mentoring-tutorial-hub`.
 *
 * A mentor's page as a quiet reading room — the STILLEST world in the
 * catalogue (motion level 1: settle-only; the stillness is the statement).
 * THE SYLLABUS SHELF owns the page: mentoring paths are bound volumes whose
 * spines stand on a bespoke plank; taking one down (native <details>
 * disclosure — no modal) opens it to its table of contents beneath. One volume
 * is retired and honestly labelled superseded (the anomaly). Accessible
 * structure IS the design: native disclosure, real headings, a real table.
 *
 * Art-direction licence: this file and reading-room.css are the experience-
 * local art layer — raw colour values are permitted HERE only. LedgerReveal
 * supplies the single settle entrance and its reduced-motion parity; NO
 * continuous motion exists on this page by design.
 */
import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { LedgerReveal } from '@enterprise-design/motion';
import type { LedgerRevealItem } from '@enterprise-design/motion';
import { VisuallyHidden } from '@enterprise-design/primitives';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource-variable/fraunces/opsz-italic.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import './reading-room.css';
import {
  CHROME,
  FORMAT_LABEL,
  MARGIN_NOTES,
  MENTOR,
  OFFICE_HOURS,
  REGISTER,
  STATEMENT,
  STATEMENT_SUBLINE,
  TUTORIALS,
  VOLUMES,
} from './content.js';
import type { Volume } from './content.js';

/* ------------------------------------------------------------------ */
/* THE SYLLABUS SHELF — the commanding visual                          */
/* ------------------------------------------------------------------ */

function VolumeSpine({ volume }: { volume: Volume }) {
  const retired = Boolean(volume.retired);
  return (
    <details
      className={`rr-volume rr-spine-${volume.spine}${retired ? ' rr-volume-retired' : ''}`}
      data-testid={retired ? 'retired-volume' : undefined}
      data-retired={retired ? 'true' : undefined}
    >
      <summary className="rr-spine">
        <span className="rr-spine-inner">
          <span className="rr-spine-level">{volume.level}</span>
          <span className="rr-spine-title">{volume.title}</span>
          <span className="rr-spine-meta">
            {retired ? 'RETIRED READING' : `${volume.sessions} SESSIONS · ${volume.graduates} GRADUATES`}
          </span>
        </span>
        <span className="rr-spine-open" aria-hidden="true">
          ❧
        </span>
      </summary>

      <div className="rr-toc">
        <div className="rr-toc-head">
          <h3 className="rr-toc-title">{volume.title}</h3>
          <p className="rr-toc-tag">
            {volume.level} ·{' '}
            {retired ? 'RETIRED' : `${volume.sessions} sessions · ${volume.graduates} graduates`}
          </p>
        </div>
        {volume.retired ? (
          <p className="rr-retired-note" data-testid="retired-note">
            RETIRED READING — superseded by <em>{volume.retired.supersededBy}</em>. {volume.retired.reason}
          </p>
        ) : null}
        <p className="rr-toc-blurb">{volume.blurb}</p>
        <ol className="rr-toc-list">
          {volume.contents.map((session, i) => (
            <li key={i} className="rr-toc-item">
              <span className="rr-toc-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="rr-toc-session">{session}</span>
            </li>
          ))}
        </ol>
      </div>
    </details>
  );
}

function Shelf() {
  return (
    <section className="rr-shelf-section" aria-labelledby="rr-shelf-heading">
      <h2 id="rr-shelf-heading" className="rr-heading">
        The Syllabus Shelf
        <span className="rr-heading-sub">
          Each path a bound volume · take one down to read its contents · one retired, kept honest
        </span>
      </h2>
      <ul className="rr-shelf" aria-label="Mentoring paths on the shelf">
        {VOLUMES.map((volume) => (
          <li key={volume.id} className="rr-shelf-slot">
            <VolumeSpine volume={volume} />
          </li>
        ))}
      </ul>
      <div className="rr-plank" aria-hidden="true" />
      <p className="rr-shelf-hint">Every volume opens in place — pick one up.</p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Supporting panels                                                   */
/* ------------------------------------------------------------------ */

function OfficeAndRules() {
  return (
    <div className="rr-row-desk">
      <section className="rr-card rr-office" aria-labelledby="rr-office-heading">
        <h2 id="rr-office-heading" className="rr-heading">
          Office Hours
        </h2>
        <dl className="rr-office-facts">
          <div>
            <dt>Days</dt>
            <dd>{OFFICE_HOURS.days}</dd>
          </div>
          <div>
            <dt>Time</dt>
            <dd>{OFFICE_HOURS.time}</dd>
          </div>
          <div>
            <dt>Where</dt>
            <dd>{OFFICE_HOURS.room}</dd>
          </div>
        </dl>
        <p className="rr-office-invite">{OFFICE_HOURS.invitation}</p>
        <p className="rr-office-booking">{OFFICE_HOURS.booking}</p>
      </section>

      <section className="rr-card rr-margins" aria-labelledby="rr-rules-heading">
        <h2 id="rr-rules-heading" className="rr-heading">
          Margin Notes
          <span className="rr-heading-sub">The house rules, pencilled in</span>
        </h2>
        <ul className="rr-margin-list">
          {MARGIN_NOTES.map((note, i) => (
            <li key={i} className="rr-margin-note">
              {note}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Register() {
  return (
    <section className="rr-card rr-register" aria-labelledby="rr-register-heading">
      <h2 id="rr-register-heading" className="rr-heading">
        The Register
        <span className="rr-heading-sub">Past mentees, by cohort, and where they went next</span>
      </h2>
      <table className="rr-register-table" data-testid="register-table">
        <caption className="rr-register-caption">
          The measure of this room is not its shelves but its readers. Names are synthetic; the
          growth is the metric.
        </caption>
        <thead>
          <tr>
            <th scope="col">Cohort</th>
            <th scope="col">Mentee</th>
            <th scope="col">Where they went next</th>
          </tr>
        </thead>
        <tbody>
          {REGISTER.flatMap((cohort) =>
            cohort.mentees.map((m, i) => (
              <tr key={`${cohort.year}-${m.name}`}>
                {i === 0 ? (
                  <th scope="row" rowSpan={cohort.mentees.length} className="rr-cohort-year">
                    {cohort.year}
                  </th>
                ) : null}
                <td className="rr-mentee-name">{m.name}</td>
                <td className="rr-mentee-went">{m.wentTo}</td>
              </tr>
            )),
          )}
        </tbody>
      </table>
    </section>
  );
}

function Catalogue() {
  return (
    <section className="rr-catalogue" aria-labelledby="rr-cat-heading">
      <h2 id="rr-cat-heading" className="rr-heading">
        Tutorial Catalogue
        <span className="rr-heading-sub">Reference cards · last-revised dates shown honestly</span>
      </h2>
      <ul className="rr-cat-grid">
        {TUTORIALS.map((t) => (
          <li key={t.id} className={`rr-cat-card${t.stale ? ' rr-cat-stale' : ''}`}>
            <div className="rr-cat-top">
              <span className="rr-cat-format">{FORMAT_LABEL[t.format]}</span>
              <span className="rr-cat-date">
                {t.lastRevised}
                {t.stale ? ' · STALE' : ''}
              </span>
            </div>
            <h3 className="rr-cat-title">{t.title}</h3>
            <p className="rr-cat-note">{t.note}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The page                                                            */
/* ------------------------------------------------------------------ */

export default function ReadingRoomPage() {
  useEffect(() => {
    document.title = 'The Reading Room — Iris Fenwick — Live';
  }, []);

  const items: LedgerRevealItem[] = [
    { id: 'shelf', content: <Shelf /> },
    { id: 'desk', content: <OfficeAndRules /> },
    { id: 'register', content: <Register /> },
    { id: 'catalogue', content: <Catalogue /> },
  ];

  return (
    <div className="rr-root" data-testid="live-reading-room">
      <div className="rr-field" aria-hidden="true" />
      <div className="rr-lamp" aria-hidden="true" />

      <header className="rr-chrome" aria-label="The Reading Room chrome">
        <div className="rr-chrome-cell">
          <RouterLink to="/" className="rr-back">
            ◄ GALLERY
          </RouterLink>
          <span className="rr-chrome-rule" aria-hidden="true" />
          <span>{CHROME.world}</span>
        </div>
        <div className="rr-chrome-cell">
          <span>{CHROME.hours}</span>
          <span className="rr-chrome-rule" aria-hidden="true" />
          <span className="rr-synthetic" data-testid="synthetic-mark">
            {CHROME.synthetic}
          </span>
        </div>
      </header>

      <main className="rr-main">
        <section className="rr-hero" aria-labelledby="rr-statement">
          <p className="rr-kicker">The Reading Room</p>
          <h1 id="rr-statement" className="rr-display">
            {STATEMENT.map((line, i) => (
              <span key={i} className="rr-display-line">
                {line}
              </span>
            ))}
          </h1>
          <p className="rr-identity">
            {MENTOR.name} · {MENTOR.role} · {MENTOR.title}
          </p>
          <p className="rr-subline">{STATEMENT_SUBLINE}</p>
          <VisuallyHidden>
            This entire profile is illustrative and synthetic — a demonstration person, not a real
            member of staff. Mentee names, cohorts and dates are sample content.
          </VisuallyHidden>
        </section>

        <LedgerReveal className="rr-reveal" items={items} />
      </main>

      <footer className="rr-footer">
        <span>{CHROME.synthetic} · SAMPLE CONTENT IS MARKED AS SUCH</span>
        <span>{MENTOR.since}</span>
      </footer>
    </div>
  );
}
