import type { ReactElement, ReactNode } from 'react';
import React, { Component, createRef } from 'react';
import { globalConfig } from 'antd/es/config-provider';

import './style';

import clsx from 'clsx';

import ReactResizeObserver from '../resizeObserver';

export type OverflowItem<T = Record<string, any>> = T;

export interface OverflowListProps<T = Record<string, any>> {
  items: OverflowItem<T>[];
  visibleItemRenderer: (item: OverflowItem<T>, index: number) => ReactElement;
  overflowRenderer: (overflowItems: OverflowItem<T>[]) => ReactNode | ReactNode[];
  className?: string;
  style?: React.CSSProperties;
  renderMode?: 'collapse' | 'scroll';
  collapseFrom?: 'start' | 'end';
  minVisibleItems?: number;
  onOverflow?: (overflowItems: OverflowItem<T>[]) => void;
}

interface OverflowListState {
  visibleCount: number;
  isMeasuring: boolean;
}

class OverflowList<T extends object> extends Component<OverflowListProps<T>, OverflowListState> {
  public static defaultProps = {
    items: [],
    collapseFrom: 'end',
    minVisibleItems: 0,
    renderMode: 'collapse',
  };

  public static displayName: string;

  private containerRef = createRef<HTMLDivElement>();
  private overflowRef = createRef<HTMLDivElement>();
  private itemRefs = new Map<number, HTMLElement>();
  private prefixCls = 'overflow-list';

  constructor(props: OverflowListProps<T>) {
    super(props);

    this.prefixCls = globalConfig().getPrefixCls(this.prefixCls);
    this.state = {
      visibleCount: props.items.length,
      isMeasuring: props.renderMode === 'collapse',
    };
  }

  componentDidMount() {
    if (this.props.renderMode === 'collapse') {
      this.measureAndAdjust();
    }
  }

  componentUpdate(prevProps: OverflowListProps<T>) {
    if (prevProps.items !== this.props.items || prevProps.renderMode !== this.props.renderMode) {
      this.setState(
        { isMeasuring: true, visibleCount: this.props.items.length },
        this.measureAndAdjust,
      );
    }
  }

  private measureAndAdjust = () => {
    const container = this.containerRef.current;
    if (!container || this.props.renderMode !== 'collapse') return;

    const { items, minVisibleItems, collapseFrom, onOverflow } = this.props;
    const containerWidth = container.offsetWidth;
    const overflowWidth = this.overflowRef.current?.offsetWidth ?? 0;

    let totalWidth = 0;
    let newVisibleCount = 0;

    for (let i = 0; i < items.length; i++) {
      const index = collapseFrom === 'end' ? i : items.length - 1 - i;
      const itemWidth = this.itemRefs.get(index)?.getBoundingClientRect().width ?? 0;

      const isLast = i === items.length - 1;
      const limit = isLast ? containerWidth : containerWidth - overflowWidth;

      if (totalWidth + itemWidth <= limit || newVisibleCount < (minVisibleItems || 0)) {
        totalWidth += itemWidth;
        newVisibleCount++;
      } else {
        break;
      }
    }

    this.setState({ visibleCount: newVisibleCount, isMeasuring: false }, () => {
      if (onOverflow) {
        onOverflow(this.getOverflowItems(newVisibleCount));
      }
    });
  };

  private getOverflowItems = (count: number) => {
    const { items, collapseFrom } = this.props;
    return collapseFrom === 'end' ? items.slice(count) : items.slice(0, items.length - count);
  };

  renderCollapse() {
    const { items, visibleItemRenderer, overflowRenderer, collapseFrom, style, className } =
      this.props;
    const { visibleCount, isMeasuring } = this.state;

    const overflowItems = this.getOverflowItems(visibleCount);
    const hasOverflow = overflowItems.length > 0;

    const containerStyle: React.CSSProperties = {
      maxWidth: '100%',
      visibility: 'visible',
      ...style,
    };

    const renderItems = () => {
      return items.map((item, i) => {
        const isVisible =
          isMeasuring ||
          (collapseFrom === 'end' ? i < visibleCount : i >= items.length - visibleCount);

        if (!isVisible) return null;

        return (
          <div
            key={i}
            ref={(el) => {
              if (el) this.itemRefs.set(i, el);
              else this.itemRefs.delete(i);
            }}
            className={`${this.prefixCls}-item`}
          >
            {visibleItemRenderer(item, i)}
          </div>
        );
      });
    };

    const overflowNode = (hasOverflow || isMeasuring) && (
      <div ref={this.overflowRef} className={`${this.prefixCls}-overflow`}>
        {overflowRenderer(isMeasuring ? items : overflowItems)}
      </div>
    );

    return (
      <ReactResizeObserver
        onResize={() => this.setState({ isMeasuring: true }, this.measureAndAdjust)}
      >
        <div
          ref={this.containerRef}
          className={clsx(this.prefixCls, className)}
          style={containerStyle}
        >
          {collapseFrom === 'start' && overflowNode}
          {renderItems()}
          {collapseFrom === 'end' && overflowNode}
        </div>
      </ReactResizeObserver>
    );
  }

  render() {
    return this.renderCollapse();
  }
}

if (process.env.NODE_ENV === 'development') {
  OverflowList.displayName = 'OverflowList';
}

export default OverflowList;
