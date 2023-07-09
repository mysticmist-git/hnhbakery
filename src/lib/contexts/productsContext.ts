import { createContext } from 'react';
import { ProductObject, ProductTypeObject } from '../models';
import { BatchObject } from '../models/Batch';

export type ProductItem = ProductObject & {
  totalSoldQuantity: number;
};

export interface BoLocItem {
  heading: string;
  heading_value: string;
  children: {
    display: string;
    value: string;
    realValue?: string;
    color?: boolean;
    isChecked: boolean;
  }[];
}

export interface ProductsContextType {
  GroupBoLoc: BoLocItem[];
  handleCheckBox: any;
  View: 'grid' | 'list';
  handleSetViewState: any;
  SortList: any;
  handleSetSortList: any;
  ProductList: AssembledProduct[];
  searchText: string;
}

export const initProductsContext: ProductsContextType = {
  GroupBoLoc: [],
  View: 'grid',
  SortList: {},
  ProductList: [],

  handleCheckBox: () => {},
  handleSetViewState: () => {},
  handleSetSortList: () => {},

  searchText: '',
};

const ProductsContext = createContext<ProductsContextType>(initProductsContext);

export default ProductsContext; //#endregion

export type AssembledProduct = ProductObject & {
  type: ProductTypeObject;
  batches: BatchObject[];
  totalSoldQuantity: number;
  href: string;
};
