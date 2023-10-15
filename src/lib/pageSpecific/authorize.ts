import Permission from '@/models/permission';
import { createContext } from 'react';

export interface AuthorizeContextType {
  permissions: Permission[];
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
