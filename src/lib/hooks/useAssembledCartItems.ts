import { AssembledCartItem, CartItem } from '@/@types/cart';
import { assembleItems } from '@/lib/pageSpecific/cart';
import { useState } from 'react';

function useAssembledCartItems(
  init: AssembledCartItem[] = []
): [AssembledCartItem[], (cartItems: CartItem[]) => Promise<void>] {
  const [items, setItems] = useState<AssembledCartItem[]>(init);

  async function reload(cartItems: CartItem[]) {
    if (!cartItems) return;

    const assembledCartItem = await assembleItems(cartItems);

    setItems(assembledCartItem);
  }

  return [items, reload];
}

export default useAssembledCartItems;
