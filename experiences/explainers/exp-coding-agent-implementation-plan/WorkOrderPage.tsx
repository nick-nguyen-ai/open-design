/**
 * "The Work Order" — the live full-bleed rendering of
 * `exp-coding-agent-implementation-plan`.
 *
 * A coding agent's implementation plan as a manufacturing traveler: one job
 * card, seven numbered operations in routing order, acceptance criteria and
 * an evidence line per operation, QA stamp boxes that are earned, material
 * tolerances the job must hold, and a sign-off chain. The agent and the
 * reviewer read the same card. Grammar: precision-grid; signature:
 * ledger-reveal; motion level 2; locked light; density high.
 *
 * Art-direction licence: this file and work-order.css are the
 * experience-local art layer — raw colour values are permitted HERE only.
 *
 * `data-part-id` values are a PUBLIC BORROW CONTRACT (surfaced by the gallery's
 * part inspector, consumed by the design-borrow skill): never rename or remove
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
import './work-order.css';
import { FOOT, OPERATIONS, ORDER, ROUTING, SIGNOFF, TOLERANCES, type OpState } from './content.js';

const STATE_LABEL: Record<OpState, string> = {
  stamped: 'STAMPED',
  'in-progress': 'IN PROGRESS',
  queued: 'QUEUED',
};

export default function WorkOrderPage() {
  const { reduced } = useMotionPreference();

  return (
    <div className="wo-root" data-testid="live-work-order" data-reduced={reduced ? 'true' : undefined}>
      <header className="wo-chrome" data-part-id="exp-coding-agent-implementation-plan/chrome">
        <div className="wo-chrome-row">
          <RouterLink to="/" className="wo-back">
            ◄ GALLERY
          </RouterLink>
          <span className="wo-chrome-mast">{ORDER.masthead}</span>
          <span>{ORDER.shop}</span>
        </div>
        <div className="wo-chrome-row wo-chrome-row-sub">
          <span className="wo-provenance">{ORDER.provenance}</span>
        </div>
      </header>

      <main className="wo-main">
        <section className="wo-job" aria-labelledby="wo-job-title" data-part-id="exp-coding-agent-implementation-plan/job">
          <p className="wo-kicker">{ORDER.kicker}</p>
          <h1 id="wo-job-title" className="wo-job-title">
            {ORDER.job}
          </h1>
          <p className="wo-job-note">{ORDER.jobNote}</p>
          <dl className="wo-facts" data-part-id="exp-coding-agent-implementation-plan/job/facts">
            {ORDER.facts.map((fact) => (
              <div key={fact.label} className="wo-fact">
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="wo-band" aria-labelledby="wo-routing-heading" data-part-id="exp-coding-agent-implementation-plan/routing">
          <h2 id="wo-routing-heading" className="wo-band-heading">
            {ROUTING.title}
            <span className="wo-band-sub">{ROUTING.sub}</span>
          </h2>
          <ol className="wo-routing" aria-label="Operation routing strip">
            {OPERATIONS.map((operation) => (
              <li key={operation.id} className="wo-routing-stop" data-state={operation.state}>
                <span className="wo-routing-op">{operation.op}</span>
                <span className="wo-routing-state">{STATE_LABEL[operation.state]}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="wo-band" aria-labelledby="wo-traveler-heading" data-part-id="exp-coding-agent-implementation-plan/traveler">
          <h2 id="wo-traveler-heading" className="wo-band-heading">
            The traveler
            <span className="wo-band-sub">Acceptance criteria and evidence per operation · stamps are earned at QA</span>
          </h2>
          <ol className="wo-operations" data-part-id="exp-coding-agent-implementation-plan/traveler/operations">
            {OPERATIONS.map((operation, i) => (
              <li
                key={operation.id}
                className="wo-operation"
                data-state={operation.state}
                style={{ ['--wo-row' as string]: i }}
              >
                <div className="wo-operation-rail">
                  <span className="wo-operation-op">{operation.op}</span>
                  <span className="wo-operation-state" data-state={operation.state}>
                    {STATE_LABEL[operation.state]}
                  </span>
                </div>
                <div className="wo-operation-body">
                  <p className="wo-operation-task">{operation.task}</p>
                  <p className="wo-operation-files">{operation.files}</p>
                  <ul className="wo-acceptance">
                    {operation.acceptance.map((criterion, j) => (
                      <li key={j} data-met={operation.state === 'stamped' ? 'true' : undefined}>
                        <span className="wo-acceptance-box" aria-hidden="true">
                          {operation.state === 'stamped' ? '☑' : '☐'}
                        </span>
                        {criterion}
                      </li>
                    ))}
                  </ul>
                  <p className="wo-evidence">
                    <span className="wo-evidence-label">EVIDENCE</span> {operation.evidence}
                  </p>
                </div>
                <div className="wo-stamp-box" aria-label={`QA stamp for ${operation.op}`}>
                  {operation.stamp ? (
                    <span className="wo-stamp">{operation.stamp}</span>
                  ) : (
                    <span className="wo-stamp-empty">QA STAMP</span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="wo-columns">
          <section className="wo-band" aria-labelledby="wo-tolerances-heading" data-part-id="exp-coding-agent-implementation-plan/tolerances">
            <h2 id="wo-tolerances-heading" className="wo-band-heading">
              {TOLERANCES.title}
              <span className="wo-band-sub">{TOLERANCES.sub}</span>
            </h2>
            <ul className="wo-tolerances">
              {TOLERANCES.items.map((tolerance) => (
                <li key={tolerance.id} className="wo-tolerance">
                  <p className="wo-tolerance-rule">{tolerance.rule}</p>
                  <p className="wo-tolerance-why">{tolerance.why}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="wo-band" aria-labelledby="wo-signoff-heading" data-part-id="exp-coding-agent-implementation-plan/signoff">
            <h2 id="wo-signoff-heading" className="wo-band-heading">
              {SIGNOFF.title}
              <span className="wo-band-sub">{SIGNOFF.sub}</span>
            </h2>
            <ol className="wo-chain">
              {SIGNOFF.chain.map((link) => (
                <li key={link.id} className="wo-chain-link" data-done={link.done ? 'true' : undefined}>
                  <span className="wo-chain-role">{link.role}</span>
                  <span className="wo-chain-name">{link.name}</span>
                  <span className="wo-chain-mark" aria-hidden="true">
                    {link.done ? '■' : '□'}
                  </span>
                  <VisuallyHidden>{link.done ? 'complete' : 'pending'}</VisuallyHidden>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </main>

      <footer className="wo-foot">
        <p>{FOOT.note}</p>
        <p className="wo-foot-line">
          <span>{ORDER.provenance}</span>
          <span>{FOOT.next}</span>
        </p>
      </footer>
    </div>
  );
}
