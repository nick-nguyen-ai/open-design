/**
 * "The Sectional" — the live full-bleed rendering of
 * `deck-technical-architecture-explanation`.
 *
 * An architecture explained the way engineers cut a building: SHEETS with real
 * sheet numbers, each cut deeper — site plan (systems as masses), elevation
 * (the street face of the service topology), SECTION B–B (the money sheet: one
 * request cut open vertically with latency measure lines per storey, one
 * storey RED-PENCILLED over budget — the anomaly), a magnified interface
 * detail, a drafted load-schedule exhibit (FIG A-401.2), and the revision
 * history. True cyanotype: pale line work on saturated Prussian blue — the
 * deliberate inverse of the Drawing Office's pale paper (cross-referenced in
 * every title block). Every sheet carries a mini title block and a SCHEDULE OF
 * PARTS (the accessible mirror). Keyboard-driven (←/→/Home/End, S jumps to the
 * section), `?slide=` deep-linkable, printable one sheet per page (blue drops
 * to white, line work to ink).
 *
 * Art-direction licence (task 17): this file and sectional.css are the
 * experience-local art layer — raw colour values are permitted HERE. Motion
 * easings/durations stay token-driven.
 */
import { useEffect, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import {
  ChartFigure,
  buildCategoryBarChartOption,
  buildCategoryBarChartTable,
} from '@enterprise-design/data-viz';
import type { ChartOption } from '@enterprise-design/data-viz';
import { VisuallyHidden } from '@enterprise-design/primitives';
import '@fontsource-variable/inter';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import './sectional.css';
import { useDeckNavigation } from '../_deck-kit/useDeckNavigation.js';
import {
  DETAIL,
  ELEVATION_BAYS,
  FIG_A4012,
  LOAD_ROWS,
  MASSES,
  OVER_STOREY,
  PLAN_ROUTES,
  REVISIONS,
  SECTION_BUDGET_TOTAL_MS,
  SECTION_MEASURED_TOTAL_MS,
  SECTION_SHEET_NUMBER,
  SET,
  SHEETS,
  SHEET_COUNT,
  STOREYS,
} from './content.js';
import type { Sheet } from './content.js';

const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const INK = {
  pale: '#dbe7fb',
  bright: '#f4f8ff',
  dim: '#8fa9d8',
  red: '#ff6a55',
  grid: 'rgba(219, 231, 251, 0.22)',
  gridSoft: 'rgba(219, 231, 251, 0.1)',
  panel: '#0d2f66',
} as const;

type Rec = Record<string, unknown>;

/* ---------------------------------------------------------------- */
/* Build wrapper                                                     */
/* ---------------------------------------------------------------- */

function Build({
  i,
  children,
  className,
  as: Tag = 'div',
}: {
  i: number;
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'li';
}) {
  return (
    <Tag className={className ? `sc-build ${className}` : 'sc-build'} style={{ ['--sc-i' as string]: i }}>
      {children}
    </Tag>
  );
}

/* ---------------------------------------------------------------- */
/* Title block + parts schedule (every sheet carries both)            */
/* ---------------------------------------------------------------- */

function TitleBlock({ sheet }: { sheet: Sheet }) {
  return (
    <div className="sc-titleblock" data-testid={`titleblock-${sheet.id}`}>
      <div className="sc-tb-row sc-tb-project">
        <span>{SET.project}</span>
        <span>{SET.client}</span>
      </div>
      <div className="sc-tb-row sc-tb-ref">{SET.crossRef}</div>
      <dl className="sc-tb-grid">
        <div>
          <dt>SHEET</dt>
          <dd className="sc-tb-no">{sheet.no}</dd>
        </div>
        <div>
          <dt>TITLE</dt>
          <dd>{sheet.title}</dd>
        </div>
        <div>
          <dt>SCALE</dt>
          <dd>{SET.scale}</dd>
        </div>
        <div>
          <dt>DRAWN</dt>
          <dd>{SET.drawn}</dd>
        </div>
        <div>
          <dt>CHECKED</dt>
          <dd>{SET.checked}</dd>
        </div>
        <div>
          <dt>ISSUE</dt>
          <dd>C</dd>
        </div>
      </dl>
      <div className="sc-tb-row sc-tb-notice">{SET.dataNotice}</div>
    </div>
  );
}

function PartsSchedule({ sheet }: { sheet: Sheet }) {
  return (
    <div className="sc-parts" data-testid={`parts-${sheet.id}`}>
      <p className="sc-parts-heading">SCHEDULE OF PARTS · {sheet.no}</p>
      <ol className="sc-parts-list">
        {sheet.parts.map((p) => (
          <li key={p.mark} data-over={p.note.includes('OVER BUDGET') || p.note.endsWith('· over') ? 'true' : undefined}>
            <span className="sc-part-mark">{p.mark}</span>
            <span className="sc-part-name">{p.name}</span>
            <span className="sc-part-note">{p.note}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* A-101 SITE PLAN                                                   */
/* ---------------------------------------------------------------- */

function centre(m: { x: number; y: number; w: number; h: number }) {
  return { cx: m.x + m.w / 2, cy: m.y + m.h / 2 };
}

function SitePlanDrawing() {
  const byId = Object.fromEntries(MASSES.map((m) => [m.id, m]));
  return (
    <svg className="sc-drawing" viewBox="0 0 1060 720" role="presentation" aria-hidden="true">
      <defs>
        <pattern id="sc-hatch" width="9" height="9" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="9" stroke={INK.grid} strokeWidth="1.4" />
        </pattern>
      </defs>
      {/* Lot line */}
      <rect x="28" y="28" width="770" height="664" className="sc-lotline" />
      <text className="sc-lot-label" x="40" y="700">LOT LINE — OUR ESTATE</text>
      {/* Section cut B–B through the decision hall */}
      <line x1="565" y1="16" x2="565" y2="704" className="sc-cutline" />
      <text className="sc-cut-mark" x="574" y="34">B</text>
      <text className="sc-cut-mark" x="574" y="700">B</text>
      {/* Routes */}
      {PLAN_ROUTES.map((r) => {
        const a = centre(byId[r.from] as (typeof MASSES)[number]);
        const b = centre(byId[r.to] as (typeof MASSES)[number]);
        return (
          <g key={`${r.from}-${r.to}`}>
            <line x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy} className="sc-route" />
            <text className="sc-route-label" x={(a.cx + b.cx) / 2 + 8} y={(a.cy + b.cy) / 2 - 6}>
              {r.label}
            </text>
          </g>
        );
      })}
      {/* Masses */}
      {MASSES.map((m, i) => (
        <g key={m.id} className="sc-mass-g" style={{ ['--sc-i' as string]: i }}>
          <rect
            x={m.x}
            y={m.y}
            width={m.w}
            height={m.h}
            className="sc-mass"
            fill={m.external ? 'url(#sc-hatch)' : 'transparent'}
            data-external={m.external ? 'true' : undefined}
          />
          <text className="sc-mass-label" x={m.x + 14} y={m.y + 30}>{m.label}</text>
          <text className="sc-mass-sub" x={m.x + 14} y={m.y + 50}>{m.sub}</text>
        </g>
      ))}
      {/* North point */}
      <g className="sc-north" transform="translate(1000, 70)">
        <circle r="24" />
        <path d="M 0 -16 L 7 10 L 0 4 L -7 10 Z" />
        <text y="44">N</text>
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------- */
/* A-201 ELEVATION                                                   */
/* ---------------------------------------------------------------- */

const STOREY_H = 128;
const GROUND_Y = 640;

function ElevationDrawing() {
  return (
    <svg className="sc-drawing" viewBox="0 0 1060 720" role="presentation" aria-hidden="true">
      {/* Storey datum lines */}
      {[0, 1, 2, 3].map((s) => {
        const y = GROUND_Y - s * STOREY_H;
        return (
          <g key={s}>
            <line x1="30" y1={y} x2="900" y2={y} className="sc-datum" />
            <text className="sc-datum-label" x="912" y={y + 4}>
              {s === 0 ? 'GROUND' : `STOREY ${s}`}
            </text>
          </g>
        );
      })}
      {/* Ground hatching */}
      <line x1="30" y1={GROUND_Y} x2="900" y2={GROUND_Y} className="sc-ground" />
      {Array.from({ length: 29 }, (_, i) => (
        <line
          key={i}
          x1={30 + i * 30}
          y1={GROUND_Y}
          x2={30 + i * 30 + 14}
          y2={GROUND_Y + 14}
          className="sc-ground-hatch"
        />
      ))}
      {/* Bays */}
      {ELEVATION_BAYS.map((b, i) => {
        const y = GROUND_Y - b.storey * STOREY_H - 104;
        return (
          <g key={b.id} className="sc-mass-g" style={{ ['--sc-i' as string]: i }}>
            <rect x={b.x} y={y} width={b.w} height={96} className="sc-mass" />
            {/* Replica mullions */}
            {Array.from({ length: b.replicas - 1 }, (_, r) => (
              <line
                key={r}
                x1={b.x + ((r + 1) * b.w) / b.replicas}
                y1={y + 62}
                x2={b.x + ((r + 1) * b.w) / b.replicas}
                y2={y + 96}
                className="sc-mullion"
              />
            ))}
            <text className="sc-mass-label" x={b.x + 12} y={y + 26}>{b.label}</text>
            <text className="sc-mass-sub" x={b.x + 12} y={y + 46}>{b.tech} · ×{b.replicas}</text>
          </g>
        );
      })}
      {/* Section cut arrows through the orchestrator bay */}
      <line x1="360" y1="20" x2="360" y2="700" className="sc-cutline" />
      <text className="sc-cut-mark" x="369" y="38">B</text>
      <text className="sc-cut-mark" x="369" y="696">B</text>
    </svg>
  );
}

/* ---------------------------------------------------------------- */
/* A-301 SECTION B–B — the money sheet                                */
/* ---------------------------------------------------------------- */

const SEC_TOP = 64;
const SEC_STOREY_H = 118;
const SEC_LEFT = 240;
const SEC_W = 460;

function SectionDrawing({ reduced }: { reduced: boolean }) {
  return (
    <svg
      className="sc-drawing"
      viewBox="0 0 1060 720"
      role="presentation"
      aria-hidden="true"
      data-testid="section-cut"
    >
      {/* The descending request line — drawn, then still (reduced: static) */}
      <line
        x1={SEC_LEFT + SEC_W / 2}
        y1={SEC_TOP - 34}
        x2={SEC_LEFT + SEC_W / 2}
        y2={SEC_TOP + STOREYS.length * SEC_STOREY_H + 18}
        className={reduced ? 'sc-request sc-request-static' : 'sc-request'}
      />
      <text className="sc-request-label" x={SEC_LEFT + SEC_W / 2 + 10} y={SEC_TOP - 40}>
        ONE DECISION REQUEST · CUT B–B
      </text>
      <path
        d={`M ${SEC_LEFT + SEC_W / 2 - 7} ${SEC_TOP + STOREYS.length * SEC_STOREY_H + 8} l 7 14 l 7 -14 Z`}
        className="sc-request-head"
      />
      {STOREYS.map((s, i) => {
        const y = SEC_TOP + i * SEC_STOREY_H;
        const scale = 2.2; // px per ms on the measure bars
        const budgetW = s.budgetMs * scale;
        const measuredW = s.measuredMs * scale;
        return (
          <g key={s.id} className="sc-mass-g" style={{ ['--sc-i' as string]: i }} data-over={s.over ? 'true' : undefined}>
            {/* Storey slab */}
            <rect x={SEC_LEFT} y={y} width={SEC_W} height={SEC_STOREY_H - 22} className="sc-storey" data-over={s.over ? 'true' : undefined} />
            <line x1={SEC_LEFT - 130} y1={y + SEC_STOREY_H - 22} x2={SEC_LEFT + SEC_W + 60} y2={y + SEC_STOREY_H - 22} className="sc-slab" />
            {/* Storey mark + name */}
            <text className="sc-storey-mark" x={SEC_LEFT - 118} y={y + 34}>{s.mark}</text>
            <text className="sc-mass-label" x={SEC_LEFT + 16} y={y + 30}>{s.name}</text>
            <text className="sc-mass-sub" x={SEC_LEFT + 16} y={y + 50}>{s.work}</text>
            {/* Measure lines: budget (drawn) vs measured (pencilled). Labels sit
                above their own line, anchored at the start, so no bar length can
                push them off the sheet. */}
            <g transform={`translate(${SEC_LEFT + SEC_W + 40}, ${y + 26})`}>
              <text className="sc-measure-label" x="0" y="-10">BUDGET {s.budgetMs}ms · DRAWN</text>
              <line x1="0" y1="0" x2={budgetW} y2="0" className="sc-measure-budget" />
              <line x1="0" y1="-6" x2="0" y2="6" className="sc-measure-tick" />
              <line x1={budgetW} y1="-6" x2={budgetW} y2="6" className="sc-measure-tick" />
              <text className="sc-measure-label" data-over={s.over ? 'true' : undefined} x="0" y="26">
                P95 {s.measuredMs}ms{s.over ? ` · +${s.measuredMs - s.budgetMs}ms OVER` : ' · IN'}
              </text>
              <line x1="0" y1="36" x2={measuredW} y2="36" className="sc-measure-actual" data-over={s.over ? 'true' : undefined} />
              <line x1="0" y1="30" x2="0" y2="42" className="sc-measure-tick" />
              <line x1={measuredW} y1="30" x2={measuredW} y2="42" className="sc-measure-tick" data-over={s.over ? 'true' : undefined} />
            </g>
            {/* Red-pencil cloud on the over-budget storey; its note sits INSIDE
                the storey, clear of every slab line. */}
            {s.over ? (
              <g className="sc-redcloud">
                <rect x={SEC_LEFT - 8} y={y - 8} width={SEC_W + 16} height={SEC_STOREY_H + 2} rx="18" />
                <text x={SEC_LEFT + SEC_W - 16} y={y + SEC_STOREY_H - 36} textAnchor="end">
                  RFI-114 · SEE SHT A-401
                </text>
              </g>
            ) : null}
          </g>
        );
      })}
      {/* Overall dimension */}
      <g transform={`translate(120, ${SEC_TOP})`}>
        <line x1="0" y1="0" x2="0" y2={STOREYS.length * SEC_STOREY_H - 22} className="sc-measure-budget" />
        <line x1="-6" y1="0" x2="6" y2="0" className="sc-measure-tick" />
        <line x1="-6" y1={STOREYS.length * SEC_STOREY_H - 22} x2="6" y2={STOREYS.length * SEC_STOREY_H - 22} className="sc-measure-tick" />
        <text className="sc-measure-label sc-measure-vert" transform={`translate(-14, ${(STOREYS.length * SEC_STOREY_H) / 2}) rotate(-90)`}>
          END TO END · BUDGET {SECTION_BUDGET_TOTAL_MS}ms · MEASURED {SECTION_MEASURED_TOTAL_MS}ms
        </text>
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------- */
/* A-402 LOAD SCHEDULE chart                                          */
/* ---------------------------------------------------------------- */

function useLoadOption(reduced: boolean): ChartOption {
  return useMemo(() => {
    const base = buildCategoryBarChartOption([...LOAD_ROWS], {
      colors: [INK.pale, INK.red],
      unit: 'ms',
      orientation: 'horizontal',
      reducedMotion: reduced,
    }) as Rec;
    const axisInk = {
      axisLine: { lineStyle: { color: INK.grid } },
      axisTick: { show: false },
      axisLabel: { color: INK.dim, fontFamily: MONO, fontSize: 11 },
      nameTextStyle: { color: INK.dim, fontFamily: MONO },
    };
    const series = (base.series as Rec[]).map((s) =>
      s.id === 'value'
        ? {
            ...s,
            name: 'MEASURED P95',
            barWidth: 18,
            itemStyle: { color: INK.pale, borderRadius: 0 },
            // Red pencil is reserved for the breach: only the row over its
            // drawn budget carries it (shape + the OVER label, never colour alone).
            data: LOAD_ROWS.map((r) =>
              r.target !== undefined && r.value > r.target
                ? {
                    value: r.value,
                    itemStyle: { color: INK.red },
                    label: {
                      color: INK.red,
                      fontWeight: 'bold' as const,
                      formatter: '{c} ms · OVER',
                    },
                  }
                : r.value,
            ),
            label: {
              show: true,
              position: 'right',
              color: INK.pale,
              fontFamily: MONO,
              fontSize: 11,
              formatter: '{c} ms',
            },
          }
        : { ...s, name: 'BUDGET (DRAWN)', symbolSize: 13, itemStyle: { color: INK.bright } },
    );
    const categoryAxis = base.yAxis as Rec;
    const valueAxis = base.xAxis as Rec;
    return {
      ...base,
      series,
      backgroundColor: 'transparent',
      textStyle: { fontFamily: MONO, color: INK.dim },
      legend: {
        top: 0,
        icon: 'rect',
        itemWidth: 14,
        itemHeight: 3,
        itemGap: 28,
        textStyle: { color: INK.pale, fontFamily: MONO, fontSize: 11 },
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: INK.panel,
        borderColor: INK.grid,
        textStyle: { color: INK.bright, fontFamily: MONO, fontSize: 11 },
      },
      grid: { left: 30, right: 80, top: 40, bottom: 30, containLabel: true },
      xAxis: { ...valueAxis, ...axisInk, splitLine: { lineStyle: { color: INK.gridSoft, type: 'dashed' } } },
      // Category axis: keep the builder's interval 0 — labels never drop.
      yAxis: {
        ...categoryAxis,
        ...axisInk,
        axisLabel: { ...axisInk.axisLabel, interval: 0 },
        splitLine: { show: false },
      },
    } as ChartOption;
  }, [reduced]);
}

function LoadSchedule({ reduced, active }: { reduced: boolean; active: boolean }) {
  const option = useLoadOption(reduced);
  const table = useMemo(() => buildCategoryBarChartTable([...LOAD_ROWS], 'ms'), []);
  return (
    <ChartFigure
      key={active ? 'entered' : 'parked'}
      title={FIG_A4012.title}
      sourceNote={FIG_A4012.source}
      option={option}
      tableColumns={table.columns}
      tableRows={table.rows}
      height={390}
      reducedMotion={reduced}
      className="sc-chart"
    />
  );
}

/* ---------------------------------------------------------------- */
/* Sheet bodies                                                       */
/* ---------------------------------------------------------------- */

function SheetBody({ sheet, reduced, active }: { sheet: Sheet; reduced: boolean; active: boolean }) {
  switch (sheet.kind) {
    case 'cover':
      return (
        <div className="sc-body sc-body-cover">
          <Build i={0}>
            <p className="sc-kicker">{sheet.kicker}</p>
          </Build>
          <h2 className="sc-display">
            {sheet.displayLines.map((line, i) => (
              <Build key={i} i={i + 1}>
                <span className="sc-line">{line}</span>
              </Build>
            ))}
          </h2>
          <Build i={sheet.displayLines.length + 1}>
            <p className="sc-standfirst">{sheet.standfirst}</p>
          </Build>
          <Build i={sheet.displayLines.length + 2} className="sc-cover-index">
            <p className="sc-parts-heading">DRAWING INDEX</p>
            <ol className="sc-index-list">
              {sheet.parts.map((p) => (
                <li key={p.mark}>
                  <span className="sc-part-mark">{p.mark}</span>
                  <span className="sc-part-name">{p.name}</span>
                  <span className="sc-part-note">{p.note}</span>
                </li>
              ))}
            </ol>
          </Build>
        </div>
      );

    case 'notes':
      return (
        <div className="sc-body sc-body-notes">
          <Build i={0}>
            <h2 className="sc-thesis">{sheet.thesis}</h2>
          </Build>
          <ol className="sc-notes-list">
            {sheet.notes.map((n, i) => (
              <Build key={n.no} i={i + 1} as="li" className="sc-note-row">
                <span className="sc-note-no">{n.no}.</span>
                <span className="sc-note-text">{n.text}</span>
              </Build>
            ))}
          </ol>
        </div>
      );

    case 'plan':
      return (
        <div className="sc-body sc-body-drawing">
          <Build i={0} className="sc-drawing-frame">
            <SitePlanDrawing />
          </Build>
          <Build i={1}>
            <PartsSchedule sheet={sheet} />
          </Build>
        </div>
      );

    case 'elevation':
      return (
        <div className="sc-body sc-body-drawing">
          <Build i={0} className="sc-drawing-frame">
            <ElevationDrawing />
          </Build>
          <Build i={1}>
            <PartsSchedule sheet={sheet} />
          </Build>
        </div>
      );

    case 'section':
      return (
        <div className="sc-body sc-body-drawing">
          <Build i={0} className="sc-drawing-frame">
            <SectionDrawing reduced={reduced} />
          </Build>
          <Build i={1}>
            <PartsSchedule sheet={sheet} />
          </Build>
        </div>
      );

    case 'detail':
      return (
        <div className="sc-body sc-body-detail">
          <Build i={0}>
            <p className="sc-kicker">{DETAIL.callout}</p>
          </Build>
          <Build i={1}>
            <h2 className="sc-detail-name">{DETAIL.interfaceName}</h2>
          </Build>
          <div className="sc-detail-grid">
            <Build i={2} className="sc-detail-lens">
              {/* The magnifying circle: the joint from A-301, blown up */}
              <svg viewBox="0 0 420 420" role="presentation" aria-hidden="true">
                <circle cx="210" cy="210" r="186" className="sc-lens-ring" />
                <circle cx="210" cy="210" r="186" className="sc-lens-dash" />
                <rect x="80" y="120" width="260" height="66" className="sc-mass" />
                <text className="sc-mass-label" x="96" y="148">ORCHESTRATOR · S4</text>
                <text className="sc-mass-sub" x="96" y="168">saga step 2 of 5</text>
                <rect x="80" y="240" width="260" height="66" className="sc-mass" />
                <text className="sc-mass-label" x="96" y="268">FEATURE STORE · S3</text>
                <text className="sc-mass-sub" x="96" y="288">point-in-time read</text>
                <line x1="210" y1="186" x2="210" y2="240" className="sc-request sc-request-static" />
                <text className="sc-detail-dim" x="222" y="218">45ms DRAWN · 71ms MEASURED</text>
                <text className="sc-lens-tag" x="210" y="404" textAnchor="middle">SCALE 5:1 · FROM SHT A-301</text>
              </svg>
            </Build>
            <ol className="sc-callouts">
              {DETAIL.facts.map((f, i) => (
                <Build key={f.mark} i={i + 3} as="li" className="sc-callout">
                  <span className="sc-callout-mark">{f.mark}</span>
                  <span className="sc-callout-body">
                    <span className="sc-callout-term">{f.term}</span>
                    <span className="sc-callout-text">{f.text}</span>
                  </span>
                </Build>
              ))}
            </ol>
          </div>
        </div>
      );

    case 'schedule':
      return (
        <div className="sc-body sc-body-schedule">
          <Build i={0}>
            <p className="sc-kicker">{FIG_A4012.ref} · DRAFTED EXHIBIT</p>
          </Build>
          <Build i={1}>
            <h2 className="sc-sheet-heading">The joint, measured four ways.</h2>
          </Build>
          <Build i={2}>
            <p className="sc-standfirst sc-standfirst-narrow">
              Only the point-in-time join breaches its drawn budget — single reads, batches and
              fallbacks all sit inside their lines. The red pencil on SHT A-301 is one call type,
              not one subsystem.
            </p>
          </Build>
          <Build i={3} className="sc-chart-frame">
            <LoadSchedule reduced={reduced} active={active} />
          </Build>
        </div>
      );

    case 'revisions':
      return (
        <div className="sc-body sc-body-revisions">
          <Build i={0}>
            <p className="sc-kicker">REVISION HISTORY · {SET.setNo}</p>
          </Build>
          <Build i={1}>
            <h2 className="sc-sheet-heading">{sheet.closingLine}</h2>
          </Build>
          <table className="sc-rev-table" data-testid="revision-table">
            <caption className="sc-visually-hidden">
              Revision history of the sectional set: three issues, A through C.
            </caption>
            <thead>
              <tr>
                <th scope="col">REV</th>
                <th scope="col">DATE</th>
                <th scope="col">DESCRIPTION</th>
                <th scope="col">BY</th>
              </tr>
            </thead>
            <tbody>
              {REVISIONS.map((r, i) => (
                <tr key={r.rev} className="sc-build" style={{ ['--sc-i' as string]: i + 2 }}>
                  <td className="sc-rev-mark">{r.rev}</td>
                  <td>{r.date}</td>
                  <td>{r.note}</td>
                  <td>{r.by}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Build i={REVISIONS.length + 2}>
            <p className="sc-rev-foot">
              NEXT ISSUE D · EXPECTED WHEN RFI-114 CLOSES · {SET.dataNotice}
            </p>
          </Build>
        </div>
      );
  }
}

/* ---------------------------------------------------------------- */
/* The set                                                            */
/* ---------------------------------------------------------------- */

export default function SectionalPage() {
  const { reduced } = useMotionPreference();
  const { activeIndex, activeNumber, leavingIndex, goTo, counter } = useDeckNavigation(SHEET_COUNT, {
    reduced,
  });
  const activeSheet = SHEETS[activeIndex] as Sheet;

  useEffect(() => {
    document.title = 'The Sectional — Decision Platform Sectional Set — Live';
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.key === 's' || event.key === 'S') goTo(SECTION_SHEET_NUMBER);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo]);

  return (
    <div className="sc-root" data-testid="live-sectional" data-reduced={reduced ? 'true' : undefined}>
      <header className="sc-chrome" aria-label="Sheet chrome">
        <div className="sc-chrome-cell">
          <RouterLink to="/" className="sc-back">
            ◄ GALLERY
          </RouterLink>
          <span className="sc-chrome-rule" aria-hidden="true" />
          <span>{SET.setNo} · CYANOTYPE SET</span>
        </div>
        <div className="sc-chrome-cell">
          <span data-testid="sheet-counter" aria-live="polite">
            {counter} · SHT {activeSheet.no} · {activeSheet.title}
          </span>
        </div>
      </header>

      <main className="sc-main">
        <h1>
          <VisuallyHidden>
            The Sectional — the decision platform explained as an {SHEET_COUNT}-sheet cyanotype
            drawing set, each sheet cut deeper: site plan, elevation, section B–B (where the{' '}
            {OVER_STOREY.name} storey runs {OVER_STOREY.measuredMs - OVER_STOREY.budgetMs}ms over
            its drawn latency budget — red-pencilled as RFI-114), interface detail, load schedule
            and revision history. Every sheet carries a schedule of parts. Currently on sheet{' '}
            {activeNumber} of {SHEET_COUNT}: {activeSheet.no} {activeSheet.title}.
          </VisuallyHidden>
        </h1>
        <div className="sc-stage">
          {SHEETS.map((sheet, index) => {
            const state =
              index === activeIndex ? 'active' : index === leavingIndex ? 'leaving' : 'parked';
            return (
              <section
                key={sheet.id}
                className="sc-sheet"
                data-state={state}
                data-sheet-id={sheet.id}
                aria-hidden={index === activeIndex ? undefined : 'true'}
                inert={index === activeIndex ? undefined : true}
                aria-label={`Sheet ${index + 1} of ${SHEET_COUNT}: ${sheet.no} ${sheet.title}`}
              >
                <div className="sc-sheet-frame">
                  <div className="sc-sheet-inner">
                    <SheetBody sheet={sheet} reduced={reduced} active={activeSheet.id === sheet.id} />
                  </div>
                  <TitleBlock sheet={sheet} />
                </div>
                <div className="sc-print-foot" aria-hidden="true">
                  {SET.setNo} · SHT {sheet.no} · {sheet.title} · SHEET {String(index + 1).padStart(2, '0')} /{' '}
                  {SHEET_COUNT} · {SET.dataNotice}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <footer className="sc-footer">
        <span className="sc-footer-notice">{SET.dataNotice}</span>
        <div className="sc-footer-nav">
          <span className="sc-hint">{SET.keyboardHint}</span>
          <button
            type="button"
            className="sc-nav-btn"
            onClick={() => goTo((current) => current - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous sheet"
          >
            ←
          </button>
          <button
            type="button"
            className="sc-nav-btn"
            onClick={() => goTo((current) => current + 1)}
            disabled={activeIndex === SHEET_COUNT - 1}
            aria-label="Next sheet"
          >
            →
          </button>
        </div>
      </footer>
    </div>
  );
}
