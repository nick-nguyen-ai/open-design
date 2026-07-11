// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useRecentlyViewed } from './useRecentlyViewed.js';

const ITEM = {
  id: 'db-ai-risk-command-centre',
  entityType: 'experience' as const,
  title: 'AI Risk Command Centre',
  route: '/templates/db-ai-risk-command-centre',
};

describe('useRecentlyViewed', () => {
  beforeEach(() => {
    window.localStorage.clear();
    // Reset the module-level cache between tests.
    const { result } = renderHook(() => useRecentlyViewed());
    act(() => result.current.clear());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it('records items most-recent-first and de-duplicates by id', () => {
    const { result } = renderHook(() => useRecentlyViewed());
    act(() => {
      result.current.record(ITEM);
      result.current.record({ ...ITEM, id: 'second', title: 'Second' });
      result.current.record(ITEM); // re-record moves it to the front
    });
    expect(result.current.items.map((i) => i.id)).toEqual(['db-ai-risk-command-centre', 'second']);
  });

  it('persists to localStorage and clears', () => {
    const { result } = renderHook(() => useRecentlyViewed());
    act(() => result.current.record(ITEM));
    expect(window.localStorage.getItem('gallery.recentlyViewed')).toContain('db-ai-risk-command-centre');
    act(() => result.current.clear());
    expect(result.current.items).toHaveLength(0);
  });

  it('degrades gracefully when localStorage throws', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage disabled');
    });
    const { result } = renderHook(() => useRecentlyViewed());
    expect(() => act(() => result.current.record(ITEM))).not.toThrow();
    // The in-memory cache still reflects the record, keeping the UI usable.
    expect(result.current.items.map((i) => i.id)).toContain('db-ai-risk-command-centre');
  });
});
