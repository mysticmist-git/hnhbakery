import { DocumentData } from 'firebase/firestore';

export interface DeliveryObject extends DocumentData {
  id?: string;
  name?: string;
  tel?: string;
  email?: string;
  address?: string;
  note?: string;
  date?: Date;
  time?: string;
  startAt?: Date;
  endAt?: Date;
  state?: 'fail' | 'success' | 'inProcress' | 'inTransit';
  cancelReason?: string;
  bill_id?: string;
}
