import React from 'react';

const useScrollShadow = (
  containerRef: React.RefObject<HTMLDivElement>,
  leftClass: string,
  rightClass: string,
  deps: React.DependencyList,
) => {
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const updateShadow = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      const maxScroll = scrollWidth - clientWidth;
      el.classList.toggle(leftClass, scrollLeft > 0);
      el.classList.toggle(rightClass, maxScroll > 0 && scrollLeft < maxScroll - 1);
    };

    updateShadow();
    el.addEventListener('scroll', updateShadow, { passive: true });
    const ro = (window as any).ResizeObserver
      ? new (window as any).ResizeObserver(updateShadow)
      : null;
    if (ro) ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateShadow);
      el.classList.remove(leftClass, rightClass);
      ro?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useScrollShadow;
