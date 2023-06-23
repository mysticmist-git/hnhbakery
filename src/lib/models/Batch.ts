import BaseObject from './BaseObject';

export type BatchDiscount = {
  date: Date;
  percent: number;
};

export interface BatchObject extends BaseObject {
  id: string;
  totalQuantity: number;
  soldQuantity: number;
  MFG: Date;
  EXP: Date;
  discount: BatchDiscount;
  product_id: string;
}
