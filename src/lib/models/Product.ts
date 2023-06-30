import BaseObject from './BaseObject';
import { ProductTypeObject } from './ProductType';

export type ProductVariant = {
  id: string;
  material: string;
  size: string;
  price: number;
  isActive: boolean;
};

export interface ProductObject extends BaseObject {
  id: string;
  productType_id: string;
  name: string;
  description: string;
  ingredients: string[];
  colors: string[];
  variants: ProductVariant[];
  howToUse: string;
  preservation: string;
  images: string[];
  isActive: boolean;
}

export function createProductObject(source: BaseObject): ProductObject {
  const convertedSourcee = { ...source } as ProductObject;

  const productObject: ProductObject = {
    id: convertedSourcee.id,
    productType_id: convertedSourcee.productType_id,
    colors: convertedSourcee.colors,
    description: convertedSourcee.description,
    howToUse: convertedSourcee.howToUse,
    images: convertedSourcee.images,
    isActive: convertedSourcee.isActive,
    ingredients: convertedSourcee.ingredients,
    name: convertedSourcee.name,
    preservation: convertedSourcee.preservation,
    variants: convertedSourcee.variants,
  };

  return productObject;
}
