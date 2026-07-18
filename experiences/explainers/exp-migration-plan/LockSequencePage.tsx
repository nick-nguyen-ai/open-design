/**
 * "The Lock Sequence" — the live full-bleed rendering of `exp-migration-plan`.
 *
 * A migration plan as a canal lock sequence: the platform is a vessel
 * climbing five chambers from the on-premise basin to the cloud basin. Entry
 * gates open on evidence, never on schedule; every chamber has a drain gate
 * (the rollback), and each drain gate is tested while it is not needed.
 * Grammar: technical-blueprint; signature: horizon-sweep (the waterline
 * light crosses the section on arrival); motion level 2; locked dark.
 *
 * Art-direction licence: this file and lock-sequence.css are the
 * experience-local art layer — raw colour values are permitted HERE only.
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
import './lock-sequence.css';
import { CHAMBERS, DOCTRINE, FOOT, PASSAGE_LOG, SECTION, SEQUENCE, type Chamber } from './content.js';

/** Sectional geometry: chamber floors step up left → right. */
const CHAMBER_W = 190;
const CHAMBER_GAP = 14;
const BASE_Y = 300;
const STEP = 44;
const WATER_DEPTH = 66;

function chamberX(i: number): number {
  return 40 + i * (CHAMBER_W + CHAMBER_GAP);
}

function chamberFloorY(i: number): number {
  return BASE_Y - i * STEP;
}

function VesselGlyph({ x, y }: { x: number; y: number }) {
  return (
    <g className="ls-vessel" transform={`translate(${x}, ${y})`}>
      <path d="M -34 0 L -26 14 H 26 L 34 0 Z" className="ls-vessel-hull" />
      <rect x={-12} y={-14} width={24} height={14} className="ls-vessel-house" />
      <line x1={0} y1={-26} x2={0} y2={-14} className="ls-vessel-mast" />
      <text className="ls-vessel-label" y={30} textAnchor="middle">
        THE PLATFORM
      </text>
    </g>
  );
}

