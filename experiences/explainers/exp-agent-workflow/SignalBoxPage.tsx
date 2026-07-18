/**
 * "The Signal Box" — the live full-bleed rendering of `exp-agent-workflow`.
 *
 * An agent's decision workflow as a railway interlocking diagram: states are
 * track blocks, transitions are switched track with a lever each, guards must
 * prove before a lever pulls, and a live token walks the main line. Failed
 * guards route to named sidings — never to a mystery. Grammar: living-system;
 * signature: data-ink-draw (track inks in, the token then runs); motion
 * level 3; locked dark.
 *
 * Art-direction licence: this file and signal-box.css are the
 * experience-local art layer — raw colour values are permitted HERE only.
 *
 * `data-part-id` values are a PUBLIC BORROW CONTRACT (surfaced by the gallery's
 * part inspector, consumed by the design skill): never rename or remove
 * one without updating LivePartIds.test.tsx.
 */
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import { VisuallyHidden } from '@enterprise-design/primitives';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource-variable/inter/index.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import './signal-box.css';
import {
  BLOCKS,
  BOX,
  DIAGRAM,
  FOOT,
  LEVERS,
  RUNS,
  RUN_LOG,
  SIDINGS,
  type TrackBlock,
} from './content.js';

const BLOCK_W = 118;
const BLOCK_H = 46;

/** The token's journey along the main line (block centres, in order). */
const MAIN_LINE_IDS = ['intake', 'classify', 'retrieve', 'draft', 'verify', 'respond', 'done'];

function blockById(id: string): TrackBlock {
  return BLOCKS.find((b) => b.id === id) ?? BLOCKS[0]!;
}

function centre(block: TrackBlock): [number, number] {
  return [block.x + BLOCK_W / 2, block.y + BLOCK_H / 2];
}

/** Track between two blocks: straight on the main line, 45° elsewhere. */
function trackPath(fromId: string, toId: string, kind: 'main' | 'switch' | 'return'): string {
  const [x1, y1] = centre(blockById(fromId));
  const [x2, y2] = centre(blockById(toId));
  if (kind === 'main') return `M ${x1} ${y1} H ${x2}`;
  if (kind === 'return') {
    // The retry return loops under the main line.
    const dip = Math.max(y1, y2) + 74;
    return `M ${x1} ${y1 + BLOCK_H / 2} V ${dip} H ${x2} V ${y2 + BLOCK_H / 2}`;
  }
  // Switch to a siding: leave the block, run 45°, then straight.
  const midX = x1 + (x2 > x1 ? 60 : -60);
  return `M ${x1} ${y1} L ${midX} ${y2} H ${x2}`;
}

const TOKEN_PATH = (() => {
  const [x0, y0] = centre(blockById(MAIN_LINE_IDS[0]!));
  const rest = MAIN_LINE_IDS.slice(1)
    .map((id) => `H ${centre(blockById(id))[0]}`)
    .join(' ');
  return `M ${x0} ${y0} ${rest}`;
})();

