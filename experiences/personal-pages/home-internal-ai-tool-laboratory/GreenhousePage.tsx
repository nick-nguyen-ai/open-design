/**
 * "The Greenhouse" — the live full-bleed rendering of
 * `home-internal-ai-tool-laboratory`.
 *
 * A toolsmith's internal tools kept as living cultivars in a glasshouse at
 * dusk: deep botanical dark, luminous growth traces, brass label plates. THE
 * BENCH owns the page — each tool a specimen whose adoption curve is drawn as
 * a climbing vine (data-driven, drawn in on a token easing; fully grown under
 * reduced motion). One specimen is wilting and honestly labelled a deprecation
 * candidate; one bed is empty with a seed packet. The L3 personal page:
 * restrained bioluminescence, everything pausable.
 *
 * Art-direction licence: this file and greenhouse.css are the experience-local
 * art layer — raw colour values are permitted HERE only. The DataInkDraw
 * sequence supplies the reveal choreography; the vine draw and pulse use the
 * platform easing/duration CSS tokens (var(--ease-*), var(--dur-*)) with a
 * reduced-motion still — no bespoke cubic-bezier values.
 */
import { useEffect, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { DataInkDraw, useMotionPreference } from '@enterprise-design/motion';
import type { DataInkGroup } from '@enterprise-design/motion';
import { VisuallyHidden } from '@enterprise-design/primitives';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource-variable/fraunces/opsz-italic.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import './greenhouse.css';
import {
  CARE_NOTES,
  CHROME,
  GARDENER,
  PROPAGATION,
  PULSE,
  SEED_PACKET,
  SPECIMENS,
  STAGE_LABEL,
  STAGE_ORDER,
  STANDFIRST,
} from './content.js';
import type { Specimen } from './content.js';

/* ------------------------------------------------------------------ */
/* The growth trace — a bespoke climbing vine, data-driven             */
/* ------------------------------------------------------------------ */

const VB_W = 200;
const VB_H = 300;
const SOIL_Y = 276;
const TOP_Y = 26;
const MAX_CLIMB = SOIL_Y - TOP_Y;
/** Global adoption ceiling so a busy tool climbs visibly higher than a new one. */
const GLOBAL_MAX = Math.max(...SPECIMENS.map((s) => s.weeklyUsers));

interface VineNode {
  x: number;
  y: number;
  r: number;
}

function buildVine(specimen: Specimen): { path: string; nodes: VineNode[]; head: VineNode } {
  const values = specimen.adoption;
  const n = values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const frac = specimen.weeklyUsers / GLOBAL_MAX;
  const climbPx = (0.24 + 0.76 * frac) * MAX_CLIMB;

  const nodes: VineNode[] = values.map((v, i) => {
    const t = n === 1 ? 0 : i / (n - 1);
    // Time climbs the trellis; the wilting head bends back over near the top.
    let effClimb = t;
    if (specimen.wilting && t > 0.62) {
      effClimb = 1 - ((t - 0.62) / 0.38) * 0.44;
    } else if (specimen.wilting) {
      effClimb = t / 0.62;
    }
    const y = SOIL_Y - effClimb * climbPx;
    const nv = (v - min) / span;
    const amp = 12 + 22 * (0.35 + 0.65 * nv);
    const x = 100 + Math.sin(t * Math.PI * 2.4 + 0.5) * amp;
    const r = 1.8 + nv * 3.4;
    return { x, y, r };
  });

  // Smooth the tendril through node midpoints.
  const start = nodes[0] ?? { x: 100, y: SOIL_Y, r: 2 };
  let path = `M ${start.x.toFixed(1)} ${start.y.toFixed(1)}`;
  for (let i = 1; i < nodes.length; i += 1) {
    const prev = nodes[i - 1];
    const cur = nodes[i];
    if (!prev || !cur) continue;
    const xc = (prev.x + cur.x) / 2;
    const yc = (prev.y + cur.y) / 2;
    path += ` Q ${prev.x.toFixed(1)} ${prev.y.toFixed(1)} ${xc.toFixed(1)} ${yc.toFixed(1)}`;
  }
  const head = nodes[nodes.length - 1] ?? start;
  path += ` T ${head.x.toFixed(1)} ${head.y.toFixed(1)}`;
  return { path, nodes, head };
}

function Vine({ specimen, index }: { specimen: Specimen; index: number }) {
  const { path, nodes, head } = useMemo(() => buildVine(specimen), [specimen]);
  const first = specimen.adoption[0];
  const last = specimen.weeklyUsers;
  const trend = specimen.wilting
    ? `declining from ${Math.max(...specimen.adoption)} to ${last} weekly users`
    : `climbing from ${first} to ${last} weekly users over twelve weeks`;

  return (
    <svg
      className={`gh-vine${specimen.wilting ? ' gh-vine-wilting' : ''}`}
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      role="img"
      aria-label={`${specimen.name}, ${STAGE_LABEL[specimen.stage]} — growth trace ${trend}. ${specimen.wilting ? 'Wilting: a deprecation candidate.' : ''}`}
      style={{ ['--gh-delay' as string]: `${index * 120}ms` }}
    >
      {/* trellis + soil */}
      <line className="gh-trellis" x1={100} y1={SOIL_Y} x2={100} y2={TOP_Y - 8} />
      <line className="gh-soil" x1={16} y1={SOIL_Y} x2={VB_W - 16} y2={SOIL_Y} />
      <ellipse className="gh-pot" cx={100} cy={SOIL_Y + 2} rx={34} ry={7} />

      {/* the growing vine */}
      <path className="gh-vine-path" d={path} pathLength={100} />

      {/* buds along the vine */}
      {nodes.map((nd, i) => (
        <circle key={i} className="gh-bud" cx={nd.x} cy={nd.y} r={nd.r} />
      ))}

      {/* the head — a glowing flower (or a drooping bud when wilting) */}
      <circle className="gh-head-halo" cx={head.x} cy={head.y} r={9} />
      <circle className="gh-head" cx={head.x} cy={head.y} r={4.2} />

      {specimen.wilting ? (
        <path className="gh-fallen-leaf" d="M 66 268 q 8 -10 18 -4 q -8 10 -18 4 z" />
      ) : null}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* A specimen — vine + brass plate                                     */
/* ------------------------------------------------------------------ */

function SpecimenCard({ specimen, index }: { specimen: Specimen; index: number }) {
  return (
    <article
      className={`gh-specimen${specimen.wilting ? ' gh-specimen-wilting' : ''}`}
      data-stage={specimen.stage}
      data-wilting={specimen.wilting ? 'true' : undefined}
      aria-labelledby={`gh-spec-${specimen.id}`}
    >
      <div className="gh-vine-frame">
        <Vine specimen={specimen} index={index} />
      </div>
      <div className="gh-plate" data-wilting={specimen.wilting ? 'true' : undefined}>
        <div className="gh-plate-row">
          <h3 id={`gh-spec-${specimen.id}`} className="gh-plate-name">
            {specimen.name}
          </h3>
          <span className="gh-stage" data-stage={specimen.stage}>
            {STAGE_LABEL[specimen.stage]}
          </span>
        </div>
        <p className="gh-plate-latin">{specimen.latin}</p>
        <p className="gh-plate-meta">
          {specimen.planted} · {specimen.weeklyUsers} WEEKLY USERS
        </p>
        <p className="gh-plate-one">{specimen.oneLine}</p>
        {specimen.wilting ? (
          <p className="gh-deprecation" data-testid="deprecation-flag">
            DEPRECATION CANDIDATE · SUCCESSOR: {specimen.successor}
          </p>
        ) : null}
      </div>
    </article>
  );
}

function EmptyBed() {
  return (
    <article className="gh-specimen gh-specimen-empty" aria-labelledby="gh-seed-packet">
      <div className="gh-vine-frame gh-bed-empty">
        <svg className="gh-vine" viewBox={`0 0 ${VB_W} ${VB_H}`} aria-hidden="true">
          <line className="gh-soil" x1={16} y1={SOIL_Y} x2={VB_W - 16} y2={SOIL_Y} />
          <ellipse className="gh-pot" cx={100} cy={SOIL_Y + 2} rx={34} ry={7} />
          <line className="gh-trellis gh-trellis-empty" x1={100} y1={SOIL_Y} x2={100} y2={TOP_Y + 40} />
          <text className="gh-bed-mark" x={100} y={150} textAnchor="middle">
            ✦
          </text>
        </svg>
      </div>
      <div className="gh-plate gh-plate-packet">
        <div className="gh-plate-row">
          <h3 id="gh-seed-packet" className="gh-plate-name">
            {SEED_PACKET.idea}
          </h3>
          <span className="gh-stage gh-stage-packet">{SEED_PACKET.sowing}</span>
        </div>
        <p className="gh-plate-latin">the empty bed</p>
        <p className="gh-plate-one">{SEED_PACKET.note}</p>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Usage pulse widget                                                  */
/* ------------------------------------------------------------------ */

function UsagePulse({ reduced }: { reduced: boolean }) {
  const values = PULSE.days.map((d) => d.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  return (
    <section className="gh-pulse" aria-labelledby="gh-pulse-heading">
      <div className="gh-pulse-head">
        <h2 id="gh-pulse-heading" className="gh-pulse-heading">
          {PULSE.heading}
        </h2>
        <span className="gh-pulse-total">
          {PULSE.weeklyActive} <span className="gh-pulse-delta">{PULSE.delta}</span>
        </span>
      </div>
      <div className="gh-pulse-bars" data-reduced={reduced ? 'true' : undefined} aria-hidden="true">
        {PULSE.days.map((d, i) => (
          <div key={d.day} className="gh-pulse-col">
            <span
              className="gh-pulse-bar"
              style={{
                height: `${44 + ((d.value - min) / span) * 56}%`,
                ['--gh-pulse-i' as string]: String(i),
              }}
            />
            <span className="gh-pulse-day">{d.day}</span>
          </div>
        ))}
      </div>
      <p className="gh-pulse-note">
        {PULSE.note}
        <span className="gh-pulse-mirror">
          {' '}
          {PULSE.days.map((d) => `${d.day} ${d.value}`).join(' · ')}.
        </span>
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The page                                                            */
/* ------------------------------------------------------------------ */

export default function GreenhousePage() {
  const { reduced } = useMotionPreference();

  useEffect(() => {
    document.title = 'The Greenhouse — Elior Ashworth — Live';
  }, []);

  const benchGroups = useMemo<DataInkGroup[]>(
    () => [
      ...SPECIMENS.map((specimen, i) => ({
        id: specimen.id,
        content: <SpecimenCard specimen={specimen} index={i} />,
      })),
      { id: 'empty-bed', content: <EmptyBed /> },
    ],
    [],
  );

  return (
    <div className="gh-root" data-testid="live-greenhouse" data-reduced={reduced ? 'true' : undefined}>
      <div className="gh-field" aria-hidden="true" />
      <header className="gh-chrome" aria-label="Greenhouse chrome">
        <div className="gh-chrome-cell">
          <RouterLink to="/" className="gh-back">
            ◄ GALLERY
          </RouterLink>
          <span className="gh-chrome-rule" aria-hidden="true" />
          <span>{CHROME.world}</span>
        </div>
        <div className="gh-chrome-cell">
          <span>{CHROME.timeOfDay}</span>
          <span className="gh-chrome-rule" aria-hidden="true" />
          <span className="gh-synthetic" data-testid="synthetic-mark">
            {CHROME.synthetic}
          </span>
        </div>
      </header>

      <main className="gh-main">
        <section className="gh-gardener" aria-labelledby="gh-name">
          <p className="gh-kicker">THE GREENHOUSE</p>
          <h1 id="gh-name" className="gh-name">
            {GARDENER.name}
          </h1>
          <p className="gh-role">
            {GARDENER.role.toUpperCase()} · {GARDENER.team.toUpperCase()}
          </p>
          <p className="gh-standfirst">{STANDFIRST}</p>
          <div className="gh-gardener-strip">
            <p className="gh-hours">{GARDENER.officeHours}</p>
            <p className="gh-invitation">{GARDENER.invitation}</p>
          </div>
          <VisuallyHidden>
            This entire profile is illustrative and synthetic — a demonstration person, not a real
            member of staff. Tools, adoption figures and usage are sample content.
          </VisuallyHidden>
        </section>

        <section className="gh-bench" aria-labelledby="gh-bench-heading">
          <div className="gh-bench-head">
            <h2 id="gh-bench-heading" className="gh-bench-heading">
              THE BENCH
              <span className="gh-bench-sub">
                EACH TOOL A SPECIMEN · GROWTH TRACE = WEEKLY ADOPTION · ONE WILTING, HONESTLY
              </span>
            </h2>
            <dl className="gh-stage-legend" aria-label="Growth stages">
              {STAGE_ORDER.map((stage) => (
                <div key={stage} className="gh-stage-legend-item">
                  <dt className="gh-stage" data-stage={stage}>
                    {STAGE_LABEL[stage]}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
          <DataInkDraw className="gh-bench-row" as="div" groups={benchGroups} />
        </section>

        <UsagePulse reduced={reduced} />

        <section className="gh-propagation" aria-labelledby="gh-prop-heading">
          <h2 id="gh-prop-heading" className="gh-section-heading">
            PROPAGATION LOG
            <span className="gh-section-sub">WHO TOOK A CUTTING, AND WHEN</span>
          </h2>
          <table className="gh-prop-table" data-testid="propagation-log">
            <caption className="gh-visually-hidden-caption">
              Propagation log — teams that adopted each tool, in order, the accessible mirror of the
              growth traces above.
            </caption>
            <thead>
              <tr>
                <th scope="col">Team</th>
                <th scope="col">Specimen</th>
                <th scope="col">Adopted</th>
                <th scope="col">Note</th>
              </tr>
            </thead>
            <tbody>
              {PROPAGATION.map((row) => (
                <tr key={`${row.team}-${row.tool}`}>
                  <th scope="row">{row.team}</th>
                  <td>{row.tool}</td>
                  <td>{row.when}</td>
                  <td>{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="gh-care" aria-labelledby="gh-care-heading">
          <h2 id="gh-care-heading" className="gh-section-heading">
            CARE NOTES
            <span className="gh-section-sub">DOCS & RUNBOOKS · HOW TO KEEP EACH ONE ALIVE</span>
          </h2>
          <ul className="gh-care-grid">
            {CARE_NOTES.map((note) => (
              <li key={note.id} className="gh-care-card" data-kind={note.kind}>
                <span className="gh-care-kind">{note.kind}</span>
                <h3 className="gh-care-title">{note.title}</h3>
                <p className="gh-care-note">{note.note}</p>
                <p className="gh-care-doc">{note.doc}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="gh-footer">
        <span>{CHROME.synthetic} · SAMPLE CONTENT IS MARKED AS SUCH</span>
        <span>A TOOL NOBODY WATERS SHOULD BE ALLOWED TO DIE</span>
      </footer>
    </div>
  );
}
