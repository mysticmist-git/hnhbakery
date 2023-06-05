import BaseObject from './BaseObject';

export interface Reference extends BaseObject {
  id: string;
  name: string;
  values: any[];
}
