import BaseObject from '../models/BaseObject';

// Get image if there's any
export const memoize = (fn: any) => {
  const cache = new Map();
  return async (...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log('cache');
      return cache.get(key);
    }
    const result = await fn(...args);
    cache.set(key, result);
    return result;
  };
};

export const isDataChanged = <T extends BaseObject>(
  first: T,
  second: T
): boolean => {
  const changed = Object.keys(first).some(
    (key) => first[key as keyof T] !== second[key as keyof T]
  );
  return changed;
};
