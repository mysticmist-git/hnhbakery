import BaseObject from './BaseObject';

export interface BatchObject extends BaseObject {
  id: string;
  totalQuantity: number;
  soldQuantity: number;
  MFG: Date;
  EXP: Date;
  material: string;
  size: string;
  price: number;
  discountDate: Date;
  discountPercent: number;
  product_id: string;
}
