import React, { createContext } from 'react';
import { DisplayCartItem } from './cartContext';

const initAppContext: AppContextType = {
  productBill: [],
  setProductBill: () => {},
};

export interface AppContextType {
  productBill: DisplayCartItem[];
  setProductBill: React.Dispatch<React.SetStateAction<DisplayCartItem[]>>;
}

export const AppContext = createContext<AppContextType>(initAppContext);
