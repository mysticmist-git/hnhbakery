import BaseObject from './BaseObject';

export interface PaymentObject extends BaseObject {
  id?: string;
  name?: string;
  image?: string;
  isActive?: boolean;
}
