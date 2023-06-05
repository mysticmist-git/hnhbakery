import BaseObject from './BaseObject';

export interface Role extends BaseObject {
  id: string;
  name: string;
  isActive: true;
  right_Ids: string[];
}
