import * as React from 'react';

export function makeImmutable<T extends React.ComponentType<any>>(component: T): T {
  const Immutable = React.memo(
    React.forwardRef((props: any, ref: any) => React.createElement(component, { ...props, ref })),
  );
  // @ts-ignore
  Immutable.displayName = `Immutable${component.displayName || component.name || ''}`;
  return Immutable as unknown as T;
}

export function responseImmutable<T extends React.ComponentType<any>>(component: T): T {
  const ResponseImmutable = React.memo(
    React.forwardRef((props: any, ref: any) => React.createElement(component, { ...props, ref })),
  );
  // @ts-ignore
  ResponseImmutable.displayName = `ResponseImmutable${
    component.displayName || component.name || ''
  }`;
  return ResponseImmutable as unknown as T;
}
