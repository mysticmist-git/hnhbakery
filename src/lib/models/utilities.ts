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

export interface Nameable {
  name: string;
}

export interface IsActivable {
  isActive: boolean;
}
