import { DocumentData } from 'firebase/firestore';

export interface BatchObject extends DocumentData {
  id: string;
  totalQuantity: number;
  soldQuantity: number;
  MFG: Date;
  EXP: Date;
  material: string;
  size: string;
  color: string;
  price: number;
  discount: { timeRemain: number; percent: number }[];
  product_id: string;
}

export default class Batch {
  id: string;
  totalQuantity: number;
  soldQuantity: number;
  MFG: Date;
  EXP: Date;
  material: string;
  size: string;
  color: string;
  price: number;
  discount: { timeRemain: number; percent: number }[];
  discountPrice: number;
  product_id: string;

  constructor(
    id: string,
    totalQuantity: number,
    soldQuantity: number,
    MFG: Date,
    EXP: Date,
    material: string,
    size: string,
    color: string,
    price: number,
    discount: { timeRemain: number; percent: number }[],
    discountPrice: number,
    product_id: string,
  ) {
    this.id = id;
    this.totalQuantity = totalQuantity;
    this.soldQuantity = soldQuantity;
    this.MFG = MFG;
    this.EXP = EXP;
    this.material = material;
    this.size = size;
    this.color = color;
    this.price = price;
    this.discount = discount;
    this.discountPrice = discountPrice;
    this.product_id = product_id;
  }

  static fromObject(batchObject: BatchObject): Batch {
    return new Batch(
      batchObject.id,
      batchObject.totalQuantity,
      batchObject.soldQuantity,
      batchObject.MFG,
      batchObject.EXP,
      batchObject.material,
      batchObject.size,
      batchObject.color,
      batchObject.price,
      batchObject.discount,
      batchObject.discountPrice,
      batchObject.product_id,
    );
  }
}
