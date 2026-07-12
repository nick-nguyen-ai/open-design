/**
 * "The Field Manual" — the live full-bleed rendering of
 * `deck-technical-training`.
 *
 * Internal training as a beloved technical field manual — aviation-ops-manual
 * aesthetic: utilitarian paper, olive and graphite inks, safety-orange for
 * warnings ONLY. Pages are PROCEDURES (numbered steps left, DO/DON'T plates
 * right — DON'Ts struck through), machinery-label warning callouts, a mid-deck
 * CHECKPOINT self-test with answers overleaf (flipped treatment), a tools
 * plate drawn as a kit cutout, and a sign-off page with a competency register.
 * The anomaly: PROC 3.2 step 4 is stamped REVISED AFTER INCIDENT IR-2214 with
 * a terse margin note — the manual visibly learns. Procedures cite the Control
 * Frame's control ids where they enforce one.
 *
 * Keyboard-driven (←/→/Home/End, C jumps to the checkpoint), `?slide=`
 * deep-linkable, printable one page per page.
 *
 * Art-direction licence (task 17): this file and field-manual.css are the
 * experience-local art layer — raw colour values are permitted HERE. Motion
 * easings/durations stay token-driven.
 */
import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import { VisuallyHidden } from '@enterprise-design/primitives';
import '@fontsource-variable/inter';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import '@fontsource/ibm-plex-mono/700.css';
import './field-manual.css';
import { useDeckNavigation } from '../_deck-kit/useDeckNavigation.js';
import { CHECKPOINT_NUMBER, MANUAL, SLIDES, SLIDE_COUNT } from './content.js';
import type { DoDontPlate, ProcedureSlide, Slide } from './content.js';

/* ---------------------------------------------------------------- */
/* Build wrapper                                                     */
/* ---------------------------------------------------------------- */

