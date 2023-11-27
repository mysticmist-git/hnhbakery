import { CartItem } from '@/@types/cart';

export class CartItemFactory {
  create(uid: string, batchId: string, quantity: number): CartItem {
    return new CartItem(uid, batchId, quantity);
  }
}
