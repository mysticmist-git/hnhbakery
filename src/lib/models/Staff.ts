import BaseObject from './BaseObject';

export interface StaffObject extends BaseObject {
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
