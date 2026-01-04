import React from 'react';
import { findDOMNode } from 'react-dom';

interface BaseProps {
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

export interface ResizeEntry {
  contentRect: DOMRectReadOnly;
  target: Element;
}

export interface ReactResizeObserverProps extends BaseProps {
  onResize?: (entries: ResizeEntry[]) => void;
  observeParent?: boolean;
  observerProperty?: ObserverProperty;
  delayTick?: number;
  children: React.ReactElement;
}

export enum ObserverProperty {
  Width = 'width',
  Height = 'height',
  All = 'all',
}

export default class ReactResizeObserver extends React.Component<ReactResizeObserverProps> {
  static defaultProps = {
    onResize: () => {},
    observeParent: false,
    observerProperty: ObserverProperty.All,
    delayTick: 0,
  };

  observer: ResizeObserver | null = null;
  childNode: HTMLElement | null = null;
  element: Element | null = null;
  _parentNode: HTMLElement | null = null;
  formerPropertyValue: Map<Element, number> = new Map();

  constructor(props: ReactResizeObserverProps) {
    super(props);
    if (typeof window !== 'undefined' && window.ResizeObserver) {
      this.observer = new window.ResizeObserver(this.handleResizeEventTriggered);
    }
  }

  getElement = (): Element | null => {
    try {
      // eslint-disable-next-line react-dom/no-find-dom-node
      return findDOMNode(this.childNode || this) as Element | null;
      // eslint-disable-next-line unused-imports/no-unused-vars
    } catch (_error) {
      return null;
    }
  };

  handleResizeEventTriggered = (entries: ResizeEntry[]): void => {
    const { observerProperty, onResize } = this.props;

    if (observerProperty === ObserverProperty.All) {
      onResize?.(entries);
    } else {
      const finalEntries: ResizeEntry[] = [];
      for (const entry of entries) {
        const currentValue = entry.contentRect[observerProperty as keyof DOMRectReadOnly] as number;

        if (this.formerPropertyValue.has(entry.target)) {
          if (currentValue !== this.formerPropertyValue.get(entry.target)) {
            this.formerPropertyValue.set(entry.target, currentValue);
            finalEntries.push(entry);
          }
        } else {
          this.formerPropertyValue.set(entry.target, currentValue);
          finalEntries.push(entry);
        }
      }
      if (finalEntries.length > 0) {
        onResize?.(finalEntries);
      }
    }
  };

  observeElement = (force = false): void => {
    if (!this.observer) return;

    const element = this.getElement();
    if (!(element && element instanceof Element)) {
      this.observer.disconnect();
      return;
    }

    if (element === this.element && !force) {
      return;
    } else {
      this.observer.disconnect();
      this.element = element;
    }

    this.observer.observe(element);

    if (this.props.observeParent && element.parentNode) {
      const parentNode = element.parentNode as HTMLElement;
      if (
        parentNode.ownerDocument &&
        parentNode.ownerDocument.defaultView &&
        parentNode instanceof parentNode.ownerDocument.defaultView.HTMLElement
      ) {
        this._parentNode = parentNode;
        this.observer.observe(parentNode);
      }
    }
  };

  mergeRef = (ref: React.Ref<any>, node: HTMLElement): void => {
    this.childNode = node;
    // 转发外部ref
    if (typeof ref === 'function') {
      ref(node);
    } else if (typeof ref === 'object' && ref && 'current' in ref) {
      (ref as React.MutableRefObject<HTMLElement | null>).current = node;
    }
  };

  componentDidMount(): void {
    this.observeElement?.();
  }

  componentDidUpdate(prevProps: ReactResizeObserverProps): void {
    if (this.props.observeParent !== prevProps.observeParent) {
      this.observeElement?.(true);
    }
  }

  componentWillUnmount(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.element = null;
    this._parentNode = null;
    this.formerPropertyValue.clear();
  }

  render(): React.ReactElement {
    const { children, className, style, ...rest } = this.props;
    const child = React.Children.only(children) as React.ReactElement;
    const childRef = (child as any).ref;

    return React.cloneElement(child, {
      ...rest,
      className: className ? `${child.props.className || ''} ${className}` : child.props.className,
      style: { ...child.props.style, ...style },
      ref: (node: HTMLElement) => this.mergeRef(childRef, node),
    });
  }
}
