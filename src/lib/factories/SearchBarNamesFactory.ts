import { BaseObject, ProductObject, ProductTypeObject } from '../models';

export interface SearchBarNamesFactory {
  generate(mainDocs: BaseObject[]): string[];
}

export class ProductTypeSearchBarNamesFactory implements SearchBarNamesFactory {
  generate(mainDocs: BaseObject[]): string[] {
    const productTypes = mainDocs as ProductTypeObject[];

    if (!productTypes) return [];

    return productTypes.map((productType) => productType.name);
  }
}

export class ProductSearchBarNamesFactory implements SearchBarNamesFactory {
  generate(mainDocs: BaseObject[]): string[] {
    const products = mainDocs as ProductObject[];

    if (!products) return [];

    return products.map((product) => product.name);
  }
}
