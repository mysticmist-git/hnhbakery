import BaseObject from './BaseObject';

export interface SaleObject extends BaseObject {
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
