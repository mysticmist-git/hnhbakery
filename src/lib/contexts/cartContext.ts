import { createContext } from 'react';
import { CartItem } from './productDetail';

// #region Context
export interface CartContextType {
  productBill: DisplayCartItem[];
}

const initCartContext: CartContextType = {
  productBill: [],
};

export const CartContext = createContext<CartContextType>(initCartContext);
// #endregion

export interface DisplayCartItem extends CartItem {
  image: string;
  name: string;
  size: string;
  material: string;
  maxQuantity: number;
  price: number;
  discountPercent: number;
  discountPrice: number;
  discountDate: Date;
  MFG: Date;
  EXP: Date;
}

export const SUCCESS_SAVE_CART_MSG = 'Đã lưu cập nhật giỏ hàng';
export const FAIL_SAVE_CART_MSG = 'Cập nhật giỏ hàng thất bại';
