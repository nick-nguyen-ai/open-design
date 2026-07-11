/**
 * A localStorage wrapper that never throws — private-mode, disabled storage,
 * or quota errors degrade to no-ops so the app stays fully usable when storage
 * is unavailable (a hard requirement for the recently-viewed feature).
 */
export function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore — storage unavailable
  }
}

export function removeStorage(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
