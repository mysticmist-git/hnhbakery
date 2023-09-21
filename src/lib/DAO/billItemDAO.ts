import BillItem, { billItemConverter } from '@/models/billItem';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { COLLECTION_NAME } from '../constants';
import { getBillRefById } from './billDAO';

export function getBillItemsRef(
  groupId: string,
  userId: string,
  billId: string
) {
  return collection(
    getBillRefById(groupId, userId, billId),
    COLLECTION_NAME.BILL_ITEMS
  ).withConverter(billItemConverter);
}

export function getBillItemRefById(
  groupId: string,
  userId: string,
  billId: string,
  id: string
) {
  return doc(getBillRefById(groupId, userId, billId), id);
}

export async function getBillItemsSnapshotByGroup(
  groupId: string,
  userId: string,
  billId: string
) {
  return await getDocs(getBillItemsRef(groupId, userId, billId));
}

export async function getBillItems(
  groupId: string,
  userId: string,
  billId: string
) {
  return (await getBillItemsSnapshotByGroup(groupId, userId, billId)).docs.map(
    (doc) => doc.data()
  );
}

export async function getBillItemSnapshotById(
  groupId: string,
  userId: string,
  billId: string,
  id: string
) {
  return getDoc(getBillItemRefById(groupId, userId, billId, id));
}

export async function getBillItemById(
  groupId: string,
  userId: string,
  billId: string,
  id: string
) {
  return (await getBillItemSnapshotById(groupId, userId, billId, id)).data();
}

export async function createBillItem(
  groupId: string,
  userId: string,
  billId: string,
  data: Omit<BillItem, 'id'>
) {
  const docRef = await addDoc(getBillItemsRef(groupId, userId, billId), data);
  return docRef;
}

export async function updateBillItem(
  groupId: string,
  userId: string,
  billId: string,
  id: string,
  data: BillItem
) {
  const docRef = getBillItemRefById(groupId, userId, billId, id);
  await updateDoc(docRef, data);
}

export async function deleteBillItem(
  groupId: string,
  userId: string,
  billId: string,
  id: string
) {
  const docRef = getBillItemRefById(groupId, userId, billId, id);
  await deleteDoc(docRef);
}
