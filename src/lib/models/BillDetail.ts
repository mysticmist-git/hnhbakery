import BaseObject from './BaseObject';

export interface BillDetailObject extends BaseObject {
  id?: string;
  amount?: number;
  price?: number; // giá gốc của variant
  discount?: number; // 30% là percent
  discountPrice?: number; // = price * (1-discount/100)
  batch_id?: string;
  bill_id?: string;
}
