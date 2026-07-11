import { createContext, useContext } from 'react';
import type { Preferences } from './usePreferences.js';

const PreferencesContext = createContext<Preferences | null>(null);

export const PreferencesProvider = PreferencesContext.Provider;

export function usePreferencesContext(): Preferences {
  const value = useContext(PreferencesContext);
  if (!value) throw new Error('usePreferencesContext must be used within PreferencesProvider');
  return value;
}
