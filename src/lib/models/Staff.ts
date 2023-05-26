import { DocumentData } from 'firebase/firestore';

export interface StaffObject extends DocumentData {
  id: string;
  mail?: string;
  password?: string;
  birthday?: Date;
  tel?: string;
  image?: string;
  isActive?: boolean;
  role_id: string;
  addresses: string[];
}
