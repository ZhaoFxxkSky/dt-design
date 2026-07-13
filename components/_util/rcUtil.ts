/**
 * Local shim for `@rc-component/util`.
 * Maps all needed functions to `rc-util` subpaths (React 17 compatible).
 */

// hooks
export { default as useEvent } from 'rc-util/es/hooks/useEvent';

export { default as useLayoutEffect } from 'rc-util/es/hooks/useLayoutEffect';

export { default as useMemo } from 'rc-util/es/hooks/useMemo';

export { default as useMergedState } from 'rc-util/es/hooks/useMergedState';

// useControlledState is the @rc-component/util name for useMergedState
export { default as useControlledState } from 'rc-util/es/hooks/useMergedState';

// isEqual
export { default as isEqual } from 'rc-util/es/isEqual';
// KeyCode
export { default as KeyCode } from 'rc-util/es/KeyCode';
// omit
export { default as omit } from 'rc-util/es/omit';
// pickAttrs
export { default as pickAttrs } from 'rc-util/es/pickAttrs';

// raf
export { default as raf } from 'rc-util/es/raf';

// get
export { default as get } from 'rc-util/es/utils/get';

// toArray - implement locally (rc-util doesn't export this at top level)
export function toArray<T>(value: T | T[]): T[] {
  if (value === undefined || value === null) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

// mergeProps - implement locally
// Merges multiple props objects, later ones win for primitive values,
// functions are chained
export function mergeProps<T extends Record<string, any>>(...args: (Partial<T> | undefined)[]): T {
  const result = {} as T;

  for (const props of args) {
    if (!props) continue;
    for (const key of Object.keys(props) as (keyof T)[]) {
      const value = props[key];
      if (value !== undefined) {
        (result as any)[key] = value;
      }
    }
  }

  return result;
}
