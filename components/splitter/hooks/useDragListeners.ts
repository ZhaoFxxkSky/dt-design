import useLayoutEffect from 'rc-util/es/hooks/useLayoutEffect';

type StartPos = readonly [number, number];

export interface UseDragListenersOptions {
  startPos: StartPos | null;
  vertical: boolean;
  lazy?: boolean;
  onOffsetUpdate: (index: number, offsetX: number, offsetY: number, lazyEnd?: boolean) => void;
  onOffsetEnd: (lazyEnd?: boolean) => void;
  handleLazyMove: (offsetX: number, offsetY: number) => void;
  handleLazyEnd: () => void;
  setStartPos: (pos: StartPos | null) => void;
  index: number;
}

export default function useDragListeners(options: UseDragListenersOptions) {
  const {
    startPos,
    lazy,
    onOffsetUpdate,
    onOffsetEnd,
    handleLazyMove,
    handleLazyEnd,
    setStartPos,
    index,
  } = options;

  useLayoutEffect(() => {
    if (!startPos) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      const { pageX, pageY } = e;
      const offsetX = pageX - startPos[0];
      const offsetY = pageY - startPos[1];
      if (lazy) {
        handleLazyMove(offsetX, offsetY);
      } else {
        onOffsetUpdate(index, offsetX, offsetY);
      }
    };

    const onMouseUp = () => {
      if (lazy) {
        handleLazyEnd();
      } else {
        onOffsetEnd();
      }
      setStartPos(null);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        e.preventDefault();
        const touch = e.touches[0];
        const offsetX = touch.pageX - startPos[0];
        const offsetY = touch.pageY - startPos[1];
        if (lazy) {
          handleLazyMove(offsetX, offsetY);
        } else {
          onOffsetUpdate(index, offsetX, offsetY);
        }
      }
    };

    const handleTouchEnd = () => {
      if (lazy) {
        handleLazyEnd();
      } else {
        onOffsetEnd();
      }
      setStartPos(null);
    };

    const handleMouseLeave = () => {
      if (lazy) {
        handleLazyEnd();
      } else {
        onOffsetEnd();
      }
      setStartPos(null);
    };

    const handleBlur = () => {
      if (lazy) {
        handleLazyEnd();
      } else {
        onOffsetEnd();
      }
      setStartPos(null);
    };

    const eventHandlerMap: Partial<Record<keyof WindowEventMap, EventListener>> = {
      mousemove: onMouseMove as EventListener,
      mouseup: onMouseUp,
      touchmove: handleTouchMove as EventListener,
      touchend: handleTouchEnd,
      mouseleave: handleMouseLeave as EventListener,
      blur: handleBlur as EventListener,
    };

    for (const [event, handler] of Object.entries(eventHandlerMap)) {
      // eslint-disable-next-line react-web-api/no-leaked-event-listener
      const options =
        event === 'touchmove' ? ({ passive: false } as AddEventListenerOptions) : undefined;
      window.addEventListener(event, handler, options);
    }

    return () => {
      for (const [event, handler] of Object.entries(eventHandlerMap)) {
        const options =
          event === 'touchmove' ? ({ passive: false } as AddEventListenerOptions) : undefined;
        window.removeEventListener(event, handler, options);
      }
    };
  }, [startPos, index, lazy]);
}
