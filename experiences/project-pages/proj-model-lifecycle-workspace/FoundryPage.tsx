/**
 * "The Foundry" — the live full-bleed rendering of
 * `proj-model-lifecycle-workspace`.
 *
 * Models as castings moving through a foundry: pattern shop (develop),
 * proof house (validate), production floor (deploy), archive (retire).
 * Every transition is a stamped act in the ledger; drift sends a casting
 * back to the proof house, not to a meeting. Grammar: living-system;
 * signature: data-ink-draw (the process rail draws itself across the
 * halls on arrival); motion level 2; locked dark.
 *
 * Art-direction licence: this file and foundry.css are the experience-local
 * art layer — raw colour values are permitted HERE only.
 *
 * `data-part-id` values are a PUBLIC BORROW CONTRACT (surfaced by the gallery's
 * part inspector, consumed by the open-design skill): never rename or remove
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
import './foundry.css';
import { CASTINGS, DOCTRINE, FOOT, FOUNDRY, HALLS, STAMPS } from './content.js';

export default function FoundryPage() {
  const { reduced } = useMotionPreference();

  return (
    <div className="fd-root" data-testid="live-foundry" data-reduced={reduced ? 'true' : undefined}>
      <header className="fd-chrome" data-part-id="proj-model-lifecycle-workspace/chrome">
        <div className="fd-chrome-left">
          <RouterLink to="/" className="fd-back">
            ◄ GALLERY
          </RouterLink>
          <span className="fd-chrome-rule" aria-hidden="true" />
          <span className="fd-chrome-mast">{FOUNDRY.masthead}</span>
        </div>
        <span className="fd-chrome-ref">{FOUNDRY.ref}</span>
      </header>

      <main className="fd-main">
        <section className="fd-shift" aria-labelledby="fd-title" data-part-id="proj-model-lifecycle-workspace/shift">
          <p className="fd-kicker">{FOUNDRY.kicker}</p>
          <h1 id="fd-title" className="fd-title">
            {FOUNDRY.title}
          </h1>
          <p className="fd-subline">{FOUNDRY.subline}</p>
          <dl className="fd-figures" data-part-id="proj-model-lifecycle-workspace/shift/figures">
            {FOUNDRY.figures.map((figure) => (
              <div key={figure.label} className="fd-figure">
                <dt>{figure.label}</dt>
                <dd>{figure.value}</dd>
              </div>
            ))}
          </dl>
          <p className="fd-provenance">{FOUNDRY.provenance}</p>
        </section>

        <section className="fd-band" aria-labelledby="fd-floor-heading" data-part-id="proj-model-lifecycle-workspace/floor">
          <h2 id="fd-floor-heading" className="fd-band-heading">
            The foundry floor
            <span className="fd-band-sub">Four halls, fourteen castings — each in exactly one</span>
          </h2>
          {/* The process rail — data-ink-draw */}
          <svg className="fd-rail" viewBox="0 0 1080 40" aria-hidden="true" data-part-id="proj-model-lifecycle-workspace/floor/process-rail">
            <path className="fd-rail-line" d="M 20 22 H 1060" pathLength={1} />
            {[135, 405, 675, 945].map((x, i) => (
              <g key={x}>
                <circle className="fd-rail-node" cx={x} cy={22} r={5} style={{ ['--fd-node-delay' as string]: `${350 + i * 220}ms` }} />
              </g>
            ))}
            {[270, 540, 810].map((x, i) => (
              <path
                key={x}
                className="fd-rail-arrow"
                d={`M ${x - 6} 14 L ${x + 6} 22 L ${x - 6} 30`}
                style={{ ['--fd-node-delay' as string]: `${460 + i * 220}ms` }}
              />
            ))}
          </svg>
          <div className="fd-halls" data-part-id="proj-model-lifecycle-workspace/floor/hall-columns">
            {HALLS.map((hall) => {
              const castings = CASTINGS.filter((casting) => casting.hall === hall.id);
              return (
                <section key={hall.id} className="fd-hall" data-hall={hall.id} aria-label={hall.name}>
                  <header className="fd-hall-head">
                    <h3 className="fd-hall-name">{hall.name}</h3>
                    <span className="fd-hall-verb">{hall.verb}</span>
                    <span className="fd-hall-count">{castings.length}</span>
                  </header>
                  <ul className="fd-hall-list">
                    {castings.map((casting) => (
                      <li key={casting.id} className="fd-casting" data-hall={casting.hall}>
                        <span className="fd-casting-heat" aria-hidden="true" />
                        <div className="fd-casting-body">
                          <p className="fd-casting-name">
                            <span className="fd-casting-mark">{casting.mark}</span>
                            {casting.name}
                          </p>
                          <p className="fd-casting-note">
                            <span className="fd-casting-since">{casting.since}</span> {casting.heat}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </section>

        <div className="fd-columns">
          <section className="fd-band" aria-labelledby="fd-stamps-heading" data-part-id="proj-model-lifecycle-workspace/stamps">
            <h2 id="fd-stamps-heading" className="fd-band-heading">
              {STAMPS.title}
              <span className="fd-band-sub">{STAMPS.sub}</span>
            </h2>
            <ol className="fd-stamps" data-part-id="proj-model-lifecycle-workspace/stamps/stamp-entries">
              {STAMPS.entries.map((entry) => (
                <li key={entry.id} className="fd-stamp-row" data-tone={entry.tone}>
                  <span className="fd-stamp" data-tone={entry.tone}>
                    {entry.stamp}
                  </span>
                  <div className="fd-stamp-body">
                    <p className="fd-stamp-casting">
                      <span className="fd-stamp-date">{entry.date}</span> {entry.casting}
                    </p>
                    <p className="fd-stamp-detail">{entry.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="fd-band" aria-labelledby="fd-doctrine-heading" data-part-id="proj-model-lifecycle-workspace/doctrine">
            <h2 id="fd-doctrine-heading" className="fd-band-heading">
              {DOCTRINE.title}
              <span className="fd-band-sub">{DOCTRINE.sub}</span>
            </h2>
            <ol className="fd-doctrine">
              {DOCTRINE.rules.map((rule, i) => (
                <li key={rule.id} className="fd-rule">
                  <span className="fd-rule-num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="fd-rule-text">{rule.rule}</p>
                    <p className="fd-rule-note">{rule.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </main>

      <footer className="fd-foot">
        <p>{FOOT.note}</p>
        <p className="fd-foot-line">
          <span>{FOUNDRY.provenance}</span>
          <span>{FOOT.next}</span>
        </p>
      </footer>
    </div>
  );
}
