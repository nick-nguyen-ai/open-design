/**
 * "The Test Stand" — the live full-bleed rendering of
 * `exp-testing-validation-strategy`.
 *
 * A testing strategy whose coverage claims are inspectable, not asserted:
 * three glass panes (unit, integration, validation) stacked with restrained
 * depth, twelve concrete claims as lamps lit only by named suites and runs —
 * and two lamps honestly dark, with what would light them written alongside.
 * Grammar: signal-glass; signature: horizon-sweep; motion level 2; locked
 * dark.
 *
 * Art-direction licence: this file and test-stand.css are the
 * experience-local art layer — raw colour values are permitted HERE only.
 *
 * `data-part-id` values are a PUBLIC BORROW CONTRACT (surfaced by the gallery's
 * part inspector, consumed by the open-design skill): never rename or remove
 * one without updating LivePartIds.test.tsx.
 */
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import { VisuallyHidden } from '@enterprise-design/primitives';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource-variable/inter/index.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import './test-stand.css';
import { DARK_CLAIMS, DOCTRINE, FOOT, PANES, PANES_BAND, STAND } from './content.js';

export default function TestStandPage() {
  const { reduced } = useMotionPreference();

  return (
    <div className="ts-root" data-testid="live-test-stand" data-reduced={reduced ? 'true' : undefined}>
      <header className="ts-chrome" data-part-id="exp-testing-validation-strategy/chrome">
        <div className="ts-chrome-left">
          <RouterLink to="/" className="ts-back">
            ◄ GALLERY
          </RouterLink>
          <span className="ts-chrome-rule" aria-hidden="true" />
          <span className="ts-chrome-mast">{STAND.masthead}</span>
        </div>
        <div className="ts-chrome-right">
          <span>{STAND.system}</span>
        </div>
      </header>

      <main className="ts-main">
        <section className="ts-stand" aria-labelledby="ts-statement" data-part-id="exp-testing-validation-strategy/stand">
          <div className="ts-stand-sweep" aria-hidden="true" />
          <p className="ts-kicker">{STAND.kicker}</p>
          <h1 id="ts-statement" className="ts-statement">
            {STAND.statement}
          </h1>
          <p className="ts-subline">{STAND.subline}</p>
          <dl className="ts-figures" data-part-id="exp-testing-validation-strategy/stand/figures">
            {STAND.figures.map((figure) => (
              <div key={figure.label} className="ts-figure">
                <dt>{figure.label}</dt>
                <dd>{figure.value}</dd>
              </div>
            ))}
          </dl>
          <p className="ts-provenance">{STAND.provenance}</p>
        </section>

        <section className="ts-band" aria-labelledby="ts-panes-heading" data-part-id="exp-testing-validation-strategy/panes">
          <h2 id="ts-panes-heading" className="ts-band-heading">
            {PANES_BAND.title}
            <span className="ts-band-sub">{PANES_BAND.sub}</span>
          </h2>
          <div className="ts-stack" data-part-id="exp-testing-validation-strategy/panes/glass-stack">
            {[...PANES].reverse().map((pane, i) => (
              <article key={pane.id} className="ts-pane" style={{ ['--ts-pane' as string]: i }}>
                <header className="ts-pane-head">
                  <span className="ts-pane-layer">{pane.layer}</span>
                  <h3 className="ts-pane-name">{pane.name}</h3>
                  <span className="ts-pane-meta">
                    {pane.volume} · {pane.cadence}
                  </span>
                </header>
                <p className="ts-pane-proves">{pane.proves}</p>
                <ul className="ts-lamps">
                  {pane.claims.map((claim) => (
                    <li key={claim.id} className="ts-lamp" data-lit={claim.lit ? 'true' : 'false'}>
                      <span className="ts-lamp-bulb" aria-hidden="true" />
                      <div className="ts-lamp-body">
                        <p className="ts-lamp-claim">
                          {claim.claim}
                          <VisuallyHidden>{claim.lit ? ' — lit by evidence' : ' — dark, no evidence yet'}</VisuallyHidden>
                        </p>
                        <p className="ts-lamp-evidence">{claim.evidence}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <div className="ts-columns">
          <section className="ts-band" aria-labelledby="ts-dark-heading" data-part-id="exp-testing-validation-strategy/dark-lamps">
            <h2 id="ts-dark-heading" className="ts-band-heading">
              {DARK_CLAIMS.title}
              <span className="ts-band-sub">{DARK_CLAIMS.sub}</span>
            </h2>
            <ul className="ts-dark-list">
              {DARK_CLAIMS.items.map((item) => (
                <li key={item.id} className="ts-dark-item">
                  <div className="ts-dark-head">
                    <span className="ts-dark-ref">{item.ref}</span>
                    <span className="ts-dark-pane">{item.pane}</span>
                    <span className="ts-dark-due">DUE {item.due}</span>
                  </div>
                  <p className="ts-dark-claim">{item.claim}</p>
                  <p className="ts-dark-lights">
                    <span className="ts-dark-label">LIGHTS WHEN</span> {item.lightsWhen}
                  </p>
                  <p className="ts-dark-owner">{item.owner.toUpperCase()}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="ts-band" aria-labelledby="ts-doctrine-heading" data-part-id="exp-testing-validation-strategy/doctrine">
            <h2 id="ts-doctrine-heading" className="ts-band-heading">
              {DOCTRINE.title}
              <span className="ts-band-sub">{DOCTRINE.sub}</span>
            </h2>
            <ol className="ts-doctrine">
              {DOCTRINE.rules.map((rule, i) => (
                <li key={rule.id} className="ts-rule">
                  <span className="ts-rule-num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="ts-rule-text">{rule.rule}</p>
                    <p className="ts-rule-note">{rule.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </main>

      <footer className="ts-foot">
        <p>{FOOT.note}</p>
        <p className="ts-foot-line">
          <span>{STAND.provenance}</span>
          <span>{FOOT.next}</span>
        </p>
      </footer>
    </div>
  );
}
