/**
 * "The Committee Paper" — the live full-bleed rendering of
 * `deck-executive-decision-proposal`.
 *
 * A formal credit-committee paper that learned to present itself. Ivory laid
 * paper, ink-dark serif, one wax-seal red reserved for the decision. Ten
 * sheets — a cover and nine numbered CLAUSES — argued the way a bank decides:
 * the recommendation first, the reasoning after. Keyboard-driven (←/→/Home/
 * End), `?slide=` deep-linkable, printable one sheet per page.
 *
 * Art-direction licence (task 13/15): this file and paper.css are the
 * experience-local art layer — raw colour values are permitted HERE. Motion
 * easings/durations stay token-driven (var(--ease-*), var(--dur-*));
 * reduced motion collapses page-turns to stepped opacity.
 */
import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import {
  ChartFigure,
  buildTrendChartOption,
  buildTrendChartTable,
} from '@enterprise-design/data-viz';
import type { ChartOption } from '@enterprise-design/data-viz';
import { VisuallyHidden } from '@enterprise-design/primitives';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import { useDeckNavigation } from '../_deck-kit/useDeckNavigation.js';
import './paper.css';
import { PAPER, SHEETS, SHEET_COUNT, EVIDENCE_SERIES, FIG } from './content.js';
import type { Sheet } from './content.js';

const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const INK = {
  ink: '#211d16',
  sepia: '#6d6353',
  muted: '#8f8571',
  rule: 'rgba(33, 29, 22, 0.16)',
  ruleFaint: 'rgba(33, 29, 22, 0.09)',
} as const;

type Rec = Record<string, unknown>;

/** Two ink tones only — the wax red stays sacred to the decision. */
function useEvidenceOption(reduced: boolean): ChartOption {
  return useMemo(() => {
    const base = buildTrendChartOption([...EVIDENCE_SERIES], {
      colors: [INK.muted, INK.ink],
      unit: 'A$m',
      reducedMotion: reduced,
      showAverageLine: false,
    }) as Rec;
    const axisInk = {
      axisLine: { lineStyle: { color: INK.rule } },
      axisTick: { show: false },
      axisLabel: { color: INK.sepia, fontFamily: MONO, fontSize: 11 },
      nameTextStyle: { color: INK.sepia, fontFamily: MONO },
    };
    const series = (base.series as Rec[]).map((s) => ({
      ...s,
      symbolSize: 7,
      label: {
        show: true,
        position: s.id === 'deferral' ? 'top' : 'bottom',
        color: s.id === 'deferral' ? INK.ink : INK.sepia,
        fontFamily: MONO,
        fontSize: 11,
        // Suppress the crowded first-quarter labels (the two series sit close
        // there); every later point stays labelled.
        formatter: (p: { dataIndex: number; value: number }) =>
          p.dataIndex === 0 ? '' : String(p.value),
      },
      ...(s.id === 'deferral'
        ? { lineStyle: { ...(s.lineStyle as Rec), width: 2.25, type: 'solid' } }
        : { lineStyle: { ...(s.lineStyle as Rec), width: 1.5, type: 'dashed' } }),
    }));
    return {
      ...base,
      series,
      backgroundColor: 'transparent',
      textStyle: { fontFamily: MONO, color: INK.sepia },
      legend: {
        top: 0,
        icon: 'rect',
        itemWidth: 14,
        itemHeight: 2,
        itemGap: 28,
        textStyle: { color: INK.ink, fontFamily: MONO, fontSize: 11 },
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#f4ecda',
        borderColor: INK.rule,
        textStyle: { color: INK.ink, fontFamily: MONO, fontSize: 11 },
      },
      grid: { left: 52, right: 20, top: 44, bottom: 30 },
      xAxis: { ...(base.xAxis as Rec), ...axisInk, splitLine: { show: false } },
      yAxis: {
        ...(base.yAxis as Rec),
        ...axisInk,
        splitLine: { lineStyle: { color: INK.ruleFaint } },
      },
    } as ChartOption;
  }, [reduced]);
}

/* ---------------------------------------------------------------- */
/* Build wrapper — one clause paragraph settles at a time.           */
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
  as?: 'div' | 'li' | 'tr';
}) {
  return (
    <Tag
      className={className ? `cp-build ${className}` : 'cp-build'}
      style={{ ['--cp-i' as string]: i }}
    >
      {children}
    </Tag>
  );
}

/* ---------------------------------------------------------------- */
/* Sheet bodies                                                      */
/* ---------------------------------------------------------------- */

