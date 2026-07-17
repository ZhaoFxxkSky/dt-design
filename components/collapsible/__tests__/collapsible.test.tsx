import React from 'react';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Collapsible from '../index';

describe('Collapsible', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders closed by default', () => {
    const { container } = render(
      <Collapsible isOpen={false}>
        <div>content</div>
      </Collapsible>,
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('renders open when isOpen is true', () => {
    const { container } = render(
      <Collapsible isOpen>
        <div>visible content</div>
      </Collapsible>,
    );
    expect(container.firstChild).toBeTruthy();
    expect(container.textContent).toContain('visible content');
  });

  it('applies custom className and style', () => {
    const { container } = render(
      <Collapsible isOpen className="custom-cls" style={{ width: 200 }}>
        <div>content</div>
      </Collapsible>,
    );
    expect(container.firstChild).toHaveClass('custom-cls');
  });

  it('renders without motion when motion is false', () => {
    const { container } = render(
      <Collapsible isOpen motion={false}>
        <div>content</div>
      </Collapsible>,
    );
    expect(container.firstChild).toBeTruthy();
    expect(container.textContent).toContain('content');
  });

  it('renders with custom collapseHeight', () => {
    const { container } = render(
      <Collapsible isOpen={false} collapseHeight={50}>
        <div>content</div>
      </Collapsible>,
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('uses collapsible prefix for wrapper class', () => {
    const { container } = render(
      <Collapsible isOpen>
        <div>content</div>
      </Collapsible>,
    );
    expect(container.firstChild).toHaveClass('ant-collapsible-wrapper');
    expect(container.firstChild).not.toHaveClass('ant-splitter-wrapper');
  });
});
