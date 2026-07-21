// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { ComponentPreviewFrame } from './ComponentPreviewFrame.js';

afterEach(cleanup);

describe('ComponentPreviewFrame', () => {
  it(
    'mounts the live component preview once in view',
    async () => {
      render(<ComponentPreviewFrame componentId="comp.dgm.circuit.flow" />);
      // The lazy fixture import is load-sensitive under the full parallel
      // suite; give it headroom beyond the vitest default.
      expect(
        await screen.findByTestId('component-live-preview', {}, { timeout: 15000 }),
      ).toBeTruthy();
      expect(document.querySelector('[data-testid="dgm-circuit-flow"]')).not.toBeNull();
    },
    20000,
  );

  it('renders nothing for a component without a fixture', () => {
    const { container } = render(<ComponentPreviewFrame componentId="comp.unknown" />);
    expect(container.querySelector('[data-testid="component-live-preview"]')).toBeNull();
  });
});
