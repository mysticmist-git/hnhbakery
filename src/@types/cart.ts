import { BatchObject, ProductObject, ProductVariant } from '@/lib/models';
import { nanoid } from 'nanoid';

export class CartItem {
  private _id: string;
  private _userId: string;
  private _batchId: string;
  private _quantity: number;

  constructor(userId: string, batchId: string, quantity: number) {
    this._id = nanoid(4);
    this._userId = userId;
    this._batchId = batchId;
    this._quantity = quantity;
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get batchId(): string {
    return this._batchId;
  }

  get quantity(): number {
    return this._quantity;
  }

  set quantity(value: number) {
    this._quantity = value;
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
      cartItem?.quantity ?? 0
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
