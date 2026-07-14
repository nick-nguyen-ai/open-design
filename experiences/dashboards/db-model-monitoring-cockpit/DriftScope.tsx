/**
 * The commanding visual of the Model Risk Control Room: a radial DRIFT SCOPE.
 *
 * Hand-built SVG instrument — every model in the fleet is a contact placed at
 * its drift-severity radius (30-day PSI) inside its business-line sector.
 * Threshold rings at the watch and breach limits; one contact — the single
 * `breach` model — sits visibly past the limit ring with a crosshair and a
 * callout dossier line. A slow phosphor sweep keeps the instrument alive; it
 * pauses on demand and never renders under reduced motion.
 *
 * This is a TEMPLATE helper (not a `*Template.tsx`): it owns the scope's whole
 * GEOMETRY and takes only CONTENT as props (the fleet, the sectors, the drift
 * thresholds, the breach callout note) — every editorial string it draws is
 * either passed in or DERIVED from that content, so the scope always names and
 * points at whichever model is flagged.
 *
 * Accessibility: the SVG is decorative (`aria-hidden`); the REAL content is
 * the visible fleet watchlist table rendered beside/below the scope by
 * CockpitTemplate. All colours live in cockpit.css (experience-local art layer).
 */
import { DataInkDraw } from '@enterprise-design/motion';
import type { CockpitFleetModel, CockpitSector } from './cockpit-fill.js';

/* ------------------------------------------------------------------ */
/* Scope geometry (template-fixed — content-independent)               */
/* ------------------------------------------------------------------ */

const SCOPE_SIZE = 1000;
const SCOPE_CENTER = SCOPE_SIZE / 2;
/** PSI value mapped to the scope's outer graticule. */
const SCOPE_MAX_PSI = 0.34;
/** Radius of the outermost graticule ring, in viewBox units. */
const SCOPE_MAX_R = 430;

const C = SCOPE_CENTER;

function scopeRadius(psi: number): number {
  return (Math.min(psi, SCOPE_MAX_PSI) / SCOPE_MAX_PSI) * SCOPE_MAX_R;
}

const OUTER_R = scopeRadius(0.34);

/** A model placed on the scope: its polar coordinate resolved to x/y. */
interface ScopeContact extends CockpitFleetModel {
  angleDeg: number;
  x: number;
  y: number;
}

/** Deterministic polar placement: sector quadrant + even slots within it. */
function buildScopeContacts(
  sectors: readonly CockpitSector[],
  models: readonly CockpitFleetModel[],
): ScopeContact[] {
  return sectors.flatMap((sector, sectorIndex) => {
    const sectorModels = models.filter((m) => m.sectorId === sector.id);
    return sectorModels.map((model, slot) => {
      const sectorStart = -90 + sectorIndex * 90;
      const angleDeg = sectorStart + ((slot + 0.5) * 90) / sectorModels.length;
      const rad = (angleDeg * Math.PI) / 180;
      const r = scopeRadius(model.psi);
      return {
        ...model,
        angleDeg,
        x: SCOPE_CENTER + r * Math.cos(rad),
        y: SCOPE_CENTER + r * Math.sin(rad),
      };
    });
  });
}

/**
 * Deterministic per-contact label nudges (viewBox units) — hand-set where the
 * healthy cluster near the hub would otherwise collide.
 */
const LABEL_NUDGE: Record<string, { dx: number; dy: number }> = {
  'complaint-triage-nlp': { dx: 6, dy: 27 },
  'kyc-doc-classifier': { dx: -2, dy: -13 },
  'merchant-risk-gbm': { dx: 4, dy: 15 },
  'sanctions-screening-v3': { dx: 4, dy: -11 },
  'churn-early-warning': { dx: -4, dy: -16 },
  'mortgage-pd-b2': { dx: 4, dy: 3 },
};

function polar(angleDeg: number, r: number): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: C + r * Math.cos(rad), y: C + r * Math.sin(rad) };
}

/** Bezel tick marks every 5°, emphasised every 15°. */
function BezelTicks() {
  const ticks = [];
  for (let a = 0; a < 360; a += 5) {
    const major = a % 15 === 0;
    const p1 = polar(a - 90, OUTER_R + 6);
    const p2 = polar(a - 90, OUTER_R + (major ? 18 : 11));
    ticks.push(
      <line
        key={a}
        x1={p1.x}
        y1={p1.y}
        x2={p2.x}
        y2={p2.y}
        className={major ? 'ck-tick ck-tick-major' : 'ck-tick'}
      />,
    );
  }
  return <g>{ticks}</g>;
}