export default function SignalBoxPage() {
  const { reduced } = useMotionPreference();

  return (
    <div className="sb-root" data-testid="live-signal-box" data-reduced={reduced ? 'true' : undefined}>
      <header className="sb-chrome" data-part-id="exp-agent-workflow/chrome">
        <div className="sb-chrome-left">
          <RouterLink to="/" className="sb-back">
            ◄ GALLERY
          </RouterLink>
          <span className="sb-chrome-rule" aria-hidden="true" />
          <span className="sb-chrome-mast">{BOX.masthead}</span>
        </div>
        <div className="sb-chrome-right">
          <span>{BOX.system}</span>
        </div>
      </header>

      <main className="sb-main">
        <section className="sb-box" aria-labelledby="sb-statement" data-part-id="exp-agent-workflow/box">
          <p className="sb-kicker">{BOX.kicker}</p>
          <h1 id="sb-statement" className="sb-statement">
            {BOX.statement}
          </h1>
          <p className="sb-subline">{BOX.subline}</p>
          <dl className="sb-figures" data-part-id="exp-agent-workflow/box/figures">
            {BOX.figures.map((figure) => (
              <div key={figure.label} className="sb-figure">
                <dt>{figure.label}</dt>
                <dd>{figure.value}</dd>
              </div>
            ))}
          </dl>
          <p className="sb-provenance">{BOX.provenance}</p>
        </section>

        <section className="sb-band" aria-labelledby="sb-diagram-heading" data-part-id="exp-agent-workflow/diagram">
          <h2 id="sb-diagram-heading" className="sb-band-heading">
            {DIAGRAM.title}
            <span className="sb-band-sub">{DIAGRAM.sub}</span>
          </h2>
          <figure className="sb-diagram-figure">
            <div className="sb-diagram-scroll">
              <svg
                className="sb-diagram"
                viewBox="0 0 1140 420"
                role="img"
                aria-label={DIAGRAM.caption}
                data-part-id="exp-agent-workflow/diagram/interlocking"
              >
                <g>
                  {RUNS.map((run, i) => (
                    <path
                      key={run.id}
                      className="sb-track"
                      data-kind={run.kind}
                      d={trackPath(run.from, run.to, run.kind)}
                      style={{ ['--sb-ink-delay' as string]: `${i * 110}ms` }}
                    />
                  ))}
                </g>
                {!reduced && (
                  <circle className="sb-token" r={7}>
                    <animateMotion dur="9s" repeatCount="indefinite" path={TOKEN_PATH} />
                  </circle>
                )}
                <g>
                  {BLOCKS.map((block) => (
                    <g key={block.id} className="sb-block" data-kind={block.kind} transform={`translate(${block.x}, ${block.y})`}>
                      <rect className="sb-block-box" width={BLOCK_W} height={BLOCK_H} rx={block.kind === 'terminal' ? 23 : 4} />
                      <text className="sb-block-label" x={BLOCK_W / 2} y={20}>
                        {block.label}
                      </text>
                      <text className="sb-block-sub" x={BLOCK_W / 2} y={35}>
                        {block.sub}
                      </text>
                      {block.kind === 'main' && (
                        <circle className="sb-signal" cx={BLOCK_W - 8} cy={8} r={3.5} />
                      )}
                    </g>
                  ))}
                </g>
              </svg>
            </div>
            <figcaption className="sb-diagram-caption">
              <span className="sb-legend">
                <span className="sb-legend-item">
                  <span className="sb-legend-swatch sb-legend-main" aria-hidden="true" />
                  MAIN LINE
                </span>
                <span className="sb-legend-item">
                  <span className="sb-legend-swatch sb-legend-switch" aria-hidden="true" />
                  SWITCHED ROUTE TO SIDING
                </span>
                <span className="sb-legend-item">
                  <span className="sb-legend-swatch sb-legend-return" aria-hidden="true" />
                  RETRY RETURN
                </span>
                <span className="sb-legend-item">
                  <span className="sb-legend-token" aria-hidden="true" />
                  THE TOKEN (A LIVE RUN)
                </span>
              </span>
              <VisuallyHidden>{DIAGRAM.caption}</VisuallyHidden>
            </figcaption>
          </figure>
        </section>

        <section className="sb-band" aria-labelledby="sb-levers-heading" data-part-id="exp-agent-workflow/levers">
          <h2 id="sb-levers-heading" className="sb-band-heading">
            {LEVERS.title}
            <span className="sb-band-sub">{LEVERS.sub}</span>
          </h2>
          <div className="sb-frame-wrap">
            <table className="sb-frame" data-part-id="exp-agent-workflow/levers/frame-table">
              <caption>
                <VisuallyHidden>{LEVERS.caption}</VisuallyHidden>
              </caption>
              <thead>
                <tr>
                  <th scope="col">LEVER</th>
                  <th scope="col">ROUTE</th>
                  <th scope="col">TRIGGER</th>
                  <th scope="col">GUARD MUST PROVE</th>
                  <th scope="col">IF THE GUARD FAILS</th>
                </tr>
              </thead>
              <tbody>
                {LEVERS.items.map((lever, i) => (
                  <tr key={lever.id}>
                    <th scope="row">{String(i + 1).padStart(2, '0')}</th>
                    <td className="sb-frame-route">
                      {lever.from} <span aria-hidden="true">→</span> {lever.to}
                    </td>
                    <td>{lever.trigger}</td>
                    <td className="sb-frame-guard">{lever.guard}</td>
                    <td className="sb-frame-fail">{lever.onFail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="sb-columns">
          <section className="sb-band" aria-labelledby="sb-log-heading" data-part-id="exp-agent-workflow/run-log">
            <h2 id="sb-log-heading" className="sb-band-heading">
              {RUN_LOG.title}
              <span className="sb-band-sub">{RUN_LOG.sub}</span>
            </h2>
            <ol className="sb-log">
              {RUN_LOG.hops.map((hop) => (
                <li key={hop.id} className="sb-hop" data-state={hop.state}>
                  <span className="sb-hop-at">{hop.at}</span>
                  <div className="sb-hop-body">
                    <p className="sb-hop-block">{hop.block}</p>
                    <p className="sb-hop-note">{hop.note}</p>
                  </div>
                  <span className="sb-hop-state">{hop.state.toUpperCase()}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="sb-band" aria-labelledby="sb-sidings-heading" data-part-id="exp-agent-workflow/sidings">
            <h2 id="sb-sidings-heading" className="sb-band-heading">
              {SIDINGS.title}
              <span className="sb-band-sub">{SIDINGS.sub}</span>
            </h2>
            <ul className="sb-sidings">
              {SIDINGS.items.map((siding) => (
                <li key={siding.id} className="sb-siding">
                  <p className="sb-siding-name">{siding.name}</p>
                  <p className="sb-siding-note">{siding.note}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      <footer className="sb-foot">
        <p>{FOOT.note}</p>
        <p className="sb-foot-line">
          <span>{BOX.provenance}</span>
          <span>{FOOT.next}</span>
        </p>
      </footer>
    </div>
  );
}
