import { DocumentData } from 'firebase/firestore';

export interface BillDetailObject extends DocumentData {
  id?: string;
  amount?: number;
  price?: number;
  discount?: number;
  discountPrice?: number;
  batch_id?: string;
  bill_id?: string;
}
