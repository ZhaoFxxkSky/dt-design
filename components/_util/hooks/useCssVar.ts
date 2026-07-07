import * as React from 'react';

function useCssVar<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  varName: string,
  fallback?: number,
): number | undefined {
  const [value, setValue] = React.useState<number | undefined>(fallback);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const computed = getComputedStyle(el).getPropertyValue(varName).trim();
    if (computed) {
      const num = Number.parseInt(computed, 10);
      if (!Number.isNaN(num)) {
        setValue(num);
      }
    }
  }, [ref, varName, fallback]);

  return value;
}

export default useCssVar;
