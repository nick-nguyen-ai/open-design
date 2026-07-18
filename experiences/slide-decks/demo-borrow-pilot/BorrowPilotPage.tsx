/**
 * BORROW PILOT — design skill run evidence, not a catalogue template.
 *
 * Borrowed part: `deck-cloud-migration/waves/swimlanes` (the Cutover deck's
 * staggered swimlane grid). Slice = the swimlanes JSX subtree + the `Build`
 * stagger wrapper + the swimlane/chip/rise CSS closure, prefix-renamed
 * `cu-` → `bp-`. The deck's `data-state="active"` animation trigger is
 * replaced by a mount-armed `data-armed` attribute (this is not a deck), and
 * chip kinds are re-semanticized to this page's own content. Source world
 * untouched — see .claude/skills/open-design/workflows/borrow.md.
 */
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useMotionPreference } from '@enterprise-design/motion';
import '@fontsource-variable/inter';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './borrow-pilot.css';

/* Target-owned content: the borrow-a-part rollout itself, as waves. */
type ChipKind = 'ui' | 'contract' | 'skill';

interface Wave {
  id: string;
  name: string;
  when: string;
  chips: readonly { label: string; kind: ChipKind }[];
  note: string;
}

const WAVES: readonly Wave[] = [
  {
    id: 'w1',
    name: 'Wave 1 — Pilot worlds',
    when: 'SHIPPED',
    chips: [
      { label: 'CUTOVER', kind: 'ui' },
      { label: 'COCKPIT', kind: 'ui' },
      { label: 'STUDIO', kind: 'ui' },
      { label: 'PART INSPECTOR', kind: 'ui' },
    ],
    note: 'Three flagship worlds carry data-part-id anchors; the gallery inspector reveals them on click.',
  },
  {
    id: 'w2',
    name: 'Wave 2 — Contract locks',
    when: 'SHIPPED',
    chips: [
      { label: 'STATIC SCAN', kind: 'contract' },
      { label: 'RENDERED LOCK', kind: 'contract' },
    ],
    note: 'Part IDs are a public borrow contract: source-scanned and render-locked per world.',
  },
  {
    id: 'w3',
    name: 'Wave 3 — Every world',
    when: 'NEXT',
    chips: [
      { label: 'DESIGN-BORROW', kind: 'skill' },
      { label: '30 MORE WORLDS', kind: 'ui' },
      { label: 'MCP LISTING', kind: 'skill' },
    ],
    note: 'Retrofit the remaining live worlds and surface borrowable parts through the descriptor.',
  },
];

/* Borrowed stagger wrapper (Cutover `Build`, prefix-renamed). */
function Build({ i, children, className }: { i: number; children: React.ReactNode; className?: string }) {
  return (
    <div className={className ? `bp-build ${className}` : 'bp-build'} style={{ ['--bp-i' as string]: i }}>
      {children}
    </div>
  );
}

export default function BorrowPilotPage() {
  const { reduced } = useMotionPreference();
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    document.title = 'Borrow Pilot — design skill run evidence';
  }, []);

  // Mount-armed replacement for the deck's slide-activation trigger: arm on
  // the frame after first paint so the rise animation actually plays.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setArmed(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className="bp-root"
      data-testid="demo-borrow-pilot"
      data-armed={armed ? 'true' : undefined}
      data-reduced={reduced ? 'true' : undefined}
    >
      <header className="bp-chrome">
        <RouterLink to="/" className="bp-back">
          ◄ GALLERY
        </RouterLink>
        <span className="bp-chrome-note">
          DESIGN-BORROW PILOT · SOURCE PART deck-cloud-migration/waves/swimlanes · SYNTHETIC DEMO
        </span>
      </header>
      <main className="bp-main">
        <h1 className="bp-heading">The borrow-a-part rollout, in borrowed swimlanes.</h1>
        <p className="bp-standfirst">
          This grid — the lanes, the chips, the staggered rise — is the Cutover deck’s wave board,
          borrowed by part ID and re-inked for this page’s own content.
        </p>
        <div className="bp-swimlanes" data-testid="borrowed-swimlanes">
          {WAVES.map((w, i) => (
            <Build key={w.id} i={i} className="bp-lane">
              <div className="bp-lane-head">
                <span className="bp-lane-name">{w.name}</span>
                <span className="bp-lane-when">{w.when}</span>
              </div>
              <div className="bp-lane-chips">
                {w.chips.map((c) => (
                  <span key={c.label} className="bp-chip" data-kind={c.kind}>
                    {c.label}
                  </span>
                ))}
              </div>
              <p className="bp-lane-note">{w.note}</p>
            </Build>
          ))}
        </div>
      </main>
    </div>
  );
}
