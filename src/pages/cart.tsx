import { createContext, memo } from 'react';

// #region Context
export interface CartContextType {}

const initProductDetailContext: CartContextType = {};

export const ProductDetailContext = createContext<CartContextType>(
  initProductDetailContext,
);
// #endregion

const Cart = () => {
  return <></>;
};

export default memo(Cart);
