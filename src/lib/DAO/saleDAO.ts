import { db } from '@/firebase/config';
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
import { saleConverter } from '../models';

export function getSalesRef() {
  return collection(db, COLLECTION_NAME.SALES).withConverter(saleConverter);
}

export function getSaleRefById(id: string) {
  return doc(getSalesRef(), id);
}

export async function getSalesSnapshot() {
  return await getDocs(getSalesRef());
}

export async function getSales() {
  return (await getSalesSnapshot()).docs.map((doc) => doc.data());
}

export async function getSaleSnapshotById(id: string) {
  return await getDoc(getSaleRefById(id));
}

export async function getSaleById(id: string) {
  return (await getSaleSnapshotById(id)).data();
}

export async function createSale(data: any) {
  return await addDoc(getSalesRef(), data);
}

export async function updateSale(id: string, data: any) {
  await updateDoc(getSaleRefById(id), data);
}

export async function deleteSale(id: string) {
  await deleteDoc(getSaleRefById(id));
}
