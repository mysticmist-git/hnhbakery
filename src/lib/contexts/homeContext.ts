// #region Context

import ProductType from '@/models/productType';
import { createContext } from 'react';

export interface HomeCardDisplayItem {
  id: string;
  image: string;
  name: string;
  description: string;
  href: string;
}

export interface CarouselImageItem {
  src: string;
  alt: string;
  href: string;
}

export interface HomeContextType {
  carouselImages: CarouselImageItem[];
  productTypes: ProductType[];
}

export const initHomeContext: HomeContextType = {
  carouselImages: [],
  productTypes: [],
};

export const HomeContext = createContext<HomeContextType>(initHomeContext);
// #endregion
