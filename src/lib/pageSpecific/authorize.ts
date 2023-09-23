import { createContext } from 'react';
import { PermissionObject } from '../models';

export interface AuthorizeContextType {
  permissions: PermissionObject[];
}

export const AuthorizeContext = createContext<AuthorizeContextType>({
  permissions: [],
});

export const permissionRouteMap = new Map([
  ['KHO', '/manager/storage'],
  ['PQ', '/manager/authorize'],
  ['ĐH', '/manager/orders'],
  ['KH', '/manager/customers'],
  ['BC', '/manager/reports'],
  ['GH', '/manager/deliveries'],
  ['LH', '/manager/contacts'],
  ['KM', '/manager/sales'],
  ['FB', '/manager/feedbacks'],
]);
