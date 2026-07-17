/**
 * "The Departures Board" — the live full-bleed rendering of
 * `db-delivery-control-tower`.
 *
 * A programme control tower staged as an airport departures hall: workstreams
 * are flights on a split-flap board, blockers are ground stops, dependencies
 * are connections, and delivery confidence is the tower's own estimate per
 * flight. Grammar: signal-glass (layered translucent panels over a night
 * apron); signature: horizon-sweep (a light band crosses the horizon line on
 * arrival); motion level 1; locked dark.
 *
 * Art-direction licence: this file and departures-board.css are the
 * experience-local art layer — raw colour values are permitted HERE only.
 *
 * `data-part-id` values are a PUBLIC BORROW CONTRACT (surfaced by the gallery's
 * part inspector, consumed by the design-borrow skill): never rename or remove
 * one without updating LivePartIds.test.tsx.
 */
import { useMotionPreference } from '@enterprise-design/motion';
import { Link as RouterLink } from 'react-router-dom';
import { VisuallyHidden } from '@enterprise-design/primitives';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import './departures-board.css';
import {
  BOARD,
  CONFIDENCE,
  CONNECTIONS,
  FLIGHTS,
  FOOT,
  STOPS,
  TOWER,
  type FlightStatus,
} from './content.js';

const STATUS_LABEL: Record<FlightStatus, string> = {
  'on-time': 'ON TIME',
  boarding: 'BOARDING',
  delayed: 'DELAYED',
  holding: 'HOLDING',
  'ground-stop': 'GROUND STOP',
};

