import { DocumentData } from 'firebase/firestore';

export interface BillObject extends DocumentData {
  id?: string;
  paymentTime?: Date;
  totalPrice?: number;
  noteDelivery?: string;
  noteCart?: string;
  state?: 1 | 0 | -1;
  rating?: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  payment_id?: string;
  sale_id: string;
  user_id?: string;
  created_at?: Date;
}
