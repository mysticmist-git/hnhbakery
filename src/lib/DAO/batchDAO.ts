import { db } from '@/firebase/config';
import Batch, { batchConverter } from '@/models/batch';
import {
  DocumentReference,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { COLLECTION_NAME } from '../constants';
import Variant from '@/models/variant';
import { getVariantRef } from './variantDAO';

export function getBatchesRef() {
  return collection(db, COLLECTION_NAME.BATCHES).withConverter(batchConverter);
}

export function getBatchRefById(id: string) {
  return doc(db, COLLECTION_NAME.BATCHES, id).withConverter(batchConverter);
}

export async function getBatchesSnapshot() {
  return await getDocs(getBatchesRef());
}

export async function getBatches() {
  return (await getBatchesSnapshot()).docs.map((doc) => doc.data());
}

export async function getBatchSnapshotById(id: string) {
  return await getDoc(getBatchRefById(id));
}

export async function getBatchById(id: string) {
  return (await getBatchSnapshotById(id)).data();
}

export async function createBatch(data: Omit<Batch, 'id'>) {
  const docRef = await addDoc(getBatchesRef(), data);
  return docRef.id;
}

export async function updateBatch(id: string, data: Batch): Promise<void>;
export async function updateBatch(
  docRef: DocumentReference<Batch>,
  data: Batch
): Promise<void>;
export async function updateBatch(
  arg: string | DocumentReference<Batch>,
  data: Batch
): Promise<void> {
  if (typeof arg === 'string') {
    await updateDoc(getBatchRefById(arg), data);
  } else {
    await updateDoc(arg, data);
  }
}

export async function deleteBatch(id: string): Promise<void>;
export async function deleteBatch(
  docRef: DocumentReference<Batch>
): Promise<void>;
export async function deleteBatch(arg: string | DocumentReference<Batch>) {
  if (typeof arg === 'string') {
    await deleteDoc(getBatchRefById(arg));
  } else {
    await deleteDoc(arg);
  }
}
