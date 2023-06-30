import BaseObject from './BaseObject';

export interface ReferenceObject extends BaseObject {
  id: string;
  name: string;
  values: any[];
}
