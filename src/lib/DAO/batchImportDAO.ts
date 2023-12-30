import { db } from '@/firebase/config';
import BatchImport, { batchImportConverter } from '@/models/batchImport';
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

export function getBatchImportsRef() {
  return collection(db, COLLECTION_NAME.BATCH_IMPORTS).withConverter(
    batchImportConverter
  );
}

export function getBatchImportRefById(id: string) {
  return doc(getBatchImportsRef(), id).withConverter(batchImportConverter);
}

export function getBatchImportsSnapshot() {
  return getDocs(getBatchImportsRef());
}

export async function getBatchImports() {
  return (await getBatchImportsSnapshot()).docs.map((doc) => doc.data());
}

export async function getBatchImportSnapshotById(id: string) {
  return await getDoc(getBatchImportRefById(id));
}

export async function getBatchImportById(id: string) {
  return (await getBatchImportSnapshotById(id)).data();
}

export async function createBatchImport(batchImport: Omit<BatchImport, 'id'>) {
  return await addDoc(getBatchImportsRef(), batchImport);
}

export async function updateBatchImport(
  id: string,
  batchImport: Omit<BatchImport, 'id'>
) {
  await updateDoc(getBatchImportRefById(id), batchImport);
}

export async function hardDeleteBatchImport(id: string) {
  await deleteDoc(getBatchImportRefById(id));
}
