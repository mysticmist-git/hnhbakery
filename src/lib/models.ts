import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
  WithFieldValue,
} from 'firebase/firestore';

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
  paymentTime: Date;
  originalPrice: number;
  totalPrice: number;
  note: string;
  state: 1 | 0 | -1;
  // rating?: 1 | 2 | 3 | 4 | 5;
  // comment?: string;
  payment_id: string;
  saleAmount: number;
  sale_id: string;
  user_id: string;
  created_at: Date;
}

export interface BillDetailObject extends BaseObject {
  id?: string;
  amount: number;
  price: number;
  discount: number;
  discountAmount: number; // price*discount -> giá thiệt = price - discountAmount
  batch_id: string;
  bill_id: string;
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
  state?: 'cancel' | 'fail' | 'success' | 'inProcress' | 'inTransit';
  shipperNote?: string; // là cancel reason hồi xưa
  bill_id?: string;
}

export interface FeedbackObject extends BaseObject {
  id?: string;
  rating: number;
  comment: string;
  time?: Date;
  product_id: string;
  user_id: string;
}

export interface PaymentObject extends BaseObject {
  id?: string;
  name: string;
  image: string;
  isActive: boolean;
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
  id?: string;
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
  mail: string;
  name: string;
  birthday: Date;
  tel: string;
  image: string;
  isActive: boolean;
  role_id: string;
  addresses: string[];
  accountType: 'google' | 'email_n_password' | 'none';
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

export interface Contact extends BaseObject {
  name: string;
  email: string;
  phone?: string;
  title: string;
  content: string;
  isRead?: boolean;
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

export type AssembledBillDetail = BillDetailObject & {
  batchObject?: BatchObject;
  productObject?: ProductObject;
};

export interface SuperDetail_BillObject extends BillObject {
  paymentObject?: PaymentObject;
  userObject?: UserObject;
  saleObject?: SaleObject;
  deliveryObject?: DeliveryObject;
  billDetailObjects?: AssembledBillDetail[];
}

export interface SuperDetail_UserObject extends UserObject {
  billObjects?: SuperDetail_BillObject[];
  feedbackObjects?: FeedbackObject[];
}

export interface UserGroup extends BaseObject {
  id?: string;
  name: string;
  users: string[];
  permission: string[];
  isActive: boolean;
}

export interface PermissionObject extends BaseObject {
  id?: string;
  name: string;
  code: string;
  description: string;
  isActive: boolean;
}

export interface SuperDetail_ReportObject {
  products: ProductObject[];
  batches: BatchObject[];
  feedbacks: FeedbackObject[];
  billDetails: BillDetailObject[];
  deliveries: DeliveryObject[];
  bills: BillObject[];
  payments: PaymentObject[];
  sales: SaleObject[];
}

export type SanPhamDoanhThu = BatchObject & {
  revenue: number;
  percentage: number;
  productObject: ProductObject;
};

export interface SuperDetail_SaleObject extends SaleObject {
  numberOfUse?: number;
  totalSaleAmount?: number;
}

export interface SuperDetail_DeliveryObject extends DeliveryObject {
  billObject?: BillObject;
  billDetailObjects?: AssembledBillDetail[];
}

export interface SuperDetail_FeedbackObject extends FeedbackObject {
  productObject?: ProductObject;
  userObject?: UserObject;
}

//#region Converter

export const billConverter: FirestoreDataConverter<BillObject> = {
  toFirestore: function (bill: BillObject) {
    delete bill.id;
    return { ...bill };
  },

  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options: SnapshotOptions
  ) {
    const data = snapshot.data(options);
    return {
      ...data,
      id: snapshot.id,
      paymentTime:
        data.paymentTime instanceof Timestamp
          ? data.paymentTime.toDate()
          : data.paymentTime,
      created_at:
        data.created_at instanceof Timestamp
          ? data.created_at.toDate()
          : data.created_at,
    } as BillObject;
  },
};
export const feedbackConverter: FirestoreDataConverter<FeedbackObject> = {
  toFirestore: function (feedback: FeedbackObject) {
    delete feedback.id;
    return { ...feedback };
  },

  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<FeedbackObject>,
    options: SnapshotOptions
  ) {
    const data = snapshot.data(options)!;
    return {
      ...data,
      id: snapshot.id,
      time: data.time instanceof Timestamp ? data.time.toDate() : data.time,
    } as FeedbackObject;
  },
};
export const saleConverter: FirestoreDataConverter<SaleObject> = {
  toFirestore: function (sale: SaleObject) {
    delete sale.id;
    return { ...sale };
  },

  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<SaleObject>,
    options: SnapshotOptions
  ) {
    const data = snapshot.data(options)!;
    return {
      ...data,
      id: snapshot.id,
      start_at:
        data.start_at instanceof Timestamp
          ? data.start_at.toDate()
          : data.start_at,
      end_at:
        data.end_at instanceof Timestamp ? data.end_at.toDate() : data.end_at,
    } as SaleObject;
  },
};
export const userConverter: FirestoreDataConverter<UserObject> = {
  toFirestore: function (
    modelObject: WithFieldValue<UserObject>
  ): DocumentData {
    delete modelObject.id;

    return {
      ...modelObject,
    };
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): UserObject {
    const data = snapshot.data(options)!;

    return {
      ...data,
      id: snapshot.id,
      birthday:
        data.birthday instanceof Timestamp
          ? data.birthday.toDate()
          : data.birthday,
    } as UserObject;
  },
};
export const contactConverter: FirestoreDataConverter<Contact> = {
  toFirestore: function (contact: Contact) {
    delete contact.id;
    return { ...contact };
  },

  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<Contact>,
    options: SnapshotOptions
  ) {
    const data = snapshot.data(options)!;

    return {
      ...data,
      id: snapshot.id,
    };
  },
};
export const userGroupConverter: FirestoreDataConverter<UserGroup> = {
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options)!;

    return {
      ...data,
      id: snapshot.id,
    } as UserGroup;
  },

  toFirestore: (userGroup: UserGroup) => {
    const { id: string, ...data } = userGroup;

    return data;
  },
};
export const permissionConverter: FirestoreDataConverter<PermissionObject> = {
  toFirestore: function (
    modelObject: WithFieldValue<PermissionObject>
  ): DocumentData {
    delete modelObject.id;

    return {
      ...modelObject,
    };
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): PermissionObject {
    const data = snapshot.data(options)!;

    return {
      ...data,
      id: snapshot.id,
    } as PermissionObject;
  },
};

//#endregion
