/**
 * "The Bet Book" — the live full-bleed rendering of
 * `proj-research-innovation-initiative`.
 *
 * Exploratory research as a shared betting book: each bet a spread with the
 * hypothesis, the stake, running odds that move only on evidence, and the
 * next experiment on the slip. Handwritten margin notes in the bookmaker's
 * own hand. Grammar: research-notebook; signature: data-ink-draw (each
 * bet's confidence track draws itself in ink); motion level 1; locked light.
 *
 * Art-direction licence: this file and bet-book.css are the experience-local
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
import '@fontsource/caveat/500.css';
import './bet-book.css';
import { BETS, BOOK, FOOT, HOUSE_RULES, STATUS_LABEL, type Bet } from './content.js';

const TRACK_W = 150;
const TRACK_H = 44;

function trackPoints(track: readonly number[]): string {
  const step = track.length > 1 ? TRACK_W / (track.length - 1) : 0;
  return track
    .map((value, i) => `${(i * step).toFixed(1)},${(TRACK_H - 4 - (value / 100) * (TRACK_H - 8)).toFixed(1)}`)
    .join(' ');
}

function ConfidenceTrack({ bet, index }: { bet: Bet; index: number }) {
  return (
    <svg
      className="bb-track"
      viewBox={`0 0 ${TRACK_W} ${TRACK_H}`}
      role="img"
      aria-label={`Confidence track for ${bet.no}: ${bet.track.join(', ')} out of 100 across checkpoints.`}
    >
      <line className="bb-track-base" x1={0} y1={TRACK_H - 4} x2={TRACK_W} y2={TRACK_H - 4} />
      <polyline
        className="bb-track-ink"
        points={trackPoints(bet.track)}
        pathLength={1}
        style={{ ['--bb-ink-delay' as string]: `${200 + index * 140}ms` }}
      />
    </svg>
  );
}

export default function BetBookPage() {
  const { reduced } = useMotionPreference();

  return (
    <div className="bb-root" data-testid="live-bet-book" data-reduced={reduced ? 'true' : undefined}>
      <header className="bb-chrome" data-part-id="proj-research-innovation-initiative/chrome">
        <div className="bb-chrome-left">
          <RouterLink to="/" className="bb-back">
            ◄ GALLERY
          </RouterLink>
          <span className="bb-chrome-rule" aria-hidden="true" />
          <span className="bb-chrome-mast">{BOOK.masthead}</span>
        </div>
        <span className="bb-chrome-ref">{BOOK.ref}</span>
      </header>

      <main className="bb-main">
        <section className="bb-opening" aria-labelledby="bb-title" data-part-id="proj-research-innovation-initiative/opening">
          <p className="bb-kicker">{BOOK.kicker}</p>
          <h1 id="bb-title" className="bb-title">
            {BOOK.title}
          </h1>
          <p className="bb-subline">{BOOK.subline}</p>
          <dl className="bb-figures" data-part-id="proj-research-innovation-initiative/opening/figures">
            {BOOK.figures.map((figure) => (
              <div key={figure.label} className="bb-figure">
                <dt>{figure.label}</dt>
                <dd>{figure.value}</dd>
              </div>
            ))}
          </dl>
          <p className="bb-provenance">{BOOK.provenance}</p>
        </section>

        <section className="bb-band" aria-labelledby="bb-bets-heading" data-part-id="proj-research-innovation-initiative/bets">
          <h2 id="bb-bets-heading" className="bb-band-heading">
            The spreads
            <span className="bb-band-sub">One spread per bet — odds, evidence, and the slip</span>
          </h2>
          <ol className="bb-bets" data-part-id="proj-research-innovation-initiative/bets/bet-spreads">
            {BETS.map((bet, index) => (
              <li key={bet.id} className="bb-bet" data-status={bet.status}>
                <div className="bb-bet-main">
                  <header className="bb-bet-head">
                    <span className="bb-bet-no">{bet.no}</span>
                    <span className="bb-bet-status" data-status={bet.status}>
                      {STATUS_LABEL[bet.status]}
                    </span>
                  </header>
                  <p className="bb-bet-hypothesis">{bet.hypothesis}</p>
                  <p className="bb-bet-line">
                    <span className="bb-bet-label">STAKE</span> {bet.stake}
                    <span className="bb-bet-label bb-bet-label-gap">OPENED</span> {bet.openingOdds}
                    <span className="bb-bet-label bb-bet-label-gap">NOW</span>
                    <span className="bb-bet-odds">{bet.currentOdds}</span>
                  </p>
                  <ul className="bb-evidence">
                    {bet.evidence.map((entry) => (
                      <li key={entry.date} className="bb-evidence-entry">
                        <span className="bb-evidence-date">{entry.date}</span>
                        {entry.entry}
                      </li>
                    ))}
                  </ul>
                  <p className="bb-slip">{bet.slip}</p>
                </div>
                <div className="bb-bet-margin">
                  <ConfidenceTrack bet={bet} index={index} />
                  <p className="bb-margin-note" aria-label={`Margin note: ${bet.margin}`}>
                    {bet.margin}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="bb-band" aria-labelledby="bb-rules-heading" data-part-id="proj-research-innovation-initiative/house-rules">
          <h2 id="bb-rules-heading" className="bb-band-heading">
            {HOUSE_RULES.title}
            <span className="bb-band-sub">{HOUSE_RULES.sub}</span>
          </h2>
          <ol className="bb-rules">
            {HOUSE_RULES.rules.map((rule, i) => (
              <li key={rule.id} className="bb-rule">
                <span className="bb-rule-num">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <p className="bb-rule-text">{rule.rule}</p>
                  <p className="bb-rule-note">{rule.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="bb-foot">
        <p>{FOOT.note}</p>
        <p className="bb-foot-line">
          <span>{BOOK.provenance}</span>
          <span>{FOOT.next}</span>
        </p>
      </footer>
    </div>
  );
}
