import BaseObject from './BaseObject';

export interface BillObject extends BaseObject {
  id?: string;
  paymentTime?: Date;
  originalPrice?: number;
  totalPrice?: number;
  note?: string;
  state?: 1 | 0 | -1;
  rating?: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  payment_id?: string;
  saleAmount?: number;
  sale_id: string;
  user_id?: string;
  created_at?: Date;
}
