import { BaseObject } from '../models';

export const isDataChanged = <T extends BaseObject>(
  first: T,
  second: T
): boolean => {
  const changed = Object.keys(first).some(
    (key) => first[key as keyof T] !== second[key as keyof T]
  );
  return changed;
};