/** A split-flap cell: each character sits on its own flap tile. */
function Flap({ text, reduced, row }: { text: string; reduced: boolean; row: number }) {
  return (
    <span className="dt-flap" aria-hidden="true">
      {text.split('').map((ch, i) => (
        <span
          key={i}
          className="dt-flap-tile"
          data-space={ch === ' ' ? 'true' : undefined}
          style={
            reduced
              ? undefined
              : { ['--dt-flip-delay' as string]: `${row * 70 + i * 28}ms` }
          }
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

export default function DeparturesBoardPage() {
  const { reduced } = useMotionPreference();

  return (
    <div
      className="dt-root"
      data-testid="live-departures-board"
      data-reduced={reduced ? 'true' : undefined}
    >
      <header className="dt-chrome" data-part-id="db-delivery-control-tower/chrome">
        <div className="dt-chrome-left">
          <RouterLink to="/" className="dt-back">
            ◄ GALLERY
          </RouterLink>
          <span className="dt-chrome-rule" aria-hidden="true" />
          <span>{TOWER.masthead}</span>
        </div>
        <div className="dt-chrome-right">
          <span className="dt-chrome-prog">{TOWER.programme}</span>
          <span className="dt-chrome-rule" aria-hidden="true" />
          <span>{TOWER.watch}</span>
        </div>
      </header>

      <main className="dt-main">
        <section
          className="dt-horizon"
          aria-labelledby="dt-statement"
          data-part-id="db-delivery-control-tower/horizon"
        >
          <div className="dt-horizon-sweep" aria-hidden="true" />
          <p className="dt-kicker">{TOWER.kicker}</p>
          <h1 id="dt-statement" className="dt-statement">
            <span>{TOWER.statementTop}</span>
            <span className="dt-statement-alert">{TOWER.statementBottom}</span>
          </h1>
          <p className="dt-subline">{TOWER.subline}</p>
          <dl className="dt-figures" data-part-id="db-delivery-control-tower/horizon/figures">
            {TOWER.figures.map((figure) => (
              <div key={figure.label} className="dt-figure">
                <dt>{figure.label}</dt>
                <dd>{figure.value}</dd>
              </div>
            ))}
          </dl>
          <p className="dt-provenance">{TOWER.provenance}</p>
        </section>

        <section
          className="dt-band"
          aria-labelledby="dt-board-heading"
          data-part-id="db-delivery-control-tower/board"
        >
          <h2 id="dt-board-heading" className="dt-band-heading">
            {BOARD.title}
            <span className="dt-band-sub">{BOARD.sub}</span>
          </h2>
          <div className="dt-board-wrap">
            <table className="dt-board" data-testid="departures-board">
              <caption>
                <VisuallyHidden>{BOARD.caption}</VisuallyHidden>
              </caption>
              <thead>
                <tr>
                  <th scope="col">FLIGHT</th>
                  <th scope="col">DESTINATION · NEXT MILESTONE</th>
                  <th scope="col">GATE</th>
                  <th scope="col">SCHED</th>
                  <th scope="col">STATUS</th>
                  <th scope="col">REMARK</th>
                </tr>
              </thead>
              <tbody>
                {FLIGHTS.map((flight, row) => (
                  <tr key={flight.id} data-status={flight.status}>
                    <th scope="row" className="dt-board-code">
                      {flight.code}
                    </th>
                    <td className="dt-board-dest">{flight.destination}</td>
                    <td className="dt-board-gate">{flight.gate}</td>
                    <td className="dt-board-sched">{flight.sched}</td>
                    <td className="dt-board-status">
                      <Flap text={STATUS_LABEL[flight.status]} reduced={reduced} row={row} />
                      <VisuallyHidden>{STATUS_LABEL[flight.status]}</VisuallyHidden>
                    </td>
                    <td className="dt-board-remark">{flight.remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="dt-panels">
          <section
            className="dt-band dt-glass"
            aria-labelledby="dt-stops-heading"
            data-part-id="db-delivery-control-tower/stops"
          >
            <h2 id="dt-stops-heading" className="dt-band-heading">
              {STOPS.title}
              <span className="dt-band-sub">{STOPS.sub}</span>
            </h2>
            <ul className="dt-stops">
              {STOPS.items.map((stop) => (
                <li key={stop.id} className="dt-stop">
                  <div className="dt-stop-head">
                    <span className="dt-stop-flight">{stop.flightCode}</span>
                    <span className="dt-stop-since">{stop.since}</span>
                  </div>
                  <p className="dt-stop-title">{stop.title}</p>
                  <p className="dt-stop-impact">{stop.impact}</p>
                  <p className="dt-stop-owner">ANSWERS DAILY · {stop.owner.toUpperCase()}</p>
                </li>
              ))}
            </ul>
          </section>

          <section
            className="dt-band dt-glass"
            aria-labelledby="dt-connections-heading"
            data-part-id="db-delivery-control-tower/connections"
          >
            <h2 id="dt-connections-heading" className="dt-band-heading">
              {CONNECTIONS.title}
              <span className="dt-band-sub">{CONNECTIONS.sub}</span>
            </h2>
            <ul className="dt-connections">
              {CONNECTIONS.items.map((connection) => (
                <li key={connection.id} className="dt-connection">
                  <span className="dt-connection-route">
                    <span className="dt-connection-code">{connection.from}</span>
                    <span className="dt-connection-arrow" aria-hidden="true">
                      →
                    </span>
                    <span className="dt-connection-code">{connection.to}</span>
                  </span>
                  <p className="dt-connection-note">{connection.note}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section
          className="dt-band"
          aria-labelledby="dt-confidence-heading"
          data-part-id="db-delivery-control-tower/confidence"
        >
          <h2 id="dt-confidence-heading" className="dt-band-heading">
            {CONFIDENCE.title}
            <span className="dt-band-sub">{CONFIDENCE.sub}</span>
          </h2>
          <ul className="dt-meters" data-part-id="db-delivery-control-tower/confidence/meters">
            {FLIGHTS.map((flight) => (
              <li key={flight.id} className="dt-meter" data-status={flight.status}>
                <span className="dt-meter-code">{flight.code}</span>
                <span
                  className="dt-meter-track"
                  role="img"
                  aria-label={`${flight.code} delivery confidence ${Math.round(flight.confidence * 100)} percent`}
                >
                  <span
                    className="dt-meter-fill"
                    style={{ width: `${Math.round(flight.confidence * 100)}%` }}
                  />
                  <span
                    className="dt-meter-threshold"
                    style={{ left: `${CONFIDENCE.threshold * 100}%` }}
                    aria-hidden="true"
                  />
                </span>
                <span className="dt-meter-value">{Math.round(flight.confidence * 100)}%</span>
              </li>
            ))}
          </ul>
          <p className="dt-confidence-note">{CONFIDENCE.note}</p>
        </section>
      </main>

      <footer className="dt-foot">
        <p>{FOOT.note}</p>
        <p className="dt-foot-line">
          <span>{FOOT.provenance}</span>
          <span>{FOOT.next}</span>
        </p>
      </footer>
    </div>
  );
}
