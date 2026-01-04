import type { Ref } from 'react';
import { useImperativeHandle } from 'react';

const fillProxy = (
  element: HTMLElement & { _dtProxy?: Record<string, any> },
  handler: Record<string, any>,
) => {
  element._dtProxy = element._dtProxy || {};

  Object.keys(handler).forEach((key) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (!(key in element._dtProxy!)) {
      const ori = (element as any)[key];
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      element._dtProxy![key] = ori;

      (element as any)[key] = handler[key];
    }
  });

  return element;
};

export const useProxyImperativeHandle = <
  NativeELementType extends HTMLElement,
  ReturnRefType extends { nativeElement: NativeELementType },
>(
  ref: Ref<any> | undefined,
  init: () => ReturnRefType,
) => {
  return useImperativeHandle(ref, () => {
    const refObj = init();
    const { nativeElement } = refObj;

    if (typeof Proxy !== 'undefined') {
      return new Proxy(nativeElement, {
        get(obj: any, prop: any) {
          if ((refObj as any)[prop]) {
            return (refObj as any)[prop];
          }

          return Reflect.get(obj, prop);
        },
      });
    }

    // Fallback of IE
    return fillProxy(nativeElement, refObj);
  });
};
