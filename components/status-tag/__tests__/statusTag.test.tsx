import React from 'react';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import StatusTag from '../index';

describe('StatusTag', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders children text', () => {
    const { getByText } = render(<StatusTag>Active</StatusTag>);
    expect(getByText('Active')).toBeTruthy();
  });

  it('renders with preset color', () => {
    const { container } = render(<StatusTag color="blue">Blue</StatusTag>);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with outline type', () => {
    const { container } = render(<StatusTag type="outline">Outlined</StatusTag>);
    expect(container.firstChild?.className).toMatch(/border/);
  });

  it('renders with fill type', () => {
    const { container } = render(<StatusTag type="fill" color="red">Filled</StatusTag>);
    expect(container.firstChild?.className).toMatch(/fill/);
  });

  it('renders with rounded corners', () => {
    const { container } = render(<StatusTag rounded>Rounded</StatusTag>);
    expect(container.firstChild?.className).toMatch(/rounded/);
  });

  it('renders loading indicator', () => {
    const { container } = render(<StatusTag loading>Loading</StatusTag>);
    expect(container.firstChild).toHaveAttribute('aria-busy', 'true');
  });

  it('renders custom icon when provided', () => {
    const { container } = render(
      <StatusTag icon={<span data-testid="custom-icon">★</span>}>Starred</StatusTag>,
    );
    expect(container.querySelector('[data-testid="custom-icon"]')).toBeTruthy();
  });
});
