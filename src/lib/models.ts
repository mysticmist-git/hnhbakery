export type BaseObject = {
  id?: string;
};

export type ProductTypeObject = BaseObject & {
  name: string;
  description: string;
  image: string;
  isActive: boolean;
};

export type StorageProductTypeObject = ProductTypeObject & {
  productCount: number;
  imageURL: string;
};

export type ProductTypeWithCount = ProductTypeObject & {
  count: number;
};

export type ProductVariant = {
  id: string;
  material: string;
  size: string;
  price: number;
  isActive: boolean;
};

export type ProductObject = BaseObject & {
  id: string;
  productType_id: string;
  name: string;
  description: string;
  ingredients: string[];
  colors: string[];
  variants: ProductVariant[];
  howToUse: string;
  preservation: string;
  images: string[];
  isActive: boolean;
};

export type StorageProductObject = ProductObject & {
  imageUrls: PathWithUrl[];
};

export type BatchDiscount = {
  date: Date;
  percent: number;
};

export type BatchObject = BaseObject & {
  id: string;
  totalQuantity: number;
  soldQuantity: number;
  MFG: Date;
  EXP: Date;
  discount: BatchDiscount;
  variant_id: string;
  product_id: string;
};

export type BatchObjectWithDiscount = BatchObject & { discounted: boolean };

export type StorageBatchObject = BatchObject & {
  productType_id: string;
  material: string;
  size: string;
  price: number;
};

export type BillObject = BaseObject & {
  id?: string;
  paymentTime?: Date;
  originalPrice?: number;
  totalPrice?: number;
  note?: string;
  state?: 1 | 0 | -1;
  rating?: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  payment_id?: string;
  saleAmount?: number;
  sale_id: string;
  user_id?: string;
  created_at?: Date;
};

export type BillDetailObject = BaseObject & {
  id?: string;
  amount?: number;
  price?: number;
  discount?: number;
  discountPrice?: number;
  batch_id?: string;
  bill_id?: string;
};

export type DeliveryObject = BaseObject & {
  id?: string;
  name?: string;
  tel?: string;
  email?: string;
  address?: string;
  note?: string;
  date?: Date;
  time?: string;
  startAt?: Date;
  endAt?: Date;
  state?: 'fail' | 'success' | 'inProcress' | 'inTransit';
  cancelReason?: string;
  bill_id?: string;
};

export type FeedbackObject = BaseObject & {
  id: string;
  rating: number;
  comment: string;
  product_id: string;
  user_id: string;
};

export type PaymentObject = BaseObject & {
  id?: string;
  name?: string;
  image?: string;
  isActive?: boolean;
};

export type ReferenceObject = BaseObject & {
  id: string;
  name: string;
  values: any[];
};

export type Role = BaseObject & {
  id: string;
  name: string;
  isActive: true;
  right_Ids: string[];
};

export type SaleObject = BaseObject & {
  id: string;
  name: string;
  code: string;
  percent: number;
  maxSalePrice: number;
  description: string;
  start_at: Date;
  end_at: Date;
  image: string;
  isActive: boolean;
};

export type StaffObject = BaseObject & {
  id: string;
  mail?: string;
  password?: string;
  birthday?: Date;
  tel?: string;
  image?: string;
  isActive?: boolean;
  role_id: string;
  addresses: string[];
};

export type UserObject = BaseObject & {
  id?: string;
  mail?: string;
  password?: string;
  name?: string;
  birthday?: Date;
  tel?: string;
  image?: string;
  isActive?: boolean;
  role_id?: string;
  addresses?: string[];
  accountType?: 'google' | 'email_n_password';
};

export type Nameable = {
  name?: string;
};

export type IsActivable = {
  isActive?: boolean;
};

export type Identifiable = {
  id?: string;
};

export type Countable = {
  count?: number;
};

export type Contact = {
  name: string;
  email: string;
  phone?: string;
  title: string;
  content: string;
};

export type PathWithUrl = {
  path?: string;
  url: string;
};
export type CustomBill = BillObject & {
  customerName?: string;
  customerTel?: string;
  customerAddress?: string;
  deliveryPrice?: number;
  salePercent?: number;
};
export type AssembledBillDetail = BillDetailObject & {
  productName?: string;
  productTypeName?: string;
  material?: string;
  size?: string;
};
