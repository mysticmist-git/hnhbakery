import Bill, { BillTableRow, billConverter } from '@/models/bill';
import Branch from '@/models/branch';
import User from '@/models/user';
import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  Query,
  QueryConstraint,
  QuerySnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from 'firebase/firestore';
import { COLLECTION_NAME } from '../constants';
import { getAddress } from './addressDAO';
import { getBatchById } from './batchDAO';
import { getBillItems } from './billItemDAO';
import { getBranchById } from './branchDAO';
import { getDeliveryById } from './deliveryDAO';
import { DEFAULT_GROUP_ID, getGroups } from './groupDAO';
import { getPaymentMethodById } from './paymentMethodDAO';
import { getProduct } from './productDAO';
import { getProductTypeById } from './productTypeDAO';
import { getSaleById } from './saleDAO';
import { getUserByUid, getUserRef, getUsers } from './userDAO';
import { getVariant } from './variantDAO';
import Delivery from '@/models/delivery';
import Address from '@/models/address';
import { getBookingItemById } from './bookingItemDAO';
import { getCakeBaseById } from './cakeBaseDAO';
import ProductType from '@/models/productType';
import Product from '@/models/product';
import Variant from '@/models/variant';

export function getBillsRef(
  groupId: string,
  userId: string
): CollectionReference<Bill>;
export function getBillsRef(
  userRef: DocumentReference<User>
): CollectionReference<Bill>;
export function getBillsRef(
  arg1: string | DocumentReference<User>,
  userId?: string
): CollectionReference<Bill> {
  if (typeof arg1 === 'string') {
    const groupId = arg1;

    return collection(
      getUserRef(groupId, userId!),
      COLLECTION_NAME.BILLS
    ).withConverter(billConverter);
  } else {
    return collection(arg1, COLLECTION_NAME.BILLS).withConverter(billConverter);
  }
}

export function getBillsWithQuery(
  groupId: string,
  userId: string,
  ...queryConstraints: QueryConstraint[]
): Query<Bill>;
export function getBillsWithQuery(
  userRef: DocumentReference<User>,
  ...queryConstraints: QueryConstraint[]
): Query<Bill>;
export function getBillsWithQuery(
  billsRef: CollectionReference<Bill>,
  ...queryConstraints: QueryConstraint[]
): Query<Bill>;
export function getBillsWithQuery(
  arg1: string | DocumentReference<User> | CollectionReference<Bill>,
  arg2: string | QueryConstraint,
  ...queryConstraints: QueryConstraint[]
): Query<Bill> {
  if (typeof arg1 === 'string') {
    const groupId = arg1;
    const userId = arg2 as string;

    return query(getBillsRef(groupId, userId), ...queryConstraints);
  } else if (arg1 instanceof DocumentReference) {
    const userRef = arg1;

    return query(getBillsRef(userRef), ...queryConstraints);
  } else {
    const billsRef = arg1;

    return query(billsRef, ...queryConstraints);
  }
}

export function getBillRef(
  groupId: string,
  userId: string,
  id: string
): DocumentReference<Bill>;
export function getBillRef(
  userRef: DocumentReference<User>,
  id: string
): DocumentReference<Bill>;
export function getBillRef(
  billsRef: CollectionReference<Bill>,
  id: string
): DocumentReference<Bill>;
export function getBillRef(
  arg1: string | DocumentReference<User> | CollectionReference<Bill>,
  arg2: string,
  id?: string
): DocumentReference<Bill> {
  if (typeof arg1 === 'string') {
    const groupId = arg1;
    const userId = arg2;

    return doc(getBillsRef(groupId, userId), id).withConverter(billConverter);
  } else if (arg1 instanceof DocumentReference) {
    const userRef = arg1;

    return doc(userRef, id!).withConverter(billConverter);
  } else {
    const billsRef = arg1;

    return doc(billsRef, id).withConverter(billConverter);
  }
}

