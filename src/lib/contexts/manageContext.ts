import { createContext } from 'react';
import { ManageContextType } from '../localLib';

export const ManageContext = createContext<ManageContextType>(
  {} as ManageContextType,
);
