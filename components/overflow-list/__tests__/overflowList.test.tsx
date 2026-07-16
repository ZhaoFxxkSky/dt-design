import React from 'react';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import OverflowList from '../index';

describe('OverflowList', () => {
  afterEach(() => {
    cleanup();
  });

  const items = [
    { id: 1, label: 'Item 1' },
    { id: 2, label: 'Item 2' },
    { id: 3, label: 'Item 3' },
  ];

  it('renders visible items', () => {
    const { container } = render(
      <OverflowList
        items={items}
        visibleItemRenderer={(item) => <span key={item.id}>{item.label}</span>}
        overflowRenderer={(overflow) => <span>+{overflow.length}</span>}
      />,
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('renders all items when renderMode is scroll', () => {
    const { getByText } = render(
      <OverflowList
        items={items}
        renderMode="scroll"
        visibleItemRenderer={(item) => <span key={item.id}>{item.label}</span>}
        overflowRenderer={() => null}
      />,
    );
    expect(getByText('Item 1')).toBeTruthy();
    expect(getByText('Item 2')).toBeTruthy();
    expect(getByText('Item 3')).toBeTruthy();
  });

  it('applies custom className', () => {
    const { container } = render(
      <OverflowList
        items={items}
        className="custom-overflow"
        visibleItemRenderer={(item) => <span key={item.id}>{item.label}</span>}
        overflowRenderer={() => null}
      />,
    );
    expect(container.firstChild).toHaveClass('custom-overflow');
  });
});
