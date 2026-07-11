import { describe, expect, it } from 'vitest';
import {
  activeFilterCount,
  browseStateFromParams,
  browseStateToParams,
  emptyBrowseState,
  entityTypesForMode,
  toFacetFilter,
  type BrowseState,
} from './browseState.js';

describe('entityTypesForMode', () => {
  it('maps each mode to its eligible entity types', () => {
    expect(entityTypesForMode('templates')).toEqual(['experience']);
    expect(entityTypesForMode('components')).toEqual(['component']);
    expect(entityTypesForMode('grammars')).toEqual(['grammar']);
    expect(entityTypesForMode('all')).toEqual(['experience', 'component', 'grammar']);
  });
});

describe('toFacetFilter', () => {
  it('omits empty facets and forwards scalar + array facets', () => {
    const filter = toFacetFilter({
      surface: 'dashboard',
      audiences: ['executive', 'technical'],
      density: [],
      corporateSuitability: [],
      motionLevel: 2,
    });
    expect(filter).toEqual({
      surface: 'dashboard',
      audiences: ['executive', 'technical'],
      motionLevel: 2,
    });
    expect(filter).not.toHaveProperty('density');
  });
});

describe('activeFilterCount', () => {
  it('counts scalar filters as one and array filters per value', () => {
    expect(activeFilterCount(emptyBrowseState().filters)).toBe(0);
    expect(
      activeFilterCount({
        surface: 'dashboard',
        audiences: ['executive', 'technical'],
        density: ['low'],
        corporateSuitability: [],
      }),
    ).toBe(4);
  });
});

describe('URL round-trip', () => {
  it('serialises and parses a full browse state losslessly', () => {
    const state: BrowseState = {
      query: 'model risk',
      mode: 'templates',
      sort: 'name',
      filters: {
        surface: 'dashboard',
        grammarId: 'calm-command',
        motionLevel: 1,
        approval: 'reviewed',
        audiences: ['executive'],
        density: ['medium'],
        corporateSuitability: ['restricted'],
      },
    };
    const params = browseStateToParams(state);
    expect(browseStateFromParams(params)).toEqual(state);
  });

  it('produces a clean, empty query string for a pristine state', () => {
    expect(browseStateToParams(emptyBrowseState()).toString()).toBe('');
  });

  it('drops unknown mode and motion values', () => {
    const params = new URLSearchParams('mode=bogus&motion=9');
    const state = browseStateFromParams(params);
    expect(state.mode).toBe('all');
    expect(state.filters.motionLevel).toBeUndefined();
  });
});
