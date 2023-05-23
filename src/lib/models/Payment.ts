import { DocumentData } from 'firebase/firestore';

export interface PaymentObject extends DocumentData {
  id?: string;
  name?: string;
  image?: string;
  isActive?: boolean;
}
