// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import '../test/jest-dom-setup.js';
import { GrammarSpecimen, specimenFallbackId } from './GrammarSpecimen.js';

afterEach(cleanup);

describe('specimenFallbackId', () => {
  it('returns the first example experience that exists in the registry', () => {
    expect(specimenFallbackId('neon-circuit')).toBe('deck-dgm-circuit');
  });

  it('returns null for an unknown grammar', () => {
    expect(specimenFallbackId('not-a-grammar')).toBeNull();
  });
});

describe('GrammarSpecimen', () => {
  it('renders the specimen preview path first', () => {
    const { container } = render(<GrammarSpecimen grammarId="neon-circuit" alt="" />);
    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      '/previews/grammar-neon-circuit.jpg',
    );
  });

  it('falls back to the first example screenshot when the specimen is missing', () => {
    const { container } = render(<GrammarSpecimen grammarId="neon-circuit" alt="" />);
    fireEvent.error(container.querySelector('img')!);
    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      '/previews/deck-dgm-circuit.jpg',
    );
  });

  it('renders nothing when specimen and example are both missing', () => {
    const { container } = render(<GrammarSpecimen grammarId="neon-circuit" alt="" />);
    fireEvent.error(container.querySelector('img')!);
    fireEvent.error(container.querySelector('img')!);
    expect(container.querySelector('img')).toBeNull();
  });
});
