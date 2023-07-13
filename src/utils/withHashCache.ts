export type OriginalFunction<TArgs extends any[], TResult> = (
  ...args: TArgs
) => TResult;

export function withHashCache<TArgs extends any[], TResult>(
  originalFunc: OriginalFunction<TArgs, TResult>
): OriginalFunction<TArgs, TResult> {
  const cache = new Map();

  function withHashCacheFunction(...args: TArgs) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    } else {
      const result = originalFunc(...args);
      cache.set(key, result);
      return result;
    }
  }

  return withHashCacheFunction;
}

export type OriginalAsyncFunction<TArgs extends any[], TResult> = (
  ...args: TArgs
) => Promise<TResult>;

export function withHashCacheAsync<TArgs extends any[], TResult>(
  originalFunc: OriginalAsyncFunction<TArgs, TResult>
): OriginalAsyncFunction<TArgs, TResult> {
  const cache = new Map<string, TResult>();

  async function withHashCacheAsync(...args: TArgs): Promise<TResult> {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    } else {
      const result = await originalFunc(...args);
      cache.set(key, result);
      return result;
    }
  }

  return withHashCacheAsync;
}
