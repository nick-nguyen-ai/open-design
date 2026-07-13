/**
 * "The Playbill" — the live full-bleed rendering of
 * `home-talks-presentation-archive`.
 *
 * A speaker's archive set as a theatre's season playbills. THE SEASON BILLS own
 * the page: talks grouped by fiscal year into playbill columns, each engagement
 * billed with title, venue / month / house, a quoted NOTICE and a letterpress
 * FORMAT badge. NOW SHOWING marquees the next scheduled talk (title in a
 * bulb-dot border that shimmers slowly at L2, static under reduced motion). One
 * past engagement is kept honestly on the bill marked CANCELLED (the anomaly).
 *
 * Stage-black field, warm marquee white, letterpress typography — theatrical,
 * held to bank restraint. LedgerReveal resolves the bills in reading order.
 * Art-direction licence: this file and playbill.css are the experience-local
 * art layer; motion stays token-driven, no bespoke cubic-bezier.
 */
import { useEffect, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { LedgerReveal, useMotionPreference } from '@enterprise-design/motion';
import type { LedgerRevealItem } from '@enterprise-design/motion';
import { VisuallyHidden } from '@enterprise-design/primitives';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource-variable/fraunces/opsz-italic.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import './playbill.css';
import {
  CHROME,
  FORMAT_LABEL,
  MATERIALS,
  MATERIALS_NOTE,
  NOW_SHOWING,
  PERSON,
  REPERTOIRE,
  REPERTOIRE_NOTE,
  SEASONS,
  STAGECRAFT,
  STAGECRAFT_NOTE,
  STATEMENT,
  STATEMENT_SUBLINE,
} from './content.js';
import type { Engagement, Season } from './content.js';

/* ------------------------------------------------------------------ */
/* NOW SHOWING — the marquee                                           */
/* ------------------------------------------------------------------ */

function Marquee({ reduced }: { reduced: boolean }) {
  return (
    <section className="pb-marquee" aria-labelledby="pb-marquee-heading" data-testid="now-showing">
      <div className="pb-marquee-frame" data-reduced={reduced ? 'true' : undefined}>
        <span className="pb-marquee-bulbs" aria-hidden="true" />
        <div className="pb-marquee-inner">
          <p className="pb-marquee-billing">
            NOW SHOWING · {NOW_SHOWING.billing} · {NOW_SHOWING.month}
          </p>
          <h2 id="pb-marquee-heading" className="pb-marquee-title">
            {NOW_SHOWING.title}
          </h2>
          <p className="pb-marquee-line">
            {NOW_SHOWING.venue} · {NOW_SHOWING.month} · {NOW_SHOWING.house} ·{' '}
            {FORMAT_LABEL[NOW_SHOWING.format].toUpperCase()}
          </p>
          <p className="pb-marquee-blurb">{NOW_SHOWING.blurb}</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* One billed engagement                                               */
/* ------------------------------------------------------------------ */

function EngagementBill({ engagement }: { engagement: Engagement }) {
  const cancelled = Boolean(engagement.cancelled);
  return (
    <article
      className={`pb-bill${cancelled ? ' pb-bill-cancelled' : ''}`}
      data-testid={cancelled ? 'cancelled-bill' : 'bill'}
    >
      <div className="pb-bill-head">
        <span className={`pb-format pb-format-${engagement.format.toLowerCase()}`}>
          {FORMAT_LABEL[engagement.format]}
        </span>
        <span className="pb-bill-house">HOUSE OF {engagement.house}</span>
      </div>
      <h4 className="pb-bill-title">{engagement.title}</h4>
      <p className="pb-bill-line">
        {engagement.venue} · {engagement.month}
      </p>
      {cancelled ? (
        <p className="pb-bill-cancelled-mark" data-testid="cancelled-mark">
          {engagement.cancelled}
        </p>
      ) : null}
      <p className="pb-bill-notice">{engagement.notice}</p>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* A season column                                                     */
/* ------------------------------------------------------------------ */

function SeasonColumn({ season }: { season: Season }) {
  return (
    <section className="pb-season" aria-labelledby={`${season.id}-heading`}>
      <header className="pb-season-masthead">
        <h3 id={`${season.id}-heading`} className="pb-season-label">
          {season.label}
        </h3>
        <span className="pb-season-rule" aria-hidden="true" />
        <p className="pb-season-note">{season.note}</p>
      </header>
      <div className="pb-season-bills">
        {season.engagements.map((e) => (
          <EngagementBill key={e.id} engagement={e} />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Supporting sections                                                 */
/* ------------------------------------------------------------------ */

function Repertoire() {
  return (
    <section className="pb-repertoire" aria-labelledby="pb-rep-heading">
      <h2 id="pb-rep-heading" className="pb-section-heading">
        THE REPERTOIRE
        <span className="pb-section-sub">FOUR TALKS ON REQUEST — OPEN A BILL FOR THE FULL ABSTRACT</span>
      </h2>
      <div className="pb-rep-list">
        {REPERTOIRE.map((r) => (
          <details key={r.id} className="pb-rep-item" data-testid="repertoire-item">
            <summary className="pb-rep-summary">
              <span className={`pb-format pb-format-${r.format.toLowerCase()}`}>
                {FORMAT_LABEL[r.format]}
              </span>
              <span className="pb-rep-title">{r.title}</span>
              <span className="pb-rep-runtime">{r.runtime}</span>
            </summary>
            <p className="pb-rep-abstract">{r.abstract}</p>
          </details>
        ))}
      </div>
      <p className="pb-rep-note">{REPERTOIRE_NOTE}</p>
    </section>
  );
}

function BoxOffice() {
  return (
    <section className="pb-boxoffice" aria-labelledby="pb-box-heading">
      <h2 id="pb-box-heading" className="pb-section-heading">
        THE BOX OFFICE
        <span className="pb-section-sub">MATERIALS LEFT BEHIND — COUNTED, NOT PAYWALLED</span>
      </h2>
      <div className="pb-stub-row">
        {MATERIALS.map((m) => (
          <div key={m.id} className="pb-stub">
            <span className="pb-stub-perf" aria-hidden="true" />
            <span className="pb-stub-count">{m.count}</span>
            <span className="pb-stub-label">{m.label}</span>
            <span className="pb-stub-note">{m.note}</span>
          </div>
        ))}
      </div>
      <p className="pb-box-note">{MATERIALS_NOTE}</p>
    </section>
  );
}

function Stagecraft() {
  return (
    <section className="pb-stagecraft" aria-labelledby="pb-craft-heading">
      <h2 id="pb-craft-heading" className="pb-section-heading">
        STAGECRAFT NOTES
        <span className="pb-section-sub">HOW I PREPARE — THE HOURS NOBODY SEES</span>
      </h2>
      <p className="pb-craft-note">{STAGECRAFT_NOTE}</p>
      <ul className="pb-craft-grid">
        {STAGECRAFT.map((n) => (
          <li key={n.id} className="pb-craft-item">
            <span className="pb-craft-figure">{n.figure}</span>
            <span className="pb-craft-label">{n.label}</span>
            <p className="pb-craft-detail">{n.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function EngagementTable() {
  const rows = useMemo(
    () =>
      SEASONS.flatMap((s) =>
        s.engagements.map((e) => ({ season: s.label, ...e })),
      ),
    [],
  );
  return (
    <section className="pb-mirror" aria-labelledby="pb-mirror-heading">
      <h2 id="pb-mirror-heading" className="pb-section-heading">
        THE DATED BILL
        <span className="pb-section-sub">EVERY ENGAGEMENT AS A TABLE — THE ACCESSIBLE MIRROR</span>
      </h2>
      <table className="pb-table" data-testid="engagement-table">
        <caption className="pb-table-caption">
          Every engagement across three seasons: season, format, title, venue, month and house size.
          The cancelled engagement is kept on the bill, marked.
        </caption>
        <thead>
          <tr>
            <th scope="col">Season</th>
            <th scope="col">Format</th>
            <th scope="col">Title</th>
            <th scope="col">Venue</th>
            <th scope="col">Month</th>
            <th scope="col">House</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} data-cancelled={r.cancelled ? 'true' : undefined}>
              <th scope="row">{r.season}</th>
              <td>{FORMAT_LABEL[r.format]}</td>
              <td>
                {r.title}
                {r.cancelled ? ' — cancelled, rescheduled' : ''}
              </td>
              <td>{r.venue}</td>
              <td>{r.month}</td>
              <td>{r.house}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The page                                                            */
/* ------------------------------------------------------------------ */

export default function PlaybillPage() {
  const { reduced } = useMotionPreference();

  useEffect(() => {
    document.title = 'The Playbill — Theo Ansah — Live';
  }, []);

  const seasonItems = useMemo<LedgerRevealItem[]>(
    () => SEASONS.map((s) => ({ id: s.id, content: <SeasonColumn season={s} /> })),
    [],
  );

  return (
    <div className="pb-root" data-testid="live-playbill" data-reduced={reduced ? 'true' : undefined}>
      <div className="pb-field" aria-hidden="true" />

      <header className="pb-chrome" aria-label="The Playbill chrome">
        <div className="pb-chrome-cell">
          <RouterLink to="/" className="pb-back">
            ◄ GALLERY
          </RouterLink>
          <span className="pb-chrome-rule" aria-hidden="true" />
          <span>{CHROME.world}</span>
        </div>
        <div className="pb-chrome-cell">
          <span>{CHROME.house}</span>
          <span className="pb-chrome-rule" aria-hidden="true" />
          <span className="pb-synthetic" data-testid="synthetic-mark">
            {CHROME.synthetic}
          </span>
        </div>
      </header>

      <main className="pb-main">
        <section className="pb-hero" aria-labelledby="pb-statement">
          <p className="pb-kicker">THE PLAYBILL</p>
          <h1 id="pb-statement" className="pb-display">
            {STATEMENT.map((line, i) => (
              <span key={i} className="pb-display-line">
                {line}
              </span>
            ))}
          </h1>
          <p className="pb-identity">
            {PERSON.name} · {PERSON.role.toUpperCase()} · {PERSON.team.toUpperCase()} ·{' '}
            {PERSON.location.toUpperCase()}
          </p>
          <p className="pb-subline">{STATEMENT_SUBLINE}</p>
          <VisuallyHidden>
            This entire profile is illustrative and synthetic — a demonstration person, not a real
            speaker. Talks, venues, audience sizes and quoted notices are sample content.
          </VisuallyHidden>
        </section>

        <Marquee reduced={reduced} />

        <section className="pb-seasons" aria-labelledby="pb-seasons-heading">
          <h2 id="pb-seasons-heading" className="pb-section-heading">
            THE SEASON BILLS
            <span className="pb-section-sub">
              GROUPED BY SEASON · TITLE · VENUE · HOUSE · ONE NOTICE EACH · CANCELLATION KEPT IN
            </span>
          </h2>
          <LedgerReveal className="pb-season-grid" items={seasonItems} />
        </section>

        <Repertoire />
        <BoxOffice />
        <Stagecraft />
        <EngagementTable />
      </main>

      <footer className="pb-footer">
        <span>{CHROME.synthetic} · SAMPLE CONTENT IS MARKED AS SUCH</span>
        <span>BILLED SINCE {PERSON.billedSince} · THE HOUSE IS OPEN</span>
      </footer>
    </div>
  );
}
