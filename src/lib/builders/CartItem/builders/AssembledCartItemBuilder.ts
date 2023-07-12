import { AssembledCartItem, CartItem } from '@/@types/cart';
import { COLLECTION_NAME } from '@/lib/constants';
import { getDocFromFirestore } from '@/lib/firestore';
import { BatchObject, ProductObject } from '@/lib/models';

class AssembledCartItemBuilder {
  private _item: AssembledCartItem;

  constructor(item?: CartItem) {
    this._item = new AssembledCartItem(item);
  }

  async fetchBatch() {
    try {
      const batch = await getDocFromFirestore<BatchObject>(
        COLLECTION_NAME.BATCHES,
        this._item.batchId
      );
      this._item.batch = batch;
    } catch (error) {
      console.log(error);
      return;
    }

    return this;
  }

  checkDiscount() {
    if (!this._item.batch) return;

    if (
      new Date(this._item.batch.discount.date).getTime() < new Date().getTime()
    ) {
      this._item.discounted = true;

      if (this._item.variant) {
        this._item.discountAmount =
          this._item.batch.discount.percent * this._item.variant.price;
      }
    }
  }

  async fetchProduct() {
    if (!this._item.batch) await this.fetchBatch();

    if (!this._item.batch) return;

    try {
      const product = await getDocFromFirestore<ProductObject>(
        COLLECTION_NAME.PRODUCTS,
        this._item.batch.product_id
      );
      this._item.product = product;
    } catch (error) {
      console.log(error);
      return;
    }

    return this;
  }

  async fetchVariant() {
    if (!this._item.product) await this.fetchProduct();

    if (!this._item.product) return;

    this._item.variant =
      this._item.product.variants.find(
        (v) => v.id === this._item.batch?.variant_id
      ) ?? null;

    return this;
  }

  reset(item: CartItem) {
    this._item = new AssembledCartItem(item);
  }

  build(): AssembledCartItem {
    return this._item;
  }
}

export default AssembledCartItemBuilder;
