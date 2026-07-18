/**
 * "The Assembly Line" — the live full-bleed rendering of
 * `exp-algorithm-explanation`.
 *
 * An algorithm taught as a workshop line: the SAME work-piece (two complaint
 * texts) rides all six stations, and every station shows what enters, what
 * the machine does and why, and what leaves — each transformation of the
 * data visible before the next begins. Grammar: kinetic-intelligence;
 * signature: data-ink-draw (the belt draws, stations arrive in line order);
 * motion level 3; locked light.
 *
 * Art-direction licence: this file and assembly-line.css are the
 * experience-local art layer — raw colour values are permitted HERE only.
 *
 * `data-part-id` values are a PUBLIC BORROW CONTRACT (surfaced by the gallery's
 * part inspector, consumed by the design skill): never rename or remove
 * one without updating LivePartIds.test.tsx.
 */
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource-variable/inter/index.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import './assembly-line.css';
import { BELT, FOOT, LINE, SHOP_NOTES, STATIONS, VERDICT } from './content.js';

export default function AssemblyLinePage() {
  const { reduced } = useMotionPreference();

  return (
    <div className="al-root" data-testid="live-assembly-line" data-reduced={reduced ? 'true' : undefined}>
      <header className="al-chrome" data-part-id="exp-algorithm-explanation/chrome">
        <div className="al-chrome-row">
          <RouterLink to="/" className="al-back">
            ◄ GALLERY
          </RouterLink>
          <span className="al-chrome-mast">{LINE.masthead}</span>
          <span>{LINE.jobRef}</span>
        </div>
        <div className="al-chrome-row al-chrome-row-sub">
          <span className="al-provenance">{LINE.provenance}</span>
        </div>
      </header>

      <main className="al-main">
        <section className="al-line" aria-labelledby="al-statement" data-part-id="exp-algorithm-explanation/line">
          <p className="al-kicker">{LINE.kicker}</p>
          <h1 id="al-statement" className="al-statement">
            {LINE.statement}
          </h1>
          <p className="al-subline">{LINE.subline}</p>
          <dl className="al-figures" data-part-id="exp-algorithm-explanation/line/figures">
            {LINE.figures.map((figure) => (
              <div key={figure.label} className="al-figure">
                <dt>{figure.label}</dt>
                <dd>{figure.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="al-band" aria-labelledby="al-belt-heading" data-part-id="exp-algorithm-explanation/belt">
          <h2 id="al-belt-heading" className="al-band-heading">
            {BELT.title}
            <span className="al-band-sub">{BELT.sub}</span>
          </h2>
          <div className="al-belt-rail" aria-hidden="true" />
          <ol className="al-stations" data-part-id="exp-algorithm-explanation/belt/stations">
            {STATIONS.map((station, i) => (
              <li key={station.id} className="al-station" style={{ ['--al-station' as string]: i }}>
                <header className="al-station-head">
                  <span className="al-station-no">{station.no}</span>
                  <h3 className="al-station-name">{station.name}</h3>
                </header>
                <p className="al-station-operation">{station.operation}</p>
                <div className="al-trays">
                  <div className="al-tray">
                    <p className="al-tray-label">{station.inputLabel}</p>
                    <ul className="al-tray-items">
                      {station.input.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <span className="al-tray-arrow" aria-hidden="true">
                    ⟶
                  </span>
                  <div className="al-tray">
                    <p className="al-tray-label">{station.outputLabel}</p>
                    <ul className="al-tray-items">
                      {station.output.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="al-station-why">
                  <span className="al-why-label">WHY</span> {station.why}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <div className="al-columns">
          <section className="al-band" aria-labelledby="al-verdict-heading" data-part-id="exp-algorithm-explanation/works">
            <h2 id="al-verdict-heading" className="al-band-heading">
              {VERDICT.title}
              <span className="al-band-sub">{VERDICT.sub}</span>
            </h2>
            <ol className="al-points" data-part-id="exp-algorithm-explanation/works/points">
              {VERDICT.points.map((point, i) => (
                <li key={point.id} className="al-point">
                  <span className="al-point-num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="al-point-head">{point.head}</p>
                    <p className="al-point-body">{point.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="al-band" aria-labelledby="al-notes-heading" data-part-id="exp-algorithm-explanation/shop-notes">
            <h2 id="al-notes-heading" className="al-band-heading">
              {SHOP_NOTES.title}
              <span className="al-band-sub">{SHOP_NOTES.sub}</span>
            </h2>
            <ul className="al-notes">
              {SHOP_NOTES.items.map((item) => (
                <li key={item.id} className="al-note">
                  {item.note}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      <footer className="al-foot">
        <p>{FOOT.note}</p>
        <p className="al-foot-line">
          <span>{LINE.provenance}</span>
          <span>{FOOT.next}</span>
        </p>
      </footer>
    </div>
  );
}
