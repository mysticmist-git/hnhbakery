import { DocumentData } from 'firebase/firestore';

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

export const isDataChanged = (
  newData: Record<string, unknown>,
  displayingData: Record<string, unknown>,
): boolean => {
  const changed = Object.keys(newData).some(
    (key) => newData[key] !== displayingData[key],
  );
  return changed;
};

export function checkIfDataChanged(
  originalDisplayingData: DocumentData | null,
  displayingData: DocumentData | null,
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
