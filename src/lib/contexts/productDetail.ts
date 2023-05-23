import { createContext } from 'react';
import { BatchObject } from '../models/Batch';

export interface ProductDetail {
  id: string;
  name: string;
  type: string;
  state: boolean;
  description: string;
  ingredients: string[];
  howToUse: string;
  preservation: string;
  images: { src: string; alt: string }[];
  batches: BatchObject[];
}

const initProductDetailContext: ProductDetailContextType = {
  productDetail: {} as any,
  starState: {},
  setStarState: () => {},
  form: {},
  setForm: () => {},
};

export interface ProductDetailContextType {
  productDetail: ProductDetail;
  starState: any;
  setStarState: any;
  // TODO: make it strongly type
  form: any;
  setForm: any;
}

export const ProductDetailContext = createContext<ProductDetailContextType>(
  initProductDetailContext,
);

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  batchId: string;
  href: string;
  quantity: number;
  price: number;
  discountPrice?: number;
}

export interface CartItemAddingResult {
  isSuccess: boolean;
  msg: string;
}

export const SUCCESS_ADD_CART_MSG = 'Sản phẩm đã được thêm vào giỏ hàng.';
export const FAIL_ADD_CART_MSG = 'Thêm sản phẩm vào giỏ hàng thất bại.';
export const INVALID_DATA_MSG = 'Thông tin đặt hàng không hợp lệ';
