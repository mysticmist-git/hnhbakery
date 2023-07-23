// #region Context

import { createContext } from 'react';
import { ProductTypeObject } from '../models';

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
  productTypes: ProductTypeObject[];
}

export const initHomeContext: HomeContextType = {
  carouselImages: [],
  productTypes: [],
};

export const HomeContext = createContext<HomeContextType>(initHomeContext);
// #endregion
