/**
 * "The Annual Letter" — the live full-bleed rendering of
 * `home-technical-leadership-portfolio`.
 *
 * A principal engineer's page set like a chairman's annual letter: ivory
 * letterpress paper, ink serif, a bespoke engraving-style tenure line that
 * owns the page, and a letter that admits — in its own required section —
 * what the author got wrong this year. LedgerReveal carries the page in
 * reading order; reduced motion resolves it to ordered opacity, no drift.
 *
 * Art-direction licence: this file and letter.css are the experience-local
 * art layer — raw colour values are permitted HERE only. Motion easings and
 * durations remain token-driven through the LedgerReveal sequence.
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
import './letter.css';
import {
  CHROME,
  LETTER,
  MASTHEAD,
  PERSON,
  PRINCIPLES,
  SIGNATURE,
  STANDFIRST,
  SYSTEMS,
  SYSTEM_STATUS_LABEL,
  TENURE_END,
  TENURE_START,
} from './content.js';
import type { TenureSystem } from './content.js';

/* ------------------------------------------------------------------ */
/* The tenure engraving — the commanding visual                        */
/* ------------------------------------------------------------------ */

const VB_W = 1200;
const VB_H = 470;
const PAD_X = 64;
const DATUM_Y = 252;
/** Two stem heights per side so neighbouring labels never collide. */
const STEM_TALL = 178;
const STEM_SHORT = 112;

function xForYear(year: number): number {
  const t = (year - TENURE_START) / (TENURE_END - TENURE_START);
  return PAD_X + t * (VB_W - PAD_X * 2);
}

/** Deterministic stem length: alternates tall/short along each side. */
function stemLengths(): Map<string, number> {
  const perSide: Record<'above' | 'below', number> = { above: 0, below: 0 };
  const out = new Map<string, number>();
  for (const s of SYSTEMS) {
    const n = perSide[s.side]++;
    out.set(s.id, n % 2 === 0 ? STEM_TALL : STEM_SHORT);
  }
  return out;
}