function SheetBody({
  sheet,
  reduced,
  chartActive,
}: {
  sheet: Sheet;
  reduced: boolean;
  chartActive: boolean;
}) {
  const evidenceOption = useEvidenceOption(reduced);
  const evidenceTable = useMemo(() => buildTrendChartTable([...EVIDENCE_SERIES]), []);

  switch (sheet.kind) {
    case 'cover':
      return (
        <div className="cp-body cp-body-cover">
          <WaxSeal />
          <Build i={0}>
            <p className="cp-eyebrow">
              {PAPER.ref} · {PAPER.classification}
            </p>
          </Build>
          <h2 className="cp-display cp-display-cover">
            {sheet.subjectLines.map((line, i) => (
              <Build key={i} i={i + 1}>
                <span className="cp-line">{line}</span>
              </Build>
            ))}
          </h2>
          <Build i={sheet.subjectLines.length + 1}>
            <p className="cp-thesis">{sheet.thesis}</p>
          </Build>
          <Build i={sheet.subjectLines.length + 2}>
            <div className="cp-front-meta">
              {sheet.meta.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </Build>
        </div>
      );

    case 'recommendation':
      return (
        <div className="cp-body">
          <ClauseHead sheet={sheet} />
          <Build i={2}>
            <p className="cp-lead">{sheet.lead}</p>
          </Build>
          <Build i={3}>
            <p className="cp-recommended">
              <span className="cp-wax">RECOMMENDED</span> {sheet.recommended}
            </p>
          </Build>
          <dl className="cp-terms">
            {sheet.terms.map((term, i) => (
              <Build key={term.label} i={i + 4} className="cp-term">
                <dt>{term.label}</dt>
                <dd>{term.value}</dd>
              </Build>
            ))}
          </dl>
          <Build i={sheet.terms.length + 4}>
            <p className="cp-standfirst cp-standfirst-quiet">{sheet.standfirst}</p>
          </Build>
        </div>
      );

    case 'prose':
      return (
        <div className="cp-body">
          <ClauseHead sheet={sheet} />
          <div className="cp-prose-grid">
            <div className="cp-prose">
              {sheet.paragraphs.map((p, i) => (
                <Build key={i} i={i + 2}>
                  <p className="cp-para">{p}</p>
                </Build>
              ))}
            </div>
            {sheet.marginNotes ? (
              <aside className="cp-margin" aria-label="Marginal cross-references">
                {sheet.marginNotes.map((m, i) => (
                  <Build key={m.ref} i={i + 3} className="cp-margin-note">
                    <span className="cp-margin-ref">{m.ref}</span>
                    <span className="cp-margin-text">{m.note}</span>
                  </Build>
                ))}
              </aside>
            ) : null}
          </div>
          {sheet.pull ? (
            <Build i={sheet.paragraphs.length + 3}>
              <blockquote className="cp-pull">{sheet.pull}</blockquote>
            </Build>
          ) : null}
        </div>
      );

    case 'options':
      return (
        <div className="cp-body">
          <ClauseHead sheet={sheet} />
          <Build i={2}>
            <p className="cp-standfirst">{sheet.standfirst}</p>
          </Build>
          <Build i={3}>
            <table className="cp-options" data-testid="options-table">
              <caption className="cp-sr">
                Options considered for the SBL-DE/2 adoption decision. Option 4, the deferral,
                is struck: declined by the Model Risk function.
              </caption>
              <thead>
                <tr>
                  {sheet.columns.map((c, i) => (
                    <th key={i} scope="col" className={i === 0 ? 'cp-opt-ref' : undefined}>
                      {c || <VisuallyHidden>Option reference</VisuallyHidden>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sheet.rows.map((row) => (
                  <tr
                    key={row.ref}
                    data-struck={row.struck ? 'true' : undefined}
                    data-recommended={row.recommended ? 'true' : undefined}
                  >
                    <td className="cp-opt-ref">{row.ref}</td>
                    <th scope="row" className="cp-opt-name">
                      {row.option}
                      {row.struck ? <span className="cp-sr"> — struck, declined by Model Risk</span> : null}
                    </th>
                    <td className="cp-opt-cost">{row.cost}</td>
                    <td className="cp-opt-verdict">
                      {row.recommended ? <span className="cp-wax">{row.verdict}</span> : row.verdict}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Build>
          <Build i={4}>
            <p className="cp-footnote">{sheet.footnote}</p>
          </Build>
        </div>
      );

    case 'envelope':
      return (
        <div className="cp-body">
          <ClauseHead sheet={sheet} />
          <div className="cp-envelope-grid">
            <div className="cp-envelope-side">
              <Build i={2}>
                <p className="cp-figure">{sheet.figure}</p>
              </Build>
              <Build i={3}>
                <p className="cp-figure-note">{sheet.figureNote}</p>
              </Build>
              <Build i={4}>
                <p className="cp-standfirst cp-standfirst-quiet">{sheet.standfirst}</p>
              </Build>
            </div>
            <Build i={3} className="cp-chart-wrap">
              <ChartFigure
                key={chartActive ? 'entered' : 'parked'}
                title={FIG.title}
                sourceNote={FIG.source}
                option={evidenceOption}
                tableColumns={evidenceTable.columns}
                tableRows={evidenceTable.rows}
                height={340}
                reducedMotion={reduced}
                className="cp-chart"
              />
            </Build>
          </div>
        </div>
      );

    case 'conditions':
      return (
        <div className="cp-body">
          <ClauseHead sheet={sheet} />
          <Build i={2}>
            <p className="cp-standfirst">{sheet.standfirst}</p>
          </Build>
          <ol className="cp-conditions">
            {sheet.conditions.map((c, i) => (
              <Build key={c.ref} i={i + 3} as="li" className="cp-condition">
                <span className="cp-condition-ref">{c.ref}</span>
                <span className="cp-condition-text">{c.text}</span>
              </Build>
            ))}
          </ol>
        </div>
      );

    case 'resolution':
      return (
        <div className="cp-body cp-body-resolution">
          <WaxSeal small />
          <ClauseHead sheet={sheet} />
          <Build i={2}>
            <p className="cp-resolution-ref">{sheet.resolutionRef}</p>
          </Build>
          <Build i={3}>
            <p className="cp-resolution-text">{sheet.resolutionText}</p>
          </Build>
          <Build i={4}>
            <ul className="cp-checkboxes" aria-label="Decision to be minuted">
              {sheet.options.map((opt) => (
                <li key={opt} className={opt === 'CARRIED' ? 'cp-checkbox cp-checkbox-carry' : 'cp-checkbox'}>
                  <span aria-hidden="true" className="cp-box" />
                  <span>{opt}</span>
                </li>
              ))}
            </ul>
          </Build>
          <dl className="cp-signatories">
            {sheet.signatories.map((s, i) => (
              <Build key={s.role} i={i + 5} className="cp-signatory">
                <dt>{s.role}</dt>
                <dd>
                  <span className="cp-sign-rule" aria-hidden="true" />
                  <span className="cp-sign-name">{s.name}</span>
                  <span className="cp-sign-line">{s.line}</span>
                </dd>
              </Build>
            ))}
          </dl>
          <Build i={sheet.signatories.length + 5}>
            <p className="cp-minute">{sheet.minute}</p>
          </Build>
        </div>
      );
  }
}

/**
 * The bespoke commanding mark: a wax-seal, CSS-drawn. Decorative — its words
 * ("FOR DECISION", the committee monogram) are all present as real text
 * elsewhere on the sheet, so it carries no information a screen reader lacks.
 */
const SEAL_RING = '·  FOR  DECISION  ·  GROUP  MODEL  RISK  COMMITTEE  ';

function WaxSeal({ small }: { small?: boolean }) {
  const chars = [...SEAL_RING];
  const step = 360 / chars.length;
  return (
    <div className={small ? 'cp-seal cp-seal-small' : 'cp-seal'} aria-hidden="true">
      <span className="cp-seal-ring">
        {chars.map((ch, i) => (
          <i key={i} style={{ transform: `rotate(${(i * step).toFixed(2)}deg)` }}>
            {ch}
          </i>
        ))}
      </span>
      <span className="cp-seal-star" aria-hidden="true">
        ✶
      </span>
      <span className="cp-seal-mono">MRC</span>
    </div>
  );
}

function ClauseHead({ sheet }: { sheet: Extract<Sheet, { clause: number }> }) {
  return (
    <Build i={0}>
      <p className="cp-clause-head">
        <span aria-hidden="true" className="cp-clause-no">
          {String(sheet.clause).padStart(2, '0')}
        </span>
        <span className="cp-clause-title">{sheet.heading}</span>
      </p>
    </Build>
  );
}

/* ---------------------------------------------------------------- */
/* The paper                                                         */
/* ---------------------------------------------------------------- */

export default function CommitteePaperPage() {
  const { reduced } = useMotionPreference();
  const { activeIndex, activeNumber, leavingIndex, goTo, counter } = useDeckNavigation(SHEET_COUNT, {
    reduced,
  });
  const [contentsOpen, setContentsOpen] = useState(false);
  const activeSheet = SHEETS[activeIndex] as Sheet;

  useEffect(() => {
    document.title = 'The Committee Paper — Model Risk Committee, Paper 2027-041 — Live';
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.key === 'c' || event.key === 'C') setContentsOpen((open) => !open);
      if (event.key === 'Escape') setContentsOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const clauseChrome =
    activeSheet.clause === null
      ? `FRONT MATTER · ${PAPER.ref} · ${PAPER.classification}`
      : `CLAUSE ${activeSheet.clause} OF ${PAPER.clauseCount} · ${PAPER.ref} · ${PAPER.classification}`;

  return (
    <div className="cp-root" data-testid="live-committee-paper" data-reduced={reduced ? 'true' : undefined}>
      <header className="cp-chrome" aria-label="Paper chrome">
        <div className="cp-chrome-cell">
          <RouterLink to="/" className="cp-back">
            ◄ GALLERY
          </RouterLink>
          <span className="cp-chrome-rule" aria-hidden="true" />
          <span>{PAPER.committee}</span>
        </div>
        <div className="cp-chrome-cell">
          <span data-testid="clause-counter" aria-live="polite">
            {counter} · {clauseChrome}
          </span>
          <span className="cp-chrome-rule" aria-hidden="true" />
          <button
            type="button"
            className="cp-contents-toggle"
            aria-expanded={contentsOpen}
            aria-controls="cp-contents"
            onClick={() => setContentsOpen((open) => !open)}
          >
            CONTENTS
          </button>
        </div>
      </header>

      <nav
        id="cp-contents"
        className="cp-contents"
        aria-label="Contents of the paper"
        data-open={contentsOpen ? 'true' : undefined}
        hidden={!contentsOpen}
      >
        <p className="cp-contents-heading">
          {PAPER.ref} · {PAPER.clauseCount} CLAUSES
        </p>
        <ol className="cp-contents-list">
          {SHEETS.map((sheet, index) => (
            <li key={sheet.id}>
              <button
                type="button"
                aria-current={index === activeIndex ? 'true' : undefined}
                onClick={() => {
                  goTo(index + 1);
                  setContentsOpen(false);
                }}
              >
                <span className="cp-contents-no">{String(index + 1).padStart(2, '0')}</span>
                <span>{sheet.contentsTitle}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <main className="cp-main">
        <h1>
          <VisuallyHidden>
            The Committee Paper — {PAPER.ref}, a decision paper before the {PAPER.committee}, in a
            cover and {PAPER.clauseCount} clauses. Currently on sheet {activeNumber} of {SHEET_COUNT}:{' '}
            {activeSheet.contentsTitle}.
          </VisuallyHidden>
        </h1>
        <div className="cp-stage">
          {SHEETS.map((sheet, index) => {
            const state =
              index === activeIndex ? 'active' : index === leavingIndex ? 'leaving' : 'parked';
            return (
              <section
                key={sheet.id}
                className="cp-sheet"
                data-state={state}
                data-sheet-id={sheet.id}
                aria-hidden={index === activeIndex ? undefined : 'true'}
                inert={index === activeIndex ? undefined : true}
                aria-label={`Sheet ${index + 1} of ${SHEET_COUNT}: ${sheet.contentsTitle}`}
              >
                <SheetBody
                  sheet={sheet}
                  reduced={reduced}
                  chartActive={activeSheet.kind === 'envelope'}
                />
                <div className="cp-print-foot" aria-hidden="true">
                  {PAPER.ref} · SHEET {String(index + 1).padStart(2, '0')} / {SHEET_COUNT} ·{' '}
                  {PAPER.dataNotice}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <footer className="cp-footer">
        <span className="cp-footer-section" data-testid="paper-section">
          {activeSheet.section}
        </span>
        <span className="cp-footer-notice">{PAPER.dataNotice}</span>
        <div className="cp-footer-nav">
          <span className="cp-hint">{PAPER.keyboardHint}</span>
          <button
            type="button"
            className="cp-nav-btn"
            onClick={() => goTo((current) => current - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous sheet"
          >
            ←
          </button>
          <button
            type="button"
            className="cp-nav-btn"
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
