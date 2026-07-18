/**
 * "The Town Plan" — the live full-bleed rendering of
 * `proj-data-modernisation-programme`.
 *
 * The target data estate as an urban masterplan: domains are districts,
 * sequencing is construction phasing, progress is district-by-district
 * occupancy, and the legacy warehouse is the river the town is built away
 * from — retired bridge by bridge. Grammar: spatial-canvas; signature:
 * horizon-sweep (surveyor's light crosses the plan on arrival); motion
 * level 2; locked light.
 *
 * Art-direction licence: this file and town-plan.css are the experience-local
 * art layer — raw colour values are permitted HERE only.
 *
 * `data-part-id` values are a PUBLIC BORROW CONTRACT (surfaced by the gallery's
 * part inspector, consumed by the open-design skill): never rename or remove
 * one without updating LivePartIds.test.tsx.
 */
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import { VisuallyHidden } from '@enterprise-design/primitives';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource-variable/inter/index.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './town-plan.css';
import {
  COVENANTS,
  DISTRICTS,
  DRAWING,
  FOOT,
  OCCUPANCY,
  PHASES,
  PLAN,
  STATUS_LABEL,
  type District,
} from './content.js';

/** Plan geometry — each district holds its plot. */
const PLOTS: Record<string, { x: number; y: number; w: number; h: number }> = {
  'd-customer': { x: 230, y: 40, w: 190, h: 110 },
  'd-payments': { x: 440, y: 40, w: 210, h: 110 },
  'd-risk': { x: 670, y: 40, w: 180, h: 110 },
  'd-markets': { x: 870, y: 40, w: 170, h: 110 },
  'd-finance': { x: 230, y: 180, w: 220, h: 110 },
  'd-product': { x: 470, y: 180, w: 200, h: 110 },
  'd-operations': { x: 690, y: 180, w: 200, h: 110 },
  'd-colleague': { x: 230, y: 320, w: 200, h: 90 },
};

function DistrictPlot({ district }: { district: District }) {
  const plot = PLOTS[district.id]!;
  const occupancy = Math.round((district.certified / district.planned) * 100);
  return (
    <g className="tp-district" data-status={district.status}>
      <rect className="tp-plot" x={plot.x} y={plot.y} width={plot.w} height={plot.h} />
      {district.status === 'under-construction' && (
        <rect
          className="tp-plot-hatch"
          x={plot.x}
          y={plot.y}
          width={plot.w}
          height={plot.h}
          fill="url(#tp-hatch)"
        />
      )}
      <text className="tp-plot-name" x={plot.x + 14} y={plot.y + 30}>
        {district.name.toUpperCase()}
      </text>
      <text className="tp-plot-meta" x={plot.x + 14} y={plot.y + 50}>
        PHASE {district.phase} · {occupancy}% OCCUPIED
      </text>
    </g>
  );
}

