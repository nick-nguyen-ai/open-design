import { NavLink } from 'react-router-dom';
import { usePreferencesContext } from '../state/PreferencesContext.js';
import { MoonIcon, MotionIcon, MotionOffIcon, SunIcon } from './icons.js';

interface NavItem {
  to: string;
  label: string;
  /** `end` restricts the active match to an exact path (used for `/browse`). */
  end?: boolean;
}

const NAV: NavItem[] = [
  { to: '/browse', label: 'Browse', end: true },
  { to: '/browse?mode=templates', label: 'Templates' },
  { to: '/components', label: 'Components' },
  { to: '/grammars', label: 'Grammars' },
  { to: '/blueprint-lab', label: 'Blueprint Lab' },
  { to: '/guide', label: 'Guide' },
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
    <header className="sticky top-0 z-sticky border-b border-border-subtle bg-surface-base/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[80rem] items-center gap-4 px-6">
        <NavLink to="/" className="group flex items-baseline gap-2 no-underline">
          <span className="font-heading text-lg font-semibold tracking-tight text-text-primary">
            Enterprise Design Intelligence
          </span>
          <span className="hidden text-sm text-text-muted sm:inline">Gallery</span>
        </NavLink>

        <nav aria-label="Primary" className="ml-auto hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                'rounded-md px-3 py-2 text-sm font-medium no-underline transition-colors duration-feedback ease-settle ' +
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ' +
                (isActive
                  ? 'text-text-primary'
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