function TenureEngraving() {
  const lengths = useMemo(() => stemLengths(), []);
  const years = useMemo(() => {
    const out: number[] = [];
    for (let y = TENURE_START; y <= TENURE_END; y += 1) out.push(y);
    return out;
  }, []);

  return (
    <svg
      className="al-engraving-svg"
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      role="img"
      aria-label="Tenure engraving — twelve years of platform systems along a datum line, mirrored by the record table that follows. One system, the Cost Governor of 2023, is cut short and marked sunset by design."
      data-testid="tenure-engraving"
    >
      {/* datum — an engraver's double rule */}
      <line className="al-datum al-datum-heavy" x1={PAD_X - 24} y1={DATUM_Y} x2={VB_W - PAD_X + 24} y2={DATUM_Y} />
      <line className="al-datum al-datum-fine" x1={PAD_X - 24} y1={DATUM_Y + 4} x2={VB_W - PAD_X + 24} y2={DATUM_Y + 4} />

      {/* year ticks + numerals */}
      {years.map((year) => {
        const x = xForYear(year);
        const major = year === TENURE_START || year === TENURE_END || year % 5 === 0;
        return (
          <g key={year} className="al-tick-group">
            <line
              className={major ? 'al-tick al-tick-major' : 'al-tick'}
              x1={x}
              y1={DATUM_Y - (major ? 9 : 5)}
              x2={x}
              y2={DATUM_Y + 4 + (major ? 9 : 5)}
            />
            {major ? (
              <text className="al-year" x={x} y={DATUM_Y + 30} textAnchor="middle">
                {year}
              </text>
            ) : null}
          </g>
        );
      })}

      {/* the joined marker */}
      <text className="al-endcap" x={xForYear(TENURE_START) - 30} y={DATUM_Y - 4} textAnchor="end">
        JOINED
      </text>
      <text className="al-endcap al-endcap-now" x={xForYear(TENURE_END) + 30} y={DATUM_Y - 4} textAnchor="start">
        FY26
      </text>

      {/* system stems */}
      {SYSTEMS.map((s) => {
        const x = xForYear(s.year);
        const len = lengths.get(s.id) ?? STEM_TALL;
        const dir = s.side === 'above' ? -1 : 1;
        const isSunset = s.status === 'sunset';
        const stemLen = isSunset ? len * 0.52 : len;
        const nodeY = DATUM_Y + dir * stemLen;
        const labelY = s.side === 'above' ? nodeY - 22 : nodeY + 24;
        const subY = s.side === 'above' ? nodeY - 7 : nodeY + 39;
        return (
          <g key={s.id} className={`al-stem-group al-stem-${s.status}`} data-system={s.id}>
            <line className="al-stem" x1={x} y1={DATUM_Y + (dir === 1 ? 4 : 0)} x2={x} y2={nodeY} />
            {isSunset ? (
              <>
                {/* the deliberate cut — the anomaly the eye is meant to find */}
                <circle className="al-cut-halo" cx={x} cy={nodeY} r={15} />
                <line className="al-cut" x1={x - 13} y1={nodeY - 9} x2={x + 13} y2={nodeY + 9} />
                <line className="al-cut" x1={x - 13} y1={nodeY + 9} x2={x + 13} y2={nodeY - 9} />
              </>
            ) : (
              <circle className="al-node" cx={x} cy={nodeY} r={s.status === 'runs' ? 5.2 : 3.8} />
            )}
            <text
              className="al-stem-label"
              x={x}
              y={labelY}
              textAnchor="middle"
              data-side={s.side}
            >
              {s.name}
            </text>
            <text className="al-stem-sub" x={x} y={subY} textAnchor="middle">
              {s.year} · {SYSTEM_STATUS_LABEL[s.status]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* The record table — the engraving's textual mirror                   */
/* ------------------------------------------------------------------ */

function RecordTable() {
  return (
    <table className="al-record" data-testid="record-table">
      <caption className="al-record-caption">
        The record — every system on the line, and who carries it now. Leadership measured by what
        runs without me.
      </caption>
      <thead>
        <tr>
          <th scope="col">System</th>
          <th scope="col">In service</th>
          <th scope="col">Standing</th>
          <th scope="col">Successor</th>
        </tr>
      </thead>
      <tbody>
        {SYSTEMS.map((s: TenureSystem) => (
          <tr key={s.id} data-status={s.status} data-sunset={s.status === 'sunset' ? 'true' : undefined}>
            <th scope="row">{s.name}</th>
            <td>{s.year}</td>
            <td>
              <span className="al-standing" data-status={s.status}>
                {SYSTEM_STATUS_LABEL[s.status]}
              </span>
            </td>
            <td>{s.successor ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ------------------------------------------------------------------ */
/* The letter                                                          */
/* ------------------------------------------------------------------ */

function LetterSectionBlock({ section }: { section: (typeof LETTER)[number] }) {
  return (
    <section
      className={`al-section${section.flagged ? ' al-section-flagged' : ''}`}
      aria-labelledby={`al-sec-${section.id}`}
      data-flagged={section.flagged ? 'true' : undefined}
    >
      <div className="al-section-body">
        <h2 id={`al-sec-${section.id}`} className="al-section-heading">
          <span className="al-numeral" aria-hidden="true">
            {section.numeral}
          </span>
          {section.heading}
        </h2>
        {section.flagged ? (
          <p className="al-flag-tag" aria-hidden="true">
            THE CORRECTION · KEPT IN THE RECORD ON PURPOSE
          </p>
        ) : null}
        {section.body.map((para, i) => (
          <p key={i} className="al-prose">
            {para}
          </p>
        ))}
      </div>
      <aside className="al-margin" aria-hidden="true">
        {section.margin.map((line, i) => (
          <span key={i} className="al-margin-line">
            {line}
          </span>
        ))}
      </aside>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The page                                                            */
/* ------------------------------------------------------------------ */

export default function AnnualLetterPage() {
  const { reduced } = useMotionPreference();

  useEffect(() => {
    document.title = 'The Annual Letter — Priya Balakrishnan — Live';
  }, []);

  const items = useMemo<LedgerRevealItem[]>(
    () => [
      {
        id: 'engraving',
        content: (
          <section className="al-engraving" aria-labelledby="al-engraving-heading">
            <h2 id="al-engraving-heading" className="al-engraving-heading">
              THE TENURE LINE
              <span className="al-engraving-sub">
                TWELVE YEARS · NINE SYSTEMS · FOUR NO LONGER MINE TO RUN
              </span>
            </h2>
            <div className="al-engraving-frame">
              <TenureEngraving />
            </div>
          </section>
        ),
      },
      ...LETTER.map((section) => ({
        id: `sec-${section.id}`,
        content: <LetterSectionBlock section={section} />,
      })),
      {
        id: 'principles',
        content: (
          <section className="al-principles" aria-label="Principles">
            {PRINCIPLES.map((p, i) => (
              <blockquote key={i} className="al-principle">
                <p>{p}</p>
              </blockquote>
            ))}
          </section>
        ),
      },
      {
        id: 'record',
        content: (
          <section className="al-record-section" aria-labelledby="al-record-heading">
            <h2 id="al-record-heading" className="al-section-heading al-record-heading">
              <span className="al-numeral" aria-hidden="true">
                V
              </span>
              The record, in full
            </h2>
            <RecordTable />
          </section>
        ),
      },
      {
        id: 'signature',
        content: (
          <section className="al-signature" aria-label="Signature">
            <p className="al-valediction">{SIGNATURE.valediction}</p>
            <p className="al-sign-name">{SIGNATURE.name}</p>
            <p className="al-sign-role">{SIGNATURE.role}</p>
            <p className="al-sign-place">{SIGNATURE.place}</p>
          </section>
        ),
      },
    ],
    [],
  );

  return (
    <div className="al-root" data-testid="live-letter" data-reduced={reduced ? 'true' : undefined}>
      <div className="al-paper" aria-hidden="true" />
      <header className="al-chrome" aria-label="Letter chrome">
        <div className="al-chrome-cell">
          <RouterLink to="/" className="al-back">
            ◄ GALLERY
          </RouterLink>
          <span className="al-chrome-rule" aria-hidden="true" />
          <span>{CHROME.world}</span>
        </div>
        <div className="al-chrome-cell">
          <span>{CHROME.edition}</span>
          <span className="al-chrome-rule" aria-hidden="true" />
          <span className="al-synthetic" data-testid="synthetic-mark">
            {CHROME.synthetic}
          </span>
        </div>
      </header>

      <main className="al-main">
        <section className="al-masthead" aria-labelledby="al-name">
          <p className="al-kicker">THE ANNUAL LETTER</p>
          <h1 id="al-name" className="al-name">
            {MASTHEAD.map((line, i) => (
              <span key={i} className="al-name-line">
                {line}
              </span>
            ))}
          </h1>
          <p className="al-role">
            {PERSON.role.toUpperCase()} · {PERSON.tenureLine}
          </p>
          <p className="al-standfirst">{STANDFIRST}</p>
          <p className="al-filed">{PERSON.filed}</p>
          <VisuallyHidden>
            This entire profile is illustrative and synthetic — a demonstration person, not a real
            member of staff. The systems, dates and figures are sample content.
          </VisuallyHidden>
        </section>

        <LedgerReveal className="al-reveal" items={items} />
      </main>

      <footer className="al-footer">
        <span>{CHROME.synthetic} · SAMPLE CONTENT IS MARKED AS SUCH</span>
        <span>{PERSON.tenureLine} · REPORTING TOWARD {PERSON.reportsToward}</span>
      </footer>
    </div>
  );
}
