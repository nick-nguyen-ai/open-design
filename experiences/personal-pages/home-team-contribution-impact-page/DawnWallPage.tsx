/**
 * "The Dawn Wall" — the live full-bleed rendering of
 * `home-team-contribution-impact-page`.
 *
 * A team lead's contribution page as a glass wall at first light. THE
 * CONFLUENCE owns the page: translucent streams (one per teammate, weighted by
 * contribution) flow left→right and converge into solid, bright outcome blocks
 * at the dawn edge. One stream ends mid-wall — a teammate who left — capped
 * with a tribute mark while their work still lights the outcomes it built.
 *
 * signal-glass, composed OPPOSITE to The Studio: horizontal confluence at dawn,
 * not late-afternoon stacked panes. HorizonSweep registers the wall and panels
 * onto the datum; reduced motion renders a static wall. Art-direction licence:
 * this file and dawn-wall.css are the experience-local art layer — raw colour
 * values are permitted HERE only; motion stays token-driven.
 */
import { useEffect, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { HorizonSweep, useMotionPreference } from '@enterprise-design/motion';
import type { HorizonSweepItem } from '@enterprise-design/motion';
import { VisuallyHidden } from '@enterprise-design/primitives';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import './dawn-wall.css';
import {
  CHROME,
  CONTRIBUTIONS,
  LEAD,
  OUTCOMES,
  RITUALS,
  STATEMENT,
  STATEMENT_SUBLINE,
  STREAMS,
  outcomeById,
  ribbonWeight,
  streamById,
} from './content.js';
import type { Contribution, Outcome, Stream } from './content.js';

/* ------------------------------------------------------------------ */
/* Confluence geometry — a bespoke Sankey computed from the pack       */
/* ------------------------------------------------------------------ */

const VB_W = 1000;
const VB_H = 560;
const PAD_Y = 28;
const LEFT_X = 214;
const RIGHT_X = 736;
const OUT_X = 750;
const OUT_W = VB_W - OUT_X - 6;
const NODE_GAP = 16;
const OUT_GAP = 22;
const DEPART_FRAC = 0.52; // where the departed stream caps, along the wall

interface RibbonGeo {
  id: string;
  path: string;
  departed: boolean;
  streamId: string;
  outcomeId: string;
}

interface StreamGeo {
  stream: Stream;
  cy: number;
  y0: number;
  y1: number;
  labelY: number;
  capX?: number;
}

interface OutcomeGeo {
  outcome: Outcome;
  y0: number;
  y1: number;
  cy: number;
  h: number;
  index: number;
}

interface Confluence {
  ribbons: RibbonGeo[];
  streams: StreamGeo[];
  outcomes: OutcomeGeo[];
}

function buildConfluence(): Confluence {
  const totalW = CONTRIBUTIONS.reduce((sum, c) => sum + ribbonWeight(c), 0);

  const streamWeight = new Map<string, number>();
  for (const s of STREAMS) {
    streamWeight.set(
      s.id,
      CONTRIBUTIONS.filter((c) => c.streamId === s.id).reduce((sum, c) => sum + ribbonWeight(c), 0),
    );
  }
  const outcomeWeight = new Map<string, number>();
  for (const o of OUTCOMES) {
    outcomeWeight.set(
      o.id,
      CONTRIBUTIONS.filter((c) => c.outcomeId === o.id).reduce((sum, c) => sum + ribbonWeight(c), 0),
    );
  }

  const availLeft = VB_H - 2 * PAD_Y - (STREAMS.length - 1) * NODE_GAP;
  const availRight = VB_H - 2 * PAD_Y - (OUTCOMES.length - 1) * OUT_GAP;
  const scale = Math.min(availLeft / totalW, availRight / totalW);

  const leftStackH =
    STREAMS.reduce((s, st) => s + (streamWeight.get(st.id) ?? 0) * scale, 0) +
    (STREAMS.length - 1) * NODE_GAP;
  const rightStackH =
    OUTCOMES.reduce((s, o) => s + (outcomeWeight.get(o.id) ?? 0) * scale, 0) +
    (OUTCOMES.length - 1) * OUT_GAP;

  // left stacks (streams)
  const streams: StreamGeo[] = [];
  const leftCursor = new Map<string, number>();
  let ly = (VB_H - leftStackH) / 2;
  for (const s of STREAMS) {
    const h = (streamWeight.get(s.id) ?? 0) * scale;
    streams.push({
      stream: s,
      y0: ly,
      y1: ly + h,
      cy: ly + h / 2,
      labelY: ly + h / 2,
      capX: s.departed ? LEFT_X + (RIGHT_X - LEFT_X) * DEPART_FRAC : undefined,
    });
    leftCursor.set(s.id, ly);
    ly += h + NODE_GAP;
  }

  // right stacks (outcomes)
  const outcomes: OutcomeGeo[] = [];
  const rightCursor = new Map<string, number>();
  let ry = (VB_H - rightStackH) / 2;
  OUTCOMES.forEach((o, index) => {
    const h = (outcomeWeight.get(o.id) ?? 0) * scale;
    outcomes.push({ outcome: o, y0: ry, y1: ry + h, cy: ry + h / 2, h, index });
    rightCursor.set(o.id, ry);
    ry += h + OUT_GAP;
  });

  // ribbons — stacked at both ends in a stable order
  const ribbons: RibbonGeo[] = [];
  const orderedContribs = STREAMS.flatMap((s) =>
    OUTCOMES.flatMap((o) =>
      CONTRIBUTIONS.filter((c) => c.streamId === s.id && c.outcomeId === o.id),
    ),
  );
  for (const c of orderedContribs) {
    const w = ribbonWeight(c) * scale;
    const lTop = leftCursor.get(c.streamId) ?? 0;
    const rTop = rightCursor.get(c.outcomeId) ?? 0;
    leftCursor.set(c.streamId, lTop + w);
    rightCursor.set(c.outcomeId, rTop + w);
    const s = streamById(c.streamId);
    ribbons.push({
      id: `${c.streamId}-${c.outcomeId}`,
      path: ribbonPath(LEFT_X, lTop, lTop + w, RIGHT_X, rTop, rTop + w),
      departed: Boolean(s.departed),
      streamId: c.streamId,
      outcomeId: c.outcomeId,
    });
  }

  return { ribbons, streams, outcomes };
}

function ribbonPath(
  x0: number,
  y0t: number,
  y0b: number,
  x1: number,
  y1t: number,
  y1b: number,
): string {
  const cx = x0 + (x1 - x0) * 0.5;
  return [
    `M ${x0.toFixed(1)} ${y0t.toFixed(1)}`,
    `C ${cx.toFixed(1)} ${y0t.toFixed(1)}, ${cx.toFixed(1)} ${y1t.toFixed(1)}, ${x1.toFixed(1)} ${y1t.toFixed(1)}`,
    `L ${x1.toFixed(1)} ${y1b.toFixed(1)}`,
    `C ${cx.toFixed(1)} ${y1b.toFixed(1)}, ${cx.toFixed(1)} ${y0b.toFixed(1)}, ${x0.toFixed(1)} ${y0b.toFixed(1)}`,
    'Z',
  ].join(' ');
}

/* ------------------------------------------------------------------ */
/* The wall (bespoke SVG; mirrored by the contributions table)         */
/* ------------------------------------------------------------------ */

function WallPanel({ reduced }: { reduced: boolean }) {
  return (
    <section className="dw-wall-panel" aria-labelledby="dw-wall-heading">
      <h2 id="dw-wall-heading" className="dw-section-heading">
        THE CONFLUENCE
        <span className="dw-section-sub">
          STREAM WIDTH = CONTRIBUTION SHARE · CONVERGING INTO SHIPPED OUTCOMES AT FIRST LIGHT
        </span>
      </h2>
      <TheWall reduced={reduced} />
    </section>
  );
}

function TheWall({ reduced }: { reduced: boolean }) {
  const { ribbons, streams, outcomes } = useMemo(() => buildConfluence(), []);

  return (
    <svg
      className="dw-wall"
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      role="img"
      aria-label="The confluence — six contribution streams flowing into three shipped outcomes; stream widths are contribution share. Wei Zhang's stream ends mid-wall but stays credited. Full figures in the contributions table below."
      data-testid="the-confluence"
      data-reduced={reduced ? 'true' : undefined}
    >
      <defs>
        <linearGradient id="dw-field" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#141636" />
          <stop offset="0.62" stopColor="#221a44" />
          <stop offset="1" stopColor="#3a2748" />
        </linearGradient>
        <linearGradient id="dw-ribbon" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5b6ff0" stopOpacity="0.42" />
          <stop offset="0.55" stopColor="#7d7ae0" stopOpacity="0.5" />
          <stop offset="1" stopColor="#f4a552" stopOpacity="0.72" />
        </linearGradient>
        <linearGradient id="dw-outcome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffcf8a" />
          <stop offset="1" stopColor="#f2953f" />
        </linearGradient>
        <radialGradient id="dw-dawn" cx="1" cy="0.5" r="0.9">
          <stop offset="0" stopColor="#ffb85e" stopOpacity="0.5" />
          <stop offset="0.5" stopColor="#f79a4a" stopOpacity="0.14" />
          <stop offset="1" stopColor="#f79a4a" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width={VB_W} height={VB_H} fill="url(#dw-field)" rx="14" />
      <rect x={RIGHT_X - 120} y="0" width={VB_W - RIGHT_X + 120} height={VB_H} fill="url(#dw-dawn)" />
      {/* the horizon band — first light along the dawn edge */}
      <line className="dw-horizon" x1="0" y1={VB_H / 2} x2={VB_W} y2={VB_H / 2} />

      {/* ribbons */}
      {ribbons.map((r) => (
        <path
          key={r.id}
          className={`dw-ribbon${r.departed ? ' dw-ribbon-departed' : ''}`}
          d={r.path}
          fill="url(#dw-ribbon)"
        />
      ))}

      {/* stream origins + labels */}
      {streams.map((sg) => (
        <g key={sg.stream.id} className={`dw-stream${sg.stream.departed ? ' dw-stream-departed' : ''}`}>
          <rect className="dw-origin" x={LEFT_X - 6} y={sg.y0} width="6" height={sg.y1 - sg.y0} rx="2" />
          <text className="dw-origin-name" x={LEFT_X - 16} y={sg.labelY - 3} textAnchor="end">
            {sg.stream.person}
          </text>
          <text className="dw-origin-chan" x={LEFT_X - 16} y={sg.labelY + 9} textAnchor="end">
            {sg.stream.channel} · {sg.stream.workstream}
          </text>
          {sg.capX !== undefined ? (
            <g className="dw-cap">
              <line className="dw-cap-bar" x1={sg.capX} y1={sg.y0 - 3} x2={sg.capX} y2={sg.y1 + 3} />
              <circle className="dw-cap-mark" cx={sg.capX} cy={sg.cy} r="6" />
              <text className="dw-cap-glyph" x={sg.capX} y={sg.cy + 3.4} textAnchor="middle">
                &#8224;
              </text>
              <text className="dw-cap-note" x={sg.capX} y={sg.y1 + 20} textAnchor="middle">
                STREAM ENDS · STILL CREDITED
              </text>
            </g>
          ) : null}
        </g>
      ))}

      {/* outcome blocks — solid, bright, at the dawn edge: name + metric */}
      {outcomes.map((og) => (
        <g key={og.outcome.id} className="dw-out">
          <rect
            className="dw-out-block"
            x={OUT_X}
            y={og.y0}
            width={OUT_W}
            height={og.h}
            rx="6"
            fill="url(#dw-outcome)"
          />
          <text className="dw-out-code" x={OUT_X + 14} y={og.y0 + 22}>
            O{og.index + 1}
          </text>
          <text className="dw-out-name" x={OUT_X + 14} y={og.cy - 6}>
            <tspan x={OUT_X + 14} dy="0">
              {og.outcome.short[0]}
            </tspan>
            <tspan x={OUT_X + 14} dy="15">
              {og.outcome.short[1]}
            </tspan>
          </text>
          <text className="dw-out-metric" x={OUT_X + 14} y={og.y1 - 14}>
            {og.outcome.metric}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Supporting panels                                                   */
/* ------------------------------------------------------------------ */

function contributorsFor(outcome: Outcome): Contribution[] {
  // names first, lead (Renata) last
  return CONTRIBUTIONS.filter((c) => c.outcomeId === outcome.id).sort((a, b) => {
    const al = streamById(a.streamId).id === 's-renata' ? 1 : 0;
    const bl = streamById(b.streamId).id === 's-renata' ? 1 : 0;
    if (al !== bl) return al - bl;
    return b.share - a.share;
  });
}

function ImpactReceipts() {
  return (
    <section className="dw-receipts" aria-labelledby="dw-receipts-heading">
      <h2 id="dw-receipts-heading" className="dw-section-heading">
        IMPACT RECEIPTS
        <span className="dw-section-sub">BEFORE → AFTER · WHO DROVE EACH · NAMES FIRST, LEAD LAST</span>
      </h2>
      <ul className="dw-receipt-list">
        {OUTCOMES.map((o, i) => (
          <li key={o.id} className="dw-receipt">
            <div className="dw-receipt-head">
              <span className="dw-receipt-code">O{i + 1}</span>
              <h3 className="dw-receipt-name">{o.name}</h3>
            </div>
            <p className="dw-receipt-numbers">
              <span className="dw-before">{o.before}</span>
              <span className="dw-arrow" aria-hidden="true">
                →
              </span>
              <span className="dw-after">{o.after}</span>
            </p>
            <p className="dw-receipt-impact">{o.impact}</p>
            <ul className="dw-drivers">
              {contributorsFor(o).map((c) => {
                const s = streamById(c.streamId);
                return (
                  <li key={c.streamId} className={s.departed ? 'dw-driver dw-driver-departed' : 'dw-driver'}>
                    <span className="dw-driver-name">{s.person}</span>
                    <span className="dw-driver-share">{Math.round(c.share * 100)}%</span>
                    {s.departed ? <span className="dw-driver-flag">&#8224; departed, credited</span> : null}
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Rituals() {
  return (
    <section className="dw-rituals" aria-labelledby="dw-rituals-heading">
      <h2 id="dw-rituals-heading" className="dw-section-heading">
        HOW THE TEAM WORKS
        <span className="dw-section-sub">RITUALS, MEASURED — NOT A VALUES POSTER</span>
      </h2>
      <ul className="dw-ritual-grid">
        {RITUALS.map((r) => (
          <li key={r.id} className="dw-ritual">
            <h3 className="dw-ritual-title">{r.title}</h3>
            <p className="dw-ritual-measure">{r.measure}</p>
            <p className="dw-ritual-detail">{r.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ContributionsTable() {
  return (
    <section className="dw-mirror" aria-labelledby="dw-mirror-heading">
      <h2 id="dw-mirror-heading" className="dw-section-heading">
        CONTRIBUTIONS
        <span className="dw-section-sub">PERSON × OUTCOME × SHARE — THE ACCESSIBLE MIRROR OF THE WALL</span>
      </h2>
      <table className="dw-table" data-testid="contributions-table">
        <caption className="dw-table-caption">
          Every stream on the wall as figures: each person&rsquo;s share of each outcome they drove.
          Wei Zhang left in March 2026 and remains credited on the data-contracts outcome.
        </caption>
        <thead>
          <tr>
            <th scope="col">Person</th>
            <th scope="col">Workstream</th>
            <th scope="col">Outcome</th>
            <th scope="col">Share</th>
          </tr>
        </thead>
        <tbody>
          {STREAMS.flatMap((s) =>
            CONTRIBUTIONS.filter((c) => c.streamId === s.id).map((c) => (
              <tr key={`${s.id}-${c.outcomeId}`} data-departed={s.departed ? 'true' : undefined}>
                <th scope="row">
                  {s.person}
                  {s.departed ? ' †' : ''}
                </th>
                <td>{s.workstream}</td>
                <td>{outcomeById(c.outcomeId).name}</td>
                <td>{Math.round(c.share * 100)}%</td>
              </tr>
            )),
          )}
        </tbody>
      </table>
      <p className="dw-mirror-note">† Departed MAR 2026 — attribution survives departure.</p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The page                                                            */
/* ------------------------------------------------------------------ */

export default function DawnWallPage() {
  const { reduced } = useMotionPreference();

  useEffect(() => {
    document.title = 'The Dawn Wall — Renata Vasquez — Live';
  }, []);

  const panels = useMemo<HorizonSweepItem[]>(
    () => [
      { id: 'wall', content: <WallPanel reduced={reduced} /> },
      { id: 'receipts', content: <ImpactReceipts /> },
      { id: 'rituals', content: <Rituals /> },
      { id: 'mirror', content: <ContributionsTable /> },
    ],
    [reduced],
  );

  return (
    <div className="dw-root" data-testid="live-dawn-wall" data-reduced={reduced ? 'true' : undefined}>
      <div className="dw-field" aria-hidden="true" />

      <header className="dw-chrome" aria-label="The Dawn Wall chrome">
        <div className="dw-chrome-cell">
          <RouterLink to="/" className="dw-back">
            ◄ GALLERY
          </RouterLink>
          <span className="dw-chrome-rule" aria-hidden="true" />
          <span>{CHROME.world}</span>
        </div>
        <div className="dw-chrome-cell">
          <span>{CHROME.timeOfDay}</span>
          <span className="dw-chrome-rule" aria-hidden="true" />
          <span className="dw-synthetic" data-testid="synthetic-mark">
            {CHROME.synthetic}
          </span>
        </div>
      </header>

      <main className="dw-main">
        <section className="dw-hero" aria-labelledby="dw-statement">
          <p className="dw-kicker">THE DAWN WALL</p>
          <h1 id="dw-statement" className="dw-display">
            {STATEMENT.map((line, i) => (
              <span key={i} className="dw-display-line">
                {line}
              </span>
            ))}
          </h1>
          <p className="dw-subline">{STATEMENT_SUBLINE}</p>

          <div className="dw-lead-card" data-testid="lead-card">
            <p className="dw-lead-framing">{LEAD.framing}</p>
            <p className="dw-lead-note">{LEAD.note}</p>
            <p className="dw-lead-sig">
              {LEAD.name} · {LEAD.role.toUpperCase()} · {LEAD.team.toUpperCase()}
            </p>
          </div>
          <VisuallyHidden>
            This entire profile is illustrative and synthetic — demonstration people, not real
            members of staff. Contribution shares, outcomes and figures are sample content.
          </VisuallyHidden>
        </section>

        <HorizonSweep className="dw-sweep" items={panels} />
      </main>

      <footer className="dw-footer">
        <span>{CHROME.synthetic} · SAMPLE CONTENT IS MARKED AS SUCH</span>
        <span>ATTRIBUTION SURVIVES DEPARTURE</span>
      </footer>
    </div>
  );
}
