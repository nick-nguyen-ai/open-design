/**
 * "The Slipway" — the live full-bleed rendering of
 * `proj-cloud-migration-programme`.
 *
 * A cloud migration as a shipyard board: workloads are vessels moving
 * dry dock → slipway → open water, dependencies are mooring ropes that must
 * be slipped before a vessel may launch, and cutover risk is read per hull.
 * Grammar: technical-blueprint; signature: data-ink-draw (the mooring ropes
 * draw themselves on arrival); motion level 1; locked dark.
 *
 * Art-direction licence: this file and slipway.css are the experience-local
 * art layer — raw colour values are permitted HERE only.
 *
 * `data-part-id` values are a PUBLIC BORROW CONTRACT (surfaced by the gallery's
 * part inspector, consumed by the open-design skill): never rename or remove
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
import './slipway.css';
import {
  BOARD,
  FOOT,
  HARBOUR_LOG,
  RIGGING,
  RISK_LABEL,
  VESSELS,
  YARD,
  ZONE_LABEL,
  type Vessel,
} from './content.js';

/** Fixed board geometry — hulls hold station per zone. */
const VESSEL_POS: Record<string, { x: number; y: number }> = {
  'v-risk': { x: 180, y: 96 },
  'v-warehouse': { x: 180, y: 190 },
  'v-statements': { x: 180, y: 284 },
  'v-batch': { x: 180, y: 378 },
  'v-payments': { x: 530, y: 150 },
  'v-fraud': { x: 530, y: 310 },
  'v-ledger': { x: 890, y: 96 },
  'v-docs': { x: 890, y: 236 },
  'v-channels': { x: 890, y: 372 },
};

interface Rope {
  key: string;
  d: string;
  state: 'fast' | 'slipped';
  delay: number;
}

function buildRopes(): Rope[] {
  const zoneOf = new Map(VESSELS.map((vessel) => [vessel.id, vessel.zone]));
  const ropes: Rope[] = [];
  let index = 0;
  for (const vessel of VESSELS) {
    const from = VESSEL_POS[vessel.id]!;
    for (const mooringId of vessel.moorings) {
      const to = VESSEL_POS[mooringId]!;
      const state: Rope['state'] = zoneOf.get(mooringId) === 'open-water' ? 'slipped' : 'fast';
      const sameColumn = Math.abs(from.x - to.x) < 1;
      const cx = sameColumn ? from.x - 78 : (from.x + to.x) / 2;
      const cy = sameColumn ? (from.y + to.y) / 2 : Math.max(from.y, to.y) + 52;
      ropes.push({
        key: `${vessel.id}--${mooringId}`,
        d: `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`,
        state,
        delay: index * 90,
      });
      index += 1;
    }
  }
  return ropes;
}

const ROPES = buildRopes();

function HullGlyph({ vessel }: { vessel: Vessel }) {
  const pos = VESSEL_POS[vessel.id]!;
  return (
    <g className="sw-vessel" data-zone={vessel.zone} data-risk={vessel.risk} transform={`translate(${pos.x}, ${pos.y})`}>
      <path d="M -32 0 L -24 12 H 24 L 32 0 Z" className="sw-hull" />
      <rect x={-10} y={-11} width={20} height={11} className="sw-house" />
      <circle cx={26} cy={-8} r={4} className="sw-risk-lamp" />
      <text className="sw-hull-no" y={-18} textAnchor="middle">
        {vessel.hull}
      </text>
      <text className="sw-hull-name" y={28} textAnchor="middle">
        {vessel.name.toUpperCase()}
      </text>
    </g>
  );
}

