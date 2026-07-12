/**
 * "The Control Frame" — the live full-bleed rendering of
 * `deck-ai-governance-and-controls`.
 *
 * Swiss-precision governance over a near-black field and a hairline modular
 * grid, monochrome with a single signal amber. The commanding visual is THE
 * CONTROL MATRIX — the bank's AI controls as a grid of lifecycle stages
 * against control families, rendered as a real (accessible) table with one
 * acknowledged GAP. The deck then navigates its own matrix, zooming into a
 * column (three lines of defence) and two rows (the approval gate, the
 * monitoring obligations). Keyboard-driven (←/→/Home/End), `?slide=`
 * deep-linkable, printable one frame per page.
 *
 * Art-direction licence (task 15): this file and frame.css are the
 * experience-local art layer — raw colour values are permitted HERE. Motion
 * easings/durations stay token-driven; reduced motion collapses the frame
 * turns to stepped opacity.
 */
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import { VisuallyHidden } from '@enterprise-design/primitives';
import '@fontsource-variable/inter/wght.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import { useDeckNavigation } from '../_deck-kit/useDeckNavigation.js';
import './frame.css';
import {
  FRAMEWORK,
  FRAMES,
  FRAME_COUNT,
  LIFECYCLE,
  FAMILIES,
  MATRIX,
  GAP_COORD,
  CONTROL_COUNT,
  GAP_COUNT,
  EXCEPTION_COUNT,
  STATUS_GLYPH,
  STATUS_LABEL,
  frameNumberForId,
} from './content.js';
import type { Cell, Frame } from './content.js';

/* ---------------------------------------------------------------- */
/* Build wrapper                                                     */
/* ---------------------------------------------------------------- */

function Build({
  i,
  children,
  className,
  style,
  as: Tag = 'div',
}: {
  i: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: 'div' | 'li';
}) {
  return (
    <Tag
      className={className ? `cf-build ${className}` : 'cf-build'}
      style={{ ['--cf-i' as string]: i, ...style }}
    >
      {children}
    </Tag>
  );
}

/* ---------------------------------------------------------------- */
/* The control matrix — the commanding visual AND the accessible     */
/* mirror (a real table).                                            */
/* ---------------------------------------------------------------- */

