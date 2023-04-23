/**
 * Document Object to represent data get from firestore
 */
export interface DocumentObj {
  id: string;
  [key: string]: any;
}

/**
 * Define a general interface for all collection object
 * Such as ProductTypeObjet
 */
export interface CollectionObj {
  collectionName: string;
  docs: DocumentObj[] | null;
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
}
