import { CartItem } from '@/@types/cart';

export class CartItemFactory {
  create(userId: string, batchId: string, quantity: number): CartItem {
    return new CartItem(userId, batchId, quantity);
  }
}