function ControlMatrix() {
  return (
    <table className="cf-matrix" data-testid="control-matrix">
      <caption className="cf-sr">
        AI control matrix: {LIFECYCLE.length} lifecycle stages (rows) by {FAMILIES.length} control
        families (columns), {CONTROL_COUNT} controls. Cell{' '}
        {MATRIX[GAP_COORD.row]?.[GAP_COORD.col]?.id ?? 'the fairness-monitoring cell'} — fairness
        monitoring in production — is an acknowledged control gap under remediation for Q3.
      </caption>
      <thead>
        <tr>
          <td className="cf-matrix-corner" />
          {FAMILIES.map((f) => (
            <th key={f.id} scope="col">
              {f.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {LIFECYCLE.map((stage, r) => (
          <tr key={stage.id}>
            <th scope="row" className="cf-matrix-rowhead">
              {stage.label}
            </th>
            {(MATRIX[r] ?? []).map((cell) => (
              <td
                key={cell.id}
                className="cf-cell"
                data-status={cell.status}
                data-gap={cell.status === 'gap' ? 'true' : undefined}
              >
                <span className="cf-cell-top">
                  <span className="cf-cell-glyph" aria-hidden="true">
                    {STATUS_GLYPH[cell.status]}
                  </span>
                  <span className="cf-cell-id">{cell.status === 'gap' ? 'GAP' : cell.id}</span>
                </span>
                <span className="cf-cell-name">{cell.name}</span>
                <span className="cf-cell-owner">{cell.status === 'gap' ? 'REMEDIATION Q3' : cell.owner}</span>
                <VisuallyHidden>
                  {' '}
                  — {STATUS_LABEL[cell.status]}
                  {cell.remediation ? `. ${cell.remediation}` : `. Owner ${cell.owner}.`}
                </VisuallyHidden>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** A small decorative locator: the whole matrix as dots, focused line lit. */
function MatrixMinimap({ focus }: { focus: { type: 'row' | 'col'; index: number } }) {
  return (
    <div className="cf-minimap" aria-hidden="true">
      {MATRIX.map((row, r) => (
        <div className="cf-minimap-row" key={r}>
          {row.map((cell, c) => {
            const lit = focus.type === 'row' ? r === focus.index : c === focus.index;
            return (
              <span
                key={c}
                className="cf-minimap-cell"
                data-lit={lit ? 'true' : undefined}
                data-status={cell.status}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

interface FocusedCell {
  cell: Cell;
  label: string;
  obligation: string;
}

function focusedCells(
  focus: { type: 'row' | 'col'; index: number },
  obligations: readonly string[],
): FocusedCell[] {
  if (focus.type === 'row') {
    const rowCells = MATRIX[focus.index] ?? [];
    return rowCells.map((cell, c) => ({
      cell,
      label: FAMILIES[c]?.label ?? '',
      obligation: obligations[c] ?? '',
    }));
  }
  return MATRIX.map((row, r) => {
    const cell = row[focus.index];
    return cell
      ? { cell, label: LIFECYCLE[r]?.label ?? '', obligation: obligations[r] ?? '' }
      : null;
  }).filter((x): x is FocusedCell => x !== null);
}

/* ---------------------------------------------------------------- */
/* Frame bodies                                                     */
/* ---------------------------------------------------------------- */

function FrameBody({ frame }: { frame: Frame }) {
  switch (frame.kind) {
    case 'cover':
      return (
        <div className="cf-body cf-body-cover">
          <Build i={0}>
            <p className="cf-eyebrow">
              {FRAMEWORK.title} · {FRAMEWORK.version}
            </p>
          </Build>
          <h2 className="cf-display cf-display-cover">
            {frame.titleLines.map((line, i) => (
              <Build key={i} i={i + 1}>
                <span className="cf-line">{line}</span>
              </Build>
            ))}
          </h2>
          <Build i={frame.titleLines.length + 1}>
            <p className="cf-thesis">{frame.thesis}</p>
          </Build>
          <Build i={frame.titleLines.length + 2}>
            <div className="cf-front-meta">
              {frame.meta.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </Build>
        </div>
      );

    case 'principles':
      return (
        <div className="cf-body">
          <Build i={0}>
            <p className="cf-kicker">{frame.kicker}</p>
          </Build>
          <ol className="cf-principles">
            {frame.principles.map((p, i) => (
              <Build key={p.no} i={i + 1} as="li" className="cf-principle">
                <span className="cf-principle-no" aria-hidden="true">
                  {p.no}
                </span>
                <span className="cf-principle-word">{p.word}</span>
                <span className="cf-principle-line">{p.line}</span>
              </Build>
            ))}
          </ol>
        </div>
      );

    case 'matrix':
      return (
        <div className="cf-body cf-body-matrix">
          <div className="cf-matrix-head">
            <Build i={0}>
              <p className="cf-kicker">{frame.kicker}</p>
            </Build>
            <Build i={1}>
              <h2 className="cf-matrix-title">{frame.heading}</h2>
            </Build>
            <Build i={2}>
              <p className="cf-standfirst">{frame.standfirst}</p>
            </Build>
          </div>
          <Build i={3} className="cf-matrix-wrap">
            <ControlMatrix />
            <p className="cf-matrix-legend" aria-hidden="true">
              <span>
                {STATUS_GLYPH.certified} Certified
              </span>
              <span>{STATUS_GLYPH['in-review']} In review</span>
              <span>{STATUS_GLYPH.planned} Planned</span>
              <span className="cf-legend-amber">{STATUS_GLYPH.exception} Exception</span>
              <span className="cf-legend-amber">{STATUS_GLYPH.gap} Control gap</span>
            </p>
          </Build>
        </div>
      );

    case 'zoom': {
      const cells = focusedCells(frame.focus, frame.obligations);
      const locator =
        frame.focus.type === 'row'
          ? `LOCATOR · ${LIFECYCLE[frame.focus.index]?.label ?? ''} — one stage, all families`
          : `LOCATOR · ${FAMILIES[frame.focus.index]?.label ?? ''} — one family, all stages`;
      return (
        <div className="cf-body cf-body-zoom">
          <div className="cf-zoom-head">
            <Build i={0}>
              <p className="cf-kicker cf-kicker-amber">{frame.kicker}</p>
            </Build>
            <Build i={1}>
              <h2 className="cf-zoom-title">{frame.heading}</h2>
            </Build>
            <Build i={2}>
              <p className="cf-standfirst">{frame.reading}</p>
            </Build>
            <Build i={3} className="cf-minimap-block">
              <MatrixMinimap focus={frame.focus} />
              <p className="cf-minimap-cap">{locator}</p>
            </Build>
          </div>
          <ol className="cf-zoom-line">
            {cells.map((fc, i) => (
              <Build key={fc.cell.id} i={i + 2} as="li" className="cf-zoom-cell" >
                <span className="cf-zoom-cell-head">
                  <span
                    className="cf-zoom-glyph"
                    data-status={fc.cell.status}
                    aria-hidden="true"
                  >
                    {STATUS_GLYPH[fc.cell.status]}
                  </span>
                  <span className="cf-zoom-cell-id">
                    {fc.cell.status === 'gap' ? 'CONTROL GAP' : fc.cell.id}
                  </span>
                  <span className="cf-zoom-cell-owner">
                    {fc.cell.status === 'gap' ? 'Q3' : fc.cell.owner}
                  </span>
                </span>
                <span className="cf-zoom-cell-label">{fc.label}</span>
                <span className="cf-zoom-cell-oblig">{fc.obligation}</span>
              </Build>
            ))}
          </ol>
        </div>
      );
    }

    case 'escalation':
      return (
        <div className="cf-body">
          <Build i={0}>
            <p className="cf-kicker">{frame.kicker}</p>
          </Build>
          <Build i={1}>
            <h2 className="cf-zoom-title">{frame.heading}</h2>
          </Build>
          <Build i={2}>
            <p className="cf-standfirst">{frame.standfirst}</p>
          </Build>
          <ol className="cf-escalation">
            {frame.steps.map((step, i) => (
              <Build
                key={step.tier}
                i={i + 3}
                as="li"
                className="cf-step"
                style={{ ['--cf-step' as string]: i }}
              >
                <span className="cf-step-index" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="cf-step-body">
                  <span className="cf-step-tier">{step.tier}</span>
                  <span className="cf-step-owner">{step.owner}</span>
                  <span className="cf-step-trigger">{step.trigger}</span>
                </span>
                <span className="cf-step-clock">{step.clock}</span>
              </Build>
            ))}
          </ol>
        </div>
      );

    case 'closing':
      return (
        <div className="cf-body cf-body-closing">
          <h2 className="cf-display cf-display-cover">
            {frame.lines.map((line, i) => (
              <Build key={i} i={i}>
                <span className="cf-line">{line}</span>
              </Build>
            ))}
          </h2>
          <ol className="cf-closing-obligations">
            {frame.obligations.map((o, i) => (
              <Build key={i} i={frame.lines.length + i} as="li" className="cf-closing-oblig">
                {o}
              </Build>
            ))}
          </ol>
          <Build i={frame.lines.length + frame.obligations.length}>
            <div className="cf-front-meta">
              {frame.meta.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </Build>
        </div>
      );
  }
}

/* ---------------------------------------------------------------- */
/* The framework                                                    */
/* ---------------------------------------------------------------- */

export default function ControlFramePage() {
  const { reduced } = useMotionPreference();
  const { activeIndex, activeNumber, leavingIndex, goTo, counter } = useDeckNavigation(FRAME_COUNT, {
    reduced,
  });
  const [indexOpen, setIndexOpen] = useState(false);
  const activeFrame = FRAMES[activeIndex] as Frame;

  useEffect(() => {
    document.title = `The Control Frame — ${FRAMEWORK.title} ${FRAMEWORK.version} — Live`;
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.key === 'm' || event.key === 'M') {
        const n = frameNumberForId('matrix');
        if (n) goTo(n);
      }
      if (event.key === 'i' || event.key === 'I') setIndexOpen((open) => !open);
      if (event.key === 'Escape') setIndexOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo]);

  const frameChrome = activeFrame.inMatrix
    ? `${CONTROL_COUNT} CONTROLS · ${EXCEPTION_COUNT} EXCEPTIONS · ${GAP_COUNT} GAP`
    : `${FRAMEWORK.dataNotice}`;

  return (
    <div className="cf-root" data-testid="live-control-frame" data-reduced={reduced ? 'true' : undefined}>
      <header className="cf-chrome" aria-label="Framework chrome">
        <div className="cf-chrome-cell">
          <RouterLink to="/" className="cf-back">
            ◄ GALLERY
          </RouterLink>
          <span className="cf-chrome-rule" aria-hidden="true" />
          <span>
            {FRAMEWORK.version} · {FRAMEWORK.effectiveDate}
          </span>
        </div>
        <div className="cf-chrome-cell">
          <span data-testid="frame-counter" aria-live="polite">
            {counter} · {frameChrome}
          </span>
          <span className="cf-chrome-rule" aria-hidden="true" />
          <button
            type="button"
            className="cf-index-toggle"
            aria-expanded={indexOpen}
            aria-controls="cf-index"
            onClick={() => setIndexOpen((open) => !open)}
          >
            INDEX
          </button>
        </div>
      </header>

      <nav
        id="cf-index"
        className="cf-index"
        aria-label="All frames"
        data-open={indexOpen ? 'true' : undefined}
        hidden={!indexOpen}
      >
        <p className="cf-index-heading">
          {FRAMEWORK.title} · {FRAME_COUNT} FRAMES
        </p>
        <ol className="cf-index-list">
          {FRAMES.map((frame, index) => (
            <li key={frame.id}>
              <button
                type="button"
                aria-current={index === activeIndex ? 'true' : undefined}
                onClick={() => {
                  goTo(index + 1);
                  setIndexOpen(false);
                }}
              >
                <span className="cf-index-no">{String(index + 1).padStart(2, '0')}</span>
                <span>{frame.indexTitle}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <main className="cf-main">
        <h1>
          <VisuallyHidden>
            The Control Frame — {FRAMEWORK.title} {FRAMEWORK.version}, a governance control framework
            in {FRAME_COUNT} frames built around a {CONTROL_COUNT}-control matrix with one
            acknowledged gap. Currently on frame {activeNumber} of {FRAME_COUNT}:{' '}
            {activeFrame.indexTitle}.
          </VisuallyHidden>
        </h1>
        <div className="cf-stage">
          {FRAMES.map((frame, index) => {
            const state =
              index === activeIndex ? 'active' : index === leavingIndex ? 'leaving' : 'parked';
            return (
              <section
                key={frame.id}
                className="cf-frame"
                data-state={state}
                data-frame-id={frame.id}
                aria-hidden={index === activeIndex ? undefined : 'true'}
                inert={index === activeIndex ? undefined : true}
                aria-label={`Frame ${index + 1} of ${FRAME_COUNT}: ${frame.indexTitle}`}
              >
                <FrameBody frame={frame} />
                <div className="cf-print-foot" aria-hidden="true">
                  {FRAMEWORK.title} · {FRAMEWORK.version} · FRAME {String(index + 1).padStart(2, '0')}{' '}
                  / {FRAME_COUNT} · {FRAMEWORK.dataNotice}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <footer className="cf-footer">
        <span className="cf-footer-section" data-testid="frame-section">
          {activeFrame.section}
        </span>
        <span className="cf-footer-notice">{FRAMEWORK.dataNotice}</span>
        <div className="cf-footer-nav">
          <span className="cf-hint">{FRAMEWORK.keyboardHint}</span>
          <button
            type="button"
            className="cf-nav-btn"
            onClick={() => goTo((current) => current - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous frame"
          >
            ←
          </button>
          <button
            type="button"
            className="cf-nav-btn"
            onClick={() => goTo((current) => current + 1)}
            disabled={activeIndex === FRAME_COUNT - 1}
            aria-label="Next frame"
          >
            →
          </button>
        </div>
      </footer>
    </div>
  );
}