export default function SlipwayPage() {
  const { reduced } = useMotionPreference();

  return (
    <div className="sw-root" data-testid="live-slipway" data-reduced={reduced ? 'true' : undefined}>
      <header className="sw-chrome" data-part-id="proj-cloud-migration-programme/chrome">
        <div className="sw-chrome-left">
          <RouterLink to="/" className="sw-back">
            ◄ GALLERY
          </RouterLink>
          <span className="sw-chrome-rule" aria-hidden="true" />
          <span className="sw-chrome-mast">{YARD.masthead}</span>
        </div>
        <span className="sw-chrome-ref">{YARD.ref}</span>
      </header>

      <main className="sw-main">
        <section className="sw-launch" aria-labelledby="sw-title" data-part-id="proj-cloud-migration-programme/launch">
          <p className="sw-kicker">{YARD.kicker}</p>
          <h1 id="sw-title" className="sw-title">
            {YARD.title}
          </h1>
          <p className="sw-subline">{YARD.subline}</p>
          <dl className="sw-figures" data-part-id="proj-cloud-migration-programme/launch/figures">
            {YARD.figures.map((figure) => (
              <div key={figure.label} className="sw-figure">
                <dt>{figure.label}</dt>
                <dd>{figure.value}</dd>
              </div>
            ))}
          </dl>
          <p className="sw-provenance">{YARD.provenance}</p>
        </section>

        <section className="sw-band" aria-labelledby="sw-board-heading" data-part-id="proj-cloud-migration-programme/yard">
          <h2 id="sw-board-heading" className="sw-band-heading">
            {BOARD.title}
            <span className="sw-band-sub">{BOARD.sub}</span>
          </h2>
          <figure className="sw-board-figure">
            <div className="sw-board-scroll">
              <svg
                className="sw-board"
                viewBox="0 0 1080 440"
                role="img"
                aria-label={BOARD.caption}
                data-part-id="proj-cloud-migration-programme/yard/yard-board"
              >
                {/* Zone plates */}
                <rect className="sw-zone-plate" x={20} y={40} width={320} height={380} />
                <rect className="sw-zone-plate" x={370} y={40} width={320} height={380} />
                <rect className="sw-zone-plate sw-zone-water" x={720} y={40} width={340} height={380} />
                <text className="sw-zone-label" x={180} y={26} textAnchor="middle">
                  DRY DOCK
                </text>
                <text className="sw-zone-label" x={530} y={26} textAnchor="middle">
                  SLIPWAY
                </text>
                <text className="sw-zone-label" x={890} y={26} textAnchor="middle">
                  OPEN WATER
                </text>
                {/* Waterline strokes in open water */}
                {[120, 200, 280, 360].map((y) => (
                  <path key={y} className="sw-wave" d={`M 736 ${y} q 20 -7 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 28 0`} />
                ))}
                {/* Mooring ropes — data-ink-draw */}
                {ROPES.map((rope) => (
                  <path
                    key={rope.key}
                    className="sw-rope"
                    data-state={rope.state}
                    d={rope.d}
                    pathLength={1}
                    style={{ ['--sw-rope-delay' as string]: `${rope.delay}ms` }}
                  />
                ))}
                {/* Hulls */}
                {VESSELS.map((vessel) => (
                  <HullGlyph key={vessel.id} vessel={vessel} />
                ))}
              </svg>
            </div>
            <figcaption className="sw-board-caption">
              <VisuallyHidden>{BOARD.caption}</VisuallyHidden>
              <span className="sw-legend">
                <span className="sw-legend-item">
                  <span className="sw-legend-rope sw-legend-fast" aria-hidden="true" />
                  {BOARD.legend.rope}
                </span>
                <span className="sw-legend-item">
                  <span className="sw-legend-rope sw-legend-slipped" aria-hidden="true" />
                  {BOARD.legend.slipped}
                </span>
              </span>
            </figcaption>
          </figure>
        </section>

        <section className="sw-band" aria-labelledby="sw-manifest-heading" data-part-id="proj-cloud-migration-programme/manifest">
          <h2 id="sw-manifest-heading" className="sw-band-heading">
            The vessel manifest
            <span className="sw-band-sub">Every hull, its tonnage, its window, its ropes</span>
          </h2>
          <ol className="sw-manifest" data-part-id="proj-cloud-migration-programme/manifest/vessel-cards">
            {VESSELS.map((vessel) => (
              <li key={vessel.id} className="sw-card" data-zone={vessel.zone} data-risk={vessel.risk}>
                <header className="sw-card-head">
                  <span className="sw-card-hull">{vessel.hull}</span>
                  <span className="sw-card-name">{vessel.name}</span>
                  <span className="sw-card-zone" data-zone={vessel.zone}>
                    {ZONE_LABEL[vessel.zone]}
                  </span>
                </header>
                <p className="sw-card-line">
                  <span className="sw-card-label">TONNAGE</span> {vessel.tonnage}
                  <span className="sw-card-label sw-card-label-gap">WINDOW</span> {vessel.window}
                </p>
                <p className="sw-card-line">
                  <span className="sw-card-label">RISK</span>
                  <span className="sw-card-risk" data-risk={vessel.risk}>
                    {RISK_LABEL[vessel.risk]}
                  </span>
                  <span className="sw-card-label sw-card-label-gap">ROPES</span>
                  {vessel.moorings.length === 0
                    ? 'NONE — FREE HULL'
                    : vessel.moorings
                        .map((id) => VESSELS.find((candidate) => candidate.id === id)?.name ?? id)
                        .join(' · ')}
                </p>
                <p className="sw-card-note">{vessel.note}</p>
              </li>
            ))}
          </ol>
        </section>

        <div className="sw-columns">
          <section className="sw-band" aria-labelledby="sw-rigging-heading" data-part-id="proj-cloud-migration-programme/rigging">
            <h2 id="sw-rigging-heading" className="sw-band-heading">
              {RIGGING.title}
              <span className="sw-band-sub">{RIGGING.sub}</span>
            </h2>
            <ol className="sw-rigging">
              {RIGGING.rules.map((rule, i) => (
                <li key={rule.id} className="sw-rule">
                  <span className="sw-rule-num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="sw-rule-text">{rule.rule}</p>
                    <p className="sw-rule-note">{rule.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="sw-band" aria-labelledby="sw-log-heading" data-part-id="proj-cloud-migration-programme/harbour-log">
            <h2 id="sw-log-heading" className="sw-band-heading">
              {HARBOUR_LOG.title}
              <span className="sw-band-sub">{HARBOUR_LOG.sub}</span>
            </h2>
            <ol className="sw-log">
              {HARBOUR_LOG.entries.map((entry) => (
                <li key={entry.id} className="sw-log-entry" data-kind={entry.kind}>
                  <span className="sw-log-date">{entry.date}</span>
                  <p className="sw-log-text">{entry.entry}</p>
                  <span className="sw-log-kind">{entry.kind.replace('-', ' ').toUpperCase()}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </main>

      <footer className="sw-foot">
        <p>{FOOT.note}</p>
        <p className="sw-foot-line">
          <span>{YARD.provenance}</span>
          <span>{FOOT.next}</span>
        </p>
      </footer>
    </div>
  );
}
