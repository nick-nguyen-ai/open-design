/**
 * "The Weighing Room" — the live full-bleed rendering of
 * `proj-vendor-assessment`.
 *
 * A vendor decision as a weighing room: risk, commercial, and technical
 * assessments as acetate lens sheets laid over the same four vendors.
 * Lay one lens at a time or stack all three; the balance panel holds the
 * rule that no single lens may dominate. Grammar: signal-glass; signature:
 * horizon-sweep (light crosses the glass table on arrival); motion level 1;
 * locked light.
 *
 * Art-direction licence: this file and weighing-room.css are the
 * experience-local art layer — raw colour values are permitted HERE only.
 *
 * `data-part-id` values are a PUBLIC BORROW CONTRACT (surfaced by the gallery's
 * part inspector, consumed by the design-borrow skill): never rename or remove
 * one without updating LivePartIds.test.tsx.
 */
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource-variable/inter/index.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './weighing-room.css';
import {
  BALANCE,
  CRITERIA,
  FINDINGS,
  FOOT,
  LENSES,
  PROTOCOL,
  READING_LABEL,
  ROOM,
  VENDORS,
  type LensId,
} from './content.js';

type LensSelection = 'all' | LensId;

function strongCount(vendorId: string, lens: LensId): number {
  return CRITERIA.filter((criterion) => criterion.lens === lens && criterion.readings[vendorId] === 'strong').length;
}

