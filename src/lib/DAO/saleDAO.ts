import { db } from '@/firebase/config';
import Sale, { saleConverter } from '@/models/sale';
import {
  CollectionReference,
  DocumentReference,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { COLLECTION_NAME } from '../constants';

export function getSalesRef(): CollectionReference<Sale> {
  return collection(db, COLLECTION_NAME.SALES).withConverter(saleConverter);
}

export function getSaleRefById(id: string): DocumentReference<Sale> {
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

export async function createSale(data: Omit<Sale, 'id'>) {
  return await addDoc(getSalesRef(), data);
}

export async function updateSale(id: string, data: Sale): Promise<void>;
export async function updateSale(
  docRef: DocumentReference<Sale>,
  data: Sale
): Promise<void>;
export async function updateSale(
  arg: string | DocumentReference<Sale>,
  data: Sale
): Promise<void> {
  if (typeof arg === 'string') {
    await updateDoc(getSaleRefById(arg), data);
  } else {
    await updateDoc(arg, data);
  }
}

export async function deleteSale(id: string): Promise<void>;
export async function deleteSale(
  docRef: DocumentReference<Sale>
): Promise<void>;
export async function deleteSale(arg: string | DocumentReference<Sale>) {
  if (typeof arg === 'string') {
    await deleteDoc(getSaleRefById(arg));
  } else {
    await deleteDoc(arg);
  }
}
