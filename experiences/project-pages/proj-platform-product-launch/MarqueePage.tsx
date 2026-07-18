/**
 * "The Marquee" — the live full-bleed rendering of
 * `proj-platform-product-launch`.
 *
 * Opening night: the launch statement in marquee-scale type inside a
 * bulb-lit frame, and behind the curtain the three-act programme, the
 * workstream call sheet, and the house readiness checklist. Grammar:
 * monumental-type; signature: horizon-sweep (the follow-spot crosses the
 * marquee on arrival); motion level 2; locked dark, low density.
 *
 * Art-direction licence: this file and marquee.css are the experience-local
 * art layer — raw colour values are permitted HERE only.
 *
 * `data-part-id` values are a PUBLIC BORROW CONTRACT (surfaced by the gallery's
 * part inspector, consumed by the open-design skill): never rename or remove
 * one without updating LivePartIds.test.tsx.
 */
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource-variable/inter/index.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './marquee.css';
import { ACTS, CALL_SHEET, FOOT, HOUSE, NOTICES, SHOW } from './content.js';

const STATUS_LABEL = { ready: 'READY', rehearsing: 'REHEARSING', attention: 'ATTENTION' } as const;

export default function MarqueePage() {
  const { reduced } = useMotionPreference();
  const litCount = HOUSE.items.filter((item) => item.done).length;

  return (
    <div className="mq-root" data-testid="live-marquee" data-reduced={reduced ? 'true' : undefined}>
      <header className="mq-chrome" data-part-id="proj-platform-product-launch/chrome">
        <div className="mq-chrome-left">
          <RouterLink to="/" className="mq-back">
            ◄ GALLERY
          </RouterLink>
          <span className="mq-chrome-rule" aria-hidden="true" />
          <span className="mq-chrome-mast">{SHOW.masthead}</span>
        </div>
        <span className="mq-chrome-ref">{SHOW.ref}</span>
      </header>

      <main className="mq-main">
        <section className="mq-marquee-band" aria-labelledby="mq-name" data-part-id="proj-platform-product-launch/marquee">
          <div className="mq-marquee" data-part-id="proj-platform-product-launch/marquee/bulb-frame">
            <div className="mq-marquee-sweep" aria-hidden="true" />
            <p className="mq-marquee-top">{SHOW.marqueeTop}</p>
            <h1 id="mq-name" className="mq-marquee-name">
              {SHOW.marqueeName}
            </h1>
            <p className="mq-marquee-sub">{SHOW.marqueeSub}</p>
          </div>
          <p className="mq-statement">{SHOW.statement}</p>
          <dl className="mq-figures" data-part-id="proj-platform-product-launch/marquee/showbill-figures">
            {SHOW.figures.map((figure) => (
              <div key={figure.label} className="mq-figure">
                <dt>{figure.label}</dt>
                <dd>{figure.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mq-provenance">{SHOW.provenance}</p>
        </section>

        <section className="mq-band" aria-labelledby="mq-acts-heading" data-part-id="proj-platform-product-launch/acts">
          <h2 id="mq-acts-heading" className="mq-band-heading">
            {ACTS.title}
            <span className="mq-band-sub">{ACTS.sub}</span>
          </h2>
          <ol className="mq-acts" data-part-id="proj-platform-product-launch/acts/act-cards">
            {ACTS.entries.map((act) => (
              <li key={act.id} className="mq-act" data-state={act.state}>
                <p className="mq-act-numeral">{act.numeral}</p>
                <h3 className="mq-act-name">{act.name}</h3>
                <p className="mq-act-window">{act.window}</p>
                <p className="mq-act-body">{act.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mq-band" aria-labelledby="mq-call-heading" data-part-id="proj-platform-product-launch/call-sheet">
          <h2 id="mq-call-heading" className="mq-band-heading">
            {CALL_SHEET.title}
            <span className="mq-band-sub">{CALL_SHEET.sub}</span>
          </h2>
          <ol className="mq-call-sheet" data-part-id="proj-platform-product-launch/call-sheet/crew-lines">
            {CALL_SHEET.lines.map((line) => (
              <li key={line.id} className="mq-crew" data-status={line.status}>
                <div className="mq-crew-head">
                  <span className="mq-crew-workstream">{line.workstream}</span>
                  <span className="mq-crew-lead">{line.lead}</span>
                  <span className="mq-crew-call">{line.call}</span>
                  <span className="mq-crew-status" data-status={line.status}>
                    {STATUS_LABEL[line.status]}
                  </span>
                </div>
                <p className="mq-crew-note">{line.note}</p>
              </li>
            ))}
          </ol>
        </section>

        <div className="mq-columns">
          <section className="mq-band" aria-labelledby="mq-house-heading" data-part-id="proj-platform-product-launch/checklist">
            <h2 id="mq-house-heading" className="mq-band-heading">
              {HOUSE.title}
              <span className="mq-band-sub">
                {HOUSE.sub} · {litCount} OF {HOUSE.items.length} LIT
              </span>
            </h2>
            <ul className="mq-house" data-part-id="proj-platform-product-launch/checklist/house-lamps">
              {HOUSE.items.map((item) => (
                <li key={item.id} className="mq-lamp-row" data-lit={item.done ? 'true' : 'false'}>
                  <span className="mq-lamp" aria-hidden="true" />
                  <span className="mq-lamp-item">{item.item}</span>
                  <span className="mq-lamp-state">{item.done ? 'LIT' : 'DARK'}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mq-band" aria-labelledby="mq-notices-heading" data-part-id="proj-platform-product-launch/notices">
            <h2 id="mq-notices-heading" className="mq-band-heading">
              {NOTICES.title}
              <span className="mq-band-sub">{NOTICES.sub}</span>
            </h2>
            <ol className="mq-notices">
              {NOTICES.entries.map((notice) => (
                <li key={notice.id} className="mq-notice">
                  <span className="mq-notice-date">{notice.date}</span>
                  <p className="mq-notice-text">{notice.entry}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </main>

      <footer className="mq-foot">
        <p>{FOOT.note}</p>
        <p className="mq-foot-line">
          <span>{SHOW.provenance}</span>
          <span>{FOOT.next}</span>
        </p>
      </footer>
    </div>
  );
}
