import BaseObject from './BaseObject';

export interface BillObject extends BaseObject {
  id?: string;
  paymentTime?: Date;
  originalPrice?: number;
  totalPrice?: number; // = ori - saleamount
  note?: string;
  state?: 1 | 0 | -1; // 1: đã thanh toán , 0: chưa thanh toán, -1:hủy
  payment_id?: string;
  saleAmount?: number;
  sale_id: string;
  user_id?: string;
  created_at?: Date;
}
