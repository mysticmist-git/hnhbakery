import { createContext } from 'react';
import { LOCAL_CART_KEY } from '../constants';
import { CartItem, CartItemAddingResult } from './productDetail';

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

export const saveCurrentProductBill = async (
  productBill: DisplayCartItem[]
): Promise<CartItemAddingResult> => {
  const data = getCurrentProductBills(productBill);

  const localResult = updateCartToLocal(data);

  if (!localResult.isSuccess) {
    return {
      isSuccess: false,
      msg: FAIL_SAVE_CART_MSG,
    };
  }

  const firestoreResult = updateCartToFirestore(data);

  if (!firestoreResult.isSuccess) {
    return {
      isSuccess: false,
      msg: FAIL_SAVE_CART_MSG,
    };
  }

  return {
    isSuccess: true,
    msg: SUCCESS_SAVE_CART_MSG,
  };
};

export const saveCart = async (
  productBill: DisplayCartItem[]
): Promise<CartItemAddingResult> => {
  const result = await saveCurrentProductBill(productBill);

  return result;
};

export const getCurrentProductBills = (
  productBill: DisplayCartItem[]
): CartItem[] => {
  const updatedCartItems: CartItem[] = productBill.map((item) => {
    return {
      id: item.id,
      userId: item.userId,
      productId: item.productId,
      batchId: item.batchId,
      href: item.href,
      quantity: item.quantity,
      price: item.price,
      discountPrice: item.discountPrice,
    };
  });

  return updatedCartItems;
};

export const updateCartToLocal = (
  cartItems: CartItem[]
): CartItemAddingResult => {
  const json = JSON.stringify(cartItems);

  try {
    localStorage.setItem(LOCAL_CART_KEY, json);

    return {
      isSuccess: true,
      msg: SUCCESS_SAVE_CART_MSG,
    };
  } catch (error) {
    console.log(error);
    return {
      isSuccess: false,
      msg: FAIL_SAVE_CART_MSG,
    };
  }
};

export const updateCartToFirestore = (
  cartItems: CartItem[]
): CartItemAddingResult => {
  return {
    isSuccess: true,
    msg: SUCCESS_SAVE_CART_MSG,
  };
};
