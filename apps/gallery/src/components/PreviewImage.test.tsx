// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import '../test/jest-dom-setup.js';
import { PreviewImage } from './PreviewImage.js';

afterEach(cleanup);

describe('PreviewImage', () => {
  it('renders the committed preview path', () => {
    const { container } = render(<PreviewImage id="deck-cloud-migration" alt="Preview" />);
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('src', '/previews/deck-cloud-migration.jpg');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('unmounts itself when the image is missing, leaving the caller fallback', () => {
    const { container } = render(<PreviewImage id="not-a-world" alt="" />);
    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    fireEvent.error(img!);
    expect(container.querySelector('img')).toBeNull();
  });
});
