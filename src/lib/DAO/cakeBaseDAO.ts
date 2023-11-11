import { db } from '@/firebase/config';
import { COLLECTION_NAME } from '../constants';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import CakeBase, { cakeBaseConverter } from '@/models/cakeBase';

export function getCakeBasesRef() {
  return collection(db, COLLECTION_NAME.CAKE_BASES).withConverter(
    cakeBaseConverter
  );
}

export function getCakeBaseRefById(id: string) {
  return doc(getCakeBasesRef(), id).withConverter(cakeBaseConverter);
}

export async function getCakeBasesSnapshot() {
  return await getDocs(getCakeBasesRef());
}

export async function getCakeBaseSnapshotById(id: string) {
  return await getDoc(getCakeBaseRefById(id));
}

export async function getCakeBases() {
  return (await getCakeBasesSnapshot()).docs.map((doc) => doc.data());
}

export async function getCakeBaseById(id: string) {
  return (await getCakeBaseSnapshotById(id)).data();
}

export async function updateCakeBase(id: string, data: CakeBase) {
  await updateDoc(getCakeBaseRefById(id), data);
}

export async function createCakeBase(data: Omit<CakeBase, 'id'>) {
  return await addDoc(getCakeBasesRef(), data);
}

export async function deleteCakeBase(id: string) {
  await deleteDoc(getCakeBaseRefById(id));
}
