/**
 * Local shim for `@rc-component/util`.
 * Maps all needed functions to `rc-util` subpaths (React 17 compatible).
 */

// hooks
export { default as useEvent } from 'rc-util/lib/hooks/useEvent';

export { default as useLayoutEffect } from 'rc-util/lib/hooks/useLayoutEffect';

export { default as useMemo } from 'rc-util/lib/hooks/useMemo';

export { default as useMergedState } from 'rc-util/lib/hooks/useMergedState';

// useControlledState is the @rc-component/util name for useMergedState
export { default as useControlledState } from 'rc-util/lib/hooks/useMergedState';

// isEqual
export { default as isEqual } from 'rc-util/lib/isEqual';
// KeyCode
export { default as KeyCode } from 'rc-util/lib/KeyCode';
// omit
export { default as omit } from 'rc-util/lib/omit';
// pickAttrs
export { default as pickAttrs } from 'rc-util/lib/pickAttrs';

// raf
export { default as raf } from 'rc-util/lib/raf';

// get
export { default as get } from 'rc-util/lib/utils/get';

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
