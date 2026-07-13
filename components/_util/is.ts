export const isNonNullable = <T>(val: T): val is NonNullable<T> => {
  return val !== undefined && val !== null;
};

export const isNumber = (val: any): val is number => {
  return typeof val === 'number' && !Number.isNaN(val);
};

export const isString = (val: any): val is string => {
  return typeof val === 'string';
};

export const isPlainObject = <T extends object = object>(val: any): val is T => {
  return val !== null && typeof val === 'object';
};

export const isFunction = (val: any): val is (...args: any[]) => any => {
  return typeof val === 'function';
};
