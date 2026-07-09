import * as React from 'react';
import isEqual from 'rc-util/es/isEqual';

/**
 * HOC that prevents re-render when props are equal.
 */
export function makeImmutable<T extends React.ComponentType<any>>(Component: T): T {
  const componentName = Component.displayName || Component.name || 'Component';

  const ForwardedComponent = React.forwardRef<any, any>((props, ref) => (
    <Component ref={ref} {...props} />
  ));
  ForwardedComponent.displayName = `Immutable(${componentName})`;

  const MemoComponent = React.memo(ForwardedComponent, (prevProps, nextProps) =>
    isEqual(prevProps, nextProps),
  );
  (MemoComponent as any).displayName = `Immutable(${componentName})`;

  return MemoComponent as T;
}

/**
 * HOC that simply memoizes a component.
 */
export function responseImmutable<T extends React.ComponentType<any>>(Component: T): T {
  const componentName = Component.displayName || Component.name || 'Component';

  const ResponseComponent: React.FC<any> = (props) => <Component {...props} />;
  ResponseComponent.displayName = `ResponseImmutable(${componentName})`;

  const MemoComponent = React.memo(ResponseComponent);
  (MemoComponent as any).displayName = `ResponseImmutable(${componentName})`;

  return MemoComponent as T;
}
