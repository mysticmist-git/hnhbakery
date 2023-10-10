import { db } from '@/firebase/config';
import Batch, { batchConverter } from '@/models/batch';
import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
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

export function getBatchesRef() {
  return collection(db, COLLECTION_NAME.BATCHES).withConverter(batchConverter);
}

export function getBatchesQuery(...queryConstraints: QueryConstraint[]) {
  return query(getBatchesRef(), ...queryConstraints).withConverter(
    batchConverter
  );
}

export function getBatchRefById(id: string) {
  return doc(getBatchesRef(), id).withConverter(batchConverter);
}

export function getBatchesSnapshot() {
  return getDocs(getBatchesRef());
}

export async function getBatches() {
  return (await getBatchesSnapshot()).docs.map((doc) => doc.data());
}

export async function getBatchesSnapshotWithQuery(
  ...queryConstraints: QueryConstraint[]
) {
  const batchesSnapshot = await getDocs(getBatchesQuery(...queryConstraints));

  return batchesSnapshot;
}

export async function getBatchesWithQuery(
  ...queryConstraints: QueryConstraint[]
) {
  return (await getBatchesSnapshotWithQuery(...queryConstraints)).docs.map(
    (doc) => doc.data()
  );
}

export async function getBatchSnapshotById(id: string) {
  return await getDoc(getBatchRefById(id));
}

export async function getBatchById(id: string) {
  return (await getBatchSnapshotById(id)).data();
}

export async function createBatch(batch: Omit<Batch, 'id'>) {
  return await addDoc(getBatchesRef(), batch);
}

export async function updateBatch(id: string, batch: Omit<Batch, 'id'>) {
  await updateDoc(getBatchRefById(id), batch);
}

export async function deleteBatch(id: string) {
  await deleteDoc(getBatchRefById(id));
}
