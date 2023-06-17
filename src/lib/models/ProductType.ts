import BaseObject from './BaseObject';

export interface ProductTypeObject extends BaseObject {
  name: string;
  description: string;
  image: string;
  isActive: boolean;
}

export function createProductTypeObject(source: BaseObject) {
  const convertedSourcee = source as ProductTypeObject;

  const productTypeObject: ProductTypeObject = {
    id: convertedSourcee.id,
    name: convertedSourcee.name,
    description: convertedSourcee.description,
    image: convertedSourcee.image,
    isActive: convertedSourcee.isActive,
  };

  return productTypeObject;
}
