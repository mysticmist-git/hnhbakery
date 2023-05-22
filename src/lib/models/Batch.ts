import { DocumentData } from 'firebase/firestore';

export interface BatchObject extends DocumentData {
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