export async function getBillsSnapshot(
  groupId: string,
  userId: string
): Promise<QuerySnapshot<Bill>>;
export async function getBillsSnapshot(
  userRef: DocumentReference<User>
): Promise<QuerySnapshot<Bill>>;
export async function getBillsSnapshot(
  billsRef: CollectionReference<Bill>
): Promise<QuerySnapshot<Bill>>;
export async function getBillsSnapshot(
  arg1: string | DocumentReference<User> | CollectionReference<Bill>,
  userId?: string
): Promise<QuerySnapshot<Bill>> {
  if (typeof arg1 === 'string') {
    const groupId = arg1;

    return await getDocs(getBillsWithQuery(groupId, userId!));
  } else if (arg1 instanceof DocumentReference) {
    const userRef = arg1;

    return await getDocs(getBillsWithQuery(userRef));
  } else {
    return await getDocs(arg1.withConverter(billConverter));
  }
}

export async function getBills(
  groupId: string,
  userId: string
): Promise<Bill[]>;
export async function getBills(
  userRef: DocumentReference<User>
): Promise<Bill[]>;
export async function getBills(
  billsRef: CollectionReference<Bill>
): Promise<Bill[]>;
export async function getBills(
  billsSnapshot: QuerySnapshot<Bill>
): Promise<Bill[]>;
export async function getBills(
  arg1:
    | string
    | DocumentReference<User>
    | CollectionReference<Bill>
    | QuerySnapshot<Bill>,
  userId?: string
): Promise<Bill[]> {
  if (typeof arg1 === 'string') {
    const groupId = arg1;

    return (await getBillsSnapshot(groupId, userId!)).docs.map((doc) =>
      doc.data()
    );
  } else if (arg1 instanceof DocumentReference) {
    const userRef = arg1;

    return (await getBillsSnapshot(userRef)).docs.map((doc) => doc.data());
  } else if (arg1 instanceof CollectionReference) {
    return (await getDocs(arg1.withConverter(billConverter))).docs.map((doc) =>
      doc.data()
    );
  } else {
    return arg1.docs.map((doc) => doc.data());
  }
}

export async function getBillSnapshot(
  groupId: string,
  userId: string,
  id: string
): Promise<DocumentSnapshot<Bill>>;
export async function getBillSnapshot(
  userRef: DocumentReference<User>,
  id: string
): Promise<DocumentSnapshot<Bill>>;
export async function getBillSnapshot(
  billsRef: CollectionReference<Bill>,
  id: string
): Promise<DocumentSnapshot<Bill>>;
export async function getBillSnapshot(
  arg1: string | DocumentReference<User> | CollectionReference<Bill>,
  arg2: string,
  id?: string
): Promise<DocumentSnapshot<Bill>> {
  if (typeof arg1 === 'string') {
    const groupId = arg1;
    const userId = arg2;

    return await getDoc(getBillRef(groupId, userId, id!));
  } else if (arg1 instanceof DocumentReference) {
    const userRef = arg1;

    return await getDoc(getBillRef(userRef, id!));
  } else {
    const billsRef = arg1;

    return await getDoc(getBillRef(billsRef, id!));
  }
}

export async function getBill(
  groupId: string,
  userId: string,
  id: string
): Promise<Bill | undefined>;
export async function getBill(
  userRef: DocumentReference<User>,
  id: string
): Promise<Bill | undefined>;
export async function getBill(
  billsRef: CollectionReference<Bill>,
  id: string
): Promise<Bill | undefined>;
export async function getBill(
  arg1: string | DocumentReference<User> | CollectionReference<Bill>,
  arg2: string,

  id?: string
): Promise<Bill | undefined> {
  if (typeof arg1 === 'string') {
    const groupId = arg1;
    const userId = arg2;

    return (await getBillSnapshot(groupId, userId, id!)).data();
  } else if (arg1 instanceof DocumentReference) {
    const userRef = arg1;

    return (await getBillSnapshot(userRef, id!)).data();
  } else {
    const billsRef = arg1;

    return (await getDoc(getBillRef(billsRef, id!))).data();
  }
}

