import { createContext } from 'react';
import { BatchObject, ProductObject } from '../models';
import { AssembledProduct, ProductForProductsPage } from '../types/products';

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
  ProductList: ProductForProductsPage[];
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
