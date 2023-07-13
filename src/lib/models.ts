export interface BaseObject {
  id?: string;
}

export interface ProductTypeObject extends BaseObject {
  name: string;
  description: string;
  image: string;
  isActive: boolean;
}

export interface StorageProductTypeObject extends ProductTypeObject {
  productCount: number;
  imageURL: string;
}

export interface ProductTypeWithCount extends ProductTypeObject {
  count: number;
}

export interface ProductVariant {
  id: string;
  material: string;
  size: string;
  price: number;
  isActive: boolean;
}

export interface ProductObject extends BaseObject {
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
}

export interface ProductObjectWithURLs extends ProductObject {
  imageUrls: PathWithUrl[];
}

export interface StorageProductObject extends ProductObject {
  imageUrls: PathWithUrl[];
}

export interface BatchDiscount {
  date: Date;
  percent: number;
}

export interface BatchObject extends BaseObject {
  id: string;
  totalQuantity: number;
  soldQuantity: number;
  MFG: Date;
  EXP: Date;
  discount: BatchDiscount;
  variant_id: string;
  product_id: string;
}

export interface BatchObjectWithDiscount extends BatchObject {
  discounted: boolean;
}

export interface BatchObjectWithPrice extends BatchObjectWithDiscount {
  price: number;
  discountAmount: number;
}

export interface StorageBatchObject extends BatchObject {
  productType_id: string;
  material: string;
  size: string;
  price: number;
}

export interface BillObject extends BaseObject {
  id?: string;
  paymentTime?: Date;
  originalPrice?: number;
  totalPrice?: number;
  note?: string;
  state?: 1 | 0 | -1;
  // rating?: 1 | 2 | 3 | 4 | 5;
  // comment?: string;
  payment_id?: string;
  saleAmount?: number;
  sale_id: string;
  user_id?: string;
  created_at?: Date;
}

export interface BillDetailObject extends BaseObject {
  id?: string;
  amount?: number;
  price?: number;
  discount?: number;
  discountAmount?: number;
  batch_id?: string;
  bill_id?: string;
}

export interface DeliveryObject extends BaseObject {
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
  shipperNote?: string;
  bill_id?: string;
}

export interface FeedbackObject extends BaseObject {
  id: string;
  rating: number;
  comment: string;
  product_id: string;
  user_id: string;
}

export interface PaymentObject extends BaseObject {
  id?: string;
  name?: string;
  image?: string;
  isActive?: boolean;
}

export interface ReferenceObject extends BaseObject {
  id: string;
  name: string;
  values: any[];
}

export interface Role extends BaseObject {
  id: string;
  name: string;
  isActive: true;
  right_Ids: string[];
}

export interface SaleObject extends BaseObject {
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
}

export interface StaffObject extends BaseObject {
  id: string;
  mail?: string;
  password?: string;
  birthday?: Date;
  tel?: string;
  image?: string;
  isActive?: boolean;
  role_id: string;
  addresses: string[];
}

export interface UserObject extends BaseObject {
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
}

export interface Nameable {
  name?: string;
}

export interface IsActivable {
  isActive?: boolean;
}

export interface Identifiable {
  id?: string;
}

export interface Countable {
  count?: number;
}

export interface Contact {
  name: string;
  email: string;
  phone?: string;
  title: string;
  content: string;
}

export interface PathWithUrl {
  path?: string;
  url: string;
}
export interface CustomBill extends BillObject {
  customerName?: string;
  customerTel?: string;
  customerAddress?: string;
  deliveryPrice?: number;
  salePercent?: number;
}
export interface AssembledBillDetail extends BillDetailObject {
  productName?: string;
  productTypeName?: string;
  material?: string;
  size?: string;
}

export interface SuperDetail_BillObject extends BillObject {
  paymentObject?: PaymentObject;
  userObject?: UserObject;
  saleObject?: SaleObject;
  deliveryObject?: DeliveryObject;
}
