// #region Context

import { createContext } from 'react';

export interface BestSellerItem {
  image: string;
  name: string;
  description: string;
  href: string;
}

export interface TypeCakeItem extends BestSellerItem {}

export interface CarouselImageItem {
  src: string;
  alt: string;
  href: string;
}

export interface HomeContextType {
  carouselImages: CarouselImageItem[];
  typeCake: TypeCakeItem[];
}

export const initHomeContext: HomeContextType = {
  carouselImages: [],
  typeCake: [],
};

export const HomeContext = createContext<HomeContextType>(initHomeContext);
// #endregion
