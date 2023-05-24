import { createContext } from 'react';

export interface ProductItem {
  id: string;
  image: string;
  name: string;
  price: number;
  colors: string[];
  sizes: string[];
  MFG: Date;
  description: string;
  totalSoldQuantity: number;
  productType_id: string;
  href: string;
}

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
  ProductList: ProductItem[];
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

export default ProductsContext;
