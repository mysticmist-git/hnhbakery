export class CartItem {
  userId: string;
  batchId: string;
  quantity: number;

  constructor(userId: string, batchId: string, quantity: number) {
    this.userId = userId;
    this.batchId = batchId;
    this.quantity = quantity;
  }
}

export class CartItemFactory {
  userId: string;
  batchId: string;
  quantity: number;

  constructor(userId: string, batchId: string, quantity: number) {
    this.userId = userId;
    this.batchId = batchId;
    this.quantity = quantity;
  }

  create() {
    return new CartItem(this.userId, this.batchId, this.quantity);
  }
}
