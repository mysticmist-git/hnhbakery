import { createContext, useCallback, useContext, useState } from 'react';

export type LoadingServiceType = [() => void, () => void];

export function useLoading(): [boolean, () => void, () => void] {
  const [open, setOpen] = useState(false);

  const handleLoad = useCallback(function () {
    setOpen(true);
  }, []);

  const handleStop = useCallback(function () {
    setOpen(false);
  }, []);

  return [open, handleLoad, handleStop];
}

export const LoadingService = createContext<LoadingServiceType>([
  () => {},
  () => {},
]);

export default function useLoadingService() {
  const [load, stop] = useContext(LoadingService);

  return [load, stop];
}
