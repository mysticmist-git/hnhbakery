import Batch from '@/models/batch';
import Product from '@/models/product';
import Variant from '@/models/variant';
import { Prototype } from '@/utils/prototype';
import { nanoid } from 'nanoid';

export class CartItem implements Prototype {
  private _id: string = '';
  private _userId: string = '';
  private _batchId: string = '';
  private _quantity: number = 0;

  constructor(
    userId: string,
    batchId: string,
    quantity: number,
    id: string = nanoid(4)
  ) {
    this._id = id;
    this._userId = userId;
    this._batchId = batchId;
    this._quantity = quantity;
  }

  public get id(): string {
    return this._id;
  }

  public set id(value: string) {
    this._id = value;
  }

  public get userId(): string {
    return this._userId;
  }

  public set userId(value: string) {
    this._userId = value;
  }

  public get batchId(): string {
    return this._batchId;
  }

  public set batchId(value: string) {
    this._batchId = value;
  }

  public get quantity(): number {
    return this._quantity;
  }

  public set quantity(value: number) {
    this._quantity = value;
  }

  public clone(): CartItem {
    return new CartItem(this.userId, this.batchId, this.quantity, this.id);
  }

  public print(): string {
    return `${this.userId} ${this.batchId} ${this.quantity}`;
  }
}

export class AssembledCartItem extends CartItem {
  private _href: string = '';
  private _image: string = '';
  private _batch: Batch | null = null;
  private _variant: Variant | null = null;
  private _product: Product | null = null;
  private _discounted: boolean = false;
  private _discountAmount: number = 0;

  constructor(cartItem?: CartItem) {
    super(
      cartItem?.userId ?? '',
      cartItem?.batchId ?? '',
      cartItem?.quantity ?? 0,
      cartItem?.id ?? ''
    );
  }

  public get href(): string {
    return this._href;
  }
  public set href(value: string) {
    this._href = value;
  }
  public get image(): string {
    return this._image;
  }
  public set image(value: string) {
    this._image = value;
  }
  public get batch(): Batch | null {
    return this._batch;
  }
  public set batch(value: Batch | null) {
    this._batch = value;
  }
  public get variant(): Variant | null {
    return this._variant;
  }
  public set variant(value: Variant | null) {
    this._variant = value;
  }
  public get product(): Product | null {
    return this._product;
  }
  public set product(value: Product | null) {
    this._product = value;
  }
  public get discounted(): boolean {
    return this._discounted;
  }

  public set discounted(value: boolean) {
    this._discounted = value;
  }

  public get discountAmount(): number {
    return this._discountAmount;
  }

  public set discountAmount(value: number) {
    this._discountAmount = value;
  }

  getRawItem() {
    return new CartItem(this.userId, this.batchId, this.quantity, this.id);
  }

  clone(): AssembledCartItem {
    const clonedItem = new AssembledCartItem();

    clonedItem.id = this.id;
    clonedItem.userId = this.userId;
    clonedItem.batchId = this.batchId;
    clonedItem.quantity = this.quantity;
    clonedItem.batch = this.batch ? { ...this.batch } : null;
    clonedItem.variant = this.variant ? { ...this.variant } : null;
    clonedItem.product = this.product ? { ...this.product } : null;
    clonedItem.discounted = this.discounted;
    clonedItem.discountAmount = this.discountAmount;

    return clonedItem;
  }
}
