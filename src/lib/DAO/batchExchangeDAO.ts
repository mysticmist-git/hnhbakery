import { db } from '@/firebase/config';
import BatchExchange, { batchExchangeConverter } from '@/models/batchExchange';
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

export function getBatchExchangesRef() {
  return collection(db, COLLECTION_NAME.BATCH_EXCHANGES).withConverter(
    batchExchangeConverter
  );
}

export function getBatchExchangeRefById(id: string) {
  return doc(getBatchExchangesRef(), id).withConverter(batchExchangeConverter);
}

export function getBatchExchangesSnapshot() {
  return getDocs(getBatchExchangesRef());
}

export async function getBatchExchanges() {
  return (await getBatchExchangesSnapshot()).docs.map((doc) => doc.data());
}

export async function getBatchExchangesSnapshotById(id: string) {
  return await getDoc(getBatchExchangeRefById(id));
}

export async function getBatchExchangesById(id: string) {
  return (await getBatchExchangesSnapshotById(id)).data();
}

export async function createBatchExchange(
  batchExchange: Omit<BatchExchange, 'id'>
) {
  return await addDoc(getBatchExchangesRef(), batchExchange);
}

export async function updateBatchExchange(
  id: string,
  batchExchange: Omit<BatchExchange, 'id'>
) {
  await updateDoc(getBatchExchangeRefById(id), batchExchange);
}

export async function hardDeleteBatchExchange(id: string) {
  await deleteDoc(getBatchExchangeRefById(id));
}
