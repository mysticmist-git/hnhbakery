import { CartItem, ICartItem } from '@/@types/cart';

export class CartItemFactory {
  create(userId: string, batchId: string, quantity: number): ICartItem {
    return new CartItem(userId, batchId, quantity);
  }
}
