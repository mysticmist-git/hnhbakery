import { DocumentData } from 'firebase/firestore';

export interface SaleObject extends DocumentData {
  id: string;
  name: string;
  code: string;
  percent: number;
  maxSalePrice: number;
  description: string;
  start_at: Date;
  end_at: Date;
  image: string;
  isActive: boolean;
}
