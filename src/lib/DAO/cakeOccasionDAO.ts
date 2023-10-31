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
import CakeOccasion, { cakeOccasionConverter } from '@/models/cakeOccasion';

export function getCakeOccasionsRef() {
  return collection(db, COLLECTION_NAME.CAKE_OCCASIONS).withConverter(
    cakeOccasionConverter
  );
}

export function getCakeOccasionRefById(id: string) {
  return doc(getCakeOccasionsRef(), id).withConverter(cakeOccasionConverter);
}

export async function getCakeOccasionsSnapshot() {
  return await getDocs(getCakeOccasionsRef());
}

export async function getCakeOccasionSnapshotById(id: string) {
  return await getDoc(getCakeOccasionRefById(id));
}

export async function getCakeOccasions() {
  return (await getCakeOccasionsSnapshot()).docs.map((doc) => doc.data());
}

export async function getCakeOccasionById(id: string) {
  return (await getCakeOccasionSnapshotById(id)).data();
}

export async function updateCakeOccasion(id: string, data: CakeOccasion) {
  await updateDoc(getCakeOccasionRefById(id), data);
}

export async function createCakeOccasion(data: Omit<CakeOccasion, 'id'>) {
  return await addDoc(getCakeOccasionsRef(), data);
}

export async function deleteCakeOccasion(id: string) {
  await deleteDoc(getCakeOccasionRefById(id));
}
