/**
 * "The River Atlas" — the live full-bleed rendering of `exp-data-lineage-map`.
 *
 * Data lineage as a watershed atlas plate: sources are springs, transforms
 * are locks, the certified warehouse is the river, and consumers are the
 * delta mouths. A provenance question is answered by walking upstream — and
 * one auditor's walk is printed in full. Grammar: spatial-canvas; signature:
 * horizon-sweep (the waterways flow in on arrival); motion level 2; locked
 * light; corporate register: restricted.
 *
 * Art-direction licence: this file and river-atlas.css are the
 * experience-local art layer — raw colour values are permitted HERE only.
 *
 * `data-part-id` values are a PUBLIC BORROW CONTRACT (surfaced by the gallery's
 * part inspector, consumed by the design-borrow skill): never rename or remove
 * one without updating LivePartIds.test.tsx.
 */
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import { VisuallyHidden } from '@enterprise-design/primitives';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource-variable/fraunces/opsz-italic.css';
import '@fontsource-variable/inter/index.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './river-atlas.css';
import {
  ATLAS,
  FOOT,
  GAZETTEER,
  LABELS,
  LOCKS,
  PLATE,
  SPRINGS,
  TRACE,
  WATERWAYS,
} from './content.js';

export default function RiverAtlasPage() {
  const { reduced } = useMotionPreference();

  return (
    <div className="ra-root" data-testid="live-river-atlas" data-reduced={reduced ? 'true' : undefined}>
      <header className="ra-chrome" data-part-id="exp-data-lineage-map/chrome">
        <div className="ra-chrome-row">
          <RouterLink to="/" className="ra-back">
            ◄ GALLERY
          </RouterLink>
          <span className="ra-chrome-mast">{ATLAS.masthead}</span>
          <span>{ATLAS.plateRef}</span>
        </div>
        <div className="ra-chrome-row ra-chrome-row-sub">
          <span className="ra-provenance">{ATLAS.provenance}</span>
        </div>
      </header>

      <main className="ra-main">
        <section className="ra-atlas" aria-labelledby="ra-statement" data-part-id="exp-data-lineage-map/atlas">
          <p className="ra-kicker">{ATLAS.kicker}</p>
          <h1 id="ra-statement" className="ra-statement">
            {ATLAS.statement}
          </h1>
          <p className="ra-subline">{ATLAS.subline}</p>
          <dl className="ra-figures" data-part-id="exp-data-lineage-map/atlas/figures">
            {ATLAS.figures.map((figure) => (
              <div key={figure.label} className="ra-figure">
                <dt>{figure.label}</dt>
                <dd>{figure.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="ra-band" aria-labelledby="ra-plate-heading" data-part-id="exp-data-lineage-map/plate">
          <h2 id="ra-plate-heading" className="ra-band-heading">
            {PLATE.title}
            <span className="ra-band-sub">{PLATE.sub}</span>
          </h2>
          <figure className="ra-plate-figure">
            <div className="ra-plate-scroll">
              <svg
                className="ra-plate"
                viewBox="0 0 1120 420"
                role="img"
                aria-label={PLATE.caption}
                data-part-id="exp-data-lineage-map/plate/watershed"
              >
                <g className="ra-waterways">
                  {WATERWAYS.map((waterway, i) => (
                    <path
                      key={waterway.id}
                      className="ra-water"
                      d={waterway.path}
                      style={{
                        strokeWidth: waterway.width,
                        ['--ra-flow-delay' as string]: `${i * 160}ms`,
                      }}
                    />
                  ))}
                </g>
                <g>
                  {SPRINGS.map((spring) => (
                    <g key={spring.id} transform={`translate(${spring.x}, ${spring.y})`}>
                      <circle className="ra-spring" r={7} />
                      <circle className="ra-spring-ring" r={13} />
                      <text className="ra-label ra-label-spring" y={-20} textAnchor="middle">
                        {spring.name}
                      </text>
                    </g>
                  ))}
                </g>
                <g>
                  {LOCKS.map((lock) => (
                    <g key={lock.id} transform={`translate(${lock.x}, ${lock.y})`}>
                      <path className="ra-lock" d="M -10 -14 L 0 -6 L 10 -14 M -10 14 L 0 6 L 10 14" />
                      <rect className="ra-lock-gate" x={-13} y={-4} width={26} height={8} rx={2} />
                      <text className="ra-label ra-label-lock" y={34} textAnchor="middle">
                        {lock.name}
                      </text>
                    </g>
                  ))}
                </g>
                <g>
                  {LABELS.map((label) => (
                    <text
                      key={label.id}
                      className={`ra-label ra-label-${label.kind}`}
                      x={label.x}
                      y={label.y}
                      textAnchor={label.anchor ?? 'middle'}
                    >
                      {label.name}
                    </text>
                  ))}
                </g>
              </svg>
            </div>
            <figcaption className="ra-plate-caption">
              <span className="ra-legend">
                <span className="ra-legend-item">
                  <span className="ra-legend-spring" aria-hidden="true" />
                  SPRING (SOURCE OF RECORD)
                </span>
                <span className="ra-legend-item">
                  <span className="ra-legend-lock" aria-hidden="true" />
                  LOCK (GATED TRANSFORM)
                </span>
                <span className="ra-legend-item">
                  <span className="ra-legend-river" aria-hidden="true" />
                  RIVER (CERTIFIED REACH)
                </span>
              </span>
              <VisuallyHidden>{PLATE.caption}</VisuallyHidden>
            </figcaption>
          </figure>
        </section>

        <section className="ra-band" aria-labelledby="ra-gazetteer-heading" data-part-id="exp-data-lineage-map/gazetteer">
          <h2 id="ra-gazetteer-heading" className="ra-band-heading">
            {GAZETTEER.title}
            <span className="ra-band-sub">{GAZETTEER.sub}</span>
          </h2>
          <div className="ra-gazetteer-wrap">
            <table className="ra-gazetteer" data-part-id="exp-data-lineage-map/gazetteer/table">
              <caption>
                <VisuallyHidden>{GAZETTEER.caption}</VisuallyHidden>
              </caption>
              <thead>
                <tr>
                  <th scope="col">REACH</th>
                  <th scope="col">KIND</th>
                  <th scope="col">STEWARD</th>
                  <th scope="col">FRESHNESS</th>
                  <th scope="col">CERTIFIED</th>
                  <th scope="col">NOTE</th>
                </tr>
              </thead>
              <tbody>
                {GAZETTEER.entries.map((entry) => (
                  <tr key={entry.id} data-kind={entry.kind}>
                    <th scope="row">{entry.name}</th>
                    <td className="ra-gazetteer-kind">{entry.kind.toUpperCase()}</td>
                    <td>{entry.steward}</td>
                    <td className="ra-gazetteer-fresh">{entry.freshness}</td>
                    <td className="ra-gazetteer-cert" data-certified={entry.certified ? 'true' : 'false'}>
                      {entry.certified ? 'CERTIFIED' : 'UNCERTIFIED'}
                    </td>
                    <td className="ra-gazetteer-note">{entry.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="ra-band" aria-labelledby="ra-trace-heading" data-part-id="exp-data-lineage-map/trace">
          <h2 id="ra-trace-heading" className="ra-band-heading">
            {TRACE.title}
            <span className="ra-band-sub">{TRACE.sub}</span>
          </h2>
          <ol className="ra-trace" data-part-id="exp-data-lineage-map/trace/steps">
            {TRACE.steps.map((step) => (
              <li key={step.id} className="ra-trace-step">
                <span className="ra-trace-marker">{step.step}</span>
                <div className="ra-trace-body">
                  <p className="ra-trace-place">{step.place}</p>
                  <p className="ra-trace-finding">{step.finding}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="ra-foot">
        <p>{FOOT.note}</p>
        <p className="ra-foot-line">
          <span>{ATLAS.provenance}</span>
          <span>{FOOT.next}</span>
        </p>
      </footer>
    </div>
  );
}
