import BaseObject from './BaseObject';

export interface BillDetailObject extends BaseObject {
  id?: string;
  amount?: number;
  price?: number;
  discount?: number;
  discountPrice?: number;
  batch_id?: string;
  bill_id?: string;
}
