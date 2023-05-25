import React, { createContext } from 'react';
import { DisplayCartItem } from './cartContext';

export interface AppState {
  productBill: DisplayCartItem[];
  cartNote: string;
  userId: string;
  paymentId: string;
}

export enum AppDispatchAction {
  SET_PRODUCT_BILL = 'SET_PRODUCT_BILL',
  SET_CART_NOTE = 'SET_CART_NOTE',
  SET_USER_ID = 'SET_USER_ID',
  SET_PAYMENT_ID = 'SET_PAYMENT_ID',
}

export interface AppAction {
  type: AppDispatchAction;
  payload?: any;
}

export const initialState: AppState = {
  productBill: [],
  cartNote: '',
  userId: '',
  paymentId: '',
};

export const appReducer = (state: AppState, action: AppAction) => {
  switch (action.type) {
    case AppDispatchAction.SET_PRODUCT_BILL:
      return {
        ...state,
        productBill: action.payload,
      } as AppState;
    case AppDispatchAction.SET_CART_NOTE:
      return {
        ...state,
        cartNote: action.payload,
      } as AppState;
    case AppDispatchAction.SET_USER_ID:
      return {
        ...state,
        userId: action.payload,
      } as AppState;
    case AppDispatchAction.SET_PAYMENT_ID:
      return {
        ...state,
        paymentId: action.payload,
      } as AppState;
    default:
      return state as AppState;
  }
};

export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export const AppContext = createContext<AppContextType>({
  state: initialState,
  dispatch: () => null,
});
