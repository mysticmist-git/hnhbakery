import { AssembledCartItem, CartItem } from '@/@types/cart';
import { getBatchById } from '@/lib/DAO/batchDAO';
import { getProduct } from '@/lib/DAO/productDAO';
import { getVariant } from '@/lib/DAO/variantDAO';

class AssembledCartItemBuilder {
  private _item: AssembledCartItem | null = null;

  constructor(item?: CartItem) {
    if (item) this._item = new AssembledCartItem(item?.clone());
  }

  async fetchBatch(): Promise<AssembledCartItemBuilder> {
    if (!this._item) throw new Error('Item not found');

    try {
      const batch = await getBatchById(this._item.batchId);
      this._item.batch = batch ?? null;
    } catch (error) {
      console.log(error);
      throw error;
    }

    return this;
  }

  async checkDiscount(): Promise<AssembledCartItemBuilder> {
    if (!this._item) throw new Error('Item not found');

    if (!this._item.batch) await this.fetchBatch();

    if (!this._item.batch) throw new Error('Batch not found');

    if (new Date(this._item.batch.discount.start_at).getTime() < Date.now()) {
      this._item.discounted = true;

      if (this._item.variant) {
        this._item.discountAmount =
          (this._item.batch.discount.percent / 100) * this._item.variant.price;
      }
    }

    return this;
  }

  async fetchProduct(): Promise<AssembledCartItemBuilder> {
    if (!this._item) throw new Error('Item not found');

    if (!this._item.batch) await this.fetchBatch();

    if (!this._item.batch) throw new Error('Batch not found');

    try {
      const product = await getProduct(
        this._item.batch.product_type_id,
        this._item.batch.product_id
      );

      this._item.product = product ?? null;
      this._item.image = product?.images[0] ?? '';
    } catch (error) {
      console.log(error);
      throw error;
    }

    return this;
  }

  async fetchVariant(): Promise<AssembledCartItemBuilder> {
    if (!this._item) throw new Error('Item not found');

    if (!this._item.batch) await this.fetchBatch();

    if (!this._item.batch) throw new Error('Batch not found');

    if (!this._item.product) await this.fetchProduct();

    if (!this._item.product) throw new Error('Product not found');

    const variant = await getVariant(
      this._item.product?.product_type_id,
      this._item.product.id,
      this._item.batch.variant_id
    );

    this._item.variant = variant ?? null;

    return this;
  }

  reset(item: CartItem): AssembledCartItemBuilder {
    this._item = new AssembledCartItem(item);
    return this;
  }

  build(): AssembledCartItem {
    if (!this._item) throw new Error('Item not found');
    return this._item;
  }
}

export default AssembledCartItemBuilder;
