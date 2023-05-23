import { createContext } from 'react';

// #region Context
export interface PaymentContextType {
  productBill: any;
}

export const initPaymentContext: PaymentContextType = {
  productBill: [],
};

export const PaymentContext =
  createContext<PaymentContextType>(initPaymentContext);

// #endregion
