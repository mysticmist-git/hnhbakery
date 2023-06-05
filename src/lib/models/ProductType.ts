import BaseObject from './BaseObject';

export interface ProductTypeObject extends BaseObject {
  id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
}