export default function LockSequencePage() {
  const { reduced } = useMotionPreference();
  const vesselIndex = CHAMBERS.findIndex((chamber) => chamber.state === 'in-chamber');

  return (
    <div className="ls-root" data-testid="live-lock-sequence" data-reduced={reduced ? 'true' : undefined}>
      <header className="ls-chrome" data-part-id="exp-migration-plan/chrome">
        <div className="ls-chrome-left">
          <RouterLink to="/" className="ls-back">
            ◄ GALLERY
          </RouterLink>
          <span className="ls-chrome-rule" aria-hidden="true" />
          <span className="ls-chrome-mast">{SEQUENCE.masthead}</span>
        </div>
        <div className="ls-chrome-right">
          <span>{SEQUENCE.chartRef}</span>
        </div>
      </header>

      <main className="ls-main">
        <section className="ls-passage" aria-labelledby="ls-statement" data-part-id="exp-migration-plan/passage">
          <p className="ls-kicker">{SEQUENCE.kicker}</p>
          <h1 id="ls-statement" className="ls-statement">
            {SEQUENCE.statement}
          </h1>
          <p className="ls-subline">{SEQUENCE.subline}</p>
          <dl className="ls-figures" data-part-id="exp-migration-plan/passage/figures">
            {SEQUENCE.figures.map((figure) => (
              <div key={figure.label} className="ls-figure">
                <dt>{figure.label}</dt>
                <dd>{figure.value}</dd>
              </div>
            ))}
          </dl>
          <p className="ls-provenance">{SEQUENCE.provenance}</p>
        </section>

        <section className="ls-band" aria-labelledby="ls-section-heading" data-part-id="exp-migration-plan/section">
          <h2 id="ls-section-heading" className="ls-band-heading">
            {SECTION.title}
            <span className="ls-band-sub">{SECTION.sub}</span>
          </h2>
          <figure className="ls-section-figure">
            <div className="ls-section-sweep" aria-hidden="true" />
            <div className="ls-section-scroll">
              <svg
                className="ls-section"
                viewBox="0 0 1080 400"
                role="img"
                aria-label={SECTION.caption}
                data-part-id="exp-migration-plan/section/lock-stairs"
              >
                {/* Basin labels */}
                <text className="ls-basin-label" x={40} y={BASE_Y + 54}>
                  ON-PREMISE BASIN · CURRENT WATER
                </text>
                <text className="ls-basin-label" x={chamberX(4) + CHAMBER_W} y={chamberFloorY(4) + 58} textAnchor="end">
                  CLOUD BASIN · TARGET WATER
                </text>

                {CHAMBERS.map((chamber: Chamber, i) => {
                  const x = chamberX(i);
                  const floorY = chamberFloorY(i);
                  const waterY = floorY - WATER_DEPTH;
                  return (
                    <g key={chamber.id} data-state={chamber.state} className="ls-chamber">
                      {/* Chamber walls + floor */}
                      <path
                        className="ls-chamber-wall"
                        d={`M ${x} ${waterY - 34} V ${floorY} H ${x + CHAMBER_W} V ${waterY - 34}`}
                      />
                      {/* Water */}
                      <rect
                        className="ls-water"
                        x={x + 1.5}
                        y={waterY}
                        width={CHAMBER_W - 3}
                        height={WATER_DEPTH}
                        style={{ ['--ls-fill-delay' as string]: `${i * 180}ms` }}
                      />
                      {/* Entry gate (right wall, opens to next chamber) */}
                      {i < CHAMBERS.length - 1 && (
                        <g className="ls-gate" transform={`translate(${x + CHAMBER_W + CHAMBER_GAP / 2}, ${chamberFloorY(i + 1) - WATER_DEPTH / 2 - 10})`}>
                          <line className="ls-gate-line" x1={0} y1={-26} x2={0} y2={44} />
                          <path className="ls-gate-chevron" d="M -6 2 L 0 -6 L 6 2" />
                        </g>
                      )}
                      {/* Drain gate arrow back down */}
                      <g className="ls-drain" transform={`translate(${x + 24}, ${floorY + 10})`}>
                        <path className="ls-drain-arrow" d="M 0 0 V 16 M -5 10 L 0 16 L 5 10" />
                        <text className="ls-drain-label" x={10} y={14}>
                          DRAIN
                        </text>
                      </g>
                      {/* Labels */}
                      <text className="ls-chamber-no" x={x + CHAMBER_W / 2} y={waterY - 44} textAnchor="middle">
                        {chamber.no}
                      </text>
                      <text className="ls-chamber-name" x={x + CHAMBER_W / 2} y={waterY - 12} textAnchor="middle">
                        {chamber.name}
                      </text>
                      {/* Passed tick */}
                      {chamber.state === 'passed' && (
                        <text className="ls-chamber-passed" x={x + CHAMBER_W / 2} y={floorY - 26} textAnchor="middle">
                          ✓ PASSED
                        </text>
                      )}
                      {chamber.state === 'in-chamber' && (
                        <VesselGlyph x={x + CHAMBER_W / 2} y={waterY + 26} />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
            <figcaption className="ls-section-caption">
              <VisuallyHidden>{SECTION.caption}</VisuallyHidden>
              <span className="ls-legend">
                <span className="ls-legend-item">
                  <span className="ls-legend-water" aria-hidden="true" />
                  WATER (LIVE STATE)
                </span>
                <span className="ls-legend-item">
                  <span className="ls-legend-gate" aria-hidden="true" />
                  ENTRY GATE · OPENS ON EVIDENCE
                </span>
                <span className="ls-legend-item">
                  <span className="ls-legend-drain" aria-hidden="true">
                    ↓
                  </span>
                  DRAIN GATE · THE ROLLBACK
                </span>
              </span>
            </figcaption>
          </figure>
        </section>

        <section className="ls-band" aria-labelledby="ls-chambers-heading" data-part-id="exp-migration-plan/chambers">
          <h2 id="ls-chambers-heading" className="ls-band-heading">
            The chamber schedule
            <span className="ls-band-sub">Entry criteria and drain gates, chamber by chamber</span>
          </h2>
          <ol className="ls-schedule" data-part-id="exp-migration-plan/chambers/schedule">
            {CHAMBERS.map((chamber, i) => (
              <li key={chamber.id} className="ls-chamber-card" data-state={chamber.state}>
                <header className="ls-card-head">
                  <span className="ls-card-no">{chamber.no}</span>
                  <span className="ls-card-name">{chamber.name}</span>
                  <span className="ls-card-state" data-state={chamber.state}>
                    {chamber.state === 'in-chamber' ? 'VESSEL HERE' : chamber.state.toUpperCase()}
                  </span>
                </header>
                <p className="ls-card-lift">{chamber.lift}</p>
                <p className="ls-card-line">
                  <span className="ls-card-label">WHAT MOVES</span> {chamber.moves}
                </p>
                <p className="ls-card-line">
                  <span className="ls-card-label">GATE {i + 2 <= 5 ? i + 1 : ''} OPENS WHEN</span> {chamber.gateOpens}
                </p>
                <p className="ls-card-line ls-card-drain">
                  <span className="ls-card-label">DRAIN GATE</span> {chamber.drainGate}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <div className="ls-columns">
          <section className="ls-band" aria-labelledby="ls-doctrine-heading" data-part-id="exp-migration-plan/doctrine">
            <h2 id="ls-doctrine-heading" className="ls-band-heading">
              {DOCTRINE.title}
              <span className="ls-band-sub">{DOCTRINE.sub}</span>
            </h2>
            <ol className="ls-doctrine">
              {DOCTRINE.rules.map((rule, i) => (
                <li key={rule.id} className="ls-rule">
                  <span className="ls-rule-num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="ls-rule-text">{rule.rule}</p>
                    <p className="ls-rule-note">{rule.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="ls-band" aria-labelledby="ls-log-heading" data-part-id="exp-migration-plan/passage-log">
            <h2 id="ls-log-heading" className="ls-band-heading">
              {PASSAGE_LOG.title}
              <span className="ls-band-sub">{PASSAGE_LOG.sub}</span>
            </h2>
            <ol className="ls-log">
              {PASSAGE_LOG.entries.map((entry) => (
                <li key={entry.id} className="ls-log-entry" data-kind={entry.kind}>
                  <span className="ls-log-date">{entry.date}</span>
                  <p className="ls-log-text">{entry.entry}</p>
                  <span className="ls-log-kind">{entry.kind.replace('-', ' ').toUpperCase()}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {vesselIndex >= 0 && (
          <VisuallyHidden>
            The vessel is currently in {CHAMBERS[vesselIndex]!.no}, {CHAMBERS[vesselIndex]!.name}.
          </VisuallyHidden>
        )}
      </main>

      <footer className="ls-foot">
        <p>{FOOT.note}</p>
        <p className="ls-foot-line">
          <span>{SEQUENCE.provenance}</span>
          <span>{FOOT.next}</span>
        </p>
      </footer>
    </div>
  );
}