function Build({
  i,
  children,
  className,
  as: Tag = 'div',
  ...rest
}: {
  i: number;
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'li';
} & Record<string, unknown>) {
  return (
    <Tag
      className={className ? `fm-build ${className}` : 'fm-build'}
      style={{ ['--fm-i' as string]: i }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ---------------------------------------------------------------- */
/* DO / DON'T plates                                                 */
/* ---------------------------------------------------------------- */

function PlateDiagram({ plate }: { plate: DoDontPlate }) {
  // A minimal machinery diagram: two blocks and a coupling. The DON'T variant
  // is struck through corner to corner, the way a manual crosses out a wrong
  // rigging. Shape carries the meaning; colour never alone.
  return (
    <svg viewBox="0 0 220 96" role="presentation" aria-hidden="true" className="fm-plate-svg">
      <rect x="14" y="30" width="70" height="36" className="fm-plate-block" />
      <rect x="136" y="30" width="70" height="36" className="fm-plate-block" />
      <line x1="84" y1="48" x2="136" y2="48" className="fm-plate-link" />
      <circle cx="110" cy="48" r="7" className="fm-plate-pin" />
      {plate.kind === 'dont' ? (
        <>
          <line x1="10" y1="8" x2="210" y2="88" className="fm-plate-strike" />
          <line x1="210" y1="8" x2="10" y2="88" className="fm-plate-strike" />
        </>
      ) : null}
    </svg>
  );
}

function Plates({ plates, baseIndex }: { plates: readonly DoDontPlate[]; baseIndex: number }) {
  return (
    <div className="fm-plates">
      {plates.map((plate, i) => (
        <Build key={plate.title} i={baseIndex + i} className="fm-plate" {...{ 'data-kind': plate.kind }}>
          <span className="fm-plate-head" data-kind={plate.kind}>
            {plate.kind === 'do' ? '✓ DO' : '✕ DON’T'}
          </span>
          <PlateDiagram plate={plate} />
          <span className="fm-plate-title">{plate.title}</span>
          <span className="fm-plate-line">{plate.line}</span>
        </Build>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Procedure page                                                    */
/* ---------------------------------------------------------------- */

function ProcedureBody({ slide }: { slide: ProcedureSlide }) {
  return (
    <div className="fm-body fm-body-proc">
      <Build i={0} className="fm-proc-head">
        <span className="fm-proc-no">{slide.procNo}</span>
        <h2 className="fm-proc-title">{slide.title}</h2>
      </Build>
      <Build i={1}>
        <p className="fm-objective">
          <span className="fm-objective-tag">OBJECTIVE</span>
          {slide.objective}
        </p>
      </Build>
      <div className="fm-proc-grid">
        <ol className="fm-steps">
          {slide.steps.map((step, i) => (
            <Build
              key={step.no}
              i={i + 2}
              as="li"
              className={step.revised ? 'fm-step fm-step-revised' : 'fm-step'}
              {...(step.revised ? { 'data-testid': 'revised-step' } : {})}
            >
              <span className="fm-step-no">{step.no}</span>
              <span className="fm-step-body">
                <span className="fm-step-text">{step.text}</span>
                {step.tag ? <span className="fm-step-tag">{step.tag}</span> : null}
                {step.revised ? (
                  <span className="fm-revision">
                    <span className="fm-revision-stamp">REVISED AFTER INCIDENT {step.revised.incident}</span>
                    <span className="fm-revision-note">{step.revised.marginNote}</span>
                  </span>
                ) : null}
              </span>
            </Build>
          ))}
        </ol>
        <div className="fm-proc-right">
          <Plates plates={slide.plates} baseIndex={slide.steps.length + 2} />
          {slide.warning ? (
            <Build i={slide.steps.length + slide.plates.length + 2}>
              <p className="fm-warning" data-testid={`warning-${slide.id}`}>
                <span className="fm-warning-glyph" aria-hidden="true">
                  ⚠
                </span>
                {slide.warning.text}
              </p>
            </Build>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Slide bodies                                                      */
/* ---------------------------------------------------------------- */

function SlideBody({ slide }: { slide: Slide }) {
  switch (slide.kind) {
    case 'cover':
      return (
        <div className="fm-body fm-body-cover">
          <Build i={0} className="fm-cover-plate">
            <span className="fm-cover-code">{MANUAL.code}</span>
            <span className="fm-cover-title">{MANUAL.title}</span>
          </Build>
          <h2 className="fm-display">
            {slide.lines.map((line, i) => (
              <Build key={i} i={i + 1}>
                <span className="fm-line">{line}</span>
              </Build>
            ))}
          </h2>
          <Build i={slide.lines.length + 1}>
            <div className="fm-meta">
              {slide.meta.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </Build>
          {/* Stencil-stamped unit mark — the cover's counterweight */}
          <Build i={slide.lines.length + 2} className="fm-unit-stamp-wrap">
            <span className="fm-unit-stamp">
              <span className="fm-unit-stamp-word">UNIT</span>
              <span className="fm-unit-stamp-no">03</span>
              <span className="fm-unit-stamp-line">MOVING MODELS SAFELY</span>
            </span>
          </Build>
        </div>
      );

    case 'contents':
      return (
        <div className="fm-body fm-body-contents">
          <Build i={0}>
            <h2 className="fm-page-heading">CONTENTS · {MANUAL.unit}</h2>
          </Build>
          <Build i={1}>
            <p className="fm-intro">{slide.intro}</p>
          </Build>
          <ol className="fm-register" data-testid="procedure-register">
            {SLIDES.map((s, i) => (
              <Build key={s.id} i={i + 2} as="li" className="fm-register-row" {...{ 'data-anomaly': s.id === 'proc-3-2' ? 'true' : undefined }}>
                <span className="fm-register-no">{String(i + 1).padStart(2, '0')}</span>
                <span className="fm-register-title">{s.registerTitle}</span>
                <span className="fm-register-dots" aria-hidden="true" />
                <span className="fm-register-sec">{s.section}</span>
              </Build>
            ))}
          </ol>
          <Build i={SLIDES.length + 2}>
            <p className="fm-crossref">{MANUAL.crossRef}</p>
          </Build>
        </div>
      );

    case 'procedure':
      return <ProcedureBody slide={slide} />;

    case 'checkpoint':
      return (
        <div className="fm-body fm-body-checkpoint">
          <Build i={0} className="fm-proc-head">
            <span className="fm-proc-no">STOP</span>
            <h2 className="fm-proc-title">{slide.title}</h2>
          </Build>
          <Build i={1}>
            <p className="fm-intro fm-intro-wide">{slide.instruction}</p>
          </Build>
          <ol className="fm-questions" data-testid="checkpoint-list">
            {slide.questions.map((q, i) => (
              <Build key={q.no} i={i + 2} as="li" className="fm-question">
                <span className="fm-check-box" aria-hidden="true" />
                <span className="fm-question-no">{q.no}</span>
                <span className="fm-question-text">{q.q}</span>
              </Build>
            ))}
          </ol>
          <Build i={slide.questions.length + 2}>
            <p className="fm-overleaf">ANSWERS OVERLEAF — DO NOT TURN UNTIL ALL FOUR ARE ANSWERED ALOUD</p>
          </Build>
        </div>
      );

    case 'answers':
      return (
        <div className="fm-body fm-body-answers">
          <Build i={0} className="fm-proc-head">
            <span className="fm-proc-no fm-proc-no-flip">KEY</span>
            <h2 className="fm-proc-title">{slide.title}</h2>
          </Build>
          <ol className="fm-answers">
            {slide.answers.map((a, i) => (
              <Build key={a.no} i={i + 1} as="li" className="fm-answer">
                <span className="fm-question-no">{a.no}</span>
                <span className="fm-answer-text">{a.a}</span>
              </Build>
            ))}
          </ol>
          <Build i={slide.answers.length + 1}>
            <p className="fm-overleaf">ANY MISS → RE-READ THE CITED PROCEDURE BEFORE PROC 3.3</p>
          </Build>
        </div>
      );

    case 'tools':
      return (
        <div className="fm-body fm-body-tools">
          <Build i={0} className="fm-proc-head">
            <span className="fm-proc-no">KIT</span>
            <h2 className="fm-proc-title">{slide.title}</h2>
          </Build>
          <Build i={1}>
            <p className="fm-intro fm-intro-wide">{slide.intro}</p>
          </Build>
          <ul className="fm-kit" data-testid="tools-plate">
            {slide.tools.map((t, i) => (
              <Build key={t.slot} i={i + 2} as="li" className="fm-tool">
                <span className="fm-tool-slot">{t.slot}</span>
                <span className="fm-tool-name">{t.name}</span>
                <span className="fm-tool-purpose">{t.purpose}</span>
                <span className="fm-tool-approved">APPROVED {t.approved}</span>
              </Build>
            ))}
          </ul>
        </div>
      );

    case 'signoff':
      return (
        <div className="fm-body fm-body-signoff">
          <Build i={0} className="fm-proc-head">
            <span className="fm-proc-no">SIGN</span>
            <h2 className="fm-proc-title">{slide.title}</h2>
          </Build>
          <ol className="fm-competencies">
            {slide.competencies.map((c, i) => (
              <Build key={c.id} i={i + 1} as="li" className="fm-competency">
                <span className="fm-check-box" aria-hidden="true" />
                <span className="fm-competency-id">{c.id}</span>
                <span className="fm-competency-text">{c.text}</span>
              </Build>
            ))}
          </ol>
          <div className="fm-signature-block">
            {slide.lines.map((line, li) => (
              <Build key={line.role} i={slide.competencies.length + 1 + li} className="fm-signature-row">
                <span className="fm-signature-role">{line.role}</span>
                {line.fields.map((f) => (
                  <span key={f} className="fm-signature-field">
                    <span className="fm-signature-rule" aria-hidden="true" />
                    <span className="fm-signature-label">{f}</span>
                  </span>
                ))}
              </Build>
            ))}
          </div>
          <Build i={slide.competencies.length + slide.lines.length + 1}>
            <p className="fm-crossref">
              REGISTER FILED WITH PLATFORM TRAINING · {MANUAL.code} · {MANUAL.revision} · {MANUAL.dataNotice}
            </p>
          </Build>
        </div>
      );
  }
}

/* ---------------------------------------------------------------- */
/* The manual                                                        */
/* ---------------------------------------------------------------- */

export default function FieldManualPage() {
  const { reduced } = useMotionPreference();
  const { activeIndex, activeNumber, leavingIndex, goTo, counter } = useDeckNavigation(SLIDE_COUNT, {
    reduced,
  });
  const activeSlide = SLIDES[activeIndex] as Slide;

  useEffect(() => {
    document.title = 'The Field Manual — Model Operations Unit 3 — Live';
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.key === 'c' || event.key === 'C') goTo(CHECKPOINT_NUMBER);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo]);

  return (
    <div className="fm-root" data-testid="live-field-manual" data-reduced={reduced ? 'true' : undefined}>
      <header className="fm-chrome" aria-label="Manual chrome">
        <div className="fm-chrome-cell">
          <RouterLink to="/" className="fm-back">
            ◄ GALLERY
          </RouterLink>
          <span className="fm-chrome-rule" aria-hidden="true" />
          <span>
            {MANUAL.code} · {MANUAL.revision}
          </span>
        </div>
        <div className="fm-chrome-cell">
          <span data-testid="page-counter" aria-live="polite">
            {counter} · {activeSlide.section}
          </span>
          <span className="fm-chrome-rule" aria-hidden="true" />
          <span className="fm-chrome-notice">{MANUAL.dataNotice}</span>
        </div>
      </header>

      <main className="fm-main">
        <h1>
          <VisuallyHidden>
            The Field Manual — {MANUAL.title}, {MANUAL.unit}: internal technical training set as a
            {SLIDE_COUNT}-page field manual with three procedures, a checkpoint self-test with
            answers overleaf, an approved-toolchain kit plate and a competency sign-off. PROC 3.2
            step 4 is revised after incident IR-2214 — the manual visibly learns. Currently on page{' '}
            {activeNumber} of {SLIDE_COUNT}: {activeSlide.registerTitle}.
          </VisuallyHidden>
        </h1>
        <div className="fm-stage">
          {SLIDES.map((slide, index) => {
            const state =
              index === activeIndex ? 'active' : index === leavingIndex ? 'leaving' : 'parked';
            return (
              <section
                key={slide.id}
                className="fm-page"
                data-state={state}
                data-page-id={slide.id}
                data-kind={slide.kind}
                data-flip={slide.kind === 'answers' ? 'true' : undefined}
                aria-hidden={index === activeIndex ? undefined : 'true'}
                inert={index === activeIndex ? undefined : true}
                aria-label={`Page ${index + 1} of ${SLIDE_COUNT}: ${slide.registerTitle}`}
              >
                <SlideBody slide={slide} />
                <div className="fm-print-foot" aria-hidden="true">
                  {MANUAL.code} · {MANUAL.revision} · PAGE {String(index + 1).padStart(2, '0')} /{' '}
                  {SLIDE_COUNT} · {MANUAL.dataNotice}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <footer className="fm-footer">
        <span className="fm-footer-code">
          {MANUAL.code} · {String(activeIndex + 1).padStart(2, '0')}–{String(SLIDE_COUNT).padStart(2, '0')} ·{' '}
          {MANUAL.unit}
        </span>
        <div className="fm-footer-nav">
          <span className="fm-hint">{MANUAL.keyboardHint}</span>
          <button
            type="button"
            className="fm-nav-btn"
            onClick={() => goTo((current) => current - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous page"
          >
            ←
          </button>
          <button
            type="button"
            className="fm-nav-btn"
            onClick={() => goTo((current) => current + 1)}
            disabled={activeIndex === SLIDE_COUNT - 1}
            aria-label="Next page"
          >
            →
          </button>
        </div>
      </footer>
    </div>
  );
}
