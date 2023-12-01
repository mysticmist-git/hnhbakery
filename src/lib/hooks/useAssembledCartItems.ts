import { AssembledCartItem, CartItem } from '@/@types/cart';
import { assembleItems } from '@/lib/pageSpecific/cart';
import { useCallback, useState } from 'react';
import useLoadingService from '@/lib/hooks/useLoadingService';

function useAssembledCartItems(
  init: AssembledCartItem[] = []
): [AssembledCartItem[], (cartItems: CartItem[]) => Promise<void>] {
  const [items, setItems] = useState<AssembledCartItem[]>(init);
  const [load, stop] = useLoadingService();

  const reload = useCallback(async (cartItems: CartItem[]) => {
    if (!cartItems) return;
    load();
    const assembledCartItem = await assembleItems(cartItems);

    setItems(assembledCartItem);
    stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [items, reload];
}

export default useAssembledCartItems;
