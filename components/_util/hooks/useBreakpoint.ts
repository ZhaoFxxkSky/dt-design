import * as React from 'react';

export const responsiveArray = ['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs'] as const;

export type Breakpoint = (typeof responsiveArray)[number];
export type ScreenMap = Partial<Record<Breakpoint, boolean>>;

// Simplified responsive observer that always returns all breakpoints as true
// (We don't depend on antd v5 theme tokens for screen sizes)
const defaultScreenMap: ScreenMap = {
  xxxl: true,
  xxl: true,
  xl: true,
  lg: true,
  md: true,
  sm: true,
  xs: true,
};

export function useBreakpoint(needResponsive?: boolean): ScreenMap {
  const [screens, setScreens] = React.useState<ScreenMap>(defaultScreenMap);

  React.useEffect(() => {
    if (!needResponsive) {
      return;
    }

    const mediaQueries: Record<string, MediaQueryList> = {
      xs: window.matchMedia('(max-width: 575px)'),
      sm: window.matchMedia('(min-width: 576px)'),
      md: window.matchMedia('(min-width: 768px)'),
      lg: window.matchMedia('(min-width: 992px)'),
      xl: window.matchMedia('(min-width: 1200px)'),
      xxl: window.matchMedia('(min-width: 1600px)'),
      xxxl: window.matchMedia('(min-width: 2000px)'),
    };

    const update = () => {
      const newScreens: ScreenMap = {};
      Object.keys(mediaQueries).forEach((key) => {
        newScreens[key as Breakpoint] = mediaQueries[key].matches;
      });
      setScreens(newScreens);
    };

    update();

    const listeners: Array<() => void> = [];
    Object.keys(mediaQueries).forEach((key) => {
      const mql = mediaQueries[key];
      const handler = () => update();
      if (mql.addEventListener) {
        mql.addEventListener('change', handler);
      } else {
        // Legacy browsers use deprecated addListener API
        (mql as MediaQueryList & { addListener: (cb: () => void) => void }).addListener(handler);
      }
      listeners.push(() => {
        if (mql.removeEventListener) {
          mql.removeEventListener('change', handler);
        } else {
          (mql as MediaQueryList & { removeListener: (cb: () => void) => void }).removeListener(
            handler,
          );
        }
      });
    });

    return () => {
      listeners.forEach((fn) => fn());
    };
  }, [needResponsive]);

  return screens;
}

export default useBreakpoint;
