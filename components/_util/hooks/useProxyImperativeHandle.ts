import type { DependencyList, Ref } from 'react';
import { useImperativeHandle } from 'react';

const fillProxy = (
  element: HTMLElement & { _dtProxy?: Record<string, unknown> },
  handler: Record<string, unknown>,
) => {
  element._dtProxy = element._dtProxy || {};

  Object.keys(handler).forEach((key) => {
    if (!(key in element._dtProxy!)) {
      const ori = (element as unknown as Record<string, unknown>)[key];
      element._dtProxy![key] = ori;

      (element as unknown as Record<string, unknown>)[key] = handler[key];
    }
  });

  return element;
};

export const useProxyImperativeHandle = <
  NativeElementType extends HTMLElement,
  ReturnRefType extends { nativeElement: NativeElementType },
>(
  ref: Ref<any> | undefined,
  init: () => ReturnRefType,
  deps?: DependencyList,
) => {
  return useImperativeHandle(
    ref,
    (): ReturnRefType => {
      const refObj = init();
      const { nativeElement } = refObj;

      // null guard: ref 尚未挂载时（SSR / 首次 render / Strict Mode 二次挂载）
      // 返回 refObj 本身，避免 Proxy(null) 导致 Reflect.get 崩溃
      if (!nativeElement) {
        return refObj;
      }

      if (typeof Proxy !== 'undefined') {
        const refObjKeys = new Set(Object.keys(refObj));
        return new Proxy(nativeElement, {
          get(obj: NativeElementType, prop: string | symbol) {
            if (refObjKeys.has(prop as string)) {
              return refObj[prop as keyof ReturnRefType];
            }
            return Reflect.get(obj, prop);
          },
        }) as unknown as ReturnRefType;
      }

      // Fallback of IE
      return fillProxy(nativeElement, refObj as unknown as Record<string, unknown>) as unknown as ReturnRefType;
    },
    deps,
  );
};
