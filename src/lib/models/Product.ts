import BaseObject from './BaseObject';

export interface ProductObject extends BaseObject {
  id: string;
  productType_id: string;
  name: string;
  description: string;
  ingredients: string[];
  materials: string[];
  colors: string[];
  sizes: string[];
  howToUse: string;
  preservation: string;
  images: string[];
  isActive: boolean;
}
