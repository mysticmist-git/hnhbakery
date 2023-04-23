export interface ProductObject {
  id: string;
  productType_id: string;
  name: string;
  description: string;
  ingredients: string[];
  howToUse: string;
  preservation: string;
  images: string[];
  colors: string[];
  sizes: string[];
  materials: string[];
  isActive: boolean;
}

export default class Product {
  id: string;
  productType_id: string;
  name: string;
  description: string;
  ingredients: string[];
  howToUse: string;
  preservation: string;
  images: string[];
  colors: string[];
  sizes: string[];
  materials: string[];
  isActive: boolean;

  constructor(
    id: string,
    productType_id: string,
    name: string,
    description: string,
    ingredients: string[],
    howToUse: string,
    preservation: string,
    images: string[],
    colors: string[],
    sizes: string[],
    materials: string[],
    isActive: boolean,
  ) {
    this.id = id;
    this.productType_id = productType_id;
    this.name = name;
    this.description = description;
    this.ingredients = ingredients;
    this.howToUse = howToUse;
    this.preservation = preservation;
    this.images = images;
    this.colors = colors;
    this.sizes = sizes;
    this.materials = materials;
    this.isActive = isActive;
  }

  static fromObject(productObject: ProductObject): Product {
    return new Product(
      productObject.id,
      productObject.productType_id,
      productObject.name,
      productObject.description,
      productObject.ingredients,
      productObject.howToUse,
      productObject.preservation,
      productObject.images,
      productObject.colors,
      productObject.sizes,
      productObject.materials,
      productObject.isActive,
    );
  }
}
