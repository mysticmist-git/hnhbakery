import Bill from '@/models/bill';
import BillItem, { billItemConverter } from '@/models/billItem';
import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { COLLECTION_NAME } from '../constants';
import { getBillRef } from './billDAO';
import { getUserRef } from './userDAO';

export function getBillItemsRef(
  groupId: string,
  userId: string,
  billId: string
): CollectionReference<BillItem>;
export function getBillItemsRef(
  billRef: DocumentReference<Bill>
): CollectionReference<BillItem>;
export function getBillItemsRef(
  arg1: string | DocumentReference<Bill>,
  arg2?: string,
  arg3?: string
): CollectionReference<BillItem> {
  if (typeof arg1 === 'string') {
    const groupId = arg1;
    const userId = arg2 as string;
    const billId = arg3 as string;

    return collection(
      getBillRef(groupId, userId, billId),
      COLLECTION_NAME.BILL_ITEMS
    ).withConverter(billItemConverter);
  } else {
    const billRef = arg1;

    return collection(billRef, COLLECTION_NAME.BILL_ITEMS).withConverter(
      billItemConverter
    );
  }
}

export function getBillItemRef(
  groupId: string,
  userId: string,
  billId: string,
  id: string
): DocumentReference<BillItem>;
export function getBillItemRef(
  billRef: DocumentReference<Bill>,
  id: string
): DocumentReference<BillItem>;
export function getBillItemRef(
  arg1: string | DocumentReference<Bill>,
  arg2: string,
  arg3?: string,
  arg4?: string
): DocumentReference<BillItem> {
  if (typeof arg1 === 'string') {
    const groupId = arg1;
    const userId = arg2;
    const billId = arg3 as string;
    const id = arg4 as string;

    return doc(getBillRef(groupId, userId, billId), id).withConverter(
      billItemConverter
    );
  } else {
    const billRef = arg1 as DocumentReference<Bill>;
    const id = arg2 as string;

    return doc(getBillItemsRef(billRef), id).withConverter(billItemConverter);
  }
}

export async function getBillItemsSnapshot(
  groupId: string,
  userId: string,
  billId: string
): Promise<QuerySnapshot<BillItem>>;
export async function getBillItemsSnapshot(
  billRef: DocumentReference<Bill>
): Promise<QuerySnapshot<BillItem>>;
export async function getBillItemsSnapshot(
  arg1: string | DocumentReference<Bill>,
  arg2?: string,
  arg3?: string
): Promise<QuerySnapshot<BillItem>> {
  if (typeof arg1 === 'string') {
    const groupId = arg1;
    const userId = arg2 as string;
    const billId = arg3 as string;

    return await getDocs(getBillItemsRef(groupId, userId, billId));
  } else {
    const billRef = arg1 as DocumentReference<Bill>;

    return await getDocs(getBillItemsRef(billRef));
  }
}

export async function getBillItems(
  groupId: string,
  userId: string,
  billId: string
): Promise<BillItem[]>;
export async function getBillItems(
  billRef: DocumentReference<Bill>
): Promise<BillItem[]>;
export async function getBillItems(
  arg1: string | DocumentReference<Bill>,
  arg2?: string,
  arg3?: string
): Promise<BillItem[]> {
  if (typeof arg1 === 'string') {
    const groupId = arg1;
    const userId = arg2 as string;
    const billId = arg3 as string;

    return (await getBillItemsSnapshot(groupId, userId, billId)).docs.map(
      (doc) => doc.data()
    );
  } else {
    const billRef = arg1 as DocumentReference<Bill>;

    return (await getBillItemsSnapshot(billRef)).docs.map((doc) => doc.data());
  }
}

export async function getBillItemSnapshot(
  groupId: string,
  userId: string,
  billId: string,
  id: string
): Promise<DocumentSnapshot<BillItem>>;
export async function getBillItemSnapshot(
  billRef: DocumentReference<Bill>,
  id: string
): Promise<DocumentSnapshot<BillItem>>;
export async function getBillItemSnapshot(
  arg1: string | DocumentReference<Bill>,
  arg2: string,
  arg3?: string,
  arg4?: string
): Promise<DocumentSnapshot<BillItem>> {
  if (typeof arg1 === 'string') {
    const groupId = arg1;
    const userId = arg2 as string;
    const billId = arg3 as string;
    const id = arg4 as string;

    return await getDoc(getBillItemRef(groupId, userId, billId, id));
  } else {
    const billRef = arg1 as DocumentReference<Bill>;
    const id = arg2 as string;

    return await getDoc(getBillItemRef(billRef, id));
  }
}

