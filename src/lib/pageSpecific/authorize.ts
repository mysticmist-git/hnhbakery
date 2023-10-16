import { createContext } from 'react';
import { PermissionObject } from '../models';

export interface AuthorizeContextType {
  permissions: PermissionObject[];
}

export const AuthorizeContext = createContext<AuthorizeContextType>({
  permissions: [],
});