export default function WeighingRoomPage() {
  const { reduced } = useMotionPreference();
  const [lens, setLens] = useState<LensSelection>('all');
  const visibleCriteria = lens === 'all' ? CRITERIA : CRITERIA.filter((criterion) => criterion.lens === lens);
  const perLensTotal = CRITERIA.length / LENSES.length;

  return (
    <div className="wr-root" data-testid="live-weighing-room" data-reduced={reduced ? 'true' : undefined}>
      <header className="wr-chrome" data-part-id="proj-vendor-assessment/chrome">
        <div className="wr-chrome-left">
          <RouterLink to="/" className="wr-back">
            ◄ GALLERY
          </RouterLink>
          <span className="wr-chrome-rule" aria-hidden="true" />
          <span className="wr-chrome-mast">{ROOM.masthead}</span>
        </div>
        <span className="wr-chrome-ref">{ROOM.ref}</span>
      </header>

      <main className="wr-main">
        <section className="wr-brief" aria-labelledby="wr-title" data-part-id="proj-vendor-assessment/brief">
          <p className="wr-kicker">{ROOM.kicker}</p>
          <h1 id="wr-title" className="wr-title">
            {ROOM.title}
          </h1>
          <p className="wr-subline">{ROOM.subline}</p>
          <dl className="wr-figures" data-part-id="proj-vendor-assessment/brief/figures">
            {ROOM.figures.map((figure) => (
              <div key={figure.label} className="wr-figure">
                <dt>{figure.label}</dt>
                <dd>{figure.value}</dd>
              </div>
            ))}
          </dl>
          <p className="wr-provenance">{ROOM.provenance}</p>
        </section>

        <section className="wr-band" aria-labelledby="wr-table-heading" data-part-id="proj-vendor-assessment/lenses">
          <h2 id="wr-table-heading" className="wr-band-heading">
            The glass table
            <span className="wr-band-sub">Lay one acetate at a time, or stack all three</span>
          </h2>
          <div className="wr-acetate-bar" role="group" aria-label="Choose which lens sheets lie on the table" data-part-id="proj-vendor-assessment/lenses/acetate-bar">
            <button type="button" className="wr-acetate" data-lens="all" aria-pressed={lens === 'all'} onClick={() => setLens('all')}>
              ALL SHEETS
            </button>
            {LENSES.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className="wr-acetate"
                data-lens={entry.id}
                aria-pressed={lens === entry.id}
                onClick={() => setLens(entry.id)}
              >
                {entry.name.toUpperCase()}
                <span className="wr-acetate-owner">{entry.owner}</span>
              </button>
            ))}
          </div>
          <figure className="wr-table-figure">
            <div className="wr-table-sweep" aria-hidden="true" />
            <div className="wr-table-scroll">
              <table className="wr-table" data-part-id="proj-vendor-assessment/lenses/reading-table">
                <thead>
                  <tr>
                    <th scope="col" className="wr-th-criterion">
                      CRITERION
                    </th>
                    {VENDORS.map((vendor) => (
                      <th key={vendor.id} scope="col" className="wr-th-vendor">
                        {vendor.name}
                        <span className="wr-vendor-line">{vendor.line}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleCriteria.map((criterion) => (
                    <tr key={criterion.id} className="wr-row" data-lens={criterion.lens}>
                      <th scope="row" className="wr-criterion">
                        <span className="wr-criterion-lens" data-lens={criterion.lens}>
                          {criterion.lens.toUpperCase()}
                        </span>
                        {criterion.name}
                        <span className="wr-criterion-note">{criterion.note}</span>
                      </th>
                      {VENDORS.map((vendor) => {
                        const reading = criterion.readings[vendor.id]!;
                        return (
                          <td key={vendor.id} className="wr-reading" data-reading={reading} data-lens={criterion.lens}>
                            {READING_LABEL[reading]}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </figure>
        </section>

        <section className="wr-band" aria-labelledby="wr-balance-heading" data-part-id="proj-vendor-assessment/balance">
          <h2 id="wr-balance-heading" className="wr-band-heading">
            {BALANCE.title}
            <span className="wr-band-sub">{BALANCE.sub}</span>
          </h2>
          <ol className="wr-balance" data-part-id="proj-vendor-assessment/balance/vendor-scales">
            {VENDORS.map((vendor) => (
              <li key={vendor.id} className="wr-scale">
                <span className="wr-scale-name">{vendor.name}</span>
                <span className="wr-scale-tracks">
                  {LENSES.map((entry) => {
                    const count = strongCount(vendor.id, entry.id);
                    return (
                      <span key={entry.id} className="wr-scale-track" data-lens={entry.id}>
                        <span className="wr-scale-label">{entry.id.toUpperCase()}</span>
                        <span className="wr-scale-bar" aria-hidden="true">
                          <span className="wr-scale-fill" style={{ width: `${(count / perLensTotal) * 100}%` }} />
                        </span>
                        <span className="wr-scale-count">
                          {count}/{perLensTotal} STRONG
                        </span>
                      </span>
                    );
                  })}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <div className="wr-columns">
          <section className="wr-band" aria-labelledby="wr-findings-heading" data-part-id="proj-vendor-assessment/findings">
            <h2 id="wr-findings-heading" className="wr-band-heading">
              {FINDINGS.title}
              <span className="wr-band-sub">{FINDINGS.sub}</span>
            </h2>
            <ol className="wr-findings">
              {FINDINGS.notes.map((note, i) => (
                <li key={note.id} className="wr-finding">
                  <span className="wr-finding-num">{String(i + 1).padStart(2, '0')}</span>
                  <p>{note.text}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="wr-band" aria-labelledby="wr-protocol-heading" data-part-id="proj-vendor-assessment/protocol">
            <h2 id="wr-protocol-heading" className="wr-band-heading">
              {PROTOCOL.title}
              <span className="wr-band-sub">{PROTOCOL.sub}</span>
            </h2>
            <ol className="wr-protocol">
              {PROTOCOL.rules.map((rule) => (
                <li key={rule.id} className="wr-rule">
                  <p className="wr-rule-text">{rule.rule}</p>
                  <p className="wr-rule-note">{rule.note}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </main>

      <footer className="wr-foot">
        <p>{FOOT.note}</p>
        <p className="wr-foot-line">
          <span>{ROOM.provenance}</span>
          <span>{FOOT.next}</span>
        </p>
      </footer>
    </div>
  );
}
