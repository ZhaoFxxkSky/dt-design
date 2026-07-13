import * as React from 'react';

export function useTimeoutLock<State>(
  defaultState?: State,
): [(state: State) => void, () => State | null] {
  const frameRef = React.useRef<State | null>(defaultState ?? null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  function cleanUp() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }

  function setState(newState: State) {
    frameRef.current = newState;
    cleanUp();
    timeoutRef.current = setTimeout(() => {
      frameRef.current = null;
      timeoutRef.current = null;
    }, 100);
  }

  function getState(): State | null {
    return frameRef.current;
  }

  React.useEffect(() => cleanUp, []);

  return [setState, getState];
}