export default function TownPlanPage() {
  const { reduced } = useMotionPreference();

  return (
    <div className="tp-root" data-testid="live-town-plan" data-reduced={reduced ? 'true' : undefined}>
      <header className="tp-chrome" data-part-id="proj-data-modernisation-programme/chrome">
        <div className="tp-chrome-left">
          <RouterLink to="/" className="tp-back">
            ◄ GALLERY
          </RouterLink>
          <span className="tp-chrome-rule" aria-hidden="true" />
          <span className="tp-chrome-mast">{PLAN.masthead}</span>
        </div>
        <span className="tp-chrome-ref">{PLAN.ref}</span>
      </header>

      <main className="tp-main">
        <section className="tp-proclamation" aria-labelledby="tp-title" data-part-id="proj-data-modernisation-programme/proclamation">
          <p className="tp-kicker">{PLAN.kicker}</p>
          <h1 id="tp-title" className="tp-title">
            {PLAN.title}
          </h1>
          <p className="tp-subline">{PLAN.subline}</p>
          <dl className="tp-figures" data-part-id="proj-data-modernisation-programme/proclamation/figures">
            {PLAN.figures.map((figure) => (
              <div key={figure.label} className="tp-figure">
                <dt>{figure.label}</dt>
                <dd>{figure.value}</dd>
              </div>
            ))}
          </dl>
          <p className="tp-provenance">{PLAN.provenance}</p>
        </section>

        <section className="tp-band" aria-labelledby="tp-plan-heading" data-part-id="proj-data-modernisation-programme/plan">
          <h2 id="tp-plan-heading" className="tp-band-heading">
            {DRAWING.title}
            <span className="tp-band-sub">{DRAWING.sub}</span>
          </h2>
          <figure className="tp-plan-figure">
            <div className="tp-plan-sweep" aria-hidden="true" />
            <div className="tp-plan-scroll">
              <svg
                className="tp-plan"
                viewBox="0 0 1080 430"
                role="img"
                aria-label={DRAWING.caption}
                data-part-id="proj-data-modernisation-programme/plan/masterplan"
              >
                <defs>
                  <pattern id="tp-hatch" width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="8" className="tp-hatch-line" />
                  </pattern>
                </defs>
                {/* The legacy river */}
                <path
                  className="tp-river"
                  d="M 60 0 C 100 70 40 140 80 210 C 120 280 50 350 90 430 L 170 430 C 130 350 200 280 160 210 C 120 140 190 70 150 0 Z"
                />
                <text className="tp-river-label" x={104} y={225} transform="rotate(-84 104 225)" textAnchor="middle">
                  LEGACY RIVER
                </text>
                {/* Bridges still standing */}
                <g className="tp-bridge">
                  <rect x={158} y={100} width={72} height={16} rx={2} />
                  <text x={194} y={92} textAnchor="middle">
                    BRIDGE 1
                  </text>
                </g>
                <g className="tp-bridge">
                  <rect x={148} y={240} width={82} height={16} rx={2} />
                  <text x={189} y={232} textAnchor="middle">
                    BRIDGE 2
                  </text>
                </g>
                {/* The commons — shared reference data */}
                <g className="tp-commons">
                  <rect x={460} y={320} width={190} height={90} rx={6} />
                  <text x={555} y={362} textAnchor="middle">
                    THE COMMONS
                  </text>
                  <text className="tp-commons-sub" x={555} y={380} textAnchor="middle">
                    SHARED REFERENCE DATA
                  </text>
                </g>
                {/* Districts */}
                {DISTRICTS.map((district) => (
                  <DistrictPlot key={district.id} district={district} />
                ))}
              </svg>
            </div>
            <figcaption className="tp-plan-caption">
              <VisuallyHidden>{DRAWING.caption}</VisuallyHidden>
              <span className="tp-legend">
                <span className="tp-legend-item">
                  <span className="tp-legend-swatch tp-legend-occupied" aria-hidden="true" />
                  {DRAWING.legend.occupied}
                </span>
                <span className="tp-legend-item">
                  <span className="tp-legend-swatch tp-legend-construction" aria-hidden="true" />
                  {DRAWING.legend.construction}
                </span>
                <span className="tp-legend-item">
                  <span className="tp-legend-swatch tp-legend-zoned" aria-hidden="true" />
                  {DRAWING.legend.zoned}
                </span>
                <span className="tp-legend-item">
                  <span className="tp-legend-swatch tp-legend-bridge" aria-hidden="true" />
                  {DRAWING.legend.bridge}
                </span>
              </span>
            </figcaption>
          </figure>
        </section>

        <section className="tp-band" aria-labelledby="tp-phasing-heading" data-part-id="proj-data-modernisation-programme/phasing">
          <h2 id="tp-phasing-heading" className="tp-band-heading">
            {PHASES.title}
            <span className="tp-band-sub">{PHASES.sub}</span>
          </h2>
          <ol className="tp-phases" data-part-id="proj-data-modernisation-programme/phasing/phase-cards">
            {PHASES.entries.map((phase) => (
              <li key={phase.id} className="tp-phase" data-state={phase.state}>
                <header className="tp-phase-head">
                  <span className="tp-phase-numeral">PHASE {phase.numeral}</span>
                  <span className="tp-phase-name">{phase.name}</span>
                  <span className="tp-phase-window">{phase.window}</span>
                </header>
                <p className="tp-phase-districts">{phase.districts}</p>
                <p className="tp-phase-retires">{phase.retires}</p>
              </li>
            ))}
          </ol>
        </section>

        <div className="tp-columns">
          <section className="tp-band" aria-labelledby="tp-occupancy-heading" data-part-id="proj-data-modernisation-programme/occupancy">
            <h2 id="tp-occupancy-heading" className="tp-band-heading">
              {OCCUPANCY.title}
              <span className="tp-band-sub">{OCCUPANCY.sub}</span>
            </h2>
            <ol className="tp-ledger" data-part-id="proj-data-modernisation-programme/occupancy/district-ledger">
              {DISTRICTS.map((district) => {
                const occupancy = Math.round((district.certified / district.planned) * 100);
                return (
                  <li key={district.id} className="tp-ledger-row" data-status={district.status}>
                    <span className="tp-ledger-name">{district.name}</span>
                    <span className="tp-ledger-bar" aria-hidden="true">
                      <span className="tp-ledger-fill" style={{ width: `${occupancy}%` }} />
                    </span>
                    <span className="tp-ledger-count">
                      {district.certified}/{district.planned} · {occupancy}%
                    </span>
                    <span className="tp-ledger-status">{STATUS_LABEL[district.status]}</span>
                  </li>
                );
              })}
            </ol>
          </section>

          <section className="tp-band" aria-labelledby="tp-covenants-heading" data-part-id="proj-data-modernisation-programme/covenants">
            <h2 id="tp-covenants-heading" className="tp-band-heading">
              {COVENANTS.title}
              <span className="tp-band-sub">{COVENANTS.sub}</span>
            </h2>
            <ol className="tp-covenants">
              {COVENANTS.rules.map((rule, i) => (
                <li key={rule.id} className="tp-covenant">
                  <span className="tp-covenant-num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="tp-covenant-text">{rule.rule}</p>
                    <p className="tp-covenant-note">{rule.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </main>

      <footer className="tp-foot">
        <p>{FOOT.note}</p>
        <p className="tp-foot-line">
          <span>{PLAN.provenance}</span>
          <span>{FOOT.next}</span>
        </p>
      </footer>
    </div>
  );
}
