import { createContext } from 'react';
import { ManageState, crudTargets, ManageContextType } from '../localLib';
import { CollectionName } from '../models/utilities';

export const ManageContext = createContext<ManageContextType>(
  {} as ManageContextType,
);
