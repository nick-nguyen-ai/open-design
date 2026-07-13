/**
 * "The Atlas" — the live full-bleed rendering of `home-knowledge-atlas`.
 *
 * A staff engineer's knowledge drawn as a NAUTICAL CHART. THE CHART owns the
 * page: knowledge domains are TERRITORIES whose coastlines are composed from
 * the content pack (landmass = breadth, contour density = mastery); artifacts
 * are SETTLEMENTS marked with founding dates; SHIPPING LANES connect bridged
 * territories; SOUNDINGS mark waters only sailed; and one UNCHARTED region —
 * `HERE BE GAPS` — admits the edges of the map (the anomaly).
 *
 * Territories are keyboard-focusable (west→east focus order); focusing or
 * selecting one raises its gazetteer entry. HorizonSweep registers the
 * supporting panels onto the datum; coastlines thread-trace via a CSS stroke
 * draw on a platform token easing (fully drawn, static, under reduced motion).
 * Art-direction licence: this file and atlas.css are the experience-local art
 * layer — raw colour values are permitted HERE only; motion stays token-driven.
 */
import { useEffect, useId, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { HorizonSweep, useMotionPreference } from '@enterprise-design/motion';
import type { HorizonSweepItem } from '@enterprise-design/motion';
import { VisuallyHidden } from '@enterprise-design/primitives';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource-variable/fraunces/opsz-italic.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import './atlas.css';
import {
  CARTOGRAPHER,
  CHROME,
  EXPEDITIONS,
  IDENTITY_FACTS,
  LANES,
  LEGEND,
  MASTERY_LABEL,
  PERSON,
  SETTLEMENT_KIND_LABEL,
  SOUNDINGS,
  STATEMENT,
  STATEMENT_SUBLINE,
  TERRITORIES,
  UNCHARTED,
} from './content.js';
import type { Territory } from './content.js';

/* ------------------------------------------------------------------ */
/* Chart geometry                                                      */
/* ------------------------------------------------------------------ */

const VB_W = 1000;
const VB_H = 672;

/** 16 rhumb-line bearings from a chart compass point — portolan texture. */
const RHUMB_FROM = { x: 508, y: 300 };

/** West→east focus order — the tab order across the chart. */
const CHART_TERRITORIES = [...TERRITORIES].sort((a, b) => a.cx - b.cx);

interface Pt {
  x: number;
  y: number;
}

/** N coastline vertices from the territory's radius profile, scaled by `k`. */
function coastPoints(t: Territory, k = 1): Pt[] {
  const n = t.coast.length;
  return t.coast.map((mult, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const r = t.radius * mult * k;
    return { x: t.cx + Math.cos(angle) * r, y: t.cy + Math.sin(angle) * r };
  });
}

/** Closed Catmull-Rom spline through `pts`, emitted as smooth cubic béziers. */
function closedSpline(pts: Pt[]): string {
  const n = pts.length;
  if (n < 3) return '';
  const at = (i: number): Pt => pts[((i % n) + n) % n] as Pt;
  let d = `M ${at(0).x.toFixed(1)} ${at(0).y.toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d + ' Z';
}

function centroidOf(id: string): Pt {
  const t = TERRITORIES.find((x) => x.id === id);
  return t ? { x: t.cx, y: t.cy } : { x: 0, y: 0 };
}

/** A bowed shipping lane between two centroids. */
function lanePath(from: Pt, to: Pt, bow: number): string {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const cx = mx + nx * bow;
  const cy = my + ny * bow;
  return `M ${from.x.toFixed(1)} ${from.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${to.x.toFixed(1)} ${to.y.toFixed(1)}`;
}

/* ------------------------------------------------------------------ */
/* One territory on the chart — a focusable island                     */
/* ------------------------------------------------------------------ */

function TerritoryShape({
  t,
  index,
  selected,
  onSelect,
}: {
  t: Territory;
  index: number;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const coast = useMemo(() => closedSpline(coastPoints(t)), [t]);
  // Interior contour rings — more rings, tighter, for higher mastery.
  const rings = useMemo(() => {
    const step = 0.6 / (t.mastery + 1);
    return Array.from({ length: t.mastery }, (_, k) =>
      closedSpline(coastPoints(t, 1 - (k + 1) * step)),
    );
  }, [t]);

  const label = `${t.name}. ${MASTERY_LABEL[t.mastery]}. ${t.settlements.length} settlement${
    t.settlements.length === 1 ? '' : 's'
  }. Last visited ${t.lastVisited}.`;

  return (
    <g
      className={`at-territory${selected ? ' at-territory-selected' : ''}`}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={label}
      style={{ ['--at-coast-delay' as string]: `${index * 140}ms` }}
      onClick={() => onSelect(t.id)}
      onFocus={() => onSelect(t.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(t.id);
        }
      }}
    >
      {/* landmass fill — raised, with an elevation wash */}
      <path className="at-land" d={coast} />
      <path className="at-land-elev" d={coast} aria-hidden="true" />
      {/* elevation contours — denser rings = higher mastery */}
      {rings.map((d, k) => (
        <path key={k} className="at-contour" d={d} aria-hidden="true" />
      ))}
      {/* coastline — the traced stroke */}
      <path className="at-coastline" d={coast} pathLength={100} aria-hidden="true" />

      {/* settlements */}
      {t.settlements.map((s) => {
        const sx = t.cx + s.at.dx * t.radius;
        const sy = t.cy + s.at.dy * t.radius;
        return (
          <g key={s.id} className={`at-settlement at-settlement-${s.kind}`} aria-hidden="true">
            {s.kind === 'talk' ? (
              <circle className="at-settle-mark" cx={sx} cy={sy} r={5} />
            ) : s.kind === 'doc' ? (
              <rect className="at-settle-mark" x={sx - 4.2} y={sy - 4.2} width={8.4} height={8.4} />
            ) : (
              <path
                className="at-settle-mark"
                d={`M ${sx} ${sy - 5.4} L ${sx + 5.4} ${sy} L ${sx} ${sy + 5.4} L ${sx - 5.4} ${sy} Z`}
              />
            )}
            <text className="at-settle-name" x={sx + 9} y={sy + 3.4}>
              {s.name}
            </text>
            <text className="at-settle-founded" x={sx + 9} y={sy + 14.6}>
              est. {s.founded}
            </text>
          </g>
        );
      })}

      {/* territory name — letterspaced small caps — and its waters */}
      <text className="at-terr-name" x={t.cx} y={t.cy - t.radius * 0.16} textAnchor="middle">
        {t.name.toUpperCase()}
      </text>
      <text className="at-terr-waters" x={t.cx} y={t.cy + t.radius * 0.02} textAnchor="middle">
        {t.waters}
      </text>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* The chart — the commanding visual                                   */
/* ------------------------------------------------------------------ */

function TheChart({
  reduced,
  selectedId,
  onSelect,
  descId,
}: {
  reduced: boolean;
  selectedId: string;
  onSelect: (id: string) => void;
  descId: string;
}) {
  return (
    <svg
      className="at-chart"
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      role="group"
      aria-labelledby={`${descId}-title ${descId}-desc`}
      data-testid="the-chart"
      data-reduced={reduced ? 'true' : undefined}
    >
      <title id={`${descId}-title`}>Knowledge atlas — a nautical chart of six territories</title>
      <desc id={`${descId}-desc`}>
        Six knowledge territories drawn as islands, ten settlements, four shipping lanes, three
        soundings, and one uncharted region marked HERE BE GAPS. Each territory is a focusable
        control that raises its gazetteer entry. The full gazetteer table below is the accessible
        equivalent.
      </desc>

      <defs>
        <radialGradient id="at-sea" cx="0.32" cy="0.26" r="1">
          <stop offset="0" stopColor="#143755" />
          <stop offset="0.5" stopColor="#0c2338" />
          <stop offset="1" stopColor="#06131f" />
        </radialGradient>
        <radialGradient id="at-land-grad" cx="0.42" cy="0.36" r="0.72">
          <stop offset="0" stopColor="#1a4666" />
          <stop offset="0.6" stopColor="#123651" />
          <stop offset="1" stopColor="#0c273b" />
        </radialGradient>
        <pattern id="at-hatch" width="9" height="9" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="9" className="at-hatch-line" />
        </pattern>
      </defs>

      {/* sea */}
      <rect x="0" y="0" width={VB_W} height={VB_H} fill="url(#at-sea)" />

      {/* rhumb lines radiating from a chart compass point — portolan texture */}
      <g className="at-rhumb" aria-hidden="true">
        {Array.from({ length: 16 }, (_, i) => {
          const a = (i / 16) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={RHUMB_FROM.x}
              y1={RHUMB_FROM.y}
              x2={RHUMB_FROM.x + Math.cos(a) * 1400}
              y2={RHUMB_FROM.y + Math.sin(a) * 1400}
            />
          );
        })}
      </g>

      {/* graticule */}
      <g className="at-graticule" aria-hidden="true">
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`v${i}`} x1={(i + 1) * 100} y1="0" x2={(i + 1) * 100} y2={VB_H} />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={(i + 1) * 96} x2={VB_W} y2={(i + 1) * 96} />
        ))}
      </g>

      {/* neat-line frame + latitude / longitude ticks */}
      <g className="at-neatline" aria-hidden="true">
        <rect x="8" y="8" width={VB_W - 16} height={VB_H - 16} />
        <rect className="at-neatline-inner" x="15" y="15" width={VB_W - 30} height={VB_H - 30} />
        {['14°W', '10°W', '6°W', '2°W', '2°E', '6°E', '10°E', '14°E', '18°E'].map((lng, i) => (
          <text key={lng} className="at-graticule-label" x={(i + 1) * 100} y={26} textAnchor="middle">
            {lng}
          </text>
        ))}
        {['58°N', '54°N', '50°N', '46°N', '42°N'].map((lat, i) => (
          <text key={lat} className="at-graticule-label" x={24} y={(i + 1) * 96 + 3} textAnchor="start">
            {lat}
          </text>
        ))}
      </g>

      {/* shipping lanes (under land labels, over sea) */}
      <g className="at-lanes" aria-hidden="true">
        {LANES.map((l) => {
          const from = centroidOf(l.from);
          const to = centroidOf(l.to);
          const d = lanePath(from, to, l.bow);
          const mx = (from.x + to.x) / 2 + (-(to.y - from.y) / (Math.hypot(to.x - from.x, to.y - from.y) || 1)) * l.bow;
          const my = (from.y + to.y) / 2 + ((to.x - from.x) / (Math.hypot(to.x - from.x, to.y - from.y) || 1)) * l.bow;
          return (
            <g key={l.id} className="at-lane">
              <path className="at-lane-path" d={d} pathLength={100} />
              <text className="at-lane-label" x={mx} y={my - 5} textAnchor="middle">
                {l.cargo}
              </text>
            </g>
          );
        })}
      </g>

      {/* soundings — depth marks in open water */}
      <g className="at-soundings" aria-hidden="true">
        {SOUNDINGS.map((s) => (
          <g key={s.id} className="at-sounding">
            <text className="at-sounding-depth" x={s.x} y={s.y} textAnchor="middle">
              {s.fathoms}
            </text>
            <text className="at-sounding-label" x={s.x} y={s.y + 15} textAnchor="middle">
              {s.label}
            </text>
          </g>
        ))}
      </g>

      {/* territories */}
      {CHART_TERRITORIES.map((t, i) => (
        <TerritoryShape
          key={t.id}
          t={t}
          index={i}
          selected={t.id === selectedId}
          onSelect={onSelect}
        />
      ))}

      {/* the uncharted region — the anomaly, drawn large and honestly */}
      <g className="at-uncharted" aria-hidden="true" data-testid="uncharted">
        <polygon className="at-uncharted-fill" points={UNCHARTED.polygon} />
        <polygon className="at-uncharted-edge" points={UNCHARTED.polygon} />
        <path className="at-uncharted-serpent" d="M 566 604 q 10 -12 22 0 q 12 12 24 0 q 12 -12 24 0" />
        <text className="at-uncharted-title" x={742} y={600} textAnchor="middle">
          {UNCHARTED.title}
        </text>
        <text className="at-uncharted-legend" x={742} y={620} textAnchor="middle">
          {UNCHARTED.legend}
        </text>
      </g>

      {/* compass rose — an eight-point star */}
      <g className="at-compass" aria-hidden="true" transform="translate(78 590)">
        <circle className="at-compass-ring" cx="0" cy="0" r="44" />
        <circle className="at-compass-ring at-compass-ring-2" cx="0" cy="0" r="31" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const a = (deg - 90) * (Math.PI / 180);
          const long = deg % 90 === 0;
          const r = long ? 42 : 26;
          const ax = Math.cos(a) * r;
          const ay = Math.sin(a) * r;
          const px = Math.cos(a + Math.PI / 2) * 5;
          const py = Math.sin(a + Math.PI / 2) * 5;
          return (
            <path
              key={deg}
              className={long ? 'at-compass-point at-compass-point-main' : 'at-compass-point'}
              d={`M ${ax} ${ay} L ${px} ${py} L ${-px} ${-py} Z`}
            />
          );
        })}
        <circle className="at-compass-hub" cx="0" cy="0" r="3.4" />
        <text className="at-compass-label" x="0" y="-50" textAnchor="middle">
          N
        </text>
      </g>

      {/* scale bar */}
      <g className="at-scalebar" aria-hidden="true" transform="translate(158 640)">
        <line className="at-scale-rule" x1="0" y1="0" x2="140" y2="0" />
        {[0, 35, 70, 105, 140].map((x) => (
          <line key={x} className="at-scale-tick" x1={x} y1="-4" x2={x} y2="4" />
        ))}
        <rect className="at-scale-fill" x="0" y="-3" width="35" height="6" />
        <rect className="at-scale-fill" x="70" y="-3" width="35" height="6" />
        <text className="at-scale-label" x="0" y="16">
          0
        </text>
        <text className="at-scale-label" x="140" y="16" textAnchor="end">
          4 leagues of experience
        </text>
      </g>

      {/* cartouche */}
      <g className="at-cartouche" aria-hidden="true">
        <rect className="at-cartouche-box" x={VB_W - 250} y={18} width={232} height={40} rx="3" />
        <text className="at-cartouche-text" x={VB_W - 134} y={38} textAnchor="middle">
          {CHROME.cartouche}
        </text>
        <text className="at-cartouche-sub" x={VB_W - 134} y={51} textAnchor="middle">
          {PERSON.name} · {PERSON.role}
        </text>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* The gazetteer side panel — raised by the selected territory         */
/* ------------------------------------------------------------------ */

function GazetteerPanel({ territory }: { territory: Territory }) {
  return (
    <div
      className="at-gazetteer"
      role="region"
      aria-label="Gazetteer — selected territory"
      aria-live="polite"
      data-testid="gazetteer-panel"
    >
      <p className="at-gaz-eyebrow">GAZETTEER · SELECTED TERRITORY</p>
      <h3 className="at-gaz-name">{territory.name}</h3>
      <p className="at-gaz-waters">{territory.waters}</p>
      <dl className="at-gaz-facts">
        <div>
          <dt>MASTERY</dt>
          <dd>{MASTERY_LABEL[territory.mastery]}</dd>
        </div>
        <div>
          <dt>LAST VISITED</dt>
          <dd>{territory.lastVisited}</dd>
        </div>
      </dl>
      <p className="at-gaz-knows">{territory.knows}</p>
      <p className="at-gaz-evidence-label">EVIDENCE ON THE GROUND</p>
      <ul className="at-gaz-evidence">
        {territory.settlements.map((s) => (
          <li key={s.id}>
            <span className={`at-gaz-kind at-gaz-kind-${s.kind}`}>{SETTLEMENT_KIND_LABEL[s.kind]}</span>
            <span className="at-gaz-artifact">{s.name}</span>
            <span className="at-gaz-year">est. {s.founded}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Supporting panels                                                   */
/* ------------------------------------------------------------------ */

function GazetteerTable() {
  return (
    <section className="at-mirror" aria-labelledby="at-mirror-heading">
      <h2 id="at-mirror-heading" className="at-section-heading">
        GAZETTEER
        <span className="at-section-sub">EVERY TERRITORY AS A TABLE — THE ACCESSIBLE MIRROR OF THE CHART</span>
      </h2>
      <table className="at-table" data-testid="gazetteer-table">
        <caption className="at-table-caption">
          Each charted territory with its mastery, its settlements (shipped artifacts), and when it
          was last visited. West to east — the same order as the chart&rsquo;s focus order.
        </caption>
        <thead>
          <tr>
            <th scope="col">Territory</th>
            <th scope="col">Mastery</th>
            <th scope="col">Settlements</th>
            <th scope="col">Last visited</th>
          </tr>
        </thead>
        <tbody>
          {CHART_TERRITORIES.map((t) => (
            <tr key={t.id}>
              <th scope="row">{t.name}</th>
              <td>{MASTERY_LABEL[t.mastery]}</td>
              <td>
                {t.settlements
                  .map((s) => `${s.name} (${SETTLEMENT_KIND_LABEL[s.kind]}, ${s.founded})`)
                  .join('; ')}
              </td>
              <td>{t.lastVisited}</td>
            </tr>
          ))}
          <tr data-kind="uncharted">
            <th scope="row">Uncharted</th>
            <td>—</td>
            <td>{UNCHARTED.legend} — left blank on purpose</td>
            <td>never sailed</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

function Legend() {
  return (
    <section className="at-legend" aria-labelledby="at-legend-heading">
      <h2 id="at-legend-heading" className="at-section-heading">
        CHART LEGEND
        <span className="at-section-sub">HOW TO READ THE CHART</span>
      </h2>
      <ul className="at-legend-list">
        {LEGEND.map((k) => (
          <li key={k.glyph} className="at-legend-item">
            <span className={`at-legend-glyph at-legend-glyph-${k.glyph}`} aria-hidden="true" />
            <span className="at-legend-label">{k.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Cartographer() {
  return (
    <section className="at-carto" aria-labelledby="at-carto-heading">
      <h2 id="at-carto-heading" className="at-section-heading">
        {CARTOGRAPHER.title.toUpperCase()}
        <span className="at-section-sub">WHO DREW THIS, AND BY WHAT RULE</span>
      </h2>
      <div className="at-carto-card">
        <p className="at-carto-motto">{CARTOGRAPHER.motto}</p>
        <p className="at-carto-method">{CARTOGRAPHER.method}</p>
        <p className="at-carto-sig">
          {PERSON.name} · {PERSON.role.toUpperCase()} · {PERSON.team.toUpperCase()} · SURVEYING SINCE{' '}
          {PERSON.surveyingSince}
        </p>
      </div>
    </section>
  );
}

function Expeditions() {
  return (
    <section className="at-expeditions" aria-labelledby="at-exp-heading">
      <h2 id="at-exp-heading" className="at-section-heading">
        RECENT EXPEDITIONS
        <span className="at-section-sub">LAST QUARTER&rsquo;S SURVEYS — WHERE I SAILED AND WHAT I FOUND</span>
      </h2>
      <ol className="at-exp-list">
        {EXPEDITIONS.map((e) => (
          <li key={e.id} className="at-exp-item">
            <span className="at-exp-date">{e.date}</span>
            <div className="at-exp-body">
              <h3 className="at-exp-heading-h">{e.heading}</h3>
              <p className="at-exp-found">{e.found}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The page                                                            */
/* ------------------------------------------------------------------ */

export default function AtlasPage() {
  const { reduced } = useMotionPreference();
  const descId = useId();
  const [selectedId, setSelectedId] = useState<string>(CHART_TERRITORIES[0]?.id ?? '');

  useEffect(() => {
    document.title = 'The Atlas — Sofia Marchetti — Live';
  }, []);

  const selected = useMemo(
    () => TERRITORIES.find((t) => t.id === selectedId) ?? (TERRITORIES[0] as Territory),
    [selectedId],
  );

  const panels = useMemo<HorizonSweepItem[]>(
    () => [
      { id: 'legend', content: <Legend /> },
      { id: 'carto', content: <Cartographer /> },
      { id: 'expeditions', content: <Expeditions /> },
      { id: 'mirror', content: <GazetteerTable /> },
    ],
    [],
  );

  return (
    <div className="at-root" data-testid="live-atlas" data-reduced={reduced ? 'true' : undefined}>
      <div className="at-field" aria-hidden="true" />

      <header className="at-chrome" aria-label="The Atlas chrome">
        <div className="at-chrome-cell">
          <RouterLink to="/" className="at-back">
            ◄ GALLERY
          </RouterLink>
          <span className="at-chrome-rule" aria-hidden="true" />
          <span>{CHROME.world}</span>
        </div>
        <div className="at-chrome-cell">
          <span>{CHROME.survey}</span>
          <span className="at-chrome-rule" aria-hidden="true" />
          <span className="at-synthetic" data-testid="synthetic-mark">
            {CHROME.synthetic}
          </span>
        </div>
      </header>

      <main className="at-main">
        <section className="at-hero" aria-labelledby="at-statement">
          <p className="at-kicker">THE ATLAS</p>
          <h1 id="at-statement" className="at-display">
            {STATEMENT.map((line, i) => (
              <span key={i} className="at-display-line">
                {line}
              </span>
            ))}
          </h1>
          <p className="at-identity">
            {PERSON.name} · {PERSON.role.toUpperCase()} · {PERSON.team.toUpperCase()} ·{' '}
            {PERSON.location.toUpperCase()}
          </p>
          <p className="at-subline">{STATEMENT_SUBLINE}</p>
          <dl className="at-facts" aria-label="Atlas facts">
            {IDENTITY_FACTS.map((fact) => (
              <div key={fact.label} className="at-fact">
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
          <VisuallyHidden>
            This entire profile is illustrative and synthetic — a demonstration person, not a real
            member of staff. Territories, artifacts, dates and figures are sample content.
          </VisuallyHidden>
        </section>

        <section className="at-chart-section" aria-labelledby="at-chart-heading">
          <h2 id="at-chart-heading" className="at-section-heading">
            THE CHART
            <span className="at-section-sub">
              TERRITORY = DOMAIN · CONTOURS = MASTERY · SETTLEMENT = ARTIFACT · LANE = A BRIDGE BUILT
            </span>
          </h2>
          <p className="at-chart-hint">
            Tab through the territories west to east, or select one, to raise its gazetteer entry.
          </p>
          <div className="at-chart-layout">
            <div className="at-chart-frame">
              <TheChart reduced={reduced} selectedId={selectedId} onSelect={setSelectedId} descId={descId} />
            </div>
            <GazetteerPanel territory={selected} />
          </div>
        </section>

        <HorizonSweep className="at-sweep" items={panels} />
      </main>

      <footer className="at-footer">
        <span>{CHROME.synthetic} · SAMPLE CONTENT IS MARKED AS SUCH</span>
        <span>{CHROME.cartouche}</span>
      </footer>
    </div>
  );
}
