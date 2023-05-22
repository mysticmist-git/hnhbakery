import { createContext } from 'react';

// #region Context
export interface CartContextType {
  productBill: DisplayCartItem[];
}

const initCartContext: CartContextType = {
  productBill: [],
};

export const CartContext = createContext<CartContextType>(initCartContext);
// #endregion

export interface DisplayCartItem {
  id: string;
  href: string;
  image: string;
  name: string;
  size: string;
  material: string;
  quantity: number;
  maxQuantity: number;
  price: number;
  discountPercent?: number;
  discountPrice?: number;
}

// 1,
// '/',
// Banh1.src,
// 'Hàng than',
// 'Nhỏ',
// 'Mứt dâu',
// 5,
// 10,
// 100000,
