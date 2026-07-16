import { NavLink } from 'react-router-dom';
import { usePreferencesContext } from '../state/PreferencesContext.js';
import { MoonIcon, MotionIcon, MotionOffIcon, SunIcon } from './icons.js';

interface NavItem {
  to: string;
  label: string;
  /** `end` restricts the active match to an exact path (used for `/`). */
  end?: boolean;
}

/**
 * The 4-tab IA (2026-07-17 Gallery Ink redesign): the site IS the gallery, so
 * the catalogue is home; the other tabs explain how to use it, what the
 * MCP/skills have made, and how it's built.
 */
const NAV: NavItem[] = [
  { to: '/', label: 'Gallery', end: true },
  { to: '/make', label: 'Make your design' },
  { to: '/showcase', label: 'Showcase' },
  { to: '/contribute', label: 'Contribute' },
];

const MOTION_LABEL = {
  system: 'Motion: system default',
  reduced: 'Motion: reduced',
  full: 'Motion: full',
} as const;

function iconButtonClass() {
  return (
    'inline-flex h-9 w-9 items-center justify-center rounded-md text-lg text-text-secondary ' +
    'border border-border-subtle bg-surface-raised transition-colors duration-feedback ease-settle ' +
    'hover:bg-surface-sunken hover:text-text-primary ' +
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring'
  );
}

export function Header() {
  const { theme, toggleTheme, motion, toggleReducedMotion } = usePreferencesContext();

  return (
    <header className="sticky top-0 z-sticky border-b border-border-subtle bg-surface-base/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[80rem] items-center gap-5 px-6">
        <NavLink to="/" className="group flex items-baseline gap-3 no-underline">
          <span className="font-display text-xl font-bold tracking-tight text-text-primary">
            Open<em className="italic text-accent">Design</em>
          </span>
          <span className="hidden font-mono text-[0.56rem] font-medium uppercase tracking-[0.18em] text-text-muted lg:inline">
            A gallery of living templates
          </span>
        </NavLink>

        <nav aria-label="Primary" className="ml-auto hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                'relative rounded-md px-3 py-2 text-sm font-medium no-underline transition-colors duration-feedback ease-settle ' +
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ' +
                (isActive
                  ? 'text-text-primary after:absolute after:inset-x-3 after:bottom-0.5 after:h-0.5 after:bg-accent'
                  : 'text-text-secondary hover:bg-surface-sunken hover:text-text-primary')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <button
            type="button"
            onClick={toggleReducedMotion}
            className={iconButtonClass()}
            aria-label={MOTION_LABEL[motion]}
            title={MOTION_LABEL[motion]}
          >
            {motion === 'reduced' ? <MotionOffIcon /> : <MotionIcon />}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className={iconButtonClass()}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
    </header>
  );
}
