import { getDOM } from 'rc-util/es/Dom/findDOMNode';

export function getOffset(node: HTMLElement | Window) {
  // All call sites pass a mounted element (never `window` or `null`).
  const element = getDOM(node)!;
  const box = element.getBoundingClientRect();
  const docElem = document.documentElement;

  // < ie8 not support win.pageXOffset, use docElem.scrollLeft instead
  return {
    left:
      box.left +
      (window.pageXOffset || docElem.scrollLeft) -
      (docElem.clientLeft || document.body.clientLeft || 0),
    top:
      box.top +
      (window.pageYOffset || docElem.scrollTop) -
      (docElem.clientTop || document.body.clientTop || 0),
  };
}
