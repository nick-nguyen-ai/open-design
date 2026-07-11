/**
 * Recently-viewed items, persisted in localStorage only (no network). A tiny
 * subscribe store keeps every mounted view in sync, and every read/write is
 * guarded so the app stays usable when storage is unavailable.
 */
import { useCallback, useSyncExternalStore } from 'react';
import type { EntityType } from '@enterprise-design/contracts';
import { readStorage, removeStorage, writeStorage } from './safeStorage.js';

export interface RecentItem {
  id: string;
  entityType: EntityType;
  title: string;
  route: string;
}

const KEY = 'gallery.recentlyViewed';
const MAX = 8;

let cache: RecentItem[] | null = null;
const listeners = new Set<() => void>();

function load(): RecentItem[] {
  if (cache) return cache;
  const raw = readStorage(KEY);
  if (!raw) {
    cache = [];
    return cache;
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    cache = Array.isArray(parsed) ? (parsed as RecentItem[]) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function emit(): void {
  for (const listener of listeners) listener();
}

export function recordRecent(item: RecentItem): void {
  const current = load();
  const next = [item, ...current.filter((r) => r.id !== item.id)].slice(0, MAX);
  cache = next;
  writeStorage(KEY, JSON.stringify(next));
  emit();
}

export function clearRecent(): void {
  cache = [];
  removeStorage(KEY);
  emit();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useRecentlyViewed(): {
  items: RecentItem[];
  record: (item: RecentItem) => void;
  clear: () => void;
} {
  const items = useSyncExternalStore(subscribe, load, () => []);
  const record = useCallback((item: RecentItem) => recordRecent(item), []);
  const clear = useCallback(() => clearRecent(), []);
  return { items, record, clear };
}
