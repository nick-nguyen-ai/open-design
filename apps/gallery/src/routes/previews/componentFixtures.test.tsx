// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { components } from '../../data/registry.js';
import { ComponentLivePreview, hasLivePreview } from './componentFixtures.js';

afterEach(cleanup);

describe('component live previews', () => {
  it('covers every component in the registry', () => {
    const missing = components.filter((c) => !hasLivePreview(c.id)).map((c) => c.id);
    expect(missing).toEqual([]);
  });

  it('renders every preview without crashing', () => {
    for (const comp of components) {
      const { unmount } = render(<ComponentLivePreview componentId={comp.id} />);
      unmount();
    }
  });

  it('renders the family-and-kind diagram for dgm components', () => {
    const { container } = render(<ComponentLivePreview componentId="comp.dgm.gazette.timeline" />);
    expect(container.querySelector('[data-testid="dgm-gazette-timeline"]')).not.toBeNull();
  });
});