function SectorChrome({ sectors }: { sectors: readonly CockpitSector[] }) {
  return (
    <g>
      {sectors.map((sector, i) => {
        const boundary = polar(-90 + i * 90, OUTER_R + 4);
        const mid = polar(-45 + i * 90, OUTER_R + 44);
        const anchor = mid.x > C + 1 ? 'start' : mid.x < C - 1 ? 'end' : 'middle';
        return (
          <g key={sector.id}>
            <line x1={C} y1={C} x2={boundary.x} y2={boundary.y} className="ck-spoke" />
            <text
              x={mid.x}
              y={mid.y}
              textAnchor={anchor}
              dominantBaseline="middle"
              className="ck-sector-label"
            >
              {sector.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/** The threshold rings — minor graticule + the watch and limit rings from thresholds. */
function Graticule({ sectors, watch, breach }: { sectors: readonly CockpitSector[]; watch: number; breach: number }) {
  const rings: readonly { psi: number; label?: string; kind: 'minor' | 'watch' | 'limit' }[] = [
    { psi: 0.05, kind: 'minor' },
    { psi: watch, label: `${watch.toFixed(2)} WATCH`, kind: 'watch' },
    { psi: 0.15, kind: 'minor' },
    { psi: 0.2, kind: 'minor' },
    { psi: breach, label: `${breach.toFixed(2)} LIMIT`, kind: 'limit' },
    { psi: 0.3, kind: 'minor' },
  ];
  return (
    <g>
      <circle cx={C} cy={C} r={OUTER_R} className="ck-bezel" />
      <BezelTicks />
      {rings.map((ring) => {
        const r = scopeRadius(ring.psi);
        return (
          <g key={ring.kind === 'minor' ? `minor-${ring.psi}` : ring.kind}>
            <circle
              cx={C}
              cy={C}
              r={r}
              className={
                ring.kind === 'limit'
                  ? 'ck-ring ck-ring-limit'
                  : ring.kind === 'watch'
                    ? 'ck-ring ck-ring-watch'
                    : 'ck-ring'
              }
            />
            {ring.label ? (
              <text x={C + 10} y={C - r - 7} className="ck-ring-label">
                {ring.label}
              </text>
            ) : null}
          </g>
        );
      })}
      <SectorChrome sectors={sectors} />
      {/* centre hub */}
      <line x1={C - 12} y1={C} x2={C + 12} y2={C} className="ck-hub" />
      <line x1={C} y1={C - 12} x2={C} y2={C + 12} className="ck-hub" />
    </g>
  );
}

function ContactMark({ contact }: { contact: ScopeContact }) {
  const { x, y } = contact;
  if (contact.status === 'breach') {
    return (
      <g className="ck-contact-breach">
        <circle cx={x} cy={y} r={26} className="ck-halo ck-anim-halo" />
        <circle cx={x} cy={y} r={40} className="ck-halo ck-halo-outer ck-anim-halo-outer" />
        <circle cx={x} cy={y} r={11} className="ck-breach-ring" />
        <circle cx={x} cy={y} r={3.5} className="ck-breach-core" />
        {[0, 90, 180, 270].map((a) => {
          const rad = (a * Math.PI) / 180;
          return (
            <line
              key={a}
              x1={x + 15 * Math.cos(rad)}
              y1={y + 15 * Math.sin(rad)}
              x2={x + 23 * Math.cos(rad)}
              y2={y + 23 * Math.sin(rad)}
              className="ck-breach-tick"
            />
          );
        })}
      </g>
    );
  }

  const labelSide = x >= C ? 1 : -1;
  const nudge = LABEL_NUDGE[contact.id] ?? { dx: 0, dy: 0 };
  const label = (
    <text
      x={x + labelSide * 16 + nudge.dx}
      y={y + 4 + nudge.dy}
      textAnchor={labelSide === 1 ? 'start' : 'end'}
      className={contact.status === 'watch' ? 'ck-contact-label ck-contact-label-watch' : 'ck-contact-label'}
    >
      {contact.name}
    </text>
  );

  if (contact.status === 'watch') {
    return (
      <g>
        <rect
          x={-8}
          y={-8}
          width={16}
          height={16}
          transform={`translate(${x} ${y}) rotate(45)`}
          className="ck-contact-watch"
        />
        {label}
      </g>
    );
  }

  return (
    <g>
      <circle cx={x} cy={y} r={6} className="ck-contact-stable" />
      {label}
    </g>
  );
}

/** The breach callout — name + a DERIVED PSI/limit row + the fill's continuation note. */
function BreachCallout({ contact, breach, note }: { contact: ScopeContact; breach: number; note: string }) {
  const kneeX = contact.x + 74;
  const kneeY = contact.y - 36;
  const endX = 984;
  const over = contact.psi - breach;
  return (
    <g className="ck-callout">
      <polyline
        points={`${contact.x + 14},${contact.y - 8} ${kneeX},${kneeY} ${endX},${kneeY}`}
        className="ck-callout-line"
      />
      <text x={endX} y={kneeY - 14} textAnchor="end" className="ck-callout-name">
        {contact.name.toUpperCase()}
      </text>
      <text x={endX} y={kneeY + 24} textAnchor="end" className="ck-callout-row">
        {`PSI ${contact.psi.toFixed(3)} · LIMIT ${breach.toFixed(3)} · +${over.toFixed(3)} OVER`}
      </text>
      <text x={endX} y={kneeY + 48} textAnchor="end" className="ck-callout-row">
        {note}
      </text>
    </g>
  );
}

/** The rotating sweep — trailing wedges + a leading edge line. Paused via CSS. */
function Sweep() {
  const wedges = [];
  for (let i = 0; i < 5; i += 1) {
    const a0 = -90 - (i + 1) * 6;
    const a1 = -90 - i * 6;
    const p0 = polar(a0, OUTER_R);
    const p1 = polar(a1, OUTER_R);
    wedges.push(
      <path
        key={i}
        d={`M ${C} ${C} L ${p0.x} ${p0.y} A ${OUTER_R} ${OUTER_R} 0 0 1 ${p1.x} ${p1.y} Z`}
        className="ck-sweep-wedge"
        style={{ opacity: 0.09 - i * 0.016 }}
      />,
    );
  }
  const edge = polar(-90, OUTER_R);
  return (
    <g className="ck-sweep ck-anim-sweep" aria-hidden="true">
      {wedges}
      <line x1={C} y1={C} x2={edge.x} y2={edge.y} className="ck-sweep-edge" />
    </g>
  );
}

export interface DriftScopeProps {
  /** Reduced-motion: no sweep, no halo pulse — a held, static scope. */
  reduced: boolean;
  sectors: readonly CockpitSector[];
  models: readonly CockpitFleetModel[];
  /** Drift thresholds — the watch and breach rings. */
  watch: number;
  breach: number;
  /** The breach callout's continuation line. */
  breachCalloutNote: string;
}

export function DriftScope({ reduced, sectors, models, watch, breach, breachCalloutNote }: DriftScopeProps) {
  const contacts = buildScopeContacts(sectors, models);
  const breaching = contacts.find((c) => c.status === 'breach');

  return (
    <svg
      viewBox={`0 0 ${SCOPE_SIZE} ${SCOPE_SIZE}`}
      className="ck-scope-svg"
      aria-hidden="true"
      focusable="false"
      data-testid="drift-scope"
      data-scope-variant={reduced ? 'held' : 'live'}
    >
      <defs>
        <radialGradient id="ck-glass" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--ck-glass-core)" />
          <stop offset="62%" stopColor="var(--ck-glass-mid)" />
          <stop offset="100%" stopColor="var(--ck-glass-rim)" />
        </radialGradient>
      </defs>

      <circle cx={C} cy={C} r={OUTER_R} fill="url(#ck-glass)" />
      {reduced ? null : <Sweep />}

      <DataInkDraw
        as="g"
        groups={[
          { id: 'graticule', content: <Graticule sectors={sectors} watch={watch} breach={breach} /> },
          {
            id: 'contacts',
            content: (
              <g>
                {contacts.map((contact) => (
                  <ContactMark key={contact.id} contact={contact} />
                ))}
              </g>
            ),
          },
          {
            id: 'annotation',
            content: breaching ? (
              <BreachCallout contact={breaching} breach={breach} note={breachCalloutNote} />
            ) : (
              <g />
            ),
          },
        ]}
      />
    </svg>
  );
}
