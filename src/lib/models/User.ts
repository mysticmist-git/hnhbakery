import { DocumentData } from 'firebase/firestore';

export interface UserObject extends DocumentData {
  id?: string;
  mail?: string;
  password?: string;
  name?: string;
  birthday?: Date;
  tel?: string;
  image?: string;
  isActive?: boolean;
  role_id?: string;
  addresses?: string[];
  accountType?: 'google' | 'email_n_password';
}