export async function createBill(
  groupId: string,
  userId: string,
  data: Omit<Bill, 'id'>
): Promise<DocumentReference<Bill>>;
export async function createBill(
  userRef: DocumentReference<User>,
  data: Omit<Bill, 'id'>
): Promise<DocumentReference<Bill>>;
export async function createBill(
  billsRef: CollectionReference<Bill>,
  data: Omit<Bill, 'id'>
): Promise<DocumentReference<Bill>>;
export async function createBill(
  arg1: string | DocumentReference<User> | CollectionReference<Bill>,
  arg2: Omit<Bill, 'id'> | string,
  data?: Omit<Bill, 'id'>
): Promise<DocumentReference<Bill>> {
  if (typeof arg1 === 'string') {
    const groupId = arg1;
    const userId = arg2 as string;

    return (await addDoc(getBillsRef(groupId, userId), data)).withConverter(
      billConverter
    );
  } else if (arg1 instanceof DocumentReference) {
    const userRef = arg1;

    return (await addDoc(getBillsRef(userRef), data)).withConverter(
      billConverter
    );
  } else {
    const billsRef = arg1;

    return (await addDoc(billsRef, data)).withConverter(billConverter);
  }
}

export async function updateBill(
  groupId: string,
  userId: string,
  id: string,
  data: Bill
): Promise<void>;
export async function updateBill(
  userRef: DocumentReference<User>,
  id: string,
  data: Bill
): Promise<void>;
export async function updateBill(
  billsRef: CollectionReference<Bill>,
  id: string,
  data: Bill
): Promise<void>;
export async function updateBill(
  billRef: DocumentReference<Bill>,
  data: Bill
): Promise<void>;
export async function updateBill(
  arg1:
    | string
    | DocumentReference<User>
    | CollectionReference<Bill>
    | DocumentReference<Bill>,
  arg2: string | Bill,
  arg3?: string | Bill,
  arg4?: Bill
): Promise<void> {
  if (typeof arg1 === 'string') {
    const groupId = arg1;
    const userId = arg2 as string;
    const id = arg3 as string;
    const data = arg4;

    await updateDoc(getBillRef(groupId, userId, id), data);
  } else if (arg1 instanceof DocumentReference && typeof arg2 === 'string') {
    const userRef = arg1 as DocumentReference<User>;
    const id = arg2 as string;
    const data = arg3 as Bill;

    await updateDoc(getBillRef(userRef, id), data);
  } else if (arg1 instanceof CollectionReference) {
    const billsRef = arg1 as CollectionReference<Bill>;
    const id = arg2 as string;
    const data = arg3 as Bill;

    await updateDoc(getBillRef(billsRef, id), data);
  } else {
    const billRef = arg1 as DocumentReference<Bill>;
    const data = arg2;

    await updateDoc(billRef, data);
  }
}

export async function updateBillField(
  groupId: string,
  userId: string,
  billId: string,
  updateData: Partial<{
    [key in keyof Bill]: Bill[keyof Bill];
  }>
) {
  await updateDoc(getBillRef(groupId, userId, billId), updateData);
}

export async function deleteBill(
  groupId: string,
  userId: string,
  id: string
): Promise<void>;
export async function deleteBill(
  userRef: DocumentReference<User>,
  id: string
): Promise<void>;
export async function deleteBill(
  billsRef: CollectionReference<Bill>,
  id: string
): Promise<void>;
export async function deleteBill(
  billRef: DocumentReference<Bill>
): Promise<void>;
export async function deleteBill(
  arg1:
    | string
    | DocumentReference<User>
    | CollectionReference<Bill>
    | DocumentReference<Bill>,
  arg2?: string,
  arg3?: string
): Promise<void> {
  if (typeof arg1 === 'string') {
    const groupId = arg1;
    const userId = arg2 as string;
    const id = arg3 as string;

    await deleteDoc(getBillRef(groupId, userId, id));
  } else if (arg1 instanceof DocumentReference && typeof arg2 === 'string') {
    const userRef = arg1 as DocumentReference<User>;
    const id = arg2 as string;

    await deleteDoc(getBillRef(userRef, id));
  } else if (arg1 instanceof CollectionReference) {
    const billsRef = arg1 as CollectionReference<Bill>;
    const id = arg2 as string;

    await deleteDoc(getBillRef(billsRef, id));
  } else {
    const billRef = arg1 as DocumentReference<Bill>;

    await deleteDoc(billRef);
  }
}

