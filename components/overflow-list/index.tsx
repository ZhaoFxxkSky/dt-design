import type { ReactElement, ReactNode } from 'react';
import React, { Component, createRef } from 'react';
import { globalConfig } from 'antd/lib/config-provider';

import './style';

import clsx from 'clsx';

import ReactResizeObserver from '../resize-observer';

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

  componentDidUpdate(prevProps: OverflowListProps<T>) {
    if (prevProps.items !== this.props.items || prevProps.renderMode !== this.props.renderMode) {
      this.setState(
        { isMeasuring: true, visibleCount: this.props.items.length },
        this.measureAndAdjust,
      );
    }
  }

  private measureAndAdjust = () => {
    const container = this.containerRef.current;
    // 非 collapse 模式（或容器未挂载）无需测量：复位 isMeasuring，
    // 避免 items/renderMode 变更后组件卡在 measuring 态、overflow 指示节点恒渲染
    if (!container || this.props.renderMode !== 'collapse') {
      if (this.state.isMeasuring) {
        this.setState({ isMeasuring: false });
      }
      return;
    }

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

  // item → key 缓存：同一 item 对象始终映射到同一个 key，保证跨 render key 稳定
  private itemKeyCache = new WeakMap<object, string>();
  private nextItemKeyId = 0;

  private getItemKey = (item: OverflowItem<T>, index: number): string => {
    // WeakMap 只接受对象键：原始类型（string/number 等）item 回退到基于 index 的稳定 key
    if (typeof item !== 'object' || item === null) {
      return `overflow-list-item-index-${index}`;
    }
    let key = this.itemKeyCache.get(item);
    if (key === undefined) {
      key = `overflow-list-item-${this.nextItemKeyId++}`;
      this.itemKeyCache.set(item, key);
    }
    return key;
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

        const child = visibleItemRenderer(item, i);
        // 优先使用渲染元素自带的 key；否则用 item 对象身份维系的稳定 key，
        // 避免每次 render 生成全新 key 导致 item DOM 全量重挂载
        const key = child.key ?? this.getItemKey(item, i);

        return (
          <div
            key={key}
            ref={(el) => {
              if (el) this.itemRefs.set(i, el);
              else this.itemRefs.delete(i);
            }}
            className={`${this.prefixCls}-item`}
          >
            {child}
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
