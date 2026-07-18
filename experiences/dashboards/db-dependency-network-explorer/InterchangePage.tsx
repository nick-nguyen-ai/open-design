/**
 * "The Interchange" — the live full-bleed rendering of
 * `db-dependency-network-explorer`.
 *
 * The platform dependency graph drawn as a transit-authority network map at
 * night: services are stations, dependencies are track, and the two busiest
 * services are interchanges. Selecting a station keeps the MAP primary and
 * loads its dossier beside it — upstream, downstream, blast radius, and the
 * change window. Grammar: spatial-canvas; signature: horizon-sweep (one light
 * band crosses the map on arrival); motion level 1; locked dark.
 *
 * Art-direction licence: this file and interchange.css are the
 * experience-local art layer — raw colour values are permitted HERE only.
 *
 * `data-part-id` values are a PUBLIC BORROW CONTRACT (surfaced by the gallery's
 * part inspector, consumed by the design skill): never rename or remove
 * one without updating LivePartIds.test.tsx.
 */
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import { VisuallyHidden } from '@enterprise-design/primitives';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource-variable/inter/index.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import './interchange.css';
import { AUTHORITY, DOSSIER, FOOT, INDEX, LINES, MAP, STATIONS, type Station } from './content.js';

function lineById(id: string) {
  return LINES.find((line) => line.id === id) ?? LINES[0]!;
}

function StationDot({
  station,
  selected,
  onSelect,
}: {
  station: Station;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const primary = lineById(station.lineIds[0]!);
  const labelAbove = station.y > 300;
  return (
    <g
      className="ic-station"
      data-selected={selected ? 'true' : undefined}
      data-interchange={station.interchange ? 'true' : undefined}
      transform={`translate(${station.x}, ${station.y})`}
    >
      {station.interchange ? (
        <circle className="ic-station-ring" r={11} />
      ) : (
        <circle className="ic-station-ring ic-station-ring-line" r={8} style={{ stroke: primary.color }} />
      )}
      <circle className="ic-station-core" r={station.interchange ? 5.5 : 3.5} />
      {selected && <circle className="ic-station-halo" r={17} />}
      <text className="ic-station-label" y={labelAbove ? -18 : 26} textAnchor="middle">
        {station.name.toUpperCase()}
      </text>
      {/* The full-size hit target; the visible dot stays small. */}
      <circle
        className="ic-station-hit"
        r={20}
        role="button"
        tabIndex={0}
        aria-pressed={selected}
        aria-label={`${station.name} — open station dossier`}
        onClick={() => onSelect(station.id)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onSelect(station.id);
          }
        }}
      />
    </g>
  );
}

