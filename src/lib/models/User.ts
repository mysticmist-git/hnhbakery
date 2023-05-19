import { DocumentData } from 'firebase/firestore';

export interface UserObject extends DocumentData {
  id: string;
  name?: string;
  birth?: Date;
  gender?: string;
  address?: string;
  email?: string;
  tel?: string;
  photoURL?: string;
}
