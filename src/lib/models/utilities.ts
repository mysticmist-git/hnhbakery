import { DocumentData } from 'firebase/firestore';
import Batch from './Batch';
import Product from './Product';
import ProductType from './ProductType';

export type UnionType = Product | ProductType | Batch | null;

/**
 * Define a general interface for all collection object
 * Such as ProductTypeObjet
 */
export interface CollectionObj {
  collectionName: string;
  docs: DocumentData[];
}

export enum CollectionName {
  ProductTypes = 'productTypes',
  Brands = 'brands',
  Products = 'products',
  ProductDetails = 'productDetails',
  Feedbacks = 'feedbacks',
  Batches = 'batches',
  Branches = 'branches',
  BillDetails = 'billDetails',
  Deliveries = 'deliveries',
  Carts = 'carts',
  Bills = 'bills',
  Payments = 'payments',
  Sales = 'sales',
  References = 'references',
  Users = 'users',
  Staffs = 'staffs',
  Roles = 'roles',
  Right_Roles = 'right_Roles',
  Rights = 'rights',
  None = 'None',
}
