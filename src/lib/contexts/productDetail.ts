import { createContext } from 'react';

const initProductDetailContext: ProductDetailContextType = {
  productState: {},
  sizeState: {},
  setSizeState: () => {},
  materialState: {},
  setMaterialState: () => {},
  priceState: {},
  setPriceState: () => {},
  starState: {},
  setStarState: () => {},
};

export interface ProductDetailContextType {
  productState: any;
  sizeState: any;
  setSizeState: any;
  materialState: any;
  setMaterialState: any;
  priceState: any;
  setPriceState: any;
  starState: any;
  setStarState: any;
}

export const ProductDetailContext = createContext<ProductDetailContextType>(
  initProductDetailContext,
);