export async function getBillTableRows(
  branch?: Branch
): Promise<BillTableRow[]> {
  const finalBills: BillTableRow[] = [];
  const customers = await getUsers(DEFAULT_GROUP_ID);

  for (let c of customers) {
    const bills = branch
      ? (await getBills(c.group_id, c.id)).filter(
          (b) => b.branch_id == branch.id
        )
      : await getBills(c.group_id, c.id);

    for (let b of bills) {
      const pushData = await getBillTableRow(c, b);
      if (pushData) {
        finalBills.push(pushData);
      }
    }
  }

  return finalBills.sort((a, b) => {
    return a.created_at > b.created_at ? -1 : 1;
  });
}

async function getBillTableRow(c: User, b: Bill): Promise<BillTableRow> {
  let finalBill: BillTableRow | undefined = undefined;

  const billitems = await getBillItems(c.group_id, c.id, b.id);

  const billItems: BillTableRow['billItems'] = [];
  for (let bi of billitems) {
    const batch =
      bi.batch_id == '' ? undefined : await getBatchById(bi.batch_id);

    let productType: ProductType | undefined = undefined;
    let product: Product | undefined = undefined;
    let variant: Variant | undefined = undefined;

    if (
      batch &&
      batch.product_type_id != '' &&
      batch.product_id != '' &&
      batch.variant_id != ''
    ) {
      productType = await getProductTypeById(batch.product_type_id);
      product = await getProduct(batch.product_type_id, batch.product_id);
      variant = await getVariant(
        batch.product_type_id,
        batch.product_id,
        batch.variant_id
      );
    }

    billItems.push({
      ...bi,
      batch: batch,
      productType: productType,
      product: product,
      variant: variant,
    });
  }

  const sale = b.sale_id == '' ? undefined : await getSaleById(b.sale_id);

  let delivery: Delivery | undefined = undefined;
  if (b.delivery_id != '') {
    delivery = await getDeliveryById(b.delivery_id);
  }

  let address: Address | undefined = undefined;
  if (delivery?.address && delivery.address != '') {
    address = await getAddress(c.group_id, c.id, delivery.address);
  }

  const bookingItem =
    b.booking_item_id == ''
      ? undefined
      : await getBookingItemById(b.booking_item_id);

  finalBill = {
    ...b,
    paymentMethod:
      b.payment_method_id == ''
        ? undefined
        : await getPaymentMethodById(b.payment_method_id),
    customer: { ...c },
    sale: sale,
    deliveryTableRow: delivery
      ? {
          ...delivery,
          addressObject: address,
        }
      : undefined,
    billItems: billItems,
    branch: b.branch_id == '' ? undefined : await getBranchById(b.branch_id),
    bookingItem: bookingItem
      ? {
          ...bookingItem,
          cakeBase:
            bookingItem.cake_base_id == ''
              ? undefined
              : await getCakeBaseById(bookingItem.cake_base_id),
        }
      : undefined,
  };

  return finalBill;
}

export async function getBillTableRowsByUserId(
  userId: string
): Promise<BillTableRow[]> {
  if (userId == '') {
    return [];
  }
  const finalBills: BillTableRow[] = [];

  const customer = await getUserByUid(userId);

  if (!customer) {
    return [];
  }
  const bills = await getBills(customer.group_id, customer.id);

  for (let b of bills) {
    const pushData = await getBillTableRow(customer, b);
    if (pushData) {
      finalBills.push(pushData);
    }
  }

  return finalBills.sort((a, b) => {
    return a.created_at > b.created_at ? -1 : 1;
  });
}

export async function getBillTableRowById(
  userId: string,
  id: string
): Promise<BillTableRow | undefined> {
  if (userId == '') {
    return undefined;
  }

  const customer = await getUserByUid(userId);

  if (!customer) {
    return undefined;
  }

  const b = await getBill(customer.group_id, customer.id, id);

  if (!b) {
    return undefined;
  }

  const finalBill = await getBillTableRow(customer, b);

  return finalBill;
}

export function createBillDataFromBillTableRow(
  billTableRow: BillTableRow
): Bill {
  delete billTableRow.paymentMethod;
  delete billTableRow.customer;
  delete billTableRow.sale;
  delete billTableRow.deliveryTableRow;
  delete billTableRow.branch;
  delete billTableRow.bookingItem;
  delete billTableRow.billItems;
  return billTableRow as Bill;
}
