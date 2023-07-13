// #endregion

import {
  BatchObject,
  BatchObjectWithDiscount,
  ProductObject,
  ProductTypeObject,
  ProductVariant,
} from '../models';

// #region Sort
export interface SortListItem {
  display: string;
  value: string;
}
export interface AssembledProduct extends ProductObject {
  type: ProductTypeObject;
  batches: BatchObjectWithDiscount[];
  totalSoldQuantity: number;
  href: string;
  hasDiscounted: boolean;
}

export interface ProductForProductsPage
  extends ProductObject,
    ProductVariant,
    BatchObject {
  discounted: boolean;
  discountPrice: number;
  image: string;
  href: string;
  totalSoldQuantity: number;
  typeName: string;
}
