import Permission from '@/models/permission';
import { createContext } from 'react';

export interface AuthorizeContextType {
  permissions: Permission[];
}

export const AuthorizeContext = createContext<AuthorizeContextType>({
  permissions: [],
});
