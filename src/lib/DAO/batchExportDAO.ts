import { db } from '@/firebase/config';
import BatchExport, { batchExportConverter } from '@/models/batchExport';
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

export function getBatchExportsRef() {
  return collection(db, COLLECTION_NAME.BATCH_EXPORTS).withConverter(
    batchExportConverter
  );
}

export function getBatchExportRefById(id: string) {
  return doc(getBatchExportsRef(), id).withConverter(batchExportConverter);
}

export function getBatchExportsSnapshot() {
  return getDocs(getBatchExportsRef());
}

export async function getBatchExports() {
  return (await getBatchExportsSnapshot()).docs.map((doc) => doc.data());
}

export async function getBatchExportSnapshotById(id: string) {
  return await getDoc(getBatchExportRefById(id));
}

export async function getBatchExportById(id: string) {
  return (await getBatchExportSnapshotById(id)).data();
}

export async function createBatchExport(batchExport: Omit<BatchExport, 'id'>) {
  return await addDoc(getBatchExportsRef(), batchExport);
}

export async function updateBatchExport(
  id: string,
  batchExport: Omit<BatchExport, 'id'>
) {
  await updateDoc(getBatchExportRefById(id), batchExport);
}

export async function hardDeleteBatchExport(id: string) {
  await deleteDoc(getBatchExportRefById(id));
}
