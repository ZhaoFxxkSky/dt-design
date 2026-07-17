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

  it('re-measures visible items when items change', () => {
    const renderList = (data: typeof items) => (
      <OverflowList
        items={data}
        visibleItemRenderer={(item) => <span key={item.id}>{item.label}</span>}
        overflowRenderer={(overflow) => <span>+{overflow.length}</span>}
      />
    );
    const { container, rerender, queryByText } = render(renderList(items));

    // 模拟布局宽度：容器 120px，每个 item 50px，只能容纳 2 个
    Object.defineProperty(container.firstChild, 'offsetWidth', {
      value: 120,
      configurable: true,
    });
    const rectSpy = jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 50,
      height: 20,
      top: 0,
      left: 0,
      right: 50,
      bottom: 20,
      x: 0,
      y: 0,
      toJSON: () => {},
    } as DOMRect);

    try {
      rerender(
        renderList([
          { id: 4, label: 'Item 4' },
          { id: 5, label: 'Item 5' },
          { id: 6, label: 'Item 6' },
        ]),
      );

      expect(queryByText('Item 4')).toBeInTheDocument();
      expect(queryByText('Item 5')).toBeInTheDocument();
      expect(queryByText('Item 6')).not.toBeInTheDocument();
    } finally {
      rectSpy.mockRestore();
    }
  });

  it('keeps item DOM nodes across re-renders (no remount)', () => {
    const renderList = () => (
      <OverflowList
        items={items}
        visibleItemRenderer={(item) => <span>{item.label}</span>}
        overflowRenderer={() => null}
      />
    );
    const { container, rerender } = render(renderList());
    const before = Array.from(container.querySelectorAll('.ant-overflow-list-item'));

    rerender(renderList());

    const after = Array.from(container.querySelectorAll('.ant-overflow-list-item'));
    expect(after.length).toBeGreaterThan(0);
    expect(after.length).toBe(before.length);
    after.forEach((node, i) => expect(node).toBe(before[i]));
  });

  it('does not get stuck in measuring state in scroll mode when items change', () => {
    const renderList = (data: typeof items) => (
      <OverflowList
        items={data}
        renderMode="scroll"
        visibleItemRenderer={(item) => <span key={item.id}>{item.label}</span>}
        overflowRenderer={(overflow) => <span>+{overflow.length}</span>}
      />
    );
    const { container, rerender, getByText } = render(renderList(items));
    // scroll 模式初始不渲染 overflow 指示节点
    expect(container.querySelector('.ant-overflow-list-overflow')).toBeNull();

    rerender(
      renderList([
        { id: 4, label: 'Item 4' },
        { id: 5, label: 'Item 5' },
      ]),
    );

    // items 变更后不应卡在 measuring 态：overflow 指示节点不应渲染
    expect(container.querySelector('.ant-overflow-list-overflow')).toBeNull();
    expect(getByText('Item 4')).toBeInTheDocument();
    expect(getByText('Item 5')).toBeInTheDocument();
  });

  it('renders primitive items without crashing', () => {
    const renderList = () => (
      <OverflowList
        items={['a', 'b', 'c'] as any}
        visibleItemRenderer={(item) => <span>{String(item)}</span>}
        overflowRenderer={() => null}
      />
    );
    const { getByText, rerender } = render(renderList());
    expect(getByText('a')).toBeInTheDocument();
    expect(getByText('b')).toBeInTheDocument();
    expect(getByText('c')).toBeInTheDocument();

    rerender(renderList());
    expect(getByText('a')).toBeInTheDocument();
  });
});
