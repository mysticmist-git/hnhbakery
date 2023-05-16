import { DocumentData } from 'firebase/firestore';

export interface ProductTypeObject extends DocumentData {
  id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
}

export default class ProductType {
  id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;

  constructor(
    id: string,
    name: string,
    description: string,
    image: string,
    isActive: boolean,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.image = image;
    this.isActive = isActive;
  }

  static fromObject(productTypeObject: ProductTypeObject): ProductType {
    return new ProductType(
      productTypeObject.id,
      productTypeObject.name,
      productTypeObject.description,
      productTypeObject.image,
      productTypeObject.isActive,
    );
  }
}
