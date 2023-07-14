import { CartItem } from '@/@types/cart';
import { useLocalStorageValue } from '@react-hookz/web';
import { NextState } from '@react-hookz/web/cjs/util/resolveHookState';

function useCartItems(): [
  CartItem[] | undefined,
  (val: NextState<CartItem[], CartItem[] | undefined>) => void
] {
  const { value: cart, set: setCart } = useLocalStorageValue<CartItem[]>(
    'cart',
    {
      defaultValue: [],
      initializeWithValue: false,
      parse(str, fallback) {
        if (!str) return fallback;

        const value: any[] = JSON.parse(str);
        const items = value.map(
          (item) =>
            new CartItem(item._userId, item._batchId, item._quantity, item._id)
        );

        return items;
      },
    }
  );

  return [cart, setCart];
}

export default useCartItems;
