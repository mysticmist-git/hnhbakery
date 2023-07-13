import {
  BatchObject,
  ProductObject,
  ProductObjectWithURLs,
  ProductVariant,
} from '@/lib/models';
import { FromObjectable, Prototype } from '@/utils/prototype';
import { nanoid } from 'nanoid';

export class CartItem implements Prototype {
  private _id: string = '';
  private _userId: string = '';
  private _batchId: string = '';
  private _quantity: number = 0;

  constructor(userId: string, batchId: string, quantity: number, id?: string) {
    if (id) {
      this._id = id;
    } else {
      this._id = nanoid(4);
    }
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
  private _batch: BatchObject | null = null;
  private _variant: ProductVariant | null = null;
  private _product: ProductObject | null = null;
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
  public get batch(): BatchObject | null {
    return this._batch;
  }
  public set batch(value: BatchObject | null) {
    this._batch = value;
  }
  public get variant(): ProductVariant | null {
    return this._variant;
  }
  public set variant(value: ProductVariant | null) {
    this._variant = value;
  }
  public get product(): ProductObject | null {
    return this._product;
  }
  public set product(value: ProductObject | null) {
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
    return new CartItem(this.userId, this.batchId, this.quantity);
  }
}
