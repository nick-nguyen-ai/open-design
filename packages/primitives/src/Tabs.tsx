import { createContext, useContext, useId } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { cx } from './cx.js';

interface TabsContextValue {
  baseId: string;
  value: string;
  onChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(component: string): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error(`<Tabs.${component}> must be rendered inside <Tabs>`);
  return ctx;
}

export interface TabsProps {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}

/** Root: owns the selected value and the shared id namespace for aria-controls/aria-labelledby pairing. */
function TabsRoot({ value, onChange, children, className }: TabsProps) {
  const baseId = useId();
  return (
    <TabsContext.Provider value={{ baseId, value, onChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps {
  children: ReactNode;
  'aria-label': string;
  className?: string;
}

/** `role="tablist"`. */
function TabsList({ children, className, ...rest }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={cx('inline-flex gap-1 border-b border-border-subtle', className)}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface TabProps {
  value: string;
  children: ReactNode;
  className?: string;
}

const ARROW_KEYS = new Set(['ArrowRight', 'ArrowLeft', 'Home', 'End']);

/** `role="tab"`. Roving tabindex; ArrowLeft/Right + Home/End move focus AND activate (automatic activation, the standard Tabs pattern). */
function Tab({ value, children, className }: TabProps) {
  const ctx = useTabsContext('Tab');
  const selected = ctx.value === value;

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (!ARROW_KEYS.has(event.key)) return;
    const tablist = event.currentTarget.closest('[role="tablist"]');
    if (!tablist) return;
    const tabs = Array.from(tablist.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const currentIndex = tabs.indexOf(event.currentTarget);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = tabs.length - 1;

    event.preventDefault();
    const nextTab = tabs[nextIndex];
    const nextValue = nextTab?.dataset.tabValue;
    if (nextTab && nextValue) {
      ctx.onChange(nextValue);
      nextTab.focus();
    }
  }

  return (
    <button
      type="button"
      role="tab"
      data-tab-value={value}
      id={`${ctx.baseId}-tab-${value}`}
      aria-controls={`${ctx.baseId}-panel-${value}`}
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      onClick={() => ctx.onChange(value)}
      onKeyDown={handleKeyDown}
      className={cx(
        'px-3 py-2 text-sm font-medium text-text-secondary transition-colors duration-feedback ease-settle',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
        selected && 'border-b-2 border-accent text-text-primary',
        className,
      )}
    >
      {children}
    </button>
  );
}

export interface TabPanelProps {
  value: string;
  children: ReactNode;
  className?: string;
}

/** `role="tabpanel"`, unmounted unless its tab is selected. */
function TabPanel({ value, children, className }: TabPanelProps) {
  const ctx = useTabsContext('Panel');
  if (ctx.value !== value) return null;
  return (
    <div
      role="tabpanel"
      id={`${ctx.baseId}-panel-${value}`}
      aria-labelledby={`${ctx.baseId}-tab-${value}`}
      tabIndex={0}
      className={className}
    >
      {children}
    </div>
  );
}

/** Compound component: `<Tabs><Tabs.List aria-label="…"><Tabs.Tab value="…">…</Tabs.Tab></Tabs.List><Tabs.Panel value="…">…</Tabs.Panel></Tabs>`. */
export const Tabs = Object.assign(TabsRoot, { List: TabsList, Tab, Panel: TabPanel });
