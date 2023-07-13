import { AssembledCartItem, CartItem } from '@/@types/cart';
import { COLLECTION_NAME } from '@/lib/constants';
import {
  getDocFromFirestore,
  getDownloadUrlFromFirebaseStorage,
} from '@/lib/firestore';
import {
  BatchObject,
  ProductObject,
  ProductObjectWithURLs,
} from '@/lib/models';

class AssembledCartItemBuilder {
  private _item: AssembledCartItem;

  constructor(item?: CartItem) {
    this._item = new AssembledCartItem(item);
  }

  async fetchBatch(): Promise<AssembledCartItemBuilder> {
    try {
      const batch = await getDocFromFirestore<BatchObject>(
        COLLECTION_NAME.BATCHES,
        this._item.batchId
      );
      this._item.batch = batch;
    } catch (error) {
      console.log(error);
      throw error;
    }

    return this;
  }

  async checkDiscount(): Promise<AssembledCartItemBuilder> {
    if (!this._item.batch) await this.fetchBatch();

    if (!this._item.batch) throw new Error('Batch not found');

    if (
      new Date(this._item.batch.discount.date).getTime() < new Date().getTime()
    ) {
      this._item.discounted = true;

      if (this._item.variant) {
        this._item.discountAmount =
          this._item.batch.discount.percent * this._item.variant.price;
      }
    }

    return this;
  }

  async fetchProduct(): Promise<AssembledCartItemBuilder> {
    if (!this._item.batch) await this.fetchBatch();

    if (!this._item.batch) throw new Error('Batch not found');

    try {
      const product = await getDocFromFirestore<ProductObject>(
        COLLECTION_NAME.PRODUCTS,
        this._item.batch.product_id
      );

      this._item.product = product;
      const image =
        product.images.length ?? 0
          ? await getDownloadUrlFromFirebaseStorage(product.images[0])
          : '';
      console.log(image);
      this._item.image = image;
    } catch (error) {
      console.log(error);
      throw error;
    }

    return this;
  }

  async fetchVariant(): Promise<AssembledCartItemBuilder> {
    if (!this._item.product) await this.fetchProduct();

    if (!this._item.product) throw new Error('Product not found');

    this._item.variant =
      this._item.product.variants.find(
        (v) => v.id === this._item.batch?.variant_id
      ) ?? null;

    return this;
  }

  reset(item: CartItem): AssembledCartItemBuilder {
    this._item = new AssembledCartItem(item);
    return this;
  }

  build(): AssembledCartItem {
    return this._item;
  }
}

export default AssembledCartItemBuilder;
