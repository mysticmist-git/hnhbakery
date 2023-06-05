import BaseObject from './BaseObject';

export interface UserObject extends BaseObject {
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
