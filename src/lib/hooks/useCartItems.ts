import { CartItem } from '@/@types/cart';
import { useLocalStorageValue } from '@react-hookz/web';
import { NextState } from '@react-hookz/web/cjs/util/resolveHookState';
import { useCallback, useEffect, useState } from 'react';
import { LOCAL_CART_KEY } from '../constants';

/**
 *
 * A custom hooks to work with cart in localStorage
 *
 * @returns [cart, setCart, reload]
 */
function useCartItems(): [
  CartItem[] | undefined,
  (value: CartItem[]) => void,
  () => void
] {
  const [cart, setCart] = useState<CartItem[]>([]);

  const setNewCart = useCallback((value: CartItem[]) => {
    setCart(value);
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(value));
  }, []);

  const reload = useCallback(() => {
    const value = localStorage.getItem(LOCAL_CART_KEY);

    if (value) {
      const items: any[] = JSON.parse(value);
      const cart = items.map(
        (item) =>
          new CartItem(item._userId, item._batchId, item._quantity, item._id)
      );
      setCart(cart);
    } else {
      setCart([]);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return [cart, setNewCart, reload];
}

export default useCartItems;
