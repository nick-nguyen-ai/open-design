/**
 * "The Line" — the live full-bleed rendering of `home-career-project-timeline`.
 *
 * A career drawn as ONE continuous survey line running top→bottom down a dark
 * slate field. Projects are STATIONS; promotions are GAUGE CHANGES where the
 * line visibly thickens; side-projects are BRANCH lines that terminate or
 * rejoin; and one honest SWITCHBACK records a two-year detour reversed out of
 * — the anomaly. THE LINE owns the page: it is a single luminous rail, drawn
 * on a token easing and fully drawn (with the current position marked) under
 * reduced motion. The accessible mirror is the line as a dated table.
 *
 * Art-direction licence: this file and the-line.css are the experience-local
 * art layer — raw colour values are permitted HERE only. DataInkDraw supplies
 * the reveal choreography and its own reduced-motion parity; the line-draw
 * uses the platform easing/duration CSS tokens (no bespoke cubic-bezier).
 */
import { useEffect, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { DataInkDraw, useMotionPreference } from '@enterprise-design/motion';
import type { DataInkGroup } from '@enterprise-design/motion';
import { VisuallyHidden } from '@enterprise-design/primitives';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import './the-line.css';
import {
  CHROME,
  GAUGE_ROLE,
  IDENTITY_FACTS,
  INTERCHANGES,
  NODES,
  PERSON,
  STATEMENT,
  STATEMENT_SUBLINE,
  TERMINUS,
} from './content.js';
import type { Gauge, LineNode } from './content.js';

/* ------------------------------------------------------------------ */
/* Rail geometry — gauge maps to line weight & dot size                */
/* ------------------------------------------------------------------ */

const GAUGE_PX: Record<Gauge, number> = { 1: 3, 2: 6, 3: 10, 4: 16 };
const DOT_R: Record<Gauge, number> = { 1: 5, 2: 6.5, 3: 8, 4: 10 };

function railVars(inGauge: Gauge, outGauge: Gauge, index: number): React.CSSProperties {
  return {
    ['--ln-g-in' as string]: `${GAUGE_PX[inGauge]}px`,
    ['--ln-g-out' as string]: `${GAUGE_PX[outGauge]}px`,
    ['--ln-delay' as string]: `${index * 90}ms`,
  };
}

/* ------------------------------------------------------------------ */
/* The station dot                                                     */
/* ------------------------------------------------------------------ */

function StationDot({ gauge, kind }: { gauge: Gauge; kind: LineNode['kind'] }) {
  const r = DOT_R[gauge];
  return (
    <span className={`ln-dot ln-dot-${kind}`} aria-hidden="true">
      <svg width={r * 2 + 8} height={r * 2 + 8} viewBox={`0 0 ${r * 2 + 8} ${r * 2 + 8}`}>
        <circle className="ln-dot-halo" cx={r + 4} cy={r + 4} r={r + 3} />
        <circle className="ln-dot-core" cx={r + 4} cy={r + 4} r={r} />
        {kind === 'gauge-change' ? (
          <circle className="ln-dot-ring" cx={r + 4} cy={r + 4} r={r - 2.4} />
        ) : null}
      </svg>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* The switchback loop — a bespoke reversed path                       */
/* ------------------------------------------------------------------ */

function SwitchbackLoop() {
  // viewBox is unstretched (preserveAspectRatio default) so the loop stays round.
  return (
    <svg
      className="ln-loop"
      viewBox="0 0 88 210"
      width="88"
      height="210"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        className="ln-loop-path"
        pathLength={100}
        d="M 44 0
           C 44 46, 12 52, 12 96
           C 12 140, 52 138, 52 172
           C 52 196, 44 200, 44 210"
        fill="none"
      />
      <path className="ln-loop-arrow" d="M 39 150 L 52 172 L 55 156" fill="none" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* A node on the line                                                  */
/* ------------------------------------------------------------------ */

function Node({
  node,
  inGauge,
  index,
}: {
  node: LineNode;
  inGauge: Gauge;
  index: number;
}) {
  const isSwitchback = node.kind === 'switchback';
  const isBranch = node.kind === 'branch';
  return (
    <div
      className={`ln-node ln-node-${node.kind}${isBranch ? ` ln-branch-${node.branch?.fate}` : ''}`}
      data-gauge={node.gauge}
      style={railVars(inGauge, node.gauge, index)}
    >
      <div className="ln-rail">
        <span className="ln-seg ln-seg-top" aria-hidden="true" />
        {isSwitchback ? (
          <span className="ln-loop-wrap" aria-hidden="true">
            <SwitchbackLoop />
          </span>
        ) : (
          <span className="ln-seg ln-seg-bottom" aria-hidden="true" />
        )}
        <StationDot gauge={node.gauge} kind={node.kind} />
      </div>

      <div className="ln-body">
        <div className="ln-head">
          <span className="ln-code">{node.code}</span>
          <span className="ln-grade">{GAUGE_ROLE[node.gauge]}</span>
        </div>
        <h3 className="ln-name">{node.name}</h3>

        {node.promotion ? <p className="ln-promotion">{node.promotion}</p> : null}

        <p className="ln-outcome">{node.outcome}</p>

        {node.detour ? (
          <div className="ln-detour" data-testid="switchback">
            <p className="ln-detour-flag">{node.detour.span}</p>
            <p className="ln-detour-lesson">{node.detour.lesson}</p>
          </div>
        ) : null}

        {node.branch ? (
          <p className={`ln-branch-note ln-branch-note-${node.branch.fate}`}>
            <span className="ln-branch-tag">
              {node.branch.fate === 'terminated' ? 'BRANCH · TERMINATED' : 'BRANCH · REJOINED'}
            </span>
            {node.branch.carried}
          </p>
        ) : null}
      </div>

      <div className="ln-year-gutter" aria-hidden="true">
        <span className="ln-year-big">{node.year}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The page                                                            */
/* ------------------------------------------------------------------ */

export default function TheLinePage() {
  const { reduced } = useMotionPreference();

  useEffect(() => {
    document.title = 'The Line — Marcus Adeyemi — Live';
  }, []);

  const nodeGroups = useMemo<DataInkGroup[]>(
    () =>
      NODES.map((node, i) => ({
        id: node.id,
        content: <Node node={node} inGauge={NODES[i - 1]?.gauge ?? node.gauge} index={i} />,
      })),
    [],
  );

  const lastGauge = NODES[NODES.length - 1]?.gauge ?? 4;

  return (
    <div className="ln-root" data-testid="live-the-line" data-reduced={reduced ? 'true' : undefined}>
      <div className="ln-field" aria-hidden="true" />

      <header className="ln-chrome" aria-label="The Line chrome">
        <div className="ln-chrome-cell">
          <RouterLink to="/" className="ln-back">
            ◄ GALLERY
          </RouterLink>
          <span className="ln-chrome-rule" aria-hidden="true" />
          <span>{CHROME.world}</span>
        </div>
        <div className="ln-chrome-cell">
          <span>{CHROME.service}</span>
          <span className="ln-chrome-rule" aria-hidden="true" />
          <span className="ln-synthetic" data-testid="synthetic-mark">
            {CHROME.synthetic}
          </span>
        </div>
      </header>

      <main className="ln-main">
        <section className="ln-hero" aria-labelledby="ln-statement">
          <p className="ln-kicker">THE LINE</p>
          <h1 id="ln-statement" className="ln-display">
            {STATEMENT.map((line, i) => (
              <span key={i} className="ln-display-line">
                {line}
              </span>
            ))}
          </h1>
          <p className="ln-identity">
            {PERSON.name} · {PERSON.role.toUpperCase()} · {PERSON.team.toUpperCase()} ·{' '}
            {PERSON.location.toUpperCase()}
          </p>
          <p className="ln-subline">{STATEMENT_SUBLINE}</p>
          <dl className="ln-facts" aria-label="Line facts">
            {IDENTITY_FACTS.map((fact) => (
              <div key={fact.label} className="ln-fact">
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
          <VisuallyHidden>
            This entire profile is illustrative and synthetic — a demonstration person, not a real
            member of staff. Projects, dates and figures are sample content.
          </VisuallyHidden>
        </section>

        <section className="ln-timeline-section" aria-labelledby="ln-line-heading">
          <h2 id="ln-line-heading" className="ln-section-heading">
            THE LINE
            <span className="ln-section-sub">
              STATION = PROJECT · GAUGE = GRADE · BRANCH = SIDE-PROJECT · ONE SWITCHBACK, LEFT IN
            </span>
          </h2>

          {/* Origin marker — the line opens */}
          <div className="ln-origin" aria-hidden="true">
            <span className="ln-origin-rail" />
            <span className="ln-origin-label">LINE OPEN · {PERSON.lineOpened}</span>
          </div>

          <DataInkDraw className="ln-line" as="div" groups={nodeGroups} />

          {/* Terminus — next station under survey */}
          <div className="ln-terminus" data-testid="terminus" style={{ ['--ln-g-out' as string]: `${GAUGE_PX[lastGauge]}px` }}>
            <div className="ln-rail ln-rail-terminus">
              <span className="ln-seg ln-seg-top" aria-hidden="true" />
              <span className="ln-terminus-cap" aria-hidden="true" />
            </div>
            <div className="ln-body">
              <div className="ln-head">
                <span className="ln-code">{TERMINUS.code}</span>
                <span className="ln-year ln-year-survey">{TERMINUS.label}</span>
              </div>
              <h3 className="ln-name ln-name-terminus">{TERMINUS.name}</h3>
              <p className="ln-outcome">{TERMINUS.intent}</p>
            </div>
          </div>
        </section>

        <section className="ln-interchange" aria-labelledby="ln-ix-heading">
          <h2 id="ln-ix-heading" className="ln-section-heading">
            INTERCHANGES
            <span className="ln-section-sub">WHERE THIS LINE CROSSED OTHER PEOPLE&rsquo;S</span>
          </h2>
          <ul className="ln-ix-list">
            {INTERCHANGES.map((ix) => (
              <li key={ix.id} className="ln-ix-item">
                <span className="ln-ix-code">{ix.code}</span>
                <div className="ln-ix-body">
                  <p className="ln-ix-cross">{ix.crossedWith}</p>
                  <p className="ln-ix-station">{ix.station}</p>
                  <p className="ln-ix-note">{ix.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="ln-manifest" aria-labelledby="ln-manifest-heading">
          <h2 id="ln-manifest-heading" className="ln-section-heading">
            STATION REGISTER
            <span className="ln-section-sub">THE LINE AS A DATED TABLE — THE ACCESSIBLE MIRROR</span>
          </h2>
          <table className="ln-table" data-testid="station-table">
            <caption className="ln-table-caption">
              Every station on the line in date order: code, year, project, grade in force, and
              outcome. The dated equivalent of the drawn line above.
            </caption>
            <thead>
              <tr>
                <th scope="col">Code</th>
                <th scope="col">Year</th>
                <th scope="col">Station</th>
                <th scope="col">Grade</th>
                <th scope="col">Outcome</th>
              </tr>
            </thead>
            <tbody>
              {NODES.map((node) => (
                <tr key={node.id} data-kind={node.kind}>
                  <th scope="row">{node.code}</th>
                  <td>{node.year}</td>
                  <td>
                    {node.name}
                    {node.kind === 'switchback' ? ' — switchback, reversed out' : ''}
                    {node.kind === 'branch'
                      ? node.branch?.fate === 'terminated'
                        ? ' — branch, terminated'
                        : ' — branch, rejoined'
                      : ''}
                  </td>
                  <td>{GAUGE_ROLE[node.gauge]}</td>
                  <td>{node.outcome}</td>
                </tr>
              ))}
              <tr data-kind="terminus">
                <th scope="row">{TERMINUS.code}</th>
                <td>next</td>
                <td>{TERMINUS.name} — under survey</td>
                <td>{GAUGE_ROLE[lastGauge]}</td>
                <td>{TERMINUS.intent}</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>

      <footer className="ln-footer">
        <span>{CHROME.synthetic} · SAMPLE CONTENT IS MARKED AS SUCH</span>
        <span>LINE OPEN {PERSON.lineOpened} · STILL RUNNING</span>
      </footer>
    </div>
  );
}
