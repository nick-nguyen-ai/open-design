/**
 * "The Specimen Book" — the live full-bleed rendering of
 * `home-research-publication-portfolio`.
 *
 * A researcher's publications set as a type foundry's specimen book. Each paper
 * is a SPECIMEN whose title is set in a different optical cut of the variable
 * house face (opsz / wght / SOFT / WONK / italic axes), with foundry metadata
 * in mono beneath, the abstract as small print, and a "what survived" note. One
 * specimen carries RETRACTED — SEE ERRATUM, set with the same care (the
 * anomaly). The catalogue's ONLY colourless world: ink, near-white, greys — no
 * accent. The citations figure is grey, told apart by line style, not colour.
 *
 * LedgerReveal resolves each specimen in reading order (settle-only, no
 * theatrics); reduced motion keeps the reading order, opacity-only. Art-
 * direction licence: this file and specimen-book.css are the experience-local
 * art layer; motion stays token-driven.
 */
import { useEffect, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { LedgerReveal, useMotionPreference } from '@enterprise-design/motion';
import type { LedgerRevealItem } from '@enterprise-design/motion';
import { VisuallyHidden } from '@enterprise-design/primitives';
import {
  ChartFigure,
  buildTrendChartOption,
  buildTrendChartTable,
} from '@enterprise-design/data-viz';
import type { ChartOption, TrendChartSeriesInput } from '@enterprise-design/data-viz';
import '@fontsource-variable/fraunces/full.css';
import '@fontsource-variable/fraunces/full-italic.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import './specimen-book.css';
import {
  CHROME,
  CITATION_FIGURE,
  CITATION_SERIES,
  PERSON,
  READING_LIST,
  READING_NOTE,
  SERVICE,
  SERVICE_NOTE,
  SPECIMENS,
  STATEMENT,
  STATEMENT_SUBLINE,
  STATUS_LABEL,
} from './content.js';
import type { OpticalCut, Specimen } from './content.js';

type Rec = Record<string, unknown>;

const MONO = "'IBM Plex Mono', ui-monospace, monospace";

/** Ink → grey grades. The colourless palette; series told apart by dash + weight. */
const GREYS = ['#141414', '#6a6a6a', '#a2a2a2'] as const;

function cutStyle(cut: OpticalCut): React.CSSProperties {
  return {
    fontVariationSettings: `'opsz' ${cut.opsz}, 'wght' ${cut.wght}, 'SOFT' ${cut.soft}, 'WONK' ${cut.wonk}`,
    fontStyle: cut.italic ? 'italic' : 'normal',
    letterSpacing: `${cut.tracking}em`,
  };
}

/* ------------------------------------------------------------------ */
/* One specimen                                                        */
/* ------------------------------------------------------------------ */

function SpecimenBlock({ specimen }: { specimen: Specimen }) {
  const retracted = specimen.status === 'RETRACTED';
  return (
    <article
      className={`sb-specimen${retracted ? ' sb-specimen-retracted' : ''}`}
      data-testid={retracted ? 'retracted-specimen' : 'specimen'}
      aria-labelledby={`${specimen.id}-title`}
    >
      <div className="sb-specimen-rule" aria-hidden="true" />
      <p className="sb-specimen-index" aria-hidden="true">
        {specimen.number}
      </p>

      <h3 id={`${specimen.id}-title`} className="sb-specimen-title" style={cutStyle(specimen.cut)}>
        {specimen.title}
      </h3>

      <p className="sb-specimen-meta">
        <span>SPECIMEN {specimen.number}</span>
        <span className="sb-dot" aria-hidden="true">
          ·
        </span>
        <span className={retracted ? 'sb-meta-retracted' : undefined}>
          {STATUS_LABEL[specimen.status]}
        </span>
        <span className="sb-dot" aria-hidden="true">
          ·
        </span>
        <span>CITED {specimen.citations}</span>
        <span className="sb-dot" aria-hidden="true">
          ·
        </span>
        <span>CO-AUTHORS {specimen.coAuthors}</span>
        <span className="sb-dot" aria-hidden="true">
          ·
        </span>
        <span>{specimen.venue}</span>
        <span className="sb-dot" aria-hidden="true">
          ·
        </span>
        <span>{specimen.year}</span>
      </p>

      <p className="sb-specimen-cut" aria-hidden="true">
        set in {specimen.cut.cutName} — opsz {specimen.cut.opsz} · wght {specimen.cut.wght}
        {specimen.cut.soft ? ` · soft ${specimen.cut.soft}` : ''}
        {specimen.cut.wonk ? ' · wonk' : ''}
        {specimen.cut.italic ? ' · italic' : ''}
      </p>

      <p className="sb-specimen-abstract">{specimen.abstract}</p>

      {specimen.erratum ? (
        <p className="sb-erratum" data-testid="erratum">
          {specimen.erratum}
        </p>
      ) : null}

      <p className="sb-survived">
        <span className="sb-survived-label">WHAT SURVIVED</span>
        {specimen.whatSurvived}
      </p>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Citations exhibit — a restrained grey figure                        */
/* ------------------------------------------------------------------ */

function useGreyOption(series: readonly TrendChartSeriesInput[], reduced: boolean): ChartOption {
  return useMemo(() => {
    const base = buildTrendChartOption([...series], {
      colors: [...GREYS],
      unit: CITATION_FIGURE.unit,
      reducedMotion: reduced,
      showAverageLine: false,
    }) as Rec;
    const axisInk = {
      axisLine: { lineStyle: { color: '#c9c9c9' } },
      axisTick: { show: false },
      axisLabel: { color: '#5a5a5a', fontFamily: MONO, fontSize: 10, interval: 0 },
      nameTextStyle: { color: '#5a5a5a', fontFamily: MONO, fontSize: 10 },
    };
    // Distinguish series by dash + weight (never colour): solid heavy, dashed
    // medium, dotted light — mirrors the grey grades.
    const strokes = [
      { type: 'solid', width: 2.6 },
      { type: 'dashed', width: 2 },
      { type: 'dotted', width: 2 },
    ] as const;
    const echSeries = (base.series as Rec[]).map((s, i) => ({
      ...s,
      showSymbol: false,
      symbol: 'none',
      lineStyle: { ...(s.lineStyle as Rec), ...strokes[i % strokes.length], color: GREYS[i % GREYS.length] },
    }));
    return {
      ...base,
      series: echSeries,
      backgroundColor: 'transparent',
      textStyle: { fontFamily: MONO, color: '#5a5a5a' },
      legend: {
        top: 0,
        icon: 'rect',
        itemWidth: 16,
        itemHeight: 2,
        textStyle: { color: '#3a3a3a', fontFamily: MONO, fontSize: 10 },
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#ffffff',
        borderColor: '#c9c9c9',
        textStyle: { color: '#141414', fontFamily: MONO, fontSize: 11 },
      },
      grid: { left: 44, right: 20, top: 44, bottom: 30, containLabel: true },
      xAxis: { ...(base.xAxis as Rec), ...axisInk, splitLine: { show: false } },
      yAxis: {
        ...(base.yAxis as Rec),
        ...axisInk,
        splitLine: { lineStyle: { color: '#ececec' } },
      },
    } as ChartOption;
  }, [series, reduced]);
}

function CitationsExhibit({ reduced }: { reduced: boolean }) {
  const option = useGreyOption(CITATION_SERIES, reduced);
  const table = useMemo(() => buildTrendChartTable([...CITATION_SERIES]), []);
  return (
    <section className="sb-exhibit" aria-labelledby="sb-exhibit-heading">
      <h2 id="sb-exhibit-heading" className="sb-section-heading">
        <span className="sb-heading-no">EXHIBIT A</span>
        Citations over time
      </h2>
      <figure className="sb-figure">
        <ChartFigure
          title={CITATION_FIGURE.title}
          sourceNote={CITATION_FIGURE.source}
          option={option}
          tableColumns={table.columns}
          tableRows={table.rows}
          height={300}
          reducedMotion={reduced}
          className="sb-figure-chart"
        />
        <figcaption className="sb-figure-caption">{CITATION_FIGURE.caption}</figcaption>
      </figure>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Supporting registers                                                */
/* ------------------------------------------------------------------ */

function Colophon() {
  return (
    <section className="sb-colophon" aria-labelledby="sb-colophon-heading">
      <h2 id="sb-colophon-heading" className="sb-section-heading">
        <span className="sb-heading-no">COLOPHON</span>
        Set &amp; printed by
      </h2>
      <div className="sb-colophon-body">
        <p className="sb-colophon-name">
          {PERSON.honorific} {PERSON.name}
        </p>
        <p className="sb-colophon-affil">
          {PERSON.role}, {PERSON.affiliation} · {PERSON.location}
        </p>
        <dl className="sb-colophon-figures">
          <div>
            <dt>H-INDEX</dt>
            <dd>{PERSON.hIndex}</dd>
          </div>
          <div>
            <dt>TOTAL CITATIONS</dt>
            <dd>{PERSON.totalCitations.toLocaleString('en-GB')}</dd>
          </div>
          <div>
            <dt>SPECIMENS</dt>
            <dd>{SPECIMENS.length}</dd>
          </div>
          <div>
            <dt>FIRST SET</dt>
            <dd>{PERSON.firstPublished}</dd>
          </div>
        </dl>
        <p className="sb-colophon-note">
          Figures stated in mono, without ceremony. The h-index is a fact, not an argument.
        </p>
      </div>
    </section>
  );
}

function ServiceRegister() {
  return (
    <section className="sb-service" aria-labelledby="sb-service-heading">
      <h2 id="sb-service-heading" className="sb-section-heading">
        <span className="sb-heading-no">REGISTER I</span>
        Reviewing &amp; service
      </h2>
      <table className="sb-table" data-testid="service-table">
        <caption className="sb-table-caption">{SERVICE_NOTE}</caption>
        <thead>
          <tr>
            <th scope="col">Venue</th>
            <th scope="col">Role</th>
            <th scope="col">Span</th>
            <th scope="col">Detail</th>
          </tr>
        </thead>
        <tbody>
          {SERVICE.map((s) => (
            <tr key={s.id}>
              <th scope="row">{s.venue}</th>
              <td>{s.role}</td>
              <td>{s.span}</td>
              <td>{s.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function ReadingList() {
  return (
    <section className="sb-reading" aria-labelledby="sb-reading-heading">
      <h2 id="sb-reading-heading" className="sb-section-heading">
        <span className="sb-heading-no">REGISTER II</span>
        What I wish I had written
      </h2>
      <p className="sb-reading-note">{READING_NOTE}</p>
      <ol className="sb-reading-list">
        {READING_LIST.map((r) => (
          <li key={r.id} className="sb-reading-item">
            <p className="sb-reading-cite">
              <span className="sb-reading-authors">{r.authors}</span>
              <span className="sb-reading-title">{r.title}</span>
              <span className="sb-reading-venue">
                {r.venue} · {r.year}
              </span>
            </p>
            <p className="sb-reading-why">{r.why}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The page                                                            */
/* ------------------------------------------------------------------ */

export default function SpecimenBookPage() {
  const { reduced } = useMotionPreference();

  useEffect(() => {
    document.title = 'The Specimen Book — Dr Imani Okafor — Live';
  }, []);

  const specimenItems = useMemo<LedgerRevealItem[]>(
    () => SPECIMENS.map((s) => ({ id: s.id, content: <SpecimenBlock specimen={s} /> })),
    [],
  );

  return (
    <div className="sb-root" data-testid="live-specimen-book" data-reduced={reduced ? 'true' : undefined}>
      <header className="sb-chrome" aria-label="The Specimen Book chrome">
        <div className="sb-chrome-cell">
          <RouterLink to="/" className="sb-back">
            ◄ GALLERY
          </RouterLink>
          <span className="sb-chrome-rule" aria-hidden="true" />
          <span>{CHROME.world}</span>
        </div>
        <div className="sb-chrome-cell">
          <span>{CHROME.edition}</span>
          <span className="sb-chrome-rule" aria-hidden="true" />
          <span className="sb-synthetic" data-testid="synthetic-mark">
            {CHROME.synthetic}
          </span>
        </div>
      </header>

      <main className="sb-main">
        <section className="sb-hero" aria-labelledby="sb-statement">
          <p className="sb-kicker">THE SPECIMEN BOOK</p>
          <h1 id="sb-statement" className="sb-display">
            {STATEMENT.map((line, i) => (
              <span key={i} className="sb-display-line">
                {line}
              </span>
            ))}
          </h1>
          <p className="sb-identity">
            {PERSON.honorific.toUpperCase()} {PERSON.name.toUpperCase()} · {PERSON.role.toUpperCase()}{' '}
            · {PERSON.affiliation.toUpperCase()}
          </p>
          <p className="sb-subline">{STATEMENT_SUBLINE}</p>
          <VisuallyHidden>
            This entire profile is illustrative and synthetic — a demonstration person, not a real
            researcher. Papers, venues, citation counts and figures are sample content.
          </VisuallyHidden>
        </section>

        <section className="sb-specimens" aria-labelledby="sb-specimens-heading">
          <h2 id="sb-specimens-heading" className="sb-section-heading sb-section-heading-major">
            <span className="sb-heading-no">THE SPECIMENS</span>
            Seven papers, seven cuts of the face
          </h2>
          <LedgerReveal className="sb-specimen-stack" items={specimenItems} />
        </section>

        <CitationsExhibit reduced={reduced} />
        <Colophon />
        <ServiceRegister />
        <ReadingList />
      </main>

      <footer className="sb-footer">
        <span>{CHROME.synthetic} · SAMPLE CONTENT IS MARKED AS SUCH</span>
        <span>SET IN THE HOUSE FACE · ONE COLOUR: INK</span>
      </footer>
    </div>
  );
}