export default function InterchangePage() {
  const { reduced } = useMotionPreference();
  const [selectedId, setSelectedId] = useState('authgw');
  const selected = STATIONS.find((s) => s.id === selectedId) ?? STATIONS[0]!;

  return (
    <div className="ic-root" data-testid="live-interchange" data-reduced={reduced ? 'true' : undefined}>
      <header className="ic-chrome" data-part-id="db-dependency-network-explorer/chrome">
        <div className="ic-chrome-left">
          <RouterLink to="/" className="ic-back">
            ◄ GALLERY
          </RouterLink>
          <span className="ic-chrome-rule" aria-hidden="true" />
          <span className="ic-chrome-mast">{AUTHORITY.masthead}</span>
        </div>
        <div className="ic-chrome-right">
          <span>{AUTHORITY.mapRef}</span>
        </div>
      </header>

      <main className="ic-main">
        <section className="ic-network" aria-labelledby="ic-statement" data-part-id="db-dependency-network-explorer/network">
          <p className="ic-kicker">{AUTHORITY.kicker}</p>
          <h1 id="ic-statement" className="ic-statement">
            {AUTHORITY.statement}
          </h1>
          <p className="ic-subline">{AUTHORITY.subline}</p>
          <dl className="ic-figures" data-part-id="db-dependency-network-explorer/network/figures">
            {AUTHORITY.figures.map((figure) => (
              <div key={figure.label} className="ic-figure">
                <dt>{figure.label}</dt>
                <dd>{figure.value}</dd>
              </div>
            ))}
          </dl>
          <p className="ic-provenance">{AUTHORITY.provenance}</p>
        </section>

        <section className="ic-band" aria-labelledby="ic-map-heading" data-part-id="db-dependency-network-explorer/map">
          <h2 id="ic-map-heading" className="ic-band-heading">
            {MAP.title}
            <span className="ic-band-sub">{MAP.sub}</span>
          </h2>

          <div className="ic-canvas">
            <figure className="ic-map-figure">
              <div className="ic-map-sweep" aria-hidden="true" />
              <div className="ic-map-scroll">
                <svg
                  className="ic-map"
                  viewBox="0 0 1000 540"
                  data-part-id="db-dependency-network-explorer/map/metro-map"
                >
                  <title>{MAP.caption}</title>
                  <g className="ic-lines">
                    {LINES.map((line, i) => (
                      <path
                        key={line.id}
                        className="ic-line"
                        d={line.path}
                        style={{ stroke: line.color, ['--ic-line-delay' as string]: `${i * 160}ms` }}
                      />
                    ))}
                  </g>
                  <g>
                    {STATIONS.map((station) => (
                      <StationDot
                        key={station.id}
                        station={station}
                        selected={station.id === selectedId}
                        onSelect={setSelectedId}
                      />
                    ))}
                  </g>
                </svg>
              </div>
              <figcaption className="ic-map-caption">
                <span className="ic-legend">
                  {LINES.map((line) => (
                    <span key={line.id} className="ic-legend-item">
                      <span className="ic-legend-swatch" style={{ background: line.color }} aria-hidden="true" />
                      {line.name}
                    </span>
                  ))}
                  <span className="ic-legend-item">
                    <span className="ic-legend-swatch ic-legend-interchange" aria-hidden="true" />
                    INTERCHANGE
                  </span>
                </span>
              </figcaption>
            </figure>

            <section className="ic-dossier" aria-labelledby="ic-dossier-heading" data-part-id="db-dependency-network-explorer/dossier">
              <h3 id="ic-dossier-heading" className="ic-dossier-kicker">
                {DOSSIER.title} · <span className="ic-dossier-sub">{DOSSIER.sub}</span>
              </h3>
              <p className="ic-dossier-name" data-testid="ic-dossier-name">
                {selected.name}
                {selected.interchange && <span className="ic-dossier-flag">INTERCHANGE</span>}
              </p>
              <p className="ic-dossier-lines">
                {selected.lineIds.map((lineId) => {
                  const line = lineById(lineId);
                  return (
                    <span key={lineId} className="ic-dossier-line" style={{ ['--ic-line-color' as string]: line.color }}>
                      {line.name}
                    </span>
                  );
                })}
              </p>
              <dl className="ic-dossier-facts">
                <div className="ic-dossier-fact">
                  <dt>OWNER</dt>
                  <dd>{selected.owner}</dd>
                </div>
                <div className="ic-dossier-fact">
                  <dt>TIER</dt>
                  <dd>{selected.tier}</dd>
                </div>
                <div className="ic-dossier-fact">
                  <dt>CHANGE WINDOW</dt>
                  <dd>{selected.changeWindow}</dd>
                </div>
              </dl>
              <div className="ic-dossier-flows">
                <div className="ic-dossier-flow">
                  <h4>FED BY</h4>
                  {selected.upstream.length > 0 ? (
                    <ul>
                      {selected.upstream.map((name) => (
                        <li key={name}>← {name}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="ic-dossier-none">Origin station — nothing upstream.</p>
                  )}
                </div>
                <div className="ic-dossier-flow">
                  <h4>FEEDS</h4>
                  {selected.downstream.length > 0 ? (
                    <ul>
                      {selected.downstream.map((name) => (
                        <li key={name}>→ {name}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="ic-dossier-none">Terminal station — nothing downstream.</p>
                  )}
                </div>
              </div>
              <div className="ic-dossier-blast" data-part-id="db-dependency-network-explorer/dossier/blast-list">
                <h4>IF THIS STATION CLOSES TONIGHT</h4>
                <ul>
                  {selected.blastRadius.map((impact) => (
                    <li key={impact}>{impact}</li>
                  ))}
                </ul>
              </div>
              <p className="ic-dossier-note">{selected.note}</p>
            </section>
          </div>
        </section>

        <section className="ic-band" aria-labelledby="ic-index-heading" data-part-id="db-dependency-network-explorer/index">
          <h2 id="ic-index-heading" className="ic-band-heading">
            {INDEX.title}
            <span className="ic-band-sub">{INDEX.sub}</span>
          </h2>
          <div className="ic-index-wrap">
            <table className="ic-index">
              <caption>
                <VisuallyHidden>{INDEX.caption}</VisuallyHidden>
              </caption>
              <thead>
                <tr>
                  <th scope="col">STATION</th>
                  <th scope="col">LINE</th>
                  <th scope="col">OWNER</th>
                  <th scope="col">TIER</th>
                  <th scope="col">CHANGE WINDOW</th>
                </tr>
              </thead>
              <tbody>
                {STATIONS.map((station) => (
                  <tr key={station.id} data-selected={station.id === selectedId ? 'true' : undefined}>
                    <th scope="row">
                      <button type="button" className="ic-index-link" onClick={() => setSelectedId(station.id)}>
                        {station.name}
                      </button>
                    </th>
                    <td>
                      <span className="ic-index-lines">
                        {station.lineIds.map((lineId) => (
                          <span
                            key={lineId}
                            className="ic-index-swatch"
                            style={{ background: lineById(lineId).color }}
                            title={lineById(lineId).name}
                          />
                        ))}
                      </span>
                    </td>
                    <td>{station.owner}</td>
                    <td className="ic-index-tier">{station.tier}</td>
                    <td className="ic-index-window">{station.changeWindow}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="ic-foot">
        <p>{FOOT.note}</p>
        <p className="ic-foot-line">
          <span>{AUTHORITY.provenance}</span>
          <span>{FOOT.next}</span>
        </p>
      </footer>
    </div>
  );
}
