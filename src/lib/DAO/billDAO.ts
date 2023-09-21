import { billConverter } from '@/models/bill';
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
import { getUserRef } from './userDAO';

export function getBillsRef(groupId: string, userId: string) {
  const docRef = getUserRef(groupId, userId);

  return collection(docRef, COLLECTION_NAME.BILLS).withConverter(billConverter);
}

export function getBillRefById(groupId: string, userId: string, id: string) {
  return doc(getBillsRef(groupId, userId), id);
}

export async function getBillsSnapshot(groupId: string, userId: string) {
  return await getDocs(getBillsRef(groupId, userId));
}

export async function getBills(groupId: string, userId: string) {
  return (await getBillsSnapshot(groupId, userId)).docs.map((doc) =>
    doc.data()
  );
}

export async function getBillSnapshotById(
  groupId: string,
  userId: string,
  id: string
) {
  return getDoc(getBillRefById(groupId, userId, id));
}

export async function getBillById(groupId: string, userId: string, id: string) {
  return (await getBillSnapshotById(groupId, userId, id)).data();
}

export async function createBill(groupId: string, userId: string, data: any) {
  const docRef = await addDoc(getBillsRef(groupId, userId), data);

  return docRef;
}

export async function updateBill(
  groupId: string,
  userId: string,
  id: string,
  data: any
) {
  const docRef = getBillRefById(groupId, userId, id);

  await updateDoc(docRef, data);
}

export async function deleteBill(groupId: string, userId: string, id: string) {
  await deleteDoc(getBillRefById(groupId, userId, id));
}