export async function getBillItem(
  groupId: string,
  userId: string,
  billId: string,
  id: string
): Promise<BillItem | undefined>;
export async function getBillItem(
  billRef: DocumentReference<Bill>,
  id: string
): Promise<BillItem | undefined>;
export async function getBillItem(
  arg1: string | DocumentReference<Bill>,
  arg2: string,
  arg3?: string,
  arg4?: string
): Promise<BillItem | undefined> {
  if (typeof arg1 === 'string') {
    const groupId = arg1;
    const userId = arg2 as string;
    const billId = arg3 as string;
    const id = arg4 as string;

    return (await getBillItemSnapshot(groupId, userId, billId, id)).data();
  } else {
    const billRef = arg1 as DocumentReference<Bill>;
    const id = arg2 as string;

    return (await getBillItemSnapshot(billRef, id)).data();
  }
}

export async function createBillItem(
  groupId: string,
  userId: string,
  billId: string,
  data: Omit<BillItem, 'id'>
): Promise<DocumentReference<BillItem>>;
export async function createBillItem(
  billRef: DocumentReference<Bill>,
  data: Omit<BillItem, 'id'>
): Promise<DocumentReference<BillItem>>;
export async function createBillItem(
  arg1: string | DocumentReference<Bill>,
  arg2: string | Omit<BillItem, 'id'>,
  arg3?: string,
  arg4?: Omit<BillItem, 'id'>
): Promise<DocumentReference<BillItem>> {
  if (typeof arg1 === 'string') {
    const groupId = arg1;
    const userId = arg2 as string;
    const billId = arg3 as string;
    const data = arg4 as Omit<BillItem, 'id'>;

    return (
      await addDoc(getBillItemsRef(groupId, userId, billId), data)
    ).withConverter(billItemConverter);
  } else {
    const billRef = arg1 as DocumentReference<Bill>;
    const data = arg2 as Omit<BillItem, 'id'>;

    return (await addDoc(getBillItemsRef(billRef), data)).withConverter(
      billItemConverter
    );
  }
}

export async function updateBillItem(
  groupId: string,
  userId: string,
  billId: string,
  id: string,
  data: BillItem
): Promise<void>;
export async function updateBillItem(
  billRef: DocumentReference<Bill>,
  id: string,
  data: BillItem
): Promise<void>;
export async function updateBillItem(
  billItemRef: DocumentReference<BillItem>,
  data: BillItem
): Promise<void>;
export async function updateBillItem(
  arg1: string | DocumentReference<Bill> | DocumentReference<BillItem>,
  arg2: string | BillItem,
  arg3?: string | BillItem,
  arg4?: string,
  arg5?: BillItem
): Promise<void> {
  if (typeof arg1 === 'string') {
    const groupId = arg1;
    const userId = arg2 as string;
    const billId = arg3 as string;
    const id = arg4 as string;
    const data = arg5 as BillItem;

    await updateDoc(getBillItemRef(groupId, userId, billId, id), data);
  } else if (arg1 instanceof DocumentReference && typeof arg2 === 'string') {
    const billRef = arg1 as DocumentReference<Bill>;
    const id = arg2 as string;
    const data = arg3 as BillItem;

    await updateDoc(getBillItemRef(billRef, id), data);
  } else {
    const billItemRef = arg1 as DocumentReference<BillItem>;
    const data = arg2 as BillItem;

    await updateDoc(billItemRef, data);
  }
}

export async function deleteBillItem(
  groupId: string,
  userId: string,
  billId: string,
  id: string
): Promise<void>;
export async function deleteBillItem(
  billRef: DocumentReference<Bill>,
  id: string
): Promise<void>;
export async function deleteBillItem(
  billItemRef: DocumentReference<BillItem>
): Promise<void>;
export async function deleteBillItem(
  arg1: string | DocumentReference<Bill> | DocumentReference<BillItem>,
  arg2?: string,
  arg3?: string,
  arg4?: string
) {
  if (typeof arg1 === 'string') {
    const groupId = arg1;
    const userId = arg2 as string;
    const billId = arg3 as string;
    const id = arg4 as string;

    await deleteDoc(getBillItemRef(groupId, userId, billId, id));
  } else if (arg1 instanceof DocumentReference && typeof arg2 === 'string') {
    const billRef = arg1 as DocumentReference<Bill>;
    const id = arg2 as string;

    await deleteDoc(getBillItemRef(billRef, id));
  } else {
    const billItemRef = arg1 as DocumentReference<BillItem>;

    await deleteDoc(billItemRef);
  }
}
