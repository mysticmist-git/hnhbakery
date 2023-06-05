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
  newData: T,
  displayingData: T
): boolean => {
  const changed = Object.keys(newData).some(
    (key) => newData[key as keyof T] !== displayingData[key as keyof T]
  );
  return changed;
};

export function checkIfDataChanged(
  originalDisplayingData: BaseObject | null,
  displayingData: BaseObject | null
): boolean {
  if (!originalDisplayingData) {
    alert('No original data found');
    return false;
  }

  if (!displayingData) {
    alert('No displaying data found');
    return false;
  }

  return isDataChanged(originalDisplayingData, displayingData);
}
