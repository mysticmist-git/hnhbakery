import React, { createContext } from 'react';
import { DisplayCartItem } from './cartContext';

export interface AppState {
  productBill: DisplayCartItem[];
  cartNote: string;
}

export enum AppDispatchAction {
  SET_PRODUCT_BILL = 'SET_PRODUCT_BILL',
  SET_CART_NOTE = 'SET_CART_NOTE',
}

export interface AppAction {
  type: AppDispatchAction;
  payload?: any;
}

export const initialState: AppState = {
  productBill: [],
  cartNote: '',
};

export const appReducer = (state: AppState, action: AppAction) => {
  switch (action.type) {
    case AppDispatchAction.SET_PRODUCT_BILL:
      return {
        ...state,
        productBill: action.payload,
      };
    case AppDispatchAction.SET_CART_NOTE:
      return {
        ...state,
        cartNote: action.payload,
      };
    default:
      return state;
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
